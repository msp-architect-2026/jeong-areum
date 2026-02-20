import { Plane, Shield, Target, Heart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AboutStatsAnimated, AboutPartnersMarquee } from "@/components/about-animations"

const values = [
  {
    icon: Target,
    title: "최고의 가성비",
    description: "엄선된 파트너사와의 협업을 통해 시중에서 찾기 어려운 파격적인 할인가를 제공합니다.",
  },
  {
    icon: Shield,
    title: "믿을 수 있는 서비스",
    description: "검증된 파트너사의 상품만을 선별하여 안심하고 이용하실 수 있습니다.",
  },
  {
    icon: Heart,
    title: "고객 중심 운영",
    description: "고객의 목소리에 귀 기울이며, 더 나은 여행 경험을 위해 끊임없이 노력합니다.",
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10">
            <Plane className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-balance text-4xl font-bold text-primary-foreground md:text-5xl">
            특별한 여행을 만드는 사람들
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-primary-foreground/80">
            트립딜은 2020년 설립 이래, 누구나 합리적인 가격으로 특별한 여행을 경험할 수 있도록 한정 수량 특가 할인 서비스를 운영하고 있습니다.
          </p>
        </div>
      </section>

      {/* Stats (숫자 올라감) */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <AboutStatsAnimated />
      </section>

      {/* ✅ Partners Marquee (여기!) */}
      <AboutPartnersMarquee />

      {/* Mission */}
      <section className="bg-card py-32">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">우리의 미션</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              {"\"모든 사람이 부담 없이 최고의 여행을 경험할 수 있는 세상\"을 만들어가고 있습니다. 호텔, 관광, 맛집 등 다양한 여행 상품을 한정 수량 특가로 제공하여, 합리적인 여행 문화를 선도합니다."}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="mb-10 text-center text-2xl font-bold text-foreground md:text-3xl">핵심 가치</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <value.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-card py-32">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">함께 성장하실 파트너를 찾습니다</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            트립딜과 함께 더 많은 고객에게 특별한 경험을 전달하세요.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/partners">
              <Button size="lg">파트너사 보기</Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" size="lg">이벤트 보기</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
