import React from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';

import dashboardImage from '../assets/dashbord.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const authChannel = new BroadcastChannel('AUTH_CHANNEL')

  const accountName = location.state?.accountName;

  const handleLogout = () => {
    // 然後跳轉回登入頁面
    const sessionId = sessionStorage.getItem('session_id');
    sessionStorage.removeItem('access_token');
    authChannel.postMessage({
      type: 'logout',
      payload: {
        sessionId: sessionId,
      },
    });
    navigate('/');
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
      style={{ 
        backgroundImage: `url(${dashboardImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute top-4 right-4">
        <span className="mr-2">Hi, {accountName}</span>
    <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-700" onClick={handleLogout}>登出</button>
  </div>

  <h1>Dashboard</h1>
  <p>歡迎回來！您現在已成功登入。</p>
</div>
  );
};

export default Dashboard;