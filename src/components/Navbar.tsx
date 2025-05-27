'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav style={{ 
      padding: '1rem', 
      background: '#161b22', 
      backdropFilter: 'blur(10px)',
      border: '1px solid #30363d',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <Link href="/" style={{ 
        marginRight: '1rem',
        fontSize: '1rem',
        textDecoration: 'none',
        color: '#58a6ff',
        fontWeight: 600
      }}>Home</Link>
      {!isAuthenticated ? (
        <Link href="/login" style={{ 
          marginRight: '1rem',
          fontSize: '1rem',
          textDecoration: 'none',
          color: '#58a6ff',
          fontWeight: 600
        }}>Login</Link>
      ) : (
        <>
          <Link href="/vault" style={{ 
            marginRight: '1rem',
            fontSize: '1rem',
            textDecoration: 'none',
            color: '#58a6ff',
            fontWeight: 600
          }}>Store</Link>
          <Link href="/vault/view" style={{ 
            marginRight: '1rem',
            fontSize: '1rem',
            textDecoration: 'none',
            color: '#58a6ff',
            fontWeight: 600
          }}>View</Link>
          <Link href="/settings" style={{ 
            marginRight: '1rem',
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
    </nav>
  );
}
