"use client";
import './globals.css';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Sayfa yüklendiğinde hafızadaki tercihi kontrol et
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <html lang="tr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col transition-colors duration-300">
        {/* Navbar'a bu fonksiyonu paslayacağız */}
        {children}
      </body>
    </html>
  );
}