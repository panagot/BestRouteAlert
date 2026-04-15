import type { RouteReceipt } from '../types/receipt'

export function buildReceiptTextSummary(receipt: RouteReceipt, shareUrl: string): string {
  const pct = receipt.savingsVsBestSingleVenueBps / 100
  const slip =
    receipt.slippageBps != null ? `${(receipt.slippageBps / 100).toFixed(2)}% slippage max` : null
  const gas =
    receipt.totalGas != null ? `${receipt.totalGas.amount} ${receipt.totalGas.symbol} fee` : null
  const sources =
    receipt.liquiditySourcesCompared != null
      ? `Liquidity sources compared (mock): ${receipt.liquiditySourcesCompared}`
      : null
  const lines = [
    `OmniReceipt · ${receipt.spent.symbol} → ${receipt.received.symbol}`,
    `Network: ${receipt.network} (TON = The Open Network, not Tron) · Omniston-style route disclosure`,
    sources,
    `Ref #${receipt.shortId}`,
    receipt.userAddressTruncated ? `Wallet: ${receipt.userAddressTruncated}` : null,
    receipt.blockHeight != null ? `Block: ${receipt.blockHeight}` : null,
    `Sold ${receipt.spent.amount} ${receipt.spent.symbol} → Bought ${receipt.received.amount} ${receipt.received.symbol}`,
    `Effective ${receipt.effectiveRate}`,
    slip,
    gas,
    `Vs baseline: +${pct.toFixed(2)}% · Winner: ${receipt.comparison.winnerLabel}`,
    receipt.baselineOutputAmount ? `Baseline ~${receipt.baselineOutputAmount}` : null,
    `Tx (display): ${receipt.txHash}`,
    receipt.explorerTxUrl ? `Explorer: ${receipt.explorerTxUrl}` : null,
    `Share: ${shareUrl}`,
    '',
    'Legs:',
    ...receipt.hops.map((h) => {
      const g = h.legGasNative ? ` · gas ~${h.legGasNative}` : ''
      return `  ${h.step}. ${h.fromAmount} ${h.fromSymbol} → ${h.toAmount} ${h.toSymbol} @ ${h.venueName} (${h.impactBps} bps)${g}`
    }),
  ].filter(Boolean) as string[]
  return lines.join('\n')
}
