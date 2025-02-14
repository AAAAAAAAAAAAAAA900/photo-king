package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.service.UserImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(path = "api/user-image")
public class UserImageController {

    @Autowired
    private UserImageService userImageService;

    @PostMapping(path = "/upload")
    public String uploadImage(@RequestParam("files") List<MultipartFile> files, @RequestParam("userId") int userId, @RequestParam("groupId") int groupId) throws Exception {
        try {
            if (files == null || files.isEmpty()) {
                return "NO FILE RECEIVED";
            }

            System.out.println("Files received: " + files.size());
            System.out.println("User ID: " + userId);
            System.out.println("Group ID: " + groupId);

            for (MultipartFile file : files) {
                String url = userImageService.upload(file, userId, groupId);
                if (url != null) {
                    return url;
                }
            }
            return "UPLOAD FAILED";
        } catch (Exception e) {
            System.out.println("Upload error: " + e.getMessage());
            return "INTERNAL SERVER ERROR";
        }

    }

}
