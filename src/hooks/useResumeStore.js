import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { v4 as uuidv4 } from 'uuid'
import { EMPTY_RESUME, ACCENTS } from '../utils/constants'

const MAX_SAVED = 10

const useResumeStore = create(
  immer((set, get) => ({
    data:         { ...EMPTY_RESUME },
    template:     'classic',
    accent:       ACCENTS[0],
    step:         0,
    inlineEdit:   false,
    aiOpen:       false,
    atsOpen:      false,
    savedResumes: [], // [{ id, name, data, template, accent, savedAt }]
    activeId:     null, // currently loaded saved resume id (null = unsaved)
    resumesOpen:  false,

    /* ── Personal ── */
    setPersonal: (key, value) => set(s => { s.data.personal[key] = value }),

    /* ── Experience ── */
    addExperience: () => set(s => {
      s.data.experience.push({ id: uuidv4(), company: '', role: '', location: '', start: '', end: '', current: false, description: '' })
    }),
    updateExperience: (id, key, value) => set(s => { const e = s.data.experience.find(x => x.id === id); if (e) e[key] = value }),
    removeExperience: id => set(s => { s.data.experience = s.data.experience.filter(e => e.id !== id) }),

    /* ── Education ── */
    addEducation: () => set(s => {
      s.data.education.push({ id: uuidv4(), school: '', degree: '', field: '', start: '', end: '', gpa: '', notes: '' })
    }),
    updateEducation: (id, key, value) => set(s => { const e = s.data.education.find(x => x.id === id); if (e) e[key] = value }),
    removeEducation: id => set(s => { s.data.education = s.data.education.filter(e => e.id !== id) }),

    /* ── Skills ── */
    addSkill: (cat, value) => set(s => { if (!s.data.skills[cat].includes(value)) s.data.skills[cat].push(value) }),
    removeSkill: (cat, index) => set(s => { s.data.skills[cat].splice(index, 1) }),
    addSkillsBulk: (cat, skills) => set(s => {
      const ex = new Set(s.data.skills[cat])
      skills.forEach(sk => { if (!ex.has(sk)) s.data.skills[cat].push(sk) })
    }),

    /* ── Projects ── */
    addProject: () => set(s => {
      s.data.projects.push({ id: uuidv4(), name: '', tech: '', description: '', link: '' })
    }),
    updateProject: (id, key, value) => set(s => { const p = s.data.projects.find(x => x.id === id); if (p) p[key] = value }),
    removeProject: id => set(s => { s.data.projects = s.data.projects.filter(p => p.id !== id) }),

    /* ── Extras ── */
    addCertification: cert => set(s => { s.data.extras.certifications.push({ ...cert, id: uuidv4() }) }),
    removeCertification: index => set(s => { s.data.extras.certifications.splice(index, 1) }),
    setExtras: (key, value) => set(s => { s.data.extras[key] = value }),

    /* ── UI State ── */
    setTemplate:   t => set(s => { s.template   = t }),
    setAccent:     a => set(s => { s.accent      = a }),
    setStep:       v => set(s => { s.step        = v }),
    setInlineEdit: v => set(s => { s.inlineEdit  = v }),
    toggleAI:      () => set(s => { s.aiOpen     = !s.aiOpen }),
    toggleATS:     () => set(s => { s.atsOpen    = !s.atsOpen }),
    closeATS:      () => set(s => { s.atsOpen    = false }),
    toggleResumes: () => set(s => { s.resumesOpen = !s.resumesOpen }),
    closeResumes:  () => set(s => { s.resumesOpen = false }),

    /* ── Saved Resumes ── */
    saveResume: (name) => set(s => {
      const state = get()
      const id    = state.activeId || uuidv4()
      const entry = {
        id,
        name: name || `${state.data.personal.firstName || 'Untitled'} Resume — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
        data:     JSON.parse(JSON.stringify(state.data)),
        template: state.template,
        accent:   state.accent,
        savedAt:  Date.now(),
      }
      const idx = s.savedResumes.findIndex(r => r.id === id)
      if (idx >= 0) s.savedResumes[idx] = entry
      else { s.savedResumes.unshift(entry); if (s.savedResumes.length > MAX_SAVED) s.savedResumes.pop() }
      s.activeId = id
    }),

    loadResume: (id) => set(s => {
      const r = s.savedResumes.find(r => r.id === id)
      if (!r) return
      s.data     = JSON.parse(JSON.stringify(r.data))
      s.template = r.template
      s.accent   = r.accent
      s.activeId = id
      s.resumesOpen = false
      s.step     = 0
    }),

    deleteResume: (id) => set(s => {
      s.savedResumes = s.savedResumes.filter(r => r.id !== id)
      if (s.activeId === id) s.activeId = null
    }),

    duplicateResume: (id) => set(s => {
      const r = s.savedResumes.find(r => r.id === id)
      if (!r) return
      const copy = { ...JSON.parse(JSON.stringify(r)), id: uuidv4(), name: r.name + ' (Copy)', savedAt: Date.now() }
      s.savedResumes.unshift(copy)
    }),

    newResume: () => set(s => {
      s.data      = JSON.parse(JSON.stringify(EMPTY_RESUME))
      s.template  = 'classic'
      s.accent    = ACCENTS[0]
      s.activeId  = null
      s.step      = 0
      s.resumesOpen = false
    }),

    resetResume: () => set(s => { s.data = JSON.parse(JSON.stringify(EMPTY_RESUME)) }),
  }))
)

export default useResumeStore