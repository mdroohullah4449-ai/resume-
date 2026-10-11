export interface Preset {
  id: string;
  name: string;
  roleTitle: string;
  targetCompany: string;
  resumeText: string;
  jobDescription: string;
}

export const SAMPLE_PRESETS: Preset[] = [
  {
    id: 'frontend-lead',
    name: 'Senior Frontend to Staff/Lead Engineer',
    roleTitle: 'Staff Frontend Engineer - Core Platform',
    targetCompany: 'Fintech Cloud Technologies',
    resumeText: `ALEX MORGAN
alex.morgan@email.dev | (555) 349-2104 | San Francisco, CA | github.com/alexm-dev

PROFESSIONAL SUMMARY
Senior Frontend Engineer with 6+ years of experience engineering high-performance web applications using React, TypeScript, Next.js, and modern CSS. Proven track record of scaling frontend micro-frontends, optimizing Core Web Vitals by 42%, and collaborating cross-functionally with product and design teams. Passionate about design systems, accessibility, and state management.

WORK EXPERIENCE
Senior Frontend Engineer | Lumina Cloud Solutions (2022 - Present)
- Architected modular design system component library in TypeScript and Tailwind, adopted by 8 engineering squads across 30+ internal and customer-facing apps.
- Spearheaded migration of legacy monolith to Next.js 14 App Router, cutting First Contentful Paint by 1.4s and boosting Google Core Web Vitals pass rate from 61% to 94%.
- Integrated complex state management using Zustand and TanStack Query, reducing unnecessary API re-fetches by 35%.
- Mentored 4 junior and mid-level software engineers through structured pair programming and code reviews.
- Built automated CI/CD pipeline tests using Vitest and Playwright, improving overall unit test coverage to 88%.

Frontend Software Engineer | DataPulse Analytics (2019 - 2022)
- Developed responsive real-time data visualization dashboards in React, D3.js, and WebSocket streaming for enterprise SaaS customers with 100k+ daily active users.
- Reduced client-side bundle size by 38% through dynamic code splitting, tree shaking, and asset compression techniques.
- Partnered with backend engineers to consume RESTful endpoints and assist in schema definitions.
- Contributed to WCAG 2.1 AA compliance initiative across 15 high-traffic customer journey funnels.

SKILLS & TECHNOLOGIES
Languages & Frameworks: TypeScript, JavaScript (ESNext), React, Next.js, HTML5, CSS3, Tailwind CSS, Node.js (basic)
State & Data Fetching: Zustand, Redux Toolkit, TanStack Query, REST APIs, WebSockets
Testing & Tooling: Jest, Vitest, Playwright, React Testing Library, Vite, Webpack, Git, Docker (basic)
Architecture & Concepts: Micro-frontends, Design Systems, SSR/SSG, Web Performance Optimization, Responsive UI

EDUCATION
B.S. in Computer Science | University of Washington (2015 - 2019)`,
    jobDescription: `Job Title: Staff Frontend Engineer - Core Platform
Company: Fintech Cloud Technologies
Location: San Francisco, CA / Remote

About the Role:
We are seeking a Staff Frontend Engineer to lead our Core Platform engineering initiatives. In this role, you will be the architectural anchor for our distributed frontend ecosystem, shaping how our multi-tenant fintech payments portal scales to process over $50B in annualized transactions.

Key Responsibilities:
- Lead the architectural vision and engineering roadmap for our global frontend platform, micro-frontends, and client-side infrastructure.
- Partner with Principal Engineers, Product Directors, and Security leads to enforce strict financial-grade security standards, PCI-DSS compliance, and zero-downtime deployments.
- Champion GraphQL federation and API contract standards across 12 distributed cross-functional teams.
- Drive company-wide frontend performance benchmarks, latency budgets, and real-user monitoring (RUM) observability.
- Cultivate engineering excellence through tech specs, architecture review boards (ARBs), and mentoring senior and staff-level engineers.

Requirements:
- 7+ years of professional software engineering experience with deep expertise in modern TypeScript, React, and browser internals.
- Proven experience architecting large-scale, high-concurrency web applications or core platform foundations.
- Hands-on experience with GraphQL (Federation/Apollo Client), SSR/Streaming architectures, and Distributed Tracing / Datadog.
- Demonstrated mastery of frontend security practices (CSP policies, XSS/CSRF mitigation, token lifecycle management, iframe sandboxing).
- Exceptional communication skills and ability to influence cross-functional technical decisions without formal authority.
- Experience with Kubernetes, Docker, and AWS/Cloudflare edge workers is a major plus.`
  },
  {
    id: 'product-manager',
    name: 'Growth Product Manager',
    roleTitle: 'Senior Product Manager - User Acquisition & Retention',
    targetCompany: 'Nova Digital Mobility',
    resumeText: `JORDAN LEE
jordan.lee@productpro.com | (555) 782-9901 | New York, NY | linkedin.com/in/jordanlee-pm

PROFILE
Data-driven Product Manager with 5 years of experience leading cross-functional teams to launch high-impact consumer and B2B SaaS products. Adept at rapid A/B experimentation, funnel optimization, quantitative analytics (SQL, Mixpanel), and customer journey mapping.

EXPERIENCE
Product Manager | Streamline SaaS (2021 - Present)
- Owned self-serve onboarding funnel and subscription lifecycle, driving a 24% uplift in free-to-paid conversion in Q3 2023.
- Formulated and executed continuous product growth roadmap running 35+ multivariate experiments per quarter across signup and checkout flows.
- Authored detailed PRDs, technical user stories, and acceptance criteria in Jira, collaborating closely with 9 engineers and 2 UX designers.
- Conducted 50+ qualitative user interviews to identify friction points in workspace invitations, resulting in a new viral referral loop that increased weekly invites by 40%.
- Monitored weekly CAC, LTV, churn, and NPS metrics; presented performance dashboards to C-suite leadership.

Associate Product Manager | VentureLoop Media (2019 - 2021)
- Managed mobile push notification personalization project, increasing 30-day user retention from 18% to 27%.
- Queried PostgreSQL databases using SQL to build self-serve executive dashboards in Tableau.
- Spearheaded redesign of pricing tier comparison modal, improving Annual billing adoption by 15%.

SKILLS
Product Strategy, A/B Testing, User Research, Agile/Scrum, Funnel Analysis, Product Discovery, GTM Strategy
Tools: SQL, Mixpanel, Amplitude, Segment, Jira, Figma, Tableau, Google Analytics, Optimizely`,
    jobDescription: `Job Title: Senior Product Manager - User Acquisition & Retention
Company: Nova Digital Mobility
Location: New York, NY (Hybrid)

Role Overview:
Nova is seeking an exceptional Senior Product Manager to drive explosive viral growth, activation, and retention across our international mobility network. You will own the growth engine that turns first-time riders and drivers into loyal daily active users.

What You Will Do:
- Set the multi-year product strategy and quantitative OKRs for international user acquisition, organic referral mechanisms, and monetization loops.
- Build high-velocity experimentation pipelines; leverage statistical modeling to run complex multi-armed bandit and split tests.
- Partner with Machine Learning teams to deploy real-time dynamic pricing incentives and personalized retention offers.
- Own the product lifecycle end-to-end: discovery, scoping, technical execution, rollout, and post-launch optimization.
- Lead a dedicated squad of 12 engineers, data scientists, and growth marketers.

What We Look For:
- 5+ years of PM experience with an emphasis on high-velocity consumer growth, marketplace dynamics, or fintech/mobility platforms.
- Deep expertise with advanced SQL, Bayesian and frequentist experimentation methodologies, and growth accounting frameworks (Reforge alumni strongly preferred).
- Proven track record of moving primary North Star metrics (ARR, LTV:CAC, D30 retention) by double-digit percentages.
- Experience collaborating with Data Science and Machine Learning squads on predictive personalization models.
- Outstanding analytical storytelling and executive stakeholder management.`
  },
  {
    id: 'ai-ml-engineer',
    name: 'Data Scientist to MLOps / LLM Engineer',
    roleTitle: 'Senior MLOps & LLM Systems Engineer',
    targetCompany: 'CognitiveScale AI Labs',
    resumeText: `PRIYA SHARMA
priya.sharma@mlresearch.io | San Jose, CA | github.com/priyasharma-ai

SUMMARY
Machine Learning Engineer and Data Scientist with 4+ years building end-to-end predictive pipelines, fine-tuning neural networks, and deploying machine learning models to production. Proficient in Python, PyTorch, Scikit-Learn, and Docker.

EXPERIENCE
Machine Learning Engineer | Apex Insights (2022 - Present)
- Developed and deployed sentiment analysis and document classification NLP models using HuggingFace Transformers, serving 4M inference requests daily.
- Built automated feature engineering and model training pipelines in Python and Apache Airflow on AWS EC2/S3.
- Reduced model inference latency by 45% via ONNX Runtime quantization and TensorRT conversion.
- Tracked model experiments, artifacts, and hyperparameter optimization runs using MLflow and Weights & Biases.
- Implemented data drift detection scripts using EvidentlyAI to alert team of distribution shifts in production feature data.

Data Scientist | FinTech Core (2020 - 2022)
- Built credit default risk classification models using XGBoost and LightGBM, achieving 0.89 AUC-ROC.
- Extracted and transformed multi-terabyte financial transaction datasets using Spark and SQL.
- Created interactive model explainability dashboards using SHAP values and Streamlit for compliance auditors.

TECHNICAL SKILLS
Languages & Frameworks: Python, SQL, PyTorch, Hugging Face, Scikit-learn, Pandas, NumPy, FastAPI
MLOps & Data: MLflow, Docker, Apache Airflow, DVC, AWS (S3, EC2, SageMaker), Git
Concepts: Supervised Learning, NLP, Feature Engineering, Model Optimization, Vector Embeddings`,
    jobDescription: `Job Title: Senior MLOps & LLM Systems Engineer
Company: CognitiveScale AI Labs
Location: San Francisco, CA / Remote

About the Team:
At CognitiveScale AI, we build foundation model infrastructure and production-grade LLM applications serving enterprise Fortune 500 customers. We are looking for an experienced Senior MLOps Engineer to architect our scalable LLM serving and retrieval infrastructure.

Responsibilities:
- Build low-latency, scalable LLM serving architectures using vLLM, TensorRT-LLM, and Triton Inference Server on distributed GPU clusters.
- Design enterprise Retrieval-Augmented Generation (RAG) pipelines, integrating vector databases (Pinecone, Qdrant, Milvus) and hybrid keyword/dense semantic search.
- Implement robust LLM evaluation, guardrailing, and observability pipelines using LangSmith, Ragas, and OpenTelemetry.
- Maintain Kubernetes-based deployment infrastructure with Kubeflow/Ray on AWS EKS with GPU node autoscaling.
- Ensure strict data privacy, enterprise SLA guarantees (p99 < 150ms), and prompt injection security defenses.

Requirements:
- 4+ years in Production ML Engineering / MLOps with at least 1+ years dedicated to Large Language Models or GenAI systems.
- Strong proficiency in distributed training/serving frameworks (Ray, vLLM, DeepSpeed).
- Deep experience deploying ML workloads on Kubernetes (K8s, Helm charts, RayCluster) and GPU cloud orchestration (AWS/GCP).
- Hands-on expertise building production RAG pipelines, chunking strategies, reranking models, and vector database clustering.
- Strong software engineering principles: CI/CD for ML, infrastructure-as-code (Terraform), and robust API design in Python/Go.`
  }
];
