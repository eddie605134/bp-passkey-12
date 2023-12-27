import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { getRegistrationOptions, getAuthenticationOptions, sendRegistrationResponse, sendAuthenticationResponse } from '../services/authService';

const LoginButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = useCallback(async () => {
    setLoading(true);
    try {
      // 直接調用 getRegistrationOptions 函數，而不是使用 mutate
      const registrationOptions = await getRegistrationOptions();
      if (registrationOptions) {
        const attestation = await startRegistration(registrationOptions);
        console.log('attestation: ', attestation);
        await sendRegistrationResponse(attestation);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogin = useCallback(async () => {
    setLoading(true);
    try {
      // 直接調用 getAuthenticationOptions 函數
      const authenticationOptions = await getAuthenticationOptions();
      if (authenticationOptions) {
        const assertion = await startAuthentication(authenticationOptions);
        await sendAuthenticationResponse(assertion);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center ">
        <div className="flex space-x-4">
          <button
            className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 ${loading ? 'opacity-50' : ''}`}
            onClick={handleRegister}
            disabled={loading}
          >
            Register
          </button>
          <button
            className={`px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 ${loading ? 'opacity-50' : ''}`}
            onClick={handleLogin}
            disabled={loading}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginButton;
