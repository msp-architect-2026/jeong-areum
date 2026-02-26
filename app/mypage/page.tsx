"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Download, Heart, Bookmark, PenSquare, Camera, LogIn, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-context"
import { deals, formatPrice, getCategoryLabel } from "@/lib/mock-data"
import { COUPON_EVENTS } from "@/components/coupon-event-banner"
import { cn } from "@/lib/utils"

const tabs = [
  { key: "coupons", label: "다운로드한 할인권", icon: Download },
  { key: "couponEvents", label: "받은 쿠폰", icon: Ticket },
  { key: "saved", label: "저장한 후기", icon: Bookmark },
  { key: "liked", label: "좋아요한 후기", icon: Heart },
  { key: "myreviews", label: "내 후기", icon: PenSquare },
]

// ✅ useSearchParams는 Suspense 안에서만 써야 해서 내부 컴포넌트로 분리
function MyPageContent() {
  const searchParams = useSearchParams()
  const {
    isLoggedIn,
    user,
    downloadedDeals,
    downloadedCoupons,
    savedReviews,
    updateProfileImage,
    updateNickname,
  } = useAuth()

  // ✅ URL의 tab 파라미터로 초기 탭 설정
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") ?? "coupons")
  const [uploading, setUploading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [editing, setEditing] = useState(false)
  const [newNickname, setNewNickname] = useState("")
  const [nicknameError, setNicknameError] = useState("")

  const [likedReviewList, setLikedReviewList] = useState<any[]>([])
  const [myReviewList, setMyReviewList] = useState<any[]>([])
  const [savedReviewList, setSavedReviewList] = useState<any[]>([])

  useEffect(() => {
    if (typeof window === "undefined" || !downloadedDeals) return
    downloadedDeals.forEach((dealId) => {
      const key = `coupon_date_${dealId}`
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, new Date().toISOString())
      }
    })
  }, [downloadedDeals])

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

  const myDownloadedDeals = deals.filter((deal) =>
    downloadedDeals.map((id) => String(id)).includes(String(deal.id))
  )

  const myDownloadedCoupons = COUPON_EVENTS.filter((event) =>
    downloadedCoupons.includes(event.id)
  )

  const calcRemainingDays = (dealId: any) => {
    if (typeof window === "undefined") return 30
    const saved = localStorage.getItem(`coupon_date_${dealId}`)
    if (!saved) return 30
    const expiryDate = new Date(saved)
    expiryDate.setDate(expiryDate.getDate() + 30)
    return Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleNicknameUpdate = async () => {
    setNicknameError("")
    const result = await updateNickname(newNickname)
    if (result.ok) {
      setEditing(false)
      setSuccessMsg("닉네임이 변경되었습니다!")
      setTimeout(() => setSuccessMsg(""), 3000)
    } else {
      setNicknameError(result.message || "닉네임 변경에 실패했습니다.")
    }
  }

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setSuccessMsg("")
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      const success = await updateProfileImage(data.imageUrl)
      if (success) setSuccessMsg("프로필 이미지가 업데이트되었습니다!")
    } catch (err) {
      console.error("프로필 이미지 업로드 실패:", err)
    } finally {
      setUploading(false)
    }
  }

  const handleProfileImageDelete = async () => {
    setUploading(true)
    setSuccessMsg("")
    const success = await updateProfileImage("")
    if (success) setSuccessMsg("프로필 이미지가 삭제되었습니다!")
    setUploading(false)
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

  const currentImage = user?.profileImageUrl

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Profile Section */}
      <div className="mb-8 flex items-center gap-4 rounded-2xl border bg-card p-6">
        <div className="relative shrink-0">
          <label className="cursor-pointer group relative block">
            <div className="h-16 w-16 rounded-full border-2 border-border bg-primary/10 flex items-center justify-center overflow-hidden">
              {currentImage ? (
                <img
                  src={currentImage.startsWith("http") ? currentImage : `${process.env.NEXT_PUBLIC_API_URL}${currentImage}`}
                  alt="프로필"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-primary">{user?.nickname?.charAt(0)}</span>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
          </label>
          {currentImage && (
            <button
              onClick={handleProfileImageDelete}
              disabled={uploading}
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white text-xs hover:bg-red-600 transition-colors"
              title="프로필 이미지 삭제"
            >×</button>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            {editing ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <input
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleNicknameUpdate()}
                    className="border rounded px-2 py-1 text-sm focus:outline-none focus:border-primary"
                    autoFocus
                  />
                  <button onClick={handleNicknameUpdate} className="text-xs text-green-600 underline">저장</button>
                  <button onClick={() => { setEditing(false); setNicknameError("") }} className="text-xs text-muted-foreground underline">취소</button>
                </div>
                {nicknameError && <p className="text-xs text-destructive">{nicknameError}</p>}
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-foreground">{user?.nickname}님</h1>
                <button
                  onClick={() => { setNewNickname(user?.nickname || ""); setEditing(true) }}
                  className="text-xs text-primary underline"
                >수정</button>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          {uploading && <p className="text-xs text-muted-foreground mt-0.5">처리 중...</p>}
          {successMsg && <p className="text-xs text-green-600 font-medium mt-0.5">{successMsg}</p>}
          {!uploading && !successMsg && !editing && (
            <p className="text-xs text-muted-foreground mt-0.5">프로필 사진을 클릭하여 변경</p>
          )}
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
        <div className="space-y-3">
          {myDownloadedDeals.length === 0 ? (
            <EmptyState message="다운로드한 할인권이 없습니다." linkLabel="이벤트 보기" linkHref="/events" />
          ) : (
            myDownloadedDeals.map((deal) => {
              const remainingDays = calcRemainingDays(deal.id)
              return (
                <Link key={deal.id} href={`/events/${deal.id}`}
                  className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:bg-muted/50 transition-colors"
                >
                  <img src={deal.image} alt={deal.title} className="h-16 w-24 shrink-0 rounded-lg object-cover" crossOrigin="anonymous" />
                  <div className="flex-1">
                    <Badge variant="secondary" className="text-xs">{getCategoryLabel(deal.category)}</Badge>
                    <p className="font-medium mt-1">{deal.title}</p>
                    <p className="text-sm text-primary font-semibold">{formatPrice(deal.discountPrice)}</p>
                    {remainingDays > 0 ? (
                      <p className="text-xs font-medium mt-1 text-orange-600">⏳ D-{remainingDays}</p>
                    ) : (
                      <p className="text-xs font-medium mt-1 text-destructive">❌ 만료됨</p>
                    )}
                  </div>
                  <Badge className={remainingDays > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>
                    {remainingDays > 0 ? "사용가능" : "만료"}
                  </Badge>
                </Link>
              )
            })
          )}
        </div>
      )}

      {activeTab === "couponEvents" && (
        <div className="space-y-3">
          {myDownloadedCoupons.length === 0 ? (
            <EmptyState message="받은 쿠폰이 없습니다." linkLabel="쿠폰 보러가기" linkHref="/coupon-events" />
          ) : (
            myDownloadedCoupons.map((event) => {
              const expireDate = new Date(event.expireAt)
              const remainingDays = Math.ceil((expireDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              return (
                <Link
                  key={event.id}
                  href={`/coupon-events/${event.id}`}
                  className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:bg-muted/50 transition-colors"
                >
                  <img src={event.imageUrl} alt={event.title} className="h-16 w-24 shrink-0 rounded-lg object-cover" />
                  <div className="flex-1">
                    <Badge variant="secondary" className="text-xs">타임오픈쿠폰</Badge>
                    <p className="font-medium mt-1">{event.title}</p>
                    <p className="text-sm text-primary font-semibold">{event.discountRate}% 할인</p>
                    {remainingDays > 0 ? (
                      <p className="text-xs font-medium mt-1 text-orange-600">⏳ D-{remainingDays}</p>
                    ) : (
                      <p className="text-xs font-medium mt-1 text-destructive">❌ 만료됨</p>
                    )}
                  </div>
                  <Badge className={remainingDays > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>
                    {remainingDays > 0 ? "사용가능" : "만료"}
                  </Badge>
                </Link>
              )
            })
          )}
        </div>
      )}

      {activeTab === "saved" && (
        <div className="space-y-3">
          {savedReviewList.length === 0
            ? <EmptyState message="저장한 후기가 없습니다." linkLabel="후기 보기" linkHref="/reviews" />
            : savedReviewList.map((r) => <ReviewItem key={r.id} review={r} />)}
        </div>
      )}

      {activeTab === "liked" && (
        <div className="space-y-3">
          {likedReviewList.length === 0
            ? <EmptyState message="좋아요한 후기가 없습니다." linkLabel="후기 보기" linkHref="/reviews" />
            : likedReviewList.map((r) => <ReviewItem key={r.id} review={r} />)}
        </div>
      )}

      {activeTab === "myreviews" && (
        <div className="space-y-3">
          {myReviewList.length === 0
            ? <EmptyState message="작성한 후기가 없습니다." linkLabel="후기 작성하기" linkHref="/reviews/write" />
            : myReviewList.map((r) => <ReviewItem key={r.id} review={r} />)}
        </div>
      )}
    </div>
  )
}

// ✅ useSearchParams 때문에 Suspense로 감싸야 함
export default function MyPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">로딩 중...</div>}>
      <MyPageContent />
    </Suspense>
  )
}

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