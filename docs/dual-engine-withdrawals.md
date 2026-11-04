# Corevia Network dual-engine withdrawals

## Objective

Keep one member-facing withdrawal service while supporting two independent payout rails:

- **Safaricom Daraja B2C** — direct M-PESA customer payout.
- **Paystack Transfers** — M-PESA customer-wallet transfer using a Kenyan `MPESA` mobile-money recipient.

A provider outage must not stop the whole withdrawal service when the other provider is enabled, funded, and healthy. The system is provider-neutral; members do not choose providers and no Corevia admin approves individual payouts.

## Important account prerequisites

Paystack documents Kenya mobile-money transfers to M-PESA customers, and Kenya business mobile-money recipients use `MPESA`. Paystack also documents business mobile-money recipients for Till numbers using `MPTILL`. These capabilities are not proof that Corevia's own Paystack integration has Transfers enabled. Before enabling Paystack payouts, verify that the Corevia account is a registered business, Transfers are enabled, the Paystack balance is available, and the account's approval configuration permits fully automated transfers without manual OTP.

Safaricom B2C remains subject to Safaricom's B2C account onboarding, bank mapping, settlement-option change, production credentials, and available Utility-account float.

## Routing policy

1. Select an enabled, healthy provider using configured priority and a short-lived health state.
2. Before a provider accepts a payout, a definitive pre-submission failure (for example, missing credentials or failed authentication before sending a payment request) may allow the other provider to be selected.
3. A provider's accepted, pending, OTP, or otherwise ambiguous response locks the withdrawal to that provider. Never submit the same withdrawal to the other provider while the first result is inconclusive.
4. A provider may be failed over only after a definitive, verified terminal failure/reversal, and only after confirming the first provider cannot still pay. Reuse one internal withdrawal reference and record every provider attempt.
5. If both engines are unavailable, keep the member's funds reserved and the withdrawal queued. Retry automatically with bounded backoff and provider health checks. Do not debit again.
6. A success webhook/verified terminal success from either provider settles the withdrawal exactly once. Duplicate and out-of-order callbacks are idempotent.
7. A terminal failure/reversal releases the applicable provider float reservation and restores the member's wallet exactly once. An unknown/pending outcome stays in reconciliation and must not trigger a second payout.

## Ledger and float separation

- Member wallet debit is made once per internal withdrawal.
- Provider payout float/balance is tracked separately per provider. Daraja Utility float and Paystack available balance are not interchangeable.
- Corevia's 0.50% fee is a separate company ledger accrual. Where approved, Paystack can be evaluated for a separate `MPTILL` transfer to Till 6959300; that fee transfer must have its own reference, webhook/reconciliation, and idempotency key. Never treat a ledger entry as proof the Till received funds.
- Provider charges are recorded separately and must not silently reduce the member's promised net payout or Corevia fee.

## Required implementation before activation

- Add provider-neutral payout-attempt records with unique provider references and immutable request/response audit data.
- Add per-provider float/balance reservation and reconciliation.
- Add Paystack transfer-recipient creation for `MPESA`, transfer initiation, verify-transfer support, and signed webhook handling for `transfer.success`, `transfer.failed`, and `transfer.reversed`.
- Extend the existing Paystack webhook without disrupting `charge.success` handling for membership and Academy payments.
- Generalize withdrawal settlement so Daraja receipts and Paystack transfer references can each be validated without pretending one provider's receipt is the other's.
- Add a durable queue/outbox and automated retry worker. Never retry or fail over on an ambiguous status.
- Add provider readiness flags, health checks, rate limits, and circuit breakers. All live payout flags remain off until both providers' production eligibility, funding, webhook, and compliance requirements are confirmed.
- Test both providers in isolated test environments, including duplicate callbacks, delayed callbacks, timeout after provider acceptance, confirmed failure, reversal, provider outage, insufficient provider balance, and recovery.

## Current repository state

The existing withdrawal route is Daraja-specific. The existing Paystack webhook currently handles membership and Academy `charge.success` events only. The schema currently has a single shared payout-float account, so provider-specific attempts and balances must be added before safe automatic failover is enabled.

## Safety rule

A queued withdrawal is not a failed withdrawal. A provider acknowledgement is not proof of payment. A timeout is not proof that no payment occurred. Only a provider's verified terminal success marks the withdrawal paid.
