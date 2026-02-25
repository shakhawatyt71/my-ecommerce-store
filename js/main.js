/*
 * ==========================================
 * 🎯 KORA PORT — Main Controller (Updated)
 * ==========================================
 * হেডার, ফুটার, মোবাইল মেনু, সার্চ,
 * ভাষা টগল, স্ক্রল ইভেন্ট — সব এখানে।
 * + Auto CSS/JS injection
 * + Meta Pixel initialization
 * ==========================================
 */

/* ═══ PATH & LANGUAGE SETUP ═══ */
var BASE = location.pathname.includes('/pages/') ? '../' : './';
var currentLang = localStorage.getItem('kp-lang') || 'en';

/* ═══════════════════════════════════════
   🔌 AUTO INJECT — CSS & JS FILES
   কোনো HTML ফাইল এডিট করা লাগবে না।
   main.js সব পেজে আছে, তাই এখান থেকেই
   বাকি সব CSS/JS অটো লোড হবে।
   ════════
/* ═══════════════════════════════════════
   🔌 AUTO INJECT — CSS & JS + GTM ONLY
   Meta Pixel কোডে নেই। GTM থেকে কন্ট্রোল হবে।
   ═══════════════════════════════════════ */
(function autoInject() {
  /* Responsive CSS */
  if (!document.querySelector('link[href*="responsive.css"]')) {
    var rCSS = document.createElement('link');
    rCSS.rel = 'stylesheet';
    rCSS.href = BASE + 'css/responsive.css';
    document.head.appendChild(rCSS);
  }

  /* GTM Tracking JS */
  if (!document.querySelector('script[src*="gtm-tracking.js"]')) {
    var gJS = document.createElement('script');
    gJS.src = BASE + 'js/gtm-tracking.js';
    document.body.appendChild(gJS);
  }

  /* UI Effects JS */
  if (!document.querySelector('script[src*="ui-effects.js"]')) {
    var uJS = document.createElement('script');
    uJS.src = BASE + 'js/ui-effects.js';
    document.body.appendChild(uJS);
  }

  /* GTM Container — GTM-TWPPQPTG
     শুধু GTM লোড হবে। Meta Pixel, Google Ads,
     TikTok — সব GTM Dashboard থেকে কন্ট্রোল করবেন। */
  if (!window.google_tag_manager) {
    (function(w,d,s,l,i){
      w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-TWPPQPTG');
  }
})();


/* ═══ TRANSLATIONS ═══ */
var TRANSLATIONS = {
  en: {
    announcement: '🚚 Free Delivery on orders over ' + CONFIG.currency.symbol + CONFIG.shipping.freeShippingMin.toLocaleString() + '!',
    home: 'Home', shop: 'Shop', categories: 'Categories',
    newArrivals: 'New Arrivals', hotSales: 'Hot Sales', contact: 'Contact',
    searchPlaceholder: 'Search products...', myCart: 'My Cart',
    quickLinks: 'Quick Links', aboutUs: 'About Us', trackOrder: 'Track Order',
    customerService: 'Customer Service', shippingPolicy: 'Shipping Policy',
    returnPolicy: 'Return Policy', privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions', connectWithUs: 'Connect With Us',
    liveChat: 'Live Chat via WhatsApp', storeDesc: CONFIG.store.description,
    copyright: '\u00A9 ' + new Date().getFullYear() + ' ' + CONFIG.store.name + '. All rights reserved.',
    switchLang: 'BN', switchLabel: '\uD83C\uDF10 বাংলায় দেখুন',
    weAccept: 'We Accept', scrollTop: 'Back to top'
  },
  bn: {
    announcement: '🚚 ' + CONFIG.currency.symbol + CONFIG.shipping.freeShippingMin.toLocaleString() + '+ অর্ডারে ফ্রি ডেলিভারি!',
    home: 'হোম', shop: 'শপ', categories: 'ক্যাটাগরি',
    newArrivals: 'নতুন সংযোজন', hotSales: 'হট সেল', contact: 'যোগাযোগ',
    searchPlaceholder: 'প্রোডাক্ট খুঁজুন...', myCart: 'আমার কার্ট',
    quickLinks: 'দ্রুত লিংক', aboutUs: 'আমাদের সম্পর্কে', trackOrder: 'অর্ডার ট্র্যাক',
    customerService: 'কাস্টমার সার্ভিস', shippingPolicy: 'শিপিং পলিসি',
    returnPolicy: 'রিটার্ন পলিসি', privacyPolicy: 'প্রাইভেসি পলিসি',
    termsConditions: 'শর্তাবলী', connectWithUs: 'যোগাযোগ করুন',
    liveChat: 'হোয়াটসঅ্যাপে চ্যাট করুন', storeDesc: 'প্রিমিয়াম পুরুষদের ফ্যাশন ও লাইফস্টাইল স্টোর',
    copyright: '\u00A9 ' + new Date().getFullYear() + ' ' + CONFIG.store.name + '। সর্বস্বত্ব সংরক্ষিত।',
    switchLang: 'EN', switchLabel: '\uD83C\uDF10 View in English',
    weAccept: 'আমরা গ্রহণ করি', scrollTop: 'উপরে যান'
  }
};

function t(key) { return (TRANSLATIONS[currentLang] || TRANSLATIONS.en)[key] || key; }

/* ═══ CART HELPER ═══ */
function getCartCount() {
  try {
    var cart = JSON.parse(localStorage.getItem('kp-cart') || '[]');
    return cart.reduce(function(s, i) { return s + (i.qty || 0); }, 0);
  } catch(e) { return 0; }
}

function updateCartBadge() {
  var b = document.getElementById('cartBadge');
  if (!b) return;
  var c = getCartCount();
  b.textContent = c;
  b.style.display = c > 0 ? 'flex' : 'none';
}

/* ═══ STAR RATING HTML ═══ */
function renderStars(rating) {
  var html = '';
  for (var i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) html += '<span class="star-full">★</span>';
    else if (i - 0.5 <= rating) html += '<span class="star-half">★</span>';
    else html += '<span class="star-empty">★</span>';
  }
  return html;
}

/* ═══ FORMAT PRICE ═══ */
function formatPrice(amount) {
  return CONFIG.currency.symbol + amount.toLocaleString();
}


/* ══════════════════════════════════════
   📌 BUILD HEADER
   ══════════════════════════════════════ */
function buildHeader() {
  var catR = CATEGORIES.filter(function(c){return c.type==='regular';});
  var catS = CATEGORIES.filter(function(c){return c.type==='special';});
  var cc = getCartCount();

  return '<div class="announcement-bar" id="announcementBar">' +
    '<div class="container flex-between">' +
      '<span></span>' +
      '<p>' + t('announcement') + '</p>' +
      '<button class="ann-close" onclick="closeAnnouncement()">✕</button>' +
    '</div></div>' +

  '<header class="site-header" id="siteHeader"><div class="container"><div class="header-row">' +

    '<button class="hamburger" id="hamburgerBtn" onclick="toggleMobileMenu()" aria-label="Menu">' +
      '<span></span><span></span><span></span></button>' +

    '<a href="' + BASE + 'index.html" class="site-logo">' +
      '<span class="logo-main">KORA</span><span class="logo-accent">PORT</span></a>' +

    '<div class="header-search" id="headerSearch">' +
      '<input type="text" id="deskSearch" class="search-input" placeholder="' + t('searchPlaceholder') + '" onkeyup="if(event.key===\'Enter\')performSearch(this.value)">' +
      '<button class="search-btn" onclick="performSearch(document.getElementById(\'deskSearch\').value)">' +
        '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="8" cy="8" r="6.5"/><line x1="13" y1="13" x2="17" y2="17"/></svg>' +
      '</button></div>' +

    '<div class="header-icons">' +
      '<button class="h-icon mob-only" onclick="toggleMobileSearch()">' +
        '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="9" cy="9" r="7"/><line x1="14" y1="14" x2="19" y2="19"/></svg></button>' +
      '<button class="h-icon lang-btn" onclick="toggleLanguage()" title="' + t('switchLang') + '">' + t('switchLang') + '</button>' +
      '<a href="' + BASE + 'pages/cart.html" class="h-icon cart-link">' +
        '<svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>' +
        '<span class="cart-badge" id="cartBadge" style="display:' + (cc>0?'flex':'none') + '">' + cc + '</span>' +
      '</a></div>' +

  '</div>' +

  '<div class="mob-search-wrap hidden" id="mobSearchWrap">' +
    '<input type="text" id="mobSearch" class="search-input" placeholder="' + t('searchPlaceholder') + '" onkeyup="if(event.key===\'Enter\')performSearch(this.value)">' +
    '<button class="search-btn" onclick="performSearch(document.getElementById(\'mobSearch\').value)">' +
      '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="8" cy="8" r="6.5"/><line x1="13" y1="13" x2="17" y2="17"/></svg>' +
    '</button></div>' +

  '</div></header>' +

  '<nav class="site-nav" id="siteNav"><div class="container"><ul class="nav-links">' +
    '<li><a href="' + BASE + 'index.html" class="nav-link">' + t('home') + '</a></li>' +
    '<li><a href="' + BASE + 'pages/shop.html" class="nav-link">' + t('shop') + '</a></li>' +
    '<li class="nav-dd-wrap"><a href="#" class="nav-link" onclick="return false">' + t('categories') + ' ▾</a>' +
      '<div class="nav-dropdown"><div class="dd-inner">' +
        catR.map(function(c){return '<a href="' + BASE + 'pages/shop.html?cat=' + c.id + '" class="dd-item">' + c.icon + ' ' + c.name + '</a>';}).join('') +
        '<div class="dd-divider"></div>' +
        catS.map(function(c){return '<a href="' + BASE + 'pages/shop.html?cat=' + c.id + '" class="dd-item special">' + c.icon + ' ' + c.name + '</a>';}).join('') +
      '</div></div></li>' +
    '<li><a href="' + BASE + 'pages/shop.html?cat=new-arrivals" class="nav-link">🆕 ' + t('newArrivals') + '</a></li>' +
    '<li><a href="' + BASE + 'pages/shop.html?cat=hot-sales" class="nav-link nav-hot">🔥 ' + t('hotSales') + '</a></li>' +
    '<li><a href="' + BASE + 'pages/contact.html" class="nav-link">' + t('contact') + '</a></li>' +
  '</ul></div></nav>' +

  '<div class="mob-overlay hidden" id="mobOverlay" onclick="toggleMobileMenu()"></div>' +
  '<aside class="mob-menu" id="mobMenu">' +
    '<div class="mm-head"><span class="site-logo"><span class="logo-main">KORA</span><span class="logo-accent">PORT</span></span>' +
      '<button class="mm-close" onclick="toggleMobileMenu()">✕</button></div>' +
    '<div class="mm-body"><ul class="mm-nav">' +
      '<li><a href="' + BASE + 'index.html">' + t('home') + '</a></li>' +
      '<li><a href="' + BASE + 'pages/shop.html">' + t('shop') + '</a></li>' +
      '<li class="mm-has-sub"><a onclick="toggleMobileSub(this)">' + t('categories') + ' <span class="mm-arrow">▾</span></a>' +
        '<ul class="mm-sub">' +
          catR.map(function(c){return '<li><a href="' + BASE + 'pages/shop.html?cat=' + c.id + '">' + c.icon + ' ' + c.name + '</a></li>';}).join('') +
          '<li class="mm-divider"></li>' +
          catS.map(function(c){return '<li><a href="' + BASE + 'pages/shop.html?cat=' + c.id + '">' + c.icon + ' ' + c.name + '</a></li>';}).join('') +
        '</ul></li>' +
      '<li><a href="' + BASE + 'pages/shop.html?cat=new-arrivals">🆕 ' + t('newArrivals') + '</a></li>' +
      '<li><a href="' + BASE + 'pages/shop.html?cat=hot-sales">🔥 ' + t('hotSales') + '</a></li>' +
      '<li><a href="' + BASE + 'pages/contact.html">' + t('contact') + '</a></li>' +
      '<li><a href="' + BASE + 'pages/cart.html">🛒 ' + t('myCart') + ' (' + cc + ')</a></li>' +
    '</ul></div>' +
    '<div class="mm-foot">' +
      '<a href="tel:' + CONFIG.store.phone + '" class="mm-phone">📞 ' + CONFIG.store.phone + '</a>' +
      '<a href="' + CONFIG.social.whatsappChat + '?text=Hi!" target="_blank" class="btn btn-primary btn-full btn-sm">💬 ' + t('liveChat') + '</a>' +
      '<button class="btn btn-secondary btn-full btn-sm" onclick="toggleLanguage()">' + t('switchLabel') + '</button>' +
    '</div></aside>';
}


/* ══════════════════════════════════════
   📌 BUILD FOOTER
   ══════════════════════════════════════ */
function buildFooter() {
  return '<footer class="site-footer"><div class="container">' +
    '<div class="footer-grid">' +

      '<div class="f-col">' +
        '<div class="site-logo footer-logo"><span class="logo-main">KORA</span><span class="logo-accent">PORT</span></div>' +
        '<p class="f-desc">' + t('storeDesc') + '</p>' +
        '<div class="f-social">' +
          '<a href="' + CONFIG.social.facebook + '" target="_blank" class="soc-icon" aria-label="Facebook"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>' +
          '<a href="' + CONFIG.social.instagram + '" target="_blank" class="soc-icon" aria-label="Instagram"><svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg></a>' +
          '<a href="' + CONFIG.social.tiktok + '" target="_blank" class="soc-icon" aria-label="TikTok"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 010-5.78c.31 0 .61.04.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 15.57 6.33 6.33 0 009.37 22a6.33 6.33 0 006.33-6.33V9.19a8.16 8.16 0 004.29 1.22V6.69z"/></svg></a>' +
        '</div></div>' +

      '<div class="f-col">' +
        '<h4 class="f-title">' + t('quickLinks') + '</h4>' +
        '<ul class="f-links">' +
          '<li><a href="' + BASE + 'pages/shop.html">' + t('shop') + '</a></li>' +
          '<li><a href="' + BASE + 'pages/about.html">' + t('aboutUs') + '</a></li>' +
          '<li><a href="' + BASE + 'pages/contact.html">' + t('contact') + '</a></li>' +
          '<li><a href="' + BASE + 'pages/track-order.html">' + t('trackOrder') + '</a></li>' +
        '</ul></div>' +

      '<div class="f-col">' +
        '<h4 class="f-title">' + t('customerService') + '</h4>' +
        '<ul class="f-links">' +
          '<li><a href="' + BASE + 'pages/shipping-policy.html">' + t('shippingPolicy') + '</a></li>' +
          '<li><a href="' + BASE + 'pages/return-policy.html">' + t('returnPolicy') + '</a></li>' +
          '<li><a href="' + BASE + 'pages/privacy.html">' + t('privacyPolicy') + '</a></li>' +
          '<li><a href="' + BASE + 'pages/terms.html">' + t('termsConditions') + '</a></li>' +
        '</ul></div>' +

      '<div class="f-col">' +
        '<h4 class="f-title">' + t('connectWithUs') + '</h4>' +
        '<ul class="f-contact">' +
          '<li><a href="tel:' + CONFIG.store.phone + '">📞 ' + CONFIG.store.phone + '</a></li>' +
          '<li><a href="mailto:' + CONFIG.store.email + '">📧 ' + CONFIG.store.email + '</a></li>' +
          '<li><a href="' + CONFIG.social.whatsappChat + '?text=Hi! I need help." target="_blank" class="live-chat-link">💬 ' + t('liveChat') + '</a></li>' +
        '</ul></div>' +

    '</div>' +

    '<div class="footer-bottom">' +
      '<p class="copyright">' + t('copyright') + '</p>' +
      '<div class="pay-icons">' +
        '<span class="pay-label">' + t('weAccept') + ':</span>' +
        '<span class="pay-badge">bKash</span>' +
        '<span class="pay-badge">Nagad</span>' +
        '<span class="pay-badge">COD</span>' +
      '</div>' +
    '</div>' +

  '</div></footer>';
}


/* ══════════════════════════════════════
   📌 BUILD EXTRAS (WhatsApp + Scroll Top)
   ══════════════════════════════════════ */
function buildExtras() {
  return '<a href="' + CONFIG.social.whatsappChat + '?text=Hi! I\'m interested in your products." target="_blank" class="wa-float" id="waFloat" aria-label="WhatsApp">' +
    '<svg width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
  '</a>' +
  '<button class="scroll-top hidden" id="scrollTopBtn" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">' +
    '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="4,14 10,6 16,14"/></svg>' +
  '</button>';
}


/* ══════════════════════════════════════
   🚀 INITIALIZATION
   ══════════════════════════════════════ */
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
});


/* ══════════════════════════════════════
   🎛️ EVENT HANDLERS
   ══════════════════════════════════════ */

function closeAnnouncement() {
  var bar = document.getElementById('announcementBar');
  if (bar) { bar.style.transform = 'translateY(-100%)'; setTimeout(function(){bar.style.display='none';}, 300); }
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

/* Global access for other files */
window.updateCartBadge = updateCartBadge;
window.formatPrice = formatPrice;
window.renderStars = renderStars;
window.t = t;
window.BASE = BASE;