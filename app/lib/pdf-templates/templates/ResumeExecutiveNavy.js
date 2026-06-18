import { createResumeTemplate } from '../TemplateBase';

/** Template 7 — Executive Navy: navy banner header, gold double-rule sections, serif */
export const ResumeExecutiveNavy = createResumeTemplate({
    fonts: { body: 'Times-Roman', title: 'Times-Bold', baseSize: 10.5, nameSize: 26 },
    sectionTitles: {
        summary: 'Executive Summary',
        skills: 'Core Competencies',
        experience: 'Professional Experience',
        education: 'Education',
    },
    headerLayout: 'banner',
    theme: {
        primary: '#0f172a',
        secondary: '#334155',
        accent: '#b45309',
        headerBg: '#1e3a5f',
        headerText: '#ffffff',
        headerSubtext: '#cbd5e1',
        sectionStyle: 'doubleRule',
        nameUppercase: true,
        nameLetterSpacing: 1,
    },
});

export default ResumeExecutiveNavy;
