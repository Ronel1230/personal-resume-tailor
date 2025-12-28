import { PDFPage, rgb } from 'pdf-lib';
import { TemplateContext, wrapText, wrapTextWithIndent, formatDate, drawTextWithBold, COLORS, SPACING } from '../utils';

// TEMPLATE 4: EXECUTIVE - Professional single-column with distinguished styling
export async function renderTemplate4(context: TemplateContext): Promise<Uint8Array> {
  const { pdfDoc, font, fontBold, name, email, phone, location, body, PAGE_WIDTH, PAGE_HEIGHT } = context;
  let { page } = context;
  
  const BLACK = COLORS.BLACK;
  const CHARCOAL = rgb(0.2, 0.2, 0.22);
  const STEEL_BLUE = rgb(0.28, 0.38, 0.5);
  const MEDIUM_GRAY = rgb(0.42, 0.42, 0.42);
  
  // Layout settings
  const MARGIN_LEFT = 56;
  const MARGIN_RIGHT = 56;
  const MARGIN_TOP = 52;
  const MARGIN_BOTTOM = 50;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  
  // Typography settings
  const NAME_SIZE = 22;
  const CONTACT_SIZE = 9;
  const SECTION_HEADER_SIZE = 10.5;
  const JOB_TITLE_SIZE = 10;
  const BODY_SIZE = 9.5;
  const BULLET_LINE_HEIGHT = BODY_SIZE * SPACING.BULLET_LINE_HEIGHT;
  
  let y = PAGE_HEIGHT - MARGIN_TOP;
  
  // === HEADER SECTION ===
  // Top accent line
  page.drawLine({
    start: { x: MARGIN_LEFT, y: PAGE_HEIGHT - 40 },
    end: { x: PAGE_WIDTH - MARGIN_RIGHT, y: PAGE_HEIGHT - 40 },
    thickness: 2,
    color: STEEL_BLUE
  });
  
  // Name - centered, distinguished
  if (name) {
    const nameWidth = fontBold.widthOfTextAtSize(name.toUpperCase(), NAME_SIZE);
    const nameX = (PAGE_WIDTH - nameWidth) / 2;
    page.drawText(name.toUpperCase(), { x: nameX, y, size: NAME_SIZE, font: fontBold, color: CHARCOAL });
    y -= NAME_SIZE + 8;
  }
  
  // Contact info - centered
  const contactParts = [location, phone, email].filter(Boolean);
  if (contactParts.length > 0) {
    const contactLine = contactParts.join('   |   ');
    const contactWidth = font.widthOfTextAtSize(contactLine, CONTACT_SIZE);
    const contactX = (PAGE_WIDTH - contactWidth) / 2;
    page.drawText(contactLine, { x: contactX, y, size: CONTACT_SIZE, font, color: MEDIUM_GRAY });
    y -= CONTACT_SIZE + 10;
  }
  
  // Bottom accent line
  page.drawLine({
    start: { x: MARGIN_LEFT, y },
    end: { x: PAGE_WIDTH - MARGIN_RIGHT, y },
    thickness: 1,
    color: STEEL_BLUE
  });
  y -= 18;
  
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
      const sectionHeader = line.slice(0, -1).toUpperCase();
      
      if (y < MARGIN_BOTTOM + 40) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        context.page = page;
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
      
      page.drawText(sectionHeader, { x: MARGIN_LEFT, y, size: SECTION_HEADER_SIZE, font: fontBold, color: STEEL_BLUE });
      y -= SPACING.AFTER_SECTION_HEADER + 2;
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
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
      
      // Job title
      page.drawText(jobTitle.trim(), { x: MARGIN_LEFT, y, size: JOB_TITLE_SIZE, font: fontBold, color: CHARCOAL });
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
      drawTextWithBold(page, wrapped.lines[j], xPos, y, font, fontBold, BODY_SIZE, BLACK);
      y -= BULLET_LINE_HEIGHT;
    }
    
    if (wrapped.hasBullet) {
      y -= 1;
    }
  }
  
  return await pdfDoc.save();
}
