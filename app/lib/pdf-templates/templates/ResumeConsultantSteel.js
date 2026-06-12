import { createResumeTemplate } from '../TemplateBase';

export const ResumeConsultantSteel = createResumeTemplate({
    fonts: {
        body: 'Times-Roman',
        title: 'Helvetica-Bold',
        baseSize: 10,
        nameSize: 22,
        contactSize: 8.5,
    },
    sectionTitles: {
        summary: 'Executive Summary',
        skills: 'Core Competencies',
        experience: 'Professional Experience',
        education: 'Education',
    },
    headerLayout: 'center',
});

export default ResumeConsultantSteel;
