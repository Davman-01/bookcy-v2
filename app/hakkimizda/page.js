"use client";
import React from 'react';
import { CheckCircle2, Crown } from 'lucide-react';

export default function PackagesSection() {
    return (
        <div className="w-full bg-[#FAF7F2] py-20 px-4">
            {/* BAŞLIK ALANI */}
            <div className="max-w-5xl mx-auto text-center mb-16">
                <span className="text-[#E8622A] text-xs font-black uppercase tracking-widest">SİZE UYGUN PLANI SEÇİN</span>
                <h2 className="text-4xl md:text-5xl font-black uppercase text-[#2D1B4E] mt-2">İŞLETME PAKETLERİ</h2>
            </div>

            {/* PAKETLER */}
            <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
                
                {/* 1. STANDART PAKET */}
                <div className="bg-white rounded-[40px] p-8 md:p-10 w-full lg:w-1/2 shadow-xl border-2 border-transparent hover:border-[#E8622A] transition-all relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-0"></div>
                    <div className="relative z-10 flex-1 flex flex-col">
                        <h3 className="text-2xl font-black uppercase text-[#2D1B4E] tracking-tight">STANDART PAKET</h3>
                        <div className="mt-4 mb-8 flex items-end gap-2">
                            <span className="text-5xl font-black text-[#E8622A]">60 STG</span>
                            <span className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-widest">/ Aylık</span>
                        </div>
                        
                        {/* Özellikler */}
                        <div className="flex flex-col gap-4 flex-1">
                            <FeatureItem text="Sınırsız 7/24 Randevu Alma" />
                            <FeatureItem text="Sektörel Standart Akış (Berber/Kuaför)" />
                            <FeatureItem text="İşletme Takip ve Yönetim Paneli" />
                            <FeatureItem text="Galeri ve İletişim Vitrini" />
                            <FeatureItem text="Müşteri Notları ve Bildirimler" />
                            <FeatureItem text="İşletme Rotası (Harita Entegrasyonu)" />
                        </div>
                        
                        <button className="w-full mt-10 bg-slate-100 text-[#2D1B4E] hover:bg-slate-200 py-4 rounded-2xl font-black uppercase tracking-widest transition-colors cursor-pointer">Standart ile Başla</button>
                    </div>
                </div>

                {/* 2. PREMIUM PAKET */}
                <div className="bg-[#2D1B4E] rounded-[40px] p-8 md:p-10 w-full lg:w-1/2 shadow-2xl relative lg:scale-105 border-4 border-[#2D1B4E] flex flex-col mt-10 lg:mt-0">
                    {/* Rozet */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#E8622A] text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg whitespace-nowrap">
                        EN ÇOK TERCİH EDİLEN
                    </div>
                    
                    <h3 className="text-2xl font-black uppercase text-white tracking-tight flex items-center gap-2">
                        <Crown size={24} className="text-[#E8622A]" /> PREMİUM PAKET
                    </h3>
                    <div className="mt-4 mb-8 flex items-end gap-2">
                        <span className="text-5xl font-black text-[#E8622A]">100 STG</span>
                        <span className="text-white/50 font-bold text-sm mb-1 uppercase tracking-widest">/ Aylık</span>
                    </div>
                    
                    {/* Özellikler */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                        <FeatureItem text="Standart Paketteki Her Şey" isPremium />
                        <FeatureItem text="Arama Sonuçlarında En Üst Sıra" isPremium />
                        <FeatureItem text="Premium Çerçeve (Altın Rozet)" isPremium />
                        <FeatureItem text="Özel Sektör Akışları (Dövme Formu, VIP Loca)" isPremium />
                        <FeatureItem text="Sponsorlu Reklam ve Story Box" isPremium />
                        <FeatureItem text="Sosyal Medya Yönetim Desteği" isPremium />
                        <FeatureItem text="Personel Performans Optimizasyonu" isPremium />
                        <FeatureItem text="Detaylı Raporlama ve İstatistik" isPremium />
                        <FeatureItem text="7/24 Öncelikli Destek Hattı" isPremium />
                    </div>
                    
                    <button className="w-full mt-10 bg-[#E8622A] hover:bg-[#d65520] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(232,98,42,0.3)] transition-all hover:-translate-y-1 cursor-pointer">Premium'a Geç</button>
                </div>
            </div>
        </div>
    );
}

// Özellikleri listelemek için kullandığımız küçük bileşen
function FeatureItem({ text, isPremium }) {
    return (
        <div className="flex items-start gap-3">
            <CheckCircle2 size={18} className={`shrink-0 mt-0.5 ${isPremium ? 'text-[#E8622A]' : 'text-[#E8622A]'}`} />
            <span className={`text-xs font-bold leading-relaxed ${isPremium ? 'text-white/90' : 'text-slate-600'}`}>{text}</span>
        </div>
    );
}