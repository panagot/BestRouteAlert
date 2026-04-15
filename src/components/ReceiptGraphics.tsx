import type { RouteHop } from '../types/receipt'

/** Horizontal milestone strip — quote → route → settle (decorative). */
export function ExecutionTrail() {
  return (
    <div className="exec-trail">
      <svg className="exec-trail__svg" viewBox="0 0 520 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="exec-trail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path
          d="M 40 32 H 236 Q 260 32 260 32 H 480"
          stroke="url(#exec-trail-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6 10"
          opacity="0.9"
        />
        <circle cx="40" cy="32" r="14" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
        <path
          d="M33.5 32.5 37 36l9-11"
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="260" cy="32" r="14" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="2" />
        <circle cx="255" cy="32" r="2.8" fill="#6d28d9" />
        <circle cx="265" cy="32" r="2.8" fill="#6d28d9" />
        <path d="M257.8 32h4.4" stroke="#6d28d9" strokeWidth="2" strokeLinecap="round" />
        <circle cx="480" cy="32" r="14" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
        <path
          d="M473.5 32.5 477 36l9-11"
          stroke="#047857"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      <ol className="exec-trail__labels" aria-label="Execution milestones">
        <li>Quotes captured</li>
        <li>Route locked in</li>
        <li>Settled on-chain</li>
      </ol>
    </div>
  )
}

/** Vertical bar chart of per-leg impact (bps). */
export function HopImpactChart({ hops }: { hops: RouteHop[] }) {
  if (!hops.length) return null
  const max = Math.max(...hops.map((h) => h.impactBps), 1)

  return (
    <div className="hop-chart" aria-label="Impact in basis points per leg">
      <div className="hop-chart__head">
        <span className="hop-chart__title">Impact by leg</span>
        <span className="hop-chart__unit">basis points</span>
      </div>
      <div className="hop-chart__plot">
        {hops.map((h) => {
          const hPct = (h.impactBps / max) * 100
          const legLabel = `Leg ${h.step}, ${h.impactBps} basis points`
          return (
            <div key={h.step} className="hop-chart__col" aria-label={legLabel}>
              <div className="hop-chart__bar-wrap">
                <div
                  className={`hop-chart__bar hop-chart__bar--${h.step % 2 === 1 ? 'a' : 'b'}`}
                  style={{ height: `${Math.max(22, hPct)}%` }}
                  title={`${h.impactBps} bps`}
                  role="presentation"
                />
              </div>
              <span className="hop-chart__bps tabular mono">{h.impactBps}</span>
              <span className="hop-chart__leg">Leg {h.step}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** VS orb between quote cards. */
export function QuoteVsBadge() {
  return (
    <div className="quote-vs" aria-hidden>
      <span className="quote-vs__ring" />
      <span className="quote-vs__text">VS</span>
    </div>
  )
}

/** Subtle animated sparkles when savings cross a threshold (decorative). */
export function SavingsSparkles({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="savings-sparkles" aria-hidden>
      <span className="savings-sparkles__p savings-sparkles__p--1" />
      <span className="savings-sparkles__p savings-sparkles__p--2" />
      <span className="savings-sparkles__p savings-sparkles__p--3" />
      <span className="savings-sparkles__p savings-sparkles__p--4" />
    </div>
  )
}

/** Large faded watermark inside the receipt. */
export function ReceiptWatermark() {
  return (
    <div className="receipt-watermark" aria-hidden>
      <svg viewBox="0 0 140 140" fill="none">
        <rect x="24" y="20" width="92" height="100" rx="8" stroke="currentColor" strokeWidth="1.2" opacity="0.07" />
        <path
          d="M36 44h68M36 58h52M36 72h60M36 86h40"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.07"
        />
        <circle cx="70" cy="112" r="14" stroke="currentColor" strokeWidth="1.2" opacity="0.06" />
      </svg>
    </div>
  )
}

/** Small chain-link motif for the document chrome area. */
export function ChainLinkMotif() {
  return (
    <div className="chain-motif" aria-hidden>
      <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          opacity="0.2"
          d="M8 20c0-4 3-8 8-8h12M92 20c0 4-3 8-8 8H72M32 12c-4 0-8 3-8 8v0c0 5 4 8 8 8h8M88 28c4 0 8-3 8-8v0c0-5-4-8-8-8h-8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle opacity="0.15" cx="60" cy="20" r="6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
