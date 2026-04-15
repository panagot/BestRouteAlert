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
]
