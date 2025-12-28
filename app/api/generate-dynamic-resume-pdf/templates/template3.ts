import { PDFPage, rgb } from 'pdf-lib';
import { TemplateContext, wrapText, wrapTextWithIndent, formatDate, drawTextWithBold, COLORS, SPACING } from '../utils';

// TEMPLATE 3: MINIMALIST - Elegant simplicity with generous whitespace
export async function renderTemplate3(context: TemplateContext): Promise<Uint8Array> {
  const { pdfDoc, font, fontBold, name, email, phone, location, body, PAGE_WIDTH, PAGE_HEIGHT } = context;
  let { page } = context;
  
  const DARK_GRAY = rgb(0.22, 0.22, 0.22);
  const MEDIUM_GRAY = rgb(0.45, 0.45, 0.45);
  const LIGHT_GRAY = rgb(0.72, 0.72, 0.72);
  
  // Layout settings - generous margins
  const MARGIN_LEFT = 65;
  const MARGIN_RIGHT = 65;
  const MARGIN_TOP = 60;
  const MARGIN_BOTTOM = 55;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  
  // Typography settings
  const NAME_SIZE = 20;
  const CONTACT_SIZE = 8.5;
  const SECTION_HEADER_SIZE = 10;
  const JOB_TITLE_SIZE = 9.5;
  const BODY_SIZE = 9;
  const BULLET_LINE_HEIGHT = BODY_SIZE * SPACING.BULLET_LINE_HEIGHT;
  
  let y = PAGE_HEIGHT - MARGIN_TOP;
  
  // === HEADER SECTION ===
  // Name - elegant, understated
  if (name) {
    page.drawText(name, { x: MARGIN_LEFT, y, size: NAME_SIZE, font: fontBold, color: DARK_GRAY });
    y -= NAME_SIZE + 6;
  }
  
  // Contact info
  const contactParts = [location, phone, email].filter(Boolean);
  if (contactParts.length > 0) {
    const contactLine = contactParts.join('   •   ');
    page.drawText(contactLine, { x: MARGIN_LEFT, y, size: CONTACT_SIZE, font, color: MEDIUM_GRAY });
    y -= CONTACT_SIZE + 8;
  }
  
  // Subtle divider
  page.drawLine({
    start: { x: MARGIN_LEFT, y },
    end: { x: PAGE_WIDTH - MARGIN_RIGHT, y },
    thickness: 0.5,
    color: LIGHT_GRAY
  });
  y -= 22;
  
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
      y -= SPACING.SECTION_GAP + 2;
      const sectionHeader = line.slice(0, -1);
      
      if (y < MARGIN_BOTTOM + 40) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        context.page = page;
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
      
      page.drawText(sectionHeader, { x: MARGIN_LEFT, y, size: SECTION_HEADER_SIZE, font: fontBold, color: DARK_GRAY });
      y -= 4;
      
      // Very subtle underline
      page.drawLine({
        start: { x: MARGIN_LEFT, y },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y },
        thickness: 0.4,
        color: LIGHT_GRAY
      });
      y -= SPACING.AFTER_SECTION_HEADER + 2;
      isFirstJob = true;
      continue;
    }
    
    // Job experience
    const jobMatch = line.match(/^(.+?) at (.+?):\s*(.+)$/);
    if (jobMatch) {
      const [, jobTitle, companyName, period] = jobMatch;
      
      if (!isFirstJob) {
        y -= SPACING.JOB_GAP + 2;
      }
      isFirstJob = false;
      
      if (y < MARGIN_BOTTOM + 60) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        context.page = page;
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
      
      // Job title
      page.drawText(jobTitle.trim(), { x: MARGIN_LEFT, y, size: JOB_TITLE_SIZE, font: fontBold, color: DARK_GRAY });
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
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
      
      const xPos = j === 0 ? MARGIN_LEFT : MARGIN_LEFT + wrapped.indentWidth;
      drawTextWithBold(page, wrapped.lines[j], xPos, y, font, fontBold, BODY_SIZE, DARK_GRAY);
      y -= BULLET_LINE_HEIGHT;
    }
    
    if (wrapped.hasBullet) {
      y -= 1.5;
    }
  }
  
  return await pdfDoc.save();
}
