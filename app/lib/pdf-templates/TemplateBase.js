import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { extractYear, BoldText } from './utils';

// Professional CV: black/grayscale only, no colors
const PROFESSIONAL_COLORS = {
    textDark: '#1a1a1a',
    textMedium: '#404040',
    textLight: '#6b6b6b',
};

// Base template component that accepts styling configuration
export const createResumeTemplate = (config) => {
    const {
        fonts = {},
        sectionTitles = {},
        headerLayout = 'center', // 'center' or 'split'
    } = config;

    const styles = StyleSheet.create({
        page: {
            padding: '15mm',
            fontSize: fonts.baseSize || 11,
            fontFamily: fonts.body || 'Helvetica',
            color: PROFESSIONAL_COLORS.textDark,
        },
        header: {
            textAlign: headerLayout === 'center' ? 'center' : 'left',
            marginBottom: 14,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#000000',
        },
        headerContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        headerLeft: {},
        name: {
            fontSize: fonts.nameSize || 24,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            marginBottom: 3,
            color: '#000000',
            textTransform: 'none',
        },
        title: {
            fontSize: fonts.titleSize || 11,
            fontFamily: fonts.body || 'Helvetica',
            fontWeight: fonts.titleWeight || 'normal',
            marginBottom: 6,
            color: PROFESSIONAL_COLORS.textMedium,
        },
        contact: {
            fontSize: fonts.contactSize || 9.5,
            fontFamily: fonts.body || 'Helvetica',
            color: PROFESSIONAL_COLORS.textLight,
            lineHeight: 1.4,
            textAlign: headerLayout === 'split' ? 'right' : 'center',
        },
        contactItem: {
            marginBottom: headerLayout === 'split' ? 3 : 0,
        },
        section: {
            marginBottom: 12,
        },
        sectionTitle: {
            fontSize: fonts.sectionSize || 10,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            color: '#000000',
            marginBottom: 8,
            paddingBottom: 4,
            borderBottomWidth: 1,
            borderBottomColor: '#000000',
        },
        summary: {
            fontSize: fonts.summarySize || 10.5,
            fontFamily: fonts.body || 'Helvetica',
            lineHeight: 1.6,
            textAlign: 'left',
            color: PROFESSIONAL_COLORS.textDark,
        },
        skillsCategory: {
            marginBottom: 10,
            width: '100%',
        },
        skillsLabel: {
            fontSize: fonts.skillsLabelSize || 9.5,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            color: PROFESSIONAL_COLORS.textDark,
            marginBottom: 3,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
        },
        skillsList: {
            fontSize: fonts.skillsListSize || 9.5,
            fontFamily: fonts.body || 'Helvetica',
            color: PROFESSIONAL_COLORS.textMedium,
            lineHeight: 1.5,
        },
        expItem: {
            marginBottom: 10,
        },
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
            color: '#000000',
        },
        expDates: {
            fontSize: fonts.expDatesSize || 9.5,
            fontFamily: fonts.body || 'Helvetica',
            color: PROFESSIONAL_COLORS.textMedium,
            fontWeight: 'normal',
        },
        expCompany: {
            fontSize: fonts.expCompanySize || 10,
            color: PROFESSIONAL_COLORS.textMedium,
            marginBottom: 3,
            fontStyle: 'italic',
        },
        expIndustry: {
            fontSize: (fonts.expCompanySize || 10) - 0.5,
            fontFamily: fonts.title || 'Helvetica-Bold',
            fontWeight: 'bold',
            color: PROFESSIONAL_COLORS.textDark,
            marginBottom: 3,
        },
        expDetails: {
            marginLeft: 14,
        },
        expDetailItem: {
            fontSize: fonts.expDetailSize || 10,
            fontFamily: fonts.body || 'Helvetica',
            lineHeight: 1.45,
            marginBottom: 2,
            color: PROFESSIONAL_COLORS.textDark,
        },
        eduItem: {
            marginBottom: 8,
        },
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
            color: '#000000',
        },
        eduDates: {
            fontSize: fonts.eduDatesSize || 9.5,
            fontFamily: fonts.body || 'Helvetica',
            color: PROFESSIONAL_COLORS.textMedium,
            fontWeight: 'normal',
        },
        eduSchool: {
            fontSize: fonts.eduSchoolSize || 10,
            fontFamily: fonts.body || 'Helvetica',
            color: PROFESSIONAL_COLORS.textMedium,
            fontStyle: 'italic',
        },
    });

    const TemplateComponent = ({ data }) => {
        const {
            name,
            title,
            email,
            phone,
            location,
            linkedin,
            website,
            summary,
            skills,
            experience,
            education,
        } = data;

        const renderHeader = () => {
            if (headerLayout === 'split') {
                return (
                    <View style={styles.header}>
                        <View style={styles.headerContent}>
                            <View style={styles.headerLeft}>
                                <Text style={styles.name}>{name}</Text>
                                {title && <Text style={styles.title}>{title}</Text>}
                            </View>
                            <View style={styles.contact}>
                                {email && <Text style={styles.contactItem}>{email}</Text>}
                                {phone && <Text style={styles.contactItem}>{phone}</Text>}
                                {location && <Text style={styles.contactItem}>{location}</Text>}
                                {linkedin && <Text style={styles.contactItem}>{linkedin}</Text>}
                                {website && <Text style={styles.contactItem}>{website}</Text>}
                            </View>
                        </View>
                    </View>
                );
            }

            return (
                <View style={styles.header}>
                    <Text style={styles.name}>{name}</Text>
                    {title && <Text style={styles.title}>{title}</Text>}
                    <Text style={styles.contact}>
                        {email}
                        {phone && ` • ${phone}`}
                        {location && ` • ${location}`}
                        {linkedin && ` • ${linkedin}`}
                        {website && ` • ${website}`}
                    </Text>
                </View>
            );
        };

        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    {renderHeader()}

                    {summary && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{sectionTitles.summary || 'Summary'}</Text>
                            <BoldText text={summary} style={styles.summary} />
                        </View>
                    )}

                    {skills && Object.keys(skills).length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{sectionTitles.skills || 'Skills'}</Text>
                            {Object.entries(skills).map(([category, skillList], idx) => (
                                <View key={idx} style={styles.skillsCategory}>
                                    <Text style={styles.skillsLabel}>{category}</Text>
                                    <Text style={styles.skillsList}>
                                        {Array.isArray(skillList) ? skillList.join(' · ') : String(skillList)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {experience && experience.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{sectionTitles.experience || 'Experience'}</Text>
                            {experience.map((exp, idx) => (
                                <View key={idx} style={styles.expItem}>
                                    <View style={styles.expHeader}>
                                        <Text style={styles.expTitle}>{exp.title || 'Engineer'}</Text>
                                        <Text style={styles.expDates}>
                                            {exp.start_date} – {exp.end_date}
                                        </Text>
                                    </View>
                                    <Text style={styles.expCompany}>
                                        {exp.company}
                                        {exp.location && `, ${exp.location}`}
                                    </Text>
                                    {exp.industry ? (
                                        <Text style={styles.expIndustry}>{exp.industry}</Text>
                                    ) : null}
                                    {exp.details && exp.details.length > 0 && (
                                        <View style={styles.expDetails}>
                                            {exp.details.map((detail, detailIdx) => (
                                                <View key={detailIdx} style={{ marginBottom: 2 }}>
                                                    <BoldText text={`•  ${String(detail ?? '')}`} style={styles.expDetailItem} />
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    {education && education.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{sectionTitles.education || 'Education'}</Text>
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
                                        {edu.school}
                                        {edu.grade && ` • GPA: ${edu.grade}`}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </Page>
            </Document>
        );
    };

    return TemplateComponent;
};

