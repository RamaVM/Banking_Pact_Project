import { Verifier } from "@pact-foundation/pact";

const baseUrl = "http://localhost:3000";

async function getAccount(accountId: string) {
  return fetch(`${baseUrl}/accounts/${accountId}`);
}

async function createAccount(
  accountId: string,
  balance: number,
  currency: string
) {
  return fetch(`${baseUrl}/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountId,
      balance,
      currency,
    }),
  });
}

async function patchAccount(
  accountId: string,
  balance: number,
  currency: string
) {
  return fetch(`${baseUrl}/accounts/${accountId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      balance,
      currency,
    }),
  });
}

async function ensureAccount(
  accountId: string,
  balance: number,
  currency: string
) {
  const existingResponse = await getAccount(accountId);

  if (existingResponse.status === 404) {
    const createResponse = await createAccount(
      accountId,
      balance,
      currency
    );

    if (createResponse.status !== 201) {
      throw new Error(
        `Could not create account ${accountId}: ${createResponse.status}`
      );
    }

    return;
  }

  if (existingResponse.status !== 200) {
    throw new Error(
      `Could not retrieve account ${accountId}: ${existingResponse.status}`
    );
  }

  const updateResponse = await patchAccount(
    accountId,
    balance,
    currency
  );

  if (updateResponse.status !== 200) {
    throw new Error(
      `Could not prepare account ${accountId}: ${updateResponse.status}`
    );
  }
}

async function verifyBankingProvider() {
  const verifier = new Verifier({
    provider: "BankingProvider",
    providerBaseUrl: baseUrl,
    pactUrls: ["./pacts/BankingConsumer-BankingProvider.json"],

    stateHandlers: {
      "an account exists": async () => {
        await ensureAccount("12345", 2500, "INR");
      },

      "account 12346 does not exist": async () => {
        const response = await getAccount("12346");

        if (response.status === 200) {
          const deleteResponse = await fetch(
            `${baseUrl}/accounts/12346`,
            { method: "DELETE" }
          );

          if (deleteResponse.status !== 200) {
            throw new Error("Could not prepare account 12346 for creation");
          }
        } else if (response.status !== 404) {
          throw new Error(
            `Could not check account 12346: ${response.status}`
          );
        }
      },

      "account 10001 exists with balance 2500 INR": async () => {
        await ensureAccount("10001", 2500, "INR");
      },

      "account 10002 exists with balance 5000 INR": async () => {
        await ensureAccount("10002", 5000, "INR");
      },

      "account 10020 exists": async () => {
        await ensureAccount("10020", 6400, "INR");
      },
    },
  });

  await verifier.verifyProvider();
}

verifyBankingProvider().catch((error) => {
  console.error("Provider verification failed:", error);
  process.exitCode = 1;
});