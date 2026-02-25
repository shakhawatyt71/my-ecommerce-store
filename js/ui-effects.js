/*
 * ✨ KORA PORT — UI Effects & Enhancements
 */

document.addEventListener('DOMContentLoaded', function() {
  initCartBadgeAnim();
  initBuyNowShake();
  initImageLazyLoad();
});

/* ═══ CART BADGE BOUNCE ON UPDATE ═══ */
function initCartBadgeAnim() {
  var origUpdate = window.updateCartBadge;
  window.updateCartBadge = function() {
    if (origUpdate) origUpdate();
    var badge = document.getElementById('cartBadge');
    if (badge && badge.style.display !== 'none') {
      badge.classList.remove('cart-badge-anim');
      void badge.offsetWidth;
      badge.classList.add('cart-badge-anim');
    }
  };
}

/* ═══ BUY NOW BUTTON SHAKE ON HOVER ═══ */
function initBuyNowShake() {
  document.addEventListener('mouseover', function(e) {
    var btn = e.target.closest('.p-act-buy, .pd-buy-btn');
    if (btn) {
      btn.style.animation = 'none';
      void btn.offsetWidth;
      btn.style.animation = 'btnShake 0.5s ease, accentPulse 2.5s infinite';
    }
  });
}

/* ═══ LAZY LOAD IMAGES ═══ */
function initImageLazyLoad() {
  if ('IntersectionObserver' in window) {
    var imgs = document.querySelectorAll('img[loading="lazy"]');
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          var img = e.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });
    imgs.forEach(function(img) { obs.observe(img); });
  }
}

/* ═══ SMOOTH SCROLL FOR ANCHOR LINKS ═══ */
document.addEventListener('click', function(e) {
  var link = e.target.closest('a[href^="#"]');
  if (!link) return;
  var id = link.getAttribute('href').slice(1);
  var target = document.getElementById(id);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

/* ═══ ADD TO CART ANIMATION ═══ */
window.animateAddToCart = function(buttonEl) {
  if (!buttonEl) return;
  var orig = buttonEl.textContent;
  buttonEl.textContent = '✅ Added!';
  buttonEl.style.background = 'var(--color-success)';
  buttonEl.style.transform = 'scale(0.95)';
  setTimeout(function() {
    buttonEl.textContent = orig;
    buttonEl.style.background = '';
    buttonEl.style.transform = '';
  }, 800);
};

/* ═══ PARALLAX HERO BG (subtle) ═══ */
(function() {
  var hero = document.querySelector('.hero-bg');
  if (!hero) return;
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        var y = window.pageYOffset;
        if (y < 600) {
          hero.style.transform = 'translateY(' + (y * 0.15) + 'px)';
        }
        ticking = false;
      });
      ticking = true;
    }
  });
})();