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

export function yearsFromExperience(experience: WithoutApiExperience[]): number {
  if (!experience?.length) return 0;
  const parseDate = (dateStr: string) =>
    dateStr.toLowerCase() === 'present' ? new Date() : new Date(dateStr);
  const earliest = experience.reduce((min, job) => {
    const d = parseDate(job.start_date);
    return d < min ? d : min;
  }, new Date());
  return Math.round((Date.now() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 365));
}

export function buildPromptVariables(profileData: WithoutApiProfileData, jd: string) {
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
  };
}

export function buildManualPrompt(
  profileData: WithoutApiProfileData,
  jd: string,
  promptTemplate: string
): string {
  return processTemplate(promptTemplate, buildPromptVariables(profileData, jd));
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
