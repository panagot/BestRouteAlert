# OmniReceipt (prototype)

UI prototype for **post-trade transparency** on **TON**: after an **Omniston-style** swap, users see a **best-route receipt** — settlement snapshot, path, savings vs baseline, legs, and share/copy actions.

**Scope:** static **React + Vite** app with **mock** receipts only (no live Omniston SDK, signing, or storage). Includes **three preview surfaces**: full **web** disclosure doc, **wallet** sheet layout, and **Telegram** mini-app style (each is a different UI, not just a frame).

## Run locally

```bash
cd omni-receipt
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `npm run dev`  | Vite dev server                      |
| `npm run build`| Typecheck + production build → `dist` |
| `npm run preview` | Serve `dist` locally |
| `npm run lint` | ESLint                               |
| `npm run typecheck` | TypeScript only (`tsc -b`) |

## Shareable preview URL

The address bar stays in sync with the UI (via `history.replaceState`). Query params:

- **`sample`** — mock receipt id: `rfq` or `amm` (matches sidebar samples).
- **`surface`** — `web`, `wallet`, or `telegram`.

Example: `https://yoursite.example/?sample=amm&surface=wallet`

## Deploy on Vercel

1. Push this folder to a **GitHub** repository (root of the repo can be `omni-receipt` or the monorepo root — if the app lives in a subfolder, set **Root Directory** in Vercel to `omni-receipt`).
2. In [Vercel](https://vercel.com): **Add New Project** → import the repo. Vercel detects **Vite**; leave defaults (`npm run build`, output `dist`).
3. Deploy. Optional: set a production URL in `index.html` for `og:url` / `twitter:url` if you want link previews to point at the live site.

`vercel.json` includes a SPA-style rewrite so paths like `/r/...` resolve to the app (placeholder share URLs in the demo).

## What to try

1. **Preview surface:** Switch **Web** / **Wallet** / **Telegram** above the receipt.
2. **Samples:** Use the sidebar or **Alt+1** / **Alt+2** to switch mock scenarios.
3. **Receipt:** Copy link / plain text; open explorer (demo links); print (sidebar hidden, receipt-focused).
4. **Deep link:** Open with `?sample=…&surface=…` (see above); refresh keeps the same scenario via session storage if params are omitted.

## Product intent

- **Users:** Understand *what* traded and *why* the route looked that way.
- **Integrators:** Reuse a consistent disclosure layout for support and trust.
- **Grants / partners:** Demonstrate Omniston-class routing transparency without raw explorer UIs.

## Tech stack

React 19, Vite 8, TypeScript. Fonts: Plus Jakarta Sans, JetBrains Mono (Google Fonts).
