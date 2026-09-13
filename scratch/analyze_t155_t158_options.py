import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

for top_id in [155, 156, 157, 158]:
    with open(f'scratch/t{top_id}_dump.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)
        
    print(f"=== TOPIC {top_id} SUMMARY ({len(questions)} items) ===")
    corrupted_count = 0
    option_freq = {}
    
    for idx, q in enumerate(questions, 1):
        opts = q['options']
        ans = q['correct_answer']
        
        # Check option uniqueness / fallback repetition
        opts_str = str(opts)
        option_freq[opts_str] = option_freq.get(opts_str, 0) + 1
        
    print(f"Unique option sets count: {len(option_freq)}")
    for opt_set, count in option_freq.items():
        if count > 2:
            print(f"  REPEATED OPTION SET ({count} times): {opt_set[:100]}...")
    print("-" * 80)
