import type { RouteReceipt } from '../types/receipt'

export const EXAMPLE_RFQ_WINS: RouteReceipt = {
  id: 'ex_rfq_7k2m',
  shortId: '7K2M',
  createdAtIso: '2026-04-15T14:32:09.000Z',
  network: 'TON mainnet',
  txHash: 'EQCz…9f2a',
  spent: { amount: '1,250.00', symbol: 'GEMSTON' },
  received: { amount: '42.1876', symbol: 'tsTON' },
  effectiveRate: '1 GEMSTON = 0.03375 tsTON',
  savingsVsBestSingleVenueBps: 38,
  summaryLine:
    'After fees, the composed route (pool + RFQ) delivered about 0.38% more tsTON than our single-venue AMM baseline. Omniston picked the package and settled it as one user-facing swap.',
  userAddressTruncated: 'UQB…7k2m',
  walletLabel: 'Tonkeeper',
  blockHeight: 48_291_044,
  explorerTxUrl:
    'https://tonviewer.com/transaction/880053ec6f5b4c8a9d2e1f0a7b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6',
  slippageBps: 50,
  totalGas: { amount: '0.214', symbol: 'TON' },
  referralFeeNote: 'No referral on this route.',
  whyRouteWon:
    'The OTC resolver beat the continuation you would get by staying in AMMs alone for the TON→tsTON leg. The first hop still used deep GEMSTON/TON liquidity; the second hop captured a tighter institutional quote.',
  baselineOutputAmount: '42.0274 tsTON',
  signedReceiptPlaceholder: 'att:v0:sha256:9f4e2b…c81a (placeholder — production signing TBD)',
  hops: [
    {
      step: 1,
      fromSymbol: 'GEMSTON',
      toSymbol: 'TON',
      fromAmount: '1,250.00',
      toAmount: '18.9021',
      venueName: 'STON.fi v2 · GEMSTON/TON',
      venueKind: 'amm',
      impactBps: 12,
      legGasNative: '0.086 TON',
    },
    {
      step: 2,
      fromSymbol: 'TON',
      toSymbol: 'tsTON',
      fromAmount: '18.9021',
      toAmount: '42.1876',
      venueName: 'Resolver · OTC RFQ',
      venueKind: 'rfq',
      impactBps: 4,
      legGasNative: '0.128 TON',
      legNote:
        'RFQ solver quoted a tighter TON→tsTON leg than the continuation you would get from pool mid-price alone at this size.',
    },
  ],
  comparison: {
    winner: 'rfq',
    winnerLabel: 'RFQ resolver (OTC)',
    edgeBps: 38,
    runnerUpLabel: 'Best single-venue AMM path (simulated)',
  },
}

export const EXAMPLE_AMM_ONLY: RouteReceipt = {
  id: 'ex_amm_4p9q',
  shortId: '4P9Q',
  createdAtIso: '2026-04-14T09:18:44.000Z',
  network: 'TON mainnet',
  txHash: 'EQD1…3c81',
  spent: { amount: '500.00', symbol: 'USDT' },
  received: { amount: '287.41', symbol: 'STON' },
  effectiveRate: '1 USDT = 0.5748 STON',
  savingsVsBestSingleVenueBps: 14,
  summaryLine:
    'No RFQ this time — two AMM hops still beat forcing everything through one shallow USDT/STON pool. Net you kept roughly 0.14% more STON than the “shortcut” baseline after costs.',
  userAddressTruncated: 'UQD…4p9q',
  walletLabel: 'MyTonWallet',
  blockHeight: 48_256_112,
  explorerTxUrl:
    'https://tonviewer.com/transaction/990164fd7a6c5d9b0e3f2a1b8c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e7f0',
  slippageBps: 75,
  totalGas: { amount: '0.178', symbol: 'TON' },
  referralFeeNote: '0.05% integrator fee included in quoted output.',
  whyRouteWon:
    'USDT→TON and TON→STON each had better depth than a single direct pool at this size. Chaining venues inside one transaction avoids leaving money on the table versus stopping after the first hop.',
  baselineOutputAmount: '286.99 STON',
  signedReceiptPlaceholder: 'att:v0:pending (wallet-attested digest in production)',
  hops: [
    {
      step: 1,
      fromSymbol: 'USDT',
      toSymbol: 'TON',
      fromAmount: '500.00',
      toAmount: '142.8800',
      venueName: 'DeDust · USDT/TON',
      venueKind: 'amm',
      impactBps: 9,
      legGasNative: '0.091 TON',
      legNote:
        'First hop exits stables into native TON where book depth is best — avoids paying the wide spread on a thin USDT/STON leg.',
    },
    {
      step: 2,
      fromSymbol: 'TON',
      toSymbol: 'STON',
      fromAmount: '142.8800',
      toAmount: '287.41',
      venueName: 'STON.fi v2 · TON/STON',
      venueKind: 'amm',
      impactBps: 6,
      legGasNative: '0.087 TON',
    },
  ],
  comparison: {
    winner: 'amm',
    winnerLabel: 'Multi-hop AMM route',
    edgeBps: 14,
    runnerUpLabel: 'Direct USDT→STON (single pool)',
  },
}

/** Three hops, RFQ finish — large gap vs a naive single-pool baseline (grant story). */
export const EXAMPLE_DEEP_ROUTE: RouteReceipt = {
  id: 'ex_deep_9x3k',
  shortId: '9X3K',
  createdAtIso: '2026-04-13T16:42:01.000Z',
  network: 'TON mainnet',
  txHash: 'EQF8…2a91',
  spent: { amount: '2,400.00', symbol: 'USDT' },
  received: { amount: '318.94', symbol: 'tsTON' },
  effectiveRate: '1 USDT = 0.13289 tsTON',
  savingsVsBestSingleVenueBps: 82,
  summaryLine:
    'Omniston compared multiple AMM books and RFQ solvers; the winning package used three hops and an exit RFQ. After fees you kept about 0.82% more tsTON than the “one-hop” baseline that looked cheaper in the UI.',
  userAddressTruncated: 'UQE…9x3k',
  walletLabel: 'Tonkeeper',
  blockHeight: 48_302_881,
  explorerTxUrl:
    'https://tonviewer.com/transaction/aa1155ee77aa66bb88cc99dd00ee11ff22aa33bb44cc55dd66ee77ff88aa99bb',
  slippageBps: 60,
  totalGas: { amount: '0.267', symbol: 'TON' },
  referralFeeNote: 'Integrator 0.04% included in quoted output.',
  whyRouteWon:
    'At this notional, a direct USDT→tsTON pool quote looked fine until you factor price impact and the exit leg. Omniston evaluated seven liquidity surfaces (two RFQ desks, five AMM routes); the composed path minimized slippage by splitting the bridge through TON and GEMSTON, then tightening the last leg with an RFQ.',
  baselineOutputAmount: '316.34 tsTON',
  signedReceiptPlaceholder: 'att:v0:mock:deep-route-9x3k (replace with signed digest in production)',
  hops: [
    {
      step: 1,
      fromSymbol: 'USDT',
      toSymbol: 'TON',
      fromAmount: '2,400.00',
      toAmount: '684.5520',
      venueName: 'DeDust · USDT/TON',
      venueKind: 'amm',
      impactBps: 11,
      legGasNative: '0.094 TON',
      legNote:
        'Wide USDT book on DeDust at this size; Omniston used it as the cheapest on-ramp into native TON for the next hop.',
    },
    {
      step: 2,
      fromSymbol: 'TON',
      toSymbol: 'GEMSTON',
      fromAmount: '684.5520',
      toAmount: '51,204.00',
      venueName: 'STON.fi v2 · GEMSTON/TON',
      venueKind: 'amm',
      impactBps: 14,
      legGasNative: '0.098 TON',
      legNote:
        'GEMSTON/TON carried better depth than routing straight to tsTON here — intermediate hop reduces cumulative price impact.',
    },
    {
      step: 3,
      fromSymbol: 'GEMSTON',
      toSymbol: 'tsTON',
      fromAmount: '51,204.00',
      toAmount: '318.94',
      venueName: 'Resolver · OTC RFQ',
      venueKind: 'rfq',
      impactBps: 5,
      legGasNative: '0.075 TON',
      legNote:
        'Solver beat the visible pool continuation on GEMSTON→tsTON; RFQ leg is where multi-venue aggregation often wins.',
    },
  ],
  comparison: {
    winner: 'rfq',
    winnerLabel: 'Composed AMM + RFQ (Omniston)',
    edgeBps: 82,
    runnerUpLabel: 'Direct USDT→tsTON (single pool, high impact)',
  },
}

export const EXAMPLES: { key: string; label: string; description: string; receipt: RouteReceipt }[] = [
  {
    key: 'rfq',
    label: 'RFQ finishes the trade',
    description: 'Pool for the exit leg, then an RFQ tightens TON→tsTON — classic “solver wins” story.',
    receipt: EXAMPLE_RFQ_WINS,
  },
  {
    key: 'amm',
    label: 'Pure AMM composition',
    description: 'Two venues, two hops, one settlement — beats a thin direct pair at this notional.',
    receipt: EXAMPLE_AMM_ONLY,
  },
  {
    key: 'deep',
    label: 'Deep route · big vs baseline',
    description: 'Three hops, seven surfaces compared — RFQ exit vs a “simple” pool that costs you.',
    receipt: EXAMPLE_DEEP_ROUTE,
  },
]
