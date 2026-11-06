# Corevia Network — Paystack-only withdrawals

## Provider policy

Paystack Transfers is the only provider permitted to initiate new member withdrawals. Safaricom Daraja B2C has been retired as a payout engine. There is no provider selection, fallback, or automatic failover to Safaricom.

If Paystack is unavailable, cannot validate the recipient, is OTP-gated, has insufficient available funds, or returns an ambiguous result, the system does not switch providers. Before a payout is submitted, a definitive preflight failure leaves the member wallet untouched. After a transfer may have been accepted, the withdrawal remains locked in PROCESSING until a signed Paystack terminal webhook or independent transfer verification confirms the outcome. No blind retry, duplicate transfer, premature refund, or manual payout override is permitted.

## Readiness gates

The withdrawal route requires:

- `COREVIA_WITHDRAWALS_ENABLED=true`
- `COREVIA_PAYSTACK_WITHDRAWALS_ENABLED=true`
- `COREVIA_PAYSTACK_NO_OTP_CONFIRMED=true`
- For production: `COREVIA_LIVE_WITHDRAWALS_APPROVED=true`, `COREVIA_PAYSTACK_LIVE_READY=true`, `COREVIA_PAYSTACK_FLOAT_READY=true`, and `COREVIA_PAYSTACK_MANUAL_PAYOUTS_CONFIRMED=true`.

These flags are explicit gates, not substitutes for provider evidence. Keep global withdrawals disabled until Paystack has confirmed the live M-PESA Transfers route and the current KES balance has been reconciled against all member wallet liabilities, unresolved deposits, in-flight payouts and transfer-fee reserve.

## Funds and ledger separation

- Paystack is the sole custodian of member wallet funds and the sole payout rail.
- Member wallet balances are client liabilities, not Corevia revenue.
- Corevia's 0.50% withdrawal fee is accrued separately to the company ledger. A ledger accrual is not proof that a Till transfer settled.
- Never sweep client principal to Corevia Till 6959300.
- Revenue transfers to Corevia Till must use their own references, idempotency controls, provider confirmation and reconciliation.
- Paystack's available balance must cover all member claims, unresolved deposits, in-flight withdrawals and the required provider-fee buffer before a new withdrawal is authorized.

## Legacy Safaricom callback compatibility

The Daraja B2C submission client and all new Safaricom routing have been removed. The legacy result and timeout callback endpoints plus their settlement helper are temporarily retained only to safely settle any historical Daraja withdrawals that were already in flight before retirement. They cannot initiate a payout. Keep the callback authentication token until all historical Daraja withdrawals are confirmed terminal; then remove the legacy callback endpoints, helper, schema fields and related environment variables in a separate migration after database verification.

## Settlement rules

- One internal withdrawal reference and one wallet debit per request.
- A signed Paystack terminal webhook or independent verified terminal result is the settlement authority.
- Duplicate and out-of-order provider events must be idempotent.
- Confirmed failure restores the member debit and reverses the fee exactly once.
- Unknown, pending or timed-out outcomes remain reserved for reconciliation.
- Never submit a second transfer while the first outcome is ambiguous.
