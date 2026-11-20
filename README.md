# DormDeal | Your Dorm. Your Deals.
### University-Exclusive Peer-to-Peer Student Marketplace and Rental Hub

Advanced Programming (AP) and Database Management Systems (DBMS) Project
Rishihood University, Sonipat

---

## About The Project

DormDeal basically college hostel ke liye banaya gaya peer-to-peer student marketplace aur rental hub hai. College campus ke andar students ko aksar sem exams ke liye drafter, calculator, lab manual ya placement drives ke liye blazers chahiye hote hain. Har baar nayi cheez khareedna mehenga padta hai, aur bahar ke platforms (jaise OLX vagera) par fraud ka risk rehta hai plus delivery campus ke andar nahi aati. 

DormDeal is problem ko solve karta hai. Sirf verified university enrollment ID wale students hi login kar sakte hain. Saari trading hostel-to-hostel hoti hai with 1-click WhatsApp connection, and physical handover ke time hi direct cash ya UPI se payment hoti hai. Platform ka koi commission ya hidden cut nahi hai.

---

## Team Members and Work Division

College evaluation aur viva ke hisab se poora project team ke beech clearly divide kiya gaya hai:

| Team Member | Username | Primary Domain | Work Done |
| :--- | :--- | :--- | :--- |
| **Swastik Mishra (Lead)** | `swas78` | Core Backend & Architecture | Auth & JWT, 6-digit OTP delivery (real email/SMS), Contract State Machine, 14-day auto-expiry TTL, Reverse Broadcast matching logic, Multer multi-image pipeline, test suite. |
| **Kunal Agrawal** | `kunal-13106` | Frontend (Catalog) & Backend Items API | Marketplace catalog, ProductCard with BUY/RENT toggles, ProductDetailModal with WhatsApp chat, SellModal, 11-category filter, and items query API (`getItems`, `getItemById`). |
| **Abhijeet Saini** | `abhijeet-s24` | Frontend (Deals/Broadcast) & Backend Alerts | Reverse Marketplace ISO board (72-hour timer), DealsFeed contract manager, ReviewModal, 30s notification polling hook, review controller, and notification routes. |
| **Tanishkka** | `Tanishkka27` | Database (DBMS) & Connection | 3NF/BCNF relational SQL schema (`03_schema.sql`), ER diagram, normalization proofs, SQL analytical queries, Mongoose models, seeder script, and database connection lifecycle. |

Detailed breakdown aur file-level ownership ke liye check karein: `PROJECT_TEAM_DIVISION.md`.

---

## Core Features (Features Kaise Kaam Karte Hain)

### 1. Direct Sale (BUY) vs Short-Term Rental (RENT)
- **Direct Sale (BUY)**: Kisi ko apni purani textbooks, study table ya room cooler permanently bechna ho. MRP vs Selling price se student ki savings dikhti hai, plus fixed price ya bargaining open ka toggle rehta hai.
- **Short-Term Rental (RENT)**: Calculator, DSLR, placement blazer ya induction kettle har student ko permanently nahi chahiye hoti. Isliye hourly, daily, weekly ya monthly rent par lene ka option hai with mandatory refundable security deposit jo item safely wapas aane par unlock ho jata hai.

### 2. Reverse Marketplace (ISO - "In Search Of" Broadcast Board)
- Agar koi item marketplace me listed nahi hai, toh student ek broadcast request daal sakta hai (jaise: *"B.Tech Sem 3 Maths 3 Handwritten Notes chahiye kal tak"*).
- Har broadcast request 3 din (72 ghante) me auto-expire ho jaati hai taaki outdated requests board par jama na hon.
- Koi bhi fellow student jiske paas wo cheez hai wo **"I Have This"** button daba sakta hai. Requester ko turant notification jaata hai with fulfilling student ka hostel block, room number aur contact number.

### 3. Handover Contract State Machine
Hostel transactions me confusion na ho isliye deals ka ek strict flow banaya gaya hai:
- `PENDING`: Buyer ne buy ya rent request daali.
- `ACCEPTED`: Seller ne accept kiya aur common room ya room par milne ka time decide hua. Item automatic `RESERVED` ho jaata hai.
- `ACTIVE`: Dono students hostel me mile, item check kiya, aur physical cash/UPI handover ho gaya.
- `RETURNED`: (Rentals ke liye) Item seller ko wapas lautaya gaya, inspection hui, aur security deposit wapas ho gaya.
- `COMPLETED`: Deal finalize ho gayi, aur seller ke liye 1 se 5 star verified rating unlock ho gayi.
- `CANCELLED`: Kisi bhi reason se agar meetup nahi ho paya toh item wapas `AVAILABLE` ho jata hai.

### 4. 1-Click WhatsApp Direct Connect
Bina kisi ka number phone me save kiye bina, buyer directly **"Chat on WhatsApp"** button dabata hai. Ye seedha `https://wa.me/<phone>?text=...` open karta hai jisme item ka naam, price aur meetup request pehle se likhi aati hai.

### 5. "In Your Hostel!" Proximity Badge
Agar item kisi aise student ne daala hai jo aapke hi hostel block me rehta hai, toh uspar green proximity badge show hota hai taaki student ko pata rahe ki use campus ke doosre kone me chalkar nahi jaana padega.

### 6. Mandatory Defect Disclosure
Agar item me koi kharabi ya scratch hai, toh `hasDefects` flag ko true karna padta hai aur explanation likhna compulsory hai. Aisa na karne par listing reject ho jaati hai.

---

## 11 Campus Categories

Hostel life aur university syllabus ke hisab se 11 categories rakhi gayi hain:
1. **Clothing**: Placement blazers, winter wear, college hoodies, ethnic formals
2. **Electronics**: Scientific calculators, kettles, extension cords, room coolers
3. **Notes**: Handwritten spiral notebooks, question banks, cheat-sheets
4. **Printouts**: Lab manuals, syllabus packets, blueprints
5. **Groceries**: Hostel midnight snacks, packaged food, beverages
6. **Stationery**: Engineering drafters, sheet holders, compass sets, markers
7. **Hostel Decor**: Study chairs, bed tables, fairy lights, organizers
8. **Utensils**: Induction pans, plates, spoons, mugs, kettles
9. **Skincare**: Daily grooming essentials, sunscreen
10. **Haircare**: Hair dryers, straighteners, styling brushes
11. **Sports Items**: Badminton racquets, dumbbells, gym gear, bicycles

---

## Database Architecture and DBMS Work

Database work Tanishkka ne handle kiya hai. Project me relational DBMS aur document database dono ka complete setup hai:

- **Relational 3NF/BCNF Schema (`dbms/03_schema.sql`)**: PostgreSQL DDL jisme foreign keys, ON DELETE CASCADE, CHECK constraints, aur indexing properly configured hai.
- **Normalization Proofs (`dbms/01_normalization.md`)**: Complete proof showing unnormalized 0NF data moving to 1NF, 2NF, 3NF aur BCNF anomalies removal.
- **ER Diagram (`dbms/02_er_diagram.svg` and `.png`)**: Visual diagram showing relationships between Users, Items, Categories, Deals, Broadcasts, Reviews, aur Notifications.
- **Analytical SQL Queries (`dbms/04_queries.sql`)**: Top sellers query, active security deposits audit, aur auto-expiry cron queries.
- **In-Memory MongoDB Support**: Evaluator ke laptop par local MongoDB installed na ho toh bhi project bina kisi configuration ke turant start ho jata hai via `mongodb-memory-server` and auto-seed ho jata hai.

---

## Tech Stack Used

- **Backend**: Node.js, Express.js (strictly CommonJS `require`), Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, Multer, Helmet, CORS, Nodemailer.
- **Frontend**: React 18, Vite 6, Tailwind CSS, Lucide React, Axios, React Router DOM v6.
- **Database**: MongoDB (Production & In-Memory fallback), PostgreSQL (DBMS 3NF DDL specifications).

---

## API Routes Summary

### Auth and User
- `POST /api/auth/send-otp`: 6-digit OTP generate karta hai (email aur SMS ke liye).
- `POST /api/auth/verify-otp`: Entered OTP code verify karta hai.
- `POST /api/auth/register`: Student registration with hostel block aur room number.
- `POST /api/auth/login`: Email ya phone number se student login.
- `POST /api/auth/reset-password`: OTP verification ke baad password reset.
- `PUT /api/users/accept-disclaimer`: Campus trading guidelines accept karna.
- `GET /api/users/me`: Current logged-in student profile.

### Marketplace Items
- `GET /api/items`: Items list with search, category aur type filter.
- `GET /api/items/:id`: Item details with seller hostel details.
- `POST /api/items`: New listing create karna (with 3-photo upload).
- `PUT /api/items/:id/status`: Item status update (`AVAILABLE`, `RENTED`, `SOLD`).
- `PUT /api/items/:id/renew`: Listing ko +14 days extend karna.
- `DELETE /api/items/:id`: Listing delete karna (only owner).

### Reverse Broadcasts (ISO)
- `GET /api/broadcasts`: Active 3-day requests list.
- `POST /api/broadcasts`: Naya urgent item request post karna.
- `POST /api/broadcasts/:id/match`: "I Have This" fulfill click, buyer ko notification bhejna.

### Deals and Handover
- `POST /api/deals`: Deal contract create karna.
- `GET /api/deals/my-deals`: Apni active aur completed deals dekhna.
- `PUT /api/deals/:id/status`: Deal status advance karna (`ACCEPTED`, `ACTIVE`, `RETURNED`, `COMPLETED`, `CANCELLED`).

### Reviews and Notifications
- `POST /api/reviews`: Completed deal par 1-5 star review dena.
- `GET /api/reviews/seller/:sellerId`: Student ke verified reviews fetch karna.
- `GET /api/notifications`: Apne account ke notifications fetch karna (30s polling).
- `PUT /api/notifications/:id/read`: Notification ko mark as read karna.

---

## Project Setup and Running Locally

### 1. Clone Repo and Install
```bash
git clone https://github.com/swas78/DormDeal_AP_2026.git
cd DormDeal_AP_2026

# Backend dependencies install
cd backend && npm install

# Frontend dependencies install
cd ../frontend && npm install
```

### 2. Environment Variables (.env)
`backend/.env` file me basic variables set rehte hain:
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/dormdeal
JWT_SECRET=dormdeal_campus_jwt_secret_key_2026
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```
*Note: Agar MongoDB installed nahi hai toh backend automatic in-memory MongoDB run karke test student data seed kar deta hai.*

### Real Email aur Phone OTP Setup (Optional)
Agar real email par OTP chahiye, toh `backend/.env` me Gmail App Password daal sakte hain:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM_NAME="DormDeal Campus Marketplace"
```
Aur SMS ke liye Fast2SMS API key:
```env
FAST2SMS_API_KEY=your_fast2sms_api_key_here
```
Jab tak credentials nahi daale hote, tab tak backend terminal console par OTP print karta hai aur testing ke liye demo hint deta hai taaki koi phase atke na.

### 3. Run Dev Server
Root directory se:
```bash
npm run dev
```
Ya fir dono ko alag alag terminals me start karein:
- Backend: `cd backend && npm start` (Runs on `http://localhost:5001`)
- Frontend: `cd frontend && npm run dev` (Runs on `http://localhost:5173`)

### 4. Test Student Accounts for Evaluation
- **Account 1**: `aarav.sharma@university.edu` | Password: `Password@123` | Hostel: Block B, Room 304
- **Account 2**: `priya.patel@university.edu` | Password: `Password@123` | Hostel: Block A, Room 108

---

## Automated Test Suite

Backend ka complete automated test suite run karne ke liye:
```bash
cd backend
npm test
```
Result: **18 passed, 0 failed** across health, auth, OTP, registration, hostel location checks, rental security deposits, auto-expiry renewal, broadcast matching, and in-app notifications.

---

DormDeal - Advanced Programming & DBMS Course Project
Rishihood University, Sonipat
Team: Swastik Mishra (Lead), Kunal Agrawal, Abhijeet Saini, Tanishkka
