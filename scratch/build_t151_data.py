import json
import sqlite3
import os

q_data = [
    {
        "num": 1,
        "title": "45°-45°-90° Triangle Side Ratio Derivation",
        "text": "Derive the exact side length ratio of a 45°-45°-90° right isosceles triangle (Leg : Leg : Hypotenuse) by applying the Pythagorean theorem to a square cut along its diagonal.",
        "formula": "\\text{Leg : Leg : Hypotenuse} = 1 : 1 : \\sqrt{2}",
        "options": [
            "Leg : Leg : Hypotenuse = 1 : 1 : √2",
            "Leg : Leg : Hypotenuse = 1 : √3 : 2",
            "Leg : Leg : Hypotenuse = 1 : 2 : 3",
            "Leg : Leg : Hypotenuse = 3 : 4 : 5"
        ],
        "answer": "Leg : Leg : Hypotenuse = 1 : 1 : √2",
        "hint": "In a square of side s, diagonal \\(h = \\sqrt{s^2 + s^2} = s\\sqrt{2}\\).",
        "steps": ["**Step 1: Set side length** - Let legs equal 1.","**Step 2: Apply Pythagorean Theorem** - \\(h = \\sqrt{1^2 + 1^2} = \\sqrt{2}\\).","**Step 3: State ratio** - \\(1 : 1 : \\sqrt{2}\\).","**Final Verified Answer:** \\(Leg : Leg : Hypotenuse = 1 : 1 : √2\\)"],
        "img_title": "45°-45°-90° Triangle Ratio 1 : 1 : √2",
        "img_type": "ratio_45_45_90"
    },
    {
        "num": 2,
        "title": "30°-60°-90° Triangle Side Ratio Derivation",
        "text": "Derive the exact side length ratio of a 30°-60°-90° right triangle (Shorter Leg : Longer Leg : Hypotenuse) by dropping an altitude in an equilateral triangle.",
        "formula": "\\text{Shorter Leg : Longer Leg : Hypotenuse} = 1 : \\sqrt{3} : 2",
        "options": [
            "Shorter Leg : Longer Leg : Hypotenuse = 1 : √3 : 2",
            "Shorter Leg : Longer Leg : Hypotenuse = 1 : 1 : √2",
            "Shorter Leg : Longer Leg : Hypotenuse = 1 : 2 : 3",
            "Shorter Leg : Longer Leg : Hypotenuse = 2 : 3 : 4"
        ],
        "answer": "Shorter Leg : Longer Leg : Hypotenuse = 1 : √3 : 2",
        "hint": "An altitude in an equilateral triangle of side 2 splits the base into 1 and altitude into \\(\\sqrt{2^2 - 1^2} = \\sqrt{3}\\).",
        "steps": ["**Step 1: Equilateral side = 2** - Altitude bisects base into 1 and 1.","**Step 2: Pythagorean theorem** - \\(h = \\sqrt{2^2 - 1^2} = \\sqrt{3}\\).","**Step 3: Ratio** - Shorter (1) : Longer (\\(\\sqrt{3}\\)) : Hypotenuse (2).","**Final Verified Answer:** \\(Shorter Leg : Longer Leg : Hypotenuse = 1 : √3 : 2\\)"],
        "img_title": "30°-60°-90° Triangle Ratio 1 : √3 : 2",
        "img_type": "ratio_30_60_90"
    },
    {
        "num": 3,
        "title": "45°-45°-90° Triangle Formulas",
        "text": "State the exact formulas for the legs and hypotenuse of a 45°-45°-90° triangle given: a) leg length s, b) hypotenuse length h.",
        "formula": "h = s\\sqrt{2}, \\quad s = \\frac{h}{\\sqrt{2}} = \\frac{h\\sqrt{2}}{2}",
        "options": [
            "Hypotenuse h = s√2, Leg s = (h√2) / 2",
            "Hypotenuse h = 2s, Leg s = h / 2",
            "Hypotenuse h = s√3, Leg s = h / √3",
            "Hypotenuse h = s + √2, Leg s = h - √2"
        ],
        "answer": "Hypotenuse h = s√2, Leg s = (h√2) / 2",
        "hint": "Multiply leg by \\(\\sqrt{2}\\) to get hypotenuse; divide hypotenuse by \\(\\sqrt{2}\\) to get leg.",
        "steps": ["**Step 1: Given leg s** - \\(h = s\\sqrt{2}\\).","**Step 2: Given hypotenuse h** - \\(s = h / \\sqrt{2} = (h\\sqrt{2})/2\\).","**Final Verified Answer:** \\(Hypotenuse h = s√2, Leg s = (h√2) / 2\\)"],
        "img_title": "45°-45°-90° Triangle Formulas",
        "img_type": "formula_45_45_90"
    },
    {
        "num": 4,
        "title": "30°-60°-90° Triangle Formulas",
        "text": "State the formulas for the shorter leg x, longer leg y, and hypotenuse h of a 30°-60°-90° triangle.",
        "formula": "h = 2x, \\quad y = x\\sqrt{3}, \\quad x = \\frac{h}{2} = \\frac{y}{\\sqrt{3}} = \\frac{y\\sqrt{3}}{3}",
        "options": [
            "Hypotenuse h = 2x, Longer leg y = x√3, Shorter leg x = h / 2",
            "Hypotenuse h = x√2, Longer leg y = 2x",
            "Hypotenuse h = 3x, Longer leg y = x√2",
            "Hypotenuse h = x + √3, Longer leg y = 2x"
        ],
        "answer": "Hypotenuse h = 2x, Longer leg y = x√3, Shorter leg x = h / 2",
        "hint": "Hypotenuse is twice the shorter leg; longer leg is shorter leg times \\(\\sqrt{3}\\).",
        "steps": ["**Step 1: Hypotenuse** - \\(h = 2x\\).","**Step 2: Longer leg** - \\(y = x\\sqrt{3}\\).","**Final Verified Answer:** \\(Hypotenuse h = 2x, Longer leg y = x√3, Shorter leg x = h / 2\\)"],
        "img_title": "30°-60°-90° Triangle Formulas",
        "img_type": "formula_30_60_90"
    },
    {
        "num": 5,
        "title": "45°-45°-90° Hypotenuse Calculation",
        "text": "In a 45°-45°-90° triangle, if each leg measures 9 cm, calculate the exact length of the hypotenuse in simplified radical form.",
        "formula": "h = 9\\sqrt{2} \\text{ cm}",
        "options": [
            "9√2 cm",
            "18 cm",
            "9√3 cm",
            "4.5√2 cm"
        ],
        "answer": "9√2 cm",
        "hint": "In a 45°-45°-90° triangle, \\(\\text{hypotenuse} = \\text{leg} \\times \\sqrt{2}\\).",
        "steps": ["**Step 1: Formula** - \\(h = s\\sqrt{2}\\)","**Step 2: Substitute s = 9** - \\(h = 9\\sqrt{2}\\) cm.","**Final Verified Answer:** \\(9√2 cm\\)"],
        "img_title": "45°-45°-90° Triangle Leg 9cm",
        "img_type": "calc_45_leg9"
    },
    {
        "num": 6,
        "title": "45°-45°-90° Leg Calculation from Hypotenuse",
        "text": "In a 45°-45°-90° triangle, if the hypotenuse measures 16 cm, find the exact length of each leg in simplest radical form with rationalized denominator.",
        "formula": "s = \\frac{16}{\\sqrt{2}} = \\frac{16\\sqrt{2}}{2} = 8\\sqrt{2} \\text{ cm}",
        "options": [
            "8√2 cm",
            "16√2 cm",
            "8 cm",
            "4√2 cm"
        ],
        "answer": "8√2 cm",
        "hint": "Divide hypotenuse 16 by \\(\\sqrt{2}\\): \\(16 / \\sqrt{2} = 8\\sqrt{2}\\).",
        "steps": ["**Step 1: Leg formula** - \\(s = h / \\sqrt{2}\\)","**Step 2: Rationalize** - \\(16\\sqrt{2} / 2 = 8\\sqrt{2}\\) cm.","**Final Verified Answer:** \\(8√2 cm\\)"],
        "img_title": "45°-45°-90° Triangle Hypotenuse 16cm",
        "img_type": "calc_45_hyp16"
    },
    {
        "num": 7,
        "title": "Square Bedroom Diagonal & Area",
        "text": "The diagonal of a square bedroom measures 14 meters. Calculate the exact perimeter and floor area of the room.",
        "formula": "s = \\frac{14}{\\sqrt{2}} = 7\\sqrt{2} \\text{ m}, \\quad P = 4(7\\sqrt{2}) = 28\\sqrt{2} \\text{ m}, \\quad \\text{Area} = (7\\sqrt{2})^2 = 98 \\text{ m}^2",
        "options": [
            "Perimeter = 28√2 m, Area = 98 m²",
            "Perimeter = 56 m, Area = 196 m²",
            "Perimeter = 28 m, Area = 98 m²",
            "Perimeter = 14√2 m, Area = 49 m²"
        ],
        "answer": "Perimeter = 28√2 m, Area = 98 m²",
        "hint": "Square diagonal forms a 45°-45°-90° triangle: \\(s = 14 / \\sqrt{2} = 7\\sqrt{2}\\).",
        "steps": ["**Step 1: Side length** - \\(s = 14 / \\sqrt{2} = 7\\sqrt{2}\\) m","**Step 2: Perimeter** - \\(4 \\times 7\\sqrt{2} = 28\\sqrt{2}\\) m","**Step 3: Area** - \\((7\\sqrt{2})^2 = 49 \\times 2 = 98\\) m².","**Final Verified Answer:** \\(Perimeter = 28√2 m, Area = 98 m²\\)"],
        "img_title": "Square Bedroom Diagonal 14m",
        "img_type": "calc_45_square14"
    },
    {
        "num": 8,
        "title": "Baseball Diamond Throwing Distance",
        "text": "A square baseball diamond has 90 feet between consecutive bases. Calculate the exact throwing distance from home plate directly to second base in simplified radical form.",
        "formula": "d = 90\\sqrt{2} \\text{ feet} \\approx 127.28 \\text{ feet}",
        "options": [
            "90√2 feet",
            "180 feet",
            "90√3 feet",
            "135 feet"
        ],
        "answer": "90√2 feet",
        "hint": "Distance from home plate to second base is the diagonal of the 90 ft x 90 ft square.",
        "steps": ["**Step 1: Identify diagonal** - \\(d = s\\sqrt{2}\\)","**Step 2: Substitute s = 90** - \\(d = 90\\sqrt{2}\\) feet.","**Final Verified Answer:** \\(90√2 feet\\)"],
        "img_title": "Baseball Diamond 90ft Square Diagonal",
        "img_type": "calc_45_baseball90"
    },
    {
        "num": 9,
        "title": "Isosceles Right Triangle Perimeter & Area",
        "text": "The perimeter of an isosceles right triangle is \\((12 + 12\\sqrt{2})\\) cm. Calculate the exact length of the hypotenuse and the area of the triangle.",
        "formula": "2s + s\\sqrt{2} = 12(1 + \\sqrt{2}) \\implies s(2 + \\sqrt{2}) = 12(1 + \\sqrt{2}) \\implies s = 6\\sqrt{2} \\text{ cm}, \\quad h = 12 \\text{ cm}, \\quad \\text{Area} = \\frac{1}{2}(6\\sqrt{2})^2 = 36 \\text{ cm}^2",
        "options": [
            "Hypotenuse = 12 cm, Area = 36 cm²",
            "Hypotenuse = 12√2 cm, Area = 72 cm²",
            "Hypotenuse = 6√2 cm, Area = 18 cm²",
            "Hypotenuse = 24 cm, Area = 144 cm²"
        ],
        "answer": "Hypotenuse = 12 cm, Area = 36 cm²",
        "hint": "Perimeter \\(P = 2s + s\\sqrt{2} = s(2 + \\sqrt{2})\\). Solve for leg s.",
        "steps": ["**Step 1: Leg length** - \\(s(2 + \\sqrt{2}) = 12(1 + \\sqrt{2}) \\implies s = 6\\sqrt{2}\\) cm","**Step 2: Hypotenuse** - \\(h = s\\sqrt{2} = (6\\sqrt{2})\\sqrt{2} = 12\\) cm","**Step 3: Area** - \\(\\frac{1}{2}(6\\sqrt{2})^2 = 36\\) cm².","**Final Verified Answer:** \\(Hypotenuse = 12 cm, Area = 36 cm²\\)"],
        "img_title": "Isosceles Right Triangle Perimeter (12 + 12√2)cm",
        "img_type": "calc_45_perimeter"
    },
    {
        "num": 10,
        "title": "30°-60°-90° Triangle Shorter Leg 7cm",
        "text": "In a 30°-60°-90° triangle, if the shorter leg opposite the 30° angle is 7 cm, find the exact lengths of the longer leg and the hypotenuse.",
        "formula": "\\text{Longer Leg} = 7\\sqrt{3} \\text{ cm}, \\quad \\text{Hypotenuse} = 14 \\text{ cm}",
        "options": [
            "Longer leg = 7√3 cm, Hypotenuse = 14 cm",
            "Longer leg = 14 cm, Hypotenuse = 7√3 cm",
            "Longer leg = 7√2 cm, Hypotenuse = 14 cm",
            "Longer leg = 14√3 cm, Hypotenuse = 28 cm"
        ],
        "answer": "Longer leg = 7√3 cm, Hypotenuse = 14 cm",
        "hint": "Hypotenuse is double shorter leg (2 x 7 = 14). Longer leg is shorter leg x \\(\\sqrt{3}\\).",
        "steps": ["**Step 1: Hypotenuse** - \\(2 \\times 7 = 14\\) cm","**Step 2: Longer leg** - \\(7\\sqrt{3}\\) cm.","**Final Verified Answer:** \\(Longer leg = 7√3 cm, Hypotenuse = 14 cm\\)"],
        "img_title": "30°-60°-90° Triangle Shorter Leg 7cm",
        "img_type": "calc_30_short7"
    },
    {
        "num": 11,
        "title": "30°-60°-90° Triangle Hypotenuse 22cm",
        "text": "In a 30°-60°-90° triangle, if the hypotenuse measures 22 cm, determine the exact lengths of the shorter leg and the longer leg.",
        "formula": "\\text{Shorter Leg} = \\frac{22}{2} = 11 \\text{ cm}, \\quad \\text{Longer Leg} = 11\\sqrt{3} \\text{ cm}",
        "options": [
            "Shorter leg = 11 cm, Longer leg = 11√3 cm",
            "Shorter leg = 11√3 cm, Longer leg = 11 cm",
            "Shorter leg = 11 cm, Longer leg = 22√3 cm",
            "Shorter leg = 5.5 cm, Longer leg = 11√3 cm"
        ],
        "answer": "Shorter leg = 11 cm, Longer leg = 11√3 cm",
        "hint": "Shorter leg is half the hypotenuse (22 / 2 = 11). Longer leg is \\(11\\sqrt{3}\\).",
        "steps": ["**Step 1: Shorter leg** - \\(22 / 2 = 11\\) cm","**Step 2: Longer leg** - \\(11\\sqrt{3}\\) cm.","**Final Verified Answer:** \\(Shorter leg = 11 cm, Longer leg = 11√3 cm\\)"],
        "img_title": "30°-60°-90° Triangle Hypotenuse 22cm",
        "img_type": "calc_30_hyp22"
    },
    {
        "num": 12,
        "title": "30°-60°-90° Triangle Longer Leg 15cm",
        "text": "In a 30°-60°-90° triangle, if the longer leg opposite the 60° angle is 15 cm, calculate the exact length of the shorter leg and the hypotenuse.",
        "formula": "\\text{Shorter Leg} = \\frac{15}{\\sqrt{3}} = 5\\sqrt{3} \\text{ cm}, \\quad \\text{Hypotenuse} = 10\\sqrt{3} \\text{ cm}",
        "options": [
            "Shorter leg = 5√3 cm, Hypotenuse = 10√3 cm",
            "Shorter leg = 15√3 cm, Hypotenuse = 30 cm",
            "Shorter leg = 7.5 cm, Hypotenuse = 15 cm",
            "Shorter leg = 5 cm, Hypotenuse = 10 cm"
        ],
        "answer": "Shorter leg = 5√3 cm, Hypotenuse = 10√3 cm",
        "hint": "Divide longer leg 15 by \\(\\sqrt{3}\\): \\(15 / \\sqrt{3} = 5\\sqrt{3}\\). Double for hypotenuse.",
        "steps": ["**Step 1: Shorter leg** - \\(15 / \\sqrt{3} = 5\\sqrt{3}\\) cm","**Step 2: Hypotenuse** - \\(2 \\times 5\\sqrt{3} = 10\\sqrt{3}\\) cm.","**Final Verified Answer:** \\(Shorter leg = 5√3 cm, Hypotenuse = 10√3 cm\\)"],
        "img_title": "30°-60°-90° Triangle Longer Leg 15cm",
        "img_type": "calc_30_long15"
    },
    {
        "num": 13,
        "title": "Equilateral Triangle Altitude & Area from Side 16cm",
        "text": "An equilateral triangle has side lengths of 16 cm. Calculate the exact length of its altitude and its area in simplest radical form.",
        "formula": "h = 8\\sqrt{3} \\text{ cm}, \\quad \\text{Area} = \\frac{\\sqrt{3}}{4}(16)^2 = 64\\sqrt{3} \\text{ cm}^2",
        "options": [
            "Altitude = 8√3 cm, Area = 64√3 cm²",
            "Altitude = 16√3 cm, Area = 128√3 cm²",
            "Altitude = 8 cm, Area = 64 cm²",
            "Altitude = 4√3 cm, Area = 32√3 cm²"
        ],
        "answer": "Altitude = 8√3 cm, Area = 64√3 cm²",
        "hint": "Altitude splits equilateral triangle into two 30°-60°-90° triangles with base 8 cm.",
        "steps": ["**Step 1: Altitude** - \\(h = 8\\sqrt{3}\\) cm","**Step 2: Area** - \\(\\frac{1}{2} \\times 16 \\times 8\\sqrt{3} = 64\\sqrt{3}\\) cm².","**Final Verified Answer:** \\(Altitude = 8√3 cm, Area = 64√3 cm²\\)"],
        "img_title": "Equilateral Triangle Side 16cm Altitude & Area",
        "img_type": "calc_equilateral_side16"
    },
    {
        "num": 14,
        "title": "Equilateral Triangle from Altitude 9√3 cm",
        "text": "The altitude of an equilateral triangle measures 9√3 cm. Calculate the perimeter and exact area of the triangle.",
        "formula": "h = s\\frac{\\sqrt{3}}{2} = 9\\sqrt{3} \\implies s = 18 \\text{ cm}, \\quad P = 54 \\text{ cm}, \\quad \\text{Area} = \\frac{1}{2}(18)(9\\sqrt{3}) = 81\\sqrt{3} \\text{ cm}^2",
        "options": [
            "Perimeter = 54 cm, Area = 81√3 cm²",
            "Perimeter = 27 cm, Area = 81 cm²",
            "Perimeter = 36 cm, Area = 54√3 cm²",
            "Perimeter = 54√3 cm, Area = 162 cm²"
        ],
        "answer": "Perimeter = 54 cm, Area = 81√3 cm²",
        "hint": "In 30°-60°-90° half-triangle, longer leg is \\(9\\sqrt{3}\\), so shorter leg is 9 and side is 18.",
        "steps": ["**Step 1: Side length** - \\(s = 9 \\times 2 = 18\\) cm","**Step 2: Perimeter** - \\(3 \\times 18 = 54\\) cm","**Step 3: Area** - \\((18 \\times 9\\sqrt{3})/2 = 81\\sqrt{3}\\) cm².","**Final Verified Answer:** \\(Perimeter = 54 cm, Area = 81√3 cm²\\)"],
        "img_title": "Equilateral Triangle Altitude 9√3 cm",
        "img_type": "calc_equilateral_alt9"
    },
    {
        "num": 15,
        "title": "Equilateral Triangle Dimensions from Area 36√3 cm²",
        "text": "The area of an equilateral triangle is 36√3 cm². Calculate its side length, perimeter, and altitude.",
        "formula": "\\frac{\\sqrt{3}}{4}s^2 = 36\\sqrt{3} \\implies s^2 = 144 \\implies s = 12 \\text{ cm}, \\quad P = 36 \\text{ cm}, \\quad h = 6\\sqrt{3} \\text{ cm}",
        "options": [
            "Side = 12 cm, Perimeter = 36 cm, Altitude = 6√3 cm",
            "Side = 6 cm, Perimeter = 18 cm, Altitude = 3√3 cm",
            "Side = 24 cm, Perimeter = 72 cm, Altitude = 12√3 cm",
            "Side = 12 cm, Perimeter = 36 cm, Altitude = 12 cm"
        ],
        "answer": "Side = 12 cm, Perimeter = 36 cm, Altitude = 6√3 cm",
        "hint": "Set \\(\\frac{\\sqrt{3}}{4}s^2 = 36\\sqrt{3}\\). Solve \\(s^2 = 144 \\implies s = 12\\).",
        "steps": ["**Step 1: Side length** - \\(s^2 = 36 \\times 4 = 144 \\implies s = 12\\) cm","**Step 2: Perimeter & Altitude** - \\(P = 36\\) cm, \\(h = 6\\sqrt{3}\\) cm.","**Final Verified Answer:** \\(Side = 12 cm, Perimeter = 36 cm, Altitude = 6√3 cm\\)"],
        "img_title": "Equilateral Triangle Area 36√3 cm²",
        "img_type": "calc_equilateral_area36"
    },
    {
        "num": 16,
        "title": "Composite Triangle 30°-45° Altitude 8cm",
        "text": "In △ABC, angle A = 30°, angle B = 45°, and the altitude CD drawn from C to side AB has length 8 cm. Calculate the exact lengths of sides AC, BC, and base AB.",
        "formula": "AC = 16 \\text{ cm}, \\quad BC = 8\\sqrt{2} \\text{ cm}, \\quad AB = 8\\sqrt{3} + 8 = 8(\\sqrt{3} + 1) \\text{ cm}",
        "options": [
            "AC = 16 cm, BC = 8√2 cm, AB = 8(√3 + 1) cm",
            "AC = 8√3 cm, BC = 8 cm, AB = 16 cm",
            "AC = 16 cm, BC = 8 cm, AB = 8√3 cm",
            "AC = 8√2 cm, BC = 16 cm, AB = 16(√3 + 1) cm"
        ],
        "answer": "AC = 16 cm, BC = 8√2 cm, AB = 8(√3 + 1) cm",
        "hint": "Altitude CD = 8 splits △ABC into 30°-60°-90° △ADC and 45°-45°-90° △BDC.",
        "steps": ["**Step 1: In △ADC (30-60-90)** - \\(CD = 8 \\implies AC = 16\\) cm, \\(AD = 8\\sqrt{3}\\) cm.","**Step 2: In △BDC (45-45-90)** - \\(CD = 8 \\implies BC = 8\\sqrt{2}\\) cm, \\(BD = 8\\) cm.","**Step 3: Base AB** - \\(AD + BD = 8\\sqrt{3} + 8 = 8(\\sqrt{3} + 1)\\) cm.","**Final Verified Answer:** \\(AC = 16 cm, BC = 8√2 cm, AB = 8(√3 + 1) cm\\)"],
        "img_title": "Composite Triangle 30°-45° Altitude CD = 8cm",
        "img_type": "composite_30_45_altitude"
    },
    {
        "num": 17,
        "title": "Triangle 45°-60° Altitude Calculation",
        "text": "In △PQR, m∠P = 45°, m∠Q = 60°, and side PQ = 12 cm. Calculate the exact length of the altitude h drawn from vertex R to side PQ.",
        "formula": "h + \\frac{h}{\\sqrt{3}} = 12 \\implies h\\left(1 + \\frac{\\sqrt{3}}{3}\\right) = 12 \\implies h = 6(3 - \\sqrt{3}) \\text{ cm}",
        "options": [
            "h = 6(3 - √3) cm (approx. 7.61 cm)",
            "h = 6√3 cm",
            "h = 12(√3 - 1) cm",
            "h = 6(3 + √3) cm"
        ],
        "answer": "h = 6(3 - √3) cm (approx. 7.61 cm)",
        "hint": "Altitude splits PQ = 12 into segments \\(h\\) (from 45° triangle) and \\(h / \\sqrt{3}\\) (from 60° triangle).",
        "steps": ["**Step 1: Set equation** - \\(h + h/\\sqrt{3} = 12 \\implies h(1 + \\sqrt{3}/3) = 12\\)","**Step 2: Solve h** - \\(h = 36 / (3 + \\sqrt{3}) = 36(3 - \\sqrt{3}) / 6 = 6(3 - \\sqrt{3})\\) cm.","**Final Verified Answer:** \\(h = 6(3 - √3) cm (approx. 7.61 cm)\\)"],
        "img_title": "Triangle PQR 45°-60° Side PQ = 12cm",
        "img_type": "composite_45_60_altitude"
    },
    {
        "num": 18,
        "title": "Trapezoid with 60° and 30° Base Angles",
        "text": "A trapezoid has base angles of 60° and 30°. If the top base is 8 cm and the height is 6 cm, find the length of the lower base and both legs.",
        "formula": "x_1 = \\frac{6}{\\sqrt{3}} = 2\\sqrt{3}, \\quad x_2 = 6\\sqrt{3} \\implies \\text{Lower Base} = 8 + 8\\sqrt{3} \\text{ cm}, \\quad \\text{Leg}_1 = 4\\sqrt{3} \\text{ cm}, \\quad \\text{Leg}_2 = 12 \\text{ cm}",
        "options": [
            "Lower base = 8 + 8√3 cm, Leg₁ = 4√3 cm, Leg₂ = 12 cm",
            "Lower base = 16 cm, Leg₁ = 6 cm, Leg₂ = 12 cm",
            "Lower base = 8 + 6√3 cm, Leg₁ = 12 cm, Leg₂ = 6√3 cm",
            "Lower base = 20 cm, Leg₁ = 8 cm, Leg₂ = 10 cm"
        ],
        "answer": "Lower base = 8 + 8√3 cm, Leg₁ = 4√3 cm, Leg₂ = 12 cm",
        "hint": "Heights at endpoints drop 60° and 30° right triangles on the outer sides of the lower base.",
        "steps": ["**Step 1: 60° triangle** - \\(h = 6 \\implies x_1 = 6/\\sqrt{3} = 2\\sqrt{3}\\), leg \\(= 4\\sqrt{3}\\) cm.","**Step 2: 30° triangle** - \\(h = 6 \\implies x_2 = 6\\sqrt{3}\\), leg \\(= 12\\) cm.","**Step 3: Lower base** - \\(8 + 2\\sqrt{3} + 6\\sqrt{3} = 8 + 8\\sqrt{3}\\) cm.","**Final Verified Answer:** \\(Lower base = 8 + 8√3 cm, Leg₁ = 4√3 cm, Leg₂ = 12 cm\\)"],
        "img_title": "Trapezoid 60° and 30° Base Angles",
        "img_type": "trapezoid_30_60_angles"
    },
    {
        "num": 19,
        "title": "Isosceles Trapezoid 45° Base Angles",
        "text": "In an isosceles trapezoid, the base angles are each 45°, the top base is 10 cm, and the non-parallel legs are each 8 cm. Calculate the height, bottom base, and area.",
        "formula": "h = \\frac{8}{\\sqrt{2}} = 4\\sqrt{2} \\text{ cm}, \\quad \\text{Bottom Base} = 10 + 8\\sqrt{2} \\text{ cm}, \\quad \\text{Area} = (10 + 4\\sqrt{2})4\\sqrt{2} = 40\\sqrt{2} + 32 \\text{ cm}^2",
        "options": [
            "Height = 4√2 cm, Bottom Base = 10 + 8√2 cm, Area = (40√2 + 32) cm²",
            "Height = 8 cm, Bottom Base = 18 cm, Area = 112 cm²",
            "Height = 4 cm, Bottom Base = 14 cm, Area = 48 cm²",
            "Height = 4√2 cm, Bottom Base = 18 cm, Area = 56√2 cm²"
        ],
        "answer": "Height = 4√2 cm, Bottom Base = 10 + 8√2 cm, Area = (40√2 + 32) cm²",
        "hint": "45°-45°-90° triangles at legs have hypotenuse 8, so height and extension are \\(8 / \\sqrt{2} = 4\\sqrt{2}\\).",
        "steps": ["**Step 1: Height & extension** - \\(4\\sqrt{2}\\) cm","**Step 2: Bottom base** - \\(10 + 2(4\\sqrt{2}) = 10 + 8\\sqrt{2}\\) cm","**Step 3: Area** - \\(((10 + 10 + 8\\sqrt{2})/2) \\times 4\\sqrt{2} = (10 + 4\\sqrt{2})4\\sqrt{2} = 40\\sqrt{2} + 32\\) cm².","**Final Verified Answer:** \\(Height = 4√2 cm, Bottom Base = 10 + 8√2 cm, Area = (40√2 + 32) cm²\\)"],
        "img_title": "Isosceles Trapezoid 45° Base Angles Leg 8cm",
        "img_type": "trapezoid_45_angles"
    },
    {
        "num": 20,
        "title": "Isosceles Trapezoid 60° Base Angles",
        "text": "In an isosceles trapezoid with base angles of 60°, top base is 6 cm and legs are each 10 cm. Find the area and diagonal length.",
        "formula": "x = 5 \\text{ cm}, \\quad h = 5\\sqrt{3} \\text{ cm}, \\quad \\text{Bottom Base} = 16 \\text{ cm}, \\quad \\text{Area} = \\frac{6 + 16}{2} \\times 5\\sqrt{3} = 55\\sqrt{3} \\text{ cm}^2",
        "options": [
            "Area = 55√3 cm², Bottom Base = 16 cm",
            "Area = 110√3 cm², Bottom Base = 26 cm",
            "Area = 50√3 cm², Bottom Base = 16 cm",
            "Area = 60 cm², Bottom Base = 16 cm"
        ],
        "answer": "Area = 55√3 cm², Bottom Base = 16 cm",
        "hint": "30°-60°-90° triangles at legs have hypotenuse 10, so base extension is 5 cm and height is \\(5\\sqrt{3}\\) cm.",
        "steps": ["**Step 1: Extension** - \\(10 / 2 = 5\\) cm \\(\\implies\\) Bottom base \\(= 6 + 5 + 5 = 16\\) cm.","**Step 2: Height** - \\(5\\sqrt{3}\\) cm.","**Step 3: Area** - \\(11 \\times 5\\sqrt{3} = 55\\sqrt{3}\\) cm².","**Final Verified Answer:** \\(Area = 55√3 cm², Bottom Base = 16 cm\\)"],
        "img_title": "Isosceles Trapezoid 60° Base Angles Top 6cm Leg 10cm",
        "img_type": "trapezoid_60_angles"
    },
    {
        "num": 21,
        "title": "Regular Hexagon Inscribed in Circle",
        "text": "A regular hexagon is inscribed in a circle of radius 10 cm. Find the perimeter and exact area of the hexagon by dividing it into six special triangles.",
        "formula": "s = r = 10 \\text{ cm} \\implies P = 60 \\text{ cm}, \\quad \\text{Area} = 6 \\times \\frac{\\sqrt{3}}{4}(10)^2 = 150\\sqrt{3} \\text{ cm}^2",
        "options": [
            "Perimeter = 60 cm, Area = 150√3 cm²",
            "Perimeter = 60 cm, Area = 300√3 cm²",
            "Perimeter = 30√3 cm, Area = 150 cm²",
            "Perimeter = 120 cm, Area = 600 cm²"
        ],
        "answer": "Perimeter = 60 cm, Area = 150√3 cm²",
        "hint": "An inscribed regular hexagon splits into 6 equilateral triangles of side length equal to the radius r = 10 cm.",
        "steps": ["**Step 1: Side length** - \\(s = r = 10\\) cm \\(\\implies P = 60\\) cm.","**Step 2: Area of 1 triangle** - \\(\\frac{\\sqrt{3}}{4}(100) = 25\\sqrt{3}\\) cm².","**Step 3: Total Area** - \\(6 \\times 25\\sqrt{3} = 150\\sqrt{3}\\) cm².","**Final Verified Answer:** \\(Perimeter = 60 cm, Area = 150√3 cm²\\)"],
        "img_title": "Regular Hexagon Inscribed in Circle Radius 10cm",
        "img_type": "hexagon_inscribed_10"
    },
    {
        "num": 22,
        "title": "Regular Hexagon Apothem 6√3 cm",
        "text": "A regular hexagon has an apothem (inradius) of 6√3 cm. Calculate the side length, perimeter, and area of the hexagon.",
        "formula": "a = 6\\sqrt{3} = s\\frac{\\sqrt{3}}{2} \\implies s = 12 \\text{ cm}, \\quad P = 72 \\text{ cm}, \\quad \\text{Area} = \\frac{1}{2} P a = 216\\sqrt{3} \\text{ cm}^2",
        "options": [
            "Side = 12 cm, Perimeter = 72 cm, Area = 216√3 cm²",
            "Side = 6 cm, Perimeter = 36 cm, Area = 108√3 cm²",
            "Side = 12 cm, Perimeter = 72 cm, Area = 432 cm²",
            "Side = 18 cm, Perimeter = 108 cm, Area = 324√3 cm²"
        ],
        "answer": "Side = 12 cm, Perimeter = 72 cm, Area = 216√3 cm²",
        "hint": "Apothem is the altitude of each equilateral triangle: \\(a = s\\sqrt{3}/2 = 6\\sqrt{3} \\implies s = 12\\).",
        "steps": ["**Step 1: Side length** - \\(s = 12\\) cm","**Step 2: Perimeter** - \\(6 \\times 12 = 72\\) cm","**Step 3: Area** - \\(\\frac{1}{2}(72)(6\\sqrt{3}) = 216\\sqrt{3}\\) cm².","**Final Verified Answer:** \\(Side = 12 cm, Perimeter = 72 cm, Area = 216√3 cm²\\)"],
        "img_title": "Regular Hexagon Apothem 6√3 cm",
        "img_type": "hexagon_apothem"
    },
    {
        "num": 23,
        "title": "Regular Octagon Cut Corner Leg Length",
        "text": "A regular octagon is constructed by cutting four 45°-45°-90° corner triangles from a square sheet of metal of side 20 cm. Calculate the leg length x of the removed corner triangles.",
        "formula": "x + x\\sqrt{2} + x = 20 \\implies x(2 + \\sqrt{2}) = 20 \\implies x = 20(2 - \\sqrt{2}) / 2 = 10(2 - \\sqrt{2}) \\approx 5.86 \\text{ cm}",
        "options": [
            "x = 10(2 - √2) cm (approx. 5.86 cm)",
            "x = 5 cm",
            "x = 10√2 cm",
            "x = 20 - 10√2 cm"
        ],
        "answer": "x = 10(2 - √2) cm (approx. 5.86 cm)",
        "hint": "Square side = \\(x + x\\sqrt{2} + x = x(2 + \\sqrt{2}) = 20\\).",
        "steps": ["**Step 1: Equation** - \\(x(2 + \\sqrt{2}) = 20\\)","**Step 2: Solve x** - \\(x = 20(2 - \\sqrt{2}) / 2 = 10(2 - \\sqrt{2})\\) cm.","**Final Verified Answer:** \\(x = 10(2 - √2) cm (approx. 5.86 cm)\\)"],
        "img_title": "Square Sheet 20cm Cut Corners Regular Octagon",
        "img_type": "octagon_cut_corners"
    },
    {
        "num": 24,
        "title": "Extension Ladder Height & Distance",
        "text": "A 12-meter extension ladder leans against a vertical building wall making a 60° angle with the horizontal ground. Calculate the exact height the ladder reaches up the wall and the distance of its foot from the base.",
        "formula": "\\text{Foot distance} = 6 \\text{ m}, \\quad \\text{Height up wall} = 6\\sqrt{3} \\text{ m}",
        "options": [
            "Height = 6√3 m, Foot distance = 6 m",
            "Height = 6 m, Foot distance = 6√3 m",
            "Height = 12√3 m, Foot distance = 6 m",
            "Height = 6√2 m, Foot distance = 6 m"
        ],
        "answer": "Height = 6√3 m, Foot distance = 6 m",
        "hint": "Ladder forms 30°-60°-90° triangle with hypotenuse 12 m. Foot distance is shorter leg (12/2 = 6 m).",
        "steps": ["**Step 1: Foot distance** - \\(12 / 2 = 6\\) m","**Step 2: Height** - \\(6\\sqrt{3}\\) m.","**Final Verified Answer:** \\(Height = 6√3 m, Foot distance = 6 m\\)"],
        "img_title": "Ladder 12m Leaning at 60°",
        "img_type": "ladder_60_deg"
    },
    {
        "num": 25,
        "title": "Wheelchair Ramp Vertical Rise",
        "text": "A wheelchair ramp is designed with a 30° incline. If the ramp surface is 6 meters long, calculate the vertical rise gained.",
        "formula": "\\text{Rise} = \\frac{6}{2} = 3 \\text{ meters}",
        "options": [
            "3 meters",
            "3√3 meters",
            "1.5 meters",
            "4.5 meters"
        ],
        "answer": "3 meters",
        "hint": "In a 30°-60°-90° triangle, the side opposite 30° (rise) is half the hypotenuse.",
        "steps": ["**Step 1: Formula** - \\(\\text{Rise} = h / 2 = 6 / 2 = 3\\) meters.","**Final Verified Answer:** \\(3 meters\\)"],
        "img_title": "Wheelchair Ramp 30° Incline 6m",
        "img_type": "ramp_30_deg"
    },
    {
        "num": 26,
        "title": "Roof Truss Rafter Length & Peak Height",
        "text": "A roof truss has symmetric rafters inclined at 45° to the horizontal ceiling joist. If the house span (width) is 14 meters, calculate the rafter length and peak ceiling height.",
        "formula": "\\text{Joist half-width} = 7 \\text{ m} \\implies \\text{Peak Height} = 7 \\text{ m}, \\quad \\text{Rafter Length} = 7\\sqrt{2} \\text{ m}",
        "options": [
            "Peak Height = 7 m, Rafter Length = 7√2 m",
            "Peak Height = 7√2 m, Rafter Length = 14 m",
            "Peak Height = 14 m, Rafter Length = 14√2 m",
            "Peak Height = 3.5 m, Rafter Length = 7 m"
        ],
        "answer": "Peak Height = 7 m, Rafter Length = 7√2 m",
        "hint": "Each half-truss is a 45°-45°-90° triangle with base 7 m.",
        "steps": ["**Step 1: Half-span** - \\(14 / 2 = 7\\) m","**Step 2: Peak height** - Equal to leg \\(= 7\\) m","**Step 3: Rafter length** - Hypotenuse \\(= 7\\sqrt{2}\\) m.","**Final Verified Answer:** \\(Peak Height = 7 m, Rafter Length = 7√2 m\\)"],
        "img_title": "Roof Truss 45° Rafters Span 14m",
        "img_type": "roof_truss_45"
    },
    {
        "num": 27,
        "title": "Guy Wire Mast Support",
        "text": "A guy wire supports a 30-meter radio mast. The wire is anchored to the ground at a 45° angle. Calculate the exact wire length and anchor distance from the mast base.",
        "formula": "\\text{Anchor distance} = 30 \\text{ m}, \\quad \\text{Wire length} = 30\\sqrt{2} \\text{ m}",
        "options": [
            "Wire length = 30√2 m, Anchor distance = 30 m",
            "Wire length = 60 m, Anchor distance = 30√3 m",
            "Wire length = 30 m, Anchor distance = 30√2 m",
            "Wire length = 15√2 m, Anchor distance = 15 m"
        ],
        "answer": "Wire length = 30√2 m, Anchor distance = 30 m",
        "hint": "Forms a 45°-45°-90° triangle where mast height = anchor distance = 30 m.",
        "steps": ["**Step 1: Anchor distance** - \\(= 30\\) m","**Step 2: Wire length** - \\(30\\sqrt{2}\\) m.","**Final Verified Answer:** \\(Wire length = 30√2 m, Anchor distance = 30 m\\)"],
        "img_title": "Radio Mast 30m Guy Wire 45°",
        "img_type": "guy_wire_45"
    },
    {
        "num": 28,
        "title": "Solar Panel Tilt Elevation & Footprint",
        "text": "A solar photovoltaic panel is tilted at 30° to horizontal on a flat commercial roof. If the panel length is 2.5 meters, calculate the vertical elevation of its top edge and its horizontal shadow footprint.",
        "formula": "\\text{Vertical Elevation} = \\frac{2.5}{2} = 1.25 \\text{ m}, \\quad \\text{Horizontal Footprint} = 1.25\\sqrt{3} \\approx 2.17 \\text{ m}",
        "options": [
            "Vertical Elevation = 1.25 m, Horizontal Footprint = 1.25√3 m",
            "Vertical Elevation = 1.25√3 m, Horizontal Footprint = 1.25 m",
            "Vertical Elevation = 2.5 m, Horizontal Footprint = 2.5√3 m",
            "Vertical Elevation = 0.75 m, Horizontal Footprint = 1.5 m"
        ],
        "answer": "Vertical Elevation = 1.25 m, Horizontal Footprint = 1.25√3 m",
        "hint": "Panel length 2.5 m is hypotenuse of 30°-60°-90° triangle.",
        "steps": ["**Step 1: Elevation** - \\(2.5 / 2 = 1.25\\) m","**Step 2: Footprint** - \\(1.25\\sqrt{3}\\) m.","**Final Verified Answer:** \\(Vertical Elevation = 1.25 m, Horizontal Footprint = 1.25√3 m\\)"],
        "img_title": "Solar Panel 2.5m Tilted at 30°",
        "img_type": "solar_panel_30"
    },
    {
        "num": 29,
        "title": "Ship Bearing Navigation Distance",
        "text": "A ship sails from port on a course of N 30° E for a distance of 80 nautical miles. Calculate how far North and how far East the ship has traveled in exact radical form.",
        "formula": "\\text{North (Longer Leg)} = 40\\sqrt{3} \\text{ nmi}, \\quad \\text{East (Shorter Leg)} = 40 \\text{ nmi}",
        "options": [
            "North = 40√3 nmi, East = 40 nmi",
            "North = 40 nmi, East = 40√3 nmi",
            "North = 80 nmi, East = 40√2 nmi",
            "North = 40√2 nmi, East = 40√2 nmi"
        ],
        "answer": "North = 40√3 nmi, East = 40 nmi",
        "hint": "N 30° E makes a 30° angle with North axis and 60° with East axis (hypotenuse = 80).",
        "steps": ["**Step 1: East component** - Opposite 30° \\(= 80 / 2 = 40\\) nmi.","**Step 2: North component** - Adjacent to 30° \\(= 40\\sqrt{3}\\) nmi.","**Final Verified Answer:** \\(North = 40√3 nmi, East = 40 nmi\\)"],
        "img_title": "Ship Navigation N 30° E 80 nmi",
        "img_type": "ship_navigation_30"
    },
    {
        "num": 30,
        "title": "Airplane Climb Altitude & Ground Distance",
        "text": "An airplane climbs at a steady 30° angle of elevation at an airspeed of 400 km/h. Find its vertical altitude gained and horizontal ground distance covered after 15 minutes (100 km traveled).",
        "formula": "\\text{Distance} = 400 \\times 0.25 = 100 \\text{ km} \\implies \\text{Altitude} = 50 \\text{ km}, \\quad \\text{Ground Distance} = 50\\sqrt{3} \\text{ km}",
        "options": [
            "Altitude = 50 km, Ground Distance = 50√3 km",
            "Altitude = 50√3 km, Ground Distance = 50 km",
            "Altitude = 100 km, Ground Distance = 100√3 km",
            "Altitude = 25 km, Ground Distance = 25√3 km"
        ],
        "answer": "Altitude = 50 km, Ground Distance = 50√3 km",
        "hint": "15 min = 0.25 h \\(\\implies\\) path distance = 100 km (hypotenuse).",
        "steps": ["**Step 1: Distance** - \\(400 \\times 0.25 = 100\\) km","**Step 2: Altitude** - \\(100 / 2 = 50\\) km","**Step 3: Ground distance** - \\(50\\sqrt{3}\\) km.","**Final Verified Answer:** \\(Altitude = 50 km, Ground Distance = 50√3 km\\)"],
        "img_title": "Airplane Climb 30° Elevation 100km Path",
        "img_type": "airplane_climb_30"
    },
    {
        "num": 31,
        "title": "Traffic Light Cable Tension Physics",
        "text": "A tension cable holds a 500 N traffic light at the center of an intersection with symmetric support cables each making a 30° angle with the horizontal. Find the tension T in each cable.",
        "formula": "2 T \\sin(30^\\circ) = 500 \\implies 2 T (0.5) = 500 \\implies T = 500 \\text{ N}",
        "options": [
            "Tension T = 500 N",
            "Tension T = 250 N",
            "Tension T = 500√3 N",
            "Tension T = 1000 N"
        ],
        "answer": "Tension T = 500 N",
        "hint": "Vertical forces balance: \\(2T \\sin(30^\circ) = 500\\). Since \\(\\sin(30^\circ) = 1/2\\), \\(T = 500\\) N.",
        "steps": ["**Step 1: Vertical force equilibrium** - \\(2T \\sin(30^\circ) = 500\\)","**Step 2: Solve T** - \\(2T(0.5) = 500 \\implies T = 500\\) N.","**Final Verified Answer:** \\(Tension T = 500 N\\)"],
        "img_title": "Traffic Light Cable Tension 500N at 30°",
        "img_type": "traffic_light_30"
    },
    {
        "num": 32,
        "title": "Cube Space Diagonal Length",
        "text": "Calculate the exact length of the space diagonal of a cube having an edge length of 10 cm (d = s√3) by analyzing embedded special triangles.",
        "formula": "\\text{Face Diagonal} = 10\\sqrt{2} \\text{ cm}, \\quad \\text{Space Diagonal} = \\sqrt{(10\\sqrt{2})^2 + 10^2} = \\sqrt{200 + 100} = 10\\sqrt{3} \\text{ cm}",
        "options": [
            "10√3 cm",
            "10√2 cm",
            "20 cm",
            "15 cm"
        ],
        "answer": "10√3 cm",
        "hint": "Face diagonal of 10x10 square is \\(10\\sqrt{2}\\). Space diagonal \\(d = \\sqrt{(10\\sqrt{2})^2 + 10^2} = 10\\sqrt{3}\\).",
        "steps": ["**Step 1: Face diagonal** - \\(10\\sqrt{2}\\) cm","**Step 2: Space diagonal** - \\(\\sqrt{200 + 100} = \\sqrt{300} = 10\\sqrt{3}\\) cm.","**Final Verified Answer:** \\(10√3 cm\\)"],
        "img_title": "Cube Edge 10cm Space Diagonal",
        "img_type": "cube_space_diagonal"
    },
    {
        "num": 33,
        "title": "Square Pyramid Height & Slant Height",
        "text": "A right square pyramid has a base side length of 12 cm and lateral edges of length 12 cm. Calculate the exact height of the pyramid and the slant height of its triangular faces.",
        "formula": "\\text{Slant Height } L = \\sqrt{12^2 - 6^2} = 6\\sqrt{3} \\text{ cm}, \\quad \\text{Pyramid Height } h = \\sqrt{(6\\sqrt{3})^2 - 6^2} = \\sqrt{108 - 36} = 6\\sqrt{2} \\text{ cm}",
        "options": [
            "Height = 6√2 cm, Slant Height = 6√3 cm",
            "Height = 6√3 cm, Slant Height = 6√2 cm",
            "Height = 12 cm, Slant Height = 12√3 cm",
            "Height = 6 cm, Slant Height = 12 cm"
        ],
        "answer": "Height = 6√2 cm, Slant Height = 6√3 cm",
        "hint": "Lateral face is equilateral triangle of side 12 cm \\(\\implies L = 6\\sqrt{3}\\). Base center to edge is 6 cm.",
        "steps": ["**Step 1: Slant height** - \\(L = 6\\sqrt{3}\\) cm","**Step 2: Height** - \\(h = \\sqrt{(6\\sqrt{3})^2 - 6^2} = \\sqrt{108 - 36} = \\sqrt{72} = 6\\sqrt{2}\\) cm.","**Final Verified Answer:** \\(Height = 6√2 cm, Slant Height = 6√3 cm\\)"],
        "img_title": "Right Square Pyramid Edge 12cm",
        "img_type": "pyramid_square_12"
    },
    {
        "num": 34,
        "title": "Regular Tetrahedron Altitude",
        "text": "A regular tetrahedron has all edge lengths equal to 6 cm. Calculate the altitude of the tetrahedron in simplest radical form.",
        "formula": "h = s\\sqrt{\\frac{2}{3}} = 6 \\frac{\\sqrt{6}}{3} = 2\\sqrt{6} \\text{ cm}",
        "options": [
            "2√6 cm",
            "3√3 cm",
            "4√2 cm",
            "6√2 cm"
        ],
        "answer": "2√6 cm",
        "hint": "Base is equilateral triangle (side 6, circumradius \\(r = 2\\sqrt{3}\\)). Height \\(h = \\sqrt{6^2 - (2\\sqrt{3})^2} = \\sqrt{36 - 12} = 2\\sqrt{6}\\).",
        "steps": ["**Step 1: Base circumradius** - \\(2\\sqrt{3}\\) cm","**Step 2: Altitude** - \\(h = \\sqrt{36 - 12} = \\sqrt{24} = 2\\sqrt{6}\\) cm.","**Final Verified Answer:** \\(2√6 cm\\)"],
        "img_title": "Regular Tetrahedron Edge 6cm Altitude",
        "img_type": "tetrahedron_6"
    },
    {
        "num": 35,
        "title": "Trigonometric Values of 45°",
        "text": "Use a 45°-45°-90° triangle with legs 1 and hypotenuse √2 to derive the exact values of sin 45°, cos 45°, and tan 45°.",
        "formula": "\\sin 45^\\circ = \\frac{\\sqrt{2}}{2}, \\quad \\cos 45^\\circ = \\frac{\\sqrt{2}}{2}, \\quad \\tan 45^\\circ = 1",
        "options": [
            "sin 45° = √2/2, cos 45° = √2/2, tan 45° = 1",
            "sin 45° = 1/2, cos 45° = √3/2, tan 45° = √3/3",
            "sin 45° = √3/2, cos 45° = 1/2, tan 45° = √3",
            "sin 45° = 1, cos 45° = 1, tan 45° = √2"
        ],
        "answer": "sin 45° = √2/2, cos 45° = √2/2, tan 45° = 1",
        "hint": "\\(\\sin 45^\circ = 1 / \\sqrt{2} = \\sqrt{2}/2\\); \\(\\tan 45^\circ = 1/1 = 1\\).",
        "steps": ["**Step 1: Opposite/Hypotenuse** - \\(1/\\sqrt{2} = \\sqrt{2}/2\\).","**Step 2: Adjacent/Hypotenuse** - \\(1/\\sqrt{2} = \\sqrt{2}/2\\).","**Step 3: Opposite/Adjacent** - \\(1/1 = 1\\).","**Final Verified Answer:** \\(sin 45° = √2/2, cos 45° = √2/2, tan 45° = 1\\)"],
        "img_title": "Trig Ratios of 45°",
        "img_type": "trig_45_deg"
    },
    {
        "num": 36,
        "title": "Trigonometric Values of 30° and 60°",
        "text": "Use a 30°-60°-90° triangle to state the exact values of sin 30°, cos 30°, sin 60°, and cos 60°.",
        "formula": "\\sin 30^\\circ = \\frac{1}{2}, \\quad \\cos 30^\\circ = \\frac{\\sqrt{3}}{2}, \\quad \\sin 60^\\circ = \\frac{\\sqrt{3}}{2}, \\quad \\cos 60^\\circ = \\frac{1}{2}",
        "options": [
            "sin 30° = 1/2, cos 30° = √3/2, sin 60° = √3/2, cos 60° = 1/2",
            "sin 30° = √3/2, cos 30° = 1/2, sin 60° = 1/2, cos 60° = √3/2",
            "sin 30° = √2/2, cos 30° = √2/2, sin 60° = 1, cos 60° = 0",
            "sin 30° = 1, cos 30° = 0, sin 60° = 1/2, cos 60° = √3/2"
        ],
        "answer": "sin 30° = 1/2, cos 30° = √3/2, sin 60° = √3/2, cos 60° = 1/2",
        "hint": "Opposite 30° is 1, opposite 60° is \\(\\sqrt{3}\\), hypotenuse is 2.",
        "steps": ["**Step 1: 30° values** - \\(\\sin 30^\circ = 1/2\\), \\(\\cos 30^\circ = \\sqrt{3}/2\\).","**Step 2: 60° values** - \\(\\sin 60^\circ = \\sqrt{3}/2\\), \\(\\cos 60^\circ = 1/2\\).","**Final Verified Answer:** \\(sin 30° = 1/2, cos 30° = √3/2, sin 60° = √3/2, cos 60° = 1/2\\)"],
        "img_title": "Trig Ratios of 30° and 60°",
        "img_type": "trig_30_60_deg"
    },
    {
        "num": 37,
        "title": "Trigonometric Expression (sin 30° cos 45° + cos 30° sin 45°)",
        "text": "Evaluate the exact numerical value of the trigonometric expression: (sin 30° · cos 45°) + (cos 30° · sin 45°).",
        "formula": "\\left(\\frac{1}{2} \\cdot \\frac{\\sqrt{2}}{2}\\right) + \\left(\\frac{\\sqrt{3}}{2} \\cdot \\frac{\\sqrt{2}}{2}\\right) = \\frac{\\sqrt{2} + \\sqrt{6}}{4}",
        "options": [
            "(√2 + √6) / 4",
            "(√6 - √2) / 4",
            "√2 / 2",
            "√3 / 2"
        ],
        "answer": "(√2 + √6) / 4",
        "hint": "Substitute \\(\\sin 30^\circ = 1/2\\), \\(\\cos 45^\circ = \\sqrt{2}/2\\), \\(\\cos 30^\circ = \\sqrt{3}/2\\), \\(\\sin 45^\circ = \\sqrt{2}/2\\).",
        "steps": ["**Step 1: Multiply pairs** - \\(\\frac{\\sqrt{2}}{4} + \\frac{\\sqrt{6}}{4}\\)","**Step 2: Add** - \\(\\frac{\\sqrt{2} + \\sqrt{6}}{4}\\).","**Final Verified Answer:** \\((√2 + √6) / 4\\)"],
        "img_title": "Trig Addition Formula 75°",
        "img_type": "trig_expr_75"
    },
    {
        "num": 38,
        "title": "Trigonometric Fraction Evaluation",
        "text": "Evaluate without a calculator: \\(\\frac{\\tan^2 60^\\circ - 2 \\sin^2 45^\\circ}{\\cos^2 30^\\circ + \\sin^2 30^\\circ}\\).",
        "formula": "\\frac{(\\sqrt{3})^2 - 2\\left(\\frac{\\sqrt{2}}{2}\\right)^2}{\\left(\\frac{\\sqrt{3}}{2}\\right)^2 + \\left(\\frac{1}{2}\\right)^2} = \\frac{3 - 2(2/4)}{3/4 + 1/4} = \\frac{3 - 1}{1} = 2",
        "options": [
            "2",
            "1",
            "3",
            "1/2"
        ],
        "answer": "2",
        "hint": "Denominator \\(\\cos^2 30^\circ + \\sin^2 30^\circ = 1\\). Numerator \\(= 3 - 2(1/2) = 2\\).",
        "steps": ["**Step 1: Numerator** - \\((\\sqrt{3})^2 - 2(1/2) = 3 - 1 = 2\\)","**Step 2: Denominator** - \\(3/4 + 1/4 = 1\\)","**Step 3: Quotient** - \\(2 / 1 = 2\\).","**Final Verified Answer:** \\(2\\)"],
        "img_title": "Trig Expression Evaluation",
        "img_type": "trig_expr_fraction"
    },
    {
        "num": 39,
        "title": "Trigonometric Difference Identity Verification",
        "text": "Evaluate \\(\\sin 60^\\circ \\cos 30^\\circ - \\cos 60^\\circ \\sin 30^\\circ\\) and verify it equals \\(\\sin(60^\\circ - 30^\\circ)\\).",
        "formula": "\\left(\\frac{\\sqrt{3}}{2} \\cdot \\frac{\\sqrt{3}}{2}\\right) - \\left(\\frac{1}{2} \\cdot \\frac{1}{2}\\right) = \\frac{3}{4} - \\frac{1}{4} = \\frac{2}{4} = \\frac{1}{2} = \\sin 30^\\circ",
        "options": [
            "1/2 (equals sin 30°)",
            "√3/2 (equals cos 30°)",
            "0",
            "1"
        ],
        "answer": "1/2 (equals sin 30°)",
        "hint": "\\(3/4 - 1/4 = 2/4 = 1/2 = \\sin 30^\circ\\).",
        "steps": ["**Step 1: Term 1** - \\((\\sqrt{3}/2)(\\sqrt{3}/2) = 3/4\\)","**Step 2: Term 2** - \\((1/2)(1/2) = 1/4\\)","**Step 3: Difference** - \\(3/4 - 1/4 = 1/2\\).","**Final Verified Answer:** \\(1/2 (equals sin 30°)\\)"],
        "img_title": "Trig Difference Identity sin(60° - 30°)",
        "img_type": "trig_expr_sin30"
    },
    {
        "num": 40,
        "title": "30°-60°-90° Algebraic Equations",
        "text": "In a 30°-60°-90° triangle, the hypotenuse is represented by 4x - 6 and the shorter leg by x + 5. Solve for x and find the length of the longer leg.",
        "formula": "4x - 6 = 2(x + 5) \\implies 4x - 6 = 2x + 10 \\implies 2x = 16 \\implies x = 8 \\implies \\text{Shorter Leg} = 13, \\text{ Longer Leg} = 13\\sqrt{3}",
        "options": [
            "x = 8, Longer leg = 13√3 cm",
            "x = 6, Longer leg = 11√3 cm",
            "x = 10, Longer leg = 15√3 cm",
            "x = 8, Longer leg = 26 cm"
        ],
        "answer": "x = 8, Longer leg = 13√3 cm",
        "hint": "Hypotenuse is double shorter leg: \\(4x - 6 = 2(x + 5)\\).",
        "steps": ["**Step 1: Solve x** - \\(4x - 6 = 2x + 10 \\implies 2x = 16 \\implies x = 8\\)","**Step 2: Shorter leg** - \\(8 + 5 = 13\\) cm","**Step 3: Longer leg** - \\(13\\sqrt{3}\\) cm.","**Final Verified Answer:** \\(x = 8, Longer leg = 13√3 cm\\)"],
        "img_title": "30°-60°-90° Triangle Hypotenuse 4x - 6 and Shorter x + 5",
        "img_type": "algebra_30_60_90"
    },
    {
        "num": 41,
        "title": "45°-45°-90° Algebraic Identity",
        "text": "In a 45°-45°-90° triangle, the hypotenuse is 2x + 4 and one leg is (x + 2)√2. Show that this relationship holds for all x > -2.",
        "formula": "\\text{Hypotenuse} = \\text{Leg} \\times \\sqrt{2} = (x + 2)\\sqrt{2} \\times \\sqrt{2} = 2(x + 2) = 2x + 4",
        "options": [
            "Valid for all x > -2 because Leg × √2 = (x + 2)√2 × √2 = 2x + 4.",
            "Valid only when x = 0.",
            "Invalid because legs must be integers.",
            "Valid only when x = 2."
        ],
        "answer": "Valid for all x > -2 because Leg × √2 = (x + 2)√2 × √2 = 2x + 4.",
        "hint": "Multiply leg \\((x + 2)\\sqrt{2}\\) by \\(\\sqrt{2}\\): \\((x + 2) \\times 2 = 2x + 4\\).",
        "steps": ["**Step 1: Leg times √2** - \\((x + 2)\\sqrt{2} \\times \\sqrt{2} = 2(x + 2) = 2x + 4\\).","**Final Verified Answer:** \\(Valid for all x > -2 because Leg × √2 = (x + 2)√2 × √2 = 2x + 4.\\)"],
        "img_title": "45°-45°-90° Triangle Hypotenuse 2x + 4 Leg (x + 2)√2",
        "img_type": "algebra_45_45_90"
    },
    {
        "num": 42,
        "title": "Sum of Shorter Leg and Hypotenuse",
        "text": "In a 30°-60°-90° triangle, the sum of the shorter leg and the hypotenuse is 36 cm. Calculate the length of the longer leg.",
        "formula": "x + 2x = 36 \\implies 3x = 36 \\implies x = 12 \\text{ cm (shorter leg)} \\implies \\text{Longer Leg} = 12\\sqrt{3} \\text{ cm}",
        "options": [
            "12√3 cm",
            "18 cm",
            "24 cm",
            "6√3 cm"
        ],
        "answer": "12√3 cm",
        "hint": "Hypotenuse is \\(2x\\), shorter leg is \\(x\\). Sum \\(x + 2x = 36 \\implies 3x = 36 \\implies x = 12\\).",
        "steps": ["**Step 1: Shorter leg** - \\(3x = 36 \\implies x = 12\\) cm","**Step 2: Longer leg** - \\(12\\sqrt{3}\\) cm.","**Final Verified Answer:** \\(12√3 cm\\)"],
        "img_title": "30°-60°-90° Triangle Sum x + 2x = 36",
        "img_type": "algebra_sum_30_60"
    },
    {
        "num": 43,
        "title": "Misconception: Side-Angle Opposition",
        "text": "A student attempts to solve a 30°-60°-90° triangle with hypotenuse 10 cm and claims the longer leg is 5 cm and shorter leg is 5√3 cm. Correct the student's error.",
        "formula": "\\text{Shorter leg (opposite 30°)} = 5 \\text{ cm}, \\quad \\text{Longer leg (opposite 60°)} = 5\\sqrt{3} \\text{ cm}",
        "options": [
            "Shorter leg (opposite 30°) must be 5 cm, and longer leg (opposite 60°) must be 5√3 cm.",
            "Student is correct.",
            "Both legs must be equal to 5 cm.",
            "Hypotenuse should be 5√3 cm."
        ],
        "answer": "Shorter leg (opposite 30°) must be 5 cm, and longer leg (opposite 60°) must be 5√3 cm.",
        "hint": "The smaller angle (30°) faces the smaller side (5 cm); larger angle (60°) faces larger side (5√3 ≈ 8.66 cm).",
        "steps": ["**Step 1: Shorter side** - Opposite smaller angle (30°) \\(= 10 / 2 = 5\\) cm.","**Step 2: Longer side** - Opposite larger angle (60°) \\(= 5\\sqrt{3}\\) cm.","**Final Verified Answer:** \\(Shorter leg (opposite 30°) must be 5 cm, and longer leg (opposite 60°) must be 5√3 cm.\\)"],
        "img_title": "Side-Angle Opposition 30°-60°-90°",
        "img_type": "misconception_side_angle"
    },
    {
        "num": 44,
        "title": "Misconception: Leg from Hypotenuse Division",
        "text": "A student computes the leg of a 45°-45°-90° triangle with hypotenuse 10 as 10√2 instead of 10/√2 = 5√2. Explain the conceptual confusion.",
        "formula": "\\text{Leg } s = \\frac{h}{\\sqrt{2}} = \\frac{10}{\\sqrt{2}} = 5\\sqrt{2} \\quad (\\text{Divide, do not multiply})",
        "options": [
            "The leg is smaller than the hypotenuse, so one must DIVIDE hypotenuse by √2 (10 / √2 = 5√2), not multiply.",
            "Student is correct.",
            "Leg is half the hypotenuse (5 cm).",
            "Hypotenuse is leg divided by √2."
        ],
        "answer": "The leg is smaller than the hypotenuse, so one must DIVIDE hypotenuse by √2 (10 / √2 = 5√2), not multiply.",
        "hint": "Hypotenuse is the longest side. Legs must be smaller than 10.",
        "steps": ["**Step 1: Identify leg formula** - \\(s = h / \\sqrt{2}\\).","**Step 2: Calculate** - \\(10 / \\sqrt{2} = 5\\sqrt{2} \\approx 7.07\\) cm (smaller than 10).","**Final Verified Answer:** \\(The leg is smaller than the hypotenuse, so one must DIVIDE hypotenuse by √2 (10 / √2 = 5√2), not multiply.\\)"],
        "img_title": "45°-45°-90° Leg vs Hypotenuse Scaling",
        "img_type": "misconception_scaling"
    },
    {
        "num": 45,
        "title": "Folding Stepladder Geometry",
        "text": "A folding stepladder has two legs of length 2.4 meters hinged at the top. When fully opened, the angle between the legs is 60°. Calculate the height of the ladder peak and the floor spread between the feet.",
        "formula": "\\text{Forms Equilateral Triangle: } \\text{Floor Spread} = 2.4 \\text{ m}, \\quad \\text{Peak Height} = 2.4 \\frac{\\sqrt{3}}{2} = 1.2\\sqrt{3} \\approx 2.08 \\text{ m}",
        "options": [
            "Floor Spread = 2.4 m, Peak Height = 1.2√3 m (approx. 2.08 m)",
            "Floor Spread = 1.2 m, Peak Height = 2.4 m",
            "Floor Spread = 2.4√3 m, Peak Height = 1.2 m",
            "Floor Spread = 4.8 m, Peak Height = 2.4√3 m"
        ],
        "answer": "Floor Spread = 2.4 m, Peak Height = 1.2√3 m (approx. 2.08 m)",
        "hint": "Hinge angle 60° with equal legs 2.4 m forms an equilateral triangle.",
        "steps": ["**Step 1: Floor spread** - Equal to leg length \\(= 2.4\\) m.","**Step 2: Peak height** - Altitude of equilateral triangle \\(= 1.2\\sqrt{3}\\) m.","**Final Verified Answer:** \\(Floor Spread = 2.4 m, Peak Height = 1.2√3 m (approx. 2.08 m)\\)"],
        "img_title": "Stepladder 2.4m Hinge Angle 60°",
        "img_type": "stepladder_60"
    },
    {
        "num": 46,
        "title": "Origami Paper Folding Special Triangles",
        "text": "An origami artist folds a 20 cm by 20 cm square paper along its diagonal, then folds the resulting 45-45-90 triangle along its altitude. Find the perimeter and area of the resulting smaller triangle.",
        "formula": "\\text{Legs} = 10\\sqrt{2} \\text{ cm}, \\quad \\text{Hypotenuse} = 20 \\text{ cm} \\implies P = 20 + 20\\sqrt{2} \\text{ cm}, \\quad \\text{Area} = 100 \\text{ cm}^2",
        "options": [
            "Perimeter = 20 + 20√2 cm, Area = 100 cm²",
            "Perimeter = 40 cm, Area = 200 cm²",
            "Perimeter = 20√2 cm, Area = 50 cm²",
            "Perimeter = 40√2 cm, Area = 100 cm²"
        ],
        "answer": "Perimeter = 20 + 20√2 cm, Area = 100 cm²",
        "hint": "First fold makes 45-45-90 △ (hypotenuse \\(20\\sqrt{2}\\)). Second fold along altitude bisects area to 100 cm².",
        "steps": ["**Step 1: Area** - \\(400 / 4 = 100\\) cm²","**Step 2: Legs** - \\(10\\sqrt{2}\\) cm, Hypotenuse \\(= 20\\) cm \\(\\implies P = 20 + 20\\sqrt{2}\\) cm.","**Final Verified Answer:** \\(Perimeter = 20 + 20√2 cm, Area = 100 cm²\\)"],
        "img_title": "Origami Square 20cm Folded Special Triangles",
        "img_type": "origami_fold_45"
    },
    {
        "num": 47,
        "title": "Diamond Kite Composite Special Triangles",
        "text": "A diamond kite has upper section as a 45°-45°-90° triangle with hypotenuse 30 cm, and lower section as a 30°-60°-90° composite. Calculate the total surface area of the kite.",
        "formula": "\\text{Upper Area} = \\frac{1}{2}(15\\sqrt{2})^2 = 225, \\quad \\text{Lower Area} = 15 \\times 15\\sqrt{3} = 225\\sqrt{3} \\implies \\text{Total Area} = 225(1 + \\sqrt{3}) \\text{ cm}^2",
        "options": [
            "Total Area = 225(1 + √3) cm² (approx. 614.7 cm²)",
            "Total Area = 450 cm²",
            "Total Area = 225√3 cm²",
            "Total Area = 150(1 + √3) cm²"
        ],
        "answer": "Total Area = 225(1 + √3) cm² (approx. 614.7 cm²)",
        "hint": "Upper diagonal half-width is 15 cm. Upper height is 15 cm (Area = 225). Lower height is \\(15\\sqrt{3}\\) (Area = \\(225\\sqrt{3}\\)).",
        "steps": ["**Step 1: Upper area** - \\(\\frac{1}{2} \\times 30 \\times 15 = 225\\) cm²","**Step 2: Lower area** - \\(\\frac{1}{2} \\times 30 \\times 15\\sqrt{3} = 225\\sqrt{3}\\) cm²","**Step 3: Total area** - \\(225(1 + \\sqrt{3})\\) cm².","**Final Verified Answer:** \\(Total Area = 225(1 + √3) cm² (approx. 614.7 cm²)\\)"],
        "img_title": "Diamond Kite Composite 45° and 30°-60°",
        "img_type": "composite_kite_special"
    },
    {
        "num": 48,
        "title": "Clock Face Minute Hand Distance",
        "text": "In a clock face of radius 15 cm, calculate the exact straight-line distance between the tip of the minute hand at 12:00 and its position at 12:20 (120° central angle).",
        "formula": "\\text{Angle} = 120^\\circ \\implies \\text{Isosceles △ with 120° top angle} \\implies d = 2 \\times 15 \\sin(60^\\circ) = 30 \\frac{\\sqrt{3}}{2} = 15\\sqrt{3} \\text{ cm}",
        "options": [
            "15√3 cm (approx. 25.98 cm)",
            "15 cm",
            "30 cm",
            "15√2 cm"
        ],
        "answer": "15√3 cm (approx. 25.98 cm)",
        "hint": "120° angle splits into two 30°-60°-90° triangles with hypotenuse 15 cm.",
        "steps": ["**Step 1: Half-distance** - Opposite 60° in 15 cm hypotenuse triangle \\(= 15\\sqrt{3}/2\\).","**Step 2: Full distance** - \\(2 \\times (15\\sqrt{3}/2) = 15\\sqrt{3}\\) cm.","**Final Verified Answer:** \\(15√3 cm (approx. 25.98 cm)\\)"],
        "img_title": "Clock Face Minute Hand 15cm at 12:20 (120°)",
        "img_type": "clock_hand_120"
    },
    {
        "num": 49,
        "title": "CNC Milled Equilateral Pocket Coordinates",
        "text": "A CNC machine mills an equilateral triangular pocket of side 18 mm. Find the coordinates of its three vertices if the triangle is centered at the origin with one vertex on the positive y-axis.",
        "formula": "h = 9\\sqrt{3} \\text{ mm}, \\quad \\text{Circumradius } R = 6\\sqrt{3} \\implies (0, 6\\sqrt{3}), (-9, -3\\sqrt{3}), (9, -3\\sqrt{3})",
        "options": [
            "(0, 6√3), (-9, -3√3), (9, -3√3)",
            "(0, 9√3), (-9, 0), (9, 0)",
            "(0, 18), (-9, -9), (9, -9)",
            "(0, 6√3), (-6, -3√3), (6, -3√3)"
        ],
        "answer": "(0, 6√3), (-9, -3√3), (9, -3√3)",
        "hint": "In an equilateral triangle, centroid divides altitude \\(9\\sqrt{3}\\) in 2:1 ratio (\\(R = 6\\sqrt{3}\\), \\(r = 3\\sqrt{3}\\)).",
        "steps": ["**Step 1: Altitude** - \\(9\\sqrt{3}\\) mm","**Step 2: Top vertex** - \\((0, 6\\sqrt{3})\\)","**Step 3: Bottom vertices** - \\((-9, -3\\sqrt{3})\\) and \\((9, -3\\sqrt{3})\\).","**Final Verified Answer:** \\((0, 6√3), (-9, -3√3), (9, -3√3)\\)"],
        "img_title": "CNC Equilateral Triangle Side 18mm Coordinates",
        "img_type": "cnc_triangle_coords"
    },
    {
        "num": 50,
        "title": "Triangular Park Central Path Length",
        "text": "A surveyor measures an equilateral triangular park of perimeter 180 meters. Calculate the exact length of the central walking path connecting one vertex perpendicularly to the opposite side.",
        "formula": "s = 60 \\text{ m} \\implies h = 30\\sqrt{3} \\text{ m} \\approx 51.96 \\text{ meters}",
        "options": [
            "30√3 meters (approx. 51.96 m)",
            "30 meters",
            "60 meters",
            "45 meters"
        ],
        "answer": "30√3 meters (approx. 51.96 m)",
        "hint": "Perimeter 180 m \\(\\implies\\) side \\(s = 60\\) m. Path is altitude \\(h = 60 \\sqrt{3}/2 = 30\\sqrt{3}\\).",
        "steps": ["**Step 1: Side length** - \\(180 / 3 = 60\\) m","**Step 2: Altitude (path)** - \\(30\\sqrt{3}\\) m.","**Final Verified Answer:** \\(30√3 meters (approx. 51.96 m)\\)"],
        "img_title": "Triangular Park Perimeter 180m Central Path",
        "img_type": "park_triangle_path"
    }
]

with open('scratch/t151_50_built_questions.json', 'w', encoding='utf-8') as out:
    json.dump(q_data, out, indent=2, ensure_ascii=False)

print(f"Built all {len(q_data)} verified unique questions for Topic 151.")

