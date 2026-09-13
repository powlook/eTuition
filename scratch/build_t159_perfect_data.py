import json

# Complete 50 questions for Form 9 Topic T159: Misleading Data, Graphs, and Statistics in Media

questions_data = [
    {
        "q_num": 1,
        "title": "Q1: Define misleading data and explain why graphs in media can be misleading.",
        "text": "Define misleading data and explain why graphs and statistics in digital and print media can sometimes be misleading.",
        "formula": r"\text{Misleading Data} \implies \text{Data presented in a way that distorts reality or creates a false impression}",
        "options": [
            "Data presented in a way that creates a false impression or distorts the true reality",
            "Data that contains mathematical calculation errors only",
            "Graphs drawn using digital software rather than paper",
            "Data collected strictly from random population samples"
        ],
        "correct": "Data presented in a way that creates a false impression or distorts the true reality",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 2,
        "title": "Q2: Explain the visual effect of a truncated vertical axis on bar height comparisons.",
        "text": "Explain the visual effect of a truncated vertical axis (a graph that does not start at zero) on the comparison of bar heights.",
        "formula": r"\text{Relative Visual Height} = \frac{y - y_{\text{min}}}{y_{\text{max}} - y_{\text{min}}}",
        "options": [
            "It exaggerates small differences between categories by shrinking the baseline",
            "It makes all bars appear completely equal in height",
            "It automatically corrects for sampling bias in the dataset",
            "It reduces the visual height difference between high and low bars"
        ],
        "correct": "It exaggerates small differences between categories by shrinking the baseline",
        "show_image": 1,
        "image_url": "/images/g9_t159_q2.svg"
    },
    {
        "q_num": 3,
        "title": "Q3: Calculate visual distortion ratio of a truncated bar graph.",
        "text": "A company reports sales growth: Year 1 = ₱100M, Year 2 = ₱105M. A bar graph starts the y-axis at ₱95M. By what visual factor does Year 2's bar appear taller than Year 1's bar on this truncated graph?",
        "formula": r"\text{Visual Height Ratio} = \frac{105 - 95}{100 - 95} = \frac{10}{5} = 2",
        "options": [
            "2 times as tall (100% visual increase despite actual growth of only 5%)",
            "1.05 times as tall (5% visual increase matching actual growth)",
            "5 times as tall (400% visual increase)",
            "10 times as tall (900% visual increase)"
        ],
        "correct": "2 times as tall (100% visual increase despite actual growth of only 5%)",
        "show_image": 1,
        "image_url": "/images/g9_t159_q3.svg"
    },
    {
        "q_num": 4,
        "title": "Q4: Explain how altering scale intervals on line graphs distorts trend steepness.",
        "text": "Explain how altering the scale intervals on the horizontal or vertical axis of a line graph can make a gentle trend look drastically steep.",
        "formula": r"\text{Perceived Slope} = \frac{\Delta y \times \text{y-scale}}{\Delta x \times \text{x-scale}}",
        "options": [
            "Compressing the horizontal scale or stretching the vertical scale increases the slope visually",
            "Expanding the horizontal scale makes gentle slopes appear steeper",
            "Changing axis scales alters the actual mathematical data points",
            "Starting the axis at zero always maximizes the visual steepness"
        ],
        "correct": "Compressing the horizontal scale or stretching the vertical scale increases the slope visually",
        "show_image": 1,
        "image_url": "/images/g9_t159_q4.svg"
    },
    {
        "q_num": 5,
        "title": "Q5: Explain why 3D pie charts distort visual proportions of data slices.",
        "text": "Explain why 3D pie charts and 3D bar graphs often distort the visual proportion of data slices.",
        "formula": r"\text{Perceived 3D Area} \propto \text{Perspective Distance} + \text{Tilted Surface Angle}",
        "options": [
            "Slices in the foreground appear artificially larger than background slices due to 3D perspective tilt",
            "3D pie charts automatically round percentages to the nearest ten",
            "Slices in the background are always rendered with darker shadow colors",
            "3D graphs eliminate angle distortion by adding depth"
        ],
        "correct": "Slices in the foreground appear artificially larger than background slices due to 3D perspective tilt",
        "show_image": 1,
        "image_url": "/images/g9_t159_q5.svg"
    },
    {
        "q_num": 6,
        "title": "Q6: Describe the distortion created when pictograms scale height and width proportionally.",
        "text": "Describe the distortion created when pictograms scale both the width and height of an icon proportionally instead of using stacked equal-sized icons.",
        "formula": r"\text{Area Factor} = k^2, \quad \text{Volume Factor} = k^3",
        "options": [
            "Scaling height and width by factor k increases the visual area by k^2, visually overrepresenting the increase",
            "Scaling height and width by factor k keeps the visual area exactly equal to k times original",
            "Proportional scaling shrinks the visual area compared to the numerical data",
            "Pictograms with scaled dimensions prevent readers from misinterpreting trends"
        ],
        "correct": "Scaling height and width by factor k increases the visual area by k^2, visually overrepresenting the increase",
        "show_image": 1,
        "image_url": "/images/g9_t159_q6.svg"
    },
    {
        "q_num": 7,
        "title": "Q7: Calculate the actual area increase factor when a pictogram icon's dimensions double.",
        "text": "A pictogram doubles both the height and width of a money bag icon to represent a 2-fold (100%) increase in donations. By what factor did the area of the icon actually increase?",
        "formula": r"\text{Area Ratio} = 2 \times 2 = 4",
        "options": [
            "4-fold increase (300% area increase)",
            "2-fold increase (100% area increase)",
            "8-fold increase (700% area increase)",
            "3-fold increase (200% area increase)"
        ],
        "correct": "4-fold increase (300% area increase)",
        "show_image": 1,
        "image_url": "/images/g9_t159_q7.svg"
    },
    {
        "q_num": 8,
        "title": "Q8: Explain the statistical difference between correlation and causation.",
        "text": "Explain the statistical difference between correlation and causation, and give an example of how media headlines might falsely imply causation.",
        "formula": r"\text{Correlation} \neq \text{Causation} \quad (r > 0 \;\not\implies\; A \to B)",
        "options": [
            "Correlation indicates two variables move together; causation means one directly causes the other",
            "Correlation proves a direct cause-and-effect relationship between two variables",
            "Causation applies only to negative relationships, while correlation applies to positive ones",
            "Correlation and causation are mathematically identical terms in statistics"
        ],
        "correct": "Correlation indicates two variables move together; causation means one directly causes the other",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 9,
        "title": "Q9: Define selective data presentation (cherry-picking) in media reports.",
        "text": "What is selective data presentation (cherry-picking) and how does it mislead the public in financial or climate reports?",
        "formula": r"\text{Cherry Picking} \implies \text{Selecting data supporting a bias while ignoring contradicting evidence}",
        "options": [
            "Highlighting specific data subsets that support a conclusion while deliberately omitting contradicting data",
            "Collecting data from every single member of a population",
            "Rounding numerical data to two decimal places in public summaries",
            "Displaying raw data without any graphs or charts"
        ],
        "correct": "Highlighting specific data subsets that support a conclusion while deliberately omitting contradicting data",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 10,
        "title": "Q10: Analyze why advertising claims like '200% better' are ambiguous.",
        "text": "A company advertises that 'Our product is 200% better than the leading competitor!' Explain why this claim is ambiguous and misleading without defined metrics.",
        "formula": r"\text{Ambiguous Claim} \implies \text{Undefined baseline, metric, or measurement standard}",
        "options": [
            "It lacks a specific measurable metric, baseline comparison group, and standardized testing criteria",
            "Percentages above 100% are mathematically impossible in advertising",
            "Competitors are legally required to review all advertisement claims before publication",
            "The word 'better' is always interpreted as price reduction in consumer studies"
        ],
        "correct": "It lacks a specific measurable metric, baseline comparison group, and standardized testing criteria",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 11,
        "title": "Q11: Explain why the mean can give a misleading impression of typical income.",
        "text": "Explain how using the Mean instead of the Median can give a misleading impression of the 'typical' salary in a company with severe executive income inequality.",
        "formula": r"\text{Mean} = \frac{\sum x_i}{n} \quad (\text{Sensitive to extreme high outliers})",
        "options": [
            "The mean is pulled significantly upward by a few extreme high salaries, inflating the 'typical' figure",
            "The median is always higher than the mean in skewed datasets",
            "The mean excludes executive salaries from the calculation completely",
            "The median cannot be calculated when salary values vary widely"
        ],
        "correct": "The mean is pulled significantly upward by a few extreme high salaries, inflating the 'typical' figure",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 12,
        "title": "Q12: Identify sampling bias in a luxury location survey.",
        "text": "In a survey of 20 people outside a luxury golf club, 18 reported owning two or more cars. Explain why generalizing this result to the entire city population is an example of sampling bias.",
        "formula": r"\text{Sampling Bias} \implies \text{Non-random sample unrepresentative of general population}",
        "options": [
            "The sample is taken from a specific wealthy location and does not represent the demographic diversity of the city",
            "The sample size of 20 is too large to draw meaningful statistical conclusions",
            "Survey questions about vehicle ownership are illegal in municipal research",
            "Golf club members are required to answer surveys falsely"
        ],
        "correct": "The sample is taken from a specific wealthy location and does not represent the demographic diversity of the city",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 13,
        "title": "Q13: Explain how loaded or leading survey questions bias responses.",
        "text": "Explain how the wording of a survey question (loaded or leading question) can bias respondents' answers.",
        "formula": r"\text{Leading Question} \implies \text{Prompt phrasing sways response toward a specific outcome}",
        "options": [
            "Phrasing questions with emotionally charged language or subtle cues encourages respondents to select a favored answer",
            "Short questions always produce lower response accuracy than long questions",
            "Survey questions with multiple-choice options eliminate all forms of response bias",
            "Leading questions force respondents to submit anonymous answers"
        ],
        "correct": "Phrasing questions with emotionally charged language or subtle cues encourages respondents to select a favored answer",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 14,
        "title": "Q14: Identify misleading technique when a top-performing brand is omitted from a chart.",
        "text": "A graph comparing four smartphone brands omits Brand C which has higher customer satisfaction ratings. What type of misleading technique is this?",
        "formula": r"\text{Omission of Data} \implies \text{Selective exclusion of competing categories}",
        "options": [
            "Selective omission of data (cherry-picking categories)",
            "Truncated axis manipulation",
            "Dual-axis scale inflation",
            "Simpson's paradox distortion"
        ],
        "correct": "Selective omission of data (cherry-picking categories)",
        "show_image": 1,
        "image_url": "/images/g9_t159_q14.svg"
    },
    {
        "q_num": 15,
        "title": "Q15: Explain why percentage changes can be misleading with small baselines.",
        "text": "Explain why percentage changes can be misleading when the baseline (original value) is very small.",
        "formula": r"\% \text{ Increase} = \frac{\Delta x}{x_{\text{initial}}} \times 100\%",
        "options": [
            "A large percentage increase can correspond to a tiny absolute numerical change when starting from a small baseline",
            "Percentage changes cannot be calculated if the initial value is less than 10",
            "Small baselines automatically reduce the reported percentage change",
            "Absolute changes are always larger than percentage changes"
        ],
        "correct": "A large percentage increase can correspond to a tiny absolute numerical change when starting from a small baseline",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 16,
        "title": "Q16: Explain the misleading aspect of small sample sizes in clinical claims.",
        "text": "A health supplement advertisement claims: 'In a clinical study, 100% of participants lost weight!' Fine print reveals there were only 3 participants. Explain the misleading aspect of small sample sizes.",
        "formula": r"\text{Margin of Error} \propto \frac{1}{\sqrt{n}}",
        "options": [
            "Small sample sizes have high random variance and cannot be generalized to larger populations",
            "100% success rates can only occur in studies with over 1,000 participants",
            "Small sample sizes make statistical calculations mathematically invalid",
            "Weight loss trials are legally required to use at least 50 participants"
        ],
        "correct": "Small sample sizes have high random variance and cannot be generalized to larger populations",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 17,
        "title": "Q17: Explain how omitting clear legend and axis labels makes graphs unreliable.",
        "text": "Explain how the omission of a clear legend, axis labels, or units of measurement makes a graphical display unreliable.",
        "formula": r"\text{Graph Integrity} \implies \text{Explicit axes, units, labels, and source}",
        "options": [
            "Without units and labels, readers cannot assess the magnitude, baseline, or context of the data being presented",
            "Omitting axis labels allows readers to calculate exact values more easily",
            "Graphs without legends are automatically classified as 3D charts",
            "Units of measurement are only required for financial data, not general science"
        ],
        "correct": "Without units and labels, readers cannot assess the magnitude, baseline, or context of the data being presented",
        "show_image": 1,
        "image_url": "/images/g9_t159_q17.svg"
    },
    {
        "q_num": 18,
        "title": "Q18: Analyze how dual-axis scale manipulation creates false relationship impressions.",
        "text": "Analyze a dual-axis line graph where two different scales are used: how can manipulating the second vertical axis create a false visual impression of a close relationship?",
        "formula": r"\text{Visual Overlap} \implies \text{Arbitrary choice of dual y-axis scales}",
        "options": [
            "Scaling the second y-axis arbitrarily can force two completely unrelated lines to visually track or cross each other",
            "Dual-axis graphs automatically convert correlation values into percentages",
            "Using two y-axes forces both variables to have identical means",
            "Dual axes can only be used when both variables are measured in dollars"
        ],
        "correct": "Scaling the second y-axis arbitrarily can force two completely unrelated lines to visually track or cross each other",
        "show_image": 1,
        "image_url": "/images/g9_t159_q18.svg"
    },
    {
        "q_num": 19,
        "title": "Q19: Describe the concept of survivorship bias in data analysis.",
        "text": "Describe the concept of 'survivorship bias' in data analysis with an example from business or academics.",
        "formula": r"\text{Survivorship Bias} \implies \text{Focusing only on successful cases while ignoring failures that dropped out}",
        "options": [
            "Analyzing only successful subjects or entities that survived a selection process while ignoring those that failed",
            "Selecting participants based solely on age and geographic location",
            "Including dead or inactive data points to skew the sample mean downward",
            "Comparing current statistics against historical data from 100 years ago"
        ],
        "correct": "Analyzing only successful subjects or entities that survived a selection process while ignoring those that failed",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 20,
        "title": "Q20: Identify error in a pie chart whose percentages sum to 128%.",
        "text": "A news broadcast displays a pie chart whose sector percentages sum up to 128%. What error has been made and what does it indicate about the data?",
        "formula": r"\sum \text{Sector } \% = 100\%",
        "options": [
            "The data allows multiple selections or contains calculation errors, making a single pie chart invalid",
            "The chart uses a 3D perspective transform that adds 28% to the baseline",
            "Sector percentages in pie charts are allowed to sum up to 200% in polling",
            "The pie chart was generated using logarithmic scaling"
        ],
        "correct": "The data allows multiple selections or contains calculation errors, making a single pie chart invalid",
        "show_image": 1,
        "image_url": "/images/g9_t159_q20.svg"
    },
    {
        "q_num": 21,
        "title": "Q21: Explain how cumulative frequency graphs mask declining quarterly gains.",
        "text": "Explain how cumulative frequency graphs can give the false impression of continuous rapid growth even when quarterly gains are decreasing.",
        "formula": r"F_{\text{cum}}(t) = \sum_{i=1}^t f_i \quad (F_{\text{cum}} \text{ is monotonically non-decreasing})",
        "options": [
            "Cumulative totals always go up or stay flat, masking severe declines in period-by-period additions",
            "Cumulative frequency graphs automatically subtract negative quarterly results",
            "The slope of a cumulative graph equals the total average of all historical periods",
            "Cumulative graphs double the visual scale of every new data point"
        ],
        "correct": "Cumulative totals always go up or stay flat, masking severe declines in period-by-period additions",
        "show_image": 1,
        "image_url": "/images/g9_t159_q21.svg"
    },
    {
        "q_num": 22,
        "title": "Q22: Analyze why presenting relative risk reduction without absolute risk is misleading.",
        "text": "Analyze why presenting only relative risk reduction (e.g., '50% reduction in disease risk') without stating absolute risk (e.g., from 2 in 10,000 to 1 in 10,000) can mislead patients.",
        "formula": r"\text{Relative Risk Reduction} = \frac{\text{Absolute Risk Drop}}{\text{Baseline Risk}} = \frac{0.0001}{0.0002} = 50\%",
        "options": [
            "A 50% relative drop sounds dramatic even when the absolute risk decrease is extremely small (0.01%)",
            "Relative risk reduction is always smaller than absolute risk reduction",
            "Absolute risk cannot be measured accurately in medical trials",
            "Relative risk applies only when baseline risk exceeds 50%"
        ],
        "correct": "A 50% relative drop sounds dramatic even when the absolute risk decrease is extremely small (0.01%)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 23,
        "title": "Q23: Identify omitted statistical context in '9 out of 10 dentists' claims.",
        "text": "A company publishes an infographic showing that '9 out of 10 dentists recommend our toothpaste.' What critical statistical information is omitted?",
        "formula": r"\text{Survey Context} \implies \text{Sample size, question choices, and competitor inclusions}",
        "options": [
            "Sample size, selection method, survey question wording, and whether dentists could recommend multiple brands",
            "The exact brand of toothbrush used during the clinical test",
            "The chemical formula and pH level of the toothpaste",
            "The geographic coordinates of all surveyed dental clinics"
        ],
        "correct": "Sample size, selection method, survey question wording, and whether dentists could recommend multiple brands",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 24,
        "title": "Q24: Explain how non-uniform interval binning distorts histogram shape.",
        "text": "Explain how non-uniform interval binning in a histogram can distort the visual distribution of test scores.",
        "formula": r"\text{Bar Area} = \text{Width} \times \text{Frequency Density}",
        "options": [
            "Using unequal bin widths without adjusting bar heights for frequency density distorts the visual area and shape",
            "Histograms must always use exactly 10 bins regardless of dataset size",
            "Non-uniform bins automatically convert score counts into medians",
            "Changing bin widths removes outliers from the dataset completely"
        ],
        "correct": "Using unequal bin widths without adjusting bar heights for frequency density distorts the visual area and shape",
        "show_image": 1,
        "image_url": "/images/g9_t159_q24.svg"
    },
    {
        "q_num": 25,
        "title": "Q25: Describe how self-selection bias in online polls creates unrepresentative data.",
        "text": "Describe how self-selection bias (voluntary response bias) in online polls produces unrepresentative data.",
        "formula": r"\text{Voluntary Response} \implies \text{Over-representation of individuals with strong opinions}",
        "options": [
            "People with strong or extreme opinions are far more likely to participate voluntarily than neutral individuals",
            "Online polls automatically block respondents under 18 years of age",
            "Voluntary polls result in perfectly balanced random samples of the population",
            "Self-selection bias occurs only when polls charge a participation fee"
        ],
        "correct": "People with strong or extreme opinions are far more likely to participate voluntarily than neutral individuals",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 26,
        "title": "Q26: Identify the lurking variable in ice cream vs drowning correlation.",
        "text": "A graph shows ice cream sales and drowning incidents both rising during June-August. Explain the lurking variable (confounding variable) responsible for this correlation.",
        "formula": r"\text{Confounding Variable} \implies z \text{ causes both } x \text{ and } y \quad (\text{Summer Temperature})",
        "options": [
            "Summer temperature (warm weather increases both ice cream consumption and swimming activity)",
            "Increased sugar levels in ice cream causing muscle cramps while swimming",
            "Misleading y-axis truncation on the ice cream sales graph",
            "Sampling bias caused by surveying lifeguards only"
        ],
        "correct": "Summer temperature (warm weather increases both ice cream consumption and swimming activity)",
        "show_image": 1,
        "image_url": "/images/g9_t159_q26.svg"
    },
    {
        "q_num": 27,
        "title": "Q27: Explain the importance of checking data sources and publisher funding.",
        "text": "Explain the importance of checking the data source, publisher funding, and publication date when evaluating media infographics.",
        "formula": r"\text{Source Credibility} \implies \text{Objectivity, Funding Independence, and Currency}",
        "options": [
            "Conflicts of interest, sponsor bias, or outdated context can skew how data is collected, interpreted, and shown",
            "Published infographics are legally mandated to be 100% unbiased",
            "Data sources older than 1 year are mathematically invalid in statistics",
            "Funding sources affect only table formatting, not graph scales"
        ],
        "correct": "Conflicts of interest, sponsor bias, or outdated context can skew how data is collected, interpreted, and shown",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 28,
        "title": "Q28: Analyze why bar widths must remain identical in bar graphs.",
        "text": "Analyze a bar chart where bar widths vary in size. Why must bar widths always remain identical in legitimate bar graphs?",
        "formula": r"\text{Visual Weight} \propto \text{Bar Area} = \text{Width} \times \text{Height}",
        "options": [
            "Varying bar widths alters the visual area of the bars, misleading viewers into misjudging category quantities",
            "Wider bars represent higher statistical confidence intervals",
            "Bar width represents the sample size in all standardized bar charts",
            "Varying bar widths is required when plotting qualitative variables"
        ],
        "correct": "Varying bar widths alters the visual area of the bars, misleading viewers into misjudging category quantities",
        "show_image": 1,
        "image_url": "/images/g9_t159_q28.svg"
    },
    {
        "q_num": 29,
        "title": "Q29: Explain how timeframe manipulation misleads stock market investors.",
        "text": "A stock chart shows a company's stock price over only the last 3 days showing a sharp upward spike, ignoring the previous 6-month downward plunge. How does timeframe manipulation mislead investors?",
        "formula": r"\text{Timeframe Manipulation} \implies \text{Truncating time horizon to hide long-term trend}",
        "options": [
            "Zooming in on a brief window creates a false impression of growth while concealing the true overall decline",
            "Short timeframes automatically double the calculated rate of return",
            "Stock charts are required by law to show a maximum of 3 days of trading data",
            "Looking at shorter timeframes eliminates market volatility"
        ],
        "correct": "Zooming in on a brief window creates a false impression of growth while concealing the true overall decline",
        "show_image": 1,
        "image_url": "/images/g9_t159_q29.svg"
    },
    {
        "q_num": 30,
        "title": "Q30: Describe how cherry-picked start and end dates reverse apparent economic trends.",
        "text": "Describe how cherry-picked start and end dates on economic trend lines can completely reverse the apparent trajectory of unemployment rates.",
        "formula": r"\text{Trend Direction} = \text{sign}(y_{\text{end}} - y_{\text{start}})",
        "options": [
            "Selecting peak or trough endpoints selectively changes whether the net slope appears positive or negative",
            "Changing start dates alters the underlying monthly unemployment data values",
            "Economic trend lines must always start at the beginning of a calendar year",
            "Cherry-picking dates only affects bar graphs, not line graphs"
        ],
        "correct": "Selecting peak or trough endpoints selectively changes whether the net slope appears positive or negative",
        "show_image": 1,
        "image_url": "/images/g9_t159_q30.svg"
    },
    {
        "q_num": 31,
        "title": "Q31: Explain the importance of reporting margin of error in political polls.",
        "text": "Explain what margin of error is in political opinion polls and why failing to report it misleads the public about close elections.",
        "formula": r"\text{Poll Result} = \hat{p} \pm \text{MOE}",
        "options": [
            "MOE defines the confidence range; without it, a statistical tie (e.g., 49% vs 51% with ±3% MOE) is misreported as a definitive lead",
            "Margin of error represents the percentage of undecided voters in a survey",
            "MOE guarantees that poll predictions will be 100% accurate on election day",
            "Reporting margin of error is only necessary when candidate preferences exceed 60%"
        ],
        "correct": "MOE defines the confidence range; without it, a statistical tie (e.g., 49% vs 51% with ±3% MOE) is misreported as a definitive lead",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 32,
        "title": "Q32: Analyze why headlines like 'Crime rate doubles!' can be sensationalized.",
        "text": "A headline reads: 'Crime rate doubles!' The underlying data shows crime incidents increased from 1 case per 100,000 to 2 cases per 100,000. Explain why this presentation is sensationalized.",
        "formula": r"\text{Absolute Difference} = 2 - 1 = 1 \text{ per } 100,000 \quad (0.001\%)",
        "options": [
            "Reporting 'doubled' emphasizes relative change while masking that the absolute incidence remains extremely rare (0.001%)",
            "Increases from 1 to 2 cases cannot be expressed as percentages in statistics",
            "The headline is inaccurate because doubling means increasing by a factor of 4",
            "Municipalities measure crime rates per million, not per 100,000"
        ],
        "correct": "Reporting 'doubled' emphasizes relative change while masking that the absolute incidence remains extremely rare (0.001%)",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 33,
        "title": "Q33: Explain why pie charts are invalid for multi-select survey questions.",
        "text": "Explain why a circle graph (pie chart) is inappropriate for displaying survey data where respondents could select multiple options.",
        "formula": r"\sum \text{Percentages} > 100\% \implies \text{Pie Chart Invalid}",
        "options": [
            "Multiple-choice responses result in total percentages exceeding 100%, breaking pie chart sector geometry",
            "Circle graphs can only display data with at most 3 categories",
            "Multiple selections cause pie chart colors to overlap on screen",
            "Respondents cannot answer survey questions if pie charts are used"
        ],
        "correct": "Multiple-choice responses result in total percentages exceeding 100%, breaking pie chart sector geometry",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 34,
        "title": "Q34: How color choice in data visualization emotionally manipulates readers.",
        "text": "How can color choice in data visualization (e.g., using alarming bright red for small negative changes) emotionally manipulate reader interpretation?",
        "formula": r"\text{Visual Color Bias} \implies \text{Using high-contrast or alarming hues to trigger emotional reactions}",
        "options": [
            "Bright or contrasting colors evoke emotional responses that exaggerate minor data fluctuations beyond their statistical weight",
            "Red color fill automatically reduces the numerical accuracy of axis scales",
            "Color choice has no visual impact on how graphs are perceived by audiences",
            "Scientific guidelines mandate that all negative values be colored red"
        ],
        "correct": "Bright or contrasting colors evoke emotional responses that exaggerate minor data fluctuations beyond their statistical weight",
        "show_image": 1,
        "image_url": "/images/g9_t159_q34.svg"
    },
    {
        "q_num": 35,
        "title": "Q35: Explain how an inverted y-axis misleads viewers about data trends.",
        "text": "Explain how an inverted y-axis (where zero is at the top and larger values are at the bottom) can mislead viewers about trends.",
        "formula": r"\text{Inverted Axis} \implies \text{Upward visual slope corresponds to decreasing numerical value}",
        "options": [
            "Downward visual movement represents increasing numbers, causing readers to mistake an increase for a decrease",
            "Inverted axes make all line graphs appear perfectly flat",
            "Inverted axes are standard format for financial earnings charts",
            "Readers automatically invert their perspective when reading inverted axes"
        ],
        "correct": "Downward visual movement represents increasing numbers, causing readers to mistake an increase for a decrease",
        "show_image": 1,
        "image_url": "/images/g9_t159_q35.svg"
    },
    {
        "q_num": 36,
        "title": "Q36: Explain how improperly removing outliers misleads research conclusions.",
        "text": "Describe the difference between an outlier and a pattern in data, and explain how improperly removing outliers can mislead research conclusions.",
        "formula": r"\text{Outlier Exclusion} \implies \text{Artificially reducing variance or hiding genuine phenomena}",
        "options": [
            "Removing valid outliers artificially reduces sample variance and can hide real extreme events or flaws",
            "Outliers are mathematical calculation mistakes that must always be deleted before graphing",
            "Patterns occur only when all data points fall on a straight line",
            "Removing outliers increases the margin of error of the dataset"
        ],
        "correct": "Removing valid outliers artificially reduces sample variance and can hide real extreme events or flaws",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 37,
        "title": "Q37: Explain how Simpson's Paradox reverses sub-group trends upon aggregation.",
        "text": "Explain how Simpson's Paradox occurs, where a trend appears in several sub-groups of data but disappears or reverses when the groups are aggregated.",
        "formula": r"\text{Simpson's Paradox} \implies \text{Aggregation flips sub-group trend due to confounding weights}",
        "options": [
            "Confounding variables and unequal group sizes cause aggregated data to show the opposite trend of individual sub-groups",
            "Simpson's paradox occurs when pie chart sectors sum to less than 90 degrees",
            "Sub-group analysis always produces identical trends to aggregated totals",
            "Simpson's paradox is a visual illusion caused by truncated bar graphs"
        ],
        "correct": "Confounding variables and unequal group sizes cause aggregated data to show the opposite trend of individual sub-groups",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 38,
        "title": "Q38: Identify confounding variables in observational sleep claims.",
        "text": "A social media ad states: 'Users of App X sleep 2 hours more on average than non-users.' Identify potential confounding variables not accounted for in this observational claim.",
        "formula": r"\text{Observational Correlation} \neq \text{Controlled Trial}",
        "options": [
            "User demographics, lifestyle habits, work schedules, and baseline health differences between app users and non-users",
            "Screen brightness settings and phone battery capacity",
            "The digital font size used in App X's settings menu",
            "The country of manufacture of the smartphone hardware"
        ],
        "correct": "User demographics, lifestyle habits, work schedules, and baseline health differences between app users and non-users",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 39,
        "title": "Q39: Explain the role of peer review and independent replication.",
        "text": "Explain the role of peer review and independent replication in preventing misleading data dissemination in scientific publications.",
        "formula": r"\text{Scientific Integrity} \implies \text{Peer Review} + \text{Independent Replication}",
        "options": [
            "Independent experts evaluate methodology, statistical validity, and ensure conclusions are supported by evidence before publication",
            "Peer review guarantees that published scientific findings will never be revised in the future",
            "Peer review is conducted exclusively by government regulatory agencies",
            "Independent replication eliminates the need for sample size calculations"
        ],
        "correct": "Independent experts evaluate methodology, statistical validity, and ensure conclusions are supported by evidence before publication",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 40,
        "title": "Q40: Identify visual flaw in equal spacing of irregular time intervals.",
        "text": "Identify the visual flaw in a line graph where the horizontal time axis uses equal spacing between data points collected at irregular time intervals (e.g., Day 1, Day 2, Day 10, Day 30).",
        "formula": r"\Delta x_{\text{visual}} = \text{const} \neq \Delta t_{\text{actual}}",
        "options": [
            "Equal spacing distorts time intervals, making slow changes appear rapid or sudden shifts appear gradual",
            "Irregular time intervals automatically invert the vertical y-axis",
            "Line graphs cannot be drawn if time intervals are greater than 7 days",
            "Horizontal axis labels must always be written in vertical orientation"
        ],
        "correct": "Equal spacing distorts time intervals, making slow changes appear rapid or sudden shifts appear gradual",
        "show_image": 1,
        "image_url": "/images/g9_t159_q40.svg"
    },
    {
        "q_num": 41,
        "title": "Q41: Explain why reporting the mode can be misleading in dispersed datasets.",
        "text": "Explain why reporting the mode can be misleading when the modal value occurs only slightly more often than other values in a widely dispersed dataset.",
        "formula": r"\text{Mode} = \arg\max f(x_i)",
        "options": [
            "The mode may represent a small fraction of total data and fail to reflect the central tendency or spread of the distribution",
            "The mode is always larger than both the mean and median in dispersed datasets",
            "Mode calculations are invalid for numerical datasets with more than 15 entries",
            "Reporting the mode excludes all prime numbers from statistical analysis"
        ],
        "correct": "The mode may represent a small fraction of total data and fail to reflect the central tendency or spread of the distribution",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 42,
        "title": "Q42: Calculate actual count from percentage claim and evaluate sample size.",
        "text": "A beauty brand claims '84% of 50 women saw fewer wrinkles.' Calculate the actual number of women who agreed and discuss the statistical validity of the sample size.",
        "formula": r"N = 0.84 \times 50 = 42",
        "options": [
            "Exactly 42 women agreed; 50 participants is a very small sample with high uncertainty for broad population claims",
            "Exactly 84 women agreed; a sample of 50 is statistically ideal for nationwide claims",
            "Exactly 34 women agreed; small sample sizes automatically increase study validity",
            "Exactly 48 women agreed; sample size has no impact on percentage accuracy"
        ],
        "correct": "Exactly 42 women agreed; 50 participants is a very small sample with high uncertainty for broad population claims",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 43,
        "title": "Q43: Explain how vertical axis scaling in clustered columns minimizes competitor gaps.",
        "text": "How can a clustered column chart be designed to deceptively minimize the apparent difference between two competitors?",
        "formula": r"\text{Visual Difference} \propto \frac{\Delta y}{y_{\text{max}}}",
        "options": [
            "Setting an excessively large vertical axis scale compresses column height differences into visually negligible amounts",
            "Placing bars far apart from each other exaggerates height differences",
            "Using dark background colors shrinks column height visually",
            "Labeling columns with percentage values removes visual scaling effects"
        ],
        "correct": "Setting an excessively large vertical axis scale compresses column height differences into visually negligible amounts",
        "show_image": 1,
        "image_url": "/images/g9_t159_q43.svg"
    },
    {
        "q_num": 44,
        "title": "Q44: Explain how cherry-picking sub-groups (p-hacking) creates false efficacy claims.",
        "text": "Explain how cherry-picking sub-groups from a larger failed clinical trial (data dredging / p-hacking) creates misleading claims of product efficacy.",
        "formula": r"\text{P-Hacking} \implies \text{Testing multiple sub-hypotheses until a random false positive } (p < 0.05) \text{ emerges}",
        "options": [
            "Testing numerous sub-groups increases the likelihood of finding a random false-positive result by chance",
            "Cherry-picking sub-groups lowers the overall margin of error of the trial",
            "Clinical trial sub-groups are legally required to report 100% positive outcomes",
            "Data dredging increases the statistical power of the overall trial"
        ],
        "correct": "Testing numerous sub-groups increases the likelihood of finding a random false-positive result by chance",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 45,
        "title": "Q45: Formulate critical evaluation questions for media statistical claims.",
        "text": "What questions should a critical consumer ask when encountering a dramatic statistical claim on social media?",
        "formula": r"\text{Critical Evaluation} \implies \text{Source, Sample Size, Axes Baseline, Absolute vs Relative, Funding}",
        "options": [
            "What is the sample size, who funded the study, is the graph axis truncated, and is absolute risk reported?",
            "What font style was used, how many shares does the post have, and is the chart background blue?",
            "Was the claim posted by a verified account, and does it contain 3D graphic animations?",
            "Does the chart use more than 5 distinct colors, and was it published on a weekend?"
        ],
        "correct": "What is the sample size, who funded the study, is the graph axis truncated, and is absolute risk reported?",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 46,
        "title": "Q46: Explain why area-based shapes (silhouettes/circles) mislead readers in infographics.",
        "text": "Explain why infographics that replace bar graphs with area-based shapes (like circles or human silhouettes) frequently mislead readers.",
        "formula": r"\text{Visual Perception} \implies \text{Area scales quadratically } (r^2), \text{ exaggerating linear data}",
        "options": [
            "People perceive area or volume rather than height alone, so scaling dimensions linearly inflates visual area quadratically",
            "Area-based shapes automatically hide negative numbers from the chart",
            "Human silhouettes cannot be rendered accurately on digital screens",
            "Geometric shapes reduce the visual contrast between dataset categories"
        ],
        "correct": "People perceive area or volume rather than height alone, so scaling dimensions linearly inflates visual area quadratically",
        "show_image": 1,
        "image_url": "/images/g9_t159_q46.svg"
    },
    {
        "q_num": 47,
        "title": "Q47: Compare visual impact of pass rate trend on 88%-91% axis vs 0%-100% axis.",
        "text": "A graph tracking student pass rates shows a steep upward line, but the vertical axis grid spans only 88% to 91%. Describe how redrawing this on a 0% to 100% axis changes the visual trend.",
        "formula": r"\text{Visual Slope (0-100\%)} = \frac{91 - 88}{100 - 0} \times \text{Height} = 3\% \text{ of chart height}",
        "options": [
            "On a 0% to 100% axis, the steep line becomes a nearly flat line, showing that the change is minor (3 percentage points)",
            "On a 0% to 100% axis, the trend line becomes inverted and slopes downward",
            "Redrawing on a 0% to 100% axis increases the steepness of the line by factor 10",
            "The line shape remains completely unchanged regardless of axis boundaries"
        ],
        "correct": "On a 0% to 100% axis, the steep line becomes a nearly flat line, showing that the change is minor (3 percentage points)",
        "show_image": 1,
        "image_url": "/images/g9_t159_q47.svg"
    },
    {
        "q_num": 48,
        "title": "Q48: Describe how omitting a baseline control group makes claims unscientific.",
        "text": "Describe how publishing results with no baseline comparison group (control group) makes medical or product claims unscientific.",
        "formula": r"\text{Treatment Effect} = \text{Treatment Outcome} - \text{Control Group Outcome (Placebo)}",
        "options": [
            "Without a control group, it is impossible to determine if outcomes resulted from the product or placebo/natural factors",
            "Control groups are only required when testing electronic devices, not medical products",
            "Omitting control groups automatically doubles the sample size of the test group",
            "Control groups are used exclusively to calculate standard deviations"
        ],
        "correct": "Without a control group, it is impossible to determine if outcomes resulted from the product or placebo/natural factors",
        "show_image": 0,
        "image_url": None
    },
    {
        "q_num": 49,
        "title": "Q49: Analyze how changing canvas aspect ratio distorts perceived rate of change.",
        "text": "Analyze how changing the aspect ratio (stretching the height vs width of a chart canvas) distorts perceived rate of change.",
        "formula": r"\text{Visual Angle } \theta = \arctan\left(\text{Aspect Ratio} \times \frac{\Delta y}{\Delta x}\right)",
        "options": [
            "A tall narrow canvas exaggerates steepness, while a wide flat canvas flattens the appearance of trends",
            "Aspect ratio changes alter the numerical values of the data points plotted",
            "Stretching canvas width automatically increases the sample size of line graphs",
            "Aspect ratio affects bar chart colors but has no effect on line graph perception"
        ],
        "correct": "A tall narrow canvas exaggerates steepness, while a wide flat canvas flattens the appearance of trends",
        "show_image": 1,
        "image_url": "/images/g9_t159_q49.svg"
    },
    {
        "q_num": 50,
        "title": "Q50: Formulate a checklist of 5 criteria for evaluating media chart trustworthiness.",
        "text": "Formulate a checklist of 5 criteria for evaluating whether a digital media chart is objective and trustworthy.",
        "formula": r"\text{Trustworthiness} = \text{Full Y-axis} + \text{Clear Units} + \text{Unbiased Scale} + \text{Known Source} + \text{Unbiased Sampling}",
        "options": [
            "Axis starts at 0, clear labels/units, transparent source, proportional shapes/bars, and reported sample size/MOE",
            "Modern 3D graphics, vibrant color gradients, high social media shares, short captions, and HD resolution",
            "Absence of grid lines, use of rounded numbers, inclusion of sponsor logos, dark background mode, and bold fonts",
            "Equal bar widths, single-color palette, absence of numbers, wide margins, and digital animations"
        ],
        "correct": "Axis starts at 0, clear labels/units, transparent source, proportional shapes/bars, and reported sample size/MOE",
        "show_image": 0,
        "image_url": None
    }
]

with open("scratch/t159_50_perfect_built.json", "w", encoding="utf-8") as f:
    json.dump(questions_data, f, indent=2, ensure_ascii=False)

print(f"Successfully generated perfect JSON data for 50 questions in T159. Total items: {len(questions_data)}")
