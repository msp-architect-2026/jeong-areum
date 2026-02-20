import Link from "next/link"
import { Heart, Bookmark, MapPin } from "lucide-react"
import type { Review } from "@/lib/mock-data"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Link
      href={`/reviews/${review.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={review.image}
          alt={review.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          crossOrigin="anonymous"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {review.location}
          <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
            {review.category}
          </span>
        </div>
        <h3 className="font-semibold leading-snug text-card-foreground line-clamp-2">
          {review.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{review.content}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <img
              src={review.authorAvatar}
              alt={review.author}
              className="h-6 w-6 rounded-full object-cover"
              crossOrigin="anonymous"
            />
            <span className="text-xs text-muted-foreground">{review.author}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {review.likes}
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="h-3.5 w-3.5" />
              {review.saves}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
