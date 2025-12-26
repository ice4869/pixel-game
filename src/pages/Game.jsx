import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { PixelButton, PixelCard, ProgressBar } from '../components/PixelComponents';
import { useNavigate } from 'react-router-dom';

const Game = () => {
    const {
        currentQuestion,
        currentQuestionIndex,
        questions,
        bossAvatar,
        handleAnswer,
        gameState,
        loading
    } = useGame();
    const navigate = useNavigate();

    useEffect(() => {
        if (gameState === 'finished') {
            navigate('/result');
        }
    }, [gameState, navigate]);

    if (!currentQuestion) return <div>LOADING STAGE...</div>;

    const { question, options } = currentQuestion;

    return (
        <div style={{ width: '100%' }}>
            {/* Header / HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontFamily: 'var(--font-title)' }}>
                <span>STAGE {currentQuestionIndex + 1}-{questions.length}</span>
                <span style={{ color: 'var(--pixel-primary)' }}>BOSS HP</span>
            </div>

            <ProgressBar current={questions.length - currentQuestionIndex} total={questions.length} />

            {/* Boss Area */}
            <div className="boss-container">
                <div className="boss-wrapper">
                    <img
                        src={bossAvatar}
                        alt="Boss"
                        style={{
                            width: '150px',
                            height: '150px',
                            imageRendering: 'pixelated'
                        }}
                    />
                    {/* Retro speech bubble */}
                    <div className="boss-bubble">
                        "ANSWER ME IF YOU DARE!"
                    </div>
                </div>
            </div>

            {/* Question Card */}
            <PixelCard>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', lineHeight: '1.4' }}>
                    {question}
                </h2>

                <div className="game-options-grid">
                    {Object.entries(options).map(([key, text]) => (
                        <PixelButton
                            key={key}
                            onClick={() => !loading && handleAnswer(key)}
                            disabled={loading}
                            className="option-btn"
                        >
                            <span style={{ color: 'var(--pixel-yellow)' }}>{key}.</span> {text}
                        </PixelButton>
                    ))}
                </div>
            </PixelCard>
        </div>
    );
};

export default Game;
