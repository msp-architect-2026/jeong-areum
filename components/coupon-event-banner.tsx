"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";

export interface CouponEvent {
  id: number;
  title: string;
  description: string;
  discountRate: number;
  totalCount: number;
  openAt: string;
  expireAt: string;
  imageUrl: string;
}

interface Props {
  showAll?: boolean;
  isMainPage?: boolean;
}

function Countdown({ openAt }: { openAt: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const tick = () => {
      const diff = new Date(openAt).getTime() - Date.now();
      if (diff <= 0) { setLabel("🎉 지금 오픈!"); return; }
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setLabel(`${h}:${m}:${s} 후 오픈`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [openAt]);

  return (
    <span className="text-xs font-bold text-yellow-500 tabular-nums">{label}</span>
  );
}

export const COUPON_EVENTS: CouponEvent[] = [
  {
    id: 1,
    title: "인천 송도 오크우드 프리미어 쿠폰",
    description: "시티뷰 스위트 35% 할인",
    discountRate: 35,
    totalCount: 80,
    openAt: "2026-03-05T03:00:00.000Z",  // 🔒 잠금
    expireAt: "2026-03-12T03:00:00.000Z",
    imageUrl: "/images/songdo.jpg",
  },
  {
    id: 2,
    title: "강릉 세인트존스 호텔 오션뷰 특가",
    description: "오션뷰 객실 45% 할인",
    discountRate: 45,
    totalCount: 60,
    openAt: "2026-02-27T03:00:00.000Z",  // 🔒 잠금 (내일)
    expireAt: "2026-03-05T03:00:00.000Z",
    imageUrl: "/images/gangneung.webp",
  },
  {
    id: 3,
    title: "여수 밤바다 요트 투어 할인권",
    description: "선셋 요트투어 50% 할인",
    discountRate: 50,
    totalCount: 40,
    openAt: "2026-02-27T09:00:00.000Z",  // ✅ 오늘 오픈 (그대로 or 미래로)
    expireAt: "2026-03-02T03:00:00.000Z",
    imageUrl: "/images/yeosu.webp",
  },
  {
    id: 4,
    title: "대구 인터불고 호텔 뷔페 쿠폰",
    description: "프리미엄 디너 뷔페 30% 할인",
    discountRate: 30,
    totalCount: 100,
    openAt: "2026-02-28T03:00:00.000Z",  // 🔒 이미 잠금 상태 (그대로 OK)
    expireAt: "2026-03-04T03:00:00.000Z",
    imageUrl: "/images/daegu.jpg",
  },
  {
    id: 5,
    title: "가평 빠지 수상레저 종일권",
    description: "웨이크보드 & 수상스키 55% 할인",
    discountRate: 55,
    totalCount: 70,
    openAt: "2026-03-03T03:00:00.000Z",  // 🔒 잠금
    expireAt: "2026-03-07T03:00:00.000Z",
    imageUrl: "/images/gapyeong.jpg",
  },
];

export function CouponEventBanner({ showAll = true, isMainPage = false }: Props) {
  const router = useRouter();
  const { isLoggedIn, downloadedCoupons, downloadCoupon } = useAuth();
  const [now, setNow] = useState<Date | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const sortedEvents = [...COUPON_EVENTS].sort((a, b) => b.discountRate - a.discountRate);
  const displayEvents = showAll ? sortedEvents : sortedEvents.slice(0, 4);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCouponClick = (e: React.MouseEvent, event: CouponEvent, isOpen: boolean) => {
    e.stopPropagation();
    if (!isOpen) return;
    if (!isLoggedIn) { router.push("/signup"); return; }
    if (downloadedCoupons.includes(event.id)) { showToast("이미 받은 쿠폰입니다!"); return; }
    downloadCoupon(event.id);
    showToast("🎉 쿠폰이 마이페이지에 저장되었습니다!");
    // ✅ 받은 쿠폰 탭으로 바로 이동
    setTimeout(() => router.push("/mypage?tab=couponEvents"), 1500);
  };

  return (
    <div className="relative">
      {toast && (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg">
          {toast}
        </div>
      )}

      {!isMainPage && (
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <span className="text-sm font-semibold">쿠폰 오픈 이벤트</span>
          </div>
          <h2 className="text-2xl font-bold md:text-3xl">놓치면 후회할 쿠폰 오픈!</h2>
          <p className="mt-1 text-muted-foreground">정해진 시간에만 열리는 선착순 특가 쿠폰</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayEvents.map((event) => {
          const isOpen = now !== null && new Date(event.openAt) <= now;
          const isDownloaded = downloadedCoupons.includes(event.id);

          return (
            <div
              key={event.id}
              onClick={() => router.push(`/coupon-events/${event.id}`)}
              className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer
                ${isOpen
                  ? "border-primary bg-background shadow-md hover:shadow-xl hover:-translate-y-1"
                  : "border-border bg-muted hover:shadow-md"
                }`}
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
                <div className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white font-black text-sm shadow">
                  {event.discountRate}%
                </div>
              </div>

              {!isOpen && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/50 rounded-2xl">
                  <Lock className="h-8 w-8 text-white" />
                  {now !== null && <Countdown openAt={event.openAt} />}
                </div>
              )}

              <div className="p-4 flex flex-col gap-2">
                <span className="text-xs text-muted-foreground">한정 {event.totalCount}장</span>
                <p className="font-bold text-sm leading-snug">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.description}</p>

                <button
                  onClick={(e) => handleCouponClick(e, event, isOpen)}
                  disabled={!isOpen || isDownloaded}
                  className={`mt-2 w-full rounded-lg py-2 text-sm font-bold transition
                    ${isDownloaded
                      ? "bg-green-100 text-green-700 cursor-not-allowed"
                      : isOpen
                        ? "bg-primary text-white hover:opacity-90"
                        : "bg-muted-foreground/20 text-muted-foreground cursor-not-allowed"
                    }`}
                >
                  {isDownloaded ? "✓ 받기 완료" : isOpen ? "쿠폰 받기" : "오픈 전"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}