import { useState, useRef, useEffect } from 'react'
import useResumeStore from '../../hooks/useResumeStore'

/* ─── Country Codes ─────────────────────────────────────────── */
const COUNTRY_CODES = [
  { code: '+1',   flag: '🇺🇸', name: 'US/CA' },
  { code: '+44',  flag: '🇬🇧', name: 'UK' },
  { code: '+91',  flag: '🇮🇳', name: 'India' },
  { code: '+61',  flag: '🇦🇺', name: 'Australia' },
  { code: '+49',  flag: '🇩🇪', name: 'Germany' },
  { code: '+33',  flag: '🇫🇷', name: 'France' },
  { code: '+81',  flag: '🇯🇵', name: 'Japan' },
  { code: '+86',  flag: '🇨🇳', name: 'China' },
  { code: '+55',  flag: '🇧🇷', name: 'Brazil' },
  { code: '+27',  flag: '🇿🇦', name: 'S.Africa' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+65',  flag: '🇸🇬', name: 'Singapore' },
  { code: '+82',  flag: '🇰🇷', name: 'Korea' },
  { code: '+39',  flag: '🇮🇹', name: 'Italy' },
  { code: '+34',  flag: '🇪🇸', name: 'Spain' },
  { code: '+31',  flag: '🇳🇱', name: 'Netherlands' },
  { code: '+46',  flag: '🇸🇪', name: 'Sweden' },
  { code: '+7',   flag: '🇷🇺', name: 'Russia' },
  { code: '+52',  flag: '🇲🇽', name: 'Mexico' },
  { code: '+20',  flag: '🇪🇬', name: 'Egypt' },
]

/* ─── Social Link Config ─────────────────────────────────────── */
const SOCIAL_LINKS = [
  {
    key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  {
    key: 'github', label: 'GitHub', placeholder: 'github.com/username',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  },
  {
    key: 'leetcode', label: 'LeetCode', placeholder: 'leetcode.com/u/username',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
      </svg>
    )
  },
  {
    key: 'hackerrank', label: 'HackerRank', placeholder: 'hackerrank.com/username',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 11.885 0 13-.642 1.115-9.107 6-10.392 6-1.284 0-9.75-4.885-10.392-6C.96 17.885.96 7.115 1.608 6 2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V6.58c0-.189-.24-.275-.358-.135L6.723 10.21c-.101.12-.101.302 0 .421l2.883 3.67c.12.141.358.054.358-.135v-3.327h4.074v3.8c0 .19.24.275.359.136l2.882-3.68a.338.338 0 0 0 0-.421L14.4 6.935a.217.217 0 0 0-.105-.136z"/>
      </svg>
    )
  },
  {
    key: 'portfolio', label: 'Portfolio', placeholder: 'yourname.dev',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    )
  },
  {
    key: 'twitter', label: 'Twitter/X', placeholder: 'x.com/username',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
]

/* ─── Tech Skill Suggestions ─────────────────────────────────── */
const TECH_SUGGESTIONS = [
  'JavaScript','TypeScript','Python','Java','C++','C#','Go','Rust','Swift','Kotlin','PHP','Ruby','Scala','R',
  'React','Vue.js','Angular','Next.js','Nuxt.js','Svelte','Node.js','Express','Django','Flask','FastAPI',
  'Spring Boot','Laravel','Rails','GraphQL','REST API','gRPC',
  'PostgreSQL','MySQL','MongoDB','Redis','Elasticsearch','DynamoDB','Cassandra','SQLite',
  'Docker','Kubernetes','AWS','Azure','GCP','Terraform','Ansible','CI/CD','Jenkins','GitHub Actions',
  'Git','Linux','Bash','Webpack','Vite','Jest','Cypress','Pytest','TDD',
  'Machine Learning','TensorFlow','PyTorch','Pandas','NumPy','Scikit-learn','OpenCV',
  'React Native','Flutter','iOS','Android','Figma','Tailwind CSS','SASS',
  'Microservices','System Design','Agile','Scrum','DevOps','SRE','WebSockets',
]
const SOFT_SUGGESTIONS = [
  'Leadership','Communication','Problem Solving','Critical Thinking','Teamwork','Adaptability',
  'Time Management','Creativity','Emotional Intelligence','Conflict Resolution','Mentoring',
  'Public Speaking','Project Management','Stakeholder Management','Decision Making',
  'Collaboration','Attention to Detail','Strategic Thinking','Negotiation','Prioritization',
]
const LANGUAGE_SUGGESTIONS = [
  'English (Native)','English (Fluent)','English (Intermediate)',
  'Hindi','Spanish','French','German','Mandarin','Japanese','Arabic','Portuguese',
  'Korean','Italian','Russian','Dutch','Swedish','Turkish','Polish','Bengali',
]

/* ─── Shared: AutoSuggest Input ──────────────────────────────── */
function AutoSuggestInput({ value, onChange, onAdd, placeholder, suggestions, className = '' }) {
  const [open, setOpen] = useState(false)
  const [filtered, setFiltered] = useState([])
  const ref = useRef(null)

  useEffect(() => {
    const handler = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = v => {
    onChange(v)
    if (v.trim().length > 0) {
      const f = suggestions.filter(s => s.toLowerCase().includes(v.toLowerCase()) && s.toLowerCase() !== v.toLowerCase()).slice(0, 7)
      setFiltered(f)
      setOpen(f.length > 0)
    } else {
      setOpen(false)
    }
  }

  const handleSelect = s => { onAdd(s); onChange(''); setOpen(false) }
  const handleKey = e => {
    if (e.key === 'Enter') { e.preventDefault(); if (value.trim()) { onAdd(value.trim()); onChange(''); setOpen(false) } }
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div style={{ position: 'relative', flex: 1 }} ref={ref}>
      <input type="text" className={className} value={value} onChange={e => handleChange(e.target.value)} onKeyDown={handleKey} placeholder={placeholder} autoComplete="off" />
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1a1810', border: '1px solid #3a3018', borderRadius: '0 0 6px 6px', zIndex: 100, maxHeight: 200, overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,.6)' }}>
          {filtered.map((s, i) => (
            <div key={i} onMouseDown={() => handleSelect(s)} style={{ padding: '7px 11px', fontSize: '.75rem', color: '#c8b880', cursor: 'pointer', borderBottom: '1px solid #2a2010', transition: 'background .15s' }}
              onMouseEnter={e => e.target.style.background = '#251f00'}
              onMouseLeave={e => e.target.style.background = 'transparent'}>
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Shared: Date Picker ────────────────────────────────────── */
function MonthYearPicker({ value, onChange, placeholder, disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const now = new Date()
  const [viewYear, setViewYear] = useState(value ? parseInt(value.split(' ')[1]) : now.getFullYear())

  useEffect(() => {
    const handler = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const select = (m, y) => { onChange(`${m} ${y}`); setOpen(false) }

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <div style={{ position: 'relative' }}>
        <input type="text" value={value} readOnly placeholder={placeholder} onClick={() => !disabled && setOpen(!open)}
          style={{ cursor: disabled ? 'not-allowed' : 'pointer', paddingRight: 28, opacity: disabled ? 0.5 : 1 }} />
        <span style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: '#6a5a3a', fontSize: '.7rem', pointerEvents: 'none' }}>
          {disabled ? '🔒' : '📅'}
        </span>
      </div>
      {open && !disabled && (
        <div style={{ position: 'absolute', top: '100%', left: 0, background: '#1a1810', border: '1px solid #3a3018', borderRadius: 6, zIndex: 200, padding: 12, width: 220, boxShadow: '0 12px 32px rgba(0,0,0,.7)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <button onClick={() => setViewYear(y => y - 1)} style={{ background: 'none', border: 'none', color: '#e8c97a', fontSize: '.9rem', cursor: 'pointer', padding: '2px 6px' }}>‹</button>
            <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '.75rem', color: '#e8c97a' }}>{viewYear}</span>
            <button onClick={() => setViewYear(y => y + 1)} style={{ background: 'none', border: 'none', color: '#e8c97a', fontSize: '.9rem', cursor: 'pointer', padding: '2px 6px' }}>›</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4 }}>
            {MONTHS.map(m => (
              <button key={m} onClick={() => select(m, viewYear)}
                style={{ padding: '5px 4px', fontSize: '.68rem', background: value === `${m} ${viewYear}` ? '#2a2200' : 'none', border: `1px solid ${value === `${m} ${viewYear}` ? '#e8c97a' : '#2a2010'}`, borderRadius: 4, color: value === `${m} ${viewYear}` ? '#e8c97a' : '#a89060', cursor: 'pointer', transition: 'all .15s', fontFamily: 'DM Mono,monospace' }}>
                {m}
              </button>
            ))}
          </div>
          <button onClick={() => { onChange('Present'); setOpen(false) }}
            style={{ width: '100%', marginTop: 8, padding: '5px', background: '#0f2a0f', border: '1px solid #2a4a2a', borderRadius: 4, color: '#7ab87a', fontSize: '.68rem', cursor: 'pointer', fontFamily: 'DM Mono,monospace', fontWeight: 600 }}>
            Present
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── Shared: Bullet Description Editor ─────────────────────── */
function BulletEditor({ value, onChange, placeholder, minRows = 4 }) {
  const lines = value ? value.split('\n') : ['']

  const handleChange = (idx, newVal) => {
    const updated = [...lines]
    updated[idx] = newVal
    onChange(updated.join('\n'))
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const updated = [...lines]
      updated.splice(idx + 1, 0, '• ')
      onChange(updated.join('\n'))
      setTimeout(() => {
        const inputs = e.target.closest('.bullet-editor').querySelectorAll('input')
        inputs[idx + 1]?.focus()
      }, 10)
    }
    if (e.key === 'Backspace' && lines[idx] === '• ' && lines.length > 1) {
      e.preventDefault()
      const updated = lines.filter((_, i) => i !== idx)
      onChange(updated.join('\n'))
      setTimeout(() => {
        const inputs = e.target.closest('.bullet-editor').querySelectorAll('input')
        inputs[Math.max(0, idx - 1)]?.focus()
      }, 10)
    }
  }

  const addBullet = () => onChange(value ? value + '\n• ' : '• ')

  return (
    <div className="bullet-editor" style={{ background: '#181610', border: '1px solid #2c2616', borderRadius: 4 }}>
      {lines.map((line, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', borderBottom: i < lines.length - 1 ? '1px solid #1e1a0c' : 'none' }}>
          <span style={{ padding: '0 8px', color: '#4a3a20', fontSize: '.75rem', flexShrink: 0, fontFamily: 'DM Mono,monospace' }}>
            {line.startsWith('•') ? '•' : '·'}
          </span>
          <input type="text" value={line.replace(/^[•·]\s*/, '')}
            onChange={e => handleChange(i, (line.startsWith('•') ? '• ' : '') + e.target.value)}
            onFocus={e => { if (!line.startsWith('•')) { const updated = [...lines]; updated[i] = '• ' + line; onChange(updated.join('\n')) } }}
            onKeyDown={e => handleKeyDown(e, i)}
            placeholder={i === 0 ? (placeholder || 'Describe an achievement or responsibility…') : 'Add another point…'}
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#e8e0d0', fontSize: '.79rem', padding: '8px 8px 8px 0', fontFamily: 'DM Sans,sans-serif', lineHeight: 1.5 }} />
        </div>
      ))}
      <button onClick={addBullet} style={{ width: '100%', padding: '6px', background: 'none', border: 'none', color: '#4a3a20', fontSize: '.7rem', cursor: 'pointer', textAlign: 'left', paddingLeft: 12 }}>
        + Add bullet
      </button>
    </div>
  )
}

/* ─── Validation Helper ──────────────────────────────────────── */
function FieldError({ msg }) {
  if (!msg) return null
  return <div style={{ fontSize: '.62rem', color: '#e87a7a', marginTop: 3, fontFamily: 'DM Mono,monospace' }}>⚠ {msg}</div>
}

/* ═══════════════════════════════════════════════════════════════
   PROFILE STEP
═══════════════════════════════════════════════════════════════ */
export function ProfileStep({ onAI }) {
  const p   = useResumeStore(s => s.data.personal)
  const set = useResumeStore(s => s.setPersonal)

  const [countryCode, setCountryCode] = useState('+91')
  const [showCCDrop, setShowCCDrop]   = useState(false)
  const [rawPhone,   setRawPhone]     = useState('')
  const [errors,     setErrors]       = useState({})
  const ccRef = useRef(null)

  useEffect(() => {
    const handler = e => { if (!ccRef.current?.contains(e.target)) setShowCCDrop(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const validate = (field, val) => {
    const errs = { ...errors }
    if (field === 'email') {
      errs.email = val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? 'Enter a valid email address' : ''
    }
    if (field === 'phone') {
      errs.phone = val && !/^\d{7,15}$/.test(val.replace(/\s/g, '')) ? 'Enter 7–15 digits only' : ''
    }
    if (field === 'website') {
      errs.website = val && !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}/.test(val) ? 'Enter a valid URL' : ''
    }
    setErrors(errs)
    return !errs[field]
  }

  const handlePhone = v => {
    const digits = v.replace(/\D/g, '').slice(0, 15)
    setRawPhone(digits)
    validate('phone', digits)
    set('phone', countryCode + ' ' + digits)
  }

  const selectedCC = COUNTRY_CODES.find(c => c.code === countryCode) || COUNTRY_CODES[0]

  return (
    <div>
      <div className="sec-hd">
        <h2>Personal Profile</h2>
        <p>Your headline is ATS-critical — include your target job title exactly.</p>
      </div>

      <div className="fr">
        <div className="fg">
          <label>First Name *</label>
          <input type="text" value={p.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Jane" />
        </div>
        <div className="fg">
          <label>Last Name *</label>
          <input type="text" value={p.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Smith" />
        </div>
      </div>

      <div className="fg">
        <label>Professional Title *</label>
        <input type="text" value={p.title} onChange={e => set('title', e.target.value)} placeholder="Senior Full-Stack Engineer" />
      </div>

      <div className="fg">
        <label>Email Address *</label>
        <input type="email" value={p.email}
          onChange={e => { set('email', e.target.value); validate('email', e.target.value) }}
          placeholder="jane@example.com" />
        <FieldError msg={errors.email} />
      </div>

      {/* Phone with country code */}
      <div className="fg">
        <label>Phone Number</label>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ position: 'relative', flexShrink: 0 }} ref={ccRef}>
            <button onClick={() => setShowCCDrop(!showCCDrop)}
              style={{ height: '100%', minWidth: 80, padding: '8px 10px', background: '#181610', border: '1px solid #2c2616', borderRadius: 4, color: '#e8e0d0', fontSize: '.78rem', display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <span>{selectedCC.flag}</span>
              <span style={{ fontFamily: 'DM Mono,monospace', fontSize: '.72rem', color: '#e8c97a' }}>{selectedCC.code}</span>
              <span style={{ color: '#4a3a20', fontSize: '.65rem' }}>▾</span>
            </button>
            {showCCDrop && (
              <div style={{ position: 'absolute', top: '100%', left: 0, background: '#1a1810', border: '1px solid #3a3018', borderRadius: 6, zIndex: 200, width: 170, maxHeight: 220, overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,.7)' }}>
                {COUNTRY_CODES.map(c => (
                  <div key={c.code} onClick={() => { setCountryCode(c.code); setShowCCDrop(false); set('phone', c.code + ' ' + rawPhone) }}
                    style={{ padding: '7px 11px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '.75rem', borderBottom: '1px solid #221e0c', background: c.code === countryCode ? '#251f00' : 'transparent', color: c.code === countryCode ? '#e8c97a' : '#c8b880' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#201c00'}
                    onMouseLeave={e => e.currentTarget.style.background = c.code === countryCode ? '#251f00' : 'transparent'}>
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                    <span style={{ marginLeft: 'auto', fontFamily: 'DM Mono,monospace', fontSize: '.65rem', color: '#6a5a3a' }}>{c.code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <input type="text" value={rawPhone} onChange={e => handlePhone(e.target.value)} placeholder="9876543210 (digits only)" maxLength={15} />
            <FieldError msg={errors.phone} />
          </div>
        </div>
        <div style={{ fontSize: '.62rem', color: '#4a4028', marginTop: 3, fontFamily: 'DM Mono,monospace' }}>Max 15 digits · No spaces or dashes needed</div>
      </div>

      <div className="fg">
        <label>City / Location</label>
        <input type="text" value={p.location} onChange={e => set('location', e.target.value)} placeholder="San Francisco, CA" />
      </div>

      {/* Social Links */}
      <div className="fg">
        <label>Social & Portfolio Links</label>
        <div style={{ background: '#141210', border: '1px solid #2a2418', borderRadius: 6, overflow: 'hidden' }}>
          {SOCIAL_LINKS.map((sl, idx) => (
            <div key={sl.key} style={{ display: 'flex', alignItems: 'center', gap: 0, borderBottom: idx < SOCIAL_LINKS.length - 1 ? '1px solid #1e1a10' : 'none' }}>
              <div style={{ width: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p[sl.key] ? '#e8c97a' : '#3a3020', flexShrink: 0, padding: '0 10px', height: 36 }}>
                {sl.icon}
              </div>
              <input type="text" value={p[sl.key] || ''}
                onChange={e => { set(sl.key, e.target.value); if (sl.key === 'website') validate('website', e.target.value) }}
                placeholder={sl.placeholder}
                style={{ flex: 1, background: 'none', border: 'none', borderLeft: '1px solid #1e1a10', outline: 'none', color: '#e8e0d0', fontSize: '.78rem', padding: '9px 11px', fontFamily: 'DM Sans,sans-serif' }} />
            </div>
          ))}
        </div>
        {errors.website && <FieldError msg={errors.website} />}
      </div>

      {/* Summary */}
      <div className="fg">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <label style={{ margin: 0 }}>Professional Summary</label>
          <div style={{ display: 'flex', gap: 5 }}>
            <button className="ai-mini" onClick={() => onAI('summary')}>✨ Generate</button>
            {p.summary && <button className="ai-mini" onClick={() => onAI('improve')}>⚡ Improve</button>}
          </div>
        </div>
        <textarea value={p.summary} onChange={e => set('summary', e.target.value)} rows={4}
          placeholder="Results-driven engineer with 5+ years building scalable systems. Shipped 3 products used by 50K+ users. Expert in React, Node.js, and cloud infrastructure." />
        <div style={{ fontSize: '.62rem', color: p.summary?.length >= 80 ? '#7ab87a' : '#6a5a3a', marginTop: 3, fontFamily: 'DM Mono,monospace' }}>
          {p.summary?.length || 0} chars {p.summary?.length >= 80 ? '✓ Good length' : '(aim for 80+)'}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EXPERIENCE STEP
═══════════════════════════════════════════════════════════════ */
export function ExperienceStep({ onAI }) {
  const exp = useResumeStore(s => s.data.experience)
  const add = useResumeStore(s => s.addExperience)
  const upd = useResumeStore(s => s.updateExperience)
  const rm  = useResumeStore(s => s.removeExperience)
  const [errors, setErrors] = useState({})

  const validate = (id, field, val) => {
    const key = `${id}_${field}`
    const errs = { ...errors }
    if (field === 'company' || field === 'role') errs[key] = !val.trim() ? 'This field is required' : ''
    setErrors(errs)
  }

  return (
    <div>
      <div className="sec-hd">
        <h2>Work Experience</h2>
        <p>Most recent first. Use bullet points — each one should contain a result or metric.</p>
      </div>
      {exp.map((e, i) => (
        <div className="card" key={e.id}>
          <div className="card-top">
            <span className="card-lbl">Position #{i + 1}</span>
            <button className="rm" onClick={() => rm(e.id)}>✕ remove</button>
          </div>

          <div className="fg">
            <label>Company / Organisation *</label>
            <input type="text" value={e.company}
              onChange={ev => { upd(e.id, 'company', ev.target.value); validate(e.id, 'company', ev.target.value) }}
              placeholder="Acme Corp" />
            <FieldError msg={errors[`${e.id}_company`]} />
          </div>

          <div className="fr">
            <div className="fg">
              <label>Role / Title *</label>
              <input type="text" value={e.role}
                onChange={ev => { upd(e.id, 'role', ev.target.value); validate(e.id, 'role', ev.target.value) }}
                placeholder="Software Engineer" />
              <FieldError msg={errors[`${e.id}_role`]} />
            </div>
            <div className="fg">
              <label>Location</label>
              <input type="text" value={e.location} onChange={ev => upd(e.id, 'location', ev.target.value)} placeholder="Remote / NYC" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label>Start Date</label>
              <MonthYearPicker value={e.start} onChange={v => upd(e.id, 'start', v)} placeholder="Start month" />
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label>End Date</label>
              <MonthYearPicker value={e.current ? 'Present' : e.end} onChange={v => upd(e.id, 'end', v)} placeholder="End month" disabled={e.current} />
            </div>
          </div>

          <div className="chk">
            <input type="checkbox" checked={e.current} onChange={ev => upd(e.id, 'current', ev.target.checked)} />
            <label>Currently working here</label>
          </div>

          <div className="fg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ margin: 0 }}>Key Achievements</label>
              {e.description && <button className="ai-mini" onClick={() => onAI('enhance', e.description)}>✨ Enhance</button>}
            </div>
            <BulletEditor value={e.description} onChange={v => upd(e.id, 'description', v)}
              placeholder="Led microservices migration reducing API latency by 40%" />
            <div style={{ fontSize: '.62rem', color: '#4a4028', marginTop: 4, fontFamily: 'DM Mono,monospace' }}>
              Press Enter to add a bullet · Backspace on empty line to remove
            </div>
          </div>
        </div>
      ))}
      <button className="add-btn" onClick={add}>+ Add Work Experience</button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EDUCATION STEP
═══════════════════════════════════════════════════════════════ */
export function EducationStep() {
  const edu = useResumeStore(s => s.data.education)
  const add = useResumeStore(s => s.addEducation)
  const upd = useResumeStore(s => s.updateEducation)
  const rm  = useResumeStore(s => s.removeEducation)
  const [errors, setErrors] = useState({})
  const [gpaModes, setGpaModes] = useState({})

  const validate = (id, field, val) => {
    const key = `${id}_${field}`
    const errs = { ...errors }
    if (field === 'school') errs[key] = !val.trim() ? 'Institution name is required' : ''
    if (field === 'gpa' && val) {
      const mode = gpaModes[id] || 'gpa'
      if (mode === 'gpa') errs[key] = isNaN(parseFloat(val)) || parseFloat(val) > 4 ? 'Enter a valid GPA (0.0 – 4.0)' : ''
      else errs[key] = isNaN(parseFloat(val)) || parseFloat(val) > 100 ? 'Enter a percentage (0–100)' : ''
    }
    setErrors(errs)
  }

  const toggleGpaMode = id => {
    setGpaModes(m => ({ ...m, [id]: m[id] === 'pct' ? 'gpa' : 'pct' }))
    upd(id, 'gpa', '')
  }

  return (
    <div>
      <div className="sec-hd">
        <h2>Education</h2>
        <p>Include GPA / percentage if it strengthens your profile (3.5+  / 75%+).</p>
      </div>
      {edu.map((e, i) => (
        <div className="card" key={e.id}>
          <div className="card-top">
            <span className="card-lbl">Entry #{i + 1}</span>
            <button className="rm" onClick={() => rm(e.id)}>✕ remove</button>
          </div>

          <div className="fg">
            <label>Institution *</label>
            <input type="text" value={e.school}
              onChange={ev => { upd(e.id, 'school', ev.target.value); validate(e.id, 'school', ev.target.value) }}
              placeholder="MIT / Stanford / IIT Bombay" />
            <FieldError msg={errors[`${e.id}_school`]} />
          </div>

          <div className="fr">
            <div className="fg">
              <label>Degree</label>
              <input type="text" value={e.degree} onChange={ev => upd(e.id, 'degree', ev.target.value)} placeholder="B.Tech / B.S. / M.S." />
            </div>
            <div className="fg">
              <label>Field of Study</label>
              <input type="text" value={e.field} onChange={ev => upd(e.id, 'field', ev.target.value)} placeholder="Computer Science" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label>Start Year</label>
              <MonthYearPicker value={e.start} onChange={v => upd(e.id, 'start', v)} placeholder="Start year" />
            </div>
            <div className="fg" style={{ marginBottom: 0 }}>
              <label>End / Expected</label>
              <MonthYearPicker value={e.end} onChange={v => upd(e.id, 'end', v)} placeholder="End year" />
            </div>
          </div>

          {/* GPA / Percentage toggle */}
          <div className="fg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <label style={{ margin: 0 }}>{gpaModes[e.id] === 'pct' ? 'Percentage' : 'GPA'}</label>
              <button onClick={() => toggleGpaMode(e.id)}
                style={{ fontSize: '.62rem', background: '#1a1a2a', border: '1px solid #2a2a4a', color: '#8a9aec', padding: '2px 7px', borderRadius: 3, cursor: 'pointer', fontFamily: 'DM Mono,monospace' }}>
                Switch to {gpaModes[e.id] === 'pct' ? 'GPA' : 'Percentage'}
              </button>
            </div>
            <input type="text" value={e.gpa}
              onChange={ev => { upd(e.id, 'gpa', ev.target.value); validate(e.id, 'gpa', ev.target.value) }}
              placeholder={gpaModes[e.id] === 'pct' ? '85.5 (out of 100)' : '3.8 / 4.0'} />
            <FieldError msg={errors[`${e.id}_gpa`]} />
          </div>

          <div className="fg">
            <label>Honors / Achievements</label>
            <input type="text" value={e.notes} onChange={ev => upd(e.id, 'notes', ev.target.value)} placeholder="Dean's List, Cum Laude, Gold Medal…" />
          </div>
        </div>
      ))}
      <button className="add-btn" onClick={add}>+ Add Education</button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SKILLS STEP  — separated sections with autocomplete
═══════════════════════════════════════════════════════════════ */
export function SkillsStep({ onAI }) {
  const skills = useResumeStore(s => s.data.skills)
  const add    = useResumeStore(s => s.addSkill)
  const rm     = useResumeStore(s => s.removeSkill)
  const [inputs, setInputs] = useState({ technical: '', soft: '', languages: '' })

  const handleAdd = (cat, val) => {
    const v = (val || inputs[cat]).trim()
    if (!v) return
    add(cat, v)
    setInputs(s => ({ ...s, [cat]: '' }))
  }

  const SECTIONS = [
    {
      cat: 'technical',
      label: '⚙ Technical Skills',
      sub: 'Frameworks, languages, tools, platforms',
      placeholder: 'React, Python, Docker…',
      suggestions: TECH_SUGGESTIONS,
      chipColor: '#1c2a1c',
      chipBorder: '#2a4a2a',
      chipText: '#7ab87a',
    },
    {
      cat: 'soft',
      label: '🧠 Soft Skills',
      sub: 'Leadership, communication, collaboration',
      placeholder: 'Leadership, Problem Solving…',
      suggestions: SOFT_SUGGESTIONS,
      chipColor: '#1a1a2a',
      chipBorder: '#2a2a4a',
      chipText: '#8a9aec',
    },
    {
      cat: 'languages',
      label: '🌐 Languages',
      sub: 'Human languages you speak or write',
      placeholder: 'English (Native), Hindi (Fluent)…',
      suggestions: LANGUAGE_SUGGESTIONS,
      chipColor: '#2a1a10',
      chipBorder: '#4a2a10',
      chipText: '#d4956a',
    },
  ]

  return (
    <div>
      <div className="sec-hd">
        <h2>Skills</h2>
        <p>Match keywords exactly from job descriptions for maximum ATS impact.</p>
      </div>

      <div style={{ marginBottom: 14, textAlign: 'right' }}>
        <button className="ai-mini" onClick={() => onAI('skills')}>✨ AI Suggest Technical Skills</button>
      </div>

      {SECTIONS.map(sec => (
        <div key={sec.cat} style={{ background: '#141210', border: '1px solid #2a2418', borderRadius: 8, padding: '13px 13px 10px', marginBottom: 14 }}>
          <div style={{ marginBottom: 9 }}>
            <div style={{ fontSize: '.8rem', fontWeight: 600, color: '#e8e0d0', marginBottom: 2 }}>{sec.label}</div>
            <div style={{ fontSize: '.65rem', color: '#5a4a38' }}>{sec.sub}</div>
          </div>

          {/* Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: skills[sec.cat].length > 0 ? 9 : 0 }}>
            {skills[sec.cat].map((s, i) => (
              <span key={i} style={{ background: sec.chipColor, border: `1px solid ${sec.chipBorder}`, color: sec.chipText, padding: '3px 9px', borderRadius: 14, fontSize: '.7rem', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'DM Mono,monospace' }}>
                {s}
                <button onClick={() => rm(sec.cat, i)} style={{ background: 'none', border: 'none', color: '#6a4a20', fontSize: '.75rem', cursor: 'pointer', padding: 0, lineHeight: 1 }}>✕</button>
              </span>
            ))}
          </div>

          {/* AutoSuggest input */}
          <div style={{ display: 'flex', gap: 6 }}>
            <AutoSuggestInput
              value={inputs[sec.cat]}
              onChange={v => setInputs(s => ({ ...s, [sec.cat]: v }))}
              onAdd={v => handleAdd(sec.cat, v)}
              placeholder={sec.placeholder}
              suggestions={sec.suggestions}
            />
            <button className="sk-add" onClick={() => handleAdd(sec.cat)}>+</button>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PROJECTS STEP
═══════════════════════════════════════════════════════════════ */
export function ProjectsStep({ onAI }) {
  const prj = useResumeStore(s => s.data.projects)
  const add = useResumeStore(s => s.addProject)
  const upd = useResumeStore(s => s.updateProject)
  const rm  = useResumeStore(s => s.removeProject)
  const [errors, setErrors] = useState({})

  const validate = (id, field, val) => {
    const key = `${id}_${field}`
    const errs = { ...errors }
    if (field === 'link' && val) {
      errs[key] = !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}/.test(val) ? 'Enter a valid URL' : ''
    }
    if (field === 'name') errs[key] = !val.trim() ? 'Project name is required' : ''
    setErrors(errs)
  }

  const LINK_ICONS = {
    github: { test: /github\.com/i, icon: '⌥', color: '#e8e0d0', label: 'GitHub' },
    gitlab: { test: /gitlab\.com/i, icon: '🦊', color: '#f0734a', label: 'GitLab' },
    live:   { test: /^(?!.*github|.*gitlab)/, icon: '⊕', color: '#7ab87a', label: 'Live' },
  }
  const getLinkMeta = url => {
    if (!url) return null
    if (/github\.com/i.test(url)) return LINK_ICONS.github
    if (/gitlab\.com/i.test(url)) return LINK_ICONS.gitlab
    return LINK_ICONS.live
  }

  return (
    <div>
      <div className="sec-hd">
        <h2>Projects</h2>
        <p>Showcase your best work. Include live links and measurable impact.</p>
      </div>
      {prj.map((pr, i) => (
        <div className="card" key={pr.id}>
          <div className="card-top">
            <span className="card-lbl">Project #{i + 1}</span>
            <button className="rm" onClick={() => rm(pr.id)}>✕ remove</button>
          </div>

          <div className="fg">
            <label>Project Name *</label>
            <input type="text" value={pr.name}
              onChange={e => { upd(pr.id, 'name', e.target.value); validate(pr.id, 'name', e.target.value) }}
              placeholder="ResuméForge, Portfolio Site, AI Chatbot…" />
            <FieldError msg={errors[`${pr.id}_name`]} />
          </div>

          <div className="fg">
            <label>Tech Stack</label>
            <input type="text" value={pr.tech} onChange={e => upd(pr.id, 'tech', e.target.value)} placeholder="React, Node.js, PostgreSQL, AWS" />
          </div>

          {/* Link with auto-detected icon */}
          <div className="fg">
            <label>Project Link / GitHub URL</label>
            <div style={{ position: 'relative' }}>
              {getLinkMeta(pr.link) && (
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: getLinkMeta(pr.link).color, fontSize: '.8rem', zIndex: 1 }}>
                  {getLinkMeta(pr.link).icon}
                </span>
              )}
              <input type="url" value={pr.link}
                onChange={e => { upd(pr.id, 'link', e.target.value); validate(pr.id, 'link', e.target.value) }}
                placeholder="https://github.com/user/project"
                style={{ paddingLeft: pr.link ? 28 : 10 }} />
            </div>
            {pr.link && !errors[`${pr.id}_link`] && (
              <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: '.64rem', color: '#7ab87a', fontFamily: 'DM Mono,monospace' }}>✓ {getLinkMeta(pr.link)?.label} link detected</span>
                <a href={pr.link.startsWith('http') ? pr.link : 'https://' + pr.link} target="_blank" rel="noreferrer"
                  style={{ fontSize: '.64rem', color: '#8a9aec', fontFamily: 'DM Mono,monospace', textDecoration: 'none' }}>open ↗</a>
              </div>
            )}
            <FieldError msg={errors[`${pr.id}_link`]} />
          </div>

          <div className="fg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ margin: 0 }}>Description / Impact</label>
              {pr.description && <button className="ai-mini" onClick={() => onAI('bullets', pr.description)}>✨ Improve</button>}
            </div>
            <BulletEditor value={pr.description} onChange={v => upd(pr.id, 'description', v)}
              placeholder="Built to solve X problem for Y users, achieving Z result" />
          </div>
        </div>
      ))}
      <button className="add-btn" onClick={add}>+ Add Project</button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EXTRAS STEP
═══════════════════════════════════════════════════════════════ */
export function ExtrasStep({ onAI, jobDesc, setJobDesc, onRunATS }) {
  const extras  = useResumeStore(s => s.data.extras)
  const addCert = useResumeStore(s => s.addCertification)
  const rmCert  = useResumeStore(s => s.removeCertification)
  const setEx   = useResumeStore(s => s.setExtras)
  const [certIn, setCertIn] = useState({ name: '', issuer: '', year: '' })
  const [errors, setErrors] = useState({})

  const handleAddCert = () => {
    if (!certIn.name.trim()) { setErrors({ cert: 'Certification name is required' }); return }
    addCert(certIn)
    setCertIn({ name: '', issuer: '', year: '' })
    setErrors({})
  }

  return (
    <div>
      <div className="sec-hd">
        <h2>Extras</h2>
        <p>Certifications, volunteering, and job-tailoring tools.</p>
      </div>

      {/* Certifications */}
      <div className="fg">
        <label>Certifications</label>
        {extras.certifications.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', background: '#141210', borderRadius: 4, marginBottom: 5, border: '1px solid #2a2418' }}>
            <span style={{ fontSize: '.65rem', color: '#e8c97a', fontFamily: 'DM Mono,monospace' }}>🏅</span>
            <span style={{ flex: 1, fontSize: '.76rem', color: '#c8b880' }}>
              {c.name}{c.issuer ? ` — ${c.issuer}` : ''}{c.year ? ` (${c.year})` : ''}
            </span>
            <button className="rm" onClick={() => rmCert(i)}>✕</button>
          </div>
        ))}
        <div style={{ background: '#141210', border: '1px solid #2a2418', borderRadius: 6, padding: 11, marginTop: 5 }}>
          <div className="fr" style={{ marginBottom: 7 }}>
            <input type="text" value={certIn.name}   onChange={e => { setCertIn(c => ({ ...c, name: e.target.value })); setErrors({}) }} placeholder="AWS Solutions Architect *" />
            <input type="text" value={certIn.issuer} onChange={e => setCertIn(c => ({ ...c, issuer: e.target.value }))} placeholder="Amazon (issuer)" />
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            <input type="text" value={certIn.year} onChange={e => setCertIn(c => ({ ...c, year: e.target.value }))} placeholder="Year (e.g. 2024)" style={{ width: 100 }} />
            <button className="add-btn" style={{ flex: 1, borderStyle: 'solid' }} onClick={handleAddCert}>+ Add Certification</button>
          </div>
          <FieldError msg={errors.cert} />
        </div>
      </div>

      <div className="fg">
        <label>Volunteer Work</label>
        <textarea value={extras.volunteer} onChange={e => setEx('volunteer', e.target.value)} rows={3} placeholder="Mentor at Code.org, Open Source contributor…" />
      </div>

      <div className="fg">
        <label>Interests & Hobbies</label>
        <input type="text" value={extras.interests} onChange={e => setEx('interests', e.target.value)} placeholder="Open source, rock climbing, photography…" />
      </div>

      {/* Job Tailoring */}
      <div style={{ padding: 13, background: '#0f1a0f', borderRadius: 6, border: '1px solid #2a4a2a' }}>
        <div style={{ fontSize: '.65rem', color: '#5a8a5a', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 7, fontFamily: 'DM Mono,monospace' }}>
          🎯 AI Job Tailoring + ATS Keywords
        </div>
        <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Paste the job description here to enable keyword analysis and AI tailoring suggestions…" rows={5} />
        <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
          <button className="add-btn" style={{ flex: 1, borderStyle: 'solid' }} onClick={() => onAI('tailor', '', jobDesc)} disabled={!jobDesc.trim()}>
            ✨ AI Suggestions
          </button>
          <button className="add-btn" style={{ flex: 1, borderStyle: 'solid', color: '#7ab87a', borderColor: '#2a4a2a' }} onClick={onRunATS}>
            📊 ATS Score
          </button>
        </div>
      </div>
    </div>
  )
}