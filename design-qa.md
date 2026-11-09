# VANT demo — visual and interaction review

## Latest revision: separate owner page and portrait cards — 2026-11-08

- Storefront `/` contains no owner panel or admin link. `/admin` and `/admin/` load a separate lazy component with existing product management, counts and a storefront link. This is route separation, not authentication.
- Shared artwork uses an absolute asset URL, verified from `/admin/`.
- Approved clarification: two columns on phones, portrait 3:4 frames, and a small chevron next to the bag that opens Loja/Coleções/Sobre. Square mockup photos remain centered inside the frame so garments are not cropped or stretched.
- Browser checks passed: create/edit/hide/delete a disposable product; persistence on reload; changes reflected in the other storefront tab; no admin link on storefront; menu toggle and About action; two columns and portrait dimensions; logo/actions do not overlap at 320/390 px; no horizontal overflow or page errors.
- Regression checks passed: hover, quick size, gallery zoom, message with M/quantity 2/R$ 318,00, search, categories, keyboard and reduced motion.
- Visually inspected `../vant-demo-review/admin-desktop.png`, `admin-mobile-320.png` and `mobile-menu-390.png`. Mobile panel screenshot now waits for lazy-loaded content, not the loading fallback.
- Build passed; seven prior tests and two new storage tests passed. The storage tests cover denied storage and an intentionally empty catalog.
- Limits: local browser data only, no authentication or server authorization. No real WhatsApp send or multi-device persistence was tested or implemented. Portrait margins can be removed once original portrait photography is available.

Latest revision final result: passed

Visual source: latest approved mock shown in the conversation: centered logo, cream background, blue interface icons, no blue promotional band, four-column catalog and editorial. Local artwork source: `public/assets/vant-reference.png` (1487 × 1058), with the requested header and banner changes implemented in CSS/layout.

Implementation: http://127.0.0.1:4173/, reviewed through the in-app browser at 1487 × 1058 and 390 × 844 CSS pixels, plus default narrow sidebar viewport. Screenshot evidence is inline in the task conversation, not saved as a repository image. This is a visual review, not a pixel-difference certification.

## Findings and fixes

- Initial editorial crop exposed product-price text from the source sheet. Fixed by retaining the full editorial source region and using its actual aspect ratio.
- Mobile category scrollbar distracted from navigation. Hidden the scrollbar while preserving horizontal scrolling and keyboard focus.
- Mobile editorial reflows into photo plus separate readable copy; desktop preserves the source's baked-in editorial typography.
- Centered logo, cream palette, four desktop/two mobile product columns, and blue header icons verified.

## Interactions tested in browser

- Category filter: Moletons shows the hoodie only.
- Search: gorro shows the beanie only; clearing restores catalog.
- Product: prepare action disabled until size selected.
- Order: size M, color Creme, quantity 2 yields R$ 318,00 and the selected product URL.
- No WhatsApp recipient configured by default; no message sent.
- Admin: create sample, change price, hide sample, reload and verify persistence, delete disposable sample with confirmation.
- No console errors recorded during final review.

## Limits / follow-up polish

- Generated product artwork is illustration for the demo. Replace with client-supplied photography before production.
- Font rasterization and source image crops are not a pixel-perfect reconstruction certification.
- Real WhatsApp handoff, real auth, shared storage, production security and upload workflows are outside this demo's verified scope.
- Admin is visibly marked as local-only and unauthenticated. Never deploy it as the production admin.

final result: passed

## Storefront interaction revision — 2026-11-08

Approved composition retained: centered logo, cream base, blue icons, no blue banner, four desktop/two mobile columns, existing editorial.

Reference evidence:
- CLASS (https://classofficial.com.br/): public rendered stylesheet includes secondary-image opacity transitions, a 1.03 image zoom and card actions revealed on hover. Product cards expose sizes. Adapted as restrained photo zoom and quick size selection, without copying brand assets.
- SUFGANG (https://sufgang.com.br/): public stylesheet includes quick-add reveal, image zoom variants and reduced-motion handling. Adapted as subtle card/dialog transitions and reduced-motion support. Stylesheet capabilities are not proof every optional effect is active.
- Down (https://www.downjacquards.com.br/shop/): directly opened catalog in Chrome, with clear product grid, categories and size filters. Initial web-text result returned a password page; browser access subsequently succeeded. Cross-origin stylesheet fetch returned HTTP errors, so no exact animation/timing claim is made for Down. Retained the product-first hierarchy and accessible size discovery.

Browser verification: isolated Chrome, desktop 1487 × 1058 and touch/mobile 390 × 844. Screenshots saved alongside this repository in `../vant-demo-review/`: desktop.png, desktop-hover.png, detail.png, mobile.png, mobile-detail.png. Desktop hover, zoomed detail and full mobile captures inspected visually. No main-page horizontal overflow on mobile.

Passed: hover zoom and size reveal; quick M selection retained; gallery zoom toggle; quantity 2 gives R$ 318,00 in message; Escape; category filtering; search; keyboard quick selection; reduced motion disables animation/transitions; touch selection G; no browser page errors. Build and seven existing automated tests passed.

Fixed during verification: competing CSS selector suppressed hover zoom. Test selectors were narrowed to exact size labels rather than substring matches in color labels.

Limits: no new admin work, backend, payment or real WhatsApp delivery; pre-existing local demo panel remains unchanged. Gallery zoom enlarges the same low-resolution mockup crop, not a second photograph. Replace with original client photography before production. No public hosting deployed in this revision.

final result: passed
