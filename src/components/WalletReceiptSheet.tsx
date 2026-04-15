import { useEffect, useState } from 'react'
import type { RouteReceipt } from '../types/receipt'
import { formatReceiptDate } from '../utils/receiptDisplay'
import { buildReceiptTextSummary } from '../utils/receiptTextSummary'
import { buildReceiptShareUrl } from '../utils/shareUrl'
import { TokenGlyph } from './TokenGlyph'
import { VenueBadge } from './VenueBadge'

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="wallet-recv__row">
      <span className="wallet-recv__row-label">{label}</span>
      <span className={`wallet-recv__row-value ${mono ? 'mono tabular' : ''}`}>{value}</span>
    </div>
  )
}

export function WalletReceiptSheet({
  receipt,
  shareBaseUrl,
}: {
  receipt: RouteReceipt
  shareBaseUrl: string
}) {
  const shareUrl = buildReceiptShareUrl(shareBaseUrl, receipt.id)
  const pct = receipt.savingsVsBestSingleVenueBps / 100
  const slip =
    receipt.slippageBps != null ? `${(receipt.slippageBps / 100).toFixed(2)}%` : '—'
  const gas =
    receipt.totalGas != null ? `${receipt.totalGas.amount} ${receipt.totalGas.symbol}` : '—'
  const [copyLabel, setCopyLabel] = useState<null | 'link' | 'summary'>(null)
  const [copyError, setCopyError] = useState<string | null>(null)

  useEffect(() => {
    if (!copyLabel) return
    const t = window.setTimeout(() => setCopyLabel(null), 1800)
    return () => window.clearTimeout(t)
  }, [copyLabel])

  useEffect(() => {
    if (!copyError) return
    const t = window.setTimeout(() => setCopyError(null), 4500)
    return () => window.clearTimeout(t)
  }, [copyError])

  const copyLink = async () => {
    setCopyError(null)
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable')
      await navigator.clipboard.writeText(shareUrl)
      setCopyLabel('link')
    } catch {
      setCopyLabel(null)
      setCopyError('Could not copy link — try the web receipt or another browser.')
    }
  }

  const copySummary = async () => {
    setCopyError(null)
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable')
      await navigator.clipboard.writeText(buildReceiptTextSummary(receipt, shareUrl))
      setCopyLabel('summary')
    } catch {
      setCopyLabel(null)
      setCopyError('Could not copy summary — clipboard blocked or unavailable.')
    }
  }

  return (
    <div className="wallet-recv">
      <header className="wallet-recv__status">
        <span className="wallet-recv__pill wallet-recv__pill--ok">Swap completed</span>
        <span className="wallet-recv__network">{receipt.network}</span>
      </header>

      <section className="wallet-recv__hero-card" aria-label="Swap amounts">
        <div className="wallet-recv__hero-pair">
          <div className="wallet-recv__hero-side">
            <TokenGlyph symbol={receipt.spent.symbol} size="md" />
            <div>
              <span className="wallet-recv__hero-label">Sent</span>
              <span className="wallet-recv__hero-amt mono tabular">{receipt.spent.amount}</span>
              <span className="wallet-recv__hero-sym">{receipt.spent.symbol}</span>
            </div>
          </div>
          <span className="wallet-recv__hero-arrow" aria-hidden>
            →
          </span>
          <div className="wallet-recv__hero-side">
            <TokenGlyph symbol={receipt.received.symbol} size="md" />
            <div>
              <span className="wallet-recv__hero-label">Received</span>
              <span className="wallet-recv__hero-amt mono tabular">{receipt.received.amount}</span>
              <span className="wallet-recv__hero-sym">{receipt.received.symbol}</span>
            </div>
          </div>
        </div>
        <p className="wallet-recv__rate mono">{receipt.effectiveRate}</p>
        <div className="wallet-recv__chips">
          <span className="wallet-recv__chip wallet-recv__chip--gain tabular">+{pct.toFixed(2)}% vs baseline</span>
          <span className="wallet-recv__chip">{receipt.comparison.winnerLabel}</span>
        </div>
      </section>

      <section className="wallet-recv__group" aria-label="Transaction">
        <h2 className="wallet-recv__group-title">Transaction</h2>
        <div className="wallet-recv__inset">
          <Row label="Date" value={formatReceiptDate(receipt.createdAtIso)} />
          <Row label="Reference" value={`#${receipt.shortId}`} mono />
          <Row label="Tx hash" value={receipt.txHash} mono />
          {receipt.userAddressTruncated && (
            <Row label="Wallet" value={`${receipt.userAddressTruncated}${receipt.walletLabel ? ` · ${receipt.walletLabel}` : ''}`} />
          )}
        </div>
      </section>

      <section className="wallet-recv__group" aria-label="Costs and limits">
        <h2 className="wallet-recv__group-title">Costs & limits</h2>
        <div className="wallet-recv__inset">
          {receipt.blockHeight != null && (
            <Row label="Block" value={`#${receipt.blockHeight.toLocaleString('en-US')}`} mono />
          )}
          <Row label="Max slippage" value={slip} />
          <Row label="Network fee" value={gas} mono />
          <Row label="Other fees" value={receipt.referralFeeNote ?? '—'} />
        </div>
      </section>

      <details className="wallet-recv__disclosure">
        <summary className="wallet-recv__disclosure-sum">
          <span>Route</span>
          <span className="wallet-recv__disclosure-meta tabular">{receipt.hops.length} hops</span>
        </summary>
        <ol className="wallet-recv__route-list">
          {receipt.hops.map((h) => (
            <li key={h.step} className="wallet-recv__route-step">
              <span className="wallet-recv__route-step-num tabular">{h.step}</span>
              <div className="wallet-recv__route-step-body">
                <span className="wallet-recv__route-venue">{h.venueName}</span>
                <span className="wallet-recv__route-move mono tabular">
                  {h.fromAmount} {h.fromSymbol} → {h.toAmount} {h.toSymbol}
                </span>
                <span className="wallet-recv__route-meta">
                  <VenueBadge kind={h.venueKind} />
                  <span className="tabular">{h.impactBps} bps</span>
                  {h.legGasNative && <span className="mono tabular">{h.legGasNative}</span>}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </details>

      {receipt.whyRouteWon && (
        <details className="wallet-recv__disclosure">
          <summary className="wallet-recv__disclosure-sum">
            <span>Why this route</span>
          </summary>
          <p className="wallet-recv__prose">{receipt.whyRouteWon}</p>
        </details>
      )}

      <details className="wallet-recv__disclosure">
        <summary className="wallet-recv__disclosure-sum">
          <span>Compared to baseline</span>
        </summary>
        <div className="wallet-recv__inset wallet-recv__inset--flush">
          <Row label="Style" value={receipt.comparison.winnerLabel} />
          <Row label="Edge" value={`+${(receipt.comparison.edgeBps / 100).toFixed(2)}%`} mono />
          {receipt.baselineOutputAmount && (
            <Row label="Baseline out" value={receipt.baselineOutputAmount} mono />
          )}
        </div>
        <p className="wallet-recv__prose wallet-recv__prose--small">{receipt.summaryLine}</p>
      </details>

      <div className="wallet-recv__actions">
        {receipt.explorerTxUrl ? (
          <a className="wallet-recv__btn wallet-recv__btn--primary" href={receipt.explorerTxUrl} target="_blank" rel="noopener noreferrer">
            Open in explorer
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        ) : (
          <span className="wallet-recv__btn wallet-recv__btn--disabled">No explorer link</span>
        )}
        <button type="button" className="wallet-recv__btn wallet-recv__btn--secondary" onClick={() => void copyLink()}>
          {copyLabel === 'link' ? 'Link copied' : 'Copy link'}
        </button>
        <button type="button" className="wallet-recv__btn wallet-recv__btn--ghost" onClick={() => void copySummary()}>
          {copyLabel === 'summary' ? 'Summary copied' : 'Copy text summary'}
        </button>
      </div>

      {copyError && (
        <p className="wallet-recv__copy-hint wallet-recv__copy-hint--error" role="status">
          {copyError}
        </p>
      )}

      <p className="wallet-recv__disclaimer">OmniReceipt · mock disclosure UI</p>
    </div>
  )
}
