import { getExperienceMetaMode, type ExperienceMetaMode } from './pdfTemplateMapping';

export type WithoutApiExperience = {
  company: string;
  title?: string;
  location?: string;
  start_date: string;
  end_date: string;
  industry?: string;
};

export type WithoutApiEducation = {
  degree: string;
  school: string;
  start_year: string;
  end_year: string;
  grade?: string;
};

export type WithoutApiProfileData = {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  postalCode?: string;
  linkedin?: string | { url?: string; show?: string | boolean };
  linkedinShow?: string | boolean;
  github?: string;
  website?: string;
  title?: string;
  experience: WithoutApiExperience[];
  education: WithoutApiEducation[];
};

export type ResumeContent = {
  title: string;
  techStack?: string;
  summary: string;
  skills: Record<string, string[]>;
  certifications?: string[];
  projects?: Array<{ heading?: string; content?: string }>;
  experience: Array<{ title?: string; project?: string; details: string[] }>;
};

function processTemplate(template: string, variables: Record<string, string | number>): string {
  let out = template;
  for (const [key, value] of Object.entries(variables)) {
    out = out.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value ?? ''));
  }
  return out;
}

// Parse the start_date strings used in profiles. Handles: "present", "MM/YYYY",
// "M/YYYY", "YYYY", "Mar 2023"/"March 2023", "YYYY-MM", and full dates. Returns
// null if the value can't be understood (so it's ignored, not mis-parsed).
export function parseExperienceDate(dateStr: string | null | undefined): Date | null {
  const s = String(dateStr || '').trim();
  if (!s) return null;
  if (s.toLowerCase() === 'present' || s.toLowerCase() === 'current') return new Date();

  // MM/YYYY or M/YYYY (e.g. 03/2023)
  let m = s.match(/^(\d{1,2})\/(\d{4})$/);
  if (m) return new Date(Number(m[2]), Number(m[1]) - 1, 1);

  // YYYY only
  m = s.match(/^(\d{4})$/);
  if (m) return new Date(Number(m[1]), 0, 1);

  // Everything else the JS engine handles (Mar 2023, March 2023, 2023-03, MM/DD/YYYY, …)
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export function yearsFromExperience(experience: WithoutApiExperience[]): number {
  if (!experience?.length) return 0;
  const parseDate = (dateStr: string) => parseExperienceDate(dateStr) ?? new Date();
  const earliest = experience.reduce((min, job) => {
    const d = parseDate(job.start_date);
    return d < min ? d : min;
  }, new Date());
  return Math.round((Date.now() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 365));
}

// Instruction for the per-job `project` field, tailored to the template the
// profile renders with (templates 4-6 want a Key Skills list, 7-10 want it
// dropped). Kept here so the copied prompt asks for exactly what the chosen
// template will display.
function experienceMetaGuidance(mode: ExperienceMetaMode): string {
  if (mode === 'keySkills') {
    return '- `"project"` — a **comma-separated list of 5–7 key skills/technologies** most relevant to this role and the JD (exact JD spelling), e.g. "React, Node.js, AWS, PostgreSQL, Redis". **Plain text — no bold, no sentence, no trailing period.** This renders as the role\'s "Key Skills" line.';
  }
  if (mode === 'none') {
    return '- `"project"` — set to an empty string `""` (this template does not render a per-job project/skills line).';
  }
  return '- `"project"` — one sentence (~10–16 words) on what you built on the main project, JD-aligned, with the key JD term bolded `[[…]]`. For the **most recent role only** (if credible), name + bold the JD industry here. e.g. "Built [[fintech payments]] services, migrating monolith billing to event-driven microservices."';
}

export function buildPromptVariables(
  profileData: WithoutApiProfileData,
  jd: string,
  pdfTemplate?: number
) {
  const workHistory = profileData.experience
    .map((job, idx) => {
      const parts = [`${idx + 1}. ${job.company}`];
      if (job.title) parts.push(job.title);
      if (job.location) parts.push(job.location);
      parts.push(`${job.start_date} - ${job.end_date}`);
      return parts.join(' | ');
    })
    .join('\n');

  const education = profileData.education
    .map((edu) => {
      let s = `- ${edu.degree}, ${edu.school} (${edu.start_year}-${edu.end_year})`;
      if (edu.grade) s += ` | GPA: ${edu.grade}`;
      return s;
    })
    .join('\n');

  return {
    name: profileData.name,
    email: profileData.email ?? '',
    location: profileData.location ?? '',
    yearsOfExperience: yearsFromExperience(profileData.experience),
    workHistory,
    education,
    jobDescription: jd,
    experienceCount: profileData.experience.length,
    resumeTitle: profileData.title || profileData.experience[0]?.title || 'Senior Software Engineer',
    experienceMetaGuidance: experienceMetaGuidance(getExperienceMetaMode(pdfTemplate ?? 1)),
  };
}

export function buildManualPrompt(
  profileData: WithoutApiProfileData,
  jd: string,
  promptTemplate: string,
  pdfTemplate?: number
): string {
  return processTemplate(promptTemplate, buildPromptVariables(profileData, jd, pdfTemplate));
}

export function parseWithoutApiProfileContent(content: string | null | undefined): WithoutApiProfileData | null {
  if (!content?.trim()) return null;
  try {
    const parsed = JSON.parse(content) as WithoutApiProfileData;
    if (!parsed?.name || !Array.isArray(parsed.experience) || !Array.isArray(parsed.education)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
