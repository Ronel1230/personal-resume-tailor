// Type definition for BaseResumeProfile
// Note: Profiles are now stored in the database and accessed via API or db.ts helpers
export type BaseResumeProfile = {
  name: string; // profile display name used as the select value
  resumeText: string; // full plain-text resume template
  customPrompt?: string; // optional custom prompt for this profile
  pdfTemplate?: number; // PDF template identifier (e.g., 'default', 'modern', 'classic')
};

// Import all profiles from individual files (used only for seeding)
import { profile as christianCarrasco } from './profiles/christian-carrasco';
import { profile as edwinRivera } from './profiles/edwin-rivera';
import { profile as markWlodawski } from './profiles/mark-wlodawski';
import { profile as samuelWlodawski } from './profiles/samuel-wlodawski';
import { profile as sergiArcusa } from './profiles/sergi-arcusa';
import { profile as stephenPoserina } from './profiles/stephen-poserina';
import { profile as venuYara } from './profiles/venu-yara';

// Aggregate all profiles from individual files (used only for seeding)
// This is kept temporarily for the seed script migration
export const baseResumes: BaseResumeProfile[] = [
  christianCarrasco,
  edwinRivera,
  markWlodawski,
  samuelWlodawski,
  sergiArcusa,
  stephenPoserina,
  venuYara,
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
