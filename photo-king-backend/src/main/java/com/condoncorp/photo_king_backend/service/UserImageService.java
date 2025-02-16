package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.model.UserImage;
import com.condoncorp.photo_king_backend.repository.UserImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserImageService {

    @Autowired
    private UserImageRepository userImageRepository;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private UserService userService;
    @Autowired
    private PhotoGroupService photoGroupService;

    public String upload(MultipartFile file, int userId, int groupId) throws IOException {

        User user = userService.getUserById(userId);
        PhotoGroup photoGroup = photoGroupService.getGroupById(groupId);

        BufferedImage bi = ImageIO.read(file.getInputStream());
        if (bi == null) {
            return null;
        }

        Map result = cloudinaryService.upload(file);
        UserImage userImage = new UserImage();
        userImage.setImage_name((String) result.get("original_filename"));
        userImage.setUrl((String) result.get("url"));
        userImage.setPublicId((String) result.get("public_id"));
        userImage.setUser(user);
        userImage.setPhotoGroup(photoGroup);
        userImageRepository.save(userImage);

        return userImage.getUrl();
    }

    public void deleteImage(int id) throws IOException {

        Optional<UserImage> userImage = userImageRepository.findById(id);

        if (userImage.isEmpty()) {
            return;
        }

        cloudinaryService.delete(userImage.get().getPublicId());
        userImageRepository.deleteById(id);

    }


    public void saveUserImage(UserImage userImage) {
        userImageRepository.save(userImage);
    }


    public List<UserImage> getImagesByGroup(PhotoGroup photoGroup) {
        return userImageRepository.findByUserPhotoGroup(photoGroup);
    }

}
