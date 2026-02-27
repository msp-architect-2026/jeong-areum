/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // export 대신 standalone으로 변경
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [ // domains 대신 최신 권장 설정인 remotePatterns 사용
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;