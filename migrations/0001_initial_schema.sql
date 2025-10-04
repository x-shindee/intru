-- Users and Authentication
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK(role IN ('customer', 'admin', 'manager', 'marketer', 'developer')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  is_active BOOLEAN DEFAULT 1,
  preferences TEXT -- JSON string for user preferences
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2), -- Original price for sales
  sku TEXT UNIQUE,
  barcode TEXT,
  inventory_quantity INTEGER DEFAULT 0,
  weight DECIMAL(8,2),
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'draft', 'archived')),
  images TEXT, -- JSON array of image URLs
  variants TEXT, -- JSON for size/color variants
  seo_title TEXT,
  seo_description TEXT,
  categories TEXT, -- JSON array of category IDs
  tags TEXT, -- JSON array of tags
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id INTEGER REFERENCES categories(id),
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id),
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  total_amount DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  payment_method TEXT,
  shipping_address TEXT, -- JSON object
  billing_address TEXT, -- JSON object  
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  variant_id TEXT, -- For product variants
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  product_snapshot TEXT, -- JSON snapshot of product at time of order
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- AI Assistant Interactions
CREATE TABLE IF NOT EXISTS ai_interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  message_type TEXT CHECK(message_type IN ('user_message', 'ai_response')),
  message TEXT NOT NULL,
  intent TEXT, -- Classified intent (product_inquiry, size_help, gift_recommendation, etc.)
  confidence DECIMAL(3,2), -- AI confidence score
  context TEXT, -- JSON object with conversation context
  metadata TEXT, -- JSON for additional data (user preferences, product attributes discussed)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Customer Analytics & Personas
CREATE TABLE IF NOT EXISTS customer_personas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  demographics TEXT, -- JSON: age range, gender, location, income
  psychographics TEXT, -- JSON: interests, values, lifestyle
  behaviors TEXT, -- JSON: shopping patterns, preferred channels
  pain_points TEXT, -- JSON array of pain points
  goals TEXT, -- JSON array of goals
  triggers TEXT, -- JSON: what motivates them to buy
  sample_user_journey TEXT, -- JSON describing typical journey
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL, -- page_view, product_view, add_to_cart, checkout_start, purchase, etc.
  session_id TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  device_info TEXT, -- JSON: device type, OS, browser
  geo_info TEXT, -- JSON: country, region, city
  properties TEXT, -- JSON: event-specific properties
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Growth Strategies & Recommendations
CREATE TABLE IF NOT EXISTS growth_recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK(type IN ('promotion', 'product', 'content', 'inventory', 'pricing', 'campaign')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
  effort_level TEXT DEFAULT 'medium' CHECK(effort_level IN ('low', 'medium', 'high')),
  impact_estimate TEXT DEFAULT 'medium' CHECK(impact_estimate IN ('low', 'medium', 'high')),
  target_persona TEXT, -- Which customer persona this targets
  action_items TEXT, -- JSON array of specific action items
  deadline DATE,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  assigned_to TEXT, -- Role or user responsible
  results TEXT, -- JSON: actual results after implementation
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Social Media Content & Performance
CREATE TABLE IF NOT EXISTS social_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform TEXT NOT NULL CHECK(platform IN ('instagram', 'facebook', 'twitter', 'tiktok', 'youtube')),
  post_id TEXT, -- External post ID
  post_url TEXT,
  content_type TEXT CHECK(content_type IN ('image', 'video', 'carousel', 'story', 'reel')),
  caption TEXT,
  hashtags TEXT, -- JSON array
  products_featured TEXT, -- JSON array of product IDs
  engagement_metrics TEXT, -- JSON: likes, comments, shares, saves
  performance_score DECIMAL(5,2), -- Calculated performance score
  published_at DATETIME,
  scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Reviews and UGC
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id),
  user_id INTEGER REFERENCES users(id),
  order_id INTEGER REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  images TEXT, -- JSON array of image URLs
  verified_purchase BOOLEAN DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK(status IN ('pending', 'published', 'hidden')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admin User Guides & Tours
CREATE TABLE IF NOT EXISTS user_guides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT NOT NULL CHECK(role IN ('owner', 'manager', 'marketer', 'developer', 'non_coder')),
  guide_type TEXT NOT NULL CHECK(guide_type IN ('onboarding', 'feature_tour', 'workflow', 'tutorial')),
  title TEXT NOT NULL,
  description TEXT,
  steps TEXT NOT NULL, -- JSON array of guide steps
  triggers TEXT, -- JSON: when to show this guide
  completion_tracking BOOLEAN DEFAULT 1,
  is_active BOOLEAN DEFAULT 1,
  version INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User Guide Progress
CREATE TABLE IF NOT EXISTS user_guide_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  guide_id INTEGER NOT NULL REFERENCES user_guides(id),
  current_step INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT 0,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  UNIQUE(user_id, guide_id)
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_session_id ON ai_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_product_id ON ai_interactions(product_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_social_content_platform ON social_content(platform);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);