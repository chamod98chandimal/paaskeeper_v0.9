'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav style={{ 
      padding: '1rem', 
      background: '#161b22', 
      backdropFilter: 'blur(10px)',
      border: '1px solid #30363d',
      marginBottom: '2rem',
      position: 'relative'
    }}>
      {/* Desktop Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Logo/Brand */}
        <Link href="/" style={{ 
          fontSize: '1.2rem',
          textDecoration: 'none',
          color: '#58a6ff',
          fontWeight: 700
        }}>PaasKeeper</Link>

        {/* Desktop Menu */}
        <div style={{
          display: isMobile ? 'none' : 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {!isAuthenticated ? (
            <Link href="/login" style={{ 
              fontSize: '1rem',
              textDecoration: 'none',
              color: '#58a6ff',
              fontWeight: 600
            }}>Login</Link>
          ) : (
            <>
              <Link href="/vault" style={{ 
                fontSize: '1rem',
                textDecoration: 'none',
                color: '#58a6ff',
                fontWeight: 600
              }}>Store</Link>
              <Link href="/vault/view" style={{ 
                fontSize: '1rem',
                textDecoration: 'none',
                color: '#58a6ff',
                fontWeight: 600
              }}>View</Link>
              <Link href="/settings" style={{ 
                fontSize: '1rem',
                textDecoration: 'none',
                color: '#58a6ff',
                fontWeight: 600
              }}>Settings</Link>
              <button 
                onClick={logout}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#58a6ff',
                  fontSize: '1rem',
                  fontWeight: 600,
                  padding: 0
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Burger Menu Button */}
        <button
          onClick={toggleMenu}
          style={{
            display: isMobile ? 'block' : 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            color: '#58a6ff'
          }}
          aria-label="Toggle navigation menu"
        >
          <div style={{
            width: '24px',
            height: '3px',
            backgroundColor: '#58a6ff',
            margin: '3px 0',
            transition: '0.3s',
            transform: isMenuOpen ? 'rotate(-45deg) translate(-5px, 6px)' : 'none'
          }}></div>
          <div style={{
            width: '24px',
            height: '3px',
            backgroundColor: '#58a6ff',
            margin: '3px 0',
            transition: '0.3s',
            opacity: isMenuOpen ? '0' : '1'
          }}></div>
          <div style={{
            width: '24px',
            height: '3px',
            backgroundColor: '#58a6ff',
            margin: '3px 0',
            transition: '0.3s',
            transform: isMenuOpen ? 'rotate(45deg) translate(-5px, -6px)' : 'none'
          }}></div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobile && (
        <div style={{
          display: isMenuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem 0',
          borderTop: '1px solid #30363d',
          marginTop: '1rem'
        }}>
          {!isAuthenticated ? (
            <Link 
              href="/login" 
              onClick={closeMenu}
              style={{ 
                fontSize: '1rem',
                textDecoration: 'none',
                color: '#58a6ff',
                fontWeight: 600,
                padding: '0.5rem 0'
              }}
            >Login</Link>
          ) : (
            <>
              <Link 
                href="/vault" 
                onClick={closeMenu}
                style={{ 
                  fontSize: '1rem',
                  textDecoration: 'none',
                  color: '#58a6ff',
                  fontWeight: 600,
                  padding: '0.5rem 0'
                }}
              >Store</Link>
              <Link 
                href="/vault/view" 
                onClick={closeMenu}
                style={{ 
                  fontSize: '1rem',
                  textDecoration: 'none',
                  color: '#58a6ff',
                  fontWeight: 600,
                  padding: '0.5rem 0'
                }}
              >View</Link>
              <Link 
                href="/settings" 
                onClick={closeMenu}
                style={{ 
                  fontSize: '1rem',
                  textDecoration: 'none',
                  color: '#58a6ff',
                  fontWeight: 600,
                  padding: '0.5rem 0'
                }}
              >Settings</Link>
              <button 
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#58a6ff',
                  fontSize: '1rem',
                  fontWeight: 600,
                  padding: '0.5rem 0',
                  textAlign: 'left'
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
