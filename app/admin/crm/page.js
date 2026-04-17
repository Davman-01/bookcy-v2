"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, Users, MapPin, Scissors, Search, Filter, 
  BarChart3, Store, Mail, Calendar, ChevronRight, Download, Send
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SuperAdminCRM() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Veriler
  const [rawAppointments, setRawAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Filtreler
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('Tümü');
  const [filterService, setFilterService] = useState('');
  
  // İstatistikler
  const [stats, setStats] = useState({ totalUsers: 0, totalBookings: 0, activeShops: 0 });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  async function checkAdminAccess() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push('/randevu-sorgula');

    // Super Admin mi kontrol et
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_super_admin')
      .eq('id', session.user.id)
      .single();

    if (!profile?.is_super_admin) {
      alert("Bu sayfaya erişim yetkiniz yok! Sadece Super Admin girebilir.");
      return router.push('/dashboard');
    }

    setIsAdmin(true);
    fetchAllPlatformData();
  }

  async function fetchAllPlatformData() {
    setLoading(true);
    
    // Tüm randevuları ve bağlı dükkan bilgilerini çek (Super Admin RLS kuralı sayesinde hepsini görebiliriz)
    const { data: appts, error } = await supabase
      .from('appointments')
      .select(`
        *,
        shops ( name, region, category )
      `)
      .order('appointment_date', { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setRawAppointments(appts || []);
    processCrmData(appts || []);
  }

  function processCrmData(appts) {
    const userMap = new Map();
    const shopSet = new Set();

    appts.forEach(a => {
      if (a.shops?.name) shopSet.add(a.shops.name);
      
      // E-posta veya Telefonu benzersiz kimlik olarak kullan
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
          status: a.status
        });
      }

      const u = userMap.get(key);
      u.total_bookings += 1;
      if (a.shops?.name) u.shops_visited.add(a.shops.name);
      if (a.shops?.region) u.regions_visited.add(a.shops.region);
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

    setUsers(processedUsers);
    setStats({
      totalUsers: processedUsers.length,
      totalBookings: appts.length,
      activeShops: shopSet.size
    });
    setLoading(false);
  }

  // --- FİLTRELEME MANTIĞI ---
  const filteredUsers = users.filter(u => {
    // 1. Arama Filtresi (Ad, Telefon, Mail)
    const matchesSearch = 
      u.name.includes(searchQuery.toUpperCase()) || 
      u.phone.includes(searchQuery) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Bölge Filtresi (Müşterinin gittiği dükkanların bölgesine göre)
    const matchesRegion = filterRegion === 'Tümü' || u.regions_visited.includes(filterRegion);

    // 3. Hizmet Filtresi (Tattoo, Saç, VIP vb.)
    const matchesService = filterService === '' || u.services_received.some(s => s.toLowerCase().includes(filterService.toLowerCase()));

    return matchesSearch && matchesRegion && matchesService;
  });

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center font-['DM Sans'] text-white">
        <ShieldAlert size={64} className="text-[#E8622A] animate-pulse mb-6"/>
        <h1 className="text-2xl font-black uppercase tracking-widest">Global Sistem Yükleniyor</h1>
        <p className="text-slate-500 font-bold mt-2">Şifreleme ve yetki kontrolü yapılıyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-['DM Sans'] flex">
      
      {/* SOL MENÜ - SUPER ADMIN */}
      <div className="w-64 bg-[#111] text-white flex flex-col fixed h-full z-50 shadow-2xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-black text-xl uppercase tracking-tighter">BOOKCY<span className="text-[#E8622A]">.</span></h2>
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1 flex items-center gap-1">
            <ShieldAlert size={12}/> SUPER ADMIN
          </p>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-[#E8622A] text-white shadow-lg border-none cursor-pointer text-left">
            <Users size={18}/> Global CRM
          </button>
          <button onClick={()=>router.push('/dashboard')} className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest bg-transparent text-white/50 hover:bg-white/5 hover:text-white border-none cursor-pointer text-left transition-colors">
            <Store size={18}/> İşletmeler (Panel)
          </button>
        </nav>
      </div>

      {/* SAĞ İÇERİK */}
      <div className="ml-64 flex-1 p-8 md:p-12">
        <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-[#2D1B4E] uppercase tracking-tight">Global Müşteri Ağı (CRM)</h1>
            <p className="text-sm font-bold text-slate-500 mt-2">Platformdaki tüm işletmelerin ve müşterilerin birleşik veritabanı.</p>
          </div>
          <button className="bg-[#2D1B4E] hover:bg-[#1a0f2e] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border-none cursor-pointer shadow-lg transition-colors">
            <Download size={16}/> CSV Olarak İndir
          </button>
        </div>

        {/* KPI KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0"><Users size={24}/></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Eşsiz Müşteri</p>
              <p className="text-3xl font-black text-[#2D1B4E]">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-green-50 text-green-500 rounded-xl flex items-center justify-center shrink-0"><Calendar size={24}/></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Toplam Rezervasyon</p>
              <p className="text-3xl font-black text-[#2D1B4E]">{stats.totalBookings}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-orange-50 text-[#E8622A] rounded-xl flex items-center justify-center shrink-0"><Store size={24}/></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Aktif İşletme</p>
              <p className="text-3xl font-black text-[#2D1B4E]">{stats.activeShops}</p>
            </div>
          </div>
        </div>

        {/* FİLTRELEME ALANI (SEGMENTASYON) */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm mb-8">
          <h3 className="font-black text-sm text-[#2D1B4E] uppercase tracking-widest mb-4 flex items-center gap-2"><Filter size={16} className="text-[#E8622A]"/> Dinamik Segmentasyon Filtreleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input type="text" placeholder="İsim, Telefon veya Mail..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-bold text-sm outline-none focus:border-[#E8622A]"/>
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
            <p className="text-xs font-bold text-slate-500">Bu filtrelere uyan <span className="font-black text-[#E8622A]">{filteredUsers.length}</span> müşteri bulundu.</p>
            <button className="bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors border-none cursor-pointer">
              <Send size={14}/> Bu Kitleye Toplu Mail At
            </button>
          </div>
        </div>

        {/* VERİ TABLOSU */}
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
                {filteredUsers.map((u, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-black text-sm text-[#2D1B4E]">{u.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 mt-1 flex gap-2">
                        <span>{u.phone}</span> • <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {u.regions_visited.map((r, idx) => (
                          <span key={idx} className="bg-orange-50 text-[#E8622A] px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">{r}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {u.services_received.slice(0, 3).map((s, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 rounded text-[9px] font-bold">{s}</span>
                        ))}
                        {u.services_received.length > 3 && <span className="text-[9px] font-bold text-slate-400 mt-1">+{u.services_received.length - 3} daha</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-lg text-[#2D1B4E]">
                      {u.total_bookings}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-sm text-[#E8622A]">{u.last_visit}</span>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan="5" className="text-center p-10 text-slate-400 font-bold uppercase tracking-widest">Filtrelere uygun müşteri bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}