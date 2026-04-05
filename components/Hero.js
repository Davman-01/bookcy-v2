"use client";
import { Search, MapPin, Scissors } from 'lucide-react';

export default function Hero() {
  return (
    <section className="w-full pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
        <span className="w-2 h-2 rounded-full bg-[#E8622A] animate-pulse"></span>
        <span className="text-xs font-bold text-[#2D1B4E]">Kuzey Kıbrıs'ın En Büyük Randevu Ağı</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-black text-[#2D1B4E] font-['Plus_Jakarta_Sans'] tracking-tight mb-6 max-w-4xl leading-tight">
        Kişisel Bakımınız İçin <br /> 
        <span className="text-[#E8622A]">Profesyonel</span> Çözümler
      </h1>
      
      <p className="text-lg text-slate-500 font-medium mb-12 max-w-2xl">
        Kuzey Kıbrıs genelindeki en iyi salonları keşfedin, gerçek kullanıcı yorumlarını okuyun ve anında randevunuzu oluşturun.
      </p>

      {/* Arama Motoru - Liste Madde 20: Bölge ve Hizmet Seçme */}
      <div className="w-full max-w-4xl bg-white p-2 rounded-2xl shadow-xl border border-slate-100 flex flex-col md:row items-center gap-2">
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors">
          <MapPin className="text-[#E8622A]" size={20} />
          <select className="bg-transparent border-none outline-none text-sm font-bold text-[#2D1B4E] w-full cursor-pointer">
            <option>Bölge Seçin (Lefkoşa, Girne...)</option>
            <option>Lefkoşa</option>
            <option>Girne</option>
            <option>Gazimağusa</option>
            <option>İskele</option>
            <option>Güzelyurt</option>
          </select>
        </div>
        <div className="hidden md:block w-px h-10 bg-slate-100"></div>
        <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors">
          <Scissors className="text-[#E8622A]" size={20} />
          <select className="bg-transparent border-none outline-none text-sm font-bold text-[#2D1B4E] w-full cursor-pointer">
            <option>Hizmet Seçin (Kuaför, Berber...)</option>
            <option>Kadın Kuaför</option>
            <option>Erkek Berber</option>
            <option>Güzellik Merkezi</option>
            <option>Masaj & Spa</option>
            <option>Bar & Club</option>
          </select>
        </div>
        <button className="w-full md:w-auto px-10 py-4 bg-[#2D1B4E] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#E8622A] transition-all">
          <Search size={18} />
          <span>Ara</span>
        </button>
      </div>
    </section>
  );
}