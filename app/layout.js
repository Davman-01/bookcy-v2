import './globals.css';

export const metadata = {
  title: 'Bookcy | Kıbrıs Online Güzellik ve Randevu Platformu',
  description: 'Kuzey Kıbrıs\'ın en iyi kuaför, berber ve güzellik merkezlerini keşfedin.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#FAF7F2] text-[#2D1B4E] antialiased m-0 p-0 min-h-screen">
        {children}
      </body>
    </html>
  );
}