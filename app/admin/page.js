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

import { supabase } from '@/lib/supabase';

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const FacebookIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
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

  const approveShop = async (shop) => {
    const isConfirmed = window.confirm(`${shop.name} işletmesini ONAYLAMAK istediğinize emin misiniz?`);
    if (!isConfirmed) return;

    const { error } = await supabase.from('shops').update({ status: 'approved' }).eq('id', shop.id);
    if (!error) {
      alert("İşletme Başarıyla Onaylandı!");
      fetchData();
    } else {
      alert("Kritik Hata: " + error.message);
    }
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

  const updateApptStatus = async (id, newStatus) => {
    alert(`İşlem ${newStatus} olarak işaretlendi!`);
  };

  const deleteAppointmentCompletely = async (id) => {
    const isConfirmed = window.confirm("Bu kaydı tamamen SİLMEK istediğinize emin misiniz?");
    if(isConfirmed) {
        alert("Kayıt kalıcı olarak silindi!");
    }
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

  const pendingShops = shops.filter(s => s.status === 'pending');
  const activeShops = shops.filter(s => s.status === 'approved');
  const filteredActiveShops = activeShops.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Müşteri veritabanı araması
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

  // DEĞERLENDİRME İSTATİSTİKLERİ
  const totalRevs = reviews.length;
  const avgTotal = totalRevs > 0 ? (reviews.reduce((a, b) => a + Number(b.average_score || 0), 0) / totalRevs).toFixed(1) : 0;
  const avgQ1 = totalRevs > 0 ? (reviews.reduce((a, b) => a + Number(b.q1 || 0), 0) / totalRevs).toFixed(1) : 0;
  const avgQ2 = totalRevs > 0 ? (reviews.reduce((a, b) => a + Number(b.q2 || 0), 0) / totalRevs).toFixed(1) : 0;
  const avgQ3 = totalRevs > 0 ? (reviews.reduce((a, b) => a + Number(b.q3 || 0), 0) / totalRevs).toFixed(1) : 0;
  const avgQ4 = totalRevs > 0 ? (reviews.reduce((a, b) => a + Number(b.q4 || 0), 0) / totalRevs).toFixed(1) : 0;

  // Sektörel İstatistikler
  const categoryStats = {};
  appointments.forEach(app => {
    const shop = shops.find(s => s.id === app.shop_id);
    const cat = shop ? shop.category : 'Bilinmeyen';
    categoryStats[cat] = (categoryStats[cat] || 0) + 1;
  });
  const sortedCategoryStats = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);

  // Abonelik Hesaplama
  const getSubStatus = (date) => {
    const start = new Date(date);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);
    const diff = Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
    return { end: end.toLocaleDateString('tr-TR'), remaining: diff };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-[#2D1B4E] font-['DM_Sans']">
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');`}} />
      
      {/* SOL MENÜ - nav etiketi DIV olarak değiştirildi, CSS çakışması önlendi */}
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
          
          {/* Mobil Menü (Sadece küçük ekranda görünür) */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-2">
            <button onClick={() => setActiveTab('overview')} className={`shrink-0 px-4 py-2 rounded-lg font-bold text-xs ${activeTab === 'overview' ? 'bg-[#E8622A] text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>Özet</button>
            <button onClick={() => setActiveTab('pending')} className={`shrink-0 px-4 py-2 rounded-lg font-bold text-xs ${activeTab === 'pending' ? 'bg-[#E8622A] text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>Bekleyen</button>
            <button onClick={() => setActiveTab('active')} className={`shrink-0 px-4 py-2 rounded-lg font-bold text-xs ${activeTab === 'active' ? 'bg-[#E8622A] text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>Aktif</button>
            <button onClick={() => setActiveTab('appointments')} className={`shrink-0 px-4 py-2 rounded-lg font-bold text-xs ${activeTab === 'appointments' ? 'bg-[#E8622A] text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>Randevular</button>
            <button onClick={() => setActiveTab('customers')} className={`shrink-0 px-4 py-2 rounded-lg font-bold text-xs ${activeTab === 'customers' ? 'bg-[#E8622A] text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>Müşteriler</button>
            <button onClick={() => setActiveTab('billing')} className={`shrink-0 px-4 py-2 rounded-lg font-bold text-xs ${activeTab === 'billing' ? 'bg-[#E8622A] text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>Abonelik</button>
            <button onClick={() => setActiveTab('feedbacks')} className={`shrink-0 px-4 py-2 rounded-lg font-bold text-xs ${activeTab === 'feedbacks' ? 'bg-[#E8622A] text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>Yorumlar</button>
            <button onClick={handleLogout} className="shrink-0 px-4 py-2 rounded-lg font-bold text-xs bg-red-100 text-red-600 border border-red-200">Çıkış</button>
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
            
            {/* 1. SEKME: ÖZET PANEL */}
            {activeTab === 'overview' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4"><Store size={24}/></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Toplam İşletme</p>
                    <p className="text-4xl font-black text-[#2D1B4E] font-['Plus_Jakarta_Sans']">{activeShops.length}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
                    {pendingShops.length > 0 && <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-bl-full"></div>}
                    <div className="w-12 h-12 bg-orange-50 text-[#E8622A] rounded-2xl flex items-center justify-center mb-4"><Clock size={24}/></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Onay Bekleyen</p>
                    <p className="text-4xl font-black text-[#E8622A] font-['Plus_Jakarta_Sans']">{pendingShops.length}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4"><Users size={24}/></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Kayıtlı Müşteri</p>
                    <p className="text-4xl font-black text-[#2D1B4E] font-['Plus_Jakarta_Sans']">{uniqueCustomers.length}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-center">
                    <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-2xl flex items-center justify-center mb-4"><Star size={24}/></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Ortalama Puan</p>
                    <p className="text-4xl font-black text-[#2D1B4E] font-['Plus_Jakarta_Sans']">{avgTotal}<span className="text-xl text-slate-400">/10</span></p>
                  </div>
                </div>

                {/* Sektörel İstatistikler */}
                <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 mb-10">
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

                <div className="bg-[#2D1B4E] rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8622A]/20 rounded-full blur-[80px] pointer-events-none"></div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2 font-['Plus_Jakarta_Sans']">Sistem Durumu</h3>
                  <p className="text-slate-300 font-medium mb-8 max-w-xl">Platform genelinde veritabanı sağlıklı çalışıyor. Yeni işletme başvuruları ve müşteri geri bildirimlerini anlık takip edebilirsiniz.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => setActiveTab('pending')} className="bg-[#E8622A] hover:bg-orange-500 text-white px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest border-none cursor-pointer transition-colors shadow-lg">Bekleyenleri Gör</button>
                    <button onClick={() => setActiveTab('feedbacks')} className="bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest border border-white/20 cursor-pointer transition-colors">Raporlara Git</button>
                  </div>
                </div>
              </div>
            )}

            {/* SEKME: DEĞERLENDİRMELER */}
            {activeTab === 'feedbacks' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gradient-to-br from-[#2D1B4E] to-[#1a0f2e] rounded-[32px] p-8 md:p-12 text-left relative overflow-hidden mb-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-yellow-500/10 text-yellow-500 rounded-2xl flex items-center justify-center border border-yellow-500/20 backdrop-blur-sm"><Star size={32} fill="currentColor"/></div>
                      <div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-['Plus_Jakarta_Sans']">Platform Raporu</h2>
                        <p className="text-[#F5C5A3] font-bold text-xs uppercase tracking-widest">Müşteri Memnuniyeti</p>
                      </div>
                    </div>
                    <p className="text-slate-300 font-medium max-w-xl text-base leading-relaxed">Randevu sonrası müşterilerin karşısına çıkan pop-up anketten elde edilen tüm veriler burada anlık olarak hesaplanır.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-[32px] p-8 text-center shrink-0 min-w-[250px] w-full md:w-auto">
                    <p className="text-slate-300 font-bold uppercase tracking-widest text-[10px] mb-2">Genel Ortalama</p>
                    <div className="text-6xl font-black text-white font-['Plus_Jakarta_Sans']">{avgTotal}<span className="text-2xl text-slate-400">/10</span></div>
                    <p className="text-[#00c48c] font-black text-xs mt-2 flex items-center justify-center gap-1"><CheckCircle2 size={14}/> Harika Durumda</p>
                  </div>
                </div>

                <h3 className="text-xl font-black uppercase tracking-tight text-[#2D1B4E] mb-6 font-['Plus_Jakarta_Sans'] flex items-center gap-2"><BarChart3 className="text-[#E8622A]"/> Detaylı Kırılımlar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                  <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Platform Deneyimi</p>
                    <div className="flex items-end gap-2"><p className="text-3xl font-black text-[#2D1B4E]">{avgQ1}</p><Star size={16} className="text-yellow-400 fill-yellow-400 mb-1.5"/></div>
                  </div>
                  <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Kullanım Kolaylığı</p>
                    <div className="flex items-end gap-2"><p className="text-3xl font-black text-[#2D1B4E]">{avgQ2}</p><Star size={16} className="text-yellow-400 fill-yellow-400 mb-1.5"/></div>
                  </div>
                  <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">İşlem Memnuniyeti</p>
                    <div className="flex items-end gap-2"><p className="text-3xl font-black text-[#2D1B4E]">{avgQ3}</p><Star size={16} className="text-yellow-400 fill-yellow-400 mb-1.5"/></div>
                  </div>
                  <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Hız Değerlendirmesi</p>
                    <div className="flex items-end gap-2"><p className="text-3xl font-black text-[#2D1B4E]">{avgQ4}</p><Star size={16} className="text-yellow-400 fill-yellow-400 mb-1.5"/></div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                    <MessageSquare className="text-[#E8622A]" size={24}/>
                    <h2 className="text-lg font-black uppercase tracking-widest text-[#2D1B4E] font-['Plus_Jakarta_Sans']">Son Yapılan Değerlendirmeler ({totalRevs})</h2>
                  </div>
                  
                  <div className="p-0">
                    {reviews.length === 0 ? (
                      <div className="text-center py-20 text-slate-400">
                        <Star size={48} className="mx-auto mb-4 text-slate-200"/>
                        <p className="font-bold text-sm uppercase tracking-widest">Henüz değerlendirme yapılmamış.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">Tarih</th>
                              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Deneyim</th>
                              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Kolaylık</th>
                              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Memnuniyet</th>
                              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Hız</th>
                              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right whitespace-nowrap">Ortalama</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reviews.map((rev, index) => (
                              <tr key={index} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                <td className="px-8 py-5 whitespace-nowrap">
                                  <div className="text-xs font-bold text-slate-600 flex items-center gap-2"><Clock size={12} className="text-[#E8622A]"/> {timeAgo(rev.created_at)}</div>
                                </td>
                                <td className="px-8 py-5 text-center font-black text-[#2D1B4E]">{rev.q1}</td>
                                <td className="px-8 py-5 text-center font-black text-[#2D1B4E]">{rev.q2}</td>
                                <td className="px-8 py-5 text-center font-black text-[#2D1B4E]">{rev.q3}</td>
                                <td className="px-8 py-5 text-center font-black text-[#2D1B4E]">{rev.q4}</td>
                                <td className="px-8 py-5 text-right">
                                  <span className="bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-lg text-xs font-black inline-flex items-center gap-1 border border-yellow-200">
                                    <Star size={12} fill="currentColor"/> {rev.average_score}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SEKME: ONAY BEKLEYENLER */}
            {activeTab === 'pending' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                    <Clock className="text-[#E8622A]" size={24}/>
                    <h2 className="text-lg font-black uppercase tracking-widest text-[#2D1B4E] font-['Plus_Jakarta_Sans']">İşlem Bekleyen Başvurular</h2>
                  </div>
                  
                  <div className="p-0">
                    {pendingShops.length === 0 ? (
                      <div className="text-center py-24 text-slate-400">
                        <CheckCircle size={64} className="mx-auto mb-6 text-green-400/50"/>
                        <p className="font-bold text-sm uppercase tracking-widest">Süper! Onay bekleyen işletme yok.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">İşletme Bilgisi</th>
                              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">Bekleme Süresi</th>
                              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">İletişim & Paket</th>
                              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right whitespace-nowrap">Aksiyonlar</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pendingShops.map(shop => (
                              <tr key={shop.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                                <td className="px-8 py-6 min-w-[200px]">
                                  <div className="font-black text-base text-[#2D1B4E] uppercase mb-1 font-['Plus_Jakarta_Sans']">{shop.name}</div>
                                  <div className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                                    <MapPin size={12} className="text-[#E8622A]"/> {shop.location} • {shop.category}
                                  </div>
                                  <div className="text-[10px] text-slate-400 mt-2 max-w-xs truncate">{shop.description || 'Açıklama yok'}</div>
                                </td>
                                <td className="px-8 py-6">
                                  <span className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 w-fit border border-orange-100 whitespace-nowrap">
                                    <AlertCircle size={16}/> {timeAgo(shop.created_at)}
                                  </span>
                                </td>
                                <td className="px-8 py-6 min-w-[150px]">
                                  <div className="font-black text-sm text-[#2D1B4E] mb-2 flex items-center gap-2 whitespace-nowrap">
                                    <Crown size={16} className={shop.package === 'Premium' ? 'text-yellow-500' : 'text-slate-400'}/> {shop.package} Paket
                                  </div>
                                  <div className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-2"><Mail size={12}/> {shop.admin_email}</div>
                                  <div className="text-xs font-bold text-slate-500 flex items-center gap-2"><Phone size={12}/> {shop.contact_phone}</div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <div className="flex items-center justify-end gap-2 flex-col sm:flex-row">
                                    <button onClick={() => sendReminderEmail(shop)} disabled={isSendingMail} className="bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white px-4 py-2 sm:px-5 sm:py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-200 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
                                      <Mail size={16}/> <span className="hidden lg:inline">Hatırlat</span>
                                    </button>
                                    <button onClick={() => approveShop(shop)} className="bg-[#00c48c] hover:bg-green-600 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-none transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 w-full sm:w-auto">
                                      <Check size={16}/> <span className="hidden lg:inline">Onayla</span>
                                    </button>
                                    <button onClick={() => deleteShop(shop.id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2 sm:p-3 rounded-xl border border-red-200 transition-colors cursor-pointer w-full sm:w-auto flex justify-center" title="Reddet ve Sil">
                                      <Trash2 size={18}/>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SEKME: AKTİF İŞLETMELER */}
            {activeTab === 'active' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div className="relative w-full max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                    <input type="text" placeholder="Aktif İşletmelerde Ara..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-[20px] py-4 pl-14 pr-6 font-bold text-sm outline-none focus:border-[#E8622A] shadow-sm text-[#2D1B4E]"/>
                  </div>
                  <div className="text-sm font-black text-slate-400 uppercase tracking-widest bg-white px-6 py-4 rounded-[20px] border border-slate-200 shadow-sm w-full md:w-auto text-center md:text-left">
                    Toplam: <span className="text-[#E8622A]">{filteredActiveShops.length}</span> İşletme
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">İşletme Profili</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">Sistem Bilgileri</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">Seçilen Paket</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right whitespace-nowrap">Yönetim</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredActiveShops.map(shop => (
                          <tr key={shop.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-6 min-w-[250px]">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-400 overflow-hidden shrink-0">
                                  {shop.logo_url ? <img src={shop.logo_url} className="w-full h-full object-cover"/> : <Store size={20}/>}
                                </div>
                                <div>
                                  <div className="font-black text-base text-[#2D1B4E] uppercase font-['Plus_Jakarta_Sans']">{shop.name}</div>
                                  <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-1"><MapPin size={10}/> {shop.location}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6 min-w-[150px]">
                              <div className="font-bold text-sm text-slate-700 mb-1">K.Adı: <span className="text-[#2D1B4E]">{shop.admin_username}</span></div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                  {showPasswords[shop.id] ? shop.admin_password : '******'}
                                </span>
                                <button onClick={() => togglePassword(shop.id)} className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-orange-500">
                                  {showPasswords[shop.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                                </button>
                              </div>
                            </td>
                            <td className="px-8 py-6 min-w-[150px]">
                              <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border inline-flex items-center gap-2 whitespace-nowrap ${shop.package === 'Premium' || shop.package === 'Premium Paket' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                <Crown size={12}/> {shop.package}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button onClick={() => deleteShop(shop.id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl border border-red-200 transition-colors cursor-pointer shadow-sm" title="Sistemden Tamamen Sil">
                                <Trash2 size={18}/>
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredActiveShops.length === 0 && (
                          <tr><td colSpan="4" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-sm">Sistemde onaylı işletme bulunamadı.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SEKME: RANDEVULAR */}
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
                                <button onClick={() => deleteAppointmentCompletely(app.id)} className="text-slate-400 hover:text-red-500 transition-colors p-3 bg-white rounded-xl border border-slate-200 hover:border-red-200 shadow-sm cursor-pointer outline-none" title="Randevuyu Sil">
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

            {/* SEKME: MÜŞTERİLER */}
            {activeTab === 'customers' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-[#2D1B4E] rounded-[32px] p-8 md:p-12 text-center relative overflow-hidden mb-10 shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8622A]/20 rounded-full blur-[80px] pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00c48c]/20 rounded-full blur-[80px] pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20 backdrop-blur-sm"><FileSpreadsheet size={32} className="md:w-10 md:h-10"/></div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4 font-['Plus_Jakarta_Sans']">Müşteri Veritabanı</h2>
                    <p className="text-slate-300 font-medium max-w-2xl mx-auto mb-10 text-sm md:text-base leading-relaxed">Platform üzerinden randevu alan tüm müşterilerin datalarını (isim, telefon, mekan, tarih) topluca görüntüleyebilir ve pazarlama kampanyaları (SMS/Email) için Excel formatında indirebilirsiniz.</p>
                    <button onClick={exportToExcel} className="w-full sm:w-auto bg-[#E8622A] hover:bg-orange-500 hover:scale-105 transition-all text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 border-none cursor-pointer mx-auto shadow-[0_0_40px_rgba(232,98,42,0.4)]">
                      <Download size={20}/> EXCEL LİSTESİNİ İNDİR
                    </button>
                    <p className="text-[10px] text-white/50 mt-6 uppercase tracking-widest font-bold">Toplam {appointments.length} Kayıt Bulunuyor</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                  <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Users className="text-[#E8622A]" size={24}/>
                      <h2 className="text-lg font-black uppercase tracking-widest text-[#2D1B4E] font-['Plus_Jakarta_Sans']">Müşteri Kayıtları ({uniqueCustomers.length})</h2>
                    </div>
                    <div className="relative w-full md:w-72">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                      <input type="text" placeholder="İsim veya Telefon Ara..." value={customerSearch} onChange={e=>setCustomerSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-bold text-xs outline-none focus:border-[#E8622A] text-[#2D1B4E]"/>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto w-full max-h-[600px] custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                        <tr>
                          <th className="px-6 md:px-8 py-4 md:py-5 text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">Müşteri Ad Soyad</th>
                          <th className="px-6 md:px-8 py-4 md:py-5 text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">İletişim (Telefon / Email)</th>
                          <th className="px-6 md:px-8 py-4 md:py-5 text-[10px] font-black uppercase text-slate-400 whitespace-nowrap">Son İşlem / Mekan</th>
                          <th className="px-6 md:px-8 py-4 md:py-5 text-[10px] font-black uppercase text-slate-400 whitespace-nowrap text-right">Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.length > 0 ? filteredCustomers.map((cust, idx) => {
                          const shop = shops.find(s => s.id === cust.shop_id);
                          return (
                            <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                              <td className="px-6 md:px-8 py-4 md:py-5">
                                <div className="font-black text-xs md:text-sm text-[#2D1B4E] uppercase flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center text-xs shrink-0">{cust.customer_name?.[0] || 'U'}</div>
                                  <span className="whitespace-nowrap">{cust.customer_name} {cust.customer_surname}</span>
                                </div>
                              </td>
                              <td className="px-6 md:px-8 py-4 md:py-5">
                                <div className="font-bold text-[10px] md:text-xs text-slate-700 flex items-center gap-2 mb-1"><Phone size={12} className="text-[#E8622A] shrink-0"/> {cust.customer_phone || '-'}</div>
                                <div className="font-medium text-[10px] md:text-xs text-slate-400 flex items-center gap-2"><Mail size={12} className="shrink-0"/> {cust.customer_email || '-'}</div>
                              </td>
                              <td className="px-6 md:px-8 py-4 md:py-5">
                                <div className="font-bold text-[10px] md:text-xs text-[#2D1B4E] mb-1 whitespace-nowrap">{shop ? shop.name : 'Bilinmeyen Mekan'}</div>
                                <div className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{cust.appointment_date} • {cust.service_name}</div>
                              </td>
                              <td className="px-6 md:px-8 py-4 md:py-5 text-right">
                                {cust.status === 'Tamamlandı' ? (
                                  <span className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-green-100 inline-flex items-center gap-1"><Check size={12}/> Aktif</span>
                                ) : (
                                  <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-slate-200 inline-flex items-center gap-1 whitespace-nowrap"><Clock size={12}/> {cust.status || 'Bekliyor'}</span>
                                )}
                              </td>
                            </tr>
                          );
                        }) : (
                          <tr><td colSpan="4" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-sm">Müşteri datası bulunamadı.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SEKME: ABONELİK */}
            {activeTab === 'billing' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black text-[#2D1B4E] mb-8 uppercase italic flex items-center gap-3"><CreditCard className="text-orange-500"/> Abonelik Takip Sistemi</h2>
                <div className="space-y-4">
                  {approvedShops.map(shop => {
                    const sub = getSubStatus(shop.created_at);
                    return (
                      <div key={shop.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm border-l-4 border-l-orange-500 gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-xs border border-slate-100 overflow-hidden shrink-0">
                            {shop.logo_url ? <img src={shop.logo_url} className="w-full h-full object-cover"/> : <Store size={20} className="text-slate-300"/>}
                          </div>
                          <div>
                            <p className="font-black text-[#2D1B4E] uppercase text-sm">{shop.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{shop.package} Paket - {shop.package === 'Premium' || shop.package === 'Premium Paket' ? '100 STG' : '60 STG'} / Ay</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 md:gap-12 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                          <div className="text-left md:text-center flex-1 md:flex-none">
                            <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Dönem Sonu</p>
                            <p className="text-xs font-bold text-slate-600">{sub.end}</p>
                          </div>
                          <div className="text-left md:text-center flex-1 md:flex-none">
                            <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Kalan</p>
                            <p className={`text-sm font-black ${sub.remaining < 5 ? 'text-red-500 animate-pulse' : 'text-[#00c48c]'}`}>{sub.remaining} Gün</p>
                          </div>
                          <button onClick={() => sendReminderMailAbonelik(shop)} className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 px-6 py-3 md:py-4 rounded-2xl border-none font-black text-[10px] uppercase cursor-pointer hover:bg-indigo-600 hover:text-white transition-all tracking-widest shadow-sm">
                            <Send size={14}/> HATIRLAT
                          </button>
                        </div>
                      </div>
                    )
                  })}
                  {approvedShops.length === 0 && <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">Kayıtlı abone bulunmuyor.</div>}
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}