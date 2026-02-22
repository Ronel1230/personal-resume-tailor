import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Slug from display name: "Adam Smith" -> "adam-smith"
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// POST - Validate profile by slug/name without exposing the full list
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = typeof body?.profile === 'string' ? body.profile.trim() : '';
    if (!input) {
      return NextResponse.json(
        { error: 'Profile is required' },
        { status: 400 }
      );
    }

    const inputSlug = nameToSlug(input);

    const profiles = await prisma.profile.findMany({
      select: { name: true },
    });

    const match = profiles.find(
      (p) => nameToSlug(p.name) === inputSlug
    );

    if (!match) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ name: match.name });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
