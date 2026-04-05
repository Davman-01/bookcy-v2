"use client";
import { ShieldCheck, Zap, Heart, Star, Users, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export default function WhyBookcy() {
  const features = [
    {
      id: "guvenli-odeme",
      title: "Güvenli Randevu",
      desc: "Tüm randevularınız ve bilgileriniz üst düzey güvenlik sertifikalarıyla korunur.",
      icon: <ShieldCheck size={32} />,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10"
    },
    {
      id: "hizli-onay",
      title: "Anında Onay",
      desc: "İşletmenin takvimini canlı görürsünüz, beklemek yok, saniyeler içinde onay cebinizde.",
      icon: <Zap size={32} />,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-500/10"
    },
    {
      id: "en-iyi-deneyim",
      title: "En İyi Deneyim",
      desc: "Kuzey Kıbrıs'ın en seçkin işletmelerini tek bir platformda topladık.",
      icon: <Star size={32} />,
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-500/10"
    },
    {
      id: "7-24-destek",
      title: "7/24 Destek",
      desc: "Herhangi bir sorunuzda ekibimiz her an yanınızda, bir telefon uzağınızdayız.",
      icon: <PhoneCall size={32} />,
      color: "text-[#E8622A]",
      bg: "bg-[#E8622A]/10"
    }
  ];

  return (
    <section className="w-full px-6 md:px-12 py-24 bg-white dark:bg-[#1c1427] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Başlık Bölümü */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-[#2D1B4E] dark:text-white font-['Plus_Jakarta_Sans'] tracking-tight mb-4">
            Neden <span className="text-[#E8622A]">Bookcy?</span>
          </h2>
          <p className="text-slate-500 dark:text-white/60 font-medium max-w-2xl mx-auto leading-relaxed">
            Sadece bir randevu sistemi değil, kişisel bakım yolculuğunuzun en güvenilir ortağıyız.
          </p>
        </div>

        {/* Özellikler Izgarası */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item) => (
            <Link 
              key={item.id} 
              href={`/neden-bookcy/${item.id}`} // Ajanda: Hepsi ayrı URL olacak maddesi
              className="group p-8 rounded-[32px] bg-[#FAF7F2] dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-[#E8622A] hover:shadow-2xl hover:shadow-[#E8622A]/10 transition-all duration-500 no-underline"
            >
              <div className={`w-16 h-16 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-[#2D1B4E] dark:text-white mb-4 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-white/40 leading-relaxed font-bold">
                {item.desc}
              </p>
              <div className="mt-6 flex items-center gap-2 text-[#E8622A] font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Detaylı Bilgi &rarr;
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}