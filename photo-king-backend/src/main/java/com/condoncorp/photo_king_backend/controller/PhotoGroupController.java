package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.PhotoGroupDTO;
import com.condoncorp.photo_king_backend.dto.RankUpdateReq;
import com.condoncorp.photo_king_backend.repository.PhotoGroupRepository;
import com.condoncorp.photo_king_backend.service.PhotoGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Arrays;
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
    public void updateUserRank(@RequestBody RankUpdateReq rankUpdateReq) {
        List<Integer> images = rankUpdateReq.getImages();
        int userId = rankUpdateReq.getUserId();
        int groupId = rankUpdateReq.getGroupId();

        if ( images.size() == 1 ) {
            photoGroupService.updateFirstRank(userId, groupId, images.get(0));
        }
        else if ( images.size() == 2 ) {
            photoGroupService.updateFirstRank(userId, groupId, images.get(0));
            photoGroupService.updateSecondRank(userId, groupId, images.get(1));
        }
        else if ( images.size() == 3 ) {
            photoGroupService.updateFirstRank(userId, groupId, images.get(0));
            photoGroupService.updateSecondRank(userId, groupId, images.get(1));
            photoGroupService.updateThirdRank(userId, groupId, images.get(2));
        }
        else {
            throw new RuntimeException("Invalid number of images");
        }



    }




}
