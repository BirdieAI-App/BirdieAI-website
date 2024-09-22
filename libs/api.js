import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import config from "../config.js";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/call` : 'https://www.birdieapp.co/call';

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
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
      // User not auth, ask to re-login
      message = error?.response?.data || "Please login";
      signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    } else if (error.response?.status === 403) {
      // User not authorized, must subscribe/purchase/pick a plan
      message = "Pick a plan to use this feature";
    } else {
      message = error?.response?.data?.error || error.message || error.toString();
    }

    error.message = typeof message === "string" ? message : JSON.stringify(message);

    // Attach additional information to the error object
    return Promise.reject({
      message: error.message,
      status: error.response?.status,
      ok: false,
      url: error.config.url
    });
  }
);

export default apiClient;
