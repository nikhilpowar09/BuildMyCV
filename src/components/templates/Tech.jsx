import Desc from '../ui/Desc'

function GitHubIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle' }}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

export default function Tech({ data, inline, openEdit }) {
  const p     = data.personal
  const allSk = [...data.skills.technical, ...data.skills.soft, ...data.skills.languages]

  const E = ({ field, label, children, type = 'text' }) => {
    if (!inline || !openEdit) return <>{children}</>
    return (
      <span className="editable" onClick={e => { e.stopPropagation(); openEdit(field, label, typeof children === 'string' ? children : '', type) }}>
        {children}
      </span>
    )
  }

  const socialLinks = [
    { key: 'linkedin', icon: 'in', href: p.linkedin },
    { key: 'github', icon: <GitHubIcon />, href: p.github },
    { key: 'leetcode', icon: 'lc', href: p.leetcode },
    { key: 'hackerrank', icon: 'hr', href: p.hackerrank },
    { key: 'portfolio', icon: '⊕', href: p.portfolio },
  ].filter(s => s.href)

  return (
    <div className="rdoc tech">
      <div className="rh">
        <div className="rname">
          <E field="personal.firstName" label="First Name">{p.firstName || 'first'}</E>
          <span style={{ color: '#58a6ff' }}>_</span>
          <E field="personal.lastName" label="Last Name">{p.lastName || 'last'}</E>
        </div>
        {p.title && (
          <div className="rtitle">
            <E field="personal.title" label="Title">{p.title}</E>
          </div>
        )}
        <div className="rcontacts">
          {p.email    && <span>{p.email}</span>}
          {p.phone    && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {socialLinks.map(s => (
            <span key={s.key}>
              <a href={s.href.startsWith('http') ? s.href : 'https://' + s.href} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                {s.icon} {s.href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </a>
            </span>
          ))}
        </div>
      </div>

      <div className="rbody">
        {p.summary && (
          <div className="rsec">
            <div className="rstitle">about</div>
            <div className="rsum">
              <E field="personal.summary" label="Summary" type="textarea">{p.summary}</E>
            </div>
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="rsec">
            <div className="rstitle">experience</div>
            {data.experience.map(e => (
              <div className="rentry" key={e.id}>
                <div className="retitle"><E field={`exp.${e.id}.role`} label="Job Title">{e.role || 'Role'}</E></div>
                {e.company && (
                  <div className="resub">
                    <E field={`exp.${e.id}.company`} label="Company">{e.company}</E>
                    {e.location ? ` // ${e.location}` : ''}
                  </div>
                )}
                <div className="redate">{[e.start, e.current ? 'present' : e.end].filter(Boolean).join(' → ')}</div>
                <Desc text={e.description} className="redesc" />
              </div>
            ))}
          </div>
        )}

        {data.projects.length > 0 && (
          <div className="rsec">
            <div className="rstitle">projects</div>
            {data.projects.map(pr => (
              <div className="rproj" key={pr.id}>
                <div className="rpname" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><E field={`proj.${pr.id}.name`} label="Project Name">{pr.name}</E></span>
                  {pr.link && (
                    <a href={pr.link.startsWith('http') ? pr.link : 'https://' + pr.link} target="_blank" rel="noreferrer"
                      style={{ color: '#8b949e', fontSize: '.62rem', fontFamily: 'DM Mono,monospace', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, marginLeft: 8 }}>
                      {/github\.com/i.test(pr.link) ? (
                        <><GitHubIcon /> github</>
                      ) : (
                        <>⊕ live</>
                      )} ↗
                    </a>
                  )}
                </div>
                {pr.tech && <div className="rptech">[{pr.tech}]</div>}
                {pr.description && <Desc text={pr.description} className="rpdesc" />}
              </div>
            ))}
          </div>
        )}

        {(data.skills.technical.length > 0 || data.skills.soft.length > 0 || data.skills.languages.length > 0) && (
          <div className="rsec">
            <div className="rstitle">skills</div>

            {data.skills.technical.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: '.56rem', color: '#3fb950', fontFamily: 'DM Mono,monospace', marginBottom: 4, letterSpacing: '.1em' }}>// technical</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {data.skills.technical.map((s, i) => (
                    <span key={i} style={{ background: '#161b22', border: '1px solid #21262d', color: '#79c0ff', padding: '2px 7px', borderRadius: 3, fontSize: '.64rem', fontFamily: 'DM Mono,monospace' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {data.skills.soft.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: '.56rem', color: '#bc8cff', fontFamily: 'DM Mono,monospace', marginBottom: 4, letterSpacing: '.1em' }}>// soft skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {data.skills.soft.map((s, i) => (
                    <span key={i} style={{ background: '#161b22', border: '1px solid #30253d', color: '#bc8cff', padding: '2px 7px', borderRadius: 3, fontSize: '.64rem', fontFamily: 'DM Mono,monospace' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {data.skills.languages.length > 0 && (
              <div>
                <div style={{ fontSize: '.56rem', color: '#ffa657', fontFamily: 'DM Mono,monospace', marginBottom: 4, letterSpacing: '.1em' }}>// languages</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {data.skills.languages.map((s, i) => (
                    <span key={i} style={{ background: '#161b22', border: '1px solid #3d2a1a', color: '#ffa657', padding: '2px 7px', borderRadius: 3, fontSize: '.64rem', fontFamily: 'DM Mono,monospace' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {data.education.length > 0 && (
          <div className="rsec">
            <div className="rstitle">education</div>
            {data.education.map(e => (
              <div className="rentry" key={e.id}>
                <div className="retitle"><E field={`edu.${e.id}.school`} label="School">{e.school}</E></div>
                <div className="resub">{[e.degree, e.field].filter(Boolean).join(' · ')}{e.gpa ? ` · ${e.gpa}` : ''}</div>
                <div className="redate">{[e.start, e.end].filter(Boolean).join(' → ')}</div>
              </div>
            ))}
          </div>
        )}

        {data.extras.certifications.length > 0 && (
          <div className="rsec">
            <div className="rstitle">certifications</div>
            {data.extras.certifications.map((c, i) => (
              <div className="rentry" key={i}>
                <div className="retitle">{c.name}</div>
                <div className="resub">{[c.issuer, c.year].filter(Boolean).join(' · ')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}