import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Remove any deprecated options
  },
  // Firebase Google Auth popup + alap security headerek
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(self), microphone=(self), display-capture=(self), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://www.googleapis.com https://apis.google.com https://www.googletagmanager.com https://maps.googleapis.com https://vercel.live https://meet.jit.si https://*.jit.si",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vercel.live https://meet.jit.si https://*.jit.si",
              "font-src 'self' https://fonts.gstatic.com data: https://meet.jit.si https://*.jit.si",
              "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://*.googleusercontent.com https://mihasznamatek.hu https://www.google.com https://google.com https://www.googletagmanager.com https://meet.jit.si https://*.jit.si",
              "media-src 'self' blob: mediastream: https://storage.googleapis.com https://firebasestorage.googleapis.com",
              "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebase.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebasestorage.googleapis.com https://firestore.googleapis.com https://www.gstatic.com https://api.web3forms.com https://formsubmit.co https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://google.com https://ad.doubleclick.net https://googleads.g.doubleclick.net https://www.googleadservices.com https://pagead2.googlesyndication.com https://vercel.live wss://*.firebaseio.com https://meet.jit.si https://*.jit.si wss://*.jit.si wss://meet.jit.si",
              "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com https://vercel.live https://meet.jit.si https://*.jit.si",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://formsubmit.co",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
}

export default nextConfig
