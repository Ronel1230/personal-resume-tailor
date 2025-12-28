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

  // Handle different date formats
  if (dateStr.includes('–') || dateStr.includes('-')) {
    // Split by dash and format each part
    const parts = dateStr.split(/[–-]/).map(part => part.trim());
    return parts.map(part => {
      if (part.match(/^\d{2}\/\d{4}$/)) {
        const [month, year] = part.split('/');
        const monthIndex = parseInt(month) - 1;
        return `${monthNames[monthIndex]} ${year}`;
      }
      return part; // Return as-is if not in MM/YYYY format
    }).join(' – ');
  } else if (dateStr.match(/^\d{2}\/\d{4}$/)) {
    // Single date in MM/YYYY format
    const [month, year] = dateStr.split('/');
    const monthIndex = parseInt(month) - 1;
    return `${monthNames[monthIndex]} ${year}`;
  }

  return dateStr; // Return as-is if not in expected format
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

// Bullet character - small bullet point
export const BULLET_CHAR = '•';
export const BULLET_INDENT = 12; // Space after bullet before text starts
export const HANGING_INDENT = 8; // Additional indent for wrapped lines

// Helper to wrap text with proper indentation for bullet points
export function wrapTextWithIndent(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): { lines: string[]; prefix: string; indentWidth: number; hasBullet: boolean } {
  // Detect if line starts with bullet-like characters
  const bulletMatch = text.match(/^[\-\·•]\s*/);
  const hasBullet = !!bulletMatch;
  
  // Remove the original bullet/dash if present
  const content = hasBullet ? text.slice(bulletMatch![0].length) : text;
  
  // Calculate the hanging indent for wrapped lines
  const bulletWidth = hasBullet ? font.widthOfTextAtSize(BULLET_CHAR + ' ', size) : 0;
  const hangingIndent = hasBullet ? bulletWidth + HANGING_INDENT : 0;
  
  // Wrap the content - first line gets full width minus bullet, continuation lines get less
  const firstLineWidth = maxWidth - bulletWidth;
  const continuationWidth = maxWidth - hangingIndent;
  
  const lines: string[] = [];
  const words = content.split(' ');
  let currentLine = '';
  let isFirstLine = true;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
    const currentMaxWidth = isFirstLine ? firstLineWidth : continuationWidth;
    const testWidth = font.widthOfTextAtSize(testLine, size);
    
    if (testWidth > currentMaxWidth && currentLine) {
      if (isFirstLine && hasBullet) {
        lines.push(BULLET_CHAR + '  ' + currentLine);
      } else {
        lines.push(currentLine);
      }
      currentLine = words[i];
      isFirstLine = false;
    } else {
      currentLine = testLine;
    }
  }
  
  // Add the last line
  if (currentLine) {
    if (isFirstLine && hasBullet) {
      lines.push(BULLET_CHAR + '  ' + currentLine);
    } else {
      lines.push(currentLine);
    }
  }
  
  return {
    lines,
    prefix: hasBullet ? BULLET_CHAR + '  ' : '',
    indentWidth: hangingIndent,
    hasBullet
  };
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
  // Split by ** for bold
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

// Spacing constants for consistent layout
export const SPACING = {
  SECTION_GAP: 16,           // Space before a new section
  AFTER_SECTION_HEADER: 10,  // Space after section header line
  JOB_GAP: 12,               // Space between jobs
  AFTER_JOB_TITLE: 2,        // Space after job title before company
  AFTER_COMPANY: 6,          // Space after company/period before bullets
  BULLET_LINE_HEIGHT: 1.45,  // Line height multiplier for bullet text
  BODY_LINE_HEIGHT: 1.4,     // General body line height multiplier
};

// Color constants
export const COLORS = {
  BLACK: rgb(0, 0, 0),
  MEDIUM_GRAY: rgb(0.4, 0.4, 0.4),
  LIGHT_GRAY: rgb(0.6, 0.6, 0.6),
  DARK_GRAY: rgb(0.3, 0.3, 0.3),
  SUBTLE_GRAY: rgb(0.55, 0.55, 0.55),
};
