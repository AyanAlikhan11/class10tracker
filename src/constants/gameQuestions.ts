import { GameQuestion } from "@/types";

/**
 * Built-in tricky question bank for the "Brain Sprint" game.
 * Questions are intentionally tricky (trap answers, common misconceptions)
 * so students must actually apply concepts instead of guessing.
 */
export const GAME_QUESTIONS: GameQuestion[] = [
  // Mathematics
  {
    id: "game-math-1",
    subjectId: "cbse-10-maths-std",
    chapterId: "Real Numbers",
    difficulty: "tricky",
    question:
      "If HCF(a, b) = 6 and LCM(a, b) = 36, and a = 12, what is b?",
    options: ["18", "6", "24", "36"],
    correctIndex: 0,
    explanation:
      "HCF × LCM = a × b, so 6 × 36 = 12 × b, giving b = 216 / 12 = 18. The trap is choosing 6 by confusing HCF with b.",
    points: 20,
  },
  {
    id: "game-math-2",
    subjectId: "cbse-10-maths-std",
    chapterId: "Polynomials",
    difficulty: "tricky",
    question:
      "A quadratic polynomial has zeroes 2 and -3. Which expression is the polynomial?",
    options: [
      "x² + x - 6",
      "x² - x - 6",
      "x² + 5x + 6",
      "x² - 5x + 6",
    ],
    correctIndex: 0,
    explanation:
      "Sum of zeroes = -1, product = -6, so the polynomial is k[x² - (sum)x + product] = x² + x - 6. The trap is flipping the sign of the sum.",
    points: 20,
  },
  {
    id: "game-math-3",
    subjectId: "cbse-10-maths-std",
    chapterId: "Quadratic Equations",
    difficulty: "hard",
    question:
      "For what value of k does 2x² + kx + 2 = 0 have equal real roots?",
    options: ["k = ±4", "k = 4 only", "k = ±2", "k = 0"],
    correctIndex: 0,
    explanation:
      "Equal roots need D = 0: k² - 4(2)(2) = 0 → k² = 16 → k = ±4. The trap is forgetting the negative value.",
    points: 30,
  },
  {
    id: "game-math-4",
    subjectId: "cbse-10-maths-std",
    chapterId: "Trigonometry",
    difficulty: "tricky",
    question: "What is the value of sin 30° × cos 60° + cos 30° × sin 60°?",
    options: ["1", "0", "√3/2", "1/2"],
    correctIndex: 0,
    explanation:
      "This is sin(A + B) = sin(30° + 60°) = sin 90° = 1. The trap is calculating each product separately and making an arithmetic slip.",
    points: 20,
  },
  {
    id: "game-math-5",
    subjectId: "cbse-10-maths-std",
    chapterId: "Surface Areas and Volumes",
    difficulty: "hard",
    question:
      "A cone and a cylinder have the same base radius and height. What is the ratio of their volumes?",
    options: ["1 : 3", "3 : 1", "1 : 2", "2 : 1"],
    correctIndex: 0,
    explanation:
      "Cone volume = (1/3)πr²h while cylinder volume = πr²h, so the ratio is 1 : 3. The trap is reversing the ratio.",
    points: 30,
  },
  {
    id: "game-math-6",
    subjectId: "cbse-10-maths-std",
    chapterId: "Probability",
    difficulty: "tricky",
    question:
      "Two fair dice are rolled. What is the probability that the sum is a prime number?",
    options: ["5/12", "1/3", "7/18", "1/2"],
    correctIndex: 0,
    explanation:
      "Prime sums are 2, 3, 5, 7, 11: 1 + 2 + 4 + 6 + 2 = 15 outcomes out of 36, so 15/36 = 5/12. The trap is forgetting 2 is prime.",
    points: 20,
  },

  // Science
  {
    id: "game-sci-1",
    subjectId: "cbse-10-science",
    chapterId: "Chemical Reactions and Equations",
    difficulty: "tricky",
    question:
      "Which gas is released when dilute hydrochloric acid reacts with zinc granules?",
    options: ["Hydrogen", "Oxygen", "Carbon dioxide", "Chlorine"],
    correctIndex: 0,
    explanation:
      "Zn + 2HCl → ZnCl₂ + H₂. The trap is choosing oxygen because a gas is produced, but the metal displaces hydrogen from the acid.",
    points: 20,
  },
  {
    id: "game-sci-2",
    subjectId: "cbse-10-science",
    chapterId: "Acids, Bases and Salts",
    difficulty: "hard",
    question: "What is the pH of a neutral solution at 25°C?",
    options: ["7", "0", "14", "1"],
    correctIndex: 0,
    explanation:
      "At 25°C pure water has pH 7, which is neutral. The trap is confusing neutral (7) with strongly acidic (0) or strongly basic (14).",
    points: 30,
  },
  {
    id: "game-sci-3",
    subjectId: "cbse-10-science",
    chapterId: "Life Processes",
    difficulty: "tricky",
    question:
      "Which blood vessel carries deoxygenated blood from the heart to the lungs?",
    options: [
      "Pulmonary artery",
      "Pulmonary vein",
      "Aorta",
      "Vena cava",
    ],
    correctIndex: 0,
    explanation:
      "The pulmonary artery carries deoxygenated blood from the right ventricle to the lungs. The trap is assuming every artery carries oxygenated blood.",
    points: 20,
  },
  {
    id: "game-sci-4",
    subjectId: "cbse-10-science",
    chapterId: "Light - Reflection and Refraction",
    difficulty: "hard",
    question:
      "An object is placed at the centre of curvature of a concave mirror. Where is the image formed?",
    options: [
      "At the centre of curvature",
      "At the focus",
      "At infinity",
      "Behind the mirror",
    ],
    correctIndex: 0,
    explanation:
      "For a concave mirror, an object at C produces a real, inverted image at C of the same size. The trap is choosing the focus.",
    points: 30,
  },
  {
    id: "game-sci-5",
    subjectId: "cbse-10-science",
    chapterId: "Electricity",
    difficulty: "tricky",
    question:
      "Two resistors of 6 Ω and 3 Ω are connected in parallel. What is the equivalent resistance?",
    options: ["2 Ω", "9 Ω", "4.5 Ω", "18 Ω"],
    correctIndex: 0,
    explanation:
      "1/R = 1/6 + 1/3 = 1/2, so R = 2 Ω. The trap is adding resistances directly as if they were in series.",
    points: 20,
  },
  {
    id: "game-sci-6",
    subjectId: "cbse-10-science",
    chapterId: "Magnetic Effects of Electric Current",
    difficulty: "hard",
    question:
      "According to Fleming's left-hand rule, the forefinger indicates the direction of the:",
    options: [
      "Magnetic field",
      "Current",
      "Force",
      "Motion",
    ],
    correctIndex: 0,
    explanation:
      "The forefinger points along the magnetic field, the middle finger along the current, and the thumb gives the force. The trap is swapping field and current.",
    points: 30,
  },
  {
    id: "game-sci-7",
    subjectId: "cbse-10-science",
    chapterId: "Heredity and Evolution",
    difficulty: "tricky",
    question:
      "A cross between two heterozygous tall pea plants (Tt × Tt) gives what phenotypic ratio?",
    options: ["3 tall : 1 short", "1 tall : 1 short", "1 tall : 2 medium : 1 short", "All tall"],
    correctIndex: 0,
    explanation:
      "Tt × Tt gives TT, Tt, Tt, tt: three tall and one short, so 3 : 1. The trap is picking 1 : 1 (which is a test cross, Tt × tt).",
    points: 20,
  },

  // Social Science
  {
    id: "game-sst-1",
    subjectId: "cbse-10-social-science",
    chapterId: "The Rise of Nationalism in Europe",
    difficulty: "tricky",
    question:
      "Who was proclaimed King of united Italy in 1861?",
    options: [
      "Victor Emmanuel II",
      "Giuseppe Garibaldi",
      "Count Cavour",
      "Giuseppe Mazzini",
    ],
    correctIndex: 0,
    explanation:
      "Victor Emmanuel II was proclaimed king of united Italy in 1861. Garibaldi led the unification of the south but was not the king.",
    points: 20,
  },
  {
    id: "game-sst-2",
    subjectId: "cbse-10-social-science",
    chapterId: "Resources and Development",
    difficulty: "hard",
    question: "Black soil in India is best suited for which crop?",
    options: ["Cotton", "Rice", "Tea", "Coffee"],
    correctIndex: 0,
    explanation:
      "Black (regur) soil is ideal for cotton, which is why it is called black cotton soil. The trap is choosing rice, which prefers alluvial or clayey soil.",
    points: 30,
  },
  {
    id: "game-sst-3",
    subjectId: "cbse-10-social-science",
    chapterId: "Power Sharing",
    difficulty: "tricky",
    question:
      "In Belgium, the 'community government' is elected by people belonging to:",
    options: [
      "One language community",
      "All language communities",
      "The national parliament",
      "Only the capital city",
    ],
    correctIndex: 0,
    explanation:
      "Belgium's community government is elected by people of one language community and handles cultural, educational and language issues. The trap is confusing it with a national government.",
    points: 20,
  },
  {
    id: "game-sst-4",
    subjectId: "cbse-10-social-science",
    chapterId: "The Making of a Global World",
    difficulty: "hard",
    question:
      "The Great Depression of 1929 originated in which country?",
    options: [
      "United States of America",
      "Germany",
      "Britain",
      "France",
    ],
    correctIndex: 0,
    explanation:
      "The Great Depression began with the collapse of the US stock market in 1929. The trap is choosing Germany, which was badly affected but not the origin.",
    points: 30,
  },

  // English
  {
    id: "game-eng-1",
    subjectId: "cbse-10-english",
    chapterId: "Grammar",
    difficulty: "tricky",
    question:
      "Choose the correct sentence: 'Neither the teacher nor the students ___ ready.'",
    options: ["were", "was", "is", "has been"],
    correctIndex: 0,
    explanation:
      "With 'neither...nor', the verb agrees with the nearer subject: 'students' is plural, so 'were'. The trap is agreeing with 'teacher'.",
    points: 20,
  },
  {
    id: "game-eng-2",
    subjectId: "cbse-10-english",
    chapterId: "First Flight",
    difficulty: "hard",
    question:
      "In 'A Letter to God', Lencho's faith is best described as:",
    options: [
      "Unshakable faith in God",
      "Faith in the post office",
      "Doubt in God's existence",
      "Faith in his neighbours",
    ],
    correctIndex: 0,
    explanation:
      "Lencho's faith in God is unwavering even after the hail destroys his crop; he blames the post office, not God. The trap is misreading his letter as doubt.",
    points: 30,
  },
  {
    id: "game-eng-3",
    subjectId: "cbse-10-english",
    chapterId: "Vocabulary",
    difficulty: "tricky",
    question: "Which word is closest in meaning to 'obstinate'?",
    options: ["Stubborn", "Flexible", "Generous", "Careless"],
    correctIndex: 0,
    explanation:
      "'Obstinate' means stubbornly refusing to change. The trap is choosing 'flexible', which is its opposite.",
    points: 20,
  },
  {
    id: "game-eng-4",
    subjectId: "cbse-10-english",
    chapterId: "Grammar",
    difficulty: "hard",
    question:
      "Identify the figure of speech: 'The wind whispered through the trees.'",
    options: ["Personification", "Simile", "Hyperbole", "Alliteration"],
    correctIndex: 0,
    explanation:
      "Wind is given the human ability to whisper, which is personification. A simile would use 'like' or 'as'.",
    points: 30,
  },
];
