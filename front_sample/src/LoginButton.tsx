import React from 'react';

const LoginButton = () => {
  const handleLogin = () => {
  const clientId = import.meta.env.VITE_REACT_APP_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REACT_APP_REDIRECT_URI;
  const scope = 'email profile'; // 可根據需要調整scope
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  window.location.href = url;
};

  return <button onClick={handleLogin}>Login with Google</button>;
};

export default LoginButton;