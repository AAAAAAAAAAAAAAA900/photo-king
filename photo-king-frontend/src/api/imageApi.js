import {apiClient, apiImageClient} from "./apiClient";

const imageApi = {

    uploadImages: async (formData) => {
        return apiImageClient.post("/upload", formData);
    },

    uploadProfile: async (formData) => {
        return apiImageClient.post("/upload-profile", formData);
    },

    deleteImage: async (imageId) => {
        return apiClient.delete(`/user-image/delete-image/${imageId}`)
    },

    updatePoints: async (photoId, points) => {
        return apiClient.put(`/user-image/update-points/${photoId}/${points}`);
    },

    getGroupImages: async (groupId) => {
        return apiClient.get(`/user-image/get-group-images/${groupId}`);
    }


}

export default imageApi;