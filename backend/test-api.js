const http = require('http');

// Helper to make HTTP JSON requests
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      if (typeof postData === 'string') {
        req.write(postData);
      } else {
        req.write(JSON.stringify(postData));
      }
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log(' STARTING CAMPUSKART FULL API SUITE TESTS');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    const health = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/health',
      method: 'GET',
    });
    assert(health.status === 200 && health.data.status === 'healthy', '1. GET /api/health returns healthy status');

    // 2. Public Products List
    const productsRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/products',
      method: 'GET',
    });
    assert(
      productsRes.status === 200 && Array.isArray(productsRes.data.products) && productsRes.data.products.length > 0,
      `2. GET /api/products returns seeded products (count: ${productsRes.data.products?.length})`
    );

    // 3. Category Filter
    const catRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/products?category=Cycles',
      method: 'GET',
    });
    assert(
      catRes.status === 200 && catRes.data.products.every((p) => p.category === 'Cycles'),
      '3. GET /api/products?category=Cycles correctly filters category'
    );

    // 4. Keyword Search
    const searchRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/products?search=calculator',
      method: 'GET',
    });
    assert(
      searchRes.status === 200 && searchRes.data.products.some((p) => p.title.toLowerCase().includes('calculator')),
      '4. GET /api/products?search=calculator searches title/description'
    );

    // 5. Single Product by ID
    const sampleProductId = productsRes.data.products[0]._id;
    const singleProduct = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: `/api/products/${sampleProductId}`,
      method: 'GET',
    });
    assert(
      singleProduct.status === 200 && singleProduct.data.product._id === sampleProductId,
      '5. GET /api/products/:id retrieves single product details'
    );

    // 6. Login with Seeded User
    const loginRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5001,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        loginIdentifier: 'aarav.sharma@university.edu',
        password: 'Password@123',
      }
    );
    assert(
      loginRes.status === 200 && Boolean(loginRes.data.token),
      `6. POST /api/auth/login succeeds for student Aarav Sharma with JWT token`
    );

    const token = loginRes.data.token;

    // 7. Protected Route - Get Current User (/api/users/me)
    const meRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/users/me',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(
      meRes.status === 200 && meRes.data.user.email === 'aarav.sharma@university.edu',
      '7. GET /api/users/me returns authenticated student profile'
    );

    // 8. Send OTP Flow
    const testNewEmail = `student.test.${Date.now()}@university.edu`;
    const sendOtpRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5001,
        path: '/api/auth/send-otp',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        identifier: testNewEmail,
        purpose: 'registration',
      }
    );
    assert(
      sendOtpRes.status === 200 && sendOtpRes.data.success && Boolean(sendOtpRes.data.demoOtp),
      '8. POST /api/auth/send-otp generates 6-digit OTP'
    );

    const generatedOtp = sendOtpRes.data.demoOtp;

    // 9. Verify OTP
    const verifyOtpRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5001,
        path: '/api/auth/verify-otp',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        identifier: testNewEmail,
        otp: generatedOtp,
        purpose: 'registration',
      }
    );
    assert(
      verifyOtpRes.status === 200 && verifyOtpRes.data.success,
      '9. POST /api/auth/verify-otp validates 6-digit code'
    );

    // 10. Register New Student
    const regRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5001,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        fullName: 'Vikramaditya Roy',
        enrollmentId: `2024CSB${Math.floor(1000 + Math.random() * 9000)}`,
        email: testNewEmail,
        phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
        password: 'Password@123',
        confirmPassword: 'Password@123',
        termsAccepted: true,
        otp: generatedOtp,
      }
    );
    assert(
      regRes.status === 201 && regRes.data.success && Boolean(regRes.data.token),
      '10. POST /api/auth/register creates new student account and returns token'
    );

    const newUserToken = regRes.data.token;

    // 11. Disclaimer Enforcement: new student has disclaimerAccepted: false
    // Attempting to create product without disclaimer should return 403
    const blockedProduct = await makeRequest(
      {
        hostname: 'localhost',
        port: 5001,
        path: '/api/products',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newUserToken}`,
        },
      },
      {
        title: 'Unauthorized Test Listing',
        description: 'Should be blocked until disclaimer accepted',
        price: 100,
        category: 'Electronics',
        condition: 'Good',
      }
    );
    assert(
      blockedProduct.status === 403 && blockedProduct.data.requiresDisclaimer === true,
      '11. POST /api/products blocks unaccepted disclaimer with 403 Forbidden'
    );

    // 12. Accept Disclaimer
    const acceptRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/users/accept-disclaimer',
      method: 'PUT',
      headers: { Authorization: `Bearer ${newUserToken}` },
    });
    assert(
      acceptRes.status === 200 && acceptRes.data.user.disclaimerAccepted === true,
      '12. PUT /api/users/accept-disclaimer accepts campus guidelines'
    );

    // 13. Create Product (Now allowed after disclaimer acceptance)
    const newProductRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5001,
        path: '/api/products',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newUserToken}`,
        },
      },
      {
        title: 'Arduino Uno R3 Starter Kit with Sensors',
        description: 'Used for Embedded Systems lab course. Includes breadboard, jumper wires, sensors, and USB cable.',
        price: 950,
        category: 'Electronics',
        condition: 'Like New',
        imageUrl: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
      }
    );
    assert(
      newProductRes.status === 201 && newProductRes.data.success && newProductRes.data.product.price === 950,
      '13. POST /api/products successfully creates new listing after disclaimer accepted'
    );

    const createdProductId = newProductRes.data.product._id;

    // 14. Update Product Listing
    const updateRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5001,
        path: `/api/products/${createdProductId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newUserToken}`,
        },
      },
      {
        price: 850,
        description: 'Price reduced! Quick campus deal.',
      }
    );
    assert(
      updateRes.status === 200 && updateRes.data.product.price === 850,
      '14. PUT /api/products/:id updates price and details'
    );

    // 15. Delete Product Listing (Owner authorized)
    const deleteRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: `/api/products/${createdProductId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${newUserToken}` },
    });
    assert(
      deleteRes.status === 200 && deleteRes.data.success,
      '15. DELETE /api/products/:id deletes student listing'
    );

    console.log('====================================================');
    console.log(` TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
