import apiClient from "./api";

export const sendGoogleIDToken = async function (token) {
    const response = await apiClient.post('/auth/google', token);
    return response;
}

export const getAllUSers = async function () {
    const response = await apiClient.get('/users');
    return response;
}