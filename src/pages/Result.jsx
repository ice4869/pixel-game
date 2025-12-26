import React from 'react';
import { useGame } from '../context/GameContext';
import { PixelButton, PixelCard } from '../components/PixelComponents';
import { useNavigate } from 'react-router-dom';

const Result = () => {
    const { score, userId, loading } = useGame();
    const navigate = useNavigate();

    // Default threshold from env or 60
    const PASS_THRESHOLD_PERCENT = 60;
    const isPass = score >= PASS_THRESHOLD_PERCENT;

    return (
        <div style={{ textAlign: 'center', width: '100%' }}>
            <h1 style={{
                fontSize: '4rem',
                color: isPass ? 'var(--pixel-secondary)' : 'var(--pixel-primary)',
                marginBottom: '1rem'
            }}>
                {isPass ? 'STAGE CLEAR!' : 'GAME OVER'}
            </h1>

            <PixelCard>
                <div style={{ marginBottom: '2rem' }}>
                    <p>PLAYER ID: <span style={{ color: 'var(--pixel-accent)' }}>{userId}</span></p>
                    <div style={{ fontSize: '3rem', margin: '2rem 0', fontFamily: 'var(--font-title)' }}>
                        SCORE: {score}
                    </div>

                    {loading ? (
                        <p>SAVING SCORE...</p>
                    ) : (
                        <p style={{ color: isPass ? 'var(--pixel-secondary)' : 'var(--pixel-primary)' }}>
                            {isPass ? "EXCELLENT WORK, HERO!" : "DON'T GIVE UP!"}
                        </p>
                    )}
                </div>

                <PixelButton onClick={() => navigate('/')}>
                    TRY AGAIN
                </PixelButton>
            </PixelCard>
        </div>
    );
};

export default Result;
