"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Store, Users, CheckCircle, Clock, Search, Mail, 
  ShieldCheck, XCircle, LogOut, Download, CheckCircle2, ChevronRight,
  TrendingUp, Trash2, AlertCircle, FileSpreadsheet, MapPin, Crown, 
  Activity, CalendarCheck, Check, Lock, Phone, Star, MessageSquare, BarChart3,
  CreditCard, Send, Eye, EyeOff, Filter, Scissors
} from 'lucide-react';
import AdminTrialControl from '@/components/AdminTrialControl';
import { supabase } from '@/lib/supabase';
import { getActivationTemplate, getRegistrationTemplate } from '@/lib/emailTemplates';

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
  
  // -- KİMLİK DOĞRULAMA STATELERİ --
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [shops, setShops] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  const [isSendingMail, setIsSendingMail] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  // -- GLOBAL CRM STATELERİ --
  const [crmUsers, setCrmUsers] = useState([]);
  const [crmSearchQuery, setCrmSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('Tümü');
  const [filterService, setFilterService] = useState('');

  // 1. UYGULAMA AÇILDIĞINDA OTURUM KONTROLÜ
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Eğer sistemde senin mailinle bir oturum açıksa içeri al
      if (session && session.user.email === 'dogukandavman01@gmail.com') {
        setIsAuthenticated(true);
        fetchData(); 
      } else {
        setIsAuthenticated(false);
        setLoading(false); 
      }
    };
    
    checkSession();
  }, []);

  // 2. SUPABASE İLE ASKERİ DÜZEY GİRİŞ SİSTEMİ
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      if (adminEmail !== 'dogukandavman01@gmail.com') {
        alert("Yetkisiz Kullanıcı! Sadece sistem yöneticisi giriş yapabilir.");
        setLoginLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPass,
      });

      if (error) {
        alert("Giriş Başarısız: Şifre veya E-posta hatalı.");
      } else if (data.session) {
        setIsAuthenticated(true);
        fetchData(); 
      }
    } catch (err) {
      alert("Sistemsel bir hata oluştu.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setShops([]);
    setAppointments([]);
    setReviews([]);
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

  // GLOBAL CRM VERİSİNİ HAZIRLA (Randevular veya İşletmeler Değiştiğinde Çalışır)
  useEffect(() => {
    if (!appointments.length || !shops.length) return;

    const userMap = new Map();
    appointments.forEach(a => {
      const shop = shops.find(s => s.id === a.shop_id);
      const key = a.customer_email || a.customer_phone || `${a.customer_name}_${a.customer_surname}`;
      
      if (!userMap.has(key)) {
        userMap.set(key, {
          name: `${a.customer_name} ${a.customer_surname}`.toUpperCase(),
          phone: a.customer_phone,
          email: a.customer_email || 'Belirtilmemiş',
          total_bookings: 0,
          shops_visited: new Set(),
          regions_visited: new Set(),
          services_received: new Set(),
          last_visit: a.appointment_date,
        });
      }

      const u = userMap.get(key);
      u.total_bookings += 1;
      if (shop?.name) u.shops_visited.add(shop.name);
      if (shop?.region) u.regions_visited.add(shop.region);
      if (a.service_name) u.services_received.add(a.service_name);
      
      if (new Date(a.appointment_date) > new Date(u.last_visit)) {
        u.last_visit = a.appointment_date;
      }
    });

    const processedUsers = Array.from(userMap.values()).map(u => ({
      ...u,
      shops_visited: Array.from(u.shops_visited),
      regions_visited: Array.from(u.regions_visited),
      services_received: Array.from(u.services_received),
    }));

    setCrmUsers(processedUsers);
  }, [appointments, shops]);

  const approveShop = async (shop) => {
    const isConfirmed = window.confirm(`${shop.name} işletmesini ONAYLAMAK istediğinize emin misiniz?`);
    if (!isConfirmed) return;

    setLoading(true);
    const { error } = await supabase.from('shops').update({ status: 'approved' }).eq('id', shop.id);
    if (!error) {
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
      } catch (err) { console.error(err); }
      alert("İşletme Başarıyla Onaylandı!");
      fetchData();
    } else {
      alert("Kritik Hata: " + error.message);
    }
    setLoading(false);
  };

  const deleteShop = async (id) => {
    const isConfirmed = window.confirm("DİKKAT: Bu işletmeyi sistemden TAMAMEN SİLMEK istediğinize emin misiniz?");
    if (isConfirmed) {
      const { error } = await supabase.from('shops').delete().eq('id', id);
      if (!error) { alert("İşletme kalıcı olarak silindi."); fetchData(); } 
      else { alert("Silme hatası: " + error.message); }
    }
  };

  const sendReminderEmail = async (shop) => {
    const isConfirmed = window.confirm(`${shop.name} işletmesine ödeme hatırlatma maili gönderilecek. Onaylıyor musunuz?`);
    if (!isConfirmed) return;
    setIsSendingMail(true);
    try {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: shop.admin_email,
          subject: 'Ödeme Hatırlatması - Bookcy Kayıt Talebi',
          html: getRegistrationTemplate({
            shopName: shop.name,
            date: new Date(shop.created_at).toLocaleDateString('tr-TR'),
            packageName: (shop.package || 'Standart Paket').toUpperCase(),
            price: (shop.package === 'Premium' || shop.package === 'Premium Paket') ? '100 STG' : '60 STG'
          })
        }),
      });
      alert("Hatırlatma maili başarıyla gönderildi!");
    } catch (err) {
      alert("Mail hatası.");
    } finally {
      setIsSendingMail(false);
    }
  };

  const sendReminderMailAbonelik = (shop) => {
    alert(`${shop.name} işletmesine abonelik yenileme hatırlatması başarıyla gönderildi.`);
  };

  const togglePassword = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const exportToExcel = () => {
    if(appointments.length === 0) return alert("Dışa aktarılacak veri bulunmuyor.");
    let csvContent = '\uFEFF';
    csvContent += "Musteri Ad Soyad,Telefon,E-Posta,Islem Yaptigi Mekan,Tarih,Saat,Hizmet,Atanan Uzman,Durum\n";
    appointments.forEach(a => {
      const shop = shops.find(s => s.id === a.shop_id);
      const shopName = shop ? shop.name.replace(/,/g, ' ') : 'Bilinmeyen Mekan';
      csvContent += `${a.customer_name} ${a.customer_surname},${a.customer_phone},${a.customer_email},${shopName},${a.appointment_date},${a.appointment_time},${a.service_name},${a.staff_name},${a.status}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "bookcy_musteri_datasi.csv");
    link.click();
  };

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

  const filteredCrmUsers = crmUsers.filter(u => {
    const matchesSearch = u.name.includes(crmSearchQuery.toUpperCase()) || (u.phone && u.phone.includes(crmSearchQuery)) || u.email.toLowerCase().includes(crmSearchQuery.toLowerCase());
    const matchesRegion = filterRegion === 'Tümü' || u.regions_visited.includes(filterRegion);
    const matchesService = filterService === '' || u.services_received.some(s => s.toLowerCase().includes(filterService.toLowerCase()));
    return matchesSearch && matchesRegion && matchesService;
  });

  const totalRevs = reviews.length;
  const avgTotal = totalRevs > 0 ? (reviews.reduce((a, b) => a + Number(b.average_score || 0), 0) / totalRevs).toFixed(1) : 0;
  
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
      <div className="min-h-screen bg-[#0B0710] flex flex-col items-center justify-center p-4 font-['DM_Sans']">
        <div className="bg-[#150D1E] w-full max-w-[400px] rounded-[32px] p-10 relative shadow-2xl border border-[#382252] text-center">
          <ShieldCheck size={48} className="mx-auto text-[#E8622A] mb-6" />
          <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">SİSTEM YÖNETİMİ</h1>
          <p className="text-slate-400 text-sm mb-8">Devam etmek için yetkili hesapla giriş yapın.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              required 
              placeholder="Yönetici E-Posta" 
              className="w-full bg-[#1D122A] border border-[#382252] rounded-2xl py-4 px-6 text-white outline-none focus:border-[#E8622A]" 
              value={adminEmail} 
              onChange={(e) => setAdminEmail(e.target.value)} 
            />
            <input 
              type="password" 
              required 
              placeholder="Sistem Şifresi" 
              className="w-full bg-[#1D122A] border border-[#382252] rounded-2xl py-4 px-6 text-white outline-none focus:border-[#E8622A]" 
              value={adminPass} 
              onChange={(e) => setAdminPass(e.target.value)} 
            />
            <button 
              type="submit" 
              disabled={loginLoading}
              className={`w-full text-white py-4 rounded-2xl font-black uppercase border-none cursor-pointer transition-all ${loginLoading ? 'bg-slate-600' : 'bg-[#E8622A] hover:bg-[#d5521b]'}`}
            >
              {loginLoading ? 'DOĞRULANIYOR...' : 'SİSTEMİ AÇ'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-[#2D1B4E] font-['DM_Sans']">
      <aside className="w-64 bg-[#2D1B4E] text-white h-screen sticky top-0 flex flex-col shrink-0 shadow-2xl z-40 hidden md:flex">
        <div className="p-8 border-b border-white/10">
          <span className="font-black text-xl tracking-tighter font-['Plus_Jakarta_Sans']">admin<span className="text-[#E8622A]">.</span></span>
        </div>
        <div className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto scrollbar-hide">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm border-none cursor-pointer text-left ${activeTab === 'overview' ? 'bg-[#E8622A] text-white' : 'bg-transparent text-slate-400 hover:text-white'}`}><LayoutDashboard size={18}/> Özet Panel</button>
          <button onClick={() => setActiveTab('pending')} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm border-none cursor-pointer text-left ${activeTab === 'pending' ? 'bg-[#E8622A] text-white' : 'bg-transparent text-slate-400 hover:text-white'}`}><span className="flex items-center gap-3"><Clock size={18}/> Yeni Başvurular</span> {pendingShops.length > 0 && <span className="bg-white text-[#E8622A] text-xs px-2 rounded-full font-black">{pendingShops.length}</span>}</button>
          <button onClick={() => setActiveTab('active')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm border-none cursor-pointer text-left ${activeTab === 'active' ? 'bg-[#E8622A] text-white' : 'bg-transparent text-slate-400 hover:text-white'}`}><Store size={18}/> Aktif İşletmeler</button>
          
          {/* YENİ EKLENEN GLOBAL CRM BUTONU */}
          <button onClick={() => setActiveTab('crm')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm border-none cursor-pointer text-left ${activeTab === 'crm' ? 'bg-[#E8622A] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-white'}`}><ShieldCheck size={18}/> Global CRM</button>
          
          <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm border-none cursor-pointer text-left ${activeTab === 'appointments' ? 'bg-[#E8622A] text-white' : 'bg-transparent text-slate-400 hover:text-white'}`}><CalendarCheck size={18} /> Randevular</button>
          <button onClick={() => setActiveTab('customers')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm border-none cursor-pointer text-left ${activeTab === 'customers' ? 'bg-[#E8622A] text-white' : 'bg-transparent text-slate-400 hover:text-white'}`}><Users size={18}/> Temel Müşteriler</button>
          <button onClick={() => setActiveTab('billing')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm border-none cursor-pointer text-left ${activeTab === 'billing' ? 'bg-[#E8622A] text-white' : 'bg-transparent text-slate-400 hover:text-white'}`}><CreditCard size={18} /> Abonelik</button>
          <button onClick={() => setActiveTab('feedbacks')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm border-none cursor-pointer text-left ${activeTab === 'feedbacks' ? 'bg-[#E8622A] text-white' : 'bg-transparent text-slate-400 hover:text-white'}`}><Star size={18}/> Değerlendirmeler</button>
        </div>
        <div className="p-4"><button onClick={handleLogout} className="w-full bg-red-500/10 text-red-500 py-4 rounded-xl font-bold text-xs uppercase border-none cursor-pointer hover:bg-red-500 hover:text-white transition-all">Çıkış Yap</button></div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto h-screen">
        {loading ? (
          <div className="text-center py-32 animate-pulse font-black text-[#2D1B4E] flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#E8622A] border-t-transparent rounded-full animate-spin"></div>
            SİSTEM YÜKLENİYOR...
          </div>
        ) : (
          <div className="max-w-[1400px] mx-auto pb-20">
            
            {activeTab === 'overview' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Toplam İşletme</p>
                    <p className="text-4xl font-black text-[#2D1B4E]">{activeShops.length}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Onay Bekleyen</p>
                    <p className="text-4xl font-black text-orange-500">{pendingShops.length}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Kayıtlı Müşteri</p>
                    <p className="text-4xl font-black text-blue-500">{uniqueCustomers.length}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Ortalama Puan</p>
                    <p className="text-4xl font-black text-yellow-500">{avgTotal}</p>
                  </div>
                </div>

                <div className="mb-10">
                  <AdminTrialControl />
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-slate-100 mb-10 shadow-sm">
                  <h3 className="text-xl font-black uppercase mb-8 flex items-center gap-2"><BarChart3 className="text-[#E8622A]"/> Sektörel Dağılım</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {sortedCategoryStats.map(([cat, count]) => (
                      <div key={cat} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-[#E8622A]">
                        <span className="font-bold text-slate-600 uppercase text-xs">{cat}</span>
                        <span className="bg-white text-[#E8622A] font-black text-xl px-4 py-1 rounded-xl shadow-sm">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --- YENİ GLOBAL CRM SEKMESİ --- */}
            {activeTab === 'crm' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-6">
                  <div>
                    <h1 className="text-3xl font-black text-[#2D1B4E] uppercase tracking-tight">Global Müşteri Ağı (CRM)</h1>
                    <p className="text-sm font-bold text-slate-500 mt-2">Platformdaki tüm işletmelerin ve müşterilerin birleşik veri tabanı.</p>
                  </div>
                  <button onClick={exportToExcel} className="bg-[#2D1B4E] hover:bg-[#1a0f2e] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border-none cursor-pointer shadow-lg transition-colors">
                    <Download size={16}/> Veriyi İndir
                  </button>
                </div>

                <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm mb-8">
                  <h3 className="font-black text-sm text-[#2D1B4E] uppercase tracking-widest mb-4 flex items-center gap-2"><Filter size={16} className="text-[#E8622A]"/> Dinamik Segmentasyon Filtreleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                      <input type="text" placeholder="İsim, Telefon veya Mail..." value={crmSearchQuery} onChange={(e)=>setCrmSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-bold text-sm outline-none focus:border-[#E8622A]"/>
                    </div>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                      <select value={filterRegion} onChange={(e)=>setFilterRegion(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-bold text-sm outline-none focus:border-[#E8622A] appearance-none cursor-pointer">
                        <option value="Tümü">Tüm Bölgeler</option>
                        <option value="Girne">Girne</option>
                        <option value="Lefkoşa">Lefkoşa</option>
                        <option value="Mağusa">Mağusa</option>
                        <option value="İskele">İskele</option>
                      </select>
                    </div>
                    <div className="relative md:col-span-2">
                      <Scissors size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                      <input type="text" placeholder="Hizmet Adı (Örn: Tattoo, VIP Loca, Saç Kesimi)" value={filterService} onChange={(e)=>setFilterService(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-bold text-sm outline-none focus:border-[#E8622A]"/>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <p className="text-xs font-bold text-slate-500">Bu filtrelere uyan <span className="font-black text-[#E8622A]">{filteredCrmUsers.length}</span> eşsiz müşteri bulundu.</p>
                    <button className="bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors border-none cursor-pointer">
                      <Send size={14}/> Toplu Mail At
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden w-full">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50">
                        <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <th className="px-6 py-5 border-b border-slate-100">Müşteri</th>
                          <th className="px-6 py-5 border-b border-slate-100">Gittiği Bölgeler</th>
                          <th className="px-6 py-5 border-b border-slate-100">Aldığı Hizmetler</th>
                          <th className="px-6 py-5 border-b border-slate-100 text-center">Toplam İşlem</th>
                          <th className="px-6 py-5 border-b border-slate-100 text-center">Son Ziyaret</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCrmUsers.map((u, i) => (
                          <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-black text-sm text-[#2D1B4E]">{u.name}</div>
                              <div className="text-[10px] font-bold text-slate-400 mt-1 flex gap-2"><span>{u.phone}</span> • <span>{u.email}</span></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {u.regions_visited.map((r, idx) => (<span key={idx} className="bg-orange-50 text-[#E8622A] px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">{r}</span>))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {u.services_received.slice(0, 3).map((s, idx) => (<span key={idx} className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 rounded text-[9px] font-bold">{s}</span>))}
                                {u.services_received.length > 3 && <span className="text-[9px] font-bold text-slate-400 mt-1">+{u.services_received.length - 3} daha</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center font-black text-lg text-[#2D1B4E]">{u.total_bookings}</td>
                            <td className="px-6 py-4 text-center"><span className="font-bold text-sm text-[#E8622A]">{u.last_visit}</span></td>
                          </tr>
                        ))}
                        {filteredCrmUsers.length === 0 && <tr><td colSpan="5" className="text-center p-10 text-slate-400 font-bold uppercase tracking-widest">Filtrelere uygun müşteri bulunamadı.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {/* ------------------------------------- */}

            {activeTab === 'pending' && (
              <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                  <Clock className="text-[#E8622A]" size={24}/>
                  <h2 className="text-lg font-black uppercase text-[#2D1B4E]">Onay Bekleyen Başvurular</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">İşletme Bilgisi</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Bekleme</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">İletişim & Paket</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">Aksiyonlar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingShops.map(shop => (
                        <tr key={shop.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="font-black text-base text-[#2D1B4E] uppercase">{shop.name}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{shop.location} • {shop.category}</div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-orange-100">{timeAgo(shop.created_at)}</span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="font-black text-sm text-[#2D1B4E] mb-1">{shop.package} Paket</div>
                            <div className="text-xs font-bold text-slate-500">{shop.admin_email}</div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => sendReminderEmail(shop)} disabled={isSendingMail} className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-blue-200 cursor-pointer transition-all">
                                <Mail size={16} className="inline mr-1"/> Hatırlat
                              </button>
                              <button onClick={() => approveShop(shop)} className="bg-[#00c48c] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase border-none cursor-pointer shadow-lg hover:bg-[#00a375]">
                                <Check size={16} className="inline mr-1"/> Onayla
                              </button>
                              <button onClick={() => deleteShop(shop.id)} className="bg-red-50 text-red-500 p-2 rounded-xl border border-red-200 cursor-pointer hover:bg-red-500 hover:text-white transition-all">
                                <Trash2 size={16}/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {pendingShops.length === 0 && <div className="p-20 text-center text-slate-400 font-bold uppercase text-xs">Yeni başvuru yok.</div>}
                </div>
              </div>
            )}

            {activeTab === 'active' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative mb-6">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                  <input type="text" placeholder="İşletme Ara..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-[20px] py-4 pl-14 pr-6 font-bold text-sm outline-none focus:border-[#E8622A]"/>
                </div>
                <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">İşletme</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Giriş Bilgileri</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Paket</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">Yönetim</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredActiveShops.map(shop => (
                        <tr key={shop.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="font-black text-base text-[#2D1B4E] uppercase">{shop.name}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{shop.location}</div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="font-bold text-sm text-slate-700">K.Adı: {shop.admin_username}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-slate-400">{showPasswords[shop.id] ? shop.admin_password : '******'}</span>
                              <button onClick={() => togglePassword(shop.id)} className="bg-transparent border-none cursor-pointer text-slate-400 hover:text-orange-500">
                                {showPasswords[shop.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                              </button>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-slate-200">{shop.package}</span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button onClick={() => deleteShop(shop.id)} className="bg-red-50 text-red-500 p-3 rounded-xl border border-red-200 cursor-pointer shadow-sm hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                  <CalendarCheck className="text-[#E8622A]" size={24}/>
                  <h2 className="text-lg font-black uppercase text-[#2D1B4E]">Son Randevular ({appointments.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400">Tarih</th>
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400">Müşteri</th>
                        <th className="p-6 text-[10px] font-black uppercase text-slate-400">Mekan / Hizmet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map(app => {
                        const shopData = shops.find(s => s.id === app.shop_id);
                        return (
                          <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50">
                            <td className="p-6">
                              <div className="font-black text-[#E8622A] text-sm">{app.appointment_date}</div>
                              <div className="text-xs font-bold text-slate-500 flex items-center gap-1"><Clock size={12}/> {app.appointment_time}</div>
                            </td>
                            <td className="p-6">
                              <div className="font-bold text-[#2D1B4E] text-sm uppercase">{app.customer_name} {app.customer_surname}</div>
                              <div className="text-xs font-medium text-slate-400">{app.customer_phone}</div>
                            </td>
                            <td className="p-6 text-xs font-bold text-slate-600">
                              {shopData?.name} <br/><span className="text-slate-400 font-medium">{app.service_name}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-black uppercase text-[#2D1B4E]">Temel Müşteri Kayıtları ({uniqueCustomers.length})</h2>
                    <input type="text" placeholder="Müşteri Ara..." value={customerSearch} onChange={e=>setCustomerSearch(e.target.value)} className="bg-white border border-slate-200 rounded-xl py-2 px-4 outline-none focus:border-[#E8622A]"/>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Ad Soyad</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">İletişim</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Son İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((cust, idx) => (
                        <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-5 font-black text-sm uppercase">{cust.customer_name} {cust.customer_surname}</td>
                          <td className="px-8 py-5 text-xs font-bold text-slate-600">{cust.customer_phone} <br/> {cust.customer_email}</td>
                          <td className="px-8 py-5 text-xs font-bold text-slate-400 uppercase">{cust.appointment_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-black mb-8 uppercase italic flex items-center gap-3"><CreditCard className="text-orange-500"/> Abonelik Takibi</h2>
                {activeShops.map(shop => {
                  const sub = getSubStatus(shop.created_at);
                  return (
                    <div key={shop.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between shadow-sm border-l-4 border-l-orange-500 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                          {shop.logo_url ? <img src={shop.logo_url} className="w-full h-full object-cover"/> : <Store size={20}/>}
                        </div>
                        <div>
                          <p className="font-black text-[#2D1B4E] uppercase text-sm">{shop.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{shop.package} Paket</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Dönem Sonu</p>
                          <p className="text-xs font-bold text-slate-600">{sub.end}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Kalan</p>
                          <p className={`text-sm font-black ${sub.remaining < 5 ? 'text-red-500' : 'text-[#00c48c]'}`}>{sub.remaining} Gün</p>
                        </div>
                        <button onClick={() => sendReminderMailAbonelik(shop)} className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-2xl border-none font-black text-[10px] uppercase cursor-pointer hover:bg-indigo-600 hover:text-white transition-all tracking-widest shadow-sm">HATIRLAT</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {activeTab === 'feedbacks' && (
              <div>
                <div className="bg-[#2D1B4E] rounded-[32px] p-12 text-left relative overflow-hidden mb-10 shadow-2xl flex justify-between items-center">
                  <div>
                    <h2 className="text-4xl font-black uppercase text-white mb-2 font-['Plus_Jakarta_Sans']">Platform Raporu</h2>
                    <p className="text-slate-300">Müşteri memnuniyet analizleri.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-8 rounded-[32px] text-center border border-white/20">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Genel Skor</p>
                    <div className="text-6xl font-black text-white">{avgTotal}<span className="text-2xl text-slate-400">/10</span></div>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                   <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Tarih</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Deneyim</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Kolaylık</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Hız</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">Ortalama</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((rev, index) => (
                        <tr key={index} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-5 text-xs font-bold text-slate-600">{timeAgo(rev.created_at)}</td>
                          <td className="px-8 py-5 text-center font-black">{rev.q1}</td>
                          <td className="px-8 py-5 text-center font-black">{rev.q2}</td>
                          <td className="px-8 py-5 text-center font-black">{rev.q4}</td>
                          <td className="px-8 py-5 text-right"><span className="bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-lg text-xs font-black">{rev.average_score}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}