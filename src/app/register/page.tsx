'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '../../context/LoadingContext';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function RegisterPage() {
  const router = useRouter();
  const { showPageLoader, hidePageLoader } = useLoading();
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    password: '',
    pin: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsRegistering(true);

    try {
      // Validate form
      if (!formData.email || !formData.mobile || !formData.password || !formData.pin) {
        setError('Please fill in all fields.');
        return;
      }

      showPageLoader('Creating your account...');

      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 2000));

      showPageLoader('Setting up your vault...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      showPageLoader('Registration complete! Redirecting...');
      
      // Redirect to login
      router.push('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
      hidePageLoader();
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <main style={{ 
      padding: '2rem', 
      maxWidth: '400px', 
      margin: '0 auto' 
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
        <h1 style={{ marginBottom: '0.5rem' }}>Create Account</h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Join Paaskeeper to secure your digital life
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
          <input 
            type="email" 
            id="email"
            name="email" 
            value={formData.email}
            onChange={handleInputChange}
            disabled={isRegistering}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label htmlFor="mobile" style={{ display: 'block', marginBottom: '0.5rem' }}>Mobile:</label>
          <input 
            type="tel" 
            id="mobile"
            name="mobile" 
            value={formData.mobile}
            onChange={handleInputChange}
            disabled={isRegistering}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
          <input 
            type="password" 
            id="password"
            name="password" 
            value={formData.password}
            onChange={handleInputChange}
            disabled={isRegistering}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label htmlFor="pin" style={{ display: 'block', marginBottom: '0.5rem' }}>Security Pin:</label>
          <input 
            type="password" 
            id="pin"
            name="pin" 
            value={formData.pin}
            onChange={handleInputChange}
            disabled={isRegistering}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
        </div>

        <button 
          type="submit"
          disabled={isRegistering}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            backgroundColor: isRegistering ? '#ccc' : '#2ea043',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isRegistering ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.2s ease'
          }}
        >
          {isRegistering && <LoadingSpinner size="small" variant="spinner" text="" />}
          {isRegistering ? 'Creating Account...' : '✨ Create Account'}
        </button>

        {error && (
          <div style={{ 
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#FFEBEE',
            color: '#C62828',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            ❌ {error}
          </div>
        )}
      </form>
    </main>
  );
}
  