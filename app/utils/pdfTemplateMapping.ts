/** Maps pdfTemplate number (1-10) to React-PDF template IDs for Without API mode. */
export const WITHOUT_API_TEMPLATE_MAP: Record<number, string> = {
  1: 'Resume',
  2: 'Resume-Tech-Teal',
  3: 'Resume-Modern-Green',
  4: 'Resume-Creative-Burgundy',
  5: 'Resume-Bold-Emerald',
  6: 'Resume-Corporate-Slate',
  7: 'Resume-Executive-Navy',
  8: 'Resume-Classic-Charcoal',
  9: 'Resume-Consultant-Steel',
  10: 'Resume-Academic-Purple',
  11: 'Resume-Plain-Classic',
  12: 'Resume-Plain-Left',
  13: 'Resume-Plain-Split',
  14: 'Resume-Plain-Minimal',
  15: 'Resume-Plain-Boxed',
  16: 'Resume-Photo',
};

// Sentinel "template" that means: generate one resume for every real template.
// Must be a truthy number outside the 1..16 range (the route uses
// `profile.pdfTemplate || 1`, so 0 would collapse to template 1).
export const ALL_TEMPLATES_VALUE = 17;

// Every concrete template number, in order — what "All Templates" expands to.
export const ALL_TEMPLATE_NUMBERS: number[] = Object.keys(WITHOUT_API_TEMPLATE_MAP)
  .map(Number)
  .sort((a, b) => a - b);

export const WITHOUT_API_TEMPLATE_LABELS: Record<number, string> = {
  1: 'Classic Professional — centered black header',
  2: 'Teal Banner — full-width teal header band',
  3: 'Modern Green — green sidebar stripe',
  4: 'Creative Burgundy — burgundy filled section labels',
  5: 'Bold Emerald — large name, emerald left-bar sections',
  6: 'Corporate Slate — split header, gray boxed sections',
  7: 'Executive Navy — navy banner, gold double-rule sections',
  8: 'Classic Charcoal — serif, charcoal accent-line sections',
  9: 'Consultant Steel — steel-blue split header, 2-col skills',
  10: 'Academic Purple — purple underline sections, formal centered',
  11: 'Plain Classic — black & white, centered header',
  12: 'Plain Left — black & white, left-aligned header',
  13: 'Plain Split — black & white, name left / contact right',
  14: 'Plain Minimal — black & white, borderless section labels',
  15: 'Plain Boxed — black & white, light-grey boxed sections',
  16: 'Photo — header with profile photo (upload below)',
  [ALL_TEMPLATES_VALUE]: 'All Templates — generate one resume per template',
};

export type ExperienceMetaMode = 'project' | 'keySkills' | 'none';

// What the per-job meta line (the `project` field) should be for a given
// template — must stay in sync with each template's `experienceMeta` config:
//   Templates 4-6  → a "Key Skills" comma list
//   Templates 7-10 → nothing (line is hidden)
//   everything else → the classic "Project" sentence
export function getExperienceMetaMode(pdfTemplate: number): ExperienceMetaMode {
  if (pdfTemplate >= 4 && pdfTemplate <= 6) return 'keySkills';
  if (pdfTemplate >= 7 && pdfTemplate <= 10) return 'none';
  return 'project';
}

export function getWithoutApiTemplateId(pdfTemplate: number): string {
  return WITHOUT_API_TEMPLATE_MAP[pdfTemplate] || WITHOUT_API_TEMPLATE_MAP[1];
}

export function getWithoutApiTemplateLabel(pdfTemplate: number): string {
  return WITHOUT_API_TEMPLATE_LABELS[pdfTemplate] || WITHOUT_API_TEMPLATE_LABELS[1];
}
