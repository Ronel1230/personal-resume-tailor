import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const CONTACT_INFO_ID = 'default';

// GET - Fetch contact info (public, for user page copy buttons)
export async function GET() {
  try {
    const contact = await prisma.contactInfo.findUnique({
      where: { id: CONTACT_INFO_ID },
    });
    if (!contact) {
      return NextResponse.json({
        phone: '',
        linkedin: '',
        github: '',
        lastCompany: '',
        university: '',
      });
    }
    return NextResponse.json({
      phone: contact.phone ?? '',
      linkedin: contact.linkedin ?? '',
      github: contact.github ?? '',
      lastCompany: contact.lastCompany ?? '',
      university: contact.university ?? '',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read contact info', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
