import { PDFDocument, PDFFont, PDFPage, RGB, rgb } from 'pdf-lib';

// Shared interface for template rendering
export interface TemplateContext {
  pdfDoc: PDFDocument;
  page: PDFPage;
  font: PDFFont;
  fontBold: PDFFont;
  name: string;
  email: string;
  phone: string;
  location: string;
  body: string;
  PAGE_WIDTH: number;
  PAGE_HEIGHT: number;
}

// Helper to parse resume text
export function parseResume(resumeText: string): {
  headline: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  body: string;
} {
  const lines = resumeText.split('\n');
  const info: string[] = [];
  let bodyStart = 0;
  for (let idx = 0; idx < lines.length; idx++) {
    if (lines[idx].trim()) info.push(lines[idx].trim());
    if (info.length === 6) {
      bodyStart = idx + 1;
      break;
    }
  }
  const [headline = '', name = '', email = '', phone = '', location = '', linkedin = ''] = info;
  while (bodyStart < lines.length && !lines[bodyStart].trim()) bodyStart++;
  const body = lines.slice(bodyStart).join('\n');
  return { headline, name, email, phone, location, linkedin, body };
}

// Helper to convert date format from MM/YYYY to MMM YYYY
export function formatDate(dateStr: string): string {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  if (dateStr.includes('–') || dateStr.includes('-')) {
    const parts = dateStr.split(/[–-]/).map(part => part.trim());
    return parts.map(part => {
      if (part.match(/^\d{2}\/\d{4}$/)) {
        const [month, year] = part.split('/');
        const monthIndex = parseInt(month) - 1;
        return `${monthNames[monthIndex]} ${year}`;
      }
      return part;
    }).join(' – ');
  } else if (dateStr.match(/^\d{2}\/\d{4}$/)) {
    const [month, year] = dateStr.split('/');
    const monthIndex = parseInt(month) - 1;
    return `${monthNames[monthIndex]} ${year}`;
  }

  return dateStr;
}

// Helper to wrap text within a max width
export function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
    const testWidth = font.widthOfTextAtSize(testLine, size);
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// Bullet character and indent
export const BULLET_CHAR = '•';
export const BULLET_INDENT = 10; // Indent before bullet from margin

// Helper to wrap bullet text with indent
export function wrapBulletText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): { lines: string[]; hasBullet: boolean } {
  // Detect if line starts with bullet-like characters
  const bulletMatch = text.match(/^[\-\·•]\s*/);
  const hasBullet = !!bulletMatch;
  
  // Remove the original bullet/dash if present
  const content = hasBullet ? text.slice(bulletMatch![0].length) : text;
  
  // For bullet lines, wrap content (accounting for bullet indent)
  const effectiveWidth = hasBullet ? maxWidth - BULLET_INDENT : maxWidth;
  const wrappedLines = wrapText(content, font, size, effectiveWidth);
  
  const lines: string[] = [];
  for (let i = 0; i < wrappedLines.length; i++) {
    if (i === 0 && hasBullet) {
      lines.push(BULLET_CHAR + '   ' + wrappedLines[i]); // 3 spaces after bullet
    } else if (hasBullet) {
      lines.push('     ' + wrappedLines[i]); // 5 spaces for continuation (aligns with text)
    } else {
      lines.push(wrappedLines[i]); // No indent for non-bullet text
    }
  }
  
  return { lines, hasBullet };
}

// Helper to draw text with bold segments (markdown **bold**)
export function drawTextWithBold(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  fontBold: PDFFont,
  size: number,
  color: RGB
) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  let offsetX = x;
  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      page.drawText(content, { x: offsetX, y, size, font: fontBold, color });
      offsetX += fontBold.widthOfTextAtSize(content, size);
    } else {
      page.drawText(part, { x: offsetX, y, size, font, color });
      offsetX += font.widthOfTextAtSize(part, size);
    }
  }
}

// Spacing constants
export const SPACING = {
  SECTION_GAP: 18,            // Space before a new section header
  AFTER_SECTION_HEADER: 14,   // Space after section header
  JOB_GAP: 14,                // Space between jobs
  AFTER_JOB_HEADER: 12,       // Space after job title + company line
  BULLET_LINE_HEIGHT: 1.5,    // Line height for bullets
  BULLET_GAP: 4,              // Extra space between bullets
  BEFORE_FIRST_BULLET: 4,     // Space before first bullet in a job
};

// Color constants
export const COLORS = {
  BLACK: rgb(0, 0, 0),
  MEDIUM_GRAY: rgb(0.4, 0.4, 0.4),
  LIGHT_GRAY: rgb(0.6, 0.6, 0.6),
  DARK_GRAY: rgb(0.25, 0.25, 0.25),
};
