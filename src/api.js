export const API_BASE = 'http://127.0.0.1:8000';
export const AUTH_TOKEN_KEY = 'authToken';
export const THEME_KEY = 'mathGeniusTheme';

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

export const clearAuthToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

export const getAuthHeaders = (headers = {}) => {
  const token = getAuthToken();

  return {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const authFetch = (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: getAuthHeaders(options.headers),
  });
};

export const withAuthToken = (url) => {
  const token = getAuthToken();
  if (!token) return url;

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}token=${encodeURIComponent(token)}`;
};

export const isDarkTheme = () => localStorage.getItem(THEME_KEY) === 'dark';

export const setThemePreference = (darkMode) => {
  localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
  document.body.className = darkMode ? 'dark-theme' : '';
};

export const requestJson = async (path, options = {}) => {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const response = await authFetch(url, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'API request failed');
  }

  return data;
};

export const loginUser = (credentials) =>
  requestJson('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

export const registerUser = (user) =>
  requestJson('/register', {
    method: 'POST',
    body: JSON.stringify(user),
  });

export const getHomepageData = () => requestJson('/homepage');

export const getTopicsProgression = () => requestJson('/topics_progression');

export const getChaptersData = (topicSlug) => requestJson(`/chapters/${topicSlug}`);
