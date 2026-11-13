# Corevia Till settlement operations

## Current safety posture

The Till settlement worker is disabled unless `COREVIA_TILL_SETTLEMENT_ENABLED=true`.
Do not enable it until the production migration is applied, the Paystack business Till
recipient is independently verified, the fee reserve is confirmed, and the float is
sufficient. Member withdrawal switches are separate and must remain governed by the
existing payout lifecycle guard.

The worker submits at most one queued company settlement per run. It never retries a
`PROCESSING` transfer blindly: it verifies the original Paystack reference first.
Ambiguous responses remain reserved for reconciliation. A mismatch or definite provider
rejection moves the item to `REVIEW`, not back to the automatic queue.

## Required production environment

- `PAYSTACK_SECRET_KEY`: production secret, managed only in Vercel environment settings.
- `CRON_SECRET`: existing Vercel cron bearer secret.
- `COREVIA_TILL_SETTLEMENT_ENABLED`: leave unset/false until release approval.
- `COREVIA_PAYSTACK_TILL_RECIPIENT_CODE`: Paystack recipient code created for the verified Corevia business Till 6959300 using the Kenyan MPTILL business-recipient flow.
- `COREVIA_TILL_TRANSFER_FEE_RESERVE_KSH`: positive KES reserve covering provider charges for all transfers the worker is permitted to make. Set from the current Paystack fee schedule; do not guess this value.

Do not store raw API keys or recipient credentials in source control or chat.

## Operational checks before enabling

1. Apply migration `20261113100000_add_corevia_till_settlement` to the production Neon database and verify it is recorded in `_prisma_migrations`.
2. In Paystack Dashboard, create/verify the business Till recipient for COREVIA HOLDINGS LTD and Till 6959300. Confirm the returned recipient code against the company account before configuring it.
3. Confirm the Paystack KES balance can cover all member wallet balances, pending/processing member payout obligations, all queued company Till settlements, and the configured fee reserve. The worker checks this before each submission.
4. Confirm the Paystack webhook URL is `https://network.coreviaholdingltd.com/api/webhooks/paystack` and transfer events are enabled.
5. Run test-mode success, failure, reversal, duplicate webhook, and ambiguous-response reconciliation tests. No live member or company transfer is a test.
6. Inspect the queue and provider reconciliation after the first authorised transfer before enabling recurring operation.

## Worker schedule

Vercel invokes `/api/cron/settle-corevia-till` daily at 02:15 UTC (05:15 East Africa Time).
The existing member payout reconciliation remains scheduled at 02:00 UTC.
