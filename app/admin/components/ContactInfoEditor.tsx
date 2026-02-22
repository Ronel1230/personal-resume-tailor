'use client';
import { useState, useEffect } from 'react';

export type ContactInfoData = {
  phone: string;
  linkedin: string;
  github: string;
  lastCompany: string;
  university: string;
};

const initial: ContactInfoData = {
  phone: '',
  linkedin: '',
  github: '',
  lastCompany: '',
  university: '',
};

export default function ContactInfoEditor() {
  const [data, setData] = useState<ContactInfoData>(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/contact-info');
      if (res.ok) {
        const json = await res.json();
        setData({
          phone: json.phone ?? '',
          linkedin: json.linkedin ?? '',
          github: json.github ?? '',
          lastCompany: json.lastCompany ?? '',
          university: json.university ?? '',
        });
      }
    } catch {
      setError('Failed to load contact info.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/contact-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        setSuccess('Contact info saved.');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(json.error || 'Failed to save.');
      }
    } catch {
      setError('Failed to save contact info.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse text-gray-500">Loading contact info...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Contact &amp; Profile Info</h2>
      <p className="text-sm text-gray-600 mb-4">
        This info is shown on the user page as copy-to-clipboard buttons.
      </p>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            placeholder="+1 234 567 8900"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
          <input
            type="url"
            value={data.linkedin}
            onChange={(e) => setData({ ...data, linkedin: e.target.value })}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
          <input
            type="url"
            value={data.github}
            onChange={(e) => setData({ ...data, github: e.target.value })}
            placeholder="https://github.com/username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Company</label>
          <input
            type="text"
            value={data.lastCompany}
            onChange={(e) => setData({ ...data, lastCompany: e.target.value })}
            placeholder="Company name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
          <input
            type="text"
            value={data.university}
            onChange={(e) => setData({ ...data, university: e.target.value })}
            placeholder="University name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {saving ? 'Saving...' : 'Save Contact Info'}
        </button>
      </div>
    </div>
  );
}
