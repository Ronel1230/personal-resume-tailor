import { createResumeTemplate } from '../TemplateBase';

/** Template 5 — Bold Emerald: left-aligned header, emerald left-bar sections */
export const ResumeBoldEmerald = createResumeTemplate({
    fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 11, nameSize: 26, titleSize: 11.5 },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    sectionOrder: ['summary', 'skills', 'education', 'experience', 'projects'],
    experienceMeta: 'keySkills',
    headerLayout: 'minimal',
    theme: {
        accent: '#059669',
        sectionStyle: 'leftBar',
        skillsLayout: 'table',
    },
});

export default ResumeBoldEmerald;
