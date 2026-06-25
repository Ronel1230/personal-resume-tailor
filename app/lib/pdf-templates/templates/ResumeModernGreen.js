import { createResumeTemplate } from '../TemplateBase';

/** Template 3 — Modern Green: clean left-aligned header, green underline sections */
export const ResumeModernGreen = createResumeTemplate({
    fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 11, nameSize: 26, titleSize: 11.5 },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'minimal',
    theme: {
        accent: '#16a34a',
        sectionStyle: 'underline',
        headerBorderWidth: 2,
    },
});

export default ResumeModernGreen;
