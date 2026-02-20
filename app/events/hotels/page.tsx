import { Hotel } from "lucide-react"
import { DealCard } from "@/components/deal-card"
import { deals } from "@/lib/mock-data"

export default function HotelsPage() {
  const hotelDeals = deals.filter((d) => d.category === "hotel")

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <Hotel className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">호텔 할인</h1>
          <p className="mt-0.5 text-muted-foreground">최고급 호텔을 파격 할인가로 만나보세요</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {hotelDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  )
}
