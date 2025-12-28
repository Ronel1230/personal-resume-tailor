import { PDFPage, rgb } from 'pdf-lib';
import { TemplateContext, wrapText, wrapBulletText, formatDate, drawTextWithBold, COLORS, SPACING, BULLET_INDENT, BULLET_CHAR } from '../utils';

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
  
  // Helper to wrap skills line with proper indent for content after category
  const wrapSkillsLine = (text: string, maxWidth: number): string[] => {
    // Match pattern like "• Category: content" or "**Category:** content"
    const skillMatch = text.match(/^[\-\·•]\s*(\*\*[^*]+\*\*:?|[^:]+:)\s*(.*)$/);
    if (!skillMatch) {
      return wrapText(text, font, BODY_SIZE, maxWidth);
    }
    
    const category = skillMatch[1]; // e.g., "**Languages:**" or "Languages:"
    const content = skillMatch[2];  // e.g., "JavaScript, TypeScript, Python..."
    
    // Calculate indent width for continuation lines (bullet + category width)
    const categoryDisplayText = category.replace(/\*\*/g, ''); // Remove ** for width calculation
    const bulletWidth = font.widthOfTextAtSize(BULLET_CHAR + '   ', BODY_SIZE);
    const categoryWidth = fontBold.widthOfTextAtSize(categoryDisplayText + ' ', BODY_SIZE);
    const contentIndent = bulletWidth + categoryWidth;
    
    // Wrap the content with reduced width
    const contentMaxWidth = maxWidth - contentIndent + bulletWidth; // First line has bullet already
    const wrappedContent = wrapText(content, font, BODY_SIZE, maxWidth - categoryWidth - bulletWidth);
    
    const lines: string[] = [];
    for (let i = 0; i < wrappedContent.length; i++) {
      if (i === 0) {
        lines.push(BULLET_CHAR + '   ' + category + ' ' + wrappedContent[i]);
      } else {
        // Add spaces to align with content after category
        const spacePadding = ' '.repeat(Math.ceil(contentIndent / font.widthOfTextAtSize(' ', BODY_SIZE)));
        lines.push(spacePadding + wrappedContent[i]);
      }
    }
    return lines;
  };
  
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
      
      currentSection = line.slice(0, -1).toLowerCase();
      const sectionName = line.slice(0, -1).toUpperCase();
      page.drawText(sectionName, { x: MARGIN_LEFT, y, size: SECTION_SIZE, font: fontBold, color: DARK_GRAY });
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
    
    // Check if this is a skills section line (has category pattern like "• Category: ...")
    const isSkillsSection = currentSection.includes('skill') || currentSection.includes('technologies');
    const isSkillLine = line.match(/^[\-\·•]\s*(\*\*[^*]+\*\*:?|[A-Za-z &\/]+:)\s*.+$/);
    
    if (isSkillsSection && isSkillLine) {
      // Handle skills line with proper content indentation
      const wrappedLines = wrapSkillsLine(line, CONTENT_WIDTH - BULLET_INDENT);
      
      for (let j = 0; j < wrappedLines.length; j++) {
        if (y < MARGIN_BOTTOM) {
          page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          context.page = page;
          y = PAGE_HEIGHT - MARGIN_TOP;
        }
        
        const xPos = MARGIN_LEFT + BULLET_INDENT;
        drawTextWithBold(page, wrappedLines[j], xPos, y, font, fontBold, BODY_SIZE, BLACK);
        y -= LINE_HEIGHT;
      }
      y -= SPACING.BULLET_GAP;
      continue;
    }
    
    // Bullet or text
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
