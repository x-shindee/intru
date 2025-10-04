import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
  KV: KVNamespace
  R2: R2Bucket
  AI: any
}

export const apiRoutes = new Hono<{ Bindings: Bindings }>()

// Products API
apiRoutes.get('/products', async (c) => {
  try {
    const { env } = c
    const { limit = '12', offset = '0', category, search, sort = 'created_at DESC' } = c.req.query()

    let query = `
      SELECT p.*, GROUP_CONCAT(r.rating) as avg_rating, COUNT(r.id) as review_count
      FROM products p 
      LEFT JOIN reviews r ON p.id = r.product_id AND r.status = 'published'
      WHERE p.status = 'active'
    `
    const params = []

    if (category) {
      query += ` AND p.categories LIKE ?`
      params.push(`%"${category}"%`)
    }

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    query += ` GROUP BY p.id ORDER BY ${sort} LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const stmt = env.DB.prepare(query)
    const result = await stmt.bind(...params).all()

    const products = result.results?.map((product: any) => ({
      ...product,
      images: JSON.parse(product.images || '[]'),
      variants: JSON.parse(product.variants || '{}'),
      categories: JSON.parse(product.categories || '[]'),
      tags: JSON.parse(product.tags || '[]'),
      avg_rating: product.avg_rating ? 
        Math.round((product.avg_rating.split(',').reduce((a: number, b: string) => a + parseInt(b), 0) / product.avg_rating.split(',').length) * 10) / 10 
        : null,
      review_count: product.review_count || 0
    })) || []

    return c.json({
      success: true,
      data: products,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: products.length
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return c.json({ success: false, error: 'Failed to fetch products' }, 500)
  }
})

// Single product API
apiRoutes.get('/products/:slug', async (c) => {
  try {
    const { env } = c
    const slug = c.req.param('slug')

    const stmt = env.DB.prepare(`
      SELECT p.*, GROUP_CONCAT(r.rating) as avg_rating, COUNT(r.id) as review_count
      FROM products p 
      LEFT JOIN reviews r ON p.id = r.product_id AND r.status = 'published'
      WHERE p.slug = ? AND p.status = 'active'
      GROUP BY p.id
    `)
    const result = await stmt.bind(slug).first()

    if (!result) {
      return c.json({ success: false, error: 'Product not found' }, 404)
    }

    const product = {
      ...result,
      images: JSON.parse(result.images || '[]'),
      variants: JSON.parse(result.variants || '{}'),
      categories: JSON.parse(result.categories || '[]'),
      tags: JSON.parse(result.tags || '[]'),
      avg_rating: result.avg_rating ? 
        Math.round((result.avg_rating.split(',').reduce((a: number, b: string) => a + parseInt(b), 0) / result.avg_rating.split(',').length) * 10) / 10 
        : null,
      review_count: result.review_count || 0
    }

    // Get related products
    const relatedStmt = env.DB.prepare(`
      SELECT * FROM products 
      WHERE categories LIKE ? AND id != ? AND status = 'active'
      ORDER BY RANDOM() LIMIT 4
    `)
    const relatedResult = await relatedStmt.bind(`%"${JSON.parse(product.categories)[0]}"%`, product.id).all()
    const relatedProducts = relatedResult.results?.map((p: any) => ({
      ...p,
      images: JSON.parse(p.images || '[]'),
      variants: JSON.parse(p.variants || '{}')
    })) || []

    return c.json({
      success: true,
      data: { product, related_products: relatedProducts }
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return c.json({ success: false, error: 'Failed to fetch product' }, 500)
  }
})

// Categories API
apiRoutes.get('/categories', async (c) => {
  try {
    const { env } = c
    const stmt = env.DB.prepare(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.categories LIKE '%"' || c.slug || '"%' AND p.status = 'active'
      WHERE c.is_active = 1
      GROUP BY c.id
      ORDER BY c.sort_order, c.name
    `)
    const result = await stmt.all()

    return c.json({
      success: true,
      data: result.results || []
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return c.json({ success: false, error: 'Failed to fetch categories' }, 500)
  }
})

// AI Assistant Chat API
apiRoutes.post('/ai/chat', async (c) => {
  try {
    const { env } = c
    const { message, session_id, product_id, context } = await c.req.json()

    if (!message || !session_id) {
      return c.json({ success: false, error: 'Message and session_id are required' }, 400)
    }

    // Store user message
    await env.DB.prepare(`
      INSERT INTO ai_interactions (session_id, message_type, message, product_id, context, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      session_id,
      'user_message', 
      message,
      product_id || null,
      JSON.stringify(context || {}),
      new Date().toISOString()
    ).run()

    // Simple AI response logic (would integrate with OpenRouter/Gemini in production)
    let aiResponse = ''
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('size') || lowerMessage.includes('fit')) {
      aiResponse = "For sizing, I recommend checking our detailed size guide. Most of our pieces have an oversized fit. If you're between sizes, I'd suggest going with the smaller size for a more fitted look, or your usual size for the intended oversized fit. What's your usual size?"
    } else if (lowerMessage.includes('gift') || lowerMessage.includes('present')) {
      aiResponse = "Great choice for gifting! Our Doodles T-shirt and classic pieces are popular gifts. We offer gift wrapping and easy returns. Do you know the recipient's style preferences or size?"
    } else if (lowerMessage.includes('material') || lowerMessage.includes('fabric')) {
      aiResponse = "Our pieces are made with premium materials - French Terry for tees (240 GSM), high-quality cotton blends for shirts. They're designed to be comfortable and durable. Are you looking for something specific?"
    } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      aiResponse = "We offer free shipping on all prepaid orders across India! COD is also available. Typically takes 3-5 business days. Need it urgently?"
    } else if (lowerMessage.includes('return') || lowerMessage.includes('exchange')) {
      aiResponse = "We have a hassle-free return policy. You can return items within 7 days if they don't fit perfectly. We want you to love your intru pieces!"
    } else {
      aiResponse = "I'm here to help you find the perfect piece from our minimalist collection. You can ask me about sizing, styling tips, product details, or anything else. What specifically are you looking for today?"
    }

    // Store AI response
    await env.DB.prepare(`
      INSERT INTO ai_interactions (session_id, message_type, message, product_id, context, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      session_id,
      'ai_response',
      aiResponse,
      product_id || null,
      JSON.stringify({ intent: 'general_inquiry', confidence: 0.8 }),
      new Date().toISOString()
    ).run()

    return c.json({
      success: true,
      data: {
        message: aiResponse,
        suggestions: [
          "Tell me about sizing",
          "Show me gift options", 
          "What's your return policy?",
          "Help me choose colors"
        ]
      }
    })
  } catch (error) {
    console.error('Error in AI chat:', error)
    return c.json({ success: false, error: 'Failed to process chat message' }, 500)
  }
})

// Reviews API
apiRoutes.get('/reviews/:product_id', async (c) => {
  try {
    const { env } = c
    const productId = c.req.param('product_id')

    const stmt = env.DB.prepare(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? AND r.status = 'published'
      ORDER BY r.created_at DESC
    `)
    const result = await stmt.bind(productId).all()

    const reviews = result.results?.map((review: any) => ({
      ...review,
      images: JSON.parse(review.images || '[]')
    })) || []

    return c.json({
      success: true,
      data: reviews
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return c.json({ success: false, error: 'Failed to fetch reviews' }, 500)
  }
})

// Analytics tracking API
apiRoutes.post('/analytics/track', async (c) => {
  try {
    const { env } = c
    const { event_type, session_id, product_id, page_url, properties } = await c.req.json()

    await env.DB.prepare(`
      INSERT INTO analytics_events (event_type, session_id, product_id, page_url, properties, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      event_type,
      session_id,
      product_id || null,
      page_url || null,
      JSON.stringify(properties || {}),
      new Date().toISOString()
    ).run()

    return c.json({ success: true })
  } catch (error) {
    console.error('Error tracking analytics:', error)
    return c.json({ success: false, error: 'Failed to track event' }, 500)
  }
})

// Newsletter signup API
apiRoutes.post('/newsletter/subscribe', async (c) => {
  try {
    const { email } = await c.req.json()

    if (!email) {
      return c.json({ success: false, error: 'Email is required' }, 400)
    }

    // In production, integrate with email service (Klaviyo, SendGrid, etc.)
    // For now, just return success
    return c.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!' 
    })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return c.json({ success: false, error: 'Failed to subscribe' }, 500)
  }
})

// Search suggestions API
apiRoutes.get('/search/suggestions', async (c) => {
  try {
    const { env } = c
    const { q } = c.req.query()

    if (!q || q.length < 2) {
      return c.json({ success: true, data: [] })
    }

    const stmt = env.DB.prepare(`
      SELECT name, slug FROM products 
      WHERE (name LIKE ? OR tags LIKE ?) AND status = 'active'
      LIMIT 5
    `)
    const result = await stmt.bind(`%${q}%`, `%${q}%`).all()

    return c.json({
      success: true,
      data: result.results || []
    })
  } catch (error) {
    console.error('Error fetching search suggestions:', error)
    return c.json({ success: false, error: 'Failed to fetch suggestions' }, 500)
  }
})