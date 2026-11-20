# DormDeal Backend: Final Engineering Architecture & Feature Specification

> **Project:** DormDeal — University Peer-to-Peer Student Marketplace & Rental Hub  
> **Target Audience:** College / University Campus & Hostel Community (e.g., Rishihood University)  
> **Course / Academic Context:** Advanced Programming & Database Management Systems (AP / DBMS 2026)  
> **Engineering Philosophy:** Clean, human-written, production-ready MVC architecture (no AI fluff, no over-engineering, zero third-party payment complexity).

---

## 1. System Philosophy & Offline-Handover Architecture

DormDeal is engineered specifically around **real-world college hostel dynamics**:
* **No On-Platform Payment Gateway**: All monetary exchanges happen in-person via UPI (Google Pay, PhonePe, Paytm) or cash at the time of physical inspection and handover. The platform acts as the **campus verification, discovery, trust, and handover contract bridge**.
* **Campus-Restricted Trust**: Every user must be a verified student with a valid University Enrollment ID, university email, and specified Hostel Block and Room Number.
* **Dual Commerce Modes**:
  1. **Direct Buy/Sell (`SELL`)**: Permanent transfer of used college items (calculators, textbooks, cycles, room furniture).
  2. **Short-Term Campus Rental (`RENT`)**: Temporary borrowing of high-utility items (lab coats, interview blazers, room coolers, DSLR cameras, camping tents) with daily/weekly rates and refundable security deposits.
* **Campus Broadcast & Match Board (`BROADCAST`)**: A reverse marketplace where buyers broadcast urgent requests (*"Need Casio 991EX for 9 AM mid-sem"*). Fellow students can click *"I Have This"*, which immediately notifies the buyer with the seller's hostel room and WhatsApp link.
* **Automated Expiry & Clean Feed**:
  - Sell & Rent listings automatically expire after **14 days (2 weeks)**.
  - Campus Broadcast requests automatically expire after **3 days (72 hours)**.
  - OTP verification codes expire after **5 minutes**.

```
+------------------------------------------------------------------------------------------------------------------------+
|                                              DORMDEAL BACKEND ARCHITECTURE                                             |
+------------------------------------------------------------------------------------------------------------------------+
|                                                                                                                        |
|      +-------------------------+     +-------------------------+     +------------------------------------------+      |
|      | 1. Student Verification | --> | 2. Dual Listing Engine  | --> | 3. Discovery & Inspection Feed           |      |
|      | - Univ Enrollment ID    |     | - SELL (14-Day TTL)     |     | - Keyword Search & Category Filter       |      |
|      | - Hostel & Room Number  |     | - RENT (Daily + Deposit)|     | - "In Your Hostel!" Proximity Badge      |      |
|      | - 6-Digit OTP (5m TTL)  |     | - BROADCAST (3-Day TTL) |     | - Mandatory Defect Disclosures           |      |
|      +-------------------------+     +-------------------------+     +--------------------+---------------------+      |
|                                                                                           |                            |
|                                      +-------------------------+                          |                            |
|                                      | 5. Direct Connect &     | <------------------------+                            |
|                                      |    Physical Meetup      |                                                       |
|                                      | - 1-Click WhatsApp Chat |                                                       |
|                                      | - Direct Call & Email   |                                                       |
|                                      | - Room Visit & Common Rm|                                                       |
|                                      +------------+------------+                                                       |
|                                                   |                                                                    |
|                                                   v                                                                    |
|                                      +-------------------------+     +------------------------------------------+      |
|                                      | 4. Handover Contracts   | --> | 6. Peer Reputation & Trust               |      |
|                                      |    (Deal State Machine) |     | - Verified Post-Deal Rating (1-5 Stars)  |      |
|                                      | - PENDING -> ACCEPTED   |     | - Dynamic Average Calculation            |      |
|                                      | - ACTIVE -> COMPLETED   |     | - Campus Trust Badges                    |      |
|                                      +-------------------------+     +------------------------------------------+      |
|                                                                                                                        |
+------------------------------------------------------------------------------------------------------------------------+
```

---

## 2. Technology Stack & Design Decisions

| Component | Technology | Version | Engineering Justification |
| :--- | :--- | :--- | :--- |
| **Runtime** | Node.js | v18+ (tested v26) | Asynchronous, event-driven JavaScript runtime ideal for I/O-heavy REST endpoints. |
| **Web Framework** | Express.js | 4.21.x | Minimalist, battle-tested HTTP framework. Clean middleware pipeline, easy route mounting. |
| **Module System** | CommonJS (`require` / `module.exports`) | - | 100% strict CommonJS to match standard Node.js university grading environments without ESM setup issues. |
| **Database & ODM** | MongoDB with Mongoose | 8.12.x | Flexible schema modeling, built-in validation, pre-save middleware, population, and native TTL indexing. |
| **Zero-Config DB Fallback** | `mongodb-memory-server` | 10.1.x | Automatically spins up an in-memory MongoDB instance if the evaluator does not have a local MongoDB running. |
| **Password Security** | `bcryptjs` | 3.0.x | Salted password hashing with 10 rounds to protect student credentials. |
| **Authentication** | `jsonwebtoken` (JWT) | 9.0.x | Stateless Bearer token sessions (`Authorization: Bearer <token>`) with 30-day validity. |
| **File / Media Storage** | `multer` | 1.4.5-lts | Multipart form data processing. Uploads stored locally in disk storage (`backend/uploads/`) with 5MB limits and MIME filters. |
| **HTTP Security** | `helmet` | 8.0.x | Secures HTTP response headers with Cross-Origin Resource Policy (CORP) enabled for static images. |
| **CORS** | `cors` | 2.8.x | Allows seamless integration with React Vite client (`http://localhost:5173`). |
| **Environment Config** | `dotenv` | 16.4.x | Clean configuration management via `.env`. |

---

## 3. Clean Project Directory Structure

```text
backend/
├── config/
│   └── db.js                      # MongoDB connection with MongoMemoryServer automatic fallback
│
├── controllers/
│   ├── authController.js          # Student registration, OTP send/verify, login, password recovery
│   ├── userController.js          # Profile view, profile update, disclaimer acceptance, user reputation
│   ├── itemController.js          # Sell & Rent CRUD, defect details, proximity filters, re-list
│   ├── broadcastController.js     # "Want to Buy / Borrow" board, broadcast requests, 1-click fulfill & match
│   ├── dealController.js          # Handover contract state machine (PENDING -> ACCEPTED -> COMPLETED)
│   ├── reviewController.js        # Post-deal peer reviews, 1-review-per-deal check, rating recalculation
│   └── notificationController.js  # In-app alerts for broadcast matches and deal updates
│
├── middleware/
│   ├── authMiddleware.js          # JWT protection ('protect') and disclaimer acceptance check ('requireDisclaimer')
│   ├── uploadMiddleware.js        # Multer disk storage, unique timestamp naming, 5MB file & image filter
│   └── errorMiddleware.js         # 404 handler and central JSON error formatting (CastError, 11000, validation)
│
├── models/
│   ├── User.js                    # Student schema with enrollmentId, hostelName, roomNumber, rating
│   ├── Item.js                    # Sell & Rent schema with 14-day TTL expiry, defect disclosures, security deposit
│   ├── BroadcastRequest.js        # "Want to Buy" request schema with 3-day TTL expiry & matching logic
│   ├── Deal.js                    # Formal handover contract schema with state machine & rental period
│   ├── Review.js                  # Peer ratings (1-5 stars) linked strictly to completed deals
│   ├── Notification.js            # In-app notifications for broadcast fulfillments & deal status changes
│   └── OTP.js                     # 6-digit one-time passcodes with 5-minute MongoDB TTL auto-deletion
│
├── routes/
│   ├── authRoutes.js              # /api/auth
│   ├── userRoutes.js              # /api/users
│   ├── itemRoutes.js              # /api/items (also aliased as /api/products for frontend compatibility)
│   ├── broadcastRoutes.js         # /api/broadcasts
│   ├── dealRoutes.js              # /api/deals
│   ├── reviewRoutes.js            # /api/reviews
│   └── notificationRoutes.js      # /api/notifications
│
├── uploads/                       # Local disk storage for student avatars and listing photographs
│   └── .gitkeep
│
├── utils/
│   ├── generateToken.js           # Signs JWT tokens with userId
│   ├── generateOTP.js             # Generates 6-digit OTP & handles dev/demo terminal logging
│   └── seeder.js                  # Pre-populates 4 campus students, realistic listings, broadcasts, and reviews
│
├── .env                           # Active environment variables
├── .env.example                   # Template environment configuration
├── package.json                   # Dependencies and scripts (start, dev, seed, test)
├── server.js                      # Central Express configuration, middleware pipeline & server listen
└── test-api.js                    # Complete automated integration test runner testing all 7 modules
```

---

## 4. Complete Feature Specifications

### Module 1: Student Verification & Campus Identity (`/api/auth` & `/api/users`)
* **Registration**: Requires `fullName`, `enrollmentId`, `email` (university format), `phone`, `password`, `hostelName` (e.g., *Block B*), `roomNumber` (e.g., *Room 304*), `academicYear` (e.g., *3rd Year CSE*), and optional `profilePhoto`.
* **6-Digit OTP Verification**: 
  - Dynamic 6-digit numerical passcode.
  - Stored in MongoDB with `expires: 300` (auto-deletes after 5 minutes).
  - Terminal demo mode allows testing without third-party SMS/email credentials.
* **Dual Login**: Students can log in using their **University Email** OR **Phone Number** with password.
* **Campus Safety Disclaimer**:
  - Mandatory acceptance before posting items or creating transactions (`disclaimerAccepted: true`).
  - Emphasizes physical inspection, safe public campus meetups, and direct cash/UPI settlement.
* **Password Security**:
  - Automatically hashed using `bcryptjs` (10 rounds) on pre-save.
  - Automatically removed from JSON representations via `toJSON()`.

---

### Module 2: Dual Listing Engine — Sell vs. Rent (`/api/items`)
* **Direct Selling (`type = 'SELL'`)**:
  - `price`: Selling price in Indian Rupees (₹).
  - `originalPrice`: Retail MRP (computes campus discount percentage).
  - `openToBargaining`: Boolean flag showing if the student is open to negotiation.
  - **Auto-Expiry**: Automatically expires in **14 days (2 weeks)**.
* **Campus Rentals (`type = 'RENT'`)**:
  - `rentalRate`: Numeric rental fee.
  - `rentalPeriod`: Pricing unit (`'hour'`, `'day'`, `'week'`, `'month'`).
  - `securityDeposit`: Mandatory refundable deposit required at physical handover.
  - `listingDurationDays`: Configurable rental cycle (`2`, `7`, `14`, or `30` days).
* **Defect Disclosures**:
  - `hasDefects`: Boolean flag.
  - `defectDetails`: Mandatory text field if `hasDefects = true` (e.g., *"Right zipper stuck, screen has hairline scratch"*).
* **Multi-Photo Gallery**:
  - Supports 1 to 5 images per item.
  - Uploaded via Multer with validation (JPEG, PNG, WEBP; max 5MB).
* **Handover Location**:
  - `pickupLocation`: Designated campus meeting spot (e.g., *"Block B Common Room"*, *"Library Ground Floor"*).
* **Item Status Lifecycle**:
  - `AVAILABLE` $\to$ `RESERVED` $\to$ `RENTED` $\to$ `SOLD` $\to$ `ARCHIVED`.
* **Re-List / Renew**:
  - Sellers can renew their listing with 1 click to extend its lifespan by another 14 days if unsold.

---

### Module 3: Campus Broadcast & Wishlist Board (`/api/broadcasts`)
*(Buyer requests that get broadcasted across campus)*
* **Broadcast Creation**:
  - A student in urgent need posts: `title`, `category`, `maxBudget`, `neededByDate`, and optional `notes`.
* **3-Day Auto-Expiration (72 Hours)**:
  - Stored with a MongoDB TTL index of 3 days (`expires: 259200`), ensuring expired exam/lab needs do not clutter the campus board.
* **1-Click Fulfill & Match**:
  - Any fellow student who has the item clicks **"I Have This / Fulfill Request"**.
  - System marks the broadcast as `MATCHED`.
  - An instant in-app notification is dispatched to the buyer:
    > *"[Seller Name] from [Hostel Name - Room No] has your requested item [Title]! Click to connect on WhatsApp or Call."*
  - Provides a direct link to the fulfilling student's contact details.

---

### Module 4: Handover Contracts & Deal State Machine (`/api/deals`)
Rather than chaotic unmanaged chats, DormDeal formalizes the transaction progression:
* **Contract Schema**:
  - Links `item`, `buyer`, `seller`, `dealType` (`'BUY'` or `'RENT'`), `agreedPrice`, `securityDepositPaid`, `rentalStartDate`, `rentalEndDate`, and `dealStatus`.
* **State Progression**:
  1. `PENDING`: Buyer requests item / rental dates.
  2. `ACCEPTED`: Seller agrees and confirms meetup location. Item status automatically switches to `RESERVED`.
  3. `ACTIVE`: Physical handover completed in hostel; rental period begins. Item switches to `RENTED` or `SOLD`.
  4. `RETURNED`: (For rentals) Item safely returned to lender; deposit returned offline. Item switches back to `AVAILABLE`.
  5. `COMPLETED`: Handover finalized. Unlocks verified peer review.
  6. `CANCELLED`: Deal aborted prior to handover. Item returns to `AVAILABLE`.

---

### Module 5: Peer Reputation & Verified Reviews (`/api/reviews`)
* **Strict Deal Verification**:
  - Reviews can **only** be submitted for deals with `dealStatus === 'COMPLETED'`.
* **Anti-Spam Guarantee**:
  - Enforces a unique compound index on `deal` to ensure strictly **1 review per deal**.
* **Dynamic Rating Recalculation**:
  - Upon submission, the backend re-computes the seller's `avg_rating` (1.00 to 5.00) and increments `rating_count`.
* **Campus Trust Badges**:
  - Badges earned: *"Verified Campus Seller"*, *"Top Hostel Lender"*, *"5-Star Peer"*.

---

### Module 6: Direct Connect & Proximity Discovery
* **1-Click WhatsApp Direct Connect**:
  - Generates direct URL: `https://wa.me/<phone>?text=<encoded_message>`.
  - Pre-fills item title, price, and buyer name for effortless communication.
* **Direct Call & University Email**:
  - Native `tel:` and `mailto:` links.
* **"In Your Hostel!" Proximity Badge**:
  - Highlights listings where `item.seller.hostelName === loggedInUser.hostelName` with a distinct badge.
* **1-Click "Mark as Sold" / "Mark as Rented"**:
  - Instant status toggle from the student's dashboard to stop incoming calls once a deal is struck.

---

## 5. College Project Suggestions (Features that Elevate Evaluation)

Here are 5 thoughtful features that demonstrate real-world engineering maturity to evaluators without adding unnecessary external dependencies:

### 1. "Knock-Knock Hours" (Preferred Contact Window)
* **Rationale**: Students have lectures, labs, and sleep schedules. Receiving WhatsApp calls at 2:00 AM or during exams is disruptive.
* **Implementation**: An optional field on listings (`contactHours`, e.g., *"5:00 PM – 9:30 PM (Classes during day)"*) displayed next to the WhatsApp button.

### 2. Copyable Rental Memo & Security Deposit Receipt
* **Rationale**: Since security deposits are exchanged in cash or personal UPI, students occasionally argue over whether a deposit was ₹500 or ₹300, or when the return was promised.
* **Implementation**: A 1-click **"Copy Rental Memo"** button that copies a formatted text agreement to the clipboard for sharing on WhatsApp:
  > *"📋 DormDeal Campus Rental Memo*\n*Item: Apple iPad Pencil*\n*Renter: Priya Patel (Block C - 204)*\n*Lender: Aarav Sharma (Block B - 304)*\n*Daily Rate: ₹50 | Security Deposit Paid: ₹500*\n*Return Date: 24 Nov 2026, 6 PM"*

### 3. "Same Hostel Block" Proximity Filter
* **Rationale**: If a student is studying in their hostel at 10:00 PM and needs a calculator or kettle, they prefer borrowing from someone in their own building rather than walking across campus.
* **Implementation**: A toggle on the dashboard: `[ ] Only show items in my hostel (Block B)`.

### 4. Campus Savings & Circular Economy Counter
* **Rationale**: College professors love sustainability metrics.
* **Implementation**: A lightweight endpoint (`GET /api/analytics/campus-impact`) computing:
  - Total items reused / exchanged on campus.
  - Total money saved by students (Sum of `originalPrice - price` across all completed deals).

### 5. Report / Spam Flag Shield
* **Rationale**: Prevents misuse (commercial vendors posting, fake hostel rooms, or offensive listings).
* **Implementation**: Simple `POST /api/items/:id/report` that flags the item for review if it receives multiple reports.

---

## 6. Complete REST API Endpoint Directory

### Authentication (`/api/auth`)
* `POST /api/auth/send-otp` — Generates 6-digit OTP (5m TTL).
* `POST /api/auth/verify-otp` — Validates OTP code.
* `POST /api/auth/register` — Registers student with enrollment ID & hostel info (Multer profile photo).
* `POST /api/auth/login` — Dual-identifier sign-in (Email OR Phone).
* `POST /api/auth/logout` — Acknowledges session sign-out.
* `POST /api/auth/reset-password` — Resets password via OTP verification.

### User & Hostel Profile (`/api/users`)
* `GET /api/users/me` — Protected student profile with hostel & rating details.
* `PUT /api/users/profile` — Updates contact, hostel, room, or avatar.
* `PUT /api/users/accept-disclaimer` — Accepts campus safety guidelines.
* `GET /api/users/:id/reputation` — Public trust score, rating, and verified reviews.

### Items & Rentals (`/api/items` & `/api/products`)
* `GET /api/items` — Public catalog with filters (`type`, `category`, `condition`, `hostel`, `search`, `minPrice`, `maxPrice`, `sort`).
* `GET /api/items/:id` — Full details, photo gallery, defect disclosures, and seller hostel card.
* `GET /api/items/user/my-listings` — Current student's active and archived listings.
* `POST /api/items` — Creates a Sell or Rent listing (up to 5 photos).
* `PUT /api/items/:id` — Updates listing details.
* `PUT /api/items/:id/status` — One-click "Mark as Sold", "Mark as Rented", or "Renew".
* `DELETE /api/items/:id` — Deletes student listing.

### Campus Broadcast / Wishlist Board (`/api/broadcasts`)
* `GET /api/broadcasts` — Public feed of active "Want to Buy/Borrow" requests (3-day TTL).
* `POST /api/broadcasts` — Posts a new broadcast request.
* `POST /api/broadcasts/:id/match` — Fellow student clicks "I Have This"; triggers notification.
* `GET /api/broadcasts/my-broadcasts` — Current user's active requests.
* `DELETE /api/broadcasts/:id` — Deletes or marks request fulfilled.

### Handover Contracts & Deals (`/api/deals`)
* `POST /api/deals` — Buyer initiates a deal/reservation.
* `GET /api/deals/my-deals` — Student's deals as buyer or seller.
* `PUT /api/deals/:id/status` — State machine transition (`accept`, `activate`, `return`, `complete`, `cancel`).

### Peer Reviews (`/api/reviews`)
* `POST /api/reviews` — Submits verified review (1-5 stars) for a completed deal.
* `GET /api/reviews/user/:userId` — Public review history for a student seller.

### Notifications (`/api/notifications`)
* `GET /api/notifications` — In-app alerts for broadcast matches and deal updates.
* `PUT /api/notifications/:id/read` — Marks notification as read.
