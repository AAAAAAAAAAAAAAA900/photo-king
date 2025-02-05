package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.service.UserGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user-groups")
public class UserGroupController {

    @Autowired
    private UserGroupService userGroupService;


    @PostMapping("/add-user/{userId}/{groupId}")
    public User addUserToGroup(@PathVariable int userId, @PathVariable int groupId) {
        return userGroupService.addUserToGroup(userId, groupId);
    }
}
