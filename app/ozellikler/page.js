"use client";
import React from 'react';
import { 
  Store, CalendarCheck, Users, Target, BarChart3, 
  Ticket, Globe, BellRing, ShieldCheck, Zap
} from 'lucide-react';
// Not: Header ve Footer bileşenlerini kendi projendeki yollara göre ayarlayabilirsin.
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';

const features = [
  {
    icon: <Globe size={32} strokeWidth={1.5} />,
    title: "Dijital Vitrin (Bookcy Profili)",
    description: "İşletmenizin dijital kimliğini saniyeler içinde oluşturun. Çalışma saatlerinizi, detaylı hizmet menünüzü, fiyatlarınızı ve galerinizi tek bir merkezden yöneterek müşterilerinize profesyonel bir imaj çizin.",
    tags: ["Özel Galeri", "WhatsApp Entegrasyonu", "Esnek Çalışma Saatleri"]
  },
  {
    icon: <CalendarCheck size={32} strokeWidth={1.5} />,
    title: "7/24 Online Randevu",
    description: "Müşterilerinizin dükkan kapalıyken bile günün her saati randevu almasını sağlayın. Akıllı takvim yönetimimiz sayesinde çakışmaları önleyin, boş slotlarınızı otomatik doldurun ve zaman kazanın.",
    tags: ["Akıllı Takvim", "Hızlı Kayıt Modülü", "Anlık Durum Kontrolü"]
  },
  {
    icon: <Target size={32} strokeWidth={1.5} />,
    title: "Gelişmiş CRM ve Pazarlama",
    description: "Müşteri sadakatini zirveye taşıyın. Gelişmiş segmentasyon ile (ör: 1 aydır gelmeyenler, VIP müşteriler) hedef kitlenizi belirleyin ve tek tıkla binlerce kişiye Toplu E-Posta veya SMS kampanyaları düzenleyin.",
    tags: ["Dinamik Segmentasyon", "Toplu Mail (Bulk Email)", "Müşteri Analizi"]
  },
  {
    icon: <Users size={32} strokeWidth={1.5} />,
    title: "Kapsamlı Ekip Yönetimi",
    description: "Sınırsız personel ekleyin ve ekibinizin performansını anlık takip edin. Kimin ne kadar ciro yaptığını görün, personellere özel şifreli panel giriş yetkileri tanımlayın ve işletme kontrolünü elinizde tutun.",
    tags: ["Performans Ölçümü", "Yetkilendirme (RLS)", "Uzman Seçimi"]
  },
  {
    icon: <BarChart3 size={32} strokeWidth={1.5} />,
    title: "Detaylı Finans ve Raporlama",
    description: "İşletmenizin finansal nabzını tutun. Günlük, haftalık ve aylık gelir tablolarınızı, en çok satan hizmetlerinizi ve personel bazlı kazanç istatistiklerinizi karmaşık Excel tabloları olmadan tek ekranda analiz edin.",
    tags: ["Ciro Tahmini", "Popüler Hizmetler", "Görsel Grafikler"]
  },
  {
    icon: <Ticket size={32} strokeWidth={1.5} />,
    title: "Loca ve Etkinlik Yönetimi",
    description: "Eğlence sektörü (Bar & Club) için özel tasarlanmış modül. Kendi DJ partilerinizi ve etkinliklerinizi oluşturun, afişlerinizi yükleyin. Loca, bistro ve bilet kapasitelerini fiyatlandırarak kolayca rezerve edin.",
    tags: ["Afiş Yükleme", "Kapasite Kontrolü", "Etkinlik Takvimi"]
  },
  {
    icon: <Store size={32} strokeWidth={1.5} />,
    title: "Pazaryeri Ayrıcalığı",
    description: "Bookcy sadece bir yazılım değil, aynı zamanda dev bir pazaryeridir. Platformu aktif olarak kullanan binlerce müşteriye doğrudan ulaşın. Bölge bazlı aramalarda öne çıkarak yeni müşteriler kazanın.",
    tags: ["Bölgesel Keşif", "Doğrudan Erişim", "SEO Uyumlu Profil"]
  },
  {
    icon: <BellRing size={32} strokeWidth={1.5} />,
    title: "Otomatik Bildirimler",
    description: "Randevu unutulmalarına son verin. İşlem durumları ('Tamamlandı', 'İptal') güncellendiğinde veya yeni rezervasyon geldiğinde anlık bildirimler alarak operasyonel süreçlerinizi hızlandırın.",
    tags: ["Durum Bildirimleri", "Hatırlatıcılar", "Sıfır İletişim Kopukluğu"]
  },
  {
    icon: <ShieldCheck size={32} strokeWidth={1.5} />,
    title: "Üst Düzey Veri Güvenliği",
    description: "Müşteri verileriniz ve ticari sırlarınız askeri düzeyde şifreleme (RLS) ile korunur. Hiçbir işletme diğerinin verisine ulaşamaz. Sisteminize sadece sizin yetki verdiğiniz kişiler erişebilir.",
    tags: ["Satır Bazlı Güvenlik (RLS)", "İzole Veritabanı", "Bulut Yedekleme"]
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-['DM_Sans'] flex flex-col">
      {/* <Header /> */}

      {/* HERO SECTION */}
      <section className="bg-[#2D1B4E] text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 150%, #E8622A 0%, transparent 50%)' }}></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">
            TÜM <span className="text-[#E8622A]">ÖZELLİKLER</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            İşletmenizi dijitalleştirirken ihtiyaç duyduğunuz her şey tek bir platformda. Bookcy ile tanışın, kontrolü elinize alın ve büyümenin keyfini çıkarın.
          </p>
        </div>
      </section>

      {/* FEATURES GRID SECTION */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#E8622A]/30 transition-all duration-300 group flex flex-col h-full"
              >
                <div className="w-16 h-16 bg-orange-50 text-[#E8622A] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-black text-[#2D1B4E] uppercase tracking-tight mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed font-medium mb-8 flex-1">
                  {feature.description}
                </p>
                
                <div className="mt-auto pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                  {feature.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex} 
                      className="bg-slate-50 text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-4 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center bg-[#F8F9FA] rounded-[40px] p-12 md:p-20 border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-white shadow-lg rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap size={32} className="text-[#E8622A]"/>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#2D1B4E] uppercase tracking-tight mb-6">
            İşletmenizi Çağ Atlatmaya Hazır Mısınız?
          </h2>
          <p className="text-slate-600 font-medium mb-10 max-w-2xl mx-auto">
            Hemen ücretsiz deneme sürenizi başlatın, Bookcy'nin gücünü kendi işletmenizde risk almadan test edin.
          </p>
          <button className="bg-[#E8622A] hover:bg-orange-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
            Ücretsiz Denemeye Başla
          </button>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
}