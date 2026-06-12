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

export function buildResumePdfData(profileData: WithoutApiProfileData, resumeContent: ResumeContent) {
  const { phone, linkedin } = getContactForPdf(profileData);
  return {
    name: profileData.name,
    title: profileData.title,
    email: profileData.email,
    phone,
    location: profileData.location,
    linkedin,
    website: null as string | null,
    summary: resumeContent.summary,
    skills: resumeContent.skills,
    experience: profileData.experience.map((job, idx) => ({
      title: job.title || resumeContent.experience[idx]?.title || 'Engineer',
      company: job.company,
      location: job.location,
      start_date: job.start_date,
      end_date: job.end_date,
      industry: job.industry,
      details: resumeContent.experience[idx]?.details || [],
    })),
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
