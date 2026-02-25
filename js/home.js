/*
 * 🏠 KORA PORT — Homepage Logic (Fixed)
 */

document.addEventListener('DOMContentLoaded', function() {
  renderCategories();
  renderSection('newArrivalsGrid', getProductsByCategory('new-arrivals'));
  renderSection('hotSalesGrid', getProductsByCategory('hot-sales'));
  renderSection('featuredGrid', getFeaturedProducts());
  renderSection('eidGrid', getProductsByCategory('eid-special'));
  initCountdown();
});


/* ═══ PSEUDO STATS ═══ */
function pHash(id, min, max) {
  var h = 0;
  for (var i = 0; i < id.length; i++) h = ((h << 5) - h) + id.charCodeAt(i);
  return min + Math.abs(h) % (max - min + 1);
}


/* ═══ RENDER CATEGORIES ═══ */
function renderCategories() {
  var grid = document.getElementById('categoryGrid');
  if (!grid) return;
  var html = '';
  CATEGORIES.forEach(function(c) {
    var sp = c.type === 'special' ? ' special' : '';
    html += '<a href="pages/shop.html?cat=' + c.id + '" class="cat-card' + sp + '">' +
      '<span class="cat-icon">' + c.icon + '</span>' +
      '<span class="cat-name">' + c.name + '</span>' +
    '</a>';
  });
  grid.innerHTML = html;
}


/* ═══ RENDER PRODUCT CARDS ═══ */
function createProductCard(p) {
  var dp = getDiscountPercent(p);
  var ep = getEffectivePrice(p);
  var sold = pHash(p.id, 15, 120);
  var inCart = pHash(p.id + 'c', 2, 18);
  var stars = renderStars(p.rating);

  var badgeHtml = '';
  if (p.badge === 'new') badgeHtml = '<span class="badge badge-new p-badge">New</span>';
  else if (p.badge === 'hot') badgeHtml = '<span class="badge badge-hot p-badge">Hot</span>';
  else if (p.badge === 'sale') badgeHtml = '<span class="badge badge-sale p-badge">Sale</span>';
  else if (p.badge === 'eid') badgeHtml = '<span class="badge badge-eid p-badge">Eid</span>';

  var discTag = dp > 0 ? '<span class="p-discount-tag">-' + dp + '%</span>' : '';

  var priceHtml = '<span class="price-current">' + formatPrice(ep) + '</span>';
  if (p.discountPrice) priceHtml += '<span class="price-original">' + formatPrice(p.price) + '</span>';

  var stockText = '';
  if (p.stock <= 0) stockText = '<span class="p-stat" style="color:var(--color-error)"><strong>Out of Stock</strong></span>';
  else if (p.stock <= 10) stockText = '<span class="p-stat" style="color:var(--color-warning)">Only <strong>' + p.stock + '</strong> left!</span>';

  return '<div class="p-card" data-id="' + p.id + '" onclick="goToProduct(\'' + p.id + '\')">' +
    '<div class="p-card-img">' +
      '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy">' +
      badgeHtml + discTag +
      '<div class="p-actions" onclick="event.stopPropagation()">' +
        '<button class="p-act-btn p-act-cart" onclick="quickAddToCart(\'' + p.id + '\')">🛒 Add</button>' +
        '<button class="p-act-btn p-act-buy" onclick="quickBuyNow(\'' + p.id + '\')">⚡ Buy</button>' +
      '</div>' +
    '</div>' +
    '<div class="p-card-body">' +
      '<div class="p-card-name">' + p.name + '</div>' +
      '<div class="p-card-desc">' + p.shortDesc + '</div>' +
      '<div class="p-card-price">' + priceHtml + '</div>' +
      '<div class="p-card-rating">' + stars + '<span class="p-review-count">(' + p.reviewCount + ')</span></div>' +
      '<div class="p-stats">' +
        '<span class="p-stat"><strong>' + sold + '</strong> sold</span>' +
        '<span class="p-stat"><strong>' + inCart + '</strong> in cart</span>' +
        stockText +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderSection(gridId, products) {
  var grid = document.getElementById(gridId);
  if (!grid || !products.length) return;
  var html = '';
  products.forEach(function(p) { html += createProductCard(p); });
  grid.innerHTML = html;
}


/* ═══ NAVIGATION ═══ */
function goToProduct(id) {
  var base = location.pathname.includes('/pages/') ? '' : 'pages/';
  window.location.href = base + 'product-detail.html?id=' + id;
}

function quickAddToCart(id) {
  var p = getProductById(id);
  if (!p || p.stock <= 0) return;
  var cart = JSON.parse(localStorage.getItem('kp-cart') || '[]');
  var existing = cart.find(function(i) { return i.id === id; });
  if (existing) { existing.qty += 1; }
  else { cart.push({ id: id, qty: 1, size: p.sizes[0], color: p.colors[0].name }); }
  localStorage.setItem('kp-cart', JSON.stringify(cart));
  if (typeof updateCartBadge === 'function') updateCartBadge();
  showToast('✅ Added to cart!');

  if (typeof KP_TRACK !== 'undefined') KP_TRACK.addToCart(p, 1, p.sizes[0], p.colors[0].name);
}

function quickBuyNow(id) {
  quickAddToCart(id);
  var base = location.pathname.includes('/pages/') ? '' : 'pages/';
  setTimeout(function() { window.location.href = base + 'checkout.html'; }, 300);
}


/* ═══ TOAST NOTIFICATION ═══ */
function showToast(msg) {
  var old = document.querySelector('.kp-toast');
  if (old) old.remove();
  var el = document.createElement('div');
  el.className = 'kp-toast';
  el.textContent = msg;
  el.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#0E5B4A;color:#fff;padding:12px 24px;border-radius:50px;font-size:0.9rem;font-weight:600;z-index:999;box-shadow:0 4px 16px rgba(0,0,0,0.2);';
  document.body.appendChild(el);
  setTimeout(function() { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; }, 2000);
  setTimeout(function() { el.remove(); }, 2500);
}
window.showToast = showToast;


/* ═══ COUNTDOWN TIMER ═══ */
function initCountdown() {
  var now = new Date();
  var end = new Date(now);
  end.setHours(23, 59, 59, 999);

  function tick() {
    var diff = end - new Date();
    if (diff <= 0) {
      end.setDate(end.getDate() + 1);
      diff = end - new Date();
    }
    var h = Math.floor(diff / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    var hEl = document.getElementById('cdHours');
    var mEl = document.getElementById('cdMins');
    var sEl = document.getElementById('cdSecs');
    if (hEl) hEl.textContent = h < 10 ? '0' + h : h;
    if (mEl) mEl.textContent = m < 10 ? '0' + m : m;
    if (sEl) sEl.textContent = s < 10 ? '0' + s : s;
  }

  tick();
  setInterval(tick, 1000);
}


/* ═══ WHY CHOOSE US TOGGLE ═══ */
function toggleWhyUs() {
  var grid = document.getElementById('whyGrid');
  var arrow = document.getElementById('whyArrow');
  if (!grid) return;
  var isHidden = !grid.classList.contains('show');
  if (isHidden) {
    grid.classList.remove('hidden');
    grid.classList.add('show');
    if (arrow) arrow.classList.add('open');
  } else {
    grid.classList.remove('show');
    if (arrow) arrow.classList.remove('open');
    setTimeout(function() { grid.classList.add('hidden'); }, 600);
  }
}
window.toggleWhyUs = toggleWhyUs;
window.goToProduct = goToProduct;
window.quickAddToCart = quickAddToCart;
window.quickBuyNow = quickBuyNow;