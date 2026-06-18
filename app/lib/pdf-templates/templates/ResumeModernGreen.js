import { createResumeTemplate } from '../TemplateBase';

/** Template 3 — Modern Green Sidebar: green vertical stripe, clean body */
export const ResumeModernGreen = createResumeTemplate({
    fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 10, nameSize: 22, contactSize: 8.5 },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'sidebar',
    theme: {
        primary: '#14532d',
        secondary: '#166534',
        accent: '#16a34a',
        headerText: '#14532d',
        headerSubtext: '#4ade80',
        sectionStyle: 'minimal',
        sidebarWidth: 32,
    },
});

export default ResumeModernGreen;
