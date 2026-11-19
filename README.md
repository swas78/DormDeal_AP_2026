# CampusKart | Your Campus. Your Marketplace.

> **University-Exclusive Second-Hand Student Marketplace Platform**  
> Developed for the **Advanced Programming Course** with primary emphasis on Node.js, Express.js backend architecture, MongoDB/Mongoose data modeling, JWT authentication, and modern React (Vite & Tailwind CSS) frontend design.

---

## 📖 1. Project Overview

**CampusKart** is a modern, responsive, university-exclusive peer-to-peer marketplace (similar to OLX) tailored specifically for enrolled university students. It eliminates fraudulent external third-party listings by requiring student verification, university enrollment identifiers, and signed adherence to campus safety guidelines.

Students can trade and exchange essential campus goods across 8 specialized university categories:
- **Electronics**: Laptops, scientific calculators, iPads, monitors, adapters
- **Books & Study Material**: Course textbooks, reference books, handwritten notes, exam guides
- **Cycles**: Commute bicycles, mountain bikes, locks, helmets
- **Hostel Essentials**: Electric kettles, table fans, bed tables, storage bins
- **Furniture**: Study chairs, desks, bookshelves
- **Sports Equipment**: Badminton rackets, footballs, cricket gear
- **Fashion**: University varsity jackets, placement blazers, lab coats
- **Other Items**: Musical instruments, drawing boards, audio accessories

---

## 🛠️ 2. Technologies Used

### Backend:
- **Node.js & Express.js**: RESTful API server.
- **CommonJS Only**: Built 100% strictly using `require()` and `module.exports` (no ES Modules or `"type": "module"`).
- **MongoDB & Mongoose**: Object modeling with schemas, validation, pre-save hooks, and indexes.
- **In-Memory MongoDB Fallback**: Integrated `mongodb-memory-server` fallback so reviewers and evaluators can immediately run the backend out-of-the-box without manual MongoDB configuration!
- **bcryptjs**: Salted password hashing (10 rounds).
- **jsonwebtoken (JWT)**: Stateless token-based student session authentication.
- **Multer**: Multi-part form data processing for profile photographs and product image uploads with strict MIME-type and 5MB size validation.
- **Helmet**: HTTP security headers (cross-origin resource policies).
- **CORS**: Cross-Origin Resource Sharing configured for React Vite clients.
- **Dotenv**: Centralized environment variable management.

### Frontend:
- **React.js 18 & Vite**: Fast development server and optimized production bundling.
- **Tailwind CSS**: Custom color palette matching the official specification (`#111827`, `#4F46E5`, `#818CF8`, `#F9FAFB`, `#16A34A`, `#DC2626`).
- **React Router DOM (v6)**: Declarative client-side routing with `ProtectedRoute` guards and authentication flow redirects.
- **Axios**: HTTP client with request interceptors (JWT Bearer injection) and response error handling.
- **Lucide React**: Modern, consistent iconography.

---

## 🎨 3. Design System & Colour Palette

| Purpose | Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Navy** | Dark / Header | `#111827` | Headings, hero gradients, text primary |
| **Primary Indigo** | Brand Accent | `#4F46E5` | Primary buttons, active tabs, brand accents |
| **Secondary Indigo** | Soft Indigo | `#818CF8` | Secondary badges, borders, gradient transitions |
| **Background** | Light Grey | `#F9FAFB` | Main app background |
| **Cards & Modals** | Pure White | `#FFFFFF` | Rounded cards, dropdowns, modal windows |
| **Border** | Subtle Grey | `#E5E7EB` | Dividers, card borders, input borders |
| **Text Primary** | Deep Navy | `#111827` | Primary body text and titles |
| **Text Secondary** | Muted Grey | `#6B7280` | Subtitles, timestamps, metadata |
| **Success** | Green | `#16A34A` | Verification badges, success states |
| **Error / Alert** | Red | `#DC2626` | Form errors, delete actions, warnings |

---

## 📁 4. Project Directory Structure

```text
campusCart/
├── package.json                   # Root orchestrator (scripts: dev, start, seed, test)
├── .gitignore                     # Root gitignore
├── README.md                      # Complete system documentation
│
├── backend/                       # 100% CommonJS Node.js & Express Architecture
│   ├── .env                       # Environment variables (port, db, jwt)
│   ├── .env.example               # Example template for environment config
│   ├── .gitignore                 # Backend gitignore
│   ├── package.json               # Backend dependencies & scripts
│   ├── server.js                  # Main server entry point & middleware stack
│   ├── test-api.js                # Automated end-to-end API test runner (15/15 tests)
│   │
│   ├── config/
│   │   └── db.js                  # MongoDB & MongoMemoryServer auto-detection
│   │
│   ├── controllers/
│   │   ├── authController.js      # Register, Send/Verify OTP, Login, Logout, Reset Pwd
│   │   ├── userController.js      # Get profile, Update profile, Accept disclaimer
│   │   └── productController.js   # CRUD listings, Search, Filter, Sort, My Listings
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect & requireDisclaimer guards
│   │   ├── uploadMiddleware.js    # Multer photo upload configuration & file filters
│   │   └── errorMiddleware.js     # 404 and global JSON error formatting
│   │
│   ├── models/
│   │   ├── User.js                # Student schema, password hashing & verification
│   │   ├── Product.js             # Marketplace product schema with categories/conditions
│   │   └── OTP.js                 # 5-minute TTL one-time verification tokens
│   │
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth routes
│   │   ├── userRoutes.js          # /api/users routes
│   │   └── productRoutes.js       # /api/products routes
│   │
│   ├── uploads/                   # Uploaded student images (with .gitkeep)
│   │   └── .gitkeep
│   │
│   └── utils/
│       ├── generateToken.js       # JWT generation utility
│       ├── generateOTP.js         # 6-digit OTP generator & delivery simulator
│       └── seeder.js              # Campus students & 15 realistic seed items
│
└── frontend/                      # React.js + Vite + Tailwind CSS Single-Page App
    ├── index.html                 # HTML shell with Inter typography & favicon
    ├── package.json               # Frontend dependencies & scripts
    ├── vite.config.js             # Vite configuration with API & Uploads proxy
    ├── tailwind.config.js         # Exact colour palette & custom shadows
    ├── postcss.config.js          # PostCSS & Tailwind integration
    ├── .gitignore                 # Frontend gitignore
    │
    └── src/
        ├── App.jsx                # React Router setup & ProtectedRoute guards
        ├── main.jsx               # React DOM root
        ├── index.css              # Tailwind base & smooth transitions
        │
        ├── context/
        │   └── AuthContext.jsx    # User session, JWT persistence, login/register/logout
        │
        ├── services/
        │   └── api.js             # Axios client with auto Bearer token injection
        │
        ├── components/
        │   ├── Navbar.jsx         # Responsive navigation, sell button, profile dropdown
        │   ├── Footer.jsx         # Branding, campus guidelines & course info
        │   ├── ProductCard.jsx    # Card with ₹ price, condition badge, seller & actions
        │   ├── CategoryCard.jsx   # Interactive cards for 8 campus categories
        │   ├── SearchBar.jsx      # Keyword search + Category/Condition/Price filters
        │   ├── ProtectedRoute.jsx # Route guard enforcing authentication & disclaimer
        │   ├── LoadingSpinner.jsx # Clean animated spinner component
        │   ├── DisclaimerCard.jsx # 8-point official university guidelines & acceptance
        │   ├── ProductDetailModal.jsx # Full item preview with direct seller call/email
        │   ├── SellModal.jsx      # "Sell an Item" form with photo upload & preview
        │   └── ForgotPasswordModal.jsx # Password recovery modal using OTP
        │
        └── pages/
            ├── SplashScreen.jsx   # Page 1: Opening splash screen with loading & routing
            ├── RegisterPage.jsx   # Page 2: Student registration with OTP & photo upload
            ├── DisclaimerPage.jsx # Page 3: Mandatory campus trading guidelines acceptance
            ├── LoginPage.jsx      # Page 4: Student sign-in with quick autofill demo helper
            └── DashboardPage.jsx  # Page 5: Main OLX-style student marketplace dashboard
```

---

## ⚡ 5. Installation & Execution Guide

### Prerequisites:
- **Node.js**: v18.0.0 or higher (v24.x tested)
- **npm**: v9.0.0 or higher

### Step 1: Install Dependencies
From the project root directory (`campusCart`):
```bash
npm run install:all
```
*(This installs root, backend, and frontend dependencies in one step).*

---

### Step 2: Configure Environment Variables
A configured `.env` file is already created in `backend/.env`. You can verify or tweak values:

```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/campuskart
JWT_SECRET=campuskart_super_secret_jwt_key_2026_university_market
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```
> **Note on Database**: If you have a local MongoDB running on `mongodb://127.0.0.1:27017/campuskart`, it will connect to it. If not, the application automatically boots up an in-memory MongoDB instance via `mongodb-memory-server` with zero configuration needed!

---

### Step 3: Run the Application
You can run both backend and frontend together with a single command from the project root:

```bash
npm run dev
```

Alternatively, you can run backend and frontend in separate terminal tabs:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server runs at: http://localhost:5001
# Health check: http://localhost:5001/api/health
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Vite runs at: http://localhost:5173
```

---

### Step 4: Seed Initial Data (Optional)
The backend automatically checks on startup if the database is empty and auto-seeds 4 student accounts and 15 realistic campus products!
You can also manually re-seed at any time:
```bash
npm run seed
# or: cd backend && npm run seed
```

**Demo Student Credentials (Pre-seeded):**
- **Email**: `aarav.sharma@university.edu`
- **Phone**: `+91 98765 43210`
- **Password**: `Password@123`
- *(Tip: On the Login screen, click the **"Autofill Credentials"** button for instant one-click login!)*

---

### Step 5: Run Automated Backend Tests
We included an automated end-to-end test suite testing all 15 endpoints:
```bash
npm run test
# or: cd backend && npm test
```
**Test Result**: 15 / 15 Passed!

---

## 📡 6. Complete REST API Documentation

### Base URL: `http://localhost:5001/api`

### A. Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description | Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/send-otp` | Public | Dispatches 6-digit verification OTP | `{ "identifier": "student@university.edu", "purpose": "registration" }` |
| `POST` | `/api/auth/verify-otp` | Public | Verifies the OTP code | `{ "identifier": "student@university.edu", "otp": "123456" }` |
| `POST` | `/api/auth/register` | Public | Registers a new student (Multer upload for `profilePhoto`) | `fullName, enrollmentId, email, phone, password, confirmPassword, termsAccepted, otp` |
| `POST` | `/api/auth/login` | Public | Authenticates student with email OR phone | `{ "loginIdentifier": "student@university.edu", "password": "Password@123" }` |
| `POST` | `/api/auth/logout` | Public | Invalidates/clears student session | None |
| `POST` | `/api/auth/reset-password` | Public | Resets password using OTP | `{ "identifier", "otp", "newPassword", "confirmPassword" }` |

### B. User Endpoints (`/api/users`)
| Method | Endpoint | Access | Description | Payload |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/users/me` | Protected | Returns authenticated student profile | Requires `Bearer <JWT_TOKEN>` |
| `PUT` | `/api/users/profile` | Protected | Updates profile photo and contact info | `fullName, phone, profilePhoto (multipart)` |
| `PUT` | `/api/users/accept-disclaimer` | Protected | Records acceptance of campus guidelines | Sets `disclaimerAccepted: true` |

### C. Product Marketplace Endpoints (`/api/products`)
| Method | Endpoint | Access | Description | Payload / Query Params |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Lists products with search & filters | `?search=...&category=...&condition=...&minPrice=...&maxPrice=...&sort=...` |
| `GET` | `/api/products/:id` | Public | Returns single product with populated seller | URL param `:id` |
| `GET` | `/api/products/user/my-listings` | Protected | Returns current student's listings | Requires `Bearer <JWT_TOKEN>` |
| `POST` | `/api/products` | Protected + Disclaimer | Creates listing (Multer upload for `images`) | `title, description, price, category, condition, images` |
| `PUT` | `/api/products/:id` | Protected + Owner | Updates listing details or price | `title, description, price, category, condition, status` |
| `DELETE` | `/api/products/:id` | Protected + Owner | Permanently removes student listing | URL param `:id` |

---

## 🖥️ 7. The 5 Core Pages & User Experience

### 1. Opening / Splash Screen (`/`)
- CampusKart branding, animated floating marketplace illustrations, and tagline *"Your Campus. Your Marketplace."*
- Dynamic gradient in Primary Navy (`#111827`) and Primary Indigo (`#4F46E5`).
- Intelligent auto-routing:
  - If authenticated & disclaimer accepted $\to$ `/dashboard`
  - If authenticated & disclaimer not accepted $\to$ `/disclaimer`
  - If unauthenticated $\to$ `/login` (with manual fast-track buttons)

### 2. Student Registration Page (`/register`)
- Comprehensive university fields: Full Name, Enrollment ID, University Email, Phone Number, Profile Photo upload (with real-time preview), Set Password, Confirm Password, OTP Verification, and Terms Checkbox.
- Live password strength meter (Weak, Moderate, Strong).
- OTP dispatch & verification modal with developer demo mode hint for effortless grading.
- Multer file validation (max 5MB, JPEG/PNG/WEBP only).
- Success notification and immediate transition to the Disclaimer page.

### 3. Disclaimer Page (`/disclaimer`)
- Pristine white card on light background with indigo headers and alert badges.
- All 8 official campus trading rules:
  1. Platform acts only as a connection medium.
  2. Buyers verify item condition and authenticity.
  3. Meetups restricted to safe public campus zones (Library, Cafeteria, SAC).
  4. Never share passwords or OTPs.
  5. Avoid advance payments or fraudulent requests.
  6. CampusKart is not liable for private student disputes.
  7. Genuine student enrollment data required.
  8. Misconduct or fraud results in campus authority escalation and account ban.
- Enforced route protection: blocks marketplace dashboard access until the student checks the agreement box and clicks **Accept & Continue**.

### 4. Login Page (`/login`)
- Dual-mode identifier: sign in using registered University Email OR Phone number.
- Password show/hide toggle.
- "Forgot Password?" dialog with 6-digit OTP reset.
- "Remember this browser" option.
- One-click **"Autofill Credentials"** banner for reviewers.

### 5. Main Dashboard (`/dashboard`)
- **Header**: Brand logo, notifications bell with campus alerts, and user avatar dropdown with student name, enrollment ID, verified badge, and sign-out option.
- **Section A (Welcome Hero)**: Personal greeting ("Welcome back, [Student Name]!"), marketplace stats, and quick-action buttons ("Sell an Item", "My Listings").
- **Section B (Search & Filter Bar)**: Full-text keyword search across titles and descriptions, condition filter (New, Like New, Good, Used), price range min/max filter, and sorting (Newest, Price: Low-to-High, Price: High-to-Low).
- **Section C (Categories Grid)**: 8 category cards with icons, item counts, and active filter highlights.
- **Section D (Product Grid)**: High-resolution cards displaying condition pill, category, formatted price (₹), student seller name, listing date, and "View Details" button.
- **Section E (Interactive Modals)**:
  - **Product Details Modal**: Multi-photo view, full description, seller profile, and direct **"Call Seller"** (`tel:`) and **"Email Seller"** (`mailto:`) buttons.
  - **Sell an Item Modal**: Clean modal with live image upload preview, category dropdown, condition picker, and price input.
  - **Delete Confirmation Modal**: Prevents accidental deletion of listings.

---

## 🔒 8. Security & Best Practices

1. **Password Security**: Passwords are never stored in plain text; hashed using `bcryptjs` with salt rounds = 10.
2. **Access Control**: Strict JWT token verification; routes enforce that users can only edit or delete products that belong to their own student account (`product.seller.toString() === req.user._id.toString()`).
3. **Data Sanitization**: Mongoose schemas enforce types, trims, and regex matching. Passwords are automatically omitted from JSON responses.
4. **HTTP Security Headers**: `helmet()` protects against common web vulnerabilities.
5. **CORS Isolation**: Restricts API calls to approved origins (`http://localhost:5173`).
6. **File Upload Restrictions**: Multer checks file size (< 5MB) and rejects non-image MIME types.
7. **Production vs. Demo OTP Separation**: Demo OTPs are only exposed in dev mode when SMS/email credentials are not configured, and never disclosed in production.

