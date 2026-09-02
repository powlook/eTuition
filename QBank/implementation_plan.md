# Implementation Plan: QBank (Mathematics Question Bank & Engine)

Implement **QBank** as a full-stack educational microservice and interactive web application for the Philippines DepEd K-12 Mathematics Curriculum (Form 1 to Form 12). The system includes a 4,400-question database, Excel spreadsheet import/export, graph/image asset support, KaTeX step-by-step mathematical solution engine, dynamic fallback question generator, and an Admin CRUD management panel.

## User Review Required

> [!IMPORTANT]
> - **Excel Library Choice**: We will use `xlsx` (`sheetjs`) for high-performance `.xlsx` generation, parsing, header validation, and export/import.
> - **DepEd Strand Alignment**: Covers 44 DepEd curriculum topics across Form 1–12, pre-populating 4,400 verified questions with step-by-step derivations and graph/image metadata.
> - **Visual Graphs & Images**: Questions will support embedded visual assets (vector SVGs, line graphs, bar charts, geometry diagrams, CDN image URLs, and alt text captions).

## Proposed Changes

### `QBank` Root Directory

#### [NEW] [package.json](file:///e:/Ai_Engineering/antigravity/QBank/package.json)
- Define dependencies: `express`, `cors`, `better-sqlite3`, `xlsx`, `katex`, `lucide-react`, `react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `concurrently`.

#### [NEW] [vite.config.js](file:///e:/Ai_Engineering/antigravity/QBank/vite.config.js)
- Configure Vite React plugin and proxy settings for backend API calls (`/api` -> `http://localhost:5000`).

---

### Backend Components (`server/`)

#### [NEW] [server/db.js](file:///e:/Ai_Engineering/antigravity/QBank/server/db.js)
- Initialize SQLite database (`qbank.db`) with tables:
  - `topics`: (`id`, `form_level`, `strand`, `unit`, `title`, `description`, `competencies`)
  - `questions`: (`id`, `topic_id`, `question_title`, `question_text`, `math_formula`, `question_type`, `options_json`, `correct_answer`, `hint`, `working_steps_json`, `image_url`, `image_alt`, `difficulty`, `created_by`, `created_at`, `updated_at`)

#### [NEW] [server/seed.js](file:///e:/Ai_Engineering/antigravity/QBank/server/seed.js)
- Seed 44 DepEd Philippines Math topics and generate **4,400 topic-matched questions** (100 questions per topic) with mathematical formulas, option distractors, hints, graph image metadata, and step-by-step derivations.
- Export pre-populated question database directly to `QBank/questions_bank.xlsx`.

#### [NEW] [server/excelService.js](file:///e:/Ai_Engineering/antigravity/QBank/server/excelService.js)
- Build Excel export & import utility:
  - Export questions into `.xlsx` spreadsheet with all required headers: `Question ID`, `Form Level`, `Curriculum Strand`, `Unit Title`, `Topic ID`, `Topic Name`, `DepEd Competency Code`, `Question Text`, `LaTeX Formula Expression`, `Question Type`, `Option A`, `Option B`, `Option C`, `Option D`, `Correct Answer`, `Step-by-Step Working`, `Graph / Image URL`, `Image Alt Text`, `Difficulty Rating`, `Created Date`, `Last Modified Date`.
  - Validate headers and bulk ingest uploaded `.xlsx` files back into SQLite DB.

#### [NEW] [server/fallbackGenerator.js](file:///e:/Ai_Engineering/antigravity/QBank/server/fallbackGenerator.js)
- Algorithmic fallback problem generator for parameterized on-demand question generation.

#### [NEW] [server/index.js](file:///e:/Ai_Engineering/antigravity/QBank/server/index.js)
- Express REST API endpoints:
  - `GET /api/topics`
  - `GET /api/questions`
  - `GET /api/questions/sample`
  - `POST /api/questions/validate`
  - `POST /api/questions/generate-fallback`
  - `GET /api/admin/questions/export/excel`
  - `POST /api/admin/questions/import/excel` (multer file upload)
  - `POST /api/admin/questions`
  - `PUT /api/admin/questions/:id`
  - `DELETE /api/admin/questions/:id`

---

### Frontend Components (`src/`)

#### [NEW] [src/index.css](file:///e:/Ai_Engineering/antigravity/QBank/src/index.css)
- Implement modern glassmorphic design system, custom typography, dark/light theme tokens, KaTeX formula formatting, and responsive layout classes.

#### [NEW] [src/App.jsx](file:///e:/Ai_Engineering/antigravity/QBank/src/App.jsx)
- SPA header with Form 1-12 tabs, Strand filter, search bar, dark mode toggle, and mode switcher (Practice Explorer, Dynamic Generator, Excel Hub, Admin Portal).

#### [NEW] [src/components/PracticeExplorer.jsx](file:///e:/Ai_Engineering/antigravity/QBank/src/components/PracticeExplorer.jsx)
- Interactive question practice interface:
  - KaTeX mathematical formula rendering.
  - Graph / Image viewer component for embedded figures and plots.
  - Option selector and exact value answer validation.
  - Step-by-step solution derivation accordion.

#### [NEW] [src/components/ExcelHub.jsx](file:///e:/Ai_Engineering/antigravity/QBank/src/components/ExcelHub.jsx)
- One-click Excel spreadsheet download (`questions_bank.xlsx`) and file dropzone for uploading modified spreadsheets with real-time validation status.

#### [NEW] [src/components/AdminPortal.jsx](file:///e:/Ai_Engineering/antigravity/QBank/src/components/AdminPortal.jsx)
- Admin CRUD interface for viewing, creating, editing, and deleting questions with live KaTeX and Image preview.

#### [NEW] [src/components/MathRenderer.jsx](file:///e:/Ai_Engineering/antigravity/QBank/src/components/MathRenderer.jsx)
- High-performance React component wrapping KaTeX for inline (`$ ... $`) and block (`$$ ... $$`) math rendering.

---

## Verification Plan

### Automated Tests
- Run database seeding script to verify 4,400 questions generation in SQLite.
- Run node verification script to test Excel file generation (`questions_bank.xlsx`) and verify all 20 column headers match requirements.
- Run API integration tests for REST endpoints.

### Manual & Browser Verification
- Launch local development server (`npm run dev`).
- Launch browser subagent to interact with:
  1. Form level navigation & topic filtering (Form 1 to 12).
  2. Question practice drill, answer submission, KaTeX rendering, and solution step expansion.
  3. Graph / image visual asset display.
  4. Excel spreadsheet export trigger.
  5. Admin CRUD modal (create new question with graph & LaTeX, edit, delete).
