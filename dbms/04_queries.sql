-- ============================================================
-- DormDeal Campus Marketplace Workload Queries (PostgreSQL 15+)
-- Course: Advanced Programming & Database Management Systems
-- Team ID: T0140 | Student: Kunal Agrawal (2501010238)
-- Repository: swas78/DormDeal_AP_2026 / potatobun321/dorm
-- Academic Artifact: dbms/04_queries.sql
-- ============================================================

SET search_path TO dormdeal, public;

-- ------------------------------------------------------------
-- READ QUERIES (R01 - R15)
-- ------------------------------------------------------------

-- @R01: Fetch all active items for sale with primary image and seller hostel (Buy.jsx feed)
-- READ
SELECT 
    i.item_id,
    i.title,
    c.category_name,
    i.price,
    i.original_price,
    i.item_condition,
    i.open_to_bargaining,
    i.has_defects,
    img.image_url AS primary_image,
    u.full_name AS seller_name,
    u.hostel_name,
    u.room_number,
    u.avg_rating AS seller_rating
FROM items i
JOIN categories c ON c.category_id = i.category_id
JOIN users u ON u.user_id = i.seller_id
LEFT JOIN item_images img ON img.item_id = i.item_id AND img.is_primary = TRUE
WHERE i.listing_type = 'BUY' 
  AND i.status = 'AVAILABLE'
ORDER BY i.created_at DESC;

-- @R02: Filter available rentals by category and price range (Rent.jsx filter)
-- READ
SELECT 
    i.item_id,
    i.title,
    c.category_name,
    i.price AS rental_rate_per_day,
    i.security_deposit,
    i.listing_duration_days,
    i.status AS availability_status,
    u.full_name AS owner_name,
    u.hostel_name,
    u.room_number,
    u.avg_rating
FROM items i
JOIN categories c ON c.category_id = i.category_id
JOIN users u ON u.user_id = i.seller_id
WHERE i.listing_type = 'RENT'
  AND (c.category_name = 'Electronics' OR 'All' = 'Electronics')
  AND i.status IN ('AVAILABLE', 'RESERVED')
ORDER BY i.price ASC;

-- @R03: Full details of a single listing with image gallery and defect disclosures (ItemDetailModal.jsx)
-- READ
SELECT 
    i.item_id,
    i.title,
    i.description,
    i.listing_type,
    i.item_condition,
    i.price,
    i.original_price,
    i.rental_period,
    i.security_deposit,
    i.open_to_bargaining,
    i.has_defects,
    i.defect_details,
    i.pickup_location,
    i.status,
    c.category_name,
    u.user_id AS seller_id,
    u.full_name AS seller_name,
    u.email AS seller_email,
    u.hostel_name,
    u.room_number,
    u.avg_rating,
    u.rating_count
FROM items i
JOIN categories c ON c.category_id = i.category_id
JOIN users u ON u.user_id = i.seller_id
WHERE i.item_id = 1;

-- @R04: Fetch ordered photo gallery for an item modal
-- READ
SELECT 
    image_id,
    image_url,
    display_order,
    is_primary
FROM item_images
WHERE item_id = 1
ORDER BY display_order ASC;

-- @R05: Full-text keyword search across item titles and descriptions
-- READ
SELECT 
    i.item_id,
    i.title,
    i.listing_type,
    i.price,
    c.category_name,
    u.hostel_name
FROM items i
JOIN categories c ON c.category_id = i.category_id
JOIN users u ON u.user_id = i.seller_id
WHERE (i.title ILIKE '%calculator%' OR i.description ILIKE '%calculator%')
  AND i.status = 'AVAILABLE';

-- @R06: Student profile activity (All listings created by a student)
-- READ
SELECT 
    i.item_id,
    i.title,
    i.listing_type,
    i.price,
    i.status,
    i.created_at,
    COUNT(d.deal_id) AS total_inquiries
FROM items i
LEFT JOIN deals d ON d.item_id = i.item_id
WHERE i.seller_id = 1
GROUP BY i.item_id, i.title, i.listing_type, i.price, i.status, i.created_at
ORDER BY i.created_at DESC;

-- @R07: Student deal history (Purchases and Rentals as Buyer)
-- READ
SELECT 
    d.deal_id,
    d.deal_type,
    d.agreed_price,
    d.security_deposit_paid,
    d.rental_start_date,
    d.rental_end_date,
    d.deal_status,
    i.title AS item_title,
    seller.full_name AS seller_name,
    seller.hostel_name AS pickup_hostel,
    seller.room_number AS pickup_room
FROM deals d
JOIN items i ON i.item_id = d.item_id
JOIN users seller ON seller.user_id = d.seller_id
WHERE d.buyer_id = 2
ORDER BY d.created_at DESC;

-- @R08: Conversation messages for an active deal negotiation
-- READ
SELECT 
    m.message_id,
    m.content,
    m.sent_at,
    sender.user_id AS sender_id,
    sender.full_name AS sender_name,
    receiver.user_id AS receiver_id,
    receiver.full_name AS receiver_name
FROM messages m
JOIN users sender ON sender.user_id = m.sender_id
JOIN users receiver ON receiver.user_id = m.receiver_id
WHERE m.deal_id = 1
ORDER BY m.sent_at ASC;

-- @R09: Hostels with highest peer trading volume (Campus Analytics)
-- READ
SELECT 
    u.hostel_name,
    COUNT(DISTINCT d.deal_id) AS completed_deals_count,
    SUM(d.agreed_price) AS total_trading_volume
FROM deals d
JOIN users u ON u.user_id = d.seller_id
WHERE d.deal_status = 'COMPLETED'
GROUP BY u.hostel_name
ORDER BY completed_deals_count DESC;

-- @R10: Top reviewed student sellers with average rating and feedback
-- READ
SELECT 
    u.user_id,
    u.full_name,
    u.hostel_name,
    u.avg_rating,
    u.rating_count,
    COUNT(r.review_id) AS verified_reviews
FROM users u
JOIN reviews r ON r.reviewee_id = u.user_id
GROUP BY u.user_id, u.full_name, u.hostel_name, u.avg_rating, u.rating_count
HAVING u.rating_count >= 3
ORDER BY u.avg_rating DESC, u.rating_count DESC;


-- ------------------------------------------------------------
-- WRITE QUERIES (W01 - W06)
-- ------------------------------------------------------------

-- @W01: Publish a new item listing for sale (Sell.jsx submission)
-- WRITE
INSERT INTO items (
    seller_id,
    category_id,
    title,
    description,
    listing_type,
    item_condition,
    price,
    original_price,
    listing_duration_days,
    open_to_bargaining,
    has_defects,
    defect_details,
    pickup_location,
    status
) VALUES (
    1,
    (SELECT category_id FROM categories WHERE slug = 'electronics'),
    'Casio fx-991EX ClassWiz Scientific Calculator',
    'Barely used for 2 semesters of engineering math. Mint condition.',
    'BUY',
    'Like New',
    950.00,
    1595.00,
    14,
    TRUE,
    FALSE,
    'None',
    'Hostel Block B - Room 304',
    'AVAILABLE'
) RETURNING item_id;

-- @W02: Batch upload photos for an item (Enforcing min 3 photos requirement)
-- WRITE
INSERT INTO item_images (item_id, image_url, display_order, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd', 1, TRUE),
(1, 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620', 2, FALSE),
(1, 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7', 3, FALSE);

-- @W03: Create a rental reservation booking (Rent.jsx modal action)
-- WRITE
INSERT INTO deals (
    item_id,
    buyer_id,
    seller_id,
    deal_type,
    agreed_price,
    security_deposit_paid,
    rental_start_date,
    rental_end_date,
    deal_status
) VALUES (
    2,
    2,
    1,
    'RENT',
    100.00,
    600.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '2 days',
    'PENDING'
);

-- @W04: Update item status upon deal acceptance
-- WRITE
UPDATE items
SET status = 'RENTED',
    updated_at = CURRENT_TIMESTAMP
WHERE item_id = 2;

-- @W05: Send a negotiation message between students
-- WRITE
INSERT INTO messages (
    deal_id,
    item_id,
    sender_id,
    receiver_id,
    content
) VALUES (
    1,
    1,
    2,
    1,
    'Hey! Can I pick up the calculator from Block B today at 6 PM for ₹900?'
);

-- @W06: Submit peer review after deal completion & recompute average rating
-- WRITE
INSERT INTO reviews (deal_id, reviewer_id, reviewee_id, rating, comment)
VALUES (1, 2, 1, 5, 'Great condition, very quick handover in Block B common room!');

UPDATE users
SET avg_rating = (
        SELECT ROUND(AVG(rating)::numeric, 2) 
        FROM reviews 
        WHERE reviewee_id = 1
    ),
    rating_count = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE reviewee_id = 1
    )
WHERE user_id = 1;
