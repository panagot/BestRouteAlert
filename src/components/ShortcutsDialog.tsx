import { useEffect, useRef } from 'react'

export function ShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
  }, [open])

  if (!open) return null

  return (
    <div
      className="shortcuts-dlg__backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="shortcuts-dlg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-dlg-title"
      >
        <header className="shortcuts-dlg__head">
          <h2 id="shortcuts-dlg-title" className="shortcuts-dlg__title">
            Demo shortcuts
          </h2>
          <button type="button" className="shortcuts-dlg__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        <ul className="shortcuts-dlg__list">
          <li>
            <kbd className="shortcuts-dlg__kbd">Alt</kbd> + <kbd className="shortcuts-dlg__kbd">1</kbd>–
            <kbd className="shortcuts-dlg__kbd">3</kbd>
            <span>Switch sample receipt (order matches sidebar)</span>
          </li>
          <li>
            <kbd className="shortcuts-dlg__kbd">?</kbd>
            <span>Open this panel (when not typing in a field)</span>
          </li>
          <li>
            <kbd className="shortcuts-dlg__kbd">Esc</kbd>
            <span>Close this panel</span>
          </li>
        </ul>
        <p className="shortcuts-dlg__foot">
          Share links include <span className="mono">sample</span> and <span className="mono">surface</span> query
          params so reviewers land on the same view.
        </p>
      </div>
    </div>
  )
}
