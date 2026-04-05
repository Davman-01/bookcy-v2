"use client";
import { Check, Star } from 'lucide-react';

export default function Pricing() {
  const plans = [
    { 
      name: "Bookcy Standard", 
      price: "₺100", 
      features: ["Online Randevu Yönetimi", "Müşteri Kayıt Defteri", "Haftalık Analiz Raporu", "Temel Profil Görünümü"], 
      isPopular: false,
      btnClass: "bg-[#2D1B4E] text-white"
    },
    { 
      name: "Bookcy Premium", 
      price: "₺250", 
      features: ["Altın VIP Çerçeve (VIP Etiketi)", "Öncelikli Listeleme", "Sınırsız SMS Hatırlatma", "Gelişmiş Gelir Analizi", "Fotoğraf Galeri Modülü"], 
      isPopular: true,
      btnClass: "bg-[#FFD700] text-[#2D1B4E]"
    }
  ];

  return (
    <section id="paketler" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-black text-[#2D1B4E] mb-4">İşletmenizi Büyütecek Paketler</h2>
        <p className="text-slate-500 font-bold">Zamanınızı yönetin, kazancınızı artırın</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`flex-1 p-10 rounded-[40px] border-2 transition-all duration-500 hover:shadow-2xl flex flex-col
              ${plan.isPopular ? 'border-[#FFD700] bg-[#2D1B4E] text-white scale-105 z-10' : 'border-slate-100 bg-[#FAF7F2] text-[#2D1B4E]'}`}
          >
            {plan.isPopular && (
              <div className="bg-[#FFD700] text-[#2D1B4E] text-[10px] font-black px-4 py-1.5 rounded-full self-start mb-6 flex items-center gap-1 uppercase">
                <Star size={12} fill="currentColor" /> En Çok Tercih Edilen
              </div>
            )}
            <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
            <div className="text-5xl font-black mb-8">{plan.price}<span className="text-sm opacity-50 font-bold ml-1">/ay</span></div>
            
            <ul className="space-y-5 mb-10 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm font-bold">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${plan.isPopular ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-[#2D1B4E]/10 text-[#2D1B4E]'}`}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button className={`w-full py-5 rounded-2xl font-black text-sm transition-all hover:-translate-y-1 shadow-lg ${plan.btnClass}`}>
              Hemen Başla
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}