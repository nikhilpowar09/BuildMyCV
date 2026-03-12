import { useState } from 'react'
import useResumeStore from '../../hooks/useResumeStore'

function timeAgo(ts) {
  const secs = Math.floor((Date.now() - ts) / 1000)
  if (secs < 60)   return 'just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return `${Math.floor(secs / 86400)}d ago`
}

const TEMPLATE_COLORS = {
  classic:   '#e8c97a',
  modern:    '#60a8d0',
  minimal:   '#c8c8c8',
  executive: '#d4956a',
  tech:      '#3fb950',
}

export default function RecentResumes({ open, onClose }) {
  const savedResumes   = useResumeStore(s => s.savedResumes)
  const activeId       = useResumeStore(s => s.activeId)
  const loadResume     = useResumeStore(s => s.loadResume)
  const deleteResume   = useResumeStore(s => s.deleteResume)
  const duplicateResume = useResumeStore(s => s.duplicateResume)
  const newResume      = useResumeStore(s => s.newResume)
  const saveResume     = useResumeStore(s => s.saveResume)
  const currentData    = useResumeStore(s => s.data)

  const [confirmDelete, setConfirmDelete] = useState(null)
  const [saveName, setSaveName]           = useState('')
  const [showSaveInput, setShowSaveInput] = useState(false)

  const handleSave = () => {
    saveResume(saveName.trim() || undefined)
    setSaveName('')
    setShowSaveInput(false)
  }

  const name = currentData.personal.firstName
    ? `${currentData.personal.firstName} ${currentData.personal.lastName}`.trim()
    : 'Untitled'

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: 540, maxHeight: '82vh', background: '#0f0e0c', border: '1px solid #2a2418',
        borderRadius: 10, display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 80px rgba(0,0,0,.9)', overflow: 'hidden',
        animation: 'fadeUp .25s ease',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid #2a2418', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.05rem', color: '#e8e0d0' }}>Recent Resumes</div>
            <div style={{ fontSize: '.62rem', color: '#5a4a38', fontFamily: 'DM Mono,monospace', marginTop: 2 }}>{savedResumes.length} / 10 saved</div>
          </div>
          <button className="xbtn" onClick={onClose}>✕</button>
        </div>

        {/* Save current */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #2a2418', flexShrink: 0, background: '#0c0b09' }}>
          {showSaveInput ? (
            <div style={{ display: 'flex', gap: 7 }}>
              <input type="text" value={saveName} onChange={e => setSaveName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave()}
                placeholder={`${name} Resume`} style={{ flex: 1 }} autoFocus />
              <button onClick={handleSave} style={{ padding: '7px 13px', background: '#e8c97a', border: 'none', borderRadius: 4, color: '#0f0e0c', fontSize: '.75rem', fontWeight: 700, cursor: 'pointer' }}>Save</button>
              <button onClick={() => setShowSaveInput(false)} className="xbtn">✕</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowSaveInput(true)}
                style={{ flex: 1, padding: '7px 12px', background: '#1c1a0e', border: '1px solid #3a3018', borderRadius: 5, color: '#e8c97a', fontSize: '.74rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                💾 Save Current Resume{activeId ? ' (Update)' : ''}
              </button>
              <button onClick={newResume}
                style={{ padding: '7px 13px', background: '#151310', border: '1px solid #2a2418', borderRadius: 5, color: '#8a9aec', fontSize: '.74rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                + New
              </button>
            </div>
          )}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {savedResumes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '44px 20px', color: '#4a4028' }}>
              <div style={{ fontSize: '2rem', marginBottom: 10 }}>📄</div>
              <div style={{ fontFamily: 'DM Mono,monospace', fontSize: '.72rem', lineHeight: 1.7 }}>
                No saved resumes yet.<br />Fill out the form and hit Save.
              </div>
            </div>
          ) : (
            savedResumes.map(r => (
              <div key={r.id}
                style={{ padding: '11px 16px', borderBottom: '1px solid #1a1810', display: 'flex', alignItems: 'center', gap: 12, background: r.id === activeId ? '#16140a' : 'transparent', transition: 'background .15s' }}
                onMouseEnter={e => { if (r.id !== activeId) e.currentTarget.style.background = '#121008' }}
                onMouseLeave={e => { e.currentTarget.style.background = r.id === activeId ? '#16140a' : 'transparent' }}>

                {/* Template color badge */}
                <div style={{ width: 32, height: 40, borderRadius: 4, background: '#1a1810', border: `2px solid ${TEMPLATE_COLORS[r.template] || '#4a3a28'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '.52rem', color: TEMPLATE_COLORS[r.template] || '#4a3a28', textAlign: 'center', lineHeight: 1.2, textTransform: 'uppercase' }}>
                    {r.template.slice(0, 3)}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.82rem', color: '#e8e0d0', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.name}
                    {r.id === activeId && <span style={{ marginLeft: 7, fontSize: '.6rem', color: '#e8c97a', fontFamily: 'DM Mono,monospace', background: '#2a2200', border: '1px solid #4a3800', borderRadius: 3, padding: '1px 5px' }}>active</span>}
                  </div>
                  <div style={{ fontSize: '.65rem', color: '#5a4a38', marginTop: 2, fontFamily: 'DM Mono,monospace' }}>
                    {r.data.personal.title || 'No title'} · {timeAgo(r.savedAt)}
                  </div>
                </div>

                {/* Actions */}
                {confirmDelete === r.id ? (
                  <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                    <button onClick={() => { deleteResume(r.id); setConfirmDelete(null) }}
                      style={{ padding: '4px 9px', background: '#2a1515', border: '1px solid #4a2a2a', color: '#e87a7a', borderRadius: 3, fontSize: '.65rem', cursor: 'pointer' }}>Delete</button>
                    <button onClick={() => setConfirmDelete(null)}
                      style={{ padding: '4px 9px', background: '#1a1915', border: '1px solid #2a2418', color: '#6a5a3a', borderRadius: 3, fontSize: '.65rem', cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                    <button onClick={() => loadResume(r.id)}
                      style={{ padding: '5px 10px', background: '#1c1a0e', border: '1px solid #3a3018', color: '#e8c97a', borderRadius: 4, fontSize: '.68rem', fontWeight: 600, cursor: 'pointer' }}>
                      Load
                    </button>
                    <button onClick={() => duplicateResume(r.id)}
                      style={{ padding: '5px 8px', background: '#1a1a2a', border: '1px solid #2a2a4a', color: '#8a9aec', borderRadius: 4, fontSize: '.68rem', cursor: 'pointer' }} title="Duplicate">
                      ⧉
                    </button>
                    <button onClick={() => setConfirmDelete(r.id)}
                      style={{ padding: '5px 8px', background: '#1a1515', border: '1px solid #2a1a1a', color: '#6a4040', borderRadius: 4, fontSize: '.68rem', cursor: 'pointer' }} title="Delete">
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{ padding: '9px 16px', borderTop: '1px solid #2a2418', flexShrink: 0 }}>
          <div style={{ fontSize: '.62rem', color: '#4a3a28', fontFamily: 'DM Mono,monospace', textAlign: 'center' }}>
            Resumes are saved in this browser session · Up to 10 saved
          </div>
        </div>
      </div>
    </div>
  )
}