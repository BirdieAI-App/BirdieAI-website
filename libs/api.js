import axios from "axios";
import { signIn } from "next-auth/react";
import config from "../config.js";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
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
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status == 401 && error.response.data.redirect) {
      // window.location = error.response.data.url
      return new Promise(() => { });
    }
    return Promise.reject(error);
  }
);

export default apiClient;