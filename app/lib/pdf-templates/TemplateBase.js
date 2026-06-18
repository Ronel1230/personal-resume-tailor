import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { extractYear, BoldText } from './utils';

export const createResumeTemplate = (config) => {
    const {
        fonts = {},
        sectionTitles = {},
        headerLayout = 'center',
        theme = {},
    } = config;

    const colors = {
        primary: theme.primary || '#111827',
        secondary: theme.secondary || '#374151',
        accent: theme.accent || theme.primary || '#111827',
        headerBg: theme.headerBg ?? null,
        headerText: theme.headerText || '#111827',
        headerSubtext: theme.headerSubtext || '#4b5563',
        sectionBg: theme.sectionBg ?? null,
        pageBg: theme.pageBg ?? '#ffffff',
        muted: theme.muted || '#6b7280',
    };

    const sectionStyle = theme.sectionStyle || 'underline';
    const skillsLayout = theme.skillsLayout || 'list';
    const pagePadding = theme.pagePadding || '14mm';
    const sidebarWidth = theme.sidebarWidth || 28;
    const bulletPrefix = theme.bulletStyle === 'dash' ? '–  ' : '•  ';

    const styles = StyleSheet.create({
        page: {
            padding: pagePadding,
            fontSize: fonts.baseSize || 10.5,
            fontFamily: fonts.body || 'Helvetica',
            color: colors.primary,
            backgroundColor: colors.pageBg,
        },
        sidebarPage: {
            flexDirection: 'row',
            padding: 0,
            fontSize: fonts.baseSize || 10.5,
            fontFamily: fonts.body || 'Helvetica',
            color: colors.primary,
            backgroundColor: colors.pageBg,
        },
        sidebarStripe: {
            width: sidebarWidth,
            backgroundColor: colors.accent,
        },
        sidebarBody: {
            flex: 1,
            padding: pagePadding,
        },
        headerCenter: {
            textAlign: 'center',
            marginBottom: 14,
            paddingBottom: 10,
            borderBottomWidth: theme.headerBorderWidth ?? 1,
            borderBottomColor: colors.accent,
        },
        headerSplit: {
            marginBottom: 14,
            paddingBottom: 10,
            borderBottomWidth: theme.headerBorderWidth ?? 1,
            borderBottomColor: colors.accent,
        },
        headerSplitRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        headerBanner: {
            backgroundColor: colors.headerBg || colors.accent,
            marginHorizontal: `-${pagePadding}`,
            marginTop: `-${pagePadding}`,
            paddingHorizontal: pagePadding,
            paddingVertical: 18,
            marginBottom: 16,
        },
        headerMinimal: {
            marginBottom: 16,
            paddingBottom: 6,
        },
        headerSidebarIntro: {
            marginBottom: 14,
            paddingBottom: 10,
            borderBottomWidth: 2,
            borderBottomColor: colors.accent,
        },
        name: {
            fontSize: fonts.nameSize || 24,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            marginBottom: 3,
            color: colors.headerText,
            textTransform: theme.nameUppercase ? 'uppercase' : 'none',
            letterSpacing: theme.nameLetterSpacing || 0,
        },
        title: {
            fontSize: fonts.titleSize || 11,
            fontFamily: fonts.body || 'Helvetica',
            marginBottom: 6,
            color: colors.headerSubtext,
        },
        contact: {
            fontSize: fonts.contactSize || 9,
            fontFamily: fonts.body || 'Helvetica',
            color: colors.headerSubtext,
            lineHeight: 1.45,
        },
        contactCenter: { textAlign: 'center' },
        contactRight: { textAlign: 'right' },
        contactItem: { marginBottom: 2 },
        section: { marginBottom: 12 },
        sectionBoxed: {
            marginBottom: 12,
            padding: 10,
            backgroundColor: colors.sectionBg || '#f3f4f6',
        },
        sectionLeftBar: {
            marginBottom: 12,
            paddingLeft: 10,
            borderLeftWidth: 4,
            borderLeftColor: colors.accent,
        },
        sectionTitleUnderline: {
            fontSize: fonts.sectionSize || 10,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            color: colors.accent,
            marginBottom: 8,
            paddingBottom: 4,
            borderBottomWidth: 1,
            borderBottomColor: colors.accent,
        },
        sectionTitleFilled: {
            fontSize: fonts.sectionSize || 9.5,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: '#ffffff',
            backgroundColor: colors.accent,
            paddingVertical: 4,
            paddingHorizontal: 8,
            marginBottom: 8,
            alignSelf: 'flex-start',
        },
        sectionTitleMinimal: {
            fontSize: fonts.sectionSize || 10,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            color: colors.secondary,
            marginBottom: 6,
        },
        sectionTitleDoubleRule: {
            fontSize: fonts.sectionSize || 10,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            color: colors.primary,
            marginBottom: 8,
            paddingBottom: 4,
            borderBottomWidth: 2,
            borderBottomColor: colors.accent,
        },
        sectionAccentLine: {
            width: 36,
            height: 3,
            backgroundColor: colors.accent,
            marginBottom: 4,
        },
        summary: {
            fontSize: fonts.summarySize || 10.5,
            lineHeight: 1.6,
            color: colors.primary,
        },
        skillsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
        skillsGridItem: { width: '50%', paddingRight: 8, marginBottom: 8 },
        skillsCategory: { marginBottom: 8, width: '100%' },
        skillsLabel: {
            fontSize: fonts.skillsLabelSize || 9,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            color: colors.accent,
            marginBottom: 2,
            textTransform: 'uppercase',
            letterSpacing: 0.6,
        },
        skillsList: {
            fontSize: fonts.skillsListSize || 9.5,
            color: colors.secondary,
            lineHeight: 1.45,
        },
        expItem: { marginBottom: 10 },
        expHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 1,
        },
        expTitle: {
            fontSize: fonts.expTitleSize || 10.5,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            color: colors.primary,
        },
        expDates: { fontSize: fonts.expDatesSize || 9, color: colors.muted },
        expCompany: {
            fontSize: fonts.expCompanySize || 10,
            color: colors.secondary,
            marginBottom: 3,
            fontStyle: theme.companyItalic === false ? 'normal' : 'italic',
        },
        expIndustry: {
            fontSize: (fonts.expCompanySize || 10) - 0.5,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            color: colors.accent,
            marginBottom: 3,
        },
        expDetails: { marginLeft: theme.bulletStyle === 'dash' ? 8 : 14 },
        expDetailItem: {
            fontSize: fonts.expDetailSize || 10,
            lineHeight: 1.45,
            marginBottom: 2,
            color: colors.primary,
        },
        eduItem: { marginBottom: 8 },
        eduHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 1,
        },
        eduDegree: {
            fontSize: fonts.eduDegreeSize || 10.5,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            color: colors.primary,
        },
        eduDates: { fontSize: fonts.eduDatesSize || 9, color: colors.muted },
        eduSchool: {
            fontSize: fonts.eduSchoolSize || 10,
            color: colors.secondary,
            fontStyle: 'italic',
        },
    });

    const getSectionWrapperStyle = () => {
        if (sectionStyle === 'boxed') return styles.sectionBoxed;
        if (sectionStyle === 'leftBar') return styles.sectionLeftBar;
        return styles.section;
    };

    const renderSectionTitle = (label) => {
        if (sectionStyle === 'filled') return <Text style={styles.sectionTitleFilled}>{label}</Text>;
        if (sectionStyle === 'minimal') return <Text style={styles.sectionTitleMinimal}>{label}</Text>;
        if (sectionStyle === 'doubleRule') return <Text style={styles.sectionTitleDoubleRule}>{label}</Text>;
        if (sectionStyle === 'accentLine') {
            return (
                <View>
                    <View style={styles.sectionAccentLine} />
                    <Text style={styles.sectionTitleMinimal}>{label}</Text>
                </View>
            );
        }
        return <Text style={styles.sectionTitleUnderline}>{label}</Text>;
    };

    const renderHeader = (data, lightText = false) => {
        const { name, title, email, phone, location, linkedin, website } = data;
        const textColor = lightText ? '#ffffff' : colors.headerText;
        const subColor = lightText ? '#e5e7eb' : colors.headerSubtext;
        const nameStyle = [styles.name, { color: textColor }];
        const titleStyle = [styles.title, { color: subColor }];
        const contactStyle = [styles.contact, { color: subColor }];
        const contactLine = [email, phone, location, linkedin, website].filter(Boolean);

        if (headerLayout === 'banner') {
            return (
                <View style={styles.headerBanner}>
                    <Text style={nameStyle}>{name}</Text>
                    {title && <Text style={titleStyle}>{title}</Text>}
                    <Text style={[contactStyle, styles.contactCenter]}>{contactLine.join('  •  ')}</Text>
                </View>
            );
        }

        if (headerLayout === 'split') {
            return (
                <View style={styles.headerSplit}>
                    <View style={styles.headerSplitRow}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                            <Text style={nameStyle}>{name}</Text>
                            {title && <Text style={titleStyle}>{title}</Text>}
                        </View>
                        <View style={{ flex: 1 }}>
                            {contactLine.map((item, i) => (
                                <Text key={i} style={[contactStyle, styles.contactRight, styles.contactItem]}>{item}</Text>
                            ))}
                        </View>
                    </View>
                </View>
            );
        }

        if (headerLayout === 'minimal') {
            return (
                <View style={styles.headerMinimal}>
                    <Text style={[nameStyle, { fontSize: (fonts.nameSize || 24) + 2 }]}>{name}</Text>
                    {title && <Text style={titleStyle}>{title}</Text>}
                    <Text style={contactStyle}>{contactLine.join('  |  ')}</Text>
                </View>
            );
        }

        return (
            <View style={styles.headerCenter}>
                <Text style={nameStyle}>{name}</Text>
                {title && <Text style={titleStyle}>{title}</Text>}
                <Text style={[contactStyle, styles.contactCenter]}>{contactLine.join('  •  ')}</Text>
            </View>
        );
    };

    const renderSkillsBlock = (skills) => {
        if (!skills || Object.keys(skills).length === 0) return null;
        const entries = Object.entries(skills);

        return (
            <View style={getSectionWrapperStyle()}>
                {renderSectionTitle(sectionTitles.skills || 'Skills')}
                {skillsLayout === 'twoColumn' ? (
                    <View style={styles.skillsGrid}>
                        {entries.map(([category, skillList], idx) => (
                            <View key={idx} style={styles.skillsGridItem}>
                                <Text style={styles.skillsLabel}>{category}</Text>
                                <Text style={styles.skillsList}>
                                    {Array.isArray(skillList) ? skillList.join(', ') : String(skillList)}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    entries.map(([category, skillList], idx) => (
                        <View key={idx} style={styles.skillsCategory}>
                            <Text style={styles.skillsLabel}>{category}</Text>
                            <Text style={styles.skillsList}>
                                {Array.isArray(skillList) ? skillList.join(' · ') : String(skillList)}
                            </Text>
                        </View>
                    ))
                )}
            </View>
        );
    };

    const renderExperienceBlock = (experience) => {
        if (!experience || experience.length === 0) return null;
        return (
            <View style={getSectionWrapperStyle()}>
                {renderSectionTitle(sectionTitles.experience || 'Experience')}
                {experience.map((exp, idx) => (
                    <View key={idx} style={styles.expItem}>
                        <View style={styles.expHeader}>
                            <Text style={styles.expTitle}>{exp.title || 'Engineer'}</Text>
                            <Text style={styles.expDates}>{exp.start_date} – {exp.end_date}</Text>
                        </View>
                        <Text style={styles.expCompany}>
                            {exp.company}{exp.location && `, ${exp.location}`}
                        </Text>
                        {exp.industry && <Text style={styles.expIndustry}>{exp.industry}</Text>}
                        {exp.details && exp.details.length > 0 && (
                            <View style={styles.expDetails}>
                                {exp.details.map((detail, detailIdx) => (
                                    <View key={detailIdx} style={{ marginBottom: 2 }}>
                                        <BoldText
                                            text={`${bulletPrefix}${String(detail ?? '')}`}
                                            style={styles.expDetailItem}
                                        />
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </View>
        );
    };

    const renderEducationBlock = (education) => {
        if (!education || education.length === 0) return null;
        return (
            <View style={getSectionWrapperStyle()}>
                {renderSectionTitle(sectionTitles.education || 'Education')}
                {education.map((edu, idx) => (
                    <View key={idx} style={styles.eduItem}>
                        <View style={styles.eduHeader}>
                            <Text style={styles.eduDegree}>{edu.degree}</Text>
                            <Text style={styles.eduDates}>
                                {extractYear(edu.start_year)}
                                {edu.end_year && ` – ${extractYear(edu.end_year)}`}
                            </Text>
                        </View>
                        <Text style={styles.eduSchool}>
                            {edu.school}{edu.grade && ` • GPA: ${edu.grade}`}
                        </Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderBody = (data) => (
        <>
            {renderHeader(data, headerLayout === 'banner')}
            {data.summary && (
                <View style={getSectionWrapperStyle()}>
                    {renderSectionTitle(sectionTitles.summary || 'Summary')}
                    <BoldText text={data.summary} style={styles.summary} />
                </View>
            )}
            {renderSkillsBlock(data.skills)}
            {renderExperienceBlock(data.experience)}
            {renderEducationBlock(data.education)}
        </>
    );

    if (headerLayout === 'sidebar') {
        const SidebarTemplate = ({ data }) => (
            <Document>
                <Page size="A4" style={styles.sidebarPage}>
                    <View style={styles.sidebarStripe} />
                    <View style={styles.sidebarBody}>
                        <View style={styles.headerSidebarIntro}>
                            <Text style={styles.name}>{data.name}</Text>
                            {data.title && <Text style={styles.title}>{data.title}</Text>}
                            <Text style={styles.contact}>
                                {[data.email, data.phone, data.location, data.linkedin, data.website]
                                    .filter(Boolean)
                                    .join('  •  ')}
                            </Text>
                        </View>
                        {data.summary && (
                            <View style={getSectionWrapperStyle()}>
                                {renderSectionTitle(sectionTitles.summary || 'Summary')}
                                <BoldText text={data.summary} style={styles.summary} />
                            </View>
                        )}
                        {renderSkillsBlock(data.skills)}
                        {renderExperienceBlock(data.experience)}
                        {renderEducationBlock(data.education)}
                    </View>
                </Page>
            </Document>
        );
        SidebarTemplate.displayName = 'ResumeTemplateSidebar';
        return SidebarTemplate;
    }

    const StandardTemplate = ({ data }) => (
        <Document>
            <Page size="A4" style={styles.page}>
                {renderBody(data)}
            </Page>
        </Document>
    );
    StandardTemplate.displayName = 'ResumeTemplateStandard';
    return StandardTemplate;
};
