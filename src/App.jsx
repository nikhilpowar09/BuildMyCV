import { useState, useCallback, useRef } from 'react'
import useResumeStore from './hooks/useResumeStore'
import { useAIAssistant } from './hooks/useAI'
import { calcCompleteness } from './utils/ats'
import { exportToPDF } from './utils/pdf'
import { TEMPLATES, ACCENTS, STEPS, SOCIAL_META } from './utils/constants'
import { Classic, Modern, Minimal, Executive, Tech } from './components/templates'
import AIPanel from './components/panels/AIPanel'
import ATSPanel from './components/panels/ATSPanel'
import RecentResumes from './components/panels/RecentResumes'
import Toast from './components/ui/Toast'
import {
  ProfileStep, ExperienceStep, EducationStep,
  SkillsStep, ProjectsStep, ExtrasStep,
} from './components/form/FormSteps'



function InlineEditPanel({ field, label, value, type, onSave, onClose }) {
  const [val, setVal] = useState(value || '')
  const ref = useRef(null)

  const save = () => { onSave(val); onClose() }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: 420, background: '#0f0e0c', border: '1px solid #3a3018',
        borderRadius: 8, padding: '18px 18px 16px',
        boxShadow: '0 20px 60px rgba(0,0,0,.8)',
        animation: 'fadeUp .2s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '.7rem', color: '#e8c97a', textTransform: 'uppercase', letterSpacing: '.1em' }}>
            ✏ Edit {label}
          </span>
          <button className="xbtn" onClick={onClose}>✕</button>
        </div>
        {type === 'textarea' ? (
          <textarea ref={ref} value={val} onChange={e => setVal(e.target.value)} rows={5} autoFocus style={{ width: '100%' }} />
        ) : (
          <input ref={ref} type="text" value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && save()} autoFocus style={{ width: '100%' }} />
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button onClick={save} style={{ flex: 1, padding: '8px', background: '#e8c97a', border: 'none', borderRadius: 4, color: '#0f0e0c', fontWeight: 700, fontSize: '.78rem', cursor: 'pointer' }}>
            Save
          </button>
          <button onClick={onClose} style={{ padding: '8px 14px', background: '#1a1915', border: '1px solid #2a2418', borderRadius: 4, color: '#6a5a3a', fontSize: '.78rem', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Skill Edit Panel ───────────────────────────────────────── */
function SkillEditPanel({ onClose }) {
  const skills      = useResumeStore(s => s.data.skills)
  const addSkill    = useResumeStore(s => s.addSkill)
  const removeSkill = useResumeStore(s => s.removeSkill)
  const [inputs, setInputs] = useState({ technical: '', soft: '', languages: '' })

  const handleAdd = cat => {
    const v = inputs[cat].trim(); if (!v) return
    addSkill(cat, v); setInputs(s => ({ ...s, [cat]: '' }))
  }

  const CATS = [
    { cat: 'technical', label: '⚙ Technical', chipColor: '#7ab87a' },
    { cat: 'soft',      label: '🧠 Soft',       chipColor: '#8a9aec' },
    { cat: 'languages', label: '🌐 Languages',  chipColor: '#d4956a' },
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: 480, maxHeight: '80vh', background: '#0f0e0c', border: '1px solid #3a3018', borderRadius: 8, display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,.8)', animation: 'fadeUp .2s ease' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #2a2418', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '.7rem', color: '#e8c97a', textTransform: 'uppercase', letterSpacing: '.1em' }}>✏ Edit Skills</span>
          <button className="xbtn" onClick={onClose}>✕</button>
        </div>
        <div style={{ overflowY: 'auto', padding: 16 }}>
          {CATS.map(({ cat, label, chipColor }) => (
            <div key={cat} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '.72rem', fontWeight: 600, color: '#e8e0d0', marginBottom: 7 }}>{label}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 7 }}>
                {skills[cat].map((s, i) => (
                  <span key={i} style={{ background: '#161410', border: `1px solid #2a2418`, color: chipColor, padding: '3px 8px', borderRadius: 12, fontSize: '.7rem', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'DM Mono,monospace' }}>
                    {s}
                    <button onClick={() => removeSkill(cat, i)} style={{ background: 'none', border: 'none', color: '#6a4a20', fontSize: '.75rem', cursor: 'pointer', padding: 0 }}>✕</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input type="text" value={inputs[cat]} onChange={e => setInputs(s => ({ ...s, [cat]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleAdd(cat)} placeholder={`Add ${cat} skill…`} style={{ flex: 1 }} />
                <button className="sk-add" onClick={() => handleAdd(cat)}>+</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid #2a2418' }}>
          <button onClick={onClose} style={{ width: '100%', padding: '8px', background: '#e8c97a', border: 'none', borderRadius: 4, color: '#0f0e0c', fontWeight: 700, fontSize: '.78rem', cursor: 'pointer' }}>Done</button>
        </div>
      </div>
    </div>
  )
}

/* ─── Clickable Resume Section Wrapper ───────────────────────── */
function EditableSection({ label, onClick, children, enabled }) {
  if (!enabled) return children
  return (
    <div style={{ position: 'relative', cursor: 'pointer' }}
      onClick={onClick}
      title={`Click to edit ${label}`}
      onMouseEnter={e => { e.currentTarget.querySelector('.edit-hover-badge')?.style && (e.currentTarget.querySelector('.edit-hover-badge').style.opacity = '1') }}
      onMouseLeave={e => { e.currentTarget.querySelector('.edit-hover-badge')?.style && (e.currentTarget.querySelector('.edit-hover-badge').style.opacity = '0') }}>
      <div className="edit-hover-badge" style={{
        position: 'absolute', top: -4, right: -4, background: 'rgba(232,201,122,.9)', color: '#0f0e0c',
        borderRadius: 4, padding: '2px 6px', fontSize: '.58rem', fontFamily: 'DM Mono,monospace',
        fontWeight: 700, zIndex: 10, opacity: 0, transition: 'opacity .15s', pointerEvents: 'none',
        whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,.4)',
      }}>
        ✏ {label}
      </div>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [jobDesc,    setJobDesc]    = useState('')
  const [toast,      setToast]      = useState('')
  const [editField,  setEditField]  = useState(null)
  const [editSkills, setEditSkills] = useState(false)
  const [pdfModal,   setPdfModal]   = useState(false)
  const [pdfName,    setPdfName]    = useState('')
  const resumeRef = useRef(null)

  // Store selectors
  const data         = useResumeStore(s => s.data)
  const template     = useResumeStore(s => s.template)
  const accent       = useResumeStore(s => s.accent)
  const step         = useResumeStore(s => s.step)
  const inlineEdit   = useResumeStore(s => s.inlineEdit)
  const aiOpen       = useResumeStore(s => s.aiOpen)
  const atsOpen      = useResumeStore(s => s.atsOpen)
  const resumesOpen  = useResumeStore(s => s.resumesOpen)
  const activeId     = useResumeStore(s => s.activeId)

  const setTemplate    = useResumeStore(s => s.setTemplate)
  const setAccent      = useResumeStore(s => s.setAccent)
  const setStep        = useResumeStore(s => s.setStep)
  const setInlineEdit  = useResumeStore(s => s.setInlineEdit)
  const toggleAI       = useResumeStore(s => s.toggleAI)
  const toggleATS      = useResumeStore(s => s.toggleATS)
  const closeATS       = useResumeStore(s => s.closeATS)
  const toggleResumes  = useResumeStore(s => s.toggleResumes)
  const closeResumes   = useResumeStore(s => s.closeResumes)
  const setPersonal    = useResumeStore(s => s.setPersonal)
  const updateExp      = useResumeStore(s => s.updateExperience)
  const updateEdu      = useResumeStore(s => s.updateEducation)
  const updateProject  = useResumeStore(s => s.updateProject)
  const saveResume     = useResumeStore(s => s.saveResume)

  const ai   = useAIAssistant()
  const comp = calcCompleteness(data)

  const showToast = useCallback(msg => { setToast(msg) }, [])

  const handleAI = useCallback((toolId, ctx = '', jd = '') => {
    if (!aiOpen) toggleAI()
    ai.run(toolId, ctx, { jobDesc: jd || jobDesc })
  }, [aiOpen, toggleAI, ai, jobDesc])

  /* ── Inline edit save handler ── */
  const handleInlineSave = useCallback((field, value) => {
    // Parse path: "personal.firstName", "exp.ID.role", "edu.ID.school", "proj.ID.name"
    const parts = field.split('.')
    if (parts[0] === 'personal') {
      setPersonal(parts[1], value)
    } else if (parts[0] === 'exp') {
      updateExp(parts[1], parts[2], value)
    } else if (parts[0] === 'edu') {
      updateEdu(parts[1], parts[2], value)
    } else if (parts[0] === 'proj') {
      updateProject(parts[1], parts[2], value)
    }
    showToast('✏ Change saved')
  }, [setPersonal, updateExp, updateEdu, updateProject, showToast])

  const openEdit = useCallback((field, label, value, type = 'text') => {
    if (!inlineEdit) return
    setEditField({ field, label, value, type })
  }, [inlineEdit])

  const handlePDF = () => {
    const suggested = [data.personal.firstName, data.personal.lastName].filter(Boolean).join('_') || 'resume'
    setPdfName(suggested + '_Resume')
    setPdfModal(true)
  }

  const handlePDFExport = async () => {
    setPdfModal(false)
    if (resumeRef.current) {
      showToast('⏳ Generating PDF…')
      await exportToPDF(resumeRef.current, pdfName || 'resume')
    }
  }

  const handleSave = () => {
    saveResume()
    showToast('💾 Resume saved!')
  }

  /* ── Template props with inline edit callbacks ── */
  const tplProps = {
    data,
    accent,
    inline: inlineEdit,
    openEdit,
    EditableSection,
  }

  const resumeMap = {
    classic:   <Classic   {...tplProps} />,
    modern:    <Modern    {...tplProps} />,
    minimal:   <Minimal   {...tplProps} />,
    executive: <Executive {...tplProps} />,
    tech:      <Tech      {...tplProps} />,
  }

  const isEmpty = !data.personal.firstName && !data.personal.summary && data.experience.length === 0

  return (
    <div className="shell">
      {/* ─── TOPBAR ─── */}
      <div className="topbar">
        <div className="logo">Résumé<em>Forge</em></div>

        <div className="prog-wrap">
          <div className="prog-bg"><div className="prog-fill" style={{ width: `${comp}%` }} /></div>
          <span className="prog-txt">{comp}%</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Resumes count badge */}
        <button className="tb-btn" style={{ background: '#1a1410', color: '#c8b880', border: '1px solid #2a2010', position: 'relative' }} onClick={toggleResumes}>
          📄 Resumes
        </button>
        <button className="tb-btn" style={{ background: '#1a2a1a', color: '#7ab87a', border: '1px solid #2a4a2a' }} onClick={handleSave}>
          💾 {activeId ? 'Update' : 'Save'}
        </button>
        <button className="tb-btn tb-ai"  onClick={toggleAI}>✨ AI</button>
        <button className="tb-btn tb-ats" onClick={toggleATS}>📊 ATS</button>
        <button className={'tb-btn tb-edit' + (inlineEdit ? ' on' : '')} onClick={() => setInlineEdit(!inlineEdit)}>
          ✏ {inlineEdit ? 'Editing ON' : 'Edit'}
        </button>
        <button className="tb-btn tb-pdf" onClick={handlePDF}>⬇ PDF</button>
      </div>

      {/* ─── MAIN ─── */}
      <div className="main">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="tabs">
            {STEPS.map((s, i) => (
              <button key={i} className={'tab' + (i === step ? ' on' : '') + (i < step ? ' done' : '')} onClick={() => setStep(i)}>
                {i < step ? '✓ ' : ''}{s}
              </button>
            ))}
          </div>

          <div className="fbody">
            {step === 0 && <ProfileStep    onAI={handleAI} />}
            {step === 1 && <ExperienceStep onAI={handleAI} />}
            {step === 2 && <EducationStep />}
            {step === 3 && <SkillsStep     onAI={handleAI} />}
            {step === 4 && <ProjectsStep   onAI={handleAI} />}
            {step === 5 && <ExtrasStep onAI={handleAI} jobDesc={jobDesc} setJobDesc={setJobDesc} onRunATS={toggleATS} />}
          </div>

          <div className="fnav">
            <button className="btn-back" onClick={() => setStep(Math.max(0, step - 1))} style={{ opacity: step === 0 ? 0.3 : 1 }}>← Back</button>
            {step < STEPS.length - 1
              ? <button className="btn-next" onClick={() => setStep(step + 1)}>Next →</button>
              : <button className="btn-next" onClick={handlePDF}>⬇ Export PDF</button>}
          </div>
        </div>

        {/* PREVIEW */}
        <div className="right">
          <div className="ptbar">
            <span className="tb-lbl">Template</span>
            {TEMPLATES.map(t => (
              <button key={t.id} className={'tpl' + (template === t.id ? ' on' : '')} onClick={() => setTemplate(t.id)} title={t.description}>
                {t.label}
              </button>
            ))}
            <div className="toolbar-div" />
            <span className="tb-lbl">Color</span>
            {ACCENTS.map(a => (
              <div key={a.bg} className={'cdot' + (accent.bg === a.bg ? ' on' : '')}
                style={{ background: a.bg, borderColor: accent.bg === a.bg ? a.ac : '#2a2418' }}
                onClick={() => setAccent(a)} title={a.name} />
            ))}
            {inlineEdit && (
              <>
                <div className="toolbar-div" />
                <span className="edit-hint">✏ Click any text in preview to edit</span>
                <button style={{ marginLeft: 6, padding: '3px 8px', background: '#1c1a2a', border: '1px solid #2a2a4a', color: '#8a9aec', borderRadius: 3, fontSize: '.64rem', cursor: 'pointer', fontFamily: 'DM Mono,monospace' }} onClick={() => setEditSkills(true)}>
                  Edit Skills
                </button>
              </>
            )}
          </div>

          <div className="pscroll">
            <div ref={resumeRef}>{resumeMap[template] || resumeMap.classic}</div>
            {isEmpty && (
              <div className="empty-state">
                <div className="empty-icon">✍️</div>
                <div className="empty-txt">Fill the form on the left<br />to build your resume live</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── PANELS ─── */}
      <AIPanel open={aiOpen} onClose={toggleAI} jobDesc={jobDesc} ai={ai} />
      <ATSPanel open={atsOpen} onClose={closeATS} jobDesc={jobDesc} />
      <RecentResumes open={resumesOpen} onClose={closeResumes} />

      {/* ─── PDF FILENAME MODAL ─── */}
      {pdfModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={e => e.target === e.currentTarget && setPdfModal(false)}>
          <div style={{
            width: 380, background: '#0f0e0c', border: '1px solid #3a3018',
            borderRadius: 10, padding: '22px 20px 18px',
            boxShadow: '0 24px 80px rgba(0,0,0,.9)',
            animation: 'fadeUp .2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: 'Playfair Display,serif', fontSize: '1.05rem', color: '#e8e0d0', marginBottom: 3 }}>Save as PDF</div>
                <div style={{ fontSize: '.65rem', color: '#5a4a38', fontFamily: 'DM Mono,monospace' }}>Choose a filename for your resume</div>
              </div>
              <button className="xbtn" onClick={() => setPdfModal(false)}>✕</button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: '.65rem', fontWeight: 600, color: '#6a5a3a', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 5 }}>Filename</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={pdfName}
                  onChange={e => setPdfName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handlePDFExport()}
                  autoFocus
                  style={{ width: '100%', paddingRight: 48 }}
                  placeholder="Jane_Smith_Resume"
                />
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: '.64rem', color: '#4a4028', fontFamily: 'DM Mono,monospace', pointerEvents: 'none' }}>.pdf</span>
              </div>
            </div>

            {/* Quick suggestions */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '.6rem', color: '#4a3a28', fontFamily: 'DM Mono,monospace', marginBottom: 6 }}>Quick picks:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {[
                  `${[data.personal.firstName, data.personal.lastName].filter(Boolean).join('_')}_Resume`,
                  `${[data.personal.firstName, data.personal.lastName].filter(Boolean).join('_')}_${data.personal.title?.split(' ').slice(0, 2).join('_') || 'CV'}`,
                  `Resume_${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).replace(' ', '_')}`,
                ].filter(s => !s.startsWith('_')).map((s, i) => (
                  <button key={i} onClick={() => setPdfName(s)}
                    style={{ padding: '3px 9px', background: '#1c1a0e', border: `1px solid ${pdfName === s ? '#e8c97a' : '#3a3018'}`, borderRadius: 4, color: pdfName === s ? '#e8c97a' : '#8a7a5a', fontSize: '.67rem', cursor: 'pointer', fontFamily: 'DM Mono,monospace', transition: 'all .15s' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 9 }}>
              <button onClick={handlePDFExport}
                style={{ flex: 1, padding: '10px', background: '#e8c97a', border: 'none', borderRadius: 6, color: '#0f0e0c', fontWeight: 700, fontSize: '.8rem', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0d890'}
                onMouseLeave={e => e.currentTarget.style.background = '#e8c97a'}>
                ⬇ Download PDF
              </button>
              <button onClick={() => setPdfModal(false)}
                style={{ padding: '10px 16px', background: '#1a1915', border: '1px solid #2a2418', borderRadius: 6, color: '#6a5a3a', fontSize: '.78rem', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── INLINE EDIT MODAL ─── */}
      {editField && (
        <InlineEditPanel
          field={editField.field}
          label={editField.label}
          value={editField.value}
          type={editField.type}
          onSave={(val) => handleInlineSave(editField.field, val)}
          onClose={() => setEditField(null)}
        />
      )}

      {/* ─── SKILL EDIT MODAL ─── */}
      {editSkills && <SkillEditPanel onClose={() => setEditSkills(false)} />}

      {/* ─── TOAST ─── */}
      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  )
}