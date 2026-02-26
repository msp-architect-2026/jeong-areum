package com.tripdeal.tripdeal.controller;

import com.tripdeal.tripdeal.entity.CouponEvent;
import java.time.LocalDateTime;

public class CouponEventResponseDto {

    private Long id;
    private String title;
    private String description;
    private int discountRate;
    private int totalCount;
    private LocalDateTime openAt;
    private LocalDateTime expireAt;
    private boolean isOpen;  // 서버에서 계산

    public CouponEventResponseDto(CouponEvent event) {
        LocalDateTime now = LocalDateTime.now();
        this.id = event.getId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.discountRate = event.getDiscountRate();
        this.totalCount = event.getTotalCount();
        this.openAt = event.getOpenAt();
        this.expireAt = event.getExpireAt();
        this.isOpen = event.getOpenAt().isBefore(now);
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public int getDiscountRate() { return discountRate; }
    public int getTotalCount() { return totalCount; }
    public LocalDateTime getOpenAt() { return openAt; }
    public LocalDateTime getExpireAt() { return expireAt; }
    public boolean isOpen() { return isOpen; }
}