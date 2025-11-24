import { PDFPage, rgb } from 'pdf-lib';
import { TemplateContext, wrapText, wrapTextWithIndent, formatDate, drawTextWithBold, COLORS } from '../utils';

// Template 3 Body Content Renderer - Minimalist style with subtle underlines
function renderBodyContentTemplate3(
  context: TemplateContext,
  y: number,
  left: number,
  contentWidth: number,
  bodySize: number,
  bodyLineHeight: number,
  sectionHeaderSize: number,
  sectionLineHeight: number,
  marginBottom: number,
  drawBackground: (page: PDFPage) => void
): number {
  const { font, fontBold, body, PAGE_HEIGHT, PAGE_WIDTH, pdfDoc } = context;
  const DARK_GRAY = rgb(0.25, 0.25, 0.25);
  const MEDIUM_GRAY = rgb(0.45, 0.45, 0.45);
  
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
          drawBackground(context.page);
          y = PAGE_HEIGHT - 72;
        }
        context.page.drawText(sectionLine, { x: left, y, size: sectionHeaderSize, font: fontBold, color: DARK_GRAY });
        y -= 6;
        // Very subtle underline
        context.page.drawLine({
          start: { x: left, y: y },
          end: { x: left + contentWidth, y: y },
          thickness: 0.5,
          color: MEDIUM_GRAY
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
            y -= 12;
          }
          firstJob = false;
          
          const titleLines = wrapText(jobTitle.trim(), fontBold, bodySize + 1, contentWidth);
          for (const titleLine of titleLines) {
            if (y < marginBottom) {
              context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
              y = PAGE_HEIGHT - 72;
            }
            context.page.drawText(titleLine, { x: left, y, size: bodySize + 1, font: fontBold, color: DARK_GRAY });
            y -= bodyLineHeight + 2;
          }
          
          const formattedPeriod = formatDate(period.trim());
          const companyPeriodLine = `${companyName.trim()} | ${formattedPeriod}`;
          const companyPeriodLines = wrapText(companyPeriodLine, font, bodySize, contentWidth);
          for (const line of companyPeriodLines) {
            if (y < marginBottom) {
              context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
              y = PAGE_HEIGHT - 72;
            }
            context.page.drawText(line, { x: left, y, size: bodySize, font, color: MEDIUM_GRAY });
            y -= bodyLineHeight;
          }
          
          y -= 6;
        }
      } else {
        const wrapped = wrapTextWithIndent(line, font, bodySize, contentWidth);
        for (let i = 0; i < wrapped.lines.length; i++) {
          if (y < marginBottom) {
            context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
            y = PAGE_HEIGHT - 72;
          }
          const xPos = i === 0 ? left : left + wrapped.indentWidth;
          drawTextWithBold(context.page, wrapped.lines[i], xPos, y, font, fontBold, bodySize, DARK_GRAY);
          y -= bodyLineHeight;
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

// MINIMALIST TEMPLATE - Clean, modern, intuitive layout with subtle grays
export async function renderTemplate3(context: TemplateContext): Promise<Uint8Array> {
  const { pdfDoc, page, font, fontBold, name, email, phone, location, PAGE_WIDTH, PAGE_HEIGHT } = context;
  const DARK_GRAY = rgb(0.25, 0.25, 0.25); // Softer than black
  const MEDIUM_GRAY = rgb(0.45, 0.45, 0.45);
  const LIGHT_GRAY = rgb(0.75, 0.75, 0.75);
  const VERY_LIGHT_GRAY = rgb(0.92, 0.92, 0.92);
  
  const MARGIN_TOP = 90; // More white space
  const MARGIN_BOTTOM = 80;
  const MARGIN_LEFT = 70;
  const MARGIN_RIGHT = 70;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  
  const NAME_SIZE = 20; // Smaller, elegant
  const CONTACT_SIZE = 8.5;
  const SECTION_HEADER_SIZE = 11;
  const BODY_SIZE = 9.5;
  
  // Helper function to draw background (only for new pages, not first page)
  const drawBackground = (pageToDraw: PDFPage) => {
    pageToDraw.drawRectangle({
      x: 0,
      y: 0,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      color: VERY_LIGHT_GRAY
    });
  };
  
  // No background on first page
  
  let y = PAGE_HEIGHT - MARGIN_TOP;
  const left = MARGIN_LEFT;
  
  // Name - lighter gray, elegant
  if (name) {
    const nameLines = wrapText(name, fontBold, NAME_SIZE, CONTENT_WIDTH);
    for (const line of nameLines) {
      page.drawText(line, { x: left, y, size: NAME_SIZE, font: fontBold, color: DARK_GRAY });
      y -= NAME_SIZE * 0.8;
    }
    y -= 6;
  }
  
  // Contact info in one line with separators
  const contactParts = [location, phone, email].filter(Boolean);
  if (contactParts.length > 0) {
    const contactLine = contactParts.join(' • ');
    const contactLines = wrapText(contactLine, font, CONTACT_SIZE, CONTENT_WIDTH);
    for (const line of contactLines) {
      page.drawText(line, { x: left, y, size: CONTACT_SIZE, font, color: MEDIUM_GRAY });
      y -= CONTACT_SIZE * 1.6;
    }
    y -= 12;
  }
  
  // Very subtle divider line
  page.drawLine({
    start: { x: left, y: y },
    end: { x: left + CONTENT_WIDTH, y: y },
    thickness: 0.3,
    color: LIGHT_GRAY
  });
  y -= 28;
  
  // Render body with custom template 3 rendering
  y = renderBodyContentTemplate3(
    context, 
    y, 
    left, 
    CONTENT_WIDTH, 
    BODY_SIZE, 
    BODY_SIZE * 1.5, 
    SECTION_HEADER_SIZE, 
    SECTION_HEADER_SIZE * 1.6, 
    MARGIN_BOTTOM,
    drawBackground
  );
  
  return await pdfDoc.save();
}

