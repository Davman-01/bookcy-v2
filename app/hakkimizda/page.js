"use client";
import React from 'react';
import { CheckCircle2, Crown, ShieldCheck, BarChart3, MessageSquare } from 'lucide-react';
import { useAppContext } from '../providers';

export default function About() {
  const { lang = 'TR', t } = useAppContext();
  const text = t?.[lang]?.aboutPage;

  if (!text) return null;

  return (
    <div className="w-full bg-[#FAF7F2] pb-24 pt-10 md:pt-16">
      {/* Hero Section */}
      <div className="bg-[#2D1B4E] pt-20 md:pt-24 pb-24 md:pb-32 px-6 text-center">
        <span className="bg-white/10 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 mb-8 inline-block">
          {text.tag}
        </span>
        <h1 className="text-3xl md:text-6xl font-black text-white mb-8 tracking-tight">
          {text.title1}<br/>
          <span className="text-[#E8622A]">{text.title2}</span>
        </h1>
        <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed px-4">
          İşletmenizin dijital dönüşümünü profesyonel çözümlerle yönetin. 
          Bookcy, operasyonel verimliliği artırmak ve müşteri deneyimini mükemmelleştirmek için tasarlanmış kapsamlı bir ekosistemdir.
        </p>
      </div>
      
      <div className="max-w-[1200px] mx-auto px-6 -mt-10 md:-mt-16">
        {/* Vizyon Kartı */}
        <div className="bg-white p-8 md:p-16 rounded-[40px] shadow-2xl border border-slate-200 mb-16 md:mb-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-bl-full -z-10"></div>
          <h2 className="text-sm font-black text-[#E8622A] uppercase tracking-[0.3em] mb-6 relative z-10">{text.wTag}</h2>
          <p className="text-xl md:text-3xl text-[#2D1B4E] font-black leading-tight mb-8 relative z-10">{text.w1}</p>
          <p className="text-base md:text-lg text-slate-500 font-medium mb-12 max-w-4xl mx-auto relative z-10 leading-relaxed">{text.w2}</p>
          <div className="bg-[#2D1B4E] text-white p-6 md:p-10 rounded-[32px] inline-block font-bold text-lg md:text-2xl shadow-2xl relative z-10 border border-slate-700 leading-relaxed">
            {text.w3} <br/>
            <span className="text-[#E8622A]">{text.w4}</span>
          </div>
        </div>

        {/* Paketler Başlık */}
        <div className="mt-16 md:mt-24 text-center mb-12 md:mb-16">
          <h2 className="text-sm font-black text-[#E8622A] uppercase tracking-[0.3em] mb-4">{text.pTag}</h2>
          <h3 className="text-3xl md:text-5xl font-black text-[#2D1B4E] uppercase tracking-tight">KURUMSAL ÇÖZÜMLERİMİZ</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 text-left max-w-6xl mx-auto">
          
          {/* Standart Paket - Profesyonel Başlangıç */}
          <div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-200 shadow-xl relative overflow-hidden group hover:border-[#E8622A] transition-all">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-[#2D1B4E] uppercase tracking-widest mb-2">{text.std}</h3>
              <p className="text-4xl md:text-5xl font-black text-[#E8622A] mb-10">60 STG <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">{text.mo}</span></p>
              <ul className="space-y-5 mb-14">
                <li className="flex items-start gap-4 text-sm md:text-base font-bold text-slate-600"><CheckCircle2 size={22} className="text-[#E8622A] shrink-0"/> 7/24 Kesintisiz Rezervasyon Yönetimi</li>
                <li className="flex items-start gap-4 text-sm md:text-base font-bold text-slate-600"><CheckCircle2 size={22} className="text-[#E8622A] shrink-0"/> Temel CRM (Müşteri Kayıt Sistemi)</li>
                <li className="flex items-start gap-4 text-sm md:text-base font-bold text-slate-600"><CheckCircle2 size={22} className="text-[#E8622A] shrink-0"/> Otomatik SMS Randevu Onayları</li>
                <li className="flex items-start gap-4 text-sm md:text-base font-bold text-slate-600"><CheckCircle2 size={22} className="text-[#E8622A] shrink-0"/> Merkezi İşletme Yönetim Paneli</li>
                <li className="flex items-start gap-4 text-sm md:text-base font-bold text-slate-600"><CheckCircle2 size={22} className="text-[#E8622A] shrink-0"/> Personel Performans Takip Modülü</li>
                <li className="flex items-start gap-4 text-sm md:text-base font-bold text-slate-600"><CheckCircle2 size={22} className="text-[#E8622A] shrink-0"/> Google Maps Entegrasyonu & Rota</li>
              </ul>
            </div>
          </div>

          {/* Premium Paket - Uçtan Uca Yönetim */}
          <div className="bg-[#2D1B4E] p-8 md:p-12 rounded-[40px] border border-[#3E296A] relative text-white shadow-2xl overflow-hidden md:scale-105 z-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E8622A] to-purple-600 rounded-bl-full opacity-20 blur-3xl"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#E8622A] to-orange-500 text-white px-8 py-2 rounded-b-xl text-[10px] font-black uppercase tracking-widest shadow-lg w-max">
              {text.pop}
            </div>
            <div className="relative z-10 mt-6">
              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2 flex items-center gap-3">
                <Crown size={28} className="text-yellow-500"/> {text.pr}
              </h3>
              <p className="text-4xl md:text-5xl font-black text-[#E8622A] mb-10">100 STG <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">{text.mo}</span></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-14">
                <li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Gelişmiş CRM & Sadakat Yönetimi</li>
                <li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Akıllı SMS Kampanya Modülü</li>
                <li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Sektörel Özel Akışlar (VIP/Form)</li>
                <li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Algoritmik Arama Önceliği</li>
                <li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Sosyal Medya İçerik Desteği</li>
                <li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Dinamik Story Box Reklamları</li>
                <li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> İleri Düzey Veri Analitiği</li>
                <li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Premium Marka Rozeti</li>
                <li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Personel Verimlilik Optimizasyonu</li>
                <li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Öncelikli Teknik Danışmanlık</li>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Bilgi Rozetleri (Güven İçin) */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-slate-200 pt-16">
            <div className="flex flex-col items-center">
                <ShieldCheck size={40} className="text-[#2D1B4E] mb-4" />
                <h4 className="font-black text-[#2D1B4E] uppercase text-sm mb-2">Güvenli Altyapı</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Tüm verileriniz yüksek güvenlikli sunucularda korunur.</p>
            </div>
            <div className="flex flex-col items-center">
                <MessageSquare size={40} className="text-[#2D1B4E] mb-4" />
                <h4 className="font-black text-[#2D1B4E] uppercase text-sm mb-2">Kesintisiz İletişim</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Müşterilerinizle SMS ve bildirimlerle bağınızı koparmayın.</p>
            </div>
            <div className="flex flex-col items-center">
                <BarChart3 size={40} className="text-[#2D1B4E] mb-4" />
                <h4 className="font-black text-[#2D1B4E] uppercase text-sm mb-2">Büyüme Odaklı CRM</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Veriye dayalı kararlar alarak işletmenizi büyütün.</p>
            </div>
        </div>
      </div>
    </div>
  );
}