import { useState } from 'react'
import { AI_TOOLS } from '../../utils/constants'

export default function AIPanel({ open, onClose, jobDesc, ai }) {
  const [customP, setCustomP] = useState('')
  const { loading, result, error, activeTool, run, applyResult, clearResult, rerun } = ai

  const handleApply = () => { const o = applyResult(); if (o) onClose() }

  return (
    <div className={'ai-panel' + (open ? ' open' : '')}>
      <div className="ai-panel-hd">
        <span className="ai-panel-title">✨ AI Writing Assistant</span>
        <button className="xbtn" onClick={onClose}>✕</button>
      </div>
      <div className="ai-body">
        <div className="ai-sec">
          <div className="ai-sec-lbl">Writing Tools</div>
          {AI_TOOLS.map(t => (
            <button key={t.id} className="aitool" onClick={() => run(t.id)} disabled={loading}>
              <span className="aitool-icon">{t.icon}</span>
              <span><span>{t.label}</span><span className="aitool-sub">{t.desc}</span></span>
            </button>
          ))}
        </div>
        <div className="ai-sec">
          <div className="ai-sec-lbl">Job Match</div>
          <button className="aitool" onClick={() => run('tailor', '', { jobDesc })} disabled={loading}>
            <span className="aitool-icon">🔍</span>
            <span><span>Tailor to Job Description</span><span className="aitool-sub">Paste JD in Extras tab first</span></span>
          </button>
        </div>
        <div className="ai-sec">
          <div className="ai-sec-lbl">Custom Prompt</div>
          <textarea value={customP} onChange={e => setCustomP(e.target.value)} placeholder="Ask anything about your resume…" rows={3} style={{ marginBottom: 6 }} />
          <button className="aitool" onClick={() => run('custom', '', { customP })} disabled={loading || !customP.trim()}>
            <span className="aitool-icon">🚀</span><span>Run Custom Prompt</span>
          </button>
        </div>
        {(loading || result || error) && (
          <div className="ai-sec">
            <div className="ai-sec-lbl">Result</div>
            <div className="ai-res">
              {loading && <span>Generating<span className="ldots" /></span>}
              {error   && <span style={{ color: '#e87a7a' }}>{error}</span>}
              {!loading && !error && result}
            </div>
            {!loading && result && (
              <div className="ai-acts">
                <button className="ai-act ai-apply" onClick={handleApply}>✓ Apply</button>
                <button className="ai-act ai-redo"  onClick={() => rerun('', { jobDesc, customP })}>↺ Redo</button>
                <button className="ai-act ai-dis"   onClick={clearResult}>✕</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}