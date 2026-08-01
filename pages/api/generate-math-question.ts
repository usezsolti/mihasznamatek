import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { topic, difficulty = 'közepes' } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const openaiApiKey = process.env.OPENAI_API_KEY;

        if (!openaiApiKey) {
            console.log('OpenAI API key not configured, returning fallback question');
            // Fallback question for testing
            const fallbackQuestions = {
                'deriválás': {
                    question: 'Számítsd ki az f(x) = x² + 3x + 2 függvény deriváltját az x = 2 pontban!',
                    answer: 7,
                    explanation: 'f\'(x) = 2x + 3, f\'(2) = 2·2 + 3 = 7'
                },
                'integrálás': {
                    question: 'Számítsd ki a ∫(2x + 1)dx integrált 0-tól 2-ig!',
                    answer: 6,
                    explanation: '∫(2x + 1)dx = x² + x, [x² + x]₀² = (4 + 2) - (0 + 0) = 6'
                },
                'határértékszámítás': {
                    question: 'Számítsd ki a lim(x→0) (sin x)/x határértéket!',
                    answer: 1,
                    explanation: 'L\'Hôpital szabály alapján: lim(x→0) (sin x)/x = lim(x→0) cos x/1 = 1'
                },
                'differenciál egyenletek': {
                    question: 'Oldd meg a dy/dx = 2x differenciál egyenletet y(0) = 1 kezdeti feltétellel!',
                    answer: 1,
                    explanation: 'y = x² + C, y(0) = 1 = 0 + C, tehát C = 1, y = x² + 1'
                },
                'függvényvizsgálat': {
                    question: 'Melyik pontban van az f(x) = x³ - 3x² + 2 függvénynek lokális minimuma?',
                    answer: 2,
                    explanation: 'f\'(x) = 3x² - 6x = 3x(x-2), f\'\'(x) = 6x - 6, f\'\'(2) = 6 > 0, tehát x = 2-ben minimum'
                },
                'sorozatok és sorok': {
                    question: 'Számítsd ki a ∑(n=1 to ∞) 1/n² sor összegét!',
                    answer: 1.645,
                    explanation: 'Ez a Riemann zeta függvény ζ(2) = π²/6 ≈ 1.645'
                },
                'többváltozós függvények': {
                    question: 'Számítsd ki az f(x,y) = x² + y² függvény parciális deriváltját ∂f/∂x az (1,2) pontban!',
                    answer: 2,
                    explanation: '∂f/∂x = 2x, ∂f/∂x(1,2) = 2·1 = 2'
                },
                'lineáris algebra': {
                    question: 'Számítsd ki a [[2,1],[3,4]] 2x2-es mátrix determinánsát!',
                    answer: 5,
                    explanation: 'det = 2·4 - 1·3 = 8 - 3 = 5'
                },
                'valószínűségszámítás': {
                    question: 'Egy kockával dobva, mi a valószínűsége annak, hogy 3-nál nagyobb számot dobunk?',
                    answer: 0.5,
                    explanation: 'Kedvező esetek: 4,5,6 (3 db), összes eset: 6, P = 3/6 = 0.5'
                },
                'komplex számok': {
                    question: 'Számítsd ki a (2+3i) + (1-2i) komplex szám összegét!',
                    answer: 3,
                    explanation: '(2+3i) + (1-2i) = (2+1) + (3-2)i = 3 + i, valós rész: 3'
                }
            };

            const fallback = fallbackQuestions[topic as keyof typeof fallbackQuestions] || fallbackQuestions['deriválás'];

            return res.status(200).json({
                success: true,
                question: fallback.question,
                answer: fallback.answer,
                explanation: fallback.explanation,
                type: topic,
                fallback: true
            });
        }

        const prompt = `Generate a ${difficulty} level university mathematics question about ${topic}. 
        The question should be solvable by hand and have a clear numerical answer.
        
        Return the response in this exact JSON format:
        {
            "question": "The mathematical question here",
            "answer": "The numerical answer",
            "explanation": "Step-by-step solution explanation",
            "type": "${topic}"
        }
        
        Make sure the answer is a single number or simple expression that can be evaluated to a number.
        The question should be in Hungarian language.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a mathematics professor who creates clear, solvable university-level math problems. Always respond in valid JSON format.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            throw new Error('No content received from OpenAI');
        }

        // Parse the JSON response
        let questionData;
        try {
            questionData = JSON.parse(content);
        } catch (parseError) {
            // If JSON parsing fails, try to extract JSON from the response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                questionData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('Could not parse JSON from OpenAI response');
            }
        }

        // Validate the response structure
        if (!questionData.question || !questionData.answer) {
            throw new Error('Invalid question data structure');
        }

        res.status(200).json({
            success: true,
            question: questionData.question,
            answer: questionData.answer,
            explanation: questionData.explanation || 'Nincs magyarázat elérhető.',
            type: questionData.type || topic
        });

    } catch (error) {
        console.error('Error generating math question:', error);
        res.status(500).json({
            error: 'Failed to generate math question',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
