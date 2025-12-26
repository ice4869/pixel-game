import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { PixelButton, PixelInput, PixelCard } from '../components/PixelComponents';

const Home = () => {
    const [inputName, setInputName] = useState('');
    const { startGame, loading } = useGame();
    const navigate = useNavigate();

    const handleStart = async () => {
        if (!inputName.trim()) return;

        await startGame(inputName);
        navigate('/game');
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', width: '100%' }}>
            <h1 style={{ fontSize: '3rem', color: 'var(--pixel-primary)', marginBottom: '3rem' }}>
                PIXEL<br />QUIZ
            </h1>

            <PixelCard title="PLAYER SELECT">
                <div style={{ marginBottom: '2rem' }}>
                    <p style={{ marginBottom: '1rem' }}>INSERT COIN OR ENTER ID</p>
                    <PixelInput
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        placeholder="ENTER PLAYER ID..."
                    />
                </div>

                <PixelButton
                    onClick={handleStart}
                    disabled={!inputName.trim() || loading}
                    className={loading ? 'blink' : ''}
                >
                    {loading ? 'LOADING...' : 'PRESS START'}
                </PixelButton>
            </PixelCard>

            <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#666' }}>
                © 2024 DEEPMIND ARCADE
            </div>

            <style>{`
                .blink {
                    animation: blinker 1s linear infinite;
                }
                @keyframes blinker {
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default Home;
