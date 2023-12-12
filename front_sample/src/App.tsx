import React, { useEffect } from 'react';
import LoginButton from './LoginButton';

function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // 處理授權碼，通常是將其發送到後端
    }
  }, []);

  return (
    <div>
      <LoginButton />
    </div>
  );
}

export default App;