import json
import random

with open("scratch/t159_50_perfect_built.json", "r", encoding="utf-8") as f:
    questions = json.load(f)

# Use a fixed random seed for reproducible shuffling
random.seed(159)

pos_counts = {"A": 0, "B": 0, "C": 0, "D": 0}

for idx, q in enumerate(questions):
    correct_text = q["correct"]
    opts = list(q["options"])
    
    # Shuffle options until correct_text is distributed
    random.shuffle(opts)
    
    q["options"] = opts
    
    # Check index of correct_text
    correct_idx = opts.index(correct_text)
    pos_letter = ["A", "B", "C", "D"][correct_idx]
    pos_counts[pos_letter] += 1

print(f"Shuffled {len(questions)} questions for T159.")
print("Distribution of correct answer options:")
for letter, count in pos_counts.items():
    print(f"  Option {letter}: {count} questions ({count/50*100:.1f}%)")

with open("scratch/t159_50_perfect_built.json", "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print("Saved updated scratch/t159_50_perfect_built.json")
