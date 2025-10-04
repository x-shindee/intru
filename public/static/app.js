// Main JavaScript for intru ecommerce platform
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let sessionId = localStorage.getItem('sessionId') || 'session_' + Math.random().toString(36).substring(7);
localStorage.setItem('sessionId', sessionId);

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    initializeApp();
});

function initializeApp() {
    // Update cart count
    updateCartCount();
    
    // Load featured products on homepage
    if (document.getElementById('products-grid')) {
        loadFeaturedProducts();
    }
    
    // Initialize AI Assistant
    initializeAIAssistant();
    
    // Initialize newsletter signup
    initializeNewsletter();
    
    // Track page view
    trackEvent('page_view', {
        url: window.location.href,
        title: document.title
    });
}

// Product loading functions
async function loadFeaturedProducts() {
    try {
        const response = await axios.get('/api/products?limit=8');
        if (response.data.success) {
            displayProducts(response.data.data);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showFallbackProducts();
    }
}

function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => `
        <div class="product-hover bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer" onclick="goToProduct('${product.slug}')">
            <div class="aspect-square overflow-hidden">
                <img 
                    src="${product.images[0] || '/static/placeholder.jpg'}" 
                    alt="${product.name}"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onerror="this.src='/static/placeholder.jpg'"
                >
            </div>
            <div class="p-6">
                <h3 class="text-xl font-medium mb-2">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-4">${product.short_description || ''}</p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl font-medium">₹${product.price}</span>
                        ${product.compare_price ? `<span class="text-lg text-gray-500 line-through">₹${product.compare_price}</span>` : ''}
                    </div>
                    <button 
                        class="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors quick-add-btn"
                        onclick="event.stopPropagation(); quickAdd('${product.id}', '${product.name}', ${product.price})"
                    >
                        Quick Add
                    </button>
                </div>
                ${product.compare_price ? '<div class="inline-block bg-red-500 text-white text-xs px-2 py-1 mt-2 rounded">Sale</div>' : ''}
                ${product.avg_rating ? `
                    <div class="flex items-center mt-2">
                        <div class="flex text-yellow-400 text-sm">
                            ${'★'.repeat(Math.floor(product.avg_rating))}${'☆'.repeat(5 - Math.floor(product.avg_rating))}
                        </div>
                        <span class="text-sm text-gray-600 ml-1">(${product.review_count})</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function showFallbackProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    // Fallback products based on intru.in analysis
    const fallbackProducts = [
        {
            name: 'Doodles T-Shirt',
            slug: 'doodles-t-shirt',
            price: 999,
            compare_price: 1499,
            image: 'https://intru.in/cdn/shop/files/3.png?v=1748692106&width=533',
            description: 'Oversized fit with premium French Terry'
        },
        {
            name: 'No Risk Porsche',
            slug: 'no-risk-porsche',
            price: 999,
            compare_price: 1499,
            image: 'https://intru.in/cdn/shop/files/F51687B9-2BF2-43E0-988A-30272833B19E.jpg?v=1756359581&width=533',
            description: 'Bold statement piece for automotive enthusiasts'
        },
        {
            name: 'Romanticise Crop Tee',
            slug: 'romanticise-crop-tee',
            price: 699,
            compare_price: 999,
            image: 'https://intru.in/cdn/shop/files/1_72b59988-d21a-41dc-8a6d-fd6c8255e20c.png?v=1748190539&width=533',
            description: 'Soft, feminine crop tee perfect for layering'
        },
        {
            name: 'Stripe 18 Shirt',
            slug: 'stripe-18-shirt',
            price: 1099,
            compare_price: 1699,
            image: 'https://intru.in/cdn/shop/files/mainimage.png?v=1748173436&width=533',
            description: 'Classic striped shirt for versatile styling'
        }
    ];
    
    grid.innerHTML = fallbackProducts.map(product => `
        <div class="product-hover bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer" onclick="goToProduct('${product.slug}')">
            <div class="aspect-square overflow-hidden">
                <img 
                    src="${product.image}" 
                    alt="${product.name}"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onerror="this.src='/static/placeholder.jpg'"
                >
            </div>
            <div class="p-6">
                <h3 class="text-xl font-medium mb-2">${product.name}</h3>
                <p class="text-gray-600 text-sm mb-4">${product.description}</p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl font-medium">₹${product.price}</span>
                        <span class="text-lg text-gray-500 line-through">₹${product.compare_price}</span>
                    </div>
                    <button 
                        class="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
                        onclick="event.stopPropagation(); quickAdd('${product.slug}', '${product.name}', ${product.price})"
                    >
                        Quick Add
                    </button>
                </div>
                <div class="inline-block bg-red-500 text-white text-xs px-2 py-1 mt-2 rounded">Sale</div>
            </div>
        </div>
    `).join('');
}

// Navigation functions
function goToProduct(slug) {
    trackEvent('product_click', { product_slug: slug });
    window.location.href = `/shop/products/${slug}`;
}

// Cart functions
function quickAdd(productId, productName, price) {
    const item = {
        id: productId,
        name: productName,
        price: price,
        quantity: 1,
        size: 'M' // Default size
    };
    
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Track add to cart
    trackEvent('add_to_cart', {
        product_id: productId,
        product_name: productName,
        price: price,
        quantity: 1
    });
    
    // Show success message
    showNotification(`${productName} added to cart!`, 'success');
}

function updateCartCount() {
    const cartBtn = document.getElementById('cart-count');
    if (cartBtn) {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        if (count > 0) {
            cartBtn.textContent = count;
            cartBtn.classList.remove('hidden');
        } else {
            cartBtn.classList.add('hidden');
        }
    }
}

// AI Assistant functions
function initializeAIAssistant() {
    const aiBtn = document.getElementById('ai-assistant-btn');
    const aiModal = document.getElementById('ai-modal');
    const closeBtn = document.getElementById('close-ai-modal');
    const sendBtn = document.getElementById('send-ai-message');
    const input = document.getElementById('ai-input');
    
    if (aiBtn) {
        aiBtn.addEventListener('click', () => {
            aiModal.classList.remove('hidden');
            input.focus();
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            aiModal.classList.add('hidden');
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendAIMessage);
    }
    
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendAIMessage();
        });
    }
}

async function sendAIMessage() {
    const input = document.getElementById('ai-input');
    const container = document.getElementById('ai-chat-container');
    
    if (!input || !container) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // Add user message to chat
    container.innerHTML += `
        <div class="mb-4 text-right">
            <div class="inline-block bg-black text-white p-3 rounded-lg max-w-xs">
                ${message}
            </div>
        </div>
    `;
    
    input.value = '';
    container.scrollTop = container.scrollHeight;
    
    // Show typing indicator
    container.innerHTML += `
        <div class="mb-4 typing-indicator">
            <div class="bg-gray-50 p-3 rounded-lg">
                <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
            </div>
        </div>
    `;
    
    try {
        const response = await axios.post('/api/ai/chat', {
            message: message,
            session_id: sessionId,
            context: { page: window.location.pathname }
        });
        
        // Remove typing indicator
        document.querySelector('.typing-indicator').remove();
        
        if (response.data.success) {
            container.innerHTML += `
                <div class="mb-4">
                    <div class="bg-gray-50 p-3 rounded-lg">
                        ${response.data.data.message}
                    </div>
                    ${response.data.data.suggestions ? `
                        <div class="flex flex-wrap gap-2 mt-2">
                            ${response.data.data.suggestions.map(suggestion => `
                                <button 
                                    class="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-sm transition-colors"
                                    onclick="document.getElementById('ai-input').value='${suggestion}'; sendAIMessage()"
                                >
                                    ${suggestion}
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            container.innerHTML += `
                <div class="mb-4">
                    <div class="bg-red-50 text-red-700 p-3 rounded-lg">
                        Sorry, I'm having trouble responding right now. Please try again.
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('AI chat error:', error);
        document.querySelector('.typing-indicator').remove();
        
        container.innerHTML += `
            <div class="mb-4">
                <div class="bg-red-50 text-red-700 p-3 rounded-lg">
                    I'm having some technical difficulties. Please try again in a moment.
                </div>
            </div>
        `;
    }
    
    container.scrollTop = container.scrollHeight;
}

// Newsletter functions
function initializeNewsletter() {
    const submitBtn = document.getElementById('newsletter-submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', subscribeNewsletter);
    }
    
    const emailInput = document.getElementById('newsletter-email');
    if (emailInput) {
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') subscribeNewsletter();
        });
    }
}

async function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletter-email');
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        const response = await axios.post('/api/newsletter/subscribe', { email });
        
        if (response.data.success) {
            showNotification('Successfully subscribed to newsletter!', 'success');
            emailInput.value = '';
            
            // Track newsletter signup
            trackEvent('newsletter_signup', { email: email });
        } else {
            showNotification('Failed to subscribe. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        showNotification('Something went wrong. Please try again.', 'error');
    }
}

// Analytics functions
async function trackEvent(eventType, properties = {}) {
    try {
        await axios.post('/api/analytics/track', {
            event_type: eventType,
            session_id: sessionId,
            page_url: window.location.href,
            properties: {
                ...properties,
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                screen_resolution: `${screen.width}x${screen.height}`
            }
        });
    } catch (error) {
        console.error('Analytics tracking error:', error);
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all transform translate-x-full`;
    
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    notification.className += ` ${bgColor} text-white`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span>${message}</span>
            <button class="ml-3 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Search functions
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length >= 2) {
                searchTimeout = setTimeout(() => {
                    fetchSearchSuggestions(query);
                }, 300);
            }
        });
    }
}

async function fetchSearchSuggestions(query) {
    try {
        const response = await axios.get(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        if (response.data.success) {
            displaySearchSuggestions(response.data.data);
        }
    } catch (error) {
        console.error('Search suggestions error:', error);
    }
}

function displaySearchSuggestions(suggestions) {
    // Implementation for search suggestions dropdown
    console.log('Search suggestions:', suggestions);
}

// Google Sheets Integration (for database backup/sync)
async function syncWithGoogleSheets(data, sheetName) {
    // This would integrate with Google Sheets API
    // For now, just log the data
    console.log('Syncing with Google Sheets:', sheetName, data);
}

// Initialize search on load
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});