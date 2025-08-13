package com.condoncorp.photo_king_backend.controller;

import com.condoncorp.photo_king_backend.dto.PhotoGroupDTO;
import com.condoncorp.photo_king_backend.dto.PhotoGroupReq;
import com.condoncorp.photo_king_backend.dto.PhotoGroupSummaryDTO;
import com.condoncorp.photo_king_backend.dto.RankUpdateReq;
import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.repository.PhotoGroupRepository;
import com.condoncorp.photo_king_backend.service.PhotoGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping(path="api/photo-group")
public class PhotoGroupController {
    @Autowired
    private PhotoGroupRepository photoGroupRepository;

    @Autowired
    private PhotoGroupService photoGroupService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // CREATES A PHOTO GROUP
    @PostMapping(path = "/add")
    public ResponseEntity<?> addGroup(@RequestBody PhotoGroupReq photoGroupReq) {
        return ResponseEntity.ok(photoGroupService.addGroup(photoGroupReq));

    }

    @DeleteMapping(path = "/delete/{id}")
    public void deleteGroup(@PathVariable int id) throws IOException {
        photoGroupService.deleteGroup(id);
    }


    // UPDATES USER'S RANKINGS
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

        // Live update group of ranking change
        messagingTemplate.convertAndSend("/topic/picture/" + groupId);
    }

    // CHECKS IF GROUP IS EXPIRED
    @GetMapping(path = "/expired")
    public boolean isExpired(int groupId) {
        return photoGroupService.isExpired(groupId);
    }

    @PutMapping(path="/update-name/{id}/{name}")
    public PhotoGroupDTO updateName(@PathVariable int id, @PathVariable String name) {
        return photoGroupService.updateGroupName(id, name);
    }

    @GetMapping(path="/get-summary/{id}")
    public ResponseEntity<?> getSummary(@PathVariable int id) {
        try {
            return ResponseEntity.ok(photoGroupService.getGroupSummary(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping(path="/test/{id}")
    public void test(@PathVariable int id) {
        PhotoGroup photoGroup = photoGroupService.getGroupById(id);
        LocalDateTime newExpirationTest = LocalDateTime.now().plusMinutes(1);
        photoGroup.setExpiresAt(newExpirationTest);
        photoGroupRepository.save(photoGroup);
    }

    @PostMapping(path="/summary")
    public void summaryTest() throws IOException {
        photoGroupService.resetGroups();
    }




}
