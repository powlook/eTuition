import json

data = json.load(open('scratch/t151_50_built_questions.json', encoding='utf-8'))
for i, q in enumerate(data):
    print(f"Q{i+1}: ID={q['id']} | Image={q.get('image_url')} | Text={q['question_text']}")
