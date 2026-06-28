import { createResumeTemplate } from '../TemplateBase';

/** Template 9 — Consultant Steel: steel-blue split header, underline sections */
export const ResumeConsultantSteel = createResumeTemplate({
    fonts: {
        body: 'Helvetica',
        title: 'Helvetica-Bold',
        baseSize: 11,
        nameSize: 25,
        titleSize: 11.5,
        contactSize: 9,
    },
    sectionTitles: {
        summary: 'Executive Summary',
        skills: 'Core Competencies',
        experience: 'Professional Experience',
        education: 'Education',
    },
    sectionOrder: ['summary', 'skills', 'experience', 'education', 'certifications'],
    experienceMeta: 'none',
    headerLayout: 'split',
    theme: {
        accent: '#0284c7',
        sectionStyle: 'underline',
        skillsLayout: 'table',
        pagePadding: '14mm',
    },
});

export default ResumeConsultantSteel;
