import { NextRequest, NextResponse } from 'next/server';
import { getBaseResumeByName } from '@/app/data/db';
import { parseWithoutApiProfileContent } from '@/app/utils/profilePrompt';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const profileName = searchParams.get('profile');
    if (!profileName) {
      return NextResponse.json(
        { error: 'Profile name is required (query param: profile)' },
        { status: 400 }
      );
    }

    const profile = await getBaseResumeByName(profileName);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profileData = parseWithoutApiProfileContent(profile.withoutApiProfileContent);
    if (!profileData) {
      return NextResponse.json(
        { error: 'Without API profile content is not configured for this profile' },
        { status: 404 }
      );
    }

    return NextResponse.json(profileData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read profile data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
