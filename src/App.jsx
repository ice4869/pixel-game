import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import Home from './pages/Home';
import Game from './pages/Game';
import Result from './pages/Result';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
    const { gameState } = useGame();
    if (gameState === 'idle' && window.location.pathname !== '/') {
        return <Navigate to="/" replace />;
    }
    return children;
};

function AppContent() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={
                <ProtectedRoute>
                    <Game />
                </ProtectedRoute>
            } />
            <Route path="/result" element={
                <ProtectedRoute>
                    <Result />
                </ProtectedRoute>
            } />
        </Routes>
    );
}

function App() {
    return (
        <GameProvider>
            <Router basename={import.meta.env.BASE_URL}>
                <AppContent />
            </Router>
        </GameProvider>
    );
}

export default App;
