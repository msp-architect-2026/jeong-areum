import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR } from 'next/font/google'

import './globals.css'
import { AuthProvider } from '@/components/auth-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const notoSansKr = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'TripDeal - 특별한 여행을 특별한 가격으로',
  description: '한정 수량 호텔 할인, 관광 티켓, 음식점 쿠폰을 특가로 만나보세요. 여행 후기와 정보도 함께!',
}

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.className} antialiased`}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
