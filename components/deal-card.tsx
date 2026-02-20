import Link from "next/link"
import { MapPin, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CountdownTimer } from "@/components/countdown-timer"
import type { Deal } from "@/lib/mock-data"
import { formatPrice } from "@/lib/mock-data"

interface DealCardProps {
  deal: Deal
}

export function DealCard({ deal }: DealCardProps) {
  const qtyPercent = Math.round((deal.remainingQty / deal.totalQty) * 100)

  return (
    <Link
      href={`/events/${deal.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={deal.image}
          alt={deal.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          crossOrigin="anonymous"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {deal.tags.map((tag) => (
            <Badge
              key={tag}
              className={
                tag === "HOT" || tag === "마감임박"
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-primary text-primary-foreground"
              }
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground text-sm">
          {deal.discountPercent}%
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {deal.location}
        </div>

        <h3 className="font-semibold leading-snug text-card-foreground line-clamp-2">
          {deal.title}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(deal.originalPrice)}
            </span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(deal.discountPrice)}
            </span>
          </div>
          <CountdownTimer endsAt={deal.endsAt} compact />
        </div>

        <div className="mt-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              잔여 {deal.remainingQty}장
            </span>
            <span>{qtyPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${qtyPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
