"use client";
import { Scissors, Sparkles, Flower, Droplets, Sun, Heart } from 'lucide-react';

export default function Categories() {
  const categories = [
    { id: 1, name: 'Kadın Kuaför', icon: <Scissors size={28} />, color: 'bg-pink-100 text-pink-600' },
    { id: 2, name: 'Erkek Berber', icon: <Scissors size={28} className="rotate-180" />, color: 'bg-blue-100 text-blue-600' },
    { id: 3, name: 'Cilt Bakımı', icon: <Sparkles size={28} />, color: 'bg-purple-100 text-purple-600' },
    { id: 4, name: 'Spa & Masaj', icon: <Flower size={28} />, color: 'bg-teal-100 text-teal-600' },
    { id: 5, name: 'Tırnak & Makyaj', icon: <Droplets size={28} />, color: 'bg-rose-100 text-rose-600' },
    { id: 6, name: 'Lazer & Epilasyon', icon: <Sun size={28} />, color: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <section className="w-full px-6 md:px-12 py-8 bg-white border-y border-slate-100 shadow-sm relative z-10">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-lg font-bold text-[#2D1B4E] mb-6 font-['Plus_Jakarta_Sans']">Hızlı Keşfet</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 hover:border-slate-200 cursor-pointer transition-all hover:shadow-md group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                {cat.icon}
              </div>
              <span className="text-sm font-bold text-[#2D1B4E] text-center">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}