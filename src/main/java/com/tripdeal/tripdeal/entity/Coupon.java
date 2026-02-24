package com.tripdeal.tripdeal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Entity
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long dealId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime downloadedAt;

    private int validDays = 30;

    public long getRemainingDays() {
        LocalDate expiry = downloadedAt.toLocalDate().plusDays(validDays);
        LocalDate today = LocalDate.now();
        return ChronoUnit.DAYS.between(today, expiry);
    }

    // getter & setter

    public Long getDealId() { return dealId; }
    public void setDealId(Long dealId) { this.dealId = dealId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDateTime getDownloadedAt() { return downloadedAt; }
    public void setDownloadedAt(LocalDateTime downloadedAt) { this.downloadedAt = downloadedAt; }
}