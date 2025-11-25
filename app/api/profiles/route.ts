import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all profiles (public endpoint for client-side use)
export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: { name: 'asc' },
      select: {
        name: true,
        resumeText: true,
        customPrompt: true,
        pdfTemplate: true,
      },
    });
    return NextResponse.json({ profiles });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read profiles', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

