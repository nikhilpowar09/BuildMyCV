import Desc from '../ui/Desc'
import { SOCIAL_META } from '../../utils/constants'

/* ── Mini social icon SVGs for resume display ── */
function LinkedInIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle' }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}
function GitHubIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle' }}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function SocialLink({ href, icon, label, color }) {
  const el = href ? (
    <a href={href.startsWith('http') ? href : 'https://' + href} target="_blank" rel="noreferrer"
      style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      {icon} {label}
    </a>
  ) : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>{icon} {label}</span>
  return <span style={{ color }}>{el}</span>
}

export default function Classic({ data, accent, inline, openEdit, EditableSection }) {
  const p     = data.personal
  const allSk = [...data.skills.technical, ...data.skills.soft, ...data.skills.languages]

  const E = ({ field, label, children, type = 'text' }) => {
    if (!inline || !openEdit) return <>{children}</>
    return (
      <span className="editable" onClick={e => { e.stopPropagation(); openEdit(field, label, typeof children === 'string' ? children : '', type) }}
        title={`Click to edit ${label}`}>
        {children}
      </span>
    )
  }

  const headerColor = accent.bg
  const accentColor = accent.ac

  return (
    <div className="rdoc classic">
      {/* HEADER */}
      <div className="rh" style={{ background: headerColor }}>
        <div className="rname">
          <E field="personal.firstName" label="First Name">{p.firstName || 'First'}</E>
          {' '}
          <E field="personal.lastName" label="Last Name">{p.lastName || 'Last'}</E>
        </div>
        {p.title && (
          <div className="rtitle" style={{ color: accentColor }}>
            <E field="personal.title" label="Title">{p.title}</E>
          </div>
        )}
        <div className="rcontacts">
          {p.email    && <span>✉ <E field="personal.email" label="Email">{p.email}</E></span>}
          {p.phone    && <span>✆ <E field="personal.phone" label="Phone">{p.phone}</E></span>}
          {p.location && <span>⌖ <E field="personal.location" label="Location">{p.location}</E></span>}
          {p.linkedin && (
            <span>
              <SocialLink href={p.linkedin} icon={<LinkedInIcon />} label={p.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\//i, 'linkedin.com/')} color="#9a8a70" />
            </span>
          )}
          {p.github && (
            <span>
              <SocialLink href={p.github} icon={<GitHubIcon />} label={p.github.replace(/^https?:\/\/(www\.)?github\.com\//i, 'github.com/')} color="#9a8a70" />
            </span>
          )}
          {p.leetcode    && <span>lc/ <a href={p.leetcode.startsWith('http') ? p.leetcode : 'https://' + p.leetcode} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{p.leetcode.replace(/^https?:\/\/(www\.)?leetcode\.com\//i, '')}</a></span>}
          {p.hackerrank  && <span>hr/ <a href={p.hackerrank.startsWith('http') ? p.hackerrank : 'https://' + p.hackerrank} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{p.hackerrank.replace(/^https?:\/\/.*?hackerrank\.com\//i, '')}</a></span>}
          {p.portfolio   && <span>⊕ <a href={p.portfolio.startsWith('http') ? p.portfolio : 'https://' + p.portfolio} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{p.portfolio}</a></span>}
          {p.twitter     && <span>𝕏 <a href={p.twitter.startsWith('http') ? p.twitter : 'https://' + p.twitter} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>{p.twitter.replace(/^https?:\/\/(www\.)?x\.com\//i, '@')}</a></span>}
        </div>
      </div>

      {/* BODY */}
      <div className="rbody">
        {/* Summary */}
        {p.summary && (
          <div className="rsec">
            <div className="rstitle" style={{ color: headerColor, borderColor: accentColor }}>Summary</div>
            <div className="rsum">
              <E field="personal.summary" label="Summary" type="textarea">{p.summary}</E>
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="rsec">
            <div className="rstitle" style={{ color: headerColor, borderColor: accentColor }}>Experience</div>
            {data.experience.map(e => (
              <div className="rentry" key={e.id}>
                <div className="reh">
                  <span className="retitle">
                    <E field={`exp.${e.id}.role`} label="Job Title">{e.role || 'Role'}</E>
                  </span>
                  <span className="redate">{[e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ')}</span>
                </div>
                {e.company && (
                  <div className="resub">
                    <E field={`exp.${e.id}.company`} label="Company">{e.company}</E>
                    {e.location ? ` · ${e.location}` : ''}
                  </div>
                )}
                <Desc text={e.description} className="redesc" />
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="rsec">
            <div className="rstitle" style={{ color: headerColor, borderColor: accentColor }}>Education</div>
            {data.education.map(e => (
              <div className="rentry" key={e.id}>
                <div className="reh">
                  <span className="retitle">
                    <E field={`edu.${e.id}.school`} label="School">{e.school || 'School'}</E>
                  </span>
                  <span className="redate">{[e.start, e.end].filter(Boolean).join(' – ')}</span>
                </div>
                <div className="resub">
                  {[e.degree, e.field].filter(Boolean).join(' · ')}
                  {e.gpa ? ` — ${e.gpa}` : ''}
                </div>
                {e.notes && <div style={{ fontSize: '.73rem', color: '#555' }}>{e.notes}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Skills — 3 distinct visual rows */}
        {(data.skills.technical.length > 0 || data.skills.soft.length > 0 || data.skills.languages.length > 0) && (
          <div className="rsec">
            <div className="rstitle" style={{ color: headerColor, borderColor: accentColor }}>Skills</div>

            {data.skills.technical.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: '.57rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 5, fontFamily: 'DM Mono,monospace' }}>Technical</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {data.skills.technical.map((s, i) => (
                    <span key={i} style={{ background: '#f0f8f0', border: '1px solid #c8e8c8', color: '#2a5a2a', padding: '2px 8px', borderRadius: 11, fontSize: '.67rem', fontFamily: 'DM Mono,monospace' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {data.skills.soft.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: '.57rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 5, fontFamily: 'DM Mono,monospace' }}>Soft Skills</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {data.skills.soft.map((s, i) => (
                    <span key={i} style={{ background: '#f0f0fa', border: '1px solid #c8c8e8', color: '#2a2a6a', padding: '2px 8px', borderRadius: 11, fontSize: '.67rem', fontFamily: 'DM Mono,monospace' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {data.skills.languages.length > 0 && (
              <div>
                <div style={{ fontSize: '.57rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 5, fontFamily: 'DM Mono,monospace' }}>Languages</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {data.skills.languages.map((s, i) => (
                    <span key={i} style={{ background: '#faf4ec', border: `1px solid ${accentColor}55`, color: '#5a3a10', padding: '2px 8px', borderRadius: 11, fontSize: '.67rem', fontFamily: 'DM Mono,monospace' }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div className="rsec">
            <div className="rstitle" style={{ color: headerColor, borderColor: accentColor }}>Projects</div>
            {data.projects.map(pr => (
              <div className="rproj" key={pr.id} style={{ borderLeftColor: accentColor }}>
                <div className="rpname" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <E field={`proj.${pr.id}.name`} label="Project Name">{pr.name}</E>
                  {pr.link && (
                    <a href={pr.link.startsWith('http') ? pr.link : 'https://' + pr.link} target="_blank" rel="noreferrer"
                      style={{ fontSize: '.64rem', color: accentColor, fontFamily: 'DM Mono,monospace', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, marginLeft: 8 }}>
                      {/github\.com/i.test(pr.link) ? (
                        <><GitHubIcon /> GitHub</>
                      ) : (
                        <>⊕ View</>
                      )} ↗
                    </a>
                  )}
                </div>
                {pr.tech && <div className="rptech" style={{ color: accentColor }}>{pr.tech}</div>}
                {pr.description && <Desc text={pr.description} className="rpdesc" />}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {data.extras.certifications.length > 0 && (
          <div className="rsec">
            <div className="rstitle" style={{ color: headerColor, borderColor: accentColor }}>Certifications</div>
            {data.extras.certifications.map((c, i) => (
              <div className="rentry" key={i}>
                <div className="retitle">{c.name}</div>
                <div className="resub">{[c.issuer, c.year].filter(Boolean).join(' · ')}</div>
              </div>
            ))}
          </div>
        )}

        {data.extras.volunteer && (
          <div className="rsec">
            <div className="rstitle" style={{ color: headerColor, borderColor: accentColor }}>Volunteering</div>
            <div className="rsum">{data.extras.volunteer}</div>
          </div>
        )}
        {data.extras.interests && (
          <div className="rsec">
            <div className="rstitle" style={{ color: headerColor, borderColor: accentColor }}>Interests</div>
            <div className="rsum">{data.extras.interests}</div>
          </div>
        )}
      </div>
    </div>
  )
}