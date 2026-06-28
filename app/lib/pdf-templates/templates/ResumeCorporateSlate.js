import { createResumeTemplate } from '../TemplateBase';

/** Template 6 — Corporate Slate: split header, gray boxed sections */
export const ResumeCorporateSlate = createResumeTemplate({
    fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 11, nameSize: 25, titleSize: 11.5 },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education'],
    experienceMeta: 'keySkills',
    headerLayout: 'split',
    theme: {
        accent: '#64748b',
        sectionStyle: 'boxed',
        sectionBg: '#f1f5f9',
        skillsLayout: 'labelLeft',
    },
});

export default ResumeCorporateSlate;
