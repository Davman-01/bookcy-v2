"use client";
import Link from 'next/link';
import { UserCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 h-[72px] flex items-center justify-between bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-slate-200 transition-all">
      
      {/* LOGO - BOOKCY MOR */}
      <Link href="/" className="flex items-center gap-2 no-underline cursor-pointer">
        <div className="w-9 h-9 bg-[#2D1B4E] rounded-xl flex items-center justify-center shadow-lg">
           <span className="text-white font-black text-xl">b</span>
        </div>
        <span className="font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold text-[#2D1B4E] tracking-tighter">
          bookcy<span className="text-[#E8622A]">.</span>
        </span>
      </Link>

      {/* MENÜ - SİYAH METİN */}
      <ul className="hidden lg:flex items-center gap-8 list-none m-0 p-0 text-sm font-bold">
        <li><Link href="/mekanlar" className="text-[#E8622A] no-underline">Mekanlar</Link></li>
        <li><Link href="/neden-bookcy" className="text-[#101010]/80 no-underline hover:text-[#E8622A] transition-colors">Özellikler</Link></li>
        <li><Link href="/paketler" className="text-[#101010]/80 no-underline hover:text-[#E8622A] transition-colors">Hakkımızda</Link></li>
        <li><Link href="/iletisim" className="text-[#101010]/80 no-underline hover:text-[#E8622A] transition-colors">İletişim</Link></li>
      </ul>

      {/* GİRİŞ - TURUNCU BUTON */}
      <div className="flex items-center gap-4">
        <Link href="/isletme-giris" className="btn-primary no-underline flex items-center gap-2">
          <UserCircle size={18} /> GİRİŞ YAP / KAYIT OL
        </Link>
      </div>
    </nav>
  );
}