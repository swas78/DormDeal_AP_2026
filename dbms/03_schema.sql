-- ============================================================
-- DormDeal Campus Marketplace Schema (PostgreSQL 15+)
-- Course: Advanced Programming & Database Management Systems
-- ============================================================

CREATE SCHEMA IF NOT EXISTS dormdeal;
SET search_path TO dormdeal, public;

-- Drop existing tables if restarting (ordered to respect foreign key constraints)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS deals CASCADE;
DROP TABLE IF EXISTS broadcast_requests CASCADE;
DROP TABLE IF EXISTS item_images CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ------------------------------------------------------------
-- 1. USERS: Student accounts participating in buying, selling, and renting
-- ------------------------------------------------------------
CREATE TABLE users (
    user_id         SERIAL PRIMARY KEY,
    full_name       VARCHAR(100) NOT NULL,
    enrollment_id   VARCHAR(50) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE
                    CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone           VARCHAR(20) UNIQUE,
    hostel_name     VARCHAR(100) NOT NULL, -- e.g. 'Block B', 'Aryabhatta Hall', 'Girls Hostel 1'
    room_number     VARCHAR(30) NOT NULL,  -- e.g. 'Room 304', 'Room 208'
    academic_year   VARCHAR(50) DEFAULT '1st Year', -- e.g. '1st Year', '2nd Year', '3rd Year CSE'
    profile_photo   TEXT DEFAULT '',
    avg_rating      NUMERIC(3,2) DEFAULT 5.00
                    CHECK (avg_rating BETWEEN 1.00 AND 5.00),
    rating_count    INT DEFAULT 0
                    CHECK (rating_count >= 0),
    disclaimer_accepted BOOLEAN DEFAULT FALSE,
    disclaimer_accepted_at TIMESTAMPTZ,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. CATEGORIES: Taxonomy for items (11 core campus categories)
-- ------------------------------------------------------------
CREATE TABLE categories (
    category_id     SERIAL PRIMARY KEY,
    category_name   VARCHAR(50) NOT NULL UNIQUE,
    slug            VARCHAR(50) NOT NULL UNIQUE,
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 3. ITEMS: Marketplace listings for direct sale (SELL) or rental (RENT)
-- ------------------------------------------------------------
CREATE TABLE items (
    item_id               SERIAL PRIMARY KEY,
    seller_id             INT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    category_id           INT NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
    title                 VARCHAR(255) NOT NULL,
    description           TEXT NOT NULL,
    listing_type          VARCHAR(10) NOT NULL
                          CHECK (listing_type IN ('SELL', 'RENT')),
    item_condition        VARCHAR(20) NOT NULL
                          CHECK (item_condition IN ('Brand New', 'Like New', 'Good', 'Fair')),
    price                 NUMERIC(10,2) NOT NULL
                          CHECK (price >= 0),
    original_price        NUMERIC(10,2)
                          CHECK (original_price IS NULL OR original_price >= price),
    rental_period         VARCHAR(20) DEFAULT 'day'
                          CHECK (rental_period IN ('hour', 'day', 'week', 'month')),
    security_deposit      NUMERIC(10,2) DEFAULT 0.00
                          CHECK (security_deposit >= 0),
    listing_duration_days INT NOT NULL DEFAULT 14
                          CHECK (listing_duration_days IN (2, 7, 14, 30)),
    open_to_bargaining    BOOLEAN DEFAULT FALSE,
    has_defects           BOOLEAN DEFAULT FALSE,
    defect_details        TEXT,
    status                VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE'
                          CHECK (status IN ('AVAILABLE', 'RESERVED', 'RENTED', 'SOLD', 'ARCHIVED')),
    expires_at            TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '14 days'),
    created_at            TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    -- Business logic constraints
    CONSTRAINT chk_rent_security CHECK (
        listing_type <> 'RENT' OR security_deposit IS NOT NULL
    ),
    CONSTRAINT chk_defects_explained CHECK (
        has_defects = FALSE OR (defect_details IS NOT NULL AND LENGTH(TRIM(defect_details)) > 0)
    )
);

-- ------------------------------------------------------------
-- 4. ITEM_IMAGES: Photo gallery (1 to 5 images per listing)
-- ------------------------------------------------------------
CREATE TABLE item_images (
    image_id        SERIAL PRIMARY KEY,
    item_id         INT NOT NULL REFERENCES items(item_id) ON DELETE CASCADE,
    image_url       TEXT NOT NULL,
    display_order   INT NOT NULL DEFAULT 1
                    CHECK (display_order >= 1),
    is_primary      BOOLEAN DEFAULT FALSE,
    uploaded_at     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_item_image_order UNIQUE (item_id, display_order)
);

-- ------------------------------------------------------------
-- 5. BROADCAST_REQUESTS: Buyer "Want to Buy / Borrow" requests (3-Day TTL)
-- ------------------------------------------------------------
CREATE TABLE broadcast_requests (
    broadcast_id    SERIAL PRIMARY KEY,
    buyer_id        INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    category_id     INT NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
    title           VARCHAR(120) NOT NULL,
    max_budget      NUMERIC(10,2) NOT NULL CHECK (max_budget >= 0),
    needed_by_date  VARCHAR(50) DEFAULT 'Today',
    notes           TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'OPEN'
                    CHECK (status IN ('OPEN', 'MATCHED', 'EXPIRED')),
    matched_by      INT REFERENCES users(user_id) ON DELETE SET NULL,
    matched_at      TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ DEFAULT (CURRENT_TIMESTAMP + INTERVAL '3 days'),
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 6. DEALS: Formal transaction contracts for sales and rentals
-- ------------------------------------------------------------
CREATE TABLE deals (
    deal_id                 SERIAL PRIMARY KEY,
    item_id                 INT NOT NULL REFERENCES items(item_id) ON DELETE RESTRICT,
    buyer_id                INT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    seller_id               INT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    deal_type               VARCHAR(10) NOT NULL
                            CHECK (deal_type IN ('SELL', 'RENT')),
    agreed_price            NUMERIC(10,2) NOT NULL
                            CHECK (agreed_price >= 0),
    security_deposit_paid   NUMERIC(10,2) DEFAULT 0.00
                            CHECK (security_deposit_paid >= 0),
    rental_start_date       DATE,
    rental_end_date         DATE,
    deal_status             VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                            CHECK (deal_status IN ('PENDING', 'ACCEPTED', 'ACTIVE', 'RETURNED', 'COMPLETED', 'CANCELLED')),
    created_at              TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at            TIMESTAMPTZ,

    CONSTRAINT chk_different_parties CHECK (buyer_id <> seller_id),
    CONSTRAINT chk_valid_rental_dates CHECK (
        deal_type <> 'RENT' OR (rental_start_date IS NOT NULL AND rental_end_date >= rental_start_date)
    )
);

-- ------------------------------------------------------------
-- 7. REVIEWS: Peer rating evaluations after transaction completion
-- ------------------------------------------------------------
CREATE TABLE reviews (
    review_id       SERIAL PRIMARY KEY,
    deal_id         INT NOT NULL UNIQUE REFERENCES deals(deal_id) ON DELETE CASCADE,
    reviewer_id     INT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    reviewee_id     INT NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    rating          INT NOT NULL
                    CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_distinct_review_parties CHECK (reviewer_id <> reviewee_id)
);

-- ------------------------------------------------------------
-- 8. NOTIFICATIONS: In-app alerts for broadcast matches & deal updates
-- ------------------------------------------------------------
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    recipient_id    INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    sender_id       INT REFERENCES users(user_id) ON DELETE SET NULL,
    title           VARCHAR(150) NOT NULL,
    message         TEXT NOT NULL,
    notification_type VARCHAR(30) DEFAULT 'BROADCAST_MATCH',
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEXES for Query Optimization & Lookups
-- ============================================================
CREATE INDEX idx_items_seller_id ON items(seller_id);
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_listing_type ON items(listing_type);
CREATE INDEX idx_items_price ON items(price);
CREATE INDEX idx_items_expires_at ON items(expires_at);

CREATE INDEX idx_broadcasts_buyer ON broadcast_requests(buyer_id);
CREATE INDEX idx_broadcasts_status ON broadcast_requests(status);
CREATE INDEX idx_broadcasts_expires_at ON broadcast_requests(expires_at);

CREATE INDEX idx_deals_buyer_id ON deals(buyer_id);
CREATE INDEX idx_deals_seller_id ON deals(seller_id);
CREATE INDEX idx_deals_item_id ON deals(item_id);
CREATE INDEX idx_deals_status ON deals(deal_status);

CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);

-- ============================================================
-- SEED DATA: 11 Core Campus Categories
-- ============================================================
INSERT INTO categories (category_name, slug, description) VALUES
('Clothing', 'clothing', 'Placement blazers, winter wear, campus hoodies, and formals'),
('Electronics', 'electronics', 'Calculators, kettles, chargers, room coolers, and cameras'),
('Notes', 'notes', 'Handwritten spiral notebooks and subject question banks'),
('Printouts', 'printouts', 'Lab manuals, syllabus packets, and reference sheets'),
('Groceries', 'groceries', 'Hostel snacks, packaged foods, and beverages'),
('Stationery', 'stationery', 'Mini drafters, sheet holders, compass sets, and markers'),
('Hostel Decor', 'hostel-decor', 'Study chairs, bed tables, fairy lights, and organizers'),
('Utensils', 'utensils', 'Induction pans, plates, spoons, mugs, and electric kettles'),
('Skincare', 'skincare', 'Daily personal grooming and sunscreen essentials'),
('Haircare', 'haircare', 'Dryers, hair straighteners, and grooming accessories'),
('Sports Items', 'sports-items', 'Badminton racquets, gym dumbbells, tents, and bicycles');
