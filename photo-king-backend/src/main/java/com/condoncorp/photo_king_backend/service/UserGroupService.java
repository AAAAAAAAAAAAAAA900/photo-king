package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.FriendDTO;
import com.condoncorp.photo_king_backend.dto.PhotoGroupDTO;
import com.condoncorp.photo_king_backend.dto.UserDTO;
import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.PhotoGroupPoints;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.repository.PhotoGroupPointsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserGroupService {

    @Autowired
    private UserService userService;
    @Autowired
    private PhotoGroupService photoGroupService;
    @Autowired
    private PhotoGroupPointsRepository photoGroupPointsRepository;
    @Autowired
    SimpMessagingTemplate messagingTemplate;

    public PhotoGroupDTO addUserToGroup(int userId, int groupId) {
        User user = userService.getUserById(userId);
        PhotoGroup photoGroup = photoGroupService.getGroupById(groupId);

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

        // Live update user of add through websocket
        HashMap<String, Object> newGroups = new HashMap<String, Object>();
        newGroups.put("groups", user.getPhotoGroups()
                .stream()
                .map(PhotoGroupDTO::new)
                .collect(Collectors
                        .toList()));
        messagingTemplate.convertAndSend("/topic/update/" + user.getId(), newGroups);

        return new PhotoGroupDTO(photoGroup);
    }

    public PhotoGroupDTO removeUserFromGroup(int userId, int groupId) {
        User user = userService.getUserById(userId);
        PhotoGroup photoGroup = photoGroupService.getGroupById(groupId);

        user.getPhotoGroups().remove(photoGroup);
        photoGroup.getUsers().remove(user);

        userService.saveUser(user);
        photoGroupService.saveGroup(photoGroup);

        // Live update user of remove through websocket
        HashMap<String, Object> newGroups = new HashMap<String, Object>();
        newGroups.put("groups", user.getPhotoGroups()
                .stream()
                .map(PhotoGroupDTO::new)
                .collect(Collectors
                        .toList()));
        messagingTemplate.convertAndSend("/topic/update/" + user.getId(), newGroups);

        return new PhotoGroupDTO(photoGroup);
    }

    public List<PhotoGroupDTO> getGroupsByUserId(int userId) {
        User user = userService.getUserById(userId);
        return user.getPhotoGroups().stream().map(PhotoGroupDTO::new).toList();
    }

}
