"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, ChevronLeft, Gem, X } from 'lucide-react'; // X ikonunu ekledik
import { useAppContext } from '../providers';
import { categories, cyprusRegions } from '../../lib/constants';
import TattooBriefForm from '@/components/TattooBriefForm';

function ShopList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { lang = 'TR', t, shops = [] } = useAppContext();
  
  const text = t?.[lang]?.shops || {
    back: "GERİ DÖN", title: "Arama Sonuçları", found: "Mekan Bulundu", search: "Mekan Ara...", allReg: "Tüm Bölgeler", allCat: "Tüm Kategoriler", select: "SEÇ", empty: "Aradığınız kriterlere uygun mekan bulunamadı."
  };

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filterRegion, setFilterRegion] = useState(searchParams.get('r') || 'All');
  const [filterService, setFilterService] = useState(searchParams.get('c') || 'All');
  
  // AÇILIR PENCERE (MODAL) İÇİN YENİ STATE EKLEDİK
  const [isTattooModalOpen, setIsTattooModalOpen] = useState(false);

  const approvedShops = (shops || []).filter(s => s?.status === 'approved');

  const displayShops = approvedShops.filter(shop => {
      const matchRegion = filterRegion === 'All' || (shop.location && shop.location.toLowerCase().includes(filterRegion.toLowerCase()));
      const matchService = filterService === 'All' || shop.category === filterService;
      const matchSearch = shop.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRegion && matchService && matchSearch;
  });

  const sortedShops = [...displayShops].sort((a, b) => {
      if ((a.package === 'Premium' || a.package === 'Premium Paket') && (b.package !== 'Premium' && b.package !== 'Premium Paket')) return -1;
      if ((a.package !== 'Premium' && a.package !== 'Premium Paket') && (b.package === 'Premium' || b.package === 'Premium Paket')) return 1;
      return 0;
  });

  return (
    <div className="w-full max-w-[1400px] mx-auto pt-10 md:pt-24 px-6 md:px-8 pb-20 min-h-screen">
      <button onClick={() => router.push('/')} className="flex items-center text-slate-400 hover:text-[#E8622A] mb-8 text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none cursor-pointer transition-colors"><ChevronLeft size={16} className="mr-2"/> {text.back}</button>
      
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 border-b border-slate-200 pb-4 gap-4">
        <h2 className="text-2xl md:text-3xl font-black uppercase text-[#2D1B4E] tracking-tight">{text.title}</h2>
        <div className="flex items-center gap-3">
          {/* DÖVME TEST BUTONU EKLENDİ */}
          <button 
            onClick={() => setIsTattooModalOpen(true)} 
            className="text-sm font-bold text-white bg-[#2D1B4E] hover:bg-[#E8622A] px-4 py-2 rounded-xl transition-colors shadow-md"
          >
            🎨 Dövme Formunu Test Et
          </button>
          <span className="text-sm font-bold text-[#E8622A] bg-orange-50 px-4 py-2 rounded-xl w-fit">{sortedShops.length} {text.found}</span>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-[320px] bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
            <input type="text" placeholder={text.search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A] transition-colors" />
            <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A] transition-colors cursor-pointer"><option value="All">{text.allReg}</option>{cyprusRegions.map(r => <option key={r} value={r}>{r}</option>)}</select>
            <select value={filterService} onChange={(e) => setFilterService(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A] transition-colors cursor-pointer"><option value="All">{text.allCat}</option>{categories.map(c => <option key={c.dbName} value={c.dbName}>{c.dbName}</option>)}</select>
        </aside>
        
        <div className="flex-1 w-full flex flex-col gap-5">
            {sortedShops.map((shop) => (
                <div key={shop.id} onClick={() => router.push(`/isletmeler/${shop.id}`)} className="flex flex-col sm:flex-row items-center p-6 bg-white border border-slate-200 hover:border-[#E8622A] rounded-[32px] cursor-pointer transition-all shadow-sm hover:shadow-md">
                    <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center text-xs font-black text-[#E8622A] relative">{(shop.package === 'Premium Paket' || shop.package === 'Premium') && <div className="absolute inset-0 border-4 border-yellow-400 rounded-2xl"></div>}{shop.logo_url ? <img loading="lazy" src={shop.logo_url} className="w-full h-full object-cover" /> : (categories.find(c=>c.dbName===shop.category)?.emoji || '💈')}</div>
                    <div className="flex-1 sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left"><div className="flex items-center justify-center sm:justify-start gap-2 mb-2"><h3 className="text-xl font-black uppercase text-[#2D1B4E]">{shop.name}</h3>{(shop.package === 'Premium Paket' || shop.package === 'Premium') && <Gem size={16} className="text-yellow-500 fill-yellow-500"/>}</div><div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest"><span className="bg-slate-100 px-3 py-1.5 rounded-lg">{shop.category}</span><span className="flex items-center gap-1"><MapPin size={12}/> {shop.location}</span></div></div>
                    <button className="mt-6 sm:mt-0 w-full sm:w-auto btn-primary border-none cursor-pointer px-8 py-4 sm:py-3 text-center justify-center">{text.select}</button>
                </div>
            ))}
            {sortedShops.length === 0 && <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest bg-white rounded-[32px] border border-slate-200">{text.empty}</div>}
        </div>
      </div>

      {/* DÖVME FORMU MODALI (AÇILIR PENCERE) */}
      {isTattooModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backdropFilter: 'blur(5px)' }}>
          <div className="relative w-full max-w-lg mt-10 mb-10">
            <button 
              onClick={() => setIsTattooModalOpen(false)} 
              className="absolute -top-12 right-0 text-white hover:text-[#E8622A] flex items-center gap-2 font-bold transition-colors cursor-pointer"
            >
              <X size={24} /> Kapat
            </button>
            <TattooBriefForm />
          </div>
        </div>
      )}

    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold text-slate-400 tracking-widest uppercase">Yükleniyor...</div>}>
      <ShopList />
    </Suspense>
  );
}