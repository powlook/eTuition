# eTuition Portal

An interactive web-based mathematics learning portal designed for students from **Form 1 to Form 12** (Primary 1 to Secondary 4 / Grade 1 to Grade 12 equivalent). Aligned with the official **Philippines K-12 Mathematics Curriculum (DepEd)**, the platform provides automated problem generation, interactive exercises, and real-time step-by-step working derivations.

---

## 🌟 Key Features

### 1. Student Access & Admin Management
- **Student Access Requests:** New student registrations enter a pending status until reviewed.
- **Admin Manager Control:** Admins approve student accounts and grant portal access permissions.
- **Role-Based Security:** Separate capabilities for Students and Admin Managers.

### 2. Philippines Mathematics Curriculum Integration
- Structured according to the **Department of Education (DepEd)** standard framework across 5 core strands:
  1. *Numbers and Number Sense*
  2. *Measurement*
  3. *Geometry*
  4. *Patterns and Algebra*
  5. *Statistics and Probability*
- Multi-tier topic hierarchy: $\text{Level (Form 1-12)} \rightarrow \text{Curriculum Strand} \rightarrow \text{Unit} \rightarrow \text{Topic} \rightarrow \text{Sub-topic}$.

### 3. Automated Question & Step-by-Step Working Engine
- **Dynamic Content Generation:** Automatically generates math questions, verified answers, and complete step-by-step working derivations on-the-fly. No manual question entry required.
- **Infinite Practice:** Generates fresh problem instances with randomized parameters for each topic.
- **Rich Mathematical Notation:** Full LaTeX rendering for fractions, equations, radicals, and geometric notation.

---

## 📁 Documentation & Repository Structure

- **[requirements.md](./requirements.md)** — Detailed specification covering target personas, functional requirements, automated problem engine specs, and non-functional constraints.
- **[AGENTS.md](./AGENTS.md)** — Project build rules, quality standards, and role definitions.
- **`agents/`** — Workflow role definitions (`orchestrator`, `frontend-dev`, `backend-dev`, `qa`, `adversary`).

---

## 🛠️ Project Status

- [x] **Requirements Specification:** `requirements.md` finalized.
- [x] **Configuration & Setup:** Project workspace configured for Antigravity.
- [ ] **Application Development:** Ready for implementation.
