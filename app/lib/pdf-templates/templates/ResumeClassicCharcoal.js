import { createResumeTemplate } from '../TemplateBase';

export const ResumeClassicCharcoal = createResumeTemplate({
    fonts: {
        body: 'Times-Roman',
        title: 'Times-Bold',
        baseSize: 10.5,
        nameSize: 24,
    },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'center',
});

export default ResumeClassicCharcoal;
