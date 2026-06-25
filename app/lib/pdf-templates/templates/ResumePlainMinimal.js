import { createResumeTemplate } from '../TemplateBase';

/** Template 14 — Plain Minimal: left header, borderless grey section labels, no colour */
export const ResumePlainMinimal = createResumeTemplate({
    fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 11, nameSize: 26, titleSize: 11.5 },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'minimal',
    theme: {
        accent: '#6b7280',
        sectionStyle: 'minimal',
        headerBorderWidth: 0,
    },
});

export default ResumePlainMinimal;
