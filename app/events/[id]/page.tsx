"use client"

import { use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Tag, Download, CheckCircle2, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CountdownTimer } from "@/components/countdown-timer"
import { useAuth } from "@/components/auth-context"
import { deals, formatPrice, getCategoryLabel } from "@/lib/mock-data"

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { isLoggedIn, downloadedDeals, downloadDeal } = useAuth()
  const deal = deals.find((d) => d.id === id)

  if (!deal) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-foreground">딜을 찾을 수 없습니다</h1>
        <p className="mt-2 text-muted-foreground">존재하지 않거나 만료된 딜입니다.</p>
        <Link href="/events" className="mt-4">
          <Button variant="outline">이벤트 목록으로</Button>
        </Link>
      </div>
    )
  }

  const isDownloaded = downloadedDeals.includes(deal.id)
  const qtyPercent = Math.round((deal.remainingQty / deal.totalQty) * 100)

  const handleDownload = () => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    downloadDeal(deal.id)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        뒤로가기
      </button>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Image */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={deal.image}
              alt={deal.title}
              className="aspect-[16/10] w-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{getCategoryLabel(deal.category)}</Badge>
            {deal.tags.map((tag) => (
              <Badge
                key={tag}
                className={
                  tag === "HOT" || tag === "마감임박"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-primary text-primary-foreground"
                }
              >
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="mt-4 text-2xl font-bold text-foreground">{deal.title}</h1>

          <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {deal.location}
          </div>

          {/* Price */}
          <div className="mt-6 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(deal.originalPrice)}
                </p>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(deal.discountPrice)}
                </p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-accent-foreground">
                {deal.discountPercent}%
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <span className="text-sm font-medium text-foreground">남은 시간</span>
            <CountdownTimer endsAt={deal.endsAt} />
          </div>

          {/* Quantity */}
          <div className="mt-4 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Tag className="h-4 w-4" />
                잔여 수량
              </span>
              <span className="font-semibold text-foreground">
                {deal.remainingQty} / {deal.totalQty}장
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${qtyPercent}%` }}
              />
            </div>
          </div>

          {/* Download button */}
          <div className="mt-6">
            {isDownloaded ? (
              <Button disabled className="w-full gap-2" size="lg">
                <CheckCircle2 className="h-5 w-5" />
                다운로드 완료
              </Button>
            ) : isLoggedIn ? (
              <Button onClick={handleDownload} className="w-full gap-2" size="lg">
                <Download className="h-5 w-5" />
                할인권 다운로드
              </Button>
            ) : (
              <Link href="/login" className="block">
                <Button variant="outline" className="w-full gap-2" size="lg">
                  <LogIn className="h-5 w-5" />
                  로그인 후 다운로드
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-foreground">상세 정보</h2>
        <div className="mt-4 rounded-xl border border-border bg-card p-6">
          <p className="leading-relaxed text-foreground">{deal.description}</p>
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p>* 본 할인권은 회원 가입 후 다운로드 가능합니다.</p>
            <p>* 1인 1매 한정이며, 타인에게 양도할 수 없습니다.</p>
            <p>* 다운로드 후 마이페이지에서 확인 가능합니다.</p>
            <p>* 유효기간: 다운로드일로부터 30일</p>
          </div>
        </div>
      </div>
    </div>
  )
}
