import { useImperativeHandle } from "react";
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
    },

    uploadComment: async (comment, userId, photoId) => {
        return apiClient.post('/user-image/upload-comment', {"comment": comment, "userId": userId, "photoId": photoId});
    },

    getComments: async (photoId) => {
        return apiClient.get(`/user-image/get-comments/${photoId}`);
    },

    flagImage: async (imageID) => {
        return apiClient.post(`/user-image/flag-image/${imageID}`);
    },
}

export default imageApi;