package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.PhotoGroupDTO;
import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.model.User;
import com.condoncorp.photo_king_backend.model.UserImage;
import com.condoncorp.photo_king_backend.repository.PhotoGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class PhotoGroupService {

    @Autowired
    private PhotoGroupRepository photoGroupRepository;
    @Autowired
    private UserImageService userImageService;


    public PhotoGroup addGroup(PhotoGroupDTO photoGroupDTO) {
        PhotoGroup photoGroup = new PhotoGroup(photoGroupDTO.getName());
        photoGroupRepository.save(photoGroup);
        return photoGroup;
    }

    public PhotoGroup getGroupById(int groupId) {
        Optional<PhotoGroup> photoGroup = photoGroupRepository.findById(groupId);
        if (photoGroup.isEmpty()) {
            throw new RuntimeException("Group not found");
        }
        return photoGroup.get();
    }

    public void saveGroup(PhotoGroup photoGroup) {
        photoGroupRepository.save(photoGroup);
    }

    public void deleteGroup(int groupId) throws IOException {

        PhotoGroup photoGroup = getGroupById(groupId);

        // REMOVES GROUP FROM ALL USERS
        for (User user : photoGroup.getUsers()) {
            user.getPhotoGroups().remove(photoGroup);
        }

        photoGroup.getUsers().clear();

        // RETURNS ALL IMAGES IN A GROUP AND DELETES THEM
        for (UserImage userImage : userImageService.getImagesByGroup(groupId)) {
            userImageService.deleteImage(userImage.getId());
        }

        photoGroupRepository.deleteById(groupId);
    }





}
