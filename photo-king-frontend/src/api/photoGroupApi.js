import {apiClient, apiFormClient} from "./apiClient";

const photoGroupApi = {
    addGroup: async(groupTitle, userId) => {
        return apiClient.post("/photo-group/add", {name: groupTitle, ownerId: userId})
    },

    addUserToGroup: async (userId, groupId) => {
        return apiClient.post(`/user-groups/add-user/${userId}/${groupId}`);
    },

    deleteGroup: async (groupId) => {
        return apiClient.delete(`/photo-group/delete/${groupId}`);
    },

    removeUserFromGroup: async (userId, groupId) => {
        return apiClient.post(`/user-groups/remove-user/${userId}/${groupId}`)
    },

    updateUserRank: async (formData) => {
        return apiFormClient.post("/photo-group/update-user-rank", formData);
    }
}

export default photoGroupApi;