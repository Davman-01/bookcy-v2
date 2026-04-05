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
        Bakımınız İçin <span className="text-[#E8622A]">Profesyonel</span> <br /> Çözümler Keşfedin
      </h1>

      {/* Alt Başlık */}
      <p className="text-[#101010]/70 font-bold text-sm md:text-base max-w-2xl mb-12 leading-relaxed">
        Kuzey Kıbrıs genelindeki en iyi salonları keşfedin, <br className="hidden md:block" /> gerçek yorumları okuyun ve anında randevunuzu oluşturun.
      </p>

      {/* Arama Kutusu (Fotoğraftaki Birebir Yapı) */}
      <div className="bg-white p-3 rounded-[32px] shadow-2xl shadow-[#2D1B4E]/5 border border-slate-100 flex flex-col md:flex-row items-center gap-2 w-full max-w-4xl mx-auto mb-12">
        {/* Arama Alanları */}
        <div className="flex items-center gap-3 w-full px-6 py-3 border-b md:border-b-0 md:border-r border-slate-100">
          <MapPin className="text-[#E8622A]" size={22} />
          <div className="text-left w-full">
            <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Konum</div>
            <select className="w-full bg-transparent border-none font-bold text-[#101010] text-sm cursor-pointer">
              <option>Bölge Seçin...</option>
              <option>Lefkoşa</option><option>Girne</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full px-6 py-3">
          <Scissors className="text-[#E8622A]" size={22} />
          <div className="text-left w-full">
            <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Hizmet</div>
            <select className="w-full bg-transparent border-none font-bold text-[#101010] text-sm cursor-pointer">
              <option>Kuaför, Berber...</option>
              <option>Saç Kesimi</option><option>Manikür</option>
            </select>
          </div>
        </div>

        {/* Ara Butonu - Turuncu */}
        <button className="w-full md:w-auto px-10 py-5 bg-[#E8622A] text-white rounded-[24px] font-bold transition-all shadow-lg hover:shadow-[#E8622A]/30">
          <Search size={18} /> Ara
        </button>
      </div>
    </section>
  );
}