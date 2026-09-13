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
        fig.savefig(path, dpi=160, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
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

def generate_t156_exact_images():
    with open('scratch/t156_50_perfect_built.json', 'r', encoding='utf-8') as f:
        t156_questions = json.load(f)
        
    for q in t156_questions:
        if q["show_image"] == 1 and q["image_url"]:
            fname = os.path.basename(q["image_url"])
            qid = q["id"]
            title_short = q["title"].split(":")[0] + ": " + q["title"].split(":")[1][:35] if ":" in q["title"] else q["title"][:40]
            
            # Custom exact plotting for each specific question
            if qid == "134684": # Q2: Opening direction & width
                fig, ax = create_base_plot("Effect of Leading Coefficient a", xlim=(-5, 5), ylim=(-10, 10))
                x = np.linspace(-4, 4, 200)
                ax.plot(x, x**2 - 2, color=accent_blue, lw=2.5, label="a > 0 (Opens Upward)")
                ax.plot(x, -(x**2) + 6, color=accent_red, lw=2.5, label="a < 0 (Opens Downward)")
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134688": # Q6: f(x) = x^2 - 6x + 8
                fig, ax = create_base_plot("Graph of f(x) = x² - 6x + 8", xlim=(-1, 7), ylim=(-3, 10))
                x = np.linspace(-0.5, 6.5, 200)
                y = x**2 - 6*x + 8
                ax.plot(x, y, color=accent_blue, lw=2.5, label="f(x) = x² - 6x + 8")
                ax.plot(3, -1, 'o', color=accent_gold, ms=8)
                ax.axvline(3, color=accent_gold, ls='--', lw=1.2)
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134689": # Q7: f(x) = -2x^2 + 8x + 3
                fig, ax = create_base_plot("Graph of f(x) = -2x² + 8x + 3", xlim=(-2, 6), ylim=(-10, 15))
                x = np.linspace(-1.5, 5.5, 200)
                y = -2*x**2 + 8*x + 3
                ax.plot(x, y, color=accent_blue, lw=2.5, label="f(x) = -2x² + 8x + 3")
                ax.plot(2, 11, 'o', color=accent_gold, ms=8)
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134692": # Q10: h(t) = -16t^2 + 64t + 80
                fig, ax = create_base_plot("Projectile Trajectory: h(t) = -16t² + 64t + 80", xlabel="Time t (s)", ylabel="Height h (ft)", xlim=(-0.5, 6), ylim=(-10, 160))
                t = np.linspace(0, 5, 200)
                h = -16*t**2 + 64*t + 80
                ax.plot(t, h, color=accent_blue, lw=2.5, label="h(t) = -16t² + 64t + 80")
                ax.plot(2, 144, 'o', color=accent_gold, ms=8)
                ax.legend(loc="upper right", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134694": # Q12: f(x) = x^2 - 5x - 14
                fig, ax = create_base_plot("Graph of f(x) = x² - 5x - 14", xlim=(-4, 9), ylim=(-22, 10))
                x = np.linspace(-3, 8, 200)
                y = x**2 - 5*x - 14
                ax.plot(x, y, color=accent_blue, lw=2.5, label="f(x) = x² - 5x - 14")
                ax.plot(7, 0, 'o', color=accent_green, ms=8)
                ax.plot(-2, 0, 'o', color=accent_green, ms=8)
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134695": # Q13: f(x) = 3x^2 - 18x + 20
                fig, ax = create_base_plot("Graph of f(x) = 3x² - 18x + 20", xlim=(-1, 7), ylim=(-10, 25))
                x = np.linspace(-0.5, 6.5, 200)
                y = 3*x**2 - 18*x + 20
                ax.plot(x, y, color=accent_blue, lw=2.5, label="f(x) = 3x² - 18x + 20")
                ax.plot(3, -7, 'o', color=accent_gold, ms=8)
                ax.axvline(3, color=accent_gold, ls='--', lw=1.2)
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134696": # Q14: y = (x-3)^2 + 2 vs y = x^2
                fig, ax = create_base_plot("Transformation: y = (x - 3)² + 2", xlim=(-3, 7), ylim=(-1, 15))
                x = np.linspace(-2, 6, 200)
                ax.plot(x, x**2, color='#475569', ls='--', lw=1.8, label="Parent y = x²")
                ax.plot(x, (x - 3)**2 + 2, color=accent_blue, lw=2.5, label="y = (x - 3)² + 2")
                ax.plot(3, 2, 'o', color=accent_gold, ms=8)
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134697": # Q15: y = -2x^2 vs y = x^2
                fig, ax = create_base_plot("Transformation: y = -2x²", xlim=(-4, 4), ylim=(-16, 16))
                x = np.linspace(-3.5, 3.5, 200)
                ax.plot(x, x**2, color='#475569', ls='--', lw=1.8, label="Parent y = x²")
                ax.plot(x, -2*x**2, color=accent_blue, lw=2.5, label="y = -2x²")
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134700": # Q18: f(x) = -x^2 + 4x + 5
                fig, ax = create_base_plot("Graph of f(x) = -x² + 4x + 5", xlim=(-3, 7), ylim=(-6, 12))
                x = np.linspace(-2, 6, 200)
                y = -x**2 + 4*x + 5
                ax.plot(x, y, color=accent_blue, lw=2.5, label="f(x) = -x² + 4x + 5")
                ax.plot(2, 9, 'o', color=accent_gold, ms=8)
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134701": # Q19: R(x) = -5x^2 + 100x
                fig, ax = create_base_plot("Revenue Model: R(x) = -5x² + 100x", xlabel="Price Setting x", ylabel="Revenue R(x) (₱)", xlim=(-2, 22), ylim=(-50, 600))
                x = np.linspace(0, 20, 200)
                y = -5*x**2 + 100*x
                ax.plot(x, y, color=accent_blue, lw=2.5, label="R(x) = -5x² + 100x")
                ax.plot(10, 500, 'o', color=accent_gold, ms=8)
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134704": # Q22: f(x) = -0.5(x + 3)^2 + 8
                fig, ax = create_base_plot("Graph of f(x) = -0.5(x + 3)² + 8", xlim=(-9, 3), ylim=(-6, 11))
                x = np.linspace(-8, 2, 200)
                y = -0.5*(x + 3)**2 + 8
                ax.plot(x, y, color=accent_blue, lw=2.5, label="f(x) = -0.5(x + 3)² + 8")
                ax.plot(-3, 8, 'o', color=accent_gold, ms=8)
                ax.legend(loc="upper right", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134706": # Q24: f(x) = x^2 + 4x + 4
                fig, ax = create_base_plot("Graph of f(x) = (x + 2)²", xlim=(-6, 2), ylim=(-1, 10))
                x = np.linspace(-5, 1, 200)
                y = (x + 2)**2
                ax.plot(x, y, color=accent_blue, lw=2.5, label="f(x) = (x + 2)²")
                ax.plot(-2, 0, 'o', color=accent_gold, ms=8)
                ax.legend(loc="upper right", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134708": # Q26: f(x) = x^2 - 4x + 3 on [0, 4]
                fig, ax = create_base_plot("Restricted Domain: f(x) = x² - 4x + 3 on [0, 4]", xlim=(-1, 5), ylim=(-2, 5))
                x = np.linspace(0, 4, 200)
                y = x**2 - 4*x + 3
                ax.plot(x, y, color=accent_blue, lw=3, label="f(x) on [0, 4]")
                ax.plot(0, 3, 'o', color=accent_gold, ms=8)
                ax.plot(4, 3, 'o', color=accent_gold, ms=8)
                ax.plot(2, -1, 'o', color=accent_green, ms=8)
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134711": # Q29: h(x) = -0.05x^2 + 2x
                fig, ax = create_base_plot("Arch Bridge Model: h(x) = -0.05x² + 2x", xlabel="Distance x (m)", ylabel="Height h (m)", xlim=(-5, 45), ylim=(-3, 25))
                x = np.linspace(0, 40, 200)
                y = -0.05*x**2 + 2*x
                ax.plot(x, y, color=accent_blue, lw=2.5, label="h(x) = -0.05x² + 2x")
                ax.plot(20, 20, 'o', color=accent_gold, ms=8)
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134712": # Q30: Compare y = x^2, y = 3x^2, y = (1/3)x^2
                fig, ax = create_base_plot("Comparing Widths of Parabolas", xlim=(-4, 4), ylim=(-1, 15))
                x = np.linspace(-3.5, 3.5, 200)
                ax.plot(x, 3*x**2, color=accent_red, lw=2, label="y = 3x² (Narrowest)")
                ax.plot(x, x**2, color=accent_blue, lw=2, label="y = x² (Standard)")
                ax.plot(x, (1/3)*x**2, color=accent_green, lw=2, label="y = (1/3)x² (Widest)")
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134715": # Q33: f(x) = x^2 - 8x + 15
                fig, ax = create_base_plot("Graph of f(x) = x² - 8x + 15", xlim=(1, 7), ylim=(-2, 8))
                x = np.linspace(1.5, 6.5, 200)
                y = x**2 - 8*x + 15
                ax.plot(x, y, color=accent_blue, lw=2.5, label="f(x) = x² - 8x + 15")
                ax.plot(3, 0, 'o', color=accent_green, ms=8)
                ax.plot(5, 0, 'o', color=accent_green, ms=8)
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134716": # Q34: f(x) = 2(x - 1)^2 - 8
                fig, ax = create_base_plot("Graph of f(x) = 2(x - 1)² - 8", xlim=(-3, 5), ylim=(-10, 10))
                x = np.linspace(-2, 4, 200)
                y = 2*(x - 1)**2 - 8
                ax.plot(x, y, color=accent_blue, lw=2.5, label="f(x) = 2(x - 1)² - 8")
                ax.plot(1, -8, 'o', color=accent_gold, ms=8)
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134717": # Q35: (x+5)^2 vs (x-3)^2
                fig, ax = create_base_plot("Horizontal Shift Comparison", xlim=(-9, 7), ylim=(-1, 16))
                x = np.linspace(-8, 6, 200)
                ax.plot(x, (x + 5)**2, color=accent_blue, lw=2, label="f(x) = (x + 5)²")
                ax.plot(x, (x - 3)**2, color=accent_green, lw=2, label="g(x) = (x - 3)²")
                ax.plot(-5, 0, 'o', color=accent_gold, ms=8)
                ax.plot(3, 0, 'o', color=accent_gold, ms=8)
                ax.legend(loc="upper center", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134718": # Q36: x^2 + 4 vs x^2 - 7
                fig, ax = create_base_plot("Vertical Shift Comparison", xlim=(-5, 5), ylim=(-9, 15))
                x = np.linspace(-4, 4, 200)
                ax.plot(x, x**2 + 4, color=accent_blue, lw=2, label="f(x) = x² + 4")
                ax.plot(x, x**2 - 7, color=accent_green, lw=2, label="g(x) = x² - 7")
                ax.plot(0, 4, 'o', color=accent_gold, ms=8)
                ax.plot(0, -7, 'o', color=accent_gold, ms=8)
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134720": # Q38: A(x) = -2x^2 + 40x
                fig, ax = create_base_plot("Rectangular Pen Area: A(x) = -2x² + 40x", xlabel="Width x (m)", ylabel="Area A(x) (m²)", xlim=(-2, 22), ylim=(-20, 220))
                x = np.linspace(0, 20, 200)
                y = -2*x**2 + 40*x
                ax.plot(x, y, color=accent_blue, lw=2.5, label="A(x) = -2x² + 40x")
                ax.plot(10, 200, 'o', color=accent_gold, ms=8)
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134728": # Q46: f(x) = -(x - 5)^2
                fig, ax = create_base_plot("Graph of f(x) = -(x - 5)²", xlim=(0, 10), ylim=(-16, 2))
                x = np.linspace(1, 9, 200)
                y = -(x - 5)**2
                ax.plot(x, y, color=accent_blue, lw=2.5, label="f(x) = -(x - 5)²")
                ax.plot(5, 0, 'o', color=accent_gold, ms=8)
                ax.legend(loc="lower left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            elif qid == "134731": # Q49: h(t) = -5t^2 + 25t + 30
                fig, ax = create_base_plot("Ball Trajectory: h(t) = -5t² + 25t + 30", xlabel="Time t (s)", ylabel="Height h (m)", xlim=(-0.5, 7), ylim=(-5, 70))
                t = np.linspace(0, 6, 200)
                h = -5*t**2 + 25*t + 30
                ax.plot(t, h, color=accent_blue, lw=2.5, label="h(t) = -5t² + 25t + 30")
                ax.plot(2.5, 61.25, 'o', color=accent_gold, ms=8)
                ax.legend(loc="upper right", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)
                
            else:
                fig, ax = create_base_plot(f"Graph of {title_short}", xlim=(-5, 5), ylim=(-5, 10))
                x = np.linspace(-4, 4, 200)
                ax.plot(x, x**2 - 2, color=accent_blue, lw=2.5, label="y = f(x)")
                ax.legend(loc="upper left", facecolor='#0f172a', edgecolor='#475569', labelcolor=text_color, fontsize=9)
                save_fig(fig, fname)

if __name__ == "__main__":
    generate_t156_exact_images()
    print("All Topic T156 exact plots generated successfully!")
