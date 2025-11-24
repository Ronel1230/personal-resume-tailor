import { PDFPage, rgb } from 'pdf-lib';
import { TemplateContext, wrapText, wrapTextWithIndent, formatDate, drawTextWithBold, COLORS } from '../utils';

// Template 6 Body Content Renderer - Creative style with left border on all pages
function renderBodyContentTemplate5(
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
  const CREATIVE_GREY1 = rgb(0.4, 0.45, 0.5); // Blue-grey
  const CREATIVE_GREY2 = rgb(0.5, 0.45, 0.5); // Purple-grey
  const CREATIVE_GREY3 = rgb(0.45, 0.5, 0.55); // Green-grey
  const colors = [CREATIVE_GREY1, CREATIVE_GREY2, CREATIVE_GREY3];
  
  const bodyLines = body.split('\n');
  let firstJob = true;
  let sectionIndex = 0;
  
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
        // Section headers in black (not matching border colors)
        context.page.drawText(sectionLine, { x: left, y, size: sectionHeaderSize, font: fontBold, color: BLACK });
        y -= sectionLineHeight;
      }
      sectionIndex++;
    } else {
      const isJobExperience = / at .+:.+/.test(line);
      
      if (isJobExperience) {
        const match = line.match(/^(.+?) at (.+?):\s*(.+)$/);
        if (match) {
          const [, jobTitle, companyName, period] = match;
          
          if (!firstJob) {
            y -= 10;
          }
          firstJob = false;
          
          const titleLines = wrapText(jobTitle.trim(), fontBold, bodySize + 1, contentWidth);
          for (const titleLine of titleLines) {
            if (y < marginBottom) {
              context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
              drawLeftBorder(context.page);
              y = PAGE_HEIGHT - 72;
            }
            context.page.drawText(titleLine, { x: left, y, size: bodySize + 1, font: fontBold, color: BLACK });
            y -= bodyLineHeight + 2;
          }
          
          const formattedPeriod = formatDate(period.trim());
          const companyPeriodLine = `${companyName.trim()} | ${formattedPeriod}`;
          const companyPeriodLines = wrapText(companyPeriodLine, font, bodySize, contentWidth);
          for (const line of companyPeriodLines) {
            if (y < marginBottom) {
              context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
              drawLeftBorder(context.page);
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
            drawLeftBorder(context.page);
            y = PAGE_HEIGHT - 72;
          }
          const xPos = i === 0 ? left : left + wrapped.indentWidth;
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

// CREATIVE TEMPLATE - Unique layout with visual elements and grey-toned colors
export async function renderTemplate5(context: TemplateContext): Promise<Uint8Array> {
  const { pdfDoc, page, font, fontBold, name, email, phone, location, PAGE_WIDTH, PAGE_HEIGHT } = context;
  const BLACK = COLORS.BLACK;
  const MEDIUM_GRAY = COLORS.MEDIUM_GRAY;
  const CREATIVE_GREY1 = rgb(0.4, 0.45, 0.5); // Blue-grey
  const CREATIVE_GREY2 = rgb(0.5, 0.45, 0.5); // Purple-grey
  const CREATIVE_GREY3 = rgb(0.45, 0.5, 0.55); // Green-grey
  
  const MARGIN_TOP = 50;
  const MARGIN_BOTTOM = 50;
  const MARGIN_LEFT = 40;
  const MARGIN_RIGHT = 40;
  const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  
  const NAME_SIZE = 26; // Larger creative name
  const CONTACT_SIZE = 9.5;
  const SECTION_HEADER_SIZE = 13;
  const BODY_SIZE = 10;
  
  // Helper function to draw grey-toned left border on any page
  const drawLeftBorder = (pageToDraw: PDFPage) => {
    // Multi-toned grey border
    pageToDraw.drawRectangle({
      x: 0,
      y: 0,
      width: 10,
      height: PAGE_HEIGHT / 3,
      color: CREATIVE_GREY1
    });
    pageToDraw.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT / 3,
      width: 10,
      height: PAGE_HEIGHT / 3,
      color: CREATIVE_GREY2
    });
    pageToDraw.drawRectangle({
      x: 0,
      y: (PAGE_HEIGHT / 3) * 2,
      width: 10,
      height: PAGE_HEIGHT / 3,
      color: CREATIVE_GREY3
    });
  };
  
  // Decorative left border on first page
  drawLeftBorder(page);
  
  let y = PAGE_HEIGHT - MARGIN_TOP;
  const left = MARGIN_LEFT + 20;
  
  // Name in black (not matching border color)
  if (name) {
    const nameLines = wrapText(name, fontBold, NAME_SIZE, CONTENT_WIDTH);
    for (const line of nameLines) {
      page.drawText(line, { x: left, y, size: NAME_SIZE, font: fontBold, color: BLACK });
      y -= NAME_SIZE * 0.9;
    }
    y -= 4;
    // Grey-toned decorative underline - gradient effect
    page.drawLine({
      start: { x: left, y: y },
      end: { x: left + CONTENT_WIDTH * 0.4, y: y },
      thickness: 3,
      color: CREATIVE_GREY1
    });
    page.drawLine({
      start: { x: left + CONTENT_WIDTH * 0.4, y: y },
      end: { x: left + CONTENT_WIDTH * 0.7, y: y },
      thickness: 3,
      color: CREATIVE_GREY2
    });
    page.drawLine({
      start: { x: left + CONTENT_WIDTH * 0.7, y: y },
      end: { x: left + CONTENT_WIDTH, y: y },
      thickness: 3,
      color: CREATIVE_GREY3
    });
    y -= 16;
  }
  
  // Contact info in one line with bullets separator
  const contactParts = [location, phone, email].filter(Boolean);
  if (contactParts.length > 0) {
    const contactLine = contactParts.join(' • ');
    const contactLines = wrapText(contactLine, font, CONTACT_SIZE, CONTENT_WIDTH);
    for (const line of contactLines) {
      page.drawText(line, { x: left, y, size: CONTACT_SIZE, font, color: MEDIUM_GRAY });
      y -= CONTACT_SIZE * 1.5;
    }
    y -= 10;
  }
  
  // Render body with custom template 6 rendering
  y = renderBodyContentTemplate5(
    context, 
    y, 
    left, 
    CONTENT_WIDTH, 
    BODY_SIZE, 
    BODY_SIZE * 1.5, 
    SECTION_HEADER_SIZE, 
    SECTION_HEADER_SIZE * 1.8, 
    MARGIN_BOTTOM,
    drawLeftBorder
  );
  
  return await pdfDoc.save();
}

