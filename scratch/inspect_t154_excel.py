import pandas as pd

excel_path = 'QBank/questions_bank.xlsx'
df = pd.read_excel(excel_path)
print("Columns:", df.columns.tolist())

# Filter for Form 9 Topic 154 or T154
t154_df = df[df['Topic ID'].astype(str).str.contains('154|T154', na=False) | df['Topic Name'].astype(str).str.contains('Relation|Function|154', na=False)]
print(f"Total rows found in Excel for T154: {len(t154_df)}")

for idx, row in t154_df.head(10).iterrows():
    print(f"Row {idx} | ID: {row.get('Question ID')} | Title: {row.get('Question Title')}")
    print(f"  QText: {row.get('Question Text')}")
    print(f"  Formula: {row.get('Math Formula')}")
    print(f"  OptA: {row.get('Option A')} | OptB: {row.get('Option B')} | OptC: {row.get('Option C')} | OptD: {row.get('Option D')}")
    print(f"  Correct: {row.get('Correct Answer')}")
    print("-" * 60)
