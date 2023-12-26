import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginButton from './components/LoginButton';

function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // 處理授權碼，通常是將其發送到後端
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginButton />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;