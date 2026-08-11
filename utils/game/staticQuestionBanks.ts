import type { Question } from './types';

// Általános iskola feladatok (központi felvételi szint)
export const elementaryQuestions: Question[] = [
    // Alapvető műveletek
    { question: 'Mennyi 15 + 27?', answer: 42, type: 'addition', expression: '15 + 27 = 42' },
    { question: 'Mennyi 50 - 23?', answer: 27, type: 'subtraction', expression: '50 - 23 = 27' },
    { question: 'Mennyi 6 × 8?', answer: 48, type: 'multiplication', expression: '6 × 8 = 48' },
    { question: 'Mennyi 72 ÷ 9?', answer: 8, type: 'division', expression: '72 ÷ 9 = 8' },
    { question: 'Mennyi 3²?', answer: 9, type: 'multiplication', expression: '3² = 3 × 3 = 9' },
    { question: 'Mennyi √16?', answer: 4, type: 'multiplication', expression: '√16 = 4, mert 4² = 16' },
    
    // Geometria feladatok
    { question: 'Egy téglalap oldalai 8 cm és 12 cm. Mekkora a kerülete?', answer: 40, type: 'multiplication', expression: 'K = 2(a+b) = 2(8+12) = 2×20 = 40 cm' },
    { question: 'Számítsd ki a 15² értékét!', answer: 225, type: 'multiplication', expression: '15² = 15×15 = 225' },
    { question: 'Egy kör sugara 7 cm. Mekkora a területe? (π ≈ 3.14)', answer: 153.86, type: 'multiplication', expression: 'T = πr² = 3.14×7² = 3.14×49 = 153.86 cm²' },
    { question: 'Mekkora a 3/4 + 2/3 összege? (Add meg tizedes törtben)', answer: 1.417, type: 'addition', expression: '3/4 + 2/3 = 9/12 + 8/12 = 17/12 ≈ 1.417' },
    { question: 'Egy kocka éle 5 cm. Mekkora a térfogata?', answer: 125, type: 'multiplication', expression: 'V = a³ = 5³ = 125 cm³' },
    // Hatványozás és gyökvonás feladatok
    { question: 'Számítsd ki: √(3^(-3)) / 27²', answer: 0.00137, type: 'multiplication', expression: '√(3^(-3)) / 27² = √(1/27) / 729 = (1/3√3) / 729 ≈ 0.00137' },
    { question: 'Számítsd ki: ³√128 / ⁵√16', answer: 2, type: 'division', expression: '³√128 / ⁵√16 = ³√(2^7) / ⁵√(2^4) = 2^(7/3) / 2^(4/5) = 2^(35/15 - 12/15) = 2^(23/15) ≈ 2' },
    { question: 'Számítsd ki: 9 / ³√81', answer: 3, type: 'division', expression: '9 / ³√81 = 9 / ³√(3^4) = 9 / 3^(4/3) = 3^2 / 3^(4/3) = 3^(2-4/3) = 3^(2/3) ≈ 3' },
    { question: 'Számítsd ki: (2²)⁵ × (1/2) × 8^(-2)', answer: 0.5, type: 'multiplication', expression: '(2²)⁵ × (1/2) × 8^(-2) = 2^10 × 2^(-1) × 2^(-6) = 2^(10-1-6) = 2³ = 8' },
    { question: 'Számítsd ki: ⁵√3 / ³√9', answer: 0.577, type: 'division', expression: '⁵√3 / ³√9 = 3^(1/5) / 9^(1/3) = 3^(1/5) / 3^(2/3) = 3^(1/5 - 2/3) = 3^(-7/15) ≈ 0.577' },
    { question: 'Számítsd ki: 4 / ⁵√8', answer: 2, type: 'division', expression: '4 / ⁵√8 = 4 / 8^(1/5) = 2² / 2^(3/5) = 2^(2-3/5) = 2^(7/5) ≈ 2' },
    { question: 'Számítsd ki: √3 × 27 × ³√9²', answer: 81, type: 'multiplication', expression: '√3 × 27 × ³√9² = 3^(1/2) × 3³ × (3²)^(2/3) = 3^(1/2) × 3³ × 3^(4/3) = 3^(1/2 + 3 + 4/3) = 3^(3/6 + 18/6 + 8/6) = 3^(29/6) ≈ 81' },
    { question: 'Számítsd ki: ³√16 / ⁵√4', answer: 2, type: 'division', expression: '³√16 / ⁵√4 = 16^(1/3) / 4^(1/5) = (2^4)^(1/3) / (2²)^(1/5) = 2^(4/3) / 2^(2/5) = 2^(4/3 - 2/5) = 2^(20/15 - 6/15) = 2^(14/15) ≈ 2' },
    { question: 'Számítsd ki: √128 / ³√16', answer: 4, type: 'division', expression: '√128 / ³√16 = √(2^7) / ³√(2^4) = 2^(7/2) / 2^(4/3) = 2^(7/2 - 4/3) = 2^(21/6 - 8/6) = 2^(13/6) ≈ 4' },
    { question: 'Számítsd ki: 1 / √(27 × 9^(1/3))', answer: 0.192, type: 'division', expression: '1 / √(27 × 9^(1/3)) = 1 / √(3³ × 3^(2/3)) = 1 / √(3^(3 + 2/3)) = 1 / √(3^(11/3)) = 1 / 3^(11/6) ≈ 0.192' },
    { question: 'Számítsd ki a √(169) értékét!', answer: 13, type: 'multiplication', expression: '√(169) = 13, mert 13² = 169' },
    { question: 'Egy háromszög alapja 10 cm, magassága 6 cm. Mekkora a területe?', answer: 30, type: 'multiplication', expression: 'T = (a×m)/2 = (10×6)/2 = 60/2 = 30 cm²' },
    { question: 'Mekkora a 2⁵ értéke?', answer: 32, type: 'multiplication', expression: '2⁵ = 2×2×2×2×2 = 32' },
    { question: 'Egy paralelogramma alapja 8 cm, magassága 5 cm. Mekkora a területe?', answer: 40, type: 'multiplication', expression: 'T = a×m = 8×5 = 40 cm²' },
    { question: 'Számítsd ki a 0.25 × 8 értékét!', answer: 2, type: 'multiplication', expression: '0.25 × 8 = 2' },
    { question: 'Egy trapéz párhuzamos oldalai 6 cm és 10 cm, magassága 4 cm. Mekkora a területe?', answer: 32, type: 'multiplication', expression: 'T = (a+c)×m/2 = (6+10)×4/2 = 16×2 = 32 cm²' },
    { question: 'Mekkora a 5/6 - 1/3 különbsége? (Add meg tizedes törtben)', answer: 0.5, type: 'subtraction', expression: '5/6 - 1/3 = 5/6 - 2/6 = 3/6 = 1/2 = 0.5' },
    { question: 'Egy derékszögű háromszög befogói 3 cm és 4 cm. Mekkora az átfogója?', answer: 5, type: 'multiplication', expression: 'Pitagorasz-tétel: c² = a² + b² = 3² + 4² = 9 + 16 = 25, c = 5 cm' },
    { question: 'Számítsd ki a 12% -át a 200-nak!', answer: 24, type: 'multiplication', expression: '200 × 0.12 = 24' },
    { question: 'Egy rombusz oldala 6 cm, magassága 4 cm. Mekkora a területe?', answer: 24, type: 'multiplication', expression: 'T = a×m = 6×4 = 24 cm²' },
    { question: 'Mekkora a 3/5 × 10 értéke?', answer: 6, type: 'multiplication', expression: '3/5 × 10 = 30/5 = 6' },
    { question: 'Egy henger sugara 4 cm, magassága 7 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 351.68, type: 'multiplication', expression: 'V = πr²h = 3.14×4²×7 = 3.14×16×7 = 351.68 cm³' },
    { question: 'Számítsd ki a √(256) értékét!', answer: 16, type: 'multiplication', expression: '√(256) = 16, mert 16² = 256' },
    { question: 'Egy deltoid átlói 6 cm és 8 cm. Mekkora a területe?', answer: 24, type: 'multiplication', expression: 'T = (d₁×d₂)/2 = (6×8)/2 = 48/2 = 24 cm²' },
    { question: 'Mekkora a 0.6 + 0.4 összege?', answer: 1, type: 'addition', expression: '0.6 + 0.4 = 1.0' },
    { question: 'Egy szabályos hatszög oldala 5 cm. Mekkora a kerülete?', answer: 30, type: 'multiplication', expression: 'K = 6a = 6×5 = 30 cm' },
    { question: 'Számítsd ki a 4³ értékét!', answer: 64, type: 'multiplication', expression: '4³ = 4×4×4 = 64' },
    { question: 'Egy kúp sugara 3 cm, magassága 6 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 56.52, type: 'multiplication', expression: 'V = πr²h/3 = 3.14×3²×6/3 = 3.14×9×2 = 56.52 cm³' },
    { question: 'Mekkora a 7/8 - 3/4 különbsége? (Add meg tizedes törtben)', answer: 0.125, type: 'subtraction', expression: '7/8 - 3/4 = 7/8 - 6/8 = 1/8 = 0.125' },
    { question: 'Egy téglalap területe 48 cm², egyik oldala 8 cm. Mekkora a másik oldala?', answer: 6, type: 'division', expression: 'T = a×b, 48 = 8×b, b = 48÷8 = 6 cm' },
    { question: 'Számítsd ki a 15% -át a 80-nak!', answer: 12, type: 'multiplication', expression: '80 × 0.15 = 12' },
    { question: 'Egy gömb sugara 6 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 904.32, type: 'multiplication', expression: 'V = 4πr³/3 = 4×3.14×6³/3 = 4×3.14×216/3 = 904.32 cm³' },
    { question: 'Mekkora a 2/3 × 9 értéke?', answer: 6, type: 'multiplication', expression: '2/3 × 9 = 18/3 = 6' },
    { question: 'Egy paralelogramma kerülete 24 cm, egyik oldala 7 cm. Mekkora a másik oldala?', answer: 5, type: 'subtraction', expression: 'K = 2(a+b), 24 = 2(7+b), 12 = 7+b, b = 5 cm' },
    { question: 'Számítsd ki a √(400) értékét!', answer: 20, type: 'multiplication', expression: '√(400) = 20, mert 20² = 400' }
];

// Középiskola feladatok (érettségi szint)
export const highschoolQuestions: Question[] = [
    // Másodfokú egyenletek
    { question: 'Számítsd ki a 2x² - 5x + 3 = 0 másodfokú egyenlet gyökeit! (Add meg a nagyobb gyököt)', answer: 1.5, type: 'multiplication', expression: 'x = (5 ± √(25-24))/4 = (5 ± 1)/4, x₁ = 1, x₂ = 1.5' },
    { question: 'Oldd meg az x² - 4x + 3 = 0 egyenletet! (Add meg a kisebb gyököt)', answer: 1, type: 'multiplication', expression: 'x² - 4x + 3 = (x-1)(x-3) = 0, x₁ = 1, x₂ = 3' },
    { question: 'Számítsd ki a 3x² + 2x - 1 = 0 egyenlet diszkriminánsát!', answer: 16, type: 'multiplication', expression: 'D = b² - 4ac = 2² - 4×3×(-1) = 4 + 12 = 16' },
    
    // Trigonometria
    { question: 'Számítsd ki a sin(30°) értékét!', answer: 0.5, type: 'multiplication', expression: 'sin(30°) = 1/2 = 0.5' },
    { question: 'Számítsd ki a cos(60°) értékét!', answer: 0.5, type: 'multiplication', expression: 'cos(60°) = 1/2 = 0.5' },
    { question: 'Számítsd ki a tan(45°) értékét!', answer: 1, type: 'multiplication', expression: 'tan(45°) = sin(45°)/cos(45°) = (√2/2)/(√2/2) = 1' },
    
    // Logaritmus
    { question: 'Számítsd ki a log₂(8) értékét!', answer: 3, type: 'multiplication', expression: 'log₂(8) = log₂(2³) = 3·log₂(2) = 3·1 = 3' },
    { question: 'Számítsd ki a log₃(27) értékét!', answer: 3, type: 'multiplication', expression: 'log₃(27) = log₃(3³) = 3·log₃(3) = 3·1 = 3' },
    { question: 'Számítsd ki a log₁₀(1000) értékét!', answer: 3, type: 'multiplication', expression: 'log₁₀(1000) = log₁₀(10³) = 3·log₁₀(10) = 3·1 = 3' },
    
    // Geometria
    { question: 'Egy derékszögű háromszög befogói 3 és 4. Mekkora az átfogó?', answer: 5, type: 'multiplication', expression: 'Pitagorasz-tétel: c² = a² + b² = 3² + 4² = 9 + 16 = 25, c = 5' },
    { question: 'Egy derékszögű háromszög befogói 3 és 4. Mekkora az átfogó?', answer: 5, type: 'multiplication', expression: 'Pitagorasz-tétel: c² = a² + b² = 3² + 4² = 9 + 16 = 25, c = 5' },
    { question: 'Számítsd ki a log₂(8) értékét!', answer: 3, type: 'multiplication', expression: 'log₂(8) = log₂(2³) = 3·log₂(2) = 3·1 = 3' },
    { question: 'Egy kör sugara 5 cm. Mekkora a kerülete? (π ≈ 3.14)', answer: 31.4, type: 'multiplication', expression: 'K = 2πr = 2·3.14·5 = 31.4 cm' },
    { question: 'Számítsd ki a sin(30°) értékét!', answer: 0.5, type: 'multiplication', expression: 'sin(30°) = 1/2 = 0.5' },
    // Hatványozás és gyökvonás feladatok (középiskola szint)
    { question: 'Számítsd ki: (√3)^(-3) × 27^(2/3)', answer: 3, type: 'multiplication', expression: '(√3)^(-3) × 27^(2/3) = 3^(-3/2) × (3³)^(2/3) = 3^(-3/2) × 3² = 3^(-3/2 + 2) = 3^(1/2) = √3 ≈ 1.73' },
    { question: 'Számítsd ki: log₃(√(27))', answer: 1.5, type: 'multiplication', expression: 'log₃(√(27)) = log₃(√(3³)) = log₃(3^(3/2)) = (3/2)·log₃(3) = 3/2 = 1.5' },
    { question: 'Számítsd ki: 2^(log₂(8)) + 3^(log₃(9))', answer: 17, type: 'addition', expression: '2^(log₂(8)) + 3^(log₃(9)) = 8 + 9 = 17' },
    { question: 'Számítsd ki: √(2 + √3) × √(2 - √3)', answer: 1, type: 'multiplication', expression: '√(2 + √3) × √(2 - √3) = √((2 + √3)(2 - √3)) = √(4 - 3) = √1 = 1' },
    { question: 'Számítsd ki: (1/2)^(-2) + (1/3)^(-1)', answer: 7, type: 'addition', expression: '(1/2)^(-2) + (1/3)^(-1) = 2² + 3 = 4 + 3 = 7' },
    { question: 'Egy számtani sorozat első tagja 2, differenciája 3. Mennyi a 10. tag?', answer: 29, type: 'multiplication', expression: 'a₁₀ = a₁ + (10-1)·d = 2 + 9·3 = 2 + 27 = 29' },
    { question: 'Számítsd ki a 2⁴ + 3² értékét!', answer: 25, type: 'multiplication', expression: '2⁴ + 3² = 16 + 9 = 25' },
    { question: 'Egy téglalap oldalai 6 cm és 8 cm. Mekkora az átlója?', answer: 10, type: 'multiplication', expression: 'd² = a² + b² = 6² + 8² = 36 + 64 = 100, d = 10 cm' },
    { question: 'Számítsd ki a cos(60°) értékét!', answer: 0.5, type: 'multiplication', expression: 'cos(60°) = 1/2 = 0.5' },
    { question: 'Egy mértani sorozat első tagja 3, hányadosa 2. Mennyi a 5. tag?', answer: 48, type: 'multiplication', expression: 'a₅ = a₁·q⁴ = 3·2⁴ = 3·16 = 48' },
    { question: 'Számítsd ki a √(144) + √(25) értékét!', answer: 17, type: 'multiplication', expression: '√(144) + √(25) = 12 + 5 = 17' },
    { question: 'Egy kocka éle 4 cm. Mekkora a térfogata?', answer: 64, type: 'multiplication', expression: 'V = a³ = 4³ = 64 cm³' },
    { question: 'Számítsd ki a tan(45°) értékét!', answer: 1, type: 'multiplication', expression: 'tan(45°) = sin(45°)/cos(45°) = (√2/2)/(√2/2) = 1' },
    { question: 'Egy paralelogramma oldalai 5 cm és 7 cm, a köztük lévő szög 60°. Mekkora a területe?', answer: 30.3, type: 'multiplication', expression: 'T = a·b·sin(α) = 5·7·sin(60°) = 35·√3/2 ≈ 30.3 cm²' },
    { question: 'Számítsd ki a log₃(27) értékét!', answer: 3, type: 'multiplication', expression: 'log₃(27) = log₃(3³) = 3·log₃(3) = 3·1 = 3' },
    { question: 'Egy henger sugara 3 cm, magassága 8 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 226.08, type: 'multiplication', expression: 'V = πr²h = 3.14·3²·8 = 3.14·9·8 = 226.08 cm³' },
    { question: 'Számítsd ki a sin(90°) értékét!', answer: 1, type: 'multiplication', expression: 'sin(90°) = 1' },
    { question: 'Egy trapéz párhuzamos oldalai 6 cm és 10 cm, magassága 4 cm. Mekkora a területe?', answer: 32, type: 'multiplication', expression: 'T = (a+c)·m/2 = (6+10)·4/2 = 16·2 = 32 cm²' },
    { question: 'Számítsd ki a 5³ - 2⁴ értékét!', answer: 109, type: 'multiplication', expression: '5³ - 2⁴ = 125 - 16 = 109' },
    { question: 'Egy gúla alapterülete 36 cm², magassága 8 cm. Mekkora a térfogata?', answer: 96, type: 'multiplication', expression: 'V = T·m/3 = 36·8/3 = 288/3 = 96 cm³' },
    { question: 'Számítsd ki a cos(0°) értékét!', answer: 1, type: 'multiplication', expression: 'cos(0°) = 1' },
    { question: 'Egy rombusz oldala 5 cm, egyik átlója 6 cm. Mekkora a másik átlója?', answer: 8, type: 'multiplication', expression: 'd₁² + d₂² = 4a², 6² + d₂² = 4·5², 36 + d₂² = 100, d₂² = 64, d₂ = 8 cm' },
    { question: 'Számítsd ki a log₁₀(1000) értékét!', answer: 3, type: 'multiplication', expression: 'log₁₀(1000) = log₁₀(10³) = 3·log₁₀(10) = 3·1 = 3' },
    { question: 'Egy kúp sugara 4 cm, magassága 9 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 150.72, type: 'multiplication', expression: 'V = πr²h/3 = 3.14·4²·9/3 = 3.14·16·3 = 150.72 cm³' },
    { question: 'Számítsd ki a sin(60°) értékét!', answer: 0.866, type: 'multiplication', expression: 'sin(60°) = √3/2 ≈ 0.866' },
    { question: 'Egy deltoid átlói 8 cm és 6 cm. Mekkora a területe?', answer: 24, type: 'multiplication', expression: 'T = (d₁·d₂)/2 = (8·6)/2 = 48/2 = 24 cm²' },
    { question: 'Számítsd ki a 7² - 3³ értékét!', answer: 22, type: 'multiplication', expression: '7² - 3³ = 49 - 27 = 22' },
    { question: 'Egy gömb sugara 5 cm. Mekkora a térfogata? (π ≈ 3.14)', answer: 523.33, type: 'multiplication', expression: 'V = 4πr³/3 = 4·3.14·5³/3 = 4·3.14·125/3 ≈ 523.33 cm³' },
    { question: 'Számítsd ki a cos(30°) értékét!', answer: 0.866, type: 'multiplication', expression: 'cos(30°) = √3/2 ≈ 0.866' },
    { question: 'Egy szabályos hatszög oldala 4 cm. Mekkora a kerülete?', answer: 24, type: 'multiplication', expression: 'K = 6a = 6·4 = 24 cm' }
];

// Egyetemi matematika témák
export const universityTopics = [
    'deriválás',
    'integrálás',
    'differenciál egyenletek',
    'határértékszámítás',
    'függvényvizsgálat',
    'sorozatok és sorok',
    'többváltozós függvények',
    'lineáris algebra',
    'valószínűségszámítás',
    'komplex számok'
];

// Fallback egyetemi feladatok (ha az API nem elérhető)
export const fallbackUniversityQuestions: Question[] = [
    // Deriválás
    { question: 'Számítsd ki az f(x) = x² + 3x + 2 függvény deriváltját az x = 2 pontban!', answer: 7, type: 'multiplication', expression: 'f\'(x) = 2x + 3, f\'(2) = 2·2 + 3 = 7' },
    { question: 'Számítsd ki az f(x) = 3x² + 2x függvény deriváltját az x = 1 pontban!', answer: 8, type: 'multiplication', expression: 'f\'(x) = 6x + 2, f\'(1) = 6·1 + 2 = 8' },
    { question: 'Számítsd ki az f(x) = x³ - 2x függvény deriváltját az x = 2 pontban!', answer: 10, type: 'multiplication', expression: 'f\'(x) = 3x² - 2, f\'(2) = 3·4 - 2 = 10' },
    { question: 'Számítsd ki az f(x) = e^x függvény deriváltját az x = 0 pontban!', answer: 1, type: 'multiplication', expression: 'f\'(x) = e^x, f\'(0) = e^0 = 1' },
    
    // Integrálás
    { question: 'Számítsd ki a ∫(2x + 1)dx integrált 0-tól 2-ig!', answer: 6, type: 'multiplication', expression: '∫(2x + 1)dx = x² + x, [x² + x]₀² = (4 + 2) - (0 + 0) = 6' },
    { question: 'Számítsd ki a ∫(x² + 2x)dx integrált 0-tól 1-ig!', answer: 1.33, type: 'multiplication', expression: '∫(x² + 2x)dx = x³/3 + x², [x³/3 + x²]₀¹ = 1/3 + 1 = 4/3 ≈ 1.33' },
    { question: 'Számítsd ki a ∫(3x²)dx integrált 0-tól 2-ig!', answer: 8, type: 'multiplication', expression: '∫(3x²)dx = x³, [x³]₀² = 8 - 0 = 8' },
    
    // Határértékek
    { question: 'Számítsd ki a lim(x→0) (sin x)/x határértéket!', answer: 1, type: 'multiplication', expression: 'L\'Hôpital szabály alapján: lim(x→0) (sin x)/x = lim(x→0) cos x/1 = 1' },
    { question: 'Számítsd ki a lim(x→1) (x²-1)/(x-1) határértéket!', answer: 2, type: 'multiplication', expression: 'lim(x→1) (x²-1)/(x-1) = lim(x→1) (x+1)(x-1)/(x-1) = lim(x→1) (x+1) = 2' },
    { question: 'Számítsd ki a lim(x→0) (1-cos x)/x² határértéket!', answer: 0.5, type: 'multiplication', expression: 'L\'Hôpital szabály: lim(x→0) (1-cos x)/x² = lim(x→0) sin x/(2x) = 1/2' },
    { question: 'Számítsd ki a ∫(2x + 1)dx integrált 0-tól 2-ig!', answer: 6, type: 'multiplication', expression: '∫(2x + 1)dx = x² + x, [x² + x]₀² = (4 + 2) - (0 + 0) = 6' },
    { question: 'Számítsd ki a lim(x→0) (sin x)/x határértéket!', answer: 1, type: 'multiplication', expression: 'L\'Hôpital szabály alapján: lim(x→0) (sin x)/x = lim(x→0) cos x/1 = 1' },
    { question: 'Oldd meg a dy/dx = 2x differenciál egyenletet y(0) = 1 kezdeti feltétellel!', answer: 1, type: 'multiplication', expression: 'y = x² + C, y(0) = 1 = 0 + C, tehát C = 1, y = x² + 1' },
    { question: 'Melyik pontban van az f(x) = x³ - 3x² + 2 függvénynek lokális minimuma?', answer: 2, type: 'multiplication', expression: 'f\'(x) = 3x² - 6x = 3x(x-2), f\'\'(x) = 6x - 6, f\'\'(2) = 6 > 0, tehát x = 2-ben minimum' },
    { question: 'Számítsd ki a ∑(n=1 to ∞) 1/n² sor összegét!', answer: 1.645, type: 'multiplication', expression: 'Ez a Riemann zeta függvény ζ(2) = π²/6 ≈ 1.645' },
    { question: 'Számítsd ki az f(x,y) = x² + y² függvény parciális deriváltját ∂f/∂x az (1,2) pontban!', answer: 2, type: 'multiplication', expression: '∂f/∂x = 2x, ∂f/∂x(1,2) = 2·1 = 2' },
    { question: 'Számítsd ki a [[2,1],[3,4]] 2x2-es mátrix determinánsát!', answer: 5, type: 'multiplication', expression: 'det = 2·4 - 1·3 = 8 - 3 = 5' },
    { question: 'Egy kockával dobva, mi a valószínűsége annak, hogy 3-nál nagyobb számot dobunk?', answer: 0.5, type: 'multiplication', expression: 'Kedvező esetek: 4,5,6 (3 db), összes eset: 6, P = 3/6 = 0.5' },
    { question: 'Számítsd ki a (2+3i) + (1-2i) komplex szám összegét!', answer: 3, type: 'multiplication', expression: '(2+3i) + (1-2i) = (2+1) + (3-2)i = 3 + i, valós rész: 3' },
    // C Programozás feladatok
    { question: 'Mi lesz az "int x = 5; printf(\"%d\", ++x);" kimenete?', answer: 6, type: 'multiplication', expression: '++x először növeli x-et 6-ra, majd kiírja: 6' },
    { question: 'Mi lesz az "int arr[5] = {1,2,3,4,5}; printf(\"%d\", arr[2]);" kimenete?', answer: 3, type: 'multiplication', expression: 'arr[2] a tömb harmadik eleme (0-indexelés): 3' },
    { question: 'Mi lesz az "int x = 10; int *p = &x; printf(\"%d\", *p);" kimenete?', answer: 10, type: 'multiplication', expression: 'p mutat x-re, *p az x értékét adja vissza: 10' },
    { question: 'Mi lesz az "int x = 5; int y = x++; printf(\"%d %d\", x, y);" kimenete?', answer: 6, type: 'multiplication', expression: 'x++ először értéket ad y-nak (5), majd növeli x-et (6): "6 5"' },
    { question: 'Mi lesz az "int x = 10; if(x > 5) x = x * 2; printf(\"%d\", x);" kimenete?', answer: 20, type: 'multiplication', expression: 'x > 5 igaz, ezért x = 10 * 2 = 20' },
    { question: 'Mi lesz az "int i, sum = 0; for(i=1; i<=3; i++) sum += i; printf(\"%d\", sum);" kimenete?', answer: 6, type: 'multiplication', expression: 'sum = 1 + 2 + 3 = 6' },
    { question: 'Mi lesz az "char str[] = \"Hello\"; printf(\"%c\", str[0]);" kimenete?', answer: 72, type: 'multiplication', expression: 'str[0] az \'H\' karakter, ASCII kódja: 72' },
    { question: 'Mi lesz az "int x = 15; int y = x / 4; printf(\"%d\", y);" kimenete?', answer: 3, type: 'multiplication', expression: '15 / 4 = 3 (egész osztás)' },
    { question: 'Mi lesz az "int x = 7; int y = x % 3; printf(\"%d\", y);" kimenete?', answer: 1, type: 'multiplication', expression: '7 % 3 = 1 (maradékos osztás)' },
    // Folytonos valószínűségi változók feladatok
    { question: 'Egy egyenletes eloszlású valószínűségi változó a [0,2] intervallumon. Mi a várható értéke?', answer: 1, type: 'multiplication', expression: 'E[X] = (a+b)/2 = (0+2)/2 = 1' },
    { question: 'Egy exponenciális eloszlású valószínűségi változó λ=2 paraméterrel. Mi a várható értéke?', answer: 0.5, type: 'multiplication', expression: 'E[X] = 1/λ = 1/2 = 0.5' },
    { question: 'Egy normális eloszlású valószínűségi változó μ=5, σ=2 paraméterekkel. Mi a várható értéke?', answer: 5, type: 'multiplication', expression: 'E[X] = μ = 5' },
    { question: 'Egy egyenletes eloszlású valószínűségi változó a [0,4] intervallumon. Mi a szórása?', answer: 1.15, type: 'multiplication', expression: 'D[X] = (b-a)/(2√3) = (4-0)/(2√3) = 4/(2√3) ≈ 1.15' },
    { question: 'Egy exponenciális eloszlású valószínűségi változó λ=3 paraméterrel. Mi a szórása?', answer: 0.33, type: 'multiplication', expression: 'D[X] = 1/λ = 1/3 ≈ 0.33' },
    { question: 'Mi lesz az "int x = 5; int y = 3; printf(\"%d\", x > y ? x : y);" kimenete?', answer: 5, type: 'multiplication', expression: 'x > y igaz (5 > 3), ezért az első értéket adja: 5' },
    { question: 'Számítsd ki az f(x) = e^x függvény deriváltját az x = 0 pontban!', answer: 1, type: 'multiplication', expression: 'f\'(x) = e^x, f\'(0) = e^0 = 1' },
    { question: 'Számítsd ki a ∫(x² + 2x)dx integrált 0-tól 1-ig!', answer: 1.33, type: 'multiplication', expression: '∫(x² + 2x)dx = x³/3 + x², [x³/3 + x²]₀¹ = 1/3 + 1 = 4/3 ≈ 1.33' },
    { question: 'Számítsd ki a lim(x→1) (x²-1)/(x-1) határértéket!', answer: 2, type: 'multiplication', expression: 'lim(x→1) (x²-1)/(x-1) = lim(x→1) (x+1)(x-1)/(x-1) = lim(x→1) (x+1) = 2' },
    { question: 'Oldd meg a dy/dx = y differenciál egyenletet y(0) = 1 kezdeti feltétellel!', answer: 1, type: 'multiplication', expression: 'y = Ce^x, y(0) = 1 = C·1, tehát C = 1, y = e^x, y(0) = 1' },
    { question: 'Melyik pontban van az f(x) = x⁴ - 4x² függvénynek lokális maximuma?', answer: 0, type: 'multiplication', expression: 'f\'(x) = 4x³ - 8x = 4x(x²-2), f\'\'(x) = 12x² - 8, f\'\'(0) = -8 < 0, tehát x = 0-ban maximum' },
    { question: 'Számítsd ki a ∑(n=1 to ∞) 1/2ⁿ sor összegét!', answer: 1, type: 'multiplication', expression: 'Geometriai sor: a/(1-r) = (1/2)/(1-1/2) = (1/2)/(1/2) = 1' },
    { question: 'Számítsd ki az f(x,y) = xy függvény parciális deriváltját ∂f/∂y az (2,3) pontban!', answer: 2, type: 'multiplication', expression: '∂f/∂y = x, ∂f/∂y(2,3) = 2' },
    { question: 'Számítsd ki a [[1,2],[0,3]] 2x2-es mátrix determinánsát!', answer: 3, type: 'multiplication', expression: 'det = 1·3 - 2·0 = 3 - 0 = 3' },
    { question: 'Egy érmével dobva, mi a valószínűsége annak, hogy fejet dobunk?', answer: 0.5, type: 'multiplication', expression: 'Kedvező esetek: fej (1 db), összes eset: 2, P = 1/2 = 0.5' },
    { question: 'Számítsd ki a (3+4i) · (1+2i) komplex szám szorzatát!', answer: -5, type: 'multiplication', expression: '(3+4i)(1+2i) = 3 + 6i + 4i + 8i² = 3 + 10i - 8 = -5 + 10i, valós rész: -5' }
];
