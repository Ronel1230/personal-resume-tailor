import { PDFPage, rgb } from 'pdf-lib';
import { TemplateContext, wrapText, wrapBulletText, formatDate, drawTextWithBold, COLORS, SPACING, BULLET_INDENT } from '../utils';

// TEMPLATE 4: CLASSIC CENTERED - Centered header with elegant spacing
export async function renderTemplate4(context: TemplateContext): Promise<Uint8Array> {
  const { pdfDoc, font, fontBold, name, email, phone, location, body, PAGE_WIDTH, PAGE_HEIGHT } = context;
  let { page } = context;
  
  const BLACK = COLORS.BLACK;
  const CHARCOAL = rgb(0.18, 0.18, 0.18);
  const MEDIUM_GRAY = rgb(0.4, 0.4, 0.4);
  
  // Layout
  const MARGIN_LEFT = 55;
  const MARGIN_RIGHT = 55;
  const MARGIN_TOP = 50;
  const MARGIN_BOTTOM = 50;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  
  // Typography
  const NAME_SIZE = 22;
  const CONTACT_SIZE = 9;
  const SECTION_SIZE = 10.5;
  const JOB_TITLE_SIZE = 10;
  const BODY_SIZE = 9.5;
  const LINE_HEIGHT = BODY_SIZE * SPACING.BULLET_LINE_HEIGHT;
  
  let y = PAGE_HEIGHT - MARGIN_TOP;
  
  // === HEADER - CENTERED ===
  if (name) {
    const nameWidth = fontBold.widthOfTextAtSize(name, NAME_SIZE);
    const nameX = (PAGE_WIDTH - nameWidth) / 2;
    page.drawText(name, { x: nameX, y, size: NAME_SIZE, font: fontBold, color: CHARCOAL });
    y -= NAME_SIZE + 6;
  }
  
  const contactParts = [location, phone, email].filter(Boolean);
  if (contactParts.length > 0) {
    const contactText = contactParts.join('   •   ');
    const contactWidth = font.widthOfTextAtSize(contactText, CONTACT_SIZE);
    const contactX = (PAGE_WIDTH - contactWidth) / 2;
    page.drawText(contactText, { x: contactX, y, size: CONTACT_SIZE, font, color: MEDIUM_GRAY });
    y -= CONTACT_SIZE + 10;
  }
  
  const lineWidth = 180;
  const lineX = (PAGE_WIDTH - lineWidth) / 2;
  page.drawLine({
    start: { x: lineX, y },
    end: { x: lineX + lineWidth, y },
    thickness: 1,
    color: CHARCOAL
  });
  y -= 22;
  
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
      page.drawText(sectionName, { x: MARGIN_LEFT, y, size: SECTION_SIZE, font: fontBold, color: CHARCOAL });
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
      
      page.drawText(jobTitle.trim(), { x: MARGIN_LEFT, y, size: JOB_TITLE_SIZE, font: fontBold, color: BLACK });
      y -= JOB_TITLE_SIZE + 2;
      
      const periodFormatted = formatDate(period.trim());
      page.drawText(`${company.trim()}  |  ${periodFormatted}`, { x: MARGIN_LEFT, y, size: BODY_SIZE, font, color: MEDIUM_GRAY });
      y -= SPACING.AFTER_JOB_HEADER;
      isFirstBulletAfterJob = true;
      continue;
    }
    
    // Bullet or regular text
    const wrapped = wrapBulletText(line, font, BODY_SIZE, CONTENT_WIDTH - BULLET_INDENT);
    
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
      
      const xPos = wrapped.hasBullet ? MARGIN_LEFT + BULLET_INDENT : MARGIN_LEFT;
      drawTextWithBold(page, wline, xPos, y, font, fontBold, BODY_SIZE, BLACK);
      y -= LINE_HEIGHT;
    }
    
    if (wrapped.hasBullet) y -= SPACING.BULLET_GAP;
  }
  
  return await pdfDoc.save();
}
