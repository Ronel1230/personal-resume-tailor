import { createResumeTemplate } from '../TemplateBase';

/** Template 5 — Bold Emerald: large left-aligned name, emerald left-bar sections */
export const ResumeBoldEmerald = createResumeTemplate({
    fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 11, nameSize: 30 },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'minimal',
    theme: {
        primary: '#064e3b',
        secondary: '#047857',
        accent: '#059669',
        headerText: '#059669',
        headerSubtext: '#6b7280',
        sectionStyle: 'leftBar',
        headerBorderWidth: 3,
        bulletStyle: 'dash',
    },
});

export default ResumeBoldEmerald;
