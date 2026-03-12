export const TEMPLATES = [
  { id: 'classic',   label: 'Classic',   description: 'Traditional gold-header editorial style' },
  { id: 'modern',    label: 'Modern',    description: 'Sidebar layout with skill bars' },
  { id: 'minimal',   label: 'Minimal',   description: 'Clean Merriweather serif, ultra-spacious' },
  { id: 'executive', label: 'Executive', description: 'Two-column C-Suite style' },
  { id: 'tech',      label: 'Tech',      description: 'GitHub dark theme for developers' },
]

export const ACCENTS = [
  { bg: '#1a1915', ac: '#e8c97a', name: 'Noir Gold'  },
  { bg: '#0d1f2d', ac: '#60a8d0', name: 'Navy'       },
  { bg: '#1a0f0f', ac: '#e07a7a', name: 'Crimson'    },
  { bg: '#0f1a0f', ac: '#7ab87a', name: 'Forest'     },
  { bg: '#1a1520', ac: '#b07adc', name: 'Dusk'       },
  { bg: '#1a1510', ac: '#d4956a', name: 'Copper'     },
]

export const STEPS = ['Profile', 'Experience', 'Education', 'Skills', 'Projects', 'Extras']

export const EMPTY_RESUME = {
  personal: {
    firstName: '', lastName: '', title: '',
    email: '', phone: '', location: '',
    // social
    linkedin: '', github: '', leetcode: '',
    hackerrank: '', portfolio: '', twitter: '',
    summary: '',
  },
  experience: [],
  education:  [],
  skills:     { technical: [], soft: [], languages: [] },
  projects:   [],
  extras:     { certifications: [], volunteer: '', interests: '' },
}

export const AI_TOOLS = [
  { id: 'summary', icon: '📝', label: 'Generate Summary',    desc: 'AI-written professional summary'  },
  { id: 'improve', icon: '⚡', label: 'Improve My Summary',  desc: 'Polish your existing text'        },
  { id: 'bullets', icon: '📋', label: 'Job → Bullet Points', desc: 'Convert prose to action bullets'  },
  { id: 'skills',  icon: '🎯', label: 'Suggest Skills',       desc: 'Based on your job title'          },
  { id: 'cover',   icon: '💌', label: 'Cover Letter Opener', desc: 'Compelling first paragraph'       },
]

// Social link metadata for display in resume templates
export const SOCIAL_META = {
  linkedin:   { label: 'LinkedIn',   short: 'in'  },
  github:     { label: 'GitHub',     short: '⌥'  },
  leetcode:   { label: 'LeetCode',   short: 'lc'  },
  hackerrank: { label: 'HackerRank', short: 'hr'  },
  portfolio:  { label: 'Portfolio',  short: '⊕'  },
  twitter:    { label: 'Twitter',    short: '𝕏'   },
}