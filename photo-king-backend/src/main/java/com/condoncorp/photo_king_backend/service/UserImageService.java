package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.model.UserImage;
import com.condoncorp.photo_king_backend.repository.PhotoGroupRepository;
import com.condoncorp.photo_king_backend.repository.UserImageRepository;
import com.condoncorp.photo_king_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
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
    private UserRepository userRepository;
    @Autowired
    private PhotoGroupRepository photoGroupRepository;


    // UPLOADS AN IMAGE TO IMAGE CLOUD AND DATABASE
    public String upload(MultipartFile file, int userId, int groupId) throws IOException {

        if (!userRepository.existsById(userId) || !photoGroupRepository.existsById(groupId)) {
            return null;
        }

        BufferedImage bi = ImageIO.read(file.getInputStream());
        if (bi == null) {
            return null;
        }

        Map result = cloudinaryService.upload(file);
        UserImage userImage = new UserImage();
        userImage.setImage_name((String) result.get("original_filename"));
        userImage.setUrl((String) result.get("url"));
        userImage.setPublicId((String) result.get("public_id"));
        userImage.setUserId(userId);
        userImage.setGroupId(groupId);
        userImageRepository.save(userImage);

        return userImage.getUrl();
    }

    public String uploadProfile(MultipartFile file, int userId) throws IOException {

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }

        BufferedImage bi = ImageIO.read(file.getInputStream());
        if (bi == null) {
            return null;
        }

        Map result = cloudinaryService.upload(file);
        user.setProfileUrl((String) result.get("url"));
        user.setProfilePublicId((String) result.get("public_id"));
        userRepository.save(user);

        return user.getProfileUrl();

    }

    // DELETES AN IMAGE FROM IMAGE CLOUD AND DATABASE
    public void deleteImage(int id) throws IOException {

        Optional<UserImage> userImage = userImageRepository.findById(id);

        if (userImage.isEmpty()) {
            return;
        }

        cloudinaryService.delete(userImage.get().getPublicId());
        userImageRepository.deleteById(id);
    }

    // DELETES USER'S PROFILE PICTURE
    public void deleteProfileImage(int id) throws IOException {

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return;
        }

        cloudinaryService.delete(user.getProfilePublicId());
        user.setProfileUrl(null);
        user.setProfilePublicId(null);
        userRepository.save(user);
    }


    public void saveUserImage(UserImage userImage) {
        userImageRepository.save(userImage);
    }

    // RETURNS A LIST OF IMAGES FOR A GIVEN GROUP
    public List<UserImage> getImagesByGroup(int groupId) {
        return userImageRepository.findByUserPhotoGroup(groupId);
    }

    // RETURNS A LIST OF IMAGES FOR A GIVEN USER
    public List<UserImage> getImagesByUser(int userId) { return userImageRepository.findByUser(userId); }

    // RETURNS THE IMAGE WITH THE MOST POINTS IN A GIVEN GROUP
    public UserImage getTopImage(int groupId) {
        List<UserImage> images = getImagesByGroup(groupId);
        if(images.isEmpty()) return null;
        images.sort((o1, o2) -> o2.getPoints() - o1.getPoints());
        return images.get(0);
    }

    // UPDATES AN IMAGE'S POINTS
    public void updatePoints(int id, int points) {

        Optional<UserImage> userImage = userImageRepository.findById(id);
        if (userImage.isEmpty()) {
            throw new RuntimeException("Image not found");
        }

        int currentPoints = userImage.get().getPoints();
        userImage.get().setPoints(currentPoints + points);
        userImageRepository.save(userImage.get());
    }

}
