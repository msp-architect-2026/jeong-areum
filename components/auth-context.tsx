"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  nickname: string
  email: string
  profileImageUrl?: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean

  login: (email: string, password: string) => Promise<boolean>
  signup: (
    name: string,
    nickname: string,
    email: string,
    password: string,
    profileImageUrl?: string
  ) => Promise<boolean>

  logout: () => void

  updateProfileImage: (imageUrl: string) => Promise<boolean>
  updateNickname: (nickname: string) => Promise<{ ok: boolean; message?: string }>

  downloadedDeals: string[]
  downloadDeal: (dealId: string) => void

  // ✅ 쿠폰 이벤트
  downloadedCoupons: number[]
  downloadCoupon: (couponEventId: number) => void

  likedReviews: string[]
  toggleLike: (reviewId: string) => void

  savedReviews: string[]
  toggleSave: (reviewId: string) => void

  myReviews: string[]
  addMyReview: (reviewId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "tripdeal_user"
const DEALS_KEY = "tripdeal_downloaded_deals"
const COUPONS_KEY = "tripdeal_downloaded_coupons"

const saveUserToStorage = (user: User | null) => {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  else localStorage.removeItem(STORAGE_KEY)
}

const loadUserFromStorage = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // ✅ 초기값 [] 고정 → useEffect에서 localStorage 로드 (hydration 안전)
  const [downloadedDeals, setDownloadedDeals] = useState<string[]>([])
  const [downloadedCoupons, setDownloadedCoupons] = useState<number[]>([])
  const [likedReviews, setLikedReviews] = useState<string[]>([])
  const [savedReviews, setSavedReviews] = useState<string[]>([])
  const [myReviews, setMyReviews] = useState<string[]>([])

  // ✅ 클라이언트 마운트 후에만 localStorage 읽기
  useEffect(() => {
    const savedUser = loadUserFromStorage()
    if (savedUser) setUser(savedUser)

    try {
      const savedDeals = localStorage.getItem(DEALS_KEY)
      if (savedDeals) setDownloadedDeals(JSON.parse(savedDeals))

      const savedCoupons = localStorage.getItem(COUPONS_KEY)
      if (savedCoupons) setDownloadedCoupons(JSON.parse(savedCoupons))
    } catch {}
  }, [])

  useEffect(() => {
    saveUserToStorage(user)
  }, [user])

  useEffect(() => {
    localStorage.setItem(DEALS_KEY, JSON.stringify(downloadedDeals))
  }, [downloadedDeals])

  useEffect(() => {
    localStorage.setItem(COUPONS_KEY, JSON.stringify(downloadedCoupons))
  }, [downloadedCoupons])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) return false
      const data = await response.json()
      setUser({
        id: String(data.id ?? "user-" + Date.now()),
        name: data.name ?? email.split("@")[0],
        nickname: data.nickname ?? data.name ?? email.split("@")[0],
        email: data.email ?? email,
        profileImageUrl: data.profileImageUrl || undefined,
      })
      return true
    } catch (error) {
      console.error("로그인 에러:", error)
      return false
    }
  }, [])

  const signup = useCallback(async (
    name: string,
    nickname: string,
    email: string,
    password: string,
    profileImageUrl?: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, nickname, email, password, profileImageUrl }),
      })
      if (!response.ok) return false
      return true
    } catch (error) {
      console.error("회원가입 에러:", error)
      return false
    }
  }, [])

  const updateProfileImage = useCallback(async (imageUrl: string): Promise<boolean> => {
    if (!user) return false
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${encodeURIComponent(user.email)}/profile-image`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileImageUrl: imageUrl }),
        }
      )
      if (!response.ok) return false
      setUser((prev) => {
        const updated = prev ? { ...prev, profileImageUrl: imageUrl } : prev
        if (updated) saveUserToStorage(updated)
        return updated
      })
      return true
    } catch (error) {
      console.error("프로필 이미지 업데이트 에러:", error)
      return false
    }
  }, [user])

  const updateNickname = useCallback(async (nickname: string): Promise<{ ok: boolean; message?: string }> => {
    if (!user) return { ok: false, message: "로그인이 필요합니다." }
    const trimmed = nickname.trim()
    if (!trimmed) return { ok: false, message: "닉네임을 입력해주세요." }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${encodeURIComponent(user.email)}/nickname`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nickname: trimmed }),
        }
      )
      const data = await response.json().catch(() => ({}))
      if (!response.ok) return { ok: false, message: data.message || "닉네임 변경에 실패했습니다." }
      setUser((prev) => {
        const updated = prev ? { ...prev, nickname: trimmed } : prev
        if (updated) saveUserToStorage(updated)
        return updated
      })
      return { ok: true }
    } catch (error) {
      console.error("닉네임 업데이트 에러:", error)
      return { ok: false, message: "서버 오류가 발생했습니다." }
    }
  }, [user])

  const logout = useCallback(() => {
    setUser(null)
    setDownloadedDeals([])
    setDownloadedCoupons([])
    setLikedReviews([])
    setSavedReviews([])
    setMyReviews([])
    localStorage.removeItem(DEALS_KEY)
    localStorage.removeItem(COUPONS_KEY)
  }, [])

  const downloadDeal = useCallback((dealId: string) => {
    setDownloadedDeals((prev) => prev.includes(dealId) ? prev : [...prev, dealId])
  }, [])

  const downloadCoupon = useCallback((couponEventId: number) => {
    setDownloadedCoupons((prev) => prev.includes(couponEventId) ? prev : [...prev, couponEventId])
  }, [])

  const toggleLike = useCallback((reviewId: string) => {
    setLikedReviews((prev) =>
      prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]
    )
  }, [])

  const toggleSave = useCallback((reviewId: string) => {
    setSavedReviews((prev) =>
      prev.includes(reviewId) ? prev.filter((id) => id !== reviewId) : [...prev, reviewId]
    )
  }, [])

  const addMyReview = useCallback((reviewId: string) => {
    setMyReviews((prev) => [...prev, reviewId])
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        signup,
        logout,
        updateProfileImage,
        updateNickname,
        downloadedDeals,
        downloadDeal,
        downloadedCoupons,
        downloadCoupon,
        likedReviews,
        toggleLike,
        savedReviews,
        toggleSave,
        myReviews,
        addMyReview,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}