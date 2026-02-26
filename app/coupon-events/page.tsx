import { CouponEventBanner } from "@/components/coupon-event-banner"

export default function CouponEventsPage() {
  return (
    <section className="bg-card py-14">
      <div className="mx-auto max-w-7xl px-4">
        {/* isMainPage=false: 헤더 표시 / showAll=true: 전체 표시 */}
        <CouponEventBanner showAll={true} isMainPage={false} />
      </div>
    </section>
  )
}