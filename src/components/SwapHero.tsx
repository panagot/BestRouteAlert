import { TokenGlyph } from './TokenGlyph'

export function SwapHero({
  spent,
  received,
}: {
  spent: { amount: string; symbol: string }
  received: { amount: string; symbol: string }
}) {
  return (
    <div className="swap-hero" aria-label="Swap overview">
      <div className="swap-hero__pair">
        <div className="swap-hero__side swap-hero__side--from">
          <TokenGlyph symbol={spent.symbol} size="lg" />
          <div className="swap-hero__text">
            <span className="swap-hero__label">You sold</span>
            <span className="swap-hero__amount tabular mono">{spent.amount}</span>
            <span className="swap-hero__ticker">{spent.symbol}</span>
          </div>
        </div>
        <div className="swap-hero__arrow" aria-hidden>
          <svg className="swap-hero__arrow-svg" width="52" height="26" viewBox="0 0 52 26" fill="none">
            <defs>
              <linearGradient id="swapHeroArrowGrad" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="40%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <path
              d="M4 13h38M36 7l10 6-10 6"
              stroke="url(#swapHeroArrowGrad)"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="swap-hero__side swap-hero__side--to">
          <TokenGlyph symbol={received.symbol} size="lg" />
          <div className="swap-hero__text">
            <span className="swap-hero__label">You received</span>
            <span className="swap-hero__amount tabular mono">{received.amount}</span>
            <span className="swap-hero__ticker">{received.symbol}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
