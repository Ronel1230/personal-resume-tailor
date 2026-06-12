import { createResumeTemplate } from '../TemplateBase';

export const ResumeExecutiveNavy = createResumeTemplate({
    fonts: {
        body: 'Times-Roman',
        title: 'Times-Bold',
        baseSize: 10.5,
        nameSize: 26,
    },
    sectionTitles: {
        summary: 'Executive Summary',
        skills: 'Core Competencies',
        experience: 'Professional Experience',
        education: 'Education',
    },
    headerLayout: 'center',
});

export default ResumeExecutiveNavy;
