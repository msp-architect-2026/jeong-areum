package com.tripdeal.tripdeal.controller;

import com.tripdeal.tripdeal.entity.Comment;
import com.tripdeal.tripdeal.entity.User;
import com.tripdeal.tripdeal.repository.CommentRepository;
import com.tripdeal.tripdeal.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews/{reviewId}/comments")
public class CommentController {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public CommentController(CommentRepository commentRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable("reviewId") Long reviewId) {
        return ResponseEntity.ok(commentRepository.findByReviewIdOrderByCreatedAtAsc(reviewId));
    }

    @PostMapping
    public ResponseEntity<?> addComment(@PathVariable("reviewId") Long reviewId,
                                        @RequestBody CommentRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getAuthorEmail());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "로그인이 필요합니다."));
        }

        User user = optionalUser.get();

        Comment comment = new Comment();
        comment.setReviewId(reviewId);
        comment.setContent(request.getContent());
        comment.setAuthorName(user.getName());
        comment.setAuthorProfileImageUrl(user.getProfileImageUrl()); // 🔥 추가

        commentRepository.save(comment);

        return ResponseEntity.ok(comment);
    }
}