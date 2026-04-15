export function VerifiableRoadmapCallout() {
  return (
    <aside className="verify-roadmap" aria-label="Roadmap for verifiable receipts">
      <div className="verify-roadmap__icon" aria-hidden>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M11 4.5l6.5 3.75v7.5L11 19.5l-6.5-3.75v-7.5L11 4.5z"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinejoin="round"
          />
          <path d="M11 8.2v5.6M8.2 11h5.6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
        </svg>
      </div>
      <div className="verify-roadmap__body">
        <h2 className="verify-roadmap__title">Next: verifiable receipts</h2>
        <p className="verify-roadmap__text">
          Production could anchor quote bundles and settlement to a <strong>signed digest</strong> (wallet or relayer),
          with an optional <strong>explorer deep link</strong> and hash pinning — so support teams and power users can
          trust the same story the UI tells. This demo uses static mocks only.
        </p>
      </div>
    </aside>
  )
}
