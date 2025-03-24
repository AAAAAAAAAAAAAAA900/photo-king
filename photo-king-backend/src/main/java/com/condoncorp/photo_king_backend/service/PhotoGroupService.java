package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.PhotoGroupDTO;
import com.condoncorp.photo_king_backend.dto.PhotoGroupReq;
import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.PhotoGroupUserRanking;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.model.UserImage;
import com.condoncorp.photo_king_backend.repository.PhotoGroupRepository;
import com.condoncorp.photo_king_backend.repository.PhotoGroupUserRankingRepository;
import com.condoncorp.photo_king_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Optional;

@Service
public class PhotoGroupService {

    @Autowired
    private PhotoGroupRepository photoGroupRepository;
    @Autowired
    private PhotoGroupUserRankingRepository photoGroupUserRankingRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserImageService userImageService;


    public PhotoGroupDTO addGroup(PhotoGroupReq photoGroupReq) {
        Optional<User> user = userRepository.findById(photoGroupReq.getOwnerId());
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
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

        // REMOVES GROUP FROM ALL USERS
        for (User user : photoGroup.getUsers()) {
            user.getPhotoGroups().remove(photoGroup);
        }

        photoGroup.getUsers().clear();

        // RETURNS ALL IMAGES IN A GROUP AND DELETES THEM
        for (UserImage userImage : photoGroup.getUserImages()) {
            userImageService.deleteImage(userImage.getId());
        }

        photoGroupRepository.deleteById(groupId);
    }

    public PhotoGroupDTO updateGroupName(int groupId, String name) {
        Optional<PhotoGroup> photoGroup = photoGroupRepository.findById(groupId);
        if (photoGroup.isEmpty()) {
            throw new RuntimeException("Group not found");
        }
        photoGroup.get().setName(name);
        photoGroupRepository.save(photoGroup.get());
        return new PhotoGroupDTO(photoGroup.get());
    }


    // ALL IMAGE RANKING FUNCTIONS
    public void setUserRank(int userId, int groupId) {
        PhotoGroupUserRanking photoGroupUserRanking = new PhotoGroupUserRanking(groupId, userId);
        photoGroupUserRankingRepository.save(photoGroupUserRanking);
    }

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











}
