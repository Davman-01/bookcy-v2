import './globals.css';

export const metadata = {
  metadataBase: new URL('https://bookcy.co'),
  title: 'Bookcy | Kıbrıs Online Güzellik ve Randevu Platformu',
  description: 'Kıbrıs\'taki en iyi kuaför, berber, spa ve güzellik merkezlerini keşfedin. Sıra beklemeden, komisyonsuz ve 7/24 kesintisiz online randevu alın.',
  keywords: 'kıbrıs kuaför, girne berber, lefkoşa güzellik merkezi, kıbrıs randevu, spa, bookcy',
  openGraph: {
    title: 'Bookcy | Kıbrıs Online Güzellik ve Randevu Platformu',
    description: 'Kıbrıs\'taki en iyi berber, kuaför, spa ve güzellik merkezlerini keşfedin. 7/24 online randevu alın.',
    url: 'https://bookcy.co',
    siteName: 'Bookcy',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="antialiased min-h-screen m-0 p-0">
        {children}
      </body>
    </html>
  );
}