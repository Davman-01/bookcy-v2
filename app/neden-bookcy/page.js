"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../providers';
import { 
  CheckCircle2, Rocket, ShieldCheck, Globe, Zap, 
  ArrowRight, Sparkles, TrendingUp, Users, Clock, Star 
} from 'lucide-react';

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

const tabData = [
  {
    id: "takvim",
    title: "Takviminizi zahmetsizce yönetin",
    desc: "İster tek bir salon işletin ister birden fazla şube, Bookcy ile gününüz her zaman düzenli ve kontrol altında olsun.",
    features: [
      "Randevuları kolaylıkla yönetin",
      "Online rezervasyonlarla takviminizi doldurun",
      "Birkaç saniyede randevu değiştirin veya iptal edin",
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
      "Google ve Instagram üzerinden rezervasyon alın",
      "7/24 otomatik randevu sistemi"
    ],
    mockup: "rezervasyon"
  },
  {
    id: "sadakat",
    title: "Müşteri sadakati inşa edin",
    desc: "Önemli olanı hatırlamanıza ve güven kazanmanıza yardımcı araçlarla müşterilerin geri gelmesini sağlayın.",
    features: [
      "Müşteri geçmişini kaydedin ve takip edin",
      "Tercihler ve özel notları saklayın",
      "Yeniden rezervasyon için otomatik hatırlatıcı",
      "Sadakat puanı sistemi ile ödüllendirin"
    ],
    mockup: "sadakat"
  },
  {
    id: "yonetim",
    title: "Yönetimde zamandan kazanın",
    desc: "Bookcy, salonunuzu neredeyse kendi kendine işliyormuş gibi hissettiren bir yazılımdır.",
    features: [
      "Stok ve malzeme takibi yapın",
      "Tüm muhasebe verilerinize anında erişin",
      "Hizmet ve personel satışlarını takip edin",
      "Anlık raporlar ve istatistikler"
    ],
    mockup: "yonetim"
  },
  {
    id: "ekip",
    title: "Ekibinizi başarıya hazırlayın",
    desc: "Her ekip üyesindeki en iyiyi ortaya çıkarmak için çalışmalarını destekleyen araçlarla.",
    features: [
      "Personele özel esnek fiyatlandırma",
      "Personel portfolyolarını sergileyin",
      "Ekip performansını takip edin",
      "Akıllı çalışma programları oluşturun"
    ],
    mockup: "ekip"
  }
];

export default function NedenBookcyPage() {
  const router = useRouter();
  const { lang = 'TR' } = useAppContext();
  const [activeTab, setActiveTab] = useState("takvim");

  const scrollToForm = () => document.getElementById("demo-form")?.scrollIntoView({ behavior: "smooth" });
  const currentTab = tabData.find(t => t.id === activeTab) || tabData[0];

  return (
    <div className="w-full bg-white min-h-screen font-['Plus_Jakarta_Sans']">
      
      {/* 1. HERO SECTION */}
      <section className="bg-[#2D1B4E] pt-32 pb-48 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#E8622A] rounded-full blur-[150px]"></div>
          <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-[#8B5CF6] rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-[#E9D5FF] text-xs font-black tracking-[0.2em] uppercase mb-8">
            <Sparkles size={14} className="text-[#E8622A]"/> Kıbrıs'ın #1 Çözümü
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-[1.1]">
            İşletmeni <span className="text-[#E8622A]">Büyüten</span> <br/> Akıllı Teknoloji
          </h1>
          <p className="text-xl md:text-2xl text-[#E9D5FF] font-medium leading-relaxed max-w-2xl mx-auto">
            Bookcy ile randevularını, personelini ve müşteri ilişkilerini tek platformdan yönet. Zamandan kazan, işletmeni şifrele.
          </p>
        </div>
      </section>

      {/* 2. ETKİLEŞİMLİ SEKMELİ MOCKUP KARTI */}
      <section className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
        <div className="bg-white rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
          
          {/* Tab Menü */}
          <div className="flex flex-wrap bg-slate-50 border-b border-slate-100 p-2">
            {tabData.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[140px] py-6 px-4 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab.id 
                  ? "bg-white text-[#E8622A] shadow-sm rounded-2xl" 
                  : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.id}
              </button>
            ))}
          </div>

          <div className="p-8 md:p-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Sol İçerik */}
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl font-black text-[#2D1B4E] uppercase italic leading-tight">
                  {currentTab.title}
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                  {currentTab.desc}
                </p>
                <div className="space-y-4">
                  {currentTab.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                      <IconCheck />
                      <span className="text-slate-700 font-bold text-sm uppercase">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sağ - Senin Orijinal Mockup Çizimlerin */}
              <div className="bg-[#F3E8FF]/30 p-8 rounded-[40px] shadow-inner relative overflow-hidden flex items-center justify-center min-h-[400px]">
                
                {activeTab === "takvim" && (
                  <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-[#F1F5F9] animate-in zoom-in-95">
                    <div className="flex items-center gap-3 mb-6 border-b pb-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-xl">📅</div>
                      <div><h4 className="font-bold text-[#2D1B4E]">Nisan 2026</h4><p className="text-xs text-gray-500">Tam Doluluk</p></div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-gray-400 mb-2"><div>Pt</div><div>Sa</div><div>Ça</div><div>Pe</div><div>Cu</div><div>Ct</div><div>Pz</div></div>
                    <div className="grid grid-cols-7 gap-2">
                      {[...Array(21)].map((_, i) => (
                        <div key={i} className={`aspect-square rounded-md flex items-center justify-center text-xs font-semibold ${[1,2,5,7,8,9,11,12,15,16,17,18,19].includes(i) ? 'bg-[#E8622A] text-white' : 'bg-gray-50 text-gray-300'}`}>{i + 1}</div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "rezervasyon" && (
                  <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-[#F1F5F9] space-y-6 animate-in zoom-in-95">
                    <div className="flex items-center gap-3 border-b pb-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl">📲</div>
                      <div><h4 className="font-bold text-[#2D1B4E]">Yeni Rezervasyonlar</h4><p className="text-xs text-gray-500">Haftalık Rapor</p></div>
                    </div>
                    <div className="space-y-4">
                      <div><div className="flex justify-between text-[10px] font-bold text-[#2D1B4E] mb-1"><span>Google</span><span>%25</span></div><div className="h-2 bg-gray-100 rounded-full"><div className="h-2 bg-[#E8622A] rounded-full w-[25%]"></div></div></div>
                      <div><div className="flex justify-between text-[10px] font-bold text-[#2D1B4E] mb-1"><span>Instagram</span><span>%45</span></div><div className="h-2 bg-gray-100 rounded-full"><div className="h-2 bg-[#8B5CF6] rounded-full w-[45%]"></div></div></div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl text-center"><h3 className="text-3xl font-black text-[#E8622A]">%0</h3><p className="text-[10px] text-[#E8622A] font-bold uppercase">Komisyon</p></div>
                  </div>
                )}

                {activeTab === "sadakat" && (
                  <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-[#F1F5F9] space-y-4 animate-in zoom-in-95">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-xl">❤️</div><div><h4 className="font-bold text-[#2D1B4E]">Müşteri Kartı</h4><p className="text-xs text-gray-500">Ayşe Kaya</p></div></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#FAF7F2] p-4 rounded-xl"><p className="text-[10px] text-gray-400">Ziyaret</p><p className="text-xl font-bold text-[#2D1B4E]">24</p></div>
                      <div className="bg-orange-50 p-4 rounded-xl"><p className="text-[10px] text-[#E8622A]">Puan</p><p className="text-xl font-bold text-[#E8622A]">480</p></div>
                    </div>
                  </div>
                )}

                {activeTab === "yonetim" && (
                  <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-[#F1F5F9] space-y-4 animate-in zoom-in-95">
                    <div className="flex items-center gap-3"><div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl">📊</div><div><h4 className="font-bold text-[#2D1B4E]">Aylık Gelir</h4><p className="text-xs text-gray-500">Nisan Raporu</p></div></div>
                    <div className="h-32 flex items-end gap-2 justify-between">
                      {[40, 70, 45, 90, 65, 80].map((h, i) => <div key={i} style={{height: `${h}%`}} className="w-full bg-[#2D1B4E] rounded-t-lg"></div>)}
                    </div>
                  </div>
                )}

                {activeTab === "ekip" && (
                  <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md border border-[#F1F5F9] space-y-3 animate-in zoom-in-95">
                    <div className="flex items-center justify-between p-3 border rounded-xl bg-white shadow-sm">
                      <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#E8622A] text-white flex items-center justify-center text-[10px] font-bold">MA</div><p className="font-bold text-xs">Mehmet Abi</p></div>
                      <div className="text-[10px] font-black text-green-600">★ 4.9</div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MÜŞTERİ YORUMLARI (Senin Kodun) */}
      <section className="bg-[#2D1B4E] py-24 md:py-32 text-white mt-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h4 className="text-[#E8622A] font-bold tracking-widest text-sm uppercase mb-3">Ortaklarımız</h4>
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">İşletmeler Bookcy ile Büyüyor</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "WhatsApp mesajlarını yanıtlamak yerine müşterilerime odaklanabiliyorum. Harika!", name: "Mehmet Kaya", salon: "Kaya Erkek Kuaförü — Girne", initials: "MK" },
              { quote: "Ayda 30 yeni müşteri kazandım sadece platform sayesinde. Şiddetle tavsiye ederim.", name: "Selin Yılmaz", salon: "Selin Güzellik Merkezi — Lefkoşa", initials: "SY" },
              { quote: "Komisyon yok, sabit ücret var. Kıbrıs'ın kendi platformu olması çok değerli.", name: "Hüseyin Tekin", salon: "Elite Spa — Mağusa", initials: "HT" }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition">
                <div className="flex gap-1 text-[#E8622A] text-sm mb-6"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                <p className="text-lg text-white/90 italic mb-8">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E8622A] flex items-center justify-center font-bold text-white text-xs">{t.initials}</div>
                  <div><p className="font-bold text-white text-sm">{t.name}</p><p className="text-xs text-white/50">{t.salon}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DEMO FORMU (Senin Kodun) */}
      <section id="demo-form" className="py-24 bg-[#FAF7F2]">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-[#2D1B4E] uppercase tracking-tighter italic">Demo Talep Edin</h2>
            <p className="text-lg text-slate-500 font-medium">Ekibimiz 48 saat içinde sizinle iletişime geçer. Platformu birlikte keşfedelim.</p>
          </div>
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100">
            <form className="space-y-5">
              <input placeholder="İşletme Adı" className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold outline-none focus:border-[#E8622A]" />
              <input placeholder="Telefon" className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold outline-none focus:border-[#E8622A]" />
              <button className="w-full bg-[#E8622A] text-white py-5 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg">Demo Talep Et →</button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}