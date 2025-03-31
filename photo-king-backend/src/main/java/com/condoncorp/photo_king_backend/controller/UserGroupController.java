package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.PhotoGroupDTO;
import com.condoncorp.photo_king_backend.dto.UserDTO;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.service.UserGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-groups")
public class UserGroupController {

    @Autowired
    private UserGroupService userGroupService;


    // ADDS A USER TO ANY GROUP
    @PostMapping("/add-user/{userId}/{groupId}")
    public PhotoGroupDTO addUserToGroup(@PathVariable int userId, @PathVariable int groupId) {
        return userGroupService.addUserToGroup(userId, groupId);
    }

    // REMOVES USER FROM GROUP
    @PostMapping("/remove-user/{userId}/{groupId}")
    public PhotoGroupDTO removeUserFromGroup(@PathVariable int userId, @PathVariable int groupId) {
        return userGroupService.removeUserFromGroup(userId, groupId);
    }

    @GetMapping(path = "/get-groups/{id}")
    public List<PhotoGroupDTO> getGroupsByUserId(@PathVariable int id) {
        return userGroupService.getGroupsByUserId(id);
    }

}
