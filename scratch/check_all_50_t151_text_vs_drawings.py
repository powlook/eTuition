import json

data = json.load(open('scratch/t151_50_built_questions.json', encoding='utf-8'))

for q in data:
    num = q['num']
    title_safe = q['title'].encode('ascii', 'ignore').decode('ascii')
    text_safe = q['text'].encode('ascii', 'ignore').decode('ascii')
    print(f"Q{num}: {title_safe}\n   TEXT: {text_safe}\n")
