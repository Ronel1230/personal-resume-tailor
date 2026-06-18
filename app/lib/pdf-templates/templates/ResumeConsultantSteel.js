import { createResumeTemplate } from '../TemplateBase';

/** Template 9 — Consultant Steel: steel-blue split header, accent-line sections, compact */
export const ResumeConsultantSteel = createResumeTemplate({
    fonts: {
        body: 'Helvetica',
        title: 'Helvetica-Bold',
        baseSize: 10,
        nameSize: 22,
        contactSize: 8.5,
    },
    sectionTitles: {
        summary: 'Executive Summary',
        skills: 'Core Competencies',
        experience: 'Professional Experience',
        education: 'Education',
    },
    headerLayout: 'split',
    theme: {
        primary: '#1e293b',
        secondary: '#475569',
        accent: '#0284c7',
        headerText: '#0c4a6e',
        headerSubtext: '#64748b',
        sectionStyle: 'accentLine',
        skillsLayout: 'twoColumn',
        pagePadding: '12mm',
    },
});

export default ResumeConsultantSteel;
