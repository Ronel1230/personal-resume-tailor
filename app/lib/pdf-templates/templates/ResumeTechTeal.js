import { createResumeTemplate } from '../TemplateBase';

export const ResumeTechTeal = createResumeTemplate({
    fonts: {
        body: 'Helvetica',
        title: 'Helvetica-Bold',
        baseSize: 10.5,
    },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Technical Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'split',
});

export default ResumeTechTeal;
