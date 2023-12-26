import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 在這裡實現登出邏輯，例如清除認證令牌等
    // 然後跳轉回登入頁面
    navigate('/');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>歡迎回來！您現在已成功登入。</p>
      <button onClick={handleLogout}>登出</button>
    </div>
  );
};

export default Dashboard;