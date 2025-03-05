package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.PhotoGroupDTO;
import com.condoncorp.photo_king_backend.repository.PhotoGroupRepository;
import com.condoncorp.photo_king_backend.service.PhotoGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;


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

    @PostMapping(path = "/update-user-rank")
    public void updateUserRank(@RequestParam("images") List<Integer> images, @RequestParam("userId") int userId, @RequestParam("groupId") int groupId) {
        if ( images.size() == 1 ) {
            photoGroupService.updateFirstRank(images.get(0), userId, groupId);
        }
        else if ( images.size() == 2 ) {
            photoGroupService.updateFirstRank(images.get(0), userId, groupId);
            photoGroupService.updateSecondRank(images.get(1), userId, groupId);
        }
        else if ( images.size() == 3 ) {
            photoGroupService.updateFirstRank(images.get(0), userId, groupId);
            photoGroupService.updateSecondRank(images.get(1), userId, groupId);
            photoGroupService.updateThirdRank(images.get(2), userId, groupId);
        }
        else {
            throw new RuntimeException("Invalid number of images");
        }

    }




}
