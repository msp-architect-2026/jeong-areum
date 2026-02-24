package com.tripdeal.tripdeal.controller;

public class ReviewRequest {

    private String title;
    private String content;
    private String location;
    private String category;
    private String authorEmail;
    private String imageUrl;

    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getLocation() { return location; }
    public String getCategory() { return category; }
    public String getAuthorEmail() { return authorEmail; }
    public String getImageUrl() { return imageUrl; }
}