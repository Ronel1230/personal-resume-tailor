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
  const [questions, setQuestions] = useState('');
  const [llmResponse, setLlmResponse] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [copyPromptLoading, setCopyPromptLoading] = useState(false);
  const [copyQuestionsLoading, setCopyQuestionsLoading] = useState(false);
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

  const copyQuestionsPromptToClipboard = async () => {
    if (!jd.trim() || !questions.trim()) {
      setError('Please enter both a job description and questions first');
      return;
    }
    setError('');
    setCopyQuestionsLoading(true);
    try {
      const response = await fetch('/api/without-api/questions-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: profileName, jd, questions }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to build questions prompt');
      }
      await navigator.clipboard.writeText(data.prompt);
      setQuestions('');
      setCopiedField('questions');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to copy questions prompt');
    } finally {
      setCopyQuestionsLoading(false);
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
      setLlmResponse('');
      setCompanyName('');
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
    <div className="space-y-3 text-sm">
      {quickCopyFields.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Copy to clipboard:</p>
          <div className="flex flex-wrap gap-1.5">
            {quickCopyFields.map(({ key, label, value }) => (
              <button
                key={key}
                type="button"
                onClick={() => copyToClipboard(String(value), key)}
                className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 text-gray-800 transition-colors"
              >
                {copiedField === key ? 'Copied!' : label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-gray-700 font-medium">Step 1 — Job Description</label>
          <button
            type="button"
            onClick={copyPromptToClipboard}
            disabled={copyPromptLoading || !jd.trim()}
            className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-md shadow transition-colors duration-200"
          >
            {copiedField === 'prompt'
              ? 'Copied!'
              : copyPromptLoading
                ? 'Building...'
                : 'Copy Prompt'}
          </button>
        </div>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={5}
          placeholder="Paste the job description here..."
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-gray-900"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-gray-700 font-medium">Questions in JD (optional)</label>
          <button
            type="button"
            onClick={copyQuestionsPromptToClipboard}
            disabled={copyQuestionsLoading || !jd.trim() || !questions.trim()}
            className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-md shadow transition-colors duration-200"
          >
            {copiedField === 'questions'
              ? 'Copied!'
              : copyQuestionsLoading
                ? 'Building...'
                : 'Copy Questions Prompt'}
          </button>
        </div>
        <textarea
          value={questions}
          onChange={(e) => setQuestions(e.target.value)}
          rows={3}
          placeholder="Paste application questions here..."
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-gray-900"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Step 2 — Paste LLM Response (JSON)</label>
        <textarea
          value={llmResponse}
          onChange={(e) => setLlmResponse(e.target.value)}
          rows={6}
          placeholder='Paste the JSON from ChatGPT here...'
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none font-mono text-xs text-gray-900"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Company Name (optional)</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Used in the PDF filename"
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
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
        <p className="text-xs text-green-600 text-center">
          Resume generated successfully in {lastGenerationTime}s
        </p>
      )}
    </div>
  );
}
