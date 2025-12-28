import { BaseResumeProfile } from '../baseResumes';

export const profile: BaseResumeProfile = {
  name: "Vincent Hueber",
  resumeText: `Senior Software Engineer
Vincent Hueber
vincenthueber1991@outlook.com

(626) 709-2731
Largo, FL, US

Summary:
Full Stack Developer with 10+ years of experience building scalable, high-performance applications using React, Next.js, Node.js, and modern cloud-native architectures. Skilled in designing robust APIs, integrating AI-driven features with Python frameworks, and optimizing performance across the stack. Strong background in cloud deployment, CI/CD automation, security best practices, and delivering measurable engineering impact through maintainable, high-quality code.

Education:
Bachelor's degree in Computer Science — Siena University, 2009 - 2014

Technical Skills:
• Languages: TypeScript, JavaScript, Python, PHP, SQL, GraphQL, HTML5, CSS3, Bash
• Frontend: React 18, Next.js 14, Angular, AngularJS (Legacy), Vue.js, Redux Toolkit, React Query, Zustand, Chart.js, ApexCharts, Tailwind CSS, Bootstrap, Styled Components, SCSS, Material-UI, Ant Design, Storybook, Webpack, Vite, Rollup
• Backend: Node.js, Express.js, NestJS, Fastify, PHP Laravel, Python FastAPI, GraphQL (Apollo Federation, Apollo Router), REST API Design, WebSockets, RabbitMQ, Message Queues, Microservices, Monolith-to-Microservices Migration
• Databases: PostgreSQL, MySQL, SQL Server, MongoDB, Redis, Elasticsearch, Prisma, Sequelize, TypeORM, Knex.js, Query Optimization, Full-Text Search, Database Replication, Sharding
• E-commerce & Retail: Inventory Management Systems, Order Management, BOPIS (Buy Online Pick Up In Store), Product Catalog, Pricing Engines, SKU Management, Barcode Integration, POS Integration
• Search & Discovery: Elasticsearch, Algolia, Apache Solr, Autocomplete, Faceted Search, Product Recommendations, Collaborative Filtering, Search Relevance, Vehicle Fitment Data
• Cloud & DevOps: AWS (ECS, Lambda, S3, CloudFront, RDS, ElastiCache, SQS, SNS, EventBridge), Docker, Kubernetes, Helm, Terraform, GitHub Actions, Jenkins, ArgoCD, Blue-Green Deployments
• AI Integration: OpenAI API, LangChain, Vector Databases, Semantic Search, Natural Language Processing, Product Matching, Recommendation Engines, Chatbot Development
• Real-time Systems: WebSockets, Redis Pub/Sub, Redis Streams, Server-Sent Events, Real-time Inventory Updates, Live Order Tracking, Push Notifications
• Testing: Jest, Cypress, Playwright, React Testing Library, Enzyme, PHPUnit, Supertest, Load Testing (k6), API Contract Testing
• Monitoring & Analytics: Datadog, New Relic, Grafana, Prometheus, Splunk, Google Analytics, Mixpanel, Custom Analytics Dashboards, A/B Testing
• Security: OAuth2, JWT, SAML, SSO, LDAP/Active Directory, API Security, PCI-DSS Awareness, Rate Limiting, WAF, DDoS Protection
• Practices: Agile, Scrum, Kanban, CI/CD, Feature Flags, Trunk-Based Development, Code Review, Legacy Code Modernization, Technical Debt Management

Work Experience:

Senior Software Engineer at O'Reilly Auto Parts: Dec 2023 – Present
• Architected a next-generation e-commerce platform using React 18, Next.js 14 App Router, and NestJS microservices, serving 5M+ monthly customers with vehicle-specific part recommendations and real-time inventory visibility.
• Built an AI-powered parts compatibility engine using OpenAI APIs and LangChain, enabling natural language vehicle lookups ("brake pads for 2019 Honda Accord") and reducing incorrect part purchases by 35%.
• Designed real-time inventory synchronization system using WebSockets, Redis Streams, and AWS EventBridge, providing accurate stock levels across 6,000+ store locations with sub-second updates.
• Implemented a GraphQL federation layer using Apollo Router, unifying product catalog, inventory, pricing, and customer data from 8 legacy systems into a single query interface.
• Built personalized recommendation engine using collaborative filtering and purchase history analysis, increasing average order value by 18% through intelligent cross-sell suggestions.
• Optimized Core Web Vitals achieving 95+ scores through React Server Components, Next.js Image optimization, and aggressive CDN caching with CloudFront, improving mobile conversion rates by 22%.
• Established comprehensive testing strategy with Jest, Cypress, and Playwright visual regression, maintaining 90% coverage while supporting weekly production releases.
• Mentored 5 engineers on TypeScript patterns, React performance optimization, and distributed systems architecture, fostering a culture of technical excellence.

Senior Engineer at O'Reilly Auto Parts: Dec 2020 – Dec 2023
• Led development of an omnichannel order management system using React, Next.js, and Node.js/Express, unifying in-store, online, and buy-online-pickup-in-store (BOPIS) workflows for 50,000+ daily orders.
• Designed RESTful APIs with Express.js and PostgreSQL using Prisma ORM, implementing efficient inventory allocation, order routing, and fulfillment tracking across distributed warehouse systems.
• Built real-time order tracking interfaces using React and WebSocket connections, providing customers with live updates on order status, delivery estimates, and in-store pickup notifications.
• Implemented Redis-based distributed caching and session management, reducing database load by 60% and achieving sub-100ms response times during peak holiday traffic.
• Created server-side rendered product pages using Next.js with incremental static regeneration, improving SEO rankings and reducing Time to First Byte from 2.5s to 300ms.
• Expanded automated testing infrastructure using Jest, React Testing Library, and Cypress, achieving 85% code coverage and reducing production defects by 40%.
• Integrated OAuth2/JWT authentication with enterprise SSO, supporting seamless login for 25,000+ commercial fleet customers across web and mobile platforms.
• Containerized services using Docker and automated CI/CD pipelines with GitHub Actions and AWS ECS, reducing deployment time from 2 hours to 15 minutes.
• Led migration from legacy jQuery/Backbone.js frontend to React, implementing incremental adoption strategy that minimized disruption while modernizing user experience.

Senior Software Developer at O'Reilly Auto Parts: May 2018 – Dec 2020
• Developed a store associate mobile web application using React and Node.js/Express, enabling inventory lookup, customer order management, and barcode scanning for 40,000+ retail employees.
• Built RESTful APIs for product catalog and pricing services using Express.js and PostgreSQL, handling 10M+ daily requests with connection pooling and query optimization.
• Implemented Elasticsearch integration for product search with faceted filtering, autocomplete suggestions, and vehicle-specific part matching, improving search relevance by 45%.
• Created real-time inventory visibility dashboard using React, Chart.js, and WebSocket connections, providing district managers with actionable insights on stock levels and sales trends.
• Designed event-driven architecture using RabbitMQ for order processing, inventory updates, and notification delivery, ensuring reliable message processing during high-volume periods.
• Built responsive mobile-first interfaces using React with CSS-in-JS styling, ensuring consistent experience across devices for both customers and store associates.
• Implemented automated testing using Jest and Enzyme (later React Testing Library), increasing unit test coverage from 35% to 75% and reducing regression bugs.
• Collaborated with DevOps team on Docker containerization and Kubernetes deployment, contributing to infrastructure modernization initiatives.

Software Engineer at LBi Software: Aug 2015 – Mar 2018
• Developed enterprise document management solutions using AngularJS, Node.js/Express, and Microsoft SQL Server for legal and financial services clients managing millions of documents.
• Built RESTful APIs for document ingestion, metadata extraction, and full-text search using Express.js, implementing OCR integration and automated classification workflows.
• Implemented user authentication and authorization using Passport.js with LDAP/Active Directory integration, supporting enterprise SSO requirements for large clients.
• Created responsive document viewer interfaces using AngularJS with PDF.js integration, enabling browser-based viewing, annotation, and redaction of legal documents.
• Designed database schemas and optimized SQL queries for document storage and retrieval, reducing average query time from 5 seconds to 200ms for complex searches.
• Built automated document processing pipelines using Node.js worker processes and Redis queues, handling batch uploads of 100,000+ documents during client migrations.
• Implemented comprehensive logging and monitoring using Winston and custom dashboards, improving visibility into system health and troubleshooting efficiency.
• Participated in Agile ceremonies, code reviews, and client requirement gathering, developing consulting skills alongside technical expertise.
• Containerized development environments using Docker, improving local setup consistency and enabling reproducible builds across the team.

Associate Software Consultant at ACA Technology: Dec 2014 – Jun 2015
• Developed client-facing web applications using JavaScript, jQuery, and PHP/Laravel, delivering custom business solutions for small and medium enterprises.
• Built responsive landing pages and marketing sites using HTML5, CSS3, and Bootstrap framework, ensuring cross-browser compatibility and mobile responsiveness.
• Created backend APIs using PHP/Laravel and MySQL for client CRM and inventory management systems, implementing CRUD operations and basic reporting features.
• Implemented form handling, validation, and email notifications using jQuery and PHP, supporting client lead generation and customer communication workflows.
• Learned version control fundamentals using Git and participated in code reviews, developing collaborative software development skills.
• Assisted senior consultants in client requirement gathering and technical specification documentation, gaining exposure to consulting methodology.
• Resolved production issues through systematic debugging and customer support, developing troubleshooting skills and client communication abilities.
• Completed internal training on web development best practices, database design, and agile project management methodologies.\``,
  pdfTemplate: 5
};
