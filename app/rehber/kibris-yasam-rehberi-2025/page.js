import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Kıbrıs Rehberi 2025: Kur, Haber, Randevu, Eczane ve Daha Fazlası | Bookcy',
  description: "KKTC'de bugün sterlin kaç? Nöbetçi eczane, son dakika haberler ve randevu için Kıbrıs'ın kapsamlı yaşam rehberi.",
  alternates: { canonical: 'https://bookcy.co/rehber' }
};

export default function KibrisYasamRehberi() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Kıbrıs Rehberi 2025: KKTC'de Yaşam, Kur, Haber ve Randevu",
    "author": { "@type": "Organization", "name": "Bookcy", "url": "https://bookcy.co" },
    "datePublished": "2025-01-15",
    "publisher": { "@type": "Organization", "name": "Bookcy" }
  };

  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} 
      />
      
      <div className="min-h-screen bg-[#F7EFE0] font-sans text-[#1a1a1a] leading-relaxed overflow-x-hidden">
        <header className="bg-[#4A1942] py-20 px-5 text-center relative text-white">
           <div className="max-w-3xl mx-auto relative z-10">
             <span className="inline-block bg-[#C4622D]/30 text-[#F2C4A8] px-4 py-1 rounded-full text-xs tracking-widest uppercase mb-5 font-bold">Bookcy — KKTC Yaşam Rehberi 2025</span>
             <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Kıbrıs'ta Her Gün Lazım Olan Her Şey</h1>
             <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">Sterlin kuru, nöbetçi eczane ve online randevu — hepsi tek sayfada.</p>
             <Link href="/" className="bg-[#C4622D] text-white px-8 py-3 rounded-lg font-bold hover:opacity-85 transition inline-block">Ana Sayfa →</Link>
           </div>
        </header>

        <main className="max-w-4xl mx-auto px-5 py-12">
          {/* Rehber İçeriği */}
          <section id="kur" className="mb-16">
            <h2 className="text-2xl font-black text-[#4A1942] border-b-4 border-[#F2C4A8] pb-2 mb-6 uppercase">1. Güncel Döviz Kurları</h2>
            <p className="mb-4">KKTC'de <strong>sterlin kuru</strong> günlük hayatın merkezindedir. "Sterlin bugün kaç TL" araması adada en sık yapılan sorgudur.</p>
          </section>

          <section id="randevu" className="mb-16 bg-[#4A1942] p-8 rounded-3xl text-white">
            <h2 className="text-2xl font-black border-b border-white/20 pb-4 mb-6 uppercase tracking-tight">Hızlı Randevu Linkleri</h2>
            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-center">
              <Link href="/kibris/lefkosa/kuafor" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl border border-white/10 transition">LEFKOŞA KUAFÖR</Link>
              <Link href="/kibris/girne/spa" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl border border-white/10 transition">GİRNE SPA</Link>
              <Link href="/kibris/gazimagusa/berber" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl border border-white/10 transition">MAĞUSA BERBER</Link>
              <Link href="/kibris/iskele/tirnak" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl border border-white/10 transition">İSKELE TIRNAK</Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}