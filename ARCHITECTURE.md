# Code Review & Architecture Answers

Responses for the Full Stack Developer assessment (under 300 words each).

---

## 1. What steps would you take to secure a web application?

Start with transport and secrets: enforce HTTPS, store credentials in environment variables (never in git), and rotate keys if they leak. On the API, validate and sanitize all input, use parameterized queries / ORM methods to prevent injection, and return generic errors so internals are not exposed.

Add authentication and authorization early: strong password hashing (or OAuth), short-lived tokens or secure session cookies (`HttpOnly`, `Secure`, `SameSite`), and role checks on every mutating route. Protect against common web attacks with CSRF tokens where cookies are used, Content-Security-Policy and related headers, rate limiting, and CORS locked to known origins.

Keep dependencies patched, enable logging/monitoring for auth failures and unusual traffic, and limit blast radius with least-privilege database users and network rules (e.g. MongoDB Atlas IP allowlists). For production, separate environments, review third-party scripts, and run periodic dependency and penetration checks.

---

## 2. How would you improve the performance of a slow React application?

Measure first: React Profiler, Lighthouse, and the Network tab to see whether the cost is render time, bundle size, or data fetching. Fix the biggest win first—often shipping less JavaScript (code splitting with dynamic imports, tree-shaking, removing unused libraries) and compressing/caching assets via the CDN.

On the React side, avoid unnecessary re-renders: lift state carefully, keep components small, memoize expensive pure children when profiling shows benefit, and prefer stable keys in lists. Defer non-critical UI with `Suspense` / lazy loading, and use virtualization for long lists.

For data, cache responses, avoid waterfalls (parallel fetches), and paginate or filter on the server. Images should be sized and modern formats (`next/image` or similar). After changes, re-profile to confirm improvements instead of guessing.

---

## 3. Explain the difference between SQL and NoSQL databases and when you would use each.

SQL databases (PostgreSQL, MySQL) store data in tables with a fixed schema, strong consistency, and powerful relational joins. They fit transactional domains—billing, inventory, auth—where relationships and ACID guarantees matter, and where you query across normalized entities often.

NoSQL databases (MongoDB, DynamoDB) store flexible documents or key-value records, scale horizontally more easily for some workloads, and suit evolving or nested data shapes. They are strong for content, catalogs, event logs, and products where most reads are by primary key or simple filters and you want to evolve fields without heavy migrations.

I use SQL when integrity and complex queries dominate; MongoDB when documents map cleanly to the API model and the team needs flexible schemas—as in this task app, where each task is a self-contained document. Many systems mix both (polyglot persistence).

---

## 4. How would you deploy a full-stack application to AWS, Azure, or Google Cloud?

A typical path for a Next.js full-stack app: build a container or use a managed Node host, set `MONGODB_URI` and other secrets in the platform’s secret store, then point a custom domain and TLS at the service.

On **AWS**: frontend/API on Amplify, Elastic Beanstalk, or ECS/Fargate behind an ALB; MongoDB Atlas (or DocumentDB) in a VPC-friendly setup; CloudFront for static assets; Secrets Manager for credentials; GitHub Actions for CI/CD.

On **Azure**: App Service or Container Apps for the app, Key Vault for secrets, Atlas or Cosmos DB API for MongoDB, Azure DevOps/GitHub Actions pipelines, Front Door or CDN for edge caching.

On **GCP**: Cloud Run for the containerized Next.js app, Secret Manager, Atlas or Firestore alternatives as needed, Cloud Build for CI, Cloud Load Balancing + Cloud CDN.

Across all three: health checks, staging environment, automated deploys from `main`, observability (logs + metrics), and least-privilege IAM. For this project, Vercel + MongoDB Atlas (Mongoose) is a lighter equivalent of the same pattern.
