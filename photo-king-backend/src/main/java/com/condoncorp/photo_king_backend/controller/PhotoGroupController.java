package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.PhotoGroupDTO;
import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.repository.PhotoGroupRepository;
import com.condoncorp.photo_king_backend.service.PhotoGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


@RestController
@RequestMapping(path="api/photo-group")
public class PhotoGroupController {
    @Autowired
    private PhotoGroupRepository photoGroupRepository;

    @Autowired
    private PhotoGroupService photoGroupService;

    // CREATES A PHOTO GROUP
    @PostMapping(path = "/add")
    public PhotoGroupDTO addGroup(@RequestBody PhotoGroupDTO photoGroupDTO) {
        return photoGroupService.addGroup(photoGroupDTO);
    }

    @DeleteMapping(path = "/delete/{id}")
    public void deleteGroup(@PathVariable int id) throws IOException {
        photoGroupService.deleteGroup(id);
    }

    @PutMapping(path = "/update-user-rank/{groupId}/{userId}")
    public void updateUserRank(@PathVariable int groupId, @PathVariable int userId) {
        photoGroupService.updateUserRank(groupId, userId);
    }



}
