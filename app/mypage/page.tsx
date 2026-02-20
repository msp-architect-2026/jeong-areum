"use client"

import { useState } from "react"
import Link from "next/link"
import { Download, Heart, Bookmark, PenSquare, User, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-context"
import { deals, reviews, formatPrice, getCategoryLabel } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const tabs = [
  { key: "coupons", label: "다운로드한 할인권", icon: Download },
  { key: "saved", label: "저장한 후기", icon: Bookmark },
  { key: "liked", label: "좋아요한 후기", icon: Heart },
  { key: "myreviews", label: "내 후기", icon: PenSquare },
]

export default function MyPage() {
  const { isLoggedIn, user, downloadedDeals, savedReviews, likedReviews, myReviews } = useAuth()
  const [activeTab, setActiveTab] = useState("coupons")

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <LogIn className="mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">로그인이 필요합니다</h1>
        <p className="mt-2 text-muted-foreground">마이페이지를 이용하려면 로그인해주세요.</p>
        <Link href="/login" className="mt-4">
          <Button className="gap-2">
            <LogIn className="h-4 w-4" />
            로그인하기
          </Button>
        </Link>
      </div>
    )
  }

  const myDownloadedDeals = deals.filter((d) => downloadedDeals.includes(d.id))
  const mySavedReviews = reviews.filter((r) => savedReviews.includes(r.id))
  const myLikedReviews = reviews.filter((r) => likedReviews.includes(r.id))

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Profile header */}
      <div className="mb-8 flex items-center gap-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{user?.name}님</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "coupons" && (
        <div>
          {myDownloadedDeals.length === 0 ? (
            <EmptyState message="다운로드한 할인권이 없습니다." linkLabel="이벤트 보기" linkHref="/events" />
          ) : (
            <div className="space-y-3">
              {myDownloadedDeals.map((deal) => (
                <Link
                  key={deal.id}
                  href={`/events/${deal.id}`}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                >
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="h-16 w-24 shrink-0 rounded-lg object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{getCategoryLabel(deal.category)}</Badge>
                    </div>
                    <p className="mt-1 font-medium text-card-foreground">{deal.title}</p>
                    <p className="text-sm text-primary font-semibold">{formatPrice(deal.discountPrice)}</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary">사용가능</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "saved" && (
        <div>
          {mySavedReviews.length === 0 ? (
            <EmptyState message="저장한 후기가 없습니다." linkLabel="후기 보기" linkHref="/reviews" />
          ) : (
            <div className="space-y-3">
              {mySavedReviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "liked" && (
        <div>
          {myLikedReviews.length === 0 ? (
            <EmptyState message="좋아요한 후기가 없습니다." linkLabel="후기 보기" linkHref="/reviews" />
          ) : (
            <div className="space-y-3">
              {myLikedReviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "myreviews" && (
        <div>
          {myReviews.length === 0 ? (
            <EmptyState message="작성한 후기가 없습니다." linkLabel="후기 작성하기" linkHref="/reviews/write" />
          ) : (
            <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
              작성한 후기 {myReviews.length}개가 있습니다.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EmptyState({ message, linkLabel, linkHref }: { message: string; linkLabel: string; linkHref: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Link href={linkHref} className="mt-3">
        <Button variant="outline" size="sm">{linkLabel}</Button>
      </Link>
    </div>
  )
}

function ReviewItem({ review }: { review: typeof reviews[number] }) {
  return (
    <Link
      href={`/reviews/${review.id}`}
      className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
    >
      <img
        src={review.image}
        alt={review.title}
        className="h-16 w-24 shrink-0 rounded-lg object-cover"
        crossOrigin="anonymous"
      />
      <div className="flex-1">
        <p className="font-medium text-card-foreground">{review.title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{review.content}</p>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{review.likes}</span>
          <span className="flex items-center gap-1"><Bookmark className="h-3 w-3" />{review.saves}</span>
        </div>
      </div>
    </Link>
  )
}
