import { createResumeTemplate } from '../TemplateBase';

/** Template 10 — Academic Purple: formal centered serif header, purple underline sections */
export const ResumeAcademicPurple = createResumeTemplate({
    fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 11.5, nameSize: 26, titleSize: 12 },
    sectionTitles: {
        summary: 'Professional Summary',
        skills: 'Core Competencies',
        experience: 'Professional Experience',
        education: 'Education & Credentials',
    },
    sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
    headerLayout: 'center',
    theme: {
        accent: '#7c3aed',
        sectionStyle: 'underline',
        headerBorderWidth: 2,
        skillsLayout: 'table',
    },
});

export default ResumeAcademicPurple;
