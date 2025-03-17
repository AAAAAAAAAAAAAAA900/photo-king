import {apiClient} from "./apiClient";

const photoGroupApi = {
    addGroup: async(groupTitle, userId, day) => {
        return apiClient.post("/photo-group/add", {name: groupTitle, ownerId: userId, selectedDay: day})
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

    updateUserRank: async (data) => {
        return apiClient.post("/photo-group/update-user-rank", data);
    },

    getGroupsByUserId: async (userId) => {
        return apiClient.get(`/user-groups/get-groups/${userId}`);
    }
}

export default photoGroupApi;