import { PDFPage, rgb } from 'pdf-lib';
import { TemplateContext, wrapText, wrapTextWithIndent, formatDate, drawTextWithBold, COLORS, SPACING } from '../utils';

// TEMPLATE 5: CONTEMPORARY - Modern single-column with subtle color accent
export async function renderTemplate5(context: TemplateContext): Promise<Uint8Array> {
  const { pdfDoc, font, fontBold, name, email, phone, location, body, PAGE_WIDTH, PAGE_HEIGHT } = context;
  let { page } = context;
  
  const BLACK = COLORS.BLACK;
  const DARK_SLATE = rgb(0.25, 0.28, 0.32);
  const ACCENT_COLOR = rgb(0.4, 0.48, 0.55); // Muted blue-gray
  const MEDIUM_GRAY = rgb(0.45, 0.45, 0.45);
  
  // Layout settings
  const MARGIN_LEFT = 50;
  const MARGIN_RIGHT = 50;
  const MARGIN_TOP = 50;
  const MARGIN_BOTTOM = 48;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  
  // Typography settings
  const NAME_SIZE = 24;
  const CONTACT_SIZE = 9;
  const SECTION_HEADER_SIZE = 11;
  const JOB_TITLE_SIZE = 10;
  const BODY_SIZE = 9.5;
  const BULLET_LINE_HEIGHT = BODY_SIZE * SPACING.BULLET_LINE_HEIGHT;
  
  // Helper to draw top accent
  const drawTopAccent = (p: PDFPage) => {
    p.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 6,
      width: PAGE_WIDTH,
      height: 6,
      color: ACCENT_COLOR
    });
  };
  
  drawTopAccent(page);
  let y = PAGE_HEIGHT - MARGIN_TOP - 10;
  
  // === HEADER SECTION ===
  // Name
  if (name) {
    page.drawText(name, { x: MARGIN_LEFT, y, size: NAME_SIZE, font: fontBold, color: DARK_SLATE });
    y -= NAME_SIZE + 8;
  }
  
  // Contact info with separator dots
  const contactParts = [location, phone, email].filter(Boolean);
  if (contactParts.length > 0) {
    const contactLine = contactParts.join('   •   ');
    page.drawText(contactLine, { x: MARGIN_LEFT, y, size: CONTACT_SIZE, font, color: MEDIUM_GRAY });
    y -= CONTACT_SIZE + 6;
  }
  
  // Accent underline
  page.drawLine({
    start: { x: MARGIN_LEFT, y },
    end: { x: MARGIN_LEFT + 120, y },
    thickness: 2.5,
    color: ACCENT_COLOR
  });
  y -= 20;
  
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
        drawTopAccent(page);
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
      
      page.drawText(sectionHeader, { x: MARGIN_LEFT, y, size: SECTION_HEADER_SIZE, font: fontBold, color: DARK_SLATE });
      y -= 4;
      
      // Section underline
      page.drawLine({
        start: { x: MARGIN_LEFT, y },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y },
        thickness: 1,
        color: ACCENT_COLOR
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
        drawTopAccent(page);
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
        drawTopAccent(page);
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
