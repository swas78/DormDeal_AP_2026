# DormDeal Project Team Work Division & Responsibility Matrix

> **Project:** DormDeal — University-Exclusive Peer-to-Peer Student Marketplace & Rental Hub  
> **Course:** Advanced Programming & Database Management Systems (AP / DBMS)  
> **Institution:** Rishihood University  

---

## 👥 Executive Summary of Team Roles

The workload is split strategically according to module complexity, frontend UX, database engineering, and core backend architecture:

| Team Member | Primary Domain | Core Responsibilities | Backend Contribution (Simple & Clear) |
| :--- | :--- | :--- | :--- |
| **Swastik (Lead)** | **Core Backend & Architecture** | Auth & JWT, Contract State Machine, Auto-Expiry TTL Engine, Reverse Marketplace Matching, Multer Uploads | 80% Core Backend Architecture & Security |
| **Kunal** | **Frontend (Part 1: Catalog & Listings)** | Product Cards (BUY/RENT), Detail Modal + WhatsApp Chat, Sell/Rent Dual Modal, 11-Category Search Filter | Items Query & Category Controller (`getItems`, `getItemById`) |
| **Abhijeet** | **Frontend (Part 2: Deals & Broadcasts)** | ISO 3-Day Countdown Board, Handover Contracts Feed, Review Modal, 30s Notification Polling Hook | Reviews & Notifications Controller (`createReview`, `getMyNotifications`) |
| **Tanishka** | **Database Architecture & DBMS** | 3NF/BCNF Relational Schema (`03_schema.sql`), ER Diagram & Normalization (`01_normalization.md`), SQL Queries, Mongoose Models, DB Seeder | Database Connection Lifecycle (`config/db.js`) & Health Check (`/api/health`) |

---

## 1. 👑 Swastik — Project Lead & Core Backend Architecture

Swastik designs and owns the foundational engine, security layers, transaction lifecycle, and server reliability.

### Key Deliverables:
1. **Authentication & Identity Security**:
   - `backend/controllers/authController.js`: Full student registration with enrollment ID uniqueness, hostel block & room tracking.
   - JWT stateless token issuance and verification middleware (`backend/middleware/authMiddleware.js`).
   - `bcryptjs` password encryption (salt rounds = 10).
   - Random 6-digit OTP engine with dual delivery (Nodemailer SMTP for real emails + SMS gateway fallback).
   - Campus trading safety disclaimer gating (`disclaimerAccepted` checks with HTTP 403 enforcement).
2. **Deals & Handover Contract State Machine**:
   - `backend/controllers/dealController.js`: Formal transaction state machine (`PENDING` $\to$ `ACCEPTED` $\to$ `ACTIVE` $\to$ `RETURNED` $\to$ `COMPLETED` $\to$ `CANCELLED`).
   - Security deposit tracking and escrow release rules for short-term rentals.
   - Protection against unauthorized deal updates (only verified buyer or seller).
3. **Auto-Expiry Engine & Lifecycle Automation**:
   - 14-day auto-TTL for marketplace listings (`expiresAt`).
   - One-click listing renewal endpoint (`PUT /api/items/:id/renew`) extending duration by +14 days.
   - Automatic archiving when marked as SOLD or RENTED.
4. **Reverse Marketplace Matchmaking Engine**:
   - `backend/controllers/broadcastController.js`: "I Have This!" fulfillment logic (`POST /api/broadcasts/:id/match`).
   - Auto-generation of buyer notifications containing the fulfilling student's hostel, room, and WhatsApp contact.
5. **Multer Multi-Image Pipeline**:
   - Multi-part upload processing for student profile photos and 3-photo product inspection galleries.
   - Strict MIME-type checking and 5MB payload limits.
6. **Dual-Mode Database & Server Reliability**:
   - In-Memory MongoDB fallback (`mongodb-memory-server`) allowing zero-config evaluator testing.
   - Automated test suite with 18 unit/integration tests passing (`node test-api.js`).

---

## 2. 🎨 Kunal — Frontend (Marketplace Catalog) & Backend (Items Read API)

Kunal owns the visual discovery layer of the marketplace where students browse, filter, inspect, and list physical campus goods.

### Frontend Ownership:
- **`src/components/ProductCard.jsx`**:
  - Direct sale (`BUY`) vs Short-term rental (`RENT`) badge rendering.
  - Item condition pills (*Brand New*, *Like New*, *Gently Used*, *Heavily Used*).
  - Defect alert tag (warns buyers if defects exist before opening).
  - **"In Your Hostel!"** proximity badge (compares logged-in student's hostel block with seller's hostel block).
  - Seller lifecycle management buttons: *"Mark as Sold"*, *"Mark as Rented"*, *"Renew +14d"*.
- **`src/components/ProductDetailModal.jsx`**:
  - Multi-photo gallery preview with thumbnail switcher.
  - Retail MRP savings calculation (`originalPrice` vs `price`).
  - Mandatory defect disclosure box (`hasDefects` & `defectDetails`).
  - **1-Click WhatsApp Quick-Chat**: Auto-formats `https://wa.me/<phone>?text=<encoded_text>` pre-filling item title, price, and hostel meetup request.
  - Direct student phone call (`tel:`) and university email (`mailto:`) action buttons.
  - Handover deal initiation button (`Request Purchase / Rent`).
- **`src/components/SellModal.jsx`**:
  - Dual-mode listing toggle: **Direct Sale (BUY)** vs **Short-Term Rental (RENT)**.
  - Rental pricing rate selector: per hour, day, week, or month.
  - Mandatory refundable security deposit input.
  - Transparent defect disclosure checkbox enforcing an explanation.
  - Multi-photo drag-and-drop uploader (minimum 3 photos, cover selection).
- **`src/components/SearchBar.jsx`**:
  - Live debounced keyword search bar across titles and descriptions.
  - Horizontal scrollable pill filter for the 11 university taxonomy categories.
  - Sorting dropdown (Price Low-to-High, High-to-Low, Newest First).

### Backend Contribution (Simple & Clear):
- **`backend/controllers/itemController.js` (Read & Search Queries)**:
  - `getItems`: Simple Mongoose query fetching listings with filtering:
    ```javascript
    // Filter by category, type (SELL/RENT), and keyword search regex
    const query = { status: 'AVAILABLE' };
    if (category) query.category = category;
    if (type) query.listingType = type;
    if (search) query.title = { $regex: search, $options: 'i' };
    ```
  - `getItemById`: Fetching a single listing by ID and populating the seller's name, hostel block, and room number.
- **`backend/routes/itemRoutes.js`**:
  - Routing `GET /api/items` and `GET /api/items/:id`.

---

## 3. 📢 Abhijeet — Frontend (Deals & Broadcast) & Backend (Reviews & Alerts)

Abhijeet owns the collaborative and social features of DormDeal: the Reverse Marketplace (ISO Board), contract management, and post-transaction feedback.

### Frontend Ownership:
- **`src/components/broadcast/BroadcastFeed.jsx` & `BroadcastCard.jsx`**:
  - Campus ISO ("In Search Of") reverse marketplace board.
  - Dynamic 3-day (72-hour) live countdown timer showing hours remaining before auto-expiry.
  - Urgency indicators (*Urgent*, *Today*, *Flexible*).
  - 1-Click **"I Have This!"** fulfillment button: allows any student with the requested item to immediately notify the requester.
- **`src/components/broadcast/BroadcastModal.jsx`**:
  - Clean form for students to broadcast urgent campus item needs (title, category, budget, urgency level, notes).
- **`src/components/deals/DealsFeed.jsx`**:
  - Contract management dashboard displaying active and completed handovers.
  - Step-by-step state tracker: `PENDING` $\to$ `ACCEPTED` $\to$ `ACTIVE` $\to$ `RETURNED` $\to$ `COMPLETED`.
  - Offline handover confirmation buttons (Approve Handover, Return Rental, Finalize Deal).
- **`src/components/deals/ReviewModal.jsx`**:
  - Post-transaction review dialog allowing verified participants of `COMPLETED` deals to leave 1-5 star ratings and comments.
- **`src/hooks/useNotifications.js`**:
  - 30-second live polling hook fetching notifications from `/api/notifications`.
  - Unread badge counter in the navigation bar.

### Backend Contribution (Simple & Clear):
- **`backend/controllers/reviewController.js`**:
  - `createReview`:
    - Checks if deal status is `COMPLETED`.
    - Verifies strictly 1 review per deal.
    - Saves the 1 to 5 star rating and recalculates the seller's overall `avgRating`:
      ```javascript
      // Simple rating recalculation
      const allReviews = await Review.find({ seller: deal.seller });
      const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await User.findByIdAndUpdate(deal.seller, { avgRating: avg.toFixed(2), ratingCount: allReviews.length });
      ```
  - `getSellerReviews`: Retrieves all peer reviews for a student.
- **`backend/controllers/notificationController.js`**:
  - `getMyNotifications`: Simple endpoint fetching alerts where `recipient = req.user._id`.
  - `markAsRead`: Simple update toggling `read = true`.

---

## 4. 🗄️ Tanishka — Database Architecture (DBMS) & Backend Connection

Tanishka leads the relational and document data modeling, database design documentation, ER diagramming, SQL workloads, and server connection initialization.

### DBMS & Database Ownership:
- **Relational DDL Schema (`dbms/03_schema.sql`)**:
  - Complete PostgreSQL DDL implementing 3NF/BCNF normalization.
  - Primary keys, foreign key constraints with `ON DELETE CASCADE`, check constraints (`CHECK (price >= 0)`, `CHECK (rating BETWEEN 1 AND 5)`).
  - Performance B-Tree indexes on `expires_at`, `category_id`, `seller_id`, and `hostel_name`.
- **Normalization Proofs (`dbms/01_normalization.md`)**:
  - Detailed academic proof tracing 0NF unnormalized student transactions through 1NF, 2NF, 3NF, and BCNF.
  - Elimination of insertion, update, and deletion anomalies.
- **Entity Relationship Model (`dbms/02_er_diagram.svg` / `.png`)**:
  - Visual ER diagram illustrating cardinalities (1:1, 1:N) between `USERS`, `CATEGORIES`, `ITEMS`, `ITEM_IMAGES`, `BROADCAST_REQUESTS`, `DEALS`, `REVIEWS`, and `NOTIFICATIONS`.
- **Analytical & Workload Queries (`dbms/04_queries.sql`)**:
  - Practical SQL queries for evaluating platform health:
    - *Query 1*: Top student sellers ranked by verified deal count and average rating.
    - *Query 2*: Active rental escrow security deposits currently held.
    - *Query 3*: Automated cron query finding expired listings (`expires_at < NOW()`).
    - *Query 4*: Hostel block density analysis (trading volume across Block A, B, and C).
- **DBMS Documentation (`dbms/DATABASE_DOCUMENTATION.md`)**:
  - Comprehensive report detailing schema architecture, indexing strategy, transaction isolation levels, and ACID compliance.
- **Mongoose Data Models (`backend/models/`)**:
  - Translating relational tables into Mongoose document schemas (`User.js`, `Item.js`, `BroadcastRequest.js`, `Deal.js`, `Review.js`, `Notification.js`, `OTP.js`).
- **Database Seeder (`backend/utils/seeder.js`)**:
  - Script populating realistic Rishihood University student accounts, catalog items with defects/deposits, and sample ISO broadcasts.

### Backend Contribution (Simple & Clear):
- **`backend/config/db.js` (Database Connection Handler)**:
  - Clean Mongoose connection logic:
    ```javascript
    const mongoose = require('mongoose');

    const connectDB = async () => {
      try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
      } catch (err) {
        console.error(`[Database Error]: ${err.message}`);
        // Triggers in-memory fallback if local MongoDB is offline
      }
    };
    ```
- **Health Check Route (`GET /api/health`)**:
  - Simple ping endpoint returning server uptime, environment, and MongoDB connection status.

---

## 📊 Summary Responsibility Matrix

```
                      DORMDEAL PROJECT ARCHITECTURE
  =======================================================================
  
  [ FRONTEND - REACT 18 + VITE + TAILWIND ]
  ├─ Marketplace Catalog & Detail Modals ─────── Kunal
  ├─ Dual Sell/Rent Listing Form ─────────────── Kunal
  ├─ Category Filter & Search Bar ────────────── Kunal
  │
  ├─ Reverse Marketplace ISO Board ───────────── Abhijeet
  ├─ Deals Handover Contract Manager ─────────── Abhijeet
  ├─ Post-Handover 1-5 Star Reviews ──────────── Abhijeet
  └─ Live Notifications Polling ──────────────── Abhijeet

  [ BACKEND - NODE.JS + EXPRESS.JS ]
  ├─ Auth, JWT, OTP & Security Middleware ────── Swastik (Lead)
  ├─ Handover Deals State Machine ────────────── Swastik (Lead)
  ├─ Auto-Expiry Engine (14d/3d TTL) ─────────── Swastik (Lead)
  ├─ Reverse Broadcast Matchmaking Engine ────── Swastik (Lead)
  ├─ Multer Multi-Photo Pipeline ─────────────── Swastik (Lead)
  │
  ├─ Items Catalog Read & Search APIs ────────── Kunal (Simple API)
  ├─ Reviews & Notifications APIs ────────────── Abhijeet (Simple API)
  └─ Health Ping & DB Connection Handler ─────── Tanishka (Simple API)

  [ DATABASE - DBMS & MONGOOSE ]
  ├─ 3NF/BCNF Relational SQL Schema ──────────── Tanishka
  ├─ ER Diagram & Normalization Proofs ───────── Tanishka
  ├─ Workload & Analytical SQL Queries ───────── Tanishka
  ├─ Mongoose Schemas & DB Seeder ────────────── Tanishka
  └─ DBMS Architecture Documentation ────────── Tanishka
  =======================================================================
```
