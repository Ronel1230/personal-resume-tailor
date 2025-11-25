import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { getBaseResumeByName } from '@/app/data/db';
import { buildPrompt } from '@/app/utils/promptBuilder';
import { parseResume, TemplateContext } from './utils';
import { renderTemplate1 } from './templates/template1';
import { renderTemplate2 } from './templates/template2';
import { renderTemplate3 } from './templates/template3';
import { renderTemplate4 } from './templates/template4';
import { renderTemplate5 } from './templates/template5';

// Template router - routes to appropriate template renderer
async function generateResumePdf(resumeText: string, template: number = 1): Promise<Uint8Array> {
  const parsed = parseResume(resumeText);
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const context: TemplateContext = {
    pdfDoc,
    page,
    font,
    fontBold,
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone,
    location: parsed.location,
    body: parsed.body,
    PAGE_WIDTH: 595,
    PAGE_HEIGHT: 842
  };

  // Route to appropriate template
  switch (template) {
    case 1:
      return await renderTemplate1(context);
    case 2:
      return await renderTemplate2(context);
    case 3:
      return await renderTemplate3(context);
    case 4:
      return await renderTemplate4(context);
    case 5:
      return await renderTemplate5(context);
    default:
      return await renderTemplate1(context);
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Parse form data
    const formData = await req.formData();
    const jobDescription = formData.get('job_description') as string;
    const company = formData.get('company') as string;
    const role = formData.get('role') as string;
    const baseResumeProfile = formData.get('base_resume_profile') as string | null;

    // Validate required fields
    if (!jobDescription || !company || !role) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields: job_description, company, role' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Load base resume based on selected profile, fallback to default embedded
    const profile = await getBaseResumeByName(baseResumeProfile);
    const baseResume: string = profile?.resumeText || ``;
    const customPrompt = profile?.customPrompt;
    const pdfTemplate = profile?.pdfTemplate || 1;
    
    // 3. Tailor resume with OpenAI
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = buildPrompt(baseResume, jobDescription, customPrompt);

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_VERSION || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for creating professional resume content.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 7000
    });

    const tailoredResume = completion.choices[0].message.content || '';

    if (!tailoredResume) {
      return new NextResponse(
        JSON.stringify({ error: 'Failed to generate tailored resume content' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Generate PDF with template
    const pdfBytes = await generateResumePdf(tailoredResume, pdfTemplate);

    // 5. Return PDF as response
    const fileBase = `${(baseResumeProfile && baseResumeProfile.replace(/[^a-zA-Z0-9_]/g, '_'))}_${company.replace(/[^a-zA-Z0-9_]/g, '_')}_${role.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileBase}.pdf"`
      }
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
