package com.tripdeal.tripdeal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String category;

    @Column(name = "author_name", nullable = false)
    private String authorName;

    @Column(name = "author_email", nullable = false)
    private String authorEmail;

    @Column(name = "author_profile_image_url")
    private String authorProfileImageUrl;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column
    private int likes = 0;

    public Review() {}

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getLocation() { return location; }
    public String getCategory() { return category; }
    public String getAuthorName() { return authorName; }
    public String getAuthorEmail() { return authorEmail; }
    public String getAuthorProfileImageUrl() { return authorProfileImageUrl; }
    public String getImageUrl() { return imageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public int getLikes() { return likes; }

    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setLocation(String location) { this.location = location; }
    public void setCategory(String category) { this.category = category; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public void setAuthorEmail(String authorEmail) { this.authorEmail = authorEmail; }
    public void setAuthorProfileImageUrl(String authorProfileImageUrl) { this.authorProfileImageUrl = authorProfileImageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setLikes(int likes) { this.likes = likes; }
}