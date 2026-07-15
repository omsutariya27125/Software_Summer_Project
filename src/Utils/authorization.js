export const AUTH_TOKEN_KEY = 'authToken';

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
};

export const loginUser = (token = 'demo-token') => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  return true;
};

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const requireAuth = () => {
  if (!isAuthenticated()) {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return false;
  }
  return true;
};
