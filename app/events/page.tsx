"use client"

import { useState } from "react"
import { Hotel, Mountain, UtensilsCrossed, LayoutGrid } from "lucide-react"
import { DealCard } from "@/components/deal-card"
import { deals } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const tabs = [
  { key: "all", label: "전체", icon: LayoutGrid },
  { key: "hotel", label: "호텔", icon: Hotel },
  { key: "tourism", label: "관광", icon: Mountain },
  { key: "restaurant", label: "음식점", icon: UtensilsCrossed },
]

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const filteredDeals = activeTab === "all" ? deals : deals.filter((d) => d.category === activeTab)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">이벤트</h1>
        <p className="mt-2 text-muted-foreground">한정 수량 특가 할인을 놓치지 마세요!</p>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Deals Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>

      {filteredDeals.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          해당 카테고리의 딜이 없습니다.
        </div>
      )}
    </div>
  )
}
