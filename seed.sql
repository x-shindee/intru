-- Insert Customer Personas based on intru.in analysis
INSERT OR IGNORE INTO customer_personas (id, name, description, demographics, psychographics, behaviors, pain_points, goals, triggers, sample_user_journey) VALUES 
(1, 'Minimalist Maya', 'Young professional who values clean, simple design and quality basics', 
 '{"age_range": "22-30", "gender": "female", "location": "metro_cities", "income": "25k-50k"}',
 '{"interests": ["minimalism", "sustainable_fashion", "work_life_balance"], "values": ["quality_over_quantity", "authenticity", "simplicity"], "lifestyle": "urban_professional"}',
 '{"shopping_frequency": "quarterly", "research_time": "medium", "preferred_channels": ["instagram", "website"], "price_sensitivity": "medium"}',
 '["finding_versatile_pieces", "avoiding_fast_fashion", "limited_wardrobe_space"]',
 '["build_capsule_wardrobe", "find_timeless_pieces", "express_personal_style"]',
 '["seasonal_transitions", "work_events", "instagram_inspiration"]',
 '{"awareness": "Instagram discovery", "consideration": "Website browsing + reviews", "decision": "Size guide + AI assistant", "purchase": "Quick checkout", "advocacy": "Social sharing"}'),

(2, 'Trendy Tina', 'College student/young professional who follows fashion trends and loves experimenting', 
 '{"age_range": "18-25", "gender": "female", "location": "tier_1_tier_2_cities", "income": "15k-35k"}',
 '{"interests": ["fashion_trends", "social_media", "photography"], "values": ["self_expression", "social_acceptance", "affordability"], "lifestyle": "social_active"}',
 '{"shopping_frequency": "monthly", "research_time": "low", "preferred_channels": ["instagram", "influencer_recs"], "price_sensitivity": "high"}',
 '["staying_on_trend", "budget_constraints", "outfit_repetition_fear"]',
 '["stay_fashionable", "get_social_validation", "maximize_outfit_options"]',
 '["influencer_posts", "festival_seasons", "social_events", "sales_promotions"]',
 '{"awareness": "Influencer post", "consideration": "Instagram gallery browsing", "decision": "Discount availability", "purchase": "COD option", "advocacy": "Instagram stories/posts"}'),

(3, 'Gifting Guru', 'Someone shopping for others - friends, family, romantic partners', 
 '{"age_range": "20-35", "gender": "mixed", "location": "pan_india", "income": "30k-60k"}',
 '{"interests": ["relationships", "thoughtful_gifting", "special_occasions"], "values": ["thoughtfulness", "quality", "recipient_happiness"], "lifestyle": "relationship_focused"}',
 '{"shopping_frequency": "occasion_based", "research_time": "high", "preferred_channels": ["website", "size_guides"], "price_sensitivity": "low"}',
 '["sizing_uncertainty", "style_preferences_unknown", "delivery_timing"]',
 '["find_perfect_gift", "ensure_good_fit", "make_recipient_happy"]',
 '["birthdays", "anniversaries", "festivals", "achievements"]',
 '{"awareness": "Gift search", "consideration": "Size guide study + AI consultation", "decision": "Gift wrapping + return policy", "purchase": "Express delivery", "advocacy": "Recipient feedback sharing"}');

-- Insert sample products based on intru.in catalog
INSERT OR IGNORE INTO products (id, name, slug, description, short_description, price, compare_price, sku, inventory_quantity, images, variants, categories, tags, seo_title, seo_description, status) VALUES 
(1, 'Doodles T-Shirt', 'doodles-t-shirt', 'Inspired by all the little doodles that bring warmth and joy, this tee is a wearable burst of happy energy—cute, comfy, and guaranteed to brighten your day.', 'Oversized fit with classic round neck in premium French Terry', 999.00, 1499.00, 'DOODLE-WHT', 50, 
 '["https://intru.in/cdn/shop/files/3.png", "https://intru.in/cdn/shop/files/5.png"]',
 '{"sizes": ["XS", "S", "M", "L", "XL"], "colors": ["White"], "fit": "Oversized"}',
 '["t-shirts", "casual-wear"]', 
 '["doodles", "oversized", "french-terry", "comfortable", "minimalist"]',
 'Doodles T-Shirt - Oversized Fit | intru', 
 'Premium French Terry doodles t-shirt with oversized fit. Comfortable casual wear for everyday style. Free shipping on prepaid orders.', 
 'active'),

(2, 'No Risk Porsche T-Shirt', 'no-risk-porsche-tee', 'Bold statement piece for automotive enthusiasts and risk-takers. Perfect blend of street style and comfort.', 'Statement tee with Porsche-inspired graphics', 999.00, 1499.00, 'PORSCHE-BLK', 35, 
 '["https://intru.in/cdn/shop/files/F51687B9-2BF2-43E0-988A-30272833B19E.jpg", "https://intru.in/cdn/shop/files/B2CE6C07-D4DB-4AC4-BDCD-0E6AE6959A20.jpg"]',
 '{"sizes": ["XS", "S", "M", "L", "XL"], "colors": ["Black"], "fit": "Regular"}',
 '["t-shirts", "statement-wear"]',
 '["porsche", "automotive", "statement", "bold", "street-style"]',
 'No Risk Porsche T-Shirt | intru', 
 'Bold Porsche-inspired statement t-shirt for automotive enthusiasts. Premium quality casual wear with attitude.', 
 'active'),

(3, 'Romanticise Crop Tee', 'romanticise-crop-tee', 'Soft, feminine crop tee perfect for layering or wearing solo. Comfortable fit that flatters every body type.', 'Cropped tee with romantic vibes', 699.00, 999.00, 'ROMAN-CROP', 40, 
 '["https://intru.in/cdn/shop/files/1_72b59988-d21a-41dc-8a6d-fd6c8255e20c.png", "https://intru.in/cdn/shop/files/2_861f6da1-47c4-4b2d-bd3b-0e43cc288368.png"]',
 '{"sizes": ["XS", "S", "M", "L"], "colors": ["Light Pink"], "fit": "Cropped"}',
 '["crop-tops", "feminine"]',
 '["romantic", "crop", "feminine", "layering", "soft"]',
 'Romanticise Crop Tee | intru', 
 'Soft romantic crop tee perfect for layering. Comfortable feminine fit for everyday casual style.', 
 'active'),

(4, 'Stripe 18 Shirt', 'stripe-18-shirt', 'Classic striped shirt that never goes out of style. Versatile piece that works for both casual and semi-formal occasions.', 'Timeless striped shirt for versatile styling', 1099.00, 1699.00, 'STRIPE-18', 25, 
 '["https://intru.in/cdn/shop/files/mainimage.png", "https://intru.in/cdn/shop/files/0076.png"]',
 '{"sizes": ["XS", "S", "M", "L", "XL"], "colors": ["Navy Stripe"], "fit": "Regular"}',
 '["shirts", "formal-casual"]',
 '["stripes", "classic", "versatile", "timeless", "formal-casual"]',
 'Stripe 18 Shirt - Classic Design | intru', 
 'Timeless striped shirt perfect for versatile styling. Classic design for both casual and semi-formal occasions.', 
 'active'),

(5, 'Summer Shirt', 'summer-shirt', 'Lightweight, breathable shirt perfect for hot summer days. Comfortable fit with premium fabric that keeps you cool.', 'Lightweight summer shirt for hot weather', 999.00, 1599.00, 'SUMMER-LT', 30, 
 '["https://intru.in/cdn/shop/files/01.png", "https://intru.in/cdn/shop/files/02.png"]',
 '{"sizes": ["S", "M", "L", "XL"], "colors": ["Light Blue"], "fit": "Regular"}',
 '["shirts", "summer-wear"]',
 '["summer", "lightweight", "breathable", "cool", "casual"]',
 'Summer Shirt - Lightweight & Breathable | intru', 
 'Lightweight summer shirt perfect for hot weather. Breathable fabric keeps you cool and comfortable all day.', 
 'active');

-- Insert sample categories
INSERT OR IGNORE INTO categories (id, name, slug, description, sort_order, is_active) VALUES 
(1, 'T-Shirts', 't-shirts', 'Comfortable and stylish t-shirts for everyday wear', 1, 1),
(2, 'Shirts', 'shirts', 'Classic and casual shirts for versatile styling', 2, 1),
(3, 'Crop Tops', 'crop-tops', 'Trendy crop tops perfect for layering', 3, 1),
(4, 'Sale', 'sale', 'Discounted items - limited time offers', 4, 1);

-- Insert sample admin users with different roles
INSERT OR IGNORE INTO users (id, email, name, role, preferences) VALUES 
(1, 'admin@intru.in', 'Store Admin', 'admin', '{"dashboard_layout": "detailed", "notifications": "all"}'),
(2, 'manager@intru.in', 'Store Manager', 'manager', '{"focus_areas": ["inventory", "orders"], "alert_preferences": "critical_only"}'),
(3, 'marketing@intru.in', 'Marketing Lead', 'marketer', '{"campaign_focus": "instagram", "analytics_depth": "detailed"}'),
(4, 'dev@intru.in', 'Developer', 'developer', '{"technical_level": "advanced", "deployment_access": true}');

-- Insert growth recommendations based on analysis
INSERT OR IGNORE INTO growth_recommendations (type, title, description, priority, effort_level, impact_estimate, target_persona, action_items, assigned_to) VALUES 
('content', 'Create Size Guide Videos', 'Develop video content showing fit on different body types to reduce size-related returns', 'high', 'medium', 'high', 'Minimalist Maya', 
 '["Script size guide videos", "Shoot with models of different sizes", "Add to product pages", "Promote on Instagram"]', 'marketer'),

('promotion', 'Gift Bundle Campaign', 'Create gift bundles targeting festival season and gifting occasions', 'high', 'low', 'high', 'Gifting Guru',
 '["Design 3-piece gift sets", "Create gift wrapping option", "Launch social media campaign", "Partner with influencers"]', 'marketer'),

('product', 'Expand Color Options', 'Add more color variants to popular products based on customer inquiries', 'medium', 'high', 'medium', 'Trendy Tina',
 '["Analyze AI chat logs for color requests", "Source new color variants", "Update product listings", "Announce on social media"]', 'manager'),

('inventory', 'Restock Alert System', 'Implement back-in-stock notifications for sold-out popular items', 'medium', 'medium', 'high', 'All Personas',
 '["Set up email automation", "Add waitlist functionality", "Create restock announcement templates"]', 'developer'),

('campaign', 'Instagram Shopping Integration', 'Enable direct shopping from Instagram posts to reduce friction', 'high', 'medium', 'high', 'Trendy Tina',
 '["Set up Instagram Shop", "Tag products in existing posts", "Create shoppable story templates", "Train team on Instagram commerce"]', 'marketer');

-- Insert user guides for different roles
INSERT OR IGNORE INTO user_guides (role, guide_type, title, description, steps, triggers) VALUES 
('owner', 'onboarding', 'Store Owner Dashboard Tour', 'Complete walkthrough of your store dashboard and key metrics', 
 '[{"step": 1, "title": "Welcome to Your Store", "content": "This is your central command center for monitoring store performance", "target": "#dashboard-overview"}, 
   {"step": 2, "title": "Revenue Overview", "content": "Track your daily, weekly and monthly revenue trends here", "target": "#revenue-chart"}, 
   {"step": 3, "title": "Top Products", "content": "See which products are driving the most sales", "target": "#top-products"}, 
   {"step": 4, "title": "Growth Recommendations", "content": "AI-powered suggestions to grow your business", "target": "#growth-recs"}]',
 '{"first_login": true, "role_change": "owner"}'),

('manager', 'workflow', 'Order Management Workflow', 'Step-by-step guide for processing orders efficiently', 
 '[{"step": 1, "title": "New Orders", "content": "Check new orders that need processing", "target": "#new-orders"}, 
   {"step": 2, "title": "Inventory Check", "content": "Verify inventory before confirming orders", "target": "#inventory-status"}, 
   {"step": 3, "title": "Order Confirmation", "content": "Confirm orders and update status", "target": "#order-actions"}, 
   {"step": 4, "title": "Shipping Labels", "content": "Generate and print shipping labels", "target": "#shipping-section"}]',
 '{"page_visit": "/admin/orders", "new_orders_count": ">5"}'),

('marketer', 'feature_tour', 'Campaign Creation Tour', 'Learn how to create and manage marketing campaigns', 
 '[{"step": 1, "title": "Campaign Dashboard", "content": "Overview of all your marketing campaigns", "target": "#campaigns-overview"}, 
   {"step": 2, "title": "Instagram Insights", "content": "Analyze your Instagram performance and engagement", "target": "#instagram-metrics"}, 
   {"step": 3, "title": "Create Campaign", "content": "Start a new marketing campaign with templates", "target": "#create-campaign-btn"}, 
   {"step": 4, "title": "Content Calendar", "content": "Schedule and plan your content in advance", "target": "#content-calendar"}]',
 '{"page_visit": "/admin/marketing", "role": "marketer"}'),

('developer', 'tutorial', 'API & Webhooks Setup', 'Configure API integrations and webhook endpoints', 
 '[{"step": 1, "title": "API Keys", "content": "Manage your API keys and authentication", "target": "#api-keys"}, 
   {"step": 2, "title": "Webhook Configuration", "content": "Set up webhooks for real-time updates", "target": "#webhooks"}, 
   {"step": 3, "title": "Testing Environment", "content": "Use the sandbox for testing integrations", "target": "#sandbox"}, 
   {"step": 4, "title": "Deployment Controls", "content": "Manage deployments and versioning", "target": "#deployments"}]',
 '{"page_visit": "/admin/developer", "first_visit": true}'),

('non_coder', 'onboarding', 'Visual Editor Introduction', 'Learn to customize your store without coding', 
 '[{"step": 1, "title": "Visual Editor", "content": "Drag and drop to customize your store layout", "target": "#visual-editor"}, 
   {"step": 2, "title": "Product Upload", "content": "Easy product upload with image handling", "target": "#product-wizard"}, 
   {"step": 3, "title": "Discount Creator", "content": "Create promotional codes and discounts", "target": "#discount-wizard"}, 
   {"step": 4, "title": "Content Pages", "content": "Add About, FAQ and other content pages", "target": "#page-builder"}]',
 '{"first_login": true, "technical_level": "beginner"}');