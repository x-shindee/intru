import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
  KV: KVNamespace
  R2: R2Bucket
  AI: any
}

export const shopRoutes = new Hono<{ Bindings: Bindings }>()

// Shop main page
shopRoutes.get('/', async (c) => {
  const { env } = c
  
  // Get featured products
  const stmt = env.DB.prepare(`
    SELECT * FROM products 
    WHERE status = 'active' 
    ORDER BY created_at DESC 
    LIMIT 12
  `)
  const result = await stmt.all()
  const products = result.results?.map((p: any) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    variants: JSON.parse(p.variants || '{}')
  })) || []

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shop - intru</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/styles.css" rel="stylesheet">
    </head>
    <body class="bg-white text-gray-800">
        <!-- Navigation -->
        <nav class="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center">
                        <a href="/" class="text-2xl font-light tracking-wider">intru</a>
                    </div>
                    <div class="hidden md:flex space-x-8">
                        <a href="/shop" class="text-gray-900 font-medium">Shop</a>
                        <a href="/shop/collections/t-shirts" class="text-gray-600 hover:text-gray-900 transition-colors">T-Shirts</a>
                        <a href="/shop/collections/shirts" class="text-gray-600 hover:text-gray-900 transition-colors">Shirts</a>
                        <a href="/shop/sale" class="text-gray-600 hover:text-gray-900 transition-colors">Sale</a>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button class="text-gray-600 hover:text-gray-900">
                            <i class="fas fa-search"></i>
                        </button>
                        <button class="relative">
                            <i class="fas fa-shopping-bag text-gray-600 hover:text-gray-900"></i>
                        </button>
                        <a href="/admin" class="text-gray-600 hover:text-gray-900">
                            <i class="fas fa-user"></i>
                        </a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Filters & Search -->
        <section class="bg-gray-50 py-8">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col lg:flex-row gap-8">
                    <!-- Filters Sidebar -->
                    <div class="lg:w-1/4">
                        <div class="bg-white p-6 rounded-lg shadow-sm">
                            <h3 class="text-lg font-medium mb-4">Filters</h3>
                            
                            <!-- Categories -->
                            <div class="mb-6">
                                <h4 class="font-medium mb-3">Categories</h4>
                                <div class="space-y-2">
                                    <label class="flex items-center">
                                        <input type="checkbox" class="filter-category" value="t-shirts">
                                        <span class="ml-2 text-gray-600">T-Shirts</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" class="filter-category" value="shirts">
                                        <span class="ml-2 text-gray-600">Shirts</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" class="filter-category" value="crop-tops">
                                        <span class="ml-2 text-gray-600">Crop Tops</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Price Range -->
                            <div class="mb-6">
                                <h4 class="font-medium mb-3">Price Range</h4>
                                <div class="space-y-2">
                                    <label class="flex items-center">
                                        <input type="radio" name="price" value="0-500">
                                        <span class="ml-2 text-gray-600">Under ₹500</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="radio" name="price" value="500-1000">
                                        <span class="ml-2 text-gray-600">₹500 - ₹1000</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="radio" name="price" value="1000-1500">
                                        <span class="ml-2 text-gray-600">₹1000 - ₹1500</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="radio" name="price" value="1500+">
                                        <span class="ml-2 text-gray-600">Above ₹1500</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Size -->
                            <div class="mb-6">
                                <h4 class="font-medium mb-3">Size</h4>
                                <div class="flex flex-wrap gap-2">
                                    ${['XS', 'S', 'M', 'L', 'XL'].map(size => `
                                        <button class="size-filter px-3 py-1 border border-gray-300 hover:border-black transition-colors" data-size="${size}">
                                            ${size}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>

                            <button class="w-full bg-black text-white py-2 hover:bg-gray-800 transition-colors">
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    <!-- Products Grid -->
                    <div class="lg:w-3/4">
                        <div class="flex justify-between items-center mb-6">
                            <div>
                                <h2 class="text-2xl font-light">All Products</h2>
                                <p class="text-gray-600">${products.length} items</p>
                            </div>
                            <div class="flex items-center gap-4">
                                <label class="text-sm text-gray-600">Sort by:</label>
                                <select class="border border-gray-300 px-3 py-2 rounded-none" id="sort-select">
                                    <option value="created_at DESC">Newest</option>
                                    <option value="name ASC">Name (A-Z)</option>
                                    <option value="price ASC">Price (Low to High)</option>
                                    <option value="price DESC">Price (High to Low)</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="products-grid">
                            ${products.map(product => `
                                <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow product-card" data-product-id="${product.id}">
                                    <div class="aspect-square overflow-hidden">
                                        <img 
                                            src="${product.images[0] || '/static/placeholder.jpg'}" 
                                            alt="${product.name}"
                                            class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        >
                                    </div>
                                    <div class="p-4">
                                        <h3 class="font-medium mb-2">${product.name}</h3>
                                        <p class="text-gray-600 text-sm mb-2">${product.short_description || ''}</p>
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center gap-2">
                                                <span class="text-lg font-medium">₹${product.price}</span>
                                                ${product.compare_price ? `<span class="text-sm text-gray-500 line-through">₹${product.compare_price}</span>` : ''}
                                            </div>
                                            <button class="bg-black text-white px-4 py-1 text-sm hover:bg-gray-800 transition-colors quick-add" data-product-slug="${product.slug}">
                                                Quick Add
                                            </button>
                                        </div>
                                        ${product.compare_price ? '<div class="inline-block bg-red-500 text-white text-xs px-2 py-1 mt-2">Sale</div>' : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- Load More -->
                        <div class="text-center mt-12">
                            <button class="bg-gray-100 hover:bg-gray-200 px-8 py-3 transition-colors" id="load-more">
                                Load More Products
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-12 mt-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h4 class="text-xl font-light mb-4">intru</h4>
                    <p class="text-gray-400">Built from scratch with a shared love for minimalism & everyday style</p>
                    <div class="flex justify-center space-x-4 mt-4">
                        <a href="/" class="text-gray-400 hover:text-white">Home</a>
                        <a href="/shop" class="text-gray-400 hover:text-white">Shop</a>
                        <a href="/about" class="text-gray-400 hover:text-white">About</a>
                        <a href="/contact" class="text-gray-400 hover:text-white">Contact</a>
                    </div>
                </div>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            // Product filtering and sorting
            document.addEventListener('DOMContentLoaded', function() {
                // Quick add functionality
                document.querySelectorAll('.quick-add').forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault()
                        const productSlug = this.dataset.productSlug
                        window.location.href = \`/shop/products/\${productSlug}\`
                    })
                })

                // Product card click
                document.querySelectorAll('.product-card').forEach(card => {
                    card.addEventListener('click', function(e) {
                        if (!e.target.classList.contains('quick-add')) {
                            const productSlug = this.querySelector('.quick-add').dataset.productSlug
                            window.location.href = \`/shop/products/\${productSlug}\`
                        }
                    })
                })

                // Filter functionality (basic implementation)
                document.querySelectorAll('.filter-category').forEach(checkbox => {
                    checkbox.addEventListener('change', filterProducts)
                })

                document.querySelectorAll('input[name="price"]').forEach(radio => {
                    radio.addEventListener('change', filterProducts)
                })

                document.getElementById('sort-select').addEventListener('change', function() {
                    // Implement sorting logic
                    console.log('Sorting by:', this.value)
                })

                function filterProducts() {
                    // Basic filter implementation
                    // In production, this would make API calls to filter products
                    console.log('Filtering products...')
                }
            })
        </script>
    </body>
    </html>
  `)
})

// Individual product page
shopRoutes.get('/products/:slug', async (c) => {
  try {
    const { env } = c
    const slug = c.req.param('slug')

    const stmt = env.DB.prepare(`
      SELECT * FROM products WHERE slug = ? AND status = 'active'
    `)
    const product = await stmt.bind(slug).first()

    if (!product) {
      return c.html(`
        <html>
        <head><title>Product Not Found - intru</title></head>
        <body>
          <div class="flex items-center justify-center min-h-screen">
            <div class="text-center">
              <h1 class="text-4xl mb-4">Product Not Found</h1>
              <a href="/shop" class="bg-black text-white px-6 py-3">Continue Shopping</a>
            </div>
          </div>
        </body>
        </html>
      `, 404)
    }

    const productData = {
      ...product,
      images: JSON.parse(product.images || '[]'),
      variants: JSON.parse(product.variants || '{}'),
      categories: JSON.parse(product.categories || '[]'),
      tags: JSON.parse(product.tags || '[]')
    }

    return c.html(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${productData.name} - intru</title>
          <meta name="description" content="${productData.seo_description || productData.short_description}">
          
          <!-- Product Schema -->
          <script type="application/ld+json">
          {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": "${productData.name}",
            "image": ${JSON.stringify(productData.images)},
            "description": "${productData.description}",
            "sku": "${productData.sku}",
            "offers": {
              "@type": "Offer",
              "url": "https://x-intru-ecommerce.pages.dev/shop/products/${productData.slug}",
              "priceCurrency": "INR",
              "price": "${productData.price}",
              "availability": "https://schema.org/InStock"
            },
            "brand": {
              "@type": "Brand",
              "name": "intru"
            }
          }
          </script>

          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
          <link href="/static/styles.css" rel="stylesheet">
      </head>
      <body class="bg-white text-gray-800">
          <!-- Navigation -->
          <nav class="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div class="flex justify-between items-center py-4">
                      <div class="flex items-center">
                          <a href="/" class="text-2xl font-light tracking-wider">intru</a>
                      </div>
                      <div class="hidden md:flex space-x-8">
                          <a href="/shop" class="text-gray-600 hover:text-gray-900 transition-colors">Shop</a>
                          <a href="/shop/collections/t-shirts" class="text-gray-600 hover:text-gray-900 transition-colors">T-Shirts</a>
                          <a href="/shop/collections/shirts" class="text-gray-600 hover:text-gray-900 transition-colors">Shirts</a>
                          <a href="/shop/sale" class="text-gray-600 hover:text-gray-900 transition-colors">Sale</a>
                      </div>
                      <div class="flex items-center space-x-4">
                          <button class="text-gray-600 hover:text-gray-900">
                              <i class="fas fa-search"></i>
                          </button>
                          <button class="relative">
                              <i class="fas fa-shopping-bag text-gray-600 hover:text-gray-900"></i>
                          </button>
                          <a href="/admin" class="text-gray-600 hover:text-gray-900">
                              <i class="fas fa-user"></i>
                          </a>
                      </div>
                  </div>
              </div>
          </nav>

          <!-- Product Details -->
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <!-- Product Images -->
                  <div>
                      <div class="aspect-square overflow-hidden bg-gray-100 mb-4">
                          <img 
                              id="main-image"
                              src="${productData.images[0] || '/static/placeholder.jpg'}" 
                              alt="${productData.name}"
                              class="w-full h-full object-cover"
                          >
                      </div>
                      <div class="grid grid-cols-4 gap-2">
                          ${productData.images.map((img, index) => `
                              <button class="aspect-square overflow-hidden bg-gray-100 thumbnail ${index === 0 ? 'ring-2 ring-black' : ''}" data-image="${img}">
                                  <img src="${img}" alt="${productData.name}" class="w-full h-full object-cover">
                              </button>
                          `).join('')}
                      </div>
                  </div>

                  <!-- Product Info -->
                  <div>
                      <nav class="text-sm text-gray-500 mb-4">
                          <a href="/shop" class="hover:text-gray-700">Shop</a> / 
                          <span class="text-gray-900">${productData.name}</span>
                      </nav>

                      <h1 class="text-3xl font-light mb-4">${productData.name}</h1>
                      
                      <div class="flex items-center gap-4 mb-6">
                          <span class="text-2xl font-medium">₹${productData.price}</span>
                          ${productData.compare_price ? `
                              <span class="text-xl text-gray-500 line-through">₹${productData.compare_price}</span>
                              <span class="bg-red-500 text-white text-sm px-2 py-1">Sale</span>
                          ` : ''}
                      </div>

                      <p class="text-gray-600 mb-6">${productData.description}</p>

                      <!-- Size Selection -->
                      ${productData.variants.sizes ? `
                          <div class="mb-6">
                              <h3 class="font-medium mb-3">Size</h3>
                              <div class="flex flex-wrap gap-2">
                                  ${productData.variants.sizes.map(size => `
                                      <button class="size-option px-4 py-2 border border-gray-300 hover:border-black transition-colors" data-size="${size}">
                                          ${size}
                                      </button>
                                  `).join('')}
                              </div>
                              <button class="text-sm text-gray-600 underline mt-2" id="size-guide-btn">
                                  Size Guide
                              </button>
                          </div>
                      ` : ''}

                      <!-- Add to Cart -->
                      <div class="space-y-4 mb-8">
                          <button class="w-full bg-black text-white py-4 hover:bg-gray-800 transition-colors text-lg" id="add-to-cart">
                              Add to Cart
                          </button>
                          <button class="w-full border-2 border-black py-4 hover:bg-black hover:text-white transition-colors" id="buy-now">
                              Buy Now
                          </button>
                      </div>

                      <!-- AI Assistant -->
                      <div class="border border-gray-200 p-4 mb-8">
                          <div class="flex items-center mb-3">
                              <i class="fas fa-robot text-gray-600 mr-2"></i>
                              <span class="font-medium">Need help choosing?</span>
                          </div>
                          <p class="text-gray-600 text-sm mb-3">Ask our AI assistant about sizing, styling, or any questions about this product.</p>
                          <button class="bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm transition-colors" id="product-ai-assistant">
                              Chat with Assistant
                          </button>
                      </div>

                      <!-- Product Details -->
                      <div class="space-y-4">
                          <details class="border-b pb-4">
                              <summary class="font-medium cursor-pointer">Product Details</summary>
                              <div class="mt-4 text-gray-600">
                                  <p>SKU: ${productData.sku}</p>
                                  ${productData.variants.fit ? `<p>Fit: ${productData.variants.fit}</p>` : ''}
                                  ${productData.variants.colors ? `<p>Available Colors: ${productData.variants.colors.join(', ')}</p>` : ''}
                              </div>
                          </details>
                          <details class="border-b pb-4">
                              <summary class="font-medium cursor-pointer">Care Instructions</summary>
                              <div class="mt-4 text-gray-600">
                                  <p>Turn it inside out before washing—hand or machine wash both work fine.</p>
                                  <p>Avoid bleach and tumble dry on low heat.</p>
                              </div>
                          </details>
                          <details class="border-b pb-4">
                              <summary class="font-medium cursor-pointer">Shipping & Returns</summary>
                              <div class="mt-4 text-gray-600">
                                  <p>Free shipping on prepaid orders across India</p>
                                  <p>COD available with minimal charges</p>
                                  <p>Easy 7-day returns & exchanges</p>
                              </div>
                          </details>
                      </div>
                  </div>
              </div>
          </div>

          <!-- AI Assistant Modal -->
          <div id="ai-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50">
              <div class="flex items-center justify-center min-h-screen p-4">
                  <div class="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-hidden">
                      <div class="flex justify-between items-center p-6 border-b">
                          <h3 class="text-xl font-medium">Product Assistant</h3>
                          <button id="close-ai-modal" class="text-gray-400 hover:text-gray-600">
                              <i class="fas fa-times"></i>
                          </button>
                      </div>
                      <div id="ai-chat-container" class="h-96 overflow-y-auto p-6">
                          <div class="mb-4 p-4 bg-gray-50 rounded-lg">
                              <p class="text-gray-600">👋 Hi! I can help you with questions about the ${productData.name}. Ask me about sizing, styling, or anything else!</p>
                          </div>
                      </div>
                      <div class="p-6 border-t">
                          <div class="flex gap-2">
                              <input 
                                  type="text" 
                                  id="ai-input" 
                                  placeholder="Ask about this product..."
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

          <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
          <script>
              const productData = ${JSON.stringify(productData)};
              let selectedSize = null;
              const sessionId = 'session_' + Math.random().toString(36).substring(7);

              document.addEventListener('DOMContentLoaded', function() {
                  // Image gallery
                  document.querySelectorAll('.thumbnail').forEach(thumb => {
                      thumb.addEventListener('click', function() {
                          document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('ring-2', 'ring-black'))
                          this.classList.add('ring-2', 'ring-black')
                          document.getElementById('main-image').src = this.dataset.image
                      })
                  })

                  // Size selection
                  document.querySelectorAll('.size-option').forEach(btn => {
                      btn.addEventListener('click', function() {
                          document.querySelectorAll('.size-option').forEach(b => {
                              b.classList.remove('bg-black', 'text-white')
                              b.classList.add('border-gray-300')
                          })
                          this.classList.remove('border-gray-300')
                          this.classList.add('bg-black', 'text-white')
                          selectedSize = this.dataset.size
                      })
                  })

                  // AI Assistant
                  document.getElementById('product-ai-assistant').addEventListener('click', function() {
                      document.getElementById('ai-modal').classList.remove('hidden')
                  })

                  document.getElementById('close-ai-modal').addEventListener('click', function() {
                      document.getElementById('ai-modal').classList.add('hidden')
                  })

                  document.getElementById('send-ai-message').addEventListener('click', sendAIMessage)
                  document.getElementById('ai-input').addEventListener('keypress', function(e) {
                      if (e.key === 'Enter') sendAIMessage()
                  })

                  async function sendAIMessage() {
                      const input = document.getElementById('ai-input')
                      const message = input.value.trim()
                      if (!message) return

                      const container = document.getElementById('ai-chat-container')
                      
                      // Add user message
                      container.innerHTML += \`
                          <div class="mb-4 text-right">
                              <div class="inline-block bg-black text-white p-3 rounded-lg max-w-xs">
                                  \${message}
                              </div>
                          </div>
                      \`

                      input.value = ''
                      
                      try {
                          const response = await axios.post('/api/ai/chat', {
                              message: message,
                              session_id: sessionId,
                              product_id: productData.id,
                              context: { product: productData, selected_size: selectedSize }
                          })

                          if (response.data.success) {
                              container.innerHTML += \`
                                  <div class="mb-4">
                                      <div class="bg-gray-50 p-3 rounded-lg">
                                          \${response.data.data.message}
                                      </div>
                                  </div>
                              \`
                          }
                      } catch (error) {
                          console.error('AI chat error:', error)
                      }

                      container.scrollTop = container.scrollHeight
                  }

                  // Add to cart
                  document.getElementById('add-to-cart').addEventListener('click', function() {
                      if (productData.variants.sizes && !selectedSize) {
                          alert('Please select a size')
                          return
                      }
                      
                      // Track analytics
                      axios.post('/api/analytics/track', {
                          event_type: 'add_to_cart',
                          session_id: sessionId,
                          product_id: productData.id,
                          properties: { size: selectedSize }
                      })

                      alert('Added to cart! (This would integrate with Shopify Buy Button in production)')
                  })

                  document.getElementById('buy-now').addEventListener('click', function() {
                      if (productData.variants.sizes && !selectedSize) {
                          alert('Please select a size')
                          return
                      }
                      
                      alert('Redirecting to checkout... (This would integrate with Shopify checkout)')
                  })
              })
          </script>
      </body>
      </html>
    `)
  } catch (error) {
    console.error('Error loading product:', error)
    return c.html(`
      <html>
      <head><title>Error - intru</title></head>
      <body>
        <div class="flex items-center justify-center min-h-screen">
          <div class="text-center">
            <h1 class="text-4xl mb-4">Something went wrong</h1>
            <a href="/shop" class="bg-black text-white px-6 py-3">Continue Shopping</a>
          </div>
        </div>
      </body>
      </html>
    `, 500)
  }
})

// Collections pages
shopRoutes.get('/collections/:category', (c) => {
  const category = c.req.param('category')
  // This would filter products by category
  return c.redirect(`/shop?category=${category}`)
})

// Sale page
shopRoutes.get('/sale', (c) => {
  return c.redirect('/shop?sale=true')
})