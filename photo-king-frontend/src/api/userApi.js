import {apiClient} from "./apiClient";
import * as SecureStore from "expo-secure-store";

const userApi = {
    getUserInfo: async () => {
        return apiClient.get("/user/get-user-info");
    },

    getUser: async(username) => {
        return apiClient.get(`/user/get-user/${username}`);
    },

    addFriend: async (userId, friendId) => {
        return apiClient.post(`/user/add-friend/${userId}/${friendId}`);
    },

    removeFriend: async (userId, friendId) => {
        return apiClient.post(`/user/remove-friend/${userId}/${friendId}`);
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