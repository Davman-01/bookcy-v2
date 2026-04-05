"use client";
import { Search, CalendarCheck, Smile } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Mekan Keşfet",
      description: "Sana en yakın, en iyi puanlı kuaför ve güzellik merkezlerini anında filtrele.",
      icon: <Search size={32} />,
      color: "bg-blue-50 text-blue-600"
    },
    {
      id: 2,
      title: "Randevu Al",
      description: "İşletmenin takvimini gör, sana uyan saati seç ve saniyeler içinde onaylat.",
      icon: <CalendarCheck size={32} />,
      color: "bg-orange-50 text-[#E8622A]"
    },
    {
      id: 3,
      title: "Tadını Çıkar",
      description: "Sıra beklemeden hizmetini al, sonrasında puan vererek diğerlerine yol göster.",
      icon: <Smile size={32} />,
      color: "bg-purple-50 text-[#2D1B4E]"
    }
  ];

  return (
    <section className="w-full px-6 md:px-12 py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Başlık */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-[#2D1B4E] font-['Plus_Jakarta_Sans'] tracking-tight mb-4">
            Sistem Nasıl Çalışır?
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Bookcy ile güzellik ve bakım randevusu almak hiç bu kadar kolay olmamıştı. Sadece 3 adımda zamanını kendine ayır.
          </p>
        </div>

        {/* Adımlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          
          {/* Masaüstü için aradaki bağlantı çizgisi */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-slate-100 -z-10"></div>

          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center bg-white">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${step.color} shadow-sm border-8 border-white mb-6 relative z-10 hover:scale-110 transition-transform duration-300`}>
                {step.icon}
                {/* Adım Numarası Rozeti */}
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#2D1B4E] text-white font-bold text-sm flex items-center justify-center border-2 border-white">
                  {step.id}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#2D1B4E] mb-3">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-[250px]">
                {step.description}
              </p>
            </div>
          ))}
          
        </div>
      </div>
    </section>
  );
}