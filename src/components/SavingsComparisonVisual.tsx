/** Horizontal bar comparison: baseline vs executed output (explorer-style). */

export function SavingsComparisonVisual({
  savingsBps,
  outSymbol,
}: {
  savingsBps: number
  outSymbol: string
}) {
  const pct = savingsBps / 100
  const executedWidth = Math.min(100, 72 + Math.min(pct * 8, 28))

  return (
    <div className="savings-viz" aria-label="Savings versus baseline visualization">
      <div className="savings-viz__header">
        <span className="savings-viz__title">Outcome vs. baseline</span>
        <span className="savings-viz__badge tabular">+{pct.toFixed(2)}%</span>
      </div>
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
              style={{ width: `${executedWidth}%` }}
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
