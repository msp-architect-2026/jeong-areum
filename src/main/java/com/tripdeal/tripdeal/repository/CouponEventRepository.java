package com.tripdeal.tripdeal.repository;

import com.tripdeal.tripdeal.entity.CouponEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CouponEventRepository extends JpaRepository<CouponEvent, Long> {

    // 현재 시간 기준으로 앞으로 48시간 이내 오픈 예정 or 이미 오픈된 것
    @Query("SELECT c FROM CouponEvent c WHERE c.openAt <= :until AND c.expireAt >= :now ORDER BY c.openAt ASC")
    List<CouponEvent> findUpcoming(
            @Param("now") LocalDateTime now,
            @Param("until") LocalDateTime until
    );
}