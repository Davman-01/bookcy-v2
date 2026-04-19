"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../providers';
import { 
  CheckCircle2, Rocket, ShieldCheck, Globe, Zap, 
  ArrowRight, Sparkles, TrendingUp, Users, Clock, Star,
  Smartphone, Calendar, MessageCircle, Gift, MapPin, Mail, Phone
} from 'lucide-react';
import { cyprusRegions, categories } from '../../lib/constants';

export default function NedenBookcyPage() {
  const router = useRouter();
  const { lang = 'TR', t } = useAppContext();
  const text = t?.[lang] || {};

  // Form State
  const [formData, setFormData] = useState({
    shopName: '',
    category: 'Kişisel Bakım',
    location: 'Girne',
    fullName: '',
    phone: '',
    email: ''
  });

  const scrollToForm = () => document.getElementById("demo-form")?.scrollIntoView({ behavior: "smooth" });

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
            <Sparkles size={14} className="text-[#E8622A]"/> Neden Bookcy?
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-[1.1]">
            İşletmen İçin <span className="text-[#E8622A]">En Doğru</span> <br/> Karar.
          </h1>
          <p className="text-xl md:text-2xl text-[#E9D5FF] font-medium leading-relaxed max-w-2xl mx-auto">
            Kıbrıs'ın en gelişmiş randevu sistemini keşfet. Manuel işleri bırak, dijitalin gücünü kullan.
          </p>
        </div>
      </section>

      {/* 2. ALT ALTA DEV KURUMSAL KARTLAR (TÜM MOCKUP'LAR DAHİL) */}
      <section className="max-w-6xl mx-auto px-6 -mt-32 relative z-20 space-y-12">
        
        {/* KART 1: TAKVİM */}
        <div className="bg-white rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shadow-sm"><Calendar size={32}/></div>
            <h2 className="text-3xl md:text-4xl font-black text-[#2D1B4E] uppercase italic">Akıllı Takvim <br/> <span className="text-[#E8622A]">Yönetimi</span></h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">Randevuları saniyeler içinde değiştirin, personelinizi organize edin ve çakışmaları %100 engelleyin.</p>
            <ul className="space-y-3">
              {["7/24 Online Rezervasyon", "WhatsApp Onay Bildirimleri", "Kişisel Mola ve İzin Ayarları"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-sm text-slate-700 uppercase tracking-wide"><CheckCircle2 size={18} className="text-[#E8622A]"/> {f}</li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-50 rounded-[40px] p-8 border border-slate-100 flex justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm border border-[#F1F5F9] animate-in zoom-in-95">
              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-xl">📅</div>
                <div><h4 className="font-bold text-[#2D1B4E] text-sm">Nisan 2026</h4><p className="text-[10px] text-gray-500 font-bold uppercase">Tam Doluluk</p></div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-gray-400 mb-2 font-black"><div>PT</div><div>SA</div><div>ÇA</div><div>PE</div><div>CU</div><div>CT</div><div>PZ</div></div>
              <div className="grid grid-cols-7 gap-2">
                {[...Array(21)].map((_, i) => (
                  <div key={i} className={`aspect-square rounded-md flex items-center justify-center text-xs font-black ${[3,8,9,15,16,19].includes(i) ? 'bg-[#E8622A] text-white shadow-md shadow-orange-200' : 'bg-gray-50 text-gray-300'}`}>{i + 1}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* KART 2: REZERVASYON VE GELİR ANALİZİ */}
        <div className="bg-white rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="lg:order-2 space-y-6">
            <div className="w-16 h-16 bg-orange-50 text-[#E8622A] rounded-3xl flex items-center justify-center shadow-sm"><TrendingUp size={32}/></div>
            <h2 className="text-3xl md:text-4xl font-black text-[#2D1B4E] uppercase italic">Gelirini <br/> <span className="text-[#E8622A]">Katla</span></h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">Google ve Instagram üzerinden gelen yeni müşterilere kapını aç. Komisyon ödemeden büyümenin keyfini çıkar.</p>
            <ul className="space-y-3">
              {["%0 Komisyon Garantisi", "Google Haritalar Rezervasyonu", "Kampanya ve İndirim Araçları"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-sm text-slate-700 uppercase tracking-wide"><CheckCircle2 size={18} className="text-[#E8622A]"/> {f}</li>
              ))}
            </ul>
          </div>
          <div className="lg:order-1 bg-orange-50/50 rounded-[40px] p-8 border border-orange-100/50 flex flex-col gap-4 animate-in slide-in-from-left-10">
             <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100">
                <div className="flex justify-between text-[10px] font-black mb-4 uppercase tracking-widest text-slate-400"><span>Haftalık Kazanç Grafiği</span><span className="text-green-600 bg-green-50 px-2 py-0.5 rounded">↑ %18</span></div>
                <div className="h-32 flex items-end gap-2 justify-between">
                  {[30, 50, 40, 80, 60, 95, 70].map((h, i) => <div key={i} style={{height: `${h}%`}} className="flex-1 bg-[#2D1B4E] rounded-t-lg transition-all hover:bg-[#E8622A]"></div>)}
                </div>
             </div>
             <div className="bg-[#E8622A] p-4 rounded-2xl text-white text-center font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-orange-200">Komisyonsuz Rezervasyon Aktif</div>
          </div>
        </div>

        {/* KART 3: EKİP VE MÜŞTERİ SADAKATİ */}
        <div className="bg-white rounded-[60px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center shadow-sm"><Users size={32}/></div>
            <h2 className="text-3xl md:text-4xl font-black text-[#2D1B4E] uppercase italic">Ekibini <br/> <span className="text-[#E8622A]">Öne Çıkar</span></h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">Personel performansı, müşteri sadakati ve dijital portfolyo yönetimi tek bir noktada.</p>
            <ul className="space-y-3">
              {["Müşteri Sadakat Puanları", "Personel Performans Analizi", "Otomatik Hatırlatıcılar"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-sm text-slate-700 uppercase tracking-wide"><CheckCircle2 size={18} className="text-[#E8622A]"/> {f}</li>
              ))}
            </ul>
          </div>
          <div className="bg-purple-50 rounded-[40px] p-8 border border-purple-100 flex flex-col gap-4">
             {/* Sadakat Kartı Mockup */}
             <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-xl">❤️</div>
                  <div><h4 className="font-black text-[#2D1B4E] text-xs uppercase">Müşteri Kartı</h4><p className="text-[10px] text-slate-400 font-bold">Ayşe Kaya — 480 Puan</p></div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-pink-500 w-[80%]"></div></div>
             </div>
             {/* Personel Mockup */}
             <div className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-md border border-slate-100">
                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#2D1B4E] text-white flex items-center justify-center font-black text-[10px]">MA</div><span className="font-black text-xs uppercase tracking-tighter">Mehmet Abi</span></div>
                <div className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded">4.9 ★</div>
             </div>
          </div>
        </div>

      </section>

      {/* 3. MÜŞTERİ YORUMLARI (GELİŞTİRİLMİŞ) */}
      <section className="bg-[#2D1B4E] py-24 md:py-32 text-white mt-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h4 className="text-[#E8622A] font-bold tracking-widest text-sm uppercase mb-3">İş Ortaklarımız</h4>
            <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter italic">Onlar Bookcy İle Güçlendi</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "WhatsApp mesajlarını yanıtlamak yerine müşterilerime odaklanabiliyorum. Harika!", name: "Mehmet Kaya", salon: "Kaya Erkek Kuaförü — Girne", initials: "MK" },
              { quote: "Ayda 30 yeni müşteri kazandım sadece platform sayesinde. Şiddetle tavsiye ederim.", name: "Selin Yılmaz", salon: "Selin Güzellik Merkezi — Lefkoşa", initials: "SY" },
              { quote: "Komisyon yok, sabit ücret var. Kıbrıs'ın kendi platformu olması çok değerli.", name: "Hüseyin Tekin", salon: "Elite Spa — Mağusa", initials: "HT" }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[48px] hover:bg-white/10 transition-all duration-300">
                <div className="flex gap-1 text-[#E8622A] text-sm mb-6"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
                <p className="text-xl text-white/90 italic font-medium mb-10 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#E8622A] flex items-center justify-center font-black text-white text-xs shadow-lg shadow-orange-500/20">{t.initials}</div>
                  <div><p className="font-black text-white text-sm uppercase tracking-tight">{t.name}</p><p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{t.salon}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TAM TEŞEKKÜLLÜ DEMO FORMU */}
      <section id="demo-form" className="py-32 bg-[#FAF7F2]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white p-8 md:p-16 rounded-[60px] shadow-2xl border border-slate-100 relative">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-5xl font-black text-[#2D1B4E] uppercase italic mb-4">Ücretsiz Kurulum <span className="text-[#E8622A]">Talebi</span></h2>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Bilgilerinizi bırakın, işletmenizi 48 saat içinde dijital dünyaya taşıyalım.</p>
            </div>

            <form className="space-y-6">
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#2D1B4E] uppercase ml-2 tracking-widest">İşletme Adı *</label>
                    <input required type="text" placeholder="Örn: Bookcy Salon" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#E8622A] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#2D1B4E] uppercase ml-2 tracking-widest">Kategori *</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#E8622A] transition-all">
                      {categories.map(c => <option key={c.dbName} value={c.dbName}>{c.dbName}</option>)}
                    </select>
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#2D1B4E] uppercase ml-2 tracking-widest">Bölge *</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#E8622A] transition-all">
                      {cyprusRegions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#2D1B4E] uppercase ml-2 tracking-widest">Ad Soyad *</label>
                    <input required type="text" placeholder="İşletme Sahibi" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#E8622A] transition-all" />
                  </div>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#2D1B4E] uppercase ml-2 tracking-widest">WhatsApp Hattınız *</label>
                    <input required type="tel" placeholder="+90 5xx xxx xx xx" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#E8622A] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#2D1B4E] uppercase ml-2 tracking-widest">E-posta Adresiniz *</label>
                    <input required type="email" placeholder="iletisim@isletme.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-[#E8622A] transition-all" />
                  </div>
               </div>

               <button type="submit" className="w-full bg-[#E8622A] text-white py-6 rounded-[24px] font-black uppercase tracking-[0.2em] text-sm shadow-xl hover:bg-[#d5521d] transition-all mt-6 flex items-center justify-center gap-3">
                  Ücretsiz Kurulumu Başlat <ArrowRight size={20}/>
               </button>
               
               <p className="text-[10px] text-slate-400 text-center font-bold">Kaydınızın ardından ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}