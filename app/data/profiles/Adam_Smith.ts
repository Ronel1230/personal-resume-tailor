import { BaseResumeProfile } from '../baseResumes';

export const profile: BaseResumeProfile = {
  name: "Adam Smith",
  resumeText: `Senior Software Engineer
Adam Smith
adam.smith.920831@gmail.com

(626) 709-2731
Fort Worth, TX, US

Summary:
Full Stack Developer with 10+ years of experience building scalable, high-performance applications using React, Next.js, Node.js, and modern cloud-native architectures. Skilled in designing robust APIs, integrating AI-driven features with Python frameworks, and optimizing performance across the stack. Strong background in cloud deployment, CI/CD automation, security best practices, and delivering measurable engineering impact through maintainable, high-quality code.

Education:
Master's in Computer Science — Argosy University, 2014

Technical Skills:
• Frontend: React.js, Next.js, Angular, Vue.js, TypeScript, Redux Toolkit, RxJS, Tailwind CSS, Material-UI, WCAG, Component Architecture
• Backend: Node.js (Express, NestJS), Python (FastAPI, Django), PHP (Laravel), REST & GraphQL APIs, AWS Lambda
• Databases: PostgreSQL, MySQL, MongoDB, DynamoDB, Redis, Prisma, Sequelize
• AI & Integrations: OpenAI API, LangChain, Pinecone, Hugging Face, FAISS, Vector Databases, RAG Pipelines
• Testing: Jest, Cypress, Playwright, Storybook, Supertest, Unit & e2e Automation
• DevOps & Cloud: AWS, Azure, Docker, GitHub Actions, CI/CD, Nginx, CDN Optimization, CloudFront
• Performance & Security: Caching, Load Balancing, Core Web Vitals, OAuth2, JWT, CSRF/XSS Mitigation
• Methodologies: Agile (Scrum/Kanban), TDD, CI/CD Automation, Cross-functional Collaboration

Work Experience:

Senior Software Developer at Cargo Express Freight: Dec 2023 – Present
• Architected and developed a comprehensive shipment tracking platform using React 18, Next.js 14, and NestJS microservices, providing real-time visibility for 50,000+ daily shipments across 200+ carrier integrations.
• Designed an AI-powered route optimization engine using OpenAI APIs and custom machine learning models, reducing average delivery times by 18% and fuel costs by 12% through intelligent dispatch recommendations.
• Built real-time shipment status streaming using WebSockets, Redis pub/sub, and AWS EventBridge, enabling instant notifications for 15,000+ concurrent users with automatic failover and reconnection handling.
• Implemented a driver mobile companion app backend using NestJS and GraphQL subscriptions, supporting offline-first sync for proof-of-delivery photos, signatures, and GPS tracking data.
• Designed PostgreSQL database schema with TimescaleDB extension for time-series shipment telemetry, implementing efficient partitioning and retention policies for 500M+ daily location events.
• Led frontend performance optimization initiative achieving 95+ Lighthouse scores through lazy loading, image optimization with Next.js Image component, and strategic code splitting.
• Established comprehensive testing strategy with Jest unit tests, Cypress E2E tests, and Playwright visual regression, maintaining 90% coverage while reducing regression bugs by 55%.
• Mentored 5 mid-level engineers through architecture design sessions, code reviews, and pair programming, helping 2 team members advance to senior positions.

Senior Software Engineer at Snapsheet: Aug 2018 – Sep 2023
• Led development of a cloud-based insurance claims processing platform using React, TypeScript, and Node.js/Express, handling 100,000+ monthly claims with automated damage assessment workflows.
• Architected a photo-based vehicle damage estimation system integrating computer vision APIs, reducing claims processing time from 5 days to 4 hours through automated initial assessments.
• Built scalable REST APIs using Express.js and PostgreSQL with Sequelize ORM, implementing connection pooling, query optimization, and horizontal read replicas to handle 5x traffic growth.
• Implemented Redis-based distributed caching and session management, reducing database load by 60% and achieving sub-100ms API response times for frequently accessed claim data.
• Designed event-driven architecture using AWS SQS and Lambda for asynchronous claim document processing, OCR extraction, and fraud detection scoring.
• Developed a white-label partner portal framework using React with dynamic theming and configuration-driven UI, onboarding 15+ insurance carrier partners with zero code changes.
• Expanded automated testing infrastructure using Jest, React Testing Library, and Cypress, reducing production defects by 40% and enabling confident weekly releases.
• Implemented OAuth2/JWT authentication with Auth0 integration, supporting SSO for enterprise clients and RBAC for 50+ distinct permission combinations.
• Containerized all microservices using Docker with multi-stage builds, orchestrating deployments through GitHub Actions and AWS ECS with blue-green deployment strategy.
• Led migration from class-based React to functional components with hooks, improving code maintainability and reducing bundle size by 25%.

Software Engineer at Microsoft: May 2016 – Jul 2018
• Developed internal analytics dashboards for Azure DevOps using React, TypeScript, and Node.js, visualizing CI/CD pipeline metrics for 10,000+ development teams worldwide.
• Built RESTful API services using Node.js/Express with SQL Server backend, aggregating build and deployment data from distributed telemetry systems processing 1B+ events daily.
• Implemented scheduled data aggregation jobs using Azure Functions and Cosmos DB, generating hourly/daily rollups for performance trend analysis and capacity planning.
• Integrated Azure Active Directory authentication with MSAL.js, implementing secure token management and role-based access controls for internal enterprise applications.
• Optimized SQL queries and implemented strategic indexing, reducing dashboard load times from 30 seconds to under 3 seconds for complex multi-dimensional reports.
• Created reusable React component library with comprehensive TypeScript types, documented in Storybook and adopted across 5 internal teams.
• Collaborated with UX research team to implement accessibility improvements achieving WCAG 2.0 AA compliance across all dashboard interfaces.
• Participated in on-call rotation for production systems, developing expertise in Azure Application Insights, Log Analytics, and incident response procedures.

Junior Web Developer at The Zebra: Jul 2014 – Apr 2016
• Built responsive customer-facing insurance comparison interfaces using JavaScript, jQuery, and Handlebars.js templating, supporting 2M+ monthly quote requests.
• Developed Node.js/Express backend services for insurance rate API integrations, implementing retry logic, rate limiting, and graceful degradation for 30+ carrier connections.
• Created A/B testing framework infrastructure using JavaScript and Google Analytics, enabling marketing team to run experiments that improved conversion rates by 15%.
• Implemented form validation and multi-step wizard workflows using jQuery and custom JavaScript, reducing form abandonment rates by 20%.
• Optimized page load performance through asset bundling with Grunt, image compression, and lazy loading techniques, improving Time to Interactive by 40%.
• Built MySQL database queries and stored procedures for customer data reporting, learning relational database design and normalization principles.
• Collaborated with senior engineers on REST API design and documentation, gaining experience with Swagger/OpenAPI specifications.
• Participated in Agile ceremonies including sprint planning, daily standups, and retrospectives, contributing to team velocity tracking and process improvements.
• Resolved production bugs through systematic debugging, log analysis, and cross-browser testing, developing strong troubleshooting skills.\``,
  pdfTemplate: 2
};
