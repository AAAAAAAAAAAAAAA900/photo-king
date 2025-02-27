import {apiClient} from "./apiClient";

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

    updateUserRank: async (group, user) => {
        return apiClient.put(`/photo-group/update-user-rank/${group.id}/${user.id}`);
    }
}

export default photoGroupApi;