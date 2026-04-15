import { useId } from 'react'
import type { RouteReceipt } from '../types/receipt'
import { TokenGlyph } from './TokenGlyph'
import { VenueBadge } from './VenueBadge'

export function RouteFlowVisual({ receipt }: { receipt: RouteReceipt }) {
  const hops = receipt.hops
  const gradId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  if (!hops.length) return null

  return (
    <div className="route-visual" aria-label="Route flow diagram">
      <div className="route-visual__header">
        <span className="route-visual__title">Aggregated path</span>
        <span className="route-visual__hint">
          {hops.length} venue{hops.length !== 1 ? 's' : ''} · one user-facing swap operation
        </span>
      </div>
      <div className="route-visual__row">
        <div className="route-visual__node">
          <TokenGlyph symbol={hops[0].fromSymbol} size="lg" />
          <span className="route-visual__sym">{hops[0].fromSymbol}</span>
        </div>
        {hops.map((h) => {
          const gid = `${gradId}_s${h.step}`
          return (
          <div key={h.step} className="route-visual__segment-inline">
            <div className="route-visual__connector">
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
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.65" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.55" />
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
              <div className="route-visual__chip">
                <VenueBadge kind={h.venueKind} />
                <span className="route-visual__venue-name">{h.venueName}</span>
              </div>
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
