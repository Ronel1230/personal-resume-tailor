import { createResumeTemplate } from '../TemplateBase';

/** Template 8 — Classic Charcoal: Times serif, charcoal accent line sections */
export const ResumeClassicCharcoal = createResumeTemplate({
    fonts: { body: 'Times-Roman', title: 'Times-Bold', baseSize: 10.5, nameSize: 24 },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'center',
    theme: {
        primary: '#1c1917',
        secondary: '#44403c',
        accent: '#57534e',
        headerText: '#1c1917',
        headerSubtext: '#78716c',
        sectionStyle: 'accentLine',
        companyItalic: false,
    },
});

export default ResumeClassicCharcoal;
