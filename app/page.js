"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, CheckCircle2, Calendar, Scissors } from 'lucide-react';
import { useAppContext } from './providers';
import { categories, cyprusRegions } from '../lib/constants';

// --- KATEGORİLER İÇİN OTOMATİK KURUMSAL FOTOĞRAF ATAYICI ---
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
  
  // ÖNE ÇIKANLAR MANTIĞI: Ücretsizleri de dahil ediyoruz.
  // VIP/Premium olanları en üste alıyoruz, sonra ücretsizleri dizip ilk 4 veya 6 tanesini gösteriyoruz.
  const recommendedShops = [...approvedShops].sort((a, b) => {
    const aVip = a.package === 'Premium' || a.package === 'Premium Paket';
    const bVip = b.package === 'Premium' || b.package === 'Premium Paket';
    if (aVip && !bVip) return -1;
    if (!aVip && bVip) return 1;
    return 0;
  }).slice(0, 6); // Ekranda şık durması için 4 veya 6 tane alabilirsin, 6 ideal.

  const handleHeroSearch = (e) => { 
    e.preventDefault(); 
    router.push(`/isletmeler?q=${searchQuery}&r=${filterRegion}`); 
  };

  const currentLang = t?.[lang] ? lang : 'TR';
  const text = t?.[currentLang];
  if (!text) return null;

  return (
    <div className="w-full">
      {/* HERO BÖLÜMÜ - %100 EKRAN İÇİN ORANTILAR DÜZELTİLDİ VE YEREL VİDEO EKLENDİ */}
      <section className="relative min-h-[100dvh] pt-[120px] w-full overflow-hidden flex flex-col items-center justify-between bg-[#1a0f2e]">
        
        {/* 1. KENDİ ÜRETTİĞİN VİDEO (hero-bg.mp4) */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 pointer-events-none"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* 2. MOR KARARTMA OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2D1B4E]/80 via-[#2D1B4E]/60 to-[#2D1B4E]/95 z-10 pointer-events-none"></div>

        {/* 3. KUMLANMA (NOISE) EFEKTİ */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 z-10 mix-blend-overlay" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")` }}
        ></div>
        
        {/* 4. ANA İÇERİK */}
        <div className="relative z-20 flex flex-col items-center justify-center flex-1 w-full max-w-[850px] mx-auto px-4 py-8 md:py-16 text-center">
          
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 text-[10px] md:text-xs font-bold text-white/90 uppercase tracking-widest mb-4 md:mb-8 backdrop-blur-md shadow-lg">
            <div className="w-2 h-2 rounded-full bg-[#E8622A] animate-pulse"></div>
            {text.hero?.eyebrow}
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-[68px] font-black text-white tracking-tight mb-3 md:mb-6 leading-[1.1] drop-shadow-xl">
            {text.hero?.title1} <span className="text-[#E8622A]">{text.hero?.title2}</span><br/>
            {text.hero?.title3} <span className="text-[#E8622A]">{text.hero?.title4}</span>
          </h1>
          
          <p className="text-xs md:text-lg text-white/80 mb-6 md:mb-12 max-w-2xl mx-auto font-medium drop-shadow-md px-4 leading-relaxed">{text.hero?.sub}</p>
          
          <form className="w-full bg-white rounded-[24px] md:rounded-[50px] p-1.5 md:p-2 shadow-2xl flex flex-col md:flex-row gap-2 mx-auto max-w-[800px] mb-6 md:mb-10 relative z-30" onSubmit={handleHeroSearch}>
              <div className="flex-1 flex items-center bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none px-4 py-3 md:py-4 md:border-r border-slate-200">
                  <Search size={22} className="text-slate-400 mr-3 shrink-0" />
                  <input type="text" className="w-full bg-transparent font-bold text-sm md:text-base outline-none text-[#2D1B4E]" placeholder={text.hero?.searchPlace} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex-1 flex items-center bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none px-4 py-3 md:py-4">
                  <MapPin size={22} className="text-slate-400 mr-3 shrink-0" />
                  <select className="w-full bg-transparent font-bold text-sm md:text-base outline-none text-[#2D1B4E] cursor-pointer appearance-none" value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
                      <option value="All">{text.hero?.searchLoc}</option>
                      {(cyprusRegions || []).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
              </div>
              <button type="submit" className="bg-[#E8622A] text-white rounded-[16px] md:rounded-[40px] px-8 py-3.5 md:py-4 font-black text-sm md:text-base hover:bg-[#d4561f] transition-colors w-full md:w-auto border-none cursor-pointer uppercase tracking-wider shadow-lg hover:-translate-y-1">
                {text.hero?.btn}
              </button>
          </form>
          
          <div className="flex items-center justify-center flex-wrap gap-2 text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-widest hidden md:flex">
             <span className="mr-2 drop-shadow-md">{text.hero?.pop}</span>
             {(categories || []).slice(0,4).map(c => (
               <button 
                 key={c.key} 
                 type="button" 
                 onClick={() => router.push(`/isletmeler?c=${c.dbName}`)} 
                 className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 transition-all cursor-pointer text-white font-bold hover:-translate-y-0.5"
               >
                 <span className="drop-shadow-md">{c.dbName}</span>
               </button>
             ))}
          </div>
        </div>
        
        {/* İSTATİSTİKLER */}
        <div className="w-full relative z-20 px-4 pb-6 md:pb-12 mt-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-white/10 pt-4 md:pt-8 max-w-[900px] mx-auto backdrop-blur-sm bg-white/5 rounded-[32px] pb-4 md:pb-8 px-4 md:px-8">
              <div className="text-center md:border-r border-white/10 last:border-0">
                <div className="text-2xl md:text-4xl font-black text-white mb-1 drop-shadow-lg">{approvedShops.length}</div>
                <div className="text-[9px] md:text-[11px] font-bold text-white/70 uppercase tracking-widest">{text.hero?.stat1}</div>
              </div>
              <div className="text-center md:border-r border-white/10 last:border-0">
                <div className="text-2xl md:text-4xl font-black text-white mb-1 drop-shadow-lg">{new Set((globalAppointments || []).map(a => a?.customer_phone)).size}</div>
                <div className="text-[9px] md:text-[11px] font-bold text-white/70 uppercase tracking-widest">{text.hero?.stat2}</div>
              </div>
              <div className="text-center md:border-r border-white/10 last:border-0">
                <div className="text-2xl md:text-4xl font-black text-white mb-1 drop-shadow-lg">{(globalAppointments || []).length}</div>
                <div className="text-[9px] md:text-[11px] font-bold text-white/70 uppercase tracking-widest">{text.hero?.stat3}</div>
              </div>
              <div className="text-center last:border-0">
                <div className="text-2xl md:text-4xl font-black text-white mb-1 drop-shadow-lg">%98</div>
                <div className="text-[9px] md:text-[11px] font-bold text-white/70 uppercase tracking-widest">{text.hero?.stat4}</div>
              </div>
          </div>
        </div>
      </section>

      {/* YENİ KATEGORİLER BÖLÜMÜ - YATAY (HORIZONTAL) KARTLAR */}
      <section className="bg-slate-50 py-16 md:py-24 px-6 md:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <div className="text-[11px] font-black text-[#E8622A] uppercase tracking-[0.3em] mb-2">{text.cats?.title}</div>
            <div className="text-3xl md:text-4xl font-black text-[#2D1B4E] tracking-tight">{text.cats?.sub}</div>
          </div>
          <button className="text-[#E8622A] font-bold bg-transparent border-none cursor-pointer hover:underline uppercase text-sm tracking-wider" onClick={() => router.push('/isletmeler')}>
            {text.cats?.seeAll} →
          </button>
        </div>

        {/* Yatay Kategoriler Grid Yapısı */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {(categories || []).map((c) => (
            <button 
              key={c.key} 
              type="button" 
              onClick={() => router.push(`/isletmeler?c=${c.dbName}`)} 
              className="group relative w-full flex items-center bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200 cursor-pointer text-left h-[100px] md:h-[120px]"
            >
              {/* Sol Taraf: Fotoğraf */}
              <div className="w-1/3 h-full relative overflow-hidden bg-[#111]">
                <img 
                  src={c.image || getCategoryImage(c.dbName)} 
                  alt={c.dbName} 
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              {/* Sağ Taraf: Metin */}
              <div className="flex-1 p-5 flex flex-col justify-center bg-white z-10">
                <span className="text-[#2D1B4E] font-black uppercase tracking-widest text-sm md:text-base leading-tight group-hover:text-[#E8622A] transition-colors">
                  {c.dbName}
                </span>
                {/* Turuncu Çizgi Efekti */}
                <span className="w-6 h-1 bg-slate-200 mt-2 rounded-full transition-all duration-300 group-hover:w-12 group-hover:bg-[#E8622A]"></span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ÖNE ÇIKANLAR BÖLÜMÜ - YATAY (HORIZONTAL) KARTLAR VE ÜCRETSİZ PAKET DAHİL */}
      {recommendedShops.length > 0 && (
          <section className="bg-white py-16 md:py-24 px-6 md:px-8 border-t border-slate-200">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <div className="text-[11px] font-black text-[#E8622A] uppercase tracking-[0.3em] mb-2">{text.featured?.title}</div>
                <div className="text-3xl md:text-4xl font-black text-[#2D1B4E] tracking-tight">{text.featured?.sub}</div>
              </div>
              <button className="text-[#E8622A] font-bold bg-transparent border-none cursor-pointer hover:underline uppercase text-sm tracking-wider" onClick={()=>router.push('/isletmeler')}>
                Tümünü Gör →
              </button>
            </div>

            {/* Yatay İşletme Kartları Grid Yapısı */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
              {recommendedShops.map((shop) => {
                const isVip = shop.package === 'Premium' || shop.package === 'Premium Paket';

                return (
                <div 
                  key={shop.id} 
                  onClick={() => router.push(`/isletmeler/${shop.id}`)} 
                  className="group flex flex-col sm:flex-row bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                >
                  {/* Sol Taraf: Fotoğraf Alanı */}
                  <div className="w-full sm:w-2/5 md:w-1/3 h-[200px] sm:h-auto relative bg-[#111] overflow-hidden shrink-0">
                    {shop.cover_url || shop.logo_url ? (
                      <img loading="lazy" src={shop.cover_url || shop.logo_url} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500"/>
                    ) : (
                      <img loading="lazy" src={getCategoryImage(shop.category)} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                    )}
                    
                    {/* Yalnızca Premiumlara VIP rozeti */}
                    {isVip && (
                      <div className="absolute top-4 left-4 bg-[#E8622A] text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-widest">
                        🔥 VIP
                      </div>
                    )}
                  </div>

                  {/* Sağ Taraf: Bilgi ve Buton Alanı */}
                  <div className="p-6 flex flex-col flex-1 justify-center relative bg-white">
                    <div className="text-[10px] font-black text-[#E8622A] tracking-widest uppercase mb-2">{shop.category}</div>
                    <div className="text-xl md:text-2xl font-black text-[#2D1B4E] mb-2">{shop.name}</div>
                    <div className="text-sm font-bold text-slate-500 mb-6 flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400 shrink-0"/> 
                      <span className="truncate">{shop.location}</span>
                    </div>
                    
                    <button className="mt-auto sm:mt-0 w-full sm:w-fit bg-slate-50 text-[#2D1B4E] font-black py-3 px-6 rounded-xl uppercase text-xs group-hover:bg-[#E8622A] group-hover:text-white transition-colors border border-slate-200 group-hover:border-[#E8622A] cursor-pointer tracking-widest flex items-center justify-center gap-2">
                      Randevu Al <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )})}
            </div>
          </section>
      )}

      {/* NASIL ÇALIŞIR BÖLÜMÜ */}
      <section className="bg-slate-50 py-16 md:py-24 px-6 md:px-8 border-t border-slate-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-[#E8622A] font-black text-sm tracking-widest uppercase mb-4">{text.how?.title}</div>
          <div className="text-3xl md:text-5xl font-black text-[#2D1B4E] mb-12 md:mb-16 tracking-tight">{text.how?.sub}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-slate-200 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white border border-slate-200 rounded-3xl flex items-center justify-center text-[#2D1B4E] mb-6 shadow-sm relative transition-transform hover:scale-110">
                <Search size={32} strokeWidth={1.5}/>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white shadow-md">1</div>
              </div>
              <div className="text-lg font-black text-[#2D1B4E] mb-2">{text.how?.s1}</div>
              <div className="text-sm text-slate-500 font-medium px-4">{text.how?.d1}</div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white border border-slate-200 rounded-3xl flex items-center justify-center text-[#2D1B4E] mb-6 shadow-sm relative transition-transform hover:scale-110">
                <Calendar size={32} strokeWidth={1.5}/>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white shadow-md">2</div>
              </div>
              <div className="text-lg font-black text-[#2D1B4E] mb-2">{text.how?.s2}</div>
              <div className="text-sm text-slate-500 font-medium px-4">{text.how?.d2}</div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white border border-slate-200 rounded-3xl flex items-center justify-center text-[#2D1B4E] mb-6 shadow-sm relative transition-transform hover:scale-110">
                <CheckCircle2 size={32} strokeWidth={1.5}/>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white shadow-md">3</div>
              </div>
              <div className="text-lg font-black text-[#2D1B4E] mb-2">{text.how?.s3}</div>
              <div className="text-sm text-slate-500 font-medium px-4">{text.how?.d3}</div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white border border-slate-200 rounded-3xl flex items-center justify-center text-[#2D1B4E] mb-6 shadow-sm relative transition-transform hover:scale-110">
                <Scissors size={32} strokeWidth={1.5}/>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white shadow-md">4</div>
              </div>
              <div className="text-lg font-black text-[#2D1B4E] mb-2">{text.how?.s4}</div>
              <div className="text-sm text-slate-500 font-medium px-4">{text.how?.d4}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}