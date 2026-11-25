import os

def sanitize_text(text):
    replacements = {
        '•': '-',
        '—': '-',
        '–': '-',
        '√': 'sqrt',
        '×': '*',
        '÷': '/',
        '²': '^2',
        '³': '^3',
        '°': ' deg',
        '≠': '!=',
        '≤': '<=',
        '≥': '>=',
        'α': 'alpha',
        'β': 'beta',
        'γ': 'gamma',
        'θ': 'theta',
        'π': 'pi',
        '’': "'",
        '‘': "'",
        '“': '"',
        '”': '"',
        '…': '...',
        '→': '->',
        '←': '<-',
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    # Ensure all remaining chars are latin1 compatible
    clean = []
    for ch in text:
        if ord(ch) < 256:
            clean.append(ch)
        else:
            clean.append('?')
    return ''.join(clean)

def create_chapter_pdf(path, chapter_title, subject_name, chapter_code, key_takeaways, sections, common_mistakes):
    pages_streams = []
    
    clean_title = sanitize_text(chapter_title)
    clean_sub = sanitize_text(f"{subject_name} • Chapter {chapter_code} • CBSE Class 10")
    
    def start_page(page_num, total_pages=3):
        s = []
        # Header banner (Cobalt #2563EB)
        s.append('q 0.145 0.388 0.921 rg 0 735 612 57 re f Q')
        # Emerald accent line
        s.append('q 0.063 0.725 0.506 rg 0 732 612 3 re f Q')
        # Header text
        s.append('BT /F2 13 Tf 1 1 1 rg 40 762 Td (' + clean_title.replace('(', '\\(').replace(')', '\\)') + ') Tj ET')
        s.append('BT /F1 8.5 Tf 0.9 0.95 1 rg 40 746 Td (' + clean_sub.replace('(', '\\(').replace(')', '\\)') + ' - Session 2026-2027) Tj ET')
        # Footer text
        s.append('BT /F1 7.5 Tf 0.45 0.52 0.62 rg 40 25 Td (CBSE Class 10 Board Companion 2026-2027 - Reference: ncert24.com, pw.live & NCERT - Page ' + str(page_num) + ') Tj ET')
        # Footer line
        s.append('q 0.88 0.91 0.94 RG 1 w 40 38 m 572 38 l S Q')
        return s

    current_page = 1
    current_stream = start_page(current_page)
    y = 705

    # Overview / Key Takeaways Box
    if key_takeaways:
        current_stream.append('q 0.95 0.98 0.96 rg 40 ' + str(y - 65) + ' 532 70 re f Q')
        current_stream.append('q 0.063 0.725 0.506 RG 1 w 40 ' + str(y - 65) + ' 532 70 re S Q')
        current_stream.append('BT /F2 10 Tf 0.02 0.45 0.3 rg 50 ' + str(y - 5) + ' Td (CORE BOARD EXAM HIGHLIGHTS & MARKS BLUEPRINT) Tj ET')
        y_box = y - 22
        for kt in key_takeaways[:3]:
            escaped = sanitize_text(kt).replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
            current_stream.append('BT /F1 9 Tf 0.15 0.25 0.2 rg 52 ' + str(y_box) + ' Td ([OK] ' + escaped + ') Tj ET')
            y_box -= 14
        y -= 85

    for sec_title, bullets in sections:
        if y < 130:
            pages_streams.append('\n'.join(current_stream))
            current_page += 1
            current_stream = start_page(current_page)
            y = 705
            
        # Section Header bar
        clean_sec = sanitize_text(sec_title).replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
        current_stream.append('q 0.94 0.96 0.99 rg 40 ' + str(y - 5) + ' 532 20 re f Q')
        current_stream.append('q 0.145 0.388 0.921 rg 40 ' + str(y - 5) + ' 4 20 re f Q')
        current_stream.append('BT /F2 10.5 Tf 0.06 0.15 0.35 rg 50 ' + str(y) + ' Td (' + clean_sec + ') Tj ET')
        y -= 22
        
        for b in bullets:
            clean_b = sanitize_text(b)
            # Wrap lines if needed
            words = clean_b.split(' ')
            line = ''
            for w in words:
                if len(line + ' ' + w) > 85:
                    if y < 55:
                        pages_streams.append('\n'.join(current_stream))
                        current_page += 1
                        current_stream = start_page(current_page)
                        y = 705
                    escaped = line.strip().replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
                    current_stream.append('BT /F1 9 Tf 0.18 0.22 0.3 rg 52 ' + str(y) + ' Td (' + escaped + ') Tj ET')
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
                current_stream.append('BT /F1 9 Tf 0.18 0.22 0.3 rg 52 ' + str(y) + ' Td (' + escaped + ') Tj ET')
                y -= 13
        y -= 6

    # Common Mistakes Box
    if common_mistakes:
        if y < 140:
            pages_streams.append('\n'.join(current_stream))
            current_page += 1
            current_stream = start_page(current_page)
            y = 705

        current_stream.append('q 0.99 0.95 0.95 rg 40 ' + str(y - 65) + ' 532 70 re f Q')
        current_stream.append('q 0.95 0.25 0.35 RG 1 w 40 ' + str(y - 65) + ' 532 70 re S Q')
        current_stream.append('BT /F2 10 Tf 0.7 0.1 0.2 rg 50 ' + str(y - 5) + ' Td (CRITICAL BOARD EXAM TRAPS & STUDENT MISTAKES) Tj ET')
        y_box = y - 22
        for cm in common_mistakes[:3]:
            escaped = sanitize_text(cm).replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
            current_stream.append('BT /F1 8.5 Tf 0.35 0.1 0.15 rg 52 ' + str(y_box) + ' Td ([!] ' + escaped + ') Tj ET')
            y_box -= 14
        y -= 80

    pages_streams.append('\n'.join(current_stream))
    total_pages = len(pages_streams)

    # Build PDF binary
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

chapters_data = [
    {
        "file": "public/chapter-notes/maths-ch1-real-numbers-notes.pdf",
        "title": "Mathematics Standard - Real Numbers (Chapter 1)",
        "subject": "Mathematics (041)",
        "code": "1",
        "takeaways": [
            "Chapter Weightage: ~6 Marks in CBSE Class 10 Board Exam.",
            "Mandatory 3-Mark Question: Proof of irrationality for sqrt(2), sqrt(3), or sqrt(5).",
            "Formula Alert: HCF(a, b) * LCM(a, b) = a * b (Applies strictly to 2 numbers only)."
        ],
        "sections": [
            ("1. Fundamental Theorem of Arithmetic", [
                "- Statement: Every composite number can be uniquely expressed as a product of prime numbers, irrespective of the order of prime factors.",
                "- Example: 140 = 2^2 * 5 * 7. Primes are 2, 5, 7. Factor tree representation is accepted by CBSE.",
                "- HCF calculation: Product of the smallest power of each common prime factor involved in the numbers.",
                "- LCM calculation: Product of the greatest power of each prime factor involved in the numbers."
            ]),
            ("2. Proofs of Irrational Numbers (Contradiction Method)", [
                "- Standard Board Proof: To prove sqrt(p) is irrational, assume on the contrary that sqrt(p) is rational.",
                "- Step 1: Let sqrt(p) = a/b, where a and b are co-prime integers (HCF(a,b) = 1) and b != 0.",
                "- Step 2: Squaring both sides: p = a^2 / b^2 => p * b^2 = a^2.",
                "- Step 3: By Theorem: If prime p divides a^2, then p divides a. Hence, let a = p * c for some integer c.",
                "- Step 4: Substitute a: p * b^2 = p^2 * c^2 => b^2 = p * c^2 => p divides b^2 => p divides b.",
                "- Step 5: Since p divides both a and b, a and b have common factor p. This contradicts that a and b are co-prime.",
                "- Conclusion: Therefore, the initial assumption is false, and sqrt(p) is irrational. [Hence Proved]"
            ]),
            ("3. Decimal Expansions of Rational Numbers", [
                "- Let x = p/q be a rational number with p and q co-prime.",
                "- If the prime factorisation of q is in the form 2^n * 5^m (where n and m are non-negative integers), then x has a terminating decimal expansion.",
                "- If q has prime factors other than 2 or 5 (e.g. 3, 7, 11), the decimal expansion is non-terminating repeating (recurring)."
            ])
        ],
        "mistakes": [
            "Mistake 1: Applying HCF(a,b,c) * LCM(a,b,c) = a * b * c. This formula is INVALID for 3 numbers!",
            "Mistake 2: Forgetting to state 'where a and b are co-prime integers' in the irrationality proof - CBSE penalizes 0.5 to 1 mark."
        ]
    },
    {
        "file": "public/chapter-notes/maths-ch2-polynomials-notes.pdf",
        "title": "Mathematics Standard - Polynomials (Chapter 2)",
        "subject": "Mathematics (041)",
        "code": "2",
        "takeaways": [
            "Chapter Weightage: ~4 to 5 Marks.",
            "Core Concept: Relationship between zeroes and coefficients of a quadratic polynomial.",
            "Graph Rule: Number of real zeroes equals number of points where graph intersects the x-axis."
        ],
        "sections": [
            ("1. Zeroes of a Polynomial", [
                "- A real number k is a zero of polynomial p(x) if p(k) = 0.",
                "- A polynomial of degree n can have at most n real zeroes.",
                "- Geometrical Meaning: The x-coordinates of the points where graph y = p(x) intersects the x-axis are the zeroes."
            ]),
            ("2. Quadratic Polynomials (ax^2 + bx + c, a != 0)", [
                "- If alpha and beta are zeroes of p(x) = ax^2 + bx + c, then:",
                "- Sum of Zeroes: alpha + beta = -b / a = -(Coefficient of x) / (Coefficient of x^2).",
                "- Product of Zeroes: alpha * beta = c / a = (Constant term) / (Coefficient of x^2).",
                "- Forming a Quadratic Polynomial when zeroes are known: p(x) = k [x^2 - (alpha + beta)x + (alpha * beta)], where k is any non-zero constant."
            ]),
            ("3. Key Algebraic Identities Used in Board Questions", [
                "- alpha^2 + beta^2 = (alpha + beta)^2 - 2 * alpha * beta",
                "- (alpha - beta)^2 = (alpha + beta)^2 - 4 * alpha * beta",
                "- alpha^3 + beta^3 = (alpha + beta) [ (alpha + beta)^2 - 3 * alpha * beta ]"
            ])
        ],
        "mistakes": [
            "Mistake 1: Forgetting the negative sign in sum of zeroes: alpha + beta is -b/a, NOT b/a.",
            "Mistake 2: Forgetting non-zero constant k when writing the formed polynomial."
        ]
    },
    {
        "file": "public/chapter-notes/maths-ch3-linear-equations-notes.pdf",
        "title": "Mathematics Standard - Linear Equations in Two Variables (Chapter 3)",
        "subject": "Mathematics (041)",
        "code": "3",
        "takeaways": [
            "Chapter Weightage: ~6 to 7 Marks.",
            "Consistency Conditions: Ratios a1/a2, b1/b2, c1/c2 determine number of solutions.",
            "Word Problems: Speed-distance (upstream/downstream), age, and fraction problems."
        ],
        "sections": [
            ("1. Standard Form & Consistency Conditions", [
                "- Pair of equations: a1*x + b1*y + c1 = 0 and a2*x + b2*y + c2 = 0.",
                "- Case 1 (Intersecting Lines): a1/a2 != b1/b2 -> Exactly one unique solution -> Consistent.",
                "- Case 2 (Coincident Lines): a1/a2 = b1/b2 = c1/c2 -> Infinitely many solutions -> Consistent (dependent).",
                "- Case 3 (Parallel Lines): a1/a2 = b1/b2 != c1/c2 -> No solution -> Inconsistent."
            ]),
            ("2. Algebraic Methods of Solution", [
                "- Substitution Method: Express one variable in terms of the other from one equation and substitute into the other.",
                "- Elimination Method: Multiply equations by constants to make coefficients of one variable equal, then add or subtract."
            ]),
            ("3. Upstream & Downstream Speed Formulation", [
                "- Let speed of boat in still water = x km/h, speed of water stream = y km/h (x > y).",
                "- Speed Downstream = (x + y) km/h; Speed Upstream = (x - y) km/h.",
                "- Time taken = Distance / Speed. Equations: d / (x+y) + d / (x-y) = Total Time."
            ])
        ],
        "mistakes": [
            "Mistake 1: Mixing up upstream speed as (y - x). Boat speed must exceed stream speed: (x - y).",
            "Mistake 2: Writing constants on different sides of '=' before computing ratio c1/c2."
        ]
    },
    {
        "file": "public/chapter-notes/maths-ch4-quadratic-equations-notes.pdf",
        "title": "Mathematics Standard - Quadratic Equations (Chapter 4)",
        "subject": "Mathematics (041)",
        "code": "4",
        "takeaways": [
            "Chapter Weightage: ~6 Marks.",
            "Quadratic Formula: x = (-b +- sqrt(b^2 - 4ac)) / (2a).",
            "Discriminant D = b^2 - 4ac determines nature of roots."
        ],
        "sections": [
            ("1. Definition & Standard Form", [
                "- An equation of the form ax^2 + bx + c = 0, where a, b, c are real numbers and a != 0.",
                "- Degree must be exactly 2. Always simplify fully before deciding whether an equation is quadratic."
            ]),
            ("2. Methods of Solution", [
                "- Factorisation Method: Split the middle term bx into two terms whose sum is b and product is a * c.",
                "- Quadratic Formula (Sridharacharya Formula): x = (-b +- sqrt(D)) / (2a), where D = b^2 - 4ac."
            ]),
            ("3. Nature of Roots (Discriminant Analysis)", [
                "- Case 1: D = b^2 - 4ac > 0 -> Two distinct real roots.",
                "- Case 2: D = b^2 - 4ac = 0 -> Two equal real roots (coincident roots x = -b / 2a).",
                "- Case 3: D = b^2 - 4ac < 0 -> No real roots."
            ])
        ],
        "mistakes": [
            "Mistake 1: In quadratic formula denominator is 2*a, not 2.",
            "Mistake 2: When D=0 condition is asked in board exam, students often write D >= 0 instead of D = 0."
        ]
    },
    {
        "file": "public/chapter-notes/maths-ch5-arithmetic-progressions-notes.pdf",
        "title": "Mathematics Standard - Arithmetic Progressions (Chapter 5)",
        "subject": "Mathematics (041)",
        "code": "5",
        "takeaways": [
            "Chapter Weightage: ~5 to 6 Marks.",
            "Key Formulas: nth term an = a + (n-1)d, Sum Sn = n/2 [2a + (n-1)d].",
            "Crucial Rule: an = Sn - S(n-1) for n >= 2."
        ],
        "sections": [
            ("1. Core Definitions", [
                "- An AP is a sequence where each term is obtained by adding a fixed number d (common difference) to the preceding term.",
                "- First term = a, Common difference d = a2 - a1 = a3 - a2 = an - a(n-1). d can be positive, negative, or zero."
            ]),
            ("2. General Term (nth Term)", [
                "- Formula: an = a + (n - 1)d.",
                "- nth term from the end of an AP with last term l: a_end = l - (n - 1)d."
            ]),
            ("3. Sum of First n Terms", [
                "- Formula 1: Sn = (n / 2) * [ 2a + (n - 1)d ].",
                "- Formula 2: Sn = (n / 2) * [ a + l ], where l is the last term an.",
                "- Finding nth term from sum: an = Sn - S(n-1)."
            ]),
            ("4. Standard Term Assumptions for Word Problems", [
                "- 3 terms in AP: (a - d), a, (a + d) [Common difference is d].",
                "- 4 terms in AP: (a - 3d), (a - d), (a + d), (a + 3d) [Common difference is 2d]."
            ])
        ],
        "mistakes": [
            "Mistake 1: Confusing n (position/number of terms) with an (value of the term). n must ALWAYS be a positive integer.",
            "Mistake 2: Forgetting brackets when multiplying negative d: a + (n-1)*(-d)."
        ]
    },
    {
        "file": "public/chapter-notes/science-ch1-chemical-reactions-notes.pdf",
        "title": "Science - Chemical Reactions and Equations (Chapter 1)",
        "subject": "Science (086)",
        "code": "1",
        "takeaways": [
            "Chapter Weightage: ~5 to 6 Marks.",
            "Types of Reactions: Combination, Decomposition, Displacement, Double Displacement, Redox.",
            "Balancing: Mandatory law of conservation of mass."
        ],
        "sections": [
            ("1. Characteristics of Chemical Reactions", [
                "- A chemical reaction involves chemical change with new substances formed.",
                "- Evidences: Change in state, change in colour, evolution of a gas, change in temperature, formation of precipitate.",
                "- Law of Conservation of Mass: Total mass of elements in reactants = Total mass of elements in products."
            ]),
            ("2. Major Types of Chemical Reactions", [
                "- Combination Reaction: Two or more reactants combine to form a single product. Example: CaO(s) + H2O(l) -> Ca(OH)2(aq) + Heat (Slaking of lime).",
                "- Decomposition Reaction: Single reactant breaks down to give simpler products. Requires energy (Thermal, Electrolytic, or Photolytic).",
                "- Thermal Decomposition: 2FeSO4(s) --Heat--> Fe2O3(s) + SO2(g) + SO3(g). Green crystals turn reddish-brown with burning sulphur smell.",
                "- Thermal Decomposition: 2Pb(NO3)2(s) --Heat--> 2PbO(s) + 4NO2(g) [Brown fumes] + O2(g).",
                "- Photolytic Decomposition: 2AgCl(s) --Sunlight--> 2Ag(s) [Grey] + Cl2(g). Used in black and white photography.",
                "- Displacement Reaction: More reactive element displaces less reactive element. Fe(s) + CuSO4(aq) -> FeSO4(aq) [Pale green] + Cu(s) [Brown deposit].",
                "- Double Displacement Reaction: Exchange of ions between reactants. Na2SO4(aq) + BaCl2(aq) -> BaSO4(s) [White ppt] + 2NaCl(aq)."
            ]),
            ("3. Oxidation, Reduction & Daily Life Effects", [
                "- Oxidation: Gain of oxygen or loss of hydrogen. Reduction: Loss of oxygen or gain of hydrogen.",
                "- Redox Reaction: Both occur simultaneously. CuO + H2 --Heat--> Cu + H2O (CuO reduced to Cu, H2 oxidized to H2O).",
                "- Corrosion: Metals eaten up by action of air, moisture, acids. Rusting of iron = hydrated ferric oxide Fe2O3.xH2O.",
                "- Rancidity: Oxidation of fats and oils leading to bad smell and taste. Prevented by antioxidants, flushing with nitrogen gas, airtight containers."
            ])
        ],
        "mistakes": [
            "Mistake 1: Writing chemical formulas without balancing atoms.",
            "Mistake 2: Confusing the oxidizing agent with the reduced substance (Oxidizing agent is the substance that gets reduced!)."
        ]
    },
    {
        "file": "public/chapter-notes/science-ch2-acids-bases-salts-notes.pdf",
        "title": "Science - Acids, Bases and Salts (Chapter 2)",
        "subject": "Science (086)",
        "code": "2",
        "takeaways": [
            "Chapter Weightage: ~6 Marks.",
            "pH Scale: 0 to 14 (<7 Acidic, 7 Neutral, >7 Basic).",
            "Important Chemicals from Common Salt: Bleaching Powder, Baking Soda, Washing Soda, Plaster of Paris."
        ],
        "sections": [
            ("1. Properties of Acids and Bases", [
                "- Acids produce H+(aq) or H3O+(aq) ions in water. Sour taste, turns blue litmus red.",
                "- Bases produce OH-(aq) ions in water. Bitter taste, soapy touch, turns red litmus blue. Water-soluble bases are Alkalis.",
                "- Acid + Metal -> Salt + Hydrogen gas (Pop test: Burning splinter burns with a pop sound). Zn + 2HCl -> ZnCl2 + H2.",
                "- Acid + Metal Carbonate -> Salt + CO2 + H2O (CO2 turns lime water milky due to CaCO3 precipitate).",
                "- Neutralisation: Acid + Base -> Salt + Water. HCl + NaOH -> NaCl + H2O."
            ]),
            ("2. pH Scale & Everyday Importance", [
                "- pH = -log[H+]. Pure water at 25 deg C has pH = 7. Blood pH = 7.36 to 7.42.",
                "- Acid Rain: When rain water pH < 5.6. Harms aquatic life and marble structures.",
                "- Tooth Decay: Starts when mouth pH falls below 5.5. Tooth enamel is Calcium hydroxyapatite.",
                "- Self-defence: Honeybee sting injects methanoic (formic) acid; treated with mild base like baking soda."
            ]),
            ("3. Important Salts and Their Commercial Uses", [
                "- Bleaching Powder (CaOCl2): Produced by dry slaked lime Ca(OH)2 + Cl2 -> CaOCl2 + H2O. Disinfectant for water, bleaching cotton.",
                "- Baking Soda (NaHCO3): NaCl + H2O + CO2 + NH3 -> NH4Cl + NaHCO3. Antacid, fire extinguishers, making baking powder.",
                "- Washing Soda (Na2CO3.10H2O): Recrystallisation of sodium carbonate. Permanent hardness removal of water.",
                "- Plaster of Paris (CaSO4.1/2H2O): Formed by heating Gypsum CaSO4.2H2O at 373 K. Used for supporting fractured bones and decorative toys."
            ])
        ],
        "mistakes": [
            "Mistake 1: Diluting acid by adding water to concentrated acid. ALWAYS add concentrated acid slowly to water with constant stirring!",
            "Mistake 2: Writing formula of Plaster of Paris with 2 molecules of water instead of half: CaSO4.1/2H2O."
        ]
    },
    {
        "file": "public/chapter-notes/science-ch5-life-processes-notes.pdf",
        "title": "Science - Life Processes (Chapter 5)",
        "subject": "Science (086)",
        "code": "5",
        "takeaways": [
            "Chapter Weightage: ~8 to 9 Marks (Highest in Biology).",
            "Four Pillars: Nutrition, Respiration, Transportation, Excretion.",
            "High-Frequency Diagrams: Nephron structure, Human Alimentary Canal, Double Circulation."
        ],
        "sections": [
            ("1. Nutrition (Autotrophic & Heterotrophic)", [
                "- Autotrophic: Photosynthesis 6CO2 + 12H2O --Light & Chlorophyll--> C6H12O6 + 6O2 + 6H2O.",
                "- Events: Absorption of light by chlorophyll, conversion to chemical energy, splitting of water (photolysis), reduction of CO2 to carbohydrates.",
                "- Human Digestion: Mouth (Salivary amylase breaks starch into maltose) -> Stomach (HCl creates acidic medium, Pepsin digests proteins, Mucus protects stomach wall) -> Small Intestine (Bile emulsifies fats, Pancreatic trypsin digests proteins, Lipase breaks fats). Villi provide huge surface area for absorption."
            ]),
            ("2. Respiration & Energy Breakdown Pathways", [
                "- Breakdown of Glucose (6-C) in cytoplasm -> Pyruvate (3-C) + Energy.",
                "- Pathway A (Absence of O2 in Yeast): Ethanol + CO2 + Energy (Fermentation).",
                "- Pathway B (Lack of O2 in Human Muscle): Lactic acid + Energy (Causes muscle cramps).",
                "- Pathway C (Presence of O2 in Mitochondria): CO2 + H2O + Energy (38 ATP, Aerobic).",
                "- Alveoli: Balloon-like structures in lungs surrounded by extensive capillary network for rapid gas exchange."
            ]),
            ("3. Transportation in Humans & Plants", [
                "- Human Heart: 4 chambers (Right & Left Atria, Right & Left Ventricles).",
                "- Double Circulation: Pulmonary circulation (Heart -> Lungs -> Heart) + Systemic circulation (Heart -> Body -> Heart). Prevents mixing of oxygenated and deoxygenated blood.",
                "- Vessels: Arteries carry blood away from heart (thick, elastic walls, no valves); Veins carry blood to heart (thin walls, valves prevent backflow).",
                "- Plants: Xylem transports water and minerals (unidirectional via transpirational pull); Phloem transports sucrose and amino acids (translocation, bidirectional, requires ATP energy)."
            ]),
            ("4. Excretion in Humans", [
                "- Human Excretory System: Pair of kidneys, pair of ureters, urinary bladder, urethra.",
                "- Nephron (Functional Unit): Bowman's capsule enclosing glomerulus + long renal tubule.",
                "- Urine Formation: 1. Ultrafiltration in glomerulus -> 2. Selective reabsorption of glucose, amino acids, salts, water in tubular part -> 3. Tubular secretion into collecting duct."
            ])
        ],
        "mistakes": [
            "Mistake 1: Confusing Xylem (passive transpirational pull) with Phloem (active translocation requiring ATP).",
            "Mistake 2: Mixing up Pulmonary Artery (carries deoxygenated blood) with Pulmonary Vein (carries oxygenated blood)."
        ]
    },
    {
        "file": "public/chapter-notes/science-ch9-light-reflection-refraction-notes.pdf",
        "title": "Science - Light - Reflection and Refraction (Chapter 9)",
        "subject": "Science (086)",
        "code": "9",
        "takeaways": [
            "Chapter Weightage: ~7 Marks.",
            "Sign Convention: New Cartesian Sign Convention is strictly tested.",
            "Formulas: Mirror Formula 1/f = 1/v + 1/u, Lens Formula 1/f = 1/v - 1/u, Power P = 1/f(m)."
        ],
        "sections": [
            ("1. Reflection by Spherical Mirrors", [
                "- Laws of Reflection: Angle of incidence = Angle of reflection (i = r); Incident ray, reflected ray, normal lie in same plane.",
                "- Concave Mirror: Converging mirror. Produces real-inverted images for all positions except when object is between Pole and Focus (virtual, erect, magnified - dental mirror / shaving mirror).",
                "- Convex Mirror: Diverging mirror. Always produces virtual, erect, diminished image. Used as rear-view vehicle mirror for wider field of view.",
                "- Mirror Formula: 1/f = 1/v + 1/u. Magnification m = h'/h = -v/u."
            ]),
            ("2. Refraction & Snell's Law", [
                "- Bending of light when passing obliquely from one transparent medium to another.",
                "- Snell's Law: sin(i) / sin(r) = constant = n21 (Refractive index of medium 2 relative to 1).",
                "- Absolute Refractive Index: n = c / v (Speed of light in vacuum c / Speed of light in medium v).",
                "- Optically denser medium: Light travels slower and bends towards the normal."
            ]),
            ("3. Spherical Lenses & Power", [
                "- Convex Lens: Converging lens. Focal length f is POSITIVE.",
                "- Concave Lens: Diverging lens. Focal length f is NEGATIVE. Always forms virtual, erect, diminished image.",
                "- Lens Formula: 1/f = 1/v - 1/u. Magnification m = h'/h = +v/u.",
                "- Power of a Lens: P = 1 / f (in metres). Unit is Dioptre (D). 1 D = 1 m^-1. Convex lens P > 0, Concave lens P < 0."
            ])
        ],
        "mistakes": [
            "Mistake 1: Sign of magnification: m is negative for real-inverted image, positive for virtual-erect image.",
            "Mistake 2: Forgetting to convert focal length f into METRES before calculating lens power in dioptres."
        ]
    },
    {
        "file": "public/chapter-notes/sst-ch1-nationalism-in-europe-notes.pdf",
        "title": "Social Science - The Rise of Nationalism in Europe (History Chapter 1)",
        "subject": "Social Science (087)",
        "code": "1",
        "takeaways": [
            "Chapter Weightage: ~5 to 6 Marks.",
            "Key Themes: French Revolution, Napoleonic Civil Code 1804, Treaty of Vienna 1815.",
            "Unifications: Unification of Germany and Italy."
        ],
        "sections": [
            ("1. Frederic Sorrieu Vision & French Revolution", [
                "- Frederic Sorrieu (1848): French artist prepared series of 4 prints depicting a world made of 'Democratic and Social Republics'.",
                "- French Revolution (1789): First clear expression of nationalism. Introduced ideas of la patrie (the fatherland) and le citoyen (the citizen), tricolour flag, centralized administrative system, uniform weights and measures."
            ]),
            ("2. Napoleonic Code (Civil Code of 1804)", [
                "- Did away with all privileges based on birth.",
                "- Established equality before the law and secured right to property.",
                "- Abolished feudal system, freed peasants from serfdom and manorial dues, guild restrictions removed in towns.",
                "- Drawbacks: Increased taxation, censorship, forced conscription into French armies."
            ]),
            ("3. Treaty of Vienna (1815) & Conservative Order", [
                "- Hosted by Austrian Chancellor Duke Metternich after Napoleon's defeat at Waterloo.",
                "- Bourbon dynasty restored to power in France.",
                "- Series of buffer states set up on French boundaries to prevent French expansion.",
                "- Kingdom of Netherlands (including Belgium) set up in north; Genoa added to Piedmont in south; Prussia given important new territories on western frontiers."
            ]),
            ("4. Unifications of Germany and Italy", [
                "- Unification of Germany (1866-1871): Led by Prussian Chief Minister Otto von Bismarck ('Blood and Iron policy'). Three wars over 7 years with Austria, Denmark, France. King William I proclaimed German Emperor at Versailles (Jan 1871).",
                "- Unification of Italy: Led by Giuseppe Mazzini (Young Italy), Count Cavour (Chief Minister of Sardinia-Piedmont), and Giuseppe Garibaldi (Red Shirts). Victor Emmanuel II proclaimed King of United Italy in 1861."
            ])
        ],
        "mistakes": [
            "Mistake 1: Confusing Duke Metternich's quote: 'When France sneezes, the rest of Europe catches cold.'",
            "Mistake 2: Mixing up German unifier (Bismarck) with Italian diplomatic architect (Cavour)."
        ]
    },
    {
        "file": "public/chapter-notes/sst-ch2-nationalism-in-india-notes.pdf",
        "title": "Social Science - Nationalism in India (History Chapter 2)",
        "subject": "Social Science (087)",
        "code": "2",
        "takeaways": [
            "Chapter Weightage: ~6 to 7 Marks (Mandatory Map Work).",
            "Key Movements: Non-Cooperation Movement (1920-22) & Civil Disobedience Movement (1930-34).",
            "Map Items: Jallianwala Bagh (Amritsar), Dandi (Salt March), Chauri Chaura (Gorakhpur)."
        ],
        "sections": [
            ("1. The First World War, Satyagraha & Rowlatt Act", [
                "- War created new economic hardship: Huge defense expenditure, custom duties raised, income tax introduced, forced recruitment in rural areas.",
                "- Idea of Satyagraha: Emphasized power of truth and need to search for truth. Mahatma Gandhi's early Satyagrahas: Champaran (1917, Indigo planters), Kheda (1917, Crop failure revenue relaxation), Ahmedabad (1918, Cotton mill workers).",
                "- Rowlatt Act (1919): Gave government enormous powers to repress political activities and detention of prisoners without trial for 2 years.",
                "- Jallianwala Bagh Massacre (13 April 1919): General Dyer opened fire on peaceful gathering at Amritsar; Rabindranath Tagore renounced knighthood."
            ]),
            ("2. Non-Cooperation Movement (1920-1922)", [
                "- Gandhiji's book 'Hind Swaraj' (1909): British rule was established with cooperation of Indians and survived only because of this cooperation.",
                "- Adopted at Nagpur Congress session (Dec 1920). Boycott of foreign cloth, picketing of liquor shops, surrender of titles.",
                "- Called off in Feb 1922 following violent clash at Chauri Chaura (Gorakhpur, UP) where 22 policemen were killed."
            ]),
            ("3. Civil Disobedience Movement & Salt March (1930)", [
                "- Salt as a powerful symbol: Salt was consumed by rich and poor alike; tax on salt revealed most oppressive face of British rule.",
                "- Salt March: 12 March 1930 from Sabarmati Ashram to coastal town of Dandi (240 miles, 24 days, 78 trusted volunteers). Reached Dandi on 6 April 1930, manufactured salt by boiling sea water.",
                "- Difference from Non-Cooperation: People were now asked not only to refuse cooperation but also to BREAK COLONIAL LAWS.",
                "- Poona Pact (Sept 1932): Signed between Mahatma Gandhi and Dr. B.R. Ambedkar; gave Depressed Classes reserved seats in provincial and central legislative councils."
            ])
        ],
        "mistakes": [
            "Mistake 1: Confusing Non-Cooperation (refusing cooperation) with Civil Disobedience (violating laws like salt law).",
            "Mistake 2: Map location errors: Placing Chauri Chaura in Bihar instead of Uttar Pradesh (Gorakhpur)."
        ]
    },
    {
        "file": "public/chapter-notes/sst-ch3-resources-and-development-notes.pdf",
        "title": "Social Science - Resources and Development (Geography Chapter 1)",
        "subject": "Social Science (087)",
        "code": "1",
        "takeaways": [
            "Chapter Weightage: ~4 to 5 Marks.",
            "Key Classifications: Biotic/Abiotic, Renewable/Non-renewable, Individual/Community/National/International.",
            "Soil Profiles: Alluvial, Black (Regur), Red & Yellow, Laterite, Arid."
        ],
        "sections": [
            ("1. Classification of Resources", [
                "- Origin: Biotic (living organisms, flora, fauna) and Abiotic (non-living, rocks, metals).",
                "- Exhaustibility: Renewable (solar, wind, water, forests) and Non-renewable (minerals, fossil fuels).",
                "- Ownership: Individual, Community (grazing grounds, parks), National (all minerals, water resources within territorial waters 12 nautical miles), International (beyond 200 nautical miles of Exclusive Economic Zone).",
                "- Status of Development: Potential, Developed, Stock, Reserves (subset of stock which can be put into use with existing technical know-how)."
            ]),
            ("2. Sustainable Development & Agenda 21", [
                "- Rio de Janeiro Earth Summit (1992): First International Earth Summit convened to address urgent problems of environmental protection and socio-economic development.",
                "- Agenda 21: Declaration signed by world leaders to achieve global sustainable development by combating environmental damage, poverty, disease through global cooperation."
            ]),
            ("3. Soil as a Resource & Major Soil Types", [
                "- Alluvial Soil: Most widely spread and important soil. Formed by deposits of Indus, Ganga, Brahmaputra. Divided into Khadar (new, fine, fertile) and Bangar (old, higher kankar nodules). Ideal for sugarcane, paddy, wheat.",
                "- Black Soil (Regur Soil): Ideal for cotton cultivation (Black cotton soil). Made of extremely fine clayey material, rich in calcium carbonate, magnesium, potash, lime. Develops deep cracks during hot weather.",
                "- Red and Yellow Soil: Develops on crystalline igneous rocks in areas of low rainfall. Reddish colour due to diffusion of iron.",
                "- Laterite Soil: Develops in areas with high temperature and heavy rainfall. Result of intense leaching. Good for tea, coffee, cashew nuts with proper manure."
            ])
        ],
        "mistakes": [
            "Mistake 1: Confusing Khadar (New alluvial, more fertile) with Bangar (Old alluvial, less fertile).",
            "Mistake 2: Stating that Black soil lacks moisture capacity - Black soil has VERY HIGH capacity to hold moisture."
        ]
    },
    {
        "file": "public/chapter-notes/english-ch1-a-letter-to-god-notes.pdf",
        "title": "English Language & Literature - A Letter to God (First Flight Chapter 1)",
        "subject": "English (184)",
        "code": "1",
        "takeaways": [
            "Chapter Weightage: ~4 to 5 Marks (Literature Section C).",
            "Author: G.L. Fuentes.",
            "Core Theme: Extreme, unshakeable faith in God vs. irony of human innocence and suspicion."
        ],
        "sections": [
            ("1. Character Sketch & Setting", [
                "- Lencho: A hardworking, simple-hearted farmer who worked like an ox in his fields. Possessed immense, naive faith in God.",
                "- The Setting: A modest house on the crest of a low hill overlooking the valley, corn fields dotted with flowers promising good harvest.",
                "- The Crisis: The much-awaited rain turned into a devastating hailstorm with hailstones resembling frozen pearls, destroying the entire corn crop."
            ]),
            ("2. Plot Summary & The Letter to God", [
                "- Facing starvation, Lencho's only hope was 'help from God' whose eyes see everything, even what is deep in one's conscience.",
                "- Lencho wrote a letter addressed directly 'To God', asking for 100 pesos to sow his field again and live until the next harvest.",
                "- Postmaster's Reaction: Initially laughed, but was moved by such profound faith. To keep Lencho's faith alive, he collected money from employees and friends, contributing part of his own salary (gathered 70 pesos)."
            ]),
            ("3. The Climax & Irony of the Story", [
                "- Lencho received the envelope with money on Sunday. Instead of being surprised, he became angry upon counting 70 pesos instead of 100.",
                "- He believed God could never make a mistake or deny him what he had requested.",
                "- He wrote a second letter asking God to send the remaining 30 pesos, but NOT through the mail, because 'the post office employees are a bunch of crooks'.",
                "- Irony: The very people who acted as angels of generosity and kindness were accused of theft."
            ])
        ],
        "mistakes": [
            "Mistake 1: Describing Lencho as greedy. He was NOT greedy; he had simplistic, naive faith and counted exact requirement for his family's survival.",
            "Mistake 2: Missing the central literary device: Irony of Situation."
        ]
    }
]

for ch in chapters_data:
    create_chapter_pdf(
        ch["file"],
        ch["title"],
        ch["subject"],
        ch["code"],
        ch["takeaways"],
        ch["sections"],
        ch["mistakes"]
    )

print("All chapter notes PDFs generated successfully!")
