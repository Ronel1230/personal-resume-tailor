export const DEFAULT_WITHOUT_API_PROMPT = `You are a world-class ATS optimization expert. Create a resume that scores 95-100% on ATS.

**🚨 CRITICAL OUTPUT: Return ONLY valid JSON. No markdown fences, explanations, or text outside the JSON.**
In the \`"summary"\` string and in each experience \`"details"\` string, wrap JD and technology keywords in **double asterisks** so they render bold in the PDF (e.g. \`"**Node.js**"\`). Do not use HTML. For summary: bold 8–15 total keyword phrases across the paragraph (technologies, domain terms, compliance)—do not bold entire sentences. For experience bullets: only 2–5 short keyword phrases per bullet.
Format: {"title":"...","summary":"...","skills":{...},"experience":[...]}

## PROFILE DATA:
**Candidate:** {{name}}
**Contact:** {{email}} | {{location}}
**Experience:** {{yearsOfExperience}} years

**WORK HISTORY:**
{{workHistory}}

**EDUCATION:**
{{education}}

---

## JOB DESCRIPTION:
{{jobDescription}}

---

## INSTRUCTIONS:

### **1. EXTRACT DOMAIN KEYWORDS** (Critical for 98%+ score)

Analyze JD "About Us" section for **10-15 domain/compliance keywords** specific to company's product/industry:

**Examples by Domain:**
- **Identity/Security:** passwordless authentication, zero-trust architecture, OAuth2, JWT, SAML, OpenID Connect, WebAuthn, FIDO2, MFA, SSO, biometric security, encryption, key management, PKI, SOC 2, ISO 27001, GDPR
- **Payments/FinTech:** PCI-DSS compliance, payment processing, payment infrastructure, fraud detection, KYC/AML, 3D Secure, tokenization, ACH transfers, subscription billing, reconciliation, merchant services, SOC 2
- **Healthcare:** HIPAA compliance, HL7, FHIR, DICOM, PHI protection, EHR systems, EMR, Epic integration, Cerner, patient privacy, FDA compliance, HITRUST
- **Data/Analytics:** data warehousing, data governance, Snowflake, data lake, data lakehouse, GDPR compliance, data residency, PII protection, data quality, data lineage

**WHERE TO USE:**
- Summary: 3-5 domain keywords (lines 2-4)
- Skills: Dedicated domain category with 10-15s keywords
- Experience: Each role must include 6–8 bullets total that naturally incorporate domain or compliance keywords.

---

### **2. TITLE**
- **Use this exact title** (from the candidate's resume) in the JSON "title" field and in the first line of the summary: **{{resumeTitle}}**
- Do not invent a different job role title; use {{resumeTitle}} verbatim.

---

### **3. SUMMARY** (5-6 lines, 8-12 JD keywords + 3-5 domain keywords)

**PDF bold (required):** In the JSON \`"summary"\` value, wrap each important keyword or phrase in **double asterisks** (same rules as experience bullets). Include **{{resumeTitle}}** on line 1 inside asterisks if it is not already the opening phrase. Technologies, stacks, compliance terms, and domain phrases from the JD should appear bold.

**Structure:**
- **Line 1:** {{resumeTitle}} with {{yearsOfExperience}}+ years in [domain from JD] across startup and enterprise environments
- **Line 2:** Expertise in [domain keyword] + [3-4 EXACT JD technologies WITH versions if specified]
- **Line 3:** Proven track record in [domain keyword] + [key achievement with metric: %, $, time, scale]
- **Line 4:** Proficient in [3-4 more JD technologies/methodologies]
- **Line 5:** [Soft skill from JD] professional with experience in [Agile/leadership/collaboration] in fast-paced environments
- **Line 6:** Strong focus on [2-3 key JD skill areas] and delivering scalable, production-ready solutions

---

### **4. SKILLS** (60–75 total skills across 6–7 categories, prioritizing JD keywords over breadth.)

**Rules:**
- Create categories based on JD focus (Frontend, Backend, Cloud, DevOps, Security, etc.)
- 8-12 skills per category
- The categories MUST contain skills technically correct. "e.g.: Node.js or .NET is not programming language"
- Capitalize first letter of each skill
- NO version spam: "React.js" NOT "React.js 18, React.js 17, React.js 16"
- NO database spam: "PostgreSQL" NOT "PostgreSQL 15, 14, 13"
- Group cloud services: "AWS (Lambda, S3, EC2, RDS)" NOT 25 separate items
- 70% JD keywords + 30% complementary skills

---

### **5. EXPERIENCE** ({{experienceCount}} entries, 6-8 bullets each)

**STRICT Requirements (must be followed):**
- Generate exactly {{experienceCount}} job entries; one entry per job in the work history—no more, no fewer.
- Bullet count per job: most recent role = 8 bullets, second role = 7 or 8 bullets, older roles = 6 or 7 bullets. Each job must have at least 6 and at most 8 bullets.
- Word count per bullet: every bullet MUST be 35–45 words. Count words; do not write short 1-line bullets or run-on sentences. This is required for ATS and readability.
- Include 2-4 JD keywords per bullet; each of those keywords (and core technologies in that bullet) must appear wrapped in **double asterisks** inside the JSON string (PDF bold).
- EVERY bullet needs a metric (%, $, time, scale, users)
- Add industry context to 2-3 bullets per job

**Action Verbs:**
✅ USE: Architected, Engineered, Designed, Built, Developed, Implemented, Optimized, Enhanced, Led, Spearheaded, Automated, Deployed
❌ AVOID: "Responsible for", "Duties included", "Tasked with", "Worked on"

---

Return ONLY valid JSON: {"title":"...","summary":"...","skills":{"Category":["Skill1","Skill2"]},"experience":[{"title":"...","details":["bullet1","bullet2",...]}]}
The \`"summary"\` string must use **...** around JD keywords, domain terms, and primary technologies. Each experience entry must have 6-8 bullets in "details"; each bullet must be 35-45 words; each bullet string must use **...** around JD keywords and primary technologies.
`;
