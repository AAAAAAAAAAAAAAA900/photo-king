import {apiClient} from "./apiClient";

const authApi = {

    // LOGIN API
    login: async (username, password) => {
        return apiClient.post("/auth/login", {username: username, password: password});
    },

    // REGISTER API
    register: async (data) => {
        return apiClient.post("/auth/register", data);
    },

    appleLogin: async (token) => {
        return apiClient.post("/auth/login/apple", {token: token});
    }
}

export default authApi;