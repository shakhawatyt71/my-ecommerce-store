/*
 * 📦 KORA PORT — Shop & Product Detail Logic
 */

document.addEventListener('DOMContentLoaded', function() {
  var path = window.location.pathname;
  if (path.includes('product-detail')) initProductDetail();
  else if (path.includes('shop')) initShop();
});


/* ════════════════════════════════
   🛍️ SHOP PAGE
   ════════════════════════════════ */
var shopState = { page: 1, perPage: 12, view: 'grid', activeSizes: [], activeCats: [] };

function initShop() {
  var params = new URLSearchParams(window.location.search);
  var cat = params.get('cat');
  var q = params.get('search');

  if (cat) {
    shopState.activeCats = [cat];
    var c = CATEGORIES.find(function(x){ return x.id === cat; });
    setShopTitle(c ? c.icon + ' ' + c.name : 'Shop');
    setBreadcrumb(c ? c.name : 'Shop');
  }
  if (q) {
    setShopTitle('Search: "' + q + '"');
    setBreadcrumb('Search Results');
  }

  buildCategoryFilter();
  buildSizeFilter();
  applyFilters();

  pushGTM({ event: 'view_item_list', item_list_name: cat || 'all_products' });
}

function setShopTitle(t) { var el = document.getElementById('shopTitle'); if(el) el.textContent = t; }
function setBreadcrumb(t) { var el = document.getElementById('breadcrumbCurrent'); if(el) el.textContent = t; }

function buildCategoryFilter() {
  var wrap = document.getElementById('filterCategory');
  if (!wrap) return;
  var html = '';
  CATEGORIES.forEach(function(c) {
    var count = getProductsByCategory(c.id).length;
    var checked = shopState.activeCats.includes(c.id) ? 'checked' : '';
    html += '<label class="f-check"><input type="checkbox" value="' + c.id + '" ' + checked + ' onchange="updateCatFilter()">' +
      c.icon + ' ' + c.name + '<span class="f-check-count">' + count + '</span></label>';
  });
  wrap.innerHTML = html;
}

function buildSizeFilter() {
  var wrap = document.getElementById('filterSize');
  if (!wrap) return;
  var allSizes = {};
  PRODUCTS.forEach(function(p) {
    p.sizes.forEach(function(s) { allSizes[s] = true; });
  });
  var html = '<div class="size-pills">';
  Object.keys(allSizes).forEach(function(s) {
    html += '<button class="size-pill" onclick="toggleSizeFilter(this,\'' + s + '\')">' + s + '</button>';
  });
  html += '</div>';
  wrap.innerHTML = html;
}

function updateCatFilter() {
  var checks = document.querySelectorAll('#filterCategory input[type=checkbox]:checked');
  shopState.activeCats = [];
  checks.forEach(function(c) { shopState.activeCats.push(c.value); });
  shopState.page = 1;
  applyFilters();
}

function toggleSizeFilter(btn, size) {
  btn.classList.toggle('active');
  var idx = shopState.activeSizes.indexOf(size);
  if (idx > -1) shopState.activeSizes.splice(idx, 1);
  else shopState.activeSizes.push(size);
  shopState.page = 1;
  applyFilters();
}

function applyFilters() {
  var params = new URLSearchParams(window.location.search);
  var q = params.get('search');
  var products = q ? searchProducts(q) : PRODUCTS.slice();

  // Category filter
  if (shopState.activeCats.length > 0) {
    products = products.filter(function(p) {
      return shopState.activeCats.some(function(c) { return p.categories.includes(c); });
    });
  }

  // Price filter
  var minP = parseInt(document.getElementById('priceMin')?.value || 0);
  var maxP = parseInt(document.getElementById('priceMax')?.value || 99999);
  var minL = document.getElementById('priceMinLabel');
  var maxL = document.getElementById('priceMaxLabel');
  if (minL) minL.textContent = formatPrice(minP);
  if (maxL) maxL.textContent = formatPrice(maxP);

  products = products.filter(function(p) {
    var ep = getEffectivePrice(p);
    return ep >= minP && ep <= maxP;
  });

  // Size filter
  if (shopState.activeSizes.length > 0) {
    products = products.filter(function(p) {
      return shopState.activeSizes.some(function(s) { return p.sizes.includes(s); });
    });
  }

  // Sort
  var sort = document.getElementById('sortSelect')?.value || 'newest';
  switch(sort) {
    case 'price-low': products.sort(function(a,b){return getEffectivePrice(a)-getEffectivePrice(b);}); break;
    case 'price-high': products.sort(function(a,b){return getEffectivePrice(b)-getEffectivePrice(a);}); break;
    case 'name-az': products.sort(function(a,b){return a.name.localeCompare(b.name);}); break;
    case 'name-za': products.sort(function(a,b){return b.name.localeCompare(a.name);}); break;
    case 'popular': products.sort(function(a,b){return b.reviewCount-a.reviewCount;}); break;
    case 'oldest': products.sort(function(a,b){return parseInt(a.id.slice(1))-parseInt(b.id.slice(1));}); break;
    default: products.sort(function(a,b){return parseInt(b.id.slice(1))-parseInt(a.id.slice(1));}); break;
  }

  renderShopProducts(products);
}

function renderShopProducts(products) {
  var grid = document.getElementById('shopGrid');
  var empty = document.getElementById('emptyState');
  var loadWrap = document.getElementById('loadMoreWrap');
  var countEl = document.getElementById('shopCount');
  if (!grid) return;

  var end = shopState.page * shopState.perPage;
  var visible = products.slice(0, end);

  if (countEl) countEl.textContent = products.length + ' products found';

  if (products.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    if (loadWrap) loadWrap.style.display = 'none';
    return;
  }

  if (empty) empty.classList.add('hidden');

  var html = '';
  visible.forEach(function(p) { html += createProductCard(p); });
  grid.innerHTML = html;

  if (loadWrap) loadWrap.style.display = end >= products.length ? 'none' : 'block';

  initScrollReveal();
}

function loadMore() {
  shopState.page++;
  applyFilters();
}

function clearAllFilters() {
  shopState.activeCats = [];
  shopState.activeSizes = [];
  shopState.page = 1;
  var checks = document.querySelectorAll('#filterCategory input[type=checkbox]');
  checks.forEach(function(c) { c.checked = false; });
  var pills = document.querySelectorAll('.size-pill.active');
  pills.forEach(function(p) { p.classList.remove('active'); });
  var pMin = document.getElementById('priceMin');
  var pMax = document.getElementById('priceMax');
  if (pMin) pMin.value = 0;
  if (pMax) pMax.value = 5000;
  var sort = document.getElementById('sortSelect');
  if (sort) sort.value = 'newest';
  setShopTitle('All Products');
  applyFilters();
}

function toggleFilter(el) { el.classList.toggle('collapsed'); }

function setView(v) {
  shopState.view = v;
  var grid = document.getElementById('shopGrid');
  var gBtn = document.getElementById('gridViewBtn');
  var lBtn = document.getElementById('listViewBtn');
  if (grid) {
    grid.classList.remove('list-view');
    if (v === 'list') grid.classList.add('list-view');
  }
  if (gBtn) { gBtn.classList.toggle('active', v==='grid'); }
  if (lBtn) { lBtn.classList.toggle('active', v==='list'); }
}

function toggleMobileFilter() {
  var sb = document.getElementById('shopSidebar');
  var ov = document.getElementById('mobFilterOverlay');
  if (sb) sb.classList.toggle('open');
  if (ov) ov.classList.toggle('hidden');
  document.body.style.overflow = sb && sb.classList.contains('open') ? 'hidden' : '';
}
window.toggleMobileFilter = toggleMobileFilter;


/* ════════════════════════════════
   📦 PRODUCT DETAIL PAGE
   ════════════════════════════════ */
var pdState = { selectedSize: '', selectedColor: '', qty: 1, product: null };

function initProductDetail() {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  if (!id) { window.location.href = 'shop.html'; return; }

  var p = getProductById(id);
  if (!p) { window.location.href = 'shop.html'; return; }

  pdState.product = p;
  pdState.selectedSize = p.sizes[0] || '';
  pdState.selectedColor = p.colors[0]?.name || '';

  document.title = p.name + ' — Kora Port';
  var bc = document.getElementById('pdBreadcrumb');
  if (bc) bc.textContent = p.name;

  renderProductDetail(p);
  renderRelated(p);

  pushGTM({
    event: 'view_item',
    ecommerce: {
      items: [{
        item_id: p.id, item_name: p.name,
        price: getEffectivePrice(p), currency: 'BDT',
        item_category: p.categories[0] || ''
      }]
    }
  });
}

function renderProductDetail(p) {
  var layout = document.getElementById('pdLayout');
  if (!layout) return;

  var dp = getDiscountPercent(p);
  var ep = getEffectivePrice(p);
  var sold = pHash(p.id, 15, 120);
  var inCart = pHash(p.id + 'c', 2, 18);
  var stars = renderStars(p.rating);

  var badgeHtml = '';
  if (p.badge === 'new') badgeHtml = '<span class="badge badge-new">New</span>';
  else if (p.badge === 'hot') badgeHtml = '<span class="badge badge-hot">Hot</span>';
  else if (p.badge === 'sale') badgeHtml = '<span class="badge badge-sale">Sale</span>';
  else if (p.badge === 'eid') badgeHtml = '<span class="badge badge-eid">Eid</span>';

  var stockHtml = '';
  if (p.stock <= 0) stockHtml = '<div class="pd-stock out">❌ Out of Stock</div>';
  else if (p.stock <= 10) stockHtml = '<div class="pd-stock low">⚠️ Only ' + p.stock + ' left in stock!</div>';
  else stockHtml = '<div class="pd-stock in">✅ In Stock (' + p.stock + ' available)</div>';

  var sizesHtml = p.sizes.map(function(s) {
    var act = s === pdState.selectedSize ? ' active' : '';
    return '<button class="pd-size-btn' + act + '" onclick="selectSize(\'' + s + '\',this)">' + s + '</button>';
  }).join('');

  var colorsHtml = p.colors.map(function(c) {
    var act = c.name === pdState.selectedColor ? ' active' : '';
    var bdr = c.code === '#FFFFFF' ? 'border-color:#ccc;' : '';
    return '<button class="pd-color-btn' + act + '" style="background:' + c.code + ';' + bdr + '" onclick="selectColor(\'' + c.name + '\',this)" title="' + c.name + '"></button>';
  }).join('');

  var priceHtml = '<span class="price-current">' + formatPrice(ep) + '</span>';
  if (p.discountPrice) priceHtml += '<span class="price-original">' + formatPrice(p.price) + '</span><span class="price-save">' + dp + '% OFF</span>';

  var deliveryInfo = '<div class="pd-delivery">' +
    '<div class="pd-delivery-item">🚚 Dhaka: ' + formatPrice(CONFIG.shipping.insideDhaka) + ' (' + CONFIG.shipping.estimatedDelivery.insideDhaka + ')</div>' +
    '<div class="pd-delivery-item">🚚 Outside Dhaka: ' + formatPrice(CONFIG.shipping.outsideDhaka) + ' (' + CONFIG.shipping.estimatedDelivery.outsideDhaka + ')</div>' +
    '<div class="pd-delivery-item">🎉 Free delivery on orders over ' + formatPrice(CONFIG.shipping.freeShippingMin) + '</div>' +
  '</div>';

  layout.innerHTML =
    '<div class="pd-images">' +
      '<img class="pd-main-img" src="' + p.image + '" alt="' + p.name + '" onclick="openImgZoom(\'' + p.image + '\')">' +
      (badgeHtml ? '<div class="pd-badge-wrap">' + badgeHtml + '</div>' : '') +
    '</div>' +

    '<div class="pd-info">' +
      '<h1 class="pd-name">' + p.name + '</h1>' +
      '<div class="pd-rating">' + stars + ' <span class="pd-review-text">' + p.rating + '/5 (' + p.reviewCount + ' reviews)</span></div>' +
      '<div class="pd-price-box">' + priceHtml + '</div>' +
      '<div class="pd-stats">' +
        '<span class="pd-stat">👥 <strong>' + sold + '</strong> sold</span>' +
        '<span class="pd-stat">🛒 <strong>' + inCart + '</strong> in cart</span>' +
      '</div>' +
      stockHtml +
      '<div class="pd-section">' +
        '<div class="pd-section-title">Size <button class="size-chart-btn" onclick="openSizeChart()">📏 Request Size Chart</button></div>' +
        '<div class="pd-sizes">' + sizesHtml + '</div>' +
      '</div>' +
      '<div class="pd-section">' +
        '<div class="pd-section-title">Color <span class="pd-color-name" id="colorName">' + pdState.selectedColor + '</span></div>' +
        '<div class="pd-colors">' + colorsHtml + '</div>' +
      '</div>' +
      '<div class="pd-section">' +
        '<div class="pd-section-title">Quantity</div>' +
        '<div class="pd-qty">' +
          '<button class="qty-btn" onclick="changeQty(-1)">−</button>' +
          '<input type="number" class="qty-input" id="pdQty" value="1" min="1" max="' + p.stock + '" onchange="setQty(this.value)">' +
          '<button class="qty-btn" onclick="changeQty(1)">+</button>' +
        '</div>' +
      '</div>' +
      '<div class="pd-actions">' +
        '<button class="btn btn-primary btn-lg" onclick="addToCartFromDetail()" ' + (p.stock<=0?'disabled':'') + '>🛒 Add to Cart</button>' +
        '<button class="btn btn-accent btn-lg pd-buy-btn" onclick="buyNowFromDetail()" ' + (p.stock<=0?'disabled':'') + '>⚡ Buy Now</button>' +
      '</div>' +
      '<button class="pd-wa-btn" onclick="orderViaWhatsApp()">💬 Order via WhatsApp</button>' +
      deliveryInfo +
      '<div class="pd-desc">' +
        '<h3>Description</h3>' +
        '<p>' + p.description + '</p>' +
      '</div>' +
    '</div>';
}

/* Selection handlers */
function selectSize(s, btn) {
  pdState.selectedSize = s;
  document.querySelectorAll('.pd-size-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
}

function selectColor(c, btn) {
  pdState.selectedColor = c;
  document.querySelectorAll('.pd-color-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  var cn = document.getElementById('colorName');
  if (cn) cn.textContent = c;
}

function changeQty(d) {
  var inp = document.getElementById('pdQty');
  if (!inp) return;
  var v = parseInt(inp.value) + d;
  var max = pdState.product ? pdState.product.stock : 99;
  if (v < 1) v = 1;
  if (v > max) v = max;
  inp.value = v;
  pdState.qty = v;
}

function setQty(v) {
  v = parseInt(v) || 1;
  if (v < 1) v = 1;
  var max = pdState.product ? pdState.product.stock : 99;
  if (v > max) v = max;
  document.getElementById('pdQty').value = v;
  pdState.qty = v;
}

/* Add to cart */
function addToCartFromDetail() {
  var p = pdState.product;
  if (!p || p.stock <= 0) return;
  var cart = JSON.parse(localStorage.getItem('kp-cart') || '[]');
  var key = p.id + '_' + pdState.selectedSize + '_' + pdState.selectedColor;
  var existing = cart.find(function(i) { return i.key === key; });
  if (existing) { existing.qty += pdState.qty; }
  else {
    cart.push({
      key: key, id: p.id, qty: pdState.qty,
      size: pdState.selectedSize, color: pdState.selectedColor
    });
  }
  localStorage.setItem('kp-cart', JSON.stringify(cart));
  updateCartBadge();
  showToast('✅ Added to cart!');
  pushGTM({
    event: 'add_to_cart',
    ecommerce: {
      items: [{
        item_id: p.id, item_name: p.name,
        price: getEffectivePrice(p), quantity: pdState.qty,
        item_variant: pdState.selectedSize + '/' + pdState.selectedColor,
        currency: 'BDT'
      }]
    }
  });
}

function buyNowFromDetail() {
  addToCartFromDetail();
  setTimeout(function() { window.location.href = 'checkout.html'; }, 300);
}

/* WhatsApp order */
function orderViaWhatsApp() {
  var p = pdState.product;
  if (!p) return;
  var msg = 'Hi! I want to order:\n\n' +
    '📦 Product: ' + p.name + '\n' +
    '📏 Size: ' + pdState.selectedSize + '\n' +
    '🎨 Color: ' + pdState.selectedColor + '\n' +
    '🔢 Qty: ' + pdState.qty + '\n' +
    '💰 Price: ' + formatPrice(getEffectivePrice(p) * pdState.qty) + '\n\n' +
    'Please confirm my order.';
  var url = CONFIG.social.whatsappChat + '?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');
}

/* Related products */
function renderRelated(p) {
  var sec = document.getElementById('relatedSection');
  var grid = document.getElementById('relatedGrid');
  if (!sec || !grid) return;
  var related = PRODUCTS.filter(function(x) {
    return x.id !== p.id && x.categories.some(function(c) { return p.categories.includes(c); });
  }).slice(0, 4);
  if (related.length === 0) return;
  sec.style.display = 'block';
  var html = '';
  related.forEach(function(r) { html += createProductCard(r); });
  grid.innerHTML = html;
  initScrollReveal();
}

/* Modals */
function openSizeChart() {
  var m = document.getElementById('sizeChartModal');
  if (m) { m.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
}
function closeSizeChart(e) {
  if (e && e.target !== e.currentTarget) return;
  var m = document.getElementById('sizeChartModal');
  if (m) { m.classList.add('hidden'); document.body.style.overflow = ''; }
}
function openImgZoom(src) {
  var m = document.getElementById('imgZoomModal');
  var img = document.getElementById('zoomImg');
  if (m && img) { img.src = src; m.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
}
function closeImgZoom() {
  var m = document.getElementById('imgZoomModal');
  if (m) { m.classList.add('hidden'); document.body.style.overflow = ''; }
}

window.selectSize = selectSize;
window.selectColor = selectColor;
window.changeQty = changeQty;
window.setQty = setQty;
window.addToCartFromDetail = addToCartFromDetail;
window.buyNowFromDetail = buyNowFromDetail;
window.orderViaWhatsApp = orderViaWhatsApp;
window.openSizeChart = openSizeChart;
window.closeSizeChart = closeSizeChart;
window.openImgZoom = openImgZoom;
window.closeImgZoom = closeImgZoom;
window.toggleFilter = toggleFilter;
window.setView = setView;
window.clearAllFilters = clearAllFilters;
window.updateCatFilter = updateCatFilter;
window.toggleSizeFilter = toggleSizeFilter;
window.loadMore = loadMore;
window.applyFilters = applyFilters;