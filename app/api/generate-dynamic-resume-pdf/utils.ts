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
  linkedin: string;
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

// Patterns to classify contact header lines (phone optional)
function looksLikeEmail(line: string): boolean {
  return /@/.test(line) && /^[^\s@]+@[^\s@]+\.[^\s@]+/.test(line.trim());
}
function looksLikePhone(line: string): boolean {
  const digits = line.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15 && /^[\d\s+\-().]+$/.test(line.trim());
}
function looksLikeLinkedIn(line: string): boolean {
  return /linkedin\.com/i.test(line);
}

/** Experience lines in this app look like "Role at Company: dates" */
function looksLikeJobLine(line: string): boolean {
  return /^.+?\s+at\s+.+\s*:\s*/.test(line.trim());
}

/** First line of resume body (section, bullet, or job row) — not a contact continuation */
function looksLikeBodyStart(line: string): boolean {
  const t = line.trim();
  if (!t) return false;
  if (/^[\-\·•]\s/.test(t)) return true;
  if (looksLikeJobLine(t)) return true;
  // Short section title ending with colon, e.g. "Experience:" or "EXPERIENCE:"
  if (t.length <= 50 && /^[A-Za-z]/.test(t) && /:\s*$/.test(t)) return true;
  return false;
}

// Helper to parse resume text. Header: headline, name, then 2–4 contact lines in any order.
// Contact lines are classified by content (email, phone, location, linkedin). Phone is optional.
export function parseResume(resumeText: string): {
  headline: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  body: string;
} {
  const normalizedText = normalizeBoldMarkers(resumeText);
  const lines = normalizedText.split('\n');
  const info: string[] = [];
  let bodyStart = 0;
  for (let idx = 0; idx < lines.length; idx++) {
    const trimmed = lines[idx].trim();
    if (!trimmed) continue;

    info.push(trimmed);

    // Header: 2 fixed (headline, name) + 2–4 contact lines (max 6 info lines total)
    if (info.length < 4) continue;

    if (info.length >= 6) {
      bodyStart = idx + 1;
      break;
    }

    // At 4–5 lines we may still have another contact row (e.g. LinkedIn on its own line).
    let j = idx + 1;
    while (j < lines.length && !lines[j].trim()) j++;
    if (j < lines.length) {
      const next = lines[j].trim();
      if (looksLikeEmail(next) || looksLikePhone(next) || looksLikeLinkedIn(next)) {
        continue;
      }
      if (info.length < 6 && !looksLikeBodyStart(next)) {
        continue;
      }
    }

    bodyStart = idx + 1;
    break;
  }
  const headline = info[0] ?? '';
  const name = info[1] ?? '';
  const contactLines = info.slice(2); // remaining header lines

  let email = '';
  let phone = '';
  let linkedin = '';
  const locationParts: string[] = [];

  for (const line of contactLines) {
    if (looksLikeEmail(line)) email = line;
    else if (looksLikePhone(line)) phone = line;
    else if (looksLikeLinkedIn(line)) linkedin = line;
    else locationParts.push(line);
  }
  const location = locationParts.join('  |  ').trim();

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
/** Small fixed indent for skills section continuation lines (points) */
export const SKILL_CONTINUATION_INDENT = 12;

// Split a paragraph into bullet-sized sentences (for experience when model omits bullets)
export function splitIntoBulletLines(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  // Already looks like a single bullet (starts with bullet char)
  if (/^[\-\·•]\s/.test(trimmed)) return [trimmed];
  // Split on period followed by space and capital letter (sentence boundary)
  const sentences = trimmed.split(/(?<=\.)\s+(?=[A-Z])/).map((s) => s.trim()).filter(Boolean);
  if (sentences.length <= 1) return [trimmed];
  return sentences.map((s) => (s.match(/^[\-\·•]\s/) ? s : BULLET_CHAR + ' ' + s));
}

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

// Helper to draw text with bold segments (markdown **bold**) — used for skills category labels only
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
  const normalizedText = normalizeBoldMarkers(text);
  const parts = normalizedText.split(/(\*\*[^*]+\*\*)/g).filter(part => part !== '');

  let offsetX = x;
  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const content = part.slice(2, -2);
      if (content) {
        page.drawText(content, { x: offsetX, y, size, font: fontBold, color });
        offsetX += fontBold.widthOfTextAtSize(content, size);
      }
    } else {
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
  EDUCATION_GAP: 10,          // Space between education entries
};

// Helper to parse education line
// Supports formats like:
// - "Master's in Computer Science — Argosy University, 2014"
// - "Bachelor's degree in Computer Science - University of Texas, 2010 - 2014"
// - "Master's degree in Data Science - Arizona State University, 2019"
// - "Bachelor's Degree in Computer Science, University of Barcelona, 2019" (comma-separated)
export function parseEducationLine(line: string): { degree: string; institution: string; year: string } | null {
  // First, extract year(s) from the end of the line
  const yearMatch = line.match(/,?\s*(\d{4}(?:\s*[-–—]\s*\d{4})?)\s*$/);
  if (!yearMatch) return null;
  
  const year = yearMatch[1].trim();
  const beforeYear = line.slice(0, line.length - yearMatch[0].length).trim();
  
  // Try pattern with dash/em-dash/en-dash separator: "Degree — Institution" or "Degree - Institution"
  const dashMatch = beforeYear.match(/^(.+?)\s*[—\-–]\s*(.+)$/);
  if (dashMatch) {
    return {
      degree: dashMatch[1].trim(),
      institution: dashMatch[2].trim().replace(/,\s*$/, ''),
      year
    };
  }
  
  // Try comma-separated format: "Degree, Institution" (find last comma as separator)
  const lastCommaIndex = beforeYear.lastIndexOf(',');
  if (lastCommaIndex > 0) {
    const degree = beforeYear.slice(0, lastCommaIndex).trim();
    const institution = beforeYear.slice(lastCommaIndex + 1).trim();
    // Only accept if both parts are non-empty and institution looks reasonable
    if (degree && institution && institution.length > 2) {
      return { degree, institution, year };
    }
  }
  
  return null;
}

// Check if we're in education section
export function isEducationSection(sectionName: string): boolean {
  const lower = sectionName.toLowerCase();
  return lower.includes('education') || lower.includes('academic');
}

// Color constants
export const COLORS = {
  BLACK: rgb(0, 0, 0),
  MEDIUM_GRAY: rgb(0.4, 0.4, 0.4),
  LIGHT_GRAY: rgb(0.6, 0.6, 0.6),
  DARK_GRAY: rgb(0.25, 0.25, 0.25),
};
