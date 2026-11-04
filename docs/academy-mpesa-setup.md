# Corevia Academy M-PESA STK Push setup

The Academy supports Paystack checkout and a direct Safaricom Daraja STK Push path. M-PESA enrolments remain pending until the Safaricom callback is reconciled against the saved payment and exact amount. Never activate a course from the synchronous STK acceptance response alone.

## Vercel environment variables

Configure these in the **Preview** environment first:

- `MPESA_ENV=sandbox`
- `MPESA_CONSUMER_KEY` — Daraja sandbox consumer key
- `MPESA_CONSUMER_SECRET` — Daraja sandbox consumer secret
- `MPESA_SHORTCODE=174379` — Safaricom sandbox test shortcode (not Corevia's Till)
- `MPESA_TILL_NUMBER=174379` — sandbox test PartyB
- `MPESA_TRANSACTION_TYPE=CustomerPayBillOnline` — sandbox transaction type supported by the test app
- `MPESA_PASSKEY` — sandbox Lipa na M-PESA Online passkey
- `MPESA_ACADEMY_CALLBACK_URL=https://network.coreviaholdingltd.com/api/webhooks/mpesa/academy`
- `MPESA_CALLBACK_TOKEN` — generate a long random secret and store it only in Vercel; callback requests append it as a query parameter.

For **production**, use Safaricom-approved production credentials and the exact Till/shortcode configuration approved for Lipa na M-PESA Online:

- `MPESA_ENV=production`
- `MPESA_SHORTCODE=6959300` only if Safaricom has enabled that Till for the selected Daraja STK product
- `MPESA_TILL_NUMBER=6959300`
- `MPESA_TRANSACTION_TYPE=CustomerBuyGoodsOnline` only when Safaricom has enabled Buy Goods Online for the Till.

Do not copy sandbox values into production. A Till number alone does not prove that STK Push has been provisioned for that Till. Confirm the correct shortcode, transaction type, passkey and production approval with Safaricom before enabling live collection.

## Callback registration

Register this HTTPS callback URL in the Daraja application / merchant configuration:

`https://network.coreviaholdingltd.com/api/webhooks/mpesa/academy?token=<MPESA_CALLBACK_TOKEN>`

The token is a shared callback guard. Keep it private and rotate/re-register the callback if it is exposed.

## Payment safety

- An accepted STK request is not a completed payment.
- The learner's course remains locked while the payment is pending.
- The callback must match a saved MPESA Academy payment and exact expected amount.
- A successful callback stores the M-PESA receipt, phone number, timestamp, course, learner and study pathway before activating the enrolment.
- Failed or cancelled prompts do not activate enrolment.
- An ambiguous initiation is left pending; do not start a second charge until reconciled.
- Test with sandbox credentials and test numbers before production approval.
