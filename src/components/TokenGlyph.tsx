import type { CSSProperties } from 'react'

const PALETTE = [
  { bg: '#1e3a5f', fg: '#e8f4ff' },
  { bg: '#1a4744', fg: '#e6fffa' },
  { bg: '#4a3728', fg: '#fef3e2' },
  { bg: '#3d2f5c', fg: '#f3e8ff' },
  { bg: '#2d3f1e', fg: '#f4fce7' },
  { bg: '#4a2842', fg: '#fce7f8' },
]

function abbrev(symbol: string) {
  const s = symbol.replace(/[^A-Za-z0-9]/g, '')
  if (s.length <= 4) return s.toUpperCase()
  return (s.slice(0, 2) + s.slice(-1)).toUpperCase()
}

function pickStyle(symbol: string) {
  let n = 0
  for (let i = 0; i < symbol.length; i += 1) n += symbol.charCodeAt(i)
  return PALETTE[n % PALETTE.length]
}

export function TokenGlyph({
  symbol,
  size = 'md',
}: {
  symbol: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const { bg, fg } = pickStyle(symbol)
  const dim = size === 'lg' ? 52 : size === 'md' ? 40 : 32
  return (
    <div
      className={`token-glyph token-glyph--${size}`}
      style={
        {
          width: dim,
          height: dim,
          '--glyph-bg': bg,
          '--glyph-fg': fg,
        } as CSSProperties
      }
      title={symbol}
    >
      <span className="token-glyph__abbr">{abbrev(symbol)}</span>
    </div>
  )
}
