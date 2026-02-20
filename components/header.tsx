"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, ChevronDown, User, LogOut, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { cn } from "@/lib/utils"

const eventSubLinks = [
  { label: "전체", href: "/events" },
  { label: "호텔", href: "/events/hotels" },
  { label: "관광", href: "/events/tourism" },
  { label: "음식점", href: "/events/restaurants" },
]

const mainLinks = [
  { label: "여행후기", href: "/reviews" },
  { label: "회사소개", href: "/about" },
  { label: "파트너사", href: "/partners" },
]

export function Header() {
  const pathname = usePathname()
  const { user, isLoggedIn, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [eventOpen, setEventOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Plane className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            Trip<span className="text-primary">Deal</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* Event dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setEventOpen(true)}
            onMouseLeave={() => setEventOpen(false)}
          >
            <button
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname.startsWith("/events") ? "text-primary" : "text-foreground"
              )}
            >
              이벤트
              <ChevronDown className={cn("h-4 w-4 transition-transform", eventOpen && "rotate-180")} />
            </button>
            {eventOpen && (
              <div className="absolute left-0 top-full w-36 rounded-lg border border-border bg-card py-1 shadow-lg">
                {eventSubLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block px-4 py-2 text-sm transition-colors hover:bg-muted",
                      pathname === link.href ? "text-primary font-medium" : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname === link.href ? "text-primary" : "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn ? (
            <>
              <Link href="/mypage">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <User className="h-4 w-4" />
                  {user?.name}님
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 text-muted-foreground">
                <LogOut className="h-4 w-4" />
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">회원가입</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex items-center justify-center md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            <p className="px-3 pb-1 text-xs font-medium text-muted-foreground">이벤트</p>
            {eventSubLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
                  pathname === link.href ? "text-primary font-medium" : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted",
                  pathname === link.href ? "text-primary font-medium" : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            {isLoggedIn ? (
              <>
                <Link
                  href="/mypage"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  마이페이지
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-3 pt-1">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    로그인
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button size="sm" className="w-full">
                    회원가입
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
