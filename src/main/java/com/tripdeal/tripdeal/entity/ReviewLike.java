package com.tripdeal.tripdeal.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "review_likes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "review_id"})
)
public class ReviewLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    public ReviewLike() {}

    public ReviewLike(User user, Review review) {
        this.user = user;
        this.review = review;
    }

    public User getUser() { return user; }
    public Review getReview() { return review; }
}