import { useEffect, useState } from 'react'
import type { RouteReceipt } from '../types/receipt'
import { formatReceiptDate } from '../utils/receiptDisplay'
import { buildReceiptTextSummary } from '../utils/receiptTextSummary'
import { VenueBadge } from './VenueBadge'

export function TelegramReceiptMiniApp({
  receipt,
  previewShareUrl,
}: {
  receipt: RouteReceipt
  previewShareUrl: string
}) {
  const shareUrl = previewShareUrl
  const pct = receipt.savingsVsBestSingleVenueBps / 100
  const [flash, setFlash] = useState<null | string>(null)

  useEffect(() => {
    if (!flash) return
    const t = window.setTimeout(() => setFlash(null), 1600)
    return () => window.clearTimeout(t)
  }, [flash])

  const toast = (msg: string) => setFlash(msg)

  const copy = async (label: string, text: string) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable')
      await navigator.clipboard.writeText(text)
      toast(label)
    } catch {
      toast('Could not copy — clipboard blocked or unavailable')
    }
  }

  return (
    <div className="tg-recv">
      <p className="tg-recv__context">
        <span className="tg-recv__bot">@OmniReceiptBot</span>
        <span className="tg-recv__dot" aria-hidden>
          ·
        </span>
        <span className="tg-recv__hint">swap receipt (demo)</span>
      </p>

      <article className="tg-recv__bubble" aria-label="Receipt summary">
        <header className="tg-recv__bubble-head">
          <span className="tg-recv__bubble-title">Swap</span>
          <span className="tg-recv__bubble-badge">Done</span>
        </header>
        <p className="tg-recv__pair-line">
          <strong>
            {receipt.spent.amount} {receipt.spent.symbol}
          </strong>
          <span className="tg-recv__arrow" aria-hidden>
            →
          </span>
          <strong>
            {receipt.received.amount} {receipt.received.symbol}
          </strong>
        </p>
        <p className="tg-recv__rate mono">{receipt.effectiveRate}</p>

        <div className="tg-recv__stats">
          <div className="tg-recv__stat">
            <span className="tg-recv__stat-label">vs baseline</span>
            <span className="tg-recv__stat-value tabular">+{pct.toFixed(2)}%</span>
          </div>
          <div className="tg-recv__stat">
            <span className="tg-recv__stat-label">route</span>
            <span className="tg-recv__stat-value">{receipt.hops.length} hops</span>
          </div>
          <div className="tg-recv__stat">
            <span className="tg-recv__stat-label">network</span>
            <span className="tg-recv__stat-value">{receipt.network}</span>
          </div>
          <div className="tg-recv__stat">
            <span className="tg-recv__stat-label">when</span>
            <span className="tg-recv__stat-value">{formatReceiptDate(receipt.createdAtIso)}</span>
          </div>
        </div>

        <p className="tg-recv__summary">{receipt.summaryLine}</p>

        <ul className="tg-recv__hops" aria-label="Hops">
          {receipt.hops.map((h) => (
            <li key={h.step} className="tg-recv__hop">
              <span className="tg-recv__hop-n tabular">{h.step}.</span>
              <span className="tg-recv__hop-txt">
                {h.fromSymbol}→{h.toSymbol}
                <VenueBadge kind={h.venueKind} />
              </span>
            </li>
          ))}
        </ul>
      </article>

      <div className="tg-recv__keyboard" role="group" aria-label="Quick actions">
        {receipt.explorerTxUrl && (
          <a className="tg-recv__key tg-recv__key--link" href={receipt.explorerTxUrl} target="_blank" rel="noopener noreferrer">
            Block explorer
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        )}
        <button type="button" className="tg-recv__key" onClick={() => void copy('Link copied', shareUrl)}>
          Copy link
        </button>
        <button
          type="button"
          className="tg-recv__key"
          onClick={() => void copy('Summary copied', buildReceiptTextSummary(receipt, shareUrl))}
        >
          Copy text
        </button>
        <button type="button" className="tg-recv__key tg-recv__key--dim" disabled>
          Share (demo)
        </button>
      </div>

      {flash && <p className="tg-recv__toast" role="status">{flash}</p>}

      <p className="tg-recv__fine">Mini-app layout mock · not Telegram WebApp API</p>
    </div>
  )
}
