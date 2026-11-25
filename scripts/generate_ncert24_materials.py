import os

def sanitize_text(text):
    replacements = {
        '•': '-', '—': '-', '–': '-', '√': 'sqrt', '×': '*', '÷': '/',
        '²': '^2', '³': '^3', '°': ' deg', '≠': '!=', '≤': '<=', '≥': '>=',
        'α': 'alpha', 'β': 'beta', 'γ': 'gamma', 'θ': 'theta', 'π': 'pi',
        '’': "'", '‘': "'", '“': '"', '”': '"', '…': '...', '→': '->', '←': '<-',
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    clean = []
    for ch in text:
        if ord(ch) < 256:
            clean.append(ch)
        else:
            clean.append('?')
    return ''.join(clean)

def create_model_paper_pdf(path, title, subtitle, session, max_marks, time_hours, instructions, sections):
    pages_streams = []
    
    clean_title = sanitize_text(title)
    clean_sub = sanitize_text(f"{subtitle} • Session {session} • Max Marks: {max_marks}")
    
    def start_page(page_num, total_pages=3):
        s = []
        # Header banner (Cobalt #2563EB)
        s.append('q 0.145 0.388 0.921 rg 0 735 612 57 re f Q')
        # Emerald accent line
        s.append('q 0.063 0.725 0.506 rg 0 732 612 3 re f Q')
        # Header text
        s.append('BT /F2 12.5 Tf 1 1 1 rg 40 762 Td (' + clean_title.replace('(', '\\(').replace(')', '\\)') + ') Tj ET')
        s.append('BT /F1 8.5 Tf 0.9 0.95 1 rg 40 746 Td (' + clean_sub.replace('(', '\\(').replace(')', '\\)') + ') Tj ET')
        # Footer text
        s.append('BT /F1 7.5 Tf 0.45 0.52 0.62 rg 40 25 Td (NCERT24 Free Study Materials - ncert24.com - CBSE Class 10 Session ' + session + ' - Page ' + str(page_num) + ') Tj ET')
        # Footer line
        s.append('q 0.88 0.91 0.94 RG 1 w 40 38 m 572 38 l S Q')
        return s

    current_page = 1
    current_stream = start_page(current_page)
    y = 705

    # General Instructions Box (Page 1)
    if instructions:
        current_stream.append('q 0.95 0.97 0.99 rg 40 ' + str(y - 65) + ' 532 70 re f Q')
        current_stream.append('q 0.145 0.388 0.921 RG 1 w 40 ' + str(y - 65) + ' 532 70 re S Q')
        current_stream.append('BT /F2 9.5 Tf 0.08 0.2 0.4 rg 50 ' + str(y - 5) + ' Td (GENERAL INSTRUCTIONS & BOARD BLUEPRINT - ' + session + ') Tj ET')
        y_box = y - 20
        for inst in instructions[:3]:
            escaped = sanitize_text(inst).replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
            current_stream.append('BT /F1 8.5 Tf 0.18 0.22 0.3 rg 52 ' + str(y_box) + ' Td ([*] ' + escaped + ') Tj ET')
            y_box -= 14
        y -= 85

    for sec_title, items in sections:
        if y < 130:
            pages_streams.append('\n'.join(current_stream))
            current_page += 1
            current_stream = start_page(current_page)
            y = 705
            
        # Section Header bar
        clean_sec = sanitize_text(sec_title).replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
        current_stream.append('q 0.94 0.96 0.99 rg 40 ' + str(y - 5) + ' 532 20 re f Q')
        current_stream.append('q 0.145 0.388 0.921 rg 40 ' + str(y - 5) + ' 4 20 re f Q')
        current_stream.append('BT /F2 10 Tf 0.06 0.15 0.35 rg 50 ' + str(y) + ' Td (' + clean_sec + ') Tj ET')
        y -= 22
        
        for item in items:
            clean_item = sanitize_text(item)
            words = clean_item.split(' ')
            line = ''
            for w in words:
                if len(line + ' ' + w) > 85:
                    if y < 55:
                        pages_streams.append('\n'.join(current_stream))
                        current_page += 1
                        current_stream = start_page(current_page)
                        y = 705
                    escaped = line.strip().replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
                    current_stream.append('BT /F1 8.5 Tf 0.15 0.2 0.28 rg 52 ' + str(y) + ' Td (' + escaped + ') Tj ET')
                    y -= 13
                    line = '   ' + w
                else:
                    line = line + (' ' if line else '') + w
            if line:
                if y < 55:
                    pages_streams.append('\n'.join(current_stream))
                    current_page += 1
                    current_stream = start_page(current_page)
                    y = 705
                escaped = line.strip().replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
                current_stream.append('BT /F1 8.5 Tf 0.15 0.2 0.28 rg 52 ' + str(y) + ' Td (' + escaped + ') Tj ET')
                y -= 13
        y -= 6

    pages_streams.append('\n'.join(current_stream))
    total_pages = len(pages_streams)

    # Build PDF
    pdf_out = bytearray(b'%PDF-1.4\n')
    catalog_id = 1
    pages_id = 2
    f1_id = 3
    f2_id = 4
    
    page_obj_ids = []
    content_obj_ids = []
    next_id = 5
    for i in range(total_pages):
        page_obj_ids.append(next_id)
        content_obj_ids.append(next_id + 1)
        next_id += 2
        
    offsets = {}
    def add_obj(obj_id, body):
        offsets[obj_id] = len(pdf_out)
        pdf_out.extend(f'{obj_id} 0 obj\n{body}\nendobj\n'.encode('latin1'))

    add_obj(catalog_id, f'<< /Type /Catalog /Pages {pages_id} 0 R >>')
    kids_str = ' '.join(f'{pid} 0 R' for pid in page_obj_ids)
    add_obj(pages_id, f'<< /Type /Pages /Kids [{kids_str}] /Count {total_pages} >>')
    add_obj(f1_id, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
    add_obj(f2_id, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>')

    for i in range(total_pages):
        pid = page_obj_ids[i]
        cid = content_obj_ids[i]
        content_bytes = pages_streams[i].encode('latin1')
        add_obj(pid, f'<< /Type /Page /Parent {pages_id} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 {f1_id} 0 R /F2 {f2_id} 0 R >> >> /Contents {cid} 0 R >>')
        add_obj(cid, f'<< /Length {len(content_bytes)} >>\nstream\n' + pages_streams[i] + '\nendstream')

    xref_offset = len(pdf_out)
    total_objs = next_id
    pdf_out.extend(f'xref\n0 {total_objs}\n0000000000 65535 f \n'.encode('latin1'))
    for oid in range(1, total_objs):
        off = offsets[oid]
        pdf_out.extend(f'{off:010d} 00000 n \n'.encode('latin1'))

    pdf_out.extend(f'trailer\n<< /Size {total_objs} /Root {catalog_id} 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n'.encode('latin1'))
    
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as f:
        f.write(pdf_out)
    print(f'Generated: {path} ({total_pages} pages)')

# Generate 2026-2027 Practice Papers & Question Banks
papers_2027 = [
    {
        "file": "public/pyq-pdfs/CBSE-Class10-MathsStandard-2027-PracticePaper.pdf",
        "title": "CBSE Class 10 Mathematics Standard Official Model Paper (2026-2027)",
        "subtitle": "Mathematics Standard (041) - Model Practice Question Paper",
        "session": "2026-2027",
        "marks": 80,
        "hours": 3,
        "instructions": [
            "Time Allowed: 3 Hours. Maximum Marks: 80. Consists of 38 questions in 5 Sections (A to E).",
            "Section A has 20 Multiple Choice Questions (MCQs) of 1 mark each (including 2 Assertion-Reason).",
            "Section B: 5 questions of 2 marks; Section C: 6 questions of 3 marks; Section D: 4 questions of 5 marks; Section E: 3 case studies of 4 marks."
        ],
        "sections": [
            ("SECTION A: 20 Multiple Choice Questions (1 Mark Each)", [
                "Q1. If two positive integers a and b are written as a = x^3*y^2 and b = x*y^3, where x, y are prime numbers, then HCF(a, b) is: (a) xy (b) xy^2 (c) x^3*y^3 (d) x^2*y^2.",
                "Q2. The zeroes of the quadratic polynomial x^2 + 99x + 127 are: (a) both positive (b) both negative (c) one positive one negative (d) both equal.",
                "Q3. The pair of equations x + 2y + 5 = 0 and -3x - 6y + 1 = 0 has: (a) unique solution (b) two solutions (c) infinitely many solutions (d) no solution.",
                "Q4. If the quadratic equation x^2 - 8x + k = 0 has real and equal roots, then the value of k is: (a) 16 (b) -16 (c) 64 (d) 4.",
                "Q5. The 11th term of an AP -3, -1/2, 2, ... is: (a) 28 (b) 22 (c) -38 (d) -46.5."
            ]),
            ("SECTION B: 5 Very Short Answer Questions (2 Marks Each)", [
                "Q21. Prove that 3 + 2*sqrt(5) is irrational, given that sqrt(5) is an irrational number.",
                "Q22. Find a quadratic polynomial whose zeroes are (5 - 3*sqrt(2)) and (5 + 3*sqrt(2)).",
                "Q23. Which term of the AP 21, 18, 15, ... is -81? Also, is any term 0? Justify."
            ]),
            ("SECTION C & D: Short & Long Answer Questions (3 & 5 Marks Each)", [
                "Q26. Prove that sqrt(3) is an irrational number using the method of contradiction.",
                "Q27. Solve the following pair of equations graphically: 2x + 3y = 12 and x - y = 1. Find the coordinates of vertices of the triangle formed by these lines and the y-axis.",
                "Q32. A motor boat whose speed is 18 km/h in still water takes 1 hour more to go 24 km upstream than to return downstream to the same spot. Find the speed of the stream."
            ]),
            ("SECTION E: Case-Based Integrated Assessment Questions (4 Marks Each)", [
                "Q36. Case Study 1 (Arithmetic Progression in Real Life): India's leading automobile manufacturer produces 600 cars in the 3rd year and 700 cars in the 7th year. Assuming uniform annual increase: (i) Find production in 1st year (1m) (ii) Total production in 10 years (2m) (iii) In which year was production 1000 cars? (1m)"
            ])
        ]
    },
    {
        "file": "public/pyq-pdfs/CBSE-Class10-MathsStandard-2027-PracticeSolutions.pdf",
        "title": "CBSE Class 10 Mathematics Standard Model Paper Solutions (2026-2027)",
        "subtitle": "Mathematics Standard (041) - Step-by-Step Marking Scheme & Answers",
        "session": "2026-2027",
        "marks": 80,
        "hours": 3,
        "instructions": [
            "Official Step-by-Step Marking Scheme based on CBSE Board Guidelines (Session 2026-2027).",
            "Alternative correct mathematical methods are awarded full marks.",
            "Half-mark deductions apply for omitted units or missing final conclusion statements."
        ],
        "sections": [
            ("SECTION A: MCQs Detailed Solutions", [
                "Q1. Correct Option: (b) xy^2. Explanation: HCF is product of lowest powers of common prime factors: x^1 and y^2 => HCF = x*y^2.",
                "Q2. Correct Option: (b) both negative. Explanation: For x^2 + 99x + 127, sum = -99 < 0 and product = 127 > 0. Since product is positive, both zeroes must have same sign; since sum is negative, both zeroes are negative.",
                "Q3. Correct Option: (d) no solution. Explanation: a1/a2 = 1/(-3) = -1/3; b1/b2 = 2/(-6) = -1/3; c1/c2 = 5/1 = 5. Since a1/a2 = b1/b2 != c1/c2, the lines are parallel.",
                "Q4. Correct Option: (a) 16. Explanation: For equal roots, D = b^2 - 4ac = 0. (-8)^2 - 4(1)(k) = 0 => 64 - 4k = 0 => k = 16.",
                "Q5. Correct Option: (b) 22. Explanation: a = -3, d = -1/2 - (-3) = 5/2. a11 = a + 10d = -3 + 10*(5/2) = -3 + 25 = 22."
            ]),
            ("SECTION B & C: Model Descriptive Answers", [
                "Q21 Solution: Assume 3 + 2*sqrt(5) = a/b (rational, b!=0, co-prime a,b). 2*sqrt(5) = a/b - 3 = (a - 3b)/b => sqrt(5) = (a - 3b)/(2b). Since a and b are integers, (a - 3b)/(2b) is rational, which implies sqrt(5) is rational. This contradicts the given fact that sqrt(5) is irrational. Hence, 3 + 2*sqrt(5) is irrational. [2 Marks]",
                "Q32 Solution (Speed of Stream): Let speed of stream = y km/h. Speed downstream = (18 + y) km/h; Speed upstream = (18 - y) km/h. Time difference: 24/(18 - y) - 24/(18 + y) = 1. 24[(18 + y) - (18 - y)] / (324 - y^2) = 1 => 24(2y) = 324 - y^2 => y^2 + 48y - 324 = 0. Factoring: (y + 54)(y - 6) = 0 => y = 6 km/h (speed cannot be negative). Speed of stream = 6 km/h. [5 Marks]"
            ])
        ]
    },
    {
        "file": "public/pyq-pdfs/CBSE-Class10-Science-2027-PracticePaper.pdf",
        "title": "CBSE Class 10 Science Official Model Practice Paper (2026-2027)",
        "subtitle": "Science (086) - Complete Theory & Practical Based Model Paper",
        "session": "2026-2027",
        "marks": 80,
        "hours": 3,
        "instructions": [
            "Time Allowed: 3 Hours. Maximum Marks: 80. Consists of 39 questions in 5 Sections (A to E).",
            "Section A: 20 Objective Type Questions (including 4 Assertion-Reason); Section B: 6 VSA (2m); Section C: 7 SA (3m); Section D: 3 LA (5m); Section E: 3 Source-Based/Case-Based (4m).",
            "Draw neat and labelled diagrams wherever required."
        ],
        "sections": [
            ("SECTION A: Objective Type Questions (1 Mark Each)", [
                "Q1. Which of the following is a decomposition reaction? (a) 2H2 + O2 -> 2H2O (b) CaCO3 --Heat--> CaO + CO2 (c) Zn + CuSO4 -> ZnSO4 + Cu (d) NaOH + HCl -> NaCl + H2O.",
                "Q2. A solution turns red litmus blue; its pH is likely to be: (a) 1 (b) 4 (c) 5 (d) 10.",
                "Q3. The kidneys in human beings are a part of the system for: (a) nutrition (b) respiration (c) excretion (d) transportation.",
                "Q4. A convex lens of focal length 25 cm has power: (a) +4 D (b) -4 D (c) +0.04 D (d) -0.04 D."
            ]),
            ("SECTION B & C: Conceptual & Analytical Questions", [
                "Q21. 2 g of silver chloride is taken in a china dish and placed in sunlight. (a) What change in colour will you observe? (b) Write balanced chemical equation. (c) Identify type of reaction.",
                "Q27. Draw a neat labelled diagram of a Nephron and explain the three steps of urine formation in human kidneys.",
                "Q30. An object 5 cm in length is held 25 cm away from a converging lens of focal length 10 cm. Find position, size and nature of the image formed."
            ]),
            ("SECTION D & E: Case-Based Assessment (4 Marks Each)", [
                "Q37. Case Study (pH in Everyday Life): Tooth decay starts when the pH of the mouth is lower than 5.5. Tooth enamel made of calcium hydroxyapatite is the hardest substance in the body. Bacteria present in mouth produce acids by degradation of sugar and food particles. (i) What causes tooth decay? (1m) (ii) How can it be prevented? (1m) (iii) What is the nature of toothpaste commonly used? (2m)"
            ])
        ]
    },
    {
        "file": "public/pyq-pdfs/CBSE-Class10-Science-2027-PracticeSolutions.pdf",
        "title": "CBSE Class 10 Science Model Paper Solutions & Scheme (2026-2027)",
        "subtitle": "Science (086) - Step-by-Step Marking Scheme & Diagram Guidelines",
        "session": "2026-2027",
        "marks": 80,
        "hours": 3,
        "instructions": [
            "Official Science Marking Scheme & Value Points (Session 2026-2027).",
            "Chemical equations must be balanced to secure full marks.",
            "Ray diagrams must include arrow marks showing direction of light propagation."
        ],
        "sections": [
            ("SECTION A: Objective Solutions", [
                "Q1. Correct Option: (b) CaCO3 --Heat--> CaO + CO2. Explanation: Thermal decomposition of calcium carbonate yields quicklime and carbon dioxide.",
                "Q2. Correct Option: (d) 10. Explanation: Bases turn red litmus blue and have pH > 7.",
                "Q3. Correct Option: (c) excretion. Explanation: Kidneys filter nitrogenous waste from blood.",
                "Q4. Correct Option: (a) +4 D. Explanation: P = 1 / f(m) = 1 / (+0.25 m) = +4 Dioptres."
            ]),
            ("SECTION B, C & D: Model Answers & Diagrams", [
                "Q21 Solution: (a) White silver chloride turns grey. (b) 2AgCl(s) --Sunlight--> 2Ag(s) + Cl2(g). (c) Photolytic decomposition reaction. [2 Marks]",
                "Q27 Solution: Nephron diagram showing Bowman's capsule, Glomerulus, Henle's loop, Collecting duct. Steps: 1. Ultrafiltration (glomerulus filters glucose, salts, water under pressure). 2. Selective reabsorption (useful substances reabsorbed in tubular part). 3. Tubular secretion (creatinine, excess ions secreted into collecting duct). [3 Marks]",
                "Q30 Solution (Lens Numerical): u = -25 cm, f = +10 cm, h = 5 cm. Lens formula: 1/v - 1/u = 1/f => 1/v = 1/10 + 1/(-25) = (5 - 2)/50 = 3/50 => v = +16.67 cm. Nature: Real and inverted. Magnification m = v/u = 16.67 / (-25) = -0.67. Height h' = m * h = -0.67 * 5 = -3.33 cm (diminished). [3 Marks]"
            ])
        ]
    },
    {
        "file": "public/pyq-pdfs/CBSE-Class10-SocialScience-2027-PracticePaper.pdf",
        "title": "CBSE Class 10 Social Science Official Model Paper (2026-2027)",
        "subtitle": "Social Science (087) - Complete History, Geography, Civics, Economics Model Paper",
        "session": "2026-2027",
        "marks": 80,
        "hours": 3,
        "instructions": [
            "Time Allowed: 3 Hours. Maximum Marks: 80. Consists of 37 questions in 6 Sections (A to F).",
            "Section F contains Question 37 which is a Map-Based question of 5 marks (2 marks History + 3 marks Geography).",
            "Attach the marked outline map of India securely inside the answer booklet."
        ],
        "sections": [
            ("SECTION A: MCQs (1 Mark Each)", [
                "Q1. Who among the following hosted the Congress of Vienna in 1815? (a) Duke Metternich (b) Otto von Bismarck (c) Giuseppe Mazzini (d) Napoleon Bonaparte.",
                "Q2. In which of the following states is black soil predominantly found? (a) Jammu and Kashmir (b) Maharashtra (c) Rajasthan (d) Jharkhand.",
                "Q3. Which of the following is an example of horizontal sharing of power? (a) Power sharing between central and state governments (b) Power sharing between legislature, executive and judiciary (c) Power sharing between different political parties (d) Community government."
            ]),
            ("SECTION C & D: Descriptive History & Economics Questions", [
                "Q25. Explain the implications of the First World War on the economic and political situation in India.",
                "Q29. How does the Reserve Bank of India (RBI) supervise the functioning of formal sources of loans?",
                "Q33. Describe the process of Unification of Germany under the leadership of Otto von Bismarck."
            ]),
            ("SECTION F: Map-Based Question (5 Marks)", [
                "Q37a. History (2 Marks): Two places A and B are marked on outline map of India: (A) The place where Indian National Congress session was held in Dec 1920 (Nagpur). (B) The place where Jallianwala Bagh incident occurred (Amritsar).",
                "Q37b. Geography (3 Marks): Locate and label: (i) Bhakra Nangal Dam (ii) Tarapur Nuclear Power Plant (iii) Black soil region in Deccan plateau."
            ])
        ]
    },
    {
        "file": "public/pyq-pdfs/CBSE-Class10-SocialScience-2027-PracticeSolutions.pdf",
        "title": "CBSE Class 10 Social Science Model Paper Marking Scheme (2026-2027)",
        "subtitle": "Social Science (087) - Answers, Value Points & Map Key",
        "session": "2026-2027",
        "marks": 80,
        "hours": 3,
        "instructions": [
            "Official Social Science Value Points & Evaluation Scheme (Session 2026-2027).",
            "Answers presented in structured bullet points with dates and key terms receive full marks.",
            "Map pointing accuracy carries full 5 marks."
        ],
        "sections": [
            ("SECTION A: MCQs Solutions", [
                "Q1. Correct Option: (a) Duke Metternich (Austrian Chancellor hosted Vienna Congress).",
                "Q2. Correct Option: (b) Maharashtra (Deccan trap region is made of black cotton soil).",
                "Q3. Correct Option: (b) Power sharing between legislature, executive and judiciary (at same level)."
            ]),
            ("SECTION C, D & F: Model Descriptive & Map Answers", [
                "Q25 Solution (First World War Impact): 1. Huge increase in defense expenditure financed by war loans and taxes. 2. Custom duties raised and income tax introduced for first time. 3. Prices doubled between 1913 and 1918, leading to extreme hardship. 4. Forced recruitment in rural areas caused widespread anger. 5. Failure of crops in 1918-19 and 1920-21 led to severe acute food shortages and epidemic. [3 Marks]",
                "Q33 Solution (German Unification): 1. Nationalist feelings were widespread among middle-class Germans who tried to unite different regions in 1848 (Frankfurt parliament). 2. Prussia took leadership under Chief Minister Otto von Bismarck ('architect of process'). 3. Three wars over 7 years with Austria, Denmark, and France ended in Prussian victory. 4. In January 1871, Prussian King William I was proclaimed German Emperor at Hall of Mirrors in Versailles. [5 Marks]",
                "Q37 Map Key: (A) Nagpur, Maharashtra (B) Amritsar, Punjab (i) Bhakra Nangal on Satluj river, Himachal/Punjab (ii) Tarapur in Maharashtra coast (iii) Deccan lava tract. [5 Marks]"
            ])
        ]
    },
    {
        "file": "public/pyq-pdfs/NCERT24-Class10-Maths-ImportantQuestions-2027.pdf",
        "title": "NCERT24 Class 10 Maths Chapter-wise Important Questions (2026-2027)",
        "subtitle": "Mathematics Standard & Basic - High Probability Board Exam Question Bank",
        "session": "2026-2027",
        "marks": 100,
        "hours": 3,
        "instructions": [
            "Curated from NCERT24 (ncert24.com) Free Study Materials database.",
            "Contains the top 50 most repeated CBSE Class 10 Board exam questions with full hints.",
            "Covers Real Numbers, Polynomials, Linear Equations, Quadratic Equations, and AP."
        ],
        "sections": [
            ("UNIT 1: Real Numbers & Polynomials Repeated Questions", [
                "Q1. Prove that sqrt(5) is an irrational number. [CBSE 2019, 2020, 2023, 2024]",
                "Q2. If HCF(306, 657) = 9, find LCM(306, 657). [Formula: LCM = (a*b)/HCF = (306*657)/9 = 22338]",
                "Q3. If alpha and beta are zeroes of p(x) = 2x^2 + 5x + k such that alpha^2 + beta^2 + alpha*beta = 21/4, find k.",
                "Q4. Find a quadratic polynomial whose zeroes are reciprocal of zeroes of ax^2 + bx + c."
            ]),
            ("UNIT 2: Linear Equations & Quadratic Equations High-Yield Problems", [
                "Q5. Find k for which the system of equations kx + 3y = k - 3 and 12x + ky = k has infinitely many solutions. [k/12 = 3/k = (k-3)/k => k = 6]",
                "Q6. A two-digit number is 4 times the sum of its digits and twice the product of its digits. Find the number. [Ans: 36]",
                "Q7. Solve for x: 1/(x+4) - 1/(x-7) = 11/30, x != -4, 7. [Ans: x = 1, 2]",
                "Q8. A train travels 360 km at a uniform speed. If speed had been 5 km/h more, it would have taken 1 hour less for the same journey. Find speed of train. [Ans: 40 km/h]"
            ]),
            ("UNIT 3: Arithmetic Progressions Top Board Problems", [
                "Q9. If the sum of first 7 terms of an AP is 49 and that of 17 terms is 289, find sum of first n terms. [Ans: Sn = n^2]",
                "Q10. How many terms of the AP 9, 17, 25, ... must be taken to give a sum of 636? [Ans: n = 12]"
            ])
        ]
    },
    {
        "file": "public/pyq-pdfs/NCERT24-Class10-Science-CompetencyQuestionBank-2027.pdf",
        "title": "NCERT24 Class 10 Science Competency & Case-Study Bank (2026-2027)",
        "subtitle": "Science (086) - Assertion-Reason, Diagrams & Case-Based Question Bank",
        "session": "2026-2027",
        "marks": 100,
        "hours": 3,
        "instructions": [
            "Source: NCERT24 (ncert24.com) Free Study Materials & Competency-Based Board Blueprints.",
            "Focuses on practical lab experiments, chemical equations, and assertion-reason questions.",
            "Includes complete value answers and marking breakdown for 2026-2027."
        ],
        "sections": [
            ("TOPIC 1: Chemical Reactions & Commercial Salts", [
                "Q1. Why is respiration considered an exothermic reaction? Explain with chemical equation. [C6H12O6 + 6O2 -> 6CO2 + 6H2O + Energy]",
                "Q2. A copper coin is kept immersed in silver nitrate solution for some time. What change will take place in coin and color of solution? [Cu + 2AgNO3 -> Cu(NO3)2 (blue) + 2Ag]",
                "Q3. How is Plaster of Paris prepared? Write chemical equation. Why must it be stored in moisture-proof containers? [CaSO4.1/2H2O + 1.5H2O -> CaSO4.2H2O (hard gypsum)]"
            ]),
            ("TOPIC 2: Life Processes & Human Physiology", [
                "Q4. Differentiate between transport of materials in Xylem and Phloem.",
                "Q5. Why is double circulation necessary in human beings? Explain flow of blood through heart with diagrammatic scheme.",
                "Q6. How are alveoli in lungs and nephrons in kidneys structurally designed to maximize efficiency of exchange?"
            ]),
            ("TOPIC 3: Optics (Light Reflection and Refraction)", [
                "Q7. Draw ray diagrams showing image formation by a concave mirror when object is placed: (a) between Focus and Pole (b) between C and F.",
                "Q8. A doctor prescribes a corrective lens of power -2.0 D. Find focal length of lens. Is it converging or diverging? What eye defect does person have? [f = -0.5 m, Concave/Diverging, Myopia]"
            ])
        ]
    }
]

for p in papers_2027:
    create_model_paper_pdf(
        p["file"],
        p["title"],
        p["subtitle"],
        p["session"],
        p["marks"],
        p["hours"],
        p["instructions"],
        p["sections"]
    )

print("All NCERT24 2026-2027 practice papers and question banks generated successfully!")
