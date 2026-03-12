export default function Desc({ text, className = '' }) {
  if (!text) return null
  const lines   = text.split('\n').map(l => l.trim()).filter(Boolean)
  const bullets = lines.filter(l => /^[•\-*]/.test(l))
  if (bullets.length > 0) {
    return (
      <div className={className}>
        <ul>{bullets.map((b, i) => <li key={i}>{b.replace(/^[•\-*]\s*/, '')}</li>)}</ul>
      </div>
    )
  }
  return <div className={className}>{text}</div>
}