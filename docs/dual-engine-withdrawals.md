# Corevia Network dual-engine withdrawals

## Objective

One member-facing withdrawal service supports two independent M-PESA payout rails:

- **Safaricom Daraja B2C** — direct customer payout.
- **Paystack Transfers** — Kenyan M-PESA mobile-money transfer.

Members do not select a provider and no admin approves individual payouts. The engines must never pay twice for one internal withdrawal.

## Account prerequisites

Paystack's Kenya M-PESA recipient type is `mobile_money` with bank code `MPESA`. Paystack Till payouts may use `mobile_money_business` / `MPTILL`, but Corevia's own account must be verified for this feature. Before Paystack is enabled, confirm Transfers access, KES settlement balance, transfer-fee schedule, and that the Dashboard's **Confirm transfers before sending** setting is disabled (or an approved automated URL-approval flow is configured). Required attestations include `COREVIA_PAYSTACK_WITHDRAWALS_ENABLED=true`, `COREVIA_PAYSTACK_NO_OTP_CONFIRMED=true`, and a positive `COREVIA_PAYSTACK_TRANSFER_FEE_BUFFER_KES`. These flags do not themselves prove provider approval.

Safaricom B2C requires completed B2C onboarding, bank mapping and settlement-option change, production credentials, approved shortcode/roles, and funded Utility-account float. The Daraja sandbox app is not a live payout account.

Production gates remain independent: `COREVIA_LIVE_WITHDRAWALS_APPROVED`, `COREVIA_TILL_FEE_TRANSFER_READY`, `COREVIA_PAYSTACK_LIVE_READY`, `COREVIA_PAYSTACK_FLOAT_READY`, `COREVIA_DARAJA_LIVE_READY`, and `COREVIA_DARAJA_FLOAT_READY`, plus `MPESA_ENV=production` for Daraja. Never enable these merely to make a deployment pass.

## Routing and duplicate-payment controls

1. The route performs provider preflight before the member wallet is debited.
2. Automatic fallback is currently **pre-debit only**. A recipient-creation, authentication, or balance-preflight failure can select the other configured provider.
3. Once a transfer request is sent, an accepted, pending, OTP, timeout, malformed, or otherwise ambiguous result is locked to that provider. Do not fail over or issue another provider request while the first result is inconclusive.
4. One member wallet debit and one internal withdrawal are created under a member-level transaction lock.
5. A provider-specific attempt row records the provider reference, attempt number, status, request context, response context, and terminal error/result.
6. Signed Paystack transfer webhooks and authenticated Daraja B2C callbacks settle only verified terminal outcomes. Duplicate callbacks use conditional state changes and idempotent ledger references.
7. Terminal failure restores the member wallet once and reverses the fee accrual. Success marks the wallet transaction complete. Daraja and Paystack float reservations are settled or released independently.

## Float and accounting

- `PayoutFloatAccount` is provider-specific. Daraja's existing `primary` account remains the Daraja Utility float; a separate `paystack` account is seeded for Paystack.
- Paystack available balance is refreshed from the provider before reservation. A database transaction reserves the payout principal plus a configured fee buffer before wallet debit, preventing concurrent withdrawals from reserving the same provider funds.
- Daraja production uses its own Utility-float reservation. The float migration must be applied only after Preview and Production database isolation is verified.
- The member receives the stated net payout. Provider fees are additional and must not silently reduce that amount.
- The 0.50% Corevia withdrawal fee is currently accrued in the company ledger. That ledger entry is **not** proof of money received by Till 6959300. A separately approved, idempotent, reconciled Till settlement mechanism is still a release blocker. The code has a hard-coded production lock that remains closed until this mechanism is implemented; setting an environment flag cannot bypass it. Paystack MPTILL support, minimum transfer amounts, fee aggregation, and the actual Corevia recipient must be confirmed before implementing/activating automatic fee transfers.

## Reconciliation

- The authenticated `/api/cron/withdrawal-reconciliation` job verifies up to 50 stale Paystack transfers and settles only verified terminal results.
- `CRON_SECRET` protects the job.
- The current Vercel cron schedule is daily. It is not instant reconciliation; five-minute polling requires a compatible Vercel plan or external scheduler.
- Daraja success/failure callbacks are processed, but automated querying of an unreturned/ambiguous Daraja transaction is not yet implemented. A timeout remains processing; it is never treated as a failure.
- There is no durable automatic retry queue for both-provider outages and no post-terminal-failure cross-provider failover yet. The current route returns before debit if no provider passes preflight. Once a provider request has been sent, it will not switch rails.

## Implementation status

Implemented on this feature branch:
- Daraja B2C and Paystack M-PESA initiation adapters.
- Pre-debit provider selection and fallback.
- Separate provider float accounts and atomic Paystack float reservation, with distinct success-settlement versus failure-release paths.
- Durable provider-attempt records and provider references.
- Signed Paystack transfer webhook settlement and authenticated Daraja callback settlement.
- Paystack verification/reconciliation cron.
- Protected `/api/internal/withdrawal-readiness` diagnostics for API connectivity, environment gates, provider float schema, and activation checks. It never initiates a payout and does not expose credentials.
- Member-facing status polling and strict live-readiness gates.

Still required before activation:
- Review and test the provider-attempt / float migrations against an isolated Preview database.
- Add an automated durable retry queue and safe, verified post-terminal failover state machine.
- Implement and verify the Corevia Till fee transfer/aggregation route, including provider fees and idempotent reconciliation.
- Add Daraja status reconciliation for ambiguous callbacks where Safaricom supports it.
- Run sandbox end-to-end tests for success, failure, duplicate/delayed callbacks, timeout after provider acceptance, reversal, concurrency, low balance, and recovery.
- Verify both providers' live onboarding, permissions, no-manual-OTP flow, webhook URLs, and actual funded balances.

## Safety rule

A provider acknowledgement is not proof of payment. A timeout is not proof that no payment occurred. An internal fee ledger entry is not proof that the Corevia Till received funds. Only a verified terminal provider result can settle a member payout.
