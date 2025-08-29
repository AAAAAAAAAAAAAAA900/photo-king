import {apiClient} from "./apiClient";
import * as SecureStore from "expo-secure-store";

const userApi = {
    getUserInfo: async () => {
        return apiClient.get("/user/get-user-info");
    },

    removeFriend: async (userId, friendId) => {
        return apiClient.post(`/user/remove-friend/${userId}/${friendId}`);
    },

    getFriend: async(username) => {
        return apiClient.get(`/user/get-friend/${username}`);
    },

    getBio: async (userId) => {
        return apiClient.get(`/user/get-user-bio/${userId}`);
    },

    setProfile: async (userId, username, name, bio) => {
        return apiClient.post(`/user/set-user-profile`, {"id": userId, "username": username, "name":name, "bio": bio});
    },

    searchUsers: async (search) => {
        return apiClient.get(`/user/search-users/${search}`);
    },

    getFriendById: async (friendId) => {
        return apiClient.get(`/user/friend-by-id/${friendId}`);
    }
}

export default userApi;