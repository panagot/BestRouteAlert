import { useId } from 'react'
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
  const logoGradId = useId().replace(/[^a-zA-Z0-9_-]/g, '') || 'sidebarLogo'

  return (
    <aside className="app-sidebar" aria-label="OmniReceipt navigation">
      <header className="app-sidebar__masthead">
        <div className="app-sidebar__logo" aria-hidden>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect width="26" height="26" rx="8" fill={`url(#${logoGradId})`} />
            <path
              d="M8 9h10M8 13h7M8 17h9"
              stroke="white"
              strokeOpacity="0.95"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id={logoGradId} x1="4" y1="3" x2="22" y2="23" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
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
        <p className="app-sidebar__kbd-hint">
          <kbd className="app-sidebar__kbd">Alt</kbd>
          <span className="app-sidebar__kbd-plus">+</span>
          <kbd className="app-sidebar__kbd">1</kbd>
          <span className="app-sidebar__kbd-slash">/</span>
          <kbd className="app-sidebar__kbd">2</kbd>
          <span className="app-sidebar__kbd-desc">switch</span>
        </p>
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
