import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [userId, setUserId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState([]); // [{ questionId, answer }]
    const [gameState, setGameState] = useState('idle'); // idle, playing, loading, finished
    const [bossAvatar, setBossAvatar] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Environment variables
    const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
    const QUESTION_COUNT = import.meta.env.VITE_QUESTION_COUNT || 5;

    const startGame = async (id) => {
        setUserId(id);
        setLoading(true);
        setGameState('loading');
        setError(null);
        setScore(0);
        setCurrentQuestionIndex(0);
        setAnswers([]);

        try {
            // Fetch questions from GAS
            // For development w/o backend, we can mock if GAS_URL is not set
            let fetchedQuestions = [];

            if (GAS_URL) {
                const response = await fetch(`${GAS_URL}?action=getQuestions&count=${QUESTION_COUNT}`);
                if (!response.ok) throw new Error('Network response was not ok');
                fetchedQuestions = await response.json();
            } else {
                console.warn("No VITE_GOOGLE_APP_SCRIPT_URL set, utilizing mock data.");
                // Mock data
                fetchedQuestions = Array.from({ length: 5 }).map((_, i) => ({
                    id: `q${i}`,
                    question: `Mock Question ${i + 1}?`,
                    options: { A: 'Option A', B: 'Option B', C: 'Option C', D: 'Option D' }
                }));
            }

            setQuestions(fetchedQuestions);
            generateBoss();
            setGameState('playing');
        } catch (err) {
            console.error(err);
            setError('Failed to load questions. Please try again.');
            setGameState('idle');
        } finally {
            setLoading(false);
        }
    };

    const generateBoss = () => {
        // DiceBear Pixel Art
        const seed = Math.random().toString(36).substring(7);
        setBossAvatar(`https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`);
    };

    const submitAnswer = (answerKey) => {
        const currentQ = questions[currentQuestionIndex];
        setAnswers(prev => [...prev, { questionId: currentQ.id, answer: answerKey }]);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            generateBoss(); // New boss for new level? Or same boss? 
            // Requirement: "每一關皆配有一個 Pixel 風格的「關主」圖片" -> Yes, new boss per level (question).
        } else {
            finishGame();
        }
    };

    const finishGame = async () => {
        setGameState('finished');
        setLoading(true);

        // Calculate local score for immediate feedback (if grading logic was local), 
        // but requirement says "Send to GAS to calculate score".
        // So we submit to GAS.

        try {
            if (GAS_URL) {
                const payload = {
                    action: 'submitScore',
                    userId: userId,
                    answers: [...answers, {
                        questionId: questions[currentQuestionIndex].id,
                        answer: 'PENDING_LAST_ANSWER' // We need to include the last answer in the state update or pass it directly.
                        // React state update is async, so 'answers' might miss the last one if we just called setAnswers.
                        // Better approach: pass the full array to this function or update 'answers' before calling this.
                        // Let's adjust logic:
                    }]
                };
                // WAIT! submitAnswer is called, then finishGame. 
                // But answers state won't be updated immediately in the same render cycle.
                // We need to handle the last answer submission carefully.
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Revised internal submit logic to handle the async state
    const handleAnswer = async (answerKey) => {
        const currentQ = questions[currentQuestionIndex];
        const newAnswers = [...answers, { questionId: currentQ.id, answer: answerKey }];
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            generateBoss();
        } else {
            // Finished
            setLoading(true);
            // Call Backend
            if (GAS_URL) {
                try {
                    // Use new URLSearchParams to avoid preflight OPTIONS request if using standard JSON
                    // OR send as text/plain. 
                    // Best practice for GAS: send as text/plain, it avoids preflight.
                    const response = await fetch(GAS_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain;charset=utf-8', // vital for GAS to skip OPTIONS
                        },
                        body: JSON.stringify({
                            action: 'submitScore',
                            userId,
                            answers: newAnswers
                        })
                    });

                    const result = await response.json();
                    console.log("Score Submission Result:", result);
                    setScore(result.score);
                } catch (err) {
                    console.error("Submission failed", err);
                    // Fallback score if net fails but we want to show something
                    // But better to show error. 
                    setError("Failed to submit score. Please check console.");
                }
            } else {
                console.warn("No GAS URL provided. Running in offline mode.");
                setScore(Math.floor(Math.random() * 100));
            }
            // End of Outer Else (Game Finished) logic
            setGameState('finished');
            setLoading(false);
        }
    };


    return (
        <GameContext.Provider value={{
            userId,
            setUserId,
            startGame,
            questions,
            currentQuestionIndex,
            currentQuestion: questions[currentQuestionIndex],
            bossAvatar,
            handleAnswer,
            gameState,
            setGameState,
            score,
            loading,
            error
        }}>
            {children}
        </GameContext.Provider>
    );
};
