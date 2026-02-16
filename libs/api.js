import axios from "axios";
import { signIn } from "next-auth/react";
import config from "../config.js";

const getBaseUrl = () => {
  // In browser: always use same-origin so API calls work on Vercel preview and production
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NEXT_PUBLIC_BACKEND_URL || '';
};

const apiClient = axios.create({
  baseURL: `${getBaseUrl()}/call`,
  maxRedirects: 0,
  validateStatus: (status) => {
    return status >= 200 && status < 400;
  },
  headers: {
    'Content-Type': 'application/json'
  },
});

// Add the createUrl method to the apiClient
apiClient.createUrl = function (endpoint) {
  if (!endpoint) {
    throw new Error('Endpoint must be provided');
  }
  const baseUrl = this.defaults.baseURL; // Use the baseURL from the axios instance
  return `${baseUrl.replace(/\/$/, '')}/${endpoint}`;
};

// Retry on 503 "Backend initializing" (cold start) - for login, chat, and all /call requests
// Use 6 retries with longer delays so serverless cold start (MongoDB connect, etc.) can complete
const RETRY_DELAYS_MS = [3000, 6000, 10000, 15000, 22000, 30000];

const retryOn503 = async (config, retries = 6) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const cfg = { ...config, _skip503Retry: true };
      const res = await apiClient.request(cfg);
      return res;
    } catch (err) {
      const is503 = err?.response?.status === 503;
      const data = err?.response?.data;
      const retryFlag = typeof data === 'object' && data !== null && data.retry === true;
      const shouldRetry = is503 && retryFlag && attempt < retries - 1;
      if (shouldRetry && RETRY_DELAYS_MS[attempt] != null) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt]));
        continue;
      }
      throw err;
    }
  }
};

apiClient.interceptors.response.use(
  (response) => {
    if(response.data.redirect){
      window.location = response.data.url
    }
    return response.data;
  },
  async (error) => {
    if (error.response && error.response.status == 401 && error.response.data.redirect) {
      window.location = error.response.data.url
      return new Promise(() => { });
    }
    // Retry on 503 cold start (skip if already in retry to avoid recursion)
    if (!error.config?._skip503Retry && error.response?.status === 503 && error.response?.data?.retry === true && error.config) {
      try {
        return await retryOn503(error.config, 6);
      } catch (retryErr) {
        return Promise.reject(retryErr);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;