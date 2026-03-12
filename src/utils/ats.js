export function calcATS(data, jobDesc = '') {
  const p = data.personal
  const checks = []
  checks.push({ ok: !!p.email,    msg: 'Email address',   cat: 'contact' })
  checks.push({ ok: !!p.phone,    msg: 'Phone number',    cat: 'contact' })
  checks.push({ ok: !!p.location, msg: 'City / Location', cat: 'contact' })
  checks.push({ ok: !!p.linkedin, msg: 'LinkedIn URL',    cat: 'contact' })
  checks.push({ ok: !!p.summary && p.summary.length > 80, msg: 'Summary (80+ chars)', cat: 'content' })
  checks.push({ ok: data.experience.length > 0,           msg: 'Work experience',     cat: 'content' })
  checks.push({ ok: data.education.length > 0,            msg: 'Education section',   cat: 'content' })
  checks.push({ ok: data.skills.technical.length >= 5,    msg: '5+ technical skills', cat: 'content' })
  checks.push({ ok: data.experience.some(e => (e.description || '').length > 100), msg: 'Detailed descriptions', cat: 'content' })
  checks.push({ ok: data.experience.some(e => /\d+[%x]|\$\d+|\d+ (users|clients|team|people)/i.test(e.description || '')), msg: 'Quantified achievements', cat: 'content' })
  checks.push({ ok: !!p.title, msg: 'Professional headline', cat: 'format' })
  checks.push({ ok: !p.summary || !/\bI am\b|\bmy name\b|\bmyself\b/i.test(p.summary), msg: 'No first-person in summary', cat: 'format' })
  checks.push({ ok: data.experience.length === 0 || data.experience.every(e => e.start), msg: 'All jobs have dates', cat: 'format' })
  checks.push({ ok: data.projects.length > 0 || data.extras.certifications.length > 0, msg: 'Projects or certifications', cat: 'format' })
  let keywords = [], found = [], missing = []
  if (jobDesc && jobDesc.trim()) {
    const rt = JSON.stringify(data).toLowerCase()
    const words = jobDesc.toLowerCase().match(/\b[a-z][a-z+#.]{2,}\b/g) || []
    const freq = {}
    words.forEach(w => { if (w.length > 3) freq[w] = (freq[w] || 0) + 1 })
    keywords = Object.entries(freq).filter(([, v]) => v >= 2).sort((a, b) => b[1] - a[1]).slice(0, 16).map(([k]) => k)
    found   = keywords.filter(k => rt.includes(k))
    missing = keywords.filter(k => !rt.includes(k))
    if (keywords.length > 0) checks.push({ ok: found.length / keywords.length >= 0.55, msg: `JD keywords: ${found.length}/${keywords.length} matched`, cat: 'keywords' })
  }
  const score = Math.round(checks.filter(c => c.ok).length / checks.length * 100)
  return { score, checks, keywords, found, missing }
}

export function calcCompleteness(data) {
  let total = 0, done = 0
  const p = data.personal
  ;['firstName', 'lastName', 'title', 'email', 'phone', 'location', 'summary'].forEach(k => { total++; if (p[k]) done++ })
  total += 3; done += Math.min(data.experience.length, 2) + Math.min(data.education.length, 1)
  total += 2; done += (data.skills.technical.length >= 3 ? 1 : 0) + Math.min(data.projects.length, 1)
  return Math.round(done / total * 100)
}