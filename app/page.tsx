'use client';
import { useRef, useEffect, useState } from 'react';
import { BaseResumeProfile } from './data/baseResumes';

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const [baseResumes, setBaseResumes] = useState<BaseResumeProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const response = await fetch('/api/profiles');
        const data = await response.json();
        if (data.profiles) {
          setBaseResumes(data.profiles);
        }
      } catch (error) {
        console.error('Failed to fetch profiles:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
          <p className="text-center text-gray-600">Loading profiles...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Dynamic Resume PDF Generator</h1>
        <form
          ref={formRef}
          action="/api/generate-dynamic-resume-pdf"
          method="POST"
          encType="multipart/form-data"
          target="_blank"
          className="space-y-6"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-2">Base Resume Profile:</label>
            <select
              name="base_resume_profile"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
              defaultValue={baseResumes[0]?.name}
            >
              {baseResumes.map((p) => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
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