import { useEffect, useState, type FormEvent } from 'react'

const botImage = '/TONBOT/TONBOT.jpg'

/** Plain text the bot would post (matches structured API fields). */
const SAMPLE_TWEET_TEXT = `Route ↑ TON/USDT (whale probe)

Whale size now clears our AMM baseline by ~74 bps (~+0.74% net).

Winner: RFQ route
Baseline: best single-venue AMM
Poll: 2026-04-16 12:00:10 UTC

#TON #DeFi #Omniston`

const SAMPLE_ALERT_JSON = `{
  "type": "route_quality_alert",
  "network": "TON",
  "pair": "TON/USDT",
  "probe": "whale",
  "edge_vs_baseline_bps": 74,
  "winner": "rfq",
  "baseline": "amm_best_single_venue",
  "polled_at": "2026-04-16T12:00:10Z",
  "quotes_context": "not_execution"
}`

const mockedEvents = [
  {
    pair: 'TON/USDT',
    move: '+0.74%',
    note: 'RFQ route now beats AMM baseline',
    eta: '31s ago',
  },
  {
    pair: 'TON/STON',
    move: '+0.41%',
    note: 'Best quote switched to mixed route',
    eta: '2m ago',
  },
  {
    pair: 'TON/JUSDT',
    move: '+1.12%',
    note: 'Large-size route improvement detected',
    eta: '4m ago',
  },
]

const metrics = [
  { label: 'Pairs monitored', value: '10' },
  { label: 'Polling interval', value: '30s' },
  { label: 'Alert cooldown', value: '5m' },
  { label: 'Noise threshold', value: '0.25%' },
]

const outputs = [
  {
    title: 'X (Twitter)',
    body: 'Public route alerts with pair, edge, and mechanism. Ideal for discovery and ecosystem visibility.',
  },
  {
    title: 'Telegram',
    body: 'Same signals in a channel or DM bot. Lower friction than API for traders who live in Telegram.',
  },
  {
    title: 'Builder API',
    body: 'JSON alerts and optional WebSocket for wallets, dashboards, and aggregators embedding route quality.',
  },
  {
    title: 'Route quality board',
    body: 'A simple on-site view of recent snapshots per pair so anyone can verify the signal without Twitter.',
  },
  {
    title: 'Dual probes',
    body: 'Retail vs whale notionals per pair so size-sensitive route shifts show up in alerts.',
  },
]

const routeBoardRows = [
  { pair: 'TON/USDT', retail: '+0.42%', whale: '+0.74%', probe: 'RFQ vs AMM', updated: '31s ago' },
  { pair: 'TON/STON', retail: '+0.18%', whale: '+0.41%', probe: 'Mixed route', updated: '2m ago' },
  { pair: 'TON/JUSDT', retail: '+0.31%', whale: '+1.12%', probe: 'Size-sensitive', updated: '4m ago' },
]

export default function App() {
  const [registerAck, setRegisterAck] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const [tweetCopy, setTweetCopy] = useState<'idle' | 'copied' | 'error'>('idle')
  const [topScrolled, setTopScrolled] = useState(false)
  const [apiOpen, setApiOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setTopScrolled(window.scrollY > 6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function onRegisterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setRegisterAck(true)
  }

  async function copySampleJson() {
    try {
      await navigator.clipboard.writeText(SAMPLE_ALERT_JSON)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 2200)
    } catch {
      setCopyState('error')
      window.setTimeout(() => setCopyState('idle'), 2800)
    }
  }

  async function copyTweetText() {
    try {
      await navigator.clipboard.writeText(SAMPLE_TWEET_TEXT)
      setTweetCopy('copied')
      window.setTimeout(() => setTweetCopy('idle'), 2200)
    } catch {
      setTweetCopy('error')
      window.setTimeout(() => setTweetCopy('idle'), 2800)
    }
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className={`topbar-wrap${topScrolled ? ' topbar-wrap--raised' : ''}`}>
        <header className="topbar">
          <a href="#main" className="brand">
            <span className="brand__dot" aria-hidden />
            <span>Best Route Alert</span>
          </a>
          <nav className="topbar__nav" aria-label="Primary">
            <a href="#outputs">Channels</a>
            <a href="#board">Route board</a>
            <a href="#tweet">Sample X</a>
            <a href="#feed">Sample alerts</a>
            <a href="#api">API sample</a>
          </nav>
        </header>
      </div>

      <main id="main" className="page">
        <section className="hero hero--light">
          <div className="hero-copy">
            <div className="hero-badge-wrap">
              <img src={botImage} alt="Best Route Alert bot" className="hero-badge" width={52} height={52} />
              <p className="eyebrow">TON · Omniston-class routing</p>
            </div>
            <h1>
              Public alerts when
              <br />
              <span className="h1-accent">route edge</span> meaningfully improves
            </h1>
            <p className="lead">
              We poll quoted net outcomes on tracked pairs and compare them to a <strong>conservative baseline</strong>{' '}
              (for example, the best single-venue AMM path without RFQ or solver composition). When the gap clears your
              threshold and the cooldown period has passed, we emit the same structured signal to <strong>X</strong>,{' '}
              <strong>Telegram</strong>, and a <strong>builder API</strong>. These are informational quote snapshots only,
              not trade advice.
            </p>
            <div className="hero-actions">
              <a className="btn btn--primary" href="#register">
                Request access
              </a>
              <a className="btn btn--secondary" href="#board">
                Route board
              </a>
            </div>
            <ul className="trust-list">
              <li>Quotes and route metadata only: no signing, no custody</li>
              <li>Thresholds + cooldowns to reduce noise</li>
              <li>Same alert shape to X, Telegram, and API consumers</li>
            </ul>
            <div className="hero-metrics" aria-label="Example production defaults">
              {metrics.map((m) => (
                <div key={m.label} className="metric-pill">
                  <span>{m.label}</span>
                  <strong>{m.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <aside id="register" className="register-card" aria-label="Register interest">
            <h2>Register interest</h2>
            <p className="register-sub">
              Waitlist-style form: you share which pairs matter to you and where alerts should go (X, Telegram, or API).
              Posts use the same structured route-quality format as the samples on this page when a threshold is met, not
              custom tweet copy from you. Production would store preferences and issue API keys or bot links.
            </p>
            <p className="register-clarify">Prototype only: nothing is saved or sent when you submit.</p>
            <form onSubmit={onRegisterSubmit}>
              <label>
                Pair set
                <input type="text" placeholder="TON/USDT, TON/STON, …" name="pairs" />
                <span className="field-hint">
                  Pairs you want monitored (comma-separated). Alert wording follows the samples below, not free-form
                  topics.
                </span>
              </label>
              <label>
                Email
                <input type="email" placeholder="you@example.com" name="email" autoComplete="email" />
              </label>
              <label>
                X handle
                <input type="text" placeholder="@yourhandle" name="x" />
                <span className="field-hint">For contact or where to follow; does not set what the bot would say.</span>
              </label>
              <label>
                Telegram
                <input type="text" placeholder="@channel or numeric chat ID" name="telegram" />
                <span className="field-hint">Optional: same alerts mirrored to Telegram.</span>
              </label>
              <label>
                Webhook URL (optional)
                <input type="url" placeholder="https://…" name="webhook" />
                <span className="field-hint">For Builder API tier: signed POST payloads.</span>
              </label>
              <fieldset className="channel-picks">
                <legend>Channels</legend>
                <label className="check">
                  <input type="checkbox" name="ch_x" defaultChecked /> X posts
                </label>
                <label className="check">
                  <input type="checkbox" name="ch_tg" defaultChecked /> Telegram
                </label>
                <label className="check">
                  <input type="checkbox" name="ch_api" /> Builder API / webhook
                </label>
              </fieldset>
              <label>
                Alert threshold (%)
                <input type="text" placeholder="0.25" name="threshold" />
              </label>
              {registerAck && (
                <p className="register-feedback" role="status">
                  Thanks. Prototype only; nothing was stored or sent.
                </p>
              )}
              <button type="submit" className="register-submit">
                Submit (prototype)
              </button>
            </form>
          </aside>
        </section>

        <section id="outputs" className="panel">
          <h2>Five delivery pillars</h2>
          <p className="panel-lede">
            Public alerts, Telegram, and a builder API in one stack, without turning the product into a swap interface.
          </p>
          <div className="pillars">
            {outputs.map((o) => (
              <article key={o.title}>
                <h3>{o.title}</h3>
                <p>{o.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="board" className="panel">
          <h2>Route quality board (mock)</h2>
          <p className="panel-lede">
            Public verification surface: recent edge vs baseline per pair and probe size. A live service would refresh this
            table from stored snapshots.
          </p>
          <div className="table-wrap">
            <table className="route-table">
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Retail probe</th>
                  <th>Whale probe</th>
                  <th>Signal</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {routeBoardRows.map((r) => (
                  <tr key={r.pair}>
                    <td className="mono">{r.pair}</td>
                    <td>{r.retail}</td>
                    <td>{r.whale}</td>
                    <td>{r.probe}</td>
                    <td className="muted">{r.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="tweet" className="panel tweet-panel">
          <div className="panel-head-row">
            <h2>Sample X post</h2>
            <button type="button" className="btn btn--small btn--ghost" onClick={() => void copyTweetText()}>
              {tweetCopy === 'copied' ? 'Copied' : tweetCopy === 'error' ? 'Copy failed' : 'Copy post text'}
            </button>
          </div>
          <p className="panel-lede">
            Mock of a real bot post: short headline, scannable numbers, and fields aligned with the JSON alert shape used
            for X, Telegram, and integrations.
          </p>

          <article className="x-post" aria-label="Example X post">
            <header className="x-post__head">
              <div className="x-post__avatar" aria-hidden>
                BR
              </div>
              <div className="x-post__who">
                <div className="x-post__name-row">
                  <span className="x-post__name">Best Route Alert</span>
                  <span className="x-post__verified" title="Automation / bot account (mock)" aria-hidden />
                </div>
                <div className="x-post__handle">@BestRouteAlert · TON</div>
              </div>
              <time className="x-post__time" dateTime="2026-04-16T12:04:00">
                12:04 PM · Apr 16, 2026
              </time>
            </header>

            <div className="x-post__body">
              <p className="x-post__hook">
                <span className="x-post__emoji" aria-hidden>
                  📈
                </span>{' '}
                Route quality <strong>up</strong>: <span className="x-post__pair">TON/USDT</span>{' '}
                <span className="x-post__pill">whale probe</span>
              </p>
              <p className="x-post__lead">
                Whale size now beats our <strong>AMM baseline</strong> by <strong>~74 bps</strong>{' '}
                <span className="x-post__muted">(~+0.74% net)</span>
              </p>
              <dl className="x-post__facts">
                <div>
                  <dt>Winner</dt>
                  <dd>RFQ route</dd>
                </div>
                <div>
                  <dt>Baseline</dt>
                  <dd>Best single-venue AMM</dd>
                </div>
                <div>
                  <dt>Poll (UTC)</dt>
                  <dd className="mono">2026-04-16 12:00:10</dd>
                </div>
              </dl>
              <p className="x-post__tags">
                <span>#TON</span> <span>#DeFi</span> <span>#Omniston</span>
              </p>
            </div>

            <footer className="x-post__foot">
              <span className="x-post__hint">Demo layout (not a live account)</span>
              <div className="x-post__actions" aria-hidden>
                <span>💬 12</span>
                <span>🔁 48</span>
                <span>♥ 214</span>
                <span>📊 4.1K</span>
              </div>
            </footer>
          </article>
        </section>

        <section id="feed" className="panel">
          <h2>Sample alerts</h2>
          <p className="panel-lede">
            Illustrative payloads. The same structure would go to X, Telegram, and API consumers.
          </p>
          <ul className="feed">
            {mockedEvents.map((item) => (
              <li key={`${item.pair}-${item.eta}`}>
                <div className="feed__head">
                  <strong>{item.pair}</strong>
                  <small>{item.eta}</small>
                </div>
                <span className="gain">{item.move}</span>
                <p>{item.note}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="api" className="panel api-panel">
          <h2>Builder API</h2>
          <p className="panel-lede api-panel__intro">
            Sample JSON for alerts and webhooks. Field names are illustrative.
          </p>
          <button
            type="button"
            className="btn btn--secondary api-panel__toggle"
            aria-expanded={apiOpen}
            aria-controls="api-sample-panel"
            id="api-sample-toggle"
            onClick={() => setApiOpen((o) => !o)}
          >
            {apiOpen ? 'Hide sample payload' : 'Show sample payload'}
          </button>
          {apiOpen && (
            <div id="api-sample-panel" className="api-panel__reveal" role="region" aria-labelledby="api-sample-toggle">
              <div className="code-block">
                <div className="code-block__bar">
                  <span className="code-block__label">application/json</span>
                  <button type="button" className="btn btn--small btn--ghost" onClick={() => void copySampleJson()}>
                    {copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy JSON'}
                  </button>
                </div>
                <pre className="code-block__pre">
                  <code>{SAMPLE_ALERT_JSON}</code>
                </pre>
              </div>
            </div>
          )}
        </section>

        <footer className="footer-note">
          Independent prototype. Not affiliated with STON.fi, Omniston, or the TON Foundation. No live posting or backend
          in this repository yet.
        </footer>
      </main>
    </>
  )
}
