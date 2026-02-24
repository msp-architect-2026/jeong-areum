package com.tripdeal.tripdeal.controller;

import com.tripdeal.tripdeal.entity.Coupon;

public class CouponResponseDto {

    private Long dealId;
    private long remainingDays;

    public CouponResponseDto(Coupon coupon) {
        this.dealId = coupon.getDealId();
        this.remainingDays = coupon.getRemainingDays();
    }

    public Long getDealId() {
        return dealId;
    }

    public long getRemainingDays() {
        return remainingDays;
    }
}