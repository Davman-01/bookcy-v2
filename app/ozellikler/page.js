import Link from 'next/link';

// Gerekli İkonlar İçin Basit SVG Yer Tutucuları
const IconCheck = () => (
  <svg className="w-6 h-6 text-[#E9D5FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

export default function OzelliklerPage() {
  return (
    <div className="bg-white min-h-screen text-[#111827]">
      
      {/* SECTION 1: HERO (image_08347e.jpg) */}
      <section className="bg-[#F9FAFB] py-16 md:py-24">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#111827] leading-tight mb-6">
              Ekibinin bir parçası gibi çalışan salon yazılımı
            </h1>
            <p className="text-xl text-[#4B5563] mb-10">
              Takviminizi yönetin, yeni müşteriler kazanın ve işletmenizi büyütün. Hepsi tek bir platformda.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#E8622A] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#d4561f] transition">
                Demo talep edin
              </button>
              <button className="text-[#111827] px-8 py-3 rounded-full font-semibold border border-[#D1D5DB] hover:bg-gray-100 transition">
                Özellikleri keşfet
              </button>
            </div>
          </div>
          
          {/* Mockup Yer Tutucu (Stilize Edilmiş) */}
          <div className="bg-[#2D1B4E] p-8 rounded-3xl shadow-xl aspect-[5/4] flex flex-col gap-4">
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
          </div>
        </div>
      </section>

      {/* SECTION 2: CALENDAR FEATURE (image_0834bb.png) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          
          {/* Mockup Yer Tutucu - Takvim Grid */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm aspect-[5/4]">
            <div className="h-8 w-40 bg-gray-100 rounded mb-6" />
            <div className="grid grid-cols-7 gap-2">
              {[...Array(31)].map((_, i) => (
                <div key={i} className={`aspect-square rounded-md flex items-center justify-center ${i === 15 ? 'bg-[#2D1B4E] text-white' : 'bg-gray-50 text-gray-400'}`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">
              Takviminizi zahmetsizce yönetin
            </h2>
            <p className="text-lg text-[#4B5563]">
              Sürükle-bırak takvim ile randevuları saniyeler içinde planlayın, iptalleri azaltın ve doluluk oranınızı artırın.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: MARKETPLACE FEATURE (image_083784.png) */}
      <section className="py-16 md:py-24 bg-[#F9FAFB]">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse flex-col-reverse">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">
              Yeni müşterilere ulaşın
            </h2>
            <p className="text-lg text-[#4B5563]">
              İşletmenizi pazar yerimizde listeyerek binlerce potansiyel müşterinin sizi keşfetmesini sağlayın ve online randevu alın.
            </p>
          </div>
          
          {/* Mockup Yer Tutucu - Salon Kartı */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-lg aspect-[5/4] flex flex-col gap-4">
            <div className="h-40 bg-gray-200 rounded-2xl" />
            <div className="h-6 w-1/2 bg-gray-800 rounded" />
            <div className="h-4 w-full bg-gray-100 rounded" />
          </div>
        </div>
      </section>

      {/* SECTION 4: LOYALTY FEATURE (image_0837a4.png) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          
          {/* Mockup Yer Tutucu - Müşteri Profili */}
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm aspect-[5/4] flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-gray-800 rounded" />
                <div className="h-4 w-24 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="h-4 w-full bg-white rounded" />
              <div className="h-4 w-full bg-white rounded" />
              <div className="h-4 w-2/3 bg-white rounded" />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">
              Müşteri sadakatini artırın
            </h2>
            <p className="text-lg text-[#4B5563]">
              Müşteri geçmişini tutun, kişiselleştirilmiş kampanyalar oluşturun ve otomatik randevu hatırlatıcıları göndererek geri gelmelerini sağlayın.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: KEY BENEFITS CARDS (image_0837dc.png) */}
      <section className="bg-[#F9FAFB] py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#111827] mb-16">
            Kıbrıs'ın En Gelişmiş Salon Yazılımı
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#2D1B4E] p-8 rounded-2xl shadow-lg text-white">
              <IconCoin />
              <h3 className="text-2xl font-semibold mb-4">Sıfır Komisyon</h3>
              <p className="text-[#E9D5FF] text-lg">Online randevularınızdan komisyon almıyoruz. Kazancınızın tamamı size kalır.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-[#2D1B4E] p-8 rounded-2xl shadow-lg text-white">
              <IconChart />
              <h3 className="text-2xl font-semibold mb-4">Daha Fazla Rezervasyon</h3>
              <p className="text-[#E9D5FF] text-lg">Müşterilerinize 7/24 randevu alma imkanı sunarak doluluk oranınızı artırın.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-[#2D1B4E] p-8 rounded-2xl shadow-lg text-white">
              <IconUser />
              <h3 className="text-2xl font-semibold mb-4">Kolay Personel Yönetimi</h3>
              <p className="text-[#E9D5FF] text-lg">Ekibinizin çalışma saatlerini, tatillerini ve performansını kolayca takip edin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS (image_0837ff.png) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#111827] mb-16">
            İşletme sahipleri ne diyor?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { quote: "Bookcy sayesinde takvim çakışmaları bitti. Müşterilerim online randevuyu çok sevdi, gelirimiz arttı.", name: "Mehmet Kaya", salon: "Peak Barber" },
              { quote: "Personel yönetimim çok kolaylaştı. Kim ne zaman çalışıyor, ne kadar kazanıyor anlık görüyorum.", name: "Ayşe Demir", salon: "Beauty Lab Spa" },
              { quote: "Pazar yerinde listelenmek bize bir sürü yeni müşteri getirdi. Reklam yapmamıza gerek kalmadı.", name: "Selin Yılmaz", salon: "Studio Cut" },
              { quote: "Otomatik hatırlatıcılar sayesinde randevu iptallerimiz %80 azaldı. Zamanımız bize kaldı.", name: "Caner Öztürk", salon: "The Gentlemen" }
            ].map((t, i) => (
              <div key={i} className="bg-[#2D1B4E] p-8 rounded-2xl shadow-lg text-white flex gap-6">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-bold text-2xl text-[#E9D5FF]">
                  {t.name.split(' ').map(n=>n[0]).join('')}
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

      {/* SECTION 7: CTA & DEMO FORM (image_08383f.png) */}
      <section className="py-16 md:py-24 bg-[#F9FAFB]">
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-6">
            İşletmenizi büyütmeye hazır mısınız?
          </h2>
          <button className="bg-[#E8622A] text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-[#d4561f] transition">
            Hemen Başlayın
          </button>
        </div>
        
        <div className="container mx-auto px-6 max-w-2xl bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-3xl font-bold text-[#111827] mb-10">Demo talep edin</h3>
          <form className="space-y-6">
            <input type="text" placeholder="Ad Soyad" className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-white focus:ring-2 focus:ring-[#E8622A] focus:border-[#E8622A]" />
            <input type="text" placeholder="İşletme Adı" className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-white focus:ring-2 focus:ring-[#E8622A] focus:border-[#E8622A]" />
            <input type="tel" placeholder="Telefon Numarası" className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-white focus:ring-2 focus:ring-[#E8622A] focus:border-[#E8622A]" />
            <input type="email" placeholder="E-posta Adresi" className="w-full px-4 py-3 rounded-lg border border-[#D1D5DB] bg-white focus:ring-2 focus:ring-[#E8622A] focus:border-[#E8622A]" />
            <div className="flex items-start gap-3 text-left">
              <input type="checkbox" className="mt-1 accent-[#E8622A]" />
              <label className="text-sm text-[#4B5563]">Bookcy tarafından kişisel verilerimin işlenmesine ve iletişim kurulmasına izin veriyorum.</label>
            </div>
            <button type="submit" className="w-full bg-[#E8622A] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#d4561f] transition text-lg">
              Gönder
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}