import { test, expect } from '@playwright/test';

test('TC_GET_001 - Retrieve all accounts', async ({ request }) => {
  const response = await request.get('http://localhost:3000/accounts');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});


test('GET - Retrieve an existing bank account', async ({ request }) => {
  const response = await request.get('http://localhost:3000/accounts/10001');

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.accountId).toBe('10001');
  expect(responseBody.currency).toBe('INR');
});


test('GET - Return 404 for a nonexistent account', async ({ request }) => {
  const response = await request.get('http://localhost:3000/accounts/99999');

  expect(response.status()).toBe(404);
});


test('TC_GET_004 - Return 400 for an account ID with fewer than five digits', async ({ request }) => {
  const response = await request.get('http://localhost:3000/accounts/1234');

  expect(response.status()).toBe(400);
});

test('TC_GET_005 - Return 400 for an account ID containing letters', async ({ request }) => {
  const response = await request.get('http://localhost:3000/accounts/abcde');

  expect(response.status()).toBe(400);
});

test('TC_GET_006 - Return 400 for an account ID containing six digits', async ({ request }) => {
  const response = await request.get('http://localhost:3000/accounts/123456');

  expect(response.status()).toBe(400);
});

test('TC_POST_001 - Create a new bank account', async ({ request }) => {
  const accountId = String(Math.floor(20000 + Math.random() * 70000));

  const response = await request.post('http://localhost:3000/accounts', {
    data: {
      accountId,
      balance: 3500,
      currency: 'INR'
    }
  });

  expect(response.status()).toBe(201);

  const responseBody = await response.json();

  expect(responseBody.accountId).toBe(accountId);
  expect(responseBody.balance).toBe(3500);
  expect(responseBody.currency).toBe('INR');
});

test.describe('POST Account API Tests', () => {

  // TC_POST_002: Duplicate account ID
test('TC_POST_002 - Reject duplicate account ID', async ({ request }) => {
  const accountId = String(Math.floor(20000 + Math.random() * 70000));

  const accountData = {
    accountId,
    balance: 3500,
    currency: 'INR'
  };

  // First request: Create the account
  const createResponse = await request.post('http://localhost:3000/accounts', {
    data: accountData
  });

  expect(createResponse.status()).toBe(201);

  // Second request: Try to create the same account again
  const duplicateResponse = await request.post('http://localhost:3000/accounts', {
    data: accountData
  });

  expect(duplicateResponse.status()).toBe(409);
});

  // TC_POST_003: Four-digit account ID
  test('TC_POST_003 - Reject four-digit account ID', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: '1234', balance: 3500, currency: 'INR' }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_004: Negative balance
  test('TC_POST_004 - Reject negative balance', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: '10023', balance: -500, currency: 'INR' }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_005: Missing balance
  test('TC_POST_005 - Reject missing balance', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: '10023', currency: 'INR' }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_006: Missing currency
  test('TC_POST_006 - Reject missing currency', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: '10023', balance: 3500 }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_007: Empty currency
  test('TC_POST_007 - Reject empty currency', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: '10023', balance: 3500, currency: '' }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_008: Zero balance

test('TC_POST_008 - Create an account with zero balance', async ({ request }) => {
  const accountId = String(Math.floor(20000 + Math.random() * 70000));

  const response = await request.post('http://localhost:3000/accounts', {
    data: {
      accountId,
      balance: 0,
      currency: 'INR'
    }
  });

  expect(response.status()).toBe(201);

  const responseBody = await response.json();

  expect(responseBody.accountId).toBe(accountId);
  expect(responseBody.balance).toBe(0);
  expect(responseBody.currency).toBe('INR');
});


  // TC_POST_009: Balance as a string
  test('TC_POST_009 - Reject balance provided as a string', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: '10023', balance: '2500', currency: 'INR' }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_010: Currency as a number
  test('TC_POST_010 - Reject currency provided as a number', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: '10023', balance: 3500, currency: 123 }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_011: Missing account ID
  test('TC_POST_011 - Reject missing account ID', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { balance: 3500, currency: 'INR' }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_012: Account ID as a number
  test('TC_POST_012 - Reject account ID provided as a number', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: 10030, balance: 3500, currency: 'INR' }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_013: Account ID containing letters
  test('TC_POST_013 - Reject account ID containing letters', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: '10A30', balance: 3500, currency: 'INR' }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_014: Account ID containing a special character
  test('TC_POST_014 - Reject account ID containing a special character', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: '10@30', balance: 3500, currency: 'INR' }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_015: Six-digit account ID
  test('TC_POST_015 - Reject six-digit account ID', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: '100030', balance: 3500, currency: 'INR' }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_016: Decimal balance

test('TC_POST_016 - Create an account with a decimal balance', async ({ request }) => {
  const accountId = String(Math.floor(20000 + Math.random() * 70000));

  const response = await request.post('http://localhost:3000/accounts', {
    data: {
      accountId,
      balance: 2500.50,
      currency: 'INR'
    }
  });

  expect(response.status()).toBe(201);

  const responseBody = await response.json();

  expect(responseBody.accountId).toBe(accountId);
  expect(responseBody.balance).toBe(2500.50);
  expect(responseBody.currency).toBe('INR');
});


  // TC_POST_017: Null balance
  test('TC_POST_017 - Reject null balance', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: '10023', balance: null, currency: 'INR' }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_018: Boolean balance
  test('TC_POST_018 - Reject boolean balance', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: '10023', balance: true, currency: 'INR' }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_019: Currency containing only spaces
  test('TC_POST_019 - Reject whitespace-only currency', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: '10023', balance: 3500, currency: '   ' }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_020: Null currency
  test('TC_POST_020 - Reject null currency', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: '10023', balance: 3500, currency: null }
    });

    expect(response.status()).toBe(400);
  });

  // TC_POST_021: Boolean currency
  test('TC_POST_021 - Reject boolean currency', async ({ request }) => {
    const response = await request.post('http://localhost:3000/accounts', {
      data: { accountId: '10023', balance: 3500, currency: true }
    });

    expect(response.status()).toBe(400);
  });

});


test.describe('PUT Account API Tests', () => {

  // TC_PUT_001: Update an existing account balance
  test('TC_PUT_001 - Update an existing account balance', async ({ request }) => {
    const response = await request.put('http://localhost:3000/accounts/10001', {
      data: { balance: 4000 }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.balance).toBe(4000);
    expect(body.currency).toBe('INR');
  });

  // TC_PUT_002: Update a nonexistent account
  test('TC_PUT_002 - Return 404 for a nonexistent account', async ({ request }) => {
    const response = await request.put('http://localhost:3000/accounts/99999', {
      data: { balance: 4000 }
    });

    expect(response.status()).toBe(404);
  });

  // TC_PUT_003: Reject a negative balance
  test('TC_PUT_003 - Reject a negative balance', async ({ request }) => {
    const response = await request.put('http://localhost:3000/accounts/10001', {
      data: { balance: -500 }
    });

    expect(response.status()).toBe(400);
  });

  // TC_PUT_004: Reject an empty request body
  test('TC_PUT_004 - Reject an empty request body', async ({ request }) => {
    const response = await request.put('http://localhost:3000/accounts/10001', {
      data: {}
    });

    expect(response.status()).toBe(400);
  });

  // TC_PUT_005: Reject an invalid account ID
  test('TC_PUT_005 - Reject an invalid account ID', async ({ request }) => {
    const response = await request.put('http://localhost:3000/accounts/1234', {
      data: { balance: 4000 }
    });

    expect(response.status()).toBe(400);
  });

});

test.describe('PATCH Account API Tests', () => {

  // TC_PATCH_001: Update balance only
  test('TC_PATCH_001 - Update balance only', async ({ request }) => {
    const response = await request.patch('http://localhost:3000/accounts/10002', {
      data: { balance: 6000 }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.balance).toBe(6000);
    expect(body.currency).toBe('INR');
  });

  // TC_PATCH_002: Update currency only
  test('TC_PATCH_002 - Update currency only', async ({ request }) => {
    const response = await request.patch('http://localhost:3000/accounts/10002', {
      data: { currency: 'USD' }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.currency).toBe('USD');
    expect(body.balance).toBe(6000);
  });

  // TC_PATCH_003: Update both balance and currency
  test('TC_PATCH_003 - Update both balance and currency', async ({ request }) => {
    const response = await request.patch('http://localhost:3000/accounts/10002', {
      data: {
        balance: 7500,
        currency: 'INR'
      }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.balance).toBe(7500);
    expect(body.currency).toBe('INR');
  });

  // TC_PATCH_004: Update a nonexistent account
  test('TC_PATCH_004 - Return 404 for a nonexistent account', async ({ request }) => {
    const response = await request.patch('http://localhost:3000/accounts/99999', {
      data: { balance: 5000 }
    });

    expect(response.status()).toBe(404);
  });

  // TC_PATCH_005: Empty request body
  test('TC_PATCH_005 - Reject an empty request body', async ({ request }) => {
    const response = await request.patch('http://localhost:3000/accounts/10002', {
      data: {}
    });

    expect(response.status()).toBe(400);
  });

});


test.describe('DELETE Account API Tests', () => {

  // TC_DELETE_001: Delete an existing account
test('TC_DELETE_001 - Delete an existing account', async ({ request }) => {
  const accountId = String(Math.floor(20000 + Math.random() * 70000));

  // Create an account to delete
  const createResponse = await request.post('http://localhost:3000/accounts', {
    data: {
      accountId,
      balance: 3500,
      currency: 'INR'
    }
  });

  expect(createResponse.status()).toBe(201);

  // Delete the account
  const deleteResponse = await request.delete(
    `http://localhost:3000/accounts/${accountId}`
  );

  expect(deleteResponse.status()).toBe(200);
});

  // TC_DELETE_002: Delete a nonexistent account
  test('TC_DELETE_002 - Return 404 for a nonexistent account', async ({ request }) => {
    const response = await request.delete('http://localhost:3000/accounts/99999');

    expect(response.status()).toBe(404);
  });

  // TC_DELETE_003: Invalid four-digit account ID
  test('TC_DELETE_003 - Reject a four-digit account ID', async ({ request }) => {
    const response = await request.delete('http://localhost:3000/accounts/1234');

    expect(response.status()).toBe(400);
  });

  // TC_DELETE_004: Alphabetic account ID
  test('TC_DELETE_004 - Reject an alphabetic account ID', async ({ request }) => {
    const response = await request.delete('http://localhost:3000/accounts/abcde');

    expect(response.status()).toBe(400);
  });

  // TC_DELETE_005: Verify the deleted account no longer exists
test('TC_DELETE_005 - Verify deleted account cannot be retrieved', async ({ request }) => {
  const accountId = String(Math.floor(20000 + Math.random() * 70000));

  const createResponse = await request.post('http://localhost:3000/accounts', {
    data: {
      accountId,
      balance: 3500,
      currency: 'INR'
    }
  });

  expect(createResponse.status()).toBe(201);

  const deleteResponse = await request.delete(
    `http://localhost:3000/accounts/${accountId}`
  );

  expect(deleteResponse.status()).toBe(200);

  const getResponse = await request.get(
    `http://localhost:3000/accounts/${accountId}`
  );

  expect(getResponse.status()).toBe(404);
});

});