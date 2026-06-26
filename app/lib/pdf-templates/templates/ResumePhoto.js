import { createResumeTemplate } from '../TemplateBase';

/** Template 16 — Photo: header with profile photo (from DB), black underline sections */
export const ResumePhoto = createResumeTemplate({
    fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 11, nameSize: 24, titleSize: 11.5 },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'photo',
    theme: {
        accent: '#111827',
        sectionStyle: 'underline',
        skillsLayout: 'labelLeft',
        photoSize: 80,
        photoRounded: true,
    },
});

export default ResumePhoto;
