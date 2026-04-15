import { useRef } from 'react'
import type { RouteReceipt } from '../types/receipt'
import { ReceiptPanel } from './ReceiptPanel'
import { TelegramReceiptMiniApp } from './TelegramReceiptMiniApp'
import { WalletReceiptSheet } from './WalletReceiptSheet'

export type SurfaceMode = 'web' | 'wallet' | 'telegram'

const MODES: { id: SurfaceMode; label: string; hint: string }[] = [
  { id: 'web', label: 'Web', hint: 'Browser / docs' },
  { id: 'wallet', label: 'Wallet', hint: 'In-app history sheet' },
  { id: 'telegram', label: 'Telegram', hint: 'Mini-app WebView' },
]

export function SurfacePreview({
  mode,
  onModeChange,
  receipt,
  shareBaseUrl,
}: {
  mode: SurfaceMode
  onModeChange: (m: SurfaceMode) => void
  receipt: RouteReceipt
  shareBaseUrl: string
}) {
  const segmentRefs = useRef<(HTMLButtonElement | null)[]>([])

  return (
    <div className="surface-preview">
      <div
        className="surface-preview__toolbar"
        role="radiogroup"
        aria-label="Preview how this receipt might appear in different surfaces"
      >
        <p className="surface-preview__legend">
          <span className="surface-preview__legend-title">Preview surface</span>
          <span className="surface-preview__legend-note">
            Each mode uses a different layout — web = full disclosure doc; wallet &amp; Telegram = native-style mocks
          </span>
        </p>
        <div className="surface-preview__segments">
          {MODES.map(({ id, label, hint }, index) => (
            <button
              key={id}
              ref={(el) => {
                segmentRefs.current[index] = el
              }}
              type="button"
              role="radio"
              tabIndex={mode === id ? 0 : -1}
              aria-checked={mode === id}
              className={`surface-preview__segment ${mode === id ? 'surface-preview__segment--active' : ''}`}
              onClick={() => onModeChange(id)}
              title={hint}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  onModeChange(id)
                  return
                }
                let next = index
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                  e.preventDefault()
                  next = (index + 1) % MODES.length
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                  e.preventDefault()
                  next = (index - 1 + MODES.length) % MODES.length
                } else if (e.key === 'Home') {
                  e.preventDefault()
                  next = 0
                } else if (e.key === 'End') {
                  e.preventDefault()
                  next = MODES.length - 1
                } else {
                  return
                }
                onModeChange(MODES[next]!.id)
                segmentRefs.current[next]?.focus()
              }}
            >
              <span className="surface-preview__segment-label">{label}</span>
              <span className="surface-preview__segment-hint">{hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`surface-preview__canvas surface-preview__canvas--${mode}`}>
        {mode === 'web' && (
          <div className="surface-preview__web-chrome">
            <div className="surface-preview__web-bar" aria-hidden>
              <span className="surface-preview__web-dots">
                <span />
                <span />
                <span />
              </span>
              <span className="surface-preview__web-url">receipt.ton.example · Omniston</span>
            </div>
            <div className="surface-preview__web-body">
              <ReceiptPanel receipt={receipt} shareBaseUrl={shareBaseUrl} />
            </div>
          </div>
        )}

        {mode === 'wallet' && (
          <div className="device-shell" aria-label="Wallet app mockup frame">
            <div className="device-shell__bezel">
              <div className="device-shell__speaker" aria-hidden />
              <div className="device-shell__status" aria-hidden>
                <span className="device-shell__time">9:41</span>
                <span className="device-shell__icons">
                  <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M1 8h2v2H1V8zm3-2h2v4H4V6zm3-3h2v7H7V3zm3-3h2v10h-2V0z"
                      opacity="0.85"
                    />
                  </svg>
                  <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden>
                    <rect x="1" y="3" width="12" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M14 5v0.5a2 2 0 01-2 2h-0.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </span>
              </div>
              <div className="device-shell__wallet-nav" aria-hidden>
                <span className="device-shell__wallet-back">←</span>
                <span className="device-shell__wallet-title">Transaction</span>
                <span className="device-shell__wallet-spacer" />
              </div>
              <div className="device-shell__screen">
                <div className="device-shell__scroll">
                  <WalletReceiptSheet receipt={receipt} shareBaseUrl={shareBaseUrl} />
                </div>
              </div>
              <div className="device-shell__home" aria-hidden />
            </div>
          </div>
        )}

        {mode === 'telegram' && (
          <div className="device-shell device-shell--tg" aria-label="Telegram mini-app mockup frame">
            <div className="device-shell__bezel">
              <div className="device-shell__speaker" aria-hidden />
              <div className="device-shell__status" aria-hidden>
                <span className="device-shell__time">9:41</span>
                <span className="device-shell__icons">
                  <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden>
                    <path fill="currentColor" d="M1 8h2v2H1V8zm3-2h2v4H4V6zm3-3h2v7H7V3zm3-3h2v10h-2V0z" opacity="0.85" />
                  </svg>
                  <svg width="16" height="10" viewBox="0 0 16 10" aria-hidden>
                    <rect x="1" y="3" width="12" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M14 5v0.5a2 2 0 01-2 2h-0.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </span>
              </div>
              <div className="device-shell__tg-header" aria-hidden>
                <span className="device-shell__tg-close">×</span>
                <span className="device-shell__tg-title">OmniReceipt</span>
                <span className="device-shell__tg-more">⋯</span>
              </div>
              <div className="device-shell__screen device-shell__screen--tg">
                <div className="device-shell__scroll">
                  <TelegramReceiptMiniApp receipt={receipt} shareBaseUrl={shareBaseUrl} />
                </div>
              </div>
              <div className="device-shell__home" aria-hidden />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
