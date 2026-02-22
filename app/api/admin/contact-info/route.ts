import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const CONTACT_INFO_ID = 'default';

function isAuthenticated(req: NextRequest): boolean {
  const sessionToken = req.cookies.get('admin_session');
  return !!sessionToken;
}

// GET - Fetch contact info (admin)
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let contact = await prisma.contactInfo.findUnique({
      where: { id: CONTACT_INFO_ID },
    });
    if (!contact) {
      contact = await prisma.contactInfo.create({
        data: {
          id: CONTACT_INFO_ID,
          phone: null,
          linkedin: null,
          github: null,
          lastCompany: null,
          university: null,
        },
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

// PUT - Update contact info (admin)
export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { phone, linkedin, github, lastCompany, university } = await req.json();

    const contact = await prisma.contactInfo.upsert({
      where: { id: CONTACT_INFO_ID },
      create: {
        id: CONTACT_INFO_ID,
        phone: phone ?? null,
        linkedin: linkedin ?? null,
        github: github ?? null,
        lastCompany: lastCompany ?? null,
        university: university ?? null,
      },
      update: {
        phone: phone ?? null,
        linkedin: linkedin ?? null,
        github: github ?? null,
        lastCompany: lastCompany ?? null,
        university: university ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      contact: {
        phone: contact.phone ?? '',
        linkedin: contact.linkedin ?? '',
        github: contact.github ?? '',
        lastCompany: contact.lastCompany ?? '',
        university: contact.university ?? '',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update contact info', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
