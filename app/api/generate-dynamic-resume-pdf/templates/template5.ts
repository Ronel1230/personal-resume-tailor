import { PDFPage, rgb } from 'pdf-lib';
import { TemplateContext, wrapText, wrapBulletText, formatDate, drawTextWithBold, COLORS, SPACING, BULLET_INDENT, BULLET_CHAR, SKILL_CONTINUATION_INDENT, parseEducationLine, isEducationSection, splitIntoBulletLines } from '../utils';

// TEMPLATE 5: MODERN BLOCK - Large name with clean sections
export async function renderTemplate5(context: TemplateContext): Promise<Uint8Array> {
  const { pdfDoc, font, fontBold, name, email, phone, location, linkedin, body, PAGE_WIDTH, PAGE_HEIGHT } = context;
  let { page } = context;
  
  const BLACK = COLORS.BLACK;
  const DARK_SLATE = rgb(0.22, 0.25, 0.28);
  const MEDIUM_GRAY = rgb(0.42, 0.42, 0.42);
  const ACCENT = rgb(0.35, 0.42, 0.5);
  
  // Layout
  const MARGIN_LEFT = 50;
  const MARGIN_RIGHT = 50;
  const MARGIN_TOP = 50;
  const MARGIN_BOTTOM = 50;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  
  // Typography
  const NAME_SIZE = 28;
  const CONTACT_SIZE = 9;
  const SECTION_SIZE = 11;
  const JOB_TITLE_SIZE = 10;
  const BODY_SIZE = 9.5;
  const LINE_HEIGHT = BODY_SIZE * SPACING.BULLET_LINE_HEIGHT;
  
  let y = PAGE_HEIGHT - MARGIN_TOP;
  
  // === HEADER ===
  if (name) {
    page.drawText(name, { x: MARGIN_LEFT, y, size: NAME_SIZE, font: fontBold, color: DARK_SLATE });
    y -= NAME_SIZE + 8;
  }
  
  const contactParts = [email, phone, location, linkedin].filter(Boolean);
  if (contactParts.length > 0) {
    page.drawText(contactParts.join('   |   '), { x: MARGIN_LEFT, y, size: CONTACT_SIZE, font, color: MEDIUM_GRAY });
    y -= CONTACT_SIZE + 16;
  }
  
  // === BODY ===
  const bodyLines = body.split('\n');
  let isFirstJob = true;
  let isFirstBulletAfterJob = false;
  let currentSection = '';
  let isFirstEducation = true;

  const spaceWidthForSkills = font.widthOfTextAtSize(' ', BODY_SIZE);

  const wrapSkillsLine = (text: string, maxWidth: number): string[] => {
    const skillMatch = text.match(/^[\-\·•]\s*(\*\*[^*]+\*\*:?|[^:]+:)\s*(.*)$/);
    if (!skillMatch) return wrapText(text, font, BODY_SIZE, maxWidth);
    const category = skillMatch[1];
    const content = skillMatch[2];
    const categoryDisplayText = category.replace(/\*\*/g, '');
    const bulletWidth = font.widthOfTextAtSize(BULLET_CHAR + '   ', BODY_SIZE);
    const categoryWidth = fontBold.widthOfTextAtSize(categoryDisplayText + ' ', BODY_SIZE);
    const wrappedContent = wrapText(content, font, BODY_SIZE, maxWidth - categoryWidth - bulletWidth);
    const lines: string[] = [];
    const continuationSpaces = ' '.repeat(Math.max(0, Math.ceil(SKILL_CONTINUATION_INDENT / spaceWidthForSkills)));
    for (let i = 0; i < wrappedContent.length; i++) {
      if (i === 0) lines.push(BULLET_CHAR + '   ' + category + ' ' + wrappedContent[i]);
      else lines.push(continuationSpaces + wrappedContent[i]);
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
      page.drawText(sectionName, { x: MARGIN_LEFT, y, size: SECTION_SIZE, font: fontBold, color: DARK_SLATE });
      y -= 4;
      
      page.drawLine({
        start: { x: MARGIN_LEFT, y },
        end: { x: PAGE_WIDTH - MARGIN_RIGHT, y },
        thickness: 1,
        color: ACCENT
      });
      y -= SPACING.AFTER_SECTION_HEADER;
      isFirstJob = true;
      isFirstBulletAfterJob = false;
      isFirstEducation = true;
      continue;
    }
    
    // Education entry (when in education section)
    if (isEducationSection(currentSection)) {
      const eduParsed = parseEducationLine(line);
      if (eduParsed) {
        if (!isFirstEducation) y -= SPACING.EDUCATION_GAP;
        isFirstEducation = false;
        
        if (y < MARGIN_BOTTOM + 40) {
          page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          context.page = page;
          y = PAGE_HEIGHT - MARGIN_TOP;
        }
        
        // Draw degree (bold)
        page.drawText(eduParsed.degree, { x: MARGIN_LEFT, y, size: JOB_TITLE_SIZE, font: fontBold, color: BLACK });
        y -= JOB_TITLE_SIZE + 2;
        
        // Draw institution and year (regular, gray)
        page.drawText(`${eduParsed.institution}  |  ${eduParsed.year}`, { x: MARGIN_LEFT, y, size: BODY_SIZE, font, color: MEDIUM_GRAY });
        y -= BODY_SIZE + 6;
        continue;
      }
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

    const isSkillsSection = currentSection.includes('skill') || currentSection.includes('technologies');
    const isSkillLine = line.match(/^[\-\·•]\s*(\*\*[^*]+\*\*:?|[A-Za-z &\/]+:)\s*.+$/);
    if (isSkillsSection && isSkillLine) {
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
    
    // Bullet or regular text (in Experience, split paragraph into bullets if no bullet chars)
    const isExperienceSection = currentSection.includes('experience') || currentSection.includes('professional');
    let linesToRender = [line];
    if (isExperienceSection && !/^[\-\·•]\s/.test(line)) {
      const bulletLines = splitIntoBulletLines(line);
      if (bulletLines.length > 1) linesToRender = bulletLines;
    }
    
    for (const singleLine of linesToRender) {
      const wrapped = wrapBulletText(singleLine, font, BODY_SIZE, CONTENT_WIDTH - BULLET_INDENT);
      
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
  }
  
  return await pdfDoc.save();
}
