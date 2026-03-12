import { useState } from 'react'
import { calcATS, calcCompleteness } from '../../utils/ats'
import useResumeStore from '../../hooks/useResumeStore'

/* ─────────────────────────────────────────────────────────────
   DeepSeek via Anthropic-compatible endpoint
   Base: https://api.deepseek.com/anthropic/v1/messages
   ───────────────────────────────────────────────────────────── */
async function callDeepSeek(userPrompt) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (!apiKey || apiKey === 'your_deepseek_api_key_here') {
    throw new Error(
      'Missing API key.\n' +
      '1. Get a free key → https://platform.deepseek.com/api-keys\n' +
      '2. Add  VITE_DEEPSEEK_API_KEY=sk-...  to .env.local\n' +
      '3. Restart dev server:  npm run dev'
    )
  }

  const res = await fetch('https://api.deepseek.com/anthropic/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',  // required by compat layer, value ignored
    },
    body: JSON.stringify({
      model:      'deepseek-chat',
      max_tokens: 1500,
      system:
        'You are an expert ATS resume optimizer. ' +
        'Return ONLY raw JSON — no markdown, no backticks, no explanation before or after.',
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!res.ok) {
    let msg = `DeepSeek API error ${res.status}`
    try { const e = await res.json(); msg = e?.error?.message || msg } catch (_) {}
    throw new Error(msg)
  }

  const data = await res.json()
  return data?.content?.map(b => b.text || '').join('') || ''
}

/* ─── Safe JSON extractor ────────────────────────────────────── */
function extractJSON(text) {
  try { return JSON.parse(text.trim()) } catch (_) {}
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fence) { try { return JSON.parse(fence[1].trim()) } catch (_) {} }
  const s = text.indexOf('{'), e = text.lastIndexOf('}')
  if (s !== -1 && e > s) { try { return JSON.parse(text.slice(s, e + 1)) } catch (_) {} }
  throw new Error(
    'Could not parse AI response as JSON.\n\nResponse preview:\n' + text.slice(0, 400)
  )
}

/* ─── Prompt builder ─────────────────────────────────────────── */
function buildOptimizePrompt(resumeData, jobDesc) {
  const p        = resumeData.personal
  const expStr   = resumeData.experience
    .map(e => `- ${e.role || '?'} at ${e.company || '?'}: ${(e.description || '').slice(0, 200)}`)
    .join('\n') || '(none)'
  const allSkills = [
    ...resumeData.skills.technical,
    ...resumeData.skills.soft,
    ...resumeData.skills.languages,
  ].join(', ') || '(none)'

  return `Analyze the job description and candidate resume below. Return ONLY this JSON — no extra text:

JOB DESCRIPTION:
${jobDesc.slice(0, 2000)}

CANDIDATE RESUME:
Name: ${p.firstName || ''} ${p.lastName || ''}
Title: ${p.title || '(none)'}
Summary: ${p.summary || '(none)'}
Skills: ${allSkills}
Experience:
${expStr}

Required JSON shape (fill with real values, no placeholders):
{
  "missingKeywords": ["up to 8 keywords from JD not in resume"],
  "suggestedTitle": "job title rewritten to match JD wording exactly",
  "improvedSummary": "2-3 sentence summary using exact keywords from JD",
  "suggestedSkills": ["5-8 specific skills from JD the candidate is missing"],
  "keyChanges": ["concrete change 1", "concrete change 2", "concrete change 3"],
  "overallTip": "one actionable sentence"
}`
}

/* ═══════════════════════════════════════════════════════════════
   ATS PANEL COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function ATSPanel({ open, onClose, jobDesc }) {
  const data          = useResumeStore(s => s.data)
  const setPersonal   = useResumeStore(s => s.setPersonal)
  const addSkillsBulk = useResumeStore(s => s.addSkillsBulk)

  const [tab,     setTab]     = useState('score')
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState(null)
  const [applied, setApplied] = useState({})
  const [allDone, setAllDone] = useState(false)

  if (!open) return null

  const comp = calcCompleteness(data)
  const { score, checks, found, missing } = calcATS(data, jobDesc)
  const ringColor = score >= 80 ? '#7ab87a' : score >= 60 ? '#e8c97a' : '#e87a7a'
  const circ      = 2 * Math.PI * 44

  /* ── Analyze ── */
  const handleAnalyze = async () => {
    if (!jobDesc?.trim()) {
      setError('Paste a job description in the Extras tab first.')
      return
    }
    setLoading(true); setResult(null); setError(null); setApplied({}); setAllDone(false)
    try {
      const raw    = await callDeepSeek(buildOptimizePrompt(data, jobDesc))
      const parsed = extractJSON(raw)
      setResult(parsed)
      setTab('optimize')
    } catch (err) {
      setError(err.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  /* ── Apply ── */
  const applyTitle   = () => { if (!result?.suggestedTitle)         return; setPersonal('title',   result.suggestedTitle);  setApplied(a => ({...a, title:   true})) }
  const applySummary = () => { if (!result?.improvedSummary)        return; setPersonal('summary', result.improvedSummary); setApplied(a => ({...a, summary: true})) }
  const applySkills  = () => { if (!result?.suggestedSkills?.length) return; addSkillsBulk('technical', result.suggestedSkills); setApplied(a => ({...a, skills: true})) }
  const applyAll     = () => { applyTitle(); applySummary(); applySkills(); setAllDone(true) }

  /* ── Render ── */
  return (
    <div style={{
      position: 'fixed', left: 330, top: 52,
      width: 320, maxHeight: 'calc(100vh - 70px)',
      background: '#0f0e0d', border: '1px solid #2a2418',
      borderRadius: 7, zIndex: 140,
      boxShadow: '0 14px 44px rgba(0,0,0,.7)',
      animation: 'fadeUp .2s ease',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Header */}
      <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid #2a2418', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <span style={{ fontFamily: 'Playfair Display,serif', fontSize: '.95rem', color: '#7ab87a' }}>ATS Optimizer</span>
          <span style={{ marginLeft: 8, fontSize: '.58rem', background: '#1a2a1a', border: '1px solid #2a4a2a', color: '#5a8a5a', borderRadius: 3, padding: '1px 5px', fontFamily: 'DM Mono,monospace' }}>DeepSeek</span>
        </div>
        <button className="xbtn" onClick={onClose}>✕</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #2a2418', flexShrink: 0 }}>
        {[['score','📊 Score'], ['optimize','🎯 Optimize']].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: '8px', border: 'none', background: 'none',
            color: tab === id ? '#7ab87a' : '#5a4a38',
            borderBottom: `2px solid ${tab === id ? '#7ab87a' : 'transparent'}`,
            fontSize: '.71rem', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'DM Mono,monospace', letterSpacing: '.04em',
          }}>{lbl}</button>
        ))}
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: 13 }}>

        {/* ════ SCORE TAB ════ */}
        {tab === 'score' && (
          <>
            {/* Donut */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <svg width="108" height="108" viewBox="0 0 108 108">
                <circle cx="54" cy="54" r="44" fill="none" stroke="#1a1915" strokeWidth="8" />
                <circle cx="54" cy="54" r="44" fill="none" stroke={ringColor} strokeWidth="8"
                  strokeLinecap="round" strokeDasharray={circ}
                  strokeDashoffset={circ - (circ * score / 100)}
                  transform="rotate(-90 54 54)"
                  style={{ transition: 'stroke-dashoffset 1s ease' }} />
                <text x="54" y="49" textAnchor="middle"
                  style={{ fill: '#e8e0d0', fontFamily: 'Playfair Display,serif', fontSize: '1.6rem', fontWeight: 700 }}>
                  {score}
                </text>
                <text x="54" y="63" textAnchor="middle"
                  style={{ fill: '#6a5a3a', fontFamily: 'DM Mono,monospace', fontSize: '.48rem', letterSpacing: '.1em' }}>
                  ATS SCORE
                </text>
              </svg>
            </div>

            {/* Completeness bar */}
            <div style={{ marginBottom: 13 }}>
              <div style={{ fontSize: '.62rem', color: '#6a5a3a', display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontFamily: 'DM Mono,monospace' }}>
                <span>Completeness</span>
                <span style={{ color: comp >= 70 ? '#7ab87a' : '#e8c97a' }}>{comp}%</span>
              </div>
              <div style={{ background: '#1a1915', borderRadius: 3, height: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${comp}%`, borderRadius: 3, background: 'linear-gradient(90deg,#e8c97a,#7ab87a)', transition: 'width .6s' }} />
              </div>
            </div>

            {/* Checklist */}
            {['contact','content','format','keywords'].map(cat => {
              const cc   = checks.filter(c => c.cat === cat)
              if (!cc.length) return null
              const pass = cc.filter(c => c.ok).length
              return (
                <div key={cat} style={{ marginBottom: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={CatLbl}>{cat}</span>
                    <span style={{ ...CatLbl, color: pass === cc.length ? '#7ab87a' : '#e8c97a', textTransform: 'none' }}>{pass}/{cc.length}</span>
                  </div>
                  {cc.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4, fontSize: '.7rem', lineHeight: 1.4, alignItems: 'flex-start' }}>
                      <span style={{ color: c.ok ? '#7ab87a' : '#e87a7a', flexShrink: 0 }}>{c.ok ? '✓' : '✗'}</span>
                      <span style={{ color: c.ok ? '#6a6a5a' : '#c8b880' }}>{c.msg}</span>
                    </div>
                  ))}
                </div>
              )
            })}

            {/* Keyword chips */}
            {found.length > 0 && (
              <div style={{ marginBottom: 9 }}>
                <div style={CatLbl}>Keywords Found</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>
                  {found.map((k, i) => <Chip key={i} v="green">{k}</Chip>)}
                </div>
              </div>
            )}
            {missing.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={CatLbl}>Missing Keywords</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>
                  {missing.map((k, i) => <Chip key={i} v="red">{k}</Chip>)}
                </div>
              </div>
            )}

            {/* Error box */}
            {error && <ErrBox msg={error} onRetry={handleAnalyze} />}

            {/* AI CTA */}
            <AnalyzeBtn loading={loading} hasJD={!!jobDesc?.trim()} onClick={handleAnalyze} />

            {!jobDesc?.trim() && (
              <p style={{ marginTop: 7, fontSize: '.62rem', color: '#4a4028', textAlign: 'center', fontFamily: 'DM Mono,monospace', lineHeight: 1.7 }}>
                Go to <strong style={{ color: '#c8b880' }}>Extras</strong> tab → paste the job description → return here
              </p>
            )}
          </>
        )}

        {/* ════ OPTIMIZE TAB ════ */}
        {tab === 'optimize' && (
          <>
            {/* Empty */}
            {!result && !loading && !error && (
              <div style={{ textAlign: 'center', padding: '34px 14px' }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>🎯</div>
                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.7rem', color: '#4a4028', lineHeight: 1.8, marginBottom: 16 }}>
                  {jobDesc?.trim()
                    ? 'Run AI analysis to get DeepSeek-powered resume optimizations tailored to this specific job.'
                    : 'Paste a job description in the Extras tab, then come back here.'}
                </div>
                {jobDesc?.trim() && (
                  <button onClick={handleAnalyze} style={{ padding: '9px 20px', background: '#1c3a1c', border: '1px solid #3a6a3a', borderRadius: 5, color: '#7ab87a', fontSize: '.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Mono,monospace' }}>
                    🎯 Analyze Now
                  </button>
                )}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '44px 16px' }}>
                <Spin size={28} />
                <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.7rem', color: '#5a5040', lineHeight: 1.9, marginTop: 16 }}>
                  DeepSeek is reading the JD…<br />Crafting tailored optimizations…
                </div>
              </div>
            )}

            {/* Error */}
            {error && !loading && <ErrBox msg={error} onRetry={handleAnalyze} />}

            {/* Results */}
            {result && !loading && (
              <>
                {/* Apply all */}
                {!allDone ? (
                  <button onClick={applyAll} style={{
                    width: '100%', padding: '10px', marginBottom: 14,
                    background: '#1c3a1c', border: '1px solid #4a8a4a', borderRadius: 6,
                    color: '#7ab87a', fontSize: '.74rem', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'DM Mono,monospace',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    transition: 'background .2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#264a26'}
                    onMouseLeave={e => e.currentTarget.style.background = '#1c3a1c'}>
                    ✓ Apply All Optimizations to Resume
                  </button>
                ) : (
                  <div style={{ textAlign: 'center', padding: '8px', marginBottom: 14, background: '#0a1e0a', border: '1px solid #2a5a2a', borderRadius: 6, color: '#7ab87a', fontSize: '.7rem', fontFamily: 'DM Mono,monospace' }}>
                    ✓ All optimizations applied to your resume!
                  </div>
                )}

                {/* Key changes */}
                {result.keyChanges?.length > 0 && (
                  <div style={{ marginBottom: 13 }}>
                    <div style={CatLbl}>What Will Change</div>
                    <div style={{ marginTop: 5 }}>
                      {result.keyChanges.map((c, i) => (
                        <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 5, fontSize: '.7rem', color: '#c8b880', lineHeight: 1.5 }}>
                          <span style={{ color: '#7ab87a', flexShrink: 0 }}>→</span>
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Title */}
                {result.suggestedTitle && (
                  <Card label="Optimized Title" icon="🏷" applied={applied.title} onApply={applyTitle}>
                    <div style={{ fontSize: '.76rem', color: '#e8e0d0', fontWeight: 600, lineHeight: 1.4 }}>{result.suggestedTitle}</div>
                  </Card>
                )}

                {/* Summary */}
                {result.improvedSummary && (
                  <Card label="ATS-Optimized Summary" icon="📝" applied={applied.summary} onApply={applySummary}>
                    <div style={{ fontSize: '.7rem', color: '#c8b880', lineHeight: 1.65 }}>{result.improvedSummary}</div>
                  </Card>
                )}

                {/* Skills */}
                {result.suggestedSkills?.length > 0 && (
                  <Card label="Skills to Add" icon="🎯" applied={applied.skills} onApply={applySkills}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {result.suggestedSkills.map((s, i) => <Chip key={i} v="green">{s}</Chip>)}
                    </div>
                  </Card>
                )}

                {/* Missing keywords */}
                {result.missingKeywords?.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={CatLbl}>Work These Into Descriptions</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5 }}>
                      {result.missingKeywords.map((k, i) => <Chip key={i} v="amber">{k}</Chip>)}
                    </div>
                  </div>
                )}

                {/* Tip */}
                {result.overallTip && (
                  <div style={{ padding: '9px 10px', background: '#141210', border: '1px solid #2a2418', borderRadius: 5, fontSize: '.69rem', color: '#c8b880', lineHeight: 1.6 }}>
                    💡 <strong style={{ color: '#e8c97a' }}>Tip: </strong>{result.overallTip}
                  </div>
                )}

                <button onClick={handleAnalyze} style={{ width: '100%', marginTop: 10, padding: '7px', background: 'none', border: '1px solid #2a2418', borderRadius: 4, color: '#4a3a28', fontSize: '.66rem', cursor: 'pointer', fontFamily: 'DM Mono,monospace', transition: 'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c8b880'}
                  onMouseLeave={e => e.currentTarget.style.color = '#4a3a28'}>
                  ↺ Re-analyze
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* ─── Atoms ──────────────────────────────────────────────────── */
const CatLbl = {
  fontSize: '.58rem', fontWeight: 700, color: '#4a3a28',
  textTransform: 'uppercase', letterSpacing: '.1em', fontFamily: 'DM Mono,monospace',
}

const CHIP_STYLES = {
  green: { bg: '#1a2a1a', border: '#2a4a2a', color: '#7ab87a' },
  red:   { bg: '#2a1a1a', border: '#4a2a2a', color: '#e87a7a' },
  amber: { bg: '#251a08', border: '#4a3010', color: '#e8c97a' },
}
function Chip({ children, v }) {
  const s = CHIP_STYLES[v] || CHIP_STYLES.amber
  return (
    <span style={{ padding: '2px 7px', borderRadius: 10, fontSize: '.62rem', background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontFamily: 'DM Mono,monospace' }}>
      {children}
    </span>
  )
}

function Spin({ size = 14 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, flexShrink: 0,
      border: `${size > 18 ? 3 : 2}px solid #243a24`,
      borderTopColor: '#7ab87a', borderRadius: '50%',
      animation: 'spin 0.9s linear infinite',
    }} />
  )
}

function ErrBox({ msg, onRetry }) {
  return (
    <div style={{ marginBottom: 10, padding: '10px 11px', background: '#1e0808', border: '1px solid #5a1a1a', borderRadius: 5 }}>
      <div style={{ fontSize: '.69rem', color: '#e87a7a', fontWeight: 700, marginBottom: 4 }}>⚠ Error</div>
      <div style={{ fontSize: '.66rem', color: '#c87a7a', lineHeight: 1.65, wordBreak: 'break-word', whiteSpace: 'pre-wrap', marginBottom: 8 }}>{msg}</div>
      <button onClick={onRetry} style={{ width: '100%', padding: '6px', background: '#2a1515', border: '1px solid #5a2a2a', borderRadius: 4, color: '#e87a7a', fontSize: '.67rem', cursor: 'pointer', fontFamily: 'DM Mono,monospace' }}>
        ↺ Try Again
      </button>
    </div>
  )
}

function AnalyzeBtn({ loading, hasJD, onClick }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      width: '100%', padding: '10px', borderRadius: 6,
      background: loading ? '#141e14' : '#1c3a1c',
      border: `1px solid ${loading ? '#1e2e1e' : '#3a6a3a'}`,
      color: loading ? '#4a7a4a' : '#7ab87a',
      fontSize: '.75rem', fontWeight: 700,
      cursor: loading ? 'default' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontFamily: 'DM Mono,monospace', transition: 'all .2s',
    }}>
      {loading ? <><Spin /> Analyzing…</> : <>🎯 {hasJD ? 'AI Optimize for This JD' : 'Add JD in Extras tab first'}</>}
    </button>
  )
}

function Card({ label, icon, applied, onApply, children }) {
  return (
    <div style={{
      background: '#141210',
      border: `1px solid ${applied ? '#2a5a2a' : '#252018'}`,
      borderRadius: 6, padding: '9px 10px', marginBottom: 10,
      transition: 'border-color .3s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
        <span style={{ fontSize: '.6rem', fontWeight: 700, color: '#4a3a28', textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: 'DM Mono,monospace' }}>
          {icon} {label}
        </span>
        <button onClick={onApply} disabled={applied} style={{
          padding: '3px 9px', borderRadius: 3, fontSize: '.61rem', fontWeight: 600,
          cursor: applied ? 'default' : 'pointer', fontFamily: 'DM Mono,monospace',
          background: applied ? '#0a1e0a' : '#1c3a1c',
          border: `1px solid ${applied ? '#2a5a2a' : '#2a4a2a'}`,
          color: applied ? '#4a8a4a' : '#7ab87a',
          transition: 'all .2s',
        }}>
          {applied ? '✓ Applied' : '+ Apply'}
        </button>
      </div>
      {children}
    </div>
  )
}