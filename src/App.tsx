import { useEffect, useMemo, useRef, useState } from 'react'
import { EXAMPLES } from './data/examples'
import { Sidebar } from './components/Sidebar'
import { SurfacePreview, type SurfaceMode } from './components/SurfacePreview'
import './App.css'

const SURFACE_STORAGE_KEY = 'omnireceipt-surface-preview'

function readStoredSurface(): SurfaceMode {
  try {
    const raw = sessionStorage.getItem(SURFACE_STORAGE_KEY)
    if (raw === 'web' || raw === 'wallet' || raw === 'telegram') return raw
  } catch {
    /* ignore */
  }
  return 'web'
}

export default function App() {
  const mainRef = useRef<HTMLElement>(null)
  const [activeKey, setActiveKey] = useState(EXAMPLES[0]?.key ?? 'rfq')
  const [surfaceMode, setSurfaceMode] = useState<SurfaceMode>(() =>
    typeof window === 'undefined' ? 'web' : readStoredSurface(),
  )

  const receipt = useMemo(() => {
    return EXAMPLES.find((e) => e.key === activeKey)?.receipt ?? EXAMPLES[0]!.receipt
  }, [activeKey])

  const shareBase =
    typeof window !== 'undefined' ? window.location.origin : 'https://receipt.example.com'

  useEffect(() => {
    try {
      sessionStorage.setItem(SURFACE_STORAGE_KEY, surfaceMode)
    } catch {
      /* ignore */
    }
  }, [surfaceMode])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.defaultPrevented) return
      const el = e.target as HTMLElement | null
      if (el?.closest('input, textarea, select, [contenteditable="true"]')) return
      const n = e.key === '1' ? 0 : e.key === '2' ? 1 : -1
      if (n < 0) return
      const ex = EXAMPLES[n]
      if (!ex) return
      e.preventDefault()
      setActiveKey(ex.key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="app-frame">
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault()
          mainRef.current?.focus({ preventScroll: true })
          const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
          mainRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
        }}
      >
        Skip to receipt
      </a>
      <Sidebar activeKey={activeKey} onSelect={setActiveKey} />
      <div className="app-stage">
        <div className="app-stage__ambient" aria-hidden>
          <span className="app-stage__blob app-stage__blob--a" />
          <span className="app-stage__blob app-stage__blob--b" />
          <span className="app-stage__blob app-stage__blob--c" />
        </div>
        <div className="app-stage__noise" aria-hidden />
        <main
          ref={mainRef}
          id="main-content"
          className="app-main"
          tabIndex={-1}
          aria-label="Receipt preview"
        >
          <div className="app-stage__content">
            <SurfacePreview
              mode={surfaceMode}
              onModeChange={setSurfaceMode}
              receipt={receipt}
              shareBaseUrl={shareBase}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
