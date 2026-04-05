"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import Link from 'next/link';
import { ArrowLeft, MessageSquare } from 'lucide-react';

export default function IletisimPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#120b1e] transition-colors duration-300">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[#E8622A] font-black text-sm mb-12 no-underline hover:-translate-x-2 transition-all group">
          <div className="p-2 rounded-full bg-[#E8622A]/10 group-hover:bg-[#E8622A] group-hover:text-white transition-all">
            <ArrowLeft size={18} />
          </div>
          Ana Sayfaya Geri Dön
        </Link>

        <div className="mb-16">
            <div className="flex items-center gap-2 text-[#E8622A] mb-4">
              <MessageSquare size={20} />
              <span className="text-xs font-black uppercase tracking-widest">7/24 Destek Ekibi</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#2D1B4E] dark:text-white tracking-tighter mb-4 leading-tight">
              Bir Sorunuz mu Var? <br /> 
              <span className="text-[#E8622A]">Size Yardımcı Olalım</span>
            </h1>
        </div>

        <Contact /> 
      </div>

      <Footer />
    </main>
  );
}