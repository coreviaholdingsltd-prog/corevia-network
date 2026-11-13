import test from "node:test";
import assert from "node:assert/strict";
import { applyPaystackTransferOutcome } from "../lib/paystack-transfer-settlement.ts";

function createTransaction(initialStatus) {
  const state = { status: initialStatus, walletBalance: 0, walletTransactionStatus: "PENDING", ledger: [] };
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
      create: async ({ data }) => { state.ledger.push(data); },
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
});

test("failed transfer refunds member and reverses Corevia fee once", async () => {
  const { tx, state } = createTransaction("PROCESSING");
  const result = await applyPaystackTransferOutcome(tx, withdrawal, "failed");
  assert.equal(result.outcome, "failed");
  assert.equal(state.status, "FAILED");
  assert.equal(state.walletBalance, 1000);
  assert.equal(state.walletTransactionStatus, "FAILED");
  assert.deepEqual(state.ledger.map((entry) => entry.amount), [1000, -5]);
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

test("duplicate late reversal cannot issue a second refund", async () => {
  const { tx, state } = createTransaction("FAILED");
  state.walletTransactionStatus = "REVERSED";
  const result = await applyPaystackTransferOutcome(tx, withdrawal, "reversed");
  assert.equal(result.outcome, "already_settled");
  assert.equal(state.walletBalance, 0);
  assert.equal(state.ledger.length, 0);
});
