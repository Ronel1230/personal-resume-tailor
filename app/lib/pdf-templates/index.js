import ResumeTemplate from './ResumeTemplate';
import { ResumeTechTeal } from './templates/ResumeTechTeal';
import { ResumeModernGreen } from './templates/ResumeModernGreen';
import { ResumeCreativeBurgundy } from './templates/ResumeCreativeBurgundy';
import { ResumeBoldEmerald } from './templates/ResumeBoldEmerald';
import { ResumeCorporateSlate } from './templates/ResumeCorporateSlate';
import { ResumeExecutiveNavy } from './templates/ResumeExecutiveNavy';
import { ResumeClassicCharcoal } from './templates/ResumeClassicCharcoal';
import { ResumeConsultantSteel } from './templates/ResumeConsultantSteel';
import { ResumeAcademicPurple } from './templates/ResumeAcademicPurple';
import { ResumePlainClassic } from './templates/ResumePlainClassic';
import { ResumePlainLeft } from './templates/ResumePlainLeft';
import { ResumePlainSplit } from './templates/ResumePlainSplit';
import { ResumePlainMinimal } from './templates/ResumePlainMinimal';
import { ResumePlainBoxed } from './templates/ResumePlainBoxed';
import { ResumePhoto } from './templates/ResumePhoto';

// Template registry - maps template IDs to React components
const templates = {
  'Resume': ResumeTemplate,
  'Resume-Tech-Teal': ResumeTechTeal,
  'Resume-Modern-Green': ResumeModernGreen,
  'Resume-Creative-Burgundy': ResumeCreativeBurgundy,
  'Resume-Bold-Emerald': ResumeBoldEmerald,
  'Resume-Corporate-Slate': ResumeCorporateSlate,
  'Resume-Executive-Navy': ResumeExecutiveNavy,
  'Resume-Classic-Charcoal': ResumeClassicCharcoal,
  'Resume-Consultant-Steel': ResumeConsultantSteel,
  'Resume-Academic-Purple': ResumeAcademicPurple,
  'Resume-Plain-Classic': ResumePlainClassic,
  'Resume-Plain-Left': ResumePlainLeft,
  'Resume-Plain-Split': ResumePlainSplit,
  'Resume-Plain-Minimal': ResumePlainMinimal,
  'Resume-Plain-Boxed': ResumePlainBoxed,
  'Resume-Photo': ResumePhoto,
};

export const getTemplate = (templateId) => {
  // Default to 'Resume' if template not found
  const templateName = templateId || 'Resume';
  return templates[templateName] || templates['Resume'];
};

export default templates;

