# Database Normalization Report: DormDeal Campus Marketplace

- **Course:** Advanced Programming & Database Management Systems (AP / DBMS)
- **Project:** DormDeal — Campus Peer-to-Peer Student Marketplace & Rental Hub
- **Team ID:** T0140 (Section D)
- **Student / Author:** Kunal Agrawal (Enrollment No: 2501010238, GitHub: `kunal-13106`)
- **Repository:** `swas78/DormDeal_AP_2026` / `potatobun321/dorm`
- **Academic Checkpoint:** Checkpoint 1 (CP1) — Data Normalization Artifact

---

## 1. Application Context & Domain Overview

**DormDeal** is a campus peer-to-peer marketplace and rental web application tailored specifically for university campus life (Rishihood University). The platform empowers university students to clear out, sell, buy, or rent college essentials within their hostel community.

### Key Functional Modules Identified in Frontend Codebase:
1. **Direct Buy/Sell (`Buy.jsx`, `Sell.jsx`):** Students list used items (scientific calculators, engineering drawing kits, semester notes, clothing, room appliances) for sale with fixed prices or open-to-bargaining flags.
2. **Campus Rental Hub (`Rent.jsx`):** High-demand items (placement blazers, bicycles, room air coolers, DSLR cameras, tents, study chairs) are listed on short-term rental cycles (default 2-day duration) with a daily rental fee and a refundable security deposit.
3. **Product Inspection & Negotiations (`ItemDetailModal.jsx`):** Prospective buyers inspect multi-photo galleries (minimum 3 photos per listing), verify defect disclosures, view seller hostel locations (Block, Room), and initiate buy/rent reservations.
4. **Peer Reviews & Campus Trust:** Students maintain peer ratings ($\star 1.0 - 5.0$) linked to completed campus handovers.

---

## 2. Unnormalized Form (UNF)

In an unnormalized monolithic view (such as a single spreadsheet, JSON dump, or flat NoSQL document), all attributes across users, item listings, categories, multiple photos, rental terms, and transactions are stored in one wide table with repeating groups and non-atomic fields.

### Unnormalized Relation Representation:
$$\text{UNF\_DORMDEAL}(\underline{\text{ListingID}}, \text{ItemName}, \text{ListingType}, \text{CategoryName}, \text{CategoryDesc}, \text{Price}, \text{OriginalPrice}, \text{Condition}, \text{DefectsBool}, \text{DefectDetails}, \text{BargainingBool}, \text{ListingDuration}, \text{RentalPeriod}, \text{SecurityDeposit}, \text{Status}, \text{SellerName}, \text{SellerEmail}, \text{SellerPhone}, \text{SellerHostel}, \text{SellerRoom}, \text{SellerYear}, \text{SellerRating}, \{\text{ImageURL}_1, \text{ImageURL}_2, \dots\}, \{\text{TransactionID}, \text{BuyerEmail}, \text{AgreedPrice}, \text{DealDate}, \text{DealStatus}\})$$

### Sample UNF Monolithic Record:
| Attribute | Sample Record Value |
|---|---|
| `listing_id` | `LIST-101` |
| `item_name` | Casio fx-991EX ClassWiz Scientific Calculator |
| `listing_type` | `BUY` |
| `category` | `Electronics` (Scientific calculation tools) |
| `price` | ₹950 |
| `original_price`| ₹1595 |
| `condition` | `Like New` |
| `defects` | `No` (None) |
| `open_to_bargaining` | `Yes` |
| `listing_duration` | `14 days` |
| `images` (Repeating Group) | `['https://img.host/calc1.jpg', 'https://img.host/calc2.jpg', 'https://img.host/calc3.jpg']` |
| `seller_details` (Composite) | Rohan Sharma, `rohan.s@college.edu`, Block B - Room 304, 3rd Year CSE, Rating: 4.9 |
| `transactions` (Repeating Group)| `{txn_id: TXN-501, buyer: 'aditya.v@college.edu', agreed_price: 900, status: 'COMPLETED'}` |

### Anomalies in UNF:
1. **Repeating Groups:** An item has multiple photo URLs and multiple historical transaction inquiries.
2. **Composite Attributes:** `seller_details` bundles name, email, department year, and room location into one string.
3. **Data Redundancy:** Seller profile and category descriptions are duplicated for every single listing created by that student.
4. **Insertion Anomaly:** A new student cannot exist in the system without listing an item.
5. **Deletion Anomaly:** If a student sells their only item and the row is deleted, their student contact and hostel profile are completely lost.
6. **Update Anomaly:** If a student changes hostels from Block B to Block C, every single active listing they posted must be updated individually.

---

## 3. First Normal Form (1NF)

### 1NF Requirements:
1. **Atomicity:** All attribute values must be atomic (indivisible single values; no comma-separated strings or embedded composite structs).
2. **Elimination of Repeating Groups:** Nested lists/arrays (e.g., photo collections, transaction logs) must be separated into discrete tuples or independent relations.
3. **Unique Identification:** Every row must have a defined primary key.

### Decomposition Steps for 1NF:
1. **Atomize Composite Attributes:**
   - Break `seller_hostel` into `hostel_name` (e.g., `Block B`) and `room_number` (e.g., `Room 304`).
   - Break `seller_name` into first and last identifiers or keep atomic name text.
2. **Flatten / Decompose Repeating Groups:**
   - The multi-valued array `images[]` is extracted into an associated entity where each tuple contains exactly one `image_url`.
   - The transaction and messaging histories are split from the listing record.

### 1NF Relation Schemas:

#### $R_1$: `FLAT_ITEMS_1NF`
$$(\underline{\text{item\_id}}, \text{title}, \text{listing\_type}, \text{category\_name}, \text{price}, \text{original\_price}, \text{item\_condition}, \text{has\_defects}, \text{defect\_details}, \text{open\_to\_bargaining}, \text{listing\_duration\_days}, \text{rental\_period}, \text{security\_deposit}, \text{status}, \text{seller\_email}, \text{seller\_name}, \text{seller\_phone}, \text{hostel\_name}, \text{room\_number}, \text{academic\_year}, \text{seller\_rating})$$

#### $R_2$: `ITEM_IMAGES_1NF`
$$(\underline{\text{item\_id}, \text{image\_url}}, \text{display\_order}, \text{is\_primary})$$

#### $R_3$: `TRANSACTIONS_1NF`
$$(\underline{\text{deal\_id}}, \text{item\_id}, \text{buyer\_email}, \text{seller\_email}, \text{deal\_type}, \text{agreed\_price}, \text{security\_deposit\_paid}, \text{deal\_status}, \text{created\_at})$$

### Candidate Keys:
- For `FLAT_ITEMS_1NF`: $\{\text{item\_id}\}$
- For `ITEM_IMAGES_1NF`: $\{\text{item\_id}, \text{image\_url}\}$
- For `TRANSACTIONS_1NF`: $\{\text{deal\_id}\}$

---

## 4. Second Normal Form (2NF)

### 2NF Requirements:
1. The relation must be in **1NF**.
2. **No Partial Dependencies:** Every non-prime attribute must be fully functionally dependent on the *entire* candidate key (applies strictly to tables with composite primary keys).

### Analysis of Functional Dependencies ($X \to Y$):

#### In `ITEM_IMAGES_1NF`:
- Composite Key: $\{\text{item\_id}, \text{image\_url}\}$
- Dependencies:
  - $(\text{item\_id}, \text{image\_url}) \to \text{display\_order}, \text{is\_primary}$
  - Here, `display\_order` and `is\_primary` depend on the specific image *for that specific item*.
  - To provide a synthetic atomic key and eliminate compound foreign references, we introduce `image_id`:
    $$\text{image\_id} \to \text{item\_id}, \text{image\_url}, \text{display\_order}, \text{is\_primary}$$
  - $\implies$ `ITEM_IMAGES` satisfies 2NF.

#### In `FLAT_ITEMS_1NF`:
Primary Key is single-column $\{\text{item\_id}\}$. By relational algebra definition, since the candidate key is a single attribute, **no partial dependency can exist**. Therefore, `FLAT_ITEMS_1NF` is automatically in 2NF.

However, transitive functional dependencies remain in `FLAT_ITEMS_1NF`:
- $\text{item\_id} \to \text{seller\_email}$
- $\text{seller\_email} \to \text{seller\_name}, \text{seller\_phone}, \text{hostel\_name}, \text{room\_number}, \text{academic\_year}, \text{seller\_rating}$
- $\text{item\_id} \to \text{category\_name}$
- $\text{category\_name} \to \text{category\_description}, \text{parent\_category}$

These transitive dependencies are resolved in 3NF.

---

## 5. Third Normal Form (3NF)

### 3NF Requirements:
1. The relation must be in **2NF**.
2. **No Transitive Dependencies:** No non-prime attribute is transitively dependent on any candidate key ($X \to Y$ and $Y \to Z$ where $Y$ is not a candidate key).
3. Alternatively, for every non-trivial functional dependency $X \to A$, either:
   - $X$ is a superkey, or
   - $A$ is a prime attribute (part of a candidate key).

### Identification & Elimination of Transitive Dependencies:

#### 1. Student / User Dependency Decomposition:
- $\text{item\_id} \to \text{seller\_id} \to \{\text{email}, \text{full\_name}, \text{phone}, \text{hostel\_name}, \text{room\_number}, \text{academic\_year}, \text{avg\_rating}\}$
- **Resolution:** Extract into an independent relation: **`USERS`**.

#### 2. Category Dependency Decomposition:
- $\text{item\_id} \to \text{category\_id} \to \{\text{category\_name}, \text{slug}, \text{description}\}$
- **Resolution:** Extract into a lookup relation: **`CATEGORIES`**.

#### 3. Deals / Transactions Decomposition:
- $\text{deal\_id} \to \{\text{item\_id}, \text{buyer\_id}, \text{seller\_id}, \text{deal\_type}, \text{agreed\_price}, \text{security\_deposit\_paid}, \text{deal\_status}, \text{rental\_start\_date}, \text{rental\_end\_date}\}$
- In 1NF/2NF, `buyer_email` and `seller_email` were non-key transitive descriptors.
- **Resolution:** Store clean foreign keys `buyer_id` and `seller_id` pointing to `USERS(user_id)`.

#### 4. Peer Communications & Reviews:
- Extracted into **`MESSAGES`** and **`REVIEWS`** to separate interaction history from transaction state.

---

### Final 3NF Relational Schemas:

#### 1. `users`
Represents student profiles participating in buying, selling, and renting.
$$\text{users}(\underline{\text{user\_id}}, \text{full\_name}, \text{email}, \text{phone}, \text{hostel\_name}, \text{room\_number}, \text{academic\_year}, \text{avg\_rating}, \text{rating\_count}, \text{created\_at})$$
- **Primary Key:** `user_id`
- **Candidate Keys:** $\{\text{user_id}\}, \{\text{email}\}, \{\text{phone}\}$
- **Functional Dependencies:**
  - $\text{user\_id} \to \text{full\_name}, \text{email}, \text{phone}, \text{hostel\_name}, \text{room\_number}, \text{academic\_year}, \text{avg\_rating}, \text{rating\_count}, \text{created\_at}$
  - $\text{email} \to \text{user\_id}, \dots$

#### 2. `categories`
Fixed taxonomy for campus essentials (Clothing, Electronics, Notes, Printouts, Stationery, etc.).
$$\text{categories}(\underline{\text{category\_id}}, \text{category\_name}, \text{slug}, \text{description})$$
- **Primary Key:** `category_id`
- **Candidate Keys:** $\{\text{category_id}\}, \{\text{category_name}\}, \{\text{slug}\}$

#### 3. `items`
Core marketplace listings (both direct sales and rental items).
$$\text{items}(\underline{\text{item\_id}}, \text{seller\_id}^*, \text{category\_id}^*, \text{title}, \text{description}, \text{listing\_type}, \text{item\_condition}, \text{price}, \text{original\_price}, \text{rental\_period}, \text{security\_deposit}, \text{listing\_duration\_days}, \text{open\_to\_bargaining}, \text{has\_defects}, \text{defect\_details}, \text{status}, \text{created\_at}, \text{updated\_at})$$
- **Primary Key:** `item_id`
- **Foreign Keys:**
  - $\text{seller\_id} \to \text{users}(\text{user\_id})$
  - $\text{category\_id} \to \text{categories}(\text{category\_id})$

#### 4. `item_images`
1-to-Many photo gallery supporting the UI requirement of minimum 3 photos per listing.
$$\text{item\_images}(\underline{\text{image\_id}}, \text{item\_id}^*, \text{image\_url}, \text{display\_order}, \text{is\_primary})$$
- **Primary Key:** `image_id`
- **Foreign Key:** $\text{item\_id} \to \text{items}(\text{item\_id})$

#### 5. `deals`
Lifecycle of handovers, sales contracts, and rental reservations.
$$\text{deals}(\underline{\text{deal\_id}}, \text{item\_id}^*, \text{buyer\_id}^*, \text{seller\_id}^*, \text{deal\_type}, \text{agreed\_price}, \text{security\_deposit\_paid}, \text{rental\_start\_date}, \text{rental\_end\_date}, \text{deal\_status}, \text{created\_at}, \text{completed\_at})$$
- **Primary Key:** `deal_id`
- **Foreign Keys:**
  - $\text{item\_id} \to \text{items}(\text{item\_id})$
  - $\text{buyer\_id} \to \text{users}(\text{user\_id})$
  - $\text{seller\_id} \to \text{users}(\text{user\_id})$

#### 6. `messages`
Negotiations between buyers and sellers regarding bargaining or pickup times.
$$\text{messages}(\underline{\text{message\_id}}, \text{deal\_id}^*, \text{item\_id}^*, \text{sender\_id}^*, \text{receiver\_id}^*, \text{content}, \text{sent\_at})$$
- **Primary Key:** `message_id`
- **Foreign Keys:**
  - $\text{deal\_id} \to \text{deals}(\text{deal\_id})$
  - $\text{item\_id} \to \text{items}(\text{item\_id})$
  - $\text{sender\_id} \to \text{users}(\text{user\_id})$
  - $\text{receiver\_id} \to \text{users}(\text{user\_id})$

#### 7. `reviews`
Peer evaluation rating following a completed deal.
$$\text{reviews}(\underline{\text{review\_id}}, \text{deal\_id}^*, \text{reviewer\_id}^*, \text{reviewee\_id}^*, \text{rating}, \text{comment}, \text{created\_at})$$
- **Primary Key:** `review_id`
- **Candidate Key:** $\{\text{deal_id}\}$ (Each completed deal permits exactly one review)
- **Foreign Keys:**
  - $\text{deal\_id} \to \text{deals}(\text{deal\_id})$
  - $\text{reviewer\_id} \to \text{users}(\text{user\_id})$
  - $\text{reviewee\_id} \to \text{users}(\text{user\_id})$

---

## 6. Boyce-Codd Normal Form (BCNF) Analysis

A relation is in BCNF if and only if for every non-trivial functional dependency $X \to Y$, the determinant $X$ is a **superkey**.

### Table-by-Table Verification:

1. **`users`:**
   - $\text{user\_id} \to \text{all attributes}$ (Determinant $\text{user\_id}$ is primary superkey).
   - $\text{email} \to \text{all attributes}$ (Determinant $\text{email}$ is unique candidate key / superkey).
   - $\text{phone} \to \text{all attributes}$ (Determinant $\text{phone}$ is unique candidate key / superkey).
   - **Conclusion: IN BCNF.**

2. **`categories`:**
   - $\text{category\_id} \to \text{all attributes}$ (Superkey).
   - $\text{category\_name} \to \text{all attributes}$ (Candidate key).
   - $\text{slug} \to \text{all attributes}$ (Candidate key).
   - **Conclusion: IN BCNF.**

3. **`items`:**
   - All functional dependencies stem from $\text{item\_id} \to \dots$, which is the primary superkey. No attribute or attribute subset determines any other non-prime attribute.
   - **Conclusion: IN BCNF.**

4. **`item_images`:**
   - $\text{image\_id} \to \{\text{item\_id}, \text{image\_url}, \text{display\_order}, \text{is\_primary}\}$. $\text{image\_id}$ is superkey.
   - $(\text{item\_id}, \text{image\_url}) \to \{\text{image\_id}, \text{display\_order}, \text{is\_primary}\}$. Composite candidate key.
   - **Conclusion: IN BCNF.**

5. **`deals`:**
   - $\text{deal\_id} \to \{\text{item\_id}, \text{buyer\_id}, \text{seller\_id}, \dots\}$. $\text{deal\_id}$ is superkey.
   - **Conclusion: IN BCNF.**

6. **`messages`:**
   - $\text{message\_id} \to \{\text{deal\_id}, \text{item\_id}, \text{sender\_id}, \text{receiver\_id}, \text{content}, \text{sent\_at}\}$. $\text{message\_id}$ is superkey.
   - **Conclusion: IN BCNF.**

7. **`reviews`:**
   - $\text{review\_id} \to \{\text{deal\_id}, \text{reviewer\_id}, \text{reviewee\_id}, \text{rating}, \text{comment}, \text{created\_at}\}$.
   - $\text{deal\_id} \to \{\text{review\_id}, \text{reviewer\_id}, \text{reviewee\_id}, \text{rating}, \text{comment}, \text{created\_at}\}$.
   - Both determinants ($\text{review\_id}$ and $\text{deal\_id}$) are candidate superkeys.
   - **Conclusion: IN BCNF.**

---

## 7. Relational Summary Matrix

| Table Name | Primary Key | Foreign Key(s) | Cardinality | Normal Form Level |
|---|---|---|---|---|
| **`users`** | `user_id` | *None* | 1 User : N Items, 1 User : N Deals | **3NF & BCNF** |
| **`categories`** | `category_id` | *None* | 1 Category : N Items | **3NF & BCNF** |
| **`items`** | `item_id` | `seller_id` $\to$ `users(user_id)`<br>`category_id` $\to$ `categories(category_id)` | N Items : 1 User<br>N Items : 1 Category | **3NF & BCNF** |
| **`item_images`** | `image_id` | `item_id` $\to$ `items(item_id)` | N Images : 1 Item (Min 3) | **3NF & BCNF** |
| **`deals`** | `deal_id` | `item_id` $\to$ `items(item_id)`<br>`buyer_id` $\to$ `users(user_id)`<br>`seller_id` $\to$ `users(user_id)` | N Deals : 1 Item<br>N Deals : 1 Buyer<br>N Deals : 1 Seller | **3NF & BCNF** |
| **`messages`** | `message_id` | `deal_id` $\to$ `deals(deal_id)`<br>`item_id` $\to$ `items(item_id)`<br>`sender_id` $\to$ `users(user_id)`<br>`receiver_id` $\to$ `users(user_id)` | N Messages : 1 Deal<br>N Messages : 2 Users | **3NF & BCNF** |
| **`reviews`** | `review_id` | `deal_id` $\to$ `deals(deal_id)` (UNIQUE)<br>`reviewer_id` $\to$ `users(user_id)`<br>`reviewee_id` $\to$ `users(user_id)` | 1 Review : 1 Deal<br>N Reviews : 1 User | **3NF & BCNF** |

---

## 8. Conclusion
The normalization process successfully decomposed the unnormalized campus marketplace representation into 7 atomic, logically sound, and dependency-preserving relational tables. All insertion, update, and deletion anomalies have been removed, achieving **Boyce-Codd Normal Form (BCNF)** across all entities.
