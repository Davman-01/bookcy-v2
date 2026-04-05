"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Salons from "@/components/Salons";
import Link from 'next/link';

export default function MekanlarPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#0B0710]">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[#E8622A] font-black text-sm mb-12 no-underline hover:-translate-x-2 transition-all">
          ← Ana Sayfaya Geri Dön
        </Link>
        
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-[#2D1B4E] dark:text-white tracking-tighter mb-4 leading-tight">
            Kuzey Kıbrıs'ın <br /> <span className="text-[#E8622A]">En Seçkin Mekanları</span>
          </h1>
          <p className="text-slate-500 font-bold max-w-2xl italic">Premium işletmeler listenin en üstünde yer alır.</p>
        </div>

        <Salons /> {/* İçerisinde Premium ve Altın Çerçeve mantığı olan ana bileşenimiz */}
      </div>
      <Footer />
    </main>
  );
}