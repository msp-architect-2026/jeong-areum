package com.tripdeal.tripdeal.repository;

import com.tripdeal.tripdeal.entity.Review;
import com.tripdeal.tripdeal.entity.ReviewLike;
import com.tripdeal.tripdeal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Long> {

    boolean existsByUserAndReview(User user, Review review);

    // 유저가 좋아요 누른 목록 찾기
    List<ReviewLike> findByUser(User user);

    @Modifying
    @Transactional
    void deleteByUserAndReview(User user, Review review);
}