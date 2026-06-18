import { createResumeTemplate } from '../TemplateBase';

/** Template 4 — Creative Burgundy: serif name, burgundy filled section labels */
export const ResumeCreativeBurgundy = createResumeTemplate({
    fonts: {
        body: 'Helvetica',
        title: 'Times-Bold',
        baseSize: 11,
        nameSize: 28,
        titleSize: 12,
    },
    sectionTitles: {
        summary: 'Professional Summary',
        skills: 'Core Competencies',
        experience: 'Professional Experience',
        education: 'Education',
    },
    headerLayout: 'minimal',
    theme: {
        primary: '#3f1219',
        secondary: '#7f1d1d',
        accent: '#991b1b',
        headerText: '#7f1d1d',
        headerSubtext: '#b45309',
        sectionStyle: 'filled',
        nameLetterSpacing: 0.5,
    },
});

export default ResumeCreativeBurgundy;
