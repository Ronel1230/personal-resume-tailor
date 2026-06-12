declare module '@/app/lib/pdf-templates' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function getTemplate(templateId: string): React.ComponentType<{ data: any }> | undefined;
}

declare module '@/app/lib/pdf-templates/index.js' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function getTemplate(templateId: string): React.ComponentType<{ data: any }> | undefined;
}
