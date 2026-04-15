import type { RouteReceipt } from '../types/receipt'

export function InsightStrip({ receipt }: { receipt: RouteReceipt }) {
  const pct = receipt.savingsVsBestSingleVenueBps / 100
  const sources = receipt.liquiditySourcesCompared ?? '—'
  const hops = receipt.hops.length
  const winShort =
    receipt.comparison.winner === 'rfq'
      ? 'RFQ / solver edge'
      : 'AMM composition'

  return (
    <section className="insight-strip" aria-label="Key outcomes at a glance">
      <div className="insight-strip__tile insight-strip__tile--sources">
        <span className="insight-strip__kicker">Sources checked</span>
        <span className="insight-strip__value tabular">{sources}</span>
        <span className="insight-strip__hint">mock · Omniston-style scan</span>
      </div>
      <div className="insight-strip__tile insight-strip__tile--savings">
        <span className="insight-strip__kicker">Vs baseline</span>
        <span className="insight-strip__value tabular">+{pct.toFixed(2)}%</span>
        <span className="insight-strip__hint">
          +{receipt.comparison.edgeBps} bps · {receipt.received.symbol}
        </span>
      </div>
      <div className="insight-strip__tile insight-strip__tile--win">
        <span className="insight-strip__kicker">Why it won</span>
        <span className="insight-strip__value insight-strip__value--sm">{winShort}</span>
        <span className="insight-strip__hint">{receipt.comparison.winnerLabel}</span>
      </div>
      <div className="insight-strip__tile insight-strip__tile--hops">
        <span className="insight-strip__kicker">Venue hops</span>
        <span className="insight-strip__value tabular">{hops}</span>
        <span className="insight-strip__hint">composed as one swap</span>
      </div>
    </section>
  )
}
