import React, { useState } from 'react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';

import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { getRegistrationOptions, getAuthenticationOptions, sendRegistrationResponse, sendAuthenticationResponse } from '../services/authService';

const LoginButton = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const { data: registrationOptions, mutate: mutateRegistration } = useSWR('/api/auth/register', () => getRegistrationOptions(username), { shouldRetryOnError: false });
  const { data: authenticationOptions, mutate: mutateAuthentication } = useSWR('/api/auth/login', () => getAuthenticationOptions(username), { shouldRetryOnError: false });

  const handleRegister = async () => {
    if (registrationOptions) {
      const attestation = await startRegistration(registrationOptions);
      await sendRegistrationResponse(attestation);
      mutateRegistration();
      navigate('/dashboard');
    }
  };

  const handleLogin = async () => {
    if (authenticationOptions) {
      const assertion = await startAuthentication(authenticationOptions);
      await sendAuthenticationResponse(assertion);
      mutateAuthentication();
      navigate('/dashboard');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginButton;