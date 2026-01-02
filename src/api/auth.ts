import { BACKEND_URL } from '@/lib/constants';

export async function getSessionUser() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
    });

    if (!response.ok) {
      console.warn('Session fetch failed:', response.status, response.statusText);
      return null;
    }
    const json = await response.json();
    return json.user;
  } catch (error) {
    console.error('Failed to fetch session:', error);
    return null;
  }
}
export async function Logout() {
  try {
    await fetch(`${BACKEND_URL}/api/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Failed to logout :', error);
  }
}
