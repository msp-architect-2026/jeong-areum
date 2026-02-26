package com.tripdeal.tripdeal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class CouponEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;          // 예: "제주 호텔 특가 쿠폰"
    private String description;    // 예: "최대 50% 할인"
    private int discountRate;      // 예: 50
    private int totalCount;        // 발급 총 수량
    private LocalDateTime openAt;  // 오픈 시간
    private LocalDateTime expireAt; // 만료 시간

    // getter & setter
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getDiscountRate() { return discountRate; }
    public void setDiscountRate(int discountRate) { this.discountRate = discountRate; }
    public int getTotalCount() { return totalCount; }
    public void setTotalCount(int totalCount) { this.totalCount = totalCount; }
    public LocalDateTime getOpenAt() { return openAt; }
    public void setOpenAt(LocalDateTime openAt) { this.openAt = openAt; }
    public LocalDateTime getExpireAt() { return expireAt; }
    public void setExpireAt(LocalDateTime expireAt) { this.expireAt = expireAt; }
}