import {apiClient} from "./apiClient";

const requestApi = {
    getFriendRequests: async (userId)=>{
        return apiClient.get(`/friend-request/pending/${userId}`);
    },
    sendFriendRequest: async (senderId, receiverId)=>{
        return apiClient.post(`/friend-request/send/${senderId}/${receiverId}`);
    },
    acceptFriendRequest: async (requestId)=>{
        return apiClient.post(`/friend-request/accept/${requestId}`);
    },
    rejectFriendRequest: async (requestId)=>{
        return apiClient.post(`/friend-request/reject/${requestId}`);
    }
};

export default requestApi;