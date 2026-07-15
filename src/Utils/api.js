const API_BASE_URL = 'https://demo-backend-cf9b.onrender.com';

export const getApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const getAuthHeaders = (headers = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
};

export const apiGet = async (path) => {
  const response = await fetch(getApiUrl(path), {
    headers: getAuthHeaders(),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || result.detail || 'Request failed');
  }

  return result;
};
