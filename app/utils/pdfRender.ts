import React from 'react';
import { renderToStream } from '@react-pdf/renderer';

export async function renderPdfBuffer(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TemplateComponent: React.ComponentType<{ data: any }>,
  templateData: unknown
) {
  const doc = React.createElement(TemplateComponent, { data: templateData });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stream = await renderToStream(doc as any);
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
