import Desc from '../ui/Desc'

function GitHubIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle' }}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

export default function Modern({ data, accent, inline, openEdit }) {
  const p     = data.personal
  const init  = [p.firstName?.[0], p.lastName?.[0]].filter(Boolean).join('')
  const allSk = [...data.skills.technical, ...data.skills.soft]

  const E = ({ field, label, children, type = 'text' }) => {
    if (!inline || !openEdit) return <>{children}</>
    return (
      <span className="editable" onClick={e => { e.stopPropagation(); openEdit(field, label, typeof children === 'string' ? children : '', type) }}>
        {children}
      </span>
    )
  }

  const socialLinks = [
    { key: 'linkedin',   prefix: 'in/',   },
    { key: 'github',     prefix: '⌥ ',    },
    { key: 'leetcode',   prefix: 'lc/',    },
    { key: 'hackerrank', prefix: 'hr/',    },
    { key: 'portfolio',  prefix: '⊕ ',    },
  ].filter(s => p[s.key])

  return (
    <div className="rdoc modern">
      <div className="rside" style={{ background: accent.bg }}>
        <div className="ravatar">{init || '?'}</div>
        <div className="rname">
          <E field="personal.firstName" label="First Name">{p.firstName || 'First'}</E>
          {' '}
          <E field="personal.lastName" label="Last Name">{p.lastName || 'Last'}</E>
        </div>
        <div className="rtitle">
          <E field="personal.title" label="Title">{p.title || 'Professional'}</E>
        </div>

        <div className="rsbsec">Contact</div>
        {p.email    && <div className="rcon"><span>✉</span><E field="personal.email" label="Email">{p.email}</E></div>}
        {p.phone    && <div className="rcon"><span>✆</span>{p.phone}</div>}
        {p.location && <div className="rcon"><span>⌖</span>{p.location}</div>}

        {socialLinks.length > 0 && (
          <>
            <div className="rsbsec">Links</div>
            {socialLinks.map(s => (
              <div className="rcon" key={s.key} style={{ fontSize: '.64rem', wordBreak: 'break-all' }}>
                <span>{s.prefix}</span>
                <a href={p[s.key].startsWith('http') ? p[s.key] : 'https://' + p[s.key]} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', opacity: .8 }}>
                  {p[s.key].replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </div>
            ))}
          </>
        )}

        {allSk.length > 0 && (
          <>
            <div className="rsbsec">Technical</div>
            {data.skills.technical.map((s, i) => (
              <div className="rskbw" key={i}>
                <div className="rskbl">{s}</div>
                <div className="rskbb"><div className="rskbf" style={{ width: '78%' }} /></div>
              </div>
            ))}
            {data.skills.soft.length > 0 && (
              <>
                <div className="rsbsec" style={{ marginTop: 8 }}>Soft Skills</div>
                {data.skills.soft.map((s, i) => (
                  <div key={i} style={{ fontSize: '.67rem', opacity: .8, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,.4)', flexShrink: 0 }} />
                    {s}
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {data.skills.languages.length > 0 && (
          <>
            <div className="rsbsec">Languages</div>
            {data.skills.languages.map((l, i) => <div className="rcon" key={i}>{l}</div>)}
          </>
        )}

        {data.extras.certifications.length > 0 && (
          <>
            <div className="rsbsec">Certifications</div>
            {data.extras.certifications.map((c, i) => <div className="rcon" key={i} style={{ fontSize: '.64rem' }}>{c.name}</div>)}
          </>
        )}
      </div>

      <div className="rmain">
        {p.summary && (
          <div className="rsec">
            <div className="rstitle" style={{ color: accent.bg, borderColor: accent.ac }}>Profile</div>
            <div className="rsum">
              <E field="personal.summary" label="Summary" type="textarea">{p.summary}</E>
            </div>
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="rsec">
            <div className="rstitle" style={{ color: accent.bg, borderColor: accent.ac }}>Experience</div>
            {data.experience.map(e => (
              <div className="rentry" key={e.id}>
                <div className="reh">
                  <span className="retitle"><E field={`exp.${e.id}.role`} label="Job Title">{e.role}</E></span>
                  <span className="redate">{[e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ')}</span>
                </div>
                <div className="resub">
                  <E field={`exp.${e.id}.company`} label="Company">{e.company}</E>
                  {e.location ? ` · ${e.location}` : ''}
                </div>
                <Desc text={e.description} className="redesc" />
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div className="rsec">
            <div className="rstitle" style={{ color: accent.bg, borderColor: accent.ac }}>Education</div>
            {data.education.map(e => (
              <div className="rentry" key={e.id}>
                <div className="reh">
                  <span className="retitle"><E field={`edu.${e.id}.school`} label="School">{e.school}</E></span>
                  <span className="redate">{[e.start, e.end].filter(Boolean).join(' – ')}</span>
                </div>
                <div className="resub">{[e.degree, e.field].filter(Boolean).join(', ')}{e.gpa ? ` · GPA ${e.gpa}` : ''}</div>
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div className="rsec">
            <div className="rstitle" style={{ color: accent.bg, borderColor: accent.ac }}>Projects</div>
            {data.projects.map(pr => (
              <div className="rentry" key={pr.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="retitle"><E field={`proj.${pr.id}.name`} label="Project Name">{pr.name}</E></div>
                  {pr.link && (
                    <a href={pr.link.startsWith('http') ? pr.link : 'https://' + pr.link} target="_blank" rel="noreferrer"
                      style={{ fontSize: '.62rem', color: accent.ac, fontFamily: 'DM Mono,monospace', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, marginLeft: 7 }}>
                      {/github\.com/i.test(pr.link) ? <><GitHubIcon /> GitHub</> : '⊕ Live'} ↗
                    </a>
                  )}
                </div>
                {pr.tech && <div className="resub">{pr.tech}</div>}
                {pr.description && <Desc text={pr.description} className="redesc" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}