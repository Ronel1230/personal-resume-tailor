import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { extractYear, BoldText } from './utils';

// Professional CV styles: black/grayscale only
const styles = StyleSheet.create({
  page: {
    padding: '15mm',
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#1a1a1a',
  },
  header: {
    textAlign: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#000000',
  },
  title: {
    fontSize: 11,
    fontWeight: 'normal',
    marginBottom: 6,
    color: '#404040',
  },
  contact: {
    fontSize: 9.5,
    color: '#6b6b6b',
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
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
    fontSize: 10.5,
    lineHeight: 1.6,
    textAlign: 'left',
    color: '#1a1a1a',
  },
  skillsCategory: {
    marginBottom: 10,
    width: '100%',
  },
  skillsLabel: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  skillsList: {
    fontSize: 9.5,
    color: '#404040',
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
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#000000',
  },
  expDates: {
    fontSize: 9.5,
    color: '#404040',
    fontWeight: 'normal',
  },
  expCompany: {
    fontSize: 10,
    color: '#404040',
    marginBottom: 3,
    fontStyle: 'italic',
  },
  expIndustry: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 3,
  },
  expDetails: {
    marginLeft: 14,
  },
  expDetailItem: {
    fontSize: 10,
    lineHeight: 1.45,
    marginBottom: 2,
    color: '#1a1a1a',
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
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#000000',
  },
  eduDates: {
    fontSize: 9.5,
    color: '#404040',
    fontWeight: 'normal',
  },
  eduSchool: {
    fontSize: 10,
    color: '#404040',
    fontStyle: 'italic',
  },
});

const ResumeTemplate = ({ data }) => {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
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

        {/* Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <BoldText text={summary} style={styles.summary} />
          </View>
        )}

        {/* Skills */}
        {skills && Object.keys(skills).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
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

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
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

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education & Credentials</Text>
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

export default ResumeTemplate;

