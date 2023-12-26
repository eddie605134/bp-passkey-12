import express, { Router, Request, Response } from 'express';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,

  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse
} from '@simplewebauthn/server';

const router = Router();

// 假設的用戶資料庫，生產環境應該使用真實資料庫
const users: Record<string, any> = {};

router.post('/register', async (req: Request, res: Response) => {
  const { username } = req.body;

  // 創建用戶或者獲取現有用戶
  const user = users[username] || {
    id: username,
    credentials: []
  };

  const options = await generateRegistrationOptions({
    rpName: "ExampleCo",
    rpID: "localhost",
    userID: user.id,
    userName: username,
    attestationType: "indirect",
    authenticatorSelection: {
      userVerification: "preferred",
    },
  });

  // 存儲挑戰，稍後驗證註冊時使用
  users[username] = { ...user, currentChallenge: options.challenge };

  res.json(options);
});

router.post('/register/response', async (req: Request, res: Response) => {
  const { username, attestationResponse } = req.body;
  const user = users[username];

  if (!user) {
    return res.status(404).send('用戶不存在');
  }

  let verification: VerifiedRegistrationResponse;
  try {
    verification = await verifyRegistrationResponse({
      attestationResponse,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: "http://localhost:3000",
      expectedRPID: "localhost"
    });
  } catch (error) {
    return res.status(400).send(`註冊驗證失敗: ${(error as Error).message}`);
  }

  if (verification.verified) {
    user.credentials.push(verification.registrationInfo);
    return res.json({ verified: true });
  } else {
    return res.status(400).send('註冊驗證未通過');
  }
});

router.post('/login', async (req, res) => {
  const { username } = req.body;
  const user = users[username];

  if (!user) {
    return res.status(404).send('用戶不存在');
  }

  const options = await generateAuthenticationOptions({
    allowCredentials: user.credentials.map(cred => ({
      id: cred.credentialID,
      type: 'public-key',
      transports: ['internal']
    })),
    userVerification: 'preferred',
  });

  // 存儲挑戰，稍後驗證登錄時使用
  user.currentChallenge = options.challenge;
  res.json(options);
});

router.post('/login/response', async (req: Request, res: Response) => {
  const { username, assertionResponse } = req.body;
  const user = users[username];

  if (!user) {
    return res.status(404).send('用戶不存在');
  }

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      credential: assertionResponse,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: "http://localhost:3000",
      expectedRPID: "localhost",
      credentialPublicKey: user.credentials[0].publicKey,
      prevCounter: user.credentials[0].counter,
      userHandle: username
    });
  } catch (error) {
    return res.status(400).send(`註冊驗證失敗: ${(error as Error).message}`);
  }

  if (verification.verified) {
    // 更新簽名計數器
    user.credentials[0].counter = verification.authenticationInfo.newCounter;
    res.json({ verified: true });
  } else {
    res.status(400).send('登錄驗證未通過');
  }
});

export default router;