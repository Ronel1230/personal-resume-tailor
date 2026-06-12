import { createResumeTemplate } from '../TemplateBase';

export const ResumeAcademicPurple = createResumeTemplate({
    fonts: {
        body: 'Times-Roman',
        title: 'Times-Bold',
        baseSize: 11,
        nameSize: 24,
    },
    sectionTitles: {
        summary: 'Professional Summary',
        skills: 'Core Competencies',
        experience: 'Professional Experience',
        education: 'Education & Credentials',
    },
    headerLayout: 'center',
});

export default ResumeAcademicPurple;
