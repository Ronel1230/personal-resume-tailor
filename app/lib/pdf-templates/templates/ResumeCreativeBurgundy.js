import { createResumeTemplate } from '../TemplateBase';

/** Template 4 — Creative Burgundy: serif name, burgundy underline sections */
export const ResumeCreativeBurgundy = createResumeTemplate({
    fonts: {
        body: 'Helvetica',
        title: 'Helvetica-Bold',
        baseSize: 11,
        nameSize: 26,
        titleSize: 11.5,
    },
    sectionTitles: {
        summary: 'Professional Summary',
        skills: 'Core Competencies',
        experience: 'Professional Experience',
        education: 'Education',
    },
    headerLayout: 'minimal',
    theme: {
        accent: '#991b1b',
        sectionStyle: 'underline',
        nameLetterSpacing: 0.5,
        headerBorderWidth: 2,
    },
});

export default ResumeCreativeBurgundy;
