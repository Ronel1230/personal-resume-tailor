import { BaseResumeProfile } from '../baseResumes';

export const profile: BaseResumeProfile = {
  name: "Michael Kleinhandler",
  resumeText: `Senior Software Engineer
Michael Kleinhandler
michael.kleinhandler97@outlook.com

(526) 309-1335
Durham, CA, US

Summary:
Full Stack Developer with 5+ years of experience building scalable, high-performance applications using React, Next.js, Node.js, and modern cloud-native architectures. Skilled in designing robust APIs, integrating AI-driven features with Python frameworks, and optimizing performance across the stack. Strong background in cloud deployment, CI/CD automation, security best practices, and delivering measurable engineering impact through maintainable, high-quality code.

Education:
Bachelor's degree in Computer Science — University of North Carolina at Charlotte, 2018 - 2020
Bachelor's degree in Computer Science — University of North Carolina Wilmington, 2016 - 2018

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

Senior Full Stack Developer at Fidelity Investments: Jan 2023 – Present
• Led development of a customer wealth management dashboard using React 18, Next.js 14, and NestJS, providing real-time portfolio analytics and investment recommendations to 500,000+ retail investors.
• Architected an AI-powered financial planning assistant using OpenAI GPT-4 APIs, LangChain orchestration, and Pinecone vector embeddings, enabling natural language goal-setting and personalized investment advice.
• Designed and implemented GraphQL APIs with Apollo Server and DataLoader pattern, reducing API calls by 60% and improving dashboard load times from 3s to 800ms.
• Built real-time market data streaming using WebSockets and Redis pub/sub, delivering live price updates, portfolio valuations, and alert notifications to 50,000+ concurrent users.
• Implemented comprehensive observability stack using OpenTelemetry, Grafana, and custom React dashboards, reducing mean-time-to-detection for production issues by 70%.
• Established frontend architecture patterns with React Query for server state, Zustand for client state, and strict TypeScript configurations, reducing production bugs by 45%.
• Led performance optimization initiative achieving 97 Lighthouse scores through React Server Components, image optimization, and strategic CDN caching with CloudFront.
• Mentored 4 mid-level engineers on system design, TypeScript best practices, and career development, with 2 receiving promotions within 12 months.

Full Stack Engineer at Fidelity Investments: Apr 2022 – Jan 2023
• Developed a unified internal developer portal using React, Next.js, and Node.js/Express, consolidating documentation, API catalogs, and development tools for 2,000+ engineers.
• Built automated API documentation generation using OpenAPI specifications and custom React components, reducing documentation maintenance effort by 80%.
• Designed RESTful APIs with Express.js and PostgreSQL using Prisma ORM, implementing efficient pagination, filtering, and full-text search for large datasets.
• Implemented Redis-based caching layer with intelligent cache invalidation strategies, reducing database load by 55% and achieving sub-50ms response times for cached endpoints.
• Created server-side rendered pages using Next.js with incremental static regeneration, improving SEO and reducing Time to First Byte from 2s to 200ms.
• Expanded automated testing coverage using Jest, React Testing Library, and Cypress, achieving 85% code coverage and reducing regression bugs by 35%.
• Integrated Azure AD authentication with MSAL.js and implemented role-based access control, securing sensitive internal tools and APIs.
• Containerized services using Docker and automated CI/CD pipelines with GitHub Actions, reducing deployment time from 45 minutes to 8 minutes.

Software Engineer at Fidelity Investments: Jul 2021 – Apr 2022
• Developed real-time trading analytics dashboards using React with Redux state management and Recharts visualization library, displaying market data and portfolio performance for internal trading desks.
• Built RESTful API services using Node.js/Express and PostgreSQL, processing and aggregating trade data from multiple upstream systems with 99.9% data accuracy.
• Implemented scheduled data processing jobs using Node.js and AWS Lambda, generating daily P&L reports and compliance summaries for regulatory requirements.
• Created reusable React component library with 30+ UI components, documented in Storybook and adopted across 3 internal applications.
• Integrated third-party market data APIs with robust error handling, retry logic, and circuit breaker patterns, ensuring reliable data feeds during market volatility.
• Optimized slow PostgreSQL queries through EXPLAIN analysis, index tuning, and query refactoring, reducing report generation time from 20 minutes to 90 seconds.
• Collaborated with UX designers to implement accessible interfaces following WCAG 2.1 guidelines, improving platform usability for users with disabilities.
• Participated in Agile ceremonies, contributed to sprint planning, and maintained technical documentation for team knowledge sharing.

Associate Software Engineer at Fidelity Investments: Jun 2020 – Jul 2021
• Developed customer account management interfaces using React.js and Redux, enabling self-service account updates, document uploads, and beneficiary management for retail investors.
• Built REST API endpoints using Node.js/Express with MySQL database backend, implementing CRUD operations for customer profile and preference data.
• Created automated unit tests using Jest and React Testing Library, achieving 70% code coverage and catching regressions before production deployment.
• Implemented form validation, error handling, and multi-step workflows using React Hook Form, reducing form abandonment rates by 20%.
• Assisted senior engineers in database schema design and API architecture decisions, learning relational modeling and RESTful design principles.
• Containerized development environments using Docker Compose, improving local setup consistency and reducing onboarding time for new team members.
• Built internal admin tools for customer service representatives, enabling efficient lookup and management of customer account data.
• Resolved production bugs through systematic debugging, log analysis, and root cause investigation, developing strong troubleshooting skills.

Technical Intern at Fidelity Investments: May 2018 – Jul 2020
• Developed a proof-of-concept expense tracking application using React.js and Node.js/Express as part of the summer internship program, receiving recognition from engineering leadership.
• Built REST API endpoints for data retrieval and storage using Express.js and MySQL, learning database design fundamentals and SQL query optimization.
• Created responsive UI components using React.js with Material-UI component library, following established design system guidelines.
• Implemented user authentication flow using JWT tokens and session management, gaining understanding of web security fundamentals.
• Wrote unit tests using Jest for API routes and React components, achieving 75% code coverage on assigned project deliverables.
• Participated in Agile ceremonies including daily standups, sprint planning, and retrospectives, learning collaborative software development practices.
• Collaborated with mentor and senior engineers through code reviews, receiving feedback on JavaScript best practices and clean code principles.
• Completed internal training on AWS fundamentals, Git version control, and Fidelity's software development lifecycle.\``,
  pdfTemplate: 4
};
