import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  roles: string;
  exp: number;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
}

export function saveToken(token: string): void {
  localStorage.setItem('token', token);
}

export function saveRefreshToken(refreshToken: string): void {
  localStorage.setItem('refreshToken', refreshToken);
}

export function clearToken(): void {
  localStorage.removeItem('token');
}

export function clearRefreshToken(): void {
  localStorage.removeItem('refreshToken');
}

export function clearAuthTokens(): void {
  clearToken();
  clearRefreshToken();
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

export function getRoleFromToken(token: string): string | null {
  const decoded = decodeToken(token);
  return decoded?.roles ?? null;
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 <= Date.now();
}
