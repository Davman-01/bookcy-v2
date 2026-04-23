"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, MapPin, Scissors, Search, Filter, 
  Store, Calendar, Download, Send, ShieldAlert,
  ArrowLeft, LayoutDashboard, PieChart, FileCode2,
  Rocket, Plus, Trash2, ArrowRight
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function SuperAdminCRM() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // CRM Menü Tabları
  const [crmTab, setCrmTab] = useState('dashboard'); // dashboard, segments, templates, campaigns
  const [showSegmentBuilder, setShowSegmentBuilder] = useState(false);
  
  // İstatistikler (Gerçek Tablodan Gelecek)
  const [stats, setStats] = useState({ totalUsers: 0, totalBookings: 0, activeShops: 0 });

  // MOCK VERİLER (Sana sistemi göstermek için. Onaylayınca Supabase'e bağlayacağız)
  const mockSegments = [
    { id: 1, name: 'Son 1 aydır gelmeyenler (Uyuyan Kitle)', count: 1240 },
    { id: 2, name: 'Girne Bölgesi VIP Müşteriler (Ciro > 5000TL)', count: 350 },
    { id: 3, name: 'Sadece Saç Kesimi Yaptıran Erkekler', count: 890 }
  ];

  const mockTemplates = [
    { id: 1, name: 'Hoş Geldin İndirimi', subject: 'Aramıza Hoş Geldin! İlk İşlemde %20 İndirim' },
    { id: 2, name: 'Kendini Özlettin', subject: 'Sizi Çok Özledik! Hemen Randevu Alın' },
    { id: 3, name: 'Bayram Özel Kampanyası', subject: 'Bayrama Hazırlık Başladı! Özel İndirimler İçeride' }
  ];

  const mockCampaigns = [
    { id: 1, name: 'Girne VIP Davet', segment: 'Girne Bölgesi VIP', status: 'Tamamlandı', sent: 350, opened: 280, clicked: 45 },
    { id: 2, name: 'Uyuyanları Uyandır', segment: 'Son 1 aydır gelmeyenler', status: 'Gönderiliyor', sent: 600, opened: 120, clicked: 10 }
  ];

  useEffect(() => {
    fetchAllPlatformData();
  }, []);

  async function fetchAllPlatformData() {
    setLoading(true);
    // Yalnızca rakamları almak için hızlı sorgu
    const { data: appts } = await supabase.from('appointments').select(`id, customer_email, customer_phone, shop_id`);
    const { data: shops } = await supabase.from('shops').select(`id`);
    
    if (appts && shops) {
      const uniquePhones = new Set(appts.map(a => a.customer_phone).filter(Boolean));
      setStats({
        totalUsers: uniquePhones.size,
        totalBookings: appts.length,
        activeShops: shops.length
      });
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-['DM Sans'] text-[#2D1B4E] bg-[#F8F9FA]">
        <ShieldAlert size={64} className="text-[#E8622A] animate-pulse mb-6"/>
        <h1 className="text-2xl font-black uppercase tracking-widest">CRM Motoru Başlatılıyor</h1>
        <p className="text-slate-500 font-bold mt-2">Büyük veri analiz ediliyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-['DM Sans'] text-[#2D1B4E] flex flex-col">
      
      {/* ÜST BAR (NAVİGASYON) */}
      <header className="bg-[#2D1B4E] text-white px-8 py-5 flex items-center justify-between shadow-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => router.push('/admin')} className="text-white/50 hover:text-white bg-white/10 p-2 rounded-xl border-none cursor-pointer transition-colors">
            <ArrowLeft size={20}/>
          </button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              <ShieldAlert className="text-[#E8622A]"/> GLOBAL CRM MERKEZİ
            </h1>
            <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mt-1">Bookcy Süper Admin Pazarlama Otomasyonu</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-[10px] uppercase font-black text-white/50">Erişilebilir Data</p>
            <p className="text-lg font-black text-[#E8622A]">{stats.totalUsers.toLocaleString('tr-TR')} Kişi</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto w-full gap-8">
        
        {/* SEKME MENÜSÜ */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 shrink-0 border-b border-slate-200">
          <button onClick={() => setCrmTab('dashboard')} className={`flex items-center gap-2 px-8 py-4 rounded-t-2xl font-black text-xs uppercase tracking-widest border-none cursor-pointer transition-all ${crmTab === 'dashboard' ? 'bg-white text-[#2D1B4E] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-b-4 border-b-[#E8622A]' : 'bg-transparent text-slate-400 hover:bg-white/50'}`}>
            <PieChart size={18}/> Analiz & Özet
          </button>
          <button onClick={() => setCrmTab('segments')} className={`flex items-center gap-2 px-8 py-4 rounded-t-2xl font-black text-xs uppercase tracking-widest border-none cursor-pointer transition-all ${crmTab === 'segments' ? 'bg-white text-[#2D1B4E] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-b-4 border-b-[#E8622A]' : 'bg-transparent text-slate-400 hover:bg-white/50'}`}>
            <Filter size={18}/> Kitleler (Segment)
          </button>
          <button onClick={() => setCrmTab('templates')} className={`flex items-center gap-2 px-8 py-4 rounded-t-2xl font-black text-xs uppercase tracking-widest border-none cursor-pointer transition-all ${crmTab === 'templates' ? 'bg-white text-[#2D1B4E] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-b-4 border-b-[#E8622A]' : 'bg-transparent text-slate-400 hover:bg-white/50'}`}>
            <FileCode2 size={18}/> Şablonlar
          </button>
          <button onClick={() => setCrmTab('campaigns')} className={`flex items-center gap-2 px-8 py-4 rounded-t-2xl font-black text-xs uppercase tracking-widest border-none cursor-pointer transition-all ${crmTab === 'campaigns' ? 'bg-white text-[#2D1B4E] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-b-4 border-b-[#E8622A]' : 'bg-transparent text-slate-400 hover:bg-white/50'}`}>
            <Rocket size={18}/> Kampanyalar
          </button>
        </div>

        {/* 1. ÖZET ANALİZ TABI */}
        {crmTab === 'dashboard' && (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Toplam Platform Hedef Kitlesi</p>
                <p className="text-5xl font-black text-[#2D1B4E]">{stats.totalUsers.toLocaleString('tr-TR')}</p>
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Bu Ay Gönderilen Mail/SMS</p>
                <p className="text-5xl font-black text-blue-500">12,450</p>
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Ortalama Tıklama Oranı (CTR)</p>
                <p className="text-5xl font-black text-green-500">%18.4</p>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-black text-[#2D1B4E] uppercase">Aktif Kampanya Akışı</h3>
                <button className="text-[#E8622A] font-bold text-xs uppercase cursor-pointer bg-transparent border-none hover:underline">Tümünü Gör</button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Kampanya Adı</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Hedef Kitle</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Gönderilen</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Açılma</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Dönüşüm</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCampaigns.map(camp => (
                    <tr key={camp.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6 font-bold text-[#2D1B4E]">{camp.name}</td>
                      <td className="px-8 py-6 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded inline-block mt-4 ml-4">{camp.segment}</td>
                      <td className="px-8 py-6 text-center font-black text-slate-600">{camp.sent}</td>
                      <td className="px-8 py-6 text-center font-black text-blue-500">% {Math.round((camp.opened/camp.sent)*100)}</td>
                      <td className="px-8 py-6 text-center font-black text-green-500">% {Math.round((camp.clicked/camp.sent)*100)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. KİTLELER (SEGMENTS) TABI */}
        {crmTab === 'segments' && (
          <div className="animate-in fade-in duration-500 h-full">
            {!showSegmentBuilder ? (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-[#2D1B4E] uppercase tracking-tight">Dinamik Kitleler</h3>
                    <p className="text-sm font-bold text-slate-400 mt-1">Davranışsal kurallara göre kendini güncelleyen müşteri grupları.</p>
                  </div>
                  <button onClick={() => setShowSegmentBuilder(true)} className="bg-[#E8622A] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest border-none cursor-pointer flex items-center gap-2 shadow-xl hover:scale-105 transition-transform">
                    <Filter size={16}/> Yeni Kitle Yarat
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockSegments.map(seg => (
                    <div key={seg.id} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8622A]/5 rounded-bl-full pointer-events-none group-hover:bg-[#E8622A]/10 transition-colors"></div>
                      <h4 className="font-black text-[#2D1B4E] uppercase text-lg mb-4">{seg.name}</h4>
                      <div className="flex flex-wrap gap-2 mb-8">
                        <span className="bg-slate-50 border border-slate-100 text-slate-500 text-[10px] px-3 py-1.5 rounded-lg font-bold">Zaman Bazlı</span>
                        <span className="bg-slate-50 border border-slate-100 text-slate-500 text-[10px] px-3 py-1.5 rounded-lg font-bold">Hizmet Bazlı</span>
                      </div>
                      <div className="mt-auto border-t border-slate-100 pt-6 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Eşleşen Kişi</p>
                          <p className="text-2xl font-black text-[#E8622A]">{seg.count}</p>
                        </div>
                        <button className="bg-slate-100 text-slate-500 hover:bg-[#2D1B4E] hover:text-white w-10 h-10 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors">
                          <ArrowRight size={18}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* KİTLE OLUŞTURUCU (SEGMENT BUILDER) */
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl p-8 md:p-12 animate-in zoom-in-95">
                <button onClick={() => setShowSegmentBuilder(false)} className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-8 flex items-center gap-2 bg-transparent border-none cursor-pointer hover:text-[#2D1B4E]">
                  <ArrowLeft size={16}/> Kitlelere Dön
                </button>
                <h3 className="text-3xl font-black text-[#2D1B4E] uppercase tracking-tight mb-8 border-b border-slate-100 pb-6">Kural Motoru (Rule Builder)</h3>
                
                <div className="max-w-4xl">
                  <input type="text" placeholder="Kitlenize bir ad verin (Örn: Sadık Müşteriler)" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 font-black text-lg outline-none focus:border-[#E8622A] mb-8"/>
                  
                  <div className="bg-slate-50 p-8 rounded-[24px] border border-slate-200 relative">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2"><Filter size={16}/> Eğer Müşteri Şu Kurallara Uyuyorsa:</h4>
                    
                    {/* Kural Satırı 1 */}
                    <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 mb-4 shadow-sm relative z-10">
                      <span className="bg-[#2D1B4E] text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shrink-0">Kural 1</span>
                      <select className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold outline-none cursor-pointer">
                        <option>Son Ziyaret Tarihi</option>
                        <option>Toplam İşlem Sayısı</option>
                        <option>Aldığı Hizmet Türü</option>
                        <option>Gittiği Bölge</option>
                      </select>
                      <select className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold outline-none cursor-pointer">
                        <option>Şundan daha eskiyse:</option>
                        <option>Şundan daha yeniyse:</option>
                        <option>Eşittir:</option>
                      </select>
                      <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg py-3 px-4">
                        <input type="number" placeholder="Örn: 30" className="w-full bg-transparent border-none text-sm font-bold outline-none"/>
                        <span className="text-xs font-bold text-slate-400">Gün</span>
                      </div>
                      <button className="text-slate-300 hover:text-red-500 bg-transparent border-none cursor-pointer shrink-0"><Trash2 size={20}/></button>
                    </div>

                    {/* Kural Bağlayıcı */}
                    <div className="w-px h-8 bg-slate-300 mx-auto relative z-0">
                       <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 text-slate-500 text-[10px] font-black px-2 py-1 rounded uppercase">VE (AND)</span>
                    </div>

                    {/* Kural Satırı 2 */}
                    <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 mt-0 shadow-sm relative z-10">
                      <span className="bg-[#2D1B4E] text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shrink-0">Kural 2</span>
                      <select className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold outline-none cursor-pointer">
                        <option>Aldığı Hizmet Türü</option>
                        <option>Son Ziyaret Tarihi</option>
                      </select>
                      <select className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold outline-none cursor-pointer">
                        <option>İçeriyorsa:</option>
                        <option>Eşit Değilse:</option>
                      </select>
                      <input type="text" placeholder="Örn: Saç Kesimi" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold outline-none"/>
                      <button className="text-slate-300 hover:text-red-500 bg-transparent border-none cursor-pointer shrink-0"><Trash2 size={20}/></button>
                    </div>

                    <button className="mt-8 bg-white border-2 border-dashed border-slate-300 text-slate-500 hover:border-[#E8622A] hover:text-[#E8622A] w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest cursor-pointer transition-colors flex items-center justify-center gap-2">
                      <Plus size={20}/> Kural Ekle
                    </button>
                  </div>

                  <div className="mt-8 flex items-center justify-between bg-[#2D1B4E] p-8 rounded-[24px] shadow-2xl">
                    <div>
                      <p className="text-[10px] font-black uppercase text-[#F5C5A3] tracking-widest mb-1">Veritabanında Eşleşen</p>
                      <p className="text-4xl font-black text-white">1,240 <span className="text-lg font-bold text-white/50">Müşteri</span></p>
                    </div>
                    <button onClick={() => setShowSegmentBuilder(false)} className="bg-[#E8622A] hover:bg-orange-500 text-white px-10 py-5 rounded-xl font-black text-sm uppercase tracking-widest border-none cursor-pointer shadow-lg hover:scale-105 transition-transform">
                      Kitleyi Kaydet
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. ŞABLONLAR (TEMPLATES) TABI */}
        {crmTab === 'templates' && (
          <div className="animate-in fade-in h-full">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-[#2D1B4E] uppercase tracking-tight">E-Posta & SMS Şablonları</h3>
                <p className="text-sm font-bold text-slate-400 mt-1">Müşterilerinize göndereceğiniz tasarımları burada yaratın.</p>
              </div>
              <button className="bg-[#E8622A] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest border-none cursor-pointer flex items-center gap-2 shadow-xl hover:scale-105 transition-transform">
                <Plus size={16}/> Yeni Şablon
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTemplates.map(tmp => (
                <div key={tmp.id} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-shadow flex flex-col group">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-6 border border-blue-100"><FileCode2 size={24}/></div>
                  <h4 className="font-black text-[#2D1B4E] text-lg mb-2">{tmp.name}</h4>
                  <p className="text-xs font-bold text-slate-500 line-clamp-2 mb-8">Konu: {tmp.subject}</p>
                  <div className="mt-auto flex gap-2">
                    <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-[#2D1B4E] py-3 rounded-xl font-black text-[10px] uppercase border-none cursor-pointer transition-colors">Düzenle</button>
                    <button className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white w-12 h-12 rounded-xl flex items-center justify-center border-none cursor-pointer transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. KAMPANYALAR (CAMPAIGNS) TABI */}
        {crmTab === 'campaigns' && (
          <div className="animate-in fade-in h-full">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-[#2D1B4E] uppercase tracking-tight">Kampanya Fırlatma Rampası</h3>
                <p className="text-sm font-bold text-slate-400 mt-1">Hazırladığınız Kitleyi ve Şablonu seçip roketleyin.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[32px] shadow-xl overflow-hidden max-w-5xl mx-auto">
              <div className="bg-[#2D1B4E] p-8 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#E8622A]/20 rounded-full blur-3xl pointer-events-none"></div>
                <Rocket size={48} className="text-[#E8622A] mx-auto mb-4 relative z-10 animate-bounce"/>
                <h2 className="text-2xl font-black text-white uppercase tracking-widest relative z-10">Yeni Gönderim Başlat</h2>
              </div>
              
              <div className="p-8 md:p-12 space-y-8">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-3 flex items-center gap-2"><Filter size={16}/> 1. Hedef Kitleyi Seçin</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 font-bold text-base text-[#2D1B4E] outline-none focus:border-[#E8622A] cursor-pointer appearance-none shadow-sm">
                    <option value="">Lütfen kayıtlı bir kitle (segment) seçin...</option>
                    {mockSegments.map(s => <option key={s.id} value={s.id}>{s.name} ({s.count} Kişi)</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-3 flex items-center gap-2"><FileCode2 size={16}/> 2. Şablonu Seçin</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 px-6 font-bold text-base text-[#2D1B4E] outline-none focus:border-[#E8622A] cursor-pointer appearance-none shadow-sm">
                    <option value="">Lütfen bir e-posta tasarımı seçin...</option>
                    {mockTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] border-none cursor-pointer flex items-center justify-center gap-3 shadow-xl hover:scale-[1.01] transition-transform">
                    KAMPANYAYI FIRLAT <ArrowRight size={20}/>
                  </button>
                  <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">Gönderim işlemi sistem yoğunluğuna göre kuyruğa alınacaktır.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}