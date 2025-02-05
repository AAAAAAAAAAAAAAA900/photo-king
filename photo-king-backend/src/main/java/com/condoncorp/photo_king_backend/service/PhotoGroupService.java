package com.condoncorp.photo_king_backend.service;

import com.condoncorp.photo_king_backend.dto.PhotoGroupDTO;
import com.condoncorp.photo_king_backend.model.PhotoGroup;
import com.condoncorp.photo_king_backend.repository.PhotoGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PhotoGroupService {

    @Autowired
    private PhotoGroupRepository photoGroupRepository;


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




}
