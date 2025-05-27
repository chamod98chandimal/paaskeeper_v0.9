import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface PageLoaderProps {
  message?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
  showLogo?: boolean;
}

export default function PageLoader({ 
  message = 'Loading...', 
  variant = 'spinner',
  showLogo = true 
}: PageLoaderProps) {
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#0d1117',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(2px)'
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '3rem',
    marginBottom: '1rem',
    animation: 'logoFloat 2s ease-in-out infinite alternate'
  };

  const messageStyle: React.CSSProperties = {
    marginTop: '1rem',
    fontSize: '1.1rem',
    color: '#c9d1d9',
    fontWeight: '500'
  };

  return (
    <>
      <style>{`
        @keyframes logoFloat {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-10px);
          }
        }
      `}</style>
      <div style={containerStyle}>
        {showLogo && (
          <div style={logoStyle}>
            🔐
          </div>
        )}
        
        <LoadingSpinner 
          size="large" 
          variant={variant} 
          text=""
          color="#2ea043"
        />
        
        <div style={messageStyle}>
          {message}
        </div>
      </div>
    </>
  );
} 