import test from "node:test";
import assert from "node:assert/strict";
import { applyPaystackTransferOutcome } from "../lib/paystack-transfer-settlement.ts";

function createTransaction(initialStatus) {
  const state = { status: initialStatus, walletBalance: 0, walletTransactionStatus: "PENDING", ledger: [], tillSettlements: [] };
  const tx = {
    withdrawal: {
      findUnique: async () => ({ status: state.status }),
      updateMany: async ({ where, data }) => {
        const allowed = where.status?.in ?? [where.status];
        if (!allowed.includes(state.status)) return { count: 0 };
        state.status = data.status;
        return { count: 1 };
      },
    },
    walletTransaction: {
      updateMany: async ({ where, data }) => {
        const allowed = where.status?.in ?? [where.status];
        if (allowed.includes(state.walletTransactionStatus)) {
          state.walletTransactionStatus = data.status;
          return { count: 1 };
        }
        return { count: 0 };
      },
    },
    wallet: {
      update: async ({ data }) => { state.walletBalance += data.balance.increment; },
    },
    ledgerEntry: {
      findUnique: async ({ where }) => where.reference === `${withdrawal.reference}-fee-corevia`
        ? { id: "fee-ledger-1", amount: 5 }
        : null,
      create: async ({ data }) => { state.ledger.push(data); },
    },
    coreviaTillSettlement: {
      upsert: async ({ create }) => { state.tillSettlements.push({ ...create, status: "PENDING" }); },
      findUnique: async ({ where }) => state.tillSettlements.find((item) =>
        item.ledgerEntryId === where.ledgerEntryId
      ) ?? null,
      updateMany: async ({ where, data }) => {
        const item = state.tillSettlements.find((entry) => entry.id === where.id);
        if (!item || item.status !== where.status) return { count: 0 };
        Object.assign(item, data);
        return { count: 1 };
      },
    },
  };
  return { tx, state };
}

const withdrawal = { id: "w1", userId: "u1", amount: 1000, fee: 5, reference: "withdrawal-1" };

test("successful provider settlement marks payout paid without refund", async () => {
  const { tx, state } = createTransaction("PROCESSING");
  const result = await applyPaystackTransferOutcome(tx, withdrawal, "success", "tr_1");
  assert.equal(result.outcome, "success");
  assert.equal(state.status, "PAID");
  assert.equal(state.walletTransactionStatus, "COMPLETED");
  assert.equal(state.walletBalance, 0);
  assert.equal(state.ledger.length, 0);
  assert.equal(state.tillSettlements.length, 1);
  assert.equal(state.tillSettlements[0].amount, 5);
  assert.equal(state.tillSettlements[0].reference, "cvt-withdrawal-fee-withdrawal-1");
  assert.equal(state.tillSettlements[0].status, "PENDING");
});

test("failed transfer refunds member and reverses Corevia fee once", async () => {
  const { tx, state } = createTransaction("PROCESSING");
  const result = await applyPaystackTransferOutcome(tx, withdrawal, "failed");
  assert.equal(result.outcome, "failed");
  assert.equal(state.status, "FAILED");
  assert.equal(state.walletBalance, 1000);
  assert.equal(state.walletTransactionStatus, "FAILED");
  assert.deepEqual(state.ledger.map((entry) => entry.amount), [1000, -5]);
  assert.equal(state.tillSettlements.length, 0);
});

test("late reversal of a paid transfer refunds member and reverses fee", async () => {
  const { tx, state } = createTransaction("PAID");
  state.walletTransactionStatus = "COMPLETED";
  const result = await applyPaystackTransferOutcome(tx, withdrawal, "reversed");
  assert.equal(result.outcome, "reversed");
  assert.equal(state.status, "FAILED");
  assert.equal(state.walletBalance, 1000);
  assert.equal(state.walletTransactionStatus, "REVERSED");
  assert.deepEqual(state.ledger.map((entry) => entry.amount), [1000, -5]);
});


test("late member payout reversal cancels an unsubmitted company Till fee", async () => {
  const { tx, state } = createTransaction("PAID");
  state.walletTransactionStatus = "COMPLETED";
  state.tillSettlements.push({
    id: "till-1",
    ledgerEntryId: "fee-ledger-1",
    amount: 5,
    reference: "cvt-withdrawal-fee-withdrawal-1",
    status: "PENDING",
  });
  const result = await applyPaystackTransferOutcome(tx, withdrawal, "reversed");
  assert.equal(result.outcome, "reversed");
  assert.equal(state.tillSettlements[0].status, "REVERSED");
  assert.match(state.tillSettlements[0].lastError, /reversed before company Till remittance/i);
});

test("late member payout reversal blocks an already submitted company Till fee for review", async () => {
  const { tx, state } = createTransaction("PAID");
  state.walletTransactionStatus = "COMPLETED";
  state.tillSettlements.push({
    id: "till-2",
    ledgerEntryId: "fee-ledger-1",
    amount: 5,
    reference: "cvt-withdrawal-fee-withdrawal-1",
    status: "PROCESSING",
  });
  const result = await applyPaystackTransferOutcome(tx, withdrawal, "reversed");
  assert.equal(result.outcome, "reversed");
  assert.equal(state.tillSettlements[0].status, "REVIEW");
  assert.match(state.tillSettlements[0].lastError, /manual reconciliation required/i);
});

test("duplicate late reversal cannot issue a second refund", async () => {
  const { tx, state } = createTransaction("FAILED");
  state.walletTransactionStatus = "REVERSED";
  const result = await applyPaystackTransferOutcome(tx, withdrawal, "reversed");
  assert.equal(result.outcome, "already_settled");
  assert.equal(state.walletBalance, 0);
  assert.equal(state.ledger.length, 0);
});
