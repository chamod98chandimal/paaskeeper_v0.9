import LoadingSpinner from '../../components/LoadingSpinner';

export default function VaultLoading() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
      <LoadingSpinner 
        size="large" 
        variant="spinner" 
        text=""
        color="#4CAF50"
      />
      <div style={{
        marginTop: '1rem',
        fontSize: '1.1rem',
        color: '#555',
        fontWeight: '500'
      }}>
        Loading your secure vault...
      </div>
    </div>
  );
} 