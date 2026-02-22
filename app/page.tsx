import Link from "next/link"
import { ArrowRight, Hotel, Mountain, UtensilsCrossed, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DealCard } from "@/components/deal-card"
import { ReviewCard } from "@/components/review-card"
import { HeroSection } from "@/components/hero-section"
import { deals, reviews, partners } from "@/lib/mock-data"

const categories = [
  {
    label: "호텔",
    description: "최고급 호텔을 파격 할인가로",
    href: "/events/hotels",
    icon: Hotel,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "관광",
    description: "전국 액티비티 & 관광 티켓",
    href: "/events/tourism",
    icon: Mountain,
    color: "bg-[hsl(172,66%,50%)]/10 text-[hsl(172,66%,40%)]",
  },
  {
    label: "음식점",
    description: "인기 맛집 할인 쿠폰",
    href: "/events/restaurants",
    icon: UtensilsCrossed,
    color: "bg-accent/10 text-[hsl(38,92%,40%)]",
  },
]

export default function HomePage() {
  const featuredDeals = deals.slice(0, 4)
  const featuredReviews = reviews.slice(0, 3)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <HeroSection />

      {/* Categories */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">카테고리별 할인</h2>
          <p className="mt-2 text-muted-foreground">원하는 카테고리의 할인 상품을 찾아보세요</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/30"
            >
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${cat.color}`}>
                <cat.icon className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">{cat.label}</h3>
                <p className="text-sm text-muted-foreground">{cat.description}</p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Deals */}
      <section className="bg-card py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-semibold">타임세일</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">오늘의 특가 딜</h2>
              <p className="mt-1 text-muted-foreground">지금 놓치면 후회할 한정 특가!</p>
            </div>
            <Link href="/events" className="hidden md:block">
              <Button variant="ghost" className="gap-1 text-primary">
                전체보기 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Link href="/events">
              <Button variant="outline" className="gap-1">
                전체 딜 보기 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Preview */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">인기 여행 후기</h2>
            <p className="mt-1 text-muted-foreground">다른 여행자들의 생생한 이야기를 들어보세요</p>
          </div>
          <Link href="/reviews" className="hidden md:block">
            <Button variant="ghost" className="gap-1 text-primary">
              전체보기 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featuredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={{
                id: Number(review.id.replace("review-", "")),
                title: review.title,
                content: review.content,
                imageUrl: review.image,
                authorName: review.author,
                location: review.location,
                category: review.category,
                likes: review.likes,
                saves: review.saves,
              }}
            />
          ))}
        </div>
        <div className="mt-6 text-center md:hidden">
          <Link href="/reviews">
            <Button variant="outline" className="gap-1">
              전체 후기 보기 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Partners */}
      <section className="bg-card py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">함께하는 파트너</h2>
            <p className="mt-2 text-muted-foreground">믿을 수 있는 파트너사와 함께합니다</p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-4 text-center"
              >
                <div className="h-16 w-16 overflow-hidden rounded-lg">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                <span className="text-sm font-medium text-card-foreground">{partner.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/partners">
              <Button variant="outline" className="gap-1">
                파트너사 자세히 보기 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}