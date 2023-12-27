// src/services/authService.ts
import { fetcher } from '../utils/fetcher';

const BASE_URL = 'http://localhost:8000';

export const getRegistrationOptions = () => {
  return fetcher(`${BASE_URL}/generate-registration-options`, {
    method: 'GET',
  });
};

export const getAuthenticationOptions = () => {
  return fetcher(`${BASE_URL}/generate-authentication-options`, {
    method: 'GET',
  });
};

export const sendRegistrationResponse = (attestation: any) => {
  return fetcher(`${BASE_URL}/verify-registration`, {
    method: 'POST',
    body: JSON.stringify(attestation),
  });
};

export const sendAuthenticationResponse = (assertion: any) => {
  return fetcher(`${BASE_URL}/verify-authentication`, {
    method: 'POST',
    body: JSON.stringify(assertion),
  });
};
