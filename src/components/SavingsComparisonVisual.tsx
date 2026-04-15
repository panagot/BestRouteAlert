/** Horizontal bar comparison: baseline vs executed output (explorer-style). */

import { useEffect, useState } from 'react'

export function SavingsComparisonVisual({
  savingsBps,
  outSymbol,
  liquiditySourcesCompared,
  edgeBps,
  winnerIsRfq,
}: {
  savingsBps: number
  outSymbol: string
  liquiditySourcesCompared?: number
  edgeBps?: number
  winnerIsRfq?: boolean
}) {
  const pct = savingsBps / 100
  const executedWidth = Math.min(100, 72 + Math.min(pct * 8, 28))
  const [execW, setExecW] = useState(72)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setExecW(executedWidth)
      return
    }
    setExecW(72)
    const id = window.requestAnimationFrame(() => {
      setExecW(executedWidth)
    })
    return () => cancelAnimationFrame(id)
  }, [executedWidth, savingsBps])

  return (
    <div className="savings-viz" aria-label="Savings versus baseline visualization">
      <div className="savings-viz__header">
        <span className="savings-viz__title">Outcome vs. baseline</span>
        <span className="savings-viz__badge tabular">+{pct.toFixed(2)}%</span>
      </div>
      {(liquiditySourcesCompared != null || edgeBps != null) && (
        <ul className="savings-viz__micro">
          {liquiditySourcesCompared != null && (
            <li>
              Omniston compared <strong>{liquiditySourcesCompared}</strong> liquidity sources (mock) before picking this
              route.
            </li>
          )}
          {edgeBps != null && (
            <li>
              Net edge vs reference baseline: <strong>{edgeBps} bps</strong>
              {winnerIsRfq
                ? ' — RFQ / solver pressure helped on the winning package.'
                : ' — deeper AMM composition vs the shortcut baseline.'}
            </li>
          )}
        </ul>
      )}
      <div className="savings-viz__rows">
        <div className="savings-viz__row">
          <span className="savings-viz__label">Baseline</span>
          <div className="savings-viz__bar-wrap">
            <div className="savings-viz__bar savings-viz__bar--base" style={{ width: '72%' }} />
          </div>
          <span className="savings-viz__val">100%</span>
        </div>
        <div className="savings-viz__row">
          <span className="savings-viz__label">Executed</span>
          <div className="savings-viz__bar-wrap">
            <div
              className="savings-viz__bar savings-viz__bar--exec"
              style={{
                width: `${execW}%`,
                transition: 'width 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          </div>
          <span className="savings-viz__val tabular">{(100 + pct).toFixed(2)}%</span>
        </div>
      </div>
      <p className="savings-viz__caption">
        You kept about <strong>+{pct.toFixed(2)}% more {outSymbol}</strong> vs the reference baseline in this mock —
        the kind of outcome Omniston surfaces when multi-venue routing beats a single obvious quote. Bars are schematic;
        production would tie to stored quote math.
      </p>
    </div>
  )
}
