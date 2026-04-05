"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { UserCircle, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState('TR');

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 h-[72px] flex items-center justify-between bg-[#FAF7F2]/85 dark:bg-[#0B0710]/85 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-all">
      
      {/* LOGO - BOOKCY ORIJINAL */}
      <Link href="/" className="flex items-center gap-2 no-underline group cursor-pointer">
        <div className="w-9 h-9 bg-[#2D1B4E] dark:bg-[#E8622A] rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
           <span className="text-white font-black text-xl">b</span>
        </div>
        <span className="font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold text-[#2D1B4E] dark:text-white tracking-tighter">
          bookcy<span className="text-[#E8622A]">.</span>
        </span>
      </Link>

      {/* MENÜ - AYRI URL SİSTEMİ */}
      <ul className="hidden lg:flex items-center gap-8 list-none m-0 p-0 text-sm font-bold">
        <li><Link href="/mekanlar" className="text-[#E8622A] no-underline">Mekanlar</Link></li>
        <li><Link href="/neden-bookcy" className="text-[#2D1B4E]/70 dark:text-white/70 no-underline hover:text-[#E8622A] transition-colors">Özellikler</Link></li>
        <li><Link href="/paketler" className="text-[#2D1B4E]/70 dark:text-white/70 no-underline hover:text-[#E8622A] transition-colors">Hakkımızda ve Paketler</Link></li>
        <li><Link href="/iletisim" className="text-[#2D1B4E]/70 dark:text-white/70 no-underline hover:text-[#E8622A] transition-colors">İletişim</Link></li>
      </ul>

      {/* SAĞ TARAF - DİL VE GİRİŞ */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex gap-1 bg-slate-200/50 dark:bg-white/5 p-1 rounded-full border border-slate-200 dark:border-white/10">
          {['TR', 'EN', 'RU'].map(l => (
            <button key={l} onClick={() => setLang(l)} className={`text-[10px] font-black w-8 h-8 rounded-full border-none cursor-pointer transition-all ${lang === l ? 'bg-[#2D1B4E] text-white shadow-md' : 'text-slate-400 bg-transparent'}`}>{l}</button>
          ))}
        </div>

        <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-full border border-slate-200 dark:border-white/10 text-[#2D1B4E] dark:text-white bg-transparent cursor-pointer hover:bg-white dark:hover:bg-white/5 transition-all">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Link href="/isletme-giris" className="btn-primary no-underline">
          <UserCircle size={18} className="inline mr-1" /> GİRİŞ YAP
        </Link>
      </div>
    </nav>
  );
}