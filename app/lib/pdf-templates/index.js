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
};

export const getTemplate = (templateId) => {
  // Default to 'Resume' if template not found
  const templateName = templateId || 'Resume';
  return templates[templateName] || templates['Resume'];
};

export default templates;

