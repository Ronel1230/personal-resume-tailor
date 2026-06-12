import React from 'react';
import { Text } from '@react-pdf/renderer';

// Helper function to extract year from date string
export const extractYear = (dateStr) => {
  if (!dateStr) return '';
  const yearMatch = dateStr.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? yearMatch[0] : dateStr;
};

// Decode common HTML entities that might appear in AI output
const decodeHtmlEntities = (str) => {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"');
};

// Strip strong/b tags but keep the text inside (for fallback when tags are malformed)
const stripBoldTags = (str) => {
  return str
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong\s*>/gi, '$1')
    .replace(/<b[^>]*>([\s\S]*?)<\/b\s*>/gi, '$1')
    .replace(/<\/?strong[^>]*>/gi, '')
    .replace(/<\/?b[^>]*>/gi, '');
};

// Helper component to render text with bold tags
// Supports <strong>, </strong>, <b>, </b> (case-insensitive, with optional attributes) and **markdown**
export const BoldText = ({ text, style }) => {
  if (!text || typeof text !== 'string') return null;

  let normalized = decodeHtmlEntities(String(text));
  normalized = normalized
    .replace(/<b\b[^>]*>|<\/b\s*>/gi, (m) => (m.startsWith('</') ? '</strong>' : '<strong>'))
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  const hasBold = /<strong/i.test(normalized);
  if (!hasBold) {
    return <Text style={style}>{normalized}</Text>;
  }

  const parts = [];
  // Match <strong> or <strong attr="..."> and content until </strong>
  const regex = /<strong\b[^>]*>([\s\S]*?)<\/strong\s*>/gi;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      const normalText = normalized.substring(lastIndex, match.index);
      // Strip any tags that weren't matched (malformed) so they don't show
      parts.push({ type: 'normal', text: stripBoldTags(normalText) });
    }
    parts.push({ type: 'bold', text: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < normalized.length) {
    const normalText = normalized.substring(lastIndex);
    parts.push({ type: 'normal', text: stripBoldTags(normalText) });
  }

  if (parts.length === 0) {
    return <Text style={style}>{stripBoldTags(normalized)}</Text>;
  }

  // Use built-in bold font - react-pdf maps Helvetica->Helvetica-Bold, Times->Times-Bold
  const baseFont = (style && style.fontFamily) || 'Helvetica';
  const boldFont = baseFont.includes('Times') ? 'Times-Bold' : baseFont.includes('Courier') ? 'Courier-Bold' : 'Helvetica-Bold';
  const boldStyle = style ? [style, { fontFamily: boldFont }] : { fontFamily: boldFont };

  return (
    <Text style={style}>
      {parts.map((part, idx) =>
        part.type === 'bold' ? (
          <Text key={idx} style={boldStyle}>
            {part.text}
          </Text>
        ) : (
          part.text
        )
      )}
    </Text>
  );
};

