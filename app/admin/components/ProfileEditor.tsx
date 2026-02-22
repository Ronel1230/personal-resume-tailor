'use client';
import { useState, useEffect } from 'react';
import { BaseResumeProfile } from '@/app/data/baseResumes';
import { DEFAULT_PROMPT_TEMPLATE } from '@/app/utils/promptBuilder';

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
      pdfTemplate: 1,
      phone: '',
      linkedin: '',
      github: '',
      lastCompany: '',
      university: '',
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
            pdfTemplate: editingProfile.pdfTemplate || 1,
            phone: editingProfile.phone || undefined,
            linkedin: editingProfile.linkedin || undefined,
            github: editingProfile.github || undefined,
            lastCompany: editingProfile.lastCompany || undefined,
            university: editingProfile.university || undefined,
          }
        : {
            oldName: profiles.find(p => p.name === editingProfile.name)?.name || editingProfile.name,
            name: editingProfile.name,
            resumeText: editingProfile.resumeText,
            customPrompt: editingProfile.customPrompt || undefined,
            pdfTemplate: editingProfile.pdfTemplate || 1,
            phone: editingProfile.phone || undefined,
            linkedin: editingProfile.linkedin || undefined,
            github: editingProfile.github || undefined,
            lastCompany: editingProfile.lastCompany || undefined,
            university: editingProfile.university || undefined,
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
    const currentPrompt = editingProfile.customPrompt || DEFAULT_PROMPT_TEMPLATE;

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

          {/* Contact Info (per profile) */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Info</h3>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editingProfile.phone ?? ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={editingProfile.linkedin ?? ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                <input
                  type="url"
                  value={editingProfile.github ?? ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, github: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Company</label>
                <input
                  type="text"
                  value={editingProfile.lastCompany ?? ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, lastCompany: e.target.value })}
                  placeholder="Company name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <input
                  type="text"
                  value={editingProfile.university ?? ''}
                  onChange={(e) => setEditingProfile({ ...editingProfile, university: e.target.value })}
                  placeholder="University name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
                if (newPrompt !== DEFAULT_PROMPT_TEMPLATE) {
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

