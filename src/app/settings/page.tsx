'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import dynamic from 'next/dynamic';

type Section = 'verification' | 'setPassword' | 'resetPassword' | 'reverification';

interface DetectionWithData {
  detection: any; // We'll type this properly when face-api is loaded
  landmarks: any;
  descriptor: Float32Array;
}

// Move loadFaceApiModels into a client-side only context
const loadFaceApiModels = async (faceapi: any) => {
  if (typeof window === 'undefined') return; // Guard against server-side execution
  
  const modelBaseUrl = 'https://vladmandic.github.io/face-api/model';
  
  try {
    const loadModels = [
      { name: 'Tiny Face Detector', loader: faceapi.nets.tinyFaceDetector.loadFromUri(modelBaseUrl) },
      { name: 'Face Landmark Model', loader: faceapi.nets.faceLandmark68Net.loadFromUri(modelBaseUrl) },
      { name: 'Face Recognition Model', loader: faceapi.nets.faceRecognitionNet.loadFromUri(modelBaseUrl) },
      { name: 'Face Expression Model', loader: faceapi.nets.faceExpressionNet.loadFromUri(modelBaseUrl) }
    ];

    for (const model of loadModels) {
      try {
        await model.loader;
        console.log(`Loaded ${model.name}`);
      } catch (error) {
        console.error(`Error loading ${model.name}:`, error);
        throw new Error(`Failed to load ${model.name}`);
      }
    }
  } catch (error) {
    console.error('Error in loadFaceApiModels:', error);
    throw error;
  }
}

export default function Settings() {
  const { account } = useAuth();
  const { showPageLoader, hidePageLoader } = useLoading();
  const [activeSection, setActiveSection] = useState<Section>('verification');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState('');
  
  // New state variables for managing section access
  const [hasPassword, setHasPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isReVerified, setIsReVerified] = useState(false);
  const [verificationTimer, setVerificationTimer] = useState<NodeJS.Timeout | null>(null);
  const [reVerificationTimer, setReVerificationTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Face verification states
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  // Add state for face-api instance
  const [faceApi, setFaceApi] = useState<any>(null);

  // Fetch user status on mount and when account changes
  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!account) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/status?walletAddress=${account}`);
        const data = await response.json();

        if (response.ok) {
          setHasPassword(data.hasPassword);
          setIsVerified(data.isVerified);
          setIsReVerified(data.isReVerified);

          // Set active section based on status
          if (!data.hasPassword) {
            if (data.isVerified) {
              setActiveSection('setPassword');
              startVerificationTimer();
            } else {
              setActiveSection('verification');
            }
          } else {
            if (data.isReVerified) {
              setActiveSection('resetPassword');
              startReVerificationTimer();
            } else {
              setActiveSection('reverification');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStatus();
  }, [account]);

  // Update user status in database
  const updateUserStatus = async (update: {
    hasPassword?: boolean;
    isVerified?: boolean;
    isReVerified?: boolean;
  }) => {
    if (!account) return;

    try {
      await fetch('/api/auth/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: account,
          ...update,
        }),
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Initialize face-api on the client side only
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeFaceApi = async () => {
      try {
        setIsModelLoading(true);
        setVerificationStatus('Loading face detection models...');
        
        // Dynamically import face-api
        const faceApiModule = await import('@vladmandic/face-api');
        setFaceApi(faceApiModule);
        
        await loadFaceApiModels(faceApiModule);
        
        setIsModelLoading(false);
        setVerificationStatus('');
      } catch (error) {
        console.error('Error initializing face-api:', error);
        setIsModelLoading(false);
        setVerificationStatus('Failed to load face detection models. Please refresh the page to try again.');
      }
    };

    initializeFaceApi();

    return () => {
      // Use enhanced cleanup on component unmount
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      // Clean up any existing camera stream first
      if (videoRef.current?.srcObject) {
        const existingStream = videoRef.current.srcObject as MediaStream;
        existingStream.getTracks().forEach(track => {
          track.stop();
        });
        videoRef.current.srcObject = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setVerificationStatus('');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setVerificationStatus('Error accessing camera. Please ensure you have granted camera permissions.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    try {
      console.log('stopCamera called, isCameraActive:', isCameraActive);
      console.log('videoRef.current?.srcObject:', videoRef.current?.srcObject);
      
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        console.log('Found tracks:', tracks.length);
        
        tracks.forEach(track => {
          console.log('Stopping track:', track.kind, 'state:', track.readyState);
          track.stop();
          console.log('Track stopped, new state:', track.readyState);
        });
        
        videoRef.current.srcObject = null;
        console.log('Video srcObject set to null');
      }
      
      // Also try to pause and reset the video element
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        // Force a reload of the video element to ensure it's completely reset
        videoRef.current.load();
      }
      
      setIsCameraActive(false);
      setVerificationStatus('');
      console.log('Camera state updated: isCameraActive = false');
    } catch (error) {
      console.error('Error stopping camera:', error);
      // Force state update even if stopping fails
      setIsCameraActive(false);
      setVerificationStatus('');
    }
  };

  // Enhanced camera cleanup function
  const cleanupCamera = useCallback(() => {
    try {
      // First, immediately update state to hide video
      setIsCameraActive(false);
      setIsProcessing(false);
      
      // Stop all tracks from the current video stream
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        
        tracks.forEach((track) => {
          track.stop();
        });
        
        // Clear the video source
        videoRef.current.srcObject = null;
      }

      // Reset video element completely
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.load();
        
        // Force hide the video element
        videoRef.current.style.display = 'none';
      }

      // Clear verification status after a short delay to show success message briefly
      setTimeout(() => {
        setVerificationStatus('');
      }, 2000);
      
    } catch (error) {
      console.error('Error in cleanupCamera:', error);
      // Force state reset even if cleanup fails
      setIsCameraActive(false);
      setVerificationStatus('');
      setIsProcessing(false);
      
      // Force hide video element even on error
      if (videoRef.current) {
        videoRef.current.style.display = 'none';
      }
    }
  }, []);

  const detectFace = async (): Promise<DetectionWithData | null> => {
    if (!videoRef.current || !faceApi) return null;

    try {
      const options = new faceApi.TinyFaceDetectorOptions({ inputSize: 320 });
      const result = await faceApi.detectSingleFace(videoRef.current, options)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!result) return null;

      return {
        detection: result.detection,
        landmarks: result.landmarks,
        descriptor: result.descriptor
      };
    } catch (error) {
      console.error('Error detecting face:', error);
      return null;
    }
  };

  const checkLiveness = async (detection: DetectionWithData) => {
    if (!videoRef.current || !faceApi) return 0;

    try {
      const result = await faceApi
        .detectSingleFace(videoRef.current, new faceApi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!result) return 0;
      
      const expressions = result.expressions as Record<string, number>;
      const hasExpression = Object.entries(expressions).some(([_, score]: [string, number]) => score > 0.5);
      
      const positions = detection.landmarks.positions;
      const movement = positions.reduce((sum: number, point: { x: number; y: number }) => {
        return sum + Math.abs(point.x) + Math.abs(point.y);
      }, 0);
      
      return hasExpression ? 0.95 : 0.3;
    } catch (error) {
      console.error('Error checking liveness:', error);
      return 0;
    }
  };

  // Function to check if a section should be locked
  const isSectionLocked = (section: Section): boolean => {
    if (!hasPassword) {
      // Case 1: User hasn't set password
      if (!isVerified) {
        // Initial state - only verification is unlocked
        return section !== 'verification';
      } else {
        // After verification - only set password is unlocked for 1 minute
        return section !== 'setPassword';
      }
    } else {
      // Case 2: User has set password
      if (!isReVerified) {
        // Initial state - only re-verification is unlocked
        return section !== 'reverification';
      } else {
        // After re-verification - only reset password is unlocked for 1 minute
        return section !== 'resetPassword';
      }
    }
  };

  // Function to start timer after verification
  const startVerificationTimer = () => {
    if (verificationTimer) {
      clearTimeout(verificationTimer);
    }
    
    const timer = setTimeout(() => {
      // Stop camera when timer expires
      if (isCameraActive) {
        cleanupCamera();
      }
      setIsVerified(false);
      setActiveSection('verification');
    }, 60000); // 1 minute
    
    setVerificationTimer(timer);
  };

  // Function to start timer after re-verification
  const startReVerificationTimer = () => {
    if (reVerificationTimer) {
      clearTimeout(reVerificationTimer);
    }
    
    const timer = setTimeout(() => {
      // Stop camera when timer expires
      if (isCameraActive) {
        cleanupCamera();
      }
      setIsReVerified(false);
      setActiveSection('reverification');
    }, 60000); // 1 minute
    
    setReVerificationTimer(timer);
  };

  // Cleanup timers and camera on unmount
  useEffect(() => {
    return () => {
      // Cleanup timers
      if (verificationTimer) clearTimeout(verificationTimer);
      if (reVerificationTimer) clearTimeout(reVerificationTimer);
      
      // Cleanup camera on unmount using enhanced cleanup
      cleanupCamera();
    };
  }, [verificationTimer, reVerificationTimer, cleanupCamera]);

  // Handle camera cleanup when switching away from verification sections
  useEffect(() => {
    // If we're not in a verification section and camera is active, clean it up
    if (activeSection !== 'verification' && activeSection !== 'reverification' && isCameraActive) {
      cleanupCamera();
    }
  }, [activeSection, isCameraActive, cleanupCamera]);

  // Force video element hiding when camera is not active
  useEffect(() => {
    if (videoRef.current) {
      if (!isCameraActive) {
        videoRef.current.style.display = 'none';
        videoRef.current.style.visibility = 'hidden';
      } else {
        videoRef.current.style.display = 'block';
        videoRef.current.style.visibility = 'visible';
      }
    }
  }, [isCameraActive]);

  // Modified verification handler
  const handleVerification = async (isReverification = false) => {
    if (!account || isProcessing) return;
    
    setIsProcessing(true);
    setVerificationStatus('Processing...');

    try {
      const detection = await detectFace();
      
      if (!detection) {
        setVerificationStatus('No face detected. Please ensure your face is clearly visible.');
        setIsProcessing(false);
        // Don't stop camera here - let user try again without restarting camera
        return;
      }

      const livenessScore = await checkLiveness(detection);
      const faceEmbedding = Array.from(detection.descriptor);

      const endpoint = isReverification ? '/api/auth/face-reverify' : '/api/auth/face-verify';
      const payload = isReverification 
        ? {
            walletAddress: account,
            currentFaceEmbedding: faceEmbedding,
            newFaceEmbedding: faceEmbedding,
            livenessScore
          }
        : {
            walletAddress: account,
            faceEmbedding,
            livenessScore
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        // Immediately stop camera first
        cleanupCamera();
        
        if (isReverification) {
          setIsReVerified(true);
          setActiveSection('resetPassword');
          startReVerificationTimer();
          await updateUserStatus({ isReVerified: true });
          setVerificationStatus('Re-verification successful!');
        } else {
          setIsVerified(true);
          setActiveSection('setPassword');
          startVerificationTimer();
          await updateUserStatus({ isVerified: true });
          setVerificationStatus('Verification successful! You can now set your password.');
        }
      } else {
        setVerificationStatus(data.message || 'Verification failed. Please try again.');
        // Use enhanced cleanup function for failed verification
        cleanupCamera();
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('An error occurred during verification');
      // Use enhanced cleanup function for error cases
      cleanupCamera();
    }

    setIsProcessing(false);
  };

  // Modified password handlers
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      showPageLoader('Setting password...');
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: account,
          password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to set password');
      }

      // Clear form and update state
      setNewPassword('');
      setConfirmPassword('');
      setHasPassword(true);
      setIsVerified(false);
      setActiveSection('reverification');
      if (verificationTimer) clearTimeout(verificationTimer);
      await updateUserStatus({ hasPassword: true, isVerified: false });
      alert('Password set successfully!');
    } catch (error) {
      setPasswordError('Failed to set password. Please try again.');
      console.error('Error setting password:', error);
    } finally {
      hidePageLoader();
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetPasswordError('');

    if (resetNewPassword.length < 6) {
      setResetPasswordError('Password must be at least 6 characters long');
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setResetPasswordError('Passwords do not match');
      return;
    }

    try {
      showPageLoader('Resetting password...');
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: account,
          password: resetNewPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      // Clear form and update state
      setResetNewPassword('');
      setResetConfirmPassword('');
      setIsReVerified(false);
      setActiveSection('reverification');
      if (reVerificationTimer) clearTimeout(reVerificationTimer);
      await updateUserStatus({ isReVerified: false });
      alert('Password reset successfully!');
    } catch (error) {
      setResetPasswordError('Failed to reset password. Please try again.');
      console.error('Error resetting password:', error);
    } finally {
      hidePageLoader();
    }
  };

  // Modified section click handler
  const handleSectionClick = (section: Section) => {
    if (!isSectionLocked(section)) {
      // Stop camera when switching away from verification sections
      if (isCameraActive && (activeSection === 'verification' || activeSection === 'reverification')) {
        cleanupCamera();
      }
      setActiveSection(section);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'verification':
        return (
          <div style={{ textAlign: 'center' }}>
            {isModelLoading ? (
              <div>Loading face detection models...</div>
            ) : (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      display: isCameraActive ? 'block' : 'none',
                      width: '350px',
                      height: '300px',
                      margin: '0 auto',
                      visibility: isCameraActive ? 'visible' : 'hidden',
                      transform: 'scaleX(-1)',
                      borderRadius: '8px',
                      border: '2px solid #ddd'
                    }}
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
                
                {!isCameraActive ? (
                  <button
                    onClick={startCamera}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                    }}
                  >
                    Start Verification
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={() => handleVerification(false)}
                      disabled={isProcessing}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: isProcessing ? '#ccc' : '#2ea043',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isProcessing ? 'default' : 'pointer',
                        fontSize: '1rem',
                        opacity: isProcessing ? 0.8 : 1,
                        marginRight: '1rem',
                        position: 'relative',
                        minWidth: '140px'
                      }}
                    >
                      {isProcessing ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{
                            display: 'inline-block',
                            width: '16px',
                            height: '16px',
                            border: '2px solid transparent',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginRight: '8px'
                          }}></span>
                          Verifying...
                        </span>
                      ) : (
                        'Verify Face'
                      )}
                    </button>
                    <button
                      onClick={cleanupCamera}
                      disabled={isProcessing}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isProcessing ? 'default' : 'pointer',
                        fontSize: '1rem',
                        opacity: isProcessing ? 0.7 : 1
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                
                {verificationStatus && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: verificationStatus.includes('successful') ? '#e8f5e9' : '#ffebee',
                    borderRadius: '4px',
                    color: verificationStatus.includes('successful') ? '#2e7d32' : '#c62828'
                  }}>
                    {verificationStatus}
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 'reverification':
        return (
          <div style={{ textAlign: 'center' }}>
            {isModelLoading ? (
              <div>Loading face detection models...</div>
            ) : (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      display: isCameraActive ? 'block' : 'none',
                      width: '350px',
                      height: '300px',
                      margin: '0 auto',
                      visibility: isCameraActive ? 'visible' : 'hidden',
                      transform: 'scaleX(-1)',
                      borderRadius: '8px',
                      border: '2px solid #ddd'
                    }}
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
                
                {!isCameraActive ? (
                  <button
                    onClick={startCamera}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#9C27B0',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                    }}
                  >
                    Start Re-verification
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={() => handleVerification(true)}
                      disabled={isProcessing}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: isProcessing ? '#ccc' : '#9C27B0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isProcessing ? 'default' : 'pointer',
                        fontSize: '1rem',
                        opacity: isProcessing ? 0.8 : 1,
                        marginRight: '1rem',
                        position: 'relative',
                        minWidth: '160px'
                      }}
                    >
                      {isProcessing ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{
                            display: 'inline-block',
                            width: '16px',
                            height: '16px',
                            border: '2px solid transparent',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginRight: '8px'
                          }}></span>
                          Re-verifying...
                        </span>
                      ) : (
                        'Re-verify Face'
                      )}
                    </button>
                    <button
                      onClick={cleanupCamera}
                      disabled={isProcessing}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isProcessing ? 'default' : 'pointer',
                        fontSize: '1rem',
                        opacity: isProcessing ? 0.7 : 1
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
                
                {verificationStatus && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: verificationStatus.includes('successful') ? '#e8f5e9' : '#ffebee',
                    borderRadius: '4px',
                    color: verificationStatus.includes('successful') ? '#2e7d32' : '#c62828'
                  }}>
                    {verificationStatus}
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 'setPassword':
        return (
          <>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              marginBottom: '1.5rem',
            }}>
              <p style={{ margin: 0, color: '#666' }}>Wallet Address:</p>
              <p style={{ 
                margin: '0.5rem 0 0 0',
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}>
                {account || 'Not connected'}
              </p>
            </div>
            <form onSubmit={handleSetPassword}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password (min. 6 characters)"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      paddingRight: '40px',
                      border: `1px solid ${passwordError ? '#ff4444' : '#ddd'}`,
                      borderRadius: '4px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#666',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {showNewPassword ? '👁️‍🗨️' : '👁️'}
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      paddingRight: '40px',
                      border: `1px solid ${passwordError ? '#ff4444' : '#ddd'}`,
                      borderRadius: '4px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#666',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
                  </button>
                </div>
                {passwordError && (
                  <div style={{
                    color: '#ff4444',
                    fontSize: '0.875rem',
                    marginTop: '0.5rem'
                  }}>
                    {passwordError}
                  </div>
                )}
              </div>
              <button
                type="submit"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2ea043',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Set Password
              </button>
            </form>
          </>
        );

      case 'resetPassword':
        return (
          <>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              marginBottom: '1.5rem',
            }}>
              <p style={{ margin: 0, color: '#666' }}>Wallet Address:</p>
              <p style={{ 
                margin: '0.5rem 0 0 0',
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}>
                {account || 'Not connected'}
              </p>
            </div>
            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                  <input
                    type={showResetNewPassword ? "text" : "password"}
                    placeholder="New password (min. 6 characters)"
                    value={resetNewPassword}
                    onChange={(e) => {
                      setResetNewPassword(e.target.value);
                      setResetPasswordError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      paddingRight: '40px',
                      border: `1px solid ${resetPasswordError ? '#ff4444' : '#ddd'}`,
                      borderRadius: '4px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#666',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {showResetNewPassword ? '👁️‍🗨️' : '👁️'}
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showResetConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={resetConfirmPassword}
                    onChange={(e) => {
                      setResetConfirmPassword(e.target.value);
                      setResetPasswordError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      paddingRight: '40px',
                      border: `1px solid ${resetPasswordError ? '#ff4444' : '#ddd'}`,
                      borderRadius: '4px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#666',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {showResetConfirmPassword ? '👁️‍🗨️' : '👁️'}
                  </button>
                </div>
                {resetPasswordError && (
                  <div style={{
                    color: '#ff4444',
                    fontSize: '0.875rem',
                    marginTop: '0.5rem'
                  }}>
                    {resetPasswordError}
                  </div>
                )}
              </div>
              <button
                type="submit"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#FF5722',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Reset Password
              </button>
            </form>
          </>
        );
    }
  };

  // Add loading state to the UI
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}>
        <LoadingSpinner 
          size="large" 
          variant="spinner" 
          text="Loading settings..."
        />
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem',
    }}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <h1 style={{
        fontSize: '2rem',
        marginBottom: '2rem',
        color: '#c9d1d9',
      }}>Settings</h1>

      <div style={{
        display: 'flex',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        {/* Sidebar */}
        <div style={{
          width: '250px',
          borderRight: '1px solid #eee',
          padding: '1.5rem',
        }}>
          {['verification', 'setPassword', 'reverification', 'resetPassword'].map((section) => (
            <div
              key={section}
              onClick={() => handleSectionClick(section as Section)}
              style={{
                padding: '0.75rem 1rem',
                marginBottom: '0.5rem',
                borderRadius: '4px',
                cursor: isSectionLocked(section as Section) ? 'not-allowed' : 'pointer',
                backgroundColor: activeSection === section ? '#f0f0f0' : 'transparent',
                color: isSectionLocked(section as Section) 
                  ? '#999' 
                  : section === 'verification' 
                    ? '#2196F3' 
                    : section === 'setPassword' 
                      ? '#2ea043' 
                      : section === 'reverification' 
                        ? '#9C27B0' 
                        : '#FF5722',
                fontWeight: activeSection === section ? 'bold' : 'normal',
                opacity: isSectionLocked(section as Section) ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
              {isSectionLocked(section as Section) && (
                <span style={{ marginLeft: '8px' }}>🔒</span>
              )}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          padding: '2rem',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
            color: '#444',
          }}>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
          </h2>
          {isSectionLocked(activeSection) ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#666',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
            }}>
              <span style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}>🔒</span>
              <p>This section is currently locked. Please complete the required steps to access it.</p>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
} 
