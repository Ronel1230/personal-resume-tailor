'use client';
import { useState, useEffect } from 'react';
import { BaseResumeProfile } from '@/app/data/baseResumes';

interface ProfileEditorProps {
  profiles: BaseResumeProfile[];
  onUpdate: () => void;
}

// PDF Template options
const PDF_TEMPLATES = [
  { value: 1, label: 'Template1' },
  { value: 2, label: 'Template2' },
  { value: 3, label: 'Template3' },
  { value: 4, label: 'Template4' },
  { value: 5, label: 'Template5' },
];

export default function ProfileEditor({ profiles, onUpdate }: ProfileEditorProps) {
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<BaseResumeProfile | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Default prompt template
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

  useEffect(() => {
    if (profiles.length > 0 && !selectedProfileName) {
      setSelectedProfileName(profiles[0].name);
    }
  }, [profiles, selectedProfileName]);

  const selectedProfile = profiles.find(p => p.name === selectedProfileName);

  const handleCreate = () => {
    setEditingProfile({
      name: '',
      resumeText: '',
      customPrompt: undefined,
      pdfTemplate: 1
    });
    setIsCreating(true);
    setError('');
    setSelectedProfileName(null);
  };

  const handleEdit = (profile: BaseResumeProfile) => {
    setEditingProfile({ ...profile });
    setIsCreating(false);
    setError('');
    setSelectedProfileName(profile.name);
  };

  const handleSave = async () => {
    if (!editingProfile) return;

    if (!editingProfile.name.trim() || !editingProfile.resumeText.trim()) {
      setError('Name and Resume Text are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = '/api/admin/profiles';
      const method = isCreating ? 'POST' : 'PUT';
      const body = isCreating
        ? {
            name: editingProfile.name,
            resumeText: editingProfile.resumeText,
            customPrompt: editingProfile.customPrompt || undefined,
            pdfTemplate: editingProfile.pdfTemplate || 1
          }
        : {
            oldName: profiles.find(p => p.name === editingProfile.name)?.name || editingProfile.name,
            name: editingProfile.name,
            resumeText: editingProfile.resumeText,
            customPrompt: editingProfile.customPrompt || undefined,
            pdfTemplate: editingProfile.pdfTemplate || 1
          };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Profile saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
        setEditingProfile(null);
        setIsCreating(false);
        setSelectedProfileName(editingProfile.name);
        onUpdate();
      } else {
        setError(data.error || 'Failed to save profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/profiles?name=${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShowDeleteConfirm(null);
        if (selectedProfileName === name) {
          setSelectedProfileName(null);
        }
        onUpdate();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If editing, show the edit form
  if (editingProfile) {
    const currentPrompt = editingProfile.customPrompt || defaultPromptTemplate;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {isCreating ? 'Create New Profile' : 'Edit Profile'}
          </h2>
          <button
            onClick={() => {
              setEditingProfile(null);
              setIsCreating(false);
              setError('');
              setSuccess('');
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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

        <div className="space-y-6">
          {/* Profile Basic Info */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Name *
                </label>
                <input
                  type="text"
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume Text *
                </label>
                <textarea
                  value={editingProfile.resumeText}
                  onChange={(e) => setEditingProfile({ ...editingProfile, resumeText: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900"
                  placeholder="Paste the full resume text here..."
                />
              </div>
            </div>
          </div>

          {/* PDF Template Selection */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">PDF Template</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select PDF Template
              </label>
              <select
                value={editingProfile.pdfTemplate || 1}
                onChange={(e) => setEditingProfile({ ...editingProfile, pdfTemplate: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                {PDF_TEMPLATES.map((template) => (
                  <option key={template.value} value={template.value}>
                    {template.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500">
                Choose the PDF template style for this profile
              </p>
            </div>
          </div>

          {/* Custom Prompt Editor */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Custom Prompt</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingProfile({ ...editingProfile, customPrompt: undefined });
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Reset to Default
                </button>
              </div>
            </div>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Use <code className="bg-blue-100 px-1 rounded">{"${baseResume}"}</code> to reference the base resume
                and <code className="bg-blue-100 px-1 rounded">{"${jobDescription}"}</code> to reference the job description.
              </p>
            </div>
            <textarea
              value={currentPrompt}
              onChange={(e) => {
                const newPrompt = e.target.value;
                // If user edits away from default, set as custom
                if (newPrompt !== defaultPromptTemplate) {
                  setEditingProfile({ ...editingProfile, customPrompt: newPrompt });
                } else {
                  setEditingProfile({ ...editingProfile, customPrompt: undefined });
                }
              }}
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900"
              placeholder="Enter custom prompt here..."
            />
            <p className="mt-2 text-xs text-gray-500">
              {currentPrompt.length} characters
              {editingProfile.customPrompt && (
                <span className="ml-2 text-blue-600">• Custom prompt is active</span>
              )}
              {!editingProfile.customPrompt && (
                <span className="ml-2 text-gray-500">• Using default prompt</span>
              )}
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
            <button
              onClick={() => {
                setEditingProfile(null);
                setIsCreating(false);
                setError('');
                setSuccess('');
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show profile list and selection
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Resume Profiles</h2>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Profile
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {profiles.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No profiles found. Create your first profile!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {profiles.map((profile) => (
            <div key={profile.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{profile.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Resume Text: {profile.resumeText.length} characters</p>
                    {profile.customPrompt && (
                      <p className="text-blue-600">✓ Custom prompt configured</p>
                    )}
                    <p>PDF Template: {PDF_TEMPLATES.find(t => t.value === (profile.pdfTemplate || 1))?.label || "Template1"}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(profile)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(profile.name)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the profile &quot;{showDeleteConfirm}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

