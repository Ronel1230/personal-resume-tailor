import { createResumeTemplate } from '../TemplateBase';

export const ResumeModernGreen = createResumeTemplate({
    fonts: {
        body: 'Helvetica',
        title: 'Helvetica-Bold',
        baseSize: 10,
        nameSize: 22,
        contactSize: 8.5,
        titleSize: 11,
        sectionSize: 10,
    },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'split',
});

export default ResumeModernGreen;
