# DormDeal Project Team Work Division

Project: DormDeal - Campus Peer-to-Peer Student Marketplace & Rental Hub  
Course: Advanced Programming (AP) & Database Management Systems (DBMS)  
Institution: Rishihood University, Sonipat  

---

## Team Members and Roles Overview

Yeh project chaar logon ke team ne banaya hai. Har member ka scope clear rakha gaya hai taaki viva aur evaluation ke time sab apna apna module independently explain kar sakein:

| Member | GitHub Username | Domain | Core Focus |
| :--- | :--- | :--- | :--- |
| **Swastik Mishra (Lead)** | `swas78` | Core Backend & Architecture | Auth, JWT, OTP, Handover State Machine, Auto-Expiry TTL, Multer, Test Suite (~80% Backend). |
| **Kunal Agrawal** | `kunal-13106` | Frontend Catalog & Items Query API | Marketplace cards, BUY/RENT toggles, WhatsApp deep-link, 11-category search filters, items read controller. |
| **Abhijeet Saini** | `abhijeet-s24` | Frontend Deals/Broadcast & Alerts API | ISO Broadcast board (72h timer), Deals contract flow, Review modal, live notification polling, reviews/alerts routes. |
| **Tanishkka** | `Tanishkka27` | Database Architecture (DBMS) & Connection | 3NF/BCNF relational SQL schema, ER diagram, normalization proofs, SQL analytical queries, Mongoose schemas, seeder, DB connection lifecycle. |

---

## 1. Swastik Mishra - Project Lead and Core Backend Architecture

Swastik ne core backend system, security layers, transaction lifecycle aur server stability design ki hai:

### Key Work Done:
1. **Authentication and Student Security**:
   - `backend/controllers/authController.js`: Student registration jisme enrollment ID uniqueness, hostel block aur room number mandatory hai.
   - JWT token issuance aur stateless verification middleware (`backend/middleware/authMiddleware.js`).
   - Salted password hashing with `bcryptjs` (salt rounds = 10).
   - Random 6-digit OTP delivery system jisme real email (Nodemailer) aur SMS gateway support hai with terminal console fallback for local testing.
   - Campus trading safety disclaimer gating (`disclaimerAccepted` check with HTTP 403 enforcement).
2. **Handover Contract State Machine**:
   - `backend/controllers/dealController.js`: Deals ka state machine (`PENDING` -> `ACCEPTED` -> `ACTIVE` -> `RETURNED` -> `COMPLETED` -> `CANCELLED`).
   - Short-term rentals ke liye refundable security deposit tracking.
   - Unauthorized access protection (sirf deal ka buyer ya seller hi status update kar sakta hai).
3. **Auto-Expiry Engine**:
   - 14-day auto-TTL for marketplace listings (`expiresAt`).
   - One-click listing renewal endpoint (`PUT /api/items/:id/renew`) jo duration ko +14 days extend kar deta hai.
   - Item SOLD ya RENTED hone par automatic inventory archive.
4. **Reverse Marketplace Matchmaking**:
   - `backend/controllers/broadcastController.js`: "I Have This!" fulfillment logic (`POST /api/broadcasts/:id/match`).
   - Buyer ko automatic notification dispatch jisme fulfilling student ka hostel, room number aur contact number included hota hai.
5. **Multer Multi-Image Pipeline**:
   - Profile photos aur product ke 3 inspection images ka upload handler with MIME-type and 5MB size validation.
6. **In-Memory MongoDB Support and Test Suite**:
   - `mongodb-memory-server` automatic fallback jisse kisi bhi laptop par project bina install kiye turant chal jaata hai.
   - 18 automated integration tests passing (`node test-api.js`).

---

## 2. Kunal Agrawal - Frontend Catalog and Items Read API

Kunal ne marketplace discovery layer banaya hai jahan students items browse, filter aur list karte hain:

### Frontend Responsibilities:
- `src/components/ProductCard.jsx`:
  - BUY (direct sale) aur RENT (short-term rental) badges.
  - Item condition pills (Brand New, Like New, Gently Used, Heavily Used).
  - Defect alert tag (agar item me scratch ya fault hai toh pehle hi alert dikhta hai).
  - "In Your Hostel!" proximity badge (logged-in student aur seller ka hostel block compare karke).
  - Seller lifecycle actions ("Mark as Sold", "Mark as Rented", "Renew +14d").
- `src/components/ProductDetailModal.jsx`:
  - Multi-photo gallery preview with thumbnail switcher.
  - Retail MRP savings calculation (`originalPrice` vs `price`).
  - Mandatory defect disclosure box.
  - 1-Click WhatsApp Quick-Chat button (`https://wa.me/<phone>?text=...`) jisme item ka naam aur price auto-filled hota hai.
  - Direct call (`tel:`) aur email (`mailto:`) buttons.
- `src/components/SellModal.jsx`:
  - Dual-mode listing toggle: Direct Sale vs Short-Term Rental.
  - Hourly, daily, weekly ya monthly rental period selector.
  - Refundable security deposit input.
  - Multi-photo drag-and-drop uploader.
- `src/components/SearchBar.jsx`:
  - Debounced search bar across title and description.
  - 11 campus category horizontal pill filters.
  - Sorting dropdown (Price Low-to-High, High-to-Low, Newest).

### Backend Contribution:
- `backend/controllers/itemController.js` (Read & Search Operations):
  - `getItems`: Simple Mongoose query jisme category, type (SELL/RENT), aur keyword search regex filtered rehte hain.
  - `getItemById`: Single item lookup with seller name, hostel block aur room number populated.
- `backend/routes/itemRoutes.js`: Routing for `GET /api/items` and `GET /api/items/:id`.

---

## 3. Abhijeet Saini - Frontend Deals/Broadcast and Backend Alerts

Abhijeet ne platform ke social, ISO broadcast aur transaction lifecycle components design kiye hain:

### Frontend Responsibilities:
- `src/components/broadcast/BroadcastFeed.jsx` aur `BroadcastCard.jsx`:
  - Reverse Marketplace board jahan students apni zarooratein post karte hain.
  - 3-day (72-hour) live countdown timer.
  - Urgency indicators (Urgent, Today, Flexible).
  - 1-Click "I Have This!" fulfill button.
- `src/components/broadcast/BroadcastModal.jsx`:
  - Urgent item request create karne ka form.
- `src/components/deals/DealsFeed.jsx`:
  - Active aur completed handovers ka contract tracker (`PENDING` se lekar `COMPLETED` tak).
  - Physical handover confirm karne ke buttons.
- `src/components/deals/ReviewModal.jsx`:
  - Deal complete hone par 1 se 5 star verified rating aur review comment modal.
- `src/hooks/useNotifications.js`:
  - 30-second polling hook for in-app notifications.

### Backend Contribution:
- `backend/controllers/reviewController.js`:
  - `createReview`: Check karta hai ki deal `COMPLETED` hai ya nahi, duplicate review rokta hai, aur seller ka overall `avgRating` recalculate karta hai.
  - `getSellerReviews`: Student profile ke verified reviews fetch karna.
- `backend/controllers/notificationController.js`:
  - `getMyNotifications`: Logged-in user ke notifications retrieve karna.
  - `markAsRead`: Notification ko read mark karna.

---

## 4. Tanishkka - Database Architecture (DBMS) and DB Connection

Tanishkka ne poora relational aur document database architecture handle kiya hai:

### Database (DBMS) Responsibilities:
- **Relational DDL Schema (`dbms/03_schema.sql`)**:
  - PostgreSQL 3NF/BCNF DDL with primary keys, foreign keys with ON DELETE CASCADE, CHECK constraints, aur performance B-Tree indexes.
- **Normalization Proofs (`dbms/01_normalization.md`)**:
  - Unnormalized 0NF data se lekar 1NF, 2NF, 3NF aur BCNF tak ka formal proof.
  - Insertion, update aur deletion anomalies ka removal explanation.
- **Entity Relationship Model (`dbms/02_er_diagram.svg` aur `.png`)**:
  - Visual ER diagram jisme Users, Items, Categories, Deals, Broadcasts, Reviews aur Notifications ka 1:1 aur 1:N cardinality mapped hai.
- **Analytical SQL Queries (`dbms/04_queries.sql`)**:
  - Top student sellers query, active security deposits audit, aur auto-expiry cron queries.
- **DBMS Documentation (`dbms/DATABASE_DOCUMENTATION.md`)**:
  - Complete documentation on database indexing, ACID compliance aur transaction isolation.
- **Mongoose Data Models (`backend/models/`)**:
  - Mongoose schemas (`User.js`, `Item.js`, `BroadcastRequest.js`, `Deal.js`, `Review.js`, `Notification.js`, `OTP.js`).
- **Database Seeder (`backend/utils/seeder.js`)**:
  - Test student accounts aur campus items generate karne ka script.

### Backend Contribution:
- `backend/config/db.js`:
  - Database connection lifecycle handler (connecting to MongoDB URI, handling connection errors, aur fallback trigger karna).
- Health Check Route (`GET /api/health`):
  - Server status, uptime aur MongoDB connection check karne ka endpoint.

---

## Summary Responsibility Flow

```
                      DORMDEAL WORKFLOW
  =======================================================================
  
  [ FRONTEND - REACT 18 + VITE + TAILWIND ]
  |-- Marketplace Catalog & Detail Modals -------- Kunal
  |-- Dual Sell/Rent Listing Form ---------------- Kunal
  |-- Category Filter & Search Bar --------------- Kunal
  |
  |-- Reverse Marketplace ISO Board -------------- Abhijeet
  |-- Deals Handover Contract Manager ------------ Abhijeet
  |-- Post-Handover 1-5 Star Reviews ------------- Abhijeet
  `-- Live Notifications Polling ----------------- Abhijeet

  [ BACKEND - NODE.JS + EXPRESS.JS ]
  |-- Auth, JWT, OTP & Security Middleware ------- Swastik (Lead)
  |-- Handover Deals State Machine --------------- Swastik (Lead)
  |-- Auto-Expiry Engine (14d/3d TTL) ------------ Swastik (Lead)
  |-- Reverse Broadcast Matchmaking Engine ------- Swastik (Lead)
  |-- Multer Multi-Photo Pipeline ---------------- Swastik (Lead)
  |
  |-- Items Catalog Read & Search APIs ----------- Kunal (Simple API)
  |-- Reviews & Notifications APIs --------------- Abhijeet (Simple API)
  `-- Health Ping & DB Connection Handler -------- Tanishkka (Simple API)

  [ DATABASE - DBMS & MONGOOSE ]
  |-- 3NF/BCNF Relational SQL Schema ------------- Tanishkka
  |-- ER Diagram & Normalization Proofs ---------- Tanishkka
  |-- Workload & Analytical SQL Queries ---------- Tanishkka
  |-- Mongoose Schemas & DB Seeder --------------- Tanishkka
  `-- DBMS Architecture Documentation ----------- Tanishkka
  =======================================================================
```
