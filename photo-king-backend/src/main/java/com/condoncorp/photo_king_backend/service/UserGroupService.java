package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.PhotoGroupDTO;
import com.condoncorp.photo_king_backend.dto.UserDTO;
import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserGroupService {

    @Autowired
    private UserService userService;
    @Autowired
    private PhotoGroupService photoGroupService;

    public PhotoGroupDTO addUserToGroup(int userId, int groupId) {
        User user = userService.getUserById(userId);
        PhotoGroup photoGroup = photoGroupService.getGroupById(groupId);

        user.getPhotoGroups().add(photoGroup);
        photoGroup.getUsers().add(user);

        // UPDATE RANKINGS
        photoGroupService.setUserRank(user.getId(), photoGroup.getId());

        userService.saveUser(user);
        photoGroupService.saveGroup(photoGroup);

        return new PhotoGroupDTO(photoGroup);
    }

    public PhotoGroupDTO removeUserFromGroup(int userId, int groupId) {
        User user = userService.getUserById(userId);
        PhotoGroup photoGroup = photoGroupService.getGroupById(groupId);

        user.getPhotoGroups().remove(photoGroup);
        photoGroup.getUsers().remove(user);

        userService.saveUser(user);
        photoGroupService.saveGroup(photoGroup);

        return new PhotoGroupDTO(photoGroup);
    }

}
