// Velura homepage interactivity

const ANNOUNCE_ITEMS = [
  'USE CODE: BLOOM15 FOR 15% OFF YOUR FIRST ORDER',
  'IPX7 WATERPROOF',
  'MEDICAL-GRADE SILICONE',
  'SUPPORTS PELVIC FLOOR HEALTH',
  'FREE DISCREET SHIPPING',
  'LIFETIME GUARANTEE',
];

const TICKER_ITEMS = [
  'IPX7 WATERPROOF',
  'MEDICAL-GRADE SILICONE',
  '4-ZONE ACTIVATION',
  '15,000+ HAPPY CUSTOMERS',
  'TSA & EU AIRLINE APPROVED',
  'LIFETIME GUARANTEE',
  'BLOOM15 · 15% OFF YOUR FIRST ORDER',
];

const COMPARE_ROWS = [
  { f: 'Deep-target activation for real pelvic floor engagement', velura: true,  others: false },
  { f: '4 independent motor zones (not 1 motor spread thin)',     velura: true,  others: false },
  { f: 'Actually quiet during use',                                velura: true,  others: 'partial' },
  { f: 'Body-conforming, ergonomic fit',                           velura: true,  others: false },
  { f: "Won't die mid-use — long battery life",                   velura: true,  others: false },
  { f: 'Reliable charging system',                                 velura: true,  others: 'partial' },
  { f: 'Feels natural, not clinical',                              velura: true,  others: false },
  { f: 'Medical-grade silicone, body-safe',                        velura: true,  others: 'partial' },
];

const REVIEWS = [
  { n: 5, h: 'Comfortable and discreet',
    body: 'I love how comfortable and discreet this feels — it fits naturally and makes my routine much easier to stick with. The targeted stimulation stands out, and the different settings make each session feel personalized. Super simple to use and very quiet.',
    name: 'Kathy', meta: 'Verified customer' },
  { n: 5, h: 'Premium feel, body-safe silicone',
    body: 'The design feels premium and the silicone is soft and body-safe. I really like the variety of intensity settings and the way it supports focused pelvic floor work. It took a little time to find my favorite settings, but overall it works really well and delivers on what it promises.',
    name: 'Amara', meta: 'Verified customer' },
  { n: 5, h: 'Does exactly what it says',
    body: "This product does exactly what it says. It's comfortable enough for regular use and effective enough to notice right away. The compact design is a nice touch, and the waterproof feature makes it even more versatile. Definitely worth it.",
    name: 'Jenny', meta: 'Verified customer' },
  { n: 5, h: 'Beginner-friendly settings',
    body: "I was nervous to try a pelvic floor trainer, but the adjustable settings made it really easy to start gentle and build up. Six weeks in and I'm already noticing a difference in core engagement.",
    name: 'Lydia', meta: 'Verified customer' },
  { n: 5, h: 'Postpartum game-changer',
    body: 'After my second baby I felt so disconnected from my body. The 4-zone activation has helped me reconnect and rebuild strength I thought was gone for good. Worth every penny.',
    name: 'Robin', meta: 'Verified customer' },
  { n: 5, h: 'Quiet enough for shared spaces',
    body: 'I share a small apartment and was worried about noise. This thing is genuinely whisper-quiet on every setting. Discreet packaging on arrival was a nice touch too.',
    name: 'Priya', meta: 'Verified customer' },
];

const FAQ_ITEMS = [
  { q: 'Is lubrication recommended?', a: 'Yes, a water-based lubricant can improve comfort and help the device glide smoothly.' },
  { q: 'Is it suitable for beginners?', a: 'Yes, the adjustable settings make it beginner-friendly and easy to start at a gentle level.' },
  { q: 'Is the size comfortable for beginners?', a: 'Yes, the smooth, ergonomic shape is designed for comfort and easy positioning.' },
  { q: 'Can couples use this together?', a: 'Yes, it can be used privately during shared wellness routines or relaxation time with a partner.' },
  { q: 'Can I control suction and vibration separately?', a: 'The stimulation modes can be adjusted independently for a more personalized experience.' },
  { q: 'Is the material body-safe?', a: "Yes, it's made from medical-grade silicone designed for comfortable pelvic floor use." },
  { q: 'Is it quiet during use?', a: 'Yes, the motor is designed to stay low-noise for private and discreet use.' },
  { q: 'What types of stimulation does it provide?', a: 'It provides multi-zone biomechanical stimulation designed to activate deep pelvic floor muscles.' },
  { q: 'How do I clean it?', a: 'Wash with warm water and mild soap, then dry thoroughly before storing.' },
  { q: 'How many modes are included?', a: 'It includes multiple intensity levels and four independent motor zones for tailored training.' },
  { q: 'Is the device waterproof?', a: 'Yes, it is IPX7 waterproof and easy to clean after each use.' },
];

const PDP_THUMBS = ['assets/pdp-1.png', 'assets/pdp-2.jpg', 'assets/pdp-3.jpg', 'assets/pdp-4.jpg'];
const VARIANT_NAMES = {
  essential: 'Essential 4-in-1 Activator',
  pro: 'Pro · Integrated Lubrication',
  libido: 'Libido Reset · 60 capsules',
};
const BUNDLE_NAMES = { b1: 'Buy 1', b2: 'Buy 2', b3: 'Buy 3', b4: 'Buy 4' };
const FREE_SHIP_AT = 100;

const state = {
  variant: 'pro',
  bundle: 'b2',
  bundlePrice: 107.90,
  bundleWas: 323.70,
  qty: 1,
  thumb: 0,
  cart: [],
};

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const fmt = (n) => '$' + Number(n).toFixed(2);

/* ── ANNOUNCEMENT & TICKER ── */
function buildAnnounce() {
  const track = $('#announce-track');
  const loop = [...ANNOUNCE_ITEMS, ...ANNOUNCE_ITEMS, ...ANNOUNCE_ITEMS];
  track.innerHTML = loop.map(t => `<span><span class="dot"></span>${t}</span>`).join('');
}
function buildTicker() {
  const inner = $('#ticker-inner');
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS];
  inner.innerHTML = loop.map(t => `<span class="ticker-item"><span class="dot"></span>${t}</span>`).join('');
}

/* ── COMPARISON ── */
function buildCompare() {
  const table = $('#compare-table');
  const cell = (v) => v === true
    ? '<svg class="check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
    : v === false
      ? '<svg class="cross" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
      : '<span class="partial">Some</span>';
  const html = COMPARE_ROWS.map(r => `
    <div class="compare-row">
      <div>${r.f}</div>
      <div class="velura-col"><div class="compare-cell">${cell(r.velura)}</div></div>
      <div><div class="compare-cell">${cell(r.others)}</div></div>
    </div>`).join('');
  table.insertAdjacentHTML('beforeend', html);
}

/* ── REVIEWS ── */
function buildReviews() {
  const grid = $('#reviews-grid');
  const stars = (n) => '<span class="stars">' + '★'.repeat(n) + '</span>';
  grid.innerHTML = REVIEWS.map(r => `
    <article class="review">
      ${stars(r.n)}
      <h4>${r.h}</h4>
      <p>"${r.body}"</p>
      <div class="who">
        <div class="avatar"></div>
        <div class="who-info">
          <div class="name">${r.name}</div>
          <div class="meta">${r.meta}</div>
        </div>
      </div>
    </article>`).join('');
}

/* ── FAQ ── */
function buildFAQ() {
  const list = $('#faq-list');
  list.innerHTML = FAQ_ITEMS.map((it, i) => `
    <div class="faq-item${i === 0 ? ' open' : ''}" data-faq="${i}">
      <button class="faq-q" type="button" aria-expanded="${i === 0 ? 'true' : 'false'}">
        <span>${it.q}</span>
        <span class="plus" aria-hidden="true">+</span>
      </button>
      <div class="faq-a"><p>${it.a}</p></div>
    </div>`).join('');
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    $$('.faq-item', list).forEach(el => {
      el.classList.remove('open');
      const q = el.querySelector('.faq-q');
      if (q) q.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
}

/* ── GALLERY ── */
function wireGallery() {
  const main = $('#gallery-main');
  const img = $('#gallery-img');
  $('#gallery-thumbs').addEventListener('click', (e) => {
    const t = e.target.closest('.thumb');
    if (!t) return;
    const i = Number(t.dataset.thumb);
    state.thumb = i;
    img.src = PDP_THUMBS[i];
    $$('#gallery-thumbs .thumb').forEach(el => el.classList.toggle('active', el === t));
    $('#lightbox-img').src = PDP_THUMBS[i];
  });
  main.addEventListener('click', () => openLightbox());
}

/* ── VARIANTS / BUNDLES / QTY ── */
function wireVariants() {
  $('#variants').addEventListener('click', (e) => {
    const btn = e.target.closest('.variant');
    if (!btn) return;
    state.variant = btn.dataset.variant;
    $$('#variants .variant').forEach(el => el.classList.toggle('selected', el === btn));
    $('#variant-label-selected').textContent = btn.dataset.name;
  });

  $('#bundles').addEventListener('click', (e) => {
    const btn = e.target.closest('.bundle');
    if (!btn) return;
    state.bundle = btn.dataset.bundle;
    state.bundlePrice = parseFloat(btn.dataset.price);
    state.bundleWas = parseFloat(btn.dataset.was);
    $$('#bundles .bundle').forEach(el => el.classList.toggle('selected', el === btn));
    refreshPrice();
  });

  $('#qty-minus').addEventListener('click', () => {
    state.qty = Math.max(1, state.qty - 1);
    $('#qty-value').textContent = state.qty;
    refreshPrice();
  });
  $('#qty-plus').addEventListener('click', () => {
    state.qty = state.qty + 1;
    $('#qty-value').textContent = state.qty;
    refreshPrice();
  });
}

function refreshPrice() {
  const total = state.bundlePrice * state.qty;
  $('#pdp-price').textContent = fmt(state.bundlePrice);
  $('#pdp-was').textContent = fmt(state.bundleWas);
  $('#atc-total').textContent = fmt(total);
}

/* ── CART ── */
function openCart()  { $('#cart-overlay').classList.add('open'); $('#cart-drawer').classList.add('open'); $('#cart-drawer').setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
function closeCart() { $('#cart-overlay').classList.remove('open'); $('#cart-drawer').classList.remove('open'); $('#cart-drawer').setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }

function addToCart() {
  const it = {
    variant: state.variant,
    bundle: state.bundle,
    qty: state.qty,
    price: state.bundlePrice,
  };
  const idx = state.cart.findIndex(p => p.variant === it.variant && p.bundle === it.bundle);
  if (idx >= 0) {
    state.cart[idx] = { ...state.cart[idx], qty: state.cart[idx].qty + it.qty };
  } else {
    state.cart.push(it);
  }
  renderCart();
  openCart();
}

function renderCart() {
  const body = $('#cart-body');
  const foot = $('#cart-foot');
  const items = state.cart;

  if (items.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <span class="serif">Your cart is empty.</span>
        <span>Continue shopping below.</span>
      </div>`;
    foot.style.display = 'none';
    return;
  }

  body.innerHTML = items.map((it, i) => `
    <div class="cart-item" data-idx="${i}">
      <div class="cart-item-img"></div>
      <div class="cart-item-info">
        <div class="name">Velura · ${VARIANT_NAMES[it.variant] || it.variant}</div>
        <div class="v">${BUNDLE_NAMES[it.bundle] || it.bundle}</div>
        <div class="qty">
          <button data-act="minus" data-idx="${i}" aria-label="Decrease">−</button>
          <span>${it.qty}</span>
          <button data-act="plus" data-idx="${i}" aria-label="Increase">+</button>
        </div>
      </div>
      <div class="cart-item-price">
        <div class="p">${fmt(it.price * it.qty)}</div>
        <button class="rm" data-act="remove" data-idx="${i}">Remove</button>
      </div>
    </div>`).join('');

  const total = items.reduce((s, it) => s + it.price * it.qty, 0);
  const remaining = Math.max(0, FREE_SHIP_AT - total);
  const pct = Math.min(100, (total / FREE_SHIP_AT) * 100);
  $('#cart-progress-text').innerHTML = remaining > 0
    ? `You're <strong>${fmt(remaining)}</strong> from free express shipping`
    : 'Free express shipping unlocked ✓';
  $('#cart-progress-fill').style.width = pct + '%';
  $('#cart-total').textContent = fmt(total);
  $('#cart-checkout-price').textContent = fmt(total);
  foot.style.display = '';
}

function wireCart() {
  $('#cart-overlay').addEventListener('click', closeCart);
  $('#cart-close').addEventListener('click', closeCart);
  $('#atc-btn').addEventListener('click', addToCart);

  $('#cart-body').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const i = Number(btn.dataset.idx);
    const act = btn.dataset.act;
    if (act === 'minus') state.cart[i].qty = Math.max(1, state.cart[i].qty - 1);
    if (act === 'plus')  state.cart[i].qty = state.cart[i].qty + 1;
    if (act === 'remove') state.cart.splice(i, 1);
    renderCart();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeCart(); closeLightbox(); }
  });
}

/* ── LIGHTBOX ── */
function openLightbox()  { $('#lightbox').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeLightbox() { $('#lightbox').classList.remove('open'); document.body.style.overflow = ''; }

function wireLightbox() {
  $('#lightbox').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeLightbox(); });
  $('#lightbox-close').addEventListener('click', closeLightbox);
}

/* ── MISC ── */
function wireGuaranteeCta() {
  const btn = $('#guarantee-shop');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const el = $('#product');
    if (el) window.scrollTo({ top: el.offsetTop - 24, behavior: 'smooth' });
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  buildAnnounce();
  buildTicker();
  buildCompare();
  buildReviews();
  buildFAQ();
  wireGallery();
  wireVariants();
  wireCart();
  wireLightbox();
  wireGuaranteeCta();
  refreshPrice();
});
