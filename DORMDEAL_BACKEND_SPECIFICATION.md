# DormDeal Backend Architecture & Specification

> **Platform:** Campus Peer-to-Peer Student Marketplace & Rental Hub  
> **Institution / Target:** University Campus & Hostel Community (e.g., Rishihood University)  
> **Course:** Advanced Programming & Database Management Systems (AP / DBMS)  
> **Architecture:** Node.js, Express.js (CommonJS), MongoDB / Mongoose & PostgreSQL 3NF/BCNF Compliant Relational Mapping, JWT Authentication, Multer Media Storage

---

## 1. Executive Summary & Vision

**DormDeal** is an exclusive university campus marketplace and rental web platform tailored for student hostel living. It eliminates external scammers by restricting access to verified university students and solves the unique circular economy of a college campus:
1. **Permanent Handover (`BUY`):** Graduating seniors or advancing students sell textbooks, scientific calculators, engineering drafters, and cycles to juniors.
2. **Short-Term Campus Rental (`RENT`):** High-demand, occasional-use items (placement blazers, formal wear, room air coolers, DSLR cameras, camping tents, iron boxes, study chairs) are rented on hourly, daily, or weekly cycles with refundable security deposits.
3. **Hostel Proximity & Transparency:** Students trade by hostel block and room number, disclose defects upfront, negotiate prices via in-app messages, and complete transactions with verified peer ratings.

```
+---------------------------------------------------------------------------------------------------------+
|                                        DORMDEAL CAMPUS PLATFORM                                         |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|   +-------------------+      +-------------------+      +-------------------+      +----------------+   |
|   | Student Auth &    | ---> | Dual Listing Hub  | ---> | Handover Contract | ---> | Peer Trust &   |   |
|   | University ID     |      | (Buy vs. Rent)    |      | Lifecycle (Deals) |      | Campus Reviews |   |
|   +-------------------+      +-------------------+      +-------------------+      +----------------+   |
|            |                          |                          |                         |            |
|   +-------------------+      +-------------------+      +-------------------+              |            |
|   | Hostel & Room     |      | Defect Disclosure |      | Negotiation Chat  |              |            |
|   | Geographic Tag    |      | & 3+ Photo Matrix |      | (Deal-Linked)     |              |            |
|   +-------------------+      +-------------------+      +-------------------+              |            |
|                                                                                                         |
+---------------------------------------------------------------------------------------------------------+
```

---

## 2. Core Features Breakdown

### A. Student Verification & Campus Identity
* **University Roll / Enrollment ID**: Enforces unique, official university student credentials.
* **Dual Login**: Students can log in using their university email or registered mobile number.
* **6-Digit OTP Engine**: Built-in 5-minute auto-expiring one-time verification passcode (with dev/demo inspection mode).
* **Hostel Geography Mapping**: Profiles track `hostel_name` (e.g., *Block B*, *Aryabhatta Hall*, *Girls Hostel 2*) and `room_number` (e.g., *Room 304*).
* **Academic Standing**: Profile tags show `academic_year` (e.g., *1st Year*, *3rd Year CSE*, *Graduated Alum*).
* **Campus Trading Safety Disclaimer**: Enforced 8-point campus guideline acceptance before any user can create a listing or transaction.

### B. Dual Listing Engine (Buy / Sell vs. Campus Rental)
* **Direct Sale Mode (`BUY`)**:
  * Fixed price or `open_to_bargaining` toggle.
  * Shows discount savings compared to retail MRP (`original_price` vs `price`).
* **Short-Term Rental Hub (`RENT`)**:
  * Period-based rental pricing: `hour`, `day`, `week`, or `month`.
  * Mandatory **Refundable Security Deposit** (`security_deposit`) calculation and escrow tracking.
  * Rental period tracking with start and end dates.
* **Listing Lifespan**: Auto-expiry durations (`listing_duration_days`: 2, 7, 14, or 30 days) to prevent stale listings.
* **Defect Disclosures**: Mandatory transparency flag (`has_defects`). If true, the system enforces a descriptive explanation (`defect_details`) before submission.
* **Multi-Photo Inspection**: Support for minimum 3 photos per listing with defined ordering (`display_order`) and primary cover image (`is_primary`).
* **Item State Machine**: `AVAILABLE` $\to$ `RESERVED` $\to$ `RENTED` $\to$ `SOLD` $\to$ `ARCHIVED`.

### C. Deals & Handover Lifecycle Management (`deals`)
Instead of informal unmanaged chats, DormDeal formalizes transactions with a concrete contract state machine:
* **Contract Details**: Links `buyer_id`, `seller_id`, `item_id`, `deal_type`, `agreed_price`, and `security_deposit_paid`.
* **State Progression**:
  1. `PENDING`: Buyer requests purchase or rental dates.
  2. `ACCEPTED`: Seller approves deal and sets handover meeting. Item automatically shifts to `RESERVED`.
  3. `ACTIVE`: Physical handover completed; rental period begins. Item shifts to `RENTED` or `SOLD`.
  4. `RETURNED`: (For rentals) Item brought back to hostel and inspected; security deposit refund unlocked. Item returns to `AVAILABLE`.
  5. `COMPLETED`: Handover finalized. Rating prompt unlocked.
  6. `CANCELLED`: Deal aborted prior to handover. Item returns to `AVAILABLE`.

### D. In-App Negotiation & Handover Messages (`messages`)
* **Deal-Linked Conversations**: Chat rooms tied directly to a specific deal or item.
* **Campus Meetup Planning**: Allows students to negotiate pricing and arrange safe pickup locations (e.g., *"Block B Common Room at 6:30 PM"*).
* **Privacy Preserving**: Students negotiate inside the platform without sharing phone numbers upfront.

### E. Peer Reputation & Verified Campus Reviews (`reviews`)
* **Verified Deal Enforcement**: Only participants of a `COMPLETED` deal can submit a review.
* **Spam Prevention**: Strictly 1 review permitted per deal.
* **Dynamic Rating Recalculation**: Automatically updates the seller’s `avg_rating` (1.00 to 5.00) and `rating_count`.
* **Campus Trust Badges**: Visual indicators for reputable campus lenders/sellers.

### F. Campus Taxonomy & 11 Core Categories
1. `Clothing` (Placement blazers, winter wear, college hoodies, ethnic formals)
2. `Electronics` (Scientific calculators, kettles, extension cords, room coolers, DSLR cameras)
3. `Notes` (Handwritten spiral notebooks, question banks, lecture cheat-sheets)
4. `Printouts` (Lab manuals, syllabus packets, reference blueprints)
5. `Groceries` (Hostel snacks, packaged dry foods, beverages)
6. `Stationery` (Engineering drafters, sheet holders, compass sets, markers)
7. `Hostel Decor` (Study chairs, bed tables, fairy lights, curtains, organizers)
8. `Utensils` (Induction pans, plates, spoons, mugs, electric kettles)
9. `Skincare` (Daily personal grooming, sunscreen)
10. `Haircare` (Hair dryers, straighteners, styling brushes)
11. `Sports Items` (Badminton racquets, gym dumbbells, tents, bicycles)

---

## 3. Recommended Additional Features to Add

To make DormDeal an industry-grade, standout project, we recommend incorporating the following 6 features:

### 1. QR Code Handover Verification (Instant Anti-Dispute)
* **Problem**: In hostel handovers, a buyer might claim they never received the rented bicycle, or a seller might claim the buyer didn't return it.
* **Solution**: 
  - Upon deal acceptance, the buyer receives a dynamic 6-digit PIN and QR code on their screen.
  - At the hostel pickup spot, the seller scans the QR code (or enters the PIN).
  - The backend immediately transitions deal state to `ACTIVE` and records a timestamped proof-of-handover.
  - Same mechanism applies for the return handover of rental items.

### 2. Automated Rental Overdue Tracking & Return Reminders
* **Problem**: Students forget to return rented items (e.g. blazers before an exam or coolers before semester end).
* **Solution**:
  - Scheduled background cron worker that evaluates active rentals daily.
  - Dispatches an in-app reminder alert 24 hours before `rental_end_date`.
  - Automatically transitions deal status to `OVERDUE` if not returned on time, computing a configurable per-day late fee deducted from the security deposit.

### 3. Campus "ISO" (In Search Of) / Hostel Wishlist Board
* **Problem**: Students often need an emergency item immediately (e.g., *"Need a Drafter for Tomorrow's 9 AM Lab"* or *"Need a Size 40 Blazer for Interview in 2 hours"*), but no active listing exists.
* **Solution**:
  - A reverse-marketplace feed where students post requests (`budget`, `needed_duration`, `urgency_level`).
  - Fellow hostelites can click **"I Have This"** to instantly generate a rental deal.

### 4. Direct Hostel Proximity & Proximity Filtering
* **Problem**: Students in Block B don't want to walk across campus to Girls Hostel 3 to borrow a ₹30 calculator if someone in their own corridor has one.
* **Solution**:
  - Filter listings by:
    - `Same Hostel Block Only`
    - `Same Floor / Wing`
    - `All Campus`

### 5. Hostel SOS & Safety / Condition Dispute Reporting
* **Problem**: Misleading condition, damaged goods, or unreturned security deposits.
* **Solution**:
  - A **"Report Item / Dispute Deal"** endpoint that freezes the security deposit status and flags the incident to campus student moderators or administrators.

### 6. Real-Time Handover Alerts via WebSockets
* **Problem**: Refreshing the browser during a meetup negotiation is clunky.
* **Solution**:
  - Lightweight Socket.io integration to broadcast real-time chat messages, deal status updates, and notification bells.

---

## 4. Database Schema Specification

### Relational & Mongoose Schema Mapping

```
+------------------------------------+          +------------------------------------+
|               USERS                |          |             CATEGORIES             |
+------------------------------------+          +------------------------------------+
| PK  user_id                        |          | PK  category_id                    |
|     full_name                      |          |     category_name                  |
|     enrollment_id (UNIQUE)         |          |     slug (UNIQUE)                  |
|     email (UNIQUE)                 |          |     description                    |
|     phone (UNIQUE)                 |          +-----------------+------------------+
|     password_hash                  |                            |
|     hostel_name                    |                            |
|     room_number                    |                            |
|     academic_year                  |                            |
|     avg_rating (1.00 - 5.00)       |                            |
|     rating_count                   |                            |
|     disclaimer_accepted            |                            |
|     profile_photo                  |                            |
+-----------------+------------------+                            |
                  |                                               |
                  | 1:N                                           | 1:N
                  v                                               v
+-----------------+-----------------------------------------------+--+
|                              ITEMS                                 |
+--------------------------------------------------------------------+
| PK  item_id                                                        |
| FK  seller_id       -----------------> USERS.user_id               |
| FK  category_id     -----------------> CATEGORIES.category_id      |
|     title                                                          |
|     description                                                    |
|     listing_type                      ('BUY' | 'RENT')             |
|     item_condition                    ('Brand New' | 'Like New'..) |
|     price                             (Selling price or daily rate)|
|     original_price                    (Retail MRP)                 |
|     rental_period                     ('hour' | 'day' | 'week'..)  |
|     security_deposit                  (Refundable deposit amount)  |
|     listing_duration_days             (2 | 7 | 14 | 30)            |
|     open_to_bargaining                (BOOLEAN)                    |
|     has_defects                       (BOOLEAN)                    |
|     defect_details                    (TEXT)                       |
|     pickup_location                   (Hostel Common Room, SAC..)  |
|     status                            ('AVAILABLE' | 'RENTED'..)   |
+-----------------+--------------------------------------------------+
                  |
         +--------+----------------------------+
         | 1:N                                 | 1:N
         v                                     v
+-------------------------+      +-------------------------------------------+
|       ITEM_IMAGES       |      |                   DEALS                   |
+-------------------------+      +-------------------------------------------+
| PK  image_id            |      | PK  deal_id                               |
| FK  item_id             |      | FK  item_id                               |
|     image_url           |      | FK  buyer_id      ------> USERS.user_id   |
|     display_order       |      | FK  seller_id     ------> USERS.user_id   |
|     is_primary          |      |     deal_type     ('BUY' | 'RENT')        |
+-------------------------+      |     agreed_price                          |
                                 |     security_deposit_paid                 |
                                 |     rental_start_date                     |
                                 |     rental_end_date                       |
                                 |     handover_otp  (QR verification)       |
                                 |     deal_status   ('PENDING'..'COMPLETED')|
                                 +---------------------+---------------------+
                                                       |
                                      +----------------+----------------+
                                      | 1:N                             | 1:1 (Unique)
                                      v                                 v
                       +-------------------------------+   +---------------------------+
                       |           MESSAGES            |   |          REVIEWS          |
                       +-------------------------------+   +---------------------------+
                       | PK  message_id                |   | PK  review_id             |
                       | FK  deal_id                   |   | FK  deal_id (UNIQUE)      |
                       | FK  item_id                   |   | FK  reviewer_id           |
                       | FK  sender_id                 |   | FK  reviewee_id           |
                       | FK  receiver_id               |   |     rating (1 - 5)        |
                       |     content                   |   |     comment               |
                       |     sent_at                   |   |     created_at            |
                       +-------------------------------+   +---------------------------+
```

---

## 5. Complete REST API Specification

### Base URL: `http://localhost:5001/api`

### 1. Authentication & Student Verification (`/api/auth`)
* `POST /api/auth/send-otp`
  * **Access:** Public
  * **Payload:** `{ "identifier": "student@university.edu", "purpose": "registration" }`
  * **Output:** Generates 6-digit OTP, checks duplicate registrations, dispatches demo OTP in dev mode.
* `POST /api/auth/verify-otp`
  * **Access:** Public
  * **Payload:** `{ "identifier": "student@university.edu", "otp": "123456", "purpose": "registration" }`
  * **Output:** Verifies token and marks verified in TTL collection.
* `POST /api/auth/register`
  * **Access:** Public (Multipart Form Data)
  * **Fields:** `fullName`, `enrollmentId`, `email`, `phone`, `password`, `confirmPassword`, `hostelName`, `roomNumber`, `academicYear`, `otp`, `profilePhoto` (File)
  * **Output:** Creates user, hashes password, returns JWT token + user object.
* `POST /api/auth/login`
  * **Access:** Public
  * **Payload:** `{ "loginIdentifier": "student@university.edu", "password": "Password@123" }`
  * **Output:** Authenticates via Email OR Phone, returns JWT token + student profile.
* `POST /api/auth/logout`
  * **Access:** Public
  * **Output:** Clears session acknowledgment.
* `POST /api/auth/reset-password`
  * **Access:** Public
  * **Payload:** `{ "identifier", "otp", "newPassword", "confirmPassword" }`

### 2. User & Hostel Profile (`/api/users`)
* `GET /api/users/me`
  * **Access:** Protected (Bearer JWT)
  * **Output:** Full profile with hostel, room, rating, and disclaimer status.
* `PUT /api/users/profile`
  * **Access:** Protected (Multipart)
  * **Payload:** `fullName`, `phone`, `hostelName`, `roomNumber`, `academicYear`, `profilePhoto`
* `PUT /api/users/accept-disclaimer`
  * **Access:** Protected
  * **Output:** Sets `disclaimerAccepted = true` and records `disclaimerAcceptedAt`.
* `GET /api/users/:id/reputation`
  * **Access:** Public
  * **Output:** Public seller profile, trust score, average rating, rating count, and verified reviews list.

### 3. Products & Campus Rental Items (`/api/items` or `/api/products`)
* `GET /api/items`
  * **Access:** Public
  * **Query Params:**
    * `listingType`: `'BUY'` | `'RENT'` | `'ALL'`
    * `category`: Filter by 11 categories
    * `condition`: `'Brand New'` | `'Like New'` | `'Good'` | `'Fair'`
    * `hostel`: Filter by specific hostel block (e.g. `'Block B'`)
    * `minPrice`, `maxPrice`: Numeric filter
    * `openToBargaining`: `'true'` | `'false'`
    * `search`: Full-text keyword search across title, description, and defect details
    * `sort`: `'newest'` | `'price-asc'` | `'price-desc'` | `'rating'`
    * `page`, `limit`: Pagination parameters
* `GET /api/items/:id`
  * **Access:** Public
  * **Output:** Item details, full 3+ photo gallery, defect details, seller hostel and contact info.
* `GET /api/items/user/my-listings`
  * **Access:** Protected
  * **Output:** All listings created by current student.
* `POST /api/items`
  * **Access:** Protected + Disclaimer Required (Multipart Form Data)
  * **Fields:** `title`, `description`, `listingType` (`BUY`/`RENT`), `category`, `condition`, `price`, `originalPrice`, `rentalPeriod`, `securityDeposit`, `listingDurationDays`, `openToBargaining`, `hasDefects`, `defectDetails`, `pickupLocation`, `images` (Array of up to 5 photos)
* `PUT /api/items/:id`
  * **Access:** Protected + Owner Only
  * **Output:** Updates listing details, price, condition, or status.
* `DELETE /api/items/:id`
  * **Access:** Protected + Owner Only
  * **Output:** Permanently removes listing.

### 4. Deals & Rental Handover Contracts (`/api/deals`)
* `POST /api/deals`
  * **Access:** Protected (Buyer)
  * **Payload:** `{ "itemId", "dealType": "BUY"|"RENT", "agreedPrice", "securityDepositPaid", "rentalStartDate", "rentalEndDate" }`
  * **Output:** Creates `PENDING` deal.
* `GET /api/deals/my-deals`
  * **Access:** Protected
  * **Query:** `role=buyer` or `role=seller`
  * **Output:** List of active, pending, and completed deals.
* `PUT /api/deals/:id/status`
  * **Access:** Protected (Parties to deal)
  * **Payload:** `{ "action": "accept" | "activate" | "return" | "complete" | "cancel" }`
  * **Output:** Advances deal state machine and automatically synchronizes item inventory status.
* `POST /api/deals/:id/verify-handover`
  * **Access:** Protected (Seller / Lender)
  * **Payload:** `{ "verificationPin": "482910" }`
  * **Output:** Confirms QR/PIN handover and switches deal to `ACTIVE` or `COMPLETED`.

### 5. In-App Negotiation Chat (`/api/messages`)
* `GET /api/messages/deal/:dealId`
  * **Access:** Protected (Authorized buyer/seller only)
  * **Output:** Message log for this deal.
* `POST /api/messages`
  * **Access:** Protected
  * **Payload:** `{ "dealId", "receiverId", "content" }`
  * **Output:** Sends message and notifies receiver.

### 6. Peer Reviews & Ratings (`/api/reviews`)
* `POST /api/reviews`
  * **Access:** Protected (Deal participant)
  * **Payload:** `{ "dealId", "rating": 5, "comment": "Great condition, smooth handover in Block B!" }`
  * **Validation:** Enforces `deal_status === 'COMPLETED'` and uniqueness (1 review per deal).
  * **Output:** Saves review and automatically updates recipient's `avg_rating` and `rating_count`.
* `GET /api/reviews/user/:userId`
  * **Access:** Public
  * **Output:** Paginated reviews and ratings for a student.

### 7. Campus Analytics & Hostel Leaderboard (`/api/analytics`)
* `GET /api/analytics/hostel-leaderboard`
  * **Access:** Public
  * **Output:** Ranked list of hostels by completed deal volume and items traded.
* `GET /api/analytics/top-sellers`
  * **Access:** Public
  * **Output:** Top-rated student lenders and sellers across campus.

---

## 6. Implementation Plan & Directory Structure

To write this clean, clear, and modular, the backend structure will be:

```text
backend/
├── config/
│   └── db.js                 # Database connection & MongoMemoryServer fallback
├── controllers/
│   ├── authController.js     # OTP, registration, login, password recovery
│   ├── userController.js     # User profile, hostel assignment, disclaimer
│   ├── itemController.js     # Buy/Rent listings, defect disclosures, filters
│   ├── dealController.js     # Deal contracts, handover state machine, PIN verify
│   ├── messageController.js  # In-app negotiation chat
│   ├── reviewController.js   # Peer ratings & dynamic rating recalculation
│   └── analyticsController.js# Hostel leaderboard & campus activity stats
├── middleware/
│   ├── authMiddleware.js     # JWT protection & disclaimer check
│   ├── uploadMiddleware.js   # Multer multi-photo uploads (5MB, images only)
│   └── errorMiddleware.js    # Centralized JSON error formatting
├── models/
│   ├── User.js               # Student with hostel, room, rating, credentials
│   ├── Item.js               # Buy/Rent listing with defect details & security deposit
│   ├── Deal.js               # Transaction lifecycle with rental dates & status
│   ├── Message.js            # In-app handover and negotiation messages
│   ├── Review.js             # 1-to-5 star peer feedback (1 per deal)
│   └── OTP.js                # 5-minute TTL one-time verification tokens
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── itemRoutes.js
│   ├── dealRoutes.js
│   ├── messageRoutes.js
│   ├── reviewRoutes.js
│   └── analyticsRoutes.js
├── uploads/                  # Uploaded photo files (profile + item gallery)
├── utils/
│   ├── generateToken.js      # JWT signing utility
│   ├── generateOTP.js        # 6-digit OTP generator & simulation logging
│   └── seeder.js             # Realistic campus seeds (students, rentals, items)
├── test-api.js               # End-to-end integration test runner
├── package.json
└── server.js                 # Express server configuration & route mounting
```
