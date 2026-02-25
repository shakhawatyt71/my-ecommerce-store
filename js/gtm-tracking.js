/*
 * 📊 KORA PORT — GTM DataLayer Bridge
 * ═══════════════════════════════════════
 * GTM ID: GTM-TWPPQPTG
 * Meta Pixel ID: 772000649295028 (GTM থেকে কন্ট্রোল)
 *
 * এই ফাইল ২টা কাজ করে:
 * 1. KP_TRACK ফাংশন — সরাসরি ব্যবহারের জন্য
 * 2. Auto Bridge — পুরানো pushGTM() কলগুলো ধরে
 *    kp_ prefix ইভেন্টে convert করে GTM এ পাঠায়
 * ═══════════════════════════════════════
 */

window.dataLayer = window.dataLayer || [];

/* ═══════════════════════════════════════
   📋 KP_TRACK — Main Tracking Functions
   ═══════════════════════════════════════ */
var KP_TRACK = {

  pageView: function(pageType, pageTitle) {
    dataLayer.push({
      event: 'kp_page_view',
      dlv_page_type: pageType || 'other',
      dlv_page_title: pageTitle || document.title,
      dlv_page_url: window.location.href
    });
  },

  viewItemList: function(listName, products) {
    var ids = (products || []).slice(0, 10).map(function(p) { return p.id; });
    dataLayer.push({
      event: 'kp_view_item_list',
      dlv_item_list_name: listName || 'all',
      dlv_content_ids: ids,
      dlv_num_items: (products || []).length,
      dlv_currency: 'BDT'
    });
  },

  viewItem: function(product) {
    if (!product) return;
    var price = typeof getEffectivePrice === 'function' ? getEffectivePrice(product) : (product.discountPrice || product.price);
    dataLayer.push({
      event: 'kp_view_item',
      dlv_item_id: product.id,
      dlv_item_name: product.name,
      dlv_price: price,
      dlv_value: price,
      dlv_item_category: (product.categories && product.categories[0]) || '',
      dlv_currency: 'BDT',
      dlv_content_ids: [product.id],
      dlv_content_type: 'product'
    });
  },

  addToCart: function(product, qty, size, color) {
    if (!product) return;
    var price = typeof getEffectivePrice === 'function' ? getEffectivePrice(product) : (product.discountPrice || product.price);
    var val = price * (qty || 1);
    dataLayer.push({
      event: 'kp_add_to_cart',
      dlv_item_id: product.id,
      dlv_item_name: product.name,
      dlv_price: price,
      dlv_quantity: qty || 1,
      dlv_item_variant: (size || '') + '/' + (color || ''),
      dlv_item_category: (product.categories && product.categories[0]) || '',
      dlv_value: val,
      dlv_currency: 'BDT',
      dlv_content_ids: [product.id],
      dlv_content_type: 'product'
    });
  },

  beginCheckout: function(cart, totalValue, totalItems) {
    var ids = (cart || []).map(function(i) { return i.id; });
    dataLayer.push({
      event: 'kp_begin_checkout',
      dlv_value: totalValue || 0,
      dlv_num_items: totalItems || 0,
      dlv_currency: 'BDT',
      dlv_content_ids: ids,
      dlv_content_type: 'product'
    });
  },

  addPaymentInfo: function(paymentMethod) {
    dataLayer.push({
      event: 'kp_add_payment_info',
      dlv_payment_method: paymentMethod || 'unknown'
    });
  },

  purchase: function(orderData) {
    if (!orderData) return;
    var ids = (orderData.productsArray || []).map(function(p) { return p.item_id; });
    dataLayer.push({
      event: 'kp_purchase',
      dlv_order_id: orderData.orderId,
      dlv_value: orderData.total,
      dlv_currency: 'BDT',
      dlv_shipping: orderData.shipping,
      dlv_discount: orderData.discount,
      dlv_coupon: orderData.couponCode || '',
      dlv_num_items: orderData.totalItems,
      dlv_payment_method: orderData.paymentMethod,
      dlv_customer_district: orderData.customer ? orderData.customer.district : '',
      dlv_content_ids: ids,
      dlv_content_type: 'product'
    });
  },

  search: function(query) {
    dataLayer.push({
      event: 'kp_search',
      dlv_search_term: query || ''
    });
  },

  contact: function(method) {
    dataLayer.push({
      event: 'kp_contact',
      dlv_contact_method: method || 'unknown'
    });
  }
};

window.KP_TRACK = KP_TRACK;


/* ═══════════════════════════════════════
   🔌 AUTO BRIDGE
   পুরানো কোডে pushGTM() ও dataLayer.push()
   দিয়ে যে ইভেন্ট পাঠানো হচ্ছে, সেগুলো ধরে
   kp_ prefix সহ আবার push করবে।
   ═══════════════════════════════════════ */
(function autoBridge() {

  /* ─── Override pushGTM ─── */
  var origPush = window.pushGTM;
  window.pushGTM = function(data) {
    /* আগের মতো push করুক */
    if (origPush) origPush(data);

    /* এখন kp_ ইভেন্টও fire করি */
    if (!data || !data.event) return;
    var ev = data.event;

    if (ev === 'add_to_cart' && data.item_id) {
      var p = typeof getProductById === 'function' ? getProductById(data.item_id) : null;
      if (p) KP_TRACK.addToCart(p, data.quantity || 1, '', '');
    }
    else if (ev === 'select_item' && data.item_id) {
      var p2 = typeof getProductById === 'function' ? getProductById(data.item_id) : null;
      if (p2) KP_TRACK.viewItem(p2);
    }
    else if (ev === 'view_item_list') {
      KP_TRACK.viewItemList(data.item_list_name || 'homepage');
    }
    else if (ev === 'view_item' && data.ecommerce) {
      /* product-display.js থেকে আসে */
      var items = data.ecommerce.items;
      if (items && items[0]) {
        var pid = items[0].item_id;
        var prd = typeof getProductById === 'function' ? getProductById(pid) : null;
        if (prd) KP_TRACK.viewItem(prd);
      }
    }
  };

  /* ─── Intercept dataLayer.push for checkout events ─── */
  var origDLPush = dataLayer.push;
  dataLayer.push = function() {
    /* আসল push আগে হোক */
    var result = origDLPush.apply(dataLayer, arguments);

    /* আর্গুমেন্ট চেক করি */
    for (var i = 0; i < arguments.length; i++) {
      var data = arguments[i];
      if (!data || !data.event) continue;
      var ev = data.event;

      /* শুধু পুরানো নাম গুলো ধরবো, kp_ গুলো skip */
      if (ev.indexOf('kp_') === 0) continue;

      if (ev === 'begin_checkout') {
        /* checkout.js থেকে আসে */
        if (!data._bridged) {
          data._bridged = true;
          var cart2 = [];
          try { cart2 = JSON.parse(localStorage.getItem('kp-cart') || '[]'); } catch(e) {}
          var sub2 = 0;
          cart2.forEach(function(item) {
            var pp = typeof getProductById === 'function' ? getProductById(item.id) : null;
            if (pp) sub2 += (typeof getEffectivePrice === 'function' ? getEffectivePrice(pp) : pp.price) * item.qty;
          });
          var total2 = cart2.reduce(function(s, item) { return s + item.qty; }, 0);
          KP_TRACK.beginCheckout(cart2, sub2, total2);
        }
      }
      else if (ev === 'add_payment_info' && data.payment_type) {
        if (!data._bridged) {
          data._bridged = true;
          KP_TRACK.addPaymentInfo(data.payment_type);
        }
      }
      else if (ev === 'purchase' && data.ecommerce) {
        if (!data._bridged) {
          data._bridged = true;
          var order = null;
          try { order = JSON.parse(localStorage.getItem('kp-last-order')); } catch(e) {}
          if (order) KP_TRACK.purchase(order);
        }
      }
      else if (ev === 'page_view') {
        if (!data._bridged) {
          data._bridged = true;
          KP_TRACK.pageView(data.page_type || 'other', data.page_title || '');
        }
      }
    }

    return result;
  };

  /* ─── Page load tracking ─── */
  var path = window.location.pathname;
  var ptype = 'other';
  if (path === '/' || path.includes('index.html')) ptype = 'home';
  else if (path.includes('shop')) ptype = 'shop';
  else if (path.includes('product-detail')) ptype = 'product';
  else if (path.includes('cart.html')) ptype = 'cart';
  else if (path.includes('checkout.html')) ptype = 'checkout';
  else if (path.includes('order-success')) ptype = 'purchase_complete';
  else if (path.includes('contact')) ptype = 'contact';

  KP_TRACK.pageView(ptype, document.title);

})();