import { createResumeTemplate } from '../TemplateBase';

export const ResumeCreativeBurgundy = createResumeTemplate({
    fonts: {
        body: 'Helvetica',
        title: 'Times-Bold',
        baseSize: 11,
        nameSize: 26,
        titleSize: 12,
        sectionSize: 10,
    },
    sectionTitles: {
        summary: 'Professional Summary',
        skills: 'Core Competencies',
        experience: 'Professional Experience',
        education: 'Education',
    },
    headerLayout: 'center',
});

export default ResumeCreativeBurgundy;
