"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Download, Heart, Bookmark, PenSquare, Camera, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-context"
import { deals, formatPrice, getCategoryLabel } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const tabs = [
  { key: "coupons", label: "다운로드한 할인권", icon: Download },
  { key: "saved", label: "저장한 후기", icon: Bookmark },
  { key: "liked", label: "좋아요한 후기", icon: Heart },
  { key: "myreviews", label: "내 후기", icon: PenSquare },
]

export default function MyPage() {
  const {
    isLoggedIn,
    user,
    downloadedDeals,
    savedReviews,
    updateProfileImage,
    updateNickname,
  } = useAuth()

  const [activeTab, setActiveTab] = useState("coupons")
  const [uploading, setUploading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [editing, setEditing] = useState(false)
  const [newNickname, setNewNickname] = useState("")
  const [nicknameError, setNicknameError] = useState("")

  const [likedReviewList, setLikedReviewList] = useState<any[]>([])
  const [myReviewList, setMyReviewList] = useState<any[]>([])
  const [savedReviewList, setSavedReviewList] = useState<any[]>([])

  // ✅ 쿠폰 날짜 저장 로직
  useEffect(() => {
    if (typeof window === "undefined" || !downloadedDeals) return
    downloadedDeals.forEach((dealId) => {
      const key = `coupon_date_${dealId}`
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, new Date().toISOString())
      }
    })
  }, [downloadedDeals])

  // ✅ 데이터 페칭 로직
  useEffect(() => {
    if (!isLoggedIn || !user?.email) return
    
    if (activeTab === "liked") {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/my/likes?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => setLikedReviewList(Array.isArray(data) ? data : []))
        .catch((err) => console.error(err))
    }

    if (activeTab === "myreviews") {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/my/reviews?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => setMyReviewList(Array.isArray(data) ? data : []))
        .catch((err) => console.error(err))
    }
  }, [isLoggedIn, user?.email, activeTab])

  // 저장한 후기 페칭
  useEffect(() => {
    if (!isLoggedIn || savedReviews.length === 0 || activeTab !== "saved") {
      setSavedReviewList([])
      return
    }
    Promise.all(
      savedReviews.map((id) =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}`)
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null)
      )
    ).then((results) => setSavedReviewList(results.filter(Boolean)))
  }, [isLoggedIn, savedReviews, activeTab])

  // 쿠폰 필터링
  const myDownloadedDeals = deals.filter((deal) => 
    downloadedDeals.map(id => String(id)).includes(String(deal.id))
  )

  const calcRemainingDays = (dealId: any) => {
    if (typeof window === "undefined") return 30
    const saved = localStorage.getItem(`coupon_date_${dealId}`)
    if (!saved) return 30
    const downloadDate = new Date(saved)
    const expiryDate = new Date(downloadDate)
    expiryDate.setDate(expiryDate.getDate() + 30)
    return Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleNicknameUpdate = async () => {
    const result = await updateNickname(newNickname)
    if (result.ok) setEditing(false)
  }

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <LogIn className="mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">로그인이 필요합니다</h1>
        <Link href="/login" className="mt-4"><Button>로그인하기</Button></Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Profile Section */}
      <div className="mb-8 flex items-center gap-4 rounded-2xl border bg-card p-6">
        <div className="h-16 w-16 rounded-full border bg-primary/10 flex items-center justify-center overflow-hidden">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl.startsWith("http") ? user.profileImageUrl : `${process.env.NEXT_PUBLIC_API_URL}${user.profileImageUrl}`} className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-primary">{user?.nickname?.charAt(0)}</span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user?.nickname}님</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn("flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all", activeTab === tab.key ? "bg-primary text-primary-foreground" : "border")}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === "coupons" && (
        <div className="space-y-3">
          {myDownloadedDeals.length === 0 ? (
            <EmptyState message="다운로드한 할인권이 없습니다." linkLabel="이벤트 보기" linkHref="/events" />
          ) : (
            myDownloadedDeals.map((deal) => {
              const remainingDays = calcRemainingDays(deal.id)
              return (
                <Link key={deal.id} href={`/events/${deal.id}`} className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:bg-muted/50 transition-colors">
                  <img src={deal.image} className="h-16 w-24 rounded-lg object-cover" crossOrigin="anonymous" />
                  <div className="flex-1">
                    <Badge variant="secondary" className="text-xs">{getCategoryLabel(deal.category)}</Badge>
                    <p className="font-medium mt-1">{deal.title}</p>
                    <p className="text-sm text-primary font-semibold">{formatPrice(deal.discountPrice)}</p>
                    <p className="text-xs font-medium mt-1 text-orange-600">⏳ D-{remainingDays}</p>
                  </div>
                  <Badge>사용가능</Badge>
                </Link>
              )
            })
          )}
        </div>
      )}

      {activeTab === "saved" && (
        <div className="space-y-3">
          {savedReviewList.length === 0 ? <EmptyState message="저장한 후기가 없습니다." linkLabel="후기 보기" linkHref="/reviews" /> : savedReviewList.map(r => <ReviewItem key={r.id} review={r} />)}
        </div>
      )}

      {activeTab === "liked" && (
        <div className="space-y-3">
          {likedReviewList.length === 0 ? <EmptyState message="좋아요한 후기가 없습니다." linkLabel="후기 보기" linkHref="/reviews" /> : likedReviewList.map(r => <ReviewItem key={r.id} review={r} />)}
        </div>
      )}

      {activeTab === "myreviews" && (
        <div className="space-y-3">
          {myReviewList.length === 0 ? <EmptyState message="작성한 후기가 없습니다." linkLabel="후기 작성하기" linkHref="/reviews/write" /> : myReviewList.map(r => <ReviewItem key={r.id} review={r} />)}
        </div>
      )}
    </div>
  )
}

// ─── 아래 컴포넌트들이 누락되어 에러가 났었습니다! ───

function EmptyState({ message, linkLabel, linkHref }: { message: string; linkLabel: string; linkHref: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center bg-muted/20">
      <p className="text-muted-foreground">{message}</p>
      <Link href={linkHref} className="mt-4">
        <Button variant="outline" size="sm">{linkLabel}</Button>
      </Link>
    </div>
  )
}

function ReviewItem({ review }: { review: any }) {
  return (
    <Link
      href={`/reviews/${review.id}`}
      className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:bg-muted/50 transition-colors"
    >
      <div className="h-16 w-24 shrink-0 rounded-lg bg-muted overflow-hidden">
        {review.imageUrl && (
          <img
            src={review.imageUrl.startsWith("http") ? review.imageUrl : `${process.env.NEXT_PUBLIC_API_URL}${review.imageUrl}`}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium line-clamp-1">{review.title}</p>
        <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{review.content}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Heart className="h-3 w-3 fill-primary text-primary" /> {review.likes || 0}</span>
        </div>
      </div>
    </Link>
  )
}