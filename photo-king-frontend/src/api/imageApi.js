import {apiClient, apiFormClient} from "./apiClient";

const imageApi = {

    uploadImages: async (formData) => {
        return apiFormClient.post("/user-image/upload", formData);
    },

    uploadProfile: async (formData) => {
        return apiFormClient.post("/user-image/upload-profile", formData);
    },

    deleteImage: async (imageId) => {
        return apiClient.delete(`/user-image/delete-image/${imageId}`)
    },

    updatePoints: async (photoId, points) => {
        return apiClient.put(`/user-image/update-points/${photoId}/${points}`);
    },

    getGroupImages: async (groupId) => {
        return apiClient.get(`/user-image/get-group-images/${groupId}`);
    },

    getTopImage: async (groupId) => {
        return apiClient.get(`/user-image/get-top-image/${groupId}`);
    }

}

export default imageApi;