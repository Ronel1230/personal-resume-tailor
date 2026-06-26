import { createResumeTemplate } from '../TemplateBase';

/** Template 15 — Plain Boxed: centered header, light-grey boxed sections, no colour */
export const ResumePlainBoxed = createResumeTemplate({
    fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 11, nameSize: 25, titleSize: 11.5 },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'center',
    theme: {
        accent: '#9ca3af',
        sectionStyle: 'boxed',
        sectionBg: '#f9fafb',
        skillsLayout: 'table',
    },
});

export default ResumePlainBoxed;
