"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';

export default function PaketlerPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#0B0710] transition-colors duration-500">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* GERI DON - TURUNCU STIL */}
        <Link href="/" className="inline-flex items-center gap-2 text-[#E8622A] font-black text-sm mb-12 no-underline hover:-translate-x-2 transition-all group">
          <div className="p-2 rounded-full bg-[#E8622A]/10 group-hover:bg-[#E8622A] group-hover:text-white transition-all">
            <ArrowLeft size={18} />
          </div>
          Ana Sayfaya Geri Dön
        </Link>

        {/* BASLIK - RESERV VIZYONU */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D1B4E]/5 dark:bg-white/5 border border-[#2D1B4E]/10 dark:border-white/10 text-[#2D1B4E] dark:text-[#F5C5A3] text-[10px] font-black uppercase mb-6 tracking-widest">
              <Star size={12} className="text-[#E8622A]" fill="currentColor" /> Paket Fiyatları (Standard / Premium)
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-[#2D1B4E] dark:text-white tracking-tighter mb-6 leading-none">
              İşletmeniz İçin <br /> 
              <span className="text-[#E8622A]">Doğru Seçim</span>
            </h1>
            <p className="text-slate-500 dark:text-white/40 font-bold max-w-xl mx-auto text-lg leading-relaxed">
              Kuzey Kıbrıs'ın en modern randevu platformunda yerinizi alın.
            </p>
        </div>

        {/* FIYATLANDIRMA ALANI */}
        <div className="bg-white/50 dark:bg-white/5 p-4 md:p-12 rounded-[48px] backdrop-blur-sm border border-white dark:border-white/5 shadow-2xl shadow-[#2D1B4E]/5">
           <Pricing /> 
        </div>

      </div>

      <Footer />
    </main>
  );
}