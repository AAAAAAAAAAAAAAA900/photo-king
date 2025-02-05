package com.condoncorp.photo_king_backend.service;

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

    public User addUserToGroup(int userId, int groupId) {
        User user = userService.getUserById(userId);
        PhotoGroup photoGroup = photoGroupService.getGroupById(groupId);

        user.getPhotoGroups().add(photoGroup);
        photoGroup.getUsers().add(user);
        userService.saveUser(user);
        photoGroupService.saveGroup(photoGroup);

        return user;
    }


}
