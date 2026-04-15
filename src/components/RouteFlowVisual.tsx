import { useEffect, useId, useState } from 'react'
import type { RouteReceipt } from '../types/receipt'
import { TokenGlyph } from './TokenGlyph'
import { VenueBadge } from './VenueBadge'

export function RouteFlowVisual({ receipt }: { receipt: RouteReceipt }) {
  const hops = receipt.hops
  const gradId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [openStep, setOpenStep] = useState<number | null>(null)

  useEffect(() => {
    setOpenStep(null)
  }, [receipt.id])

  if (!hops.length) return null

  return (
    <div className="route-visual" aria-label="Route flow diagram">
      <div className="route-visual__header">
        <span className="route-visual__title">Aggregated path</span>
        <span className="route-visual__hint">
          {hops.length} venue{hops.length !== 1 ? 's' : ''} composed by Omniston · one user-facing swap on TON · tap a
          leg for mock quote detail
        </span>
      </div>
      <div className="route-visual__row">
        <div className="route-visual__node">
          <TokenGlyph symbol={hops[0].fromSymbol} size="lg" />
          <span className="route-visual__sym">{hops[0].fromSymbol}</span>
        </div>
        {hops.map((h) => {
          const gid = `${gradId}_s${h.step}`
          const isRfq = h.venueKind === 'rfq'
          return (
          <div key={h.step} className="route-visual__segment-inline">
            <div className={`route-visual__connector route-visual__connector--${h.venueKind}`}>
              <svg
                className="route-visual__svg"
                viewBox="0 0 140 56"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden
              >
                <defs>
                  <linearGradient
                    id={gid}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                    gradientUnits="objectBoundingBox"
                  >
                    {isRfq ? (
                      <>
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.75" />
                        <stop offset="50%" stopColor="#6366f1" stopOpacity="0.65" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.7" />
                      </>
                    ) : (
                      <>
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.7" />
                        <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0.55" />
                      </>
                    )}
                  </linearGradient>
                </defs>
                <line
                  x1="4"
                  y1="28"
                  x2="118"
                  y2="28"
                  stroke={`url(#${gid})`}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="4 9"
                  opacity="0.9"
                />
                <polygon points="132,28 116,20 116,36" fill={`url(#${gid})`} opacity="0.92" />
              </svg>
              <button
                type="button"
                className={`route-visual__chip route-visual__chip--btn route-visual__chip--${h.venueKind}`}
                aria-expanded={openStep === h.step}
                aria-controls={`route-leg-panel-${h.step}`}
                id={`route-leg-chip-${h.step}`}
                onClick={() => setOpenStep((s) => (s === h.step ? null : h.step))}
              >
                <span className="route-visual__impact tabular" title="Estimated price impact this leg">
                  {h.impactBps} bps
                </span>
                <VenueBadge kind={h.venueKind} />
                <span className="route-visual__venue-name">{h.venueName}</span>
              </button>
              {openStep === h.step && (
                <div
                  className="route-visual__leg-panel"
                  id={`route-leg-panel-${h.step}`}
                  role="region"
                  aria-labelledby={`route-leg-chip-${h.step}`}
                >
                  {h.legRole && <p className="route-visual__leg-panel-line">{h.legRole}</p>}
                  {h.quoteLatencyMs != null && (
                    <p className="route-visual__leg-panel-meta mono tabular">
                      Mock quote latency: {(h.quoteLatencyMs / 1000).toFixed(2)}s
                    </p>
                  )}
                  {h.legGasNative && (
                    <p className="route-visual__leg-panel-meta mono tabular">Est. gas this leg: {h.legGasNative}</p>
                  )}
                  {h.legNote && <p className="route-visual__leg-panel-note">{h.legNote}</p>}
                </div>
              )}
            </div>
            <div className="route-visual__node">
              <TokenGlyph symbol={h.toSymbol} size="lg" />
              <span className="route-visual__sym">{h.toSymbol}</span>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}
