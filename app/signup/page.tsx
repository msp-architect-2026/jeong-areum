"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plane, Eye, EyeOff, Check, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [nickname, setNickname] = useState("")   // ✅ 추가
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState("")

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const { signup } = useAuth()
  const router = useRouter()

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setProfilePreview(URL.createObjectURL(file))
    setUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setProfileImageUrl(data.imageUrl)
    } catch (err) {
      console.error("프로필 이미지 업로드 실패:", err)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !nickname || !email || !password) {
      setError("모든 필드를 입력해주세요.")
      return
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.")
      return
    }

    if (!agreed) {
      setError("이용약관에 동의해주세요.")
      return
    }

    if (uploading) {
      setError("이미지 업로드 중입니다. 잠시 후 다시 시도해주세요.")
      return
    }

    const success = await signup(name, nickname, email, password, profileImageUrl || undefined)

    if (success) {
      router.push("/login")
    } else {
      setError("회원가입에 실패했습니다. 이미 사용 중인 이메일 또는 닉네임일 수 있습니다.")
    }
  }

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
          <h1 className="mt-4 text-2xl font-bold text-foreground">회원가입</h1>
          <p className="mt-1 text-muted-foreground">가입하고 한정 할인을 받아보세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center gap-2">
            <label className="cursor-pointer group relative">
              <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-dashed border-input bg-muted flex items-center justify-center group-hover:border-primary transition-colors">
                {profilePreview ? (
                  <img src={profilePreview} className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
            </label>
            <p className="text-xs text-muted-foreground">
              {uploading ? "업로드 중..." : "프로필 사진 선택 (선택사항)"}
            </p>
          </div>

          {/* 이름 */}
          <InputField label="이름" value={name} onChange={setName} placeholder="홍길동" />

          {/* 닉네임 */}
          <InputField label="닉네임" value={nickname} onChange={setNickname} placeholder="여행왕123" />

          {/* 이메일 */}
          <InputField label="이메일" type="email" value={email} onChange={setEmail} placeholder="example@email.com" />

          {/* 비밀번호 */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">비밀번호</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6자 이상 입력하세요"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <InputField
            label="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="비밀번호를 다시 입력하세요"
          />

          {/* 약관 동의 */}
          <label className="flex cursor-pointer items-start gap-2 pt-2">
            <div
              onClick={() => setAgreed(!agreed)}
              className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border ${
                agreed ? "border-primary bg-primary" : "border-input bg-background"
              }`}
            >
              {agreed && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
            </div>
            <span className="text-sm text-muted-foreground">
              이용약관 및 개인정보처리방침에 동의합니다.
            </span>
          </label>

          <Button type="submit" className="w-full" size="lg" disabled={uploading}>
            {uploading ? "이미지 업로드 중..." : "회원가입"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}

// 🔥 재사용 input 컴포넌트
function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (val: string) => void
  placeholder: string
  type?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-background px-4 py-3"
      />
    </div>
  )
}