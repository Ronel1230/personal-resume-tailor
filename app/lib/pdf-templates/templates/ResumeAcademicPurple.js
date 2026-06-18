import { createResumeTemplate } from '../TemplateBase';

/** Template 10 — Academic Purple: purple filled labels, formal centered header */
export const ResumeAcademicPurple = createResumeTemplate({
    fonts: { body: 'Times-Roman', title: 'Times-Bold', baseSize: 11, nameSize: 24 },
    sectionTitles: {
        summary: 'Professional Summary',
        skills: 'Core Competencies',
        experience: 'Professional Experience',
        education: 'Education & Credentials',
    },
    headerLayout: 'center',
    theme: {
        primary: '#3b0764',
        secondary: '#6b21a8',
        accent: '#7c3aed',
        headerText: '#581c87',
        headerSubtext: '#9333ea',
        sectionStyle: 'filled',
        headerBorderWidth: 2,
    },
});

export default ResumeAcademicPurple;
