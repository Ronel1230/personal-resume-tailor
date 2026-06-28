import { NextRequest, NextResponse } from 'next/server';
import { getBaseResumeByName } from '@/app/data/db';
import { buildManualPrompt, parseWithoutApiProfileContent } from '@/app/utils/profilePrompt';
import { DEFAULT_WITHOUT_API_PROMPT } from '@/app/utils/defaultWithoutApiPrompt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profileName = typeof body?.profile === 'string' ? body.profile.trim() : '';
    const jd = typeof body?.jd === 'string' ? body.jd.trim() : '';

    if (!profileName) {
      return NextResponse.json({ error: 'Profile is required' }, { status: 400 });
    }
    if (!jd) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }

    const profile = await getBaseResumeByName(profileName);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const profileData = parseWithoutApiProfileContent(profile.withoutApiProfileContent);
    if (!profileData) {
      return NextResponse.json(
        { error: 'Without API profile content is not configured for this profile' },
        { status: 400 }
      );
    }

    const promptTemplate = profile.withoutApiPrompt || DEFAULT_WITHOUT_API_PROMPT;
    const prompt = buildManualPrompt(profileData, jd, promptTemplate);

    return NextResponse.json({ prompt });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to build prompt', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
