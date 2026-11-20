-- ============================================================
-- DormDeal Campus Marketplace Workload Queries (PostgreSQL 15+)
-- Course: Advanced Programming & Database Management Systems
-- ============================================================

SET search_path TO dormdeal, public;

-- ------------------------------------------------------------
-- READ QUERIES (R01 - R10)
-- ------------------------------------------------------------

-- @R01: Fetch all active items for sale (SELL) with seller hostel and contact info
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
    u.phone AS seller_phone,
    u.hostel_name,
    u.room_number,
    u.avg_rating AS seller_rating
FROM items i
JOIN categories c ON c.category_id = i.category_id
JOIN users u ON u.user_id = i.seller_id
LEFT JOIN item_images img ON img.item_id = i.item_id AND img.is_primary = TRUE
WHERE i.listing_type = 'SELL' 
  AND i.status = 'AVAILABLE'
ORDER BY i.created_at DESC;

-- @R02: Filter available rentals (RENT) with daily rate and refundable security deposit
SELECT 
    i.item_id,
    i.title,
    c.category_name,
    i.price AS rental_rate_per_day,
    i.security_deposit,
    i.listing_duration_days,
    i.status AS availability_status,
    u.full_name AS owner_name,
    u.phone AS owner_phone,
    u.hostel_name,
    u.room_number,
    u.avg_rating
FROM items i
JOIN categories c ON c.category_id = i.category_id
JOIN users u ON u.user_id = i.seller_id
WHERE i.listing_type = 'RENT'
  AND i.status IN ('AVAILABLE', 'RESERVED')
ORDER BY i.price ASC;

-- @R03: Single listing full details with defect disclosure
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
    i.status,
    c.category_name,
    u.user_id AS seller_id,
    u.full_name AS seller_name,
    u.email AS seller_email,
    u.phone AS seller_phone,
    u.hostel_name,
    u.room_number,
    u.avg_rating,
    u.rating_count
FROM items i
JOIN categories c ON c.category_id = i.category_id
JOIN users u ON u.user_id = i.seller_id
WHERE i.item_id = 1;

-- @R04: Fetch photo gallery for an item
SELECT 
    image_id,
    image_url,
    display_order,
    is_primary
FROM item_images
WHERE item_id = 1
ORDER BY display_order ASC;

-- @R05: Full-text keyword search across item titles and descriptions
SELECT 
    i.item_id,
    i.title,
    i.listing_type,
    i.price,
    c.category_name,
    u.hostel_name,
    u.room_number
FROM items i
JOIN categories c ON c.category_id = i.category_id
JOIN users u ON u.user_id = i.seller_id
WHERE (i.title ILIKE '%calculator%' OR i.description ILIKE '%calculator%')
  AND i.status = 'AVAILABLE';

-- @R06: Fetch active Campus Broadcast requests (3-Day TTL)
SELECT 
    b.broadcast_id,
    b.title,
    c.category_name,
    b.max_budget,
    b.needed_by_date,
    b.notes,
    b.status,
    u.full_name AS buyer_name,
    u.hostel_name,
    u.room_number,
    b.created_at
FROM broadcast_requests b
JOIN categories c ON c.category_id = b.category_id
JOIN users u ON u.user_id = b.buyer_id
WHERE b.status = 'OPEN'
ORDER BY b.created_at DESC;

-- @R07: Student deal history (as Buyer or Seller)
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
    seller.hostel_name AS seller_hostel,
    seller.room_number AS seller_room,
    buyer.full_name AS buyer_name
FROM deals d
JOIN items i ON i.item_id = d.item_id
JOIN users seller ON seller.user_id = d.seller_id
JOIN users buyer ON buyer.user_id = d.buyer_id
WHERE d.buyer_id = 1 OR d.seller_id = 1
ORDER BY d.created_at DESC;

-- @R08: Top reviewed student sellers with average rating
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
ORDER BY u.avg_rating DESC, u.rating_count DESC;


-- ------------------------------------------------------------
-- WRITE QUERIES (W01 - W06)
-- ------------------------------------------------------------

-- @W01: Publish a new item listing for sale (14-day auto-expiry)
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
    status
) VALUES (
    1,
    (SELECT category_id FROM categories WHERE slug = 'electronics'),
    'Casio fx-991EX ClassWiz Scientific Calculator',
    'Mint condition calculator with slide case.',
    'SELL',
    'Like New',
    850.00,
    1595.00,
    14,
    TRUE,
    FALSE,
    '',
    'AVAILABLE'
) RETURNING item_id;

-- @W02: Post a campus broadcast request (Buyer looking for an item)
INSERT INTO broadcast_requests (
    buyer_id,
    category_id,
    title,
    max_budget,
    needed_by_date,
    notes,
    status
) VALUES (
    2,
    (SELECT category_id FROM categories WHERE slug = 'stationery'),
    'Need Mini Drafter for Engineering Drawing Lab',
    200.00,
    'Tomorrow 9:00 AM',
    'Urgent need for mid-sem drawing exam in Block B.',
    'OPEN'
) RETURNING broadcast_id;

-- @W03: Student fulfills broadcast request ("I Have This")
UPDATE broadcast_requests
SET status = 'MATCHED',
    matched_by = 1,
    matched_at = CURRENT_TIMESTAMP
WHERE broadcast_id = 1;

-- @W04: Create in-app notification for the buyer
INSERT INTO notifications (
    recipient_id,
    sender_id,
    title,
    message,
    notification_type
) VALUES (
    2,
    1,
    'Item Found for your Request!',
    'Aarav Sharma from Block B (Room 304) has the item you requested: "Need Mini Drafter".',
    'BROADCAST_MATCH'
);

-- @W05: Advance deal status to ACCEPTED and reserve item
UPDATE deals
SET deal_status = 'ACCEPTED'
WHERE deal_id = 1;

UPDATE items
SET status = 'RESERVED',
    updated_at = CURRENT_TIMESTAMP
WHERE item_id = 1;

-- @W06: Submit peer review after deal completion & recompute average rating
INSERT INTO reviews (deal_id, reviewer_id, reviewee_id, rating, comment)
VALUES (1, 2, 1, 5, 'Smooth handover at Block B common room. Item condition matched description!');

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
