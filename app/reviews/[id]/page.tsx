"use client"

import { use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, Bookmark, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-context"
import { reviews } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { isLoggedIn, likedReviews, toggleLike, savedReviews, toggleSave } = useAuth()
  const review = reviews.find((r) => r.id === id)

  if (!review) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-foreground">후기를 찾을 수 없습니다</h1>
        <Link href="/reviews" className="mt-4">
          <Button variant="outline">후기 목록으로</Button>
        </Link>
      </div>
    )
  }

  const isLiked = likedReviews.includes(review.id)
  const isSaved = savedReviews.includes(review.id)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        뒤로가기
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary">{review.category}</Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {review.location}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {review.date}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">{review.title}</h1>
      </div>

      {/* Author */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-card p-4">
        <img
          src={review.authorAvatar}
          alt={review.author}
          className="h-10 w-10 rounded-full object-cover"
          crossOrigin="anonymous"
        />
        <div>
          <p className="font-medium text-card-foreground">{review.author}</p>
          <p className="text-xs text-muted-foreground">여행 애호가</p>
        </div>
      </div>

      {/* Image */}
      <div className="mb-8 overflow-hidden rounded-2xl">
        <img
          src={review.image}
          alt={review.title}
          className="aspect-[16/10] w-full object-cover"
          crossOrigin="anonymous"
        />
      </div>

      {/* Content */}
      <div className="mb-8">
        <p className="whitespace-pre-line text-lg leading-relaxed text-foreground">
          {review.content}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 border-t border-border pt-6">
        {isLoggedIn ? (
          <>
            <Button
              variant={isLiked ? "default" : "outline"}
              onClick={() => toggleLike(review.id)}
              className={cn("gap-2", isLiked && "bg-destructive hover:bg-destructive/90 text-destructive-foreground")}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              좋아요 {review.likes + (isLiked ? 1 : 0)}
            </Button>
            <Button
              variant={isSaved ? "default" : "outline"}
              onClick={() => toggleSave(review.id)}
              className="gap-2"
            >
              <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
              저장 {review.saves + (isSaved ? 1 : 0)}
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="outline" className="gap-2">
                <Heart className="h-4 w-4" />
                좋아요 {review.likes}
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="gap-2">
                <Bookmark className="h-4 w-4" />
                저장 {review.saves}
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground">로그인 후 좋아요/저장할 수 있습니다</p>
          </>
        )}
      </div>
    </div>
  )
}
