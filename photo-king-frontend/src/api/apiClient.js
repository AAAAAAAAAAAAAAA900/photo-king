import axios from "axios";
import * as SecureStore from "expo-secure-store";
import {navigate} from "../utilities/RootNavigation";

const API_URL = "https://mole-select-sadly.ngrok-free.app";

const apiClient = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    }
});

const apiFormClient = axios.create({
    baseURL: `${API_URL}/api`,
});


// GET TOKENS
const getAccessToken = async () => await SecureStore.getItemAsync("accessToken");
const getRefreshToken = async () => await SecureStore.getItemAsync("refreshToken");

// STORE TOKENS
const saveAccessToken = async (accessToken) => await SecureStore.setItemAsync("accessToken", accessToken);
const saveRefreshToken = async (refreshToken) => await SecureStore.setItemAsync("refreshToken", refreshToken);
const clearTokens = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
}

// CHECK TOKEN VALIDITY CAN CHECK BOTH ACCESS AND REFRESH
const isTokenValid = async (token) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/validate-token`, { token }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return response.data;
    } catch (error) {
        return false;
    }
}

const refreshAccessToken = async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken || !(await isTokenValid(refreshToken))) {
        await clearTokens();
        navigate("Login")
    }
    try {
        const response = await axios.post(`${API_URL}/api/auth/refresh-token`, { token: refreshToken }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (response.data === null) {
            await clearTokens();
            navigate("Login")
        }
        await saveAccessToken(response.data);
    }
    catch (error) {
        await clearTokens();
    }
}


// PUT AUTHORIZATION HEADER BEFORE ANY API CALL EXCEPT AUTH
apiClient.interceptors.request.use(async (config) => {
    if (!config.url.startsWith("/auth/")) {
        let accessToken = await getAccessToken();

        if (!accessToken || !(await isTokenValid(accessToken))) {
            await refreshAccessToken(); // Refresh the token if expired
            accessToken = await getAccessToken(); // Get the new token
        }

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }
    return config;
}, (error) => {
    console.log("INTERCEPTOR ERROR:", error);
    return Promise.reject(error);
})

apiFormClient.interceptors.request.use(async (config) => {

    if (!config.url.startsWith("/auth/")) {
        let accessToken = await getAccessToken();


        if (!accessToken || !(await isTokenValid(accessToken))) {
            await refreshAccessToken(); // Refresh the token if expired
            accessToken = await getAccessToken(); // Get the new token
        }

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }

    config.headers['Content-Type'] = 'multipart/form-data';
    return config;
}, (error) => {
    console.log("INTERCEPTOR ERROR:", error);
    return Promise.reject(error);
})

export { apiClient, apiFormClient, isTokenValid, clearTokens };