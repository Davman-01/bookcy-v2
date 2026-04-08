"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ShieldCheck, LogOut, LayoutDashboard, Store, 
  CalendarCheck, Clock, CheckCircle2, XCircle, 
  Trash2, Search, MapPin, Briefcase, Star, Users, 
  Download, Phone, BarChart3, Activity, CreditCard, Send,
  Eye, EyeOff, Lock
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPasswords, setShowPasswords] = useState({}); // YENİ: Şifre Gizle/Göster Kontrolü
  
  const [shops, setShops] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Güvenlik Kontrolü
    const hasAccess = localStorage.getItem('bookcy_admin_access');
    if (!hasAccess) {
      router.push('/admin');
    } else {
      fetchAllData();
    }
  }, [router]);

  // TÜM DATALARI ÇEK
  const fetchAllData = async () => {
    setIsLoading(true);
    const [shopsRes, appRes, revRes] = await Promise.all([
      supabase.from('shops').select('*').order('created_at', { ascending: false }),
      supabase.from('appointments').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*')
    ]);

    if (shopsRes.data) setShops(shopsRes.data);
    if (appRes.data) setAppointments(appRes.data);
    if (revRes.data) setReviews(revRes.data);
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('bookcy_admin_access');
    router.push('/admin');
  };

  // ==========================================
  // İŞLETME YÖNETİM AKSİYONLARI VE MAİL 
  // ==========================================

  // YENİ: ONAY MAİLİ GÖNDERME
  const sendApprovalEmail = async (shop) => {
    try {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: shop.admin_email,
          subject: 'BOOKCY - İşletmeniz Onaylandı! 🎉',
          text: `Merhaba ${shop.name} Yetkilisi,\n\nBaşvurunuz incelenmiş ve başarıyla onaylanmıştır! Artık Bookcy üzerinden randevu almaya hazırsınız.\n\nSistem Giriş Bilgileriniz:\nKullanıcı Adı: ${shop.admin_username}\nŞifre: ${shop.admin_password}\n\nLütfen işletme panelinize girerek fiyatlarınızı ve fotoğraflarınızı güncelleyiniz. İyi çalışmalar dileriz!`
        })
      });
    } catch (error) {
      console.error("Mail hatası:", error);
    }
  };

  // İŞLETME ONAYLAMA (GÜNCELLENDİ)
  const approveShop = async (shop) => {
    if (!window.confirm("Bu işletmeyi onaylamak istediğinize emin misiniz? Sitede görünmeye başlayacak.")) return;
    
    const { error } = await supabase.from('shops').update({ status: 'approved' }).eq('id', shop.id);
    if (!error) {
      alert("İşletme başarıyla onaylandı! Onay maili gönderiliyor...");
      await sendApprovalEmail(shop); // Maili tetikle
      fetchAllData();
    } else {
      alert("Bir hata oluştu!");
    }
  };

  // İŞLETME SİLME (ZİNCİRLEME SİLME - FOREIGN KEY ÇÖZÜMÜ GÜNCELLENDİ)
  const deleteShop = async (id) => {
    if (!window.confirm("DİKKAT! Bu işletmeyi silerseniz ona ait tüm randevular ve yorumlar da kalıcı olarak silinecektir. Emin misiniz?")) return;
    
    try {
      // Önce bağlı verileri temizle
      await supabase.from('appointments').delete().eq('shop_id', id);
      await supabase.from('reviews').delete().eq('shop_id', id);
      await supabase.from('closed_slots').delete().eq('shop_id', id);

      // Sonra işletmeyi sil
      const { error } = await supabase.from('shops').delete().eq('id', id);
      if (error) throw error;
      
      alert("İşletme ve tüm verileri silindi.");
      fetchAllData();
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  // RANDEVU SİLME
  const deleteAppointment = async (id) => {
    if (!window.confirm("Bu randevuyu sistemden silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (!error) {
      alert("Randevu silindi.");
      fetchAllData();
    }
  };

  // ÖDEME HATIRLATMA MAİLİ (SİMÜLASYON)
  const sendReminderMail = (shop) => {
    alert(`${shop.name} işletmesine abonelik yenileme hatırlatması başarıyla gönderildi.`);
  };

  // YENİ: ŞİFRE GÖSTER/GİZLE FONKSİYONU
  const togglePassword = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#2D1B4E] flex items-center justify-center text-[#E8622A] font-black tracking-widest uppercase animate-pulse">
      Sistem Yükleniyor...
    </div>
  );

  const pendingShops = shops.filter(s => s.status === 'pending');
  const approvedShops = shops.filter(s => s.status === 'approved');

  // ==========================================
  // DATA ANALİZLERİ
  // ==========================================

  // 1. Müşteri Datalarını Ayıklama (Telefon + Email)
  const uniqueCustomers = [];
  const seenPhones = new Set();
  const categoryStats = {};

  appointments.forEach(app => {
    // Müşteri Ayıklama
    const phone = app.customer_phone || 'Belirtilmemiş';
    if (!seenPhones.has(phone)) {
      seenPhones.add(phone);
      uniqueCustomers.push({
        name: app.customer_name,
        surname: app.customer_surname,
        phone: phone,
        email: app.customer_email || 'Belirtilmemiş'
      });
    }

    // Sektörel Dağılım
    const shop = shops.find(s => s.id === app.shop_id);
    const cat = shop ? shop.category : 'Bilinmeyen';
    categoryStats[cat] = (categoryStats[cat] || 0) + 1;
  });

  const sortedCategoryStats = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);

  // 2. Finansal Hesaplama
  const totalRevenue = approvedShops.reduce((acc, s) => acc + (s.package === 'Premium' ? 3000 : 1500), 0);

  // 3. Abonelik Durumu Hesaplama
  const getSubStatus = (date) => {
    const start = new Date(date);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);
    const diff = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
    return { end: end.toLocaleDateString('tr-TR'), remaining: diff };
  };

  // EXCEL (CSV) OLARAK DIŞA AKTARMA
  const exportToExcel = () => {
    let csvContent = "\uFEFFİsim;Soyisim;Telefon;E-Posta\n";
    uniqueCustomers.forEach(c => {
      csvContent += `${c.name};${c.surname};${c.phone};${c.email}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Bookcy_Musteri_Listesi_${new Date().toLocaleDateString('tr-TR')}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Outfit'] flex flex-col md:flex-row">
      
      {/* SOL MENÜ (SIDEBAR) */}
      <aside className="w-full md:w-72 bg-[#2D1B4E] text-white flex flex-col md:min-h-screen shrink-0 border-r border-slate-800 relative z-20 shadow-2xl">
        <div className="p-8 flex items-center gap-4 border-b border-slate-800">
          <div className="w-12 h-12 bg-[#E8622A] rounded-xl flex items-center justify-center shadow-lg">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-['Syne'] font-black text-xl tracking-tight leading-none uppercase">BOOKCY.</h1>
            <span className="text-[10px] font-bold text-[#F5C5A3] uppercase tracking-[0.2em]">Merkez Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all text-sm border-none cursor-pointer ${activeTab === 'overview' ? 'bg-[#E8622A] text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard size={18} /> Genel Bakış
          </button>
          <button onClick={() => setActiveTab('pending')} className={`w-full flex items-center justify-between px-4 py-4 rounded-xl font-bold transition-all text-sm border-none cursor-pointer ${activeTab === 'pending' ? 'bg-[#E8622A] text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <div className="flex items-center gap-3"><Clock size={18} /> Yeni Başvurular</div>
            {pendingShops.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">{pendingShops.length}</span>}
          </button>
          <button onClick={() => setActiveTab('shops')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all text-sm border-none cursor-pointer ${activeTab === 'shops' ? 'bg-[#E8622A] text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Store size={18} /> İşletme Listesi
          </button>
          <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all text-sm border-none cursor-pointer ${activeTab === 'appointments' ? 'bg-[#E8622A] text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <CalendarCheck size={18} /> Randevu Kontrol
          </button>
          <button onClick={() => setActiveTab('customers')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all text-sm border-none cursor-pointer ${activeTab === 'customers' ? 'bg-[#E8622A] text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <Users size={18} /> Müşteri Dataları
          </button>
          <button onClick={() => setActiveTab('billing')} className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all text-sm border-none cursor-pointer ${activeTab === 'billing' ? 'bg-[#E8622A] text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
            <CreditCard size={18} /> Abonelik Takibi
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-white px-4 py-4 rounded-xl font-bold transition-all uppercase text-xs tracking-widest border-none cursor-pointer">
            <LogOut size={16} /> Güvenli Çıkış
          </button>
        </div>
      </aside>

      {/* SAĞ İÇERİK ALANI */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen custom-scrollbar">
        
        {/* 1. GENEL BAKIŞ & İSTATİSTİKLER */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-[#2D1B4E] uppercase tracking-tight mb-8">Sistem Özeti</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-6 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-blue-50 opacity-50"><Store size={100}/></div>
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 relative z-10"><Store size={32}/></div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aktif İşletme</p>
                  <p className="text-4xl font-black text-[#2D1B4E]">{approvedShops.length}</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-6 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-orange-50 opacity-50"><Clock size={100}/></div>
                <div className="w-16 h-16 bg-orange-50 text-[#E8622A] rounded-2xl flex items-center justify-center shrink-0 relative z-10"><Clock size={32}/></div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Onay Bekleyen</p>
                  <p className="text-4xl font-black text-[#2D1B4E]">{pendingShops.length}</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-6 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-green-50 opacity-50"><CalendarCheck size={100}/></div>
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center shrink-0 relative z-10"><CalendarCheck size={32}/></div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Toplam Randevu</p>
                  <p className="text-4xl font-black text-[#2D1B4E]">{appointments.length}</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-6 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-purple-50 opacity-50"><Users size={100}/></div>
                <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center shrink-0 relative z-10"><Users size={32}/></div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Benzersiz Müşteri</p>
                  <p className="text-4xl font-black text-[#2D1B4E]">{uniqueCustomers.length}</p>
                </div>
              </div>
            </div>

            {/* SEKTÖREL İSTATİSTİKLER */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl"><BarChart3 size={24}/></div>
                <div>
                  <h3 className="text-xl font-black text-[#2D1B4E] uppercase tracking-tight">Sektörel Randevu Dağılımı</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hangi sektör ne kadar işlem görüyor?</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedCategoryStats.map(([cat, count]) => (
                  <div key={cat} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-[#E8622A] transition-colors group">
                    <span className="font-bold text-slate-600 uppercase text-xs tracking-widest flex items-center gap-2 group-hover:text-[#E8622A] transition-colors">
                      <Activity size={14}/> {cat}
                    </span>
                    <span className="bg-white text-[#E8622A] font-black text-xl px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                      {count}
                    </span>
                  </div>
                ))}
                {sortedCategoryStats.length === 0 && (
                  <div className="col-span-full py-10 text-center text-slate-400 font-bold uppercase tracking-widest">
                    Sistemde henüz yeterli randevu verisi yok.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ONAY BEKLEYENLER */}
        {activeTab === 'pending' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-[#2D1B4E] uppercase tracking-tight mb-8 flex items-center gap-3">
              <Clock className="text-[#E8622A]"/> Yeni Başvurular ({pendingShops.length})
            </h2>
            
            {pendingShops.length === 0 ? (
              <div className="bg-white p-12 rounded-[32px] border border-slate-200 text-center shadow-sm">
                <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
                <p className="font-bold text-slate-500 uppercase tracking-widest">Bekleyen Başvuru Yok</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {pendingShops.map(shop => (
                  <div key={shop.id} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                          {shop.logo_url ? <img src={shop.logo_url} className="w-full h-full object-cover"/> : "LOGO"}
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-[#2D1B4E] uppercase">{shop.name}</h3>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-1">
                            <span className="flex items-center gap-1 text-[#E8622A]"><Briefcase size={12}/> {shop.category}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin size={12}/> {shop.location}</span>
                          </div>
                        </div>
                      </div>
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{shop.package}</span>
                    </div>
                    
                    {/* YENİ ŞİFRE GÖSTERME ALANI */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
                      <p><strong className="text-slate-900">Kullanıcı:</strong> {shop.admin_username}</p>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900">Şifre:</strong> 
                        <span className="font-mono bg-slate-100 px-2 rounded text-blue-600">
                          {showPasswords[shop.id] ? shop.admin_password : '••••••••'}
                        </span>
                        <button onClick={() => togglePassword(shop.id)} className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-orange-500">
                          {showPasswords[shop.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                        </button>
                      </div>
                      <p><strong className="text-slate-900">Tel:</strong> {shop.contact_phone}</p>
                      <p><strong className="text-slate-900">E-Posta:</strong> {shop.admin_email}</p>
                    </div>

                    <div className="flex gap-3 mt-2">
                      <button onClick={() => approveShop(shop)} className="flex-1 bg-[#00c48c] hover:bg-green-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer border-none outline-none">
                        <CheckCircle2 size={16}/> Onayla ve Mail At
                      </button>
                      <button onClick={() => deleteShop(shop.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer border-none outline-none">
                        <XCircle size={16}/> Reddet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AKTİF İŞLETMELER VE GİRİŞ BİLGİLERİ */}
        {activeTab === 'shops' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-[#2D1B4E] uppercase tracking-tight mb-8 flex items-center gap-3">
              <Store className="text-[#E8622A]"/> Sistemdeki İşletmeler ({approvedShops.length})
            </h2>
            
            <div className="bg-white border border-slate-200 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">İşletme Adı</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Giriş Bilgileri</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Kategori / Bölge</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Paket</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedShops.map(shop => (
                      <tr key={shop.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-200 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-200">
                              {shop.logo_url ? <img src={shop.logo_url} className="w-full h-full object-cover"/> : null}
                            </div>
                            <span className="font-black text-[#2D1B4E] text-sm uppercase">{shop.name}</span>
                          </div>
                        </td>
                        
                        {/* YENİ GİRİŞ BİLGİLERİ SÜTUNU */}
                        <td className="p-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-blue-600">{shop.admin_username}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {showPasswords[shop.id] ? shop.admin_password : '******'}
                              </span>
                              <button onClick={() => togglePassword(shop.id)} className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-orange-500">
                                {showPasswords[shop.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                              </button>
                            </div>
                          </div>
                        </td>

                        <td className="p-5 text-xs font-bold text-slate-600">
                          {shop.category} <br/><span className="text-slate-400 font-medium">{shop.location}</span>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${shop.package === 'Premium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                            {shop.package}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <button onClick={() => deleteShop(shop.id)} className="text-slate-400 hover:text-red-500 transition-colors p-3 bg-white rounded-xl border border-slate-200 hover:border-red-200 shadow-sm cursor-pointer outline-none" title="İşletmeyi Sil">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {approvedShops.length === 0 && (
                      <tr><td colSpan="5" className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest">Kayıtlı İşletme Yok</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TÜM RANDEVULAR */}
        {activeTab === 'appointments' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-[#2D1B4E] uppercase tracking-tight mb-8 flex items-center gap-3">
              <CalendarCheck className="text-[#E8622A]"/> Platform Randevuları ({appointments.length})
            </h2>
            
            <div className="bg-white border border-slate-200 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tarih / Saat</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Müşteri Detayı</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">İşletme</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Hizmet / Uzman</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Aksiyon</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(app => {
                      const shopData = shops.find(s => s.id === app.shop_id);
                      return (
                        <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="p-5">
                            <div className="font-black text-[#E8622A] text-sm mb-1">{app.appointment_date}</div>
                            <div className="text-xs font-bold text-slate-500 flex items-center gap-1"><Clock size={12}/> {app.appointment_time}</div>
                          </td>
                          <td className="p-5">
                            <div className="font-bold text-[#2D1B4E] text-sm uppercase mb-1">{app.customer_name} {app.customer_surname}</div>
                            <div className="text-xs font-medium text-slate-500 flex items-center gap-1"><Phone size={12}/> {app.customer_phone || 'Belirtilmemiş'}</div>
                          </td>
                          <td className="p-5">
                            <span className="font-bold text-[#2D1B4E] text-xs bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 uppercase tracking-wide">
                              {shopData ? shopData.name : 'Silinmiş İşletme'}
                            </span>
                          </td>
                          <td className="p-5 text-xs font-bold text-slate-600">
                            {app.service_name} <br/><span className="text-slate-400 font-medium">Uzman: {app.staff_name}</span>
                          </td>
                          <td className="p-5 text-right">
                            <button onClick={() => deleteAppointment(app.id)} className="text-slate-400 hover:text-red-500 transition-colors p-3 bg-white rounded-xl border border-slate-200 hover:border-red-200 shadow-sm cursor-pointer outline-none" title="Randevuyu Sil">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                    {appointments.length === 0 && (
                      <tr><td colSpan="5" className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest">Henüz Randevu Yok</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MÜŞTERİ DATALARI (EXCEL İNDİRME) */}
        {activeTab === 'customers' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-black text-[#2D1B4E] uppercase tracking-tight flex items-center gap-3">
                  <Users className="text-[#E8622A]"/> Müşteri Veritabanı
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Sistemdeki Toplam Eşsiz Müşteri Sayısı: {uniqueCustomers.length}</p>
              </div>
              <button onClick={exportToExcel} className="bg-[#00c48c] hover:bg-green-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-transform hover:scale-105 flex items-center gap-2 shadow-[0_10px_20px_rgba(0,196,140,0.3)] border-none cursor-pointer outline-none">
                <Download size={18}/> Excel Listesini İndir
              </button>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                <table className="w-full text-left border-collapse relative">
                  <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                    <tr>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200">İsim Soyisim</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200">Telefon Numarası</th>
                      <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200">E-Posta Adresi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueCustomers.map((c, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-5 font-black text-[#2D1B4E] text-sm uppercase">{c.name} {c.surname}</td>
                        <td className="p-5 font-bold text-slate-600 text-sm">{c.phone}</td>
                        <td className="p-5 text-sm font-medium text-slate-500">{c.email}</td>
                      </tr>
                    ))}
                    {uniqueCustomers.length === 0 && (
                      <tr><td colSpan="3" className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest">Kayıtlı Müşteri Yok</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ABONELİK TAKİBİ */}
        {activeTab === 'billing' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-[#2D1B4E] mb-8 uppercase italic flex items-center gap-3"><CreditCard className="text-orange-500"/> Abonelik Takip Sistemi</h2>
            <div className="space-y-4">
              {approvedShops.map(shop => {
                const sub = getSubStatus(shop.created_at);
                return (
                  <div key={shop.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm border-l-4 border-l-orange-500">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-xs border border-slate-100 overflow-hidden">
                        {shop.logo_url ? <img src={shop.logo_url} className="w-full h-full object-cover"/> : 'LOGO'}
                      </div>
                      <div>
                        <p className="font-black text-[#2D1B4E] uppercase text-sm">{shop.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{shop.package} Paket - {shop.package === 'Premium' ? '3000 TL' : '1500 TL'} / Ay</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Dönem Sonu</p>
                        <p className="text-xs font-bold text-slate-600">{sub.end}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Kalan</p>
                        <p className={`text-sm font-black ${sub.remaining < 5 ? 'text-red-500 animate-pulse' : 'text-[#00c48c]'}`}>{sub.remaining} Gün</p>
                      </div>
                      <button onClick={() => sendReminderMail(shop)} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-6 py-4 rounded-2xl border-none font-black text-[10px] uppercase cursor-pointer hover:bg-indigo-600 hover:text-white transition-all tracking-widest shadow-sm">
                        <Send size={14}/> HATIRLATMA GÖNDER
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}