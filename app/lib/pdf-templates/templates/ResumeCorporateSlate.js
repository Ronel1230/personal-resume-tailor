import { createResumeTemplate } from '../TemplateBase';

export const ResumeCorporateSlate = createResumeTemplate({
    fonts: {
        body: 'Times-Roman',
        title: 'Helvetica-Bold',
        baseSize: 11,
        nameSize: 24,
    },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'split',
});

export default ResumeCorporateSlate;
