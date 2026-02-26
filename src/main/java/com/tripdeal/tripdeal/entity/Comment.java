package com.tripdeal.tripdeal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "review_id", nullable = false)
    private Long reviewId;

    @Column(nullable = false)
    private String content;

    @Column(name = "author_name", nullable = false)
    private String authorName;

    // 🔥 추가: 유저 식별 및 닉네임 동기화를 위해 필요
    @Column(name = "author_email", nullable = false)
    private String authorEmail;

    @Column(name = "author_profile_image_url")
    private String authorProfileImageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() { this.createdAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public Long getReviewId() { return reviewId; }
    public String getContent() { return content; }
    public String getAuthorName() { return authorName; }
    public String getAuthorEmail() { return authorEmail; }
    public String getAuthorProfileImageUrl() { return authorProfileImageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setReviewId(Long reviewId) { this.reviewId = reviewId; }
    public void setContent(String content) { this.content = content; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public void setAuthorEmail(String authorEmail) { this.authorEmail = authorEmail; }
    public void setAuthorProfileImageUrl(String authorProfileImageUrl) { this.authorProfileImageUrl = authorProfileImageUrl; }
}