package com.tripdeal.tripdeal.repository;

import com.tripdeal.tripdeal.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying; // 🔥 추가
import org.springframework.data.jpa.repository.Query;    // 🔥 추가
import org.springframework.data.repository.query.Param; // 🔥 추가
import org.springframework.transaction.annotation.Transactional; // 🔥 추가
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByReviewIdOrderByCreatedAtAsc(Long reviewId);

    // 🔥 닉네임 일괄 업데이트
    @Modifying
    @Transactional
    @Query("UPDATE Comment c SET c.authorName = :newName WHERE c.authorEmail = :email")
    void updateAuthorNameByEmail(@Param("newName") String newName, @Param("email") String email);

    // 🔥 프로필 이미지 일괄 업데이트
    @Modifying
    @Transactional
    @Query("UPDATE Comment c SET c.authorProfileImageUrl = :newImg WHERE c.authorEmail = :email")
    void updateAuthorProfileImageByEmail(@Param("newImg") String newImg, @Param("email") String email);
}