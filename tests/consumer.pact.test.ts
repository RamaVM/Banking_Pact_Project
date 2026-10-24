import { PactV3 } from "@pact-foundation/pact";
import assert from "node:assert/strict";
import path from "node:path";

import {
  getAccount,
  createAccount,
  updateAccount,
  patchAccount,
  deleteAccount,
} from "../src/consumer/accountConsumer";

const pact = new PactV3({
  consumer: "BankingConsumer",
  provider: "BankingProvider",
  dir: path.resolve(process.cwd(), "pacts"),
  logLevel: "info",
});

async function runConsumerPactTests() {
  // 1. GET account
  await pact
    .given("an account exists")
    .uponReceiving("a request for account details")
    .withRequest({
      method: "GET",
      path: "/accounts/12345",
    })
    .willRespondWith({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        accountId: "12345",
        balance: 2500,
        currency: "INR",
      },
    })
    .executeTest(async (mockServer) => {
      const result = await getAccount(
        "12345",
        mockServer.url
      );

      assert.equal(result.status, 200);
      assert.deepEqual(result.body, {
        accountId: "12345",
        balance: 2500,
        currency: "INR",
      });
    });

  // 2. POST create account
  await pact
    .given("account 12346 does not exist")
    .uponReceiving("a request to create an account")
    .withRequest({
      method: "POST",
      path: "/accounts",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        accountId: "12346",
        balance: 3200,
        currency: "INR",
      },
    })
    .willRespondWith({
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        accountId: "12346",
        balance: 3200,
        currency: "INR",
      },
    })
    .executeTest(async (mockServer) => {
      const result = await createAccount(
        "12346",
        3200,
        "INR",
        mockServer.url
      );

      assert.equal(result.status, 201);
      assert.deepEqual(result.body, {
        accountId: "12346",
        balance: 3200,
        currency: "INR",
      });
    });

  // 3. PUT update account balance
  await pact
    .given("account 10001 exists with balance 2500 INR")
    .uponReceiving("a request to update an account balance")
    .withRequest({
      method: "PUT",
      path: "/accounts/10001",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        balance: 4000,
      },
    })
    .willRespondWith({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        accountId: "10001",
        balance: 4000,
        currency: "INR",
      },
    })
    .executeTest(async (mockServer) => {
      const result = await updateAccount(
        "10001",
        4000,
        mockServer.url
      );

      assert.equal(result.status, 200);
      assert.deepEqual(result.body, {
        accountId: "10001",
        balance: 4000,
        currency: "INR",
      });
    });

  // 4. PATCH update account currency
  await pact
    .given("account 10002 exists with balance 5000 INR")
    .uponReceiving("a request to update an account currency")
    .withRequest({
      method: "PATCH",
      path: "/accounts/10002",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        currency: "USD",
      },
    })
    .willRespondWith({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        accountId: "10002",
        balance: 5000,
        currency: "USD",
      },
    })
    .executeTest(async (mockServer) => {
      const result = await patchAccount(
        "10002",
        "USD",
        mockServer.url
      );

      assert.equal(result.status, 200);
      assert.deepEqual(result.body, {
        accountId: "10002",
        balance: 5000,
        currency: "USD",
      });
    });

  // 5. DELETE account
  await pact
    .given("account 10020 exists")
    .uponReceiving("a request to delete an account")
    .withRequest({
      method: "DELETE",
      path: "/accounts/10020",
    })
    .willRespondWith({
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        message: "Account deleted successfully",
        accountId: "10020",
      },
    })
    .executeTest(async (mockServer) => {
      const result = await deleteAccount(
        "10020",
        mockServer.url
      );

      assert.equal(result.status, 200);
      assert.deepEqual(result.body, {
        message: "Account deleted successfully",
        accountId: "10020",
      });
    });

  console.log("All consumer Pact tests passed.");
}

runConsumerPactTests().catch((error) => {
  console.error("Consumer Pact tests failed:", error);
  process.exitCode = 1;
});