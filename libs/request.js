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
    // console.log(payload);
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
    const apiUrl = apiClient.createUrl(`/threads/u/${userId}`);
    console.log(apiUrl);
    const response = await apiClient.get(apiUrl);
    return response;
}