import React from 'react';
import Link from 'next/link';

// SEO Metadataları (Metadata nesnesi server componentlerde bu şekilde dışarı aktarılır)
export const metadata = {
  title: 'Kıbrıs Rehberi 2025: Kur, Haber, Randevu, Eczane ve Daha Fazlası | Bookcy',
  description: "KKTC'de bugün sterlin kaç? Nöbetçi eczane, son dakika haberler, kiralık ev ilanları ve randevu için Kıbrıs'ın kapsamlı yaşam rehberi.",
  keywords: 'kıbrıs sterlin kuru, kktc nöbetçi eczane, kıbrıs son dakika haber, kktc randevu, kıbrıs etkinlik',
  alternates: { canonical: 'https://bookcy.co/rehber' }
};

export default function KibrisYasamRehberi() {
  // JSON-LD Yapısal Veri
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
      {/* Google için Yapısal Veri */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} 
      />
      
      <div className="min-h-screen bg-[#F7EFE0] font-sans text-[#1a1a1a] leading-relaxed overflow-x-hidden">
        {/* Hero Section */}
        <header className="bg-[#4A1942] py-20 px-5 text-center relative overflow-hidden text-white">
           <div className="max-w-3xl mx-auto relative z-10">
             <span className="inline-block bg-[#C4622D]/30 text-[#F2C4A8] px-4 py-1 rounded-full text-xs tracking-widest uppercase mb-5 font-bold">Bookcy — KKTC Yaşam Rehberi 2025</span>
             <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Kıbrıs'ta Her Gün Lazım Olan Her Şey: <br/><em className="text-[#F2C4A8] not-italic">Kur, Haber, Randevu, Eczane</em></h1>
             <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">KKTC'de günlük hayatın nabzını tutan kapsamlı rehber. Sterlin kuru, nöbetçi eczane ve online randevu — hepsi tek sayfada.</p>
             <Link href="/" className="bg-[#C4622D] text-white px-8 py-3 rounded-lg font-bold hover:opacity-85 transition inline-block">Randevu Al →</Link>
           </div>
        </header>

        <main className="max-w-4xl mx-auto px-5 py-12">
          {/* İçindekiler */}
          <nav className="bg-white border border-[#e8e0d6] rounded-xl p-6 mb-12 shadow-sm">
            <h2 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-4 border-b pb-2">Bu rehberde neler var?</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <li><a href="#kur" className="text-[#4A1942] hover:underline font-medium">1. Güncel Döviz Kurları</a></li>
              <li><a href="#eczane" className="text-[#4A1942] hover:underline font-medium">2. Nöbetçi Eczaneler</a></li>
              <li><a href="#randevu" className="text-[#4A1942] hover:underline font-medium">3. Güzellik ve Randevu</a></li>
            </ul>
          </nav>

          {/* Kur Bölümü */}
          <section id="kur" className="mb-16">
            <h2 className="text-2xl font-black text-[#4A1942] border-b-4 border-[#F2C4A8] pb-2 mb-6 uppercase">1. Güncel Döviz Kurları — Sterlin, Euro, Dolar</h2>
            <p className="mb-4">KKTC'de <strong>sterlin kuru</strong> günlük hayatın merkezindedir. Kira bedelleri ve araç fiyatları pound cinsinden belirlendiği için "sterlin bugün kaç TL" araması en sık yapılan sorgudur.</p>
            <div className="bg-white p-6 border-l-4 border-[#C4622D] rounded-r-xl italic text-gray-700">
              💡 Güncel kurları yerel döviz bürolarından veya bankaların dijital platformlarından anlık olarak takip edebilirsiniz.
            </div>
          </section>

          {/* Eczane Bölümü */}
          <section id="eczane" className="mb-16">
            <h2 className="text-2xl font-black text-[#4A1942] border-b-4 border-[#F2C4A8] pb-2 mb-6 uppercase">2. KKTC Nöbetçi Eczane — Nasıl Bulunur?</h2>
            <p className="mb-6">Gece yarısı ilaç ihtiyacı için <strong>Lefkoşa nöbetçi eczane</strong> veya <strong>Girne nöbetçi eczane</strong> aramaları, KKTC Eczacılar Birliği verileri üzerinden en sağlıklı şekilde sorgulanabilir.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 border rounded-xl shadow-sm">
                <span className="text-2xl mb-2 block">💊</span>
                <h3 className="font-bold text-[#4A1942] mb-1">Eczacılar Birliği</h3>
                <p className="text-xs text-gray-500 leading-snug">Resmi web sitesi üzerinden tüm ilçelerin nöbet listesine ulaşın.</p>
              </div>
              <div className="bg-white p-5 border rounded-xl shadow-sm">
                <span className="text-2xl mb-2 block">🗞️</span>
                <h3 className="font-bold text-[#4A1942] mb-1">Yerel Gazeteler</h3>
                <p className="text-xs text-gray-500 leading-snug">Dijital haber portalları her akşam güncel listeyi yayınlar.</p>
              </div>
            </div>
          </section>

          {/* Randevu Bölümü */}
          <section id="randevu" className="mb-16 bg-[#4A1942] p-8 rounded-3xl text-white">
            <h2 className="text-2xl font-black border-b border-white/20 pb-4 mb-6 uppercase tracking-tight">3. Güzellik ve Bakım Randevusu — Bookcy</h2>
            <p className="mb-6 opacity-80 font-medium">KKTC'de kuaför, berber, spa ve tırnak randevusu almak artık Bookcy ile çok kolay. DM atmadan 7/24 online rezervasyon.</p>
            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-center">
              <Link href="/kibris/lefkosa/kuafor" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl border border-white/10 transition">LEFKOŞA KUAFÖR</Link>
              <Link href="/kibris/girne/spa" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl border border-white/10 transition">GİRNE SPA</Link>
              <Link href="/kibris/gazimagusa/berber" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl border border-white/10 transition">MAĞUSA BERBER</Link>
              <Link href="/kibris/iskele/tirnak" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl border border-white/10 transition">İSKELE TIRNAK</Link>
            </div>
          </section>

          {/* CTA Area */}
          <section className="bg-gradient-to-br from-[#4A1942] to-[#6b2b63] p-10 rounded-3xl text-center shadow-2xl">
            <h2 className="text-white border-none text-2xl mb-4 font-black">Güzellik Randevunuz İçin Kıbrıs'ın Platformu</h2>
            <p className="text-[#F2C4A8] mb-8 font-medium italic">Kuaförden masaja, dövmeden estetik kliniğine KKTC genelinde anında randevu.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="bg-[#C4622D] text-white px-10 py-4 rounded-xl font-black hover:scale-105 transition shadow-lg">RANDEVU BUL</Link>
              <Link href="/kayit" className="border-2 border-white/30 text-white px-10 py-4 rounded-xl font-black hover:bg-white/10 transition">İŞLETMENİ EKLE</Link>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}