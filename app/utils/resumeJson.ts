/** Shared JSON extraction / validation for manual paste flows. */

import { parse as jsoncParse, stripComments, type ParseError } from 'jsonc-parser';

const JSONC_OPTS = { allowTrailingComma: true };

export function extractJsonObjectString(raw: string | null | undefined): string | null {
  if (raw == null || typeof raw !== 'string') return null;
  let text = raw.trim();
  text = text.replace(/```json\s*/gi, '');
  text = text.replace(/```javascript\s*/gi, '');
  text = text.replace(/```\s*/g, '');
  text = text.replace(/^(here is|here's|this is|the json is):?\s*/gi, '');
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;
  return text.substring(firstBrace, lastBrace + 1).trim();
}

function looksLikeResumeObject(obj: unknown): obj is Record<string, unknown> {
  return (
    !!obj &&
    typeof obj === 'object' &&
    ('experience' in (obj as object) || 'title' in (obj as object) || 'summary' in (obj as object))
  );
}

function isEscapedStringQuote(s: string, i: number): boolean {
  let n = 0;
  for (let j = i - 1; j >= 0 && s[j] === '\\'; j--) n++;
  return n % 2 === 1;
}

export function escapeControlCharsInJsonStrings(s: string | null | undefined): string {
  if (s == null || s === '') return s ?? '';
  let out = '';
  let inString = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"') {
      if (inString && isEscapedStringQuote(s, i)) {
        out += c;
        continue;
      }
      inString = !inString;
      out += c;
      continue;
    }
    if (inString) {
      if (c === '\r') {
        if (s[i + 1] === '\n') {
          out += '\\n';
          i++;
        } else {
          out += '\\n';
        }
        continue;
      }
      if (c === '\n') {
        out += '\\n';
        continue;
      }
      if (c === '\t') {
        out += '\\t';
        continue;
      }
      const code = c.charCodeAt(0);
      if (code < 0x20) {
        out += `\\u${code.toString(16).padStart(4, '0')}`;
        continue;
      }
    }
    out += c;
  }
  return out;
}

function tryJsoncParse(s: string) {
  const errList: ParseError[] = [];
  const parsed = jsoncParse(s, errList, JSONC_OPTS);
  if (looksLikeResumeObject(parsed) && (parsed.experience == null || Array.isArray(parsed.experience))) {
    return { ok: true as const, data: parsed };
  }
  return { ok: false as const };
}

export function parseResumeJsonString(jsonStr: string | null | undefined) {
  if (!jsonStr) return { ok: false as const, error: 'empty' };

  let lastMsg = 'parse failed';
  const tryJson = (s: string) => {
    try {
      return { ok: true as const, data: JSON.parse(s) as Record<string, unknown> };
    } catch (e) {
      lastMsg = e instanceof Error ? e.message : 'parse failed';
      return { ok: false as const };
    }
  };

  const normalized = jsonStr.replace(/^\uFEFF/, '');
  const variants = [
    normalized,
    normalized.replace(/,(\s*[}\]])/g, '$1'),
    escapeControlCharsInJsonStrings(normalized),
    escapeControlCharsInJsonStrings(normalized).replace(/,(\s*[}\]])/g, '$1'),
  ];

  for (const raw of variants) {
    const r = tryJson(raw);
    if (r.ok) return r;
  }

  for (const raw of variants) {
    const noComments = stripComments(raw);
    const j = tryJsoncParse(noComments);
    if (j.ok) return j;
    const deCurly = noComments.replace(/\u201c/g, '"').replace(/\u201d/g, '"');
    if (deCurly !== noComments) {
      const j2 = tryJsoncParse(deCurly);
      if (j2.ok) return j2;
    }
  }

  return { ok: false as const, error: lastMsg };
}
