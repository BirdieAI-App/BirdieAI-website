import axios from "axios";
import { signIn } from "next-auth/react";
import config from "../config.js";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

// Add the createUrl method to the apiClient
apiClient.createUrl = function(endpoint) {
  if (!endpoint) {
    throw new Error('Endpoint must be provided');
  }
  
  const baseUrl = this.defaults.baseURL; // Use the baseURL from the axios instance
  
  return `${baseUrl.replace(/\/$/, '')}/${endpoint}`;
};

apiClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    let message = "";

    if (error.response?.status === 401) {
      message = error.response.data.message
      // window.location.href = '/api/auth/signin'
    } else if (error.response?.status === 403) {
      message = error.response.data.error;
      // window.location.href = '/api/auth/signin'
    } else {
      message = error?.response?.data?.error || error.message || error.toString();
    }

    error.message = typeof message === "string" ? message : JSON.stringify(message);
    return Promise.reject({error});
  }
);

export default apiClient;