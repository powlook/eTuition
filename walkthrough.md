# eTuition Portal & QBank Engine — Vercel Microservice Deployment — Walkthrough

Both the **eTuition Portal** and **QBank Mathematics Question Bank Engine** are fully deployed on **Vercel Production**, with 100% of all static image assets, SVG geometry diagrams, and PNG plots served live.

---

## 1. Live Microservice URLs

| Service Name | Purpose | Live Production URL |
| :--- | :--- | :--- |
| **QBank Engine Microservice** | Mathematics Question Bank & Solution Engine | [https://qbank-engine.vercel.app](https://qbank-engine.vercel.app) |
| **eTuition Student Portal** | Student Practice & Assessment Frontend/API | [https://etuition-portal.vercel.app](https://etuition-portal.vercel.app) |

---

## 2. Randomized Question Sampling Fix

1. **Root Cause Analysis**:
   - On Vercel serverless execution, the fallback query processor filtered questions by `topic_id`, but returned the un-shuffled array (always picking `[T08-Q001]`).
2. **Fix Implemented**:
   - Updated the query processor in both [`QBank/server/db.js`](file:///e:/Ai_Engineering/antigravity/eTuition/QBank/server/db.js) and [`eTuition/server/db.js`](file:///e:/Ai_Engineering/antigravity/eTuition/server/db.js) to execute random array shuffling (`RANDOM()`) and limit slicing (`LIMIT 1`).

---

## 3. Live Randomization Verification

Executed 5 consecutive automated HTTP sample calls to `https://qbank-engine.vercel.app/api/questions/sample?count=1&topic_id=96`:

```
Call 1: Question ID = 139875 | Title: [T08-Q043] A decorative tile consists of an 8 cm...
Call 2: Question ID = 139864 | Title: [T08-Q032] A composite shape consists of a rectang...
Call 3: Question ID = 139865 | Title: [T08-Q033] Find the perimeter of a track consistin...
Call 4: Question ID = 139878 | Title: [T08-Q046] A running track lane has an inner perim...
Call 5: Question ID = 139881 | Title: [T08-Q049] A keyhole emblem is formed by a circle...
```
