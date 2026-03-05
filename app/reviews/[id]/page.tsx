"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, Bookmark, MapPin, Calendar, Trash2 } from "lucide-react"
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

  // ✅ 1. API 호출: 환경 변수(NEXT_PUBLIC_API_URL) 사용
  useEffect(() => {
    fetch(`/api/reviews/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found")
        return res.json()
      })
      .then((data) => {
        setReview(data)
        setLikes(data.likes ?? 0)
        return fetch(`/api/reviews/${id}/comments`)
      })
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch(() => setReview(null))
      .finally(() => setLoading(false))
  }, [id])

  // ✅ 2. 좋아요 확인 API: 환경 변수 사용
  useEffect(() => {
    if (!isLoggedIn || !user?.email) return
    fetch(`/api/reviews/${id}/liked?email=${user.email}`)
      .then((res) => res.json())
      .then((data) => setLiked(data.liked ?? false))
      .catch(() => {})
  }, [id, isLoggedIn, user?.email])

  const handleDelete = async () => {
    if (!confirm("정말로 이 후기를 삭제하시겠습니까?")) return
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        alert("후기가 삭제되었습니다.")
        router.push("/reviews")
      } else {
        alert("삭제 실패")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleLike = async () => {
    if (!isLoggedIn) return
    try {
      const res = await fetch(`/api/reviews/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email }),
      })
      if (res.ok) {
        const data = await res.json()
        setLikes(data.likes)
        setLiked(data.liked)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleComment = async () => {
    if (!newComment.trim()) return
    try {
      const res = await fetch(`/api/reviews/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment, authorEmail: user?.email }),
      })
      if (res.ok) {
        const data = await res.json()
        setComments((prev) => [...prev, data])
        setNewComment("")
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center">불러오는 중...</div>
  if (!review) return <div className="flex min-h-[60vh] items-center justify-center">후기를 찾을 수 없습니다.</div>

  const isSaved = savedReviews.includes(String(review.id))
  const isAuthor = isLoggedIn && user?.email === review.authorEmail

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* 상단 버튼 */}
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> 뒤로가기
        </button>
        {isAuthor && (
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive gap-1.5">
            <Trash2 className="h-4 w-4" /> 삭제하기
          </Button>
        )}
      </div>

      {/* 제목 및 정보 */}
      <div className="mb-6">
        <div className="flex gap-2 mb-3">
          <Badge variant="secondary">{review.category}</Badge>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {review.location}
          </span>
        </div>
        <h1 className="text-3xl font-bold">{review.title}</h1>
      </div>

      {/* ✅ 3. 작성자 이미지: 직접 주소(localhost:8080) 사용 */}
      <div className="mb-6 flex items-center gap-3">
        {review.authorProfileImageUrl ? (
          <img
            src={review.authorProfileImageUrl.startsWith("http") 
              ? review.authorProfileImageUrl 
              : `http://localhost:8080${review.authorProfileImageUrl}`}
            alt={review.authorName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
            {review.authorName?.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold">{review.authorName}</p>
          <p className="text-xs text-muted-foreground">작성자</p>
        </div>
      </div>

      {/* ✅ 4. 리뷰 메인 이미지: 직접 주소(localhost:8080) 사용 */}
      {review.imageUrl && (
        <div className="mb-8 overflow-hidden rounded-2xl">
          <img
            src={review.imageUrl.startsWith("http") 
              ? review.imageUrl 
              : `http://localhost:8080${review.imageUrl}`}
            alt={review.title}
            className="aspect-[16/10] w-full object-cover"
          />
        </div>
      )}

      <div className="mb-8">
        <p className="whitespace-pre-line text-lg leading-relaxed">{review.content}</p>
      </div>

      {/* 좋아요/저장 */}
      <div className="flex items-center gap-3 border-t pt-6">
        {isLoggedIn ? (
          <>
            <Button variant={liked ? "default" : "outline"} onClick={handleLike} className={liked ? "bg-red-500 text-white" : ""}>
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} /> 좋아요 {likes}
            </Button>
            <Button variant={isSaved ? "default" : "outline"} onClick={() => toggleSave(String(review.id))}>
              <Bookmark className="h-4 w-4" /> 저장
            </Button>
          </>
        ) : (
          <Link href="/login"><Button variant="outline">로그인 후 이용 가능</Button></Link>
        )}
      </div>

      {/* 댓글 섹션 */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">댓글 {comments.length}개</h2>
        <div className="flex flex-col gap-4 mb-6">
          {comments.map((c: any) => (
            <div key={c.id} className="flex gap-3 rounded-xl border p-4">
              {/* ✅ 5. 댓글 작성자 이미지: 직접 주소(localhost:8080) 사용 */}
              {c.authorProfileImageUrl ? (
                <img
                  src={c.authorProfileImageUrl.startsWith("http") 
                    ? c.authorProfileImageUrl 
                    : `http://localhost:8080${c.authorProfileImageUrl}`}
                  alt={c.authorName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                  {c.authorName?.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{c.authorName}</p>
                <p className="text-sm text-muted-foreground">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
        {isLoggedIn && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글 입력..."
              className="flex-1 rounded-lg border px-4 py-2 text-sm"
            />
            <Button onClick={handleComment}>등록</Button>
          </div>
        )}
      </div>
    </div>
  )
}