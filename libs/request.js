import apiClient from "./api";

export const sendGoogleIDToken = async function (token) {
    const response = await apiClient.post('/auth/google', token);
    return response;
}

export const getAllUSers = async function () {
    const response = await apiClient.get('/users');
    return response;
}

export const postUser = async function (payload) {
    // console.log(payload);
    console.log('Base URL', apiClient.defaults.baseURL);
    const response = await apiClient.post('/users', payload);
    return response;
}

export const SignInByCredentials = async function (payload) {
    const response = await apiClient.post('/auth/login', payload);
    return response;
}