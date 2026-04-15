import type { SurfaceMode } from '../components/SurfacePreview'

const SAMPLE = 'sample'
const SURFACE = 'surface'

function parseSurface(raw: string | null): SurfaceMode | null {
  if (raw === 'web' || raw === 'wallet' || raw === 'telegram') return raw
  return null
}

/** Read `sample` and `surface` from the current page query string (values not validated here). */
export function readPreviewQuery(search: string): { sample: string | null; surface: SurfaceMode | null } {
  const q = search.startsWith('?') ? search.slice(1) : search
  const params = new URLSearchParams(q)
  return {
    sample: params.get(SAMPLE),
    surface: parseSurface(params.get(SURFACE)),
  }
}

/** Update the URL query to match the active preview (replaceState — no extra history entries). */
export function syncPreviewToUrl(sampleKey: string, surface: SurfaceMode): void {
  const params = new URLSearchParams(window.location.search)
  params.set(SAMPLE, sampleKey)
  params.set(SURFACE, surface)
  const next = `${window.location.pathname}?${params.toString()}${window.location.hash}`
  window.history.replaceState(null, '', next)
}
