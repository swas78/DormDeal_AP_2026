# DormDeal Database Architecture and DBMS Documentation

Course: Advanced Programming and Database Management Systems (AP / DBMS)  
System: DormDeal - Campus Peer-to-Peer Student Marketplace & Rental Hub  
Database Architecture Lead: Tanishkka  
Core Backend Lead: Swastik Mishra  
Schema Location: `dbms/03_schema.sql` (PostgreSQL 3NF/BCNF Relational DDL)  
Queries Location: `dbms/04_queries.sql` (Workload & Transaction Queries)  
NoSQL ODM: Node.js + Express.js + Mongoose (Document Mapping)  

---

## 1. Overview (Database Kaise Design Kiya Hai)

DormDeal ka database basically campus circular economy ko model karta hai. Har student apne university enrollment ID, university email, phone number aur hostel block/room number se mapped rehta hai. 

Relational model me humne strict 3NF/BCNF normalization use ki hai taaki insertion, deletion aur update anomalies na aayen. Application runtime ke liye MongoDB + Mongoose use kiya hai with embedded document arrays taaki listing images aur items fast load ho sakein.

### Core Tables / Collections:
1. `users`: Enrolled students ka data (name, enrollment ID, hostel name, room number, avg rating).
2. `categories`: 11 standard campus categories.
3. `items`: Direct sale (`SELL`) aur short-term rental (`RENT`) listings with defect details, security deposit, aur 14-day expiry timestamp (`expires_at`).
4. `item_images`: Items ke photos (multi-photo ordering ke sath).
5. `broadcast_requests`: Reverse marketplace requests (jaise: *"Calculator chahiye exam ke liye"*), jo 3 din me auto-expire ho jaati hain.
6. `deals`: Handover contract state machine (`PENDING` -> `ACCEPTED` -> `ACTIVE` -> `RETURNED` -> `COMPLETED` -> `CANCELLED`).
7. `reviews`: Completed deals par 1 se 5 star feedback. Strictly 1 review per deal.
8. `notifications`: In-app alerts jab broadcast match ho ya deal status update ho.

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
