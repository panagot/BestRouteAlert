export type VenueKind = 'amm' | 'rfq'

export interface RouteHop {
  step: number
  fromSymbol: string
  toSymbol: string
  fromAmount: string
  toAmount: string
  venueName: string
  venueKind: VenueKind
  impactBps: number
  /** Estimated gas attributed to this leg (prototype). */
  legGasNative?: string
  /** Optional educational blurb (e.g. expandable row in web legs table). */
  legNote?: string
  /** Mock quote latency for demo tooltips (ms). */
  quoteLatencyMs?: number
  /** One-line role of this leg in the composed route (demo). */
  legRole?: string
}

export interface QuoteComparison {
  winner: VenueKind
  winnerLabel: string
  edgeBps: number
  runnerUpLabel: string
}

export interface RouteReceipt {
  id: string
  shortId: string
  createdAtIso: string
  network: string
  /** Short hash for display. */
  txHash: string
  spent: { amount: string; symbol: string }
  received: { amount: string; symbol: string }
  effectiveRate: string
  savingsVsBestSingleVenueBps: number
  summaryLine: string
  hops: RouteHop[]
  comparison: QuoteComparison

  /** Truncated user address (e.g. UQ…x4F2). */
  userAddressTruncated?: string
  walletLabel?: string
  /** Ledger time anchor. */
  blockHeight?: number
  /** Deep link to chain explorer for this tx. */
  explorerTxUrl?: string
  /** Slippage tolerance the user signed up for. */
  slippageBps?: number
  /** Total network fee for the swap tx. */
  totalGas?: { amount: string; symbol: string }
  /** Plain-language referral / fee disclosure. */
  referralFeeNote?: string
  /** Educates why RFQ or multi-hop won. */
  whyRouteWon?: string
  /** Baseline quote output amount (same out token) for comparison narrative. */
  baselineOutputAmount?: string
  /** Placeholder for future signed receipt / attestation id. */
  signedReceiptPlaceholder?: string
  /** Mock: how many AMM/RFQ surfaces Omniston compared before composing this route. */
  liquiditySourcesCompared?: number
}
