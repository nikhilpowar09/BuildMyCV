/* ─────────────────────────────────────────────────────────────
   ai.js  —  DeepSeek via Anthropic-compatible endpoint
   Base URL : https://api.deepseek.com/anthropic
   Model    : deepseek-chat  (DeepSeek-V3, extremely affordable)
   Docs     : https://api-docs.deepseek.com/
   ───────────────────────────────────────────────────────────── */

const DEEPSEEK_BASE  = 'https://api.deepseek.com/anthropic'
const DEEPSEEK_MODEL = 'deepseek-chat'

function getKey() {
  const key = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (!key || key === 'your_deepseek_api_key_here') {
    throw new Error(
      'Missing API key.\n' +
      '1. Get a FREE key at https://platform.deepseek.com/api-keys\n' +
      '2. Add  VITE_DEEPSEEK_API_KEY=sk-...  to your .env.local\n' +
      '3. Restart the dev server: npm run dev'
    )
  }
  return key
}

/**
 * callAI(prompt, systemPrompt?)
 * Calls DeepSeek-V3 via the Anthropic-compatible messages endpoint.
 * Returns the assistant's text response.
 */
export async function callAI(
  prompt,
  system = 'You are an expert resume writer. Be concise, professional, and ATS-optimized.'
) {
  const key = getKey()

  const res = await fetch(`${DEEPSEEK_BASE}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'x-api-key':     key,
      'anthropic-version': '2023-06-01',   // required by the compat layer, value ignored
    },
    body: JSON.stringify({
      model:      DEEPSEEK_MODEL,
      max_tokens: 1000,
      system,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    let msg = `DeepSeek API error ${res.status}`
    try { const e = await res.json(); msg = e?.error?.message || msg } catch (_) {}
    throw new Error(msg)
  }

  const data = await res.json()
  // Anthropic-compat response shape: data.content[0].text
  return data?.content?.map(b => b.text || '').join('') || ''
}

/**
 * buildPrompt(toolId, { data, ctx, jobDesc, customP })
 * Returns the prompt string for the given AI writing tool.
 */
export function buildPrompt(toolId, { data, ctx = '', jobDesc = '', customP = '' }) {
  const p      = data.personal
  const name   = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'the candidate'
  const expStr = data.experience
    .map(e => `${e.role} at ${e.company}: ${e.description}`)
    .join('\n')
  const skStr  = [...data.skills.technical, ...data.skills.soft]
    .slice(0, 8).join(', ')

  const prompts = {
    summary:
      `Write a professional resume summary for ${name}, title: "${p.title || 'professional'}". ` +
      `Experience:\n${expStr || 'n/a'}.\nSkills: ${skStr || 'various'}.\n` +
      `2-3 powerful sentences. ATS-optimized. No first-person pronouns. Start with job title.`,

    improve:
      `Improve this resume summary. 2-3 sentences, no first-person, strong action verbs:\n\n"${p.summary}"`,

    bullets:
      `Convert to 3-5 strong resume bullet points with quantified results. Use action verbs:\n\n` +
      `"${ctx || data.experience[0]?.description || 'Managed projects'}"`,

    skills:
      `List 10 specific technical skills for a "${p.title || 'software engineer'}". ` +
      `ATS-friendly. Reply ONLY with comma-separated skill names, nothing else.`,

    cover:
      `Write a compelling cover letter opening paragraph (3-4 sentences) for ${name} ` +
      `applying as ${p.title || 'a professional'}. Confident and specific.`,

    tailor:
      `Job description:\n"${ctx || jobDesc}"\n\n` +
      `Give 5 specific improvements to this resume to better match the JD. ` +
      `Title: "${p.title}", skills: ${skStr}.`,

    enhance:
      `Enhance these resume bullets with stronger action verbs and quantified achievements:\n\n"${ctx}"`,

    custom: customP,
  }

  return prompts[toolId] || prompts.custom
}