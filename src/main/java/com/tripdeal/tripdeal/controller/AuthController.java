package com.tripdeal.tripdeal.controller;

import com.tripdeal.tripdeal.entity.User;
import com.tripdeal.tripdeal.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ─── 회원가입 ─────────────────────────────────────────────
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {

        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "이미 사용중인 이메일입니다."));
        }

        // 이메일 검증
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "이메일을 입력해주세요."));
        }

        // 비밀번호 검증
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "비밀번호는 6자 이상이어야 합니다."));
        }

        // 이름 검증
        if (request.getName() == null || request.getName().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "이름을 입력해주세요."));
        }

        // 🔥 닉네임 검증
        if (request.getNickname() == null || request.getNickname().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "닉네임을 입력해주세요."));
        }

        // 🔥 닉네임 중복 체크
        if (userRepository.existsByNickname(request.getNickname())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "이미 사용중인 닉네임입니다."));
        }

        // 유저 생성
        User user = new User(
                request.getEmail(),
                request.getPassword(),
                request.getName()
        );

        // 🔥 닉네임 세팅
        user.setNickname(request.getNickname());

        // 프로필 이미지 (있으면 저장)
        if (request.getProfileImageUrl() != null && !request.getProfileImageUrl().isBlank()) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "회원가입이 완료되었습니다."));
    }


    // ─── 로그인 ───────────────────────────────────────────────
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

        // 🔥 nickname 추가 반환
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "nickname", user.getNickname(),
                "email", user.getEmail(),
                "profileImageUrl",
                user.getProfileImageUrl() != null ? user.getProfileImageUrl() : ""
        ));
    }


    // ─── 닉네임 수정 (마이페이지) ─────────────────────────────
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
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "닉네임을 입력해주세요."));
        }

        if (userRepository.existsByNickname(newNickname)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "이미 사용중인 닉네임입니다."));
        }

        User user = optionalUser.get();
        user.setNickname(newNickname);
        userRepository.save(user);

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

        return ResponseEntity.ok(Map.of(
                "message", "프로필 이미지가 업데이트되었습니다.",
                "profileImageUrl",
                newImageUrl != null ? newImageUrl : ""
        ));
    }
}