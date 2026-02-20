"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ImagePlus, Send, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"

export default function WriteReviewPage() {
  const { isLoggedIn, addMyReview } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("호텔")
  const [submitted, setSubmitted] = useState(false)

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <LogIn className="mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">로그인이 필요합니다</h1>
        <p className="mt-2 text-muted-foreground">후기를 작성하려면 로그인해주세요.</p>
        <Link href="/login" className="mt-4">
          <Button className="gap-2">
            <LogIn className="h-4 w-4" />
            로그인하기
          </Button>
        </Link>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Send className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">후기가 등록되었습니다!</h1>
        <p className="mt-2 text-muted-foreground">소중한 여행 후기를 공유해주셔서 감사합니다.</p>
        <Link href="/reviews" className="mt-4">
          <Button>후기 목록으로</Button>
        </Link>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addMyReview("review-custom-" + Date.now())
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        뒤로가기
      </button>

      <h1 className="mb-8 text-3xl font-bold text-foreground">여행 후기 작성</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-medium text-foreground">
            제목
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="여행 후기의 제목을 입력하세요"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className="mb-2 block text-sm font-medium text-foreground">
              여행지
            </label>
            <input
              id="location"
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 제주도, 부산"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium text-foreground">
              카테고리
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
            >
              <option value="호텔">호텔</option>
              <option value="관광">관광</option>
              <option value="음식점">음식점</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="content" className="mb-2 block text-sm font-medium text-foreground">
            내용
          </label>
          <textarea
            id="content"
            required
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="여행 경험을 자유롭게 작성해주세요"
            className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            사진 첨부
          </label>
          <div className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-input bg-muted/50 transition-colors hover:border-primary/50">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImagePlus className="h-8 w-8" />
              <span className="text-sm">클릭하여 사진을 업로드하세요</span>
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full gap-2">
          <Send className="h-4 w-4" />
          후기 등록하기
        </Button>
      </form>
    </div>
  )
}
