import json
import random

# Complete 50 questions for Form 9 Topic T160: Probabilities of Simple and Compound Events

raw_questions = [
    {
        "q_num": 1,
        "title": "Q1: Define an experiment, outcome, sample space, and event in probability theory.",
        "text": "Define an experiment, an outcome, a sample space, and an event in probability theory.",
        "formula": r"S = \{e_1, e_2, \dots, e_n\}, \quad E \subseteq S, \quad P(E) = \frac{n(E)}{n(S)}",
        "options": [
            "Sample space is the set of all possible outcomes; an event is any subset of the sample space",
            "Sample space is the probability value; an event is the total count of trials",
            "Sample space and event are identical terms used interchangeably",
            "Sample space applies only to dice rolls; an event applies only to coin flips"
        ],
        "correct": "Sample space is the set of all possible outcomes; an event is any subset of the sample space",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 2,
        "title": "Q2: Explain the difference between a simple event and a compound event.",
        "text": "Explain the difference between a simple event and a compound event, giving an example of each.",
        "formula": r"P(A \cup B) = P(A) + P(B) - P(A \cap B)",
        "options": [
            "A simple event consists of a single outcome; a compound event combines two or more simple events",
            "A simple event uses coins; a compound event uses playing cards",
            "A simple event requires 3 trials; a compound event requires 1 trial",
            "A simple event probability is always 1; a compound event probability is 0"
        ],
        "correct": "A simple event consists of a single outcome; a compound event combines two or more simple events",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 3,
        "title": "Q3: State the probability formula for equally likely outcomes.",
        "text": "State the theoretical probability formula for equally likely outcomes in a finite sample space.",
        "formula": r"P(E) = \frac{n(E)}{n(S)}, \quad 0 \le P(E) \le 1",
        "options": [
            "P(E) = n(E) / n(S), where n(E) is favorable outcomes and n(S) is total possible outcomes",
            "P(E) = n(S) / n(E)",
            "P(E) = n(E) × n(S)",
            "P(E) = n(S) - n(E)"
        ],
        "correct": "P(E) = n(E) / n(S), where n(E) is favorable outcomes and n(S) is total possible outcomes",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 4,
        "title": "Q4: State the fundamental probability range: 0 ≤ P(E) ≤ 1.",
        "text": "State the fundamental probability range: 0 ≤ P(E) ≤ 1, and explain what P(E) = 0 and P(E) = 1 mean.",
        "formula": r"0 \le P(E) \le 1, \quad P(\emptyset) = 0, \quad P(S) = 1",
        "options": [
            "P(E) = 0 means the event is impossible; P(E) = 1 means the event is certain to occur",
            "P(E) = 0 means the event occurs half the time; P(E) = 1 means it never occurs",
            "P(E) can be negative for loss events and greater than 1 for high frequency events",
            "P(E) = 0 applies to coins; P(E) = 1 applies to dice"
        ],
        "correct": "P(E) = 0 means the event is impossible; P(E) = 1 means the event is certain to occur",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 5,
        "title": "Q5: State the Complement Rule of probability.",
        "text": "State the Complement Rule of probability: P(not E) = 1 - P(E), and calculate P(not E) if P(E) = 0.35.",
        "formula": r"P(E') = 1 - P(E) = 1 - 0.35 = 0.65",
        "options": [
            "0.65 (65%)",
            "0.35 (35%)",
            "1.35 (135%)",
            "0.50 (50%)"
        ],
        "correct": "0.65 (65%)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 6,
        "title": "Q6: Find probabilities when rolling a standard fair six-sided die.",
        "text": "A standard fair six-sided die is rolled once. Find the probability of rolling an even number.",
        "formula": r"P(\text{Even}) = \frac{n(\{2,4,6\})}{n(\{1,2,3,4,5,6\})} = \frac{3}{6} = \frac{1}{2}",
        "options": [
            "1/2",
            "1/3",
            "1/6",
            "2/3"
        ],
        "correct": "1/2",
        "show_image": 1,
        "image_url": "/images/g9_t160_q6.svg"
    },
    {
        "q_num": 7,
        "title": "Q7: Explain theoretical vs experimental probability when tossing a coin.",
        "text": "A fair coin is tossed 100 times resulting in 58 Heads. What are the theoretical and experimental probabilities of getting Heads?",
        "formula": r"P_{\text{theo}} = \frac{1}{2} = 0.50, \quad P_{\text{exp}} = \frac{58}{100} = 0.58",
        "options": [
            "Theoretical = 0.50; Experimental = 0.58",
            "Theoretical = 0.58; Experimental = 0.50",
            "Theoretical = 1.00; Experimental = 0.58",
            "Theoretical = 0.25; Experimental = 0.50"
        ],
        "correct": "Theoretical = 0.50; Experimental = 0.58",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 8,
        "title": "Q8: Probabilities of drawing cards from a standard 52-card deck.",
        "text": "A standard deck of 52 playing cards has 4 suits. Find the probability of drawing a face card (Jack, Queen, King).",
        "formula": r"P(\text{Face Card}) = \frac{12}{52} = \frac{3}{13}",
        "options": [
            "3/13 (12/52)",
            "1/13 (4/52)",
            "1/4 (13/52)",
            "1/52"
        ],
        "correct": "3/13 (12/52)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 9,
        "title": "Q9: Probability of drawing colored balls from a bag.",
        "text": "A bag contains 5 red balls, 7 blue balls, and 8 green balls (total 20). If one ball is drawn at random, find the probability that it is NOT green.",
        "formula": r"P(\text{Not Green}) = 1 - P(\text{Green}) = 1 - \frac{8}{20} = \frac{12}{20} = \frac{3}{5}",
        "options": [
            "3/5 (12/20)",
            "2/5 (8/20)",
            "1/4 (5/20)",
            "7/20"
        ],
        "correct": "3/5 (12/20)",
        "show_image": 1,
        "image_url": "/images/g9_t160_q9.svg"
    },
    {
        "q_num": 10,
        "title": "Q10: Two fair coins tossed simultaneously - sample space and probability.",
        "text": "Two fair coins are tossed simultaneously. Write the sample space S and find the probability of getting exactly one Head.",
        "formula": r"S = \{HH, HT, TH, TT\}, \quad P(\text{Exactly 1 Head}) = \frac{2}{4} = \frac{1}{2}",
        "options": [
            "S = {HH, HT, TH, TT}, P(1 Head) = 1/2",
            "S = {HH, TT}, P(1 Head) = 1/4",
            "S = {HH, HT, TT}, P(1 Head) = 1/3",
            "S = {H, T}, P(1 Head) = 1.00"
        ],
        "correct": "S = {HH, HT, TH, TT}, P(1 Head) = 1/2",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 11,
        "title": "Q11: Three fair coins tossed - tree diagram and probability.",
        "text": "Three fair coins are tossed. Find the probability of obtaining at least two Heads.",
        "formula": r"S = \{HHH, HHT, HTH, HTT, THH, THT, TTH, TTT\}, \quad P(\ge 2H) = \frac{4}{8} = \frac{1}{2}",
        "options": [
            "1/2 (4/8)",
            "3/8",
            "1/4 (2/8)",
            "7/8"
        ],
        "correct": "1/2 (4/8)",
        "show_image": 1,
        "image_url": "/images/g9_t160_q11.svg"
    },
    {
        "q_num": 12,
        "title": "Q12: Two dice rolled - sample space size and sum = 7 probability.",
        "text": "Two standard six-sided dice are rolled. How many outcomes are in the sample space? Find the probability that the sum of the numbers is 7.",
        "formula": r"n(S) = 6 \times 6 = 36, \quad E = \{(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)\}, \quad P(\text{Sum}=7) = \frac{6}{36} = \frac{1}{6}",
        "options": [
            "n(S) = 36, P(Sum = 7) = 1/6",
            "n(S) = 12, P(Sum = 7) = 1/12",
            "n(S) = 36, P(Sum = 7) = 7/36",
            "n(S) = 18, P(Sum = 7) = 1/3"
        ],
        "correct": "n(S) = 36, P(Sum = 7) = 1/6",
        "show_image": 1,
        "image_url": "/images/g9_t160_q12.svg"
    },
    {
        "q_num": 13,
        "title": "Q13: Rolling two dice - probability of sum at least 10.",
        "text": "Referring to rolling two standard dice, find the probability that the sum of the two numbers is at least 10.",
        "formula": r"E = \{(4,6),(5,5),(5,6),(6,4),(6,5),(6,6)\}, \quad P(\text{Sum} \ge 10) = \frac{6}{36} = \frac{1}{6}",
        "options": [
            "1/6 (6/36)",
            "1/12 (3/36)",
            "1/4 (9/36)",
            "5/36"
        ],
        "correct": "1/6 (6/36)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 14,
        "title": "Q14: Define mutually exclusive vs non-mutually exclusive events.",
        "text": "Define mutually exclusive (disjoint) events and non-mutually exclusive events.",
        "formula": r"\text{Mutually Exclusive} \iff A \cap B = \emptyset \implies P(A \cap B) = 0",
        "options": [
            "Mutually exclusive events cannot occur at the same time; non-mutually exclusive events can overlap",
            "Mutually exclusive events always have P(A) = 1; non-mutually exclusive events have P(A) = 0",
            "Mutually exclusive events apply to coins; non-mutually exclusive events apply to cards",
            "Mutually exclusive events are independent; non-mutually exclusive events are dependent"
        ],
        "correct": "Mutually exclusive events cannot occur at the same time; non-mutually exclusive events can overlap",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 15,
        "title": "Q15: State Addition Rule for mutually exclusive events.",
        "text": "State the Addition Rule for two mutually exclusive events: P(A ∪ B) = P(A) + P(B).",
        "formula": r"P(A \cup B) = P(A) + P(B) \quad (\text{since } P(A \cap B) = 0)",
        "options": [
            "P(A ∪ B) = P(A) + P(B)",
            "P(A ∪ B) = P(A) × P(B)",
            "P(A ∪ B) = P(A) / P(B)",
            "P(A ∪ B) = P(A) - P(B)"
        ],
        "correct": "P(A ∪ B) = P(A) + P(B)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 16,
        "title": "Q16: State General Addition Rule for any two events.",
        "text": "State the General Addition Rule for any two non-mutually exclusive events: P(A ∪ B) = P(A) + P(B) - P(A ∩ B).",
        "formula": r"P(A \cup B) = P(A) + P(B) - P(A \cap B)",
        "options": [
            "P(A ∪ B) = P(A) + P(B) - P(A ∩ B)",
            "P(A ∪ B) = P(A) + P(B) + P(A ∩ B)",
            "P(A ∪ B) = P(A) × P(B) - P(A ∩ B)",
            "P(A ∪ B) = [P(A) + P(B)] / P(A ∩ B)"
        ],
        "correct": "P(A ∪ B) = P(A) + P(B) - P(A ∩ B)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 17,
        "title": "Q17: Single card drawn - P(King or Queen).",
        "text": "A single card is drawn from a standard 52-card deck. Find the probability that the card is a King or a Queen.",
        "formula": r"P(K \cup Q) = P(K) + P(Q) = \frac{4}{52} + \frac{4}{52} = \frac{8}{52} = \frac{2}{13}",
        "options": [
            "2/13 (8/52)",
            "1/13 (4/52)",
            "4/13 (16/52)",
            "1/26 (2/52)"
        ],
        "correct": "2/13 (8/52)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 18,
        "title": "Q18: Single card drawn - P(Heart or Face card).",
        "text": "A single card is drawn from a 52-card deck. Find the probability that the card is a Heart or a Face card.",
        "formula": r"P(H \cup F) = P(H) + P(F) - P(H \cap F) = \frac{13}{52} + \frac{12}{52} - \frac{3}{52} = \frac{22}{52} = \frac{11}{26}",
        "options": [
            "11/26 (22/52)",
            "25/52",
            "19/52",
            "1/2 (26/52)"
        ],
        "correct": "11/26 (22/52)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 19,
        "title": "Q19: Student sports survey - P(basketball or volleyball).",
        "text": "In a class of 40 students, 24 play basketball, 18 play volleyball, and 10 play both sports. If a student is chosen at random, find the probability that the student plays basketball or volleyball.",
        "formula": r"P(B \cup V) = \frac{24 + 18 - 10}{40} = \frac{32}{40} = \frac{4}{5} = 0.80",
        "options": [
            "4/5 (32/40)",
            "21/20 (42/40)",
            "1/2 (20/40)",
            "3/4 (30/40)"
        ],
        "correct": "4/5 (32/40)",
        "show_image": 1,
        "image_url": "/images/g9_t160_q19.svg"
    },
    {
        "q_num": 20,
        "title": "Q20: Student sports survey - P(neither sport).",
        "text": "Using the data in Question 19 (40 students total, 32 play at least one sport), find the probability that a randomly chosen student plays neither sport.",
        "formula": r"P(\text{Neither}) = 1 - P(B \cup V) = 1 - \frac{32}{40} = \frac{8}{40} = \frac{1}{5} = 0.20",
        "options": [
            "1/5 (8/40)",
            "1/4 (10/40)",
            "2/5 (16/40)",
            "1/10 (4/40)"
        ],
        "correct": "1/5 (8/40)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 21,
        "title": "Q21: Define independent events and dependent events.",
        "text": "Define independent events and dependent events in probability.",
        "formula": r"\text{Independent} \iff P(A \cap B) = P(A) \cdot P(B)",
        "options": [
            "Independent events do not affect each other's occurrence; dependent events are affected by prior outcomes",
            "Independent events occur simultaneously; dependent events occur sequentially",
            "Independent events apply to dice; dependent events apply to coins",
            "Independent events have P = 0.50; dependent events have P = 1.00"
        ],
        "correct": "Independent events do not affect each other's occurrence; dependent events are affected by prior outcomes",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 22,
        "title": "Q22: State Multiplication Rule for independent events.",
        "text": "State the Multiplication Rule for two independent events: P(A ∩ B) = P(A) · P(B).",
        "formula": r"P(A \cap B) = P(A) \cdot P(B)",
        "options": [
            "P(A ∩ B) = P(A) · P(B)",
            "P(A ∩ B) = P(A) + P(B)",
            "P(A ∩ B) = P(A) / P(B)",
            "P(A ∩ B) = P(A) + P(B) - P(A ∪ B)"
        ],
        "correct": "P(A ∩ B) = P(A) · P(B)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 23,
        "title": "Q23: Coin flip and die roll - P(Tails and 6).",
        "text": "A fair coin is tossed and a fair six-sided die is rolled. Find the probability of getting Tails on the coin and a 6 on the die.",
        "formula": r"P(T \cap 6) = P(T) \times P(6) = \frac{1}{2} \times \frac{1}{6} = \frac{1}{12}",
        "options": [
            "1/12",
            "1/8",
            "2/3",
            "1/4"
        ],
        "correct": "1/12",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 24,
        "title": "Q24: Marbles drawn WITH replacement - P(Red then Red).",
        "text": "A bag contains 4 red marbles and 6 blue marbles (total 10). A marble is drawn, recorded, and replaced. A second marble is drawn. Find the probability that both marbles are red.",
        "formula": r"P(R_1 \cap R_2) = \frac{4}{10} \times \frac{4}{10} = \frac{16}{100} = \frac{4}{25}",
        "options": [
            "4/25 (16/100)",
            "2/15 (4/30)",
            "2/5 (4/10)",
            "1/5 (2/10)"
        ],
        "correct": "4/25 (16/100)",
        "show_image": 1,
        "image_url": "/images/g9_t160_q24.svg"
    },
    {
        "q_num": 25,
        "title": "Q25: State Multiplication Rule for dependent events.",
        "text": "State the Multiplication Rule for two dependent events: P(A ∩ B) = P(A) · P(B|A).",
        "formula": r"P(A \cap B) = P(A) \cdot P(B|A)",
        "options": [
            "P(A ∩ B) = P(A) · P(B|A)",
            "P(A ∩ B) = P(A) + P(B|A)",
            "P(A ∩ B) = P(A) / P(B|A)",
            "P(A ∩ B) = P(A|B) · P(B|A)"
        ],
        "correct": "P(A ∩ B) = P(A) · P(B|A)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 26,
        "title": "Q26: Marbles drawn WITHOUT replacement - P(Red then Red).",
        "text": "Referring to the bag in Question 24 (4 red, 6 blue), two marbles are drawn WITHOUT replacement. Find the probability that both marbles are red.",
        "formula": r"P(R_1 \cap R_2) = \frac{4}{10} \times \frac{3}{9} = \frac{12}{90} = \frac{2}{15}",
        "options": [
            "2/15 (12/90)",
            "4/25 (16/100)",
            "1/6 (15/90)",
            "3/10"
        ],
        "correct": "2/15 (12/90)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 27,
        "title": "Q27: Light bulbs drawn without replacement - P(at least 1 defective).",
        "text": "A box contains 8 good light bulbs and 2 defective light bulbs (total 10). If two bulbs are drawn at random without replacement, find the probability that at least one is defective.",
        "formula": r"P(\ge 1 \text{ Def}) = 1 - P(\text{Both Good}) = 1 - \frac{8}{10} \times \frac{7}{9} = 1 - \frac{56}{90} = \frac{34}{90} = \frac{17}{45}",
        "options": [
            "17/45 (34/90)",
            "28/45 (56/90)",
            "1/5 (18/90)",
            "4/9"
        ],
        "correct": "17/45 (34/90)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 28,
        "title": "Q28: 8-sector spinner probabilities.",
        "text": "A spinner is divided into 8 equal sectors numbered 1 through 8. Find the probability of spinning a multiple of 3.",
        "formula": r"E = \{3, 6\}, \quad P(\text{Multiple of 3}) = \frac{2}{8} = \frac{1}{4}",
        "options": [
            "1/4 (2/8)",
            "3/8",
            "1/2 (4/8)",
            "1/8"
        ],
        "correct": "1/4 (2/8)",
        "show_image": 1,
        "image_url": "/images/g9_t160_q28.svg"
    },
    {
        "q_num": 29,
        "title": "Q29: Lottery combinations calculation.",
        "text": "In a lottery, a player chooses 6 numbers from 1 to 42. Find the total number of possible ticket combinations C(42,6).",
        "formula": r"n(S) = \binom{42}{6} = \frac{42 \times 41 \times 40 \times 39 \times 38 \times 37}{6 \times 5 \times 4 \times 3 \times 2 \times 1} = 5,245,786",
        "options": [
            "5,245,786",
            "3,838,380",
            "7,059,052",
            "1,000,000"
        ],
        "correct": "5,245,786",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 30,
        "title": "Q30: Password probability - 3 letters followed by 2 digits.",
        "text": "A password consists of 3 uppercase letters followed by 2 digits. If repetition is allowed, what is the probability that a randomly generated password begins with 'ABC'?",
        "formula": r"n(S) = 26^3 \times 10^2 = 1,757,600, \quad n(E) = 100, \quad P = \frac{100}{1,757,600} = \frac{1}{17,576}",
        "options": [
            "1 / 17,576",
            "1 / 26,000",
            "1 / 1,757,600",
            "3 / 26"
        ],
        "correct": "1 / 17,576",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 31,
        "title": "Q31: Quality control independent tests probability.",
        "text": "A quality control test inspects electronic chips. The probability that a chip passes electrical test is 0.95, and the probability it passes thermal test is 0.90. Assuming independence, find the probability it passes both tests.",
        "formula": r"P(E \cap T) = 0.95 \times 0.90 = 0.855",
        "options": [
            "0.855 (85.5%)",
            "0.925 (92.5%)",
            "0.995 (99.5%)",
            "0.800 (80.0%)"
        ],
        "correct": "0.855 (85.5%)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 32,
        "title": "Q32: Medical clinic conditions - P(at least one condition).",
        "text": "In a medical clinic, 60% of patients have Condition A, 40% have Condition B, and 25% have both. Find the probability that a randomly selected patient has at least one of the conditions.",
        "formula": r"P(A \cup B) = 0.60 + 0.40 - 0.25 = 0.75",
        "options": [
            "0.75 (75%)",
            "1.00 (100%)",
            "0.65 (65%)",
            "0.50 (50%)"
        ],
        "correct": "0.75 (75%)",
        "show_image": 1,
        "image_url": "/images/g9_t160_q32.svg"
    },
    {
        "q_num": 33,
        "title": "Q33: Family with 3 children - P(2 girls and 1 boy).",
        "text": "Construct a tree diagram for a family with 3 children. What is the probability that the family has 2 girls and 1 boy?",
        "formula": r"S = \{GGG, GGB, GBG, GBB, BGG, BGB, BBG, BBB\}, \quad E = \{GGB, GBG, BGG\}, \quad P = \frac{3}{8}",
        "options": [
            "3/8",
            "1/4 (2/8)",
            "1/2 (4/8)",
            "5/8"
        ],
        "correct": "3/8",
        "show_image": 1,
        "image_url": "/images/g9_t160_q33.svg"
    },
    {
        "q_num": 34,
        "title": "Q34: Quiz guessing probability - 4 questions with 4 options.",
        "text": "A student takes a 4-question multiple-choice quiz where each question has 4 options. If the student guesses randomly on all questions, find the probability of getting all 4 questions correct.",
        "formula": r"P(\text{All 4}) = \left(\frac{1}{4}\right)^4 = \frac{1}{256}",
        "options": [
            "1/256",
            "1/64",
            "1/16",
            "4/256"
        ],
        "correct": "1/256",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 35,
        "title": "Q35: Quiz guessing probability - P(at least 1 correct).",
        "text": "Using Question 34 (4 questions, 4 options each), find the probability that the student gets at least one question correct when guessing randomly.",
        "formula": r"P(\ge 1) = 1 - P(\text{All Wrong}) = 1 - \left(\frac{3}{4}\right)^4 = 1 - \frac{81}{256} = \frac{175}{256}",
        "options": [
            "175/256",
            "81/256",
            "1/256",
            "3/4"
        ],
        "correct": "175/256",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 36,
        "title": "Q36: Two cards drawn WITHOUT replacement - P(two Aces).",
        "text": "Two cards are drawn from a standard 52-card deck WITHOUT replacement. Find the probability of drawing two Aces.",
        "formula": r"P(A_1 \cap A_2) = \frac{4}{52} \times \frac{3}{51} = \frac{12}{2652} = \frac{1}{221}",
        "options": [
            "1/221",
            "1/169",
            "4/663",
            "1/52"
        ],
        "correct": "1/221",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 37,
        "title": "Q37: Two cards drawn WITH replacement - P(two Aces).",
        "text": "Two cards are drawn from a 52-card deck WITH replacement. Find the probability of drawing two Aces.",
        "formula": r"P(A_1 \cap A_2) = \frac{4}{52} \times \frac{4}{52} = \frac{1}{13} \times \frac{1}{13} = \frac{1}{169}",
        "options": [
            "1/169",
            "1/221",
            "2/169",
            "1/13"
        ],
        "correct": "1/169",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 38,
        "title": "Q38: Candy selection without replacement - P(1 green and 1 yellow).",
        "text": "A jar contains 10 red, 15 green, and 25 yellow candies (total 50). If two candies are selected at random WITHOUT replacement, find the probability that one is green and one is yellow.",
        "formula": r"P(\text{Green, Yellow}) = 2 \times \left(\frac{15}{50} \times \frac{25}{49}\right) = \frac{750}{2450} = \frac{15}{49}",
        "options": [
            "15/49",
            "15/98",
            "3/10",
            "25/98"
        ],
        "correct": "15/49",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 39,
        "title": "Q39: Define conditional probability P(A|B) and state formula.",
        "text": "Explain what is meant by conditional probability P(A|B) and state its mathematical formula.",
        "formula": r"P(A|B) = \frac{P(A \cap B)}{P(B)}, \quad P(B) > 0",
        "options": [
            "P(A|B) = P(A ∩ B) / P(B), representing probability of A given that B has occurred",
            "P(A|B) = P(A) × P(B)",
            "P(A|B) = P(A) + P(B) - P(B|A)",
            "P(A|B) = P(B) / P(A)"
        ],
        "correct": "P(A|B) = P(A ∩ B) / P(B), representing probability of A given that B has occurred",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 40,
        "title": "Q40: Two-way contingency table - P(Product A given Woman).",
        "text": "A survey of 100 consumers: 45 prefer Product A (20 men, 25 women), 55 prefer Product B (30 men, 25 women). Find the probability that a randomly selected person prefers Product A given that the person is a woman.",
        "formula": r"P(A|\text{Woman}) = \frac{n(A \cap \text{Woman})}{n(\text{Woman})} = \frac{25}{50} = \frac{1}{2} = 0.50",
        "options": [
            "1/2 (25/50)",
            "1/4 (25/100)",
            "5/9 (25/45)",
            "9/20 (45/100)"
        ],
        "correct": "1/2 (25/50)",
        "show_image": 1,
        "image_url": "/images/g9_t160_q40.svg"
    },
    {
        "q_num": 41,
        "title": "Q41: Contingency table - P(Man given Product B).",
        "text": "Using the contingency table in Question 40 (Product B: 30 men, 25 women; total 55), find the probability that a selected person is a man given that the person prefers Product B.",
        "formula": r"P(\text{Man}|B) = \frac{n(\text{Man} \cap B)}{n(B)} = \frac{30}{55} = \frac{6}{11}",
        "options": [
            "6/11 (30/55)",
            "3/10 (30/100)",
            "3/5 (30/50)",
            "5/11 (25/55)"
        ],
        "correct": "6/11 (30/55)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 42,
        "title": "Q42: Given P(A)=0.4, P(B)=0.5, P(A∪B)=0.7, find P(A∩B) and independence.",
        "text": "If P(A) = 0.4, P(B) = 0.5, and P(A ∪ B) = 0.7, find P(A ∩ B) and determine if A and B are independent.",
        "formula": r"P(A \cap B) = 0.4 + 0.5 - 0.7 = 0.20, \quad P(A)P(B) = 0.4 \times 0.5 = 0.20 \implies \text{Independent}",
        "options": [
            "P(A ∩ B) = 0.20; Events A and B are independent because P(A ∩ B) = P(A)·P(B)",
            "P(A ∩ B) = 0.20; Events A and B are dependent because P(A ∩ B) > 0",
            "P(A ∩ B) = 0.10; Events A and B are independent",
            "P(A ∩ B) = 0.30; Events A and B are mutually exclusive"
        ],
        "correct": "P(A ∩ B) = 0.20; Events A and B are independent because P(A ∩ B) = P(A)·P(B)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 43,
        "title": "Q43: Mutually exclusive events - find P(A∪B) and P(A∩B).",
        "text": "If P(A) = 0.6 and P(B) = 0.3, and events A and B are mutually exclusive, find P(A ∪ B) and P(A ∩ B).",
        "formula": r"P(A \cup B) = 0.6 + 0.3 = 0.90, \quad P(A \cap B) = 0",
        "options": [
            "P(A ∪ B) = 0.90, P(A ∩ B) = 0",
            "P(A ∪ B) = 0.18, P(A ∩ B) = 0.18",
            "P(A ∪ B) = 0.72, P(A ∩ B) = 0.18",
            "P(A ∪ B) = 1.00, P(A ∩ B) = 0.30"
        ],
        "correct": "P(A ∪ B) = 0.90, P(A ∩ B) = 0",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 44,
        "title": "Q44: Explain why probability range is 0 to 1 (0% to 100%).",
        "text": "Explain why the probability of any event cannot be negative or greater than 100%.",
        "formula": r"0 \le n(E) \le n(S) \implies 0 \le \frac{n(E)}{n(S)} \le 1",
        "options": [
            "The number of favorable outcomes n(E) is bounded between 0 (empty set) and n(S) (total set)",
            "Probabilities above 100% are allowed only in sports statistics",
            "Negative probabilities occur when losses exceed gains",
            "Sample space size n(S) can be less than 0 in theoretical math"
        ],
        "correct": "The number of favorable outcomes n(E) is bounded between 0 (empty set) and n(S) (total set)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 45,
        "title": "Q45: Geometric probability - Dart thrown at square target with inscribed circle.",
        "text": "A dart is thrown at a square target of side 20 cm containing an inscribed circle of radius 10 cm. Find the geometric probability that the dart lands inside the circle.",
        "formula": r"P = \frac{\text{Area(Circle)}}{\text{Area(Square)}} = \frac{\pi \times 10^2}{20^2} = \frac{\pi}{4} \approx 0.7854",
        "options": [
            "π / 4 ≈ 0.7854 (78.54%)",
            "π / 2 ≈ 0.5708 (57.08%)",
            "1 / 2 = 0.5000 (50.00%)",
            "π / 8 ≈ 0.3927 (39.27%)"
        ],
        "correct": "π / 4 ≈ 0.7854 (78.54%)",
        "show_image": 1,
        "image_url": "/images/g9_t160_q45.svg"
    },
    {
        "q_num": 46,
        "title": "Q46: Dice double probability - rolling a double on two dice.",
        "text": "A board game requires a player to roll a double (same number on both dice) to get out of jail. Find the probability of rolling a double on a single turn.",
        "formula": r"E = \{(1,1),(2,2),(3,3),(4,4),(5,5),(6,6)\}, \quad P = \frac{6}{36} = \frac{1}{6}",
        "options": [
            "1/6",
            "1/36",
            "1/12",
            "1/3"
        ],
        "correct": "1/6",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 47,
        "title": "Q47: Probability of NOT rolling a double on 3 consecutive turns.",
        "text": "What is the probability of NOT rolling a double on three consecutive turns of rolling two fair dice?",
        "formula": r"P(\text{Not Double}) = \frac{5}{6}, \quad P(\text{Not Double 3 times}) = \left(\frac{5}{6}\right)^3 = \frac{125}{216} \approx 0.5787",
        "options": [
            "125/216 ≈ 0.5787",
            "1/216 ≈ 0.0046",
            "91/216 ≈ 0.4213",
            "5/18 ≈ 0.2778"
        ],
        "correct": "125/216 ≈ 0.5787",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 48,
        "title": "Q48: Sequential drawing without replacement - Red, White, Blue.",
        "text": "A bag contains 3 red, 4 white, and 5 blue balls (total 12). If three balls are drawn one by one WITHOUT replacement, find the probability of drawing Red, then White, then Blue in that exact order.",
        "formula": r"P(R_1 \cap W_2 \cap B_3) = \frac{3}{12} \times \frac{4}{11} \times \frac{5}{10} = \frac{60}{1320} = \frac{1}{22}",
        "options": [
            "1/22",
            "1/36",
            "3/110",
            "5/44"
        ],
        "correct": "1/22",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 49,
        "title": "Q49: Rain probability on both weekend days (independent events).",
        "text": "A weather forecaster states that the probability of rain on Saturday is 60% (0.60) and on Sunday is 70% (0.70). Assuming independence, find the probability that it rains on both days.",
        "formula": r"P(\text{Sat} \cap \text{Sun}) = 0.60 \times 0.70 = 0.42",
        "options": [
            "0.42 (42%)",
            "0.65 (65%)",
            "0.88 (88%)",
            "0.13 (13%)"
        ],
        "correct": "0.42 (42%)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 50,
        "title": "Q50: Rain probability on at least one day during the weekend.",
        "text": "Using Question 49 (Saturday rain = 0.60, Sunday rain = 0.70), find the probability that it rains on at least one day during the weekend.",
        "formula": r"P(\ge 1 \text{ rain}) = 1 - (0.40 \times 0.30) = 1 - 0.12 = 0.88",
        "options": [
            "0.88 (88%)",
            "0.42 (42%)",
            "0.90 (90%)",
            "0.70 (70%)"
        ],
        "correct": "0.88 (88%)",
        "show_image": 0,
        "image_url": None
    }
]

# Shuffle options deterministically using fixed random seed
random.seed(160)
pos_counts = {"A": 0, "B": 0, "C": 0, "D": 0}

for idx, q in enumerate(raw_questions):
    correct_text = q["correct"]
    opts = list(q["options"])
    random.shuffle(opts)
    q["options"] = opts
    
    correct_idx = opts.index(correct_text)
    pos_letter = ["A", "B", "C", "D"][correct_idx]
    pos_counts[pos_letter] += 1

print(f"Generated perfect data for T160. Option positions: {pos_counts}")

with open("scratch/t160_50_perfect_built.json", "w", encoding="utf-8") as f:
    json.dump(raw_questions, f, indent=2, ensure_ascii=False)

print("Saved scratch/t160_50_perfect_built.json")
