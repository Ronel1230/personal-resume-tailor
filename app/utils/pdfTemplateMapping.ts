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
};

export function getWithoutApiTemplateId(pdfTemplate: number): string {
  return WITHOUT_API_TEMPLATE_MAP[pdfTemplate] || WITHOUT_API_TEMPLATE_MAP[1];
}
