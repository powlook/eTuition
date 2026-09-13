import json
import re

def process_topics():
    # Load raw JSONs
    raw_data = {}
    for top_id in [155, 156, 157, 158]:
        with open(f'scratch/t{top_id}_dump.json', 'r', encoding='utf-8') as f:
            raw_data[top_id] = json.load(f)

    # We will build clean datasets for each topic
    clean_data = {}
    
    # Process T155
    t155_items = []
    for q in raw_data[155]:
        qid = q["id"]
        title = q["title"]
        qtext = q["question_text"]
        opts = q["options"]
        ans = q["correct_answer"]
        formula = q["math_formula"]
        
        # Decide show_image based on content requiring plot/diagram
        # Questions asking to graph, sketch, find from graph, visual line properties get show_image=1
        needs_image = False
        if any(w in qtext.lower() for w in ['sketch', 'graph', 'coordinate plane', 'table of values', 'intercepts of the line 3x + 4y', 'f(x) = 2x - 4 by', '2x - 3y = 6 using', 'parallel to the x-axis', 'parallel to the y-axis', 'never intersect', 'intersection of', 'shown with x-intercept']):
            needs_image = True
        elif any(w in title.lower() for w in ['graph', 'sketch', 'plot', 'intercepts', 'table']):
            needs_image = True
        elif qid in ['134637', '134638', '134641', '134648', '134649', '134650', '134652', '134653', '134657', '134661', '134662', '134663', '134670', '134672', '134673', '134674', '134675', '134679']:
            needs_image = True
            
        show_img = 1 if needs_image else 0
        img_url = f"/images/g9_t155_q{int(qid)-134632}.png" if show_img else None
        
        t155_items.append({
            "id": qid,
            "title": title,
            "question_text": qtext,
            "math_formula": formula,
            "options": opts,
            "correct_answer": ans,
            "show_image": show_img,
            "image_url": img_url
        })
    clean_data[155] = t155_items

    # Process T156
    t156_items = []
    for q in raw_data[156]:
        qid = q["id"]
        title = q["title"]
        qtext = q["question_text"]
        opts = q["options"]
        ans = q["correct_answer"]
        formula = q["math_formula"]
        
        needs_image = False
        if any(w in qtext.lower() for w in ['parabola', 'graph', 'vertex', 'opening', 'trajectory', 'projectile height', 'sketch', 'transformations']):
            needs_image = True
        elif qid in ['134684', '134688', '134689', '134692', '134694', '134695', '134696', '134697', '134700', '134704', '134708', '134712', '134716', '134720', '134724', '134728', '134732']:
            needs_image = True
            
        show_img = 1 if needs_image else 0
        img_url = f"/images/g9_t156_q{int(qid)-134682}.png" if show_img else None
        
        t156_items.append({
            "id": qid,
            "title": title,
            "question_text": qtext,
            "math_formula": formula,
            "options": opts,
            "correct_answer": ans,
            "show_image": show_img,
            "image_url": img_url
        })
    clean_data[156] = t156_items

    # Process T157
    t157_items = []
    for q in raw_data[157]:
        qid = q["id"]
        title = q["title"]
        qtext = q["question_text"]
        opts = q["options"]
        ans = q["correct_answer"]
        formula = q["math_formula"]
        
        needs_image = False
        if any(w in qtext.lower() for w in ['graphically', 'rectangle area', 'projectile', 'discriminant geometric', 'intersection of parabola']):
            needs_image = True
        elif qid in ['134738', '134745', '134752', '134757', '134762', '134767', '134772', '134777']:
            needs_image = True
            
        show_img = 1 if needs_image else 0
        img_url = f"/images/g9_t157_q{int(qid)-134732}.png" if show_img else None
        
        t157_items.append({
            "id": qid,
            "title": title,
            "question_text": qtext,
            "math_formula": formula,
            "options": opts,
            "correct_answer": ans,
            "show_image": show_img,
            "image_url": img_url
        })
    clean_data[157] = t157_items

    # Process T158
    t158_items = []
    for q in raw_data[158]:
        qid = q["id"]
        title = q["title"]
        qtext = q["question_text"]
        opts = q["options"]
        ans = q["correct_answer"]
        formula = q["math_formula"]
        
        needs_image = False
        if any(w in qtext.lower() for w in ['graph', 'table', 'hyperbola', 'straight line through origin', 'hooke', 'speed vs time', 'light intensity']):
            needs_image = True
        elif qid in ['134783', '134784', '134788', '134792', '134796', '134800', '134804', '134808', '134812', '134816', '134820', '134824', '134828', '134832']:
            needs_image = True
            
        show_img = 1 if needs_image else 0
        img_url = f"/images/g9_t158_q{int(qid)-134782}.png" if show_img else None
        
        t158_items.append({
            "id": qid,
            "title": title,
            "question_text": qtext,
            "math_formula": formula,
            "options": opts,
            "correct_answer": ans,
            "show_image": show_img,
            "image_url": img_url
        })
    clean_data[158] = t158_items

    # Save to JSON
    for top_id in [155, 156, 157, 158]:
        items = clean_data[top_id]
        imaged = sum(1 for x in items if x["show_image"] == 1)
        non_imaged = sum(1 for x in items if x["show_image"] == 0)
        print(f"Topic {top_id}: Total={len(items)} | Imaged={imaged} | Non-imaged={non_imaged}")
        with open(f'scratch/t{top_id}_clean_built.json', 'w', encoding='utf-8') as f:
            json.dump(items, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    process_topics()
