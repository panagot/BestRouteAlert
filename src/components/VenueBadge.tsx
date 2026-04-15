import type { VenueKind } from '../types/receipt'

const labels: Record<VenueKind, string> = {
  amm: 'AMM',
  rfq: 'RFQ',
}

export function VenueBadge({ kind }: { kind: VenueKind }) {
  return (
    <span
      className={`venue-tag venue-tag--${kind}`}
      title={kind === 'rfq' ? 'Request-for-quote / solver path' : 'Automated market maker'}
    >
      <span className="venue-tag__dot" aria-hidden />
      {labels[kind]}
    </span>
  )
}
