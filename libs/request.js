import apiClient from "./api";

export const sendGoogleIDToken = async function (token) {
    const apiUrl = apiClient.createUrl('/auth/google');
    // console.log(apiUrl);
    const response = await apiClient.post(apiUrl, token);
    return response;
}

export const getAllUSers = async function () {
    const response = await apiClient.get('/users');
    return response;
}

export const postUser = async function (payload) {
    const apiUrl = apiClient.createUrl(`/users`);
    const response = await apiClient.post(apiUrl, payload);
    return response;
}

export const SignInByCredentials = async function (payload) {
    const apiUrl = apiClient.createUrl('/auth/login');
    const response = await apiClient.post(apiUrl, payload);
    return response;
}

export const getAllThreadsByUser = async function (userId) {
    const apiUrl = apiClient.createUrl(`threads/u/${userId}`);
    const response = await apiClient.get(apiUrl);
    return response;
}

export const createCheckoutSession = async function (payload) {
    const apiUrl = apiClient.createUrl('stripe/create-checkout');
    const response = await apiClient.post(apiUrl, payload);
    return response;
}

export const createCustomerPortalSession = async function (payload) {
    const apiUrl = apiClient.createUrl('stripe/create-customer-portal');
    const response = await apiClient.post(apiUrl, payload);
    return response;
}

export const sendEmail = async function (payload) {
    const apiUrl = apiClient.createUrl(`/auth/send-verification-email`);
    const response = await apiClient.post(apiUrl,payload);
    return response;
}

export const sendCode = async function (payload) {
    const apiUrl = apiClient.createUrl(`/auth/verify-email`);
    const response = await apiClient.post(apiUrl,payload);
    return response;
}

export const checkPaymentStatus = async function(sessionID){
    const apiUrl = apiClient.createUrl(`/stripe/session/${sessionID}`);
    const response = await apiClient.get(apiUrl);
    return response;
}

export const getUserByID = async function (userId){
    const apiUrl = apiClient.createUrl(`/users/${userId}`);
    const response = await apiClient.get(apiUrl);
    return response;
}