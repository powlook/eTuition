import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/g10_mg_suggested.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for tcode, topic in data.items():
    print(f"\n==========================================")
    print(f"TOPIC {tcode}: {topic['topic_name']}")
    print(f"==========================================")
    for q in topic['questions']:
        print(f"[{q['item_id']}] {q['suggested_question']}")
