import { PDFPage, rgb } from 'pdf-lib';
import { TemplateContext, wrapText, wrapBulletText, formatDate, drawTextWithBold, COLORS, SPACING } from '../utils';

// TEMPLATE 2: ACCENT BAR - Navy left accent bar
export async function renderTemplate2(context: TemplateContext): Promise<Uint8Array> {
  const { pdfDoc, font, fontBold, name, email, phone, location, body, PAGE_WIDTH, PAGE_HEIGHT } = context;
  let { page } = context;
  
  const BLACK = COLORS.BLACK;
  const MEDIUM_GRAY = COLORS.MEDIUM_GRAY;
  const NAVY = rgb(0.15, 0.22, 0.35); // Changed to navy blue
  
  // Layout
  const ACCENT_WIDTH = 5;
  const MARGIN_LEFT = 50;
  const MARGIN_RIGHT = 50;
  const MARGIN_TOP = 48;
  const MARGIN_BOTTOM = 48;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  
  // Typography
  const NAME_SIZE = 24;
  const CONTACT_SIZE = 9;
  const SECTION_SIZE = 11;
  const JOB_TITLE_SIZE = 10;
  const BODY_SIZE = 9.5;
  const LINE_HEIGHT = BODY_SIZE * SPACING.BULLET_LINE_HEIGHT;
  
  const drawAccent = (p: PDFPage) => {
    p.drawRectangle({ x: 0, y: 0, width: ACCENT_WIDTH, height: PAGE_HEIGHT, color: NAVY });
  };
  
  drawAccent(page);
  let y = PAGE_HEIGHT - MARGIN_TOP;
  
  // === HEADER ===
  if (name) {
    page.drawText(name, { x: MARGIN_LEFT, y, size: NAME_SIZE, font: fontBold, color: BLACK });
    y -= NAME_SIZE + 8;
  }
  
  const contactParts = [location, phone, email].filter(Boolean);
  if (contactParts.length > 0) {
    page.drawText(contactParts.join('   |   '), { x: MARGIN_LEFT, y, size: CONTACT_SIZE, font, color: MEDIUM_GRAY });
    y -= CONTACT_SIZE + 16;
  }
  
  // === BODY ===
  const bodyLines = body.split('\n');
  let isFirstJob = true;
  let isFirstBulletAfterJob = false;
  
  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i].trim();
    
    if (!line) {
      y -= 3;
      continue;
    }
    
    // Section header
    if (line.endsWith(':')) {
      y -= SPACING.SECTION_GAP;
      
      if (y < MARGIN_BOTTOM + 50) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        context.page = page;
        drawAccent(page);
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
      
      const sectionName = line.slice(0, -1);
      page.drawText(sectionName, { x: MARGIN_LEFT, y, size: SECTION_SIZE, font: fontBold, color: BLACK });
      y -= 4;
      page.drawLine({
        start: { x: MARGIN_LEFT, y },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y },
        thickness: 1.5,
        color: NAVY
      });
      y -= SPACING.AFTER_SECTION_HEADER;
      isFirstJob = true;
      isFirstBulletAfterJob = false;
      continue;
    }
    
    // Job line
    const jobMatch = line.match(/^(.+?) at (.+?):\s*(.+)$/);
    if (jobMatch) {
      const [, jobTitle, company, period] = jobMatch;
      
      if (!isFirstJob) y -= SPACING.JOB_GAP;
      isFirstJob = false;
      
      if (y < MARGIN_BOTTOM + 60) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        context.page = page;
        drawAccent(page);
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
      
      page.drawText(jobTitle.trim(), { x: MARGIN_LEFT, y, size: JOB_TITLE_SIZE, font: fontBold, color: BLACK });
      y -= JOB_TITLE_SIZE + 2;
      
      const periodFormatted = formatDate(period.trim());
      page.drawText(`${company.trim()}  |  ${periodFormatted}`, { x: MARGIN_LEFT, y, size: BODY_SIZE, font, color: MEDIUM_GRAY });
      y -= SPACING.AFTER_JOB_HEADER;
      isFirstBulletAfterJob = true;
      continue;
    }
    
    // Bullet
    const wrapped = wrapBulletText(line, font, BODY_SIZE, CONTENT_WIDTH);
    
    if (wrapped.hasBullet && isFirstBulletAfterJob) {
      y -= SPACING.BEFORE_FIRST_BULLET;
      isFirstBulletAfterJob = false;
    }
    
    for (const wline of wrapped.lines) {
      if (y < MARGIN_BOTTOM) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        context.page = page;
        drawAccent(page);
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
      
      drawTextWithBold(page, wline, MARGIN_LEFT, y, font, fontBold, BODY_SIZE, BLACK);
      y -= LINE_HEIGHT;
    }
    
    if (wrapped.hasBullet) y -= SPACING.BULLET_GAP;
  }
  
  return await pdfDoc.save();
}
