"use client";
import { Search, MapPin, Scissors } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-36 pb-20 px-6 flex flex-col items-center text-center bg-[#FAF7F2] min-h-[80vh] justify-center border-b border-slate-200/50">
      
      {/* Üstteki Küçük Rozet */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
        <div className="w-2 h-2 rounded-full bg-[#E8622A] animate-pulse"></div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Kuzey Kıbrıs'ın En Büyük Randevu Ağı
        </span>
      </div>

      {/* Ana Başlık */}
      <h1 className="text-5xl md:text-7xl font-black text-[#2D1B4E] tracking-tighter mb-6 leading-[1.1]">
        Kişisel Bakımınız İçin <br />
        <span className="text-[#E8622A]">Profesyonel</span> Çözümler
      </h1>

      {/* Alt Başlık */}
      <p className="text-slate-500 font-bold text-sm md:text-base max-w-2xl mb-12 leading-relaxed">
        Kuzey Kıbrıs genelindeki en iyi salonları keşfedin, gerçek kullanıcı yorumlarını <br className="hidden md:block" /> okuyun ve anında randevunuzu oluşturun.
      </p>

      {/* Arama Kutusu (Fotoğraftaki Birebir Yapı) */}
      <div className="bg-white p-3 rounded-[32px] shadow-2xl shadow-[#2D1B4E]/10 border border-slate-100 flex flex-col md:flex-row items-center gap-2 w-full max-w-4xl mx-auto mb-12">
        
        {/* Konum Seçimi */}
        <div className="flex items-center gap-3 w-full md:w-1/2 px-6 py-3 border-b md:border-b-0 md:border-r border-slate-100">
          <MapPin className="text-[#E8622A]" size={22} />
          <div className="text-left w-full">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Konum</div>
            <select className="w-full bg-transparent border-none outline-none font-bold text-[#2D1B4E] text-sm cursor-pointer appearance-none">
              <option>Bölge Seçin (Lefkoşa, Girne...)</option>
              <option>Lefkoşa</option>
              <option>Girne</option>
              <option>Gazimağusa</option>
            </select>
          </div>
        </div>

        {/* Hizmet Seçimi */}
        <div className="flex items-center gap-3 w-full md:w-1/2 px-6 py-3">
          <Scissors className="text-[#E8622A]" size={22} />
          <div className="text-left w-full">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Hizmet</div>
            <select className="w-full bg-transparent border-none outline-none font-bold text-[#2D1B4E] text-sm cursor-pointer appearance-none">
              <option>Hizmet Seçin (Kuaför, Berber...)</option>
              <option>Kadın Kuaför</option>
              <option>Erkek Berber</option>
              <option>Güzellik Salonu</option>
            </select>
          </div>
        </div>

        {/* Ara Butonu */}
        <button className="w-full md:w-auto px-10 py-5 bg-[#2D1B4E] hover:bg-[#E8622A] text-white rounded-[24px] font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2D1B4E]/20 hover:shadow-[#E8622A]/30 hover:-translate-y-1">
          <Search size={18} /> Ara
        </button>
      </div>

      {/* Alt Etiketler (Hızlı Keşfet) */}
      <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl">
        {['Masaj', 'Saç Kesimi', 'Manikür & Pedikür', 'Cilt Bakımı', 'Lazer Epilasyon', 'Makyaj'].map((tag) => (
          <button key={tag} className="px-6 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-black text-[#2D1B4E] hover:border-[#E8622A] hover:text-[#E8622A] transition-all shadow-sm hover:shadow-md cursor-pointer">
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}