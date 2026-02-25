/*
 * 🎯 KORA PORT — Main Controller (FIXED)
 */
var BASE = './';
if (location.pathname.includes('/pages/')) BASE = '../';

var currentLang = localStorage.getItem('kp-lang') || 'en';

/* ═══ TRANSLATIONS ═══ */
var TRANSLATIONS = {
  en: {
    announcement: '🚚 Free Delivery on orders over ৳' + CONFIG.shipping.freeShippingMin + '!',
    home: 'Home', shop: 'Shop', categories: 'Categories',
    newArrivals: 'New Arrivals', hotSales: 'Hot Sales', contact: 'Contact',
    searchPlaceholder: 'Search products...', myCart: 'My Cart',
    quickLinks: 'Quick Links', aboutUs: 'About Us', trackOrder: 'Track Order',
    customerService: 'Customer Service', shippingPolicy: 'Shipping Policy',
    returnPolicy: 'Return Policy', privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions', connectWithUs: 'Connect With Us',
    liveChat: 'Live Chat via WhatsApp', storeDesc: CONFIG.store.description,
    copyright: '© ' + new Date().getFullYear() + ' ' + CONFIG.store.name + '. All rights reserved.',
    switchLang: 'BN', switchLabel: '🌐 বাংলায় দেখুন',
    weAccept: 'We Accept'
  },
  bn: {
    announcement: '🚚 ৳' + CONFIG.shipping.freeShippingMin + '+ অর্ডারে ফ্রি ডেলিভারি!',
    home: 'হোম', shop: 'শপ', categories: 'ক্যাটাগরি',
    newArrivals: 'নতুন সংযোজন', hotSales: 'হট সেল', contact: 'যোগাযোগ',
    searchPlaceholder: 'প্রোডাক্ট খুঁজুন...', myCart: 'আমার কার্ট',
    quickLinks: 'দ্রুত লিংক', aboutUs: 'আমাদের সম্পর্কে', trackOrder: 'অর্ডার ট্র্যাক',
    customerService: 'কাস্টমার সার্ভিস', shippingPolicy: 'শিপিং পলিসি',
    returnPolicy: 'রিটার্ন পলিসি', privacyPolicy: 'প্রাইভেসি পলিসি',
    termsConditions: 'শর্তাবলী', connectWithUs: 'যোগাযোগ করুন',
    liveChat: 'হোয়াটসঅ্যাপে চ্যাট করুন', storeDesc: 'প্রিমিয়াম পুরুষদের ফ্যাশন ও লাইফস্টাইল স্টোর',
    copyright: '© ' + new Date().getFullYear() + ' ' + CONFIG.store.name + '। সর্বস্বত্ব সংরক্ষিত।',
    switchLang: 'EN', switchLabel: '🌐 View in English',
    weAccept: 'আমরা গ্রহণ করি'
  }
};

function t(key) { return (TRANSLATIONS[currentLang] || TRANSLATIONS.en)[key] || key; }

/* ═══ HELPERS ═══ */
function getCartCount() {
  try { var c = JSON.parse(localStorage.getItem('kp-cart') || '[]'); return c.reduce(function(s,i){return s+(i.qty||0);},0); }
  catch(e) { return 0; }
}

function updateCartBadge() {
  var b = document.getElementById('cartBadge');
  if (!b) return;
  var c = getCartCount();
  b.textContent = c;
  b.style.display = c > 0 ? 'flex' : 'none';
}

function renderStars(rating) {
  var h = '';
  for (var i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) h += '<span style="color:#C89A3C">★</span>';
    else if (i - 0.5 <= rating) h += '<span style="color:#C89A3C">★</span>';
    else h += '<span style="color:#D3DAD7">★</span>';
  }
  return h;
}

function formatPrice(a) { return '৳' + a.toLocaleString(); }

/* ═══ GTM INIT ═══ */
(function(){
  window.dataLayer = window.dataLayer || [];
  if (!window.google_tag_manager) {
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TWPPQPTG');
  }
})();

/* ═══ HEADER ═══ */
function buildHeader() {
  var catR = CATEGORIES.filter(function(c){return c.type==='regular';});
  var catS = CATEGORIES.filter(function(c){return c.type==='special';});
  var cc = getCartCount();

  var catDropHtml = '';
  catR.forEach(function(c){ catDropHtml += '<a href="'+BASE+'pages/shop.html?cat='+c.id+'" style="display:block;padding:10px 18px;color:#49544F;font-size:0.88rem;text-decoration:none">'+c.icon+' '+c.name+'</a>'; });
  catDropHtml += '<div style="height:1px;background:#D3DAD7;margin:6px 14px"></div>';
  catS.forEach(function(c){ catDropHtml += '<a href="'+BASE+'pages/shop.html?cat='+c.id+'" style="display:block;padding:10px 18px;color:#49544F;font-size:0.88rem;text-decoration:none;font-weight:600">'+c.icon+' '+c.name+'</a>'; });

  var mobCatHtml = '';
  catR.forEach(function(c){ mobCatHtml += '<li><a href="'+BASE+'pages/shop.html?cat='+c.id+'" style="display:block;padding:11px 20px 11px 36px;color:#49544F;font-size:0.88rem;text-decoration:none">'+c.icon+' '+c.name+'</a></li>'; });
  mobCatHtml += '<li style="height:1px;background:#D3DAD7;margin:4px 20px"></li>';
  catS.forEach(function(c){ mobCatHtml += '<li><a href="'+BASE+'pages/shop.html?cat='+c.id+'" style="display:block;padding:11px 20px 11px 36px;color:#49544F;font-size:0.88rem;text-decoration:none">'+c.icon+' '+c.name+'</a></li>'; });

  return '<div class="announcement-bar" id="announcementBar"><div class="container flex-between"><span></span><p>'+t('announcement')+'</p><button class="ann-close" onclick="closeAnnouncement()">✕</button></div></div>' +
    '<header class="site-header" id="siteHeader"><div class="container"><div class="header-row">' +
    '<button class="hamburger" id="hamburgerBtn" onclick="toggleMobileMenu()" aria-label="Menu"><span></span><span></span><span></span></button>' +
    '<a href="'+BASE+'index.html" class="site-logo"><span class="logo-main">KORA</span><span class="logo-accent">PORT</span></a>' +
    '<div class="header-search" id="headerSearch"><input type="text" id="deskSearch" class="search-input" placeholder="'+t('searchPlaceholder')+'" onkeyup="if(event.key===\'Enter\')performSearch(this.value)"><button class="search-btn" onclick="performSearch(document.getElementById(\'deskSearch\').value)">🔍</button></div>' +
    '<div class="header-icons">' +
    '<button class="h-icon mob-only" onclick="toggleMobileSearch()">🔍</button>' +
    '<button class="h-icon lang-btn" onclick="toggleLanguage()" title="'+t('switchLang')+'">'+t('switchLang')+'</button>' +
    '<a href="'+BASE+'pages/cart.html" class="h-icon cart-link">🛒<span class="cart-badge" id="cartBadge" style="display:'+(cc>0?'flex':'none')+'">'+cc+'</span></a>' +
    '</div></div>' +
    '<div class="mob-search-wrap hidden" id="mobSearchWrap"><input type="text" id="mobSearch" class="search-input" placeholder="'+t('searchPlaceholder')+'" onkeyup="if(event.key===\'Enter\')performSearch(this.value)"><button class="search-btn" onclick="performSearch(document.getElementById(\'mobSearch\').value)">🔍</button></div>' +
    '</div></header>' +
    '<nav class="site-nav" id="siteNav"><div class="container"><ul class="nav-links">' +
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
