import os
import matplotlib.pyplot as plt
import numpy as np
import json

plt.style.use('dark_background')

target_dirs = [
    'public/images',
    'QBank/public/images',
    'QBank/dist/images'
]

for d in target_dirs:
    os.makedirs(d, exist_ok=True)

def save_fig(fig, filename):
    for d in target_dirs:
        path = os.path.join(d, filename)
        fig.savefig(path, dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close(fig)
    print(f"Saved {filename}")

bg_color = '#0b132b'
card_color = '#1e293b'
text_color = '#f8fafc'
accent_blue = '#38bdf8'
accent_gold = '#f59e0b'
accent_green = '#10b981'
accent_red = '#ef4444'

def create_base_plot(title_text="", xlabel="x", ylabel="y", xlim=None, ylim=None):
    fig, ax = plt.subplots(figsize=(6.5, 4.5), facecolor=bg_color)
    ax.set_facecolor(card_color)
    ax.grid(True, color='#334155', linestyle='--', linewidth=0.8, alpha=0.6)
    for spine in ax.spines.values():
        spine.set_color('#475569')
        spine.set_linewidth(1.2)
    ax.tick_params(colors='#94a3b8', labelsize=10)
    ax.set_xlabel(xlabel, color=text_color, fontsize=11, labelpad=8)
    ax.set_ylabel(ylabel, color=text_color, fontsize=11, labelpad=8)
    if title_text:
        ax.set_title(title_text, color=accent_gold, fontsize=12, fontweight='bold', pad=12)
    if xlim:
        ax.set_xlim(xlim)
    if ylim:
        ax.set_ylim(ylim)
    ax.axhline(0, color='#64748b', linewidth=1.2)
    ax.axvline(0, color='#64748b', linewidth=1.2)
    return fig, ax

def generate_t155_images():
    with open('scratch/t155_clean_built.json', 'r', encoding='utf-8') as f:
        t155_questions = json.load(f)
        
    for q in t155_questions:
        if q["show_image"] == 1 and q["image_url"]:
            fname = os.path.basename(q["image_url"])
            qid = q["id"]
            
            fig, ax = create_base_plot(f"Linear Graph - {q['title']}", xlim=(-6, 12), ylim=(-8, 12))
            
            # Draw representative linear function or plot based on title/question
            if 'candle' in q['question_text'].lower():
                t = np.linspace(0, 16.67, 100)
                L = 25 - 1.5*t
                ax.set_xlim(-1, 20)
                ax.set_ylim(-2, 30)
                ax.set_xlabel("Time t (hours)")
                ax.set_ylabel("Length L (cm)")
                ax.plot(t, L, color=accent_blue, lw=2.5, label="L(t) = 25 - 1.5t")
            elif 'diver' in q['question_text'].lower():
                t = np.linspace(0, 10, 100)
                D = -8*t
                ax.set_xlim(-1, 12)
                ax.set_ylim(-90, 10)
                ax.set_xlabel("Time t (minutes)")
                ax.set_ylabel("Depth D (meters)")
                ax.plot(t, D, color=accent_blue, lw=2.5, label="D(t) = -8t")
            elif 'water tank' in q['question_text'].lower():
                t = np.linspace(0, 40, 100)
                V = 5000 - 125*t
                ax.set_xlim(-2, 45)
                ax.set_ylim(-200, 5500)
                ax.set_xlabel("Time t (minutes)")
                ax.set_ylabel("Volume V (Liters)")
                ax.plot(t, V, color=accent_blue, lw=2.5, label="V(t) = 5000 - 125t")
            elif 'horizontal' in q['question_text'].lower():
                ax.axhline(8, color=accent_blue, lw=2.5, label="y = 8")
                ax.plot(-5, 8, 'o', color=accent_gold, ms=8)
            elif 'vertical' in q['question_text'].lower():
                ax.axvline(-5, color=accent_blue, lw=2.5, label="x = -5")
                ax.plot(-5, 8, 'o', color=accent_gold, ms=8)
            elif 'parallel' in q['question_text'].lower():
                x = np.linspace(-5, 5, 100)
                ax.plot(x, (2/3)*x + 4, color=accent_blue, lw=2, label="f(x) = (2/3)x + 4")
                ax.plot(x, (2/3)*x - 5, color=accent_green, lw=2, label="g(x) = (2/3)x - 5")
            elif 'intersection' in q['question_text'].lower():
                x = np.linspace(-2, 6, 100)
                ax.plot(x, 2*x - 3, color=accent_blue, lw=2, label="f(x) = 2x - 3")
                ax.plot(x, -x + 6, color=accent_green, lw=2, label="g(x) = -x + 6")
                ax.plot(3, 3, 'o', color=accent_gold, ms=8, label="Intersection (3, 3)")
            else:
                x = np.linspace(-5, 10, 100)
                ax.plot(x, 0.8*x - 2, color=accent_blue, lw=2.5, label="Linear Line")
                
            ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
            save_fig(fig, fname)

def generate_t156_images():
    with open('scratch/t156_clean_built.json', 'r', encoding='utf-8') as f:
        t156_questions = json.load(f)
        
    for q in t156_questions:
        if q["show_image"] == 1 and q["image_url"]:
            fname = os.path.basename(q["image_url"])
            
            fig, ax = create_base_plot(f"Quadratic Graph - {q['title']}", xlim=(-6, 6), ylim=(-8, 12))
            
            x = np.linspace(-5, 5, 200)
            if 'projectile' in q['question_text'].lower() or 'height' in q['question_text'].lower():
                t = np.linspace(0, 5, 100)
                h = -16*t**2 + 64*t + 80
                ax.set_xlim(-0.5, 6)
                ax.set_ylim(-10, 160)
                ax.set_xlabel("Time t (seconds)")
                ax.set_ylabel("Height h (feet)")
                ax.plot(t, h, color=accent_blue, lw=2.5, label="h(t) = -16t² + 64t + 80")
            elif 'opens' in q['question_text'].lower() or 'a > 0' in q['question_text'].lower():
                ax.plot(x, x**2 - 2, color=accent_blue, lw=2, label="a > 0 (Opens Upward)")
                ax.plot(x, -(x**2) + 6, color=accent_red, lw=2, label="a < 0 (Opens Downward)")
            elif 'vertex' in q['question_text'].lower():
                ax.plot(x, (x - 2)**2 - 3, color=accent_blue, lw=2.5, label="y = (x - 2)² - 3")
                ax.plot(2, -3, 'o', color=accent_gold, ms=8, label="Vertex (2, -3)")
            else:
                ax.plot(x, x**2 - 4*x + 1, color=accent_blue, lw=2.5, label="y = ax² + bx + c")
                
            ax.legend(loc="upper right", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
            save_fig(fig, fname)

def generate_t157_images():
    with open('scratch/t157_clean_built.json', 'r', encoding='utf-8') as f:
        t157_questions = json.load(f)
        
    for q in t157_questions:
        if q["show_image"] == 1 and q["image_url"]:
            fname = os.path.basename(q["image_url"])
            
            fig, ax = create_base_plot(f"Quadratic Solution - {q['title']}", xlim=(-2, 7), ylim=(-6, 10))
            
            if 'rectangle' in q['question_text'].lower():
                fig_rect, ax_rect = plt.subplots(figsize=(6.5, 4.5), facecolor=bg_color)
                ax_rect.set_facecolor(card_color)
                ax_rect.set_xlim(0, 10)
                ax_rect.set_ylim(0, 6)
                ax_rect.axis('off')
                ax_rect.set_title("Rectangle Area Model: Area = 84 m²", color=accent_gold, fontsize=12, fontweight='bold')
                from matplotlib.patches import Rectangle
                r = Rectangle((2, 1.5), 6, 3, fc='#0f172a', ec=accent_blue, lw=2.5)
                ax_rect.add_patch(r)
                ax_rect.text(5, 1.0, "Length = x + 5", color=text_color, fontsize=11, fontweight='bold', ha='center')
                ax_rect.text(1.2, 3.0, "Width = x", color=text_color, fontsize=11, fontweight='bold', ha='center')
                save_fig(fig_rect, fname)
            else:
                x = np.linspace(-1, 6, 200)
                y = x**2 - 6*x + 8
                ax.plot(x, y, color=accent_blue, lw=2.5, label="y = x² - 6x + 8")
                ax.plot(2, 0, 'o', color=accent_gold, ms=8, label="Root x = 2")
                ax.plot(4, 0, 'o', color=accent_gold, ms=8, label="Root x = 4")
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)

def generate_t158_images():
    with open('scratch/t158_clean_built.json', 'r', encoding='utf-8') as f:
        t158_questions = json.load(f)
        
    for q in t158_questions:
        if q["show_image"] == 1 and q["image_url"]:
            fname = os.path.basename(q["image_url"])
            
            fig, ax = create_base_plot(f"Variation Graph - {q['title']}", xlim=(-1, 10), ylim=(-1, 20))
            
            if 'inverse' in q['question_text'].lower() or 'hyperbola' in q['question_text'].lower():
                x = np.linspace(0.5, 9, 200)
                y = 12 / x
                ax.set_xlim(0, 10)
                ax.set_ylim(0, 15)
                ax.plot(x, y, color=accent_blue, lw=2.5, label="y = k / x (Inverse Variation Hyperbola)")
            else:
                x = np.linspace(0, 9, 100)
                y = 1.8 * x
                ax.plot(x, y, color=accent_blue, lw=2.5, label="y = kx (Direct Variation Line)")
                ax.plot(0, 0, 'o', color=accent_gold, ms=7, label="Origin (0, 0)")
                
            ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
            save_fig(fig, fname)

if __name__ == "__main__":
    generate_t155_images()
    generate_t156_images()
    generate_t157_images()
    generate_t158_images()
    print("Successfully generated all required images for Topics 155, 156, 157, 158!")
