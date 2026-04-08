"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, Calendar, Users, Settings, LogOut, Plus, 
  TrendingUp, Star, DollarSign, CheckCircle2, XCircle, 
  PieChart, Menu, Scissors, Image as ImageIcon, Clock, Save, Trash2, 
  MessageSquare, Phone, UserPlus, Store, Camera, Instagram, Facebook, 
  MessageCircle, Mail, UploadCloud, Loader2, Bell, CalendarOff, Check, UserMinus, BarChart, Filter, Shield, Music, Ticket, CalendarHeart
} from 'lucide-react';

// === GECE SAATLERİ DAHİL TÜM SLOTLAR ===
const allTimeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", 
  "00:00", "00:30", "01:00", "01:30", "02:00"
];

// === SADECE ETKİNLİKLER İÇİN TAM 24 SAAT LİSTESİ ===
const eventTimeSlots = Array.from({length: 48}, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

const defaultWorkingHours = [
  { day: 'Pazartesi', open: '09:00', close: '19:00', isClosed: false },
  { day: 'Salı', open: '09:00', close: '19:00', isClosed: false },
  { day: 'Çarşamba', open: '09:00', close: '19:00', isClosed: false },
  { day: 'Perşembe', open: '09:00', close: '19:00', isClosed: false },
  { day: 'Cuma', open: '09:00', close: '19:00', isClosed: false },
  { day: 'Cumartesi', open: '09:00', close: '19:00', isClosed: false },
  { day: 'Pazar', open: '09:00', close: '19:00', isClosed: true },
];

export default function Dashboard() {
  const router = useRouter();
  
  // ROL VE KİMLİK YÖNETİMİ
  const [userRole, setUserRole] = useState('owner');
  const [loggedStaffName, setLoggedStaffName] = useState('');

  // TEMEL STATELER
  const [shop, setShop] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('calendar'); 
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false); 
  const [isEventUploading, setIsEventUploading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [calendarStaffFilter, setCalendarStaffFilter] = useState('Tümü');

  // FORM STATELERİ
  const [profileForm, setProfileForm] = useState({ 
    logo_url: '', 
    description: '', 
    contact_phone: '', 
    contact_email: '', 
    working_hours: defaultWorkingHours, 
    gallery: [], 
    socials: { instagram: '', facebook: '', whatsapp: '' }, 
    closed_dates: []
  });
  
  const [servicesForm, setServicesForm] = useState([]);
  const [eventsForm, setEventsForm] = useState([]);
  const [newService, setNewService] = useState({ name: '', price: '', duration: '30', capacity: '10' });
  const [newEvent, setNewEvent] = useState({ name: '', date: '', time: '22:00', description: '', imageFile: null });
  const [staffForm, setStaffForm] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: '', role: '', password: '' }); 
  const [newClosedDate, setNewClosedDate] = useState(''); 

  const [quickForm, setQuickForm] = useState({ 
    customer_name: '', 
    customer_surname: '', 
    customer_phone: '', 
    service_name: '', 
    appointment_date: new Date().toISOString().split('T')[0], 
    appointment_time: '10:00', 
    staff_name: '' 
  });

  // UYGULAMA BAŞLANGICI VE HATA YAKALAYICI
  useEffect(() => {
    const initSession = async () => {
      const session = localStorage.getItem('bookcy_biz_session');
      if (!session) {
        router.push('/login');
        return;
      }
      try {
        const parsedSession = JSON.parse(session);
        if (parsedSession.role === 'staff') {
          setUserRole('staff');
          setLoggedStaffName(parsedSession.staffName);
          setCalendarStaffFilter(parsedSession.staffName);
          setActiveTab('calendar');
          await fetchDashboardData(parsedSession.shopData.id);
        } else {
          setUserRole('owner');
          setActiveTab('overview');
          await fetchDashboardData(parsedSession.shopData ? parsedSession.shopData.id : parsedSession.id);
        }
      } catch (error) {
        console.error("Oturum hatası:", error);
        localStorage.removeItem('bookcy_biz_session');
        router.push('/login');
      }
    };
    initSession();
  }, [router]);

  async function fetchDashboardData(shopId) {
    setLoading(true);
    try {
      const { data: freshShop, error } = await supabase.from('shops').select('*').eq('id', shopId).single();
      
      if (error) throw error;

      if (freshShop) {
        setShop(freshShop);
        let parsedHours = Array.isArray(freshShop.working_hours) ? freshShop.working_hours : defaultWorkingHours;
        
        setProfileForm({ 
          logo_url: freshShop.logo_url || '', 
          description: freshShop.description || '', 
          contact_phone: freshShop.contact_phone || '', 
          contact_email: freshShop.contact_email || '', 
          working_hours: parsedHours, 
          gallery: freshShop.gallery || [], 
          socials: freshShop.socials || { instagram: '', facebook: '', whatsapp: '' }, 
          closed_dates: freshShop.closed_dates || []
        });
        setServicesForm(freshShop.services || []);
        setEventsForm(freshShop.events || []);
        setStaffForm(freshShop.staff || []);
      }

      const [appRes, revRes] = await Promise.all([
        supabase.from('appointments').select('*').eq('shop_id', shopId).order('appointment_date', { ascending: false }),
        supabase.from('reviews').select('*').eq('shop_id', shopId).order('created_at', { ascending: false })
      ]);
      
      if (appRes.data) setAppointments(appRes.data);
      if (revRes.data) setReviews(revRes.data);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
      localStorage.removeItem('bookcy_biz_session');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('bookcy_biz_session');
    router.push('/login');
  };

  const saveProfile = async () => {
    const { error } = await supabase.from('shops').update({
      logo_url: profileForm.logo_url, 
      description: profileForm.description, 
      contact_phone: profileForm.contact_phone, 
      contact_email: profileForm.contact_email, 
      working_hours: profileForm.working_hours, 
      gallery: profileForm.gallery,             
      socials: profileForm.socials, 
      closed_dates: profileForm.closed_dates 
    }).eq('id', shop.id);

    if (!error) { 
      alert("Vitrin bilgileriniz başarıyla güncellendi!"); 
      fetchDashboardData(shop.id); 
    } else { 
      alert("Hata oluştu: " + error.message); 
    }
  };

  const addClosedDate = () => {
    if (!newClosedDate || profileForm.closed_dates.includes(newClosedDate)) return;
    setProfileForm({ ...profileForm, closed_dates: [...profileForm.closed_dates, newClosedDate] });
    setNewClosedDate('');
  };

  const removeClosedDate = (date) => { 
    setProfileForm({ ...profileForm, closed_dates: profileForm.closed_dates.filter(d => d !== date) }); 
  };

  const uploadImage = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `uploads/${shop.id}-${Math.random()}.${fileExt}`;
    try {
      const { error } = await supabase.storage.from('gallery').upload(filePath, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(filePath);
      
      if (type === 'logo') { 
        setProfileForm({ ...profileForm, logo_url: publicUrl }); 
      } else { 
        setProfileForm({ ...profileForm, gallery: [...profileForm.gallery, publicUrl] }); 
      }
    } catch (error) { 
      alert("Fotoğraf yüklenemedi."); 
    } finally { 
      setIsUploading(false); 
    }
  };

  const removeGalleryImage = (index) => { 
    setProfileForm({ ...profileForm, gallery: profileForm.gallery.filter((_, i) => i !== index) }); 
  };

  const updateWorkingHour = (index, field, value) => { 
    const newHours = [...profileForm.working_hours]; 
    newHours[index][field] = value; 
    setProfileForm({ ...profileForm, working_hours: newHours }); 
  };

  const updateSocial = (network, value) => { 
    setProfileForm({ ...profileForm, socials: { ...profileForm.socials, [network]: value } }); 
  };

  // === ETKİNLİK EKLEME FONKSİYONLARI ===
  const addEvent = async () => {
    if (!newEvent.name || !newEvent.date || !newEvent.time) return alert("Etkinlik adı, tarihi ve saati zorunludur!");
    let uploadedImgUrl = '';
    
    if (newEvent.imageFile) {
      setIsEventUploading(true);
      const fileExt = newEvent.imageFile.name.split('.').pop();
      const filePath = `events/${shop.id}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, newEvent.imageFile);
      if (!uploadError) {
        uploadedImgUrl = supabase.storage.from('gallery').getPublicUrl(filePath).data.publicUrl;
      }
      setIsEventUploading(false);
    }

    const eventObj = { 
      id: Date.now(), 
      name: newEvent.name, 
      date: newEvent.date, 
      time: newEvent.time, 
      description: newEvent.description, 
      image_url: uploadedImgUrl 
    };
    
    const updatedEvents = [...eventsForm, eventObj];
    await supabase.from('shops').update({ events: updatedEvents }).eq('id', shop.id);
    setEventsForm(updatedEvents);
    setNewEvent({ name: '', date: '', time: '22:00', description: '', imageFile: null });
  };

  const deleteEvent = async (id) => {
    const updatedEvents = eventsForm.filter(e => e.id !== id);
    await supabase.from('shops').update({ events: updatedEvents }).eq('id', shop.id);
    setEventsForm(updatedEvents);
  };

  // === HİZMET / LOCA EKLEME FONKSİYONU ===
  const addService = async () => {
    if (!newService.name) return alert("Lütfen bir ad giriniz.");
    const isClub = shop?.category === 'Bar & Club';
    
    // Eğer kulüp ise süreyi otomatik 0 yap (Gece boyu) ve fiyat boşsa 0 yap
    const finalPrice = newService.price === '' || newService.price === undefined ? '0' : newService.price;
    const finalCapacity = isClub && newService.capacity ? newService.capacity.toString() : '1';

    const finalService = { 
      ...newService, 
      price: finalPrice,
      duration: isClub ? '0' : newService.duration,
      capacity: finalCapacity
    };
    
    const updatedServices = [...servicesForm, finalService];
    await supabase.from('shops').update({ services: updatedServices }).eq('id', shop.id);
    setServicesForm(updatedServices); 
    setNewService({ name: '', price: '', duration: '30', capacity: '10' });
  };

  const deleteService = async (index) => {
    const updatedServices = servicesForm.filter((_, i) => i !== index);
    await supabase.from('shops').update({ services: updatedServices }).eq('id', shop.id);
    setServicesForm(updatedServices);
  };

  const addStaff = async () => {
    if (!newStaff.name || !newStaff.password) return alert("Personel adı ve giriş şifresi zorunludur!");
    const updatedStaff = [...staffForm, newStaff];
    const { error } = await supabase.from('shops').update({ staff: updatedStaff }).eq('id', shop.id);
    if (!error) { 
      setStaffForm(updatedStaff); 
      setNewStaff({ name: '', role: '', password: '' }); 
    }
  };

  const deleteStaff = async (index) => {
    const updatedStaff = staffForm.filter((_, i) => i !== index);
    await supabase.from('shops').update({ staff: updatedStaff }).eq('id', shop.id);
    setStaffForm(updatedStaff);
  };

  const updateApptStatus = async (id, newStatus) => {
    const { error } = await supabase.from('appointments').update({ status: newStatus }).eq('id', id);
    if (!error) {
      alert(`İşlem ${newStatus} olarak işaretlendi!`);
      fetchDashboardData(shop.id);
    } else {
      alert("Hata: " + error.message);
    }
  };

  const deleteAppointmentCompletely = async (id) => {
    const isConfirmed = window.confirm("Bu kaydı tamamen SİLMEK istediğinize emin misiniz?");
    if(isConfirmed) {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if(!error) {
        alert("Kayıt kalıcı olarak silindi!");
        fetchDashboardData(shop.id);
      }
    }
  };

  // === BUKALEMUN MODU (CLUB KONTROLÜ) ===
  const isClub = shop?.category === 'Bar & Club';

  const calculateOccupiedSlots = (startTime, durationStr) => {
    if (durationStr === '0' || isClub) return []; 
    const duration = parseInt(durationStr, 10) || 30; 
    const slotsCount = Math.ceil(duration / 30); 
    const startIndex = allTimeSlots.indexOf(startTime);
    if (startIndex === -1) return [startTime];
    return allTimeSlots.slice(startIndex, startIndex + slotsCount);
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (profileForm.closed_dates.includes(quickForm.appointment_date)) {
      return alert("Seçtiğiniz tarih kapalı!");
    }
    
    const selectedService = servicesForm.find(s => s.name === quickForm.service_name);
    const slotsToOccupy = isClub ? [] : calculateOccupiedSlots(quickForm.appointment_time, selectedService ? selectedService.duration : '30');
    
    // Club ise personeli direkt Rezervasyon olarak ata
    const finalStaffName = isClub ? 'Rezervasyon' : (quickForm.staff_name || (staffForm[0]?.name || 'Genel'));

    const { error } = await supabase.from('appointments').insert([{
      shop_id: shop.id, 
      customer_name: quickForm.customer_name, 
      customer_surname: quickForm.customer_surname,
      customer_phone: quickForm.customer_phone, 
      service_name: quickForm.service_name,
      appointment_date: quickForm.appointment_date, 
      appointment_time: quickForm.appointment_time,
      staff_name: finalStaffName, 
      occupied_slots: slotsToOccupy, 
      status: 'Bekliyor' 
    }]);

    if (!error) { 
      alert(isClub ? "Rezervasyon eklendi!" : "Randevu eklendi!"); 
      setShowQuickAdd(false); 
      fetchDashboardData(shop.id); 
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const getApptPrice = (serviceName) => { 
    const srv = servicesForm.find(s => s.name === serviceName); 
    return srv ? parseInt(srv.price) : 150; 
  };
  
  const todayAppts = appointments.filter(a => a.appointment_date === today && a.status !== 'İptal');
  const earnedRevenue = appointments.filter(a => a.status === 'Tamamlandı').reduce((acc, a) => acc + getApptPrice(a.service_name), 0);
  const pendingRevenue = appointments.filter(a => a.status === 'Bekliyor' || !a.status).reduce((acc, a) => acc + getApptPrice(a.service_name), 0);
  const uniqueCustomers = [...new Set(appointments.map(a => a.customer_phone))].length;

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date(); 
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayRev = appointments.filter(a => a.appointment_date === dateStr && a.status === 'Tamamlandı').reduce((acc, a) => acc + getApptPrice(a.service_name), 0);
    return { date: dateStr.slice(-2), rev: dayRev };
  });
  const maxRev = Math.max(...last7Days.map(d => d.rev), 100);

  const strSevenDays = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const strThirtyDays = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  
  const staffPerformance = staffForm.map(staff => {
    const staffAppts = appointments.filter(a => a.staff_name === staff.name && a.status !== 'İptal');
    return { 
      name: staff.name, 
      daily: staffAppts.filter(a => a.appointment_date === today).length, 
      weekly: staffAppts.filter(a => a.appointment_date >= strSevenDays && a.appointment_date <= today).length, 
      monthly: staffAppts.filter(a => a.appointment_date >= strThirtyDays && a.appointment_date <= today).length 
    };
  });

  const recentNotifications = appointments.slice(0, 3).map(a => ({ 
    id: a.id, 
    title: isClub ? 'Yeni Rezervasyon!' : 'Yeni İşlem Geldi!', 
    desc: `${a.customer_name} ${a.appointment_date} için ${a.service_name} oluşturdu.`, 
    time: 'Az önce' 
  }));

  const menuItems = userRole === 'owner' 
    ? [
        { id: 'overview', icon: <LayoutDashboard size={18}/>, label: 'Özet Panel' },
        { id: 'calendar', icon: <Calendar size={18}/>, label: 'Takvim Yönetimi' },
        { id: 'clients', icon: <Users size={18}/>, label: 'Müşteriler & Kayıtlar' },
        { id: 'services', icon: isClub ? <Music size={18}/> : <Scissors size={18}/>, label: isClub ? 'Etkinlikler & Loca' : 'Hizmetler & Fiyatlar' },
        ...(isClub ? [] : [{ id: 'staff', icon: <Clock size={18}/>, label: 'Ekip Yönetimi' }]),
        { id: 'reviews', icon: <MessageSquare size={18}/>, label: 'Yorumlar' },
        { id: 'settings', icon: <Store size={18}/>, label: 'Vitrin Ayarları' }
      ]
    : [
        { id: 'calendar', icon: <Calendar size={18}/>, label: 'Kendi Takvimim' },
      ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center font-['Outfit']">
        <div className="w-16 h-16 border-4 border-[#E8622A] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black text-[#2D1B4E] uppercase tracking-widest animate-pulse">Sistem Yükleniyor...</p>
      </div>
    );
  }

  if (!shop && !loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center font-['Outfit']">
        <p className="font-black text-red-500 uppercase tracking-widest mb-4">İşletme verileri bulunamadı!</p>
        <button onClick={handleLogout} className="bg-[#2D1B4E] text-white px-6 py-3 rounded-xl font-bold border-none cursor-pointer">
          Giriş Sayfasına Dön
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-[#2D1B4E] font-['Outfit']">
      
      {mobileMenuOpen && ( 
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div> 
      )}

      <aside className={`fixed md:sticky top-0 left-0 h-screen bg-[#2D1B4E] text-white flex flex-col shrink-0 shadow-2xl z-40 transition-transform duration-300 w-64 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        <div className="p-8 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#E8622A] rounded-xl flex items-center justify-center font-black shadow-lg text-white overflow-hidden">
               {shop.logo_url ? <img src={shop.logo_url} className="w-full h-full object-cover"/> : 'B'}
             </div>
             <div>
               <span className="font-black text-xl tracking-tighter truncate block w-32">{shop.name}</span>
               <span className="text-[10px] font-bold text-[#F5C5A3] uppercase tracking-widest">
                 {userRole === 'owner' ? 'YÖNETİCİ' : `UZMAN: ${loggedStaffName}`}
               </span>
             </div>
          </div>
          <button className="md:hidden text-white/50 hover:text-white border-none bg-transparent" onClick={() => setMobileMenuOpen(false)}>
            <XCircle size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 mt-2 overflow-y-auto custom-scrollbar">
          {menuItems.map(tab => (
             <button 
                key={tab.id} 
                onClick={() => {setActiveTab(tab.id); setMobileMenuOpen(false);}} 
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border-none cursor-pointer text-left ${activeTab === tab.id ? 'bg-[#E8622A] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
             >
               {tab.icon} {tab.label}
             </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl font-bold text-xs text-white uppercase tracking-widest bg-red-500/10 hover:bg-red-500 transition-all border-none cursor-pointer">
            <LogOut size={16}/> Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden w-full relative">
        <header className="bg-white border-b border-slate-200 px-4 md:px-10 py-5 flex justify-between items-center sticky top-0 z-20 shadow-sm gap-4">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[#2D1B4E] bg-slate-100 p-2 rounded-lg border-none" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl font-black uppercase tracking-tight">{shop.name}</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {userRole === 'owner' ? 'Yönetici Paneli' : 'Personel Ekranı'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {userRole === 'owner' && (
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-[#E8622A] transition-colors border-none cursor-pointer relative">
                  <Bell size={18}/>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in slide-in-from-top-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 border-b pb-2">Son Bildirimler</h4>
                    <div className="space-y-3">
                      {recentNotifications.map((notif, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center shrink-0">
                            <Calendar size={14}/>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#2D1B4E]">{notif.title}</p>
                            <p className="text-[10px] font-medium text-slate-500 leading-tight">{notif.desc}</p>
                            <p className="text-[8px] text-slate-400 mt-1 uppercase font-bold">{notif.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <button onClick={() => setShowQuickAdd(true)} className="bg-[#E8622A] text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border-none cursor-pointer shadow-lg hover:scale-105 transition-transform">
              <Plus size={16}/> <span className="hidden sm:inline">Hızlı Kayıt</span>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-10 max-w-[1400px] mx-auto overflow-x-hidden">
          
          {/* TAB 1: ÖZET PANEL */}
          {userRole === 'owner' && activeTab === 'overview' && (
            <div className="animate-in fade-in duration-500">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center mb-4">
                        <Calendar size={20}/>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Bugünkü Aktif</p>
                      <p className="text-3xl font-black">{todayAppts.length}</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 bg-green-50 text-green-500 rounded-lg flex items-center justify-center mb-4">
                        <CheckCircle2 size={20}/>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Kazanılan Ciro</p>
                      <p className="text-3xl font-black text-green-600">₺{earnedRevenue}</p>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center mb-4">
                        <Clock size={20}/>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Bekleyen Ciro</p>
                      <p className="text-3xl font-black">₺{pendingRevenue}</p>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                      <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center mb-4">
                        <Users size={20}/>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Toplam Müşteri</p>
                      <p className="text-3xl font-black">{uniqueCustomers}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* BAR GRAFİĞİ */}
                  <div className="lg:col-span-1 bg-[#2D1B4E] p-8 rounded-[32px] text-white shadow-xl flex flex-col justify-between">
                    <div>
                      <h3 className="font-black uppercase tracking-tight text-sm text-orange-400 mb-1 flex items-center gap-2">
                        <BarChart size={16}/> Son 7 Günlük Performans
                      </h3>
                      <p className="text-3xl font-black mb-8">
                        ₺{last7Days.reduce((a,b)=>a+b.rev,0)} 
                        <span className="text-[10px] text-white/50 uppercase tracking-widest block font-bold">Haftalık Toplam Ciro</span>
                      </p>
                    </div>
                    <div className="flex items-end justify-between h-32 gap-2 mt-auto">
                      {last7Days.map((day, i) => (
                        <div key={i} className="flex flex-col items-center flex-1 group relative">
                          <div className="w-full bg-[#E8622A] rounded-t-sm transition-all duration-500 hover:bg-orange-400 relative" style={{height: `${(day.rev / maxRev) * 100}%`, minHeight: '10px'}}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-[#2D1B4E] text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              ₺{day.rev}
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-white/50 mt-2">{day.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SON İŞLEMLER TABLOSU */}
                  <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden w-full flex flex-col">
                      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-black uppercase tracking-tight flex items-center gap-2">
                          <Clock size={16} className="text-[#E8622A]"/> Son İşlemler
                        </h3>
                      </div>
                      <div className="overflow-x-auto w-full flex-1">
                          <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50">
                                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Müşteri / İşlem</th>
                                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Durum Bildir</th>
                                </tr>
                              </thead>
                              <tbody>
                                  {appointments.slice(0,6).map((appt) => (
                                      <tr key={appt.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors group">
                                          <td className="px-6 py-4">
                                            <div className="font-bold text-sm text-[#2D1B4E]">
                                              {appt.customer_name} {appt.customer_surname}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                              {appt.appointment_date} • {appt.appointment_time} | {appt.service_name}
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 text-center">
                                            {appt.status === 'Tamamlandı' && (
                                              <span className="bg-green-100 text-green-600 text-[10px] font-black px-4 py-2 rounded-xl uppercase flex items-center justify-center gap-1 w-fit mx-auto">
                                                <Check size={14}/> Tamamlandı
                                              </span>
                                            )}
                                            {appt.status === 'İptal' && (
                                              <span className="bg-red-100 text-red-600 text-[10px] font-black px-4 py-2 rounded-xl uppercase flex items-center justify-center gap-1 w-fit mx-auto">
                                                <XCircle size={14}/> İptal Edildi
                                              </span>
                                            )}
                                            {(!appt.status || appt.status === 'Bekliyor') && (
                                              <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => updateApptStatus(appt.id, 'Tamamlandı')} className="bg-green-500 text-white p-2 rounded-lg border-none cursor-pointer hover:bg-green-600">
                                                  <Check size={16}/>
                                                </button>
                                                <button onClick={() => updateApptStatus(appt.id, 'İptal')} className="bg-red-50 text-red-500 p-2 rounded-lg border border-red-200 cursor-pointer hover:bg-red-100">
                                                  <UserMinus size={16}/>
                                                </button>
                                              </div>
                                            )}
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
                </div>

                {!isClub && (
                  <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden w-full">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-black uppercase tracking-tight flex items-center gap-2">
                        <Users size={16} className="text-[#E8622A]"/> Personel Performansı
                      </h3>
                    </div>
                    <div className="overflow-x-auto w-full">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Uzman</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Günlük</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Haftalık</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Aylık</th>
                          </tr>
                        </thead>
                        <tbody>
                          {staffPerformance.map((staff, i) => (
                             <tr key={i} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-sm text-[#2D1B4E] uppercase">{staff.name}</td>
                                <td className="px-6 py-4 text-center font-black text-[#E8622A]">{staff.daily}</td>
                                <td className="px-6 py-4 text-center font-black text-blue-500">{staff.weekly}</td>
                                <td className="px-6 py-4 text-center font-black text-green-500">{staff.monthly}</td>
                             </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* TAB 2: TAKVİM YÖNETİMİ (TAKİP VE İPTAL) */}
          {activeTab === 'calendar' && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Günlük Ajanda</h2>
                    <div className="flex gap-2 w-full md:w-auto">
                      
                      {userRole === 'owner' && !isClub && (
                        <div className="relative flex-1 md:flex-none border border-slate-200 rounded-xl bg-white flex items-center px-3 focus-within:border-[#E8622A] transition-colors">
                          <Filter size={16} className="text-slate-400"/>
                          <select value={calendarStaffFilter} onChange={(e) => setCalendarStaffFilter(e.target.value)} className="w-full bg-transparent border-none py-3 px-2 font-bold text-sm outline-none text-slate-600 appearance-none cursor-pointer">
                            <option value="Tümü">Tüm Uzmanlar</option>
                            {staffForm.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                          </select>
                        </div>
                      )}
                      
                      <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)} 
                        className="flex-1 md:flex-none bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-[#E8622A] cursor-pointer" 
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 md:p-8">
                      {profileForm.closed_dates.includes(selectedDate) ? (
                        <div className="py-20 text-center flex flex-col items-center justify-center text-slate-400">
                          <CalendarOff size={64} className="text-red-300 mb-4"/>
                          <h3 className="text-2xl font-black text-[#2D1B4E] uppercase tracking-tight mb-2">İşletme Kapalı</h3>
                          <p className="text-xs font-bold uppercase tracking-widest">Bugün randevu alımına kapalıdır.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {allTimeSlots.map((slot) => {
                                const slotAppts = appointments.filter(a => 
                                  a.appointment_date === selectedDate && 
                                  a.status !== 'İptal' && 
                                  (calendarStaffFilter === 'Tümü' || a.staff_name === calendarStaffFilter) &&
                                  ((a.occupied_slots && a.occupied_slots.length > 0) ? a.occupied_slots.includes(slot) : a.appointment_time === slot)
                                );

                                const dayName = new Date(selectedDate).toLocaleDateString('tr-TR', { weekday: 'long' });
                                const todayHours = profileForm.working_hours.find(h => h.day === dayName);
                                
                                // Gece kulüpleri için tüm saatler açık kalır
                                const isWithinWorkingHours = isClub || (todayHours && !todayHours.isClosed && slot >= todayHours.open && slot < todayHours.close);
                                
                                if (!isWithinWorkingHours && slotAppts.length === 0) return null;

                                return (
                                  <div key={slot} className="flex gap-6 items-center p-4 border-b border-slate-50 flex-col sm:flex-row items-start sm:items-center">
                                      <div className="w-16 font-black text-slate-300 text-sm">{slot}</div>
                                      <div className="flex-1 w-full">
                                        {slotAppts.length > 0 ? slotAppts.map(a => (
                                          <div key={a.id} className={`p-4 rounded-2xl flex justify-between items-start md:items-center shadow-sm border mb-2 flex-col md:flex-row gap-4 md:gap-0 ${a.status === 'Tamamlandı' ? 'bg-green-50 border-green-200' : 'bg-indigo-50 border-indigo-100'}`}>
                                            <div className="flex flex-col">
                                              <p className={`font-black text-lg uppercase ${a.status === 'Tamamlandı' ? 'text-green-800' : 'text-[#2D1B4E]'}`}>
                                                {a.customer_name} {a.customer_surname} <span className="text-xs ml-2 text-slate-500 font-bold">({a.customer_phone})</span>
                                              </p>
                                              <p className="text-xs font-bold text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                                                <span className="bg-white px-2 py-1 rounded shadow-sm border border-slate-100 flex items-center gap-1">
                                                  {isClub ? <Music size={12}/> : <Scissors size={12}/>} {a.service_name}
                                                </span>
                                                {!isClub && (
                                                  <span className="bg-white px-2 py-1 rounded shadow-sm border border-slate-100 flex items-center gap-1">
                                                    <Users size={12}/> {a.staff_name}
                                                  </span>
                                                )}
                                              </p>
                                            </div>
                                            
                                            <div className="flex items-center gap-3 w-full md:w-auto">
                                              {/* İPTAL VE TAMAMLA BUTONLARI */}
                                              {(!a.status || a.status === 'Bekliyor') ? (
                                                <>
                                                  <button onClick={() => updateApptStatus(a.id, 'İptal')} className="bg-red-50 hover:bg-red-100 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-200 cursor-pointer flex items-center gap-1">
                                                    <XCircle size={14}/> İptal Et
                                                  </button>
                                                  <button onClick={() => updateApptStatus(a.id, 'Tamamlandı')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-none cursor-pointer flex items-center gap-1">
                                                    <Check size={14}/> Tamamla
                                                  </button>
                                                </>
                                              ) : (
                                                <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-green-600 text-white flex items-center gap-1">
                                                  <CheckCircle2 size={14}/> BİTTİ
                                                </div>
                                              )}
                                              <button onClick={() => deleteAppointmentCompletely(a.id)} className="bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-red-500 p-2 rounded-lg border-none cursor-pointer" title="Sistemden Kalıcı Olarak Sil">
                                                <Trash2 size={16}/>
                                              </button>
                                            </div>
                                          </div>
                                        )) : <div className="border-2 border-dashed border-slate-100 rounded-2xl p-4 text-center text-slate-300 text-xs font-bold bg-slate-50">Boş Slot</div>}
                                      </div>
                                  </div>
                                );
                            })}
                        </div>
                      )}
                  </div>
              </div>
          )}

          {/* TAB 3: HİZMETLER (BUKALEMUN) */}
          {userRole === 'owner' && activeTab === 'services' && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                {isClub ? (
                    // ====== BAR & CLUB TASARIMI ======
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* SOL: ETKİNLİKLER */}
                        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 flex flex-col gap-6">
                            <h3 className="font-black text-xl text-[#2D1B4E] flex items-center gap-2 border-b border-slate-100 pb-4">
                              <CalendarHeart size={24} className="text-[#E8622A]"/> Yaklaşan Etkinlikler
                            </h3>
                            
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4 shadow-inner">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Yeni Etkinlik Ekle</h4>
                                <div className="space-y-4">
                                    <input type="text" placeholder="Etkinlik Adı (Örn: DJ Party)" value={newEvent.name} onChange={e=>setNewEvent({...newEvent, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A]"/>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="date" value={newEvent.date} onChange={e=>setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] cursor-pointer"/>
                                        <select value={newEvent.time} onChange={e=>setNewEvent({...newEvent, time: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] cursor-pointer">
                                            {eventTimeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <textarea placeholder="Etkinlik Açıklaması (Opsiyonel)" rows="2" value={newEvent.description} onChange={e=>setNewEvent({...newEvent, description: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-[#2D1B4E] outline-none focus:border-[#E8622A] resize-none"></textarea>
                                    
                                    <div className="flex items-center gap-4">
                                        <label className="flex-1 bg-[#2D1B4E] hover:bg-[#1a0f2e] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md border-none">
                                            {isEventUploading ? <Loader2 className="animate-spin" size={16}/> : <ImageIcon size={16}/>}
                                            <span>{newEvent.imageFile ? newEvent.imageFile.name : 'Afiş Yükle'}</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => setNewEvent({...newEvent, imageFile: e.target.files[0]})} disabled={isEventUploading}/>
                                        </label>
                                        <button onClick={addEvent} disabled={isEventUploading} className="flex-1 bg-[#E8622A] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border-none cursor-pointer hover:scale-[1.02] transition-transform shadow-md disabled:opacity-50">
                                            <Plus size={16}/> Etkinliği Yarat
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
                                {eventsForm.map((ev) => (
                                    <div key={ev.id} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                                        <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                                            {ev.image_url ? <img src={ev.image_url} className="w-full h-full object-cover"/> : <Music size={24} className="text-slate-300"/>}
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h4 className="font-black text-lg text-[#2D1B4E] uppercase leading-tight">{ev.name}</h4>
                                            <p className="text-xs font-bold text-[#E8622A] mt-1">{ev.date} | Saat: {ev.time}</p>
                                        </div>
                                        <button onClick={() => deleteEvent(ev.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 bg-white rounded-lg border-none cursor-pointer p-1"><Trash2 size={16}/></button>
                                    </div>
                                ))}
                                {eventsForm.length === 0 && <div className="text-center py-10 text-slate-400 font-bold uppercase text-xs tracking-widest">Henüz etkinlik eklenmemiş.</div>}
                            </div>
                        </div>

                        {/* SAĞ: LOCA & BİSTRO FİYATLARI */}
                        <div className="bg-[#2D1B4E] rounded-[32px] shadow-sm border border-slate-200 p-8 flex flex-col gap-6 text-white h-fit relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#E8622A]/20 rounded-bl-full blur-2xl pointer-events-none"></div>
                            <h3 className="font-black text-xl text-white flex items-center gap-2 border-b border-white/10 pb-4">
                              <Ticket size={24} className="text-[#E8622A]"/> Loca & Bistro Menüsü
                            </h3>
                            
                            <div className="space-y-3 relative z-10">
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Adı (Örn: VIP Loca)" value={newService.name} onChange={e=>setNewService({...newService, name: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white outline-none focus:border-[#E8622A] placeholder:text-white/40"/>
                                    <input type="number" placeholder="Fiyat (Boş=Ücretsiz)" value={newService.price} onChange={e=>setNewService({...newService, price: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white outline-none focus:border-[#E8622A] placeholder:text-white/40"/>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-full relative">
                                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/50 tracking-widest uppercase">Kapasite:</span>
                                      <input type="number" placeholder="Örn: 10" value={newService.capacity} onChange={e=>setNewService({...newService, capacity: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-20 pr-4 text-sm font-bold text-white outline-none focus:border-[#E8622A] placeholder:text-white/40"/>
                                    </div>
                                    <button onClick={addService} className="bg-[#E8622A] text-white px-6 rounded-xl border-none cursor-pointer hover:bg-orange-500 transition-colors font-black text-xs uppercase tracking-widest">
                                      Ekle
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-3 relative z-10 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                                {servicesForm.map((srv, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
                                        <div>
                                          <p className="font-black text-sm uppercase text-white tracking-widest">{srv.name}</p>
                                          <p className="text-[10px] font-bold text-[#E8622A] uppercase tracking-widest mt-1">Kapasite: {srv.capacity || 10} Adet</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-black text-lg text-[#F5C5A3]">{!srv.price || srv.price === '0' ? 'ÜCRETSİZ' : `${srv.price} TL`}</span>
                                            <button onClick={() => deleteService(idx)} className="text-white/30 hover:text-red-400 bg-transparent border-none cursor-pointer">
                                              <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {servicesForm.length === 0 && <div className="text-center py-10 text-white/30 font-bold uppercase text-xs tracking-widest">Loca menüsü boş.</div>}
                            </div>
                        </div>
                    </div>
                ) : (
                    // ====== NORMAL İŞLETME TASARIMI (BERBER VS) ======
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
                        <h3 className="font-black text-lg mb-6 text-[#2D1B4E]">Menünüz</h3>
                        <div className="space-y-4">
                          {servicesForm.map((srv, idx) => (
                            <div key={idx} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                              <div>
                                <p className="font-black text-sm uppercase">{srv.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                                  <Clock size={12}/> Süre: {srv.duration || '30'} Dakika
                                </p>
                              </div>
                              <div className="flex items-center gap-6">
                                <span className="font-black text-lg text-[#E8622A]">{srv.price} TL</span>
                                <button onClick={() => deleteService(idx)} className="p-2 text-slate-300 hover:text-red-500 bg-white rounded-lg shadow-sm border-none cursor-pointer">
                                  <Trash2 size={16}/>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#2D1B4E] rounded-[32px] shadow-sm p-8 text-white h-fit">
                        <h3 className="font-black text-lg mb-6">Yeni Hizmet Ekle</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-2">Hizmet Adı</label>
                            <input type="text" value={newService.name} onChange={e=>setNewService({...newService, name: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white outline-none focus:border-[#E8622A]"/>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-2">Fiyat (TL)</label>
                            <input type="number" value={newService.price} onChange={e=>setNewService({...newService, price: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white outline-none focus:border-[#E8622A]"/>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-2">İşlem Süresi</label>
                            <select value={newService.duration} onChange={e=>setNewService({...newService, duration: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white outline-none focus:border-[#E8622A] cursor-pointer">
                              <option value="15" className="text-black">15 Dakika</option>
                              <option value="30" className="text-black">30 Dakika</option>
                              <option value="45" className="text-black">45 Dakika</option>
                              <option value="60" className="text-black">1 Saat</option>
                              <option value="90" className="text-black">1.5 Saat</option>
                              <option value="120" className="text-black">2 Saat</option>
                            </select>
                          </div>
                          <button onClick={addService} className="w-full bg-[#E8622A] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest border-none cursor-pointer hover:scale-[1.02] transition-transform shadow-lg">
                            <Plus size={16} className="inline mr-2 mb-1"/> Ekle
                          </button>
                        </div>
                      </div>
                    </div>
                )}
              </div>
          )}

          {/* TAB 4: PERSONEL (CLUB DEĞİLSE GÖRÜNÜR) */}
          {userRole === 'owner' && activeTab === 'staff' && !isClub && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Personel Yönetimi</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
                    <h3 className="font-black text-lg mb-6 text-[#2D1B4E]">Çalışanlarınız</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {staffForm.map((stf, idx) => (
                        <div key={idx} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#2D1B4E] text-white rounded-full flex items-center justify-center font-black text-lg">
                              {stf.name[0]}
                            </div>
                            <div>
                              <p className="font-black text-sm uppercase">{stf.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {stf.role || 'Uzman'} • Şifre: {stf.password}
                              </p>
                            </div>
                          </div>
                          <button onClick={() => deleteStaff(idx)} className="p-2 text-slate-300 hover:text-red-500 bg-white rounded-lg shadow-sm border-none cursor-pointer">
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#2D1B4E] rounded-[32px] shadow-sm p-8 text-white h-fit">
                    <h3 className="font-black text-lg mb-6 flex items-center gap-2">
                      <Shield size={20} className="text-[#E8622A]"/> Personel Ekle
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-2">İsim Soyisim</label>
                        <input type="text" value={newStaff.name} onChange={e=>setNewStaff({...newStaff, name: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white outline-none focus:border-[#E8622A]"/>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-2">Uzmanlık</label>
                        <input type="text" value={newStaff.role} onChange={e=>setNewStaff({...newStaff, role: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white outline-none focus:border-[#E8622A]"/>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-2">Giriş Şifresi (Örn: 1234)</label>
                        <input type="text" value={newStaff.password} onChange={e=>setNewStaff({...newStaff, password: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white outline-none focus:border-[#E8622A]"/>
                      </div>
                      <button onClick={addStaff} className="w-full bg-[#E8622A] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest border-none cursor-pointer hover:scale-[1.02] transition-transform shadow-lg">
                        <UserPlus size={16} className="inline mr-2 mb-1"/> Ekibe Kat
                      </button>
                    </div>
                  </div>

                </div>
              </div>
          )}

          {/* TAB 5: MÜŞTERİLER VE GEÇMİŞ RANDEVULAR */}
          {userRole === 'owner' && activeTab === 'clients' && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Müşteri Portföyü & Tüm İşlemler</h2>
                  <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden w-full">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50">
                          <tr className="text-[10px] font-black uppercase text-slate-400">
                            <th className="px-8 py-5">Müşteri Bilgisi</th>
                            <th className="px-8 py-5">Tarih & Saat</th>
                            <th className="px-8 py-5">Hizmet / İşlem</th>
                            <th className="px-8 py-5 text-center">İşlem Durumu</th>
                          </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appt) => (
                                <tr key={appt.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors">
                                  <td className="px-8 py-5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-[#2D1B4E] text-sm shrink-0">
                                        {appt.customer_name[0]}
                                      </div>
                                      <div>
                                        <span className="font-bold text-sm uppercase block">{appt.customer_name} {appt.customer_surname}</span>
                                        <span className="text-xs text-slate-500 font-bold">{appt.customer_phone}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-8 py-5">
                                    <span className="font-bold text-sm text-[#2D1B4E] block">{appt.appointment_date}</span>
                                    <span className="text-xs text-[#E8622A] font-black">{appt.appointment_time}</span>
                                  </td>
                                  <td className="px-8 py-5">
                                    <span className="font-bold text-sm text-slate-700 block">{appt.service_name}</span>
                                    {!isClub && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{appt.staff_name}</span>}
                                  </td>
                                  <td className="px-8 py-5 text-center">
                                    {appt.status === 'İptal' ? (
                                      <span className="bg-red-100 text-red-600 text-[10px] font-black px-4 py-2 rounded-xl uppercase inline-flex items-center justify-center gap-1 w-fit">
                                        <XCircle size={14}/> İptal
                                      </span>
                                    ) : appt.status === 'Tamamlandı' ? (
                                      <span className="bg-green-100 text-green-600 text-[10px] font-black px-4 py-2 rounded-xl uppercase inline-flex items-center justify-center gap-1 w-fit">
                                        <Check size={14}/> Tamamlandı
                                      </span>
                                    ) : (
                                      <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => updateApptStatus(appt.id, 'Tamamlandı')} className="bg-green-50 text-green-600 hover:bg-green-500 hover:text-white p-2 rounded-lg border border-green-200 transition-colors cursor-pointer" title="Tamamlandı İşaretle">
                                          <Check size={16}/>
                                        </button>
                                        <button onClick={() => updateApptStatus(appt.id, 'İptal')} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg border border-red-200 transition-colors cursor-pointer" title="Randevuyu İptal Et">
                                          <XCircle size={16}/>
                                        </button>
                                      </div>
                                    )}
                                    <button onClick={() => deleteAppointmentCompletely(appt.id)} className="ml-2 bg-transparent text-slate-300 hover:text-red-500 p-2 rounded-lg border-none cursor-pointer transition-colors" title="Kalıcı Olarak Sil">
                                      <Trash2 size={16}/>
                                    </button>
                                  </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                              <tr>
                                <td colSpan="4" className="text-center p-10 text-slate-400 font-bold uppercase tracking-widest">Henüz hiç işlem yok.</td>
                              </tr>
                            )}
                        </tbody>
                      </table>
                  </div>
              </div>
          )}

          {/* TAB 6: YORUMLAR */}
          {userRole === 'owner' && activeTab === 'reviews' && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Müşteri Yorumları</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviews.map(rev => (
                    <div key={rev.id} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < rev.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}/>
                        ))}
                      </div>
                      <p className="text-sm font-medium text-slate-600 mb-4">"{rev.comment}"</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        {rev.customer_name} • {new Date(rev.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
          )}

          {/* TAB 7: VİTRİN AYARLARI */}
          {userRole === 'owner' && activeTab === 'settings' && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Vitrin & Profil Ayarları</h2>
                  <button onClick={saveProfile} className="bg-[#00c48c] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border-none cursor-pointer shadow-lg hover:scale-105 transition-transform">
                    <Save size={18}/> Değişiklikleri Kaydet
                  </button>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  
                  <div className="space-y-8">
                    
                    {/* Temel Bilgiler */}
                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
                      <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-[#2D1B4E]">
                        <Store size={20} className="text-[#E8622A]"/> Temel Bilgiler
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Profil Fotoğrafı / Logo</label>
                          <div className="flex items-center gap-4">
                            {profileForm.logo_url ? (
                              <img src={profileForm.logo_url} className="w-20 h-20 rounded-xl object-cover shadow-sm border border-slate-200 shrink-0"/>
                            ) : (
                              <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center shrink-0 text-slate-300">
                                <ImageIcon size={24}/>
                              </div>
                            )}
                            <label className="bg-[#2D1B4E] hover:bg-[#1a0f2e] text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors shadow-md">
                              {isUploading ? <Loader2 className="animate-spin" size={16}/> : <UploadCloud size={16}/>}
                              <span>Cihazdan Yükle</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e, 'logo')} disabled={isUploading}/>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Hakkımızda / İşletme Açıklaması</label>
                          <textarea value={profileForm.description} onChange={e=>setProfileForm({...profileForm, description: e.target.value})} rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:border-[#E8622A] resize-none"></textarea>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 flex items-center gap-1"><Phone size={14}/> Telefon</label>
                            <input type="text" value={profileForm.contact_phone} onChange={e=>setProfileForm({...profileForm, contact_phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-[#E8622A]"/>
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 flex items-center gap-1"><Mail size={14}/> E-Posta</label>
                            <input type="email" value={profileForm.contact_email} onChange={e=>setProfileForm({...profileForm, contact_email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-[#E8622A]"/>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sosyal Medya */}
                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
                      <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-[#2D1B4E]">Sosyal Medya Bağlantıları</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center shrink-0">
                            <Instagram size={20}/>
                          </div>
                          <input type="text" value={profileForm.socials.instagram} onChange={e=>updateSocial('instagram', e.target.value)} placeholder="Instagram Linki" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:border-pink-400"/>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                            <Facebook size={20}/>
                          </div>
                          <input type="text" value={profileForm.socials.facebook} onChange={e=>updateSocial('facebook', e.target.value)} placeholder="Facebook Linki" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:border-blue-400"/>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center shrink-0">
                            <MessageCircle size={20}/>
                          </div>
                          <input type="text" value={profileForm.socials.whatsapp} onChange={e=>updateSocial('whatsapp', e.target.value)} placeholder="WhatsApp Numarası" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:border-green-400"/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    
                    {/* Çalışma Saatleri */}
                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
                      <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-[#2D1B4E]">
                        <Clock size={20} className="text-[#E8622A]"/> Çalışma Saatleri
                      </h3>
                      <div className="space-y-3">
                        {profileForm.working_hours.map((dayObj, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className={`w-24 font-black text-xs uppercase ${dayObj.isClosed ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                              {dayObj.day}
                            </span>
                            
                            {!dayObj.isClosed ? (
                              <div className="flex items-center gap-2">
                                <input type="time" value={dayObj.open} onChange={e => updateWorkingHour(index, 'open', e.target.value)} className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold outline-none"/>
                                <span className="text-slate-300">-</span>
                                <input type="time" value={dayObj.close} onChange={e => updateWorkingHour(index, 'close', e.target.value)} className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold outline-none"/>
                              </div>
                            ) : (
                              <span className="text-xs font-black uppercase text-red-400 bg-red-50 px-3 py-1 rounded-md">Kapalı</span>
                            )}
                            
                            <button onClick={() => updateWorkingHour(index, 'isClosed', !dayObj.isClosed)} className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors ${dayObj.isClosed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {dayObj.isClosed ? 'Aç' : 'Kapat'}
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 pt-8 border-t border-slate-100">
                        <h4 className="font-black text-sm mb-4 text-[#2D1B4E] flex items-center gap-2">
                          <CalendarOff size={16} className="text-red-500"/> Özel Kapalı Günler (Tatiller)
                        </h4>
                        <div className="flex gap-2 mb-4">
                          <input type="date" value={newClosedDate} onChange={e=>setNewClosedDate(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm font-bold outline-none focus:border-[#E8622A]" min={today}/>
                          <button onClick={addClosedDate} className="bg-red-500 text-white px-4 rounded-xl font-black text-[10px] uppercase border-none cursor-pointer hover:bg-red-600 transition-colors">
                            Tarihi Kapat
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profileForm.closed_dates.map(date => (
                            <span key={date} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                              {date} 
                              <button onClick={()=>removeClosedDate(date)} className="bg-transparent border-none cursor-pointer text-red-400 hover:text-red-600 p-0 m-0 leading-none">
                                <XCircle size={14}/>
                              </button>
                            </span>
                          ))}
                          {profileForm.closed_dates.length === 0 && <span className="text-xs font-bold text-slate-400">Eklenmiş tatil günü yok.</span>}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
                      <h3 className="font-black text-lg mb-6 flex items-center justify-between text-[#2D1B4E]">
                        <span className="flex items-center gap-2"><Camera size={20} className="text-[#E8622A]"/> Fotoğraf Galerisi</span>
                        <label className="bg-[#2D1B4E] hover:bg-[#1a0f2e] text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors shadow-md">
                          {isUploading ? <Loader2 className="animate-spin" size={14}/> : <UploadCloud size={14}/>}
                          <span>Fotoğraf Seç</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e, 'gallery')} disabled={isUploading}/>
                        </label>
                      </h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                        {profileForm.gallery.map((imgUrl, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 shadow-sm bg-slate-100">
                            <img src={imgUrl} className="w-full h-full object-cover" alt="Galeri" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button onClick={() => removeGalleryImage(idx)} className="bg-red-500 text-white p-2 rounded-full border-none cursor-pointer hover:scale-110 transition-transform">
                                <Trash2 size={16}/>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
          )}

        </div>
      </main>

      {/* === HIZLI RANDEVU MODALI === */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-[#2D1B4E]/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[500px] rounded-[32px] p-8 relative animate-in zoom-in-95 duration-300 shadow-2xl border border-slate-200">
            <button onClick={() => setShowQuickAdd(false)} className="absolute top-6 right-6 text-slate-400 hover:text-black border-none bg-transparent cursor-pointer">
              <XCircle size={28}/>
            </button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#E8622A]/10 text-[#E8622A] rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Plus size={32}/>
              </div>
              <h2 className="text-2xl font-black uppercase text-[#2D1B4E]">Yeni {isClub ? 'Rezervasyon' : 'Randevu'}</h2>
            </div>
            
            <form onSubmit={handleQuickAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Adı" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A]" value={quickForm.customer_name} onChange={e => setQuickForm({...quickForm, customer_name: e.target.value})} />
                <input required placeholder="Soyadı" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A]" value={quickForm.customer_surname} onChange={e => setQuickForm({...quickForm, customer_surname: e.target.value})} />
              </div>
              
              <input required placeholder="Telefon" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A]" value={quickForm.customer_phone} onChange={e => setQuickForm({...quickForm, customer_phone: e.target.value})} />
              
              <div className="grid grid-cols-2 gap-4">
                <select required className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A]" value={quickForm.service_name} onChange={e => setQuickForm({...quickForm, service_name: e.target.value})}>
                  <option value="">{isClub ? 'Seçim Yap' : 'Hizmet Seç'}</option>
                  {servicesForm.map((s,i) => <option key={i} value={s.name}>{s.name} ({s.price}TL)</option>)}
                </select>
                
                {/* EĞER CLUB DEĞİLSE PERSONEL SEÇİMİ GÖSTER */}
                {!isClub && (
                  <select required className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A]" value={quickForm.staff_name} onChange={e => setQuickForm({...quickForm, staff_name: e.target.value})}>
                    <option value="">Personel Seç</option>
                    {staffForm.map((s,i) => <option key={i} value={s.name}>{s.name}</option>)}
                  </select>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input required type="date" className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A]" value={quickForm.appointment_date} onChange={e => setQuickForm({...quickForm, appointment_date: e.target.value})} />
                <select required className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A]" value={quickForm.appointment_time} onChange={e => setQuickForm({...quickForm, appointment_time: e.target.value})}>
                  {allTimeSlots.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <button type="submit" className="w-full bg-[#E8622A] text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl border-none cursor-pointer mt-2 hover:scale-[1.02] transition-transform">
                Kaydet
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}