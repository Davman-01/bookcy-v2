"use client";
import { useState } from 'react';
import { useAppContext } from '../providers';

// İkonlar İçin SVG Bileşenleri
const IconCheck = () => (
  <svg className="w-5 h-5 text-[#E8622A] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const IconArrowRight = () => (
  <svg className="w-4 h-4 text-[#E8622A] mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

// Etkileşimli Sekme (Tab) Verileri
const tabData = [
  {
    id: "takvim",
    title: "Takviminizi zahmetsizce yönetin",
    desc: "İster tek bir salon işletin ister birden fazla şube, Bookcy ile gününüz her zaman düzenli ve kontrol altında olsun.",
    features: [
      "Randevuları kolaylıkla yönetin",
      "Online rezervasyonlarla takviminizi doldurun",
      "Birkaç saniyede randevu değiştirin veya iptal edin",
      "Takviminize her yerden erişin",
      "Mola ve izin sürelerini takviminize ekleyin",
      "Müşterilere sınırsız WhatsApp hatırlatıcısı gönderin",
      "Ekibinizin verimliliğini optimize edin"
    ],
    mockup: "takvim"
  },
  {
    id: "rezervasyon",
    title: "Tekrar tekrar rezervasyon alın",
    desc: "Bookcy, yeni müşteri çekmeyi ve onları geri getirmeyi kolaylaştırır. Uğraşmadan, stressiz.",
    features: [
      "Birden fazla kanaldan rezervasyon alın",
      "Yeniden rezervasyon için davet gönderin",
      "Son dakika indirimleriyle boş slotları doldurun",
      "Otomatik yorum istek bildirimleri gönderin",
      "Google ve Instagram üzerinden rezervasyon alın",
      "7/24 otomatik randevu sistemi"
    ],
    mockup: "rezervasyon"
  },
  {
    id: "sadakat",
    title: "Müşteri sadakati inşa edin",
    desc: "Önemli olanı hatırlamanıza, kişisel dokunuşlar sunmanıza ve zamanla güven kazanmanıza yardımcı araçlarla müşterilerin geri gelmesini sağlayın.",
    features: [
      "Müşteri geçmişini kaydedin ve takip edin",
      "Tercihler ve özel notları saklayın",
      "Yeniden rezervasyon için otomatik hatırlatıcı gönderin",
      "Bekleme listesi oluşturun",
      "Kişiselleştirilmiş hizmet sunun",
      "Sadakat puanı sistemi ile müşterileri ödüllendirin"
    ],
    mockup: "sadakat"
  },
  {
    id: "yonetim",
    title: "Yönetimde zamandan kazanın",
    desc: "Bookcy, salonunuzu neredeyse kendi kendine işliyormuş gibi hissettiren yazılımdır; böylece ekibinize, müşterilerinize ve sevdiğiniz işe odaklanabilirsiniz.",
    features: [
      "Stok ve malzeme takibi yapın",
      "Tüm muhasebe verilerinize anında erişin",
      "Hizmet ve personel satışlarını takip edin",
      "Müşteri kazanım ve elde tutma oranlarını izleyin",
      "Anlık raporlar ve istatistikler",
      "Tüm şubelerinizi tek ekrandan yönetin"
    ],
    mockup: "yonetim"
  },
  {
    id: "ekip",
    title: "Ekibinizi başarıya hazırlayın",
    desc: "Her ekip üyesindeki en iyiyi ortaya çıkarmak için çalışmalarını destekleyen, programlayan ve öne çıkaran araçlarla.",
    features: [
      "Personele özel esnek fiyatlandırma belirleyin",
      "Personel portfolyolarını sergileyin",
      "Ekip performansını takip edin",
      "Akıllı çalışma programları oluşturun",
      "Takvim erişimini özelleştirin",
      "Personel bazında randevu ve gelir analizi"
    ],
    mockup: "ekip"
  }
];

export default function NedenBookcyPage() {
  const { t } = useAppContext();
  const [activeTab, setActiveTab] = useState("takvim");

  // Kaydırma (Scroll) Fonksiyonları
  const scrollToForm = () => document.getElementById("demo-form")?.scrollIntoView({ behavior: "smooth" });
  const scrollToFeatures = () => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });

  const currentTab = tabData.find(t => t.id === activeTab);

  return (
    <div className="bg-white min-h-screen text-[#111827]">
      
      {/* SECTION 1: HERO */}
      <section className="bg-[#2D1B4E] py-20 md:py-28 text-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-block bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest text-[#E9D5FF] mb-6 uppercase">
            Kıbrıs'ın #1 Platformu
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-8">
            Ekibinin bir parçası gibi çalışan salon yazılımı
          </h1>
          <p className="text-xl md:text-2xl text-[#E9D5FF] mb-12 max-w-2xl mx-auto">
            Bookcy ile randevularını, personelini ve müşteri ilişkilerini tek platformdan yönet. Zamandan kazan, işine odaklan, işletmeni büyüt.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={scrollToForm} className="bg-[#E8622A] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#d4561f] transition transform hover:scale-105">
              Hemen Başlayın
            </button>
            <button onClick={scrollToFeatures} className="text-white px-10 py-4 rounded-full font-bold text-lg border-2 border-white/20 hover:bg-white/10 transition">
              Özellikleri Keşfet
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: İHTİYACINIZ OLAN HER ŞEY (6'lı Kart Sistemi) */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h4 className="text-[#E8622A] font-bold tracking-widest text-sm uppercase mb-3">Neden Bookcy?</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2D1B4E] mb-6">
              İhtiyacınız olan her şey, tek yerde
            </h2>
            <p className="text-[#4B5563] text-lg max-w-2xl mx-auto">
              Kıbrıs'ın en kapsamlı salon yönetim platformu ile işletmenizi bir üst seviyeye taşıyın.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-6">📅</div>
              <h3 className="text-xl font-bold text-[#2D1B4E] mb-3">Akıllı Randevu Sistemi</h3>
              <p className="text-[#4B5563] text-sm mb-6">7/24 açık online rezervasyon sistemiyle müşterileriniz siz uyurken bile randevu alabilir.</p>
              <ul className="space-y-3 text-sm text-[#4B5563]">
                <li className="flex items-start gap-2"><IconArrowRight /> WhatsApp otomatik onay bildirimi</li>
                <li className="flex items-start gap-2"><IconArrowRight /> Randevu hatırlatıcıları ile iptalleri azaltın</li>
                <li className="flex items-start gap-2"><IconArrowRight /> Her yerden takvim yönetimi</li>
              </ul>
            </div>
            {/* Card 2 */}
            <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-6">🌍</div>
              <h3 className="text-xl font-bold text-[#2D1B4E] mb-3">Yeni Müşteri Kazan</h3>
              <p className="text-[#4B5563] text-sm mb-6">Bookcy pazaryerinde yer alın, Kıbrıs'a gelen turistlere, expat'lara ve öğrencilere ulaşın.</p>
              <ul className="space-y-3 text-sm text-[#4B5563]">
                <li className="flex items-start gap-2"><IconArrowRight /> Platform içi keşif sayfasında görünün</li>
                <li className="flex items-start gap-2"><IconArrowRight /> Google ve Instagram entegrasyonu</li>
                <li className="flex items-start gap-2"><IconArrowRight /> Yorum ve puanlama sistemi</li>
              </ul>
            </div>
            {/* Card 3 */}
            <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-6">💰</div>
              <h3 className="text-xl font-bold text-[#2D1B4E] mb-3">Sıfır Komisyon</h3>
              <p className="text-[#4B5563] text-sm mb-6">Her rezervasyondan pay alan global platformların aksine sadece sabit paket ücreti ödersiniz.</p>
              <ul className="space-y-3 text-sm text-[#4B5563]">
                <li className="flex items-start gap-2"><IconArrowRight /> Booksy ve Fresha'dan farklı olarak</li>
                <li className="flex items-start gap-2"><IconArrowRight /> Her kuruşunuz size kalır</li>
                <li className="flex items-start gap-2"><IconArrowRight /> Aylık sabit ve şeffaf fiyatlandırma</li>
              </ul>
            </div>
            {/* Card 4 */}
            <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-6">❤️</div>
              <h3 className="text-xl font-bold text-[#2D1B4E] mb-3">Müşteri Sadakati</h3>
              <p className="text-[#4B5563] text-sm mb-6">Müşteri geçmişini, tercihlerini ve notlarını kaydedin. Her ziyarette kişiselleştirilmiş deneyim sunun.</p>
              <ul className="space-y-3 text-sm text-[#4B5563]">
                <li className="flex items-start gap-2"><IconArrowRight /> Sadakat puanı sistemi</li>
                <li className="flex items-start gap-2"><IconArrowRight /> Yeniden rezervasyon otomasyonu</li>
                <li className="flex items-start gap-2"><IconArrowRight /> Bekleme listesi yönetimi</li>
              </ul>
            </div>
            {/* Card 5 */}
            <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-6">📊</div>
              <h3 className="text-xl font-bold text-[#2D1B4E] mb-3">Anlık Raporlar</h3>
              <p className="text-[#4B5563] text-sm mb-6">Hangi hizmetin en çok tercih edildiğini, en yoğun saatlerinizi ve ekip performansınızı anlık görün.</p>
              <ul className="space-y-3 text-sm text-[#4B5563]">
                <li className="flex items-start gap-2"><IconArrowRight /> Gelir ve randevu analizleri</li>
                <li className="flex items-start gap-2"><IconArrowRight /> Personel performans takibi</li>
                <li className="flex items-start gap-2"><IconArrowRight /> Müşteri elde tutma oranları</li>
              </ul>
            </div>
            {/* Card 6 */}
            <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-6">👥</div>
              <h3 className="text-xl font-bold text-[#2D1B4E] mb-3">Ekip Yönetimi</h3>
              <p className="text-[#4B5563] text-sm mb-6">Her çalışan için özel program, fiyatlandırma ve takvim erişimi tanımlayın.</p>
              <ul className="space-y-3 text-sm text-[#4B5563]">
                <li className="flex items-start gap-2"><IconArrowRight /> Personel portfolyo sayfaları</li>
                <li className="flex items-start gap-2"><IconArrowRight /> Esnek çalışma saatleri</li>
                <li className="flex items-start gap-2"><IconArrowRight /> Rol bazlı erişim yönetimi</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ETKİLEŞİMLİ SEKMELER (TABS) */}
      <section className="py-16 md:py-24 bg-[#FAF7F2]">
        <div className="container mx-auto px-6">
          
          {/* Sekme Butonları */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <button onClick={() => setActiveTab("takvim")} className={`px-6 py-3 rounded-full font-semibold transition ${activeTab === "takvim" ? "bg-[#2D1B4E] text-white" : "bg-white text-[#4B5563] hover:bg-gray-50 border border-gray-200 shadow-sm"}`}>📅 Akıllı Takvim</button>
            <button onClick={() => setActiveTab("rezervasyon")} className={`px-6 py-3 rounded-full font-semibold transition ${activeTab === "rezervasyon" ? "bg-[#2D1B4E] text-white" : "bg-white text-[#4B5563] hover:bg-gray-50 border border-gray-200 shadow-sm"}`}>📱 Daha Fazla Rezervasyon</button>
            <button onClick={() => setActiveTab("sadakat")} className={`px-6 py-3 rounded-full font-semibold transition ${activeTab === "sadakat" ? "bg-[#2D1B4E] text-white" : "bg-white text-[#4B5563] hover:bg-gray-50 border border-gray-200 shadow-sm"}`}>❤️ Müşteri Sadakati</button>
            <button onClick={() => setActiveTab("yonetim")} className={`px-6 py-3 rounded-full font-semibold transition ${activeTab === "yonetim" ? "bg-[#2D1B4E] text-white" : "bg-white text-[#4B5563] hover:bg-gray-50 border border-gray-200 shadow-sm"}`}>📊 Yönetim Araçları</button>
            <button onClick={() => setActiveTab("ekip")} className={`px-6 py-3 rounded-full font-semibold transition ${activeTab === "ekip" ? "bg-[#2D1B4E] text-white" : "bg-white text-[#4B5563] hover:bg-gray-50 border border-gray-200 shadow-sm"}`}>👥 Ekip Yönetimi</button>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Sol Taraf - İçerik */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2D1B4E]">{currentTab.title}</h2>
              <p className="text-[#4B5563] text-lg leading-relaxed">{currentTab.desc}</p>
              <div className="pt-6 space-y-4">
                {currentTab.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 border-b border-gray-200/60 pb-3">
                    <IconCheck />
                    <span className="text-[#4B5563]">{feat}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6">
                <button onClick={scrollToForm} className="bg-[#E8622A] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#d4561f] transition">
                  Ücretsiz Dene →
                </button>
              </div>
            </div>

            {/* Sağ Taraf - Mockup'lar (Tailwind ile Çizilmiş) */}
            <div className="bg-[#F3E8FF]/30 p-8 rounded-[40px] shadow-sm relative overflow-hidden aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center">
              
              {activeTab === "takvim" && (
                <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-[#F1F5F9]">
                  <div className="flex items-center gap-3 mb-6 border-b pb-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-xl">📅</div>
                    <div>
                      <h4 className="font-bold text-[#2D1B4E]">Aylık Takvim Görünümü</h4>
                      <p className="text-xs text-gray-500">Nisan 2026 — Tam doluluk</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-400 mb-2">
                    <div>Pt</div><div>Sa</div><div>Ça</div><div>Pe</div><div>Cu</div><div>Ct</div><div>Pz</div>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(21)].map((_, i) => (
                      <div key={i} className={`aspect-square rounded-md flex items-center justify-center text-sm font-semibold
                        ${[1,2,5,7,8,9,11,12,15,16,17,18,19].includes(i) ? 'bg-[#E8622A] text-white' : ''}
                        ${[0,4,10].includes(i) ? 'bg-[#f5c5a3] text-[#E8622A]' : ''}
                        ${i === 3 ? 'bg-[#2D1B4E] text-white' : ''}
                        ${[6,13,14,20].includes(i) ? 'bg-gray-50 text-gray-400' : ''}
                      `}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "rezervasyon" && (
                <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-[#F1F5F9] space-y-6">
                   <div className="flex items-center gap-3 border-b pb-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl">📲</div>
                    <div>
                      <h4 className="font-bold text-[#2D1B4E]">Bu Haftaki Rezervasyonlar</h4>
                      <p className="text-xs text-gray-500">7 günde 42 yeni randevu</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm font-bold text-[#2D1B4E] mb-1"><span>Bookcy Platformu</span><span>28 randevu</span></div>
                      <div className="h-2 bg-gray-100 rounded-full"><div className="h-2 bg-[#2D1B4E] rounded-full w-[70%]"></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold text-[#2D1B4E] mb-1"><span>Google üzerinden</span><span>9 randevu</span></div>
                      <div className="h-2 bg-gray-100 rounded-full"><div className="h-2 bg-[#E8622A] rounded-full w-[25%]"></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold text-[#2D1B4E] mb-1"><span>Instagram üzerinden</span><span>5 randevu</span></div>
                      <div className="h-2 bg-gray-100 rounded-full"><div className="h-2 bg-[#8B5CF6] rounded-full w-[15%]"></div></div>
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl text-center">
                    <h3 className="text-3xl font-extrabold text-[#E8622A]">%0</h3>
                    <p className="text-xs text-[#E8622A] font-semibold mt-1">Komisyon — her kuruş sende kalır</p>
                  </div>
                </div>
              )}

              {activeTab === "sadakat" && (
                <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-[#F1F5F9] space-y-4">
                   <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-xl">❤️</div>
                    <div>
                      <h4 className="font-bold text-[#2D1B4E]">Müşteri Kartı</h4>
                      <p className="text-xs text-gray-500">Ayşe Kaya — Düzenli Müşteri</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FAF7F2] p-4 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Toplam Ziyaret</p>
                      <p className="text-2xl font-bold text-[#2D1B4E]">24</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <p className="text-xs text-[#E8622A] mb-1">Sadakat Puanı</p>
                      <p className="text-2xl font-bold text-[#E8622A]">480</p>
                    </div>
                  </div>
                  <div className="bg-[#FAF7F2] p-4 rounded-xl text-sm text-gray-600 italic">
                    "Saç boyası için hassas deri. 7 numara fön tercih ediyor. Perşembe öğleden sonra uygun."
                  </div>
                  <div className="border border-orange-200 bg-white p-3 rounded-xl border-l-4 border-l-[#E8622A]">
                    <p className="text-xs font-bold text-[#E8622A]">🔔 Hatırlatıcı Gönderildi</p>
                    <p className="text-[10px] text-gray-500 mt-1">Son randevudan 4 hafta geçti — yeniden rezervasyon daveti iletildi.</p>
                  </div>
                </div>
              )}

              {activeTab === "yonetim" && (
                <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-[#F1F5F9] space-y-4">
                   <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">📊</div>
                    <div>
                      <h4 className="font-bold text-[#2D1B4E]">Aylık Rapor</h4>
                      <p className="text-xs text-gray-500">Nisan 2026</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Toplam Randevu</p>
                      <p className="text-3xl font-bold text-[#2D1B4E]">186</p>
                      <p className="text-[10px] text-green-600 font-bold mt-1">↑ %12 artış</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Yeni Müşteri</p>
                      <p className="text-3xl font-bold text-[#E8622A]">34</p>
                      <p className="text-[10px] text-green-600 font-bold mt-1">↑ %8 artış</p>
                    </div>
                  </div>
                  <div className="pt-2 space-y-3">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">En Popüler Hizmetler</p>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Saç Kesimi</span><span className="font-bold">68 randevu</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Sakal Tıraşı</span><span className="font-bold">52 randevu</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Fön & Şekillendirme</span><span className="font-bold">41 randevu</span></div>
                  </div>
                </div>
              )}

              {activeTab === "ekip" && (
                <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-[#F1F5F9] space-y-4">
                   <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-xl">👥</div>
                    <div>
                      <h4 className="font-bold text-[#2D1B4E]">Ekip Performansı</h4>
                      <p className="text-xs text-gray-500">Bu hafta — 4 personel</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {/* Personel 1 */}
                    <div className="flex items-center justify-between p-3 border rounded-xl hover:shadow-md transition bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#2D1B4E] text-white flex items-center justify-center font-bold text-xs">MA</div>
                        <div>
                          <p className="font-bold text-sm text-[#2D1B4E]">Mehmet Abi</p>
                          <p className="text-[10px] text-gray-500">22 randevu · %96 doluluk</p>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-green-600">★ 4.9</div>
                    </div>
                    {/* Personel 2 */}
                    <div className="flex items-center justify-between p-3 border rounded-xl hover:shadow-md transition bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E8622A] text-white flex items-center justify-center font-bold text-xs">AH</div>
                        <div>
                          <p className="font-bold text-sm text-[#2D1B4E]">Ayşe Hanım</p>
                          <p className="text-[10px] text-gray-500">18 randevu · %88 doluluk</p>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-green-600">★ 4.8</div>
                    </div>
                    {/* Personel 3 */}
                    <div className="flex items-center justify-between p-3 border rounded-xl hover:shadow-md transition bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center font-bold text-xs">HK</div>
                        <div>
                          <p className="font-bold text-sm text-[#2D1B4E]">Hasan Kaya</p>
                          <p className="text-[10px] text-gray-500">15 randevu · %79 doluluk</p>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-green-600">★ 4.7</div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: İŞLETME YORUMLARI */}
      <section className="bg-[#2D1B4E] py-16 md:py-24 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h4 className="text-[#E8622A] font-bold tracking-widest text-sm uppercase mb-3">Bookcy Ortaklarımız</h4>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Kıbrıs'ın en iyi işletmeleri bizi tercih ediyor</h2>
            <p className="text-[#E9D5FF] text-lg">Girne'den Mağusa'ya, onlarca işletme Bookcy ile büyüyor.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Bookcy'yi kullanmaya başladığımdan bu yana WhatsApp mesajlarını yanıtlamak yerine müşterilerime odaklanabiliyorum. Randevularım otomatik geliyor, ben işimi yapıyorum.", name: "Mehmet Kaya", salon: "Kaya Erkek Kuaförü — Girne", initials: "MK" },
              { quote: "Artık telefonuma bakmadan da rahatım. Müşterilerim kendileri randevu alıyor, WhatsApp onayı geliyor. Ayda 20-30 yeni müşteri kazandım sadece platform sayesinde.", name: "Selin Yılmaz", salon: "Selin Güzellik Merkezi — Lefkoşa", initials: "SY" },
              { quote: "Komisyon yok, sabit ücret var. Her rezervasyondan pay ödemek istemiyordum. Bookcy tam da aradığım şeydi. Kıbrıs'ın kendi platformu olması da ayrıca önemli.", name: "Hüseyin Tekin", salon: "Elite Spa — Mağusa", initials: "HT" }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition">
                <div className="flex gap-1 text-[#E8622A] text-xl mb-6">★★★★★</div>
                <p className="text-lg text-white/90 italic mb-8">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-sm text-white/60">{t.salon}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA & DEMO FORM (Lead Generation) */}
      <section id="demo-form" className="py-16 md:py-24 bg-[#FAF7F2]">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2D1B4E] leading-tight">
              Demo talep edin, farkı kendiniz görün
            </h2>
            <p className="text-lg text-[#4B5563]">
              Ekibimiz 48 saat içinde sizinle iletişime geçer. Sizi arayalım, platformu birlikte keşfedelim.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-center gap-3 text-[#2D1B4E] font-medium"><div className="w-2 h-2 bg-[#E8622A] rounded-full"></div> Kurulum desteği ve onboarding tamamen ücretsiz</li>
              <li className="flex items-center gap-3 text-[#2D1B4E] font-medium"><div className="w-2 h-2 bg-[#E8622A] rounded-full"></div> KKTC'ye özel Türkçe destek ekibi</li>
              <li className="flex items-center gap-3 text-[#2D1B4E] font-medium"><div className="w-2 h-2 bg-[#E8622A] rounded-full"></div> Sözleşme yok, taahhüt yok, komisyon yok</li>
            </ul>
          </div>

          <div className="bg-white p-10 rounded-[32px] shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-[#2D1B4E] mb-2">Demo Talep Formu</h3>
            <p className="text-sm text-gray-500 mb-8">Bilgilerinizi bırakın, sizi arayalım.</p>
            
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#2D1B4E] mb-2">İşletme Adı *</label>
                  <input type="text" placeholder="Kaya Berber Salonu" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#E8622A] focus:border-[#E8622A] transition outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D1B4E] mb-2">Ad Soyad *</label>
                  <input type="text" placeholder="Mehmet Kaya" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#E8622A] focus:border-[#E8622A] transition outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#2D1B4E] mb-2">Telefon *</label>
                  <input type="tel" placeholder="+90 5xx xxx xx xx" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#E8622A] focus:border-[#E8622A] transition outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2D1B4E] mb-2">E-posta</label>
                  <input type="email" placeholder="mehmet@salon.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#E8622A] focus:border-[#E8622A] transition outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D1B4E] mb-2">Şehir / Bölge *</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#E8622A] focus:border-[#E8622A] transition outline-none">
                  <option>Seçiniz</option>
                  <option>Lefkoşa</option>
                  <option>Girne</option>
                  <option>Mağusa</option>
                  <option>İskele</option>
                  <option>Güzelyurt</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-[#E8622A] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#d4561f] transition mt-4">
                Demo Talep Et — Ücretsiz →
              </button>
              <p className="text-[11px] text-gray-400 text-center mt-4">
                Ekibimiz en geç 48 saat içinde sizinle iletişime geçer. Gizliliğinize saygı duyuyoruz.
              </p>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}