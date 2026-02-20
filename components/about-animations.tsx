"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import { Users, Globe, Zap, Heart } from "lucide-react"
import Image from "next/image"


/* -------------------------------------------------- */
/* Slide-up wrapper                                  */
/* -------------------------------------------------- */
function SlideUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* -------------------------------------------------- */
/* Counter                                           */
/* -------------------------------------------------- */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  const animate = useCallback(() => {
    const duration = 1200
    const startTime = performance.now()

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 2)
      setCount(Math.floor(eased * target))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [target])

  useEffect(() => {
    if (started) {
      animate()
      return () => cancelAnimationFrame(rafRef.current)
    }
  }, [started, animate])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

/* -------------------------------------------------- */
/* Stats Section                                     */
/* -------------------------------------------------- */
const stats = [
  { label: "누적 회원수", target: 120, suffix: "만+", icon: Users },
  { label: "파트너사", target: 350, suffix: "+", icon: Globe },
  { label: "할인 제공 건수", target: 5000, suffix: "+", icon: Zap },
  { label: "고객 만족도", target: 98, suffix: "%", icon: Heart },
]

export function AboutStatsAnimated() {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {stats.map((stat, i) => (
        <SlideUp
          key={stat.label}
          delay={i * 120}
          className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center"
        >
          <stat.icon className="mb-3 h-8 w-8 text-primary" />
          <p className="text-3xl font-bold text-foreground">
            <Counter target={stat.target} suffix={stat.suffix} />
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
        </SlideUp>
      ))}
    </div>
  )
}

/* -------------------------------------------------- */
/* Partners Marquee (카드형 + 슬라이딩)              */
/* -------------------------------------------------- */

const aboutPartners = [
  { id: 1, name: "롯데리조트", logo: "/images/lotte.png" },
  { id: 2, name: "신라호텔", logo: "/images/shilla.png" },  // 👈 추가
  { id: 3, name: "한국관광공사", logo: "/images/ktour.jpg" },
  { id: 4, name: "제주관광협회", logo: "/images/jeju.jpg" },
  { id: 5, name: "미슐랭가이드", logo: "/images/misul.jpg" },
  { id: 6, name: "한화리조트", logo: "/images/hanwha.webp" },
]

export function AboutPartnersMarquee() {
  return (
    <section className="py-24 bg-muted overflow-hidden">
        <div className="w-full">
        <h2 className="mb-16 text-center text-3xl font-bold px-24">
          함께하는 파트너사
        </h2>

        <div className="relative w-full overflow-hidden">
          <div className="flex w-max animate-marquee gap-16 pl-24">
            {[...aboutPartners, ...aboutPartners].map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                  className="min-w-[260px] min-h-[260px] bg-white rounded-3xl shadow-lg p-10 flex flex-col items-center justify-center"              >
                <div className="h-24 flex items-center justify-center mb-8">
                  <img
                        src={partner.logo}
                        alt={partner.name}
                        height={60}
                        width={140}
                        className="object-contain"
                  />
                </div>

                <p className="mt-4 text-lg font-bold text-center">
                  {partner.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}