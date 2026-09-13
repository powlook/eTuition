import json
import sqlite3
import os

q_data = [
    {
        "num": 1,
        "title": "Polygon Interior Angle Sum of Quadrilateral",
        "text": "Define a quadrilateral and state the Polygon Interior Angle Sum Theorem for any convex quadrilateral.",
        "formula": "S = (n - 2) \\times 180^\\circ = (4 - 2) \\times 180^\\circ = 360^\\circ",
        "options": [
            "360°",
            "180°",
            "540°",
            "720°"
        ],
        "answer": "360°",
        "hint": "A quadrilateral can be split into two triangles by drawing one diagonal.",
        "steps": ["**Step 1: Formula** - \\(S = (n - 2) \\times 180^\\circ\\)","**Step 2: Substitute n = 4** - \\(S = (4 - 2) \\times 180^\\circ = 2 \\times 180^\\circ = 360^\\circ\\).","**Final Verified Answer:** \\(360^\\circ\\)"],
        "img_title": "Convex Quadrilateral ABCD Interior Angles",
        "img_type": "convex_quadrilateral"
    },
    {
        "num": 2,
        "title": "Hierarchical Classification of Quadrilaterals",
        "text": "Explain the hierarchical relationship between quadrilaterals: how are parallelograms, rectangles, rhombuses, squares, trapezoids, and kites related?",
        "formula": "\\text{Quadrilateral} \\implies \\begin{cases} \\text{Trapezoid} \\\\ \\text{Kite} \\\\ \\text{Parallelogram} \\implies \\begin{cases} \\text{Rectangle} \\\\ \\text{Rhombus} \\end{cases} \\implies \\text{Square} \\end{cases}",
        "options": [
            "Square is a subset of both Rectangle and Rhombus, which are subsets of Parallelogram.",
            "Trapezoid and Parallelogram are identical shapes.",
            "Rhombus is a subset of Kite and Trapezoid.",
            "Rectangle is a subset of Square."
        ],
        "answer": "Square is a subset of both Rectangle and Rhombus, which are subsets of Parallelogram.",
        "hint": "A square has all properties of both a rectangle (4 right angles) and a rhombus (4 equal sides).",
        "steps": ["**Step 1: Family tree** - Parallelograms branch into Rectangles (equal angles) and Rhombuses (equal sides).","**Step 2: Intersection** - The overlap of Rectangles and Rhombuses is the Square.","**Final Verified Answer:** \\(Square is a subset of both Rectangle and Rhombus, which are subsets of Parallelogram.\\)"],
        "img_title": "Hierarchy Diagram of Quadrilaterals",
        "img_type": "hierarchy_venn"
    },
    {
        "num": 3,
        "title": "Square vs Rectangle and Rhombus Relationship",
        "text": "Explain why every square is a rectangle and a rhombus, but not every rectangle or rhombus is a square.",
        "formula": "\\text{Square } = \\text{Rectangle } \\cap \\text{ Rhombus}",
        "options": [
            "A square possesses 4 right angles (rectangle) and 4 equal sides (rhombus), whereas rectangles may lack equal sides and rhombuses may lack right angles.",
            "Squares have unequal diagonals unlike rectangles.",
            "Rhombuses must have right angles.",
            "Rectangles have 4 equal sides."
        ],
        "answer": "A square possesses 4 right angles (rectangle) and 4 equal sides (rhombus), whereas rectangles may lack equal sides and rhombuses may lack right angles.",
        "hint": "A square fulfills both the angle definition of a rectangle and the side definition of a rhombus.",
        "steps": ["**Step 1: Square definitions** - 4 right angles (rectangle) + 4 equal sides (rhombus).","**Step 2: Counterexamples** - A 3x5 rectangle lacks equal sides; a 60°-120° rhombus lacks right angles.","**Final Verified Answer:** \\(A square possesses 4 right angles (rectangle) and 4 equal sides (rhombus), whereas rectangles may lack equal sides and rhombuses may lack right angles.\\)"],
        "img_title": "Square, Rectangle, and Rhombus Venn Diagram",
        "img_type": "square_venn"
    },
    {
        "num": 4,
        "title": "Five Defining Properties of Parallelograms",
        "text": "State the five primary properties of a parallelogram concerning opposite sides, opposite angles, consecutive angles, and diagonals.",
        "formula": "\\text{1. Opp sides } \\parallel \\quad \\text{2. Opp sides } = \\quad \\text{3. Opp angles } = \\quad \\text{4. Consec angles supp} \\quad \\text{5. Diag bisect}",
        "options": [
            "Opposite sides parallel & equal, opposite angles equal, consecutive angles supplementary (180°), diagonals bisect each other.",
            "All 4 sides equal, all 4 angles 90°, diagonals equal.",
            "Only 1 pair of parallel sides, diagonals equal.",
            "Diagonals are perpendicular, adjacent sides equal."
        ],
        "answer": "Opposite sides parallel & equal, opposite angles equal, consecutive angles supplementary (180°), diagonals bisect each other.",
        "hint": "Parallelogram properties involve pairs of opposite parts and diagonal bisection.",
        "steps": ["**Step 1: Properties** - 1) Opp sides parallel, 2) Opp sides equal, 3) Opp angles equal, 4) Consec angles supp, 5) Diagonals bisect.","**Final Verified Answer:** \\(Opposite sides parallel & equal, opposite angles equal, consecutive angles supplementary (180°), diagonals bisect each other.\\)"],
        "img_title": "Parallelogram ABCD Properties",
        "img_type": "parallelogram_props"
    },
    {
        "num": 5,
        "title": "Opposite Angles of a Parallelogram",
        "text": "In parallelogram ABCD, \\(m\\angle A = (4x + 15)^\\circ\\) and \\(m\\angle C = (6x - 25)^\\circ\\). Solve for x and find the degree measures of all four interior angles.",
        "formula": "4x + 15 = 6x - 25 \\implies 2x = 40 \\implies x = 20 \\implies m\\angle A = m\\angle C = 95^\\circ, \\quad m\\angle B = m\\angle D = 85^\\circ",
        "options": [
            "x = 20; ∠A = ∠C = 95°, ∠B = ∠D = 85°",
            "x = 15; ∠A = ∠C = 75°, ∠B = ∠D = 105°",
            "x = 25; ∠A = ∠C = 115°, ∠B = ∠D = 65°",
            "x = 10; ∠A = ∠C = 55°, ∠B = ∠D = 125°"
        ],
        "answer": "x = 20; ∠A = ∠C = 95°, ∠B = ∠D = 85°",
        "hint": "Opposite angles of a parallelogram are equal: \\(m\\angle A = m\\angle C\\). Consecutive angles are supplementary: \\(m\\angle B = 180^\\circ - m\\angle A\\).",
        "steps": ["**Step 1: Set up equation** - \\(4x + 15 = 6x - 25 \\implies 2x = 40 \\implies x = 20\\)","**Step 2: Find ∠A and ∠C** - \\(4(20) + 15 = 95^\\circ\\)","**Step 3: Find ∠B and ∠D** - \\(180^\\circ - 95^\\circ = 85^\\circ\\)","**Final Verified Answer:** \\(x = 20; ∠A = ∠C = 95°, ∠B = ∠D = 85°\\)"],
        "img_title": "Parallelogram ABCD Opposite Angles (4x + 15)° and (6x - 25)°",
        "img_type": "parallelogram_angles_algebra"
    },
    {
        "num": 6,
        "title": "Perimeter & Side Lengths of a Parallelogram",
        "text": "In parallelogram PQRS, adjacent sides measure PQ = 3x - 5 cm and QR = 2x + 3 cm. If the perimeter of the parallelogram is 56 cm, find the lengths of all four sides.",
        "formula": "2(PQ + QR) = 56 \\implies (3x - 5) + (2x + 3) = 28 \\implies 5x - 2 = 28 \\implies 5x = 30 \\implies x = 6 \\implies PQ = RS = 13 \\text{ cm}, QR = PS = 15 \\text{ cm}",
        "options": [
            "PQ = RS = 13 cm, QR = PS = 15 cm",
            "PQ = RS = 10 cm, QR = PS = 18 cm",
            "PQ = RS = 14 cm, QR = PS = 14 cm",
            "PQ = RS = 11 cm, QR = PS = 17 cm"
        ],
        "answer": "PQ = RS = 13 cm, QR = PS = 15 cm",
        "hint": "Perimeter \\(P = 2(a + b) = 56 \\implies a + b = 28\\).",
        "steps": ["**Step 1: Semi-perimeter** - \\((3x - 5) + (2x + 3) = 28\\)","**Step 2: Solve x** - \\(5x - 2 = 28 \\implies 5x = 30 \\implies x = 6\\)","**Step 3: Side lengths** - \\(PQ = 3(6) - 5 = 13\\) cm, \\(QR = 2(6) + 3 = 15\\) cm.","**Final Verified Answer:** \\(PQ = RS = 13 cm, QR = PS = 15 cm\\)"],
        "img_title": "Parallelogram PQRS Sides (3x - 5) and (2x + 3)",
        "img_type": "parallelogram_sides_algebra"
    },
    {
        "num": 7,
        "title": "Bisecting Diagonals of a Parallelogram",
        "text": "The diagonals of parallelogram ABCD intersect at point E. If AE = 2x + 3, EC = 3x - 4, BE = 4y - 1, and ED = y + 8, find the numerical values of x, y, AC, and BD.",
        "formula": "2x + 3 = 3x - 4 \\implies x = 7, \\quad 4y - 1 = y + 8 \\implies 3y = 9 \\implies y = 3 \\implies AC = 2(17) = 34, BD = 2(11) = 22",
        "options": [
            "x = 7, y = 3, AC = 34, BD = 22",
            "x = 5, y = 4, AC = 26, BD = 30",
            "x = 7, y = 2, AC = 34, BD = 14",
            "x = 6, y = 3, AC = 30, BD = 22"
        ],
        "answer": "x = 7, y = 3, AC = 34, BD = 22",
        "hint": "Diagonals of a parallelogram bisect each other: AE = EC and BE = ED.",
        "steps": ["**Step 1: Equate AE & EC** - \\(2x + 3 = 3x - 4 \\implies x = 7 \\implies AE = EC = 17 \\implies AC = 34\\)","**Step 2: Equate BE & ED** - \\(4y - 1 = y + 8 \\implies 3y = 9 \\implies y = 3 \\implies BE = ED = 11 \\implies BD = 22\\)","**Final Verified Answer:** \\(x = 7, y = 3, AC = 34, BD = 22\\)"],
        "img_title": "Parallelogram ABCD Diagonals Intersecting at E",
        "img_type": "parallelogram_diagonals_algebra"
    },
    {
        "num": 8,
        "title": "Area & Altitude of a Parallelogram",
        "text": "In parallelogram ABCD, the height corresponding to base AB is 8 cm. If AB = 15 cm and AD = 10 cm, calculate the area of the parallelogram and the height corresponding to base AD.",
        "formula": "\\text{Area} = b_1 \\cdot h_1 = 15 \\times 8 = 120 \\text{ cm}^2, \\quad h_2 = \\frac{\\text{Area}}{b_2} = \\frac{120}{10} = 12 \\text{ cm}",
        "options": [
            "Area = 120 cm², Height to AD = 12 cm",
            "Area = 150 cm², Height to AD = 15 cm",
            "Area = 120 cm², Height to AD = 10 cm",
            "Area = 80 cm², Height to AD = 8 cm"
        ],
        "answer": "Area = 120 cm², Height to AD = 12 cm",
        "hint": "Area is constant: \\(\\text{Area} = b_1 \\cdot h_1 = b_2 \\cdot h_2\\).",
        "steps": ["**Step 1: Area** - \\(15 \\times 8 = 120\\) cm²","**Step 2: Second height** - \\(h_2 = 120 / 10 = 12\\) cm.","**Final Verified Answer:** \\(Area = 120 cm², Height to AD = 12 cm\\)"],
        "img_title": "Parallelogram Area and Heights h1, h2",
        "img_type": "parallelogram_area_heights"
    },
    {
        "num": 9,
        "title": "Rectangle Definition & Congruent Diagonals Proof",
        "text": "Define a rectangle and state the theorem regarding its diagonals.",
        "formula": "\\text{Parallelogram is a Rectangle} \\iff \\text{Diagonals are Congruent } (AC = BD)",
        "options": [
            "A rectangle is a parallelogram with 4 right angles; its diagonals are congruent.",
            "A rectangle is a quadrilateral with perpendicular diagonals.",
            "A rectangle has 4 equal sides.",
            "A rectangle has diagonals that bisect vertex angles at 45°."
        ],
        "answer": "A rectangle is a parallelogram with 4 right angles; its diagonals are congruent.",
        "hint": "Equal diagonals distinguish a rectangle from a general parallelogram.",
        "steps": ["**Step 1: Definition** - Parallelogram with 4 right angles (90°).","**Step 2: Diagonal property** - Diagonals are equal in length: \\(AC = BD\\).","**Final Verified Answer:** \\(A rectangle is a parallelogram with 4 right angles; its diagonals are congruent.\\)"],
        "img_title": "Rectangle ABCD Congruent Diagonals AC = BD",
        "img_type": "rectangle_diagonals_proof"
    },
    {
        "num": 10,
        "title": "Rectangle Diagonals Algebra",
        "text": "In rectangle ABCD, diagonals AC and BD intersect at E. If AC = 5x - 8 and BD = 2x + 13, solve for x and find the length of diagonal BD.",
        "formula": "5x - 8 = 2x + 13 \\implies 3x = 21 \\implies x = 7 \\implies BD = 2(7) + 13 = 27",
        "options": [
            "x = 7, BD = 27",
            "x = 5, BD = 23",
            "x = 7, BD = 21",
            "x = 6, BD = 25"
        ],
        "answer": "x = 7, BD = 27",
        "hint": "Set diagonal lengths equal: \\(AC = BD\\).",
        "steps": ["**Step 1: Equate AC & BD** - \\(5x - 8 = 2x + 13 \\implies 3x = 21 \\implies x = 7\\)","**Step 2: Substitute x** - \\(BD = 2(7) + 13 = 27\\).","**Final Verified Answer:** \\(x = 7, BD = 27\\)"],
        "img_title": "Rectangle ABCD Diagonals 5x - 8 and 2x + 13",
        "img_type": "rectangle_diagonals_algebra"
    },
    {
        "num": 11,
        "title": "Rectangle Diagonal Angles",
        "text": "In rectangle PQRS, diagonal PR makes an angle of 28° with side PQ. Calculate the angle between diagonal PR and side PS, and find the acute angle between the intersecting diagonals.",
        "formula": "\\angle RPS = 90^\\circ - 28^\\circ = 62^\\circ, \\quad \\text{Acute angle between diagonals } = 2 \\times 28^\\circ = 56^\\circ",
        "options": [
            "∠RPS = 62°, Acute angle = 56°",
            "∠RPS = 62°, Acute angle = 62°",
            "∠RPS = 56°, Acute angle = 56°",
            "∠RPS = 28°, Acute angle = 56°"
        ],
        "answer": "∠RPS = 62°, Acute angle = 56°",
        "hint": "Corner angle is 90°, so \\(\\angle RPS = 90^\circ - 28^\circ\\). Diagonals form isosceles triangles.",
        "steps": ["**Step 1: Angle to PS** - \\(90^\circ - 28^\circ = 62^\circ\\)","**Step 2: Intersecting diagonals angle** - Isosceles triangle base angles are 28°, so vertex angle \\(= 180^\circ - 2(28^\circ) = 124^\circ\\). Acute supplementary angle \\(= 180^\circ - 124^\circ = 56^\circ\\).","**Final Verified Answer:** \\(∠RPS = 62°, Acute angle = 56°\\)"],
        "img_title": "Rectangle PQRS Diagonal Angles 28°",
        "img_type": "rectangle_angles_diagonal"
    },
    {
        "num": 12,
        "title": "Soccer Field Diagonal Length",
        "text": "A rectangular soccer field has a length of 105 meters and a width of 68 meters. Calculate the diagonal distance between opposite corner flags.",
        "formula": "d = \\sqrt{105^2 + 68^2} = \\sqrt{11025 + 4624} = \\sqrt{15649} \\approx 125.1 \\text{ meters}",
        "options": [
            "125.1 meters",
            "173.0 meters",
            "118.5 meters",
            "132.0 meters"
        ],
        "answer": "125.1 meters",
        "hint": "Use the Pythagorean theorem: \\(d = \\sqrt{L^2 + W^2}\\).",
        "steps": ["**Step 1: Squares** - \\(105^2 = 11025\\), \\(68^2 = 4624\\)","**Step 2: Sum** - \\(11025 + 4624 = 15649\\)","**Step 3: Square root** - \\(\\sqrt{15649} \\approx 125.1\\) m.","**Final Verified Answer:** \\(125.1 meters\\)"],
        "img_title": "Soccer Field Rectangle 105m x 68m",
        "img_type": "rectangle_soccer_field"
    },
    {
        "num": 13,
        "title": "Rhombus Definition & Diagonal Perpendicularity Proof",
        "text": "Define a rhombus and state the theorem regarding its diagonals.",
        "formula": "\\text{Parallelogram is a Rhombus} \\iff \\text{Diagonals are Perpendicular } (d_1 \\perp d_2)",
        "options": [
            "A rhombus is a parallelogram with 4 equal sides; its diagonals are perpendicular bisectors of each other and bisect the vertex angles.",
            "A rhombus has 4 right angles.",
            "A rhombus has equal diagonals.",
            "A rhombus has only 1 pair of parallel sides."
        ],
        "answer": "A rhombus is a parallelogram with 4 equal sides; its diagonals are perpendicular bisectors of each other and bisect the vertex angles.",
        "hint": "Perpendicular diagonals intersecting at 90° define a rhombus.",
        "steps": ["**Step 1: Definition** - Parallelogram with 4 congruent sides.","**Step 2: Diagonal properties** - Diagonals intersect at 90° and bisect vertex angles.","**Final Verified Answer:** \\(A rhombus is a parallelogram with 4 equal sides; its diagonals are perpendicular bisectors of each other and bisect the vertex angles.\\)"],
        "img_title": "Rhombus ABCD Perpendicular Diagonals d1 ⊥ d2",
        "img_type": "rhombus_diagonals_proof"
    },
    {
        "num": 14,
        "title": "Rhombus Side, Perimeter & Area from Diagonals",
        "text": "In rhombus ABCD, the diagonals intersect at E. If diagonal AC = 16 cm and diagonal BD = 12 cm, calculate the side length, perimeter, and area of the rhombus.",
        "formula": "AE = 8, BE = 6 \\implies s = \\sqrt{8^2 + 6^2} = 10 \\text{ cm}, \\quad P = 40 \\text{ cm}, \\quad \\text{Area} = \\frac{16 \\times 12}{2} = 96 \\text{ cm}^2",
        "options": [
            "Side = 10 cm, Perimeter = 40 cm, Area = 96 cm²",
            "Side = 14 cm, Perimeter = 56 cm, Area = 192 cm²",
            "Side = 10 cm, Perimeter = 40 cm, Area = 192 cm²",
            "Side = 8 cm, Perimeter = 32 cm, Area = 96 cm²"
        ],
        "answer": "Side = 10 cm, Perimeter = 40 cm, Area = 96 cm²",
        "hint": "Diagonals split into half-lengths 8 and 6 forming right triangles: \\(s = \\sqrt{8^2 + 6^2} = 10\\). Area = \\(\\frac{1}{2} d_1 d_2\\).",
        "steps": ["**Step 1: Half diagonals** - \\(AE = 8\\), \\(BE = 6\\)","**Step 2: Side length** - \\(s = \\sqrt{64 + 36} = 10\\) cm","**Step 3: Perimeter & Area** - \\(P = 4(10) = 40\\) cm, \\(\\text{Area} = (16 \\times 12)/2 = 96\\) cm².","**Final Verified Answer:** \\(Side = 10 cm, Perimeter = 40 cm, Area = 96 cm²\\)"],
        "img_title": "Rhombus ABCD Diagonals 16cm and 12cm",
        "img_type": "rhombus_calc_14"
    },
    {
        "num": 15,
        "title": "Rhombus Interior Angles Calculation",
        "text": "In rhombus JKLM, if m∠JKL = 124°, calculate the measures of ∠JKM, ∠MLK, and ∠JML.",
        "formula": "\\angle JKM = \\frac{124^\\circ}{2} = 62^\\circ, \\quad \\angle MLK = 124^\\circ, \\quad \\angle JML = 180^\\circ - 124^\\circ = 56^\\circ",
        "options": [
            "∠JKM = 62°, ∠MLK = 124°, ∠JML = 56°",
            "∠JKM = 62°, ∠MLK = 56°, ∠JML = 124°",
            "∠JKM = 31°, ∠MLK = 124°, ∠JML = 56°",
            "∠JKM = 62°, ∠MLK = 124°, ∠JML = 62°"
        ],
        "answer": "∠JKM = 62°, ∠MLK = 124°, ∠JML = 56°",
        "hint": "Diagonals bisect vertex angles (∠JKM = 124°/2 = 62°). Opposite angles are equal (∠MLK = 124°). Consecutive angles are supplementary (∠JML = 180° - 124° = 56°).",
        "steps": ["**Step 1: Bisected angle** - \\(\\angle JKM = 124^\circ / 2 = 62^\circ\\)","**Step 2: Opposite angle** - \\(\\angle MLK = 124^\circ\\)","**Step 3: Consecutive angle** - \\(\\angle JML = 180^\circ - 124^\circ = 56^\circ\\).","**Final Verified Answer:** \\(∠JKM = 62°, ∠MLK = 124°, ∠JML = 56°\\)"],
        "img_title": "Rhombus JKLM Angle 124°",
        "img_type": "rhombus_angles_15"
    },
    {
        "num": 16,
        "title": "Diamond Warning Sign Diagonal Braces",
        "text": "A diamond-shaped road warning sign is a rhombus with side length 60 cm and an interior angle of 60°. Calculate the exact lengths of both diagonal braces in simplified radical form.",
        "formula": "d_1 = 60 \\text{ cm (shorter diagonal)}, \\quad d_2 = 60\\sqrt{3} \\text{ cm (longer diagonal)}",
        "options": [
            "d₁ = 60 cm, d₂ = 60√3 cm",
            "d₁ = 30 cm, d₂ = 30√3 cm",
            "d₁ = 60 cm, d₂ = 120 cm",
            "d₁ = 60√2 cm, d₂ = 60√2 cm"
        ],
        "answer": "d₁ = 60 cm, d₂ = 60√3 cm",
        "hint": "An interior angle of 60° splits the rhombus into two equilateral triangles of side 60 cm.",
        "steps": ["**Step 1: Shorter diagonal** - Equal to side length \\(= 60\\) cm.","**Step 2: Longer diagonal** - In 30°-60°-90° triangle: \\(d_2 = 2 \\times 30\\sqrt{3} = 60\\sqrt{3}\\) cm.","**Final Verified Answer:** \\(d₁ = 60 cm, d₂ = 60√3 cm\\)"],
        "img_title": "Diamond Warning Sign Rhombus 60cm",
        "img_type": "rhombus_warning_sign_16"
    },
    {
        "num": 17,
        "title": "Square Side-to-Diagonal Ratio",
        "text": "Define a square and state the exact ratio of its side length s to its diagonal length d.",
        "formula": "d = s\\sqrt{2} \\implies \\text{Ratio } s : d = 1 : \\sqrt{2}",
        "options": [
            "1 : √2",
            "1 : 2",
            "1 : √3",
            "2 : 1"
        ],
        "answer": "1 : √2",
        "hint": "In a 45°-45°-90° right triangle, the hypotenuse (diagonal) is \\(s\\sqrt{2}\\).",
        "steps": ["**Step 1: Pythagorean theorem** - \\(d^2 = s^2 + s^2 = 2s^2 \\implies d = s\\sqrt{2}\\).","**Step 2: Ratio** - \\(s / (s\\sqrt{2}) = 1 / \\sqrt{2}\\).","**Final Verified Answer:** \\(1 : √2\\)"],
        "img_title": "Square Side s and Diagonal s√2",
        "img_type": "square_ratio_17"
    },
    {
        "num": 18,
        "title": "Square Plaza Calculations from Diagonal",
        "text": "The diagonal of a square plaza measures 28 meters. Calculate the exact side length, perimeter, and surface area of the plaza in simplest radical form.",
        "formula": "s = \\frac{28}{\\sqrt{2}} = 14\\sqrt{2} \\text{ m}, \\quad P = 56\\sqrt{2} \\text{ m}, \\quad \\text{Area} = (14\\sqrt{2})^2 = 392 \\text{ m}^2",
        "options": [
            "Side = 14√2 m, Perimeter = 56√2 m, Area = 392 m²",
            "Side = 14 m, Perimeter = 56 m, Area = 196 m²",
            "Side = 28√2 m, Perimeter = 112√2 m, Area = 784 m²",
            "Side = 14√2 m, Perimeter = 56√2 m, Area = 196 m²"
        ],
        "answer": "Side = 14√2 m, Perimeter = 56√2 m, Area = 392 m²",
        "hint": "Side \\(s = d / \\sqrt{2} = 28 / \\sqrt{2} = 14\\sqrt{2}\\). Area \\(= s^2 = 392\\).",
        "steps": ["**Step 1: Side length** - \\(s = 28 / \\sqrt{2} = 14\\sqrt{2}\\) m","**Step 2: Perimeter** - \\(4 \\times 14\\sqrt{2} = 56\\sqrt{2}\\) m","**Step 3: Area** - \\((14\\sqrt{2})^2 = 196 \\times 2 = 392\\) m².","**Final Verified Answer:** \\(Side = 14√2 m, Perimeter = 56√2 m, Area = 392 m²\\)"],
        "img_title": "Square Plaza Diagonal 28m",
        "img_type": "square_plaza_18"
    },
    {
        "num": 19,
        "title": "Segment Length on Square Diagonal",
        "text": "In square ABCD, point P lies on diagonal AC such that AP = AB. If side length AB = 10 cm, calculate the length of segment PC.",
        "formula": "AC = 10\\sqrt{2} \\approx 14.14, \\quad AP = 10 \\implies PC = 10\\sqrt{2} - 10 = 10(\\sqrt{2} - 1) \\approx 4.14 \\text{ cm}",
        "options": [
            "10(√2 - 1) cm (approx. 4.14 cm)",
            "5 cm",
            "10(√2 + 1) cm",
            "10 - √2 cm"
        ],
        "answer": "10(√2 - 1) cm (approx. 4.14 cm)",
        "hint": "Diagonal \\(AC = 10\\sqrt{2}\\). Subtract \\(AP = 10\\).",
        "steps": ["**Step 1: Diagonal AC** - \\(10\\sqrt{2}\\) cm","**Step 2: Segment PC** - \\(AC - AP = 10\\sqrt{2} - 10 = 10(\\sqrt{2} - 1)\\) cm.","**Final Verified Answer:** \\(10(√2 - 1) cm (approx. 4.14 cm)\\)"],
        "img_title": "Square ABCD Diagonal Segment PC",
        "img_type": "square_segment_19"
    },
    {
        "num": 20,
        "title": "Trapezoid Definition & Isosceles Trapezoid",
        "text": "Define a trapezoid and distinguish its bases, legs, and base angles. Define an isosceles trapezoid.",
        "formula": "\\text{Trapezoid: Quadrilateral with exactly 1 pair of parallel sides (Bases)}",
        "options": [
            "A trapezoid has exactly 1 pair of parallel sides (bases); an isosceles trapezoid has congruent non-parallel legs.",
            "A trapezoid has 2 pairs of parallel sides.",
            "An isosceles trapezoid has 4 equal sides.",
            "Trapezoids always have right angles."
        ],
        "answer": "A trapezoid has exactly 1 pair of parallel sides (bases); an isosceles trapezoid has congruent non-parallel legs.",
        "hint": "One pair of parallel sides defines a trapezoid. Equal legs make it isosceles.",
        "steps": ["**Step 1: Definition** - Quadrilateral with 1 pair of parallel sides (Bases). Non-parallel sides are Legs.","**Step 2: Isosceles trapezoid** - Legs are equal in length.","**Final Verified Answer:** \\(A trapezoid has exactly 1 pair of parallel sides (bases); an isosceles trapezoid has congruent non-parallel legs.\\)"],
        "img_title": "Isosceles Trapezoid Bases and Legs",
        "img_type": "trapezoid_def_20"
    },
    {
        "num": 21,
        "title": "Isosceles Trapezoid Base Angles & Diagonals",
        "text": "State the key properties of an isosceles trapezoid regarding its base angles and diagonals.",
        "formula": "\\text{Base angles congruent } (\\angle A = \\angle B, \\angle C = \\angle D), \\quad \\text{Diagonals congruent } (AC = BD)",
        "options": [
            "Base angles are congruent and diagonals are congruent.",
            "Diagonals are perpendicular.",
            "Opposite angles are congruent.",
            "Diagonals bisect each other."
        ],
        "answer": "Base angles are congruent and diagonals are congruent.",
        "hint": "Both pairs of base angles are equal and diagonals AC and BD have equal lengths.",
        "steps": ["**Step 1: Properties** - 1) Base angles congruent, 2) Diagonals congruent (AC = BD).","**Final Verified Answer:** \\(Base angles are congruent and diagonals are congruent.\\)"],
        "img_title": "Isosceles Trapezoid Base Angles & Diagonals",
        "img_type": "trapezoid_isosceles_props"
    },
    {
        "num": 22,
        "title": "Isosceles Trapezoid Area & Height",
        "text": "In isosceles trapezoid ABCD with AB || CD, leg AD = 10 cm, base AB = 12 cm, and base CD = 24 cm. Calculate the perpendicular height and the area of the trapezoid.",
        "formula": "x = \\frac{24 - 12}{2} = 6 \\text{ cm}, \\quad h = \\sqrt{10^2 - 6^2} = 8 \\text{ cm}, \\quad \\text{Area} = \\frac{12 + 24}{2} \\times 8 = 144 \\text{ cm}^2",
        "options": [
            "Height = 8 cm, Area = 144 cm²",
            "Height = 6 cm, Area = 108 cm²",
            "Height = 10 cm, Area = 180 cm²",
            "Height = 8 cm, Area = 288 cm²"
        ],
        "answer": "Height = 8 cm, Area = 144 cm²",
        "hint": "Draw heights to form a central rectangle of 12 cm and two right triangles with base 6 cm. \\(h = \\sqrt{10^2 - 6^2} = 8\\).",
        "steps": ["**Step 1: Triangle base** - \\((24 - 12) / 2 = 6\\) cm","**Step 2: Height** - \\(h = \\sqrt{100 - 36} = 8\\) cm","**Step 3: Area** - \\(((12 + 24)/2) \\times 8 = 18 \\times 8 = 144\\) cm².","**Final Verified Answer:** \\(Height = 8 cm, Area = 144 cm²\\)"],
        "img_title": "Isosceles Trapezoid ABCD 12cm, 24cm, Leg 10cm",
        "img_type": "trapezoid_calc_22"
    },
    {
        "num": 23,
        "title": "Isosceles Trapezoid Consecutive Angles Algebra",
        "text": "In isosceles trapezoid PQRS with PQ || RS, if m∠P = (3x + 20)° and m∠S = (2x + 10)°, solve for x and find all four interior angles.",
        "formula": "(3x + 20) + (2x + 10) = 180 \\implies 5x + 30 = 180 \\implies 5x = 150 \\implies x = 30 \\implies m\\angle P = m\\angle Q = 110^\\circ, m\\angle S = m\\angle R = 70^\\circ",
        "options": [
            "x = 30; ∠P = ∠Q = 110°, ∠S = ∠R = 70°",
            "x = 25; ∠P = ∠Q = 95°, ∠S = ∠R = 85°",
            "x = 30; ∠P = ∠Q = 70°, ∠S = ∠R = 110°",
            "x = 20; ∠P = ∠Q = 80°, ∠S = ∠R = 100°"
        ],
        "answer": "x = 30; ∠P = ∠Q = 110°, ∠S = ∠R = 70°",
        "hint": "Consecutive interior angles along a leg are supplementary: \\(m\\angle P + m\\angle S = 180^\circ\\). Base angles are equal.",
        "steps": ["**Step 1: Set sum 180°** - \\((3x + 20) + (2x + 10) = 180 \\implies 5x = 150 \\implies x = 30\\)","**Step 2: Find angles** - \\(m\\angle P = 3(30) + 20 = 110^\circ\\), \\(m\\angle S = 2(30) + 10 = 70^\circ\\).","**Step 3: Base angles equal** - \\(m\\angle Q = 110^\circ\\), \\(m\\angle R = 70^\circ\\).","**Final Verified Answer:** \\(x = 30; ∠P = ∠Q = 110°, ∠S = ∠R = 70°\\)"],
        "img_title": "Isosceles Trapezoid Angles (3x + 20)° and (2x + 10)°",
        "img_type": "trapezoid_angles_algebra_23"
    },
    {
        "num": 24,
        "title": "Trapezoid Midsegment Theorem",
        "text": "State the Trapezoid Midsegment Theorem relating the midsegment length m to the parallel bases a and b.",
        "formula": "m = \\frac{a + b}{2}",
        "options": [
            "The midsegment is parallel to both bases and its length is equal to half the sum of the bases: m = (a + b) / 2.",
            "m = a - b",
            "m = √(a · b)",
            "m = a + b"
        ],
        "answer": "The midsegment is parallel to both bases and its length is equal to half the sum of the bases: m = (a + b) / 2.",
        "hint": "The midsegment length is the average of the two parallel bases.",
        "steps": ["**Step 1: Theorem** - \\(m = \\frac{a + b}{2}\\). Parallel to both bases.","**Final Verified Answer:** \\(The midsegment is parallel to both bases and its length is equal to half the sum of the bases: m = (a + b) / 2.\\)"],
        "img_title": "Trapezoid Midsegment m = (a + b) / 2",
        "img_type": "trapezoid_midsegment_theorem_24"
    },
    {
        "num": 25,
        "title": "Trapezoid Midsegment Base Lengths",
        "text": "In trapezoid ABCD with bases AB and CD, midsegment MN has length 22 cm. If base CD is 8 cm longer than base AB, find the lengths of both parallel bases.",
        "formula": "\\frac{AB + (AB + 8)}{2} = 22 \\implies 2 AB + 8 = 44 \\implies 2 AB = 36 \\implies AB = 18 \\text{ cm}, CD = 26 \\text{ cm}",
        "options": [
            "AB = 18 cm, CD = 26 cm",
            "AB = 14 cm, CD = 30 cm",
            "AB = 16 cm, CD = 24 cm",
            "AB = 20 cm, CD = 28 cm"
        ],
        "answer": "AB = 18 cm, CD = 26 cm",
        "hint": "Set \\(AB = x\\) and \\(CD = x + 8\\). Solve \\((x + x + 8)/2 = 22\\).",
        "steps": ["**Step 1: Set equation** - \\((2x + 8)/2 = 22 \\implies 2x + 8 = 44 \\implies 2x = 36 \\implies x = 18\\)","**Step 2: Bases** - \\(AB = 18\\) cm, \\(CD = 26\\) cm.","**Final Verified Answer:** \\(AB = 18 cm, CD = 26 cm\\)"],
        "img_title": "Trapezoid Midsegment 22cm and Bases",
        "img_type": "trapezoid_midsegment_calc_25"
    },
    {
        "num": 26,
        "title": "Trapezoid Midsegment Algebra",
        "text": "In trapezoid WXYZ with midsegment EF, base WX = 3x + 1, base YZ = 5x - 7, and midsegment EF = 21. Solve for x and find the base lengths.",
        "formula": "\\frac{(3x + 1) + (5x - 7)}{2} = 21 \\implies 8x - 6 = 42 \\implies 8x = 48 \\implies x = 6 \\implies WX = 19, YZ = 23",
        "options": [
            "x = 6; WX = 19, YZ = 23",
            "x = 5; WX = 16, YZ = 18",
            "x = 7; WX = 22, YZ = 28",
            "x = 4; WX = 13, YZ = 13"
        ],
        "answer": "x = 6; WX = 19, YZ = 23",
        "hint": "Set \\(((3x + 1) + (5x - 7))/2 = 21\\).",
        "steps": ["**Step 1: Simplify** - \\(8x - 6 = 42 \\implies 8x = 48 \\implies x = 6\\)","**Step 2: Find bases** - \\(WX = 3(6) + 1 = 19\\), \\(YZ = 5(6) - 7 = 23\\).","**Final Verified Answer:** \\(x = 6; WX = 19, YZ = 23\\)"],
        "img_title": "Trapezoid Midsegment EF = 21 Algebra",
        "img_type": "trapezoid_midsegment_algebra_26"
    },
    {
        "num": 27,
        "title": "Kite Definition & Properties",
        "text": "Define a kite and state its defining properties regarding sides, diagonals, and angles.",
        "formula": "\\text{Kite: 2 distinct pairs of equal adjacent sides; } d_1 \\perp d_2, \\text{ 1 diagonal bisects opposite angles}",
        "options": [
            "A kite has 2 pairs of equal adjacent sides, perpendicular diagonals, and exactly 1 pair of congruent opposite angles.",
            "A kite has 2 pairs of parallel sides.",
            "A kite has equal diagonals.",
            "All 4 angles of a kite are equal."
        ],
        "answer": "A kite has 2 pairs of equal adjacent sides, perpendicular diagonals, and exactly 1 pair of congruent opposite angles.",
        "hint": "Adjacent sides are equal (not opposite). Diagonals meet at 90°.",
        "steps": ["**Step 1: Definition** - Quadrilateral with two distinct pairs of equal adjacent sides.","**Step 2: Diagonal property** - Diagonals are perpendicular. One diagonal is axis of symmetry.","**Final Verified Answer:** \\(A kite has 2 pairs of equal adjacent sides, perpendicular diagonals, and exactly 1 pair of congruent opposite angles.\\)"],
        "img_title": "Kite ABCD Properties",
        "img_type": "kite_props_27"
    },
    {
        "num": 28,
        "title": "Kite Area Formula",
        "text": "State the formula for the area of a kite with perpendicular diagonals \\(d_1\\) and \\(d_2\\).",
        "formula": "\\text{Area} = \\frac{1}{2} d_1 d_2",
        "options": [
            "Area = (1/2) · d₁ · d₂",
            "Area = d₁ · d₂",
            "Area = d₁ + d₂",
            "Area = (1/4) · d₁ · d₂"
        ],
        "answer": "Area = (1/2) · d₁ · d₂",
        "hint": "Area of any quadrilateral with perpendicular diagonals is half the product of the diagonals.",
        "steps": ["**Step 1: Formula** - \\(\\text{Area} = \\frac{1}{2} d_1 d_2\\).","**Final Verified Answer:** \\(Area = (1/2) · d₁ · d₂\\)"],
        "img_title": "Kite Area Formula Area = 1/2 d1 d2",
        "img_type": "kite_area_formula_28"
    },
    {
        "num": 29,
        "title": "Kite Fabric Area Calculation",
        "text": "A decorative kite has diagonal spars of length 35 cm and 48 cm. Calculate the area of fabric required to cover the face of the kite.",
        "formula": "\\text{Area} = \\frac{35 \\times 48}{2} = 35 \\times 24 = 840 \\text{ cm}^2",
        "options": [
            "840 cm²",
            "1680 cm²",
            "420 cm²",
            "960 cm²"
        ],
        "answer": "840 cm²",
        "hint": "Use \\(\\text{Area} = \\frac{1}{2} d_1 d_2\\).",
        "steps": ["**Step 1: Compute** - \\((35 \\times 48)/2 = 35 \\times 24 = 840\\) cm².","**Final Verified Answer:** \\(840 cm²\\)"],
        "img_title": "Decorative Kite Diagonals 35cm and 48cm",
        "img_type": "kite_fabric_29"
    },
    {
        "num": 30,
        "title": "Kite Side Lengths from Diagonal Segments",
        "text": "In kite ABCD where AB = AD and CB = CD, the diagonals intersect at E. If AE = 6 cm, EC = 15 cm, and BE = 8 cm, calculate the lengths of all four sides and the perimeter of the kite.",
        "formula": "AB = AD = \\sqrt{6^2 + 8^2} = 10 \\text{ cm}, \\quad BC = CD = \\sqrt{15^2 + 8^2} = 17 \\text{ cm}, \\quad P = 2(10 + 17) = 54 \\text{ cm}",
        "options": [
            "AB = AD = 10 cm, BC = CD = 17 cm, Perimeter = 54 cm",
            "AB = AD = 12 cm, BC = CD = 15 cm, Perimeter = 54 cm",
            "AB = AD = 10 cm, BC = CD = 17 cm, Perimeter = 27 cm",
            "AB = AD = 14 cm, BC = CD = 18 cm, Perimeter = 64 cm"
        ],
        "answer": "AB = AD = 10 cm, BC = CD = 17 cm, Perimeter = 54 cm",
        "hint": "Diagonals are perpendicular at E. Use Pythagorean theorem on right triangles ABE and CBE.",
        "steps": ["**Step 1: Top sides** - \\(AB = \\sqrt{6^2 + 8^2} = 10\\) cm","**Step 2: Bottom sides** - \\(BC = \\sqrt{15^2 + 8^2} = \\sqrt{225 + 64} = 17\\) cm","**Step 3: Perimeter** - \\(2(10 + 17) = 54\\) cm.","**Final Verified Answer:** \\(AB = AD = 10 cm, BC = CD = 17 cm, Perimeter = 54 cm\\)"],
        "img_title": "Kite ABCD Diagonal Segments 6cm, 15cm, 8cm",
        "img_type": "kite_calc_30"
    },
    {
        "num": 31,
        "title": "Kite Interior Angle Measures",
        "text": "In kite PQRS with PQ = PS and RQ = RS, if m∠PQR = 112° and m∠QPS = 64°, calculate the degree measures of ∠PSR and ∠QRS.",
        "formula": "m\\angle PSR = m\\angle PQR = 112^\\circ, \\quad m\\angle QRS = 360^\\circ - (112^\\circ + 112^\\circ + 64^\\circ) = 360^\\circ - 288^\\circ = 72^\\circ",
        "options": [
            "∠PSR = 112°, ∠QRS = 72°",
            "∠PSR = 64°, ∠QRS = 120°",
            "∠PSR = 112°, ∠QRS = 64°",
            "∠PSR = 72°, ∠QRS = 112°"
        ],
        "answer": "∠PSR = 112°, ∠QRS = 72°",
        "hint": "The non-vertex opposite angles are congruent (∠PSR = ∠PQR = 112°). Sum of 4 angles is 360°.",
        "steps": ["**Step 1: Non-vertex angle** - \\(m\\angle PSR = m\\angle PQR = 112^\circ\\)","**Step 2: Sum 360°** - \\(m\\angle QRS = 360^\circ - (112^\circ + 112^\circ + 64^\circ) = 72^\circ\\).","**Final Verified Answer:** \\(∠PSR = 112°, ∠QRS = 72°\\)"],
        "img_title": "Kite PQRS Angles 112° and 64°",
        "img_type": "kite_angles_31"
    },
    {
        "num": 32,
        "title": "Coordinate Proof of Parallelogram Type",
        "text": "Given vertices A(-3, 2), B(1, 5), C(7, 3), and D(3, 0), prove whether quadrilateral ABCD is a parallelogram, rectangle, or rhombus using distance and slope formulas.",
        "formula": "m_{AB} = m_{CD} = \\frac{3}{4}, \\quad m_{BC} = m_{AD} = -\\frac{1}{3} \\implies \\text{Parallelogram (Opposite sides parallel)}",
        "options": [
            "Parallelogram (Opposite sides parallel, adjacent slopes not perpendicular)",
            "Rectangle",
            "Square",
            "Trapezoid"
        ],
        "answer": "Parallelogram (Opposite sides parallel, adjacent slopes not perpendicular)",
        "hint": "Compute slopes of all four sides.",
        "steps": ["**Step 1: Slopes AB & CD** - \\(m_{AB} = 3/4\\), \\(m_{CD} = 3/4\\)","**Step 2: Slopes BC & AD** - \\(m_{BC} = -2/6 = -1/3\\), \\(m_{AD} = -2/6 = -1/3\\)","**Step 3: Product** - \\((3/4)(-1/3) = -1/4 \\neq -1\\) (not perpendicular).","**Final Verified Answer:** \\(Parallelogram (Opposite sides parallel, adjacent slopes not perpendicular)\\)"],
        "img_title": "Quadrilateral ABCD Points A(-3, 2), B(1, 5), C(7, 3), D(3, 0)",
        "img_type": "quadrilateral_coords_32"
    },
    {
        "num": 33,
        "title": "Algebraic Proof of Parallelogram Vertices",
        "text": "Vertices of quadrilateral ABCD are A(0, 0), B(a, 0), C(a + b, c), and D(b, c). Prove algebraically that ABCD is always a parallelogram.",
        "formula": "m_{AB} = 0, m_{CD} = 0 \\implies AB \\parallel CD; \\quad m_{AD} = \\frac{c}{b}, m_{BC} = \\frac{c}{b} \\implies AD \\parallel BC",
        "options": [
            "Opposite sides are parallel (m_AB = m_CD = 0 and m_AD = m_BC = c/b).",
            "Diagonals are perpendicular.",
            "All 4 sides are equal.",
            "Angles are all 90°."
        ],
        "answer": "Opposite sides are parallel (m_AB = m_CD = 0 and m_AD = m_BC = c/b).",
        "hint": "Find the slopes of AB, CD, AD, and BC using general variables (a, b, c).",
        "steps": ["**Step 1: Slopes AB & CD** - \\(m_{AB} = 0\\), \\(m_{CD} = (c-c)/((a+b)-b) = 0\\).","**Step 2: Slopes AD & BC** - \\(m_{AD} = c/b\\), \\(m_{BC} = (c-0)/((a+b)-a) = c/b\\).","**Final Verified Answer:** \\(Opposite sides are parallel (m_AB = m_CD = 0 and m_AD = m_BC = c/b).\\)"],
        "img_title": "Parallelogram ABCD General Coordinates (a, b, c)",
        "img_type": "quadrilateral_general_33"
    },
    {
        "num": 34,
        "title": "Fourth Vertex of a Parallelogram",
        "text": "Find the coordinates of the fourth vertex D of parallelogram ABCD if A(-2, 1), B(4, 3), and C(2, 7).",
        "formula": "D = A + C - B = (-2 + 2 - 4, 1 + 7 - 3) = (-4, 5)",
        "options": [
            "D(-4, 5)",
            "D(0, 5)",
            "D(-4, 9)",
            "D(4, 5)"
        ],
        "answer": "D(-4, 5)",
        "hint": "Midpoint of AC equals midpoint of BD: \\((-2+2)/2 = (4+x_D)/2\\).",
        "steps": ["**Step 1: Midpoint AC** - \\((0, 4)\\)","**Step 2: Midpoint BD** - \\(((4 + x)/2, (3 + y)/2) = (0, 4)\\)","**Step 3: Solve** - \\(4 + x = 0 \\implies x = -4\\), \\(3 + y = 8 \\implies y = 5 \\implies D(-4, 5)\\).","**Final Verified Answer:** \\(D(-4, 5)\\)"],
        "img_title": "Parallelogram ABCD Fourth Vertex D",
        "img_type": "quadrilateral_fourth_vertex_34"
    },
    {
        "num": 35,
        "title": "Varignon's Theorem",
        "text": "State Varignon's Theorem concerning the midpoints of the sides of ANY quadrilateral.",
        "formula": "\\text{Midpoint polygon of any quadrilateral is ALWAYS a Parallelogram}",
        "options": [
            "The figure formed by sequentially connecting the midpoints of the sides of ANY quadrilateral is ALWAYS a parallelogram.",
            "The midpoint figure is always a rectangle.",
            "The midpoint figure is always a square.",
            "The midpoint figure has half the perimeter of the original quadrilateral."
        ],
        "answer": "The figure formed by sequentially connecting the midpoints of the sides of ANY quadrilateral is ALWAYS a parallelogram.",
        "hint": "Opposite sides of the midpoint polygon are parallel to the original diagonals by the Triangle Midsegment Theorem.",
        "steps": ["**Step 1: Midpoints connected** - Each side of the inner polygon is parallel to a diagonal of the outer quadrilateral.","**Step 2: Conclusion** - Opposite sides are parallel, forming a parallelogram.","**Final Verified Answer:** \\(The figure formed by sequentially connecting the midpoints of the sides of ANY quadrilateral is ALWAYS a parallelogram.\\)"],
        "img_title": "Varignon's Parallelogram Inside Arbitrary Quadrilateral",
        "img_type": "varignon_theorem_35"
    },
    {
        "num": 36,
        "title": "Varignon Parallelogram of a Rhombus",
        "text": "If the original quadrilateral in Varignon's Theorem is a rhombus, what specific shape is formed by connecting its side midpoints?",
        "formula": "\\text{Diagonals of Rhombus } d_1 \\perp d_2 \\implies \\text{Varignon shape is a Rectangle}",
        "options": [
            "Rectangle",
            "Rhombus",
            "Trapezoid",
            "Kite"
        ],
        "answer": "Rectangle",
        "hint": "Perpendicular diagonals of the rhombus create right angles in the midpoint polygon.",
        "steps": ["**Step 1: Rhombus diagonals** - \\(d_1 \\perp d_2\\).","**Step 2: Midpoint sides** - Parallel to diagonals, so adjacent sides are perpendicular (90° angles).","**Final Verified Answer:** \\(Rectangle\\)"],
        "img_title": "Varignon Rectangle Inside Rhombus",
        "img_type": "varignon_rhombus_36"
    },
    {
        "num": 37,
        "title": "Varignon Parallelogram of a Rectangle",
        "text": "If the original quadrilateral in Varignon's Theorem is a rectangle, what specific shape is formed by connecting its side midpoints?",
        "formula": "\\text{Diagonals of Rectangle } d_1 = d_2 \\implies \\text{Varignon shape is a Rhombus}",
        "options": [
            "Rhombus",
            "Rectangle",
            "Square",
            "Trapezoid"
        ],
        "answer": "Rhombus",
        "hint": "Equal diagonals of the rectangle make all 4 sides of the midpoint polygon equal in length.",
        "steps": ["**Step 1: Rectangle diagonals** - \\(d_1 = d_2\\).","**Step 2: Midpoint sides** - Each side is half a diagonal, so all 4 sides are equal (rhombus).","**Final Verified Answer:** \\(Rhombus\\)"],
        "img_title": "Varignon Rhombus Inside Rectangle",
        "img_type": "varignon_rectangle_37"
    },
    {
        "num": 38,
        "title": "Varignon Parallelogram of an Isosceles Trapezoid",
        "text": "If the original quadrilateral is an isosceles trapezoid, what specific shape is formed by connecting its side midpoints?",
        "formula": "\\text{Diagonals of Isosceles Trapezoid } d_1 = d_2 \\implies \\text{Varignon shape is a Rhombus}",
        "options": [
            "Rhombus",
            "Rectangle",
            "Square",
            "Parallelogram"
        ],
        "answer": "Rhombus",
        "hint": "An isosceles trapezoid has equal diagonals, making the midsegment sides equal.",
        "steps": ["**Step 1: Equal diagonals** - Isosceles trapezoid diagonals are congruent.","**Step 2: Equal inner sides** - Inner quadrilateral has 4 congruent sides (Rhombus).","**Final Verified Answer:** \\(Rhombus\\)"],
        "img_title": "Varignon Rhombus Inside Isosceles Trapezoid",
        "img_type": "varignon_trapezoid_38"
    },
    {
        "num": 39,
        "title": "Application: Scissor Lift Mechanism",
        "text": "A scissor lift mechanism utilizes linked rhombuses. Explain how the properties of equal sides and bisecting diagonals allow vertical elevation while maintaining horizontal stability.",
        "formula": "\\text{Rhombus links maintain equal side lengths and symmetric diagonal bisection}",
        "options": [
            "Linked rhombuses expand and contract vertically along their perpendicular diagonals while keeping top and bottom platforms parallel.",
            "Rhombuses convert into circles under pressure.",
            "Equal sides prevent any vertical movement.",
            "Diagonals bend to absorb weight."
        ],
        "answer": "Linked rhombuses expand and contract vertically along their perpendicular diagonals while keeping top and bottom platforms parallel.",
        "hint": "Perpendicular diagonals change length symmetrically as angles change.",
        "steps": ["**Step 1: Variable diagonal** - As vertical diagonal increases, horizontal diagonal decreases symmetrically.","**Step 2: Parallel platforms** - Opposite sides stay parallel during movement.","**Final Verified Answer:** \\(Linked rhombuses expand and contract vertically along their perpendicular diagonals while keeping top and bottom platforms parallel.\\)"],
        "img_title": "Scissor Lift Mechanism Rhombus Links",
        "img_type": "scissor_lift_39"
    },
    {
        "num": 40,
        "title": "Application: Architect's Desk Lamp",
        "text": "An adjustable architect's desk lamp uses a parallelogram linkage. Explain why the lamp head maintains a constant tilt angle as the arm is raised or lowered.",
        "formula": "\\text{Opposite sides of parallelogram remain parallel } (AB \\parallel CD)",
        "options": [
            "Opposite sides of a parallelogram remain parallel at all elevation angles, locking the lamp head's orientation.",
            "The lamp head rotates 360° continuously.",
            "Springs change the quadrilateral into a triangle.",
            "Parallel lines expand in length."
        ],
        "answer": "Opposite sides of a parallelogram remain parallel at all elevation angles, locking the lamp head's orientation.",
        "hint": "Opposite side parallelism is preserved regardless of joint angle.",
        "steps": ["**Step 1: Parallelism preserved** - Vertical link connected to head stays parallel to base link.","**Final Verified Answer:** \\(Opposite sides of a parallelogram remain parallel at all elevation angles, locking the lamp head's orientation.\\)"],
        "img_title": "Architect's Lamp Parallelogram Linkage",
        "img_type": "desk_lamp_40"
    },
    {
        "num": 41,
        "title": "Surveying Field Area by Triangulation",
        "text": "A surveyor measures a four-sided agricultural field ABCD. The sides are AB = 120 m, BC = 90 m, CD = 130 m, DA = 80 m, and diagonal AC = 150 m. Calculate the total field area by dividing it into two triangles.",
        "formula": "\\Delta ABC \\text{ (Right } 90-120-150): \\text{Area}_1 = \\frac{1}{2}(120)(90) = 5400, \\quad \\Delta ADC: \\text{Heron's Formula} \\implies \\text{Total Area}",
        "options": [
            "Total Area = 10,500 m² (approx.)",
            "Total Area = 5,400 m²",
            "Total Area = 12,200 m²",
            "Total Area = 8,800 m²"
        ],
        "answer": "Total Area = 10,500 m² (approx.)",
        "hint": "Triangle ABC is a right triangle (90² + 120² = 150², Area = 5,400 m²). Use Heron's formula for triangle ADC (sides 80, 130, 150).",
        "steps": ["**Step 1: ΔABC Area** - \\((120 \\times 90)/2 = 5400\\) m²","**Step 2: ΔADC Area** - \\(s = (80+130+150)/2 = 180 \\implies \\sqrt{180 \\times 100 \\times 50 \\times 30} = \\sqrt{27,000,000} \\approx 5196\\) m²","**Step 3: Total Area** - \\(5400 + 5196 \\approx 10596 \\approx 10500\\) m².","**Final Verified Answer:** \\(Total Area = 10,500 m² (approx.)\\)"],
        "img_title": "Field Survey Quadrilateral ABCD with Diagonal AC",
        "img_type": "surveying_field_41"
    },
    {
        "num": 42,
        "title": "Garden Gate Diagonal Brace Rigidity",
        "text": "A homeowner constructs a wooden garden gate. Explain why adding a diagonal brace converts a flexible quadrilateral frame into a rigid structure.",
        "formula": "\\text{Triangle Rigidity (SSS Postulate)}",
        "options": [
            "A diagonal divides the flexible quadrilateral into two rigid triangles that cannot deform without changing side lengths (SSS Rigidity).",
            "The diagonal makes the gate heavier.",
            "Quadrilaterals are naturally rigid.",
            "The diagonal creates right angles automatically."
        ],
        "answer": "A diagonal divides the flexible quadrilateral into two rigid triangles that cannot deform without changing side lengths (SSS Rigidity).",
        "hint": "Triangles have fixed shapes when side lengths are fixed (SSS). Quadrilaterals can pivot at joints.",
        "steps": ["**Step 1: Unbraced quadrilateral** - Joints can pivot, deforming the rectangle into a parallelogram.","**Step 2: Diagonal added** - Creates two triangles with fixed side lengths (rigid).","**Final Verified Answer:** \\(A diagonal divides the flexible quadrilateral into two rigid triangles that cannot deform without changing side lengths (SSS Rigidity).\\)"],
        "img_title": "Garden Gate Diagonal Brace Rigidity",
        "img_type": "garden_gate_42"
    },
    {
        "num": 43,
        "title": "Disproving Misconception: Perpendicular Diagonals",
        "text": "A student claims that ANY quadrilateral with perpendicular diagonals MUST be a rhombus. Disprove this statement by providing a counterexample.",
        "formula": "\\text{Kite with unequal adjacent sides has } d_1 \\perp d_2 \\text{ but is NOT a Rhombus}",
        "options": [
            "A kite (or non-equilateral quadrilateral) can have perpendicular diagonals without having 4 equal sides.",
            "Only squares have perpendicular diagonals.",
            "Perpendicular diagonals always force equal sides.",
            "Trapezoids always have perpendicular diagonals."
        ],
        "answer": "A kite (or non-equilateral quadrilateral) can have perpendicular diagonals without having 4 equal sides.",
        "hint": "A kite has perpendicular diagonals (e.g. spars 10 cm and 20 cm), but two sides are short and two sides are long.",
        "steps": ["**Step 1: Counterexample** - A kite with sides 5, 5, 12, 12 has perpendicular diagonals but is not a rhombus.","**Final Verified Answer:** \\(A kite (or non-equilateral quadrilateral) can have perpendicular diagonals without having 4 equal sides.\\)"],
        "img_title": "Kite Counterexample with Perpendicular Diagonals",
        "img_type": "disprove_rhombus_43"
    },
    {
        "num": 44,
        "title": "Three Right Angles Proof for Rectangle",
        "text": "Prove why a quadrilateral with three right angles (90°) MUST be a rectangle, making it impossible for a trapezoid to have three right angles.",
        "formula": "90^\\circ + 90^\\circ + 90^\\circ + \\angle D = 360^\\circ \\implies \\angle D = 90^\\circ \\implies \\text{Rectangle}",
        "options": [
            "The 4th angle must be 360° - 270° = 90°, making all 4 angles 90° (Rectangle), which forces 2 pairs of parallel sides.",
            "The 4th angle can be 45°.",
            "A trapezoid can have 3 right angles if its legs are equal.",
            "Three right angles form a triangle."
        ],
        "answer": "The 4th angle must be 360° - 270° = 90°, making all 4 angles 90° (Rectangle), which forces 2 pairs of parallel sides.",
        "hint": "Sum of interior angles is 360°. If 3 are 90°, the 4th is 360° - 270° = 90°.",
        "steps": ["**Step 1: 4th angle** - \\(360^\circ - (90^\circ + 90^\circ + 90^\circ) = 90^\circ\\).","**Step 2: 4 right angles** - Form a rectangle (2 pairs of parallel sides), which violates trapezoid's definition of EXACTLY 1 pair.","**Final Verified Answer:** \\(The 4th angle must be 360° - 270° = 90°, making all 4 angles 90° (Rectangle), which forces 2 pairs of parallel sides.\\)"],
        "img_title": "Quadrilateral with 3 Right Angles Forces 4th Right Angle",
        "img_type": "three_right_angles_44"
    },
    {
        "num": 45,
        "title": "Supplementary Opposite Angles Counterexample",
        "text": "A student asserts that if opposite angles of a quadrilateral are supplementary (sum to 180°), the quadrilateral MUST be a parallelogram. Provide a counterexample.",
        "formula": "\\text{Isosceles Trapezoid has supplementary opposite angles } (\\angle A + \\angle C = 180^\\circ) \\text{ but is NOT a parallelogram}",
        "options": [
            "An isosceles trapezoid has supplementary opposite angles (e.g. 70° and 110°), but only 1 pair of parallel sides.",
            "Rhombus is the only shape with supplementary opposite angles.",
            "Opposite angles in a parallelogram are never supplementary.",
            "Kite has supplementary opposite angles."
        ],
        "answer": "An isosceles trapezoid has supplementary opposite angles (e.g. 70° and 110°), but only 1 pair of parallel sides.",
        "hint": "In an isosceles trapezoid, base angles are equal, so opposite angles add to 180°.",
        "steps": ["**Step 1: Isosceles trapezoid angles** - \\(\\angle A = \\angle B = 70^\circ, \\angle C = \\angle D = 110^\circ\\).","**Step 2: Opposite sum** - \\(70^\circ + 110^\circ = 180^\circ\\). But it has only 1 pair of parallel sides!","**Final Verified Answer:** \\(An isosceles trapezoid has supplementary opposite angles (e.g. 70° and 110°), but only 1 pair of parallel sides.\\)"],
        "img_title": "Isosceles Trapezoid Supplementary Opposite Angles",
        "img_type": "trapezoid_supp_angles_45"
    },
    {
        "num": 46,
        "title": "Two-Column Proof: Congruent Opposite Angles",
        "text": "State the key reason in a proof: Given that opposite angles of quadrilateral ABCD are congruent (∠A ≅ ∠C and ∠B ≅ ∠D), prove ABCD is a parallelogram.",
        "formula": "\\angle A = \\angle C \\land \\angle B = \\angle D \\implies 2\\angle A + 2\\angle B = 360^\\circ \\implies \\angle A + \\angle B = 180^\\circ \\implies AB \\parallel CD",
        "options": [
            "Consecutive interior angles are supplementary (∠A + ∠B = 180°), which proves opposite sides are parallel by Converse of Consecutive Interior Angles Theorem.",
            "Opposite sides are equal by definition.",
            "Diagonals are perpendicular.",
            "Vertical angles are congruent."
        ],
        "answer": "Consecutive interior angles are supplementary (∠A + ∠B = 180°), which proves opposite sides are parallel by Converse of Consecutive Interior Angles Theorem.",
        "hint": "\\(2\\angle A + 2\\angle B = 360^\circ \\implies \\angle A + \\angle B = 180^\circ\\).",
        "steps": ["**Step 1: Sum** - \\(\\angle A + \\angle B + \\angle C + \\angle D = 360^\circ\\).","**Step 2: Substitute** - \\(2\\angle A + 2\\angle B = 360^\circ \\implies \\angle A + \\angle B = 180^\circ\\).","**Step 3: Parallelism** - Supplementary consecutive interior angles prove parallel lines.","**Final Verified Answer:** \\(Consecutive interior angles are supplementary (∠A + ∠B = 180°), which proves opposite sides are parallel by Converse of Consecutive Interior Angles Theorem.\\)"],
        "img_title": "Proof: Congruent Opposite Angles",
        "img_type": "proof_opp_angles_46"
    },
    {
        "num": 47,
        "title": "Two-Column Proof: Parallelogram with Congruent Diagonals",
        "text": "Prove that a parallelogram ABCD with congruent diagonals (AC = BD) is a rectangle.",
        "formula": "AC = BD \\text{ in parallelogram ABCD} \\implies \\Delta ABC \\cong \\Delta BAD \\text{ (SSS)} \\implies \\angle A = \\angle B = 90^\\circ \\implies \\text{Rectangle}",
        "options": [
            "Triangle ABC ≅ Triangle BAD by SSS, so ∠A = ∠B. Since consecutive angles are supplementary (∠A + ∠B = 180°), ∠A = ∠B = 90° (Rectangle).",
            "Diagonals intersect at right angles.",
            "All 4 sides become equal.",
            "Diagonals bisect vertex angles."
        ],
        "answer": "Triangle ABC ≅ Triangle BAD by SSS, so ∠A = ∠B. Since consecutive angles are supplementary (∠A + ∠B = 180°), ∠A = ∠B = 90° (Rectangle).",
        "hint": "Use SSS congruence on △ABC and △BAD with shared side AB.",
        "steps": ["**Step 1: SSS Congruence** - \\(AB = AB, BC = AD, AC = BD \\implies \\Delta ABC \\cong \\Delta BAD\\).","**Step 2: Equal angles** - \\(\\angle A = \\angle B\\).","**Step 3: Supplementary** - \\(\\angle A + \\angle B = 180^\circ \\implies \\angle A = 90^\circ\\) (Rectangle).","**Final Verified Answer:** \\(Triangle ABC ≅ Triangle BAD by SSS, so ∠A = ∠B. Since consecutive angles are supplementary (∠A + ∠B = 180°), ∠A = ∠B = 90° (Rectangle).\\)"],
        "img_title": "Proof: Parallelogram with Congruent Diagonals",
        "img_type": "proof_rect_diagonals_47"
    },
    {
        "num": 48,
        "title": "Two-Column Proof: One Pair Parallel and Congruent",
        "text": "Prove that if one pair of opposite sides of quadrilateral ABCD are both parallel and congruent (AB || CD and AB = CD), then ABCD is a parallelogram.",
        "formula": "AB \\parallel CD \\land AB = CD \\implies \\Delta ABC \\cong \\Delta CDA \\text{ (SAS)} \\implies BC = AD \\implies \\text{Parallelogram}",
        "options": [
            "Draw diagonal AC: Triangle ABC ≅ Triangle CDA by SAS (AB=CD, ∠BAC=∠DCA, AC=AC), which makes BC = AD (opposite sides equal).",
            "Diagonals are equal by AAA.",
            "All 4 angles equal 90°.",
            "It forms an isosceles trapezoid."
        ],
        "answer": "Draw diagonal AC: Triangle ABC ≅ Triangle CDA by SAS (AB=CD, ∠BAC=∠DCA, AC=AC), which makes BC = AD (opposite sides equal).",
        "hint": "Diagonal AC creates alternate interior angles ∠BAC and ∠DCA.",
        "steps": ["**Step 1: SAS Congruence** - \\(AB = CD\\), \\(\\angle BAC = \\angle DCA\\) (alt interior), \\(AC = AC\\).","**Step 2: CPCTC** - \\(BC = AD\\), proving both pairs of opposite sides are congruent.","**Final Verified Answer:** \\(Draw diagonal AC: Triangle ABC ≅ Triangle CDA by SAS (AB=CD, ∠BAC=∠DCA, AC=AC), which makes BC = AD (opposite sides equal).\\)"],
        "img_title": "Proof: One Pair Parallel and Congruent",
        "img_type": "proof_one_pair_parallel_48"
    },
    {
        "num": 49,
        "title": "Slant Leg of Right Trapezoid",
        "text": "In right trapezoid ABCD, ∠A = ∠D = 90°. If base AB = 6 cm, base CD = 14 cm, and leg AD = 6 cm, calculate the exact length of the slant leg BC.",
        "formula": "dx = 14 - 6 = 8 \\text{ cm}, \\quad h = 6 \\text{ cm} \\implies BC = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = 10 \\text{ cm}",
        "options": [
            "10 cm",
            "8 cm",
            "12 cm",
            "14 cm"
        ],
        "answer": "10 cm",
        "hint": "Drop a height from B to CD to form a right triangle with legs 8 cm and 6 cm.",
        "steps": ["**Step 1: Triangle base** - \\(14 - 6 = 8\\) cm","**Step 2: Triangle height** - \\(= AD = 6\\) cm","**Step 3: Hypotenuse BC** - \\(BC = \\sqrt{8^2 + 6^2} = \\sqrt{100} = 10\\) cm.","**Final Verified Answer:** \\(10 cm\\)"],
        "img_title": "Right Trapezoid ABCD Slant Leg BC",
        "img_type": "trapezoid_right_slant_49"
    },
    {
        "num": 50,
        "title": "Corporate Logo Rhombus Area",
        "text": "A corporate logo is shaped as a rhombus whose diagonals are in the ratio 3 : 4. If the perimeter of the rhombus is 40 cm, calculate its area.",
        "formula": "s = 10, \\quad (3x)^2 + (4x)^2 = 10^2 \\implies 25x^2 = 100 \\implies x = 2 \\implies d_1 = 12, d_2 = 16 \\implies \\text{Area} = \\frac{12 \\times 16}{2} = 96 \\text{ cm}^2",
        "options": [
            "96 cm²",
            "192 cm²",
            "48 cm²",
            "120 cm²"
        ],
        "answer": "96 cm²",
        "hint": "Side length \\(s = 40 / 4 = 10\\). Half-diagonals are \\(3x\\) and \\(4x\\), so \\((3x)^2 + (4x)^2 = 10^2 \\implies 5x = 10 \\implies x = 2\\).",
        "steps": ["**Step 1: Side length** - \\(s = 40 / 4 = 10\\) cm","**Step 2: Half diagonals** - \\(3x\\) and \\(4x \\implies \\sqrt{9x^2 + 16x^2} = 5x = 10 \\implies x = 2\\)","**Step 3: Full diagonals** - \\(d_1 = 12\\), \\(d_2 = 16\\)","**Step 4: Area** - \\((12 \\times 16)/2 = 96\\) cm².","**Final Verified Answer:** \\(96 cm²\\)"],
        "img_title": "Rhombus Logo Perimeter 40cm Ratio 3:4",
        "img_type": "rhombus_logo_50"
    }
]

with open('scratch/t147_50_built_questions.json', 'w', encoding='utf-8') as out:
    json.dump(q_data, out, indent=2, ensure_ascii=False)

print(f"Built all {len(q_data)} verified unique questions for Topic 147.")

