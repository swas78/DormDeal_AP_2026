# DormDeal Database Architecture & DBMS Documentation

> **Course:** Advanced Programming & Database Management Systems (AP / DBMS)  
> **System:** DormDeal — Campus Peer-to-Peer Student Marketplace & Rental Hub  
> **Database Architecture Lead:** Tanishka  
> **Core Backend Lead:** Swastik  
> **Schema Location:** `dbms/03_schema.sql` (PostgreSQL 3NF/BCNF Relational DDL)  
> **Queries Location:** `dbms/04_queries.sql` (Workload & Transaction Queries)  
> **NoSQL ODM:** Node.js + Express.js + Mongoose (Document Mapping)

---

## 1. Domain Overview & Entity Relationships

The DormDeal database model represents a campus-contained circular economy. Every user is a student tied to university credentials and a specific campus hostel block and room number.

### Core Relational Entities:
1. **`users`**: Represents enrolled students. Contains university enrollment ID, university email, phone number, hostel name, room number, academic year, and dynamically updated average trust ratings.
2. **`categories`**: Taxonomy of 11 campus categories (`Clothing`, `Electronics`, `Notes`, `Printouts`, `Groceries`, `Stationery`, `Hostel Decor`, `Utensils`, `Skincare`, `Haircare`, `Sports Items`).
3. **`items`**: Marketplace listings supporting both direct permanent sale (`SELL`) and short-term rentals (`RENT`). Includes pricing, defect disclosures, refundable security deposits, and a 14-day auto-expiry timestamp (`expires_at`).
4. **`item_images`**: Multi-photo gallery linked to items with ordering (`display_order`) and primary image flag (`is_primary`).
5. **`broadcast_requests`**: Reverse marketplace where students post what they need (*"Need Casio 991EX for tomorrow"*). Auto-expires after 3 days. Fellow students can click *"I Have This"* to fulfill the request.
6. **`deals`**: Formal transaction contract state machine (`PENDING` $\to$ `ACCEPTED` $\to$ `ACTIVE` $\to$ `RETURNED` $\to$ `COMPLETED` $\to$ `CANCELLED`), linking buyer, seller, and item.
7. **`reviews`**: Post-deal verified evaluations (1 to 5 stars + comments). Strictly 1 review per completed deal.
8. **`notifications`**: In-app alerts when a broadcast request is matched or a deal progresses.

```
+-----------------------------------------------------------------------------------------------------------------+
|                                           ENTITY RELATIONSHIP OVERVIEW                                          |
+-----------------------------------------------------------------------------------------------------------------+
|                                                                                                                 |
|   +-----------------------+              +-----------------------+              +---------------------------+   |
|   |         USERS         |              |      CATEGORIES       |              |    BROADCAST_REQUESTS     |   |
|   +-----------------------+              +-----------------------+              +---------------------------+   |
|   | PK  user_id           |              | PK  category_id       |              | PK  broadcast_id          |   |
|   |     enrollment_id (UQ)|              |     category_name (UQ)| <------+     | FK  buyer_id      (USERS) |   |
|   |     email         (UQ)|              |     slug          (UQ)|        |     | FK  category_id (CATEGOR) |   |
|   |     hostel_name       |              +-----------+-----------+        |     |     title, budget, notes  |   |
|   |     room_number       |                          |                    |     |     status, expires_at    |   |
|   |     avg_rating        |                          | 1:N                |     +---------------------------+   |
|   +-----------+-----------+                          |                    |                                     |
|               |                                      |                    |                                     |
|               +-----------------------+              |                    |                                     |
|               | 1:N (as seller)       | 1:N          v                    |                                     |
|               v                       v     +--------+------------+       |                                     |
|   +-----------+-----------+   +-------+---+ |        ITEMS        |       |                                     |
|   |     NOTIFICATIONS     |   |  REVIEWS  | +---------------------+       |                                     |
|   +-----------------------+   +-----------+ | PK  item_id         |       |                                     |
|   | PK  notification_id   |   | review_id | | FK  seller_id       |-------+                                     |
|   | FK  recipient_id      |   | FK deal_id| | FK  category_id     |                                             |
|   |     title, message    |   | rating    | |     listing_type    | ('SELL' | 'RENT')                           |
|   +-----------------------+   +-----+-----+ |     price, deposit  |                                             |
|                                     |       |     has_defects     |                                             |
|                                     | 1:1   |     expires_at (14d)|                                             |
|                                     v       +----------+----------+                                             |
|                               +-----+-------+          |                                                        |
|                               |    DEALS    |          | 1:N                                                    |
|                               +-------------+          v                                                        |
|                               | PK deal_id  |   +------+------+                                                 |
|                               | FK item_id  |   | ITEM_IMAGES |                                                 |
|                               | FK buyer_id |   +-------------+                                                 |
|                               | FK seller_id|   | PK image_id |                                                 |
|                               | deal_status |   | FK item_id  |                                                 |
|                               +-------------+   +-------------+                                                 |
|                                                                                                                 |
+-----------------------------------------------------------------------------------------------------------------+
```

---

## 2. Relational Schema Normalization Analysis

### First Normal Form (1NF)
* **Atomicity**: All attributes are strictly atomic (no comma-separated lists or nested structs).
* **Elimination of Repeating Groups**: Multi-photo collections are factored into `item_images` with atomic `image_url` fields.
* **Primary Keys**: Every relation has a designated synthetic atomic primary key (`SERIAL PRIMARY KEY`).

### Second Normal Form (2NF)
* In tables with single-attribute primary keys (`users`, `items`, `deals`, `reviews`, `categories`, `broadcast_requests`), **no partial dependencies can exist**.
* In `item_images`, the composite natural key `(item_id, display_order)` is synthesized by `image_id`, satisfying 2NF.

### Third Normal Form (3NF) & Boyce-Codd Normal Form (BCNF)
* **Elimination of Transitive Dependencies**:
  - Student hostel contact information is isolated in `users` rather than duplicated inside `items` or `deals`.
  - Category descriptions are isolated in `categories`.
* **Superkey Verification**:
  - In `users`: `user_id`, `email`, and `enrollment_id` are candidate superkeys.
  - In `reviews`: `review_id` and `deal_id` are candidate superkeys (ensuring strictly 1 review per deal).
  - Every non-trivial functional dependency $X \to Y$ has a determinant $X$ that is a candidate superkey $\implies$ **All relations achieve BCNF**.

---

## 3. Relational (PostgreSQL) vs. Document (Mongoose / MongoDB) Mapping

The project provides dual compatibility: the academic relational specification in PostgreSQL and the runtime execution in Node.js + Mongoose:

| Relational Table (`dbms/03_schema.sql`) | Mongoose Model (`backend/models/`) | Storage Strategy |
| :--- | :--- | :--- |
| `users` | `User.js` | Single document collection; pre-save bcrypt hook, password omitted on `toJSON()`. |
| `categories` | `Item.js` (Enum constraint) | Embedded string enum across 11 validated categories. |
| `items` + `item_images` | `Item.js` | Denormalized array of photo path strings (`images: [String]`) embedded directly in the item document for $O(1)$ photo retrieval. |
| `broadcast_requests` | `BroadcastRequest.js` | Collection with native MongoDB 3-day TTL index (`expires: 259200`). |
| `deals` | `Deal.js` | References `Item`, `User` (buyer), and `User` (seller). |
| `reviews` | `Review.js` | Compound unique index `{ deal: 1 }` ensuring 1 review per deal. |
| `notifications` | `Notification.js` | Indexed on `recipient` for fast unread count retrieval. |

---

## 4. Key Database Constraints & Integrity Rules

1. **Defect Transparency Constraint**:
   ```sql
   CONSTRAINT chk_defects_explained CHECK (
       has_defects = FALSE OR (defect_details IS NOT NULL AND LENGTH(TRIM(defect_details)) > 0)
   )
   ```
   Ensures sellers cannot flag an item as defective without explaining the flaw.

2. **Rental Deposit Integrity Constraint**:
   ```sql
   CONSTRAINT chk_rent_security CHECK (
       listing_type <> 'RENT' OR security_deposit IS NOT NULL
   )
   ```
   Ensures rental listings define the required refundable deposit.

3. **Distinct Deal Parties Constraint**:
   ```sql
   CONSTRAINT chk_different_parties CHECK (buyer_id <> seller_id)
   ```
   Prevents students from transacting with themselves.

4. **1-Review-Per-Deal Uniqueness**:
   ```sql
   deal_id INT NOT NULL UNIQUE REFERENCES deals(deal_id) ON DELETE CASCADE
   ```
   Eliminates spam reviews by guaranteeing exactly 1 review per transaction.
