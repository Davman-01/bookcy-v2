"use client";
import { useAppContext } from '@/app/providers';

// İkonlar İçin Basit SVG Bileşenleri
const IconCheck = () => (
  <svg className="w-5 h-5 text-[#E8622A] mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const IconCoin = () => (
  <div className="p-3 bg-[#E9D5FF] rounded-2xl w-fit mb-6">
    <svg className="w-8 h-8 text-[#2D1B4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </div>
);

const IconChart = () => (
  <div className="p-3 bg-[#E9D5FF] rounded-2xl w-fit mb-6">
    <svg className="w-8 h-8 text-[#2D1B4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  </div>
);

const IconUser = () => (
  <div className="p-3 bg-[#E9D5FF] rounded-2xl w-fit mb-6">
    <svg className="w-8 h-8 text-[#2D1B4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  </div>
);

export default function NedenBookcyPage() {
  const { t, lang } = useAppContext();

  return (
    <div className="bg-white min-h-screen text-[#111827]">
      
      {/* SECTION 1: HERO (İşletme Odaklı Karşılama) */}
      <section className="bg-[#2D1B4E] py-20 md:py-28 text-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-8">
            Ekibinin bir parçası gibi çalışan salon yazılımı
          </h1>
          <p className="text-xl md:text-2xl text-[#E9D5FF] mb-12 max-w-2xl mx-auto">
            Takviminizi yönetin, yeni müşteriler kazanın ve işletmenizi büyütün. Hepsi tek bir platformda.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-[#E8622A] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#d4561f] transition transform hover:scale-105">
              Hemen Başlayın
            </button>
            <button className="text-white px-10 py-4 rounded-full font-bold text-lg border-2 border-white/20 hover:bg-white/10 transition">
              Özellikleri Keşfet
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: TEMEL FAYDALAR KARTLARI (Neden Biz?) */}
      <section className="py-16 md:py-24 bg-[#F9FAFB]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-[#111827] mb-16">
            Kıbrıs'ın En Gelişmiş Salon Yazılımı
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <IconCoin />
              <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">Sıfır Komisyon</h3>
              <p className="text-[#4B5563] text-lg leading-relaxed">
                Online randevularınızdan veya pazar yerinden gelen müşterilerden komisyon almıyoruz. Kazancınızın tamamı size kalır.
              </p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <IconChart />
              <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">Daha Fazla Rezervasyon</h3>
              <p className="text-[#4B5563] text-lg leading-relaxed">
                Müşterilerinize Google, Instagram ve web sitenizden 7/24 randevu alma imkanı sunarak doluluk oranınızı artırın.
              </p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              <IconUser />
              <h3 className="text-2xl font-bold text-[#2D1B4E] mb-4">Kolay Yönetim</h3>
              <p className="text-[#4B5563] text-lg leading-relaxed">
                Tek tıkla takvim çakışmalarını önleyin, personelinizin çalışma saatlerini, tatillerini ve performansını kolayca takip edin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: DETAYLI ÖZELLİKLER LİSTESİ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-[#111827] mb-20">
            Tek Platform, Sonsuz Çözüm
          </h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Sol Taraf - Madde Listesi */}
            <div className="space-y-12">
              <div className="flex items-start gap-4">
                <IconCheck />
                <div>
                  <h4 className="text-xl font-semibold text-[#2D1B4E]">Akıllı Dijital Takvim 📅</h4>
                  <p className="text-[#4B5563]">Sürükle-bırak ile randevuları yönetin, iptalleri azaltın.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <IconCheck />
                <div>
                  <h4 className="text-xl font-semibold text-[#2D1B4E]">Otomatik Randevu Hatırlatıcıları 📲</h4>
                  <p className="text-[#4B5563]">Müşterilere SMS ve bildirim göndererek randevuya gelmeme oranını düşürün.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <IconCheck />
                <div>
                  <h4 className="text-xl font-semibold text-[#2D1B4E]">Müşteri Yönetimi (CRM) 👤</h4>
                  <p className="text-[#4B5563]">Müşteri geçmişini, tercihlerini ve notlarını tek bir yerde güvenle saklayın.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <IconCheck />
                <div>
                  <h4 className="text-xl font-semibold text-[#2D1B4E]">İstatistik & Raporlar 📊</h4>
                  <p className="text-[#4B5563]">Kazancınızı, popüler hizmetlerinizi ve personel performansını anlık görün.</p>
                </div>
              </div>
            </div>

            {/* Sağ Taraf - Demo Görsel / Mockup */}
            <div className="bg-[#2D1B4E] p-8 rounded-3xl shadow-xl aspect-[5/4] flex flex-col gap-4 text-white">
              <div className="h-12 bg-white/10 rounded-xl flex items-center px-4 gap-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full" />
                <div className="h-4 w-32 bg-gray-400 rounded" />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="h-4 w-24 bg-[#E8622A] rounded mb-3" />
                  <div className="h-3 w-16 bg-white/20 rounded mb-1" />
                  <div className="h-3 w-20 bg-white/20 rounded" />
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="h-4 w-24 bg-gray-400 rounded mb-3" />
                  <div className="h-3 w-16 bg-white/20 rounded mb-1" />
                  <div className="h-3 w-20 bg-white/20 rounded" />
                </div>
              </div>
              <p className="text-center text-sm text-white/50 mt-4">Dashboard Tasarım Örneği</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: İŞLETME YORUMLARI (Testimonials) */}
      <section className="bg-[#2D1B4E] py-16 md:py-24 text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            İşletme sahipleri ne diyor?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { quote: "Bookcy sayesinde takvim çakışmaları bitti. Müşterilerim online randevuyu çok sevdi, gelirimiz arttı.", name: "Mehmet Kaya", salon: "Peak Barber 💈", emoji: "🧔‍♂️" },
              { quote: "Personel yönetimim çok kolaylaştı. Kim ne zaman çalışıyor, ne kadar kazanıyor anlık görüyorum.", name: "Ayşe Demir", salon: "Beauty Lab Spa 💅", emoji: "👩‍💼" },
              { quote: "Pazar yerinde listelenmek bize bir sürü yeni müşteri getirdi. Reklam yapmamıza gerek kalmadı.", name: "Selin Yılmaz", salon: "Studio Cut ✂️", emoji: "💇‍♀️" },
              { quote: "Otomatik hatırlatıcılar sayesinde randevu iptallerimiz %80 azaldı. Zamanımız bize kaldı.", name: "Caner Öztürk", salon: "The Gentlemen 🍸", emoji: "🤵‍♂️" }
            ].map((t, i) => (
              <div key={i} className="bg-white/10 p-8 rounded-3xl shadow-lg flex gap-6 border border-white/10 hover:border-white/20 transition">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center font-bold text-4xl">
                  {t.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-lg text-[#E9D5FF] mb-4">"{t.quote}"</p>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-white/70">{t.salon}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA & DEMO FORM (Lead Generation) */}
      <section className="py-16 md:py-24 bg-[#F9FAFB]">
        <div className="container mx-auto px-6 max-w-2xl bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-3xl font-bold text-[#111827] mb-10 text-center">İşletmenizi dijitale taşıyın</h3>
          <form className="space-y-6">
            <input type="text" placeholder="Ad Soyad" className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] bg-white focus:ring-2 focus:ring-[#E8622A] focus:border-[#E8622A]" />
            <input type="text" placeholder="İşletme Adı" className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] bg-white focus:ring-2 focus:ring-[#E8622A] focus:border-[#E8622A]" />
            <input type="tel" placeholder="Telefon Numarası" className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] bg-white focus:ring-2 focus:ring-[#E8622A] focus:border-[#E8622A]" />
            <input type="email" placeholder="E-posta Adresi" className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] bg-white focus:ring-2 focus:ring-[#E8622A] focus:border-[#E8622A]" />
            <div className="flex items-start gap-3 text-left">
              <input type="checkbox" className="mt-1 accent-[#E8622A]" />
              <label className="text-sm text-[#4B5563]">Bookcy tarafından kişisel verilerimin işlenmesine ve iletişim kurulmasına izin veriyorum.</label>
            </div>
            <button type="submit" className="w-full bg-[#E8622A] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#d4561f] transition text-lg transform hover:scale-105">
              Gönder
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}