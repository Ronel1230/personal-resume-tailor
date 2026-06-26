import { createResumeTemplate } from '../TemplateBase';

/** Template 7 — Executive Navy: navy banner header, navy underline sections, serif */
export const ResumeExecutiveNavy = createResumeTemplate({
    fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 11, nameSize: 26, titleSize: 12 },
    sectionTitles: {
        summary: 'Executive Summary',
        skills: 'Core Competencies',
        experience: 'Professional Experience',
        education: 'Education',
    },
    sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
    headerLayout: 'banner',
    theme: {
        accent: '#1e3a5f',
        headerBg: '#1e3a5f',
        headerText: '#ffffff',
        headerSubtext: '#cbd5e1',
        sectionStyle: 'underline',
        skillsLayout: 'labelLeft',
    },
});

export default ResumeExecutiveNavy;
