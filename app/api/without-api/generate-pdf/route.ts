import { NextRequest, NextResponse } from 'next/server';
import { getBaseResumeByName } from '@/app/data/db';
import { parseWithoutApiProfileContent, type ResumeContent } from '@/app/utils/profilePrompt';
import { extractJsonObjectString, parseResumeJsonString, detectTruncatedPaste, validateResumeShape } from '@/app/utils/resumeJson';
import { buildResumePdfData, pdfAttachmentFilename } from '@/app/utils/profileUtils';
import {
  getWithoutApiTemplateId,
  getWithoutApiTemplateLabel,
  ALL_TEMPLATES_VALUE,
  ALL_TEMPLATE_NUMBERS,
} from '@/app/utils/pdfTemplateMapping';
import { renderPdfBuffer } from '@/app/utils/pdfRender';
import { getTemplate } from '@/app/lib/pdf-templates';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profileName = typeof body?.profile === 'string' ? body.profile.trim() : '';
    const rawResponse = typeof body?.llmResponse === 'string' ? body.llmResponse : '';
    const companyName = typeof body?.companyName === 'string' ? body.companyName.trim() : null;
    // Optional per-request template override. The "All Templates" UI option asks
    // the client to loop over every template, sending one of these per request.
    const templateOverride = Number.isInteger(body?.template) ? Number(body.template) : null;

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
    const truncationError = detectTruncatedPaste(rawResponse, jsonStr);
    if (truncationError) {
      return NextResponse.json({ error: truncationError }, { status: 400 });
    }

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

    const shape = validateResumeShape(parsed.data, profileData.experience.length);
    if (!shape.ok) {
      return NextResponse.json({ error: shape.reason }, { status: 400 });
    }

    const resumeContent = parsed.data as unknown as ResumeContent;

    // Resolve which template to render: an explicit per-request override wins,
    // otherwise fall back to the profile's configured template.
    const selectedTemplate = templateOverride ?? (profile.pdfTemplate || 1);

    // "All Templates" with no specific override: the input is already validated,
    // so hand the client the list of templates to fetch one-by-one.
    if (selectedTemplate === ALL_TEMPLATES_VALUE) {
      return NextResponse.json({
        mode: 'all-templates',
        templates: ALL_TEMPLATE_NUMBERS.map((n) => ({ value: n, label: getWithoutApiTemplateLabel(n) })),
      });
    }

    const templateName = getWithoutApiTemplateId(selectedTemplate);
    const TemplateComponent = getTemplate(templateName);
    if (!TemplateComponent) {
      return NextResponse.json({ error: `Template "${templateName}" not found` }, { status: 404 });
    }

    const templateData = buildResumePdfData(profileData, resumeContent, profile.photo);
    const pdfBuffer = await renderPdfBuffer(TemplateComponent, templateData);
    // Tag the filename with the template number when one resume per template is
    // being produced, so the downloads don't overwrite each other.
    const fileName = pdfAttachmentFilename(
      profileData.name,
      companyName,
      templateOverride ? `Template-${selectedTemplate}` : null
    );

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
