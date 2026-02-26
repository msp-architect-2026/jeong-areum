package com.tripdeal.tripdeal.repository;

import com.tripdeal.tripdeal.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying; // 🔥 추가
import org.springframework.data.jpa.repository.Query;    // 🔥 추가
import org.springframework.data.repository.query.Param; // 🔥 추가
import org.springframework.transaction.annotation.Transactional; // 🔥 추가

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllByOrderByCreatedAtDesc();
    List<Review> findByAuthorEmailOrderByCreatedAtDesc(String authorEmail);

    // 🔥 사용자의 이메일을 찾아 작성자 이름(authorName)을 일괄 업데이트하는 메서드
    @Modifying
    @Transactional
    @Query("UPDATE Review r SET r.authorName = :newNickname WHERE r.authorEmail = :email")
    void updateAuthorNameByEmail(@Param("newNickname") String newNickname, @Param("email") String email);

    // 🔥 사용자의 이메일을 찾아 프로필 이미지(authorProfileImageUrl)를 일괄 업데이트하는 메서드
    @Modifying
    @Transactional
    @Query("UPDATE Review r SET r.authorProfileImageUrl = :newProfileImage WHERE r.authorEmail = :email")
    void updateAuthorProfileImageByEmail(@Param("newProfileImage") String newProfileImage, @Param("email") String email);
}