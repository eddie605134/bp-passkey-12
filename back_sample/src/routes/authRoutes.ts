import { Router, Request, Response } from 'express';
import {
  generateRegistrationOptions,
  generateAuthenticationOptions,
  verifyRegistrationResponse,
  verifyAuthenticationResponse,
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';

interface User {
  registerChallenge?: string;
  loginChallenge?: string;
}

interface Authenticator {
  credentialID: string;
  credentialPublicKey: string;
  counter: number;
  transports: string[];
}

const router = Router();

const rpName = 'fullstack-ladder-webauthn';
const rpId = 'localhost';
const expectedOrigin = 'http://localhost:5173';

// 暫時儲存使用者和驗證器資料
const users: Record<string, User> = {};
const authenticators: Record<string, Authenticator[]> = {};

// 註冊開始路由
router.post('/device-register/start', (req: Request, res: Response) => {
  const username = req.body.username as string;

  // 生成註冊選項
  const options = generateRegistrationOptions({
    rpName,
    rpID: rpId,
    userID: username,
    userName: username,
    attestationType: 'direct',
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'preferred'
    },
    excludeCredentials: (authenticators[username] || []).map(a => ({
      id: Buffer.from(a.credentialID, 'base64'),
      type: 'public-key',
      transports: a.transports,
    })),
    timeout: 60000,
  });

  // 儲存註冊挑戰至暫存
  users[username] = { ...users[username], registerChallenge: options.challenge };

  res.json(options);
});

// 註冊完成路由
router.post('/device-register/finish', async (req: Request, res: Response) => {
  const username = req.body.username as string;
  const user = users[username];

  if (!user || !user.registerChallenge) {
    return res.status(400).json({ error: 'User not found or challenge missing' });
  }

  // 驗證註冊回應
  try {
    const verification: VerifiedRegistrationResponse = await verifyRegistrationResponse({
      response: req.body.data,
      expectedChallenge: user.registerChallenge,
      expectedOrigin,
      requireUserVerification: true
    });

    if (!verification.verified) {
      return res.status(400).json({ error: 'Verification failed' });
    }

    // 儲存新的驗證器
    const { credentialPublicKey, credentialID, counter } = verification.registrationInfo;
    if (!authenticators[username]) {
      authenticators[username] = [];
    }
    authenticators[username].push({
      credentialID: credentialID.toString('base64'),
      credentialPublicKey: credentialPublicKey.toString('base64'),
      counter,
      transports: req.body.data.response.transports,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// 登入開始路由
router.post('/login/start', (req: Request, res: Response) => {
  const username = req.body.username as string;
  const userAuthenticators = authenticators[username] || [];

  const options = generateAuthenticationOptions({
    allowCredentials: userAuthenticators.map(a => ({
      id: Buffer.from(a.credentialID, 'base64'),
      type: 'public-key',
      transports: a.transports,
    })),
    userVerification: 'preferred',
  });

  // 儲存登入挑戰至暫存
  users[username] = { ...users[username], loginChallenge: options.challenge };

  res.json(options);
});

// 登入完成路由
router.post('/login/finish', async (req: Request, res: Response) => {
  const username = req.body.username as string;
  const user = users[username];

  if (!user || !user.loginChallenge) {
    return res.status(400).json({ error: 'User not found or challenge missing' });
  }

  const userAuthenticators = authenticators[username] || [];

  try {
    const verification: VerifiedAuthenticationResponse = await verifyAuthenticationResponse({
      response: req.body.data,
      expectedChallenge: user.loginChallenge,
      expectedOrigin,
      expectedRPID: rpId,
      authenticator: userAuthenticators.find(a => a.credentialID === req.body.data.id),
      requireUserVerification: true,
    });

    if (!verification.verified) {
      return res.status(400).json({ error: 'Verification failed' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
