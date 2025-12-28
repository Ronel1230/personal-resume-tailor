import { PDFPage, rgb } from 'pdf-lib';
import { TemplateContext, wrapText, wrapBulletText, formatDate, drawTextWithBold, COLORS, SPACING } from '../utils';

// TEMPLATE 3: MINIMALIST - Clean and elegant with subtle grays
export async function renderTemplate3(context: TemplateContext): Promise<Uint8Array> {
  const { pdfDoc, font, fontBold, name, email, phone, location, body, PAGE_WIDTH, PAGE_HEIGHT } = context;
  let { page } = context;
  
  const DARK_GRAY = rgb(0.2, 0.2, 0.2);
  const MEDIUM_GRAY = rgb(0.45, 0.45, 0.45);
  const LIGHT_GRAY = rgb(0.7, 0.7, 0.7);
  
  // Layout - generous margins
  const MARGIN_LEFT = 60;
  const MARGIN_RIGHT = 60;
  const MARGIN_TOP = 55;
  const MARGIN_BOTTOM = 55;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  
  // Typography
  const NAME_SIZE = 20;
  const CONTACT_SIZE = 8.5;
  const SECTION_SIZE = 10;
  const JOB_TITLE_SIZE = 9.5;
  const BODY_SIZE = 9;
  const LINE_HEIGHT = BODY_SIZE * SPACING.BULLET_LINE_HEIGHT;
  
  let y = PAGE_HEIGHT - MARGIN_TOP;
  
  // === HEADER ===
  if (name) {
    page.drawText(name, { x: MARGIN_LEFT, y, size: NAME_SIZE, font: fontBold, color: DARK_GRAY });
    y -= NAME_SIZE + 5;
  }
  
  const contactParts = [location, phone, email].filter(Boolean);
  if (contactParts.length > 0) {
    page.drawText(contactParts.join('   •   '), { x: MARGIN_LEFT, y, size: CONTACT_SIZE, font, color: MEDIUM_GRAY });
    y -= CONTACT_SIZE + 6;
  }
  
  // Subtle divider
  page.drawLine({
    start: { x: MARGIN_LEFT, y },
    end: { x: PAGE_WIDTH - MARGIN_RIGHT, y },
    thickness: 0.5,
    color: LIGHT_GRAY
  });
  y -= 20;
  
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
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
      
      const sectionName = line.slice(0, -1);
      page.drawText(sectionName, { x: MARGIN_LEFT, y, size: SECTION_SIZE, font: fontBold, color: DARK_GRAY });
      y -= 4;
      page.drawLine({
        start: { x: MARGIN_LEFT, y },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y },
        thickness: 0.4,
        color: LIGHT_GRAY
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
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
      
      page.drawText(jobTitle.trim(), { x: MARGIN_LEFT, y, size: JOB_TITLE_SIZE, font: fontBold, color: DARK_GRAY });
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
        y = PAGE_HEIGHT - MARGIN_TOP;
      }
      
      drawTextWithBold(page, wline, MARGIN_LEFT, y, font, fontBold, BODY_SIZE, DARK_GRAY);
      y -= LINE_HEIGHT;
    }
    
    if (wrapped.hasBullet) y -= SPACING.BULLET_GAP;
  }
  
  return await pdfDoc.save();
}
