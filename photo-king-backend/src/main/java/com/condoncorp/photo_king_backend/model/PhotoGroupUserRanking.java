package com.condoncorp.photo_king_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "photo_group_user_ranking")
public class PhotoGroupUserRanking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "group_id" , nullable = false)
    private int groupId;

    @Column(name = "user_id" , nullable = false)
    private int userId;

    @Column(name = "first_rank")
    private int firstRankId;

    @Column(name = "second_rank")
    private int secondRankId;

    @Column(name = "third_rank")
    private int thirdRankId;

    public PhotoGroupUserRanking(int groupId, int userId, int firstRankId, int secondRankId, int thirdRankId) {
        this.groupId = groupId;
        this.userId = userId;
        this.firstRankId = firstRankId;
        this.secondRankId = secondRankId;
        this.thirdRankId = thirdRankId;

    }

    public PhotoGroupUserRanking(int groupId, int userId) {
        this.groupId = groupId;
        this.userId = userId;
    }

    public PhotoGroupUserRanking() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getGroupId() {
        return groupId;
    }

    public void setGroupId(int groupId) {
        this.groupId = groupId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getFirstRankId() {
        return firstRankId;
    }

    public void setFirstRankId(int firstRankId) {
        this.firstRankId = firstRankId;
    }

    public int getSecondRankId() {
        return secondRankId;
    }

    public void setSecondRankId(int secondRankId) {
        this.secondRankId = secondRankId;
    }

    public int getThirdRankId() {
        return thirdRankId;
    }

    public void setThirdRankId(int thirdRankId) {
        this.thirdRankId = thirdRankId;
    }
}
