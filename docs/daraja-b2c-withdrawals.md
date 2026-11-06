# Archived: Safaricom Daraja B2C payout engine retired

As of 6 November 2026, Corevia Network no longer initiates new member withdrawals through Safaricom Daraja B2C. Paystack Transfers is the sole payout engine.

The old Daraja submission client has been removed from the application. Legacy B2C result and timeout callback routes and the settlement helper remain temporarily available only to settle historical withdrawals that may have been in flight when the engine was retired. They cannot initiate new payments.

Do not restore Daraja routing, fallback, credentials, or B2C environment flags. Do not delete the legacy callback token, callback routes, settlement helper, or historical database fields until the database has been checked and every pre-retirement Daraja withdrawal is confirmed terminal. Once that verification is complete, remove the callback compatibility code and schema in a separately reviewed migration.

All new withdrawals must pass the Paystack readiness gates and the client-funds reconciliation described in `dual-engine-withdrawals.md` (the file now documents the Paystack-only policy).
