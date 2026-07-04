import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
});

// This function is set by the AuthInterceptor component at app startup
let getTokenFn: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: () => Promise<string | null>) {
  getTokenFn = fn;
}

api.interceptors.request.use(async (config) => {
  try {
    if (getTokenFn) {
      const token = await getTokenFn();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // proceed without token
  }
  return config;
});
