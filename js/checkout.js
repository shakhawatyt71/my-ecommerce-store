/*
 * 📝 KORA PORT — Checkout Logic
 */

var selectedPayment = 'cod';

document.addEventListener('DOMContentLoaded', function() {
  initCheckout();
});

function getCart() {
  try { return JSON.parse(localStorage.getItem('kp-cart') || '[]'); }
  catch(e) { return []; }
}

/* ═══ INIT ═══ */
function initCheckout() {
  var cart = getCart();
  var emptyEl = document.getElementById('checkoutEmpty');
  var layoutEl = document.getElementById('checkoutLayout');
  var mobBtn = document.getElementById('mobConfirmBtn');

  if (cart.length === 0) {
    if (emptyEl) emptyEl.classList.remove('hidden');
    if (layoutEl) layoutEl.classList.add('hidden');
    return;
  }

  if (emptyEl) emptyEl.classList.add('hidden');
  if (layoutEl) layoutEl.classList.remove('hidden');
  if (mobBtn) mobBtn.classList.remove('hidden');

  renderCheckoutItems();
  updateCheckoutSummary();

  // GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'begin_checkout' });
}

/* ═══ RENDER ORDER ITEMS ═══ */
function renderCheckoutItems() {
  var cart = getCart();
  var el = document.getElementById('coItemsList');
  if (!el) return;

  var html = '';
  cart.forEach(function(item) {
    var p = getProductById(item.id);
    if (!p) return;
    var ep = getEffectivePrice(p);

    html += '<div class="checkout-item">' +
      '<img src="' + p.image + '" alt="' + p.name + '" class="co-item-img">' +
      '<div class="co-item-info">' +
        '<div class="co-item-name">' + p.name + '</div>' +
        '<div class="co-item-meta">' +
          (item.size ? 'Size: ' + item.size : '') +
          (item.color ? ' | Color: ' + item.color : '') +
          ' | Qty: ' + item.qty +
        '</div>' +
      '</div>' +
      '<div class="co-item-price">' + formatPrice(ep * item.qty) + '</div>' +
    '</div>';
  });

  el.innerHTML = html;
}

/* ═══ UPDATE SUMMARY ═══ */
function updateCheckoutSummary() {
  var cart = getCart();
  var subtotal = 0;

  cart.forEach(function(item) {
    var p = getProductById(item.id);
    if (p) subtotal += getEffectivePrice(p) * item.qty;
  });

  // Shipping from district
  var district = document.getElementById('coDistrict');
  var shipArea = district && district.value === 'dhaka' ? 'dhaka' : 'outside';
  var shipping = shipArea === 'dhaka' ? CONFIG.shipping.insideDhaka : CONFIG.shipping.outsideDhaka;

  if (!district || !district.value) {
    shipping = CONFIG.shipping.outsideDhaka;
  }

  if (subtotal >= CONFIG.shipping.freeShippingMin) {
    shipping = 0;
  }

  // Coupon
  var discount = 0;
  var couponCode = localStorage.getItem('kp-coupon') || '';
  if (couponCode) {
    var coupon = CONFIG.coupons.find(function(c) { return c.code === couponCode && c.active; });
    if (coupon) {
      if (coupon.type === 'percent') discount = Math.round(subtotal * coupon.discount / 100);
      else discount = coupon.discount;
    }
  }

  var total = subtotal + shipping - discount;
  if (total < 0) total = 0;

  var subEl = document.getElementById('coSubtotal');
  var shipEl = document.getElementById('coShipping');
  var discEl = document.getElementById('coDiscount');
  var discRow = document.getElementById('coDiscountRow');
  var totalEl = document.getElementById('coTotal');

  if (subEl) subEl.textContent = formatPrice(subtotal);
  if (shipEl) shipEl.textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
  if (discount > 0) {
    if (discRow) discRow.classList.remove('hidden');
    if (discEl) discEl.textContent = '-' + formatPrice(discount);
  } else {
    if (discRow) discRow.classList.add('hidden');
  }
  if (totalEl) totalEl.textContent = formatPrice(total);

  // Save for order
  localStorage.setItem('kp-checkout-summary', JSON.stringify({
    subtotal: subtotal, shipping: shipping,
    discount: discount, couponCode: couponCode,
    total: total, shipArea: shipArea
  }));
}

/* ═══ DISTRICT CHANGE ═══ */
function onDistrictChange() {
  var district = document.getElementById('coDistrict');
  var infoEl = document.getElementById('shipAutoInfo');
  if (!district || !infoEl) return;

  var val = district.value;
  if (!val) { infoEl.innerHTML = ''; return; }

  if (val === 'dhaka') {
    infoEl.innerHTML = '<span class="ship-auto-badge inside">📍 Inside Dhaka — ৳' + CONFIG.shipping.insideDhaka + ' shipping</span>';
  } else {
    infoEl.innerHTML = '<span class="ship-auto-badge outside">📍 Outside Dhaka — ৳' + CONFIG.shipping.outsideDhaka + ' shipping</span>';
  }

  updateCheckoutSummary();
}

/* ═══ PAYMENT SELECTION ═══ */
function selectPayment(method) {
  if (method === 'bank' || method === 'card') return;

  selectedPayment = method;

  document.querySelectorAll('.pay-method').forEach(function(el) {
    el.classList.remove('active');
  });

  var activeEl = document.getElementById('pay' + method.charAt(0).toUpperCase() + method.slice(1));
  if (method === 'cod') activeEl = document.getElementById('payCOD');
  if (method === 'bkash') activeEl = document.getElementById('payBkash');
  if (method === 'nagad') activeEl = document.getElementById('payNagad');
  if (activeEl) activeEl.classList.add('active');

  // Show/hide details
  var bk = document.getElementById('bkashDetails');
  var ng = document.getElementById('nagadDetails');
  var adv = document.getElementById('advanceSection');

  if (bk) bk.classList.toggle('hidden', method !== 'bkash');
  if (ng) ng.classList.toggle('hidden', method !== 'nagad');
  if (adv) adv.style.display = method === 'cod' ? 'block' : 'none';

  // GTM
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'add_payment_info', payment_type: method });
}

/* ═══ COPY NUMBER ═══ */
function copyNumber(num) {
  navigator.clipboard.writeText(num).then(function() {
    showCopyToast('✅ Number copied!');
  }).catch(function() {
    var t = document.createElement('textarea');
    t.value = num; document.body.appendChild(t);
    t.select(); document.execCommand('copy');
    document.body.removeChild(t);
    showCopyToast('✅ Number copied!');
  });
}

function showCopyToast(msg) {
  var old = document.querySelector('.copy-toast');
  if (old) old.remove();
  var el = document.createElement('div');
  el.className = 'copy-toast';
  el.textContent = msg;
  el.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--color-primary);color:#fff;padding:10px 20px;border-radius:var(--radius-full);font-size:0.85rem;font-weight:600;z-index:999;box-shadow:var(--shadow-lg);';
  document.body.appendChild(el);
  setTimeout(function() { el.remove(); }, 2000);
}

/* ═══ PHONE VALIDATION ═══ */
function validatePhone(phone) {
  var cleaned = phone.replace(/[\s\-\(\)]/g, '');

  if (cleaned.startsWith('+880')) cleaned = '0' + cleaned.slice(4);
  else if (cleaned.startsWith('0088')) cleaned = '0' + cleaned.slice(4);
  else if (cleaned.startsWith('880')) cleaned = '0' + cleaned.slice(3);

  if (/^01[3-9]\d{8}$/.test(cleaned)) return cleaned;
  return false;
}

/* ═══ FORM VALIDATION ═══ */
function validateForm() {
  var valid = true;

  // Clear errors
  document.querySelectorAll('.form-error-text').forEach(function(el) {
    el.classList.add('hidden');
    el.textContent = '';
  });
  document.querySelectorAll('.form-input.error, .form-select.error, .form-textarea.error').forEach(function(el) {
    el.classList.remove('error');
  });

  // Name
  var name = document.getElementById('coName');
  if (!name.value.trim() || name.value.trim().length < 3) {
    showError('coName', 'errName', 'Please enter your full name (min 3 characters)');
    valid = false;
  }

  // Phone
  var phone = document.getElementById('coPhone');
  var cleanPhone = validatePhone(phone.value);
  if (!cleanPhone) {
    showError('coPhone', 'errPhone', 'Enter a valid BD phone number (e.g. 01XXXXXXXXX)');
    valid = false;
  }

  // District
  var district = document.getElementById('coDistrict');
  if (!district.value) {
    showError('coDistrict', 'errDistrict', 'Please select your district');
    valid = false;
  }

  // Address
  var address = document.getElementById('coAddress');
  if (!address.value.trim() || address.value.trim().length < 10) {
    showError('coAddress', 'errAddress', 'Please enter your full address (min 10 characters)');
    valid = false;
  }

  // Payment specific
  if (selectedPayment === 'bkash') {
    var trxB = document.getElementById('coTrxBkash');
    if (!trxB.value.trim()) {
      showError('coTrxBkash', 'errTrxBkash', 'Please enter your bKash Transaction ID');
      valid = false;
    }
  }

  if (selectedPayment === 'nagad') {
    var trxN = document.getElementById('coTrxNagad');
    if (!trxN.value.trim()) {
      showError('coTrxNagad', 'errTrxNagad', 'Please enter your Nagad Transaction ID');
      valid = false;
    }
  }

  return valid;
}

function showError(inputId, errorId, msg) {
  var input = document.getElementById(inputId);
  var err = document.getElementById(errorId);
  if (input) input.classList.add('error');
  if (err) { err.textContent = msg; err.classList.remove('hidden'); }
}

/* ═══ PLACE ORDER ═══ */
function placeOrder() {
  if (!validateForm()) {
    var firstErr = document.querySelector('.form-input.error, .form-select.error, .form-textarea.error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  var btn = document.getElementById('confirmBtn');
  var mobBtn = document.getElementById('mobConfirmBtn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Processing...'; }
  if (mobBtn) { mobBtn.disabled = true; mobBtn.textContent = '⏳ Processing...'; }

  var cart = getCart();
  var summary = JSON.parse(localStorage.getItem('kp-checkout-summary') || '{}');
  var cleanPhone = validatePhone(document.getElementById('coPhone').value);

  // Generate Order ID
  var now = new Date();
  var dateStr = now.getFullYear().toString() +
    ('0' + (now.getMonth() + 1)).slice(-2) +
    ('0' + now.getDate()).slice(-2);
  var rand = Math.floor(Math.random() * 900) + 100;
  var orderId = CONFIG.settings.orderPrefix + '-' + dateStr + '-' + rand;

  // Build product list text
  var productsList = '';
  var productsArray = [];
  cart.forEach(function(item) {
    var p = getProductById(item.id);
    if (!p) return;
    var ep = getEffectivePrice(p);
    productsList += p.name + ' (' + (item.size||'-') + '/' + (item.color||'-') + ') x' + item.qty + ' = ' + formatPrice(ep * item.qty) + '\n';
    productsArray.push({
      item_id: p.id, item_name: p.name,
      price: ep, quantity: item.qty,
      item_variant: (item.size||'') + '/' + (item.color||''),
      item_category: p.categories[0] || ''
    });
  });

  // Advance info
  var advanceAmt = 0;
  var advanceMethod = '';
  var advanceTrx = '';
  if (selectedPayment === 'cod') {
    advanceAmt = parseInt(document.getElementById('coAdvance')?.value) || 0;
    advanceMethod = document.getElementById('coAdvanceMethod')?.value || '';
    advanceTrx = document.getElementById('coAdvanceTrx')?.value?.trim() || '';
  }

  // Transaction ID
  var trxId = '';
  if (selectedPayment === 'bkash') trxId = document.getElementById('coTrxBkash')?.value?.trim() || '';
  if (selectedPayment === 'nagad') trxId = document.getElementById('coTrxNagad')?.value?.trim() || '';

  // Build order data
  var orderData = {
    orderId: orderId,
    date: now.toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' }),
    timestamp: now.getTime(),
    customer: {
      name: document.getElementById('coName').value.trim(),
      phone: cleanPhone,
      email: document.getElementById('coEmail')?.value?.trim() || '',
      district: document.getElementById('coDistrict').value,
      address: document.getElementById('coAddress').value.trim(),
      note: document.getElementById('coNote')?.value?.trim() || ''
    },
    products: productsList.trim(),
    productsArray: productsArray,
    totalItems: cart.reduce(function(s, i) { return s + i.qty; }, 0),
    subtotal: summary.subtotal || 0,
    shipping: summary.shipping || 0,
    discount: summary.discount || 0,
    couponCode: summary.couponCode || '',
    total: summary.total || 0,
    paymentMethod: selectedPayment,
    transactionId: trxId,
    advance: advanceAmt,
    advanceMethod: advanceMethod,
    advanceTrx: advanceTrx,
    status: 'Pending'
  };

  // Save order locally
  localStorage.setItem('kp-last-order', JSON.stringify(orderData));

  // GTM purchase event
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'purchase',
    ecommerce: {
      transaction_id: orderId,
      value: summary.total,
      currency: 'BDT',
      shipping: summary.shipping,
      coupon: summary.couponCode || '',
      items: productsArray
    }
  });

  // Send to Google Sheets
  submitOrder(orderData);
}

/* ═══ SUBMIT ORDER ═══ */
function submitOrder(orderData) {
  // Google Sheets URL (স্টেপ ৯ এ সেটআপ করে এখানে বসাবেন)
  var SHEET_URL = 'https://script.google.com/macros/s/AKfycbwhBVcDKXWepE-3GqPI1CjmeeejHtZNq7fnNsWXfdRLZJKtes0NbRgQKlMjz0tnS6k_/exec' '';

  if (SHEET_URL) {
    fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    }).catch(function(err) {
      console.log('Sheet submit error:', err);
    });
  }

  // Clear cart
  localStorage.removeItem('kp-cart');
  localStorage.removeItem('kp-coupon');
  localStorage.removeItem('kp-summary');
  localStorage.removeItem('kp-checkout-summary');

  // Redirect to success
  setTimeout(function() {
    window.location.href = 'order-success.html';
  }, 800);
}

/* ═══ GLOBAL ═══ */
window.selectPayment = selectPayment;
window.onDistrictChange = onDistrictChange;
window.copyNumber = copyNumber;
window.placeOrder = placeOrder;