import Desc from '../ui/Desc'

export default function Minimal({ data }) {
  const p     = data.personal
  const allSk = [...data.skills.technical, ...data.skills.soft, ...data.skills.languages]
  return (
    <div className="rdoc minimal">
      <div className="rh">
        <div className="rname">{[p.firstName, p.lastName].filter(Boolean).join(' ') || 'Your Name'}</div>
        {p.title && <div className="rtitle">{p.title}</div>}
        <div className="rcontacts">
          {p.email && <span>{p.email}</span>}{p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}{p.website && <span>{p.website}</span>}
        </div>
      </div>
      <div className="rbody">
        {p.summary && <div className="rsec"><div className="rstitle">Profile</div><div className="rsum">{p.summary}</div></div>}
        {data.experience.length > 0 && <div className="rsec"><div className="rstitle">Experience</div>{data.experience.map(e => (<div className="rentry" key={e.id}><div className="reh"><span className="retitle">{e.role || 'Role'}</span><span className="redate">{[e.start, e.current ? 'Present' : e.end].filter(Boolean).join(' – ')}</span></div>{e.company && <div className="resub">{e.company}{e.location ? ` · ${e.location}` : ''}</div>}<Desc text={e.description} className="redesc" /></div>))}</div>}
        {data.education.length > 0 && <div className="rsec"><div className="rstitle">Education</div>{data.education.map(e => (<div className="rentry" key={e.id}><div className="reh"><span className="retitle">{e.school}</span><span className="redate">{[e.start, e.end].filter(Boolean).join(' – ')}</span></div><div className="resub">{[e.degree, e.field].filter(Boolean).join(', ')}{e.gpa ? ` — GPA: ${e.gpa}` : ''}</div></div>))}</div>}
        {allSk.length > 0 && <div className="rsec"><div className="rstitle">Skills</div><div className="rsktags">{allSk.map((s, i) => <span className="rsktag" key={i}>{s}</span>)}</div></div>}
        {data.projects.length > 0 && <div className="rsec"><div className="rstitle">Projects</div>{data.projects.map(pr => (<div className="rproj" key={pr.id}><div className="rpname">{pr.name}</div>{pr.tech && <div className="rptech">{pr.tech}</div>}{pr.description && <div className="rpdesc">{pr.description}</div>}</div>))}</div>}
      </div>
    </div>
  )
}