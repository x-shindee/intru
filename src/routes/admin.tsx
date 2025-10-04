import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
  KV: KVNamespace  
  R2: R2Bucket
  AI: any
}

export const adminRoutes = new Hono<{ Bindings: Bindings }>()

// Admin login/dashboard
adminRoutes.get('/', async (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Portal - intru</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .role-card {
            transition: all 0.3s ease;
          }
          .role-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }
        </style>
    </head>
    <body class="bg-gray-50 min-h-screen">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center">
                        <a href="/" class="text-2xl font-light tracking-wider text-gray-900">intru</a>
                        <span class="ml-4 text-sm text-gray-500">Admin Portal</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <a href="/" class="text-gray-600 hover:text-gray-900">
                            <i class="fas fa-home mr-1"></i> Store Front
                        </a>
                        <button class="text-gray-600 hover:text-gray-900">
                            <i class="fas fa-bell"></i>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-light text-gray-900 mb-4">Welcome to intru Admin</h1>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Choose your role to access tailored tools, dashboards, and guided experiences designed for your specific responsibilities.
                </p>
            </div>

            <!-- Role Selection -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Business Owner -->
                <div class="role-card bg-white rounded-lg shadow-sm p-8 cursor-pointer" onclick="selectRole('owner')">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-crown text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Business Owner</h3>
                        <p class="text-gray-600 mb-4">High-level dashboard with revenue insights, growth recommendations, and strategic overview</p>
                        <ul class="text-sm text-gray-500 space-y-1">
                            <li>• Revenue & Performance Analytics</li>
                            <li>• Growth Strategy Dashboard</li>
                            <li>• 30/60/90 Day Playbooks</li>
                            <li>• Executive Reports</li>
                        </ul>
                    </div>
                </div>

                <!-- Store Manager -->
                <div class="role-card bg-white rounded-lg shadow-sm p-8 cursor-pointer" onclick="selectRole('manager')">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-tasks text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Store Manager</h3>
                        <p class="text-gray-600 mb-4">Operational tools for orders, inventory, fulfillment, and day-to-day store management</p>
                        <ul class="text-sm text-gray-500 space-y-1">
                            <li>• Order Management & Fulfillment</li>
                            <li>• Inventory Tracking & Alerts</li>
                            <li>• Customer Service Tools</li>
                            <li>• Staff Management</li>
                        </ul>
                    </div>
                </div>

                <!-- Marketer -->
                <div class="role-card bg-white rounded-lg shadow-sm p-8 cursor-pointer" onclick="selectRole('marketer')">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-bullhorn text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Marketer</h3>
                        <p class="text-gray-600 mb-4">Campaign tools, social media insights, content creation, and audience targeting</p>
                        <ul class="text-sm text-gray-500 space-y-1">
                            <li>• Campaign Creation & Management</li>
                            <li>• Instagram Analytics & Insights</li>
                            <li>• Content Calendar & Templates</li>
                            <li>• Customer Segmentation</li>
                        </ul>
                    </div>
                </div>

                <!-- Developer -->
                <div class="role-card bg-white rounded-lg shadow-sm p-8 cursor-pointer" onclick="selectRole('developer')">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-code text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Developer</h3>
                        <p class="text-gray-600 mb-4">Technical tools for API management, integrations, deployments, and system monitoring</p>
                        <ul class="text-sm text-gray-500 space-y-1">
                            <li>• API Keys & Webhook Management</li>
                            <li>• Deployment Controls</li>
                            <li>• System Monitoring & Logs</li>
                            <li>• Integration Management</li>
                        </ul>
                    </div>
                </div>

                <!-- Coder -->
                <div class="role-card bg-white rounded-lg shadow-sm p-8 cursor-pointer" onclick="selectRole('coder')">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-terminal text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Coder</h3>
                        <p class="text-gray-600 mb-4">Advanced technical access with code editing, database management, and system controls</p>
                        <ul class="text-sm text-gray-500 space-y-1">
                            <li>• Direct Code Editor Access</li>
                            <li>• Database Query Interface</li>
                            <li>• Advanced System Controls</li>
                            <li>• Performance Monitoring</li>
                        </ul>
                    </div>
                </div>

                <!-- Non-Coder -->
                <div class="role-card bg-white rounded-lg shadow-sm p-8 cursor-pointer" onclick="selectRole('non_coder')">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-paint-brush text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Non-Coder</h3>
                        <p class="text-gray-600 mb-4">Visual tools and wizards for easy store management without technical complexity</p>
                        <ul class="text-sm text-gray-500 space-y-1">
                            <li>• Visual Theme Editor</li>
                            <li>• Drag & Drop Page Builder</li>
                            <li>• Product Upload Wizards</li>
                            <li>• Simple Discount Creator</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="mt-16 bg-white rounded-lg shadow-sm p-8">
                <h2 class="text-2xl font-light text-gray-900 mb-6 text-center">Store Overview</h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900" id="total-revenue">₹0</div>
                        <div class="text-gray-600">Total Revenue</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900" id="total-orders">0</div>
                        <div class="text-gray-600">Total Orders</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900" id="total-products">5</div>
                        <div class="text-gray-600">Products</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900" id="ai-interactions">0</div>
                        <div class="text-gray-600">AI Interactions</div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="mt-8 bg-white rounded-lg shadow-sm p-8">
                <h2 class="text-xl font-medium text-gray-900 mb-6">Recent Activity</h2>
                <div class="space-y-4" id="recent-activity">
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-info-circle mr-3"></i>
                        <span>Welcome to your intru admin portal! Choose a role above to get started.</span>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
            function selectRole(role) {
                localStorage.setItem('adminRole', role)
                window.location.href = \`/admin/dashboard/\${role}\`
            }

            // Load dashboard stats
            document.addEventListener('DOMContentLoaded', async function() {
                try {
                    // This would load real stats from the API
                    // For now, showing demo data
                    
                    // Simulate loading recent activity
                    setTimeout(() => {
                        document.getElementById('recent-activity').innerHTML = \`
                            <div class="flex items-center text-gray-600">
                                <i class="fas fa-shopping-cart text-blue-500 mr-3"></i>
                                <span>Demo data loaded - ready for testing</span>
                                <span class="ml-auto text-sm">Just now</span>
                            </div>
                            <div class="flex items-center text-gray-600">
                                <i class="fas fa-database text-green-500 mr-3"></i>
                                <span>Database initialized with sample products</span>
                                <span class="ml-auto text-sm">2 minutes ago</span>
                            </div>
                            <div class="flex items-center text-gray-600">
                                <i class="fas fa-robot text-purple-500 mr-3"></i>
                                <span>AI assistant configured and ready</span>
                                <span class="ml-auto text-sm">5 minutes ago</span>
                            </div>
                        \`
                    }, 1000)
                } catch (error) {
                    console.error('Error loading dashboard stats:', error)
                }
            })
        </script>
    </body>
    </html>
  `)
})

// Role-specific dashboards
adminRoutes.get('/dashboard/:role', async (c) => {
  const { env } = c
  const role = c.req.param('role')

  // Get role-specific data
  let dashboardData = {}
  
  switch (role) {
    case 'owner':
      dashboardData = await getOwnerDashboard(env)
      break
    case 'manager':
      dashboardData = await getManagerDashboard(env)
      break
    case 'marketer':
      dashboardData = await getMarketerDashboard(env)
      break
    case 'developer':
      dashboardData = await getDeveloperDashboard(env)
      break
    case 'coder':
      dashboardData = await getCoderDashboard(env)
      break
    case 'non_coder':
      dashboardData = await getNonCoderDashboard(env)
      break
    default:
      return c.redirect('/admin')
  }

  return c.html(generateRoleDashboard(role, dashboardData))
})

// API endpoints for admin data
adminRoutes.get('/api/dashboard/:role', async (c) => {
  const { env } = c
  const role = c.req.param('role')

  try {
    let data = {}
    
    switch (role) {
      case 'owner':
        data = await getOwnerDashboard(env)
        break
      case 'manager':  
        data = await getManagerDashboard(env)
        break
      case 'marketer':
        data = await getMarketerDashboard(env)
        break
      default:
        data = { message: 'Role-specific data not implemented yet' }
    }

    return c.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return c.json({ success: false, error: 'Failed to fetch dashboard data' }, 500)
  }
})

// Growth recommendations API
adminRoutes.get('/api/growth-recommendations', async (c) => {
  try {
    const { env } = c
    const stmt = env.DB.prepare(`
      SELECT * FROM growth_recommendations 
      WHERE status != 'cancelled'
      ORDER BY 
        CASE priority 
          WHEN 'urgent' THEN 1
          WHEN 'high' THEN 2  
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END,
        created_at DESC
      LIMIT 10
    `)
    const result = await stmt.all()

    const recommendations = result.results?.map((rec: any) => ({
      ...rec,
      action_items: JSON.parse(rec.action_items || '[]'),
      results: rec.results ? JSON.parse(rec.results) : null
    })) || []

    return c.json({ success: true, data: recommendations })
  } catch (error) {
    console.error('Error fetching growth recommendations:', error)
    return c.json({ success: false, error: 'Failed to fetch recommendations' }, 500)
  }
})

// User guides API
adminRoutes.get('/api/user-guides/:role', async (c) => {
  try {
    const { env } = c
    const role = c.req.param('role')
    
    const stmt = env.DB.prepare(`
      SELECT * FROM user_guides 
      WHERE role = ? AND is_active = 1
      ORDER BY guide_type, created_at
    `)
    const result = await stmt.bind(role).all()

    const guides = result.results?.map((guide: any) => ({
      ...guide,
      steps: JSON.parse(guide.steps || '[]'),
      triggers: JSON.parse(guide.triggers || '{}')
    })) || []

    return c.json({ success: true, data: guides })
  } catch (error) {
    console.error('Error fetching user guides:', error)
    return c.json({ success: false, error: 'Failed to fetch guides' }, 500)
  }
})

// Helper functions for role-specific data
async function getOwnerDashboard(env: any) {
  try {
    // Revenue overview
    const revenueStmt = env.DB.prepare(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_order_value
      FROM orders 
      WHERE status IN ('confirmed', 'processing', 'shipped', 'delivered')
    `)
    const revenueData = await revenueStmt.first() || { total_orders: 0, total_revenue: 0, avg_order_value: 0 }

    // Top products
    const productsStmt = env.DB.prepare(`
      SELECT p.name, SUM(oi.quantity) as units_sold, SUM(oi.total) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.id
      ORDER BY units_sold DESC
      LIMIT 5
    `)
    const topProducts = await productsStmt.all()

    // Growth recommendations
    const recommendationsStmt = env.DB.prepare(`
      SELECT * FROM growth_recommendations 
      WHERE status = 'pending' AND priority IN ('urgent', 'high')
      ORDER BY 
        CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 END,
        created_at DESC
      LIMIT 3
    `)
    const recommendations = await recommendationsStmt.all()

    return {
      revenue: revenueData,
      top_products: topProducts.results || [],
      recommendations: recommendations.results || []
    }
  } catch (error) {
    console.error('Error in getOwnerDashboard:', error)
    return { revenue: { total_orders: 0, total_revenue: 0, avg_order_value: 0 }, top_products: [], recommendations: [] }
  }
}

async function getManagerDashboard(env: any) {
  try {
    // Pending orders
    const ordersStmt = env.DB.prepare(`
      SELECT * FROM orders 
      WHERE status IN ('pending', 'confirmed') 
      ORDER BY created_at DESC 
      LIMIT 10
    `)
    const pendingOrders = await ordersStmt.all()

    // Low inventory alerts
    const inventoryStmt = env.DB.prepare(`
      SELECT * FROM products 
      WHERE inventory_quantity <= 10 AND status = 'active'
      ORDER BY inventory_quantity ASC
    `)
    const lowInventory = await inventoryStmt.all()

    return {
      pending_orders: pendingOrders.results || [],
      low_inventory: lowInventory.results || []
    }
  } catch (error) {
    console.error('Error in getManagerDashboard:', error)
    return { pending_orders: [], low_inventory: [] }
  }
}

async function getMarketerDashboard(env: any) {
  try {
    // AI interactions insights
    const aiStmt = env.DB.prepare(`
      SELECT intent, COUNT(*) as count
      FROM ai_interactions 
      WHERE intent IS NOT NULL AND created_at > datetime('now', '-30 days')
      GROUP BY intent
      ORDER BY count DESC
      LIMIT 5
    `)
    const aiInsights = await aiStmt.all()

    // Top performing content (placeholder)
    const socialContent = []

    return {
      ai_insights: aiInsights.results || [],
      social_content: socialContent,
      campaign_suggestions: [
        { type: 'instagram_post', title: 'Seasonal Collection Launch', priority: 'high' },
        { type: 'email_campaign', title: 'Re-engagement Series', priority: 'medium' }
      ]
    }
  } catch (error) {
    console.error('Error in getMarketerDashboard:', error)
    return { ai_insights: [], social_content: [], campaign_suggestions: [] }
  }
}

async function getDeveloperDashboard(env: any) {
  return {
    api_status: { status: 'healthy', uptime: '99.9%' },
    recent_deployments: [],
    webhook_logs: []
  }
}

async function getCoderDashboard(env: any) {
  return {
    system_health: { cpu: '15%', memory: '45%', storage: '60%' },
    recent_queries: [],
    performance_metrics: []
  }
}

async function getNonCoderDashboard(env: any) {
  return {
    quick_actions: [
      { title: 'Add New Product', icon: 'fas fa-plus', action: 'product-wizard' },
      { title: 'Create Discount', icon: 'fas fa-percent', action: 'discount-wizard' },
      { title: 'Update Homepage', icon: 'fas fa-home', action: 'page-builder' }
    ],
    recent_uploads: []
  }
}

// Google Sheets sync API
adminRoutes.post('/api/sync-sheets', async (c) => {
  try {
    const { env } = c
    
    // Demo sync - in production this would use real Google Sheets API
    const result = {
      success: true,
      results: {
        products: true,
        orders: true, 
        personas: true,
        analytics: true,
        recommendations: true
      },
      timestamp: new Date().toISOString(),
      message: 'Data successfully synced to Google Sheets (demo mode)'
    }

    return c.json(result)
  } catch (error) {
    console.error('Error syncing to Google Sheets:', error)
    return c.json({ 
      success: false, 
      error: 'Failed to sync data to Google Sheets'
    }, 500)
  }
})

// Export data to CSV for Google Sheets import
adminRoutes.get('/api/export/:dataType', async (c) => {
  try {
    const { env } = c
    const dataType = c.req.param('dataType')
    
    let data = []
    let headers = []
    
    switch (dataType) {
      case 'products':
        const productsStmt = env.DB.prepare('SELECT * FROM products ORDER BY created_at DESC')
        const productsResult = await productsStmt.all()
        data = productsResult.results || []
        headers = ['ID', 'Name', 'Slug', 'Price', 'Status', 'Created']
        break
        
      case 'personas':
        const personasStmt = env.DB.prepare('SELECT * FROM customer_personas ORDER BY created_at DESC')
        const personasResult = await personasStmt.all()
        data = personasResult.results || []
        headers = ['ID', 'Name', 'Description', 'Created']
        break
        
      default:
        return c.json({ success: false, error: 'Invalid data type' }, 400)
    }

    // Convert to CSV format
    const csvData = [
      headers.join(','),
      ...data.map((item: any) => 
        headers.map(header => {
          const value = item[header.toLowerCase()] || ''
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        }).join(',')
      )
    ].join('\n')

    return c.text(csvData, 200, {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${dataType}-export.csv"`
    })
  } catch (error) {
    console.error('Error exporting data:', error)
    return c.json({ success: false, error: 'Failed to export data' }, 500)
  }
})

function generateRoleDashboard(role: string, data: any) {
  // This would generate role-specific HTML dashboards
  // For brevity, returning a simplified version
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard - intru</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center">
                        <a href="/admin" class="text-2xl font-light tracking-wider text-gray-900">intru</a>
                        <span class="ml-4 text-sm text-gray-500">${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button id="start-tour" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            <i class="fas fa-route mr-2"></i>Start Tour
                        </button>
                        <a href="/admin" class="text-gray-600 hover:text-gray-900">Switch Role</a>
                        <a href="/" class="text-gray-600 hover:text-gray-900">Store Front</a>
                    </div>
                </div>
            </div>
        </nav>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="mb-8">
                <h1 class="text-3xl font-light text-gray-900">Welcome back!</h1>
                <p class="text-gray-600">Here's your ${role} dashboard with everything you need.</p>
            </div>

            <!-- Role-specific content would go here -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-lg shadow-sm p-6">
                        <h2 class="text-xl font-medium mb-4">Dashboard Content</h2>
                        <p class="text-gray-600">Role-specific dashboard content for ${role} would be displayed here.</p>
                        <pre class="mt-4 bg-gray-100 p-4 rounded text-sm overflow-auto">${JSON.stringify(data, null, 2)}</pre>
                    </div>
                </div>
                
                <div>
                    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h3 class="text-lg font-medium mb-4">Quick Actions</h3>
                        <div class="space-y-2">
                            <button class="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
                                <i class="fas fa-chart-bar mr-2"></i>View Analytics
                            </button>
                            <button class="w-full text-left px-4 py-2 hover:bg-gray-50 rounded">
                                <i class="fas fa-cog mr-2"></i>Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tour Modal -->
        <div id="tour-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg max-w-2xl w-full">
                    <div class="p-6">
                        <h3 class="text-xl font-medium mb-4">Dashboard Tour</h3>
                        <p class="text-gray-600">This tour will guide you through the ${role} dashboard features.</p>
                        <div class="flex justify-end mt-6 space-x-3">
                            <button id="skip-tour" class="px-4 py-2 text-gray-600 hover:text-gray-800">Skip</button>
                            <button id="start-tour-btn" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">Start Tour</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            const roleData = ${JSON.stringify(data)};
            
            document.addEventListener('DOMContentLoaded', function() {
                // Tour functionality
                document.getElementById('start-tour').addEventListener('click', function() {
                    document.getElementById('tour-modal').classList.remove('hidden')
                })

                document.getElementById('skip-tour').addEventListener('click', function() {
                    document.getElementById('tour-modal').classList.add('hidden')
                })

                document.getElementById('start-tour-btn').addEventListener('click', function() {
                    document.getElementById('tour-modal').classList.add('hidden')
                    startGuidedTour('${role}')
                })

                // Load user guides for this role
                loadUserGuides('${role}')
            })

            async function loadUserGuides(role) {
                try {
                    const response = await fetch(\`/admin/api/user-guides/\${role}\`)
                    const data = await response.json()
                    
                    if (data.success && data.data.length > 0) {
                        console.log('User guides loaded:', data.data)
                    }
                } catch (error) {
                    console.error('Error loading user guides:', error)
                }
            }

            function startGuidedTour(role) {
                // Simple tour implementation
                alert(\`Starting guided tour for \${role} dashboard!\\n\\nThis would show interactive tooltips and step-by-step guidance through the dashboard features.\`)
            }
        </script>
    </body>
    </html>
  `
}