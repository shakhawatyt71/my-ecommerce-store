/**
 * KORA PORT - Main JavaScript
 * Version: 2.0.0 (Fixed)
 */

// ============ GLOBAL STATE ============
window.KoraPort = window.KoraPort || {};

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Kora Port Initializing...');
    
    // Initialize all components
    initializeApp();
});

function initializeApp() {
    try {
        // Core initializations
        initializeCart();
        initializeHeader();
        initializeSearch();
        initializeMobileMenu();
        initializeBackToTop();
        initializeToast();
        loadCategories();
        
        // Update cart badge
        updateCartBadge();
        
        console.log('✅ App initialized successfully');
    } catch (error) {
        console.error('❌ Initialization error:', error);
    }
}

// ============ UTILITY FUNCTIONS ============

/**
 * Format price in Bangladeshi Taka
 */
function formatPrice(price) {
    if (typeof price !== 'number' || isNaN(price)) {
        price = 0;
    }
    return '৳' + price.toLocaleString('bn-BD');
}

/**
 * Render star rating
 */
function renderStars(rating) {
    rating = parseFloat(rating) || 0;
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalf) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

/**
 * Generate unique ID
 */
function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============ CART FUNCTIONS ============

/**
 * Initialize cart from localStorage
 */
function initializeCart() {
    if (!localStorage.getItem('kora_cart')) {
        localStorage.setItem('kora_cart', JSON.stringify([]));
    }
    window.KoraPort.cart = getCart();
}

/**
 * Get cart from localStorage
 */
function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem('kora_cart')) || [];
        return Array.isArray(cart) ? cart : [];
    } catch (e) {
        console.error('Cart parse error:', e);
        return [];
    }
}

/**
 * Save cart to localStorage
 */
function saveCart(cart) {
    try {
        localStorage.setItem('kora_cart', JSON.stringify(cart));
        window.KoraPort.cart = cart;
        updateCartBadge();
    } catch (e) {
        console.error('Cart save error:', e);
    }
}

/**
 * Add item to cart
 */
function addToCart(productId, quantity = 1, variant = null) {
    const cart = getCart();
    const product = getProductById(productId);
    
    if (!product) {
        showToast('প্রোডাক্ট খুঁজে পাওয়া যায়নি', 'error');
        return false;
    }
    
    // Check if item already exists
    const existingIndex = cart.findIndex(item => 
        item.productId === productId && 
        JSON.stringify(item.variant) === JSON.stringify(variant)
    );
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: generateId(),
            productId: productId,
            name: product.name,
            price: product.currentPrice || product.price,
            originalPrice: product.originalPrice || product.price,
            image: product.image || product.images?.[0] || 'images/placeholder.jpg',
            quantity: quantity,
            variant: variant,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart(cart);
    showToast('কার্টে যোগ করা হয়েছে', 'success');
    
    // GTM Event
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': 'add_to_cart',
            'product_id': productId,
            'product_name': product.name,
            'price': product.currentPrice || product.price,
            'quantity': quantity
        });
    }
    
    return true;
}

/**
 * Remove item from cart
 */
function removeFromCart(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
    showToast('কার্ট থেকে সরানো হয়েছে', 'info');
    return true;
}

/**
 * Update cart item quantity
 */
function updateCartQuantity(itemId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
    }
    return true;
}

/**
 * Get cart total
 */
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Get cart item count
 */
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Update cart badge
 */
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const count = getCartItemCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
        
        // Add animation
        badge.classList.add('badge-pop');
        setTimeout(() => badge.classList.remove('badge-pop'), 300);
    }
}

/**
 * Clear entire cart
 */
function clearCart() {
    saveCart([]);
    showToast('কার্ট খালি করা হয়েছে', 'info');
}

// ============ PRODUCT FUNCTIONS ============

/**
 * Get product by ID
 */
function getProductById(productId) {
    if (typeof window.productsData === 'undefined') {
        console.error('Products data not loaded');
        return null;
    }
    return window.productsData.find(p => p.id === productId || p.id === parseInt(productId));
}

/**
 * Get products by category
 */
function getProductsByCategory(category) {
    if (typeof window.productsData === 'undefined') return [];
    return window.productsData.filter(p => p.category === category);
}

/**
 * Get featured products
 */
function getFeaturedProducts(limit = 8) {
    if (typeof window.productsData === 'undefined') return [];
    return window.productsData
        .filter(p => p.featured || p.isFeatured)
        .slice(0, limit);
}

/**
 * Get new arrival products
 */
function getNewArrivals(limit = 8) {
    if (typeof window.productsData === 'undefined') return [];
    return window.productsData
        .filter(p => p.isNew || p.newArrival)
        .slice(0, limit);
}

// ============ HEADER FUNCTIONS ============

/**
 * Initialize header
 */
function initializeHeader() {
    const header = document.getElementById('site-header');
    if (!header) {
        console.warn('Header element not found');
        return;
    }
    
    // Sticky header on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', debounce(function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        // Hide/show on scroll direction
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        lastScroll = currentScroll;
    }, 10));
    
    console.log('✅ Header initialized');
}

/**
 * Initialize mobile menu
 */
function initializeMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('main-nav');
    
    if (!toggle || !nav) return;
    
    toggle.addEventListener('click', function() {
        toggle.classList.toggle('active');
        nav.classList.toggle('nav-open');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu on link click
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            toggle.classList.remove('active');
            nav.classList.remove('nav-open');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Dropdown handling
    const dropdownItems = document.querySelectorAll('.has-dropdown');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.toggle('dropdown-open');
            }
        });
    });
}

// ============ SEARCH FUNCTIONS ============

/**
 * Initialize search
 */
function initializeSearch() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchForm || !searchInput) return;
    
    // Search on input
    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.trim();
        
        if (query.length < 2) {
            if (searchResults) searchResults.innerHTML = '';
            return;
        }
        
        performSearch(query);
    }, 300));
    
    // Form submit
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `pages/shop.html?search=${encodeURIComponent(query)}`;
        }
    });
    
    // Close search results on outside click
    document.addEventListener('click', function(e) {
        if (searchResults && !searchForm.contains(e.target)) {
            searchResults.innerHTML = '';
        }
    });
}

/**
 * Perform search
 */
function performSearch(query) {
    const searchResults = document.getElementById('search-results');
    if (!searchResults || typeof window.productsData === 'undefined') return;
    
    const results = window.productsData.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(query.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 5);
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-result">কোনো প্রোডাক্ট পাওয়া যায়নি</div>';
        return;
    }
    
    searchResults.innerHTML = results.map(product => `
        <a href="pages/product-detail.html?id=${product.id}" class="search-result-item">
            <img src="${product.image || product.images?.[0] || 'images/placeholder.jpg'}" alt="${product.name}">
            <div class="search-result-info">
                <h4>${product.name}</h4>
                <span class="search-result-price">${formatPrice(product.currentPrice || product.price)}</span>
            </div>
        </a>
    `).join('');
}

// ============ CATEGORY FUNCTIONS ============

/**
 * Load categories
 */
function loadCategories() {
    if (typeof window.categoriesData === 'undefined' && typeof window.productsData === 'undefined') {
        console.warn('Categories/Products data not loaded');
        return;
    }
    
    // Get categories from products if categoriesData not available
    let categories = [];
    
    if (typeof window.categoriesData !== 'undefined') {
        categories = window.categoriesData;
    } else if (typeof window.productsData !== 'undefined') {
        const categorySet = new Set();
        window.productsData.forEach(p => {
            if (p.category) categorySet.add(p.category);
        });
        categories = Array.from(categorySet).map((cat, index) => ({
            id: index + 1,
            name: cat,
            slug: cat.toLowerCase().replace(/\s+/g, '-')
        }));
    }
    
    // Populate dropdown
    const dropdown = document.getElementById('category-dropdown');
    if (dropdown && categories.length > 0) {
        dropdown.innerHTML = categories.map(cat => `
            <li>
                <a href="pages/shop.html?category=${encodeURIComponent(cat.slug || cat.name)}" class="dropdown-link">
                    ${cat.name}
                </a>
            </li>
        `).join('');
    }
    
    // Populate categories grid on homepage
    const categoriesGrid = document.getElementById('categories-grid');
    if (categoriesGrid && categories.length > 0) {
        categoriesGrid.innerHTML = categories.slice(0, 6).map(cat => `
            <a href="pages/shop.html?category=${encodeURIComponent(cat.slug || cat.name)}" class="category-card">
                <div class="category-icon">
                    <i class="fas fa-${getCategoryIcon(cat.name)}"></i>
                </div>
                <h4 class="category-name">${cat.name}</h4>
            </a>
        `).join('');
    }
}

/**
 * Get icon for category
 */
function getCategoryIcon(categoryName) {
    const icons = {
        'electronics': 'laptop',
        'fashion': 'tshirt',
        'home': 'home',
        'beauty': 'spa',
        'sports': 'futbol',
        'books': 'book',
        'toys': 'gamepad',
        'grocery': 'shopping-basket',
        'health': 'heartbeat',
        'automotive': 'car'
    };
    
    const key = categoryName.toLowerCase();
    for (const [name, icon] of Object.entries(icons)) {
        if (key.includes(name)) return icon;
    }
    return 'tag';
}

// ============ UI FUNCTIONS ============

/**
 * Initialize back to top button
 */
function initializeBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    
    window.addEventListener('scroll', debounce(function() {
        if (window.pageYOffset > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, 100));
    
    btn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize toast notifications
 */
function initializeToast() {
    if (!document.getElementById('toast-container')) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas fa-${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('toast-show'), 10);
    
    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ============ EXPORT FOR GLOBAL ACCESS ============
window.formatPrice = formatPrice;
window.renderStars = renderStars;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.getCart = getCart;
window.saveCart = saveCart;
window.getCartTotal = getCartTotal;
window.getCartItemCount = getCartItemCount;
window.updateCartBadge = updateCartBadge;
window.clearCart = clearCart;
window.getProductById = getProductById;
window.showToast = showToast;
window.generateId = generateId;

console.log('📦 main.js loaded successfully');    '<nav class="site-nav" id="siteNav"><div class="container"><ul class="nav-links">' +
    '<li><a href="'+BASE+'index.html" class="nav-link">'+t('home')+'</a></li>' +
    '<li><a href="'+BASE+'pages/shop.html" class="nav-link">'+t('shop')+'</a></li>' +
    '<li class="nav-dd-wrap"><a href="#" class="nav-link" onclick="return false">'+t('categories')+' ▾</a><div class="nav-dropdown"><div class="dd-inner">'+catDropHtml+'</div></div></li>' +
    '<li><a href="'+BASE+'pages/shop.html?cat=new-arrivals" class="nav-link">🆕 '+t('newArrivals')+'</a></li>' +
    '<li><a href="'+BASE+'pages/shop.html?cat=hot-sales" class="nav-link nav-hot">🔥 '+t('hotSales')+'</a></li>' +
    '<li><a href="'+BASE+'pages/contact.html" class="nav-link">'+t('contact')+'</a></li>' +
    '</ul></div></nav>' +
    '<div class="mob-overlay hidden" id="mobOverlay" onclick="toggleMobileMenu()"></div>' +
    '<aside class="mob-menu" id="mobMenu"><div class="mm-head"><span class="site-logo"><span class="logo-main">KORA</span><span class="logo-accent">PORT</span></span><button class="mm-close" onclick="toggleMobileMenu()">✕</button></div>' +
    '<div class="mm-body"><ul class="mm-nav">' +
    '<li><a href="'+BASE+'index.html">'+t('home')+'</a></li>' +
    '<li><a href="'+BASE+'pages/shop.html">'+t('shop')+'</a></li>' +
    '<li class="mm-has-sub"><a onclick="toggleMobileSub(this)">'+t('categories')+' <span class="mm-arrow">▾</span></a><ul class="mm-sub">'+mobCatHtml+'</ul></li>' +
    '<li><a href="'+BASE+'pages/shop.html?cat=new-arrivals">🆕 '+t('newArrivals')+'</a></li>' +
    '<li><a href="'+BASE+'pages/shop.html?cat=hot-sales">🔥 '+t('hotSales')+'</a></li>' +
    '<li><a href="'+BASE+'pages/contact.html">'+t('contact')+'</a></li>' +
    '<li><a href="'+BASE+'pages/cart.html">🛒 '+t('myCart')+' ('+cc+')</a></li>' +
    '</ul></div>' +
    '<div class="mm-foot"><a href="tel:'+CONFIG.store.phone+'" class="mm-phone">📞 '+CONFIG.store.phone+'</a>' +
    '<a href="'+CONFIG.social.whatsappChat+'?text=Hi!" target="_blank" class="btn btn-primary btn-full btn-sm">💬 '+t('liveChat')+'</a>' +
    '<button class="btn btn-secondary btn-full btn-sm" onclick="toggleLanguage()">'+t('switchLabel')+'</button></div></aside>';
}

/* ═══ FOOTER ═══ */
function buildFooter() {
  return '<footer class="site-footer"><div class="container"><div class="footer-grid">' +
    '<div class="f-col"><div class="site-logo footer-logo"><span class="logo-main">KORA</span><span class="logo-accent">PORT</span></div><p class="f-desc">'+t('storeDesc')+'</p><div class="f-social"><a href="'+CONFIG.social.facebook+'" target="_blank" class="soc-icon">📘</a><a href="'+CONFIG.social.instagram+'" target="_blank" class="soc-icon">📸</a><a href="'+CONFIG.social.tiktok+'" target="_blank" class="soc-icon">🎵</a></div></div>' +
    '<div class="f-col"><h4 class="f-title">'+t('quickLinks')+'</h4><ul class="f-links"><li><a href="'+BASE+'pages/shop.html">'+t('shop')+'</a></li><li><a href="'+BASE+'pages/about.html">'+t('aboutUs')+'</a></li><li><a href="'+BASE+'pages/contact.html">'+t('contact')+'</a></li><li><a href="'+BASE+'pages/track-order.html">'+t('trackOrder')+'</a></li></ul></div>' +
    '<div class="f-col"><h4 class="f-title">'+t('customerService')+'</h4><ul class="f-links"><li><a href="'+BASE+'pages/shipping-policy.html">'+t('shippingPolicy')+'</a></li><li><a href="'+BASE+'pages/return-policy.html">'+t('returnPolicy')+'</a></li><li><a href="'+BASE+'pages/privacy.html">'+t('privacyPolicy')+'</a></li><li><a href="'+BASE+'pages/terms.html">'+t('termsConditions')+'</a></li></ul></div>' +
    '<div class="f-col"><h4 class="f-title">'+t('connectWithUs')+'</h4><ul class="f-contact"><li><a href="tel:'+CONFIG.store.phone+'">📞 '+CONFIG.store.phone+'</a></li><li><a href="mailto:'+CONFIG.store.email+'">📧 '+CONFIG.store.email+'</a></li><li><a href="'+CONFIG.social.whatsappChat+'?text=Hi!" target="_blank" class="live-chat-link">💬 '+t('liveChat')+'</a></li></ul></div>' +
    '</div><div class="footer-bottom"><p class="copyright">'+t('copyright')+'</p><div class="pay-icons"><span class="pay-label">'+t('weAccept')+':</span><span class="pay-badge">bKash</span><span class="pay-badge">Nagad</span><span class="pay-badge">COD</span></div></div></div></footer>';
}

/* ═══ EXTRAS ═══ */
function buildExtras() {
  return '<a href="'+CONFIG.social.whatsappChat+'?text=Hi!" target="_blank" class="wa-float" id="waFloat">💬</a>' +
    '<button class="scroll-top hidden" id="scrollTopBtn" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">⬆</button>';
}

/* ═══ INIT ═══ */
document.addEventListener('DOMContentLoaded', function() {
  var h = document.getElementById('app-header');
  var f = document.getElementById('app-footer');
  if (h) h.innerHTML = buildHeader();
  if (f) f.innerHTML = buildFooter();
  document.body.insertAdjacentHTML('beforeend', buildExtras());
  setupScroll();
  updateCartBadge();
  window.addEventListener('storage', updateCartBadge);
  if (localStorage.getItem('kp-ann-closed') === '1') {
    var bar = document.getElementById('announcementBar');
    if (bar) bar.style.display = 'none';
  }
  console.log('✅ main.js loaded. Products:', typeof PRODUCTS !== 'undefined' ? PRODUCTS.length : 'NOT FOUND');
});

/* ═══ EVENTS ═══ */
function closeAnnouncement() {
  var bar = document.getElementById('announcementBar');
  if (bar) { bar.style.display = 'none'; }
  localStorage.setItem('kp-ann-closed', '1');
}

function toggleMobileMenu() {
  var menu = document.getElementById('mobMenu');
  var ov = document.getElementById('mobOverlay');
  var btn = document.getElementById('hamburgerBtn');
  if (!menu) return;
  var open = menu.classList.contains('open');
  menu.classList.toggle('open');
  if (ov) ov.classList.toggle('hidden');
  if (btn) btn.classList.toggle('active');
  document.body.style.overflow = open ? '' : 'hidden';
}

function toggleMobileSub(el) {
  var p = el.closest('.mm-has-sub');
  if (p) p.classList.toggle('open');
}

function toggleMobileSearch() {
  var w = document.getElementById('mobSearchWrap');
  if (!w) return;
  w.classList.toggle('hidden');
  if (!w.classList.contains('hidden')) { var inp = w.querySelector('input'); if(inp) inp.focus(); }
}

function performSearch(q) {
  if (!q || !q.trim()) return;
  window.location.href = BASE + 'pages/shop.html?search=' + encodeURIComponent(q.trim());
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'bn' : 'en';
  localStorage.setItem('kp-lang', currentLang);
  var h = document.getElementById('app-header');
  var f = document.getElementById('app-footer');
  if (h) h.innerHTML = buildHeader();
  if (f) f.innerHTML = buildFooter();
  updateCartBadge();
}

function setupScroll() {
  window.addEventListener('scroll', function() {
    var y = window.pageYOffset;
    var btn = document.getElementById('scrollTopBtn');
    var hdr = document.getElementById('siteHeader');
    if (btn) { if (y > 400) btn.classList.remove('hidden'); else btn.classList.add('hidden'); }
    if (hdr) { if (y > 10) hdr.classList.add('scrolled'); else hdr.classList.remove('scrolled'); }
  });
}

window.updateCartBadge = updateCartBadge;
window.formatPrice = formatPrice;
window.renderStars = renderStars;
window.t = t;
window.BASE = BASE;
window.showToast = function(msg) {
  var old = document.querySelector('.kp-toast');
  if (old) old.remove();
  var el = document.createElement('div');
  el.className = 'kp-toast';
  el.textContent = msg;
  el.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#0E5B4A;color:#fff;padding:12px 24px;border-radius:50px;font-size:0.9rem;font-weight:600;z-index:999;box-shadow:0 4px 16px rgba(0,0,0,0.2);';
  document.body.appendChild(el);
  setTimeout(function(){el.style.opacity='0';el.style.transition='opacity 0.3s';},2000);
  setTimeout(function(){el.remove();},2500);
};
