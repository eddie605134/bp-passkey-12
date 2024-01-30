import React, { useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

// import LoginButton from './components/LoginButton';
import LoginChannel from './components/LoginChannel';
import Dashboard from './components/Dashboard';

import { showAlertWithAction } from './utils/swal';

type LoginCast = {
  type: 'login',
  payload: {
    token: string
  }
}

type RefreshCast = {
  type: 'refresh',
  payload: {
    token: string
  }
}

type LogoutCast = {
  type: 'logout',
  payload: {
    sessionId: string
  }
}

type AuthChannelType = LoginCast | RefreshCast | LogoutCast; 

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const authChannel = new BroadcastChannel('AUTH_CHANNEL')

  const loginCastListener = (token: string) => {
    sessionStorage.setItem('access_token', token);
  }

  const refreshCastListener = (token: string) => {
    sessionStorage.setItem('access_token', token);
  }

  const logoutCastListener = (sessionId: string) => {
    const mySessionId = sessionStorage.getItem('session_id');
    const pathname = location.pathname;
    if (sessionId !== mySessionId && pathname !== '/') {
    // if (pathname !== '/') {
      sessionStorage.removeItem('access_token');
      navigate('/');
      showAlertWithAction('超派鐵拳', () => {})
    }
  }

  const authChannelListener = (authData: AuthChannelType) => {
    switch (authData.type) {
      case 'login':
        loginCastListener(authData.payload.token)
        break;
      case 'refresh':
        refreshCastListener(authData.payload.token)
        break;
      case 'logout':
        logoutCastListener(authData.payload.sessionId)
        break;
      default:
        break;
    }
  }

  authChannel.onmessage = (event) => {
    console.log('event.data: ', event.data);
    if (event.data) {
      authChannelListener(event.data)
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // 處理授權碼，通常是將其發送到後端
    }
    const sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      const sessionId = Math.random().toString(36).substring(2, 15)
      sessionStorage.setItem('session_id', sessionId);
    }
    
    return () => {
      authChannel.close();
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        {/* <Route path="/" element={<LoginButton />} /> */}
        <Route path="/" element={<LoginChannel />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;