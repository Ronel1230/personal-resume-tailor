import { createResumeTemplate } from '../TemplateBase';

export const ResumeBoldEmerald = createResumeTemplate({
    fonts: {
        body: 'Helvetica',
        title: 'Helvetica-Bold',
        baseSize: 11,
        nameSize: 26,
    },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'center',
});

export default ResumeBoldEmerald;
