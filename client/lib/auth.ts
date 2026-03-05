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

export function saveToken(token: string): void {
  localStorage.setItem('token', token);
}

export function clearToken(): void {
  localStorage.removeItem('token');
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