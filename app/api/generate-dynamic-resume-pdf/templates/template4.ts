import { PDFPage, PDFFont, rgb } from 'pdf-lib';
import { TemplateContext, wrapText, wrapTextWithIndent, formatDate, drawTextWithBold, COLORS } from '../utils';

// Helper function to draw sidebar for template 4
function drawTemplate4Sidebar(
  page: PDFPage,
  font: PDFFont,
  fontBold: PDFFont,
  name: string,
  email: string,
  phone: string,
  location: string,
  PAGE_HEIGHT: number,
  SIDEBAR_WIDTH: number,
  isFirstPage: boolean,
  skillsContent?: { header: string; items: string[] }[]
) {
  const BLACK = COLORS.BLACK;
  const MEDIUM_GRAY = COLORS.MEDIUM_GRAY;
  const PROFESSIONAL_BLUE = rgb(0.2, 0.3, 0.5); // Professional blue
  const LIGHT_BLUE = rgb(0.92, 0.94, 0.97);
  const NAME_SIZE = 18;
  const CONTACT_SIZE = 8.5;
  const SECTION_HEADER_SIZE = 10;
  const BODY_SIZE = 8.5;
  
  // Sidebar background with blue accent
  page.drawRectangle({
    x: 0,
    y: 0,
    width: SIDEBAR_WIDTH,
    height: PAGE_HEIGHT,
    color: LIGHT_BLUE
  });
  
  // Blue accent stripe at top
  page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 8,
    width: SIDEBAR_WIDTH,
    height: 8,
    color: PROFESSIONAL_BLUE
  });
  
  // Name in sidebar (only on first page) - black, positioned lower
  if (name && isFirstPage) {
    const nameLines = wrapText(name.toUpperCase(), fontBold, NAME_SIZE, SIDEBAR_WIDTH - 20);
    let nameY = PAGE_HEIGHT - 80; // Moved down
    for (const line of nameLines) {
      page.drawText(line, { x: 15, y: nameY, size: NAME_SIZE, font: fontBold, color: BLACK });
      nameY -= NAME_SIZE * 0.9;
    }
  }
  
  // Contact info in sidebar (only on first page)
  if (isFirstPage) {
    let contactY = PAGE_HEIGHT - 120;
    
    if (location) {
      page.drawText(location, { x: 15, y: contactY, size: CONTACT_SIZE, font, color: MEDIUM_GRAY });
      contactY -= CONTACT_SIZE * 2;
    }
    if (phone) {
      page.drawText(phone, { x: 15, y: contactY, size: CONTACT_SIZE, font, color: MEDIUM_GRAY });
      contactY -= CONTACT_SIZE * 2;
    }
    if (email) {
      page.drawText(email, { x: 15, y: contactY, size: CONTACT_SIZE, font, color: MEDIUM_GRAY });
    }
  }
  
  // Skills section in sidebar (only on first page)
  if (isFirstPage && skillsContent && skillsContent.length > 0) {
    let skillsY = PAGE_HEIGHT - 200;
    const SIDEBAR_CONTENT_WIDTH = SIDEBAR_WIDTH - 30;
    const LIGHT_GRAY = rgb(0.5, 0.5, 0.5);
    
    for (const skillSection of skillsContent) {
      const headerLines = wrapText(skillSection.header, fontBold, SECTION_HEADER_SIZE, SIDEBAR_CONTENT_WIDTH);
      for (const headerLine of headerLines) {
        if (skillsY < 50) break;
        page.drawText(headerLine, { x: 15, y: skillsY, size: SECTION_HEADER_SIZE, font: fontBold, color: BLACK });
        skillsY -= SECTION_HEADER_SIZE + 4;
      }
      
      for (const item of skillSection.items) {
        if (skillsY < 50) break;
        const itemLines = wrapText(item, font, BODY_SIZE, SIDEBAR_CONTENT_WIDTH);
        for (const itemLine of itemLines) {
          if (skillsY < 50) break;
          page.drawText(itemLine, { x: 20, y: skillsY, size: BODY_SIZE, font, color: LIGHT_GRAY });
          skillsY -= BODY_SIZE + 2;
        }
        skillsY -= 2;
      }
      skillsY -= 8;
    }
  }
}

// Template 4 Body Content Renderer - Professional style with sidebar
function renderBodyContentTemplate4(
  context: TemplateContext,
  y: number,
  mainLeft: number,
  mainWidth: number,
  bodySize: number,
  bodyLineHeight: number,
  sectionHeaderSize: number,
  sectionLineHeight: number,
  marginBottom: number,
  sidebarWidth: number,
  drawSidebar: (page: PDFPage, isFirstPage: boolean) => void
): number {
  const { font, fontBold, body, PAGE_HEIGHT, PAGE_WIDTH, pdfDoc } = context;
  const BLACK = COLORS.BLACK;
  const MEDIUM_GRAY = COLORS.MEDIUM_GRAY;
  const PROFESSIONAL_BLUE = rgb(0.2, 0.3, 0.5);
  
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
      const sectionLines = wrapText(sectionHeader, fontBold, sectionHeaderSize, mainWidth);
      for (const sectionLine of sectionLines) {
        if (y < marginBottom) {
          context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          drawSidebar(context.page, false);
          y = PAGE_HEIGHT - 72;
        }
        context.page.drawText(sectionLine, { x: mainLeft, y, size: sectionHeaderSize, font: fontBold, color: PROFESSIONAL_BLUE });
        y -= 6;
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
          
          const titleLines = wrapText(jobTitle.trim(), fontBold, bodySize + 1, mainWidth - 10);
          for (const titleLine of titleLines) {
            if (y < marginBottom) {
              context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
              drawSidebar(context.page, false);
              y = PAGE_HEIGHT - 72;
            }
            context.page.drawText(titleLine, { x: mainLeft + 10, y, size: bodySize + 1, font: fontBold, color: BLACK });
            y -= bodyLineHeight + 2;
          }
          
          const formattedPeriod = formatDate(period.trim());
          const companyPeriodLine = `${companyName.trim()} | ${formattedPeriod}`;
          const companyPeriodLines = wrapText(companyPeriodLine, font, bodySize, mainWidth - 10);
          for (const line of companyPeriodLines) {
            if (y < marginBottom) {
              context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
              drawSidebar(context.page, false);
              y = PAGE_HEIGHT - 72;
            }
            context.page.drawText(line, { x: mainLeft + 10, y, size: bodySize, font, color: MEDIUM_GRAY });
            y -= bodyLineHeight;
          }
          
          y -= 4;
        }
      } else {
        const wrapped = wrapTextWithIndent(line, font, bodySize, mainWidth - 10);
        for (let i = 0; i < wrapped.lines.length; i++) {
          if (y < marginBottom) {
            context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
            drawSidebar(context.page, false);
            y = PAGE_HEIGHT - 72;
          }
          const xPos = i === 0 ? mainLeft + 10 : mainLeft + 10 + wrapped.indentWidth;
          drawTextWithBold(context.page, wrapped.lines[i], xPos, y, font, fontBold, bodySize, BLACK);
          y -= bodyLineHeight;
        }
      }
    }
    
    if (y < marginBottom) {
      context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawSidebar(context.page, false);
      y = PAGE_HEIGHT - 72;
    }
  }
  
  return y;
}

// PROFESSIONAL TEMPLATE - Two-column layout with sidebar
export async function renderTemplate4(context: TemplateContext): Promise<Uint8Array> {
  const { pdfDoc, page, font, fontBold, name, email, phone, location, body, PAGE_WIDTH, PAGE_HEIGHT } = context;
  const BLACK = COLORS.BLACK;
  const MEDIUM_GRAY = COLORS.MEDIUM_GRAY;
  
  const MARGIN_TOP = 50;
  const MARGIN_BOTTOM = 50;
  const SIDEBAR_WIDTH = 180;
  const MAIN_LEFT = 200;
  const MAIN_RIGHT = 545;
  const MAIN_WIDTH = MAIN_RIGHT - MAIN_LEFT;
  const PROFESSIONAL_BLUE = rgb(0.2, 0.3, 0.5);
  
  const SECTION_HEADER_SIZE = 12;
  const BODY_SIZE = 9.5;
  const bodyLineHeight = BODY_SIZE * 1.4;
  const sectionLineHeight = SECTION_HEADER_SIZE * 1.5;
  
  // Parse body to separate skills from other content
  const bodyLines = body.split('\n');
  const mainContent: string[] = [];
  const skillsSections: { header: string; items: string[] }[] = [];
  let currentSkillsSection: { header: string; items: string[] } | null = null;
  let inSkillsSection = false;
  
  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i].trim();
    
    if (line.endsWith(':')) {
      const sectionHeader = line.slice(0, -1);
      const sectionHeaderLower = sectionHeader.toLowerCase();
      if (sectionHeaderLower.includes('skill') || sectionHeaderLower.includes('technical') || 
          sectionHeaderLower.includes('competenc') || sectionHeaderLower.includes('expertise') ||
          sectionHeaderLower.includes('proficienc') || sectionHeaderLower.includes('qualification')) {
        inSkillsSection = true;
        if (currentSkillsSection) {
          skillsSections.push(currentSkillsSection);
        }
        currentSkillsSection = { header: sectionHeader, items: [] };
      } else {
        inSkillsSection = false;
        if (currentSkillsSection) {
          skillsSections.push(currentSkillsSection);
          currentSkillsSection = null;
        }
        mainContent.push(line);
      }
    } else if (inSkillsSection && currentSkillsSection && line) {
      const skillItem = line.startsWith('·') ? line.slice(1).trim() : line;
      if (skillItem) {
        currentSkillsSection.items.push(skillItem);
      }
    } else if (line) {
      mainContent.push(line);
    } else {
      mainContent.push(line);
    }
  }
  
  if (currentSkillsSection) {
    skillsSections.push(currentSkillsSection);
  }
  
  // Draw sidebar on first page
  drawTemplate4Sidebar(page, font, fontBold, name, email, phone, location, PAGE_HEIGHT, SIDEBAR_WIDTH, true, skillsSections);
  
  // Create sidebar drawer function
  const drawSidebar = (pageToDraw: PDFPage, isFirstPage: boolean) => {
    drawTemplate4Sidebar(pageToDraw, font, fontBold, name, email, phone, location, PAGE_HEIGHT, SIDEBAR_WIDTH, isFirstPage, skillsSections);
  };
  
  // Render main content
  let y = PAGE_HEIGHT - MARGIN_TOP;
  
  for (let i = 0; i < mainContent.length; i++) {
    const line = mainContent[i].trim();
    if (!line) {
      y -= 6;
      continue;
    }
    
    if (line.endsWith(':')) {
      y -= 12;
      const sectionHeader = line.slice(0, -1);
      const sectionLines = wrapText(sectionHeader, fontBold, SECTION_HEADER_SIZE, MAIN_WIDTH);
      for (const sectionLine of sectionLines) {
        if (y < MARGIN_BOTTOM) {
          context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          drawSidebar(context.page, false);
          y = PAGE_HEIGHT - 72;
        }
        context.page.drawText(sectionLine, { x: MAIN_LEFT, y, size: SECTION_HEADER_SIZE, font: fontBold, color: PROFESSIONAL_BLUE });
        y -= 6;
        y -= sectionLineHeight;
      }
    } else {
      const isJobExperience = / at .+:.+/.test(line);
      
      if (isJobExperience) {
        const match = line.match(/^(.+?) at (.+?):\s*(.+)$/);
        if (match) {
          const [, jobTitle, companyName, period] = match;
          
          const titleLines = wrapText(jobTitle.trim(), fontBold, BODY_SIZE + 1, MAIN_WIDTH - 10);
          for (const titleLine of titleLines) {
            if (y < MARGIN_BOTTOM) {
              context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
              drawSidebar(context.page, false);
              y = PAGE_HEIGHT - 72;
            }
            context.page.drawText(titleLine, { x: MAIN_LEFT + 10, y, size: BODY_SIZE + 1, font: fontBold, color: BLACK });
            y -= bodyLineHeight + 2;
          }
          
          const formattedPeriod = formatDate(period.trim());
          const companyPeriodLine = `${companyName.trim()} | ${formattedPeriod}`;
          const companyPeriodLines = wrapText(companyPeriodLine, font, BODY_SIZE, MAIN_WIDTH - 10);
          for (const line of companyPeriodLines) {
            if (y < MARGIN_BOTTOM) {
              context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
              drawSidebar(context.page, false);
              y = PAGE_HEIGHT - 72;
            }
            context.page.drawText(line, { x: MAIN_LEFT + 10, y, size: BODY_SIZE, font, color: MEDIUM_GRAY });
            y -= bodyLineHeight;
          }
          
          y -= 4;
        }
      } else {
        const wrapped = wrapTextWithIndent(line, font, BODY_SIZE, MAIN_WIDTH - 10);
        for (let i = 0; i < wrapped.lines.length; i++) {
          if (y < MARGIN_BOTTOM) {
            context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
            drawSidebar(context.page, false);
            y = PAGE_HEIGHT - 72;
          }
          const xPos = i === 0 ? MAIN_LEFT + 10 : MAIN_LEFT + 10 + wrapped.indentWidth;
          drawTextWithBold(context.page, wrapped.lines[i], xPos, y, font, fontBold, BODY_SIZE, BLACK);
          y -= bodyLineHeight;
        }
      }
    }
    
    if (y < MARGIN_BOTTOM) {
      context.page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      drawSidebar(context.page, false);
      y = PAGE_HEIGHT - 72;
    }
  }
  
  return await pdfDoc.save();
}

