import { useState, useCallback } from 'react'
import { callAI, buildPrompt } from '../utils/ai'
import useResumeStore from './useResumeStore'

export function useAIAssistant() {
  const [loading,    setLoading]    = useState(false)
  const [result,     setResult]     = useState('')
  const [activeTool, setActiveTool] = useState(null)
  const [error,      setError]      = useState(null)

  const data          = useResumeStore(s => s.data)
  const setPersonal   = useResumeStore(s => s.setPersonal)
  const addSkillsBulk = useResumeStore(s => s.addSkillsBulk)

  const run = useCallback(async (toolId, ctx = '', { jobDesc = '', customP = '' } = {}) => {
    setLoading(true); setResult(''); setError(null); setActiveTool(toolId)
    try {
      const text = await callAI(buildPrompt(toolId, { data, ctx, jobDesc, customP }))
      setResult(text)
    } catch (err) {
      setError(err.message || 'AI request failed. Check your VITE_DEEPSEEK_API_KEY in .env.local.')
    } finally {
      setLoading(false)
    }
  }, [data])

  const clearResult = useCallback(() => {
    setResult(''); setActiveTool(null); setError(null)
  }, [])

  const applyResult = useCallback(() => {
    if (!result) return null
    if (activeTool === 'summary' || activeTool === 'improve') {
      setPersonal('summary', result.trim()); clearResult(); return 'summary'
    }
    if (activeTool === 'skills') {
      const skills = result.split(',').map(s => s.trim()).filter(Boolean).slice(0, 10)
      addSkillsBulk('technical', skills); clearResult(); return 'skills:' + skills.length
    }
    return null
  }, [result, activeTool, setPersonal, addSkillsBulk, clearResult])

  const rerun = useCallback((ctx = '', opts = {}) => {
    if (activeTool) run(activeTool, ctx, opts)
  }, [activeTool, run])

  return { loading, result, error, activeTool, run, applyResult, clearResult, rerun }
}