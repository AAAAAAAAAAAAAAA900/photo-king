package com.condoncorp.photo_king_backend.model;

import com.condoncorp.photo_king_backend.dto.UserImageDTO;
import jakarta.persistence.*;

import java.util.List;


@Entity
public class PhotoGroupSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name = "photo_group_id", nullable = false, foreignKey = @ForeignKey(name = "fk_summary_photo_group"))
    private PhotoGroup photoGroup;

    public PhotoGroupSummary(PhotoGroup photoGroup) {
        this.photoGroup = photoGroup;
    }

    public PhotoGroupSummary() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public PhotoGroup getPhotoGroup() {
        return photoGroup;
    }

    public void setPhotoGroup(PhotoGroup photoGroup) {
        this.photoGroup = photoGroup;
    }

    public List<UserImage> getImages() {
        return photoGroup.getUserImages();
    }

    public UserImage getFirstPlaceImage() {
        List<UserImage> userImages = photoGroup.getUserImages();
        if (userImages.isEmpty()) {
            return null;
        }

        if (userImages.size() == 1) {
            return userImages.get(0);
        }

        userImages.sort((o1, o2) -> Integer.compare(o2.getPoints(), o1.getPoints()));
        return userImages.get(0);
    }

    public UserImage getSecondPlaceImage() {
        List<UserImage> userImages = photoGroup.getUserImages();
        if (userImages.isEmpty()) {
            return null;
        }

        if (userImages.size() == 1) {
            return null;
        }

        userImages.sort((o1, o2) -> Integer.compare(o2.getPoints(), o1.getPoints()));
        return userImages.get(1);
    }

    public UserImage getThirdPlaceImage() {
        List<UserImage> userImages = photoGroup.getUserImages();
        if (userImages.isEmpty()) {
            return null;
        }

        if (userImages.size() == 1) {
            return null;
        }

        userImages.sort((o1, o2) -> Integer.compare(o2.getPoints(), o1.getPoints()));
        return userImages.get(2);
    }

}
