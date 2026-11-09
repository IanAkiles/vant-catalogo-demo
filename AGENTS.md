# Prototype Instructions

Mobile category strip: show small blue chevrons for both directions when categories are offscreen. Each scrolls the category strip on tap and disappears at its respective edge. Keep it separate from the top menu chevron beside the bag.

2026-11-08 follow-up: Owner panel now lives on `/admin` (also accept `/admin/`) and must not be linked or rendered inside the customer storefront. Keep two columns on mobile, with portrait 3:4 product frames. A small blue chevron next to the mobile bag opens additional navigation; it is not a scroll hint. Admin remains explicitly a local demo until real authentication and shared persistence are implemented. These instructions supersede the earlier admin deferral.

2026-11-08: Improve storefront interactions using CLASS, SUFGANG and Down as behavioral references while preserving the approved composition. Production admin is explicitly deferred. Keep motion subtle, respect reduced-motion preferences and make quick sizes available on touch and keyboard. Current product images have one view only: label magnification as zoom, never as a different product angle.

VANT direction: centered original logo, electric blue interface icons, cream base, no blue promotional banner. Catalog-first page, four desktop columns and two mobile columns. Preserve this scope during revisions. This is a demo, with browser-local admin data and no production credentials or automatic WhatsApp sending.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
