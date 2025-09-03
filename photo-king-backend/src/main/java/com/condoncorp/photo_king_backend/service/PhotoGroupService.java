package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.CustomUserDetails;
import com.condoncorp.photo_king_backend.dto.PhotoGroupDTO;
import com.condoncorp.photo_king_backend.dto.PhotoGroupReq;
import com.condoncorp.photo_king_backend.dto.PhotoGroupSummaryDTO;
import com.condoncorp.photo_king_backend.model.*;
import com.condoncorp.photo_king_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PhotoGroupService {

    @Autowired
    private PhotoGroupRepository photoGroupRepository;
    @Autowired
    private PhotoGroupUserRankingRepository photoGroupUserRankingRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PhotoGroupSummaryRepository photoGroupSummaryRepository;
    @Autowired
    private PhotoGroupPointsRepository photoGroupPointsRepository;
    @Autowired
    private UserImageService userImageService;
    @Autowired
    private WSService websocketService;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private UserImageRepository userImageRepository;

    public PhotoGroupDTO addGroup(PhotoGroupReq photoGroupReq) {
        User user = userRepository.findById(photoGroupReq.getOwnerId())
                .orElseThrow(()-> new RuntimeException("User not found"));

        // Check authorization
        int authenticatedUserId = ((CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal()).getId();
        if(user.getId() != authenticatedUserId){
            throw new AccessDeniedException("UserId does not match ownerId");
        }

        PhotoGroup photoGroup = new PhotoGroup(photoGroupReq);
        photoGroupRepository.save(photoGroup);

        return new PhotoGroupDTO(photoGroup);
    }

    public PhotoGroup getGroupById(int groupId) {
        Optional<PhotoGroup> photoGroup = photoGroupRepository.findById(groupId);
        if (photoGroup.isEmpty()) {
            throw new RuntimeException("Group not found");
        }
        return photoGroup.get();
    }

    public void saveGroup(PhotoGroup photoGroup) {
        photoGroupRepository.save(photoGroup);
    }

    public void deleteGroup(int groupId) throws IOException {
        PhotoGroup photoGroup = getGroupById(groupId);

        // Check authorization
        int authenticatedUserId = ((CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal()).getId();
        if(photoGroup.getOwnerId() != authenticatedUserId){
            throw new AccessDeniedException("Only the owner may delete a group.");
        }

        Optional<PhotoGroupSummary> photoGroupSummary = photoGroupSummaryRepository.findByPhotoGroupId(groupId);
        if (photoGroupSummary.isPresent()) {
            for (UserImage userImage : photoGroupSummary.get().getUserImages()) {
                cloudinaryService.delete(userImage.getPublicId());
                userImageRepository.deleteById(userImage.getId());
            }
            photoGroupSummary.get().getUserImages().clear();
            photoGroupSummaryRepository.deleteById(photoGroupSummary.get().getId());
        }

        // REMOVES GROUP FROM ALL USERS
        for (User user : photoGroup.getUsers()) {
            user.getPhotoGroups().remove(photoGroup);

            // Live update user of remove through websocket
            HashMap<String, Object> newGroups = new HashMap<String, Object>();
            newGroups.put("groups", user.getPhotoGroups()
                    .stream()
                    .map(PhotoGroupDTO::new)
                    .collect(Collectors
                            .toList()));
            websocketService.pingUser(user.getId(), newGroups);

        }

        photoGroup.getUsers().clear();

        // Deletes all images from image server
        for (UserImage userImage : photoGroup.getUserImages()) {
            try {
                cloudinaryService.delete(userImage.getPublicId());
            } catch (Exception e) {
                throw new IOException("Failed to delete image: " + userImage.getPublicId());
            }
        }

        photoGroupRepository.deleteById(groupId);
    }

    public PhotoGroupDTO updateGroupName(int groupId, String name) {
        PhotoGroup photoGroup = photoGroupRepository.findById(groupId)
                .orElseThrow(()-> new RuntimeException("Group not found"));

        // Check authorization
        int authenticatedUserId = ((CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal()).getId();
        if(photoGroup.getOwnerId() != authenticatedUserId){
            throw new AccessDeniedException("UserId does not match ownerId");
        }

        photoGroup.setName(name);
        photoGroupRepository.save(photoGroup);

        websocketService.pingAllMembers(photoGroup);

        return new PhotoGroupDTO(photoGroup);
    }


    // ALL IMAGE RANKING FUNCTIONS
    public void setUserRank(int userId, int groupId) {
        PhotoGroupUserRanking photoGroupUserRanking = new PhotoGroupUserRanking(groupId, userId);
        photoGroupUserRankingRepository.save(photoGroupUserRanking);
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public void updateFirstRank(int userId, int groupId, int firstRankId) {
        Optional<PhotoGroupUserRanking> photoGroupUserRanking = photoGroupUserRankingRepository.findByPhotoGroupIdAndUserId(groupId, userId);
        if (photoGroupUserRanking.isEmpty()) {
            throw new RuntimeException("PhotoGroupUserRanking not found");
        }

        if (photoGroupUserRanking.get().getFirstRankId() != 0) {
            userImageService.updatePoints(photoGroupUserRanking.get().getFirstRankId(), -3);
        }
        photoGroupUserRanking.get().setFirstRankId(firstRankId);
        userImageService.updatePoints(firstRankId, 3);
        photoGroupUserRankingRepository.save(photoGroupUserRanking.get());
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public void updateSecondRank(int userId, int groupId, int secondRankId) {
        Optional<PhotoGroupUserRanking> photoGroupUserRanking = photoGroupUserRankingRepository.findByPhotoGroupIdAndUserId(groupId, userId);

        if (photoGroupUserRanking.isEmpty()) {
            throw new RuntimeException("PhotoGroupUserRanking not found");
        }
        if (photoGroupUserRanking.get().getSecondRankId() != 0) {
            userImageService.updatePoints(photoGroupUserRanking.get().getSecondRankId(), -2);
        }
        photoGroupUserRanking.get().setSecondRankId(secondRankId);
        userImageService.updatePoints(secondRankId, 2);
        photoGroupUserRankingRepository.save(photoGroupUserRanking.get());
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public void updateThirdRank(int userId, int groupId, int thirdRankId) {
        Optional<PhotoGroupUserRanking> photoGroupUserRanking = photoGroupUserRankingRepository.findByPhotoGroupIdAndUserId(groupId, userId);
        if (photoGroupUserRanking.isEmpty()) {
            throw new RuntimeException("PhotoGroupUserRanking not found");
        }
        if (photoGroupUserRanking.get().getThirdRankId() != 0) {
            userImageService.updatePoints(photoGroupUserRanking.get().getThirdRankId(), -1);
        }
        photoGroupUserRanking.get().setThirdRankId(thirdRankId);
        userImageService.updatePoints(thirdRankId, 1);
        photoGroupUserRankingRepository.save(photoGroupUserRanking.get());
    }

    // CHECKS IF GROUP IS EXPIRED
    public boolean isExpired(int groupId) {
        Optional<PhotoGroup> photoGroup = photoGroupRepository.findById(groupId);
        if (photoGroup.isEmpty()) {
            throw new RuntimeException("Group not found");
        }
        return photoGroup.get().getExpiresAt().isBefore(LocalDateTime.now());
    }

    // RESET GROUP METHODS =============================================================================================
    @Scheduled(cron = "0 0 0 * * ?")
    public void resetGroups() throws IOException {
        List<PhotoGroup> photoGroups = photoGroupRepository.findAll();
        for (PhotoGroup photoGroup : photoGroups) {
            if (isExpired(photoGroup.getId())) {
                createPhotoGroupSummary(photoGroup);

                // UDPATES EXPIRATION DATE
                LocalDateTime newExpiresAt = photoGroup.getExpiresAt().plusDays(7).with(LocalTime.of(23, 59, 59));
                photoGroup.setExpiresAt(newExpiresAt);

                updateExpiredGroups(photoGroup);
            }
        }
    }

    // Helper method: creates/overwrites new summary for group resetting
    public void createPhotoGroupSummary(PhotoGroup photoGroup) throws IOException {
        Optional<PhotoGroupSummary> existingPhotoGroupSummary = photoGroupSummaryRepository.findByPhotoGroupId(photoGroup.getId()); // CHECKS IF GROUP SUMMARY EXISTS
        List<UserImage> userImages = photoGroup.getUserImages(); // GETS ALL IMAGES
        if (existingPhotoGroupSummary.isPresent()) {
            PhotoGroupSummary photoGroupSummary = existingPhotoGroupSummary.get();
            for (UserImage image : new ArrayList<>(photoGroupSummary.getUserImages())) {
                cloudinaryService.delete(image.getPublicId());
                userImageRepository.deleteById(image.getId());
            }
            photoGroupSummary.getUserImages().clear();
            for (UserImage image : userImages) {
                image.setSummary(photoGroupSummary);
            }
            photoGroupSummary.getUserImages().addAll(userImages);
            photoGroupSummaryRepository.save(photoGroupSummary);
        }
        else {
            System.out.println("1");
            PhotoGroupSummary newPhotoGroupSummary = new PhotoGroupSummary(); // CREATES NEW GROUP SUMMARY
            System.out.println("2");
            newPhotoGroupSummary.setGroupId(photoGroup.getId());
            System.out.println("3");
            for (UserImage image : userImages) {
                image.setSummary(newPhotoGroupSummary);
            }
            System.out.println("4");
            newPhotoGroupSummary.getUserImages().addAll(userImages);
            System.out.println("5");
            photoGroupSummaryRepository.save(newPhotoGroupSummary);
        }

        userImageService.saveAllImages(userImages);
    }

    // Helper method: handles points and image deletion in group resetting
    public void updateExpiredGroups(PhotoGroup photoGroup) {
        System.out.println("INSIDE");
        // UPDATE POINTS
        UserImage first = photoGroup.getCurrentFirstPlaceImage();
        UserImage second = photoGroup.getCurrentSecondPlaceImage();
        UserImage third = photoGroup.getCurrentThirdPlaceImage();

        System.out.println("POINTS:");
        if (first != null && first.getPoints() > 0) {
            photoGroupPointsRepository.findByGroupAndUser(photoGroup, first.getUser())
                    .ifPresent(p -> p.setPoints(p.getPoints() + 3));
        }
        if (second != null && second.getPoints() > 0) {
            photoGroupPointsRepository.findByGroupAndUser(photoGroup, second.getUser())
                    .ifPresent(p -> p.setPoints(p.getPoints() + 2));
        }
        if (third != null && third.getPoints() > 0) {
            photoGroupPointsRepository.findByGroupAndUser(photoGroup, third.getUser())
                    .ifPresent(p -> p.setPoints(p.getPoints() + 1));
        }

        System.out.println("HERE");
        // CLEAR IMAGES
        for (UserImage image : new ArrayList<>(photoGroup.getUserImages())) {
            image.setPhotoGroup(null);  // Remove association
            userImageService.saveImage(image);
        }
        photoGroupRepository.save(photoGroup);
    }
    // =================================================================================================================

    public PhotoGroupSummaryDTO getGroupSummary(int groupId) {
        PhotoGroup photoGroup = getGroupById(groupId);

        // Check authorization i.e. user belongs to group
        int authenticatedUserId = ((CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal()).getId();
        if(photoGroup.getUsers().stream().noneMatch((u)-> u.getId() == authenticatedUserId)){
            throw new AccessDeniedException("User is not in group");
        }

        Optional<PhotoGroupSummary> photoGroupSummary = photoGroupSummaryRepository.findByPhotoGroupId(photoGroup.getId());
        if (photoGroupSummary.isEmpty()) {
            throw new RuntimeException("Group summary will appear after expiration date.");
        }
        return new PhotoGroupSummaryDTO(photoGroupSummary.get());
    }

    // resets photo group of given ID before its scheduled date
    public void resetGroup(int groupId) throws IOException{
        PhotoGroup group = photoGroupRepository.findById(groupId).orElseThrow(
                ()-> new RuntimeException("Group not found.")
        );

        // Check authorization: caller is group owner
        int authenticatedUserId = ((CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal()).getId();
        if(group.getOwnerId() != authenticatedUserId){
            throw new AccessDeniedException("User is not group owner");
        }

        // create summary, change reset date to week from now, reset group
        createPhotoGroupSummary(group);
        LocalDateTime newExpiresAt = LocalDateTime.now().plusDays(7).with(LocalTime.of(23, 59, 59));
        group.setExpiresAt(newExpiresAt);
        updateExpiredGroups(group);     // also saves group

        websocketService.pingAllMembers(group);     // live update group members of change
    }
}
