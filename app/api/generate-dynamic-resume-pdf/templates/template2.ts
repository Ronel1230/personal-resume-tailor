import { PDFPage, rgb } from 'pdf-lib';
import { TemplateContext, wrapText, wrapTextWithIndent, formatDate, drawTextWithBold, COLORS, SPACING } from '../utils';

// TEMPLATE 2: MODERN - Clean layout with teal accent bar
export async function renderTemplate2(context: TemplateContext): Promise<Uint8Array> {
  const { pdfDoc, font, fontBold, name, email, phone, location, body, PAGE_WIDTH, PAGE_HEIGHT } = context;
  let { page } = context;
  
  const BLACK = COLORS.BLACK;
  const MEDIUM_GRAY = COLORS.MEDIUM_GRAY;
  const TEAL = rgb(0.18, 0.48, 0.48);
  
  // Layout settings
  const ACCENT_WIDTH = 5;
  const MARGIN_LEFT = 52;
  const MARGIN_RIGHT = 52;
  const MARGIN_TOP = 48;
  const MARGIN_BOTTOM = 48;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  
  // Typography settings
  const NAME_SIZE = 24;
  const CONTACT_SIZE = 9;
  const SECTION_HEADER_SIZE = 11;
  const JOB_TITLE_SIZE = 10;
  const BODY_SIZE = 9.5;
  const BULLET_LINE_HEIGHT = BODY_SIZE * SPACING.BULLET_LINE_HEIGHT;
  
  // Helper to draw accent bar
  const drawAccentBar = (p: PDFPage) => {
    p.drawRectangle({
      x: 0,
      y: 0,
      width: ACCENT_WIDTH,
      height: PAGE_HEIGHT,
      color: TEAL
    });
  };
  
  drawAccentBar(page);
  let y = PAGE_HEIGHT - MARGIN_TOP;
  
  // === HEADER SECTION ===
  // Name
  if (name) {
    page.drawText(name, { x: MARGIN_LEFT, y, size: NAME_SIZE, font: fontBold, color: BLACK });
    y -= NAME_SIZE + 10;
  }
  
  // Contact info
  const contactParts = [location, phone, email].filter(Boolean);
  if (contactParts.length > 0) {
    const contactLine = contactParts.join('   •   ');
    page.drawText(contactLine, { x: MARGIN_LEFT, y, size: CONTACT_SIZE, font, color: MEDIUM_GRAY });
    y -= CONTACT_SIZE + 16;
  }
  
  // === BODY CONTENT ===
  const bodyLines = body.split('\n');
  let isFirstJob = true;
  
  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i].trim();
    
    if (!line) {
      y -= 4;
      continue;
    }
    
    // Section header
    if (line.endsWith(':')) {
      y -= SPACING.SECTION_GAP;
      const sectionHeader = line.slice(0, -1);
      
      if (y < MARGIN_BOTTOM + 40) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        context.page = page;
        drawAccentBar(page);
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
      
      page.drawText(sectionHeader, { x: MARGIN_LEFT, y, size: SECTION_HEADER_SIZE, font: fontBold, color: BLACK });
      y -= 5;
      
      // Teal underline
      page.drawLine({
        start: { x: MARGIN_LEFT, y },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y },
        thickness: 1.5,
        color: TEAL
      });
      y -= SPACING.AFTER_SECTION_HEADER;
      isFirstJob = true;
      continue;
    }
    
    // Job experience
    const jobMatch = line.match(/^(.+?) at (.+?):\s*(.+)$/);
    if (jobMatch) {
      const [, jobTitle, companyName, period] = jobMatch;
      
      if (!isFirstJob) {
        y -= SPACING.JOB_GAP;
      }
      isFirstJob = false;
      
      if (y < MARGIN_BOTTOM + 60) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        context.page = page;
        drawAccentBar(page);
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
      
      // Job title
      page.drawText(jobTitle.trim(), { x: MARGIN_LEFT, y, size: JOB_TITLE_SIZE, font: fontBold, color: BLACK });
      y -= JOB_TITLE_SIZE + SPACING.AFTER_JOB_TITLE;
      
      // Company | Period
      const formattedPeriod = formatDate(period.trim());
      const companyLine = `${companyName.trim()}  |  ${formattedPeriod}`;
      page.drawText(companyLine, { x: MARGIN_LEFT, y, size: BODY_SIZE, font, color: MEDIUM_GRAY });
      y -= BODY_SIZE + SPACING.AFTER_COMPANY;
      continue;
    }
    
    // Bullet points
    const wrapped = wrapTextWithIndent(line, font, BODY_SIZE, CONTENT_WIDTH);
    
    for (let j = 0; j < wrapped.lines.length; j++) {
      if (y < MARGIN_BOTTOM) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        context.page = page;
        drawAccentBar(page);
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
      
      const xPos = j === 0 ? MARGIN_LEFT : MARGIN_LEFT + wrapped.indentWidth;
      drawTextWithBold(page, wrapped.lines[j], xPos, y, font, fontBold, BODY_SIZE, BLACK);
      y -= BULLET_LINE_HEIGHT;
    }
    
    if (wrapped.hasBullet) {
      y -= 1;
    }
  }
  
  return await pdfDoc.save();
}
