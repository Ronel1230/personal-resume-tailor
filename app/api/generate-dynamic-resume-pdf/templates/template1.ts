import { PDFPage, rgb } from 'pdf-lib';
import { TemplateContext, wrapText, wrapBulletText, formatDate, drawTextWithBold, COLORS, SPACING, BULLET_INDENT } from '../utils';

// TEMPLATE 1: BOLD HEADER - Strong name with horizontal rule
export async function renderTemplate1(context: TemplateContext): Promise<Uint8Array> {
  const { pdfDoc, font, fontBold, name, email, phone, location, body, PAGE_WIDTH, PAGE_HEIGHT } = context;
  let { page } = context;
  
  const BLACK = COLORS.BLACK;
  const DARK_GRAY = COLORS.DARK_GRAY;
  const MEDIUM_GRAY = COLORS.MEDIUM_GRAY;
  
  // Layout
  const MARGIN_LEFT = 50;
  const MARGIN_RIGHT = 50;
  const MARGIN_TOP = 55;
  const MARGIN_BOTTOM = 50;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  
  // Typography
  const NAME_SIZE = 26;
  const CONTACT_SIZE = 9;
  const SECTION_SIZE = 11;
  const JOB_TITLE_SIZE = 10;
  const BODY_SIZE = 9.5;
  const LINE_HEIGHT = BODY_SIZE * SPACING.BULLET_LINE_HEIGHT;
  
  let y = PAGE_HEIGHT - MARGIN_TOP;
  
  // === HEADER ===
  if (name) {
    page.drawText(name, { x: MARGIN_LEFT, y, size: NAME_SIZE, font: fontBold, color: BLACK });
    y -= NAME_SIZE + 6;
  }
  
  const contactParts = [email, phone, location].filter(Boolean);
  if (contactParts.length > 0) {
    page.drawText(contactParts.join('   |   '), { x: MARGIN_LEFT, y, size: CONTACT_SIZE, font, color: MEDIUM_GRAY });
    y -= CONTACT_SIZE + 8;
  }
  
  page.drawLine({
    start: { x: MARGIN_LEFT, y },
    end: { x: PAGE_WIDTH - MARGIN_RIGHT, y },
    thickness: 2,
    color: DARK_GRAY
  });
  y -= 22;
  
  // === BODY ===
  const bodyLines = body.split('\n');
  let isFirstJob = true;
  let isFirstBulletAfterJob = false;
  let currentSection = '';
  
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
      
      const sectionName = line.slice(0, -1).toUpperCase();
      currentSection = sectionName.toLowerCase();
      page.drawText(sectionName, { x: MARGIN_LEFT, y, size: SECTION_SIZE, font: fontBold, color: DARK_GRAY });
      y -= SPACING.AFTER_SECTION_HEADER;
      isFirstJob = true;
      isFirstBulletAfterJob = false;
      continue;
    }
    
    // Check if we're in a skills section (technical skills, skills, etc.)
    const isSkillsSection = currentSection.includes('skill');
    
    // Job line (only applies to experience sections, not skills)
    const jobMatch = !isSkillsSection && line.match(/^(.+?) at (.+?):\s*(.+)$/);
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
    
    // For skills section, don't use bullet indent - align with margin
    if (isSkillsSection) {
      const wrapped = wrapText(line.replace(/^[\-\·•]\s*/, ''), font, BODY_SIZE, CONTENT_WIDTH);
      
      for (const wline of wrapped) {
        if (y < MARGIN_BOTTOM) {
          page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          context.page = page;
          y = PAGE_HEIGHT - MARGIN_TOP;
        }
        
        drawTextWithBold(page, wline, MARGIN_LEFT, y, font, fontBold, BODY_SIZE, BLACK);
        y -= LINE_HEIGHT;
      }
      y -= 2; // Small gap between skill lines
      continue;
    }
    
    // Bullet or text (for non-skills sections)
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
      
      // Bullets are indented, regular text is at margin
      const xPos = wrapped.hasBullet ? MARGIN_LEFT + BULLET_INDENT : MARGIN_LEFT;
      drawTextWithBold(page, wline, xPos, y, font, fontBold, BODY_SIZE, BLACK);
      y -= LINE_HEIGHT;
    }
    
    if (wrapped.hasBullet) y -= SPACING.BULLET_GAP;
  }
  
  return await pdfDoc.save();
}
