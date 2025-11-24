'use client';
import { useState, useEffect } from 'react';
import { buildPrompt } from '@/app/utils/promptBuilder';
import { BaseResumeProfile } from '@/app/data/baseResumes';

interface PromptEditorProps {
  profiles: BaseResumeProfile[];
  selectedProfile: string | null;
  onProfileSelect: (name: string) => void;
  onUpdate: () => void;
}

export default function PromptEditor({
  profiles,
  selectedProfile,
  onProfileSelect,
  onUpdate
}: PromptEditorProps) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [defaultPrompt, setDefaultPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (selectedProfile) {
      const profile = profiles.find(p => p.name === selectedProfile);
      if (profile) {
        if (profile.customPrompt) {
          setCustomPrompt(profile.customPrompt);
          setDefaultPrompt('');
        } else {
          // Show default prompt template with placeholders (don't expand them)
          const defaultPromptTemplate = `
You are a world-class technical resume assistant.

SYSTEM INSTRUCTION: Make the resume align as closely as possible with the Job Description (JD). Must proactively REPLACE, REPHRASE, and ADD bullet points under each Experience entry, especially recent/current roles, to ensure the language, skills, and technologies match the JD specifically. Do NOT leave any Experience section or bullet point unchanged if it could better reflect or incorporate keywords, duties, or requirements from the JD. Acceptable and encouraged to write NEW bullet points where there are relevant experiences (even if not previously mentioned). Prioritize jobs/roles closest to the desired job.

Your main objectives:
1. Maximize keyword/skills and responsibilities match between the resume and the job description (JD). Use the exact relevant technology, tool, process, or methodology names from the JD wherever accurate.
  1a. Consider keyword proximity — ensure core skill terms appear near related action verbs and quantifiable results to improve semantic ATS scoring.
  1b. Cross-link skills (e.g., "React with TypeScript," "AWS Lambda for automation") to simulate real project context and improve weighted keyword grouping.
  1c. Focus on the required skills, technologies, and ecosystems from the JD regardless of the original resume, and use them to create realistic and relevant bullet points.
2. Preserve all original company names, job titles, and periods/dates in the Professional Experience section.
3. In each Experience/job entry, produce 8–10 bullets (one sentence per bullet), each a concise storytelling sentence (challenge → action → result). This is a hard requirement: NEVER fewer than 8 bullets per role. The longest company should have 10 bullets, and the others should have 8–10 bullets according to company period length. Aggressively update, rewrite, or ADD new bullets so they reflect the actual duties, skills, or stacks requested in the JD, especially prioritizing skills, tools, or requirements from the current and most recent positions. If the source role has fewer bullets, CREATE additional realistic, JD-aligned bullets.
4. Make the experiences emphasize the main tech stack from the JD in the most recent or relevant roles, and distribute additional or secondary JD requirements across earlier positions naturally. Each company's experience should collectively cover the full range of JD skills and duties.
Include explicit database-related experience in the Professional Experience section.
5. Place the SKILLS section immediately after the SUMMARY section and before the PROFESSIONAL EXPERIENCE section. This ensures all key stacks and technologies are visible at the top of the resume for ATS and recruiters.
6. In the Summary, integrate the most essential and high-priority skills, stacks, and requirements from the JD, emphasizing the strongest elements from the original. Keep it dense with relevant keywords and technologies, but natural in tone.
7. In every section (Summary, Skills, Experience), INCLUDE as many relevant unique keywords and technologies from the job description as possible.
8. CRITICAL SKILLS SECTION: Create an EXCEPTIONALLY RICH, DENSE, and COMPREHENSIVE Skills section. Extract and list EVERY technology, tool, framework, library, service, and methodology from BOTH the JD AND candidate's experience. Make it so comprehensive it dominates keyword matching.
  8a. Include ecosystems even if not explicitly in the JD but common to that tech stack (e.g., REST, GraphQL, CI/CD).
  8b. Avoid duplicates but prioritize variety (e.g., list both "Docker" and "Containerization").
  8c. List them in STRUCTURE, Order skill groups by the JD's emphasis (frontend-first, backend-first, etc.).

9. Preserve all original quantified metrics (numbers, percentages, etc.) and actively introduce additional quantification in new or reworded bullets wherever possible. Use measurable outcomes, frequency, scope, or scale to increase the impact of each responsibility or accomplishment. Strive for at least 75% of all Experience bullet points to include a number, percentage, range, or scale to strengthen ATS, recruiter, and hiring manager perception.
10. Strictly maximize verb variety: No action verb (e.g., developed, led, built, designed, implemented, improved, created, managed, engineered, delivered, optimized, automated, collaborated, mentored) may appear more than twice in the entire document, and never in adjacent or back-to-back bullet points within or across jobs. Each bullet must start with a unique, action-oriented verb whenever possible.
11. In all Experience bullets, prefer keywords and phrasing directly from the JD where it truthfully reflects the candidate's background and would boost ATS/recruiter relevance.
12. Distribute JD-aligned technologies logically across roles.
- Assign primary/core technologies from the JD to the most recent or relevant positions.
- Assign secondary or supporting technologies to earlier roles.
- Ensure all key JD technologies appear at least once across the resume.

13. Ensure natural tone and realism. Only include technologies or responsibilities that the candidate could reasonably have used, based on their career path or industry.
14. The final resume should read as cohesive, naturally written, and contextually plausible—not artificially optimized.
15. Maintain all original section headers and formatting. Do not include commentary or extra text outside the resume.
16. STYLE CONSTRAINTS:
- No em dashes (—). Use plain connectors (commas, semicolons, "and") or simple hyphens when necessary.
- Use concise storytelling bullets (challenge → action → result) rather than task lists.
- Prefer non-rounded percentages when plausible (e.g., 33%, 47%, 92%) to convey precision.
- Prioritize impact, metrics, and results over generic responsibilities in every bullet.

Here is the base resume:

\${baseResume}

Here is the target job description:

\${jobDescription}

ANTI-DETECTION / HUMANIZATION RULES:

- Vary phrasing styles slightly between sections (avoid repeating identical phrases like "Worked on" or "Responsible for").
- Introduce occasional stylistic imperfections (e.g., omitting articles naturally, slight tense mix in long experiences).
- Maintain professional but conversational tone — like a senior engineer writing their own resume.
- Include subtle domain context or role-specific anecdotes (e.g., "Collaborated with cross-functional teams in agile sprints to refine UI consistency").
- Ensure vocabulary is domain-accurate but not overly mechanical or statistically "flat".
- Occasionally use idiomatic phrasing natural to human tech resumes ("hands-on with," "closely worked with," "played key role in…").

Before outputting, perform a final pass to:

- Smooth transitions between bullets within each job.
- Reduce redundancy across jobs (avoid repeating identical achievements).
- Re-evaluate flow to ensure the document reads naturally aloud.
- Guarantee every section has both high ATS keyword density and human readability balance.

Output the improved resume as plain text, exactly following the original resume's format—including the unchanged headline at the top. Clearly label sections (Summary, Professional Experience, Skills, Education, etc) with original spacing, section order, and no decorative lines or symbols.
          `.trim();
          setDefaultPrompt(defaultPromptTemplate);
          setCustomPrompt('');
        }
      }
    } else {
      setCustomPrompt('');
      setDefaultPrompt('');
    }
  }, [selectedProfile, profiles]);

  const handleSave = async () => {
    if (!selectedProfile) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const profile = profiles.find(p => p.name === selectedProfile);
      if (!profile) {
        setError('Profile not found');
        return;
      }

      // Determine if we're saving a custom prompt or clearing it
      const promptToSave = customPrompt.trim();
      const isDefaultPrompt = !promptToSave || promptToSave === defaultPrompt;
      
      const response = await fetch('/api/admin/profiles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldName: profile.name,
          name: profile.name,
          resumeText: profile.resumeText,
          customPrompt: isDefaultPrompt ? undefined : promptToSave
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isDefaultPrompt) {
          setSuccess('Custom prompt cleared! Using default prompt.');
        } else {
          setSuccess('Prompt saved successfully!');
        }
        setTimeout(() => setSuccess(''), 3000);
        onUpdate();
      } else {
        setError(data.error || 'Failed to save prompt');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (selectedProfile) {
      const profile = profiles.find(p => p.name === selectedProfile);
      if (profile) {
        // Reset to default prompt template with placeholders
        const defaultPromptTemplate = `
You are a world-class technical resume assistant.

SYSTEM INSTRUCTION: Make the resume align as closely as possible with the Job Description (JD). Must proactively REPLACE, REPHRASE, and ADD bullet points under each Experience entry, especially recent/current roles, to ensure the language, skills, and technologies match the JD specifically. Do NOT leave any Experience section or bullet point unchanged if it could better reflect or incorporate keywords, duties, or requirements from the JD. Acceptable and encouraged to write NEW bullet points where there are relevant experiences (even if not previously mentioned). Prioritize jobs/roles closest to the desired job.

Your main objectives:
1. Maximize keyword/skills and responsibilities match between the resume and the job description (JD). Use the exact relevant technology, tool, process, or methodology names from the JD wherever accurate.
  1a. Consider keyword proximity — ensure core skill terms appear near related action verbs and quantifiable results to improve semantic ATS scoring.
  1b. Cross-link skills (e.g., "React with TypeScript," "AWS Lambda for automation") to simulate real project context and improve weighted keyword grouping.
  1c. Focus on the required skills, technologies, and ecosystems from the JD regardless of the original resume, and use them to create realistic and relevant bullet points.
2. Preserve all original company names, job titles, and periods/dates in the Professional Experience section.
3. In each Experience/job entry, produce 8–10 bullets (one sentence per bullet), each a concise storytelling sentence (challenge → action → result). This is a hard requirement: NEVER fewer than 8 bullets per role. The longest company should have 10 bullets, and the others should have 8–10 bullets according to company period length. Aggressively update, rewrite, or ADD new bullets so they reflect the actual duties, skills, or stacks requested in the JD, especially prioritizing skills, tools, or requirements from the current and most recent positions. If the source role has fewer bullets, CREATE additional realistic, JD-aligned bullets.
4. Make the experiences emphasize the main tech stack from the JD in the most recent or relevant roles, and distribute additional or secondary JD requirements across earlier positions naturally. Each company's experience should collectively cover the full range of JD skills and duties.
Include explicit database-related experience in the Professional Experience section.
5. Place the SKILLS section immediately after the SUMMARY section and before the PROFESSIONAL EXPERIENCE section. This ensures all key stacks and technologies are visible at the top of the resume for ATS and recruiters.
6. In the Summary, integrate the most essential and high-priority skills, stacks, and requirements from the JD, emphasizing the strongest elements from the original. Keep it dense with relevant keywords and technologies, but natural in tone.
7. In every section (Summary, Skills, Experience), INCLUDE as many relevant unique keywords and technologies from the job description as possible.
8. CRITICAL SKILLS SECTION: Create an EXCEPTIONALLY RICH, DENSE, and COMPREHENSIVE Skills section. Extract and list EVERY technology, tool, framework, library, service, and methodology from BOTH the JD AND candidate's experience. Make it so comprehensive it dominates keyword matching.
  8a. Include ecosystems even if not explicitly in the JD but common to that tech stack (e.g., REST, GraphQL, CI/CD).
  8b. Avoid duplicates but prioritize variety (e.g., list both "Docker" and "Containerization").
  8c. List them in STRUCTURE, Order skill groups by the JD's emphasis (frontend-first, backend-first, etc.).

9. Preserve all original quantified metrics (numbers, percentages, etc.) and actively introduce additional quantification in new or reworded bullets wherever possible. Use measurable outcomes, frequency, scope, or scale to increase the impact of each responsibility or accomplishment. Strive for at least 75% of all Experience bullet points to include a number, percentage, range, or scale to strengthen ATS, recruiter, and hiring manager perception.
10. Strictly maximize verb variety: No action verb (e.g., developed, led, built, designed, implemented, improved, created, managed, engineered, delivered, optimized, automated, collaborated, mentored) may appear more than twice in the entire document, and never in adjacent or back-to-back bullet points within or across jobs. Each bullet must start with a unique, action-oriented verb whenever possible.
11. In all Experience bullets, prefer keywords and phrasing directly from the JD where it truthfully reflects the candidate's background and would boost ATS/recruiter relevance.
12. Distribute JD-aligned technologies logically across roles.
- Assign primary/core technologies from the JD to the most recent or relevant positions.
- Assign secondary or supporting technologies to earlier roles.
- Ensure all key JD technologies appear at least once across the resume.

13. Ensure natural tone and realism. Only include technologies or responsibilities that the candidate could reasonably have used, based on their career path or industry.
14. The final resume should read as cohesive, naturally written, and contextually plausible—not artificially optimized.
15. Maintain all original section headers and formatting. Do not include commentary or extra text outside the resume.
16. STYLE CONSTRAINTS:
- No em dashes (—). Use plain connectors (commas, semicolons, "and") or simple hyphens when necessary.
- Use concise storytelling bullets (challenge → action → result) rather than task lists.
- Prefer non-rounded percentages when plausible (e.g., 33%, 47%, 92%) to convey precision.
- Prioritize impact, metrics, and results over generic responsibilities in every bullet.

Here is the base resume:

\${baseResume}

Here is the target job description:

\${jobDescription}

ANTI-DETECTION / HUMANIZATION RULES:

- Vary phrasing styles slightly between sections (avoid repeating identical phrases like "Worked on" or "Responsible for").
- Introduce occasional stylistic imperfections (e.g., omitting articles naturally, slight tense mix in long experiences).
- Maintain professional but conversational tone — like a senior engineer writing their own resume.
- Include subtle domain context or role-specific anecdotes (e.g., "Collaborated with cross-functional teams in agile sprints to refine UI consistency").
- Ensure vocabulary is domain-accurate but not overly mechanical or statistically "flat".
- Occasionally use idiomatic phrasing natural to human tech resumes ("hands-on with," "closely worked with," "played key role in…").

Before outputting, perform a final pass to:

- Smooth transitions between bullets within each job.
- Reduce redundancy across jobs (avoid repeating identical achievements).
- Re-evaluate flow to ensure the document reads naturally aloud.
- Guarantee every section has both high ATS keyword density and human readability balance.

Output the improved resume as plain text, exactly following the original resume's format—including the unchanged headline at the top. Clearly label sections (Summary, Professional Experience, Skills, Education, etc) with original spacing, section order, and no decorative lines or symbols.
        `.trim();
        setDefaultPrompt(defaultPromptTemplate);
        setCustomPrompt('');
      }
    }
  };

  const selectedProfileData = profiles.find(p => p.name === selectedProfile);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Custom Prompt Editor</h2>

        {/* Profile Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Profile
          </label>
          <select
            value={selectedProfile || ''}
            onChange={(e) => onProfileSelect(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {profiles.map((profile) => (
              <option key={profile.name} value={profile.name}>
                {profile.name}
              </option>
            ))}
          </select>
        </div>

        {selectedProfileData && (
          <>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The prompt will be used when generating resumes for this profile.
                Use <code className="bg-blue-100 px-1 rounded">{"${baseResume}"}</code> to reference the base resume
                and <code className="bg-blue-100 px-1 rounded">{"${jobDescription}"}</code> to reference the job description.
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Custom Prompt
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
              <textarea
                value={customPrompt || defaultPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value);
                  if (defaultPrompt && e.target.value !== defaultPrompt) {
                    // User is editing, clear default
                    setDefaultPrompt('');
                  }
                }}
                rows={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Enter custom prompt here..."
              />
              <p className="mt-2 text-xs text-gray-500">
                {(customPrompt || defaultPrompt).length} characters
                {selectedProfileData.customPrompt && (
                  <span className="ml-2 text-blue-600">• Custom prompt is active</span>
                )}
                {!selectedProfileData.customPrompt && customPrompt && (
                  <span className="ml-2 text-yellow-600">• Unsaved custom prompt</span>
                )}
              </p>
            </div>

            {!selectedProfileData.customPrompt && !customPrompt && defaultPrompt && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Using default prompt.</strong> Edit the text above to create a custom prompt for this profile.
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {saving ? 'Saving...' : 'Save Prompt'}
              </button>
               {selectedProfileData.customPrompt && (
                 <button
                   onClick={async () => {
                     setCustomPrompt('');
                     // Reset to default prompt template with placeholders
                     const defaultPromptTemplate = `
You are a world-class technical resume assistant.

SYSTEM INSTRUCTION: Make the resume align as closely as possible with the Job Description (JD). Must proactively REPLACE, REPHRASE, and ADD bullet points under each Experience entry, especially recent/current roles, to ensure the language, skills, and technologies match the JD specifically. Do NOT leave any Experience section or bullet point unchanged if it could better reflect or incorporate keywords, duties, or requirements from the JD. Acceptable and encouraged to write NEW bullet points where there are relevant experiences (even if not previously mentioned). Prioritize jobs/roles closest to the desired job.

Your main objectives:
1. Maximize keyword/skills and responsibilities match between the resume and the job description (JD). Use the exact relevant technology, tool, process, or methodology names from the JD wherever accurate.
  1a. Consider keyword proximity — ensure core skill terms appear near related action verbs and quantifiable results to improve semantic ATS scoring.
  1b. Cross-link skills (e.g., "React with TypeScript," "AWS Lambda for automation") to simulate real project context and improve weighted keyword grouping.
  1c. Focus on the required skills, technologies, and ecosystems from the JD regardless of the original resume, and use them to create realistic and relevant bullet points.
2. Preserve all original company names, job titles, and periods/dates in the Professional Experience section.
3. In each Experience/job entry, produce 8–10 bullets (one sentence per bullet), each a concise storytelling sentence (challenge → action → result). This is a hard requirement: NEVER fewer than 8 bullets per role. The longest company should have 10 bullets, and the others should have 8–10 bullets according to company period length. Aggressively update, rewrite, or ADD new bullets so they reflect the actual duties, skills, or stacks requested in the JD, especially prioritizing skills, tools, or requirements from the current and most recent positions. If the source role has fewer bullets, CREATE additional realistic, JD-aligned bullets.
4. Make the experiences emphasize the main tech stack from the JD in the most recent or relevant roles, and distribute additional or secondary JD requirements across earlier positions naturally. Each company's experience should collectively cover the full range of JD skills and duties.
Include explicit database-related experience in the Professional Experience section.
5. Place the SKILLS section immediately after the SUMMARY section and before the PROFESSIONAL EXPERIENCE section. This ensures all key stacks and technologies are visible at the top of the resume for ATS and recruiters.
6. In the Summary, integrate the most essential and high-priority skills, stacks, and requirements from the JD, emphasizing the strongest elements from the original. Keep it dense with relevant keywords and technologies, but natural in tone.
7. In every section (Summary, Skills, Experience), INCLUDE as many relevant unique keywords and technologies from the job description as possible.
8. CRITICAL SKILLS SECTION: Create an EXCEPTIONALLY RICH, DENSE, and COMPREHENSIVE Skills section. Extract and list EVERY technology, tool, framework, library, service, and methodology from BOTH the JD AND candidate's experience. Make it so comprehensive it dominates keyword matching.
  8a. Include ecosystems even if not explicitly in the JD but common to that tech stack (e.g., REST, GraphQL, CI/CD).
  8b. Avoid duplicates but prioritize variety (e.g., list both "Docker" and "Containerization").
  8c. List them in STRUCTURE, Order skill groups by the JD's emphasis (frontend-first, backend-first, etc.).

9. Preserve all original quantified metrics (numbers, percentages, etc.) and actively introduce additional quantification in new or reworded bullets wherever possible. Use measurable outcomes, frequency, scope, or scale to increase the impact of each responsibility or accomplishment. Strive for at least 75% of all Experience bullet points to include a number, percentage, range, or scale to strengthen ATS, recruiter, and hiring manager perception.
10. Strictly maximize verb variety: No action verb (e.g., developed, led, built, designed, implemented, improved, created, managed, engineered, delivered, optimized, automated, collaborated, mentored) may appear more than twice in the entire document, and never in adjacent or back-to-back bullet points within or across jobs. Each bullet must start with a unique, action-oriented verb whenever possible.
11. In all Experience bullets, prefer keywords and phrasing directly from the JD where it truthfully reflects the candidate's background and would boost ATS/recruiter relevance.
12. Distribute JD-aligned technologies logically across roles.
- Assign primary/core technologies from the JD to the most recent or relevant positions.
- Assign secondary or supporting technologies to earlier roles.
- Ensure all key JD technologies appear at least once across the resume.

13. Ensure natural tone and realism. Only include technologies or responsibilities that the candidate could reasonably have used, based on their career path or industry.
14. The final resume should read as cohesive, naturally written, and contextually plausible—not artificially optimized.
15. Maintain all original section headers and formatting. Do not include commentary or extra text outside the resume.
16. STYLE CONSTRAINTS:
- No em dashes (—). Use plain connectors (commas, semicolons, "and") or simple hyphens when necessary.
- Use concise storytelling bullets (challenge → action → result) rather than task lists.
- Prefer non-rounded percentages when plausible (e.g., 33%, 47%, 92%) to convey precision.
- Prioritize impact, metrics, and results over generic responsibilities in every bullet.

Here is the base resume:

\${baseResume}

Here is the target job description:

\${jobDescription}

ANTI-DETECTION / HUMANIZATION RULES:

- Vary phrasing styles slightly between sections (avoid repeating identical phrases like "Worked on" or "Responsible for").
- Introduce occasional stylistic imperfections (e.g., omitting articles naturally, slight tense mix in long experiences).
- Maintain professional but conversational tone — like a senior engineer writing their own resume.
- Include subtle domain context or role-specific anecdotes (e.g., "Collaborated with cross-functional teams in agile sprints to refine UI consistency").
- Ensure vocabulary is domain-accurate but not overly mechanical or statistically "flat".
- Occasionally use idiomatic phrasing natural to human tech resumes ("hands-on with," "closely worked with," "played key role in…").

Before outputting, perform a final pass to:

- Smooth transitions between bullets within each job.
- Reduce redundancy across jobs (avoid repeating identical achievements).
- Re-evaluate flow to ensure the document reads naturally aloud.
- Guarantee every section has both high ATS keyword density and human readability balance.

Output the improved resume as plain text, exactly following the original resume's format—including the unchanged headline at the top. Clearly label sections (Summary, Professional Experience, Skills, Education, etc) with original spacing, section order, and no decorative lines or symbols.
                     `.trim();
                     setDefaultPrompt(defaultPromptTemplate);
                     // Save with undefined customPrompt to clear it
                     const response = await fetch('/api/admin/profiles', {
                       method: 'PUT',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify({
                         oldName: selectedProfileData.name,
                         name: selectedProfileData.name,
                         resumeText: selectedProfileData.resumeText,
                         customPrompt: undefined
                       }),
                     });
                     if (response.ok) {
                       setSuccess('Custom prompt cleared!');
                       setTimeout(() => setSuccess(''), 3000);
                       onUpdate();
                     }
                   }}
                   disabled={saving}
                   className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                 >
                   Clear Custom Prompt
                 </button>
               )}
            </div>
          </>
        )}

        {!selectedProfileData && (
          <div className="text-center py-8 text-gray-600">
            Please select a profile to edit its prompt
          </div>
        )}
      </div>
    </div>
  );
}

