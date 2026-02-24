package com.tripdeal.tripdeal.repository;

import com.tripdeal.tripdeal.entity.Coupon;
import com.tripdeal.tripdeal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    List<Coupon> findByUser(User user);

    boolean existsByUserAndDealId(User user, Long dealId);
}