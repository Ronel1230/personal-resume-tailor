import { createResumeTemplate } from '../TemplateBase';

/** Template 6 — Corporate Slate: split header, gray boxed sections */
export const ResumeCorporateSlate = createResumeTemplate({
    fonts: { body: 'Times-Roman', title: 'Helvetica-Bold', baseSize: 11, nameSize: 24 },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'split',
    theme: {
        primary: '#1e293b',
        secondary: '#475569',
        accent: '#64748b',
        headerText: '#0f172a',
        headerSubtext: '#64748b',
        sectionStyle: 'boxed',
        sectionBg: '#f1f5f9',
        skillsLayout: 'twoColumn',
    },
});

export default ResumeCorporateSlate;
