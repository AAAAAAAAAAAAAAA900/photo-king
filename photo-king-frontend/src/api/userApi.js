import {apiClient} from "./apiClient";
import * as SecureStore from "expo-secure-store";

const userApi = {
    getUserInfo: async () => {
        return apiClient.get("/user/get-user-info");
    },

    getUser: async(userSearch) => {
        return apiClient.get(`/user/get-user/${userSearch}`);
    },

    addFriend: async (userId, friendId) => {
        return apiClient.post(`/user/add-friend/${userId}/${friendId}`);
    },

    removeFriend: async (userId, friendId) => {
        return apiClient.post(`/user/remove-friend/${userId}/${friendId}`);
    }

}

export default userApi;