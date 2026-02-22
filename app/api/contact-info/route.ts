import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch contact info for a profile by name (public, for user page copy buttons)
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

    const profile = await prisma.profile.findUnique({
      where: { name: profileName },
      select: { phone: true, linkedin: true, github: true, lastCompany: true, university: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      phone: profile.phone ?? '',
      linkedin: profile.linkedin ?? '',
      github: profile.github ?? '',
      lastCompany: profile.lastCompany ?? '',
      university: profile.university ?? '',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read contact info', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
