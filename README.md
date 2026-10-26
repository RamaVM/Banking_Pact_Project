# Banking API Testing & Contract Testing

A banking API testing project built with **TypeScript, Playwright, and Pact**. The project demonstrates REST API validation, automated API testing, and consumer-driven contract testing to verify interactions between a banking API consumer and provider.

## Overview

This project implements a RESTful banking API for account management and validates its behavior using automated tests.

It combines two complementary testing approaches:

- **API Testing with Playwright:** Validates API endpoints, HTTP status codes, response bodies, input validation, and account operations.
- **Consumer-Driven Contract Testing with Pact:** Defines consumer expectations, generates a contract, and verifies that the provider's actual responses satisfy those expectations.

The objective is to improve API reliability by checking both endpoint functionality and compatibility between consumers and providers.

## Key Features

- REST API testing for account management.
- Automated tests for GET, POST, PUT, PATCH, and DELETE requests.
- Positive and negative API test scenarios.
- Reusable API client functions written in TypeScript.
- Consumer contract generation using Pact.
- Provider verification against a generated Pact contract.
- Provider state handlers for preparing test data.
- HTML test reports through Playwright.

## Technology Stack

| Technology | Purpose |
|---|---|
| TypeScript | Programming language |
| Node.js | JavaScript runtime |
| Express.js | Banking API implementation |
| Playwright | API test automation and assertions |
| Pact | Consumer-driven contract testing |
| `@pact-foundation/pact` | Pact implementation for JavaScript/TypeScript |
| `tsx` | Running TypeScript files directly |
| npm | Dependency and script management |

## Project Structure

```text
Banking_Pact_Project/
├── src/
│   ├── consumer/
│   │   └── accountConsumer.ts
│   └── provider/
│       └── bankingApi.ts
├── tests/
│   ├── account.api.spec.ts
│   ├── account.pact.test.ts
│   ├── consumer.pact.test.ts
│   └── provider.pact.test.ts
├── pacts/
│   └── BankingConsumer-BankingProvider.json
├── playwright.config.ts
├── package.json
├── package-lock.json
└── README.md
```

**Directory responsibilities**

- `src/provider/`: Implements the banking API and its account endpoints.
- `src/consumer/`: Contains reusable functions that send requests to the banking API.
- `tests/account.api.spec.ts`: Contains automated API tests using Playwright.
- `tests/consumer.pact.test.ts`: Defines consumer expectations and generates the Pact contract.
- `tests/provider.pact.test.ts`: Verifies the banking API against the Pact contract.
- `tests/account.pact.test.ts`: Contains additional Pact-related tests, if retained in the project.
- `pacts/`: Stores the generated consumer-provider contract.
- `playwright.config.ts`: Configures Playwright test execution and reporting.

## API Endpoints

The banking API supports the following account operations:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/accounts` | Retrieve all accounts |
| GET | `/accounts/:accountId` | Retrieve a specific account |
| POST | `/accounts` | Create a new account |
| PUT | `/accounts/:accountId` | Update an account's balance |
| PATCH | `/accounts/:accountId` | Partially update account details |
| DELETE | `/accounts/:accountId` | Delete an account |

### Example Account Response

```json
{
  "accountId": "10001",
  "balance": 2500,
  "currency": "INR"
}
```

### Example Requests

**Retrieve an account**

```http
GET /accounts/10001
```

**Create an account**

```http
POST /accounts
Content-Type: application/json
```

```json
{
  "accountId": "20001",
  "balance": 3200,
  "currency": "INR"
}
```

**Update an account balance**

```http
PUT /accounts/10001
Content-Type: application/json
```

```json
{
  "balance": 4000
}
```

**Update an account currency**

```http
PATCH /accounts/10001
Content-Type: application/json
```

```json
{
  "currency": "USD"
}
```

**Delete an account**

```http
DELETE /accounts/10001
```

## Getting Started

### Prerequisites

Install the following:

- Node.js
- npm
- Git (optional, for version control)

Verify your installation:

```bash
node --version
npm --version
```

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Banking_Pact_Project
```

Replace `<your-repository-url>` with your Git repository URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Banking API

```bash
npm start
```

The API runs at:

```text
http://localhost:3000
```

Keep this terminal running while executing API tests or provider verification.

## Running the Tests

### 1. Run Playwright API Tests

```bash
npm run test:api
```

This suite tests the API's account operations, validation rules, and expected HTTP responses.

The project currently contains **42 API test cases**.

### 2. Run Consumer Pact Tests

```bash
npm run test:consumer-pact
```

Consumer Pact tests use a mock server to validate that the consumer's API client behaves according to its expectations.

After successful execution, Pact generates the contract at:

```text
pacts/BankingConsumer-BankingProvider.json
```

The consumer Pact tests do not require the real banking API to be running.

### 3. Run Provider Verification

First, start the API in a separate terminal:

```bash
npm start
```

Then run provider verification in another terminal:

```bash
npm run test:provider
```

Pact replays the requests defined in the generated contract against the real banking API and checks the responses.

A successful run reports:

```text
Verification successful
```

### Recommended Execution Order

Run the following commands in order:

1. `npm run test:api`
2. `npm run test:consumer-pact`
3. Start the API with `npm start`.
4. Run `npm run test:provider` in another terminal.

## Understanding the Pact Workflow

The project follows a consumer-driven contract testing workflow.

### Step 1: Define Consumer Expectations

Consumer Pact tests specify the HTTP requests the consumer makes and the responses it expects.

### Step 2: Test Against a Mock Provider

Pact starts a mock server that returns the responses defined in the consumer tests. The consumer API client sends requests to this server.

### Step 3: Generate the Contract

Pact saves the interactions in a JSON contract containing request details, expected responses, and provider states.

### Step 4: Verify the Provider

The provider verification process sends the contract's requests to the actual banking API and compares the returned responses against the contract.

### Step 5: Validate Compatibility

If the provider satisfies the contract expectations, verification passes. If a request, status code, header, or response body does not match, verification can fail.

**Important:** Passing consumer tests alone does not prove that the real provider is compatible. Provider verification is required to validate the contract against the actual API.

## Test Coverage

### Playwright API Testing

The API test suite covers:

- Successful account retrieval.
- Account creation and duplicate-account handling.
- Input validation and invalid requests.
- Account balance updates.
- Partial account updates.
- Account deletion.
- Expected HTTP status codes and response bodies.

### Pact Contract Testing

The consumer-provider contract currently covers five representative interactions:

| Method | Scenario | Expected Status |
|---|---|---|
| GET | Retrieve account details | 200 |
| POST | Create an account | 201 |
| PUT | Update an account balance | 200 |
| PATCH | Update an account currency | 200 |
| DELETE | Delete an account | 200 |

Provider state handlers prepare the required account data before each interaction is verified.

## Test Reports

Playwright is configured to produce a list reporter and an HTML report.

After running the API test suite, open the HTML report with:

```bash
npx playwright show-report
```

The report helps identify passed and failed tests and inspect test execution details.

## Continuous Integration (CI)

This project uses GitHub Actions to automatically execute API and Pact contract tests whenever code is pushed to the configured branches or a pull request is opened.

### CI Pipeline

The workflow is defined in `.github/workflows/ci.yml`.

The pipeline performs the following steps:

1. Checks out the repository.
2. Sets up Node.js.
3. Installs dependencies using `npm ci`.
4. Runs consumer Pact tests to generate the contract.
5. Starts the banking API.
6. Executes Playwright API tests against the running API.
7. Verifies the generated Pact contract against the provider.
8. Uploads available Playwright reports and test output as workflow artifacts.

### Automated Test Coverage

- REST API endpoint validation
- Positive and negative API scenarios
- HTTP status code and response body validation
- Consumer-driven contract testing
- Provider contract verification

### Viewing CI Results

1. Open the repository on GitHub.
2. Navigate to the **Actions** tab.
3. Select the latest workflow run.
4. Review the test logs and download available artifacts.

The workflow helps identify API regressions and contract mismatches automatically.

### Current Limitations

- Account data is stored in an in-memory Map and resets when the API restarts.
- The workflow validates the application but does not deploy it to a hosting environment.
- The pipeline currently runs on GitHub-hosted Ubuntu runners.

## Design Considerations

- **Reusable client functions:** Common HTTP request logic is centralized in the consumer API client.
- **Contract separation:** Consumer expectations are stored separately from the provider implementation.
- **Controlled test data:** Provider state handlers prepare accounts required by contract interactions.
- **Automated validation:** Repeated test execution helps detect regressions.
- **Complementary testing:** Playwright validates API behavior, while Pact validates consumer-provider compatibility.

## Limitations

- Account data is stored in memory and resets when the API process restarts.
- The API is intended for local testing and demonstration, not production banking.
- The Pact contract covers representative successful interactions; it does not cover every possible request or failure scenario.
- The project does not currently demonstrate a production database, authentication, authorization, or a CI/CD pipeline.

## Future Improvements

- Add more negative and edge-case contract interactions.
- Integrate automated tests into a CI/CD pipeline.
- Add persistent storage with PostgreSQL.
- Introduce authentication and authorization tests.
- Add environment-based configuration.
- Improve test-data isolation and repeatability.
- Publish test reports as CI artifacts.

## Learning Outcomes

This project demonstrates practical experience with:

- REST API testing.
- TypeScript-based test automation.
- Playwright API testing.
- HTTP methods, status codes, and JSON responses.
- Reusable API client design.
- Consumer-driven contract testing with Pact.
- Pact contract generation and provider verification.
- Test reporting and regression testing.

