"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plane, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("이메일과 비밀번호를 입력해주세요.");
    return;
  }

  const success = await login(email, password);

  if (success) {
    router.push("/");
  } else {
    setError("로그인에 실패했습니다.");
  }
};

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-4 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Plane className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              Trip<span className="text-primary">Deal</span>
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground">로그인</h1>
          <p className="mt-1 text-muted-foreground">계정에 로그인하여 특별한 할인을 만나보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            로그인
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          아직 회원이 아니신가요?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
