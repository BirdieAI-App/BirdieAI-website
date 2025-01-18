import apiClient from "./api";
//-------------------------------------- AUTHENTICATION -------------------------------------------------
export const SignInByCredentials = async function (payload) {
    const apiUrl = apiClient.createUrl('auth/login');
    const response = await apiClient.post(apiUrl, payload);
    return response;
}

export const SignInGoogle = async function () {
    const apiUrl = apiClient.createUrl('auth/google');
    const response = await apiClient.get(apiUrl);
    return response;
}

export const checkAuthentication = async function () {
    const apiUrl = apiClient.createUrl('auth/test');
    const response = await apiClient.get(apiUrl,{withCredentials: true});
    return response;
}

//-------------------------------------- USER -------------------------------------------------
export const getAllUSers = async function () {
    const response = await apiClient.get('/users');
    return response;
}

export const postUser = async function (payload) {
    const apiUrl = apiClient.createUrl(`users`);
    const response = await apiClient.post(apiUrl, payload);
    return response;
}

export const getUserByID = async function (userId) {
    const apiUrl = apiClient.createUrl(`users/${userId}`);
    const response = await apiClient.get(apiUrl);
    return response;
}
//-------------------------------------- THREADS -------------------------------------------------
export const getAllThreadsByUser = async function (userId) {
    const apiUrl = apiClient.createUrl(`threads/u/${userId}`);
    const response = await apiClient.get(apiUrl);
    return response;
}

export const saveNewThread = async function (payload) {
    const apiUrl = apiClient.createUrl(`threads`);
    const response = await apiClient.put(apiUrl, payload);
    return response;
}
//-------------------------------------- STRIPE -------------------------------------------------
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

export const checkPaymentStatus = async function (sessionID) {
    const apiUrl = apiClient.createUrl(`stripe/session/${sessionID}`);
    const response = await apiClient.get(apiUrl);
    return response;
}

export const getProductList = async function () {
    const apiUrl = apiClient.createUrl('stripe/product-list');
    const response = await apiClient.get(apiUrl);
    return response;
}

export const getStripePrice = async function (priceID) {
    const apiUrl = apiClient.createUrl(`stripe/price/${priceID}`);
    const response = await apiClient.get(apiUrl);
    return response;
}
//-------------------------------------- MESSAGE -------------------------------------------------

export const getAllMessagesByThreadId = async function (threadID) {
    const apiUrl = apiClient.createUrl(`messages/t/${threadID}`);
    const response = await apiClient.get(apiUrl);
    return response;
}

export const getDailyMessageCount = async function (userID) {
    const apiUrl = apiClient.createUrl(`messages/u/${userID}/count`);
    const response = await apiClient.get(apiUrl);
    return response;
}

export const saveNewMessage = async function (payload) {
    const apiUrl = apiClient.createUrl('messages');
    const response = await apiClient.put(apiUrl, payload);
    return response;
}

export const updateMessageByID = async function (messageID, payload) {
    const apiUrl = apiClient.createUrl(`messages/${messageID}`)
    const response = await apiClient.post(apiUrl, payload);
    return response;
}