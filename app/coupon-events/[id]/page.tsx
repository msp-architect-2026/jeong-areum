"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Tag, CheckCircle2, Clock, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { COUPON_EVENTS } from "@/components/coupon-event-banner"

function CountdownTimer({ openAt }: { openAt: string }) {
  const [label, setLabel] = useState("")

  useEffect(() => {
    const tick = () => {
      const diff = new Date(openAt).getTime() - Date.now()
      if (diff <= 0) { setLabel("🎉 지금 오픈!"); return }
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0")
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0")
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0")
      setLabel(`${h}시간 ${m}분 ${s}초 후 오픈`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [openAt])

  return <span className="text-lg font-bold text-yellow-400 tabular-nums">{label}</span>
}

export default function CouponEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { isLoggedIn, downloadedCoupons, downloadCoupon } = useAuth()
  const [toast, setToast] = useState<string | null>(null)
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const event = COUPON_EVENTS.find((e) => e.id === Number(id))

  if (!event) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-foreground">쿠폰을 찾을 수 없습니다</h1>
        <p className="mt-2 text-muted-foreground">존재하지 않거나 만료된 쿠폰입니다.</p>
        <Link href="/coupon-events" className="mt-4">
          <Button variant="outline">쿠폰 목록으로</Button>
        </Link>
      </div>
    )
  }

  const isOpen = now !== null && new Date(event.openAt) <= now
  const isDownloaded = downloadedCoupons.includes(event.id)
  const openDate = new Date(event.openAt)
  const expireDate = new Date(event.expireAt)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleDownload = () => {
    if (!isLoggedIn) { router.push("/signup"); return }
    if (isDownloaded) { showToast("이미 받은 쿠폰입니다!"); return }
    downloadCoupon(event.id)
    showToast("🎉 쿠폰이 마이페이지에 저장되었습니다!")
    // ✅ 받은 쿠폰 탭으로 바로 이동
    setTimeout(() => router.push("/mypage?tab=couponEvents"), 1500)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {toast && (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg">
          {toast}
        </div>
      )}

      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        뒤로가기
      </button>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="aspect-[16/10] w-full object-cover"
            />
            {!isOpen && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 rounded-2xl">
                <Lock className="h-16 w-16 text-white" />
                <p className="text-white font-bold text-lg">쿠폰 오픈 전</p>
                {now !== null && <CountdownTimer openAt={event.openAt} />}
              </div>
            )}
            <div className="absolute top-4 right-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white font-black text-xl shadow-lg">
              {event.discountRate}%
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              타임오픈쿠폰
            </span>
            {now !== null && (
              isOpen ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  🟢 오픈 중
                </span>
              ) : (
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                  🔒 오픈 예정
                </span>
              )
            )}
          </div>

          <h1 className="mt-4 text-2xl font-bold text-foreground">{event.title}</h1>
          <p className="mt-1 text-muted-foreground">{event.description}</p>

          <div className="mt-6 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">할인율</p>
                <p className="text-3xl font-bold text-primary">{event.discountRate}% 할인</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-black text-primary">
                {event.discountRate}%
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              오픈 시간
            </span>
            <span className="text-sm font-semibold text-foreground">
              {openDate.getMonth() + 1}월 {openDate.getDate()}일 {openDate.getHours()}시
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Tag className="h-4 w-4" />
                발급 수량
              </span>
              <span className="font-semibold text-foreground">한정 {event.totalCount}장</span>
            </div>
          </div>

          <div className="mt-6">
            {isDownloaded ? (
              <Button disabled className="w-full gap-2" size="lg">
                <CheckCircle2 className="h-5 w-5" />
                받기 완료 — 마이페이지에서 확인
              </Button>
            ) : isOpen ? (
              <Button onClick={handleDownload} className="w-full gap-2" size="lg">
                쿠폰 받기
              </Button>
            ) : (
              <Button disabled variant="outline" className="w-full gap-2" size="lg">
                <Lock className="h-5 w-5" />
                {now === null ? "로딩 중..." : "오픈 전 — 잠시만 기다려주세요"}
              </Button>
            )}

            {!isLoggedIn && isOpen && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                회원만 쿠폰을 받을 수 있어요.{" "}
                <Link href="/signup" className="text-primary underline">
                  회원가입하기
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-foreground">상세 정보</h2>
        <div className="mt-4 rounded-xl border border-border bg-card p-6">
          <p className="leading-relaxed text-foreground">
            {event.title}에 대한 특별 할인 쿠폰입니다. {event.description}
          </p>
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p>* 본 쿠폰은 회원 가입 후 수령 가능합니다.</p>
            <p>* 1인 1매 한정이며, 타인에게 양도할 수 없습니다.</p>
            <p>* 수령 후 마이페이지에서 확인 가능합니다.</p>
            <p>
              * 쿠폰 유효기간: {openDate.getMonth() + 1}월 {openDate.getDate()}일 ~{" "}
              {expireDate.getMonth() + 1}월 {expireDate.getDate()}일
            </p>
            <p>
              * 오픈 시간({openDate.getMonth() + 1}월 {openDate.getDate()}일{" "}
              {openDate.getHours()}시) 이전에는 수령이 불가합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}