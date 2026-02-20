import { UtensilsCrossed } from "lucide-react"
import { DealCard } from "@/components/deal-card"
import { deals } from "@/lib/mock-data"

export default function RestaurantsPage() {
  const restaurantDeals = deals.filter((d) => d.category === "restaurant")

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
          <UtensilsCrossed className="h-6 w-6 text-[hsl(38,92%,40%)]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">음식점 할인</h1>
          <p className="mt-0.5 text-muted-foreground">인기 맛집 할인 쿠폰을 받아가세요</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {restaurantDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  )
}
