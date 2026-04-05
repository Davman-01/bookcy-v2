"use client";
import Link from 'next/link';
import { TrendingUp, CalendarDays, Smartphone } from 'lucide-react';

export default function BusinessCTA() {
  return (
    <section className="w-full px-6 md:px-12 py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto bg-[#2D1B4E] rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Arka Plan Dekoratif Şekiller */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8622A] rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Sol Kısım: Yazılar */}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block py-1 px-3 rounded-full bg-[#E8622A]/20 text-[#F5C5A3] font-bold text-xs uppercase tracking-wider mb-4 border border-[#E8622A]/30">
              İşletme Sahipleri İçin
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white font-['Plus_Jakarta_Sans'] mb-6 leading-tight">
              Müşterilerinizi Katlayın, <br className="hidden md:block" />
              <span className="text-[#E8622A]">Zamanınızı</span> Yönetin.
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-xl">
              Bookcy iş ortağı olun; telefon trafiğinden kurtulun, 7/24 online randevu alın ve gelirlerinizi detaylı analiz edin.
            </p>
            
            <Link href="/isletme-giris" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#E8622A] text-white font-bold hover:bg-[#d4561f] transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#E8622A]/40 no-underline">
              Hemen İşletme Hesabı Oluştur &rarr;
            </Link>
          </div>

          {/* Sağ Kısım: Özellik Rozetleri */}
          <div className="w-full md:w-auto flex flex-col gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/20 transition-colors">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center">
                <CalendarDays size={24} />
              </div>
              <div className="text-left">
                <h4 className="text-white font-bold">Akıllı Takvim</h4>
                <p className="text-white/60 text-xs">7/24 Otomatik randevu</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/20 transition-colors md:-translate-x-8">
              <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-300 flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <div className="text-left">
                <h4 className="text-white font-bold">Gelir Artışı</h4>
                <p className="text-white/60 text-xs">Daha fazla görünürlük</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/20 transition-colors">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <Smartphone size={24} />
              </div>
              <div className="text-left">
                <h4 className="text-white font-bold">Mobil Yönetim</h4>
                <p className="text-white/60 text-xs">İşin cebinde seninle</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}