package com.tripdeal.tripdeal.controller;

import com.tripdeal.tripdeal.entity.User;
import com.tripdeal.tripdeal.repository.CommentRepository;
import com.tripdeal.tripdeal.repository.UserRepository;
import com.tripdeal.tripdeal.repository.ReviewRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;

    public AuthController(UserRepository userRepository,
                          ReviewRepository reviewRepository,
                          CommentRepository commentRepository) {
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.commentRepository = commentRepository;
    }

    // ─── 회원가입 ─────────────────────────────────────────────
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "이미 사용중인 이메일입니다."));
        }

        // 필드 검증 로직들
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "이메일을 입력해주세요."));
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "비밀번호는 6자 이상이어야 합니다."));
        }
        if (request.getName() == null || request.getName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "이름을 입력해주세요."));
        }
        if (request.getNickname() == null || request.getNickname().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "닉네임을 입력해주세요."));
        }
        if (userRepository.existsByNickname(request.getNickname())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "이미 사용중인 닉네임입니다."));
        }

        User user = new User(
                request.getEmail(),
                request.getPassword(),
                request.getName() // 가입 시 이름(본명) 저장
        );
        user.setNickname(request.getNickname()); // 가입 시 닉네임 별도 저장

        if (request.getProfileImageUrl() != null && !request.getProfileImageUrl().isBlank()) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "회원가입이 완료되었습니다."));
    }

    // ─── 로그인 (이름과 닉네임을 모두 반환하도록 설정) ────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "이메일 또는 비밀번호가 올바르지 않습니다."));
        }

        User user = optionalUser.get();
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "이메일 또는 비밀번호가 올바르지 않습니다."));
        }

        // 프론트에서 상단바엔 name을, 후기엔 nickname을 쓸 수 있게 둘 다 보냅니다.
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),     // 본명 (상단바용)
                "nickname", user.getNickname(), // 닉네임 (게시글용)
                "email", user.getEmail(),
                "profileImageUrl", user.getProfileImageUrl() != null ? user.getProfileImageUrl() : ""
        ));
    }

    // ─── 닉네임 수정 (본명은 건드리지 않고 게시글 이름만 동기화) ────────────────
    @PatchMapping("/users/{email}/nickname")
    public ResponseEntity<?> updateNickname(
            @PathVariable("email") String email,
            @RequestBody Map<String, String> body) {

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "사용자를 찾을 수 없습니다."));
        }

        String newNickname = body.get("nickname");
        if (newNickname == null || newNickname.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "닉네임을 입력해주세요."));
        }

        if (userRepository.existsByNickname(newNickname)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "이미 사용중인 닉네임입니다."));
        }

        User user = optionalUser.get();

        // 1. 유저 정보에서 닉네임만 교체 (이름은 건드리지 않음)
        user.setNickname(newNickname);
        userRepository.save(user);

        // 2. 동기화: 이메일이 일치하는 게시글/댓글의 '작성자명'만 새 닉네임으로 변경
        // 이렇게 하면 '한옥매니아' 등의 다른 사람 글은 바뀌지 않습니다.
        reviewRepository.updateAuthorNameByEmail(newNickname, email);
        commentRepository.updateAuthorNameByEmail(newNickname, email);

        return ResponseEntity.ok(Map.of(
                "message", "닉네임이 변경되었습니다.",
                "nickname", newNickname
        ));
    }

    // ─── 프로필 이미지 수정 ─────────────────────────────────
    @PatchMapping("/users/{email}/profile-image")
    public ResponseEntity<?> updateProfileImage(
            @PathVariable("email") String email,
            @RequestBody Map<String, String> body) {

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "사용자를 찾을 수 없습니다."));
        }

        User user = optionalUser.get();
        String newImageUrl = body.get("profileImageUrl");
        user.setProfileImageUrl(newImageUrl);
        userRepository.save(user);

        // 프로필 이미지도 본인이 쓴 글들에만 적용되도록 이메일 기준으로 동기화
        reviewRepository.updateAuthorProfileImageByEmail(newImageUrl, email);
        commentRepository.updateAuthorProfileImageByEmail(newImageUrl, email);

        return ResponseEntity.ok(Map.of(
                "message", "프로필 이미지가 업데이트되었습니다.",
                "profileImageUrl", newImageUrl != null ? newImageUrl : ""
        ));
    }
}