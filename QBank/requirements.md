# Requirements Specification: QBank (Mathematics Question Bank & Engine)

## 1. Executive Summary & Vision

**QBank** is an enterprise-grade Mathematics Question Bank Engine and Content Management Microservice designed to store, manage, generate, and deliver high-quality mathematical exercises. Aligned with the **Philippines Department of Education (DepEd) K-12 Mathematics Curriculum**, QBank serves as the core question bank and step-by-step solution provider for educational portals spanning **Form 1 to Form 10** (Grade 1 to Grade 10 equivalent).

The service features a structured pre-populated question repository of **4,400 topic-matched questions**, an automated algorithmic fallback problem generator, rich LaTeX mathematical expression support, step-by-step solution working engines, and complete Administrative CRUD APIs.

---

## 2. Target Level Coverage & Strand Mapping Matrix

### 2.1 Grade Level Mapping
| Level Descriptor | Equivalent Grade (Philippines K-12) | Core Curriculum Focus |
| :--- | :--- | :--- |
| **Form 1 - Form 6** | Primary 1 - Primary 6 (Grade 1 - 6) | Measurement & Geometry, Number and Algebra, Data and Probability|
| **Form 7 - Form 10** | Secondary 1 - Secondary 4 (Grade 7 - 10) | Measurement & Geometry, Number and Algebra, Data and Probability |


### 2.2 Philippines DepEd MATATAG Mathematics Strands
@file: /QBank/MATATAG-CUrriculum-Grade-1-10-Maths.xlsx
1. **Measurement and Geometry**
2. **Number and Algebra**
3. **Data and Probability**

---

## 3. Detailed Functional Requirements

### Feature 1: Curriculum Taxonomy & Structure Management

- **FR-1.1 Hierarchical Taxonomy:**
  - Standardized taxonomy structure:
    $$\text{Level (Form 1–10)} \longrightarrow \text{Curriculum Strand} \longrightarrow \text{Unit} \longrightarrow \text{Topic} \longrightarrow \text{Sub-topic}$$
  - Full support for 44 distinct DepEd mathematics topics mapped across Form 1 to Form 10.
- **FR-1.2 Learning Competencies:**
  - Each topic maintains official DepEd code references, learning competency descriptions, difficulty distribution guidelines, and target grade ranges.
- **FR-1.3 Visual Assets & Graph Integration:**
  - Taxonomy and question schemas support attaching media assets to any question or topic step, including raster images (PNG/JPEG/WebP), SVG vector diagrams, geometric shape illustrations, coordinate plane plots, and dynamic data graphs (e.g., line charts, bar graphs, histograms, pie charts).
  - Standardized image payload structure supporting alt text, caption, scaling constraints, and CDN asset URLs.

---

### Feature 2: Question Repository & Seed Data (4,400 Questions)

- **FR-2.1 Pre-Populated Database:**
  - Database pre-loaded with **4,400 static, verified questions** (100 unique questions per topic across 44 topics).
- **FR-2.2 Question Types Supported:**
  - **Multiple Choice Questions (MCQ):** Standard 4-option single correct answer choices.
  - **Exact Value / Numeric Entry:** Integer, floating-point, fraction, or ratio entry with precision bounds.
  - **Algebraic Expression Entry:** Symbolic expressions validated via canonical reduction algorithms.
  - **Multi-Step Problem Solving:** Sequenced sub-questions with intermediate working steps.
- **FR-2.3 Authentic Strand Alignment:**
  - Statistics and Probability topics (Form 5 through 12) feature authentic statistical datasets, line/bar graph trends, experimental probability, central tendency (mean, median, mode), counting principles, permutations, combinations, Z-scores, and hypothesis testing.
- **FR-2.4 Excel Spreadsheet Export & Standardized Headings:**
  - All 4,400 questions (and any subsequent updates) are exportable and maintainable in an Excel spreadsheet (`.xlsx` / `.csv`) format.
  - Standardized Excel Column Headings:
    - `Question ID` (UUID / Primary Key)
    - `Form Level` (Form 1 to 12)
    - `Curriculum Strand` (e.g., Patterns and Algebra)
    - `Unit Title` & `Topic ID` / `Topic Name`
    - `DepEd Competency Code`
    - `Question Text`
    - `LaTeX Formula Expression`
    - `Question Type` (MCQ, Numeric Entry, Algebraic Expression, Multi-Step)
    - `Option A`, `Option B`, `Option C`, `Option D`
    - `Correct Answer`
    - `Step-by-Step Working` (Formatted solution derivation text)
    - `Graph / Image URL`
    - `Image Alt Text` & `Caption`
    - `Difficulty Rating` (1–5 Scale)
    - `Created Date` & `Last Modified Date`

---

### Feature 3: Step-by-Step Solutions & LaTeX Derivation Engine

- **FR-3.1 Automated Working Derivations:**
  - Every question in the repository stores structured, step-by-step solution metadata:
    1. **Problem Statement & Given Values**
    2. **Formulas & Rules Applied**
    3. **Intermediate Derivations & Calculations**
    4. **Final Verified Answer**
- **FR-3.2 Mathematics Notation Standard (LaTeX):**
  - All mathematical equations, symbols, fractions, radicals, exponents, and matrices rendered via LaTeX syntax (`\frac{a}{b}`, `\sqrt{x}`, `\int f(x)dx`).

---

### Feature 4: Algorithmic Fallback Generator

- **FR-4.1 Dynamic Instance Generation:**
  - Automatically generates parameterized question instances on-demand when student drill requests exceed static bank depth.
- **FR-4.2 Rule-Based Template Engine:**
  - Math rules define random variable ranges, constraints (e.g., non-zero denominators, integer solutions), dynamic distractors, and automated step recalculation.

---

### Feature 5: Administrative Control & CRUD Management

- **FR-5.1 Question Management Portal:**
  - Admin tools to view, create, edit, filter, clone, and delete questions across all 44 topics and 12 Form levels.
- **FR-5.2 Rich LaTeX Live Preview Editor:**
  - Admin interface featuring interactive LaTeX preview, solution step builder, and option distractor validators.
- **FR-5.3 Filtering & Taxonomy Search:**
  - Multi-attribute searching by Form level, strand, topic ID, question type, difficulty score, and keyword search.
- **FR-5.4 Excel Bulk Import & Export Utility:**
  - Administrative utility allowing bulk ingestion and automated export of questions via `.xlsx` spreadsheets with schema validation and error reporting for missing/invalid headings.

---

### Feature 6: REST API Interface Specifications

- **FR-6.1 Topic Retrieval API:** `GET /api/topics?form_level={1-12}`
- **FR-6.2 Practice Question Sampling API:** `GET /api/questions/sample?topic_id={id}&count={n}`
- **FR-6.3 Answer Validation API:** `POST /api/questions/validate`
- **FR-6.4 Admin Question CRUD APIs:**
  - `GET /api/admin/questions`
  - `POST /api/admin/questions`
  - `PUT /api/admin/questions/:id`
  - `DELETE /api/admin/questions/:id`
  - `GET /api/admin/questions/export/excel`
  - `POST /api/admin/questions/import/excel`

---

## 4. Non-Functional Requirements

- **NFR-1 Performance & Response Latency:**
  - Sample query responses delivered in under **50ms**.
  - Database indexing optimized for high-concurrency practice drills.
- **NFR-2 Data Integrity & Precision:**
  - Strict validation on numerical float precision and algebraic equivalency.
- **NFR-3 Security & Access Control:**
  - Admin CRUD endpoints secured via JWT authentication and role-based permissions (`Role: ADMIN`).
  - Read-only endpoints accessible to student practice client services.

---

## 5. Summary of Scope & Deliverables

- [x] **Requirements Specification:** `QBank/requirements.md`
- [ ] **Excel Question Repository Spreadsheet:** `QBank/questions_bank.xlsx` (Complete 4,400 question database with all standardized headers)
- [ ] **Database Schema Design:** SQLite/PostgreSQL schema for `topics`, `questions`, `solution_steps`, and `competencies`
- [ ] **Seed Data Engine:** Migration script to generate/populate 4,400 Philippines K-12 Math questions & sync with Excel sheet
- [ ] **REST API Server:** Express / Node.js API service for question sampling, verification, admin CRUD, and Excel import/export
- [ ] **Dynamic Fallback Generator:** Parameterized math problem generator engine
