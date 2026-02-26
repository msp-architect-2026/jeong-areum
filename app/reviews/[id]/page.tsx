"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, Bookmark, MapPin, Calendar, Trash2 } from "lucide-react" // 🔥 Trash2 아이콘 추가
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-context"

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { isLoggedIn, savedReviews, toggleSave, user } = useAuth()

  const [review, setReview] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)

  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found")
        return res.json()
      })
      .then((data) => {
        setReview(data)
        setLikes(data.likes ?? 0)
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}/comments`)
      })
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch(() => setReview(null))
      .finally(() => setLoading(false))
  }, [id])

  // 🔥 로그인 유저의 좋아요 여부 확인
  useEffect(() => {
    if (!isLoggedIn || !user?.email) return
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}/liked?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => setLiked(data.liked ?? false))
      .catch(() => {})
  }, [id, isLoggedIn, user?.email])

  // 🔥 삭제 핸들러 추가
  const handleDelete = async () => {
    if (!confirm("정말로 이 후기를 삭제하시겠습니까?")) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        alert("후기가 삭제되었습니다.")
        router.push("/reviews") // 삭제 후 목록으로 이동
      } else {
        alert("삭제 권한이 없거나 실패했습니다.")
      }
    } catch (error) {
      console.error("삭제 에러:", error)
      alert("삭제 중 오류가 발생했습니다.")
    }
  }

  const handleLike = async () => {
    if (!isLoggedIn) return
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user?.email }),
        }
      )
      if (res.ok) {
        const data = await res.json()
        setLikes(data.likes)
        setLiked(data.liked)
      }
    } catch (error) {
      console.error("좋아요 에러:", error)
    }
  }

  const handleComment = async () => {
    if (!newComment.trim()) return
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newComment, authorEmail: user?.email }),
        }
      )
      if (res.ok) {
        const data = await res.json()
        setComments((prev) => [...prev, data])
        setNewComment("")
      }
    } catch (error) {
      console.error("댓글 에러:", error)
    }
  }

  if (loading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">불러오는 중...</div>
    )

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

  const isSaved = savedReviews.includes(String(review.id))
  
  // 🔥 본인 확인 로직: 로그인 이메일과 글쓴이 이메일 비교
  const isAuthor = isLoggedIn && user?.email === review.authorEmail

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* 상단 버튼 바 */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </button>

        {/* 🔥 본인일 때만 삭제 버튼 노출 */}
        {isAuthor && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            삭제하기
          </Button>
        )}
      </div>

      {/* 메타 정보 + 제목 */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="secondary">{review.category}</Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {review.location}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {review.createdAt?.substring(0, 10)}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">{review.title}</h1>
      </div>

      {/* 🔥 글쓴이 프로필 */}
      <div className="mb-6 flex items-center gap-3">
        {review.authorProfileImageUrl ? (
          <img
            src={
              review.authorProfileImageUrl.startsWith("http")
                ? review.authorProfileImageUrl
                : `${process.env.NEXT_PUBLIC_API_URL}${review.authorProfileImageUrl}`
            }
            alt={review.authorName}
            className="h-10 w-10 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold border border-border">
            {review.authorName?.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-foreground">{review.authorName}</p>
          <p className="text-xs text-muted-foreground">작성자</p>
        </div>
      </div>

      {/* 이미지 */}
      {review.imageUrl && (
        <div className="mb-8 overflow-hidden rounded-2xl">
          <img
            src={
              review.imageUrl.startsWith("http")
                ? review.imageUrl
                : `${process.env.NEXT_PUBLIC_API_URL}${review.imageUrl}`
            }
            alt={review.title}
            className="aspect-[16/10] w-full object-cover"
          />
        </div>
      )}

      {/* 본문 */}
      <div className="mb-8">
        <p className="whitespace-pre-line text-lg leading-relaxed text-foreground">
          {review.content}
        </p>
      </div>

      {/* 좋아요 / 저장 */}
      <div className="flex items-center gap-3 border-t border-border pt-6">
        {isLoggedIn ? (
          <>
            <Button
              variant={liked ? "default" : "outline"}
              onClick={handleLike}
              className={`gap-2 ${liked ? "bg-red-500 hover:bg-red-600 text-white" : ""}`}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              좋아요 {likes}
            </Button>
            <Button
              variant={isSaved ? "default" : "outline"}
              onClick={() => toggleSave(String(review.id))}
              className="gap-2"
            >
              <Bookmark className="h-4 w-4" />
              저장
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="outline">로그인 후 좋아요/저장</Button>
          </Link>
        )}
      </div>

      {/* 댓글 섹션 */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">댓글 {comments.length}개</h2>

        <div className="flex flex-col gap-4 mb-6">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">첫 댓글을 남겨보세요!</p>
          ) : (
            comments.map((c: any) => (
              <div key={c.id} className="flex gap-3 rounded-xl border border-border p-4">
                {c.authorProfileImageUrl ? (
                  <img
                    src={
                      c.authorProfileImageUrl.startsWith("http")
                        ? c.authorProfileImageUrl
                        : `${process.env.NEXT_PUBLIC_API_URL}${c.authorProfileImageUrl}`
                    }
                    alt={c.authorName}
                    className="h-8 w-8 rounded-full object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                    {c.authorName?.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.authorName}</p>
                  <p className="text-sm text-muted-foreground">{c.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.createdAt?.substring(0, 10)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {isLoggedIn ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              placeholder="댓글을 입력하세요..."
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:border-primary"
            />
            <Button onClick={handleComment}>등록</Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="outline">로그인 후 댓글 작성</Button>
          </Link>
        )}
      </div>
    </div>
  )
}