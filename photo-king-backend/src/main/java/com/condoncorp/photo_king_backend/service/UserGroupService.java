package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.CustomUserDetails;
import com.condoncorp.photo_king_backend.dto.PhotoGroupDTO;
import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.PhotoGroupPoints;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.repository.PhotoGroupPointsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserGroupService {

    @Autowired
    private UserService userService;
    @Autowired
    private PhotoGroupService photoGroupService;
    @Autowired
    private PhotoGroupPointsRepository photoGroupPointsRepository;
    @Autowired
    private WSService websocketService;

    public PhotoGroupDTO addUserToGroup(int userId, int groupId) {
        User user = userService.getUserById(userId);
        PhotoGroup photoGroup = photoGroupService.getGroupById(groupId);

        // Check authorization i.e. person doing the adding belongs to group
        int authenticatedUserId = ((CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal()).getId();
        if(authenticatedUserId != photoGroup.getOwnerId() &&
            photoGroup.getUsers().stream().noneMatch((u)-> u.getId() == authenticatedUserId)){
            throw new AccessDeniedException("User adding is not in group");
        }

        user.getPhotoGroups().add(photoGroup);
        photoGroup.getUsers().add(user);

        // UPDATE RANKINGS
        photoGroupService.setUserRank(user.getId(), photoGroup.getId());

        // SET POINTS
        PhotoGroupPoints photoGroupPoints = new PhotoGroupPoints(photoGroup, user, 0);
        photoGroup.getPhotoGroupPoints().add(photoGroupPoints);
        photoGroupPointsRepository.save(photoGroupPoints);

        userService.saveUser(user);
        photoGroupService.saveGroup(photoGroup);

        // Live update all users in group of add
        websocketService.pingAllMembers(photoGroup);

        return new PhotoGroupDTO(photoGroup);
    }

    public PhotoGroupDTO removeUserFromGroup(int userId, int groupId) {
        User user = userService.getUserById(userId);
        PhotoGroup photoGroup = photoGroupService.getGroupById(groupId);

        // Check authorization i.e. owner is doing the removing
        int authenticatedUserId = ((CustomUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal()).getId();
        if(photoGroup.getOwnerId() != authenticatedUserId){
            throw new AccessDeniedException("Only group owner may remove members.");
        }

        user.getPhotoGroups().remove(photoGroup);
        photoGroup.getUsers().remove(user);

        userService.saveUser(user);
        photoGroupService.saveGroup(photoGroup);

        // Live update all users in group of remove
        websocketService.pingAllMembers(photoGroup);

        return new PhotoGroupDTO(photoGroup);
    }

    @PreAuthorize("#userId == authentication.principal.id")
    public List<PhotoGroupDTO> getGroupsByUserId(int userId) {
        User user = userService.getUserById(userId);
        return user.getPhotoGroups().stream().map(PhotoGroupDTO::new).toList();
    }

}
