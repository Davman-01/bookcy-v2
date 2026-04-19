export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/panel/', '/profilim/'], // Google botlarının girmemesi gereken özel/şifreli sayfalar
    },
    sitemap: 'https://www.bookcy.co/sitemap.xml',
  }
}