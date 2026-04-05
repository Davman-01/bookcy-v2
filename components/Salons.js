"use client";
import { useState } from 'react';
import { MapPin, Star, Search, Crown } from 'lucide-react';

export default function Salons() {
  const [filterRegion, setFilterRegion] = useState('Tümü');

  const allSalons = [
    { id: 1, name: "Glow & Glamour", category: "Kadın Kuaför", location: "Girne", rating: "4.9", isPremium: true, image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500" },
    { id: 2, name: "The Gentleman", category: "Erkek Berber", location: "Lefkoşa", rating: "4.8", isPremium: false, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500" },
    { id: 3, name: "Zen Spa", category: "Masaj & Spa", location: "Gazimağusa", rating: "5.0", isPremium: true, image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500" },
  ];

  // ÖNCE PREMİUMLARI SIRALA (Ajanda Madde 19)
  const filteredSalons = allSalons
    .filter(s => filterRegion === 'Tümü' || s.location === filterRegion)
    .sort((a, b) => (b.isPremium === a.isPremium ? 0 : b.isPremium ? 1 : -1));

  return (
    <section id="mekanlar" className="w-full px-6 md:px-12 py-24 bg-[#FAF7F2] dark:bg-[#120b1e] scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black text-[#2D1B4E] dark:text-white uppercase mb-2 tracking-tighter">Mekanları Keşfet</h2>
            <p className="text-slate-500 font-bold">Kuzey Kıbrıs'ın en iyileri en üstte.</p>
          </div>
          
          {/* FİLTRELEME ALANI (Ajanda Madde 20) */}
          <div className="flex bg-white dark:bg-white/5 p-2 rounded-2xl border border-slate-200 dark:border-white/10 gap-2">
             {['Tümü', 'Lefkoşa', 'Girne', 'Gazimağusa'].map(region => (
               <button 
                 key={region}
                 onClick={() => setFilterRegion(region)}
                 className={`px-6 py-2 rounded-xl font-bold text-xs transition-all ${filterRegion === region ? 'bg-[#2D1B4E] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
               >
                 {region}
               </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredSalons.map((salon) => (
            <div key={salon.id} className={`relative bg-white dark:bg-white/5 rounded-[32px] overflow-hidden border-2 transition-all duration-500 hover:-translate-y-2 ${salon.isPremium ? 'border-[#FFD700] ring-8 ring-[#FFD700]/5 shadow-2xl shadow-[#FFD700]/10' : 'border-slate-100 dark:border-white/5'}`}>
              {salon.isPremium && (
                <div className="absolute top-5 left-5 z-20 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-[#2D1B4E] text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-1 shadow-xl">
                  <Crown size={12} fill="currentColor" /> PREMIUM VIP
                </div>
              )}
              <div className="h-64 overflow-hidden">
                <img src={salon.image} className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black text-[#2D1B4E] dark:text-white mb-2">{salon.name}</h3>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-6">
                  <MapPin size={16} className="text-[#E8622A]" /> {salon.location}
                </div>
                <button className={`w-full py-4 rounded-2xl font-black transition-all ${salon.isPremium ? 'bg-[#FFD700] text-[#2D1B4E]' : 'bg-[#2D1B4E] text-white'}`}>Randevu Al</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}