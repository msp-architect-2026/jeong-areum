"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowRight, Clock, Ticket, BookOpen, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"

const heroImages = [
  "/images/hero-travel.jpg",
  "/images/hero-travel-2.jpg",
  "/images/hero-travel-3.jpg",
  "/images/hero-travel-4.jpg",
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { isLoggedIn, user } = useAuth()

  const goToNext = useCallback(() => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
      setIsTransitioning(false)
    }, 600)
  }, [])

  useEffect(() => {
    const interval = setInterval(goToNext, 5000)
    return () => clearInterval(interval)
  }, [goToNext])

  return (
    <section className="relative overflow-hidden">
      {/* Background images */}
      {heroImages.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: index === currentIndex && !isTransitioning ? 1 : 0 }}
        >
          <img
            src={src}
            alt={`여행지 풍경 ${index + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(215,25%,10%)]/80 via-[hsl(215,25%,10%)]/50 to-[hsl(215,25%,10%)]/20" />

      <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col justify-center px-4 py-20">
        <div className="max-w-xl">
          {isLoggedIn ? (
            <>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[hsl(38,92%,50%)]/30 px-4 py-1.5 text-sm font-medium text-[hsl(0,0%,100%)]">
                <Star className="h-4 w-4" />
                회원 전용 특가 진행중
              </div>
              <h1
                className="text-balance text-4xl font-bold text-[hsl(0,0%,100%)] md:text-5xl md:leading-[1.3]"
                style={{ lineHeight: 1.4 }}
              >
                {user?.name}님, 반가워요!
                <br />
                <span className="text-[hsl(38,92%,70%)]">오늘의 특가</span>를 확인하세요
              </h1>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-[hsl(210,20%,85%)]">
                회원님만을 위한 한정 할인이 준비되어 있습니다.
                <br />
                지금 바로 할인권을 다운받고, 여행 후기도 남겨보세요!
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/events">
                  <Button
                    size="lg"
                    className="gap-2 bg-[#135DF4] text-[hsl(0,0%,100%)] hover:bg-[#0F4FD6]"
                  >
                    <Ticket className="h-4 w-4" />
                    할인권 받으러 가기
                  </Button>
                </Link>
                <Link href="/reviews">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-[hsl(0,0%,100%)]/30 bg-[hsl(0,0%,100%)]/10 text-[hsl(0,0%,100%)] hover:bg-[hsl(0,0%,100%)]/20 hover:text-[hsl(0,0%,100%)]"
                  >
                    <BookOpen className="h-4 w-4" />
                    여행 후기 보기
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#135DF4]/30 px-4 py-1.5 text-sm font-medium text-[hsl(0,0%,100%)]">
                <Clock className="h-4 w-4" />
                한정 수량 타임세일 진행중
              </div>
              <h1
                className="text-balance text-4xl font-bold text-[hsl(0,0%,100%)] md:text-5xl md:leading-[1.3]"
                style={{ lineHeight: 1.4 }}
              >
                특별한 여행을
                <br />
                <span className="text-[hsl(199,89%,70%)]">특별한 가격</span>으로
              </h1>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-[hsl(210,20%,85%)]">
                매일 새로운 호텔, 관광, 맛집 할인을 한정 수량으로 만나보세요.
                <br />
                지금 바로 특가 이벤트를 확인하세요!
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/events">
                  <Button
                    size="lg"
                    className="gap-2 bg-[#135DF4] text-[hsl(0,0%,100%)] hover:bg-[#0F4FD6]"
                  >
                    할인 이벤트 보기
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[hsl(0,0%,100%)]/30 bg-[hsl(0,0%,100%)]/10 text-[hsl(0,0%,100%)] hover:bg-[hsl(0,0%,100%)]/20 hover:text-[hsl(0,0%,100%)]"
                  >
                    무료 회원가입
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true)
                setTimeout(() => {
                  setCurrentIndex(index)
                  setIsTransitioning(false)
                }, 300)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-6 bg-[hsl(0,0%,100%)]"
                  : "w-2 bg-[hsl(0,0%,100%)]/40 hover:bg-[hsl(0,0%,100%)]/60"
              }`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
