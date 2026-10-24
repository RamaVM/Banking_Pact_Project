
import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import path from "path";

const { like } = MatchersV3;

const provider = new PactV3({
  consumer: "BankingConsumer",
  provider: "BankingProvider",
  dir: path.resolve(process.cwd(), "pacts"),
});

provider.addInteraction({
  states: [{ description: "an account exists" }],
  uponReceiving: "a request for account details",
  withRequest: {
    method: "GET",
    path: "/accounts/12345",
  },
  willRespondWith: {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      accountId: like("12345"),
      balance: like(2500),
      currency: like("INR"),
    },
  },
});

async function testAccountContract() {
  await provider.executeTest(async (mockServer) => {
    const response = await fetch(
      `${mockServer.url}/accounts/12345`
    );

    const account = await response.json();

    console.log("Contract test response:", account);

    if (!response.ok) {
      throw new Error(`Unexpected status: ${response.status}`);
    }

    if (
      account.accountId !== "12345" ||
      account.balance !== 2500 ||
      account.currency !== "INR"
    ) {
      throw new Error("Account response did not match expectations");
    }
  });
}

testAccountContract().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
