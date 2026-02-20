import { Mountain } from "lucide-react"
import { DealCard } from "@/components/deal-card"
import { deals } from "@/lib/mock-data"

export default function TourismPage() {
  const tourismDeals = deals.filter((d) => d.category === "tourism")

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(172,66%,50%)]/10">
          <Mountain className="h-6 w-6 text-[hsl(172,66%,40%)]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">관광 티켓</h1>
          <p className="mt-0.5 text-muted-foreground">전국 액티비티 & 관광 티켓 특가</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tourismDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  )
}
