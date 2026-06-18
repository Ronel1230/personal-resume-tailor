import { createResumeTemplate } from '../TemplateBase';

/** Template 2 — Teal Banner: full-width teal header band, white text */
export const ResumeTechTeal = createResumeTemplate({
    fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 10.5, nameSize: 26 },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Technical Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'banner',
    theme: {
        primary: '#0f172a',
        secondary: '#334155',
        accent: '#0d9488',
        headerBg: '#0d9488',
        headerText: '#ffffff',
        headerSubtext: '#ccfbf1',
        sectionStyle: 'underline',
        skillsLayout: 'twoColumn',
    },
});

export default ResumeTechTeal;
