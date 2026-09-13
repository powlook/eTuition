import pandas as pd
import json

excel_path = 'QBank/questions_bank.xlsx'
df = pd.read_excel(excel_path)

t154_df = df[df['Topic ID'].astype(str).str.contains('154|T154', na=False) | df['Topic Name'].astype(str).str.contains('Relation|Function|154', na=False)]

data = []
for idx, row in t154_df.iterrows():
    item = {
        "id": str(row.get('Question ID')),
        "title": str(row.get('Question Title')),
        "text": str(row.get('Question Text')),
        "formula": str(row.get('LaTeX Formula Expression')) if pd.notna(row.get('LaTeX Formula Expression')) else "",
        "optA": str(row.get('Option A')),
        "optB": str(row.get('Option B')),
        "optC": str(row.get('Option C')),
        "optD": str(row.get('Option D')),
        "correct": str(row.get('Correct Answer')),
        "image_url": str(row.get('Image URL')) if pd.notna(row.get('Image URL')) else "",
        "difficulty": int(row.get('Difficulty')) if pd.notna(row.get('Difficulty')) else 3
    }
    data.append(item)

with open('scratch/t154_excel_dump.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Exported {len(data)} T154 questions to scratch/t154_excel_dump.json")
