"use client";
import React from 'react';
import { Zap, CheckCircle2 } from 'lucide-react';

const features = [
  {
    title: "Dijital Vitrin",
    subTitle: "Bookcy Business Profile",
    description: "İşletmenizin tüm detaylarını, hizmetlerini ve kalitesini yansıtan, Google SEO uyumlu profesyonel bir dijital kimlik.",
    image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=800&auto=format&fit=crop",
    tags: ["SEO Uyumlu", "Foto Galeri"]
  },
  {
    title: "Akıllı Randevu",
    subTitle: "7/24 Rezervasyon",
    description: "Siz uyurken bile dükkanınız açık kalsın. Müşterileriniz saniyeler içinde uygun saati seçsin, randevu anında cebinize düşsün.",
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&auto=format&fit=crop",
    tags: ["Anlık Bildirim", "Otomatik Takvim"]
  },
  {
    title: "Global CRM",
    subTitle: "Müşteri Yönetimi",
    description: "Tüm müşteri veritabanınızı tek merkezden yönetin. Kim ne zaman geldi, hangi hizmeti aldı? Her şey kontrolünüz altında.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    tags: ["Segmentasyon", "Data Analizi"]
  },
  {
    title: "Toplu Pazarlama",
    subTitle: "E-Posta & SMS",
    description: "Filtrelediğiniz hedef kitleye tek tıkla ulaşın. Kampanyalarınızı binlerce kişiye aynı anda göndererek cironuzu katlayın.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop",
    tags: ["Bulk Email", "Kampanya Yönetimi"]
  },
  {
    title: "Ekip Yönetimi",
    subTitle: "Personel Takibi",
    description: "Sınırsız personel ekleyin. Kim ne kadar ciro yaptı, hangi uzman daha popüler? Performansı verilerle ölçün.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    tags: ["Ciro Takibi", "Özel Yetkiler"]
  },
  {
    title: "Finansal Raporlar",
    subTitle: "Muhasebe & Analiz",
    description: "Karmaşık tablolara son. Günlük kazancınızı, popüler hizmetlerinizi ve gelecek tahminlerinizi görsel grafiklerle izleyin.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    tags: ["Net Kazanç", "Görsel Grafikler"]
  },
  {
    title: "Loca & Etkinlik",
    subTitle: "VIP Rezervasyon",
    description: "Bar ve Club'lar için özel loca yönetimi. DJ partileri oluşturun, bilet ve masa kapasitelerini anlık yönetin.",
    image: "https://images.unsplash.com/photo-1514525253361-bee8718a747c?q=80&w=800&auto=format&fit=crop",
    tags: ["Kapasite Kontrolü", "Bilet Satış"]
  },
  {
    title: "Bölgesel Keşif",
    subTitle: "Pazaryeri Gücü",
    description: "Bookcy ekosistemindeki binlerce kullanıcıya doğrudan ulaşın. Bulunduğunuz bölgede aramalarla en ön sırada yer alın.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop",
    tags: ["Bölgesel Filtre", "Müşteri Erişimi"]
  },
  {
    title: "Veri Güvenliği",
    subTitle: "Askeri Düzey Koruma",
    description: "Tüm verileriniz satır bazlı güvenlik (RLS) ile korunur. Ticari sırlarınız ve müşteri listeniz sadece sizin erişiminize açıktır.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    tags: ["RLS Koruması", "Cloud Backup"]
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#F1F3F6] font-['DM_Sans']">
      
      {/* HERO SECTION */}
      <section className="bg-[#2D1B4E] text-white py-28 px-4 relative">
        <div className="max-w-5xl mx-auto text-center">
            <span className="bg-[#E8622A]/20 text-[#E8622A] px-4 py-2 rounded-full text-xs font-black tracking-widest mb-6 inline-block uppercase">
                Kurumsal Çözüm Ortaklığı
            </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8">
            İŞLETMENİZ İÇİN <br/><span className="text-[#E8622A]">TAM KONTROL.</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Sıradan bir randevu sisteminden çok daha fazlası. Bookcy, modern işletmelerin ihtiyaç duyduğu tüm dijital araçları tek bir çatı altında sunar.
          </p>
        </div>
      </section>

      {/* FEATURES CARDS GRID */}
      <section className="py-24 px-4 -mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200 flex flex-col"
              >
                {/* Image Header */}
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#2D1B4E]/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={f.image} 
                    alt={f.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="bg-white/90 backdrop-blur text-[#2D1B4E] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                        {f.subTitle}
                    </span>
                  </div>
                </div>
                
                {/* Content Body */}
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-[#2D1B4E] uppercase tracking-tight mb-4 group-hover:text-[#E8622A] transition-colors">
                    {f.title}
                  </h3>
                  
                  <p className="text-slate-500 font-medium leading-relaxed mb-8 text-sm">
                    {f.description}
                  </p>
                  
                  {/* Footer Tags */}
                  <div className="mt-auto pt-6 border-t border-slate-50 flex flex-wrap gap-2">
                    {f.tags.map((tag, ti) => (
                      <span key={ti} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-slate-400">
                        <CheckCircle2 size={12} className="text-[#E8622A]"/> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto bg-[#2D1B4E] rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8622A] opacity-10 blur-[100px]"></div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-6 leading-tight">
            Geleceğin İşletmesini <br/> Bugün İnşa Edin
          </h2>
          <p className="text-slate-300 mb-10 font-medium">Bookcy dünyasına katılın, dijitalleşmenin ve büyümenin keyfini sürün.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button className="w-full md:w-auto bg-[#E8622A] text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all shadow-xl">
                ÜCRETSİZ DENEMEYİ BAŞLAT
            </button>
            <button className="w-full md:w-auto bg-white/5 text-white border border-white/10 px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white/10 transition-all">
                SATIŞ EKİBİYLE GÖRÜŞ
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}