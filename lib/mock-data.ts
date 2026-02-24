export interface Deal {
  id: string
  title: string
  description: string
  category: "hotel" | "tourism" | "restaurant"
  originalPrice: number
  discountPrice: number
  discountPercent: number
  image: string
  location: string
  remainingQty: number
  totalQty: number
  endsAt: string
  tags: string[]
}

export interface Review {
  id: string
  title: string
  content: string
  image: string
  author: string
  authorAvatar: string
  date: string
  likes: number
  saves: number
  location: string
  category: string
}

export interface Partner {
  id: string
  name: string
  logo: string
  description: string
  category: string
}

const futureDate = (hours: number) => {
  const d = new Date()
  d.setHours(d.getHours() + hours)
  return d.toISOString()
}

export const deals: Deal[] = [
  {
    id: "deal-1",
    title: "제주 신라호텔 스위트룸 50% 할인",
    description: "제주도 최고급 호텔에서 특별한 하루를 보내세요. 오션뷰 스위트룸이 50% 할인된 가격으로 제공됩니다. 조식 포함, 스파 이용권 제공.",
    category: "hotel",
    originalPrice: 580000,
    discountPrice: 290000,
    discountPercent: 50,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop",
    location: "제주도",
    remainingQty: 12,
    totalQty: 50,
    endsAt: futureDate(5),
    tags: ["HOT", "조식포함"],
  },
  {
    id: "deal-2",
    title: "부산 해운대 그랜드 호텔 40% 할인",
    description: "해운대 바다가 한눈에 보이는 그랜드 호텔 디럭스룸을 40% 할인된 가격에 만나보세요.",
    category: "hotel",
    originalPrice: 320000,
    discountPrice: 192000,
    discountPercent: 40,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=500&fit=crop",
    location: "부산",
    remainingQty: 25,
    totalQty: 100,
    endsAt: futureDate(12),
    tags: ["인기"],
  },
  {
    id: "deal-3",
    title: "서울 남산타워 전망대 입장권 60% 할인",
    description: "서울의 야경을 한눈에! 남산타워 전망대 입장권을 특가로 만나보세요.",
    category: "tourism",
    originalPrice: 21000,
    discountPrice: 8400,
    discountPercent: 60,
    image: "https://images.unsplash.com/photo-1617541086271-4d43983704bd?w=800&h=500&fit=crop",
    location: "서울",
    remainingQty: 88,
    totalQty: 200,
    endsAt: futureDate(8),
    tags: ["마감임박"],
  },
  {
    id: "deal-4",
    title: "경주 월드 자유이용권 45% 할인",
    description: "경주월드 놀이공원 자유이용권! 온 가족이 함께 즐기세요.",
    category: "tourism",
    originalPrice: 52000,
    discountPrice: 28600,
    discountPercent: 45,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=500&fit=crop",
    location: "경주",
    remainingQty: 45,
    totalQty: 150,
    endsAt: futureDate(24),
    tags: ["가족추천"],
  },
  {
    id: "deal-5",
    title: "강남 미슐랭 레스토랑 코스요리 35% 할인",
    description: "미슐랭 2스타 셰프의 특별 디너 코스를 할인된 가격에 즐겨보세요.",
    category: "restaurant",
    originalPrice: 180000,
    discountPrice: 117000,
    discountPercent: 35,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop",
    location: "서울 강남",
    remainingQty: 8,
    totalQty: 30,
    endsAt: futureDate(3),
    tags: ["마감임박", "미슐랭"],
  },
  {
    id: "deal-6",
    title: "제주 흑돼지 맛집 20% 할인",
    description: "제주 현지인이 추천하는 흑돼지 전문점! 2인 세트 메뉴 20% 할인.",
    category: "restaurant",
    originalPrice: 89000,
    discountPrice: 71200,
    discountPercent: 20,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop",
    location: "제주도",
    remainingQty: 35,
    totalQty: 80,
    endsAt: futureDate(18),
    tags: ["현지맛집"],
  },
  {
    id: "deal-7",
    title: "여수 돌산대교 야경투어 30% 할인",
    description: "여수 밤바다의 로맨틱한 야경투어! 가이드 동행, 야식 포함.",
    category: "tourism",
    originalPrice: 45000,
    discountPrice: 31500,
    discountPercent: 30,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
    location: "여수",
    remainingQty: 20,
    totalQty: 60,
    endsAt: futureDate(15),
    tags: ["로맨틱"],
  },
  {
    id: "deal-8",
    title: "강원도 스키리조트 리프트권 55% 할인",
    description: "겨울 시즌 특가! 강원도 대표 스키리조트 종일 리프트권.",
    category: "tourism",
    originalPrice: 78000,
    discountPrice: 35100,
    discountPercent: 55,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=500&fit=crop",
    location: "강원도",
    remainingQty: 60,
    totalQty: 200,
    endsAt: futureDate(48),
    tags: ["시즌특가"],
  },
  {
    id: "deal-9",
    title: "서울 한옥 스테이 1박 40% 할인",
    description: "북촌 한옥마을 한복판의 전통 한옥 스테이. 한복체험 포함.",
    category: "hotel",
    originalPrice: 250000,
    discountPrice: 150000,
    discountPercent: 40,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=500&fit=crop",
    location: "서울",
    remainingQty: 5,
    totalQty: 20,
    endsAt: futureDate(6),
    tags: ["마감임박", "한복체험"],
  },
]

export const reviews: Review[] = [
  {
    id: "review-1",
    title: "제주도 3박 4일 힐링 여행기",
    content: "제주도 동쪽부터 서쪽까지 알차게 돌아본 여행 후기입니다. 성산일출봉에서 본 일출은 정말 장관이었어요. 트립딜에서 할인받은 호텔도 너무 좋았습니다. 특히 조식 뷔페가 정말 훌륭했고, 직원분들도 매우 친절하셨습니다. 다음에도 꼭 다시 가고 싶은 곳이에요!",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
    author: "여행자김",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    date: "2026-02-10",
    likes: 42,
    saves: 15,
    location: "제주도",
    category: "호텔",
  },
  {
    id: "review-2",
    title: "부산 해운대에서의 특별한 하루",
    content: "해운대 해수욕장부터 광안리 야경까지, 부산의 매력을 한껏 느낀 하루였습니다. 할인권으로 그랜드 호텔에서 묵었는데 오션뷰가 정말 끝내줬어요.",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop",
    author: "바다사랑",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    date: "2026-02-08",
    likes: 38,
    saves: 22,
    location: "부산",
    category: "호텔",
  },
  {
    id: "review-3",
    title: "강남 미슐랭 레스토랑 솔직 후기",
    content: "트립딜에서 35% 할인받고 다녀왔습니다. 에피타이저부터 디저트까지 모든 코스가 완벽했어요. 와인 페어링도 추천합니다!",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    author: "미식가박",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    date: "2026-02-05",
    likes: 56,
    saves: 31,
    location: "서울",
    category: "음식점",
  },
  {
    id: "review-4",
    title: "경주 가족여행 완벽 가이드",
    content: "아이들과 함께한 경주 2박3일! 불국사, 첨성대, 경주월드까지. 경주월드 할인권 덕분에 알뜰하게 즐겼어요. 아이들이 정말 좋아했습니다.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    author: "행복맘",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    date: "2026-02-01",
    likes: 29,
    saves: 18,
    location: "경주",
    category: "관광",
  },
  {
    id: "review-5",
    title: "여수 야경투어, 기대 이상이었어요!",
    content: "여수 돌산대교 야경투어 다녀왔는데 정말 로맨틱했습니다. 가이드분 설명도 재미있고, 야식으로 먹은 갓김치삼겹살이 일품이었어요.",
    image: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&h=400&fit=crop",
    author: "야경러버",
    authorAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
    date: "2026-01-28",
    likes: 67,
    saves: 45,
    location: "여수",
    category: "관광",
  },
  {
    id: "review-6",
    title: "서울 한옥 스테이 체험기",
    content: "북촌에서의 하룻밤이 이렇게 특별할 줄 몰랐어요. 한복 입고 한옥마을 산책도 하고, 전통 다도 체험도 했습니다. 외국인 친구에게도 추천하고 싶어요!",
    image: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=600&h=400&fit=crop",
    author: "한옥매니아",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    date: "2026-01-25",
    likes: 34,
    saves: 20,
    location: "서울",
    category: "호텔",
  },
]

export const partners: Partner[] = [
  { id: "p-1", name: "신라호텔", logo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=100&fit=crop", description: "대한민국 대표 럭셔리 호텔 체인", category: "호텔" },
  { id: "p-2", name: "롯데리조트", logo: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200&h=100&fit=crop", description: "전국 주요 관광지 리조트 운영", category: "호텔" },
  { id: "p-3", name: "한국관광공사", logo: "https://images.unsplash.com/photo-1617541086271-4d43983704bd?w=200&h=100&fit=crop", description: "대한민국 관광 홍보 및 진흥", category: "관광" },
  { id: "p-4", name: "제주관광협회", logo: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=200&h=100&fit=crop", description: "제주 관광 산업 발전 및 지원", category: "관광" },
  { id: "p-5", name: "미슐랭가이드", logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=100&fit=crop", description: "세계적인 레스토랑 평가 기관", category: "음식점" },
  { id: "p-6", name: "한화리조트", logo: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=100&fit=crop", description: "자연과 함께하는 프리미엄 리조트", category: "호텔" },
]

export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원"
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    hotel: "호텔",
    tourism: "관광",
    restaurant: "음식점",
  }
  return labels[category] || category
}

export function getCategoryPath(category: string): string {
  const paths: Record<string, string> = {
    hotel: "hotels",
    tourism: "tourism",
    restaurant: "restaurants",
  }
  return paths[category] || category
}