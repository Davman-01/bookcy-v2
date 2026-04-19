"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Briefcase, Store, Users, Target, Smartphone, Calendar, User, 
  TrendingUp, PieChart, Star, CheckCircle2, ArrowRight, Zap, ShieldCheck
} from 'lucide-react';
import { useAppContext } from '../../providers';

const featureIcons = { 
  profile: <Briefcase size={48} className="text-[#E8622A]"/>, 
  market: <Store size={48} className="text-[#E8622A]"/>, 
  team: <Users size={48} className="text-[#E8622A]"/>, 
  booking: <Target size={48} className="text-[#E8622A]"/>, 
  app: <Smartphone size={48} className="text-[#E8622A]"/>, 
  marketing: <Target size={48} className="text-[#E8622A]"/>, 
  calendar: <Calendar size={48} className="text-[#E8622A]"/>, 
  crm: <User size={48} className="text-[#E8622A]"/>, 
  boost: <TrendingUp size={48} className="text-[#E8622A]"/>, 
  stats: <PieChart size={48} className="text-[#E8622A]"/> 
};

export default function FeatureDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const { lang = 'TR', t } = useAppContext();
  
  const featNames = t?.[lang]?.featNames;
  const featDesc = t?.[lang]?.featDesc;

  if (!featNames || !featNames[id]) return null;

  return (
    <div className="w-full bg-white min-h-screen font-['Plus_Jakarta_Sans']">
      
      {/* 1. ÜST HERO BÖLÜMÜ */}
      <div className="bg-[#2D1B4E] pt-32 pb-48 px-6 text-center relative overflow-hidden">
        {/* Arka Plan Süsleri */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#E8622A] rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#8B5CF6] rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-[#E9D5FF] text-xs font-black tracking-widest uppercase mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Zap size={14} className="text-[#E8622A]"/> Bookcy Akıllı Çözümler
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-[1.1]">
            {featNames[id]}<span className="text-[#E8622A]">.</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#E9D5FF] font-medium leading-relaxed max-w-2xl mx-auto">
            {featDesc[id]}
          </p>
        </div>
      </div>

      {/* 2. ANA KART VE DETAYLAR */}
      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-20">
        <div className="bg-white p-8 md:p-16 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-slate-100">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Sol: Büyük İkon ve Görsel Alanı */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-orange-50 rounded-[32px] flex items-center justify-center mb-8 shadow-inner">
                {featureIcons[id] || <Star size={48} className="text-[#E8622A]"/>}
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#2D1B4E] mb-6 leading-tight uppercase italic">
                Neden Bu Özelliği <br/> <span className="text-[#E8622A]">Kullanmalısın?</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium mb-8 leading-relaxed">
                İşletmeni manuel süreçlerden kurtarıp dijital dünyaya taşıyoruz. {featNames[id]} modülü ile operasyonel yükünü azaltıp geliri artırmaya odaklanabilirsin.
              </p>
              <div className="flex flex-col gap-4 w-full">
                <button onClick={() => router.push('/')} className="w-full md:w-auto bg-[#2D1B4E] text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#1f1335] transition-all flex items-center justify-center gap-3 shadow-lg group">
                  Hemen Başla <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </button>
              </div>
            </div>

            {/* Sağ: Avantaj Maddeleri */}
            <div className="space-y-4">
               {[
                 { t: "Tam Entegrasyon", d: "Tüm Bookcy modülleriyle %100 uyumlu çalışır." },
                 { t: "Bulut Tabanlı", d: "Verilerinize dilediğiniz her cihazdan anında erişin." },
                 { t: "Kullanıcı Dostu", d: "Ekibiniz hiçbir eğitim almadan kullanmaya başlayabilir." },
                 { t: "Kıbrıs'a Özel", d: "Bölgemizin işletme kültürüne göre optimize edildi." }
               ].map((item, i) => (
                 <div key={i} className="flex gap-5 p-6 rounded-[24px] hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                    <div className="mt-1 shrink-0 bg-green-50 text-green-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={24}/>
                    </div>
                    <div>
                      <h4 className="font-black text-[#2D1B4E] uppercase text-sm mb-1 tracking-wide">{item.t}</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.d}</p>
                    </div>
                 </div>
               ))}
            </div>

          </div>
        </div>
      </div>

      {/* 3. EKSTRA GÜVEN BÖLÜMÜ */}
      <div className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-[#FAF7F2] rounded-[32px] border border-slate-100">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
               <ShieldCheck className="text-[#E8622A]"/>
            </div>
            <h4 className="font-black text-[#2D1B4E] uppercase text-xs tracking-widest mb-4">Güvenli Veri</h4>
            <p className="text-sm text-slate-500 font-medium">Tüm işletme verileriniz yüksek güvenlikli şifreleme ile korunur.</p>
          </div>
          <div className="text-center p-8 bg-[#FAF7F2] rounded-[32px] border border-slate-100">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
               <Users className="text-[#E8622A]"/>
            </div>
            <h4 className="font-black text-[#2D1B4E] uppercase text-xs tracking-widest mb-4">Ücretsiz Destek</h4>
            <p className="text-sm text-slate-500 font-medium">Sorularınız için WhatsApp destek ekibimiz her zaman yanınızda.</p>
          </div>
          <div className="text-center p-8 bg-[#FAF7F2] rounded-[32px] border border-slate-100">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
               <TrendingUp className="text-[#E8622A]"/>
            </div>
            <h4 className="font-black text-[#2D1B4E] uppercase text-xs tracking-widest mb-4">Verim Artışı</h4>
            <p className="text-sm text-slate-500 font-medium">Dijitalleşen işletmelerde randevu kaçırma oranı %40 azalır.</p>
          </div>
        </div>
      </div>

    </div>
  );
}