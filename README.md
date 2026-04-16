# Best Route Alert

**Best Route Alert** is a **TON** prototype for **route-edge monitoring**: poll quoted swap outcomes on tracked pairs, compare them to a **conservative baseline**, and publish **structured alerts** to **X**, **Telegram**, and a **builder API** (plus a mock route-quality board on this site).

**Live demo:** [best-route-alert.vercel.app](https://best-route-alert.vercel.app/)

**What this repo is:** a **static React + Vite** marketing/UI demo (mock data, prototype form, sample X card, sample JSON). No live quote polling, posting, or backend.

## Run locally

```bash
cd bestroutealert
npm install
npm run dev
```

If your checkout folder is named differently (e.g. `omni-receipt`), `cd` into that directory instead.

Then open the URL Vite prints (usually `http://localhost:5173`).

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Vite dev server          |
| `npm run build`   | Typecheck + `dist` build |
| `npm run preview` | Serve `dist` locally     |
| `npm run lint`    | ESLint                   |
| `npm run typecheck` | TypeScript only        |

## Deploy (Vercel)

Import this repo (or connect GitHub), framework **Vite**, and set the project root to this app folder if the repo is a monorepo. Production URL: **https://best-route-alert.vercel.app/**

When you own a domain later, add it in the Vercel project and update `index.html` canonical/OG image URLs to match.

## Disclaimer

Alerts are **informational quote snapshots**, not execution guarantees or financial advice.
