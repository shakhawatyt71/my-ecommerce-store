/*
 * 🛒 KORA PORT — Cart Management
 */

var cartState = {
  coupon: null,
  discountAmount: 0
};

document.addEventListener('DOMContentLoaded', function() {
  renderCart();
});

/* ═══ GET / SAVE CART ═══ */
function getCart() {
  try { return JSON.parse(localStorage.getItem('kp-cart') || '[]'); }
  catch(e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem('kp-cart', JSON.stringify(cart));
  if (typeof updateCartBadge === 'function') updateCartBadge();
}

/* ═══ RENDER CART ═══ */
function renderCart() {
  var cart = getCart();
  var emptyEl = document.getElementById('cartEmpty');
  var layoutEl = document.getElementById('cartLayout');
  var countEl = document.getElementById('cartTitleCount');

  if (cart.length === 0) {
    if (emptyEl) emptyEl.classList.remove('hidden');
    if (layoutEl) layoutEl.classList.add('hidden');
    if (countEl) countEl.textContent = '';
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');
  if (layoutEl) layoutEl.classList.remove('hidden');

  var totalItems = cart.reduce(function(s, i) { return s + i.qty; }, 0);
  if (countEl) countEl.textContent = '(' + totalItems + ' items)';

  var itemsEl = document.getElementById('cartItems');
  if (!itemsEl) return;

  var html = '';
  cart.forEach(function(item, index) {
    var p = getProductById(item.id);
    if (!p) return;

    var ep = getEffectivePrice(p);
    var lineTotal = ep * item.qty;

    html += '<div class="cart-item" data-index="' + index + '">' +

      '<div class="ci-product">' +
        '<img src="' + p.image + '" alt="' + p.name + '" class="ci-img" onclick="window.location.href=\'product-detail.html?id=' + p.id + '\'">' +
        '<div class="ci-info">' +
          '<a href="product-detail.html?id=' + p.id + '" class="ci-name">' + p.name + '</a>' +
          '<div class="ci-meta">' +
            (item.size ? '<span>Size: <strong>' + item.size + '</strong></span>' : '') +
            (item.color ? '<span>Color: <strong>' + item.color + '</strong></span>' : '') +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="ci-price">' +
        '<span class="ci-price-current">' + formatPrice(ep) + '</span>' +
        (p.discountPrice ? '<span class="ci-price-original">' + formatPrice(p.price) + '</span>' : '') +
      '</div>' +

      '<div class="ci-qty">' +
        '<div class="ci-qty-control">' +
          '<button class="qty-btn" onclick="updateItemQty(' + index + ', -1)">−</button>' +
          '<input type="number" class="qty-input" value="' + item.qty + '" min="1" max="' + p.stock + '" onchange="setItemQty(' + index + ', this.value)">' +
          '<button class="qty-btn" onclick="updateItemQty(' + index + ', 1)">+</button>' +
        '</div>' +
      '</div>' +

      '<div class="ci-total">' +
        '<span>' + formatPrice(lineTotal) + '</span>' +
      '</div>' +

      '<div class="ci-action">' +
        '<button class="ci-remove" onclick="removeItem(' + index + ')" title="Remove">' +
          '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="4" x2="14" y2="14"/><line x1="14" y1="4" x2="4" y2="14"/></svg>' +
        '</button>' +
      '</div>' +

      '<div class="ci-mobile-total">' +
        '<span>' + formatPrice(lineTotal) + '</span>' +
      '</div>' +

    '</div>';
  });

  itemsEl.innerHTML = html;
  updateSummary();

  // Restore coupon
  var saved = localStorage.getItem('kp-coupon');
  if (saved) {
    var c = CONFIG.coupons.find(function(x) { return x.code === saved && x.active; });
    if (c) {
      cartState.coupon = c;
      showCouponApplied(c);
    }
  }
}

/* ═══ UPDATE QUANTITY ═══ */
function updateItemQty(index, delta) {
  var cart = getCart();
  if (!cart[index]) return;
  var p = getProductById(cart[index].id);
  var newQty = cart[index].qty + delta;
  if (newQty < 1) newQty = 1;
  if (p && newQty > p.stock) newQty = p.stock;
  cart[index].qty = newQty;
  saveCart(cart);
  renderCart();
}

function setItemQty(index, val) {
  var cart = getCart();
  if (!cart[index]) return;
  var p = getProductById(cart[index].id);
  var v = parseInt(val) || 1;
  if (v < 1) v = 1;
  if (p && v > p.stock) v = p.stock;
  cart[index].qty = v;
  saveCart(cart);
  renderCart();
}

/* ═══ REMOVE ITEM ═══ */
function removeItem(index) {
  var cart = getCart();
  var item = cart[index];
  if (!item) return;

  var el = document.querySelector('.cart-item[data-index="' + index + '"]');
  if (el) {
    el.style.transform = 'translateX(100%)';
    el.style.opacity = '0';
    el.style.transition = 'all 0.3s ease';
    setTimeout(function() {
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    }, 300);
  } else {
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
  }
}

/* ═══ CLEAR CART ═══ */
function clearCart() {
  if (!confirm('Are you sure you want to clear your cart?')) return;
  saveCart([]);
  removeCoupon();
  renderCart();
}

/* ═══ UPDATE SUMMARY ═══ */
function updateSummary() {
  var cart = getCart();
  var subtotal = 0;

  cart.forEach(function(item) {
    var p = getProductById(item.id);
    if (p) subtotal += getEffectivePrice(p) * item.qty;
  });

  // Shipping
  var shipRadio = document.querySelector('input[name="shipArea"]:checked');
  var shipArea = shipRadio ? shipRadio.value : 'dhaka';
  var shipping = shipArea === 'dhaka' ? CONFIG.shipping.insideDhaka : CONFIG.shipping.outsideDhaka;

  // Free shipping check
  var freeShipEl = document.getElementById('freeShipNotice');
  if (subtotal >= CONFIG.shipping.freeShippingMin) {
    shipping = 0;
    if (freeShipEl) {
      freeShipEl.innerHTML = '🎉 <strong>Free Delivery!</strong> Your order qualifies for free shipping';
      freeShipEl.className = 'free-ship-notice free-ship-yes';
    }
  } else {
    var remaining = CONFIG.shipping.freeShippingMin - subtotal;
    if (freeShipEl) {
      freeShipEl.innerHTML = '🚚 Add <strong>' + formatPrice(remaining) + '</strong> more for free delivery';
      freeShipEl.className = 'free-ship-notice free-ship-no';
    }
  }

  // Discount
  var discount = 0;
  var discountRow = document.getElementById('discountRow');
  if (cartState.coupon) {
    if (cartState.coupon.type === 'percent') {
      discount = Math.round(subtotal * cartState.coupon.discount / 100);
    } else {
      discount = cartState.coupon.discount;
    }
    cartState.discountAmount = discount;
    if (discountRow) discountRow.classList.remove('hidden');
  } else {
    if (discountRow) discountRow.classList.add('hidden');
  }

  var total = subtotal + shipping - discount;
  if (total < 0) total = 0;

  // Update display
  var subEl = document.getElementById('sumSubtotal');
  var shipEl = document.getElementById('sumShipping');
  var discEl = document.getElementById('sumDiscount');
  var totalEl = document.getElementById('sumTotal');

  if (subEl) subEl.textContent = formatPrice(subtotal);
  if (shipEl) shipEl.textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
  if (discEl) discEl.textContent = '-' + formatPrice(discount);
  if (totalEl) totalEl.textContent = formatPrice(total);

  // Save summary for checkout
  localStorage.setItem('kp-summary', JSON.stringify({
    subtotal: subtotal,
    shipping: shipping,
    discount: discount,
    couponCode: cartState.coupon ? cartState.coupon.code : '',
    total: total,
    shipArea: shipArea
  }));
}

/* ═══ COUPON SYSTEM ═══ */
function applyCoupon() {
  var input = document.getElementById('couponInput');
  var msgEl = document.getElementById('couponMsg');
  if (!input || !msgEl) return;

  var code = input.value.trim().toUpperCase();
  if (!code) {
    showCouponMsg('Please enter a coupon code', 'error');
    return;
  }

  var coupon = CONFIG.coupons.find(function(c) {
    return c.code === code && c.active;
  });

  if (!coupon) {
    showCouponMsg('Invalid or expired coupon code', 'error');
    return;
  }

  cartState.coupon = coupon;
  localStorage.setItem('kp-coupon', coupon.code);
  showCouponApplied(coupon);
  showCouponMsg('Coupon applied successfully!', 'success');
  input.value = '';
  updateSummary();
}

function removeCoupon() {
  cartState.coupon = null;
  cartState.discountAmount = 0;
  localStorage.removeItem('kp-coupon');
  var applied = document.getElementById('couponApplied');
  if (applied) applied.classList.add('hidden');
  var msgEl = document.getElementById('couponMsg');
  if (msgEl) msgEl.innerHTML = '';
  updateSummary();
}

function showCouponApplied(coupon) {
  var el = document.getElementById('couponApplied');
  var label = document.getElementById('couponLabel');
  if (!el || !label) return;
  label.textContent = '🏷️ ' + coupon.code + ' — ' + coupon.discount + '% OFF';
  el.classList.remove('hidden');
}

function showCouponMsg(msg, type) {
  var el = document.getElementById('couponMsg');
  if (!el) return;
  el.textContent = msg;
  el.className = 'coupon-msg coupon-msg-' + type;
  setTimeout(function() { el.textContent = ''; el.className = 'coupon-msg'; }, 3000);
}

/* ═══ GLOBAL ACCESS ═══ */
window.updateItemQty = updateItemQty;
window.setItemQty = setItemQty;
window.removeItem = removeItem;
window.clearCart = clearCart;
window.updateSummary = updateSummary;
window.applyCoupon = applyCoupon;
window.removeCoupon = removeCoupon;