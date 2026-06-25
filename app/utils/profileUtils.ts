import type { WithoutApiProfileData, ResumeContent } from './profilePrompt';

export function getContactForPdf(profileData: WithoutApiProfileData | null) {
  if (!profileData) {
    return { phone: null as string | null, linkedin: null as string | null };
  }

  const rawPhone = profileData.phone;
  const phone =
    rawPhone != null && String(rawPhone).trim() !== '' ? String(rawPhone).trim() : null;

  const rawLi = profileData.linkedin;
  let linkedinUrl: string | null = null;
  let showLinkedin = false;

  if (rawLi != null && typeof rawLi === 'object' && !Array.isArray(rawLi)) {
    linkedinUrl =
      rawLi.url != null && String(rawLi.url).trim() !== '' ? String(rawLi.url).trim() : null;
    showLinkedin = rawLi.show === 'show' || rawLi.show === true;
  } else if (typeof rawLi === 'string') {
    const s = rawLi.trim();
    if (s && s !== 'show') {
      linkedinUrl = s;
    }
    showLinkedin =
      profileData.linkedinShow === 'show' || profileData.linkedinShow === true;
  }

  const linkedin = showLinkedin && linkedinUrl ? linkedinUrl : null;
  return { phone, linkedin };
}

export function buildResumePdfData(
  profileData: WithoutApiProfileData,
  resumeContent: ResumeContent,
  photo?: string | null
) {
  const { phone, linkedin } = getContactForPdf(profileData);
  return {
    name: profileData.name,
    title: (resumeContent.title || '').trim() || profileData.title || '',
    techStack: (resumeContent.techStack || '').trim(),
    photo: typeof photo === 'string' && photo.trim() ? photo.trim() : null,
    email: profileData.email,
    phone,
    location: profileData.location,
    linkedin,
    website: null as string | null,
    summary: resumeContent.summary,
    skills: resumeContent.skills,
    certifications: Array.isArray(resumeContent.certifications)
      ? resumeContent.certifications.filter((c) => typeof c === 'string' && c.trim())
      : [],
    projects: Array.isArray(resumeContent.projects)
      ? resumeContent.projects
          .filter((p) => p && typeof p === 'object' && ((p.heading || '').trim() || (p.content || '').trim()))
          .map((p) => ({ heading: (p.heading || '').trim(), content: (p.content || '').trim() }))
      : [],
    experience: profileData.experience.map((job, idx) => {
      const llmTitle = (resumeContent.experience[idx]?.title || '').trim();
      const profileTitle = (job.title || '').trim();
      // Most recent role: use the JD-tailored discipline title; older roles keep the real title.
      const title = (idx === 0 ? llmTitle || profileTitle : profileTitle || llmTitle) || 'Engineer';
      return {
      title,
      company: job.company,
      location: job.location,
      start_date: job.start_date,
      end_date: job.end_date,
      industry: job.industry,
      project: resumeContent.experience[idx]?.project || '',
      details: resumeContent.experience[idx]?.details || [],
      };
    }),
    education: profileData.education,
  };
}

export function pdfAttachmentFilename(resumeName: string, companyName?: string | null) {
  const nameParts = resumeName ? resumeName.trim().split(/\s+/) : [];
  let base =
    !nameParts.length
      ? 'resume'
      : nameParts.length === 1
        ? nameParts[0]
        : `${nameParts[0]}_${nameParts[nameParts.length - 1]}`;
  base = base.replace(/\s+/g, '_').replace(/[^A-Za-z0-9_-]/g, '');
  if (companyName?.trim()) {
    const c = companyName.trim().replace(/\s+/g, '_').replace(/[^A-Za-z0-9_-]/g, '');
    base = `${base}_${c}`;
  }
  return `${base}.pdf`;
}
