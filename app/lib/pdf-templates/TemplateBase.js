import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Svg, Path } from '@react-pdf/renderer';
import { extractYear, BoldText, stripBoldMarkers } from './utils';

// Filled 24x24 contact icons (Material-style), drawn in the contact text color.
const CONTACT_ICON_PATHS = {
    email: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
    location: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    linkedin: 'M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.76-1.75 1.76zm13.5 12.27h-3v-5.6c0-3.37-4-3.12-4 0v5.6h-3v-11h3v1.77c1.4-2.59 7-2.78 7 2.48v6.75z',
    github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
    website: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93C7.05 19.44 4 16.08 4 12c0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
};

const ContactIcon = ({ type, color, size }) => {
    const d = CONTACT_ICON_PATHS[type];
    if (!d) return null;
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={{ marginRight: 3 }}>
            <Path d={d} fill={color} />
        </Svg>
    );
};

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
        contactRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
        contactChip: { flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 2 },
        contactText: {
            fontSize: fonts.contactSize || 9,
            fontFamily: fonts.body || 'Helvetica',
            lineHeight: 1.3,
        },
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
        },
        expCompanyName: {
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            color: colors.primary,
            fontStyle: 'normal',
        },
        expLocation: {
            fontFamily: fonts.body || 'Helvetica',
            fontWeight: 'normal',
            color: colors.muted,
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

    const buildContactItems = (data) =>
        [
            data.email && { type: 'email', value: data.email },
            data.phone && { type: 'phone', value: data.phone },
            data.location && { type: 'location', value: data.location },
            data.linkedin && { type: 'linkedin', value: data.linkedin },
            data.github && { type: 'github', value: data.github },
            data.website && { type: 'website', value: data.website },
        ].filter(Boolean);

    const renderContact = (items, color, mode = 'left') => {
        if (!items || items.length === 0) return null;
        const iconSize = (fonts.contactSize || 9) + 1;
        if (mode === 'rightColumn') {
            return (
                <View>
                    {items.map((it, i) => (
                        <View key={i} style={[styles.contactChip, { justifyContent: 'flex-end', marginRight: 0, marginBottom: 3 }]}>
                            <ContactIcon type={it.type} color={color} size={iconSize} />
                            <Text style={[styles.contactText, { color }]}>{it.value}</Text>
                        </View>
                    ))}
                </View>
            );
        }
        const justifyContent = mode === 'center' ? 'center' : 'flex-start';
        return (
            <View style={[styles.contactRow, { justifyContent }]}>
                {items.map((it, i) => (
                    <View key={i} style={styles.contactChip}>
                        <ContactIcon type={it.type} color={color} size={iconSize} />
                        <Text style={[styles.contactText, { color }]}>{it.value}</Text>
                    </View>
                ))}
            </View>
        );
    };

    const renderHeader = (data, lightText = false) => {
        const { name, title } = data;
        const textColor = lightText ? '#ffffff' : colors.headerText;
        const subColor = lightText ? '#e5e7eb' : colors.headerSubtext;
        const nameStyle = [styles.name, { color: textColor }];
        const titleStyle = [styles.title, { color: textColor }];
        const contactItems = buildContactItems(data);
        const headline = title ? <Text style={titleStyle}>{title}</Text> : null;

        if (headerLayout === 'photo') {
            return (
                <View style={styles.headerPhoto}>
                    <View style={styles.headerPhotoText}>
                        <Text style={nameStyle}>{name}</Text>
                        {headline}
                        {renderContact(contactItems, subColor, 'left')}
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
                    {renderContact(contactItems, subColor, 'left')}
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
                            {renderContact(contactItems, subColor, 'rightColumn')}
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
                    {renderContact(contactItems, subColor, 'left')}
                </View>
            );
        }

        return (
            <View style={styles.headerCenter}>
                <Text style={nameStyle}>{name}</Text>
                {headline}
                {renderContact(contactItems, subColor, 'center')}
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
                            <Text style={styles.expCompanyName}>{exp.company}</Text>
                            {exp.location ? <Text style={styles.expLocation}>{`  —  ${exp.location}`}</Text> : null}
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
                            {renderContact(buildContactItems(data), colors.headerSubtext, 'left')}
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
