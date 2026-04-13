"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { useAppContext } from '../../providers';

export default function LegalPage() {
  const params = useParams();
  const id = params.id; // 'gizlilik', 'kvkk', 'sartlar', 'cerez'
  const { lang = 'TR', t } = useAppContext();

  const step = id === 'gizlilik' ? 'privacy' : id === 'kvkk' ? 'kvkk' : id === 'sartlar' ? 'terms' : 'cookies';
  const text = t?.[lang] || t?.['TR'];

  if (!text) return null;

  const titles = {
    privacy: text.nav?.contact === 'Contact' ? 'Privacy Policy' : text.nav?.contact === 'Контакты' ? 'Политика конфиденциальности' : 'Gizlilik Politikası',
    kvkk: text.nav?.contact === 'Contact' ? 'Data Protection' : text.nav?.contact === 'Контакты' ? 'Защита данных' : 'KVKK Aydınlatma Metni',
    terms: text.nav?.contact === 'Contact' ? 'Terms of Use' : text.nav?.contact === 'Контакты' ? 'Условия использования' : 'Kullanım Şartları',
    cookies: text.nav?.contact === 'Contact' ? 'Cookie Policy' : text.nav?.contact === 'Контакты' ? 'Политика файлов cookie' : 'Çerez Politikası'
  };

  return (
    <div className="w-full bg-[#FAF7F2] pb-24 pt-10 md:pt-16 min-h-screen">
      <div className="bg-white pt-16 md:pt-24 pb-16 md:pb-24 px-6 text-center border-b border-slate-200">
        <h1 className="text-2xl md:text-5xl font-black text-[#2D1B4E] uppercase tracking-tight">
          {titles[step]}
        </h1>
        <p className="text-xs md:text-sm font-bold text-slate-500 mt-6 uppercase tracking-widest bg-slate-50 inline-block px-4 py-2 rounded-lg">
          {text.legal?.upd}
        </p>
      </div>
      <div className="max-w-4xl mx-auto mt-10 md:mt-16 bg-white p-8 md:p-20 rounded-[32px] md:rounded-[40px] border border-slate-200 text-slate-600 font-medium leading-relaxed shadow-xl">
        <div className="prose prose-slate max-w-none">
          {step === 'privacy' && (
            <div className="space-y-8 md:space-y-10">
              <h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">Giriş</h3>
              <p className="text-base md:text-lg">Bu politika, Bookcy platformunu kullanırken kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.</p>
              <h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">Toplanan Veriler</h3>
              <p className="text-base md:text-lg">Randevu oluştururken girdiğiniz ad, soyad, telefon numarası ve e-posta adresi gibi bilgiler, hizmeti sağlamak amacıyla sistemlerimizde güvenle saklanır.</p>
            </div>
          )}
          {step === 'kvkk' && (
            <div className="space-y-8 md:space-y-10">
              <h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">Veri Sorumlusu</h3>
              <p className="text-base md:text-lg">Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca veri sorumlusu, Bookcy Ltd.'dir.</p>
            </div>
          )}
          {step === 'terms' && (
            <div className="space-y-8 md:space-y-10">
              <h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">Hizmet Tanımı</h3>
              <p className="text-base md:text-lg">Bookcy, kullanıcıların anlaşmalı işletmelerden online randevu almasını sağlayan aracı bir platformdur.</p>
            </div>
          )}
          {step === 'cookies' && (
            <div className="space-y-8 md:space-y-10">
              <h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">Çerez Nedir?</h3>
              <p className="text-base md:text-lg">Çerezler (Cookies), sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük veri dosyalarıdır.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}