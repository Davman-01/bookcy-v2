"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { useAppContext } from './providers';
import { categories, cyprusRegions } from '@/lib/constants';

export default function Home() {
  const router = useRouter();
  
  // Verilerin boş gelme ihtimaline karşı varsayılan (default) değerler atıyoruz
  const { lang = 'TR', t, shops = [], globalAppointments = [] } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('All');

  // shops dizisi gelene kadar boş dizi [] kabul et (Kırmızı çizgi önlemi)
  const approvedShops = (shops || []).filter(s => s?.status === 'approved');

  const handleHeroSearch = (e) => { 
    e.preventDefault(); 
    router.push(`/isletmeler?q=${searchQuery}&r=${filterRegion}`); 
  };

  // Dil sözlüğü yüklenene kadar hatayı önleyen güvenlik katmanı
  const currentLang = t?.[lang] ? lang : 'TR';
  const text = t?.[currentLang];

  // Eğer sözlük hala yüklenmediyse boş ekran göster (hata patlamasını önler)
  if (!text) return null;

  return (
    <div className="w-full">
      <section className="relative min-h-[90vh] bg-[#2D1B4E] overflow-hidden flex flex-col items-center justify-center pt-24 pb-20">
        {/* SVG Arka Planı VS Code'un kafasını karıştırmaması için style objesine alındı */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")` }}
        ></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-white/80 uppercase tracking-widest mb-8">
            <div className="w-2 h-2 rounded-full bg-[#E8622A]"></div>
            {text.hero?.eyebrow}
          </div>
          
          <h1 className="font-['Plus_Jakarta_Sans'] text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
            {text.hero?.title1} <span className="text-[#E8622A]">{text.hero?.title2}</span><br/>
            {text.hero?.title3} <span className="text-[#E8622A]">{text.hero?.title4}</span>
          </h1>
          
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">{text.hero?.sub}</p>
          
          <form className="w-full bg-white rounded-[24px] md:rounded-[50px] p-2 md:p-3 shadow-2xl flex flex-col md:flex-row gap-2 mx-auto max-w-[800px] mb-8" onSubmit={handleHeroSearch}>
              <div className="flex-1 flex items-center bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none px-4 py-3 md:py-2 md:border-r border-slate-200">
                  <Search size={20} className="text-slate-400 mr-3 shrink-0" />
                  <input type="text" className="w-full bg-transparent font-bold text-sm outline-none text-[#2D1B4E]" placeholder={text.hero?.searchPlace} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex-1 flex items-center bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none px-4 py-3 md:py-2">
                  <MapPin size={20} className="text-slate-400 mr-3 shrink-0" />
                  <select className="w-full bg-transparent font-bold text-sm outline-none text-[#2D1B4E] cursor-pointer" value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
                      <option value="All">{text.hero?.searchLoc}</option>
                      {(cyprusRegions || []).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
              </div>
              <button type="submit" className="bg-[#E8622A] text-white rounded-[16px] md:rounded-[40px] px-8 py-4 font-black text-sm hover:bg-[#d4561f] transition-colors w-full md:w-auto border-none cursor-pointer">
                {text.hero?.btn}
              </button>
          </form>
          
          <div className="flex items-center justify-center flex-wrap gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
             <span className="mr-2">{text.hero?.pop}</span>
             {(categories || []).slice(0,4).map(c => (
               <button key={c.key} type="button" onClick={() => router.push(`/isletmeler?c=${c.dbName}`)} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/20 transition-colors cursor-pointer text-white">
                 {c.emoji} {c.dbName}
               </button>
             ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 border-t border-white/10 pt-10 w-full max-w-[900px] mx-auto relative z-10 px-6">
            <div className="text-center md:border-r border-white/10 last:border-0 pb-4 md:pb-0">
              <div className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-black text-white mb-2">{approvedShops.length}</div>
              <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{text.hero?.stat1}</div>
            </div>
            <div className="text-center md:border-r border-white/10 last:border-0 pb-4 md:pb-0">
              <div className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-black text-white mb-2">{new Set((globalAppointments || []).map(a => a?.customer_phone)).size}</div>
              <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{text.hero?.stat2}</div>
            </div>
            <div className="text-center md:border-r border-white/10 last:border-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
              <div className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-black text-white mb-2">{(globalAppointments || []).length}</div>
              <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{text.hero?.stat3}</div>
            </div>
            <div className="text-center last:border-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
              <div className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-black text-white mb-2">%98</div>
              <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{text.hero?.stat4}</div>
            </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24 px-6 md:px-8">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div className="text-[11px] font-black text-[#E8622A] uppercase tracking-[0.3em] mb-4">{text.cats?.title}</div>
          <div className="text-3xl md:text-5xl font-black text-[#2D1B4E] tracking-tight">{text.cats?.sub}</div>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {(categories || []).map((c) => (
            <button key={c.key} type="button" onClick={() => router.push(`/isletmeler?c=${c.dbName}`)} className="flex flex-col items-center gap-4 transition-transform hover:-translate-y-2 cursor-pointer bg-transparent border-none outline-none">
              <div className="w-full aspect-square rounded-[32px] overflow-hidden shadow-lg border border-slate-100 flex items-center justify-center text-5xl" style={{background: c.bg}}>
                {c.emoji}
              </div>
              <div className="text-xs font-black uppercase tracking-widest text-[#2D1B4E]">{c.dbName}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}