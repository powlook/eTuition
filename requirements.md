# Requirements Specification: eTuition Portal

## 1. Executive Summary & Vision

The **eTuition Portal** is an interactive online learning platform designed to provide quality mathematics education for students spanning **Form 1 to Form 12** (Primary 1 to Secondary 4 / Grade 1 to Grade 12 equivalent). Aligned with the official **Philippines DepEd MATATAG K-10 Mathematics Curriculum** and Senior High School (Grades 11–12) tracks, the portal enables students to explore structured math topics, attempt practice exercises, and receive immediate step-by-step working explanations and verified answers.

---

## 2. Target User Personas & Level Coverage

### 2.1 Target Audience
- **Primary / Lower Grade Students (Primary 1 - Primary 6 / Form 1 - 6):** Foundation-level learners requiring visual, step-by-step mathematical explanations.
- **Secondary / Upper Grade Students (Secondary 1 - Secondary 4 / Form 7 - 12):** Advanced learners focusing on algebra, geometry, trigonometry, statistics, and calculus.
- **Tutors / Administrators:** System managers responsible for managing curriculum topics, exercises, and user accounts.

### 2.2 Grade & Level Mapping Matrix
| Level Descriptor | Equivalent Grade (Philippines K-12) | Core Curriculum Focus |
| :--- | :--- | :--- |
| **Form 1 - Form 6** (Primary 1 - Primary 6) | Grade 1 - Grade 6 | **MATATAG Domains:** Number & Algebra (Whole Numbers, Fractions, Decimals, Money, Operations), Measurement & Geometry (2D/3D Shapes, Perimeter, Area, Volume, Transformations, Time), Data & Probability (Pictographs, Bar/Line Graphs) |
| **Form 7 - Form 10** (Secondary 1 - Secondary 4) | Grade 7 - Grade 10 | **MATATAG Domains:** Number & Algebra (Integers, Real Numbers, Algebraic Expressions, Polynomials, Equations & Inequalities, Functions, Financial Math), Measurement & Geometry (Polygons, Coordinate Geometry, Triangles, Circles, Trigonometry), Data & Probability (Sampling, Measures of Central Tendency & Variability, Probability) |
| **Form 11 - Form 12** (Senior Secondary) | Grade 11 - Grade 12 | **SHS Academic Tracks:** General Mathematics, Pre-Calculus, Basic Calculus, Advanced Statistics & Probability |

---

## 3. Detailed Functional Requirements

### Feature 1: Student & User Registration Module

- **FR-1.1 Student Registration & Access Request:**
  - Students can sign up with basic information: Full Name, Email, Password, Preferred Grade/Form Level (Form 1 to 12), and School/Region.
  - Upon registration, the student account enters a `Pending Approval` state until reviewed by the Admin Manager.
- **FR-1.2 Access Management & Status Flow:**
  - `Admin Manager`: Manages student accounts, reviews registrations, and grants/revokes portal access for students.
  - `Student`: Once access is granted by the Admin Manager, students can log in, practice topic exercises, and view step-by-step working derivations.
- **FR-1.4 Student Registered Form Level Constraint:**
  - Approved students are strictly restricted to viewing curriculum topics and practicing questions matching their registered `form_level` (Form 1 to 12).
  - Form Level tabs outside a student's registered level are visually locked (`🔒`) in the UI and enforced via backend API security controls.
- **FR-1.5 Admin Student Registered Level Management:**
  - Admin Managers have full administrative authority to change any student's registered Form Level (Form 1 to 12) at any time using an interactive dropdown selector in the Admin Control Panel (`PUT /api/admin/students/:id/level`).

---

### Feature 2: Philippines Mathematics Curriculum (MATATAG) & Automated Content Generation

- **FR-2.1 DepEd Philippines MATATAG Curriculum Alignment:**
  - Structured strictly according to the official **Philippines Department of Education (DepEd) MATATAG K to 10 Mathematics Curriculum**, organized across three primary content domains for Grades 1 to 10:
    1. **Number and Algebra** (Whole Numbers, Fractions, Decimals, Money, Operations, Ratios/Percentages, Expressions, Equations, Functions)
    2. **Measurement and Geometry** (2D/3D Shapes, Perimeter/Area/Volume, Angles, Polygons, Transformations, Trigonometry)
    3. **Data and Probability** (Pictographs, Bar/Line Graphs, Frequency Distributions, Position Measures, Experimental & Theoretical Probability)
  - **Senior High School (Grades 11–12 / Form 11–12):** Features specialized core & academic tracks:
    4. **General Mathematics** (Functions, Financial Math, Logic)
    5. **Pre-Calculus** (Trigonometric Functions, Analytic Geometry, Sequences)
    6. **Basic Calculus** (Limits, Derivatives, Integrals)
    7. **Statistics and Probability** (Random Variables, Sampling, Normal Distribution, Hypothesis Testing)

- **FR-2.2 Level & Topic Segmentation Hierarchy:**
  - Standardized hierarchical organization:
    $$\text{Level (Form 1-12)} \longrightarrow \text{MATATAG / SHS Domain} \longrightarrow \text{Topic (Content Standard)}$$
  - Each topic defines the learning focus (DepEd MATATAG Content Standard) and underlying mathematical rules for problem generation.

- **FR-2.3 MATATAG Curriculum Grade & Topic Breakdown (Form 1 to Form 12):**

#### Form 1 (Grade 1)
- **Topic 1 [Number and Algebra]:** 1. whole numbers up to 100; 2. ordinal numbers up to 10th; 3. addition of numbers with sums up to 20;
- **Topic 2 [Number and Algebra]:** 4. place value in any 2-digit number; 5. addition of numbers, with sums up to 100;
- **Topic 3 [Number and Algebra]:** 6. subtraction of numbers where both numbers are less than 100; 7. repeating patterns;
- **Topic 4 [Number and Algebra]:** 8. fractions ½ and ¼; 9. the denominations and values of Philippine coins and bills up to ₱100; 10. addition of money where the sum is up to ₱100 and subtraction of money where both amounts are less than ₱100
- **Topic 5 [Measurement and Geometry]:** 1. simple 2-dimensional shapes;
- **Topic 6 [Measurement and Geometry]:** 2. measurement of length and distance using non-standard units;
- **Topic 7 [Measurement and Geometry]:** 3. the movement of objects in half turn or quarterturn, in clockwise or counter clockwise direction; 4. time measured in hours, half-hours, quarter hours, days, weeks, months, years
- **Topic 8 [Data and Probability]:** 1. pictographs without a scale for the representation of data

#### Form 2 (Grade 2)
- **Topic 1 [Number and Algebra]:** 1. whole numbers up to 1000, 2. ordinal numbers up to 20th,; 3. addition of numbers with sums up to 1000;
- **Topic 2 [Number and Algebra]:** 4. the denominations and values of Philippine coins and bills up to ₱1000, and the addition of amounts of money with sums up to ₱1000; 5. subtraction of numbers where both numbers are less than 1000; 6. increasing patterns and decreasing patterns;
- **Topic 3 [Number and Algebra]:** 7. multiplication and division of whole numbers using the 2, 3, 4, 5, and 10 multiplication tables; 8. odd and even numbers;
- **Topic 4 [Number and Algebra]:** 9. unit fractions and similar fractions with denominators 2, 3, 4, 5, 6, and 8
- **Topic 5 [Measurement and Geometry]:** 1. circles, half circles, quarter circles and composite figures made up of squares, rectangles, triangles, circles, half-circles, and quarter-circles; 2. one step slides and flips of basic shapes and figures; 5. straight and curved lines, and flat and curved surfaces; 6. the perimeter of triangles, squares, and rectangles
- **Topic 6 [Measurement and Geometry]:** 3. measurement, comparison, and estimation of length and distance using appropriate tools and units;
- **Topic 7 [Measurement and Geometry]:** 4. duration of time, elapsed time, and telling and writing time in hours and minutes (using a.m. and p.m.); 5. straight and curved lines, and flat and curved surfaces. 6. the perimeter of triangles, squares, and rectangles
- **Topic 8 [Data and Probability]:** 1. pictographs with a scale for the representation of data

#### Form 3 (Grade 3)
- **Topic 1 [Number and Algebra]:** 1. whole numbers up to 10 000; 2. ordinal numbers up to 100th;
- **Topic 2 [Number and Algebra]:** 3. addition and subtraction of numbers of up to 4 digits, and money up to ₱10 000;
- **Topic 3 [Number and Algebra]:** 4. multiplication using 6, 7, 8 and 9 multiplication tables; 5. properties of multiplication 6. multiplication of numbers with and without regrouping 7. estimation of products of two numbers by first rounding to the nearest multiple of 10; 7. determination of missing terms contained in repeating and increasing patterns, and repeating and decreasing patterns. 8. generation of repeating and increasing patterns, and repeating and decreasing patterns.
- **Topic 4 [Number and Algebra]:** 1. division using the 6, 7, 8,and 9 multiplication tables. 2. division of 2- to 4-digit numbers. 3. estimation of quotients by first rounding the divisor and dividend to the nearest multiple of 10. 4. addition and subtraction of similar fractions.
- **Topic 5 [Measurement and Geometry]:** 1. areas of squares and rectangles; 2. points, lines, line segments, and rays; 3. parallel, perpendicular and intersecting lines;
- **Topic 6 [Measurement and Geometry]:** 4. measures of mass and capacity;
- **Topic 7 [Measurement and Geometry]:** 5. line symmetry; 6. resulting figure after a translation
- **Topic 8 [Data and Probability]:** 1. data presented in tables and single bar graphs; 2. outcomes from experiments and real-life situations

#### Form 4 (Grade 4)
- **Topic 1 [Number and Algebra]:** 1. whole numbers up to 1 000 000; 2. addition of numbers with sums up to 1 000 000 and subtraction of numbers where both numbers are less than 1 000 000;
- **Topic 2 [Number and Algebra]:** 3. multiplication of whole numbers with products-up to 1 000 000; 4. division of up to 4-digit numbers by up to 2-digit numbers, and the MDAS rules;
- **Topic 3 [Number and Algebra]:** 5. dissimilar and equivalent fractions; 6. factors and multiples of numbers up to 100; 7. addition and subtraction of dissimilar fractions;
- **Topic 4 [Number and Algebra]:** 8. simple patterns; 9. number sentences; 10. decimal numbers and their relationship to fractions
- **Topic 5 [Measurement and Geometry]:** 1. measurment of angles, right, acute, and obtuse angles; 2. properties of triangles and quadrilaterals; 3. perimeter of quadrilaterals, and composite figures composed of triangles and quadrilaterals;
- **Topic 6 [Measurement and Geometry]:** 4. conversion of units of length, mass, capacity, and time;
- **Topic 7 [Measurement and Geometry]:** 5. symmetric figures with respect to a line 6. reflection with shapes to a line
- **Topic 8 [Data and Probability]:** 1. presentation and interpretation of data in tabular form and in a single line graph

#### Form 5 (Grade 5)
- **Topic 1 [Number and Algebra]:** 1. the GEMDAS rules for operations with numbers; 2. multiplication of fractions;
- **Topic 2 [Number and Algebra]:** 3. division of fractions 4. decimal numbers with decimal parts up to ten thousandths; 5. addition and subtraction of decimal numbers; 6. divisibility rules; 7. prime and composite numbers; 8. fractions and decimals
- **Topic 3 [Number and Algebra]:** 9. multiplication and division of decimal numbers;
- **Topic 4 [Number and Algebra]:** 10. GMDAS rules when performing three or more operations with
- **Topic 5 [Measurement and Geometry]:** 1. 12- and 24-hour time, and world time zones; 2. area of a parallelogram, triangle, and trapezoid;
- **Topic 6 [Measurement and Geometry]:** 3. prisms and pyramids; 4. surface area of solid figures; 5. cubes and rectangular prisms; 6. rotation about a point given an angle
- **Topic 7 [Data and Probability]:** 1. double bar graphs and double line graphs; 2. theoretical probability

#### Form 6 (Grade 6)
- **Topic 1 [Measurement and Geometry]:** 1. tessellation of shapes. 2. translation, reflection and rotation with shapes
- **Topic 2 [Measurement and Geometry]:** 3. units of volume and capacity. 4. volume of cubes and rectangular prisms. 5. perimeter and area of triangles, parallelograms, trapezoids, and composite figures composed of triangles, squares, and rectangles. 6. parts of a circle, including circumference
- **Topic 3 [Measurement and Geometry]:** 7. area of a circle 8. composite figures composed of any two or more of: triangle, square, rectangle, circle, semi-circle.
- **Topic 4 [Number and Algebra]:** 1. the four operations with decimals. 2. the four operations with different combinations of fractions, whole numbers, and mixed numbers.
- **Topic 5 [Number and Algebra]:** 3. ratio and proportion. 4. percentages, and their relationships with fractions and decimals. 5. exponential form, including calculation using the GEMDAS rules.
- **Topic 6 [Number and Algebra]:** 6. common factors, greatest common factors, common multiples, and least common multiples.
- **Topic 7 [Data and Probability]:** 1. pie graphs.

#### Form 7 (Grade 7)
- **Topic 1 [Measurement and Geometry]:** 1. regular and irregular polygons and their features/properties. 2. determination of measures of angles and number of sides of polygons.
- **Topic 2 [Measurement and Geometry]:** 3. conversion of units of measure. 4. volume of square and rectangular pyramids, and cylinders.
- **Topic 3 [Number and Algebra]:** 1. application of percentages. 2. use of rates. 3. rational numbers.
- **Topic 4 [Number and Algebra]:** 4. square roots of perfect squares, cube roots of perfect cubes, and irrational numbers.
- **Topic 5 [Number and Algebra]:** 5. sets and subsets, and the union and intersection of sets using Venn diagrams 6. subset of real numbers.
- **Topic 6 [Number and Algebra]:** 7. the set of integers, and comparing and ordering integers 8. the four operations with integers. 9. simplification of numerical expressions involving integers. 10. absolute value of an integer.
- **Topic 7 [Number and Algebra]:** 11. the solution of simple equations. 12. the evaluation of algebraic expressions following substitution. 13. the rearrangement of a formula to make a different variable the subject of the formula.
- **Topic 8 [Number and Algebra]:** 14. operations using scientific notation.
- **Topic 9 [Data and Probability]:** 1. data collection and sampling techniques, and the presentation of data in appropriate tables and graphs. 2. interpretation of statistical graphs.
- **Topic 10 [Data and Probability]:** 3. outcomes from experiments.

#### Form 8 (Grade 8)
- **Topic 1 [Number and Algebra]:** 1. algebraic expressions and operations with monomials, binomials, and multinomials. 2. special products for binomials, and factorization of polynomials. 3. rational algebraic expressions and equations. 4. rules for obtaining terms in sequences.
- **Topic 2 [Number and Algebra]:** 5. plotting points, and finding distance and the midpoint of line segments on the Cartesian coordinate plane.
- **Topic 3 [Number and Algebra]:** 6. earning money, profit and loss, ‘best buys’, buying on terms.
- **Topic 4 [Number and Algebra]:** 7. linear equations in one variable. 8. linear inequalities in one variable and their graphs. 9. linear equations in two variables and their graphs. 10. systems of linear equations in two variables. 11. linear inequalities in two variables.
- **Topic 5 [Measurement and Geometry]:** 1. volume of pyramids (other than square and rectangular pyramids), cones, and spheres. 2. the Pythagorean Theorem. 3. triangle inequality theorems.
- **Topic 6 [Data and Probability]:** 1. measures of central tendency of ungrouped data.
- **Topic 7 [Data and Probability]:** 2. measures of variability for ungrouped data. 3. interpretation and analysis of graphs from primary and secondary data. 4. experimental and theoretical probability. 5. the Fundamental Counting Principle.

#### Form 9 (Grade 9)
- **Topic 1 [Measurement and Geometry]:** 1. simple geometric concepts and notations. 2. perpendicular and parallel lines, and angles formed by parallel lines cut by a transversal.
- **Topic 2 [Measurement and Geometry]:** 3. parallelism and perpendicularity of lines. 4. different quadrilaterals and their properties. 5. congruence of triangles. 6. congruence proofs.
- **Topic 3 [Measurement and Geometry]:** 7. similarity of polygons. 8. special triangles.
- **Topic 4 [Measurement and Geometry]:** 9. triangle theorems and triangle inequality theorems. 10. the trigonometric ratios and their application.
- **Topic 5 [Number and Algebra]:** 1. relations and functions. 2. graphs of linear functions, and the identification of domain and range, slope, intercepts, and zeros.
- **Topic 6 [Number and Algebra]:** 3. quadratic equations and graphs of quadratic functions. 4. the solution of quadratic equations.
- **Topic 7 [Number and Algebra]:** 5. direct and inverse variation
- **Topic 8 [Data and Probability]:** 1. interpretation and analysis of data to assess whether the data may be misleading. 2. probabilities of simple and compound events.

#### Form 10 (Grade 10)
- **Topic 1 [Measurement and Geometry]:** 1. the laws of sines and the laws of cosines. 2. translations, reflections, and rotations, in the Cartesian plane.
- **Topic 2 [Measurement and Geometry]:** 3. central angles; inscribed angles; and angles and lengths formed by intersecting chords, secants, and tangents of a circle. 4. sectors and segments of a circle, and their areas.
- **Topic 3 [Number and Algebra]:** 1. quadratic inequalities in one variable and in two variables. 2. absolute value equations and inequalities in one variable and their graphs.
- **Topic 4 [Number and Algebra]:** 3. radical expressions. 4. the roots of a quadratic equation. 5. quadratic functions. 6. equations reducible to quadratic equations.
- **Topic 5 [Number and Algebra]:** 7. equation of a circle and the graph of a circle.
- **Topic 6 [Number and Algebra]:** 8. simple interest, compound interest, and depreciation.
- **Topic 7 [Data and Probability]:** 1. box-and-whisker plots, and cumulative frequency histograms and polygons. 2. quartiles, deciles, and percentiles; interquartile range, and outliers.
- **Topic 8 [Data and Probability]:** 3. evaluation of statistical reports. 4. union and intersection of events, dependent and independent events, and complementary events.

#### Form 11 - Form 12 (Senior High School: Grades 11–12)
- **Topic 1 [General Mathematics]:** Functions, Rational/Exponential/Logarithmic Functions, Business Mathematics (Simple/Compound Interest, Annuities, Stocks/Bonds), and Logic
- **Topic 2 [Pre-Calculus]:** Analytic Geometry (Conic Sections: Circles, Parabolas, Ellipses, Hyperbolas), Series & Mathematical Induction, Trigonometric Functions & Identities
- **Topic 3 [Basic Calculus]:** Limits & Continuity, Derivatives (Rates of Change, Optimization), and Integration (Antiderivatives & Definite Integrals)
- **Topic 4 [Statistics & Probability]:** Random Variables, Discrete/Continuous Probability Distributions, Normal Distribution, Sampling Distributions, and Hypothesis Testing (Z-test, t-test)

- **FR-2.4 Full QBank Module Integration & Centralized Question Bank:**
  - **QBank Microservice Sourcing:** All practice questions served to eTuition students are dynamically retrieved from the QBank microservice REST API (`http://localhost:5000`).
  - **Access to QBank Manager Application:** Selecting the QBank Manager tab in the Admin Manager Control Panel opens/launches the standalone QBank web application (`http://localhost:3000`).
  - **No Local Question Creation in eTuition:** Direct question creation in eTuition is strictly disabled. All question creation, editing, deletion, Excel spreadsheet bulk import/export (`questions_bank.xlsx`), and parameterized fallback problem generation are handled exclusively through the QBank application.
  - **Pre-populated MATATAG Database:** Structured database containing 4,400+ static, verified topic-matched questions aligned with official DepEd MATATAG content standards across Form 1 to Form 10.
  - **Authentic Domain Matching:** Questions strictly feature authentic mathematical & statistical problems aligned with MATATAG domains (Number & Algebra, Measurement & Geometry, Data & Probability) and SHS tracks.

---

### Feature 3: Interactive Topics, Exercises, and Step-by-Step Workings Engine

- **FR-3.1 Topic & Exercise Selection:**
  - Students select specific math topics within their Form/Grade level (Form 1 to 12).
  - Upon selecting a topic, the portal retrieves exercises directly from the Question Bank matching that specific topic and DepEd MATATAG content standard.
- **FR-3.2 Mathematics Exercise Module:**
  - Interactive question types:
    - Multiple Choice Questions (MCQ)
    - Single Numeric / Exact Value Entry
    - Algebraic Expression Entry
    - Multi-step Problem Solving
  - Math formula display with clear LaTeX / Mathematical notation formatting (fractions, exponents, radicals, equations).
- **FR-3.3 Real-Time Answer & Step-by-Step Workings Display:**
  - **Instant Verification:** Immediate validation of student submissions.
  - **Automated Workings Display:** Shows clear, step-by-step mathematical working for every question in the bank:
    - *Problem Statement & Given Values*
    - *Formulas & Rules Applied*
    - *Intermediate Derivations & Calculations*
    - *Final Verified Answer*
  - Option to reveal hints or progressive steps during practice.
- **FR-3.4 Student Progress & History Tracking:**
  - Record exercise attempts, accuracy rate, time taken, and topic completion status.
  - Dashboard overview showing mastery percentage per topic/strand.

---

## 4. Non-Functional Requirements

- **NFR-1 Usability & UI Design:**
  - Clean, intuitive interface tailored to youth learners (clean typography, clear buttons, distraction-free reading).
  - Fully responsive across desktop, tablet, and mobile devices.
- **NFR-2 Performance & Latency:**
  - Fast page loads (< 2 seconds per page response).
  - Instant rendering of mathematical formulas and step-by-step solution text.
- **NFR-3 Security & Privacy:**
  - Secure storage of user passwords (salted hashing).
  - Strict data privacy protection for student records.

---

## 5. Summary of Deliverables Scope

> [!NOTE]
> Per project directives, development work will commence only after approval of this requirements specification.

- [x] **Requirements Specification Document:** `eTuition/requirements.md` (Updated to DepEd MATATAG Curriculum & Full QBank Module Integration)
- [x] **Database Schema & Architecture Plan:** `server/db.js` (SQLite tables for `users`, `topics`, `questions`, `exercise_attempts`)
- [x] **Curriculum Seed Data (Philippines DepEd MATATAG Math):** MATATAG DepEd Math topics + topic-matched questions pre-populated into Question Bank
- [x] **Full QBank Module Integration:** eTuition connected to QBank REST microservice (Port 5000) and QBank Manager application launcher (Port 3000); local question creation disabled
- [x] **Portal Application Development & Testing:** React + Vite Frontend, Express Backend, KaTeX Math Engine, Admin Control Panel, & Unit Testing Verified

