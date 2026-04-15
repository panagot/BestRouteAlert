import { useEffect, useMemo, useRef, useState } from 'react'
import { EXAMPLES } from './data/examples'
import { Sidebar } from './components/Sidebar'
import { ShortcutsDialog } from './components/ShortcutsDialog'
import { SurfacePreview, type SurfaceMode } from './components/SurfacePreview'
import { buildPreviewShareUrl } from './utils/shareUrl'
import { readPreviewQuery, syncPreviewToUrl } from './utils/previewQuery'
import './App.css'

const SURFACE_STORAGE_KEY = 'omnireceipt-surface-preview'
const SAMPLE_STORAGE_KEY = 'omnireceipt-active-sample'
const HINT_DISMISSED_KEY = 'omnireceipt-hint-dismissed'

function readStoredSampleKey(): string | null {
  try {
    const raw = sessionStorage.getItem(SAMPLE_STORAGE_KEY)
    if (raw && EXAMPLES.some((e) => e.key === raw)) return raw
  } catch {
    /* ignore */
  }
  return null
}

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
  const [activeKey, setActiveKey] = useState(() => {
    if (!EXAMPLES.length) return ''
    if (typeof window === 'undefined') return EXAMPLES[0]!.key
    const { sample } = readPreviewQuery(window.location.search)
    if (sample && EXAMPLES.some((e) => e.key === sample)) return sample
    return readStoredSampleKey() ?? EXAMPLES[0]!.key
  })
  const [surfaceMode, setSurfaceMode] = useState<SurfaceMode>(() => {
    if (typeof window === 'undefined') return 'web'
    const { surface } = readPreviewQuery(window.location.search)
    if (surface) return surface
    return readStoredSurface()
  })

  const receipt = useMemo(() => {
    if (!EXAMPLES.length) return null
    return EXAMPLES.find((e) => e.key === activeKey)?.receipt ?? EXAMPLES[0]!.receipt ?? null
  }, [activeKey])

  const previewShareUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return buildPreviewShareUrl(window.location.origin, window.location.pathname || '/', activeKey, surfaceMode)
  }, [activeKey, surfaceMode])

  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [hintDismissed, setHintDismissed] = useState(() => {
    try {
      return localStorage.getItem(HINT_DISMISSED_KEY) === '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(SURFACE_STORAGE_KEY, surfaceMode)
    } catch {
      /* ignore */
    }
  }, [surfaceMode])

  useEffect(() => {
    try {
      sessionStorage.setItem(SAMPLE_STORAGE_KEY, activeKey)
    } catch {
      /* ignore */
    }
  }, [activeKey])

  useEffect(() => {
    if (!EXAMPLES.length || !activeKey) return
    syncPreviewToUrl(activeKey, surfaceMode)
  }, [activeKey, surfaceMode])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      const el = e.target as HTMLElement | null
      if (el?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        const n = Number(e.key) - 1
        const ex = EXAMPLES[n]
        if (!ex) return
        e.preventDefault()
        setActiveKey(ex.key)
        return
      }
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault()
        setShortcutsOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!EXAMPLES.length || !receipt) {
    return (
      <div className="app-frame app-frame--empty">
        <main className="app-main app-main--empty" id="main-content" tabIndex={-1}>
          <p className="app-empty__msg">No sample receipts are configured.</p>
        </main>
      </div>
    )
  }

  const dismissHint = () => {
    setHintDismissed(true)
    try {
      localStorage.setItem(HINT_DISMISSED_KEY, '1')
    } catch {
      /* ignore */
    }
  }

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
            <header className="app-hero">
              <p className="app-hero__tagline">
                Making Omniston&apos;s intelligent routing <strong>visible</strong> and{' '}
                <strong>trustworthy</strong>.
              </p>
              <p className="app-hero__why">
                <strong>Why TON:</strong> aggregated swaps should be as easy to <strong>audit</strong> as they are to
                sign — a receipt layer closes the loop for users, support, and partners embedding Omniston.
              </p>
              <p className="app-hero__actions">
                <button type="button" className="app-hero__shortcut-btn" onClick={() => setShortcutsOpen(true)}>
                  Keyboard shortcuts <span className="app-hero__kbd">?</span>
                </button>
              </p>
            </header>
            {!hintDismissed && (
              <aside className="app-demo-hint" role="status">
                <p className="app-demo-hint__text">
                  <strong>Demo tip:</strong> use <kbd className="app-demo-hint__kbd">Alt</kbd> +{' '}
                  <kbd className="app-demo-hint__kbd">1</kbd>–<kbd className="app-demo-hint__kbd">3</kbd> to switch
                  scenarios (same order as the sidebar). Press <kbd className="app-demo-hint__kbd">?</kbd> anytime for
                  the full list.
                </p>
                <button type="button" className="app-demo-hint__dismiss" onClick={dismissHint}>
                  Got it
                </button>
              </aside>
            )}
            <SurfacePreview
              mode={surfaceMode}
              onModeChange={setSurfaceMode}
              receipt={receipt}
              previewShareUrl={previewShareUrl}
              sampleChoices={EXAMPLES.map((e) => ({ key: e.key, label: e.label }))}
              activeSampleKey={activeKey}
              onSampleChange={setActiveKey}
            />
          </div>
        </main>
      </div>
      <ShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  )
}
