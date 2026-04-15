/** Share URL for a receipt. Uses stable `receipt.id` (not display `shortId`) in the path. */
export function buildReceiptShareUrl(shareBaseUrl: string, receiptId: string): string {
  return `${shareBaseUrl.replace(/\/$/, '')}/r/${receiptId}`
}

/** Deep link that opens this SPA with the same sample + surface (works on the real deployed app). */
export function buildPreviewShareUrl(
  origin: string,
  pathname: string,
  sampleKey: string,
  surface: 'web' | 'wallet' | 'telegram'
): string {
  const path = pathname && pathname !== '' ? pathname : '/'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const params = new URLSearchParams()
  params.set('sample', sampleKey)
  params.set('surface', surface)
  return `${origin.replace(/\/$/, '')}${normalizedPath}?${params.toString()}`
}
