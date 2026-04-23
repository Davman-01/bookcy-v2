"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, CheckCircle2, Calendar, Scissors, ChevronRight } from 'lucide-react';
import { useAppContext } from './providers';
import { categories, cyprusRegions } from '../lib/constants';

const getCategoryImage = (name) => {
  const lowerName = name?.toLowerCase() || '';
  if (lowerName.includes('vet') || lowerName.includes('veteriner')) return 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=800&auto=format&fit=crop';
  if (lowerName.includes('pet') || lowerName.includes('köpek') || lowerName.includes('kedi')) return 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&auto=format&fit=crop';
  if (lowerName.includes('tırnak') || lowerName.includes('nail') || lowerName.includes('manikür') || lowerName.includes('bakım') || lowerName.includes('güzellik')) return 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop';
  if (lowerName.includes('kuaför') || lowerName.includes('hair') || lowerName.includes('saç')) return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop';
  if (lowerName.includes('berber') || lowerName.includes('barber') || lowerName.includes('erkek')) return 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop';
  if (lowerName.includes('bar') || lowerName.includes('pub') || lowerName.includes('club') || lowerName.includes('loca')) return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800&auto=format&fit=crop';
  if (lowerName.includes('dövme') || lowerName.includes('tattoo')) return 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=800&auto=format&fit=crop';
  if (lowerName.includes('spa') || lowerName.includes('masaj')) return 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop';
  if (lowerName.includes('klinik') || lowerName.includes('diş') || lowerName.includes('sağlık')) return 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop';
  return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop'; 
};

export default function Home() {
  const router = useRouter();
  const { lang = 'TR', t, shops = [], globalAppointments = [] } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('All');
  
  const approvedShops = (shops || []).filter(s => s?.status === 'approved');
  
  const recommendedShops = [...approvedShops].sort((a, b) => {
    const aVip = a.package === 'Premium' || a.package === 'Premium Paket';
    const bVip = b.package === 'Premium' || b.package === 'Premium Paket';
    if (aVip && !bVip) return -1;
    if (!aVip && bVip) return 1;
    return 0;
  }).slice(0, 6); 

  const handleHeroSearch = (e) => { 
    e.preventDefault(); 
    router.push(`/isletmeler?q=${searchQuery}&r=${filterRegion}`); 
  };

  const currentLang = t?.[lang] ? lang : 'TR';
  const text = t?.[currentLang];
  if (!text) return null;

  return (
    <div className="w-full">
      {/* HERO BÖLÜMÜ */}
      <section className="relative min-h-[100dvh] pt-[100px] w-full overflow-hidden flex flex-col items-center justify-between bg-[#1a0f2e]">
        
        {/* KENDİ VİDEON */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 pointer-events-none"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B4E]/80 via-[#2D1B4E]/60 to-[#2D1B4E]/95 z-10 pointer-events-none"></div>

        <div 
          className="absolute inset-0 pointer-events-none opacity-30 z-10 mix-blend-overlay" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")` }}
        ></div>
        
        {/* ANA İÇERİK - PUNTO VE BOŞLUKLAR KÜÇÜLTÜLDÜ */}
        <div className="relative z-20 flex flex-col items-center justify-center flex-1 w-full max-w-[800px] mx-auto px-4 py-6 md:py-10 text-center">
          
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-[9px] md:text-[10px] font-bold text-white/90 uppercase tracking-widest mb-4 backdrop-blur-md shadow-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E8622A] animate-pulse"></div>
            {text.hero?.eyebrow}
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-[52px] font-black text-white tracking-tight mb-3 md:mb-4 leading-[1.1] drop-shadow-xl">
            {text.hero?.title1} <span className="text-[#E8622A]">{text.hero?.title2}</span><br/>
            {text.hero?.title3} <span className="text-[#E8622A]">{text.hero?.title4}</span>
          </h1>
          
          <p className="text-xs md:text-base text-white/80 mb-6 md:mb-8 max-w-xl mx-auto font-medium drop-shadow-md px-4 leading-relaxed">{text.hero?.sub}</p>
          
          {/* ARAMA KUTUSU İNCELTİLDİ */}
          <form className="w-full bg-white rounded-[20px] md:rounded-[40px] p-1.5 shadow-2xl flex flex-col md:flex-row gap-1 mx-auto max-w-[700px] mb-6 relative z-30" onSubmit={handleHeroSearch}>
              <div className="flex-1 flex items-center bg-slate-50 md:bg-transparent rounded-[16px] md:rounded-none px-4 py-2.5 md:py-3 md:border-r border-slate-200">
                  <Search size={18} className="text-slate-400 mr-2 shrink-0" />
                  <input type="text" className="w-full bg-transparent font-bold text-xs md:text-sm outline-none text-[#2D1B4E]" placeholder={text.hero?.searchPlace} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex-1 flex items-center bg-slate-50 md:bg-transparent rounded-[16px] md:rounded-none px-4 py-2.5 md:py-3">
                  <MapPin size={18} className="text-slate-400 mr-2 shrink-0" />
                  <select className="w-full bg-transparent font-bold text-xs md:text-sm outline-none text-[#2D1B4E] cursor-pointer appearance-none" value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
                      <option value="All">{text.hero?.searchLoc}</option>
                      {(cyprusRegions || []).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
              </div>
              <button type="submit" className="bg-[#E8622A] text-white rounded-[14px] md:rounded-[32px] px-6 py-3 font-black text-xs md:text-sm hover:bg-[#d4561f] transition-colors w-full md:w-auto border-none cursor-pointer uppercase tracking-wider shadow-lg hover:-translate-y-0.5">
                {text.hero?.btn}
              </button>
          </form>
          
          {/* POPÜLER ARAMALAR */}
          <div className="flex items-center justify-center flex-wrap gap-2 text-white/80 text-[9px] md:text-[10px] font-bold uppercase tracking-widest hidden md:flex">
             <span className="mr-1 drop-shadow-md">{text.hero?.pop}</span>
             {(categories || []).slice(0,4).map((c, idx) => (
               <button 
                 key={c.dbName || idx} 
                 type="button" 
                 onClick={() => router.push(`/isletmeler?c=${c.dbName}`)} 
                 className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 transition-all cursor-pointer text-white font-bold hover:-translate-y-0.5"
               >
                 <span className="drop-shadow-md">{c.dbName}</span>
               </button>
             ))}
          </div>
        </div>
        
        {/* İSTATİSTİKLER - SİMGELER VE YAZILAR KÜÇÜLTÜLDÜ */}
        <div className="w-full relative z-20 px-4 pb-6 md:pb-8 mt-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 border-t border-white/10 pt-4 md:pt-6 max-w-[800px] mx-auto backdrop-blur-sm bg-white/5 rounded-[24px] pb-4 md:pb-6 px-4 md:px-6">
              <div className="text-center md:border-r border-white/10 last:border-0">
                <div className="text-xl md:text-3xl font-black text-white mb-0.5 drop-shadow-lg">{approvedShops.length}</div>
                <div className="text-[8px] md:text-[9px] font-bold text-white/70 uppercase tracking-widest">{text.hero?.stat1}</div>
              </div>
              <div className="text-center md:border-r border-white/10 last:border-0">
                <div className="text-xl md:text-3xl font-black text-white mb-0.5 drop-shadow-lg">{new Set((globalAppointments || []).map(a => a?.customer_phone)).size}</div>
                <div className="text-[8px] md:text-[9px] font-bold text-white/70 uppercase tracking-widest">{text.hero?.stat2}</div>
              </div>
              <div className="text-center md:border-r border-white/10 last:border-0">
                <div className="text-xl md:text-3xl font-black text-white mb-0.5 drop-shadow-lg">{(globalAppointments || []).length}</div>
                <div className="text-[8px] md:text-[9px] font-bold text-white/70 uppercase tracking-widest">{text.hero?.stat3}</div>
              </div>
              <div className="text-center last:border-0">
                <div className="text-xl md:text-3xl font-black text-white mb-0.5 drop-shadow-lg">%98</div>
                <div className="text-[8px] md:text-[9px] font-bold text-white/70 uppercase tracking-widest">{text.hero?.stat4}</div>
              </div>
          </div>
        </div>
      </section>

      {/* YENİ KATEGORİLER BÖLÜMÜ - YATAY VE DAHA İNCE KARTLAR */}
      <section className="bg-slate-50 py-12 md:py-16 px-4 md:px-8 border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="text-[10px] font-black text-[#E8622A] uppercase tracking-[0.3em] mb-1.5">{text.cats?.title}</div>
            <div className="text-2xl md:text-3xl font-black text-[#2D1B4E] tracking-tight">{text.cats?.sub}</div>
          </div>
          <button className="text-[#E8622A] font-bold bg-transparent border-none cursor-pointer hover:underline uppercase text-xs tracking-wider" onClick={() => router.push('/isletmeler')}>
            {text.cats?.seeAll} →
          </button>
        </div>

        {/* KART YÜKSEKLİKLERİ VE RESİM GENİŞLİKLERİ KÜÇÜLTÜLDÜ (h-[80px]) */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {(categories || []).map((c, idx) => (
            <button 
              key={c.dbName || idx} 
              type="button" 
              onClick={() => router.push(`/isletmeler?c=${c.dbName}`)} 
              className="group relative w-full flex items-center bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-slate-200 cursor-pointer text-left h-[80px] md:h-[90px]"
            >
              {/* Fotoğraf daha dar yapıldı */}
              <div className="w-[80px] md:w-[100px] h-full relative overflow-hidden bg-[#111] shrink-0">
                <img 
                  src={c.image || getCategoryImage(c.dbName)} 
                  alt={c.dbName} 
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1 px-4 py-2 flex flex-col justify-center bg-white z-10">
                <span className="text-[#2D1B4E] font-black uppercase tracking-widest text-[11px] md:text-xs leading-tight group-hover:text-[#E8622A] transition-colors line-clamp-2">
                  {c.dbName}
                </span>
                <span className="w-4 h-1 bg-slate-200 mt-1.5 rounded-full transition-all duration-300 group-hover:w-8 group-hover:bg-[#E8622A]"></span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ÖNE ÇIKANLAR BÖLÜMÜ - KARTLAR ZARİFLEŞTİRİLDİ */}
      {recommendedShops.length > 0 && (
          <section className="bg-white py-12 md:py-16 px-4 md:px-8 border-t border-slate-200">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <div className="text-[10px] font-black text-[#E8622A] uppercase tracking-[0.3em] mb-1.5">{text.featured?.title}</div>
                <div className="text-2xl md:text-3xl font-black text-[#2D1B4E] tracking-tight">{text.featured?.sub}</div>
              </div>
              <button className="text-[#E8622A] font-bold bg-transparent border-none cursor-pointer hover:underline uppercase text-xs tracking-wider" onClick={()=>router.push('/isletmeler')}>
                Tümünü Gör →
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
              {recommendedShops.map((shop) => {
                const isVip = shop.package === 'Premium' || shop.package === 'Premium Paket';

                return (
                <div 
                  key={shop.id} 
                  onClick={() => router.push(`/isletmeler/${shop.id}`)} 
                  className="group flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer h-auto sm:h-[160px]"
                >
                  {/* Resim alanı küçültüldü */}
                  <div className="w-full sm:w-[180px] md:w-[200px] h-[160px] sm:h-full relative bg-[#111] overflow-hidden shrink-0">
                    {shop.cover_url || shop.logo_url ? (
                      <img loading="lazy" src={shop.cover_url || shop.logo_url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500"/>
                    ) : (
                      <img loading="lazy" src={getCategoryImage(shop.category)} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                    )}
                    
                    {isVip && (
                      <div className="absolute top-3 left-3 bg-[#E8622A] text-white text-[9px] font-black px-2.5 py-1 rounded-md shadow-sm uppercase tracking-widest">
                        🔥 VIP
                      </div>
                    )}
                  </div>

                  {/* İçerik ve Buton alanı küçültüldü */}
                  <div className="p-4 md:p-5 flex flex-col flex-1 justify-center relative bg-white">
                    <div className="text-[9px] font-black text-[#E8622A] tracking-widest uppercase mb-1">{shop.category}</div>
                    <div className="text-lg md:text-xl font-black text-[#2D1B4E] mb-1 line-clamp-1">{shop.name}</div>
                    <div className="text-xs font-bold text-slate-500 mb-4 flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-400 shrink-0"/> 
                      <span className="truncate">{shop.location}</span>
                    </div>
                    
                    <button className="mt-auto sm:mt-0 w-full sm:w-fit bg-slate-50 text-[#2D1B4E] font-black py-2.5 px-4 rounded-lg uppercase text-[10px] md:text-xs group-hover:bg-[#E8622A] group-hover:text-white transition-colors border border-slate-200 group-hover:border-[#E8622A] cursor-pointer tracking-widest flex items-center justify-center gap-1.5">
                      Randevu Al <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )})}
            </div>
          </section>
      )}

      {/* NASIL ÇALIŞIR BÖLÜMÜ - İKONLAR VE YAZILAR KÜÇÜLTÜLDÜ */}
      <section className="bg-slate-50 py-12 md:py-16 px-4 md:px-8 border-t border-slate-200">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-[#E8622A] font-black text-[10px] md:text-xs tracking-widest uppercase mb-2">{text.how?.title}</div>
          <div className="text-2xl md:text-3xl font-black text-[#2D1B4E] mb-10 md:mb-12 tracking-tight">{text.how?.sub}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] bg-slate-200 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-[#2D1B4E] mb-4 shadow-sm relative transition-transform hover:scale-105">
                <Search size={24} strokeWidth={1.5}/>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">1</div>
              </div>
              <div className="text-base font-black text-[#2D1B4E] mb-1">{text.how?.s1}</div>
              <div className="text-xs text-slate-500 font-medium px-2">{text.how?.d1}</div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-[#2D1B4E] mb-4 shadow-sm relative transition-transform hover:scale-105">
                <Calendar size={24} strokeWidth={1.5}/>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">2</div>
              </div>
              <div className="text-base font-black text-[#2D1B4E] mb-1">{text.how?.s2}</div>
              <div className="text-xs text-slate-500 font-medium px-2">{text.how?.d2}</div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-[#2D1B4E] mb-4 shadow-sm relative transition-transform hover:scale-105">
                <CheckCircle2 size={24} strokeWidth={1.5}/>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">3</div>
              </div>
              <div className="text-base font-black text-[#2D1B4E] mb-1">{text.how?.s3}</div>
              <div className="text-xs text-slate-500 font-medium px-2">{text.how?.d3}</div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-[#2D1B4E] mb-4 shadow-sm relative transition-transform hover:scale-105">
                <Scissors size={24} strokeWidth={1.5}/>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">4</div>
              </div>
              <div className="text-base font-black text-[#2D1B4E] mb-1">{text.how?.s4}</div>
              <div className="text-xs text-slate-500 font-medium px-2">{text.how?.d4}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}