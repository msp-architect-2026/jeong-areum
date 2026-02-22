"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [downloadedDeals, setDownloadedDeals] = useState<string[]>([])
  const [likedReviews, setLikedReviews] = useState<string[]>([])
  const [savedReviews, setSavedReviews] = useState<string[]>([])
  const [myReviews, setMyReviews] = useState<string[]>([])

  const login = useCallback(async (email: string, password: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    // 🔥 나중에 JWT 오면 여기서 localStorage 저장
    // localStorage.setItem("token", data.token);

    setUser({
      id: data.id ?? "user-" + Date.now(),
      name: data.name ?? email.split("@")[0],
      email: data.email ?? email,
    });

    return true;
  } catch (error) {
    console.error("로그인 에러:", error);
    return false;
  }
}, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error("회원가입 실패:", data.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("회원가입 에러:", error);
    return false;
  }
}, []);

  const logout = useCallback(() => {
    setUser(null)
    setDownloadedDeals([])
    setLikedReviews([])
    setSavedReviews([])
    setMyReviews([])
  }, [])

  const downloadDeal = useCallback((dealId: string) => {
    setDownloadedDeals((prev) => (prev.includes(dealId) ? prev : [...prev, dealId]))
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
