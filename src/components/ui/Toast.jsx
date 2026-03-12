import { useEffect, useState } from 'react'

export default function Toast({ message, onDone }) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onDone?.() }, 2600)
    return () => clearTimeout(t)
  }, [onDone])
  if (!visible || !message) return null
  return <div className="toast">{message}</div>
}