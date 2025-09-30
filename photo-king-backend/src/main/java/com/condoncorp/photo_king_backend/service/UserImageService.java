package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.CustomUserDetails;
import com.condoncorp.photo_king_backend.dto.UserImageCommentDTO;
import com.condoncorp.photo_king_backend.dto.UserImageCommentReq;
import com.condoncorp.photo_king_backend.dto.UserImageDTO;
import com.condoncorp.photo_king_backend.model.*;
import com.condoncorp.photo_king_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
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
    @Autowired
    private WSService websocketService;
    @Autowired
    private ImageModerationService imageModerationService;

    // UPLOADS AN IMAGE TO IMAGE CLOUD AND DATABASE
    @PreAuthorize("#userId == authentication.principal.id")
    public String upload(MultipartFile file, int userId, int groupId) throws IOException {
        User user = userRepository.findById(userId).orElseThrow();
        PhotoGroup photoGroup = photoGroupRepository.findById(groupId).orElseThrow();
        if(!photoGroup.getUsers().contains(user)){
            throw new AccessDeniedException("User does not belong to group");
        }

        BufferedImage bi = ImageIO.read(file.getInputStream());
        if (bi == null) {
            return null;
        }

        Map result = cloudinaryService.upload(file);

        if (imageModerationService.moderateImage((String) result.get("url"))) {
            cloudinaryService.delete((String) result.get("public_id"));
            return "Image Flagged";
        }

        UserImage userImage = new UserImage();
        userImage.setImageName((String) result.get("original_filename"));
        userImage.setUrl((String) result.get("url"));
        userImage.setPublicId((String) result.get("public_id"));
        userImage.setUser(user);
        userImage.setPhotoGroup(photoGroup);
        userImage.setSummary(null);
        userImageRepository.save(userImage);

        // Live update group of photo change
        websocketService.liveUpdatePictures(groupId, "upload");

        return userImage.getUrl();
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public String uploadProfile(MultipartFile file, int userId) throws IOException {

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }

        BufferedImage bi = ImageIO.read(file.getInputStream());
        if (bi == null) {
            return null;
        }

        // Delete old PFP
        if(user.getProfilePublicId() != null && !user.getProfilePublicId().isEmpty()){
            cloudinaryService.delete(user.getProfilePublicId());
        }

        Map result = cloudinaryService.upload(file);
        user.setProfileUrl((String) result.get("url"));
        user.setProfilePublicId((String) result.get("public_id"));
        userRepository.save(user);

        return user.getProfileUrl();
    }

    // DELETES AN IMAGE FROM IMAGE CLOUD AND DATABASE
    @Transactional
    public void deleteImage(int id) throws IOException {

        UserImage userImage = userImageRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Image does not exist."));

        // Check authorization i.e. person deleting is not image or group owner
        int authenticatedUserId = ((CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal()).getId();
        PhotoGroup photoGroup = userImage.getPhotoGroup();
        PhotoGroupSummary summary = userImage.getSummary();
        // if photo group is null check summary for photo group
        if(photoGroup == null){
            if(summary != null){
                photoGroup = photoGroupRepository.findById(summary.getGroupId())
                        .orElseThrow(()-> new RuntimeException("Photo's group can not be found."));
            }
        }
        if(authenticatedUserId != userImage.getUser().getId() &&
                (photoGroup != null && authenticatedUserId != photoGroup.getOwnerId())){
            throw new org.springframework.security.access.AccessDeniedException("User not permitted to delete photo");
        }

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

        try {
            cloudinaryService.delete(userImage.getPublicId());
        } catch (Exception e) {
            throw new IOException("Failed to delete image: " + userImage.getPublicId());
        }

        // Live update group of photo change
        if(photoGroup != null) {
            websocketService.liveUpdatePictures(photoGroup.getId(), "delete");
        }

        // remove from parent and delete
        if(summary != null){
            summary.getUserImages().remove(userImage);
        } else if (photoGroup != null){
            photoGroup.getUserImages().remove(userImage);
        }
        userImageRepository.delete(userImage);
    }

    // DELETES USER'S PROFILE PICTURE
    @PreAuthorize("#id == authentication.principal.id")
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
        Optional<PhotoGroup> optionalPhotoGroup = photoGroupRepository.findById(groupId);
        if (optionalPhotoGroup.isEmpty() ||
                optionalPhotoGroup.get().getUserImages().isEmpty()) {
            return null;
        }
        PhotoGroup photoGroup = optionalPhotoGroup.get();

        // Check authorization i.e. user belongs to group
        int authenticatedUserId = ((CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal()).getId();
        if(photoGroup.getUsers().stream().noneMatch((u)-> u.getId() == authenticatedUserId)){
            throw new org.springframework.security.access.AccessDeniedException("User not in group");
        }

        return photoGroup.getUserImages().stream().map(UserImageDTO::new).toList();
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

    // RETURNS IMAGE BY ID
    public UserImage getImageById(int id) {
        Optional<UserImage> image = userImageRepository.findById(id);
        if (image.isEmpty()) {
            throw new RuntimeException("Image not found");
        }
        return image.get();
    }

    // RETURNS ALL GROUP THUMBNAIL (TOP) IMAGES FOR A USERS GROUPS
    @PreAuthorize("#userId == authentication.principal.id")
    public Map<Integer, String> getUsersGroupThumbnails(int userId){
        User user = userRepository.findById(userId).orElseThrow();

        HashMap<Integer, String> result = new HashMap<>();
        for(PhotoGroup group : user.getPhotoGroups()){
            String imageUrl = getTopImage(group.getId());
            result.put(group.getId(), imageUrl);
        }

        return result;
    }

    // RETURNS THE IMAGE WITH THE MOST POINTS IN A GIVEN GROUP
    public String getTopImage(int groupId) {
        PhotoGroup photoGroup = photoGroupRepository.findById(groupId).orElseThrow();

        List<UserImage> groupImages = photoGroup.getUserImages();
        if (groupImages == null || groupImages.isEmpty()) {
            return null;
        }
        return groupImages.stream()
                .filter(image -> !image.isFlagged())
                .min((o1, o2) -> Integer.compare(o2.getPoints(), o1.getPoints()))
                .map(UserImage::getUrl)
                .orElse(null);
    }

    // UPDATES AN IMAGE'S POINTS
    public void updatePoints(int id, int points) {

        System.out.println(id);
        Optional<UserImage> userImage = userImageRepository.findById(id);
        if (userImage.isEmpty()) {
            throw new RuntimeException("Image not found");
        }

        int currentPoints = userImage.get().getPoints();
        userImage.get().setPoints(currentPoints + points);
        userImageRepository.save(userImage.get());
    }

    // COMMENT FUNCTIONS
    // UPLOADS COMMENT TO IMAGE
    @Transactional
    @PreAuthorize("#userImageCommentReq.getUserId() == authentication.principal.id")
    public UserImageCommentDTO uploadComment(@P("userImageCommentReq") UserImageCommentReq userImageCommentReq) {
        UserImage userImage = userImageRepository.findById(userImageCommentReq.getPhotoId())
                .orElseThrow(()-> new RuntimeException("Image not found"));

        // Check authorization i.e. user belongs to group
        PhotoGroup photoGroup = userImage.getPhotoGroup();
        if(photoGroup == null){
            photoGroup = photoGroupRepository.findById(userImage.getSummary().getGroupId())
                    .orElseThrow(()-> new RuntimeException("Photo's group can not be found."));
        }
        int authenticatedUserId = ((CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal()).getId();
        if(photoGroup.getUsers().stream().noneMatch((u)-> u.getId() == authenticatedUserId)){
            throw new org.springframework.security.access.AccessDeniedException("User not in group");
        }

        User user = userRepository.findById(userImageCommentReq.getUserId())
                .orElseThrow(()-> new RuntimeException("User not found"));

        UserImageComment userImageComment = new UserImageComment();
        userImageComment.setComment(userImageCommentReq.getComment());
        userImageComment.setCreatedAt(LocalDateTime.now());
        userImageComment.setUser(user);
        userImageComment.setUserImage(userImage);

        userImageCommentRepository.save(userImageComment);
        return new UserImageCommentDTO(userImageComment);
    }

    // GETS COMMENTS FOR GIVEN IMAGE
    public List<UserImageCommentDTO> getComments(int photoId){
        Optional<UserImage> optionalImage = userImageRepository.findById(photoId);
        if(optionalImage.isEmpty()){
            return Collections.emptyList();
        }
        UserImage image = optionalImage.get();

        // Check authorization i.e. user belongs to group
        int authenticatedUserId = ((CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal()).getId();
        if(image.getPhotoGroup().getUsers().stream().noneMatch(
                (u)-> u.getId() == authenticatedUserId)){
            throw new org.springframework.security.access.AccessDeniedException("User not in group");
        }

        return image.getComments().stream().map(UserImageCommentDTO::new).toList();
    }

    public void saveImage(UserImage userImage) {
        userImageRepository.save(userImage);
    }

    public void saveAllImages(List<UserImage> userImages) {
        userImageRepository.saveAll(userImages);
    }

    // flags an image for manual moderation
    public void flagImage(int id) {
        UserImage userImage = getImageById(id);

        // checks flagging user is in group
        int authenticatedUserId = ((CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal()).getId();
        if(userImage.getPhotoGroup().getUsers().stream().noneMatch((u)-> u.getId() == authenticatedUserId)){
            throw new org.springframework.security.access.AccessDeniedException("User not in group");
        }

        // flags image
        userImage.setFlagged(true);
        userImageRepository.save(userImage);

        // pings users
        websocketService.liveUpdatePictures(userImage.getPhotoGroup().getId(), "flag");
    }

}
