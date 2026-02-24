package com.tripdeal.tripdeal.controller;

public class SignupRequest {

    private String email;
    private String password;
    private String name;
    private String profileImageUrl;
    private String nickname;

    // 🔹 기본 생성자
    public SignupRequest() {}

    // 🔹 Getter
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getName() {
        return name;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public String getNickname() {
        return nickname;
    }

    // 🔹 Setter
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
}