export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  const browser = {
    chrome: /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor),
    firefox: /Firefox/.test(userAgent),
    safari: /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor),
    edge: /Edg/.test(userAgent),
  };
  
  return {
    browser,
    userAgent,
    localStorage: typeof Storage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
    indexedDB: typeof indexedDB !== 'undefined',
  };
};

export const debugLitProtocolState = async () => {
  console.log('=== Lit Protocol Debug Info ===');
  console.log('Browser Info:', getBrowserInfo());
  console.log('Local Storage Keys:', Object.keys(localStorage));
  console.log('Session Storage Keys:', Object.keys(sessionStorage));
  console.log('Paaskeeper Wallet:', localStorage.getItem('paaskeeper_wallet'));
  console.log('Paaskeeper Token:', localStorage.getItem('paaskeeper_token'));
  
  // Check current network
  if (window.ethereum) {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      console.log('Current Chain ID:', chainId);
      console.log('Connected Accounts:', accounts);
    } catch (error) {
      console.log('Failed to get network info:', error);
    }
  }
  
  // Check for Lit Protocol related storage
  const litKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('lit') || key.includes('session') || key.includes('auth'))) {
      litKeys.push(key);
    }
  }
  console.log('Lit Protocol related keys:', litKeys);
  console.log('==============================');
};

export const clearAllAuthData = () => {
  console.log('Clearing all authentication data...');
  
  // Clear paaskeeper specific data
  localStorage.removeItem('paaskeeper_wallet');
  localStorage.removeItem('paaskeeper_token');
  
  // Clear any Lit Protocol related storage
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('lit') || key.includes('session') || key.includes('auth'))) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    console.log('Removing key:', key);
    localStorage.removeItem(key);
  });
  
  // Clear session storage as well
  sessionStorage.clear();
  
  console.log('All authentication data cleared');
}; 