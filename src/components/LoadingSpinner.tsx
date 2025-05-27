import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  color?: string;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  variant = 'spinner', 
  text = 'Loading...', 
  color = '#2ea043'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: { width: '20px', height: '20px', fontSize: '0.8rem' },
    medium: { width: '40px', height: '40px', fontSize: '1rem' },
    large: { width: '60px', height: '60px', fontSize: '1.2rem' }
  };

  const currentSize = sizeClasses[size];

  const spinnerStyle: React.CSSProperties = {
    width: currentSize.width,
    height: currentSize.height,
    border: `3px solid rgba(139, 148, 158, 0.2)`,
    borderTop: `3px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const dotsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '4px',
    alignItems: 'center'
  };

  const dotStyle: React.CSSProperties = {
    width: size === 'small' ? '6px' : size === 'medium' ? '8px' : '10px',
    height: size === 'small' ? '6px' : size === 'medium' ? '8px' : '10px',
    backgroundColor: color,
    borderRadius: '50%',
    animation: 'bounce 1.4s ease-in-out infinite both'
  };

  const pulseStyle: React.CSSProperties = {
    width: currentSize.width,
    height: currentSize.height,
    backgroundColor: color,
    borderRadius: '50%',
    animation: 'pulse 1.5s ease-in-out infinite'
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '20px'
  };

  const textStyle: React.CSSProperties = {
    fontSize: currentSize.fontSize,
    color: '#c9d1d9',
    fontWeight: '500'
  };

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <div style={dotsStyle}>
            <div style={{ ...dotStyle, animationDelay: '-0.32s' }}></div>
            <div style={{ ...dotStyle, animationDelay: '-0.16s' }}></div>
            <div style={dotStyle}></div>
          </div>
        );
      case 'pulse':
        return <div style={pulseStyle}></div>;
      case 'spinner':
      default:
        return <div style={spinnerStyle}></div>;
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
      <div style={containerStyle}>
        {renderLoader()}
        {text && <div style={textStyle}>{text}</div>}
      </div>
    </>
  );
} 