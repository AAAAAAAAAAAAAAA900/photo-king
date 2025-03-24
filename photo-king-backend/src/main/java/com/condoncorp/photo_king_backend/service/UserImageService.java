package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.UserImageCommentDTO;
import com.condoncorp.photo_king_backend.dto.UserImageCommentReq;
import com.condoncorp.photo_king_backend.dto.UserImageDTO;
import com.condoncorp.photo_king_backend.model.*;
import com.condoncorp.photo_king_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

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
    @Autowired
    private PhotoGroupUserRankingRepository photoGroupUserRankingRepository;
    @Autowired
    private UserImageCommentRepository userImageCommentRepository;


    // UPLOADS AN IMAGE TO IMAGE CLOUD AND DATABASE
    public String upload(MultipartFile file, int userId, int groupId) throws IOException {
        Optional<User> user = userRepository.findById(userId);
        Optional<PhotoGroup> photoGroup = photoGroupRepository.findById(groupId);
        if (user.isEmpty() || photoGroup.isEmpty()) {
            return null;
        }

        BufferedImage bi = ImageIO.read(file.getInputStream());
        if (bi == null) {
            return null;
        }

        Map result = cloudinaryService.upload(file);
        UserImage userImage = new UserImage();
        userImage.setImageName((String) result.get("original_filename"));
        userImage.setUrl((String) result.get("url"));
        userImage.setPublicId((String) result.get("public_id"));
        userImage.setUser(user.get());
        userImage.setPhotoGroup(photoGroup.get());
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
        Optional<PhotoGroupUserRanking> firstRank =  photoGroupUserRankingRepository.findByFirstRank(id);

        if (firstRank.isPresent()) {
            firstRank.get().setFirstRankId(0);
            photoGroupUserRankingRepository.save(firstRank.get());
        }
        else {
            Optional<PhotoGroupUserRanking> secondRank =  photoGroupUserRankingRepository.findBySecondRank(id);
            if (secondRank.isPresent()) {
                secondRank.get().setSecondRankId(0);
                photoGroupUserRankingRepository.save(secondRank.get());
            }
            else {
                Optional<PhotoGroupUserRanking> thirdRank =  photoGroupUserRankingRepository.findByThirdRank(id);
                if (thirdRank.isPresent()) {
                    thirdRank.get().setThirdRankId(0);
                    photoGroupUserRankingRepository.save(thirdRank.get());
                }
            }
        }

        if (userImage.isEmpty()) {
            return;
        }


        try {
            cloudinaryService.delete(userImage.get().getPublicId());
            userImageRepository.deleteById(id);
        } catch (Exception e) {
            throw new IOException("Failed to delete image: " + userImage.get().getPublicId());
        }
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
    public List<UserImageDTO> getImagesByGroup(int groupId) {
        Optional<PhotoGroup> photoGroup = photoGroupRepository.findById(groupId);
        if (photoGroup.isEmpty()) {
            return null;
        }

        if (photoGroup.get().getUserImages().isEmpty()) {
            return null;
        }

        return photoGroup.get().getUserImages().stream().map(UserImageDTO::new).toList();

    }

    // RETURNS A LIST OF IMAGES FOR A GIVEN USER
    public List<UserImageDTO> getImagesByUser(int userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return null;
        }

        if (user.get().getUserImages().isEmpty()) {
            return null;
        }

        return user.get().getUserImages().stream().map(UserImageDTO::new).toList();
    }

    // RETURNS THE IMAGE WITH THE MOST POINTS IN A GIVEN GROUP
    public UserImageDTO getTopImage(int groupId) {

        List<UserImageDTO> groupImages = getImagesByGroup(groupId);

        if (groupImages == null) {
            return null;
        }

        if (groupImages.isEmpty()) {
            return null;
        }
        List<UserImageDTO> images = new ArrayList<>(getImagesByGroup(groupId));

        if (images.isEmpty()) {
            return null;
        }

        if (images.size() == 1) {
            return images.get(0);
        }

        images.sort((o1, o2) -> Integer.compare(o2.getPoints(), o1.getPoints()));
        return images.get(0);
    }

    // UPDATES AN IMAGE'S POINTS
    public UserImageDTO updatePoints(int id, int points) {

        Optional<UserImage> userImage = userImageRepository.findById(id);
        if (userImage.isEmpty()) {
            throw new RuntimeException("Image not found");
        }

        int currentPoints = userImage.get().getPoints();
        userImage.get().setPoints(currentPoints + points);
        userImageRepository.save(userImage.get());
        return new UserImageDTO(userImage.get());
    }

    // COMMENT FUNCTIONS
    // UPLOADS COMMENT TO IMAGE
    public UserImageCommentDTO uploadComment(UserImageCommentReq userImageCommentReq) {
        Optional<User> user = userRepository.findById(userImageCommentReq.getUserId());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        Optional<UserImage> userImage = userImageRepository.findById(userImageCommentReq.getPhotoId());
        if (userImage.isEmpty()) {
            throw new RuntimeException("Image not found");
        }

        UserImageComment userImageComment = new UserImageComment();
        userImageComment.setComment(userImageCommentReq.getComment());
        userImageComment.setCreatedAt(LocalDateTime.now());
        userImageComment.setUser(user.get());
        userImageComment.setUserImage(userImage.get());
        userImageCommentRepository.save(userImageComment);

        return new UserImageCommentDTO(userImageComment);

    }

    public void deleteComment(int id) {
        userImageCommentRepository.deleteById(id);
    }

    // GETS COMMENTS FOR GIVEN IMAGE1
    public List<UserImageCommentDTO> getComments(int photoId){
        Optional<UserImage> image = userImageRepository.findById(photoId);
        return image.map(userImage -> userImage.getComments().stream().map(UserImageCommentDTO::new).toList()).orElse(Collections.emptyList());
    }

}
