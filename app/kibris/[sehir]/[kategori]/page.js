import React from 'react';
import Link from 'next/link';
import { MapPin, Star, CalendarCheck, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

// --- SEO VERİ TABANI ---
const SEHIRLER = {
  lefkosa: { ad: 'Lefkoşa', ozellik: 'KKTC\'nin en büyük şehri ve başkenti' },
  girne: { ad: 'Girne', ozellik: 'Kıbrıs\'ın turizm ve eğlence merkezi' },
  gazimagusa: { ad: 'Gazimağusa', ozellik: 'Tarihi dokusu ve öğrenci yaşamıyla öne çıkan şehir' },
  iskele: { ad: 'İskele', ozellik: 'Son yılların en popüler yatırım ve tatil bölgesi' },
  guzelyurt: { ad: 'Güzelyurt', ozellik: 'Kıbrıs\'ın narenciye cenneti' }
};

const KATEGORILER = {
  kuafor: { ad: 'Kuaför', emoji: '✂️', aciklama: 'en iyi saç tasarım ve bakım uzmanları' },
  berber: { ad: 'Berber', emoji: '💈', aciklama: 'profesyonel erkek saç ve sakal kesim merkezleri' },
  spa: { ad: 'Spa & Masaj', emoji: '🧖‍♀️', aciklama: 'rahatlatıcı masaj ve arınma terapileri' },
  tirnak: { ad: 'Tırnak Stüdyosu', emoji: '💅', aciklama: 'kalıcı oje ve protez tırnak merkezleri' },
  dovme: { ad: 'Dövme Stüdyosu', emoji: '🖋️', aciklama: 'ödüllü dövme (tattoo) sanatçıları' },
  estetik: { ad: 'Estetik', emoji: '✨', aciklama: 'medikal estetik ve cilt bakım klinikleri' }
};

// --- DİNAMİK SEO METADATA OLUŞTURUCU (Google'ın Okuyacağı Kısım) ---
export async function generateMetadata({ params }) {
  // NEXT.JS 15 UYUMU: Parametreleri await ile bekliyoruz
  const resolvedParams = await params;
  const sehirKey = resolvedParams.sehir.toLowerCase();
  const kategoriKey = resolvedParams.kategori.toLowerCase();

  const sehir = SEHIRLER[sehirKey] || { ad: resolvedParams.sehir };
  const kategori = KATEGORILER[kategoriKey] || { ad: resolvedParams.kategori };

  return {
    title: `${sehir.ad} ${kategori.ad} Randevusu ve Fiyatları | Bookcy`,
    description: `${sehir.ad} bölgesindeki en iyi ${kategori.ad} işletmelerini keşfedin. Müşteri yorumlarını okuyun, 7/24 online randevu alın. Bookcy güvencesiyle.`,
    keywords: `${sehir.ad} ${kategori.ad}, ${sehir.ad} ${kategori.ad} randevu, ${sehir.ad} en iyi ${kategori.ad}, kktc ${sehir.ad} rezervasyon`,
    alternates: {
      canonical: `https://bookcy.co/kibris/${sehirKey}/${kategoriKey}`,
    }
  };
}

// --- SAYFA TASARIMI ---
export default async function ProgrammaticSeoPage({ params }) {
  // NEXT.JS 15 UYUMU: Parametreleri await ile bekliyoruz
  const resolvedParams = await params;
  const sehirKey = resolvedParams.sehir.toLowerCase();
  const kategoriKey = resolvedParams.kategori.toLowerCase();

  // Eğer URL'de eşleşmeyen bir şehir/kategori varsa varsayılan değer atar
  const sehir = SEHIRLER[sehirKey] || { ad: resolvedParams.sehir.toUpperCase(), ozellik: 'Kıbrıs\'ın gözde bölgelerinden biri' };
  const kategori = KATEGORILER[kategoriKey] || { ad: resolvedParams.kategori.toUpperCase(), emoji: '✨', aciklama: 'en seçkin hizmet noktaları' };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-['DM_Sans']">
      
      {/* HERO BÖLÜMÜ (Google Puanı Yüksek Tutmak İçin Özel Tasarlandı) */}
      <section className="bg-[#2D1B4E] text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 150%, #E8622A 0%, transparent 50%)' }}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#E8622A]/20 text-[#E8622A] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <MapPin size={14} /> {sehir.ad} BÖLGESİ
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            {sehir.ad} Bölgesindeki En İyi <br/>
            <span className="text-[#E8622A]">{kategori.ad}</span> İşletmeleri
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            {sehir.ozellik} olan {sehir.ad} şehrindeki {kategori.aciklama} tek bir platformda. Zaman kaybetmeden online randevunuzu hemen oluşturun.
          </p>
          <Link href={`/isletmeler?q=${kategori.ad}&r=${sehir.ad}`} className="inline-flex items-center justify-center gap-2 bg-[#E8622A] text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl hover:scale-105">
            <CalendarCheck size={18} /> {sehir.ad} {kategori.ad} ARA
          </Link>
        </div>
      </section>

      {/* SEO İÇERİK VE GÜVEN ALANI */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><Star size={24} /></div>
              <h3 className="font-black text-[#2D1B4E] mb-2 text-lg">Onaylı Yorumlar</h3>
              <p className="text-sm text-slate-500 font-medium">İşletmelerdeki gerçek müşteri deneyimlerini okuyarak en doğru kararı verin.</p>
            </div>
            <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm text-center">
              <div className="w-16 h-16 bg-orange-50 text-[#E8622A] rounded-full flex items-center justify-center mx-auto mb-4"><CalendarCheck size={24} /></div>
              <h3 className="font-black text-[#2D1B4E] mb-2 text-lg">Anında Rezervasyon</h3>
              <p className="text-sm text-slate-500 font-medium">Telefonla aramaya gerek kalmadan, 7/24 dilediğiniz saate randevunuzu kesinleştirin.</p>
            </div>
            <div className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm text-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><ShieldCheck size={24} /></div>
              <h3 className="font-black text-[#2D1B4E] mb-2 text-lg">Ücretsiz ve Güvenli</h3>
              <p className="text-sm text-slate-500 font-medium">Bookcy altyapısı ile işlemleriniz tamamen ücretsiz ve kişisel verileriniz güvende.</p>
            </div>
          </div>

          {/* GOOGLE İÇİN ZENGİN METİN (Rich Text SEO) */}
          <div className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-200 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-black text-[#2D1B4E] mb-6">
              Neden {sehir.ad} Bölgesinde {kategori.ad} İçin Bookcy'i Kullanmalısınız?
            </h2>
            <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
              <p>
                Kuzey Kıbrıs'ın gelişen yapısı içinde, özellikle <strong>{sehir.ad}</strong> bölgesinde kaliteli bir <strong>{kategori.ad}</strong> bulmak bazen zorlayıcı olabilir. Bookcy olarak, bu arayışınıza son veriyoruz. Sistemimizde yer alan tüm {sehir.ad} {kategori.ad} işletmeleri, kalite standartlarına göre özenle listelenmektedir.
              </p>
              <p>
                İster hafta sonu planınız için, isterseniz acil bir ihtiyaç için olsun; işletmelerin çalışma saatlerini, sundukları hizmetlerin detaylı fiyat listelerini ve müsaitlik durumlarını tek bir ekranda görebilirsiniz. Üstelik randevunuzu oluşturduğunuz an işletmeye anında bildirim gider ve yeriniz sizin için ayrılır.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#E8622A]"/> Sadece doğrulanmış işletmeler</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#E8622A]"/> Gizli ücret veya komisyon yok</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={18} className="text-[#E8622A]"/> SMS ve E-posta ile randevu hatırlatmaları</li>
              </ul>
            </div>
            
            <div className="mt-10 pt-8 border-t border-slate-100">
               <h3 className="font-black text-[#2D1B4E] mb-4">Diğer Popüler Bölgeler</h3>
               <div className="flex flex-wrap gap-2">
                 {Object.keys(SEHIRLER).filter(s => s !== sehirKey).map(digerSehir => (
                   <Link key={digerSehir} href={`/kibris/${digerSehir}/${kategoriKey}`} className="text-xs font-bold bg-slate-100 hover:bg-[#E8622A] hover:text-white px-4 py-2 rounded-lg transition-colors text-slate-600">
                     {SEHIRLER[digerSehir].ad} {kategori.ad}
                   </Link>
                 ))}
               </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}