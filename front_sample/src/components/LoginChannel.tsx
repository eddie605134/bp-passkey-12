import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { showAlertWithAction, showAlertWithConfirmAndCancel } from '../utils/swal';

type UserLoginInfo = {
  accountName: string,
  accessToken: string,
}

const userList: UserLoginInfo[] = [
  {
    accountName: 'Toyz',
    accessToken: 'toyz1234567890',
  },
  {
    accountName: '超哥',
    accessToken: 'fit1234567890',
  },
  {
    accountName: '賀瓏',
    accessToken: 'dragon1234567890',
  },
]

const LoginButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('-1');

  const authChannel = new BroadcastChannel('AUTH_CHANNEL')

  // 處理選項變更
  const handleSelectChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedOption(event.target.value);
  };

  const handleLogin =() => {
    // 登入時，先判斷session中 access_token 是否存在
    // 如果不存在，將 access_token 存入session，跳轉到 /dashboard
    // 並通知其他頁面登入成功，並將 access_token 存入其他session
    // -----------------------------------------
    // 如果存在，判斷是否為同一人登入
    // 如果是同一人登入，提示已登入並阻擋登入
    // -----------------------------------------
    // 如果不是同一人登入，提示是否要登出原帳號，
    // 並將新的 access_token 存入session，登出其他頁面

    const accountName = userList.find((user) => user.accessToken === selectedOption)?.accountName;

    const accessToken = sessionStorage.getItem('access_token');
    if (accessToken === null) {
      sessionStorage.setItem('access_token', selectedOption);
      authChannel.postMessage({
        type: 'login',
        payload: {
          token: selectedOption,
        },
      });
      navigate('/dashboard', { state: { accountName: accountName } });
    } else if (accessToken === selectedOption) {
      // 跳出您已登入的提示
      showAlertWithAction('您已於其他頁籤登入', () => {});
    } else {
      // 跳出是否登出其他頁籤的提示
      showAlertWithConfirmAndCancel('您已於其他頁籤登入，是否登出其他頁籤？', () => {
        const sessionId = sessionStorage.getItem('session_id');
        sessionStorage.setItem('access_token', selectedOption);
        authChannel.postMessage({
          type: 'logout',
          payload: {
            sessionId: sessionId,
          },
        });
        authChannel.postMessage({
          type: 'login',
          payload: {
          token: selectedOption,
        },
        });

        navigate('/dashboard', { state: { accountName: accountName } });
      });
    }
  };

  useEffect(() => () => {
    authChannel.close();
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
      style={{ 
        backgroundImage: `url("https://files.oaiusercontent.com/file-mQRLBSgpVf7gcK4wMRz0pL1f?se=2024-01-30T03%3A45%3A54Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D008f1863-dfd2-44dd-b9f7-8191e38dc3a6.webp&sig=ECDWheTOk1uyaOASqm8rjGf%2Bm6LUwPGTt1IdN43da5g%3D")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex flex-col items-center max-w-sm p-6 mx-auto space-y-4 bg-white border-2 border-gray-500 shadow-md rounded-xl">
        {/* 下拉選單 */}
        <div className="w-full">
          <select
            value={selectedOption}
            onChange={handleSelectChange}
            className="block w-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value="-1">請選擇您的帳號</option>
            {userList.map((user) => (
              <option key={user.accountName} value={user.accessToken}>{user.accountName}</option>
            ))}
          </select>
        </div>
        {/* 登入按鈕 */}
        <div className="w-full">
          <button
            type='button'
            className={`w-full px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 cursor-pointer disabled:bg-green-300 disabled:cursor-not-allowed ${loading ? 'opacity-50' : ''}`}
            disabled={selectedOption === '-1'}
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginButton;
