import React from 'react';
import Link from 'next/link';
import { Shield, ChevronLeft } from 'lucide-react';

export const metadata = {
  title: 'Kullanım Şartları ve Hizmet Sözleşmesi | Bookcy',
  description: 'Bookcy platformu kullanıcı ve işletme hizmet sözleşmesi, aracı hizmet sağlayıcı şartları.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['DM_Sans'] text-[#2D1B4E]">
      
      {/* Hero Section */}
      <div className="bg-[#2D1B4E] text-white pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <div className="w-16 h-16 bg-[#E8622A] rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight font-['Plus_Jakarta_Sans']">
            Bookcy Kullanıcı ve İşletme Hizmet Sözleşmesi
          </h1>
          <p className="text-slate-300 text-sm font-medium tracking-widest uppercase">
            Son Güncelleme: 13 Nisan 2026
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-[800px] mx-auto px-4 py-12 md:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#E8622A] transition-colors mb-8 font-bold text-sm">
          <ChevronLeft size={16} /> Ana Sayfaya Dön
        </Link>

        <article className="prose prose-slate max-w-none prose-headings:font-black prose-headings:font-['Plus_Jakarta_Sans'] prose-headings:text-[#2D1B4E] bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
          
          <p className="lead text-lg font-medium text-slate-600 mb-8">
            Bu sözleşme, Bookcy platformunu kullanan tüm müşteriler ve işletmeler için bağlayıcı hukuki şartları içermektedir. Lütfen platformu kullanmadan önce dikkatlice okuyunuz.
          </p>

          <h3 className="text-xl mt-8 mb-4">MADDE 1: TARAFLAR VE TANIMLAR</h3>
          <p>
            İşbu sözleşme; Kuzey Kıbrıs Türk Cumhuriyeti (KKTC) sınırları içerisinde faaliyet gösteren Bookcy platformu (Bundan böyle "Bookcy" veya "Platform" olarak anılacaktır) ile Platform üzerinden rezervasyon/randevu oluşturan gerçek veya tüzel kişiler ("Kullanıcı") ve Platform üzerinden hizmetlerini listeleyerek rezervasyon kabul eden ticari kuruluşlar ("İşletme") arasında akdedilmiştir. Kullanıcı ve İşletme, Platform'a kayıt olarak veya randevu oluşturarak bu sözleşmenin tüm şartlarını gayrikabili rücu kabul etmiş sayılır.
          </p>

          <h3 className="text-xl mt-8 mb-4">MADDE 2: PLATFORMUN HUKUKİ STATÜSÜ VE ROLÜ</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>2.1.</strong> Bookcy, Kullanıcılar ile İşletmeleri elektronik ortamda bir araya getiren bağımsız bir <strong>"Aracı Hizmet Sağlayıcı"</strong> (Yer Sağlayıcı) konumundadır.</li>
            <li><strong>2.2.</strong> Bookcy, Platform üzerinde listelenen hizmetlerin sağlayıcısı, uygulayıcısı, denetleyicisi veya İşletmelerin yasal temsilcisi, acentesi ya da bayisi değildir.</li>
            <li><strong>2.3.</strong> Bookcy'nin yegâne görevi, Kullanıcı'nın talebini İşletme'ye elektronik olarak ileterek randevu takvimini senkronize etmektir.</li>
          </ul>

          <h3 className="text-xl mt-8 mb-4 text-[#E8622A]">MADDE 3: SORUMLULUK REDDİ VE SINIRLANDIRMASI (ÖNEMLİ)</h3>
          <ul className="list-disc pl-6 space-y-2 bg-orange-50 p-6 rounded-2xl border border-orange-100">
            <li><strong>3.1.</strong> İşletme ile Kullanıcı arasında sunulan hizmetin kalitesi, güvenliği, yasallığı, İşletme'nin vaat ettiği saatte hizmeti sunup sunmaması veya Kullanıcı'nın randevusuna zamanında icabet edip etmemesi tamamen bu iki tarafın kendi sorumluluğundadır.</li>
            <li><strong>3.2.</strong> Hizmetin ifası sırasında veya sonrasında meydana gelebilecek fiziksel yaralanmalar, maddi/manevi zararlar, ayıplı hizmet, haksız fiil, alerjik reaksiyonlar, kayıp/çalıntı eşya veya herhangi bir adli vakadan Bookcy hiçbir koşulda hukuki veya cezai olarak sorumlu tutulamaz. Taraf sıfatı yoktur.</li>
            <li><strong>3.3.</strong> Platform üzerinden alınan randevular neticesinde taraflar arasında yaşanabilecek her türlü ticari, hukuki veya kişisel anlaşmazlık, doğrudan Kullanıcı ve İşletme arasında çözümlenecektir.</li>
          </ul>

          <h3 className="text-xl mt-8 mb-4">MADDE 4: İŞLETMENİN YÜKÜMLÜLÜKLERİ</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>4.1.</strong> İşletme, KKTC yasalarına göre geçerli bir ticari unvana, lisansa ve çalışma iznine sahip olduğunu beyan eder.</li>
            <li><strong>4.2.</strong> İşletme, Platforma girdiği fiyat, hizmet tanımı ve çalışma saatleri gibi bilgilerin doğruluğundan bizzat sorumludur.</li>
            <li><strong>4.3.</strong> İşletme, Bookcy üzerinden aldığı bir randevuyu haklı bir gerekçe olmaksızın iptal edemez. Sürekli mağduriyet yaratan İşletmelerin profilleri Bookcy tarafından tek taraflı olarak askıya alınabilir veya silinebilir.</li>
            <li><strong>4.4.</strong> İşletme, müşteriye sunulan hizmetten doğan tüm vergisel (KDV vb.) yükümlülüklerden bizzat sorumludur. Bookcy yalnızca sağladığı yazılım hizmetinin faturasını İşletme'ye keser.</li>
          </ul>

          <h3 className="text-xl mt-8 mb-4">MADDE 5: KULLANICININ YÜKÜMLÜLÜKLERİ</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>5.1.</strong> Kullanıcı, oluşturduğu randevu saatinden en az 15 (on beş) dakika önce İşletme'de hazır bulunmayı kabul eder.</li>
            <li><strong>5.2.</strong> Geçerli bir mazeret bildirmeksizin (No-Show) üst üste 3 kez randevusuna gitmeyen Kullanıcının Bookcy hesabı, İşletmeleri zarara uğratmamak adına kalıcı olarak kapatılabilir.</li>
            <li><strong>5.3.</strong> Kullanıcı, İşletme'ye ödeyeceği tutarların, İşletme'nin kendi fiyatlandırma politikasına bağlı olduğunu ve olası ücret/iade uyuşmazlıklarında doğrudan İşletme ile muhatap olacağını kabul eder.</li>
          </ul>

          <h3 className="text-xl mt-8 mb-4">MADDE 6: GİZLİLİK VE VERİ GÜVENLİĞİ</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>6.1.</strong> Bookcy, Kullanıcı ve İşletme verilerini KKTC Kişisel Verileri Koruma kurallarına ve genel aydınlatma metnine uygun olarak işler ve saklar.</li>
            <li><strong>6.2.</strong> Kullanıcıların ad, soyad ve iletişim numarası gibi randevu için elzem olan bilgileri, yalnızca randevu alınan İşletme ile (hizmetin ifası amacıyla) paylaşılır.</li>
          </ul>

          <h3 className="text-xl mt-8 mb-4">MADDE 7: UYUŞMAZLIKLARIN ÇÖZÜMÜ VE YETKİLİ MAHKEME</h3>
          <p>
            İşbu sözleşmenin uygulanmasından ve yorumlanmasından doğacak her türlü hukuki ihtilafta KKTC (Kuzey Kıbrıs Türk Cumhuriyeti) Yasaları esastır. Uyuşmazlıkların çözümünde KKTC Lefkoşa Kaza Mahkemeleri ve İcra Daireleri münhasıran yetkilidir.
          </p>

        </article>
      </div>
    </div>
  );
}