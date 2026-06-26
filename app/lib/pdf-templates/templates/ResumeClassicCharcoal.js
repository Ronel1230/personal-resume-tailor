import { createResumeTemplate } from '../TemplateBase';

/** Template 8 — Classic Charcoal: Times serif, charcoal accent line sections */
export const ResumeClassicCharcoal = createResumeTemplate({
    fonts: {
        body: 'Helvetica',
        title: 'Helvetica-Bold',
        baseSize: 12,
        nameSize: 28,
        titleSize: 13,
        sectionSize: 12,
        summarySize: 11.5,
        expTitleSize: 12,
        expCompanySize: 11,
        expDetailSize: 11.5,
        skillsListSize: 11,
        skillsLabelSize: 11,
        eduDegreeSize: 12,
        contactSize: 10,
    },
    sectionTitles: {
        summary: 'Summary',
        skills: 'Skills',
        experience: 'Experience',
        education: 'Education',
    },
    sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
    headerLayout: 'center',
    theme: {
        accent: '#57534e',
        sectionStyle: 'accentLine',
        companyItalic: false,
        skillsLayout: 'labelLeft',
    },
});

export default ResumeClassicCharcoal;
