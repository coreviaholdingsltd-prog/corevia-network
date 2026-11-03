# Daraja B2C withdrawals (sandbox first)

The member withdrawal API now submits the net payout through Safaricom Daraja B2C. The wallet is debited once, the 0.50% fee is recorded for Corevia, and the withdrawal remains PROCESSING until the ResultURL callback confirms success. A confirmed failure refunds the full wallet deduction and reverses the fee ledger entries. Queue timeouts and ambiguous network outcomes are deliberately not refunded automatically because Safaricom may already have accepted the request.

## Required server environment variables

Set these in Vercel for Preview first:

- `MPESA_ENV=sandbox`
- `MPESA_CONSUMER_KEY` — Daraja sandbox app consumer key
- `MPESA_CONSUMER_SECRET` — Daraja sandbox app consumer secret
- `MPESA_B2C_INITIATOR_NAME=testapi`
- `MPESA_B2C_SECURITY_CREDENTIAL` — sandbox-generated encrypted security credential
- `MPESA_B2C_PARTY_A=600986` — Daraja B2C sandbox test party A; do not use 174379 here
- `MPESA_B2C_CALLBACK_TOKEN` — generate a long random secret (at least 32 bytes)
- `MPESA_B2C_RESULT_URL=https://network.coreviaholdingltd.com/api/mpesa/b2c/result`
- `MPESA_B2C_TIMEOUT_URL=https://network.coreviaholdingltd.com/api/mpesa/b2c/timeout`

Never commit credentials or paste them into source control/chat. The STK Passkey is not used by B2C.

## Database migration

Apply the migration before deploying the feature:

```bash
npx prisma migrate deploy
npx prisma generate
```

## Sandbox validation

1. Set the variables on the Vercel Preview environment, not Production.
2. Deploy the feature branch as a Preview.
3. Confirm the callback URLs are publicly reachable over HTTPS and retain the callback token query parameter added by the server.
4. Use a sandbox member account with an active membership, wallet balance, and the Daraja test phone number.
5. Submit a withdrawal whose net payout after the 0.50% fee is a whole KES amount (Daraja B2C Amount is an integer).
6. Confirm the withdrawal changes to PAID and stores the M-PESA receipt, or changes to FAILED with a full wallet/fee refund after a definitive failure callback.

Do not switch to production until Safaricom has enabled B2C on Corevia's business shortcode/account and issued production credentials. Never use the sandbox Party A in production.
