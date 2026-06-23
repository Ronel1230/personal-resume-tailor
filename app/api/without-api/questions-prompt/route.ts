import { NextRequest, NextResponse } from 'next/server';
import { getBaseResumeByName } from '@/app/data/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profileName = typeof body?.profile === 'string' ? body.profile.trim() : '';
    const jd = typeof body?.jd === 'string' ? body.jd.trim() : '';
    const questions = typeof body?.questions === 'string' ? body.questions.trim() : '';

    if (!profileName) {
      return NextResponse.json({ error: 'Profile is required' }, { status: 400 });
    }
    if (!jd) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }
    if (!questions) {
      return NextResponse.json({ error: 'Questions are required' }, { status: 400 });
    }

    const profile = await getBaseResumeByName(profileName);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const prompt = `Please give me short humanized and impactful answers for questions below:

Job Description: ${jd}
Resume: ${profile.resumeText}

Questions: ${questions}`;

    return NextResponse.json({ prompt });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to build questions prompt', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
