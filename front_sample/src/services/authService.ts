// src/services/authService.ts
import { fetcher } from '../utils/fetcher';

const BASE_URL = '/api/auth';

export const getRegistrationOptions = (username: string) => {
  return fetcher(`${BASE_URL}/register`, {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
};

export const getAuthenticationOptions = (username: string) => {
  return fetcher(`${BASE_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
};

export const sendRegistrationResponse = (attestation: any) => {
  return fetcher(`${BASE_URL}/register/response`, {
    method: 'POST',
    body: JSON.stringify(attestation),
  });
};

export const sendAuthenticationResponse = (assertion: any) => {
  return fetcher(`${BASE_URL}/login/response`, {
    method: 'POST',
    body: JSON.stringify(assertion),
  });
};