package com.tripdeal.tripdeal.repository;

import com.tripdeal.tripdeal.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByReviewIdOrderByCreatedAtAsc(Long reviewId);
}