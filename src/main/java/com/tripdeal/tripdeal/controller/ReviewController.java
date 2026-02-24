package com.tripdeal.tripdeal.controller;

import com.tripdeal.tripdeal.entity.Review;
import com.tripdeal.tripdeal.entity.ReviewLike;
import com.tripdeal.tripdeal.entity.User;
import com.tripdeal.tripdeal.repository.ReviewLikeRepository;
import com.tripdeal.tripdeal.repository.ReviewRepository;
import com.tripdeal.tripdeal.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ReviewLikeRepository reviewLikeRepository;

    public ReviewController(ReviewRepository reviewRepository,
                            UserRepository userRepository,
                            ReviewLikeRepository reviewLikeRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.reviewLikeRepository = reviewLikeRepository;
    }

    @PostConstruct
    public void initSampleData() {
        if (reviewRepository.count() > 0) return;

        String[][] samples = {
                {"제주도 3박 4일 힐링 여행기", "제주도 동쪽부터 서쪽까지 알차게 돌아본 여행 후기입니다.", "제주도", "호텔", "sample@tripdeal.com", "여행자김", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop", ""},
                {"부산 해운대에서의 특별한 하루", "해운대 해수욕장부터 광안리 야경까지, 부산의 매력을 느꼈습니다.", "부산", "호텔", "sample@tripdeal.com", "바다사랑", "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop", ""},
                {"강남 미슐랭 레스토랑 솔직 후기", "트립딜에서 35% 할인받고 다녀왔습니다. 완벽했어요.", "서울", "음식점", "sample@tripdeal.com", "미식가박", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop", ""},
                {"경주 가족여행 완벽 가이드", "아이들과 함께한 경주 2박3일 가이드입니다.", "경주", "관광", "sample@tripdeal.com", "행복맘", "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop", ""},
                {"여수 야경투어, 기대 이상이었어요!", "여수 돌산대교 야경투어 다녀왔는데 정말 로맨틱했습니다.", "여수", "관광", "sample@tripdeal.com", "야경러버", "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&h=400&fit=crop", ""},
                {"서울 한옥 스테이 체험기", "북촌에서의 하룻밤이 이렇게 특별할 줄 몰랐어요.", "서울", "호텔", "sample@tripdeal.com", "한옥매니아", "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=600&h=400&fit=crop", ""}
        };

        for (String[] s : samples) {
            Review r = new Review();
            r.setTitle(s[0]);
            r.setContent(s[1]);
            r.setLocation(s[2]);
            r.setCategory(s[3]);
            r.setAuthorEmail(s[4]);
            r.setAuthorName(s[5]);
            r.setImageUrl(s[6]);
            r.setAuthorProfileImageUrl(s[7]);
            reviewRepository.save(r);
        }
    }

    @GetMapping
    public ResponseEntity<List<Review>> getReviews() {
        return ResponseEntity.ok(reviewRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getReview(@PathVariable("id") Long id) {
        return reviewRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "후기를 찾을 수 없습니다.")));
    }

    @GetMapping("/{id}/liked")
    public ResponseEntity<?> checkLikeStatus(@PathVariable("id") Long id,
                                             @RequestParam("email") String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return ResponseEntity.ok(Map.of("liked", false));

        Optional<Review> reviewOpt = reviewRepository.findById(id);
        if (reviewOpt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "후기 없음"));

        boolean liked = reviewLikeRepository.existsByUserAndReview(userOpt.get(), reviewOpt.get());
        return ResponseEntity.ok(Map.of("liked", liked));
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getAuthorEmail());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "로그인이 필요합니다."));
        }

        User user = optionalUser.get();
        Review review = new Review();
        review.setTitle(request.getTitle());
        review.setContent(request.getContent());
        review.setLocation(request.getLocation());
        review.setCategory(request.getCategory());
        review.setAuthorName(user.getName());
        review.setAuthorEmail(user.getEmail());
        review.setImageUrl(request.getImageUrl());
        review.setAuthorProfileImageUrl(user.getProfileImageUrl());

        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(Map.of("id", saved.getId(), "message", "후기가 등록되었습니다."));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable("id") Long id,
                                        @RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "email이 필요합니다."));
        }

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("로그인 필요"));
        Review review = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("후기 없음"));

        boolean alreadyLiked = reviewLikeRepository.existsByUserAndReview(user, review);

        if (alreadyLiked) {
            reviewLikeRepository.deleteByUserAndReview(user, review);
            review.setLikes(Math.max(0, review.getLikes() - 1));
        } else {
            reviewLikeRepository.save(new ReviewLike(user, review));
            review.setLikes(review.getLikes() + 1);
        }

        reviewRepository.save(review);
        return ResponseEntity.ok(Map.of("likes", review.getLikes(), "liked", !alreadyLiked));
    }

    @GetMapping("/my/reviews")
    public ResponseEntity<List<Review>> getMyReviews(@RequestParam("email") String email) {
        List<Review> myReviews = reviewRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .filter(r -> r.getAuthorEmail() != null && r.getAuthorEmail().equalsIgnoreCase(email))
                .collect(Collectors.toList());
        return ResponseEntity.ok(myReviews);
    }

    // 🔥 필터링 방식을 변경하여 더 확실하게 데이터를 가져옵니다.
    @GetMapping("/my/likes")
    public ResponseEntity<List<Review>> getMyLikedReviews(@RequestParam("email") String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        List<ReviewLike> likes = reviewLikeRepository.findByUser(userOpt.get());

        // 🔥 ID만 뽑아서 reviewRepository로 다시 조회 (프록시 문제 해결)
        List<Long> likedReviewIds = likes.stream()
                .map(like -> like.getReview().getId())
                .collect(Collectors.toList());

        List<Review> likedReviews = reviewRepository.findAllById(likedReviewIds);

        return ResponseEntity.ok(likedReviews);
    }
}