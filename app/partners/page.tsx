import { Building2, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { partners } from "@/lib/mock-data"

export default function PartnersPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-card py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-4 inline-block">
            <img
              src="/images/partner-icon.png"
              alt="파트너 네트워크"
              className="h-16 w-16"
              style={{
                filter: "brightness(0) saturate(100%) invert(30%) sepia(98%) saturate(1500%) hue-rotate(210deg) brightness(95%) contrast(95%)",
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">파트너사</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            트립딜과 함께하는 믿을 수 있는 파트너사를 소개합니다
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 h-24 w-24 overflow-hidden rounded-2xl border border-border">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <Badge variant="secondary" className="mb-2">
                {partner.category}
              </Badge>
              <h3 className="text-lg font-semibold text-card-foreground">{partner.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{partner.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership CTA */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Building2 className="mx-auto mb-4 h-10 w-10 text-primary-foreground/80" />
          <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
            파트너십 문의
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            트립딜과 함께 성장하고 싶으신가요? 파트너십에 관심이 있으시다면 언제든 연락해주세요.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" variant="secondary" className="gap-2">
              <Mail className="h-4 w-4" />
              제휴 문의하기
            </Button>
            <Link href="/about">
              <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                회사소개 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
