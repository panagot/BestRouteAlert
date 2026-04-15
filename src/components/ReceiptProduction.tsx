import type { RouteReceipt } from '../types/receipt'
import { formatReceiptDate } from '../utils/receiptDisplay'

function IconWallet() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2.5" y="5" width="15" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 9h15" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="13.5" cy="12" r="1.2" fill="currentColor" />
    </svg>
  )
}

function IconBlock() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 7l6-3 6 3v6l-6 3-6-3V7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M4 7l6 3 6-3M10 10v6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function IconGas() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M5 17V6a2 2 0 012-2h4a2 2 0 012 2v6h1a2 2 0 002-2V9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M5 17h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconSlippage() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 14L10 4l6 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 11h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconReferral() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="14" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 12l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 6.2V10l3.2 2.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconLightbulb() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path
        d="M11 3a5 5 0 015 5c0 2-1.5 3.5-2 5H8c-.5-1.5-2-3-2-5a5 5 0 015-5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M8 16h6M9 19h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconLockProof() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="5" y="10" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 10V7a3 3 0 016 0v3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="11" cy="14.5" r="1.2" fill="currentColor" />
    </svg>
  )
}

export function TransactionFactsGrid({ receipt }: { receipt: RouteReceipt }) {
  const slip =
    receipt.slippageBps != null ? `${(receipt.slippageBps / 100).toFixed(2)}% max` : '—'
  const gas =
    receipt.totalGas != null
      ? `${receipt.totalGas.amount} ${receipt.totalGas.symbol}`
      : '—'
  const referral = receipt.referralFeeNote ?? '—'

  const cells = [
    {
      icon: <IconWallet />,
      label: 'Wallet',
      value: receipt.userAddressTruncated ?? '—',
      hint: receipt.walletLabel,
    },
    {
      icon: <IconBlock />,
      label: 'Block',
      value:
        receipt.blockHeight != null ? `#${receipt.blockHeight.toLocaleString('en-US')}` : '—',
      hint: 'TON mainnet height',
    },
    {
      icon: <IconClock />,
      label: 'Settled',
      value: formatReceiptDate(receipt.createdAtIso),
      hint: 'Mock inclusion time (UTC)',
    },
    {
      icon: <IconSlippage />,
      label: 'Slippage',
      value: slip,
      hint: 'Max price deviation you allowed',
    },
    {
      icon: <IconGas />,
      label: 'Network fee',
      value: gas,
      hint: 'Paid with native TON for this tx',
    },
    {
      icon: <IconReferral />,
      label: 'Fees',
      value: referral,
      hint: 'Referral / integrator',
    },
  ]

  return (
    <section className="tx-facts" aria-label="Settlement snapshot">
      <div className="tx-facts__banner">
        <svg className="tx-facts__ton" viewBox="0 0 56 24" fill="none" aria-hidden>
          <ellipse cx="28" cy="12" rx="26" ry="10" stroke="currentColor" strokeWidth="1.2" opacity="0.25" />
          <text
            x="28"
            y="15"
            textAnchor="middle"
            fill="currentColor"
            fontSize="9"
            fontWeight="700"
            opacity="0.45"
            fontFamily="system-ui, sans-serif"
          >
            TON
          </text>
        </svg>
        <h2 className="tx-facts__title">Settlement snapshot</h2>
      </div>
      <div className="tx-facts__grid">
        {cells.map((c) => (
          <div key={c.label} className="tx-facts__cell">
            <span className="tx-facts__icon" aria-hidden>
              {c.icon}
            </span>
            <span className="tx-facts__label">{c.label}</span>
            <span className="tx-facts__value mono tabular">{c.value}</span>
            {c.hint && <span className="tx-facts__hint">{c.hint}</span>}
          </div>
        ))}
      </div>
    </section>
  )
}

export function OmnistonHighlightCard({ receipt }: { receipt: RouteReceipt }) {
  const n = receipt.liquiditySourcesCompared ?? 7
  const pct = receipt.savingsVsBestSingleVenueBps / 100
  const rfqWon = receipt.comparison.winner === 'rfq'
  const sym = receipt.received.symbol

  return (
    <section className="omni-highlight" aria-labelledby="omni-highlight-heading">
      <h2 id="omni-highlight-heading" className="omni-highlight__title">
        What Omniston did on this swap
      </h2>
      <ul className="omni-highlight__list">
        <li>
          <strong>{n} liquidity sources</strong> (AMM pools + RFQ solvers) were evaluated for this size; Omniston
          composed the net-winning package into <strong>one</strong> settlement on TON.
        </li>
        <li>
          You kept about <strong>+{pct.toFixed(2)}% more {sym}</strong> after fees vs the reference baseline —{' '}
          <strong>real-time competition</strong> between venues, not a single-pool shortcut.
        </li>
        <li>
          <strong>{rfqWon ? 'RFQ vs AMM:' : 'AMM-only win:'}</strong>{' '}
          {rfqWon
            ? 'a solver quote tightened at least one leg versus what visible pool liquidity alone would have given.'
            : 'chained AMM depth still beat the shallow “direct pair” baseline Omniston simulated for transparency.'}
        </li>
      </ul>
    </section>
  )
}

export function WhyRouteWon({ text }: { text?: string }) {
  if (!text) return null
  return (
    <section className="why-route" aria-labelledby="why-route-heading">
      <div className="why-route__icon-wrap" aria-hidden>
        <IconLightbulb />
      </div>
      <div className="why-route__body">
        <h2 id="why-route-heading" className="why-route__title">
          Why this path won
        </h2>
        <p className="why-route__text">{text}</p>
      </div>
    </section>
  )
}

export function ProofAttestation({ placeholder }: { placeholder?: string }) {
  if (!placeholder) return null
  return (
    <section className="proof-box" aria-label="Attestation placeholder">
      <div className="proof-box__head">
        <span className="proof-box__icon" aria-hidden>
          <IconLockProof />
        </span>
        <h2 className="proof-box__title">Verifiable receipt (roadmap)</h2>
      </div>
      <p className="proof-box__desc">
        Later: hash the quote bundle + tx outcome, optionally sign with your attestation service or wallet, so
        third parties can verify this screen against raw data — a compliance-friendly complement to explorer links.
        Below is a stand-in string only.
      </p>
      <code className="proof-box__code mono">{placeholder}</code>
    </section>
  )
}
