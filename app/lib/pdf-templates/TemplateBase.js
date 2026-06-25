import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { extractYear, BoldText, stripBoldMarkers } from './utils';

export const createResumeTemplate = (config) => {
    const {
        fonts = {},
        sectionTitles = {},
        sectionOrder = null,
        headerLayout = 'center',
        theme = {},
    } = config;

    // All readable body text is forced to grey/black; the template's accent
    // color is kept only for structural lines/bands (borders, banners, stripes).
    // On banner headers (headerBg set) the header text stays light for contrast.
    const colors = {
        primary: '#111827',
        secondary: '#374151',
        accent: theme.accent || theme.primary || '#111827',
        headerBg: theme.headerBg ?? null,
        headerText: theme.headerBg ? (theme.headerText || '#ffffff') : '#111827',
        headerSubtext: theme.headerBg ? (theme.headerSubtext || '#e5e7eb') : '#374151',
        sectionBg: theme.sectionBg ?? null,
        pageBg: theme.pageBg ?? '#ffffff',
        muted: '#6b7280',
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
            paddingBottom: 10,
            borderBottomWidth: theme.headerBorderWidth ?? 1,
            borderBottomColor: colors.accent,
        },
        headerPhoto: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 14,
            paddingBottom: 10,
            borderBottomWidth: theme.headerBorderWidth ?? 1,
            borderBottomColor: colors.accent,
        },
        headerPhotoText: { flex: 1, paddingRight: 14 },
        photo: {
            width: theme.photoSize || 78,
            height: theme.photoSize || 78,
            borderRadius: theme.photoRounded === false ? 4 : (theme.photoSize || 78) / 2,
            objectFit: 'cover',
            borderWidth: 1,
            borderColor: colors.accent,
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
            marginBottom: 6,
            color: colors.headerText,
            textTransform: theme.nameUppercase ? 'uppercase' : 'none',
            letterSpacing: theme.nameLetterSpacing || 0,
        },
        title: {
            fontSize: fonts.titleSize || 11.5,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            marginBottom: 8,
            color: colors.headerText,
        },
        subheadline: {
            fontSize: (fonts.titleSize || 11) - 1,
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
            fontSize: fonts.sectionSize || 10.5,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            color: colors.primary,
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
            fontSize: fonts.sectionSize || 10.5,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            color: colors.secondary,
            marginBottom: 6,
        },
        sectionTitleDoubleRule: {
            fontSize: fonts.sectionSize || 10.5,
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
            fontSize: fonts.skillsLabelSize || 10.5,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: 2,
            textTransform: 'none',
            letterSpacing: 0,
        },
        skillsList: {
            fontSize: fonts.skillsListSize || 10,
            color: colors.secondary,
            lineHeight: 1.45,
        },
        expItem: { marginBottom: 14 },
        expHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 2,
        },
        expTitle: {
            fontSize: fonts.expTitleSize || 11.5,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            color: colors.primary,
        },
        expDates: { fontSize: fonts.expDatesSize || 9, color: colors.muted },
        expCompany: {
            fontSize: fonts.expCompanySize || 10.5,
            color: colors.secondary,
            marginBottom: 5,
            fontStyle: theme.companyItalic === false ? 'normal' : 'italic',
        },
        expIndustry: {
            fontSize: (fonts.expCompanySize || 10.5) - 0.5,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: 4,
        },
        expMetaBox: {
            backgroundColor: '#f3f4f6',
            borderLeftWidth: 3,
            borderLeftColor: colors.accent,
            paddingVertical: 4,
            paddingHorizontal: 8,
            marginTop: 1,
            marginBottom: 5,
        },
        expMeta: {
            fontSize: (fonts.expDetailSize || 10.5) - 0.5,
            color: colors.secondary,
            lineHeight: 1.4,
            marginBottom: 2,
        },
        expMetaLabel: {
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            color: colors.primary,
        },
        expDetails: { marginLeft: theme.bulletStyle === 'dash' ? 8 : 14, marginTop: 4 },
        expDetailItem: {
            fontSize: fonts.expDetailSize || 10.5,
            lineHeight: 1.45,
            marginBottom: 3,
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
            fontSize: fonts.eduDegreeSize || 11.5,
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
        certItem: {
            fontSize: fonts.expDetailSize || 10.5,
            lineHeight: 1.45,
            marginBottom: 2,
            color: colors.primary,
        },
        projectItem: {
            fontSize: fonts.expDetailSize || 10.5,
            lineHeight: 1.45,
            marginBottom: 2,
            color: colors.primary,
        },
    });

    const getSectionWrapperStyle = () => {
        if (sectionStyle === 'boxed') return styles.sectionBoxed;
        if (sectionStyle === 'leftBar') return styles.sectionLeftBar;
        return styles.section;
    };

    const renderSectionTitle = (label) => {
        if (sectionStyle === 'filled') return <Text style={styles.sectionTitleFilled}>{label}</Text>;
        if (sectionStyle === 'minimal' || sectionStyle === 'leftBar') return <Text style={styles.sectionTitleMinimal}>{label}</Text>;
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
        const { name, title, techStack, email, phone, location, linkedin, website } = data;
        const textColor = lightText ? '#ffffff' : colors.headerText;
        const subColor = lightText ? '#e5e7eb' : colors.headerSubtext;
        const nameStyle = [styles.name, { color: textColor }];
        const titleStyle = [styles.title, { color: textColor }];
        const subStyle = [styles.subheadline, { color: subColor }];
        const contactStyle = [styles.contact, { color: subColor }];
        const contactLine = [email, phone, location, linkedin, website].filter(Boolean);
        const headline = title ? <Text style={titleStyle}>{title}</Text> : null;

        if (headerLayout === 'photo') {
            return (
                <View style={styles.headerPhoto}>
                    <View style={styles.headerPhotoText}>
                        <Text style={nameStyle}>{name}</Text>
                        {headline}
                        <Text style={contactStyle}>{contactLine.join('  •  ')}</Text>
                    </View>
                    {data.photo && <Image src={data.photo} style={styles.photo} />}
                </View>
            );
        }

        if (headerLayout === 'banner') {
            return (
                <View style={styles.headerBanner}>
                    <Text style={nameStyle}>{name}</Text>
                    {headline}
                    <Text style={contactStyle}>{contactLine.join('  •  ')}</Text>
                </View>
            );
        }

        if (headerLayout === 'split') {
            return (
                <View style={styles.headerSplit}>
                    <View style={styles.headerSplitRow}>
                        <View style={{ flex: 1, paddingRight: 12 }}>
                            <Text style={nameStyle}>{name}</Text>
                            {headline}
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
                    {headline}
                    <Text style={contactStyle}>{contactLine.join('  |  ')}</Text>
                </View>
            );
        }

        return (
            <View style={styles.headerCenter}>
                <Text style={nameStyle}>{name}</Text>
                {headline}
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
                                    {stripBoldMarkers(Array.isArray(skillList) ? skillList.join(', ') : String(skillList))}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    entries.map(([category, skillList], idx) => (
                        <View key={idx} style={styles.skillsCategory}>
                            <Text style={styles.skillsLabel}>{category}</Text>
                            <Text style={styles.skillsList}>
                                {stripBoldMarkers(Array.isArray(skillList) ? skillList.join(' · ') : String(skillList))}
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
                        {exp.project && (
                            <View style={styles.expMetaBox}>
                                <BoldText text={`**Project:** ${String(exp.project)}`} style={styles.expMeta} />
                            </View>
                        )}
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

    const renderProjectsBlock = (projects) => {
        if (!projects || projects.length === 0) return null;
        return (
            <View style={getSectionWrapperStyle()}>
                {renderSectionTitle(sectionTitles.projects || 'Projects')}
                <View style={styles.expDetails}>
                    {projects.map((project, idx) => {
                        const heading = stripBoldMarkers((project && project.heading ? String(project.heading) : '').trim());
                        const content = stripBoldMarkers((project && project.content ? String(project.content) : '').trim());
                        const text = heading
                            ? `${bulletPrefix}**${heading}**${content ? `: ${content}` : ''}`
                            : `${bulletPrefix}${content}`;
                        return (
                            <View key={idx} style={{ marginBottom: 2 }}>
                                <BoldText text={text} style={styles.projectItem} />
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    const renderCertificationsBlock = (certifications) => {
        if (!certifications || certifications.length === 0) return null;
        return (
            <View style={getSectionWrapperStyle()}>
                {renderSectionTitle(sectionTitles.certifications || 'Certifications')}
                <View style={styles.expDetails}>
                    {certifications.map((cert, idx) => (
                        <View key={idx} style={{ marginBottom: 2 }}>
                            <BoldText
                                text={`${bulletPrefix}${String(cert ?? '')}`}
                                style={styles.certItem}
                            />
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const renderSummaryBlock = (summary) =>
        summary ? (
            <View style={getSectionWrapperStyle()}>
                {renderSectionTitle(sectionTitles.summary || 'Summary')}
                <BoldText text={summary} style={styles.summary} />
            </View>
        ) : null;

    const sectionRenderers = {
        summary: (data) => renderSummaryBlock(data.summary),
        skills: (data) => renderSkillsBlock(data.skills),
        education: (data) => renderEducationBlock(data.education),
        certifications: (data) => renderCertificationsBlock(data.certifications),
        experience: (data) => renderExperienceBlock(data.experience),
        projects: (data) => renderProjectsBlock(data.projects),
    };

    const DEFAULT_SECTION_ORDER = ['summary', 'skills', 'education', 'certifications', 'experience', 'projects'];
    const order =
        Array.isArray(sectionOrder) && sectionOrder.length ? sectionOrder : DEFAULT_SECTION_ORDER;

    const renderSections = (data) =>
        order.map((key, i) => {
            const render = sectionRenderers[key];
            return render ? <React.Fragment key={i}>{render(data)}</React.Fragment> : null;
        });

    const renderBody = (data) => (
        <>
            {renderHeader(data, headerLayout === 'banner')}
            {renderSections(data)}
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
                        {renderSections(data)}
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
