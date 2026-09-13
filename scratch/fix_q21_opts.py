import json
import sqlite3
import os

with open('scratch/t146_50_built_questions.json', 'r', encoding='utf-8') as f:
    q_data = json.load(f)

# Fix Q21 options and answer
for q in q_data:
    if q['num'] == 21:
        q['options'] = [
            "Opposite sides are parallel (m_AB = m_CD = 1/2 and m_AD = m_BC = -3)",
            "Opposite sides are parallel (m_AB = m_CD = 1/2 and m_AD = m_BC = 3)",
            "Sides are not parallel",
            "Diagonals are perpendicular"
        ]
        q['answer'] = "Opposite sides are parallel (m_AB = m_CD = 1/2 and m_AD = m_BC = -3)"

with open('scratch/t146_50_built_questions.json', 'w', encoding='utf-8') as out:
    json.dump(q_data, out, indent=2, ensure_ascii=False)

print("Updated Q21 options in scratch/t146_50_built_questions.json")
