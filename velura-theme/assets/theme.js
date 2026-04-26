// Velura theme — interactivity (AJAX cart, FAQ, gallery, lightbox, variants/bundles)
(function () {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const fmtMoney = (cents) => '$' + (cents / 100).toFixed(2);

  /* ── ANNOUNCEMENT BAR (loop content) ── */
  function buildLoop() {
    $$('.announce-track[data-loop="true"], .ticker-inner[data-loop="true"]').forEach((el) => {
      const html = el.innerHTML;
      el.innerHTML = html + html + (el.classList.contains('announce-track') ? html : '');
    });
  }

  /* ── FAQ ── */
  function wireFAQ() {
    $$('.faq-list').forEach((list) => {
      list.addEventListener('click', (e) => {
        const btn = e.target.closest('.faq-q');
        if (!btn) return;
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        $$('.faq-item', list).forEach((el) => {
          el.classList.remove('open');
          const q = el.querySelector('.faq-q');
          if (q) q.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ── GALLERY ── */
  function wireGallery() {
    const gallery = $('[data-gallery]');
    if (!gallery) return;
    const main = $('[data-gallery-main]', gallery);
    const img = $('[data-gallery-img]', gallery);
    const thumbs = $('[data-gallery-thumbs]', gallery);
    if (thumbs) {
      thumbs.addEventListener('click', (e) => {
        const t = e.target.closest('.thumb');
        if (!t) return;
        const src = t.getAttribute('data-src');
        if (img && src) img.src = src;
        const lb = $('#lightbox-img');
        if (lb && src) lb.src = src;
        $$('.thumb', thumbs).forEach((el) => el.classList.toggle('active', el === t));
      });
    }
    if (main) main.addEventListener('click', () => openLightbox());
  }

  /* ── PRODUCT BLOCK: variants, bundles, qty, ATC ── */
  const productState = { variantId: null, bundleQty: 1, userQty: 1, unitPriceCents: 0 };

  function wireProduct() {
    const block = $('[data-product-block]');
    if (!block) return;

    const variantsEl = $('[data-variants]', block);
    const bundlesEl = $('[data-bundles]', block);
    const qtyValue = $('[data-qty-value]', block);
    const qtyMinus = $('[data-qty-minus]', block);
    const qtyPlus = $('[data-qty-plus]', block);
    const atcBtn = $('[data-atc]', block);
    const atcTotal = $('[data-atc-total]', block);
    const priceEl = $('[data-price]', block);
    const wasEl = $('[data-was]', block);
    const variantSelected = $('[data-variant-selected]', block);

    const initialVariant = $('.variant.selected', block);
    if (initialVariant) {
      productState.variantId = initialVariant.getAttribute('data-variant-id');
      productState.unitPriceCents = parseInt(initialVariant.getAttribute('data-price-cents') || '0', 10);
    }

    const initialBundle = $('.bundle.selected', block);
    if (initialBundle) {
      productState.bundleQty = parseInt(initialBundle.getAttribute('data-bundle-qty') || '1', 10);
    }

    if (variantsEl) {
      variantsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.variant');
        if (!btn) return;
        productState.variantId = btn.getAttribute('data-variant-id');
        productState.unitPriceCents = parseInt(btn.getAttribute('data-price-cents') || '0', 10);
        $$('.variant', variantsEl).forEach((el) => el.classList.toggle('selected', el === btn));
        if (variantSelected) variantSelected.textContent = btn.getAttribute('data-name') || '';
        refreshPrice();
      });
    }

    if (bundlesEl) {
      bundlesEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.bundle');
        if (!btn) return;
        productState.bundleQty = parseInt(btn.getAttribute('data-bundle-qty') || '1', 10);
        $$('.bundle', bundlesEl).forEach((el) => el.classList.toggle('selected', el === btn));
        refreshPrice();
      });
    }

    if (qtyMinus) qtyMinus.addEventListener('click', () => { productState.userQty = Math.max(1, productState.userQty - 1); if (qtyValue) qtyValue.textContent = productState.userQty; refreshPrice(); });
    if (qtyPlus)  qtyPlus.addEventListener('click',  () => { productState.userQty = productState.userQty + 1;          if (qtyValue) qtyValue.textContent = productState.userQty; refreshPrice(); });

    if (atcBtn) atcBtn.addEventListener('click', addToShopifyCart);

    function refreshPrice() {
      const totalCents = productState.unitPriceCents * productState.bundleQty * productState.userQty;
      if (priceEl) priceEl.textContent = fmtMoney(productState.unitPriceCents * productState.bundleQty);
      if (atcTotal) atcTotal.textContent = fmtMoney(totalCents);

      const activeBundle = $('.bundle.selected', block);
      if (activeBundle && wasEl) {
        const wasCents = parseInt(activeBundle.getAttribute('data-was-cents') || '0', 10);
        wasEl.textContent = wasCents > 0 ? fmtMoney(wasCents) : '';
        wasEl.style.display = wasCents > 0 ? '' : 'none';
      }
    }

    refreshPrice();
  }

  /* ── SHOPIFY CART API ── */
  async function fetchCart() {
    try {
      const res = await fetch('/cart.js', { credentials: 'same-origin' });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) { return null; }
  }

  async function addToShopifyCart() {
    if (!productState.variantId) { openCart(); return; }
    const quantity = productState.bundleQty * productState.userQty;
    try {
      await fetch('/cart/add.js', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ id: productState.variantId, quantity: quantity }),
      });
    } catch (e) {}
    await refreshCart();
    openCart();
  }

  async function changeCartItem(line, quantity) {
    try {
      await fetch('/cart/change.js', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ line: line, quantity: quantity }),
      });
    } catch (e) {}
    await refreshCart();
  }

  async function refreshCart() {
    const cart = await fetchCart();
    renderCart(cart);
    updateCartCount(cart);
  }

  function updateCartCount(cart) {
    const count = (cart && cart.item_count) || 0;
    $$('[data-cart-count]').forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? '' : 'none';
    });
  }

  function renderCart(cart) {
    const body = $('#cart-body');
    const foot = $('#cart-foot');
    if (!body || !foot) return;

    const items = (cart && cart.items) || [];

    if (items.length === 0) {
      body.innerHTML = '<div class="cart-empty"><span class="serif">Your cart is empty.</span><span>Continue shopping below.</span></div>';
      foot.style.display = 'none';
      return;
    }

    body.innerHTML = items.map((it, i) => `
      <div class="cart-item">
        <div class="cart-item-img"${it.image ? ' style="background:#fdf5f3 url(' + it.image + ') center/cover no-repeat"' : ''}></div>
        <div class="cart-item-info">
          <div class="name">${escapeHtml(it.product_title || '')}</div>
          <div class="v">${escapeHtml(it.variant_title || '')}</div>
          <div class="qty">
            <button data-act="minus" data-line="${i + 1}" aria-label="Decrease">−</button>
            <span>${it.quantity}</span>
            <button data-act="plus"  data-line="${i + 1}" aria-label="Increase">+</button>
          </div>
        </div>
        <div class="cart-item-price">
          <div class="p">${fmtMoney(it.line_price)}</div>
          <button class="rm" data-act="remove" data-line="${i + 1}">Remove</button>
        </div>
      </div>`).join('');

    const total = cart.total_price || 0;
    const freeShipAt = parseInt((document.body.getAttribute('data-free-ship-cents') || '10000'), 10);
    const remaining = Math.max(0, freeShipAt - total);
    const pct = Math.min(100, (total / freeShipAt) * 100);
    const text = $('#cart-progress-text');
    const fill = $('#cart-progress-fill');
    if (text) text.innerHTML = remaining > 0
      ? "You're <strong>" + fmtMoney(remaining) + '</strong> from free express shipping'
      : 'Free express shipping unlocked ✓';
    if (fill) fill.style.width = pct + '%';
    const totalEl = $('#cart-total');
    const checkoutPriceEl = $('#cart-checkout-price');
    if (totalEl) totalEl.textContent = fmtMoney(total);
    if (checkoutPriceEl) checkoutPriceEl.textContent = fmtMoney(total);
    foot.style.display = '';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ── CART DRAWER ── */
  function openCart()  { $('#cart-overlay') && $('#cart-overlay').classList.add('open'); $('#cart-drawer') && $('#cart-drawer').classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeCart() { $('#cart-overlay') && $('#cart-overlay').classList.remove('open'); $('#cart-drawer') && $('#cart-drawer').classList.remove('open'); document.body.style.overflow = ''; }

  function wireCart() {
    const overlay = $('#cart-overlay');
    const closeBtn = $('#cart-close');
    if (overlay) overlay.addEventListener('click', closeCart);
    if (closeBtn) closeBtn.addEventListener('click', closeCart);

    $$('[data-cart-trigger]').forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); openCart(); }));

    const body = $('#cart-body');
    if (body) {
      body.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-act]');
        if (!btn) return;
        const line = parseInt(btn.getAttribute('data-line'), 10);
        const act = btn.getAttribute('data-act');
        const item = btn.closest('.cart-item');
        const qtyEl = item && item.querySelector('.qty span');
        const cur = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
        if (act === 'minus')  changeCartItem(line, Math.max(0, cur - 1));
        if (act === 'plus')   changeCartItem(line, cur + 1);
        if (act === 'remove') changeCartItem(line, 0);
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeCart(); closeLightbox(); }
    });
  }

  /* ── LIGHTBOX ── */
  function openLightbox()  { $('#lightbox') && $('#lightbox').classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeLightbox() { $('#lightbox') && $('#lightbox').classList.remove('open'); document.body.style.overflow = ''; }

  function wireLightbox() {
    const lb = $('#lightbox');
    if (!lb) return;
    lb.addEventListener('click', (e) => { if (e.target === e.currentTarget) closeLightbox(); });
    const close = $('#lightbox-close');
    if (close) close.addEventListener('click', closeLightbox);
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', () => {
    buildLoop();
    wireFAQ();
    wireGallery();
    wireProduct();
    wireCart();
    wireLightbox();
    refreshCart();
  });
})();
