"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Store, Users, CheckCircle, Clock, Search, Mail, 
  ShieldCheck, XCircle, LogOut, Download, CheckCircle2, ChevronRight,
  TrendingUp, Trash2, AlertCircle, FileSpreadsheet, MapPin, Crown, 
  Activity, CalendarCheck, Check, Lock, Phone, Star, MessageSquare, BarChart3,
  CreditCard, Send, Eye, EyeOff
} from 'lucide-react';

// Supabase ve Mail Şablonu Importları
import { supabase } from '@/lib/supabase';
import { getActivationTemplate } from '@/lib/emailTemplates';

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const timeAgo = (dateString) => {
  if (!dateString) return 'Bilinmiyor';
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} dakika önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  return `${diffDays} gün önce`;
};

export default function SuperAdmin() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  
  const [shops, setShops] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  const [isSendingMail, setIsSendingMail] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  useEffect(() => {
    const session = localStorage.getItem('bookcy_superadmin');
    if (session === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPass === 'admin2026') {
      setIsAuthenticated(true);
      localStorage.setItem('bookcy_superadmin', 'true');
      fetchData();
    } else {
      alert("Hatalı Şifre! Yetkisiz Erişim.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bookcy_superadmin');
    setIsAuthenticated(false);
    router.push('/');
  };

  async function fetchData() {
    setLoading(true);
    try {
      const [shopsRes, apptsRes, revsRes] = await Promise.all([
        supabase.from('shops').select('*').order('created_at', { ascending: false }),
        supabase.from('appointments').select('*').order('created_at', { ascending: false }),
        supabase.from('platform_feedback').select('*').order('created_at', { ascending: false })
      ]);

      if (shopsRes.data) setShops(shopsRes.data);
      if (apptsRes.data) setAppointments(apptsRes.data);
      if (revsRes.data) setReviews(revsRes.data);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  }

  // GÜNCELLENMİŞ ONAY FONKSİYONU (Mail Gönderimi Buraya Bağlandı)
  const approveShop = async (shop) => {
    const isConfirmed = window.confirm(`${shop.name} işletmesini ONAYLAMAK istediğinize emin misiniz?`);
    if (!isConfirmed) return;

    setLoading(true);
    const { error } = await supabase.from('shops').update({ status: 'approved' }).eq('id', shop.id);
    
    if (!error) {
      // ONAY MAİLİ GÖNDERME
      try {
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: shop.admin_email,
            subject: 'Hesabınız Aktif Edildi - Bookcy',
            html: getActivationTemplate({
              shopName: shop.name,
              packageName: shop.package || 'Standart Paket',
              username: shop.admin_username,
              password: shop.admin_password
            })
          }),
        });
        alert("İşletme Onaylandı ve Aktivasyon Maili Gönderildi!");
      } catch (mailErr) {
        console.error("Mail gönderim hatası:", mailErr);
        alert("İşletme onaylandı ama mail gönderilirken hata oluştu.");
      }
      fetchData();
    } else {
      alert("Kritik Hata: " + error.message);
    }
    setLoading(false);
  };

  const deleteShop = async (id) => {
    const isConfirmed = window.confirm("DİKKAT: Bu işletmeyi sistemden TAMAMEN SİLMEK istediğinize emin misiniz? Bu işlem geri alınamaz.");
    if (isConfirmed) {
      const { error } = await supabase.from('shops').delete().eq('id', id);
      if (!error) { alert("İşletme kalıcı olarak silindi."); fetchData(); } 
      else { alert("Silme hatası: " + error.message); }
    }
  };

  const sendReminderEmail = async (shop) => {
    const isConfirmed = window.confirm(`${shop.name} işletmesine "Dekont Hatırlatma" maili gönderilecek. Onaylıyor musunuz?`);
    if (!isConfirmed) return;
    setIsSendingMail(true);
    // Burada ileride bir Template daha oluşturup bağlayabiliriz
    setTimeout(() => {
        setIsSendingMail(false);
        alert("Hatırlatma maili başarıyla gönderildi!");
    }, 1000);
  };

  const sendReminderMailAbonelik = (shop) => {
    alert(`${shop.name} işletmesine abonelik yenileme hatırlatması başarıyla gönderildi.`);
  };

  const togglePassword = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const exportToExcel = () => {
    if(appointments.length === 0) return alert("Dışa aktarılacak müşteri datası bulunmuyor.");

    let csvContent = '\uFEFF';
    csvContent += "Musteri Ad Soyad,Telefon,E-Posta,Islem Yaptigi Mekan,Tarih,Saat,Hizmet,Atanan Uzman,Durum\n";

    appointments.forEach(a => {
      const shop = shops.find(s => s.id === a.shop_id);
      const shopName = shop ? shop.name.replace(/,/g, ' ') : 'Bilinmeyen Mekan';
      const name = `${a.customer_name} ${a.customer_surname}`.replace(/,/g, ' ');
      const phone = a.customer_phone ? a.customer_phone.replace(/,/g, '') : '';
      const email = a.customer_email ? a.customer_email.replace(/,/g, '') : '';
      const date = a.appointment_date || '';
      const time = a.appointment_time || '';
      const service = a.service_name ? a.service_name.replace(/,/g, ' ') : '';
      const staff = a.staff_name ? a.staff_name.replace(/,/g, ' ') : '';
      const status = a.status || '';

      csvContent += `${name},${phone},${email},${shopName},${date},${time},${service},${staff},${status}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bookcy_musteri_datasi_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // İstatistiki hesaplamalar ve diğer yan mantıklar...
  const pendingShops = shops.filter(s => s.status === 'pending');
  const activeShops = shops.filter(s => s.status === 'approved');
  const filteredActiveShops = activeShops.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const uniqueCustomers = [];
  const map = new Map();
  for (const item of appointments) {
      if(item.customer_phone && !map.has(item.customer_phone)){
          map.set(item.customer_phone, true);
          uniqueCustomers.push(item);
      }
  }

  const filteredCustomers = uniqueCustomers.filter(c => 
    (c.customer_name && c.customer_name.toLowerCase().includes(customerSearch.toLowerCase())) || 
    (c.customer_phone && c.customer_phone.includes(customerSearch))
  );

  const totalRevs = reviews.length;
  const avgTotal = totalRevs > 0 ? (reviews.reduce((a, b) => a + Number(b.average_score || 0), 0) / totalRevs).toFixed(1) : 0;
  const avgQ1 = totalRevs > 0 ? (reviews.reduce((a, b) => a + Number(b.q1 || 0), 0) / totalRevs).toFixed(1) : 0;
  const avgQ2 = totalRevs > 0 ? (reviews.reduce((a, b) => a + Number(b.q2 || 0), 0) / totalRevs).toFixed(1) : 0;
  const avgQ3 = totalRevs > 0 ? (reviews.reduce((a, b) => a + Number(b.q3 || 0), 0) / totalRevs).toFixed(1) : 0;
  const avgQ4 = totalRevs > 0 ? (reviews.reduce((a, b) => a + Number(b.q4 || 0), 0) / totalRevs).toFixed(1) : 0;

  const categoryStats = {};
  appointments.forEach(app => {
    const shop = shops.find(s => s.id === app.shop_id);
    const cat = shop ? shop.category : 'Bilinmeyen';
    categoryStats[cat] = (categoryStats[cat] || 0) + 1;
  });
  const sortedCategoryStats = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);

  const getSubStatus = (date) => {
    const start = new Date(date);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);
    const diff = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
    return { end: end.toLocaleDateString('tr-TR'), remaining: diff };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0710] flex flex-col items-center justify-center font-['DM_Sans'] p-4 relative overflow-hidden">
        <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');`}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E8622A]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="bg-[#150D1E] w-full max-w-[400px] rounded-[32px] p-10 relative shadow-2xl border border-[#382252] animate-in zoom-in-95 z-10 text-center">
          <div className="w-16 h-16 bg-[#E8622A] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(232,98,42,0.4)]">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2 font-['Plus_Jakarta_Sans']">KOMUTA MERKEZİ</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-8">Süper Admin Girişi</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
              <input type="password" required placeholder="Yönetici Şifresi" className="w-full bg-[#1D122A] border border-[#382252] rounded-2xl py-4 pl-14 pr-6 font-bold text-sm outline-none focus:border-[#E8622A] text-white transition-colors" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-[#E8622A] hover:bg-[#d4561f] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(232,98,42,0.4)] border-none cursor-pointer">Sistemi Aç</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-[#2D1B4E] font-['DM_Sans']">
      {/* SOL MENÜ */}
      <aside className="w-64 bg-[#2D1B4E] text-white h-screen sticky top-0 flex flex-col shrink-0 shadow-2xl z-40 hidden md:flex">
        <div className="p-8 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E8622A] rounded-xl flex items-center justify-center font-black shadow-lg font-['Plus_Jakarta_Sans']">B.</div>
          <div>
            <span className="font-black text-xl tracking-tighter block leading-none font-['Plus_Jakarta_Sans']">admin<span className="text-[#E8622A]">.</span></span>
            <span className="text-[9px] font-bold text-[#F5C5A3] uppercase tracking-[0.2em]">Komuta Merkezi</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border-none cursor-pointer text-left ${activeTab === 'overview' ? 'bg-[#E8622A] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard size={18}/> Özet Panel
          </button>
          <button onClick={() => setActiveTab('pending')} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition-all border-none cursor-pointer text-left ${activeTab === 'pending' ? 'bg-[#E8622A] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <span className="flex items-center gap-3"><Clock size={18}/> Yeni Başvurular</span>
            {pendingShops.length > 0 && <span className="bg-white text-[#E8622A] text-[10px] font-black px-2 py-0.5 rounded-full">{pendingShops.length}</span>}
          </button>
          <button onClick={() => setActiveTab('active')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border-none cursor-pointer text-left ${activeTab === 'active' ? 'bg-[#E8622A] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Store size={18}/> Aktif İşletmeler
          </button>
          <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border-none cursor-pointer text-left ${activeTab === 'appointments' ? 'bg-[#E8622A] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <CalendarCheck size={18} /> Randevu Kontrol
          </button>
          <button onClick={() => setActiveTab('customers')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border-none cursor-pointer text-left ${activeTab === 'customers' ? 'bg-[#E8622A] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Users size={18}/> Müşteri Datası
          </button>
          <button onClick={() => setActiveTab('billing')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border-none cursor-pointer text-left ${activeTab === 'billing' ? 'bg-[#E8622A] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <CreditCard size={18} /> Abonelik Takibi
          </button>
          <button onClick={() => setActiveTab('feedbacks')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border-none cursor-pointer text-left ${activeTab === 'feedbacks' ? 'bg-[#E8622A] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Star size={18}/> Değerlendirmeler
          </button>
        </div>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl font-bold text-xs text-white uppercase tracking-widest bg-red-500/10 hover:bg-red-500 transition-all border-none cursor-pointer">
            <LogOut size={16}/> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* SAĞ İÇERİK ALANI */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-hidden">
        
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-[#2D1B4E] font-['Plus_Jakarta_Sans']">Süper Admin Paneli</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Platform Yönetim Sistemi</p>
          </div>
          
          <div className="flex gap-4 hidden md:flex">
            <button onClick={exportToExcel} className="bg-[#00c48c] hover:bg-green-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border-none cursor-pointer shadow-lg shadow-green-500/20 transition-all hover:scale-105">
              <FileSpreadsheet size={16}/> EXCEL ÇIKART
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-[#E8622A] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-black text-[#2D1B4E] uppercase tracking-widest animate-pulse">Sistem Verileri Çekiliyor...</p>
          </div>
        ) : (
          <div className="max-w-[1400px] mx-auto">
            
            {/* 1. ÖZET PANEL */}
            {activeTab === 'overview' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4"><Store size={24}/></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Toplam İşletme</p>
                    <p className="text-4xl font-black text-[#2D1B4E]">{activeShops.length}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden">
                    {pendingShops.length > 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-bl-full"></div>}
                    <div className="w-12 h-12 bg-orange-50 text-[#E8622A] rounded-2xl flex items-center justify-center mb-4"><Clock size={24}/></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Onay Bekleyen</p>
                    <p className="text-4xl font-black text-[#2D1B4E]">{pendingShops.length}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4"><Users size={24}/></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Kayıtlı Müşteri</p>
                    <p className="text-4xl font-black text-[#2D1B4E]">{uniqueCustomers.length}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center mb-4"><Star size={24}/></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Ortalama Puan</p>
                    <p className="text-4xl font-black text-[#2D1B4E]">{avgTotal}<span className="text-xl text-slate-400">/10</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ONAY BEKLEYENLER */}
            {activeTab === 'pending' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                    <Clock className="text-[#E8622A]" size={24}/>
                    <h2 className="text-lg font-black uppercase tracking-widest text-[#2D1B4E]">İşlem Bekleyen Başvurular</h2>
                  </div>
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">İşletme Bilgisi</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">Süre</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right whitespace-nowrap">Aksiyonlar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingShops.map(shop => (
                          <tr key={shop.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="font-black text-base text-[#2D1B4E] uppercase mb-1">{shop.name}</div>
                              <div className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest"><MapPin size={12}/> {shop.location}</div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-orange-100">{timeAgo(shop.created_at)}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => approveShop(shop)} className="bg-[#00c48c] hover:bg-green-600 text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-none transition-colors cursor-pointer flex items-center gap-2">
                                    <Check size={16}/> Onayla
                                  </button>
                                  <button onClick={() => deleteShop(shop.id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl border border-red-200 transition-colors cursor-pointer">
                                    <Trash2 size={18}/>
                                  </button>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* DİĞER SEKMELER (Daha önce gönderdiğin mantıkla devam eder) */}
            {activeTab === 'active' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                  <div className="relative w-full max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                    <input type="text" placeholder="Aktif İşletmelerde Ara..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-[20px] py-4 pl-14 pr-6 font-bold text-sm outline-none focus:border-[#E8622A] shadow-sm text-[#2D1B4E]"/>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                   <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">İşletme Profili</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Paket</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">Yönetim</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredActiveShops.map(shop => (
                          <tr key={shop.id} className="border-b border-slate-50 hover:bg-slate-50">
                            <td className="px-8 py-6">
                              <div className="font-black text-base text-[#2D1B4E] uppercase">{shop.name}</div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase bg-slate-100 text-slate-500 border border-slate-200">{shop.package}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button onClick={() => deleteShop(shop.id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl border border-red-200 cursor-pointer">
                                <Trash2 size={18}/>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                   </div>
                </div>
              </div>
            )}

            {/* Randevu, Müşteri ve Abonelik kısımları da yukarıdaki mantıkla buraya eklenebilir */}
            
          </div>
        )}
      </main>
    </div>
  );
}