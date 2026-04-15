/** Share URL for a receipt. Uses stable `receipt.id` (not display `shortId`) in the path. */
export function buildReceiptShareUrl(shareBaseUrl: string, receiptId: string): string {
  return `${shareBaseUrl.replace(/\/$/, '')}/r/${receiptId}`
}
