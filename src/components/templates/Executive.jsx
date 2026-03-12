import Desc from '../ui/Desc'

export default function Executive({ data, accent }) {
  const p     = data.personal
  const allSk = [...data.skills.technical, ...data.skills.soft, ...data.skills.languages]
  return (
    <div className="rdoc executive" style={{ color: accent.bg }}>
      <div className="rh" style={{ borderColor: accent.ac }}>
        <div className="rname">{[p.firstName, p.lastName].filter(Boolean).join(' ') || 'Your Name'}</div>
        {p.title && <div className="rtitle" style={{ color: '#666' }}>{p.title}</div>}
        <div className="rcontacts" style={{ color: '#666' }}>
          {p.email && <span>✉ {p.email}</span>}{p.phone && <span>✆ {p.phone}</span>}
          {p.location && <span>⌖ {p.location}</span>}{p.linkedin && <span>in {p.linkedin}</span>}
        </div>
      </div>
      <div className="rbody">
        <div>
          {p.summary && <div className="rsum">{p.summary}</div>}
          {data.experience.length > 0 && <div className="rsec"><div className="rstitle" style={{ color: accent.bg }}>Professional Experience</div><div className="rsline" />{data.experience.map(e => (<div className="rentry" key={e.id}><div className="retitle" style={{ color: accent.bg }}>{e.role || 'Role'}</div><div className="resub">{e.company}{e.location ? `, ${e.location}` : ''}</div><div className="redate">{[e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ')}</div><Desc text={e.description} className="redesc" /></div>))}</div>}
          {data.projects.length > 0 && <div className="rsec"><div className="rstitle" style={{ color: accent.bg }}>Key Projects</div><div className="rsline" />{data.projects.map(pr => (<div className="rentry" key={pr.id}><div className="retitle" style={{ color: accent.bg }}>{pr.name}</div>{pr.tech && <div className="resub">{pr.tech}</div>}{pr.description && <div className="redesc">{pr.description}</div>}</div>))}</div>}
        </div>
        <div>
          {data.education.length > 0 && <div className="rsec"><div className="rstitle" style={{ color: accent.bg }}>Education</div><div className="rsline" />{data.education.map(e => (<div key={e.id} style={{ marginBottom: 10 }}><div style={{ fontSize: '.8rem', fontWeight: 700, color: accent.bg }}>{e.school}</div><div style={{ fontSize: '.73rem', color: '#666', fontStyle: 'italic' }}>{[e.degree, e.field].filter(Boolean).join(', ')}</div><div style={{ fontSize: '.62rem', color: '#999', fontFamily: 'DM Mono,monospace' }}>{[e.start, e.end].filter(Boolean).join(' – ')}</div></div>))}</div>}
          {allSk.length > 0 && <div className="rsec"><div className="rstitle" style={{ color: accent.bg }}>Core Competencies</div><div className="rsline" />{allSk.map((s, i) => <div className="rsktag" key={i}>{s}</div>)}</div>}
          {data.extras.certifications.length > 0 && <div className="rsec"><div className="rstitle" style={{ color: accent.bg }}>Certifications</div><div className="rsline" />{data.extras.certifications.map((c, i) => <div className="rsktag" key={i}>{c.name}{c.year ? ` (${c.year})` : ''}</div>)}</div>}
        </div>
      </div>
    </div>
  )
}