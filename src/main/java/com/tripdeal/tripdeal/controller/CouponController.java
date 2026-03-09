package com.tripdeal.tripdeal.controller;

import com.tripdeal.tripdeal.entity.Coupon;
import com.tripdeal.tripdeal.entity.User;
import com.tripdeal.tripdeal.repository.CouponEventRepository;
import com.tripdeal.tripdeal.repository.CouponRepository;
import com.tripdeal.tripdeal.repository.UserRepository;
import org.springframework.data.redis.core.RedisTemplate;
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
    private final RedisTemplate<String, String> redisTemplate;

    public CouponController(CouponRepository couponRepository,
                            UserRepository userRepository,
                            CouponEventRepository couponEventRepository,
                            RedisTemplate<String, String> redisTemplate) {
        this.couponRepository = couponRepository;
        this.userRepository = userRepository;
        this.couponEventRepository = couponEventRepository;
        this.redisTemplate = redisTemplate;
    }

    /**
     * 선착순 쿠폰 이벤트 발급
     * POST /api/coupons/event/download?email=xxx&eventId=1
     */
    @PostMapping("/event/download")
    public ResponseEntity<?> downloadEventCoupon(@RequestParam String email,
                                                  @RequestParam Long eventId) {
        // 1. 이벤트 존재 확인
        var event = couponEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("이벤트 없음"));

        // 2. 오픈 시간 확인
        if (LocalDateTime.now().isBefore(event.getOpenAt())) {
            return ResponseEntity.badRequest().body("아직 오픈되지 않은 이벤트입니다.");
        }

        // 3. 만료 확인
        if (LocalDateTime.now().isAfter(event.getExpireAt())) {
            return ResponseEntity.badRequest().body("만료된 이벤트입니다.");
        }

        // 4. 유저 확인
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        // 5. 중복 발급 방지 (Redis Set 사용)
        String participantKey = "coupon:event:" + eventId + ":participants";
        Boolean isNew = redisTemplate.opsForSet().add(participantKey, email) == 1;
        if (!isNew) {
            return ResponseEntity.badRequest().body("이미 발급받은 쿠폰입니다.");
        }

        // 6. Redis로 선착순 재고 차감 (atomic 감소)
        String stockKey = "coupon:event:" + eventId + ":stock";
        // 재고 초기화 (없으면 totalCount로 세팅)
        redisTemplate.opsForValue().setIfAbsent(stockKey, String.valueOf(event.getTotalCount()));
        Long remaining = redisTemplate.opsForValue().decrement(stockKey);

        if (remaining < 0) {
            // 재고 없음 - 참가자 Set에서 제거
            redisTemplate.opsForSet().remove(participantKey, email);
            redisTemplate.opsForValue().increment(stockKey);
            return ResponseEntity.badRequest().body("선착순 마감되었습니다.");
        }

        // 7. DB 저장
        Coupon coupon = new Coupon();
        coupon.setUser(user);
        coupon.setDealId(eventId);
        coupon.setDownloadedAt(LocalDateTime.now());
        couponRepository.save(coupon);

        return ResponseEntity.ok("쿠폰 발급 완료! 남은 수량: " + remaining);
    }

    /**
     * 일반 쿠폰 다운로드
     * POST /api/coupons/download?email=xxx&dealId=1
     */
    @PostMapping("/download")
    public ResponseEntity<?> downloadCoupon(@RequestParam String email,
                                            @RequestParam Long dealId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        boolean alreadyExists = couponRepository.existsByUserAndDealId(user, dealId);
        if (alreadyExists) {
            return ResponseEntity.badRequest().body("이미 다운로드한 쿠폰입니다.");
        }

        Coupon coupon = new Coupon();
        coupon.setUser(user);
        coupon.setDealId(dealId);
        coupon.setDownloadedAt(LocalDateTime.now());
        couponRepository.save(coupon);

        return ResponseEntity.ok("쿠폰 다운로드 완료");
    }

    /**
     * 마이페이지 쿠폰 목록 조회
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
     * 오픈 예정 쿠폰 이벤트 조회
     * GET /api/coupons/events/upcoming
     */
    @GetMapping("/events/upcoming")
    public ResponseEntity<List<CouponEventResponseDto>> getUpcomingEvents() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime until = now.plusHours(48);

        List<CouponEventResponseDto> result = couponEventRepository
                .findUpcoming(now, until)
                .stream()
                .map(CouponEventResponseDto::new)
                .toList();

        return ResponseEntity.ok(result);
    }
}
