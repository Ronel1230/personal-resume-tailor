import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { nameToFilename } from '@/app/data/baseResumes';

// Helper to verify admin session
function isAuthenticated(req: NextRequest): boolean {
  const sessionToken = req.cookies.get('admin_session');
  return !!sessionToken;
}

// Get the path to profiles directory
function getProfilesDirectory(): string {
  return join(process.cwd(), 'app', 'data', 'profiles');
}

// Get the path to a specific profile file
function getProfileFilePath(filename: string): string {
  return join(getProfilesDirectory(), `${filename}.ts`);
}

// Get the path to baseResumes.ts
function getBaseResumesFilePath(): string {
  return join(process.cwd(), 'app', 'data', 'baseResumes.ts');
}

// Read all profiles from individual files
async function readProfiles() {
  // Import from baseResumes which aggregates all profiles
  const { baseResumes } = await import('@/app/data/baseResumes');
  return baseResumes;
}

// Write a single profile to its own file
async function writeProfileFile(profile: any) {
  const filename = nameToFilename(profile.name);
  const filePath = getProfileFilePath(filename);
  
  // Escape template literals
  const escapeTemplateLiteral = (str: string) => {
    return str
      .replace(/\\/g, '\\\\')  // Escape backslashes first
      .replace(/`/g, '\\`')     // Escape backticks
      .replace(/\${/g, '\\${'); // Escape template expressions
  };
  
  const resumeText = escapeTemplateLiteral(profile.resumeText);
  const customPrompt = profile.customPrompt ? escapeTemplateLiteral(profile.customPrompt) : '';
  
  let fileContent = `import { BaseResumeProfile } from '../baseResumes';

export const profile: BaseResumeProfile = {
  name: ${JSON.stringify(profile.name)},
  resumeText: \`${resumeText}\``;
  
  if (customPrompt) {
    fileContent += `,
  customPrompt: \`${customPrompt}\``;
  }
  
  if (profile.pdfTemplate && profile.pdfTemplate !== 1) {
    fileContent += `,
  pdfTemplate: ${profile.pdfTemplate}`;
  }
  
  fileContent += `
};
`;
  
  await writeFile(filePath, fileContent, 'utf-8');
}

// Delete a profile file
async function deleteProfileFile(name: string) {
  const filename = nameToFilename(name);
  const filePath = getProfileFilePath(filename);
  try {
    await unlink(filePath);
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

// Update baseResumes.ts to import all profile files
async function updateBaseResumesFile() {
  const profilesDir = getProfilesDirectory();
  const files = await readdir(profilesDir);
  const profileFiles = files.filter(f => f.endsWith('.ts') && f !== 'index.ts');
  
  // Generate import statements
  const imports = profileFiles.map(file => {
    const filename = file.replace(/\.ts$/, '');
    const importName = filename.split('-').map((word, i) => 
      i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    return `import { profile as ${importName} } from './profiles/${filename}';`;
  }).join('\n');
  
  // Generate array entries
  const arrayEntries = profileFiles.map(file => {
    const filename = file.replace(/\.ts$/, '');
    const importName = filename.split('-').map((word, i) => 
      i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    return `  ${importName},`;
  }).join('\n');
  
  const baseResumesContent = `export type BaseResumeProfile = {
  name: string; // profile display name used as the select value
  resumeText: string; // full plain-text resume template
  customPrompt?: string; // optional custom prompt for this profile
  pdfTemplate?: number; // PDF template identifier (e.g., 'default', 'modern', 'classic')
};

// Import all profiles from individual files
${imports}

// Aggregate all profiles from individual files
export const baseResumes: BaseResumeProfile[] = [
${arrayEntries}
];

export function getBaseResumeByName(name: string | null | undefined): BaseResumeProfile | null {
  if (!name) return null;
  const profile = baseResumes.find(p => p.name === name);
  return profile || null;
}

// Helper function to convert profile name to filename (slug)
export function nameToFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to convert filename to profile name (reverse slug)
export function filenameToName(filename: string): string {
  // Remove .ts extension if present
  const nameWithoutExt = filename.replace(/\.ts$/, '');
  // Convert kebab-case to Title Case
  return nameWithoutExt
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
`;
  
  await writeFile(getBaseResumesFilePath(), baseResumesContent, 'utf-8');
}

// GET - Fetch all profiles
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profiles = await readProfiles();
    return NextResponse.json({ profiles });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read profiles' },
      { status: 500 }
    );
  }
}

// POST - Create new profile
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, resumeText, customPrompt, pdfTemplate } = await req.json();
    
    if (!name || !resumeText) {
      return NextResponse.json(
        { error: 'Name and resumeText are required' },
        { status: 400 }
      );
    }

    const profiles = await readProfiles();
    
    // Check if profile with same name exists
    if (profiles.find(p => p.name === name)) {
      return NextResponse.json(
        { error: 'Profile with this name already exists' },
        { status: 400 }
      );
    }

    const newProfile = { 
      name, 
      resumeText, 
      customPrompt: customPrompt || undefined,
      pdfTemplate: pdfTemplate || 1
    };
    
    // Write the new profile file
    await writeProfileFile(newProfile);
    
    // Update baseResumes.ts to include the new profile
    await updateBaseResumesFile();

    return NextResponse.json({ success: true, profile: newProfile });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create profile', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Update existing profile
export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { oldName, name, resumeText, customPrompt, pdfTemplate } = await req.json();
    
    if (!oldName || !name || !resumeText) {
      return NextResponse.json(
        { error: 'oldName, name, and resumeText are required' },
        { status: 400 }
      );
    }

    const profiles = await readProfiles();
    
    if (!profiles.find(p => p.name === oldName)) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // If name changed, check for conflicts
    if (oldName !== name && profiles.find(p => p.name === name)) {
      return NextResponse.json(
        { error: 'Profile with this name already exists' },
        { status: 400 }
      );
    }

    const updatedProfile = { 
      name, 
      resumeText, 
      customPrompt: customPrompt || undefined,
      pdfTemplate: pdfTemplate || 1
    };
    
    // If name changed, delete old file and create new one
    if (oldName !== name) {
      await deleteProfileFile(oldName);
    }
    
    // Write/update the profile file
    await writeProfileFile(updatedProfile);
    
    // Update baseResumes.ts to reflect changes
    await updateBaseResumesFile();

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove profile
export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    
    if (!name) {
      return NextResponse.json(
        { error: 'Profile name is required' },
        { status: 400 }
      );
    }

    const profiles = await readProfiles();
    
    if (!profiles.find(p => p.name === name)) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Delete the profile file
    await deleteProfileFile(name);
    
    // Update baseResumes.ts to remove the profile import
    await updateBaseResumesFile();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete profile', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

