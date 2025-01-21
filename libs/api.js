import axios from "axios";
import { signIn } from "next-auth/react";
import config from "../config.js";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  maxRedirects: 0,
  validateStatus: (status) =>{
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
    // if (response.status == 302) {
    //   const redirectUrl = response.headers.location;
    //   // You can now use the redirectUrl as needed
    //   console.log('Redirect URL:', redirectUrl);
    //   // window.location.replace(redirectUrl);
    //   return new Promise(() => {});
    // }
    console.log(response)
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status >= 300 && error.response.status < 400) {
      const redirectUrl = error.response.headers.location;
      console.log('AAAAAAA')
      window.location.href = redirectUrl
      return new Promise(() => {});
    }
    console.log(error)
    return Promise.reject(error);
  }
);

export default apiClient;