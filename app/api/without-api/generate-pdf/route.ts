import { NextRequest, NextResponse } from 'next/server';
import { getBaseResumeByName } from '@/app/data/db';
import { parseWithoutApiProfileContent, type ResumeContent } from '@/app/utils/profilePrompt';
import { extractJsonObjectString, parseResumeJsonString } from '@/app/utils/resumeJson';
import { buildResumePdfData, pdfAttachmentFilename } from '@/app/utils/profileUtils';
import { getWithoutApiTemplateId } from '@/app/utils/pdfTemplateMapping';
import { renderPdfBuffer } from '@/app/utils/pdfRender';
import { getTemplate } from '@/app/lib/pdf-templates';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profileName = typeof body?.profile === 'string' ? body.profile.trim() : '';
    const rawResponse = typeof body?.llmResponse === 'string' ? body.llmResponse : '';
    const companyName = typeof body?.companyName === 'string' ? body.companyName.trim() : null;

    if (!profileName) {
      return NextResponse.json({ error: 'Profile is required' }, { status: 400 });
    }
    if (!rawResponse.trim()) {
      return NextResponse.json({ error: 'LLM response (JSON) is required' }, { status: 400 });
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

    const jsonStr = extractJsonObjectString(rawResponse);
    const parsed = parseResumeJsonString(jsonStr);
    if (!parsed.ok) {
      return NextResponse.json(
        {
          error:
            `Invalid JSON: ${parsed.error}. Often: unescaped double-quotes in a bullet, ` +
            'a line break inside a string, or a truncated copy.',
        },
        { status: 400 }
      );
    }

    const resumeContent = parsed.data as unknown as ResumeContent;
    if (!resumeContent.title || !resumeContent.summary || !resumeContent.skills || !resumeContent.experience) {
      return NextResponse.json(
        { error: 'JSON must include title, summary, skills, and experience.' },
        { status: 400 }
      );
    }

    const templateName = getWithoutApiTemplateId(profile.pdfTemplate || 1);
    const TemplateComponent = getTemplate(templateName);
    if (!TemplateComponent) {
      return NextResponse.json({ error: `Template "${templateName}" not found` }, { status: 404 });
    }

    const templateData = buildResumePdfData(profileData, resumeContent);
    const pdfBuffer = await renderPdfBuffer(TemplateComponent, templateData);
    const fileName = pdfAttachmentFilename(profileData.name, companyName);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'PDF generation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
