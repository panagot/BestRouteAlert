# Best Route Alert

**Best Route Alert** is a **TON** prototype for **route-edge monitoring**: poll quoted swap outcomes on tracked pairs, compare them to a **conservative baseline**, and publish **structured alerts** to **X**, **Telegram**, and a **builder API** (plus a mock route-quality board on this site).

**Intended domain:** [bestroutealert.com](https://bestroutealert.com/) (configure DNS → your host when ready).

**What this repo is:** a **static React + Vite** marketing/UI demo (mock data, prototype form, sample X card, sample JSON). No live quote polling, posting, or backend.

## Run locally

```bash
cd bestroutealert
npm install
npm run dev
```

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

Import this repo (or connect the GitHub repo), framework **Vite**, root directory **`bestroutealert`** if the monorepo lives above it—or set the project root to this folder. Add the custom domain **bestroutealert.com** in Vercel and point DNS per Vercel’s instructions.

## Disclaimer

Alerts are **informational quote snapshots**, not execution guarantees or financial advice.
