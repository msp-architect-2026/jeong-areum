"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Bookmark, MapPin } from "lucide-react"

interface Review {
  id: number
  title: string
  content: string
  imageUrl?: string
  authorName: string
  location: string
  category: string
  likes?: number
  saves?: number
}

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [likes, setLikes] = useState(review.likes ?? 0)
  const [liked, setLiked] = useState(false)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (liked) return

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${review.id}/like`,
        {
          method: "POST",
        }
      )

      if (res.ok) {
        const data = await res.json()
        setLikes(data.likes)
        setLiked(true)
      }
    } catch (error) {
      console.error("좋아요 에러:", error)
    }
  }

  return (
    <Link
      href={`/reviews/${review.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {review.imageUrl ? (
          <img
            src={review.imageUrl.startsWith("http")
              ? review.imageUrl
              : review.imageUrl.startsWith("/uploads")
              ? `${process.env.NEXT_PUBLIC_API_URL}${review.imageUrl}`
              : review.imageUrl
            }
            alt={review.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget
              target.style.display = "none"
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `<div class="flex h-full w-full items-center justify-center text-muted-foreground text-sm">사진 없음</div>`
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
            사진 없음
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {review.location}
          <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
            {review.category}
          </span>
        </div>

        <h3 className="font-semibold leading-snug text-card-foreground line-clamp-2">
          {review.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {review.content}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {review.authorName}
          </span>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${
                liked ? "text-red-500" : "hover:text-red-400"
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`}
              />
              {likes}
            </button>

            <span className="flex items-center gap-1">
              <Bookmark className="h-3.5 w-3.5" />
              {review.saves ?? 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}