import { createResumeTemplate } from '../TemplateBase';

/** Template 11 — Plain Classic: centered header, black underline sections, no colour */
export const ResumePlainClassic = createResumeTemplate({
    fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 11, nameSize: 26, titleSize: 11.5 },
    sectionTitles: {
        summary: 'Professional Summary',
        skills: 'Skills',
        experience: 'Professional Experience',
        education: 'Education',
    },
    headerLayout: 'center',
    theme: {
        accent: '#111827',
        sectionStyle: 'underline',
    },
});

export default ResumePlainClassic;
