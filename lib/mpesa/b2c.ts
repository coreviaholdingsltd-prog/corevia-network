import crypto from "node:crypto";

type DarajaConfig = {
  consumerKey: string;
  consumerSecret: string;
  initiatorName: string;
  securityCredential: string;
  partyA: string;
  resultUrl: string;
  timeoutUrl: string;
  callbackToken: string;
  environment: "sandbox" | "production";
};

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing server environment variable: ${name}`);
  return value;
}

export function getDarajaConfig(): DarajaConfig {
  const environment = (process.env.MPESA_ENV || "sandbox").toLowerCase();
  if (environment !== "sandbox" && environment !== "production") {
    throw new Error("MPESA_ENV must be sandbox or production.");
  }

  const config: DarajaConfig = {
    environment,
    consumerKey: required("MPESA_CONSUMER_KEY"),
    consumerSecret: required("MPESA_CONSUMER_SECRET"),
    initiatorName: required("MPESA_B2C_INITIATOR_NAME"),
    securityCredential: required("MPESA_B2C_SECURITY_CREDENTIAL"),
    partyA: required("MPESA_B2C_PARTY_A"),
    resultUrl: required("MPESA_B2C_RESULT_URL"),
    timeoutUrl: required("MPESA_B2C_TIMEOUT_URL"),
    callbackToken: required("MPESA_B2C_CALLBACK_TOKEN"),
  };

  for (const callback of [config.resultUrl, config.timeoutUrl]) {
    const url = new URL(callback);
    if (url.protocol !== "https:") {
      throw new Error("Daraja callback URLs must use public HTTPS.");
    }
    url.searchParams.set("token", config.callbackToken);
  }

  return config;
}

export function darajaBaseUrl(environment: DarajaConfig["environment"]) {
  return environment === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

export function buildCallbackUrl(value: string, token: string) {
  const url = new URL(value);
  url.searchParams.set("token", token);
  return url.toString();
}

export function assertB2CRecipientAllowed(environment: "sandbox" | "production", phone: string) {
  // Never let a Preview/Sandbox withdrawal target a member's real M-PESA number.
  // This is the Safaricom sandbox test MSISDN configured for this project.
  const sandboxTestPhone = "254708374149";
  if (environment === "sandbox" && phone !== sandboxTestPhone) {
    throw new Error("Sandbox safety block: withdrawals can only be sent to the configured Safaricom sandbox test number. Your wallet has not been debited.");
  }
}

export function normalizeMpesaPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("7") && digits.length === 9) return `254${digits}`;
  if (digits.startsWith("1") && digits.length === 9) return `254${digits}`;
  throw new Error("The member phone number must be a valid Kenyan M-PESA number.");
}

export function makeOriginatorConversationId() {
  return `CV${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(4).toString("hex").toUpperCase()}`.slice(0, 20);
}

export async function getDarajaAccessToken(config: DarajaConfig) {
  const credentials = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
  const response = await fetch(
    `${darajaBaseUrl(config.environment)}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: "GET",
      headers: { Authorization: `Basic ${credentials}` },
      cache: "no-store",
    },
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok || typeof data.access_token !== "string") {
    throw new Error("Safaricom Daraja authentication failed. Check the sandbox app credentials.");
  }
  return data.access_token as string;
}

export async function submitB2CPayment(args: {
  config: DarajaConfig;
  accessToken: string;
  amount: number;
  phone: string;
  reference: string;
  originatorConversationId: string;
}) {
  const { config } = args;
  const baseUrl = darajaBaseUrl(config.environment);
  const response = await fetch(`${baseUrl}/mpesa/b2c/v3/paymentrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      OriginatorConversationID: args.originatorConversationId,
      InitiatorName: config.initiatorName,
      SecurityCredential: config.securityCredential,
      CommandID: "BusinessPayment",
      Amount: args.amount,
      PartyA: config.partyA,
      PartyB: args.phone,
      Remarks: "Corevia member withdrawal",
      QueueTimeOutURL: buildCallbackUrl(config.timeoutUrl, config.callbackToken),
      ResultURL: buildCallbackUrl(config.resultUrl, config.callbackToken),
      Occasion: args.reference.slice(0, 40),
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data || typeof data.ResponseCode === "undefined") {
    // A transport/HTTP failure can be ambiguous: do not automatically refund or retry.
    throw new Error("Daraja did not return a valid B2C acknowledgement. The withdrawal remains processing for reconciliation.");
  }
  return data as {
    ResponseCode: string;
    ResponseDescription?: string;
    ConversationID?: string;
    OriginatorConversationID?: string;
  };
}
