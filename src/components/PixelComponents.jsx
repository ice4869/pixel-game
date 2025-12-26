import React from 'react';

export const PixelButton = ({ children, onClick, disabled, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`pixel-btn ${className}`}
        style={{
            position: 'relative',
            display: 'inline-block',
            width: '100%', // Ensure it takes full width of grid cell
        }}
    >
        {children}
    </button>
);

export const PixelCard = ({ children, className = '', title }) => (
    <div className={`pixel-card ${className}`}>
        {title && <h3 style={{ marginTop: 0, textAlign: 'center', color: 'var(--pixel-yellow)' }}>{title}</h3>}
        {children}
    </div>
);

export const PixelInput = ({ value, onChange, placeholder }) => (
    <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        spellCheck={false}
    />
);

export const ProgressBar = ({ current, total }) => {
    const percentage = Math.round(((current) / total) * 100);
    return (
        <div style={{ border: '4px solid #fff', height: '30px', width: '100%', background: '#000', position: 'relative', marginBottom: '1rem' }}>
            <div style={{
                width: `${percentage}%`,
                height: '100%',
                background: 'var(--pixel-secondary)',
                transition: 'width 0.3s ease'
            }} />
        </div>
    );
};
