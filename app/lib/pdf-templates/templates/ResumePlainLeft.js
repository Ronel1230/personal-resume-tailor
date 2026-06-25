import { createResumeTemplate } from '../TemplateBase';

/** Template 12 — Plain Left: left-aligned header, black underline sections, no colour */
export const ResumePlainLeft = createResumeTemplate({
    fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 11, nameSize: 27, titleSize: 11.5 },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'minimal',
    theme: {
        accent: '#111827',
        sectionStyle: 'underline',
    },
});

export default ResumePlainLeft;
