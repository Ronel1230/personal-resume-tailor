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

export type ResumeShapeValidation = { ok: true } | { ok: false; reason: string };

/** Detect obviously truncated/incomplete paste before or after JSON extraction. */
export function detectTruncatedPaste(raw: string, jsonStr: string | null): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return 'Pasted response is empty.';

  if (!jsonStr) {
    if (trimmed.includes('{')) {
      return 'Response looks truncated — could not find a complete JSON object. Copy the full LLM response including the closing brace.';
    }
    return 'No JSON object found. Paste the full JSON block from the LLM.';
  }

  let depth = 0;
  let inString = false;
  for (let i = 0; i < jsonStr.length; i++) {
    const c = jsonStr[i];
    if (c === '"') {
      if (!isEscapedStringQuote(jsonStr, i)) inString = !inString;
      continue;
    }
    if (inString) continue;
    if (c === '{') depth++;
    else if (c === '}') depth--;
  }
  if (depth !== 0) {
    return 'JSON appears incomplete (unbalanced braces). Copy the entire LLM response.';
  }

  if (trimmed.endsWith(',') || trimmed.endsWith(':') || /,\s*$/.test(trimmed)) {
    return 'Response ends abruptly — the paste looks cut off. Copy the complete JSON.';
  }

  return null;
}

export function validateResumeShape(
  resumeContent: Record<string, unknown>,
  expectedExperienceCount: number
): ResumeShapeValidation {
  if (!resumeContent || typeof resumeContent !== 'object') {
    return { ok: false, reason: 'Response is not a valid resume JSON object.' };
  }

  const title = resumeContent.title;
  const summary = resumeContent.summary;
  const skills = resumeContent.skills;
  const experience = resumeContent.experience;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return { ok: false, reason: 'Missing or empty "title" field.' };
  }
  if (!summary || typeof summary !== 'string' || !summary.trim()) {
    return { ok: false, reason: 'Missing or empty "summary" field.' };
  }
  if (typeof summary === 'string' && summary.trim().length < 80) {
    return {
      ok: false,
      reason: `Summary is too short (${summary.trim().length} chars). The response may be incomplete — expected a full multi-line summary.`,
    };
  }
  if (!skills || typeof skills !== 'object' || Array.isArray(skills)) {
    return { ok: false, reason: 'Missing or invalid "skills" object.' };
  }
  const skillEntries = Object.entries(skills as Record<string, unknown>);
  if (skillEntries.length === 0) {
    return { ok: false, reason: 'Skills section is empty. The response may be incomplete.' };
  }
  const totalSkills = skillEntries.reduce((n, [, list]) => {
    if (!Array.isArray(list)) return n;
    return n + list.filter((s) => typeof s === 'string' && s.trim()).length;
  }, 0);
  if (totalSkills < 8) {
    return {
      ok: false,
      reason: `Only ${totalSkills} skills found. The response may be incomplete — expected a full skills section.`,
    };
  }
  if (!experience) {
    return { ok: false, reason: 'Missing "experience" array.' };
  }
  if (!Array.isArray(experience)) {
    return { ok: false, reason: '"experience" must be an array.' };
  }
  if (experience.length !== expectedExperienceCount) {
    return {
      ok: false,
      reason: `Expected ${expectedExperienceCount} job entries in "experience" but found ${experience.length}. Copy the complete LLM response — yours may be cut off.`,
    };
  }

  const minBulletsPerJob = 3;
  for (let i = 0; i < experience.length; i++) {
    const exp = experience[i] as Record<string, unknown> | null;
    if (!exp || typeof exp !== 'object') {
      return { ok: false, reason: `experience[${i}] is missing or invalid.` };
    }
    if (!Array.isArray(exp.details)) {
      return { ok: false, reason: `experience[${i}] is missing a "details" bullet list.` };
    }
    const bullets = exp.details.filter((d) => typeof d === 'string' && d.trim().length > 0);
    if (bullets.length === 0) {
      return {
        ok: false,
        reason: `experience[${i}] has no bullets. The response is incomplete for job ${i + 1}.`,
      };
    }
    if (bullets.length < minBulletsPerJob) {
      return {
        ok: false,
        reason: `experience[${i}] has only ${bullets.length} bullet(s) — expected at least ${minBulletsPerJob}. The response may be truncated.`,
      };
    }
    for (let j = 0; j < bullets.length; j++) {
      const bullet = bullets[j] as string;
      if (bullet.length < 20) {
        return {
          ok: false,
          reason: `experience[${i}] bullet ${j + 1} looks cut off ("${bullet.slice(0, 40)}…"). Copy the full LLM response.`,
        };
      }
    }
  }

  return { ok: true };
}
