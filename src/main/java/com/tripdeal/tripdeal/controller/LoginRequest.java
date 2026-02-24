package com.tripdeal.tripdeal.controller;

public class LoginRequest {

    private String email;
    private String password;

    // 🔹 기본 생성자 (Jackson 필수)
    public LoginRequest() {}

    // 🔹 Getter
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    // 🔹 Setter (반드시 필요)
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}