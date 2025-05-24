'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav style={{ 
      padding: '1rem', 
      background: '#eee', 
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <Link href="/" style={{ 
        marginRight: '1rem',
        fontSize: '1rem',
        textDecoration: 'none',
        color: '#333',
        fontWeight: 500
      }}>Home</Link>
      {!isAuthenticated ? (
        <Link href="/login" style={{ 
          marginRight: '1rem',
          fontSize: '1rem',
          textDecoration: 'none',
          color: '#333',
          fontWeight: 500
        }}>Login</Link>
      ) : (
        <>
          <Link href="/vault" style={{ 
            marginRight: '1rem',
            fontSize: '1rem',
            textDecoration: 'none',
            color: '#333',
            fontWeight: 500
          }}>Store</Link>
          <Link href="/vault/view" style={{ 
            marginRight: '1rem',
            fontSize: '1rem',
            textDecoration: 'none',
            color: '#333',
            fontWeight: 500
          }}>View</Link>
          <Link href="/settings" style={{ 
            marginRight: '1rem',
            fontSize: '1rem',
            textDecoration: 'none',
            color: '#333',
            fontWeight: 500
          }}>Settings</Link>
          <button 
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#333',
              fontSize: '1rem',
              fontWeight: 500,
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
