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

  likedReviews: string[]
  toggleLike: (reviewId: string) => void

  savedReviews: string[]
  toggleSave: (reviewId: string) => void

  myReviews: string[]
  addMyReview: (reviewId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 🔥 저장 키들
const STORAGE_KEY = "tripdeal_user"
const DEALS_KEY = "tripdeal_downloaded_deals"

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

  // 🔥 downloadedDeals를 localStorage에서 복원
  const [downloadedDeals, setDownloadedDeals] = useState<string[]>(() => {
    if (typeof window === "undefined") return []
    const saved = localStorage.getItem(DEALS_KEY)
    return saved ? JSON.parse(saved) : []
  })

  const [likedReviews, setLikedReviews] = useState<string[]>([])
  const [savedReviews, setSavedReviews] = useState<string[]>([])
  const [myReviews, setMyReviews] = useState<string[]>([])

  // 유저 복원
  useEffect(() => {
    const saved = loadUserFromStorage()
    if (saved) setUser(saved)
  }, [])

  useEffect(() => {
    saveUserToStorage(user)
  }, [user])

  // 🔥 downloadedDeals 변경될 때 localStorage에 저장
  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem(DEALS_KEY, JSON.stringify(downloadedDeals))
  }, [downloadedDeals])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) return false

      const data = await response.json()

      const newUser: User = {
        id: String(data.id ?? "user-" + Date.now()),
        name: data.name ?? email.split("@")[0],
        nickname: data.nickname ?? data.name ?? email.split("@")[0],
        email: data.email ?? email,
        profileImageUrl: data.profileImageUrl || undefined,
      }

      setUser(newUser)
      return true
    } catch (error) {
      console.error("로그인 에러:", error)
      return false
    }
  }, [])

  const signup = useCallback(async () => true, [])

  const updateProfileImage = useCallback(async (imageUrl: string) => {
    if (!user) return false
    setUser((prev) => prev ? { ...prev, profileImageUrl: imageUrl } : prev)
    return true
  }, [user])

  const updateNickname = useCallback(async (nickname: string) => {
    if (!user) return { ok: false }
    setUser((prev) => prev ? { ...prev, nickname } : prev)
    return { ok: true }
  }, [user])

  const logout = useCallback(() => {
    setUser(null)
    setDownloadedDeals([])
    setLikedReviews([])
    setSavedReviews([])
    setMyReviews([])
    localStorage.removeItem(DEALS_KEY)
  }, [])

  const downloadDeal = useCallback((dealId: string) => {
    setDownloadedDeals((prev) =>
      prev.includes(dealId) ? prev : [...prev, dealId]
    )
  }, [])

  const toggleLike = useCallback((reviewId: string) => {
    setLikedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    )
  }, [])

  const toggleSave = useCallback((reviewId: string) => {
    setSavedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
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
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}