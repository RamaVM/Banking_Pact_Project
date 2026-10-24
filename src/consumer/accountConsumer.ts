const defaultBaseUrl = "http://localhost:3000";

async function sendRequest(
  baseUrl: string,
  path: string,
  method: string,
  body?: object
) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: body
      ? { "Content-Type": "application/json" }
      : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseBody = await response.json();

  return {
    status: response.status,
    body: responseBody,
  };
}

export function getAccount(
  accountId: string,
  baseUrl = defaultBaseUrl
) {
  return sendRequest(
    baseUrl,
    `/accounts/${accountId}`,
    "GET"
  );
}

export function createAccount(
  accountId: string,
  balance: number,
  currency: string,
  baseUrl = defaultBaseUrl
) {
  return sendRequest(baseUrl, "/accounts", "POST", {
    accountId,
    balance,
    currency,
  });
}

export function updateAccount(
  accountId: string,
  balance: number,
  baseUrl = defaultBaseUrl
) {
  return sendRequest(
    baseUrl,
    `/accounts/${accountId}`,
    "PUT",
    { balance }
  );
}

export function patchAccount(
  accountId: string,
  currency: string,
  baseUrl = defaultBaseUrl
) {
  return sendRequest(
    baseUrl,
    `/accounts/${accountId}`,
    "PATCH",
    { currency }
  );
}

export function deleteAccount(
  accountId: string,
  baseUrl = defaultBaseUrl
) {
  return sendRequest(
    baseUrl,
    `/accounts/${accountId}`,
    "DELETE"
  );
}