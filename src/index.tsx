import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/cloudflare-workers'

// Import route handlers
import { apiRoutes } from './routes/api'
import { adminRoutes } from './routes/admin'
import { shopRoutes } from './routes/shop'

// Type definitions for Cloudflare bindings
type Bindings = {
  DB: D1Database
  KV: KVNamespace
  R2: R2Bucket
  AI: any
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', logger())
app.use('/api/*', cors({
  origin: ['https://x-intru-ecommerce.pages.dev', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/assets/*', serveStatic({ root: './public' }))

// Routes
app.route('/api', apiRoutes)
app.route('/admin', adminRoutes) 
app.route('/shop', shopRoutes)

// Main landing page with intru.in inspired design
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>intru - minimalist fashion reimagined</title>
        <meta name="description" content="Built from scratch with a shared love for minimalism & everyday style. Discover premium basics and statement pieces.">
        
        <!-- SEO Meta Tags -->
        <meta property="og:title" content="intru - minimalist fashion reimagined">
        <meta property="og:description" content="Built from scratch with a shared love for minimalism & everyday style">
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://x-intru-ecommerce.pages.dev">
        
        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="/static/favicon.ico">
        
        <!-- Styles -->
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
        
        <!-- Analytics -->
        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GA_MEASUREMENT_ID');
        </script>
        
        <style>
          .hero-gradient {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }
          .product-hover {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .product-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          }
        </style>
    </head>
    <body class="bg-white text-gray-800">
        <!-- Navigation -->
        <nav class="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center">
                        <h1 class="text-2xl font-light tracking-wider">intru</h1>
                    </div>
                    <div class="hidden md:flex space-x-8">
                        <a href="/shop" class="text-gray-600 hover:text-gray-900 transition-colors">Shop</a>
                        <a href="/shop/collections/t-shirts" class="text-gray-600 hover:text-gray-900 transition-colors">T-Shirts</a>
                        <a href="/shop/collections/shirts" class="text-gray-600 hover:text-gray-900 transition-colors">Shirts</a>
                        <a href="/shop/sale" class="text-gray-600 hover:text-gray-900 transition-colors">Sale</a>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button id="cart-btn" class="relative">
                            <i class="fas fa-shopping-bag text-gray-600 hover:text-gray-900"></i>
                            <span id="cart-count" class="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hidden">0</span>
                        </button>
                        <a href="/admin" class="text-gray-600 hover:text-gray-900">
                            <i class="fas fa-user"></i>
                        </a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Announcement Bar -->
        <div class="bg-black text-white text-center py-2 text-sm">
            <p>COD now live — shop stress free, pay when it arrives. Get free shipping on all prepaid orders — across India</p>
        </div>

        <!-- Hero Section -->
        <section class="hero-gradient py-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-4xl md:text-6xl font-light mb-4 tracking-wide">
                    built from scratch with a shared love for<br>
                    <span class="font-normal">minimalism & everyday style</span>
                </h2>
                <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Discover premium basics and statement pieces designed for your everyday moments
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/shop" class="bg-black text-white px-8 py-3 rounded-none hover:bg-gray-800 transition-colors">
                        Shop Collection
                    </a>
                    <button id="ai-assistant-btn" class="border-2 border-black px-8 py-3 hover:bg-black hover:text-white transition-colors">
                        <i class="fas fa-robot mr-2"></i>
                        Style Assistant
                    </button>
                </div>
            </div>
        </section>

        <!-- Featured Products -->
        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <h3 class="text-3xl font-light mb-4">Featured Collection</h3>
                    <p class="text-gray-600">Our bestselling pieces loved by the community</p>
                </div>
                
                <div id="products-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <!-- Products will be loaded here -->
                </div>
                
                <div class="text-center mt-12">
                    <a href="/shop" class="inline-block bg-gray-100 hover:bg-gray-200 px-8 py-3 transition-colors">
                        View All Products
                    </a>
                </div>
            </div>
        </section>

        <!-- Social Proof -->
        <section class="py-20 bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h3 class="text-3xl font-light mb-12">Loved by Our Community</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <div class="flex items-center mb-4">
                            <div class="flex text-yellow-400">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                            </div>
                        </div>
                        <p class="text-gray-600 mb-4">"Perfect fit and amazing quality. The minimalist design is exactly what I was looking for."</p>
                        <p class="font-medium">- Maya K.</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <div class="flex items-center mb-4">
                            <div class="flex text-yellow-400">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                            </div>
                        </div>
                        <p class="text-gray-600 mb-4">"Love how versatile these pieces are. Can dress them up or down for any occasion."</p>
                        <p class="font-medium">- Tina R.</p>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <div class="flex items-center mb-4">
                            <div class="flex text-yellow-400">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                            </div>
                        </div>
                        <p class="text-gray-600 mb-4">"Great gift option! The sizing guide and packaging were perfect."</p>
                        <p class="font-medium">- Arjun S.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Newsletter -->
        <section class="py-20 bg-black text-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h3 class="text-3xl font-light mb-4">Stay in the Loop</h3>
                <p class="text-gray-300 mb-8">Get early access to new collections and exclusive offers</p>
                <div class="max-w-md mx-auto flex gap-2">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        class="flex-1 px-4 py-3 bg-white text-black rounded-none"
                        id="newsletter-email"
                    >
                    <button 
                        class="bg-white text-black px-6 py-3 hover:bg-gray-100 transition-colors"
                        id="newsletter-submit"
                    >
                        Subscribe
                    </button>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h4 class="text-xl font-light mb-4">intru</h4>
                        <p class="text-gray-400">Built from scratch with a shared love for minimalism & everyday style</p>
                        <div class="flex space-x-4 mt-4">
                            <a href="https://instagram.com/intru.in" class="text-gray-400 hover:text-white">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="#" class="text-gray-400 hover:text-white">
                                <i class="fab fa-facebook"></i>
                            </a>
                            <a href="#" class="text-gray-400 hover:text-white">
                                <i class="fab fa-twitter"></i>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h5 class="font-medium mb-4">Shop</h5>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="/shop/collections/t-shirts" class="hover:text-white">T-Shirts</a></li>
                            <li><a href="/shop/collections/shirts" class="hover:text-white">Shirts</a></li>
                            <li><a href="/shop/collections/crop-tops" class="hover:text-white">Crop Tops</a></li>
                            <li><a href="/shop/sale" class="hover:text-white">Sale</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 class="font-medium mb-4">Support</h5>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="/size-guide" class="hover:text-white">Size Guide</a></li>
                            <li><a href="/shipping" class="hover:text-white">Shipping Info</a></li>
                            <li><a href="/returns" class="hover:text-white">Returns</a></li>
                            <li><a href="/contact" class="hover:text-white">Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 class="font-medium mb-4">Company</h5>
                        <ul class="space-y-2 text-gray-400">
                            <li><a href="/about" class="hover:text-white">About Us</a></li>
                            <li><a href="/careers" class="hover:text-white">Careers</a></li>
                            <li><a href="/press" class="hover:text-white">Press</a></li>
                            <li><a href="/admin" class="hover:text-white">Admin Portal</a></li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 intru. All rights reserved. Built with ❤️ for minimalist fashion lovers.</p>
                </div>
            </div>
        </footer>

        <!-- AI Assistant Modal -->
        <div id="ai-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-hidden">
                    <div class="flex justify-between items-center p-6 border-b">
                        <h3 class="text-xl font-medium">Style Assistant</h3>
                        <button id="close-ai-modal" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div id="ai-chat-container" class="h-96 overflow-y-auto p-6">
                        <div class="mb-4 p-4 bg-gray-50 rounded-lg">
                            <p class="text-gray-600">👋 Hi! I'm your personal style assistant. I can help you find the perfect pieces from our collection. What are you looking for today?</p>
                        </div>
                    </div>
                    <div class="p-6 border-t">
                        <div class="flex gap-2">
                            <input 
                                type="text" 
                                id="ai-input" 
                                placeholder="Ask me about products, sizing, styling tips..."
                                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                            >
                            <button id="send-ai-message" class="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Scripts -->
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app