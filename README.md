# DormDeal – Campus Marketplace 🎓🛒

**DormDeal** is a modern, student-centric hyper-local campus marketplace built exclusively for college students to **Buy**, **Sell**, and **Rent** academic and hostel essentials directly from their peers.

---

## 🚀 Live Frontend Overview

DormDeal addresses the unique needs of college hostel life:
1. **Main Window (`/`)**:
   - Hero section with campus-wide search and quick links to Buy, Sell, and Rent.
   - Comprehensive category grid showcasing all 11 campus categories.
   - Recently listed products with condition badges, prices, and quick action buttons.
   - Rental spotlight section explaining short-term peer lending.
2. **Buy Page (`/buy`)**:
   - Left filter sidebar: Category filter, dynamic Price Range slider & presets, and Condition filter (Brand New, Like New, Good, Fair).
   - In-page search bar and sorting (Recently Listed, Price Low to High, Price High to Low).
   - Responsive product grid with interactive cards.
   - Modal view for inspecting photos, item specs, seller hostel room, and submitting purchase requests.
3. **Sell Page (`/sell`)**:
   - Clean product listing form with comprehensive frontend validation.
   - Required fields: Item name, Category, Minimum 3 product photos with preview and deletion, Price, Description, Open to Bargaining (Yes/No), and Defects (Yes/No).
   - **14-Day Listing Duration** guarantee prominently displayed and enforced in metadata.
   - Instant live sync: newly posted items immediately appear in the marketplace feed.
4. **Rent Page (`/rent`)**:
   - Short-term rental hub for bicycles, drafters, blazers, kettles, cameras, and room appliances.
   - Displays rental rates (e.g., ₹40/day), refundable security deposits, and real-time availability badges (Available, Currently Rented, Reserved).
   - **2-Day Listing Duration** policy for fast exam/weekend turnarounds.
   - Interactive rent booking modal with transparent pickup details.

---

## 🛠️ Technology Stack

- **React.js (v18)**: Functional components, custom hooks (`useState`, `useMemo`, `useEffect`).
- **Vite (v6)**: Lightning-fast build tool and local development server.
- **Tailwind CSS (v3)**: Utility-first styling with modern purple accents (`brand`), subtle shadows, and rounded cards.
- **React Router (v6)**: Declarative client-side routing between all 4 pages.
- **Lucide React**: Clean, accessible iconography.
- **JavaScript (ES6+)** & **HTML5**.

---

## 📂 Project Structure

```text
dormdeal/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx                 # React root mounting
│   ├── App.jsx                  # Main routing, shared state & global toasts
│   ├── index.css                # Minimal Tailwind base directives
│   ├── components/
│   │   ├── Navbar.jsx           # Responsive header with search & navigation
│   │   ├── Sidebar.jsx          # Category, price & condition filters
│   │   ├── ProductCard.jsx      # Reusable card for Buy and Rent items
│   │   ├── Footer.jsx           # Campus guidelines, safety & links
│   │   └── ItemDetailModal.jsx  # Multi-photo detail modal with purchase/rent actions
│   ├── pages/
│   │   ├── MainWindow.jsx       # Landing page with hero, categories & recents
│   │   ├── Buy.jsx              # Filterable & searchable buy marketplace
│   │   ├── Sell.jsx             # 14-day listing form with min 3 photo validation
│   │   └── Rent.jsx             # 2-day short-term rental listings & booking
│   └── data/
│       └── products.js          # Realistic mock data across all 11 categories
└── README.md
```

---

## 🏷️ Campus Product Categories

1. **Clothing** (Varsity jackets, placement blazers, hoodies)
2. **Electronics** (Scientific calculators, electric kettles, chargers)
3. **Notes** (Handwritten subject notes, formula sheets)
4. **Printouts** (Exam question banks, lab manual sets)
5. **Groceries** (Hostel snack bundles, coffee, oats)
6. **Stationery** (Mini drafters, technical drawing tools, pen sets)
7. **Hostel Decor** (Fairy string lights, study lamps, wall decor)
8. **Utensils** (Hostel plate & bowl sets, water bottles, cutlery)
9. **Skincare** (Sunscreen, cleansers, face washes)
10. **Haircare** (Compact hair dryers, grooming kits)
11. **Sports Items** (Badminton rackets, footballs, cycles)

---

## ⚙️ Installation and Execution

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🌿 Git & Collaboration Workflow

This frontend was developed on a dedicated branch:
```bash
frontend-development
```

### Notes for Collaborators:
- In accordance with team instructions, commits are **not** made directly to `main`.
- No automatic push has been performed to allow team code review.
- If you have collaborator access to [swas78/DormDeal_AP_2026](https://github.com/swas78/DormDeal_AP_2026), you can push this branch:
  ```bash
  git push -u origin frontend-development
  ```
- If you do not have direct collaborator push access, please **fork** the repository on GitHub, add your fork as a remote, and submit a Pull Request:
  ```bash
  git remote add myfork https://github.com/<YOUR_USERNAME>/DormDeal_AP_2026.git
  git push -u myfork frontend-development
  ```

