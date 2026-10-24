
import express from "express";

const app = express();
app.use(express.json());

const accounts = new Map([
  ["10001", { balance: 2500, currency: "INR" }],
  ["10002", { balance: 5000, currency: "INR" }],
  ["10003", { balance: 1000, currency: "INR" }],
  ["10004", { balance: 7500, currency: "INR" }],
  ["10005", { balance: 3200, currency: "INR" }],
  ["10006", { balance: 9000, currency: "INR" }],
  ["10007", { balance: 1500, currency: "INR" }],
  ["10008", { balance: 6200, currency: "INR" }],
  ["10009", { balance: 4100, currency: "INR" }],
  ["10010", { balance: 8000, currency: "INR" }],
  ["10011", { balance: 2750, currency: "INR" }],
  ["10012", { balance: 6800, currency: "INR" }],
  ["10013", { balance: 3500, currency: "INR" }],
  ["10014", { balance: 7200, currency: "INR" }],
  ["10015", { balance: 1200, currency: "INR" }],
  ["10016", { balance: 5600, currency: "INR" }],
  ["10017", { balance: 4300, currency: "INR" }],
  ["10018", { balance: 9900, currency: "INR" }],
  ["10019", { balance: 2100, currency: "INR" }],
  ["10020", { balance: 6400, currency: "INR" }]
]);



app.delete("/accounts/:accountId", (req, res) => {
  const accountId = req.params.accountId;

  // Validate account ID format
  if (!/^\d{5}$/.test(accountId)) {
    return res.status(400).json({
      error: "Account ID must contain exactly 5 digits"
    });
  }

  // Check whether the account exists
  if (!accounts.has(accountId)) {
    return res.status(404).json({
      error: "Account not found"
    });
  }

  // Delete the account
  accounts.delete(accountId);

  return res.status(200).json({
    message: "Account deleted successfully",
    accountId
  });
});



app.patch("/accounts/:accountId", (req, res) => {
  const accountId = req.params.accountId;
  const { balance, currency } = req.body;

  // Validate account ID format
  if (!/^\d{5}$/.test(accountId)) {
    return res.status(400).json({
      error: "Account ID must contain exactly 5 digits"
    });
  }

  // Check whether the account exists
  const account = accounts.get(accountId);

  if (!account) {
    return res.status(404).json({
      error: "Account not found"
    });
  }

  // Check whether at least one supported field was provided
  if (balance === undefined && currency === undefined) {
    return res.status(400).json({
      error: "Provide balance or currency to update"
    });
  }

  // Validate balance if provided
  if (
    balance !== undefined &&
    (
      typeof balance !== "number" ||
      !Number.isFinite(balance) ||
      balance < 0
    )
  ) {
    return res.status(400).json({
      error: "Balance must be a valid non-negative number"
    });
  }

  // Validate currency if provided
  if (
    currency !== undefined &&
    (
      typeof currency !== "string" ||
      currency.trim() === ""
    )
  ) {
    return res.status(400).json({
      error: "Currency must be a non-empty string"
    });
  }

  // Update only the fields provided
  if (balance !== undefined) {
    account.balance = balance;
  }

  if (currency !== undefined) {
    account.currency = currency;
  }

  return res.status(200).json({
    accountId,
    balance: account.balance,
    currency: account.currency
  });
});

app.put("/accounts/:accountId", (req, res) => {
  const accountId = req.params.accountId;
  const { balance } = req.body;

  // Validate account ID format
  if (!/^\d{5}$/.test(accountId)) {
    return res.status(400).json({
      error: "Account ID must contain exactly 5 digits"
    });
  }

  // Check whether the account exists
  const account = accounts.get(accountId);

  if (!account) {
    return res.status(404).json({
      error: "Account not found"
    });
  }

  // Validate the new balance
  if (
    typeof balance !== "number" ||
    !Number.isFinite(balance) ||
    balance < 0
  ) {
    return res.status(400).json({
      error: "A valid non-negative balance is required"
    });
  }

  // Update the existing account
  account.balance = balance;

  return res.status(200).json({
    accountId,
    balance: account.balance,
    currency: account.currency
  });
});


app.post("/accounts", (req, res) => {
  const { accountId, balance, currency } = req.body;

  // Validate account ID format
  if (typeof accountId !== "string" || !/^\d{5}$/.test(accountId)) {
    return res.status(400).json({
      error: "Account ID must contain exactly 5 digits"
    });
  }

  // Check for duplicate account ID
  if (accounts.has(accountId)) {
    return res.status(409).json({
      error: "Account already exists"
    });
  }

  // Validate balance and currency
  if (
    typeof balance !== "number" ||
    !Number.isFinite(balance) ||
    balance < 0 ||
    typeof currency !== "string" ||
    currency.trim() === ""
  ) {
    return res.status(400).json({
      error: "Valid balance and currency are required"
    });
  }

  // Create the account
  accounts.set(accountId, {
    balance,
    currency
  });

  return res.status(201).json({
    accountId,
    balance,
    currency
  });
});

app.get("/accounts", (req, res) => {
  const allAccounts = Array.from(
    accounts,
    ([accountId, details]) => ({
      accountId,
      ...details
    })
  );

  return res.status(200).json(allAccounts);
});

app.get("/accounts/:accountId", (req, res) => {
  const accountId = req.params.accountId;

  if (!/^\d{5}$/.test(accountId)) {
    return res.status(400).json({
      error: "Account ID must contain exactly 5 digits"
    });
  }

  const account = accounts.get(accountId);

  if (!account) {
    return res.status(404).json({
      error: "Account not found"
    });
  }

  return res.status(200).json({
    accountId,
    balance: account.balance,
    currency: account.currency
  });
});

app.listen(3000, () => {
  console.log("Banking API running on port 3000");
});
