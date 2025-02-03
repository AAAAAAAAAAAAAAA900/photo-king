package com.condoncorp.photo_king_backend.model;


import jakarta.persistence.*;


@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false, length = 20, name = "username")
    private String username;
    @Column(nullable = false, length = 128, name = "password")
    private String password;
    @Column(unique = true, nullable = false, length = 320, name = "email")
    private String email;
    @Column(unique = true, nullable = false, length = 20, name = "phone")
    private String phone;
    @Column(unique = true, nullable = false, length = 20, name = "firstname")
    private String firstname;
    @Column(unique = true, nullable = false, length = 20, name = "lastname")
    private String lastname;

    public User(int id, String username, String password, String phone, String email, String lastname, String firstname) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.phone = phone;
        this.email = email;
        this.lastname = lastname;
        this.firstname = firstname;
    }


    public User() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }
}
