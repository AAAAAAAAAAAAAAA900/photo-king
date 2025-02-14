package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.service.UserImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(path = "api/user-image")
public class UserImageController {

    @Autowired
    private UserImageService userImageService;

    @PostMapping(path = "/upload")
    public String uploadImage(@RequestParam("files") MultipartFile[] files, @RequestParam("userId") int userId, @RequestParam("groupId") int groupId) throws Exception {
        try {
            for (MultipartFile file : files) {
                String url = userImageService.upload(file, userId, groupId);
                if (url != null) {
                    return url;
                }
            }
            return null;
        }
        catch (Exception e) {
            throw e;
        }

    }

}
