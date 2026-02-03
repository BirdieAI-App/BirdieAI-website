import axios from "axios";
import { signIn } from "next-auth/react";
import config from "../config.js";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) return process.env.NEXT_PUBLIC_BACKEND_URL;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
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

apiClient.interceptors.response.use(
  (response) => {
    if(response.data.redirect){
      window.location = response.data.url
    }
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status == 401 && error.response.data.redirect) {
      window.location = error.response.data.url
      return new Promise(() => { });
    }
    return Promise.reject(error);
  }
);

export default apiClient;