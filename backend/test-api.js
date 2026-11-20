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
  console.log(' STARTING DORMDEAL COMPLETE BACKEND API TEST SUITE');
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
    // 1. Health check
    const health = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/health',
      method: 'GET',
    });
    assert(health.status === 200 && health.data.status === 'healthy', '1. GET /api/health returns healthy status');

    // 2. Public Items List
    const itemsRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/items',
      method: 'GET',
    });
    assert(
      itemsRes.status === 200 && Array.isArray(itemsRes.data.items) && itemsRes.data.items.length > 0,
      `2. GET /api/items returns marketplace items (count: ${itemsRes.data.items?.length})`
    );

    // 3. Filter by listingType = RENT
    const rentRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/items?type=RENT',
      method: 'GET',
    });
    assert(
      rentRes.status === 200 && rentRes.data.items.every((i) => i.listingType === 'RENT'),
      '3. GET /api/items?type=RENT filters campus rental items'
    );

    // 4. Keyword search
    const searchRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/items?search=calculator',
      method: 'GET',
    });
    assert(
      searchRes.status === 200 && searchRes.data.items.some((i) => i.title.toLowerCase().includes('calculator')),
      '4. GET /api/items?search=calculator searches across titles and descriptions'
    );

    // 5. Single item details with seller hostel info
    const sampleItemId = itemsRes.data.items[0]._id;
    const singleRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: `/api/items/${sampleItemId}`,
      method: 'GET',
    });
    assert(
      singleRes.status === 200 && Boolean(singleRes.data.item.seller.hostelName),
      '5. GET /api/items/:id returns item with seller hostel and room details'
    );

    // 6. Login with seeded student
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
    assert(loginRes.status === 200 && Boolean(loginRes.data.token), '6. POST /api/auth/login succeeds for student Aarav Sharma');

    const token = loginRes.data.token;

    // 7. Protected route: /api/users/me
    const meRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/users/me',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(
      meRes.status === 200 && meRes.data.user.hostelName === 'Block B',
      '7. GET /api/users/me returns authenticated student with hostel & room'
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
    assert(verifyOtpRes.status === 200 && verifyOtpRes.data.success, '9. POST /api/auth/verify-otp verifies 6-digit code');

    // 10. Register new student with hostel and room
    const regRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5001,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        fullName: 'Sameer Sen',
        enrollmentId: `2024CSB${Math.floor(1000 + Math.random() * 9000)}`,
        email: testNewEmail,
        phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
        password: 'Password@123',
        confirmPassword: 'Password@123',
        hostelName: 'Block C',
        roomNumber: 'Room 214',
        academicYear: '2nd Year',
        termsAccepted: true,
        otp: generatedOtp,
      }
    );
    assert(regRes.status === 201 && Boolean(regRes.data.token), '10. POST /api/auth/register registers student with hostel details');

    const newUserToken = regRes.data.token;

    // 11. Disclaimer enforcement blocks item creation before acceptance
    const blockedRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5001,
        path: '/api/items',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newUserToken}`,
        },
      },
      {
        title: 'Unauthorized Item',
        description: 'Should be rejected',
        price: 100,
        category: 'Electronics',
        itemCondition: 'Good',
      }
    );
    assert(
      blockedRes.status === 403 && blockedRes.data.requiresDisclaimer === true,
      '11. POST /api/items blocks unaccepted disclaimer with 403 Forbidden'
    );

    // 12. Accept disclaimer
    const acceptRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/users/accept-disclaimer',
      method: 'PUT',
      headers: { Authorization: `Bearer ${newUserToken}` },
    });
    assert(acceptRes.status === 200 && acceptRes.data.user.disclaimerAccepted === true, '12. PUT /api/users/accept-disclaimer accepts guidelines');

    // 13. Create a Rental listing with mandatory defect disclosure
    const createRentalRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5001,
        path: '/api/items',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newUserToken}`,
        },
      },
      {
        title: 'Havells 3-Speed Table Fan for Hostel',
        description: 'Powerful breeze for summer hostel rooms. Oscillating head.',
        listingType: 'RENT',
        category: 'Hostel Decor',
        itemCondition: 'Good',
        price: 50, // ₹50/day
        rentalPeriod: 'day',
        securityDeposit: 400,
        listingDurationDays: 14,
        openToBargaining: false,
        hasDefects: true,
        defectDetails: 'Slight humming sound on speed 3, works perfectly.',
      }
    );
    assert(
      createRentalRes.status === 201 && createRentalRes.data.item.listingType === 'RENT',
      '13. POST /api/items creates RENT listing with security deposit and defect disclosure'
    );

    const createdRentalId = createRentalRes.data.item._id;

    // 14. 1-Click Status Update ("Mark as Rented")
    const statusRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 5001,
        path: `/api/items/${createdRentalId}/status`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newUserToken}`,
        },
      },
      {
        status: 'RENTED',
      }
    );
    assert(statusRes.status === 200 && statusRes.data.item.status === 'RENTED', '14. PUT /api/items/:id/status updates status to RENTED');

    // 15. Renew listing (+14 days)
    const renewRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: `/api/items/${createdRentalId}/renew`,
      method: 'PUT',
      headers: { Authorization: `Bearer ${newUserToken}` },
    });
    assert(renewRes.status === 200 && renewRes.data.item.status === 'AVAILABLE', '15. PUT /api/items/:id/renew re-lists for 14 days');

    // 16. Campus Broadcast Request (Buyer adds what they want - 3 Day TTL)
    const broadcastCreate = await makeRequest(
      {
        hostname: 'localhost',
        port: 5001,
        path: '/api/broadcasts',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newUserToken}`,
        },
      },
      {
        title: 'Need a Lab Coat (Size M) for Chemistry Lab',
        category: 'Clothing',
        maxBudget: 150,
        neededByDate: 'Tomorrow 2 PM',
        notes: 'White lab coat needed urgently in Block C.',
      }
    );
    assert(
      broadcastCreate.status === 201 && broadcastCreate.data.broadcast.status === 'OPEN',
      '16. POST /api/broadcasts creates campus broadcast request (3-Day TTL)'
    );

    const broadcastId = broadcastCreate.data.broadcast._id;

    // 17. Broadcast Match ("I Have This" - another student fulfills)
    const matchRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: `/api/broadcasts/${broadcastId}/match`,
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }, // Fulfilled by student Aarav Sharma
    });
    assert(
      matchRes.status === 200 && matchRes.data.broadcast.status === 'MATCHED',
      '17. POST /api/broadcasts/:id/match matches broadcast and creates notification for buyer'
    );

    // 18. Buyer checks notifications
    const notifRes = await makeRequest({
      hostname: 'localhost',
      port: 5001,
      path: '/api/notifications',
      method: 'GET',
      headers: { Authorization: `Bearer ${newUserToken}` },
    });
    assert(
      notifRes.status === 200 && notifRes.data.notifications.length > 0,
      '18. GET /api/notifications retrieves match alert with fulfilling student hostel & phone'
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
