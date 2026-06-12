'use client';

import { useState } from 'react';
import type { WithoutApiProfileData } from '@/app/utils/profilePrompt';

type WithoutApiResumeFormProps = {
  profileName: string;
  profileData: WithoutApiProfileData | null;
  profileDataLoading: boolean;
};

export default function WithoutApiResumeForm({
  profileName,
  profileData,
  profileDataLoading,
}: WithoutApiResumeFormProps) {
  const [jd, setJd] = useState('');
  const [llmResponse, setLlmResponse] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [copyPromptLoading, setCopyPromptLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lastGenerationTime, setLastGenerationTime] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [error, setError] = useState('');

  const copyToClipboard = async (text: string, fieldName: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setCopiedField('failed');
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const getLastCompany = () => profileData?.experience?.[0]?.company ?? null;
  const getLastRole = () => profileData?.experience?.[0]?.title ?? null;

  const quickCopyFields = [
    { key: 'email', label: 'Email', value: profileData?.email },
    { key: 'phone', label: 'Phone', value: profileData?.phone },
    { key: 'location', label: 'Address', value: profileData?.location },
    { key: 'postalCode', label: 'Postal Code', value: profileData?.postalCode },
    { key: 'lastCompany', label: 'Last Company', value: getLastCompany() },
    { key: 'lastRole', label: 'Last Role', value: getLastRole() },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      value: typeof profileData?.linkedin === 'string' ? profileData.linkedin : profileData?.linkedin?.url,
    },
    { key: 'github', label: 'GitHub', value: profileData?.github },
  ].filter((f) => f.value);

  const copyPromptToClipboard = async () => {
    if (!jd.trim()) {
      setError('Please enter a job description first');
      return;
    }
    setError('');
    setCopyPromptLoading(true);
    try {
      const response = await fetch('/api/without-api/manual-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: profileName, jd }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to build prompt');
      }
      await navigator.clipboard.writeText(data.prompt);
      setCopiedField('prompt');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to copy prompt');
    } finally {
      setCopyPromptLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!llmResponse.trim()) {
      setError('Please paste the LLM response (JSON) first');
      return;
    }
    setError('');
    setGenerating(true);
    setElapsedTime(0);
    const startTime = Date.now();
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    try {
      const response = await fetch('/api/without-api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: profileName,
          llmResponse: llmResponse.trim(),
          companyName: companyName.trim() || null,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${profileName.replace(/\s+/g, '_')}.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) filename = filenameMatch[1];
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setLastGenerationTime(Math.floor((Date.now() - startTime) / 1000));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      clearInterval(timer);
      setGenerating(false);
    }
  };

  if (profileDataLoading) {
    return <p className="text-sm text-gray-500 text-center py-4">Loading profile data...</p>;
  }

  if (!profileData) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Without API profile content is not configured for this profile. Ask an admin to add it in the dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {quickCopyFields.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Copy to clipboard:</p>
          <div className="flex flex-wrap gap-2">
            {quickCopyFields.map(({ key, label, value }) => (
              <button
                key={key}
                type="button"
                onClick={() => copyToClipboard(String(value), key)}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 text-gray-800 transition-colors"
              >
                {copiedField === key ? 'Copied!' : label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div>
        <label className="block text-gray-700 font-medium mb-2">Step 1 — Job Description</label>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={6}
          placeholder="Paste the job description here..."
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-gray-900"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Step 2 — Copy Prompt for ChatGPT</label>
        <button
          type="button"
          onClick={copyPromptToClipboard}
          disabled={copyPromptLoading || !jd.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-200"
        >
          {copiedField === 'prompt'
            ? 'Copied! Paste into ChatGPT'
            : copyPromptLoading
              ? 'Building prompt...'
              : 'Copy Prompt (Profile + JD)'}
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Paste the copied text into ChatGPT, then copy the JSON response below.
        </p>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Step 3 — Paste LLM Response (JSON)</label>
        <textarea
          value={llmResponse}
          onChange={(e) => setLlmResponse(e.target.value)}
          rows={8}
          placeholder='Paste the JSON from ChatGPT here...'
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none font-mono text-sm text-gray-900"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Company Name (optional)</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Used in the PDF filename"
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
        />
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={generating || !llmResponse.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-200"
      >
        {generating ? `Generating PDF... (${elapsedTime}s)` : 'Generate PDF'}
      </button>

      {lastGenerationTime !== null && (
        <p className="text-sm text-green-600 text-center">
          Resume generated successfully in {lastGenerationTime}s
        </p>
      )}
    </div>
  );
}
