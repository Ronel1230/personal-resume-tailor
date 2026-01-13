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

// Helper to normalize bold markers - fix newlines and extra whitespace inside **...**
export function normalizeBoldMarkers(text: string): string {
  // Step 1: Match **...** patterns that may contain newlines or extra whitespace
  // and normalize the content inside them
  let normalized = text.replace(/\*\*([^*]*(?:\*(?!\*)[^*]*)*)\*\*/g, (match, content) => {
    // Replace newlines and multiple spaces with a single space
    const cleanContent = content.replace(/\s+/g, ' ').trim();
    if (!cleanContent) return ''; // Remove empty bold markers
    return `**${cleanContent}**`;
  });
  
  // Step 2: Remove orphaned/unbalanced ** markers
  // Count pairs and remove unmatched ones
  const parts = normalized.split('**');
  if (parts.length % 2 === 0) {
    // Odd number of ** markers means unbalanced - remove trailing orphan
    // Reconstruct by pairing: text, bold, text, bold, ... , text, orphan-text
    const result: string[] = [];
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Regular text
        result.push(parts[i]);
      } else if (i < parts.length - 1) {
        // Bold text (has closing **)
        result.push(`**${parts[i]}**`);
      } else {
        // Last part after orphan ** - just append without markers
        result.push(parts[i]);
      }
    }
    normalized = result.join('');
  }
  
  return normalized;
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
  // First normalize bold markers in the entire text
  const normalizedText = normalizeBoldMarkers(resumeText);
  const lines = normalizedText.split('\n');
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

// Non-breaking space used to protect spaces inside bold markers during wrapping
const NBSP = '\u00A0';

// Helper to wrap text within a max width
// This function keeps **bold text** markers together (won't split across lines)
export function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  // Step 1: Protect spaces inside **...** by replacing with non-breaking space
  // This ensures bold phrases stay together when splitting by space
  const protectedText = text.replace(/\*\*([^*]+)\*\*/g, (match, content) => {
    return '**' + content.replace(/ /g, NBSP) + '**';
  });
  
  const words = protectedText.split(' ').filter(w => w);
  const lines: string[] = [];
  let currentLine = '';
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? currentLine + ' ' + word : word;
    // Calculate width without ** markers for accurate measurement
    const testWidth = font.widthOfTextAtSize(testLine.replace(/\*\*/g, ''), size);
    
    if (testWidth > maxWidth && currentLine) {
      // Restore regular spaces and push the line
      lines.push(currentLine.replace(new RegExp(NBSP, 'g'), ' '));
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine.replace(new RegExp(NBSP, 'g'), ' '));
  }
  
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
  // First normalize the text to fix any malformed bold markers
  const normalizedText = normalizeBoldMarkers(text);
  
  // Split by **...** pattern, keeping the delimiters
  // This regex captures bold markers as separate array elements
  const parts = normalizedText.split(/(\*\*[^*]+\*\*)/g).filter(part => part !== '');
  
  let offsetX = x;
  for (const part of parts) {
    if (!part) continue;
    
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      // Bold text - extract content without markers
      const content = part.slice(2, -2);
      if (content) {
        page.drawText(content, { x: offsetX, y, size, font: fontBold, color });
        offsetX += fontBold.widthOfTextAtSize(content, size);
      }
    } else {
      // Regular text - also clean up any stray ** that might have slipped through
      const cleanPart = part.replace(/\*\*/g, '');
      if (cleanPart) {
        page.drawText(cleanPart, { x: offsetX, y, size, font, color });
        offsetX += font.widthOfTextAtSize(cleanPart, size);
      }
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
