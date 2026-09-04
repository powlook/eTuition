# Serverless Environment Comparison for eTuition & QBank

## Overview
This document compares the advantages and disadvantages of using a **Serverless Environment** (such as Vercel, AWS Lambda, or Netlify) vs. a traditional local/dedicated server environment (such as Express + SQLite).

---

## 🟢 Advantages of Serverless Environment

1. **Zero Server Maintenance & Infrastructure Management**
   - No need to configure, patch, or manage a dedicated VPS, operating system, Nginx, Ubuntu, or PM2 process managers.
   - Vercel automatically manages HTTPS SSL certificates, domain routing, and Node.js runtimes.

2. **Automatic Scaling (1 Student to 10,000+ Students)**
   - When multiple students log in simultaneously for an exam or drill, the serverless architecture instantly spins up parallel function instances to handle traffic spikes without crashing or slowing down.

3. **Cost Efficiency (Pay Only for Active Execution)**
   - Traditional servers charge 24/7 regardless of traffic. Serverless environments only charge when requests are active, making hosting virtually free for low-to-medium traffic workloads.

4. **Instant Git Deployments**
   - Pushing code to your GitHub repository automatically triggers Vercel to build and deploy your updated frontend and backend functions globally in under 1 minute.

5. **Blazing Fast Read Speeds (with In-Memory JSON Engine)**
   - In QBank, loading questions directly from pre-parsed JSON memory (`questions.json`) in serverless instances delivers sub-10ms response times without database connection pool bottlenecks.

---

## 🔴 Disadvantages & Trade-offs

1. **Native C++ Module Restrictions (`better-sqlite3`)**
   - Ephemeral serverless containers lack native C++ build environments. Native binaries like `better-sqlite3` cannot run in standard serverless functions.
   - *How eTuition handles this:* We built an in-memory JSON fallback engine for Vercel, while retaining `better-sqlite3` for local SQLite development.

2. **Cold Starts**
   - If an endpoint hasn't received requests for a few minutes, Vercel pauses the container. The next user request incurs a minor delay (100–400ms) while the container boots up.

3. **Stateless / Ephemeral Memory**
   - Serverless functions do not preserve local state across function invocations. Writes must be saved to persistent cloud storage or JSON files rather than relying on local SQLite file writes.

4. **Execution Time Limits**
   - Serverless functions have execution timeouts (e.g., 10 seconds on Vercel hobby tier, 60 seconds on pro tier). Long-running background processes (like generating 10,000 questions in Python) cannot be run inside a single serverless HTTP request.

---

## 💡 Summary Recommendation for eTuition & QBank

| Environment | Best Setup | Key Rationale |
| :--- | :--- | :--- |
| **Local Machine** | **SQLite + Local Express** | Instant hot-reloading, local file persistence, zero latency during development. |
| **Vercel Cloud** | **Serverless + JSON Memory Engine** | Zero hosting costs, instant global CDN delivery, handles student spikes effortlessly. |
