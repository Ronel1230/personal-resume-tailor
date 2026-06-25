import { createResumeTemplate } from '../TemplateBase';

/** Template 13 — Plain Split: name left / contact right, grey underline sections, no colour */
export const ResumePlainSplit = createResumeTemplate({
    fonts: { body: 'Helvetica', title: 'Helvetica-Bold', baseSize: 11, nameSize: 25, titleSize: 11.5 },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    headerLayout: 'split',
    theme: {
        accent: '#374151',
        sectionStyle: 'underline',
    },
});

export default ResumePlainSplit;
