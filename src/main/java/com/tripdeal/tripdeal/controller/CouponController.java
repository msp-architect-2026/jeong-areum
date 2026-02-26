package com.tripdeal.tripdeal.controller;

//import com.tripdeal.tripdeal.dto.CouponEventResponseDto;
//import com.tripdeal.tripdeal.dto.CouponResponseDto;
import com.tripdeal.tripdeal.entity.Coupon;
import com.tripdeal.tripdeal.entity.User;
import com.tripdeal.tripdeal.repository.CouponEventRepository;
import com.tripdeal.tripdeal.repository.CouponRepository;
import com.tripdeal.tripdeal.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "*")
public class CouponController {

    private final CouponRepository couponRepository;
    private final UserRepository userRepository;
    private final CouponEventRepository couponEventRepository;

    // 🔥 생성자 수정 (CouponEventRepository 추가)
    public CouponController(CouponRepository couponRepository,
                            UserRepository userRepository,
                            CouponEventRepository couponEventRepository) {

        this.couponRepository = couponRepository;
        this.userRepository = userRepository;
        this.couponEventRepository = couponEventRepository;
    }

    /**
     * ✅ 1. 쿠폰 다운로드
     * POST /api/coupons/download?email=xxx&dealId=1
     */
    @PostMapping("/download")
    public ResponseEntity<?> downloadCoupon(@RequestParam String email,
                                            @RequestParam Long dealId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        // 🔥 중복 다운로드 방지
        boolean alreadyExists = couponRepository
                .existsByUserAndDealId(user, dealId);

        if (alreadyExists) {
            return ResponseEntity.badRequest()
                    .body("이미 다운로드한 쿠폰입니다.");
        }

        Coupon coupon = new Coupon();
        coupon.setUser(user);
        coupon.setDealId(dealId);
        coupon.setDownloadedAt(LocalDateTime.now());

        couponRepository.save(coupon);

        return ResponseEntity.ok("쿠폰 다운로드 완료");
    }

    /**
     * ✅ 2. 마이페이지 쿠폰 목록 조회
     * GET /api/coupons/my?email=xxx
     */
    @GetMapping("/my")
    public ResponseEntity<?> getMyCoupons(@RequestParam String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        List<CouponResponseDto> result = couponRepository
                .findByUser(user)
                .stream()
                .map(CouponResponseDto::new)
                .toList();

        return ResponseEntity.ok(result);
    }

    /**
     * ✅ 3. 배너용 - 오픈 예정 쿠폰 이벤트 조회
     * GET /api/coupons/events/upcoming
     */
    @GetMapping("/events/upcoming")
    public ResponseEntity<List<CouponEventResponseDto>> getUpcomingEvents() {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime until = now.plusHours(48); // 48시간 이내 오픈 예정

        List<CouponEventResponseDto> result = couponEventRepository
                .findUpcoming(now, until)
                .stream()
                .map(CouponEventResponseDto::new)
                .toList();

        return ResponseEntity.ok(result);
    }
}