"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PenSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReviewCard } from "@/components/review-card"
import { useAuth } from "@/components/auth-context"

export default function ReviewsPage() {
  const { isLoggedIn } = useAuth()
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("후기 목록 오류:", err))
  }, [])

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
        {reviews.length === 0 ? (
          <p className="text-muted-foreground col-span-3 text-center py-20">
            아직 등록된 후기가 없습니다.
          </p>
        ) : (
          reviews.map((review: any) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  )
}