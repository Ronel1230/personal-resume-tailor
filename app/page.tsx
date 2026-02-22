'use client';
import { useRef, useState } from 'react';

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [gateInput, setGateInput] = useState('');
  const [gateError, setGateError] = useState('');
  const [gateLoading, setGateLoading] = useState(false);

  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = gateInput.trim();
    if (!value) {
      setGateError('Please enter a profile.');
      return;
    }
    setGateError('');
    setGateLoading(true);
    try {
      const res = await fetch('/api/validate-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGateError(data.error || 'Profile not found');
        return;
      }
      setProfileName(data.name);
    } catch {
      setGateError('Something went wrong. Please try again.');
    } finally {
      setGateLoading(false);
    }
  };

  // Gate: require profile before showing main UI
  if (profileName === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Resume Generator</h1>
          <form onSubmit={handleGateSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Profile</label>
              <input
                type="text"
                value={gateInput}
                onChange={(e) => setGateInput(e.target.value)}
                placeholder="e.g. Adam-smith"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                autoFocus
                autoComplete="off"
              />
            </div>
            {gateError && (
              <p className="text-sm text-red-600">{gateError}</p>
            )}
            <button
              type="submit"
              disabled={gateLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-200"
            >
              {gateLoading ? 'Checking...' : 'Continue'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Dynamic Resume PDF Generator</h1>
        <p className="text-sm text-gray-500 mb-4 text-center">Profile: {profileName}</p>
        <form
          ref={formRef}
          action="/api/generate-dynamic-resume-pdf"
          method="POST"
          encType="multipart/form-data"
          target="_blank"
          className="space-y-6"
        >
          <input type="hidden" name="base_resume_profile" value={profileName} />
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Job Description:
            </label>
            <textarea
              name="job_description"
              required
              rows={6}
              cols={60}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Company:</label>
            <input
              name="company"
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Role:</label>
            <input
              name="role"
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow transition-colors duration-200"
          >
            Generate PDF
          </button>
        </form>
      </div>
    </main>
  );
}