import { createResumeTemplate } from './TemplateBase';

/** Template 1 — Classic Professional: centered header, black accent underline */
const ResumeTemplate = createResumeTemplate({
    fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 11, nameSize: 24 },
    sectionTitles: {
        summary: 'Professional Summary',
        skills: 'Skills',
        experience: 'Professional Experience',
        education: 'Education & Credentials',
    },
    headerLayout: 'center',
    theme: {
        primary: '#111827',
        secondary: '#374151',
        accent: '#111827',
        sectionStyle: 'underline',
    },
});

export default ResumeTemplate;
