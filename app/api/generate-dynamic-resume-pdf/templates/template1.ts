import { PDFPage, rgb } from 'pdf-lib';
import { TemplateContext, wrapText, wrapTextWithIndent, formatDate, drawTextWithBold, COLORS } from '../utils';

// Template 1 Body Content Renderer - Classic style with full-width underlines
function renderBodyContentTemplate1(
  context: TemplateContext,
  y: number,
  left: number,
  right: number,
  contentWidth: number,
  bodySize: number,
  bodyLineHeight: number,
  sectionHeaderSize: number,
  sectionLineHeight: number,
  marginBottom: number
): number {
  const { font, fontBold, body, PAGE_HEIGHT, PAGE_WIDTH, pdfDoc } = context;
  const BLACK = COLORS.BLACK;
  const MEDIUM_GRAY = COLORS.MEDIUM_GRAY;
  const NAVY_BLUE = rgb(0.1, 0.2, 0.4);
  
  const bodyLines = body.split('\n');
  let firstJob = true;
  
  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i].trim();
    if (!line) {
      y -= 6;
      continue;
    }
    
    if (line.endsWith(':')) {
      y -= 12;
      const sectionHeader = line.slice(0, -1);
      const sectionLines = wrapText(sectionHeader, fontBold, sectionHeaderSize, contentWidth);
      for (const sectionLine of sectionLines) {
        if (y < marginBottom) {
          context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          y = PAGE_HEIGHT - 72;
        }
        context.page.drawText(sectionLine, { x: left, y, size: sectionHeaderSize, font: fontBold, color: NAVY_BLUE });
        y -= 6;
        // Full-width underline in navy blue
        context.page.drawLine({
          start: { x: left, y: y },
          end: { x: right, y: y },
          thickness: 2,
          color: NAVY_BLUE
        });
        y -= sectionLineHeight;
      }
    } else {
      const isJobExperience = / at .+:.+/.test(line);
      
      if (isJobExperience) {
        const match = line.match(/^(.+?) at (.+?):\s*(.+)$/);
        if (match) {
          const [, jobTitle, companyName, period] = match;
          
          if (!firstJob) {
            y -= 8;
          }
          firstJob = false;
          
          const titleLines = wrapText(jobTitle.trim(), fontBold, bodySize + 1, contentWidth - 10);
          for (const titleLine of titleLines) {
            if (y < marginBottom) {
              context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
              y = PAGE_HEIGHT - 72;
            }
            context.page.drawText(titleLine, { x: left + 10, y, size: bodySize + 1, font: fontBold, color: BLACK });
            y -= bodyLineHeight + 2;
          }
          
          const formattedPeriod = formatDate(period.trim());
          const companyPeriodLine = `${companyName.trim()} | ${formattedPeriod}`;
          const companyPeriodLines = wrapText(companyPeriodLine, font, bodySize, contentWidth - 10);
          for (const line of companyPeriodLines) {
            if (y < marginBottom) {
              context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
              y = PAGE_HEIGHT - 72;
            }
            context.page.drawText(line, { x: left + 10, y, size: bodySize, font, color: MEDIUM_GRAY });
            y -= bodyLineHeight;
          }
          
          y -= 4;
        }
      } else {
        const isSkillsCategory = line.startsWith('·');
        if (isSkillsCategory) {
          const categoryName = line.trim();
          const categoryLines = wrapText(categoryName, fontBold, bodySize + 1, contentWidth - 20);
          for (const categoryLine of categoryLines) {
            if (y < marginBottom) {
              context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
              y = PAGE_HEIGHT - 72;
            }
            context.page.drawText(categoryLine, { x: left + 10, y, size: bodySize + 1, font: fontBold, color: BLACK });
            y -= bodyLineHeight + 2;
          }
        } else {
          const wrapped = wrapTextWithIndent(line, font, bodySize, contentWidth - 10);
          for (let i = 0; i < wrapped.lines.length; i++) {
            if (y < marginBottom) {
              context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
              y = PAGE_HEIGHT - 72;
            }
            const xPos = i === 0 ? left + 10 : left + 10 + wrapped.indentWidth;
            drawTextWithBold(context.page, wrapped.lines[i], xPos, y, font, fontBold, bodySize, BLACK);
            y -= bodyLineHeight;
          }
        }
      }
    }
    
    if (y < marginBottom) {
      context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - 72;
    }
  }
  
  return y;
}

// CLASSIC TEMPLATE - Traditional centered layout with navy blue accent
export async function renderTemplate1(context: TemplateContext): Promise<Uint8Array> {
  const { pdfDoc, page, font, fontBold, name, email, phone, location, PAGE_WIDTH, PAGE_HEIGHT } = context;
  const BLACK = COLORS.BLACK;
  const MEDIUM_GRAY = COLORS.MEDIUM_GRAY;
  const NAVY_BLUE = rgb(0.1, 0.2, 0.4); // Navy blue accent
  
  const MARGIN_TOP = 60;
  const MARGIN_BOTTOM = 50;
  const MARGIN_LEFT = 50;
  const MARGIN_RIGHT = 50;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  
  const NAME_SIZE = 28; // Larger name
  const CONTACT_SIZE = 11;
  const SECTION_HEADER_SIZE = 16; // Larger section headers
  const BODY_SIZE = 11;
  
  // Navy blue header bar
  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 100,
    width: PAGE_WIDTH,
    height: 100,
    color: NAVY_BLUE
  });
  
  let y = PAGE_HEIGHT - 50;
  const left = MARGIN_LEFT;
  const right = PAGE_WIDTH - MARGIN_RIGHT;
  
  // Centered name (uppercase, white on navy)
  if (name) {
    const nameText = name.toUpperCase();
    const nameLines = wrapText(nameText, fontBold, NAME_SIZE, CONTENT_WIDTH);
    for (const line of nameLines) {
      const textWidth = fontBold.widthOfTextAtSize(line, NAME_SIZE);
      const centerX = (PAGE_WIDTH - textWidth) / 2;
      page.drawText(line, { x: centerX, y, size: NAME_SIZE, font: fontBold, color: rgb(1, 1, 1) });
      y -= NAME_SIZE * 0.8;
    }
    y -= 8;
  }
  
  // Centered contact info (white on navy)
  const contactParts = [location, phone, email].filter(Boolean);
  if (contactParts.length > 0) {
    const contactLine = contactParts.join(' • ');
    const contactLines = wrapText(contactLine, font, CONTACT_SIZE, CONTENT_WIDTH);
    for (const line of contactLines) {
      const textWidth = font.widthOfTextAtSize(line, CONTACT_SIZE);
      const centerX = (PAGE_WIDTH - textWidth) / 2;
      page.drawText(line, { x: centerX, y, size: CONTACT_SIZE, font, color: rgb(0.9, 0.9, 0.9) });
      y -= CONTACT_SIZE * 1.5;
    }
    y -= 4;
  }
  
  y = PAGE_HEIGHT - 120;
  
  // Render body with custom template 1 rendering
  // TODO: Add custom template 1 rendering
  y = renderBodyContentTemplate1(
    context, 
    y, 
    left, 
    right, 
    CONTENT_WIDTH, 
    BODY_SIZE, 
    BODY_SIZE * 1.4, 
    SECTION_HEADER_SIZE, 
    SECTION_HEADER_SIZE * 1.5, 
    MARGIN_BOTTOM
  );
  
  return await pdfDoc.save();
}

