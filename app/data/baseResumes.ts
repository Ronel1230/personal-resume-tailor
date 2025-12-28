// Type definition for BaseResumeProfile
// Note: Profiles are now stored in the database and accessed via API or db.ts helpers
export type BaseResumeProfile = {
  name: string; // profile display name used as the select value
  resumeText: string; // full plain-text resume template
  customPrompt?: string; // optional custom prompt for this profile
  pdfTemplate?: number; // PDF template identifier (e.g., 'default', 'modern', 'classic')
};

// Import all profiles from individual files (used only for seeding)
import { profile as Adam_Smith } from './profiles/Adam_Smith';
import { profile as James_Johnson } from './profiles/James_Johnson';
import { profile as Michael_Kleinhandler } from './profiles/Michael_Kleinhandler';
import { profile as Daniel_Alfred } from './profiles/Daniel_Alfred';
import { profile as Vincent_Hueber } from './profiles/Vincent_Hueber';

// Aggregate all profiles from individual files (used only for seeding)
// This is kept temporarily for the seed script migration
export const baseResumes: BaseResumeProfile[] = [
  Adam_Smith,
  James_Johnson,
  Michael_Kleinhandler,
  Daniel_Alfred,
  Vincent_Hueber
];

// Helper function to convert profile name to filename (slug) - kept for backward compatibility
export function nameToFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to convert filename to profile name (reverse slug) - kept for backward compatibility
export function filenameToName(filename: string): string {
  // Remove .ts extension if present
  const nameWithoutExt = filename.replace(/\.ts$/, '');
  // Convert kebab-case to Title Case
  return nameWithoutExt
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
