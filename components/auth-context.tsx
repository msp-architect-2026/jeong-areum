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
  login: (email: string, password: string) => boolean
  signup: (name: string, email: string, password: string) => boolean
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

  const [registeredUsers, setRegisteredUsers] = useState<{ name: string; email: string }[]>([])

  const login = useCallback((email: string, _password: string) => {
    const registered = registeredUsers.find((u) => u.email === email)
    setUser({
      id: "user-" + Date.now(),
      name: registered ? registered.name : email.split("@")[0],
      email,
    })
    return true
  }, [registeredUsers])

  const signup = useCallback((name: string, email: string, _password: string) => {
    setRegisteredUsers((prev) => [...prev, { name, email }])
    return true
  }, [])

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
