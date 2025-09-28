package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.UserImageCommentDTO;
import com.condoncorp.photo_king_backend.dto.UserImageCommentReq;
import com.condoncorp.photo_king_backend.dto.UserImageDTO;
import com.condoncorp.photo_king_backend.service.PhotoGroupService;
import com.condoncorp.photo_king_backend.service.UserImageService;
import com.condoncorp.photo_king_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<String> uploadImage(@RequestParam("files") List<MultipartFile> files, @RequestParam("userId") int userId, @RequestParam("groupId") int groupId) {

        try {
            if (files == null || files.isEmpty()) {
                return ResponseEntity.badRequest().body("NO FILE RECEIVED");
            }

            Boolean moderationFlag = false;

            List<String> uploadedUrls = new ArrayList<>();

            for (MultipartFile file : files) {
                String url = userImageService.upload(file, userId, groupId);
                if (url.equals("Image Flagged")) {
                    moderationFlag = true;
                }
                if (url != null) {
                    uploadedUrls.add(url);
                }
            }

            return ResponseEntity
                    .ok()
                    .header("moderationFlag", moderationFlag.toString())
                    .body(uploadedUrls.toString());

        } catch (Exception e) {
            System.out.println("Upload error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("INTERNAL SERVER ERROR");
        }
    }

    @PostMapping(path = "/upload-profile")
    public String uploadProfileImage(@RequestParam("file") MultipartFile file, @RequestParam("userId") int userId) {
        try {
            if (file == null || file.isEmpty()) {
                return "NO FILE RECEIVED";
            }

            return userImageService.uploadProfile(file, userId);
        } catch (Exception e) {
            System.out.println("Upload error: " + e.getMessage());
            return "INTERNAL SERVER ERROR";
        }
    }

    // RETURNS A LIST OF IMAGES FOR A GIVEN GROUP
    @GetMapping(path = "/get-group-images/{groupId}")
    public List<UserImageDTO> getGroupImages(@PathVariable int groupId) {
        return userImageService.getImagesByGroup(groupId);
    }

    // DELETES AN IMAGE FROM CLOUD AND DATABASE
    @DeleteMapping(path = "/delete-image/{id}")
    public void deleteImage(@PathVariable int id) throws IOException {
        userImageService.deleteImage(id);
    }

    // DELETES USER'S PROFILE IMAGE FROM CLOUD AND RESETS TO DEFAULT
    @PostMapping(path = "/delete-profile-image/{userId}")
    public void deleteProfileImage(@PathVariable int userId) throws IOException {
        userImageService.deleteProfileImage(userId);
    }

    // RETURNS IMAGES WITH HIGHEST POINTS
    @GetMapping(path = "/get-top-image/{groupId}")
    public UserImageDTO getTopImage(@PathVariable int groupId) {
        return userImageService.getTopImage(groupId);
    }

    // UPLOADS A COMMENT
    @PostMapping(path = "/upload-comment")
    public UserImageCommentDTO uploadComment(@RequestBody UserImageCommentReq userImageCommentReq) {
        return userImageService.uploadComment(userImageCommentReq);
    }

    @GetMapping(path = "/get-comments/{photoId}")
    public List<UserImageCommentDTO> getComments(@PathVariable int photoId) {
        return userImageService.getComments(photoId);
    }

    @PostMapping(path = "/flag-image/{id}")
    public ResponseEntity<?> flagImage(@PathVariable int id) {
        userImageService.flagImage(id);
        return ResponseEntity.ok().build();
    }
}
