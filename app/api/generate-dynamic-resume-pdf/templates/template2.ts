import { PDFPage, rgb } from 'pdf-lib';
import { TemplateContext, wrapText, wrapTextWithIndent, formatDate, drawTextWithBold, COLORS } from '../utils';

// Template 2 Body Content Renderer - Modern style with shorter underlines
function renderBodyContentTemplate2(
  context: TemplateContext,
  y: number,
  left: number,
  contentWidth: number,
  bodySize: number,
  bodyLineHeight: number,
  sectionHeaderSize: number,
  sectionLineHeight: number,
  marginBottom: number,
  drawLeftBorder: (page: PDFPage) => void
): number {
  const { font, fontBold, body, PAGE_HEIGHT, PAGE_WIDTH, pdfDoc } = context;
  const BLACK = COLORS.BLACK;
  const MEDIUM_GRAY = COLORS.MEDIUM_GRAY;
  const TEAL = rgb(0.0, 0.5, 0.5);
  
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
          drawLeftBorder(context.page);
          y = PAGE_HEIGHT - 72;
        }
        context.page.drawText(sectionLine, { x: left, y, size: sectionHeaderSize, font: fontBold, color: BLACK });
        y -= 6;
        // Teal underline (border color, not text color)
        const lineLength = contentWidth;
        context.page.drawLine({
          start: { x: left, y: y },
          end: { x: left + lineLength, y: y },
          thickness: 2,
          color: TEAL
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
              drawLeftBorder(context.page);
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
              drawLeftBorder(context.page);
              y = PAGE_HEIGHT - 72;
            }
            context.page.drawText(line, { x: left + 10, y, size: bodySize, font, color: MEDIUM_GRAY });
            y -= bodyLineHeight;
          }
          
          y -= 4;
        }
      } else {
        const wrapped = wrapTextWithIndent(line, font, bodySize, contentWidth - 10);
        for (let i = 0; i < wrapped.lines.length; i++) {
          if (y < marginBottom) {
            context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
            drawLeftBorder(context.page);
            y = PAGE_HEIGHT - 72;
          }
          const xPos = i === 0 ? left + 10 : left + 10 + wrapped.indentWidth;
          drawTextWithBold(context.page, wrapped.lines[i], xPos, y, font, fontBold, bodySize, BLACK);
          y -= bodyLineHeight;
        }
      }
    }
    
    if (y < marginBottom) {
      context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawLeftBorder(context.page);
      y = PAGE_HEIGHT - 72;
    }
  }
  
  return y;
}

// MODERN TEMPLATE - Left-aligned, clean, contemporary with teal accent
export async function renderTemplate2(context: TemplateContext): Promise<Uint8Array> {
  const { pdfDoc, page, font, fontBold, name, email, phone, location, PAGE_WIDTH, PAGE_HEIGHT } = context;
  const BLACK = COLORS.BLACK;
  const MEDIUM_GRAY = COLORS.MEDIUM_GRAY;
  const TEAL = rgb(0.0, 0.5, 0.5); // Modern teal accent
  
  const MARGIN_TOP = 50;
  const MARGIN_BOTTOM = 50;
  const MARGIN_LEFT = 50;
  const MARGIN_RIGHT = 50;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  
  const NAME_SIZE = 26; // Larger modern name
  const CONTACT_SIZE = 9;
  const SECTION_HEADER_SIZE = 13;
  const BODY_SIZE = 9.5; // Smaller, tighter body text
  
  // Helper function to draw left border
  const drawLeftBorder = (pageToDraw: PDFPage) => {
    pageToDraw.drawRectangle({
      x: 0,
      y: 0,
      width: 6,
      height: PAGE_HEIGHT,
      color: TEAL
    });
  };
  
  // Teal accent bar on left (first page)
  drawLeftBorder(page);
  
  let y = PAGE_HEIGHT - MARGIN_TOP;
  const left = MARGIN_LEFT + 10;
  
  // Left-aligned name in black (not matching border color)
  if (name) {
    const nameLines = wrapText(name, fontBold, NAME_SIZE, CONTENT_WIDTH);
    for (const line of nameLines) {
      page.drawText(line, { x: left, y, size: NAME_SIZE, font: fontBold, color: BLACK });
      y -= NAME_SIZE * 1.0;
    }
    y -= 12;
  }
  
  // Left-aligned contact info
  const contactParts = [location, phone, email].filter(Boolean);
  if (contactParts.length > 0) {
    const contactLine = contactParts.join(' • ');
    const contactLines = wrapText(contactLine, font, CONTACT_SIZE, CONTENT_WIDTH);
    for (const line of contactLines) {
      page.drawText(line, { x: left, y, size: CONTACT_SIZE, font, color: MEDIUM_GRAY });
      y -= CONTACT_SIZE * 1.5;
    }
    y -= 20;
  }
  
  // Render body with custom template 2 rendering
  y = renderBodyContentTemplate2(
    context, 
    y, 
    left, 
    CONTENT_WIDTH, 
    BODY_SIZE, 
    BODY_SIZE * 1.4, 
    SECTION_HEADER_SIZE, 
    SECTION_HEADER_SIZE * 1.5, 
    MARGIN_BOTTOM,
    drawLeftBorder
  );
  
  return await pdfDoc.save();
}

