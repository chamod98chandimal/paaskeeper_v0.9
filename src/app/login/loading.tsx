import LoadingSpinner from '../../components/LoadingSpinner';

export default function LoginLoading() {
  return (
    <div style={{
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
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
      <LoadingSpinner 
        size="large" 
        variant="spinner" 
        text=""
        color="#2ea043"
      />
      <div style={{
        marginTop: '1rem',
        fontSize: '1.1rem',
        color: '#c9d1d9',
        fontWeight: '500'
      }}>
        Preparing login...
      </div>
    </div>
  );
} 