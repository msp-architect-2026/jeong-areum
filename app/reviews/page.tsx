"use client"

import Link from "next/link"
import { PenSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReviewCard } from "@/components/review-card"
import { useAuth } from "@/components/auth-context"
import { reviews } from "@/lib/mock-data"

export default function ReviewsPage() {
  const { isLoggedIn } = useAuth()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">여행 후기</h1>
          <p className="mt-2 text-muted-foreground">여행자들의 생생한 이야기를 만나보세요</p>
        </div>
        {isLoggedIn ? (
          <Link href="/reviews/write">
            <Button className="gap-2">
              <PenSquare className="h-4 w-4" />
              후기 작성
            </Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button variant="outline" className="gap-2">
              <PenSquare className="h-4 w-4" />
              로그인 후 작성
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
