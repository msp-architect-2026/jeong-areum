"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ImagePlus, Send, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"

export default function WriteReviewPage() {
  const { isLoggedIn, user, addMyReview } = useAuth()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("호텔")
  const [submitted, setSubmitted] = useState(false)
  const [uploading, setUploading] = useState(false)

  // 🔥 추가된 상태
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // 🔥 이미지 업로드 함수
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  setImagePreview(URL.createObjectURL(file))
  setUploading(true) // 업로드 시작

  const formData = new FormData()
  formData.append("file", file)

  // NEXT_PUBLIC_API_URL 대신 직접 8080으로
  const res = await fetch("http://localhost:8080/api/upload", {
    method: "POST",
    body: formData,
  })
  const data = await res.json()
  setImageUrl(data.imageUrl)
  setUploading(false)
}

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

  // 🔥 수정된 handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (uploading) {
      alert("사진 업로드 중입니다. 잠시 후 다시 시도해주세요.")
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          location,
          category,
          authorEmail: user?.email,
          imageUrl, // 🔥 추가됨
        }),
      })

      if (!response.ok) {
        alert("후기 등록에 실패했습니다.")
        return
      }

      addMyReview("review-" + Date.now())
      setSubmitted(true)
    } catch (error) {
      console.error("후기 등록 에러:", error)
      alert("오류가 발생했습니다.")
    }
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
          <label className="mb-2 block text-sm font-medium text-foreground">제목</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="여행지"
            className="rounded-lg border px-4 py-3"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border px-4 py-3"
          >
            <option value="호텔">호텔</option>
            <option value="관광">관광</option>
            <option value="음식점">음식점</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <textarea
          required
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border px-4 py-3"
        />

        {/* 🔥 수정된 사진 첨부 UI */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            사진 첨부
          </label>

          <label className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-input bg-muted/50 transition-colors hover:border-primary/50 overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="미리보기"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImagePlus className="h-8 w-8" />
                <span className="text-sm">클릭하여 사진을 업로드하세요</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        <Button type="submit" size="lg" className="w-full gap-2" disabled={uploading}>
          <Send className="h-4 w-4" />
          {uploading ? "사진 업로드 중..." : "후기 등록하기"}
          {/* 후기 등록하기 */}
        </Button>
      </form>
    </div>
  )
}