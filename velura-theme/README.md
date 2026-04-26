# Velura Bloom — Shopify Theme

Online Store 2.0 theme that ports the Velura homepage design to Liquid sections with merchant-editable schema.

## Install

Two options:

1. **Theme editor (zip upload)** — zip the contents of `velura-theme/` (not the folder itself), then in Shopify admin: Online Store → Themes → Add theme → Upload zip file. Customize.
2. **Shopify CLI (recommended for development)**:
   ```sh
   cd velura-theme
   shopify theme dev --store=YOUR_STORE.myshopify.com
   ```
   Push when ready: `shopify theme push --unpublished`.

## Structure

- `layout/theme.liquid` — master layout, loads `header-group` + `footer-group` + cart drawer + lightbox.
- `templates/index.json` — homepage; references all `velura-*` sections in order.
- `sections/velura-*.liquid` — each homepage block (hero, ticker, multi-zone, how-it-works, product-block, comparison, reviews, guarantee, faq) with `{% schema %}` for theme editor controls (text, images, blocks, links).
- `sections/header.liquid`, `sections/footer.liquid`, `sections/announcement-bar.liquid` — global chrome (grouped via `header-group.json` / `footer-group.json`).
- `snippets/cart-drawer.liquid`, `snippets/lightbox.liquid`, `snippets/icon.liquid` — shared markup.
- `assets/theme.css`, `assets/theme.js` — design system styles + AJAX cart, FAQ, gallery, lightbox, variant/bundle pickers.
- `templates/product.liquid`, `collection.liquid`, `cart.liquid`, `page.liquid`, `blog.liquid`, `article.liquid`, `search.liquid`, `list-collections.liquid`, `404.liquid`, `gift_card.liquid`, `customers/*.liquid` — minimal but functional non-homepage templates.
- `config/settings_schema.json`, `config/settings_data.json` — global theme settings (palette, free-ship threshold).
- `locales/en.default.json` — translation strings.

## Connecting the product block to a real product

Open the homepage in the theme editor → click the **Velura · Product block** section → set **Product**. Variants/price/images flow from there. Bundle blocks pass `quantity` to `/cart/add.js` (so a "Buy 2" bundle adds 2 of the selected variant).

## Cart

The cart drawer uses Shopify's AJAX API:
- `POST /cart/add.js` on Add-to-cart.
- `POST /cart/change.js` for quantity updates / removal.
- `GET /cart.js` to refresh state.

The drawer opens automatically after a successful add. Free-shipping progress is driven by `settings.free_ship_threshold_cents`.

## Design tokens (Velura Bloom)

- Background: `#ffffff` / cream `#fdf5f3` / warm `#fbeae6`
- Ink: `#2a0a14` / soft `#5c2530`
- Accent: `#cc7183` / deep `#940b28` / soft `#f8dfdb`
- Display: Cormorant Garamond
- Body: Manrope
