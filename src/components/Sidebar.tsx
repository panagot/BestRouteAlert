import { EXAMPLES } from '../data/examples'

function IconRfq() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path
        d="M5 7.5h8M5 11h5M5 14.5h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect x="3" y="4" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M15.5 8.5 18 11l-2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconAmm() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="7" cy="11" r="3.25" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="15" cy="11" r="3.25" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.2 11h1.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg className="app-sidebar__check-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <path
        d="M3.8 7.2 6.1 9.5 10.2 4.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const SCENARIO_ICONS = {
  rfq: IconRfq,
  amm: IconAmm,
} as const

const HIGHLIGHTS = [
  'Venue-by-venue path (AMM vs RFQ)',
  'Savings vs a simpler baseline',
  'Settlement, fees, explorer in one place',
] as const

export function Sidebar({
  activeKey,
  onSelect,
}: {
  activeKey: string
  onSelect: (key: string) => void
}) {
  return (
    <aside className="app-sidebar" aria-label="OmniReceipt navigation">
      <header className="app-sidebar__masthead">
        <a
          href="https://ton.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="app-sidebar__tonlink"
          aria-label="TON — The Open Network (opens in new tab)"
        >
          <span className="app-sidebar__logo" aria-hidden>
            <svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img">
              <path
                fill="#4DB8FF"
                d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM7.902 6.697h8.196c1.505 0 2.462 1.628 1.705 2.94l-5.059 8.765a.86.86 0 0 1-1.488 0L6.199 9.637c-.758-1.314.197-2.94 1.703-2.94zm4.844 1.496v7.58l1.102-2.128 2.656-4.756a.465.465 0 0 0-.408-.696h-3.35zM7.9 8.195a.464.464 0 0 0-.408.694l2.658 4.754 1.102 2.13V8.195H7.9z"
              />
            </svg>
          </span>
        </a>
        <div className="app-sidebar__masthead-text">
          <h1 className="app-sidebar__product">OmniReceipt</h1>
          <p className="app-sidebar__product-sub">Best-route transparency for TON swaps</p>
        </div>
        <span className="app-sidebar__pill">UI prototype</span>
      </header>

      <p className="app-sidebar__tagline">
        One readable receipt after an Omniston-style swap — <span className="app-sidebar__tagline-note">mock data here</span>.
      </p>

      <nav className="app-sidebar__nav" aria-label="Sample receipts">
        <h2 className="app-sidebar__section-title">Samples</h2>
        {EXAMPLES.length > 1 && (
          <p className="app-sidebar__kbd-hint">
            <kbd className="app-sidebar__kbd">Alt</kbd>
            <span className="app-sidebar__kbd-plus">+</span>
            {EXAMPLES.slice(0, 9).map((ex, i) => (
              <span key={ex.key}>
                {i > 0 && <span className="app-sidebar__kbd-slash">/</span>}
                <kbd className="app-sidebar__kbd">{i + 1}</kbd>
              </span>
            ))}
            <span className="app-sidebar__kbd-desc">switch</span>
          </p>
        )}
        <ul className="app-sidebar__cards" role="list">
          {EXAMPLES.map((ex) => {
            const active = activeKey === ex.key
            const Icon = SCENARIO_ICONS[ex.key as keyof typeof SCENARIO_ICONS] ?? IconRfq
            return (
              <li key={ex.key}>
                <button
                  type="button"
                  className={`app-sidebar__card ${active ? 'app-sidebar__card--active' : ''}`}
                  onClick={() => onSelect(ex.key)}
                  aria-pressed={active}
                >
                  <span className="app-sidebar__card-icon" aria-hidden>
                    <Icon />
                  </span>
                  <span className="app-sidebar__card-main">
                    <span className="app-sidebar__card-title">{ex.label}</span>
                    <span className="app-sidebar__card-desc">{ex.description}</span>
                  </span>
                  <span className="app-sidebar__card-tick" aria-hidden>
                    {active && (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="8" fill="currentColor" opacity="0.12" />
                        <path
                          d="M5.2 9.1 7.6 11.5 12.8 6.3"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <details className="app-sidebar__details">
        <summary className="app-sidebar__details-summary">
          <span>More context & flow</span>
        </summary>
        <div className="app-sidebar__details-body">
          <p className="app-sidebar__details-lede">
            Omniston finds the route; OmniReceipt explains it — for users, support, and partners, without raw explorer
            screens.
          </p>
          <p className="app-sidebar__details-embeds" aria-label="Typical surfaces">
            Wallets · mini-apps · support · disclosure
          </p>

          <section className="app-sidebar__highlights" aria-labelledby="sidebar-highlights-heading">
            <h3 id="sidebar-highlights-heading" className="app-sidebar__details-subhead">
              On each receipt
            </h3>
            <ul className="app-sidebar__checklist">
              {HIGHLIGHTS.map((line) => (
                <li key={line} className="app-sidebar__checklist-item">
                  <IconCheck />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="app-sidebar__pipeline" aria-labelledby="sidebar-pipeline-heading">
            <h3 id="sidebar-pipeline-heading" className="app-sidebar__details-subhead">
              How it fits
            </h3>
            <ol className="app-sidebar__steps app-sidebar__steps--four">
              <li className="app-sidebar__step">
                <span className="app-sidebar__step-dot" aria-hidden />
                <div className="app-sidebar__step-body">
                  <span className="app-sidebar__step-name">Swap</span>
                  <span className="app-sidebar__step-detail">User signs once (wallet or mini-app).</span>
                </div>
              </li>
              <li className="app-sidebar__step">
                <span className="app-sidebar__step-dot" aria-hidden />
                <div className="app-sidebar__step-body">
                  <span className="app-sidebar__step-name">Discover</span>
                  <span className="app-sidebar__step-detail">AMM + RFQ composed; best net outcome wins.</span>
                </div>
              </li>
              <li className="app-sidebar__step">
                <span className="app-sidebar__step-dot" aria-hidden />
                <div className="app-sidebar__step-body">
                  <span className="app-sidebar__step-name">Receipt</span>
                  <span className="app-sidebar__step-detail">Quote, venues, and settlement in this layout.</span>
                </div>
              </li>
              <li className="app-sidebar__step">
                <span className="app-sidebar__step-dot app-sidebar__step-dot--end" aria-hidden />
                <div className="app-sidebar__step-body">
                  <span className="app-sidebar__step-name">Share</span>
                  <span className="app-sidebar__step-detail">Link or copy — same story every time.</span>
                </div>
              </li>
            </ol>
          </section>

          <p className="app-sidebar__scope app-sidebar__scope--in-details">
            <strong>Scope:</strong> static UI only — no live Omniston SDK, signing, or storage in this repo.
          </p>
        </div>
      </details>

      <footer className="app-sidebar__disclaimer">
        <p>Educational prototype (Omniston-style on TON). Not an official STON.fi product.</p>
      </footer>
    </aside>
  )
}
