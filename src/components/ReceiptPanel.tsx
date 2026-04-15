import { Fragment, useEffect, useState } from 'react'
import type { RouteReceipt } from '../types/receipt'
import { useMediaQuery } from '../hooks/useMediaQuery'
import {
  OmnistonHighlightCard,
  ProofAttestation,
  TransactionFactsGrid,
  WhyRouteWon,
} from './ReceiptProduction'
import { buildReceiptTextSummary } from '../utils/receiptTextSummary'
import {
  ChainLinkMotif,
  ExecutionTrail,
  HopImpactChart,
  QuoteVsBadge,
  ReceiptWatermark,
  SavingsSparkles,
} from './ReceiptGraphics'
import { InsightStrip } from './InsightStrip'
import { VerifiableRoadmapCallout } from './VerifiableRoadmapCallout'
import { RouteFlowVisual } from './RouteFlowVisual'
import { SavingsComparisonVisual } from './SavingsComparisonVisual'
import { SwapHero } from './SwapHero'
import { VenueBadge } from './VenueBadge'
import { formatReceiptDate } from '../utils/receiptDisplay'

const DETAIL_STORAGE_KEY = 'omnireceipt-detail-level'

function readStoredDetailLevel(): 'simple' | 'detailed' {
  try {
    const raw = sessionStorage.getItem(DETAIL_STORAGE_KEY)
    if (raw === 'simple' || raw === 'detailed') return raw
  } catch {
    /* ignore */
  }
  return 'simple'
}

function LegsTable({
  receipt,
  showGasCol,
}: {
  receipt: RouteReceipt
  showGasCol: boolean
}) {
  const colCount = 5 + (showGasCol ? 1 : 0)
  const [openStep, setOpenStep] = useState<number | null>(null)

  useEffect(() => {
    setOpenStep(null)
  }, [receipt.id])

  return (
    <div className="table-scroll">
      <p className="legs-table__interact-hint">Click a row to expand mock quote detail (latency, role, notes).</p>
      <table className="legs-table">
        <thead>
          <tr>
            <th scope="col" className="legs-table__col-num">
              #
            </th>
            <th scope="col">Movement</th>
            <th scope="col">Venue</th>
            <th scope="col">Mechanism</th>
            {showGasCol && <th scope="col">Est. gas</th>}
            <th scope="col" className="legs-table__col-num">
              Impact
            </th>
          </tr>
        </thead>
        <tbody>
          {receipt.hops.map((h) => {
            const expanded = openStep === h.step
            const hasDetail =
              Boolean(h.legNote || h.legRole || h.quoteLatencyMs != null || h.legGasNative)
            return (
              <Fragment key={h.step}>
                <tr
                  className={`legs-table__data-row ${expanded ? 'legs-table__data-row--open' : ''} ${hasDetail ? 'legs-table__data-row--interactive' : ''}`}
                  onClick={() => hasDetail && setOpenStep((s) => (s === h.step ? null : h.step))}
                  onKeyDown={(e) => {
                    if (!hasDetail) return
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setOpenStep((s) => (s === h.step ? null : h.step))
                    }
                  }}
                  tabIndex={hasDetail ? 0 : undefined}
                  aria-expanded={hasDetail ? expanded : undefined}
                  aria-label={hasDetail ? `Leg ${h.step}, ${expanded ? 'expanded' : 'collapsed'}` : undefined}
                >
                  <th scope="row" className="mono tabular legs-table__muted legs-table__rowhead">
                    <span className="legs-table__step-wrap">
                      {hasDetail && (
                        <span className="legs-table__chev" aria-hidden>
                          {expanded ? '\u25bc' : '\u25b6'}
                        </span>
                      )}
                      {h.step}
                    </span>
                  </th>
                  <td>
                    <div className="legs-flow">
                      <span className="mono tabular">{h.fromAmount}</span>
                      <span className="legs-flow__sym">{h.fromSymbol}</span>
                      <span className="legs-flow__arrow" aria-hidden>
                        →
                      </span>
                      <span className="mono tabular">{h.toAmount}</span>
                      <span className="legs-flow__sym">{h.toSymbol}</span>
                    </div>
                  </td>
                  <td className="legs-table__venue">{h.venueName}</td>
                  <td>
                    <VenueBadge kind={h.venueKind} />
                  </td>
                  {showGasCol && (
                    <td className="mono tabular legs-table__gas">{h.legGasNative ?? '—'}</td>
                  )}
                  <td className="mono tabular legs-table__num">{h.impactBps} bps</td>
                </tr>
                {expanded && hasDetail && (
                  <tr className="legs-table__expand" aria-live="polite">
                    <td colSpan={colCount} className="legs-table__expand-cell">
                      {h.legRole && <p className="legs-table__expand-line">{h.legRole}</p>}
                      {h.quoteLatencyMs != null && (
                        <p className="legs-table__expand-meta mono tabular">
                          Mock quote latency: {(h.quoteLatencyMs / 1000).toFixed(2)}s
                        </p>
                      )}
                      {h.legGasNative && (
                        <p className="legs-table__expand-meta mono tabular">Est. gas: {h.legGasNative}</p>
                      )}
                      {h.legNote && <p className="legs-table__expand-note">{h.legNote}</p>}
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function ReceiptPanel({
  receipt,
  previewShareUrl,
  sampleMeta,
  activeSampleKey,
  onSampleChange,
}: {
  receipt: RouteReceipt
  previewShareUrl: string
  sampleMeta: { key: string; label: string }[]
  activeSampleKey: string
  onSampleChange: (key: string) => void
}) {
  const shareUrl = previewShareUrl
  const pct = receipt.savingsVsBestSingleVenueBps / 100
  const celebrate = receipt.savingsVsBestSingleVenueBps >= 28
  const legsWide = useMediaQuery('(min-width: 721px)')
  const showGasCol = receipt.hops.some((h) => h.legGasNative)
  const [detailLevel, setDetailLevel] = useState<'simple' | 'detailed'>(readStoredDetailLevel)
  const metaLen = sampleMeta.length
  const idx = Math.max(0, sampleMeta.findIndex((s) => s.key === activeSampleKey))
  const prevMeta = metaLen > 0 ? sampleMeta[(idx - 1 + metaLen) % metaLen]! : null
  const nextMeta = metaLen > 0 ? sampleMeta[(idx + 1) % metaLen]! : null

  const setDetail = (d: 'simple' | 'detailed') => {
    setDetailLevel(d)
    try {
      sessionStorage.setItem(DETAIL_STORAGE_KEY, d)
    } catch {
      /* ignore */
    }
  }

  type CopyFeedback =
    | null
    | { target: 'link' | 'summary'; status: 'success' }
    | { target: 'link' | 'summary'; status: 'error' }
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback>(null)

  useEffect(() => {
    setCopyFeedback(null)
  }, [receipt.id])

  useEffect(() => {
    if (!copyFeedback) return
    const ms = copyFeedback.status === 'error' ? 4500 : 2000
    const t = window.setTimeout(() => setCopyFeedback(null), ms)
    return () => window.clearTimeout(t)
  }, [copyFeedback])

  const copySummary = async () => {
    const text = buildReceiptTextSummary(receipt, shareUrl)
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable')
      await navigator.clipboard.writeText(text)
      setCopyFeedback({ target: 'summary', status: 'success' })
    } catch {
      setCopyFeedback({ target: 'summary', status: 'error' })
    }
  }

  const copyShareLink = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable')
      await navigator.clipboard.writeText(shareUrl)
      setCopyFeedback({ target: 'link', status: 'success' })
    } catch {
      setCopyFeedback({ target: 'link', status: 'error' })
    }
  }

  return (
    <article
      className={`receipt-doc ${celebrate ? 'receipt-doc--celebrate' : ''} receipt-doc--${detailLevel}`}
      aria-labelledby="receipt-title"
    >
      <header className="receipt-doc__chrome">
        <div className="receipt-doc__chrome-left">
          <a
            href="https://ton.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="receipt-doc__chrome-tonlink"
            aria-label="TON — The Open Network (opens in new tab)"
          >
            <span className="receipt-doc__chrome-mark" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img">
                <path
                  fill="#4DB8FF"
                  d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM7.902 6.697h8.196c1.505 0 2.462 1.628 1.705 2.94l-5.059 8.765a.86.86 0 0 1-1.488 0L6.199 9.637c-.758-1.314.197-2.94 1.703-2.94zm4.844 1.496v7.58l1.102-2.128 2.656-4.756a.465.465 0 0 0-.408-.696h-3.35zM7.9 8.195a.464.464 0 0 0-.408.694l2.658 4.754 1.102 2.13V8.195H7.9z"
                />
              </svg>
            </span>
          </a>
          <span className="receipt-doc__issuer">Omniston aggregation</span>
          <span className="receipt-doc__chrome-sep" aria-hidden>
            ·
          </span>
          <span className="receipt-doc__doc-type">Best-route receipt · Omniston on TON</span>
        </div>
        <div className="receipt-doc__chrome-right">
          <ChainLinkMotif />
          <span
            className="receipt-doc__trust-badge"
            title="Production: tie to signed quote bundle + explorer tx. Illustrative only in this prototype."
          >
            Omniston routing (demo)
          </span>
          <span className="receipt-doc__status" title="Demo only — not a live settlement flag">
            <span className="receipt-doc__status-dot" aria-hidden />
            Settled
          </span>
        </div>
      </header>

      <div className="receipt-doc__body">
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {copyFeedback?.status === 'success' && copyFeedback.target === 'link' && 'Share link copied.'}
          {copyFeedback?.status === 'success' && copyFeedback.target === 'summary' && 'Plain text summary copied.'}
          {copyFeedback?.status === 'error' && copyFeedback.target === 'link' && 'Could not copy link. Select the URL or use your browser copy command.'}
          {copyFeedback?.status === 'error' && copyFeedback.target === 'summary' && 'Could not copy summary. Try again or copy sections manually.'}
        </p>
        <ReceiptWatermark />
        <div className="receipt-doc__main">
          <div className="receipt-doc__controls">
            {metaLen > 1 && prevMeta && nextMeta && (
              <nav className="receipt-scenario" aria-label="Switch sample scenario">
                <button
                  type="button"
                  className="receipt-scenario__btn"
                  onClick={() => onSampleChange(prevMeta.key)}
                  aria-label={`Previous scenario: ${prevMeta.label}`}
                >
                  <span aria-hidden>←</span> Prev
                </button>
                <span className="receipt-scenario__mid tabular" aria-current="step">
                  {idx + 1} / {metaLen}
                </span>
                <span className="receipt-scenario__current">{sampleMeta[idx]?.label}</span>
                <button
                  type="button"
                  className="receipt-scenario__btn"
                  onClick={() => onSampleChange(nextMeta.key)}
                  aria-label={`Next scenario: ${nextMeta.label}`}
                >
                  Next <span aria-hidden>→</span>
                </button>
              </nav>
            )}
            <div className="receipt-doc__density" role="group" aria-label="Receipt detail level">
              <button
                type="button"
                className={`receipt-doc__density-btn ${detailLevel === 'simple' ? 'receipt-doc__density-btn--active' : ''}`}
                aria-pressed={detailLevel === 'simple'}
                onClick={() => setDetail('simple')}
              >
                Simple view
              </button>
              <button
                type="button"
                className={`receipt-doc__density-btn ${detailLevel === 'detailed' ? 'receipt-doc__density-btn--active' : ''}`}
                aria-pressed={detailLevel === 'detailed'}
                onClick={() => setDetail('detailed')}
              >
                Detailed view
              </button>
            </div>
          </div>

          <InsightStrip receipt={receipt} />

          <div className="receipt-doc__hero-wrap">
            <SavingsSparkles active={celebrate} />
            <header className="receipt-doc__hero">
              <div className="receipt-doc__hero-text">
                <p className="receipt-doc__eyebrow">Post-trade disclosure</p>
                <h1 id="receipt-title" className="receipt-doc__title receipt-doc__title--pair">
                  <span className="receipt-doc__pair-from">{receipt.spent.symbol}</span>
                  <span className="receipt-doc__pair-arrow" aria-hidden>
                    →
                  </span>
                  <span className="receipt-doc__pair-to">{receipt.received.symbol}</span>
                </h1>
                <ul className="receipt-doc__chips" aria-label="Receipt metadata">
                  <li className="receipt-doc__chip">{receipt.network}</li>
                  <li className="receipt-doc__chip tabular">{formatReceiptDate(receipt.createdAtIso)}</li>
                  <li className="receipt-doc__chip mono tabular">#{receipt.shortId}</li>
                  <li
                    className="receipt-doc__chip receipt-doc__chip--savings tabular"
                    title="Estimated improvement vs the baseline described in the quote comparison"
                  >
                    +{pct.toFixed(2)}% vs baseline
                  </li>
                  <li
                    className={`receipt-doc__chip receipt-doc__chip--route receipt-doc__chip--route--${receipt.comparison.winner}`}
                    title="Dominant execution style for this swap"
                  >
                    {receipt.comparison.winner === 'rfq' ? 'RFQ in route' : 'AMM-only route'}
                  </li>
                </ul>
              </div>
              <SwapHero spent={receipt.spent} received={receipt.received} />
            </header>
          </div>

        <p className="receipt-doc__intro">
          <span className="receipt-doc__intro-icon" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 3.5h12a1 1 0 011 1v11l-2.5-2H4a1 1 0 01-1-1v-8a1 1 0 011-1z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path d="M6 7h8M6 10h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
          <span className="receipt-doc__intro-copy">
            Everything below is a <strong>static mock</strong> shaped like a production receipt.{' '}
            <strong>TON</strong> means <strong>The Open Network</strong> — not the Tron blockchain. Omniston-style
            routing compares venues and solvers; this layout is how that story could look after settlement.{' '}
            <strong>Independent UI exploration</strong> — not an official STON.fi or Omniston product.
          </span>
        </p>

        <div className="receipt-doc__detail-only">
          <OmnistonHighlightCard receipt={receipt} />
        </div>

        <TransactionFactsGrid receipt={receipt} />

        <div className="receipt-doc__detail-only">
          <ExecutionTrail />
        </div>

        <div className="receipt-doc__viz-grid" aria-label="Route diagram and savings">
          <RouteFlowVisual receipt={receipt} />
          <div className="receipt-doc__viz-stack">
            <div className="receipt-doc__savings-wrap">
              <SavingsComparisonVisual
                savingsBps={receipt.savingsVsBestSingleVenueBps}
                outSymbol={receipt.received.symbol}
                liquiditySourcesCompared={receipt.liquiditySourcesCompared}
                edgeBps={receipt.comparison.edgeBps}
                winnerIsRfq={receipt.comparison.winner === 'rfq'}
              />
            </div>
            <div className="receipt-doc__metric-strip">
              <div className="metric-pill" title="Implied cross after this execution (incl. route costs in mock)">
                <span className="metric-pill__label">All-in rate</span>
                <span className="metric-pill__value">{receipt.effectiveRate}</span>
              </div>
              <div
                className="metric-pill metric-pill--accent"
                title="Versus the baseline scenario shown in the comparison cards"
              >
                <span className="metric-pill__label">Vs. baseline</span>
                <span className="metric-pill__value tabular">+{pct.toFixed(2)}%</span>
              </div>
              <div className="metric-pill" title="How the winning path is categorized for this receipt">
                <span className="metric-pill__label">Winning style</span>
                <span className="metric-pill__value metric-pill__value--row">
                  <VenueBadge kind={receipt.comparison.winner} />
                  {receipt.comparison.winnerLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="receipt-doc__detail-only">
          <HopImpactChart hops={receipt.hops} />
        </div>

        <WhyRouteWon text={receipt.whyRouteWon} />

        <p className="receipt-doc__callout">{receipt.summaryLine}</p>

        <p className="receipt-doc__simple-hint receipt-doc__simple-only">
          <button type="button" className="receipt-doc__inline-action" onClick={() => setDetail('detailed')}>
            Open detailed view
          </button>{' '}
          for the full legs table, baseline comparison cards, attestation placeholder, and embed story.
        </p>

        <div className="receipt-doc__detail-only">
          <section className="receipt-doc__section" aria-label="Quote comparison">
          <h2 className="receipt-doc__section-title">Executed path vs. reference</h2>
          <p className="receipt-doc__section-lead">
            Omniston’s job is to <strong>aggregate and compete</strong> liquidity (RFQ solvers + AMM books). The{' '}
            <strong>executed</strong> card is what you got; the <strong>baseline</strong> is a deliberate simpler path
            so “savings” is explainable in support and reviews — not a magic number.
          </p>
          <div className="quote-pair quote-pair--with-vs">
            <div className="quote-pair__card quote-pair__card--primary">
              <span className="quote-pair__label">Executed</span>
              <p className="quote-pair__name">{receipt.comparison.winnerLabel}</p>
              <p className="quote-pair__delta tabular">
                +{(receipt.comparison.edgeBps / 100).toFixed(2)}% vs. baseline
              </p>
              {receipt.baselineOutputAmount && (
                <p className="quote-pair__baseline">
                  Baseline would deliver ~{' '}
                  <span className="mono tabular">{receipt.baselineOutputAmount}</span>
                </p>
              )}
            </div>
            <QuoteVsBadge />
            <div className="quote-pair__card">
              <span className="quote-pair__label">Baseline (reference)</span>
              <p className="quote-pair__name">{receipt.comparison.runnerUpLabel}</p>
              <p className="quote-pair__note">
                Not a worse trade you took — a counterfactual for transparency and support tickets.
              </p>
            </div>
          </div>
          </section>

        {legsWide ? (
          <section className="receipt-doc__section receipt-doc__section--flush" aria-label="Leg details">
            <div className="receipt-doc__section-head">
              <h2 className="receipt-doc__section-title">Liquidity legs</h2>
              <p className="receipt-doc__section-sub">Each hop: tokens moved, venue, mechanism, estimated gas, impact</p>
            </div>
            <LegsTable receipt={receipt} showGasCol={showGasCol} />
          </section>
        ) : (
          <details className="receipt-doc__legs-details" open>
            <summary className="receipt-doc__legs-summary">
              <span className="receipt-doc__legs-summary-title">Liquidity legs</span>
              <span className="receipt-doc__legs-summary-hint mono tabular">
                {receipt.hops.length} hop{receipt.hops.length !== 1 ? 's' : ''}
              </span>
            </summary>
            <LegsTable receipt={receipt} showGasCol={showGasCol} />
          </details>
        )}

        <ProofAttestation placeholder={receipt.signedReceiptPlaceholder} />

        </div>

        <VerifiableRoadmapCallout />

        <div className="receipt-doc__detail-only">
          <section className="receipt-doc__embed" aria-label="Integration story for wallets">
          <h2 className="receipt-doc__embed-title">Embeddable in wallets &amp; mini-apps</h2>
          <p className="receipt-doc__embed-lead">
            B2B angle: the same disclosure can mount beside activity history or inside Telegram WebView — no separate
            explorer tab for users.
          </p>
          <pre className="receipt-doc__embed-code mono">
            {`<OmniReceiptDisclosure
  receiptId="${receipt.id}"
  surface="sheet"
  theme="ton"
/>`}
          </pre>
          <p className="receipt-doc__embed-note">
            Fictitious component — illustrates how partners could embed Omniston transparency (grant / roadmap story).
          </p>
          </section>
        </div>

        <footer className="receipt-doc__footer">
          <div className="receipt-doc__footer-block">
            <h2 className="receipt-doc__footer-label">Chain reference</h2>
            <code className="receipt-doc__hash mono">{receipt.txHash}</code>
            {receipt.explorerTxUrl ? (
              <a
                className="btn-secondary btn-secondary--external"
                href={receipt.explorerTxUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in explorer
                <span className="sr-only"> (opens in new tab)</span>
                <svg className="btn-external-icon" width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <path
                    d="M10 8v3a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h3M6 8h5V3M6 8l5-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ) : (
              <p className="receipt-doc__fineprint">Explorer link not set for this demo row.</p>
            )}
          </div>
          <div className="receipt-doc__footer-block">
            <h2 className="receipt-doc__footer-label">Share this receipt</h2>
            <div className="receipt-doc__copy-row">
              <code className="receipt-doc__url mono" title={shareUrl}>
                {shareUrl}
              </code>
              <button
                type="button"
                className="btn-primary"
                onClick={() => void copyShareLink()}
                aria-label={`Copy share link for receipt ${receipt.shortId}`}
              >
                {copyFeedback?.target === 'link' && copyFeedback.status === 'success' ? 'Copied' : 'Copy link'}
              </button>
            </div>
            {copyFeedback?.target === 'link' && copyFeedback.status === 'error' && (
              <p className="receipt-doc__copy-hint receipt-doc__copy-hint--error" role="status">
                Clipboard blocked or unavailable — select the URL above and copy manually.
              </p>
            )}
            <div className="receipt-doc__footer-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => void copySummary()}
                aria-label={`Copy plain text summary for receipt ${receipt.shortId}`}
              >
                {copyFeedback?.target === 'summary' && copyFeedback.status === 'success'
                  ? 'Copied'
                  : 'Copy as plain text'}
              </button>
            </div>
            {copyFeedback?.target === 'summary' && copyFeedback.status === 'error' && (
              <p className="receipt-doc__copy-hint receipt-doc__copy-hint--error" role="status">
                Clipboard blocked or unavailable — try selecting text in the receipt or another browser.
              </p>
            )}
            <p className="receipt-doc__fineprint receipt-doc__simple-only">
              Copy the link above to reopen this exact sample and surface (<span className="mono">sample</span> +{' '}
              <span className="mono">surface</span> query params). Static mock — not live settlement data.
            </p>
            <p className="receipt-doc__fineprint receipt-doc__detail-only">
              In production, this URL would resolve to stored quote metadata and settlement proof. For this demo, the
              link uses query params so reviewers reopen the same scenario and preview mode. Receipt id{' '}
              <span className="mono">{receipt.id}</span> · short #{receipt.shortId}.
            </p>
          </div>
        </footer>
        </div>
      </div>
    </article>
  )
}
