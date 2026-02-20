import Link from "next/link"
import { Plane } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Plane className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Trip<span className="text-primary">Deal</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              특별한 여행을 더 특별한 가격으로.
              <br />
              한정 수량 할인으로 스마트한 여행을 시작하세요.
            </p>
          </div>

          {/* Event links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">이벤트</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/events/hotels" className="transition-colors hover:text-primary">호텔 할인</Link></li>
              <li><Link href="/events/tourism" className="transition-colors hover:text-primary">관광 티켓</Link></li>
              <li><Link href="/events/restaurants" className="transition-colors hover:text-primary">음식점 할인</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">커뮤니티</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/reviews" className="transition-colors hover:text-primary">여행 후기</Link></li>
              <li><Link href="/reviews/write" className="transition-colors hover:text-primary">후기 작성</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">회사</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="transition-colors hover:text-primary">회사소개</Link></li>
              <li><Link href="/partners" className="transition-colors hover:text-primary">파트너사</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>{"(주) 트립딜 | 대표 : 홍길동 | 사업자등록번호 : 123-45-67890"}</p>
          <p className="mt-1">{"서울특별시 강남구 테헤란로 123 트립딜빌딩 10층 | TEL : 02-1234-5678"}</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} TripDeal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
