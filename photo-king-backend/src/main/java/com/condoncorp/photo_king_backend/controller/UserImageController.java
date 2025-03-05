package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.model.UserImage;
import com.condoncorp.photo_king_backend.service.PhotoGroupService;
import com.condoncorp.photo_king_backend.service.UserImageService;
import com.condoncorp.photo_king_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = "api/user-image")
public class UserImageController {

    @Autowired
    private UserImageService userImageService;
    @Autowired
    private UserService userService;
    @Autowired
    private PhotoGroupService photoGroupService;

    // HANDLES IMAGE UPLOADING AND SAVES TO IMAGE CLOUD AND DATABASE
    @PostMapping(path = "/upload")
    public String uploadImage(@RequestParam("files") List<MultipartFile> files, @RequestParam("userId") int userId, @RequestParam("groupId") int groupId) {
        try {
            if (files == null || files.isEmpty()) {
                return "NO FILE RECEIVED";
            }

            System.out.println("Files received: " + files.size());
            System.out.println("User ID: " + userId);
            System.out.println("Group ID: " + groupId);

            List<String> uploadedUrls = new ArrayList<>();
            for (MultipartFile file : files) {
                String url = userImageService.upload(file, userId, groupId);
                if (url != null) {
                    uploadedUrls.add(url);
                }
            }
            return uploadedUrls.toString();

        } catch (Exception e) {
            System.out.println("Upload error: " + e.getMessage());
            return "INTERNAL SERVER ERROR";
        }
    }

    @PostMapping(path = "/upload-profile")
    public String uploadProfileImage(@RequestParam("file") MultipartFile file, @RequestParam("userId") int userId) {
        try {
            if (file == null || file.isEmpty()) {
                return "NO FILE RECEIVED";
            }
            System.out.println("Files received: " + file.getSize());
            System.out.println("User ID: " + userId);

            return userImageService.uploadProfile(file, userId);
        } catch (Exception e) {
            System.out.println("Upload error: " + e.getMessage());
            return "INTERNAL SERVER ERROR";
        }
    }

    // RETURNS A LIST OF IMAGES FOR A GIVEN GROUP
    @GetMapping(path = "/get-group-images/{groupId}")
    public List<UserImage> getGroupImages(@PathVariable int groupId) {
        return userImageService.getImagesByGroup(groupId);
    }

    // DELETES AN IMAGE FROM IMAGE CLOUD AND DATABASE
    @DeleteMapping(path = "/delete-image/{id}")
    public void deleteImage(@PathVariable int id) throws IOException {
        userImageService.deleteImage(id);
    }

    // DELETES USER'S PROFILE IMAGE FROM CLOUD AND RESETS TO DEFAULT
    @PostMapping(path = "/delete-profile-image/{userId}")
    public void deleteProfileImage(@PathVariable int userId) throws IOException {
        userImageService.deleteProfileImage(userId);
    }

    // UPDATES AN IMAGE'S POINTS
    @PutMapping(path = "/update-points/{id}/{points}")
    public void updatePoints(@PathVariable int id, @PathVariable int points) {
        userImageService.updatePoints(id, points);
    }

    // RETURNS IMAGES WITH HIGHEST POINTS
    @GetMapping(path = "/get-top-image/{groupId}")
    public UserImage getTopImage(@PathVariable int groupId) {
        return userImageService.getTopImage(groupId);
    }


}
