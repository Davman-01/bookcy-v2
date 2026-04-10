"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, CheckCircle2, Calendar, Scissors, Map } from 'lucide-react';
import { useAppContext } from './providers';
import { categories, cyprusRegions } from '@/lib/constants';

export default function Home() {
  const router = useRouter();
  const { lang = 'TR', t, shops = [], globalAppointments = [] } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('All');

  const approvedShops = (shops || []).filter(s => s?.status === 'approved');
  const recommendedShops = approvedShops.filter(s => s.package === 'Premium' || s.package === 'Premium Paket').slice(0, 4);

  const handleHeroSearch = (e) => { 
    e.preventDefault(); 
    router.push(`/isletmeler?q=${searchQuery}&r=${filterRegion}`); 
  };

  const text = t?.[lang] || t?.['TR'];
  if (!text) return null;

  return (
    <div className="w-full">
      <section className="relative min-h-[90vh] bg-[#2D1B4E] overflow-hidden flex flex-col items-center justify-center pt-24 pb-20">
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")` }}></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-white/80 uppercase tracking-widest mb-8"><div className="w-2 h-2 rounded-full bg-[#E8622A]"></div>{text.hero?.eyebrow}</div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight">{text.hero?.title1} <span className="text-[#E8622A]">{text.hero?.title2}</span><br/>{text.hero?.title3} <span className="text-[#E8622A]">{text.hero?.title4}</span></h1>
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">{text.hero?.sub}</p>
          
          <form className="w-full bg-white rounded-[24px] md:rounded-[50px] p-2 md:p-3 shadow-2xl flex flex-col md:flex-row gap-2 mx-auto max-w-[800px] mb-8" onSubmit={handleHeroSearch}>
              <div className="flex-1 flex items-center bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none px-4 py-3 md:py-2 md:border-r border-slate-200"><Search size={20} className="text-slate-400 mr-3 shrink-0" /><input type="text" className="w-full bg-transparent font-bold text-sm outline-none text-[#2D1B4E]" placeholder={text.hero?.searchPlace} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
              <div className="flex-1 flex items-center bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none px-4 py-3 md:py-2"><MapPin size={20} className="text-slate-400 mr-3 shrink-0" /><select className="w-full bg-transparent font-bold text-sm outline-none text-[#2D1B4E] cursor-pointer" value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}><option value="All">{text.hero?.searchLoc}</option>{(cyprusRegions || []).map(r => <option key={r} value={r}>{r}</option>)}</select></div>
              <button type="submit" className="bg-[#E8622A] text-white rounded-[16px] md:rounded-[40px] px-8 py-4 font-black text-sm hover:bg-[#d4561f] transition-colors w-full md:w-auto border-none cursor-pointer">{text.hero?.btn}</button>
          </form>
          
          <div className="flex items-center justify-center flex-wrap gap-2 text-white/60 text-xs font-bold uppercase tracking-widest"><span className="mr-2">{text.hero?.pop}</span>{(categories || []).slice(0,4).map(c => (<button key={c.key} type="button" onClick={() => router.push(`/isletmeler?c=${c.dbName}`)} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/20 transition-colors cursor-pointer text-white">{c.emoji} {c.dbName}</button>))}</div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 border-t border-white/10 pt-10 w-full max-w-[900px] mx-auto relative z-10 px-6">
            <div className="text-center md:border-r border-white/10 last:border-0 pb-4 md:pb-0"><div className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-black text-white mb-2">{approvedShops.length}</div><div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{text.hero?.stat1}</div></div>
            <div className="text-center md:border-r border-white/10 last:border-0 pb-4 md:pb-0"><div className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-black text-white mb-2">{new Set((globalAppointments || []).map(a => a?.customer_phone)).size}</div><div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{text.hero?.stat2}</div></div>
            <div className="text-center md:border-r border-white/10 last:border-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10"><div className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-black text-white mb-2">{(globalAppointments || []).length}</div><div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{text.hero?.stat3}</div></div>
            <div className="text-center last:border-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10"><div className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-black text-white mb-2">%98</div><div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{text.hero?.stat4}</div></div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24 px-6 md:px-8 border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div><div className="text-[11px] font-black text-[#E8622A] uppercase tracking-[0.3em] mb-2">{text.cats?.title}</div><div className="text-3xl md:text-4xl font-black text-[#2D1B4E] tracking-tight">{text.cats?.sub}</div></div>
          <button className="text-[#E8622A] font-bold bg-transparent border-none cursor-pointer" onClick={()=>router.push('/isletmeler')}>{text.cats?.seeAll}</button>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {(categories || []).map((c) => (<button key={c.key} type="button" onClick={() => router.push(`/isletmeler?c=${c.dbName}`)} className="flex flex-col items-center gap-4 transition-transform hover:-translate-y-2 cursor-pointer bg-transparent border-none outline-none"><div className="w-full aspect-square rounded-[32px] overflow-hidden shadow-lg border border-slate-100 flex items-center justify-center text-5xl" style={{background: c.bg}}>{c.emoji}</div><div className="text-xs font-black uppercase tracking-widest text-[#2D1B4E]">{c.dbName}</div></button>))}
        </div>
      </section>

      {/* ÖNE ÇIKANLAR (EKSİKTİ, GERİ EKLENDİ) */}
      {recommendedShops.length > 0 && (
          <section className="bg-slate-50 py-16 md:py-24 px-6 md:px-8 border-t border-slate-200">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
              <div><div className="text-[11px] font-black text-[#E8622A] uppercase tracking-[0.3em] mb-2">{text.featured?.title}</div><div className="text-3xl md:text-4xl font-black text-[#2D1B4E] tracking-tight">{text.featured?.sub}</div></div>
              <button className="text-[#E8622A] font-bold bg-transparent border-none cursor-pointer" onClick={()=>router.push('/isletmeler')}>{text.cats?.seeAll}</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {recommendedShops.map((shop, idx) => (
                <div key={shop.id} onClick={() => router.push(`/isletmeler/${shop.id}`)} className={`flex flex-col bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer ${idx === 0 ? 'md:row-span-2' : ''}`}>
                  <div className={`w-full bg-slate-100 flex items-center justify-center text-6xl relative ${idx === 0 ? 'h-[300px]' : 'h-[200px]'}`}>{shop.cover_url || shop.logo_url ? <img loading="lazy" src={shop.cover_url || shop.logo_url} className="w-full h-full object-cover"/> : (categories.find(c=>c.dbName===shop.category)?.emoji || '💈')}{idx === 0 && <div className="absolute top-4 left-4 bg-gradient-to-r from-[#E8622A] to-orange-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full">🔥 VIP</div>}</div>
                  <div className="p-6 flex flex-col flex-1"><div className="text-[10px] font-black text-[#E8622A] tracking-widest uppercase mb-2">{shop.category}</div><div className="text-xl font-black text-[#2D1B4E] mb-3">{shop.name}</div><div className="text-sm font-bold text-slate-500 mb-6 flex items-center gap-1"><MapPin size={14}/> {shop.location}</div><button className="mt-auto w-full bg-[#2D1B4E] text-white font-black py-4 rounded-xl uppercase text-xs hover:bg-[#E8622A] transition-colors border-none cursor-pointer">Randevu Al →</button></div>
                </div>
              ))}
            </div>
          </section>
      )}

      {/* NASIL ÇALIŞIR BÖLÜMÜ (EKSİKTİ, GERİ EKLENDİ) */}
      <section className="bg-white py-16 md:py-24 px-6 md:px-8 border-t border-slate-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-[#E8622A] font-black text-sm tracking-widest uppercase mb-4">{text.how?.title}</div>
          <div className="text-3xl md:text-5xl font-black text-[#2D1B4E] mb-12 md:mb-16 tracking-tight">{text.how?.sub}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-slate-100 z-0"></div>
            <div className="relative z-10 flex flex-col items-center"><div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm relative">🔍<div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white">1</div></div><div className="text-lg font-black text-[#2D1B4E] mb-2">{text.how?.s1}</div><div className="text-sm text-slate-500 font-medium px-4">{text.how?.d1}</div></div>
            <div className="relative z-10 flex flex-col items-center"><div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm relative">📅<div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white">2</div></div><div className="text-lg font-black text-[#2D1B4E] mb-2">{text.how?.s2}</div><div className="text-sm text-slate-500 font-medium px-4">{text.how?.d2}</div></div>
            <div className="relative z-10 flex flex-col items-center"><div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm relative">✅<div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white">3</div></div><div className="text-lg font-black text-[#2D1B4E] mb-2">{text.how?.s3}</div><div className="text-sm text-slate-500 font-medium px-4">{text.how?.d3}</div></div>
            <div className="relative z-10 flex flex-col items-center"><div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm relative">✨<div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white">4</div></div><div className="text-lg font-black text-[#2D1B4E] mb-2">{text.how?.s4}</div><div className="text-sm text-slate-500 font-medium px-4">{text.how?.d4}</div></div>
          </div>
        </div>
      </section>
    </div>
  );
}