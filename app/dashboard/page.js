"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Calendar, Users, Settings, LogOut, Plus, 
  CheckCircle2, XCircle, Menu, Scissors, Image as ImageIcon, Clock, Save, Trash2, 
  MessageSquare, Phone, UserPlus, Store, Camera, 
  MessageCircle, Mail, UploadCloud, Loader2, Bell, CalendarOff, Check, UserMinus, BarChart, Filter, Shield, Music, Ticket, CalendarHeart,
  Target, BarChart3, Lock, Send, Link as LinkIcon, Dog, Car,
  PieChart, FileCode2, Rocket, ArrowRight, Wallet, CreditCard, TrendingUp,
  Package, Box, Archive, AlertTriangle, Layers,
  UserCircle, Activity, Award, AlertOctagon, Heart, FileText, ChevronRight // YENİ CRM İKONLARI EKLENDİ
} from 'lucide-react';

// GERÇEK SUPABASE BAĞLANTISI
import { supabase } from '../../lib/supabase';

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const FacebookIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const allTimeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", 
  "00:00", "00:30", "01:00", "01:30", "02:00"
];

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
  
  const [userRole, setUserRole] = useState('owner');
  const [loggedStaffName, setLoggedStaffName] = useState('');

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

  // --- CRM MODÜLÜ STATE'LERİ ---
  const [crmTab, setCrmTab] = useState('dashboard');
  const [showSegmentBuilder, setShowSegmentBuilder] = useState(false);
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false);

  // --- STOK & PAKET MODÜLÜ STATE'LERİ ---
  const [inventoryTab, setInventoryTab] = useState('products'); 
  const [products, setProducts] = useState([
    { id: 1, name: 'Keratin Bakım Şampuanı', stock: 12, price: 450, alert: 5 },
    { id: 2, name: 'Saç Şekillendirici Wax', stock: 3, price: 220, alert: 10 },
    { id: 3, name: 'Argan Yağı Serum', stock: 24, price: 850, alert: 5 }
  ]);
  const [packages, setPackages] = useState([
    { id: 1, name: '8 Seans Lazer Paketi', sessions: 8, price: 4500 },
    { id: 2, name: '5 Seans Cilt Bakımı', sessions: 5, price: 2250 }
  ]);

  // --- MÜŞTERİ DETAY (MODÜL 3) STATE'LERİ ---
  const [customerSearch, setCustomerSearch] = useState('');
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientDetailTab, setClientDetailTab] = useState('history'); // history, clinic, packages

  const [profileForm, setProfileForm] = useState({ 
    logo_url: '', description: '', contact_phone: '', contact_email: '', 
    working_hours: defaultWorkingHours, gallery: [], 
    socials: { instagram: '', facebook: '', whatsapp: '' }, closed_dates: []
  });
  
  const [servicesForm, setServicesForm] = useState([]);
  const [eventsForm, setEventsForm] = useState([]);
  const [newService, setNewService] = useState({ name: '', price: '', duration: '30', capacity: '10' });
  const [newEvent, setNewEvent] = useState({ name: '', date: '', time: '22:00', description: '', imageFile: null });
  const [staffForm, setStaffForm] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: '', role: '', password: '', has_login: true }); 
  const [newClosedDate, setNewClosedDate] = useState(''); 

  const [quickForm, setQuickForm] = useState({ 
    customer_name: '', customer_surname: '', customer_phone: '', service_name: '', 
    appointment_date: new Date().toISOString().split('T')[0], appointment_time: '10:00', staff_name: '' 
  });

  // --- KASA & ADİSYON MODÜLÜ STATE'LERİ ---
  const [showAdisyonModal, setShowAdisyonModal] = useState(false);
  const [adisyonForm, setAdisyonForm] = useState({
    musteri_adi: '', hizmet: '', personel: '', tutar: '', odeme_tipi: 'Kredi Kartı', prim_yuzdesi: '30'
  });

  useEffect(() => {
    const initSession = async () => {
      const session = localStorage.getItem('bookcy_biz_session');
      if (!session) {
        router.push('/');
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
        router.push('/');
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
        let parsedHours = defaultWorkingHours;
        if (Array.isArray(freshShop.working_hours)) parsedHours = freshShop.working_hours;
        else if (typeof freshShop.working_hours === 'string') try { parsedHours = JSON.parse(freshShop.working_hours); } catch(e){}
        
        setProfileForm({ 
          logo_url: freshShop.logo_url || '', description: freshShop.description || '', 
          contact_phone: freshShop.contact_phone || '', contact_email: freshShop.contact_email || '', 
          working_hours: parsedHours, gallery: freshShop.gallery || [], 
          socials: freshShop.socials || { instagram: '', facebook: '', whatsapp: '' }, 
          closed_dates: freshShop.closed_dates || []
        });
        setServicesForm(freshShop.services || []);
        setEventsForm(freshShop.events || []);
        setStaffForm(freshShop.staff || []);

        const { data: apptData } = await supabase.from('appointments').select('*').eq('shop_id', shopId).order('created_at', { ascending: false });
        if (apptData) setAppointments(apptData);

        const { data: revData } = await supabase.from('reviews').select('*').eq('shop_id', shopId).order('created_at', { ascending: false });
        if (revData) setReviews(revData);
      }
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => { localStorage.removeItem('bookcy_biz_session'); router.push('/'); };

  const saveProfile = async () => { 
      try {
        const { error } = await supabase.from('shops').update({
                logo_url: profileForm.logo_url, description: profileForm.description,
                contact_phone: profileForm.contact_phone, contact_email: profileForm.contact_email,
                working_hours: profileForm.working_hours, gallery: profileForm.gallery,
                socials: profileForm.socials, closed_dates: profileForm.closed_dates,
                services: servicesForm, events: eventsForm, staff: staffForm        
            }).eq('id', shop.id);
        if (error) throw error;
        alert("Tüm bilgileriniz başarıyla kaydedildi! 🎉");
      } catch (error) { alert("Kaydedilirken bir hata oluştu."); }
  };

  const addClosedDate = () => {
    if (!newClosedDate || profileForm.closed_dates.includes(newClosedDate)) return;
    setProfileForm({ ...profileForm, closed_dates: [...profileForm.closed_dates, newClosedDate] });
    setNewClosedDate('');
  };
  const removeClosedDate = (date) => { setProfileForm({ ...profileForm, closed_dates: profileForm.closed_dates.filter(d => d !== date) }); };

  const uploadImage = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${shop.id}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(filePath);
        if (type === 'logo') setProfileForm({ ...profileForm, logo_url: publicUrl });
        else setProfileForm({ ...profileForm, gallery: [...profileForm.gallery, publicUrl] });
        alert("Fotoğraf başarıyla yüklendi.");
    } catch (error) { alert("Yükleme başarısız."); } finally { setIsUploading(false); }
  };

  const removeGalleryImage = (index) => { setProfileForm({ ...profileForm, gallery: profileForm.gallery.filter((_, i) => i !== index) }); };
  const updateWorkingHour = (index, field, value) => { const newHours = [...profileForm.working_hours]; newHours[index][field] = value; setProfileForm({ ...profileForm, working_hours: newHours }); };
  const updateSocial = (network, value) => { setProfileForm({ ...profileForm, socials: { ...profileForm.socials, [network]: value } }); };

  const addEvent = async () => {
    if (!newEvent.name || !newEvent.date || !newEvent.time) return alert("Etkinlik adı, tarihi ve saati zorunludur!");
    setIsEventUploading(true); let imageUrl = '';
    try {
        if (newEvent.imageFile) {
            const fileExt = newEvent.imageFile.name.split('.').pop();
            const filePath = `${shop.id}/events/${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, newEvent.imageFile);
            if (!uploadError) imageUrl = supabase.storage.from('gallery').getPublicUrl(filePath).data.publicUrl;
        }
        setEventsForm([...eventsForm, { id: Date.now(), name: newEvent.name, date: newEvent.date, time: newEvent.time, description: newEvent.description, image_url: imageUrl }]);
        setNewEvent({ name: '', date: '', time: '22:00', description: '', imageFile: null });
    } catch (error) { console.error(error); } finally { setIsEventUploading(false); }
  };
  const deleteEvent = async (id) => { setEventsForm(eventsForm.filter(e => e.id !== id)); };

  const categoryLower = shop?.category?.toLowerCase() || '';
  const isClub = categoryLower.includes('bar') || categoryLower.includes('club') || categoryLower.includes('loca');
  const isVet = categoryLower.includes('vet') || categoryLower.includes('veteriner') || categoryLower.includes('pet');
  const isCarWash = categoryLower.includes('oto') || categoryLower.includes('yıkama');

  const addService = async () => {
    if (!newService.name) return alert("Lütfen bir ad giriniz.");
    const finalPrice = newService.price === '' || newService.price === undefined ? '0' : newService.price;
    const finalCapacity = isClub && newService.capacity ? newService.capacity.toString() : '1';
    setServicesForm([...servicesForm, { ...newService, price: finalPrice, duration: isClub ? '0' : newService.duration, capacity: finalCapacity }]); 
    setNewService({ name: '', price: '', duration: '30', capacity: '10' });
  };
  const deleteService = async (index) => { setServicesForm(servicesForm.filter((_, i) => i !== index)); };

  const addStaff = async () => {
    if (!newStaff.name) return alert("Personel adı zorunludur!");
    if (newStaff.has_login && !newStaff.password) return alert("Giriş izni olan personel için şifre zorunludur!");
    const isPremium = shop && ['Premium Paket', 'Premium', 'Ücretsiz Deneme'].includes(shop.package);
    const maxLogins = isPremium ? 5 : 2;
    const currentStaffLogins = staffForm.filter(s => s.has_login || (s.password && s.has_login !== false)).length;
    if (newStaff.has_login && currentStaffLogins >= maxLogins) return alert(`Paketiniz gereği en fazla ${maxLogins} personele panel erişimi verebilirsiniz.`);
    setStaffForm([...staffForm, newStaff]); setNewStaff({ name: '', role: '', password: '', has_login: true }); 
  };
  const deleteStaff = async (index) => { setStaffForm(staffForm.filter((_, i) => i !== index)); };

  const updateApptStatus = async (id, newStatus) => { 
      try {
          const { error } = await supabase.from('appointments').update({ status: newStatus }).eq('id', id);
          if (error) throw error;
          setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
      } catch (error) { alert("Durum güncellenemedi."); }
  };
  const deleteAppointmentCompletely = async (id) => {
    if(window.confirm("Bu kaydı tamamen SİLMEK istediğinize emin misiniz?")) {
        try {
            const { error } = await supabase.from('appointments').delete().eq('id', id);
            if (error) throw error;
            setAppointments(appointments.filter(a => a.id !== id));
        } catch (error) { alert("Silinemedi."); }
    }
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (profileForm.closed_dates.includes(quickForm.appointment_date)) return alert("Seçtiğiniz tarih kapalı!");
    try {
        const { error } = await supabase.from('appointments').insert([{ 
            shop_id: shop.id, customer_name: quickForm.customer_name, customer_surname: quickForm.customer_surname, 
            customer_phone: "+90 " + quickForm.customer_phone, appointment_date: quickForm.appointment_date, 
            appointment_time: quickForm.appointment_time, service_name: quickForm.service_name, 
            staff_name: isClub ? 'Rezervasyon' : (quickForm.staff_name || 'Genel'), status: 'Bekliyor' 
        }]);
        if (error) throw error;
        alert(isClub ? "Rezervasyon eklendi!" : "Randevu eklendi!"); setShowQuickAdd(false); fetchDashboardData(shop.id); 
    } catch (error) { alert("Eklenemedi!"); }
  };

  const handleAdisyonSubmit = (e) => {
    e.preventDefault();
    alert(`${adisyonForm.musteri_adi} için ${adisyonForm.tutar} TL tutarında ${adisyonForm.odeme_tipi} adisyonu başarıyla kesildi! \n\nPersonel Primi: ${ (adisyonForm.tutar * adisyonForm.prim_yuzdesi) / 100 } TL`);
    setShowAdisyonModal(false);
    setAdisyonForm({ musteri_adi: '', hizmet: '', personel: '', tutar: '', odeme_tipi: 'Kredi Kartı', prim_yuzdesi: '30' });
  };

  // --- MÜŞTERİ DETAY MODALINI AÇAN FONKSİYON ---
  const openClientModal = (clientData) => {
    setSelectedClient({
      name: clientData.customer_name,
      surname: clientData.customer_surname,
      phone: clientData.customer_phone,
      email: clientData.customer_email || 'Bilinmiyor',
      points: Math.floor(Math.random() * 500) + 50, 
      alerji_notu: '', 
      measurements: [
        { date: '2026-03-10', weight: '68', waist: '64', notes: 'İlk seans lazer atışı: 15J' },
        { date: '2026-04-12', weight: '65', waist: '62', notes: 'İkinci seans, kızarıklık olmadı. Atış: 18J' }
      ],
      packages: [
        { name: '10 Seans Tüm Vücut Lazer', total: 10, used: 2 }
      ],
      history: appointments.filter(a => a.customer_phone === clientData.customer_phone)
    });
    setClientDetailTab('history');
    setShowClientModal(true);
  };

  const today = new Date().toISOString().split('T')[0];
  const getApptPrice = (serviceName) => { const srv = servicesForm.find(s => s.name === serviceName); return srv ? parseInt(srv.price) : 0; };
  
  const todayAppts = appointments.filter(a => a.appointment_date === today && a.status !== 'İptal');
  const earnedRevenue = appointments.filter(a => a.status === 'Tamamlandı').reduce((acc, a) => acc + getApptPrice(a.service_name), 0);
  const pendingRevenue = appointments.filter(a => a.status === 'Bekliyor' || !a.status).reduce((acc, a) => acc + getApptPrice(a.service_name), 0);
  const uniqueCustomersMap = new Map();
  appointments.forEach(a => {
    if(a.customer_phone && !uniqueCustomersMap.has(a.customer_phone)) {
      uniqueCustomersMap.set(a.customer_phone, a);
    }
  });
  const uniqueCustomers = Array.from(uniqueCustomersMap.values());

  const filteredCustomers = uniqueCustomers.filter(c => 
    (c.customer_name && c.customer_name.toLowerCase().includes(customerSearch.toLowerCase())) || 
    (c.customer_phone && c.customer_phone.includes(customerSearch))
  );

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayRev = appointments.filter(a => a.appointment_date === dateStr && a.status === 'Tamamlandı').reduce((acc, a) => acc + getApptPrice(a.service_name), 0);
    return { date: dateStr.slice(-2), rev: dayRev };
  });
  const maxRev = Math.max(...last7Days.map(d => d.rev), 100);

  const strSevenDays = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const strThirtyDays = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const staffPerformance = staffForm.map(staff => {
    const staffAppts = appointments.filter(a => a.staff_name === staff.name && a.status !== 'İptal');
    return { name: staff.name, daily: staffAppts.filter(a => a.appointment_date === today).length, weekly: staffAppts.filter(a => a.appointment_date >= strSevenDays && a.appointment_date <= today).length, monthly: staffAppts.filter(a => a.appointment_date >= strThirtyDays && a.appointment_date <= today).length };
  });
  const recentNotifications = appointments.slice(0, 3).map(a => ({ id: a.id, title: isClub ? 'Yeni Rezervasyon!' : 'Yeni İşlem Geldi!', desc: `${a.customer_name} ${a.appointment_date} için ${a.service_name} oluşturdu.`, time: 'Az önce' }));

  const isPremium = shop && ['Premium Paket', 'Premium', 'Ücretsiz Deneme'].includes(shop.package);
  const maxStaffLogins = isPremium ? 5 : 2;
  const currentStaffLogins = staffForm.filter(s => s.has_login || (s.password && s.has_login !== false)).length;

  const getServicesLabel = () => { if (isVet) return 'Aşı & Tedaviler'; if (isCarWash) return 'Yıkama Paketleri'; if (isClub) return 'Etkinlikler & Loca'; return 'Hizmetler & Fiyatlar'; };
  const getClientsLabel = () => { if (isVet) return 'Hasta & Sahipleri'; if (isCarWash) return 'Araçlar & Müşteriler'; return 'Müşteriler & Kayıtlar'; };
  const getStaffLabel = () => { if (isVet) return 'Hekim Yönetimi'; return 'Ekip Yönetimi'; };
  const getServicesIcon = () => { if (isVet) return <Dog size={18}/>; if (isCarWash) return <Car size={18}/>; if (isClub) return <Music size={18}/>; return <Scissors size={18}/>; };

  const menuItems = userRole === 'owner' 
    ? [
        { id: 'overview', icon: <LayoutDashboard size={18}/>, label: 'Özet Panel' },
        { id: 'kasa', icon: <Wallet size={18}/>, label: 'Kasa & Adisyon' },
        { id: 'inventory', icon: <Package size={18}/>, label: 'Stok & Paketler' },
        { id: 'calendar', icon: <Calendar size={18}/>, label: 'Takvim Yönetimi' },
        { id: 'clients', icon: <Users size={18}/>, label: getClientsLabel() },
        { id: 'services', icon: getServicesIcon(), label: getServicesLabel() },
        ...(isClub ? [] : [{ id: 'staff', icon: <Clock size={18}/>, label: getStaffLabel() }]),
        { id: 'reviews', icon: <MessageSquare size={18}/>, label: 'Yorumlar' },
        { id: 'reports', icon: <BarChart3 size={18}/>, label: 'Gelişmiş Raporlar', isLocked: !isPremium },
        { id: 'marketing', icon: <Target size={18}/>, label: 'Pazarlama & CRM', isLocked: !isPremium },
        { id: 'settings', icon: <Store size={18}/>, label: 'Vitrin Ayarları' }
      ]
    : [ { id: 'calendar', icon: <Calendar size={18}/>, label: 'Kendi Takvimim' } ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center font-['DM_Sans']">
        <div className="w-16 h-16 border-4 border-[#E8622A] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black text-[#2D1B4E] uppercase tracking-widest animate-pulse">Sistem Yükleniyor...</p>
      </div>
    );
  }

  if (!shop && !loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center font-['DM_Sans']">
        <p className="font-black text-red-500 uppercase tracking-widest mb-4">İşletme verileri bulunamadı!</p>
        <button onClick={handleLogout} className="bg-[#2D1B4E] text-white px-6 py-3 rounded-xl font-bold border-none cursor-pointer hover:bg-[#1a0f2e]">
          Giriş Sayfasına Dön
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-[#2D1B4E] font-['DM_Sans'] overflow-hidden">
      
      {mobileMenuOpen && ( 
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div> 
      )}

      <aside className={`fixed md:relative top-0 left-0 h-screen bg-[#2D1B4E] text-white flex flex-col shadow-2xl z-40 transition-transform duration-300 w-64 min-w-[256px] shrink-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#E8622A] rounded-xl flex items-center justify-center font-black shadow-lg text-white overflow-hidden shrink-0">
               {shop.logo_url ? <img src={shop.logo_url} className="w-full h-full object-cover"/> : 'B'}
             </div>
             <div className="overflow-hidden">
               <span className="font-black text-xl tracking-tighter truncate block w-full">{shop.name}</span>
               <span className="text-[10px] font-bold text-[#F5C5A3] uppercase tracking-widest block truncate">
                 {userRole === 'owner' ? 'YÖNETİCİ' : `UZMAN: ${loggedStaffName}`}
               </span>
               <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border inline-block mt-1 ${isPremium ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' : 'border-white/20 text-white/60 bg-white/5'}`}>
                 {shop.package}
               </span>
             </div>
          </div>
          <button className="md:hidden text-white/50 hover:text-white border-none bg-transparent cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
            <XCircle size={24} />
          </button>
        </div>
        
        <div className="flex-1 p-4 space-y-1 mt-2 overflow-y-auto flex flex-col scrollbar-hide">
          {menuItems.map(tab => (
             <button 
                key={tab.id} 
                onClick={() => {setActiveTab(tab.id); setMobileMenuOpen(false);}} 
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all border-none cursor-pointer text-left shrink-0 ${activeTab === tab.id ? 'bg-[#E8622A] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5'}`}
             >
               <span className="shrink-0">{tab.icon}</span> 
               <span className="truncate">{tab.label}</span>
               {tab.isLocked && <Lock size={14} className="ml-auto opacity-50"/>}
             </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl font-bold text-xs text-white uppercase tracking-widest bg-red-500/10 hover:bg-red-500 transition-all border-none cursor-pointer">
            <LogOut size={16}/> Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto w-full relative bg-[#F8F9FA]">
        <header className="bg-white border-b border-slate-200 px-4 md:px-10 py-5 flex justify-between items-center sticky top-0 z-20 shadow-sm gap-4 shrink-0">
          <div className="flex items-center gap-4 overflow-hidden">
            <button className="md:hidden text-[#2D1B4E] bg-slate-100 p-2 rounded-lg border-none cursor-pointer hover:bg-slate-200 transition-colors shrink-0" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-xl font-black uppercase tracking-tight truncate">{shop.name}</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">
                {userRole === 'owner' ? 'Yönetici Paneli' : 'Personel Ekranı'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
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

        <div className="p-4 md:p-10 max-w-[1400px] mx-auto w-full">
          
          {/* TAB 1: ÖZET PANEL */}
          {userRole === 'owner' && activeTab === 'overview' && (
            <div className="animate-in fade-in duration-500">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                    <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm text-center">
                      <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto"><Calendar size={20}/></div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Bugünkü Aktif</p>
                      <p className="text-3xl font-black">{todayAppts.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm text-center">
                      <div className="w-10 h-10 bg-green-50 text-green-500 rounded-lg flex items-center justify-center mb-4 mx-auto"><CheckCircle2 size={20}/></div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Kazanılan Ciro</p>
                      <p className="text-3xl font-black text-green-600">₺{earnedRevenue}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm text-center">
                      <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center mb-4 mx-auto"><Clock size={20}/></div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Bekleyen Ciro</p>
                      <p className="text-3xl font-black">₺{pendingRevenue}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm text-center">
                      <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto"><Users size={20}/></div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Toplam Müşteri</p>
                      <p className="text-3xl font-black">{uniqueCustomers.length}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-[#2D1B4E] text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">₺{day.rev}</div>
                          </div>
                          <span className="text-[9px] font-bold text-white/50 mt-2">{day.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>

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
                                            <div className="font-bold text-sm text-[#2D1B4E]">{appt.customer_name} {appt.customer_surname}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{appt.appointment_date} • {appt.appointment_time} | {appt.service_name}</div>
                                          </td>
                                          <td className="px-6 py-4 text-center">
                                            {appt.status === 'Tamamlandı' && <span className="bg-green-100 text-green-600 text-[10px] font-black px-4 py-2 rounded-xl uppercase flex items-center justify-center gap-1 w-fit mx-auto"><Check size={14}/> Tamamlandı</span>}
                                            {appt.status === 'İptal' && <span className="bg-red-100 text-red-600 text-[10px] font-black px-4 py-2 rounded-xl uppercase flex items-center justify-center gap-1 w-fit mx-auto"><XCircle size={14}/> İptal Edildi</span>}
                                            {(!appt.status || appt.status === 'Bekliyor') && (
                                              <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => updateApptStatus(appt.id, 'Tamamlandı')} className="bg-green-500 text-white p-2 rounded-lg border-none cursor-pointer hover:bg-green-600 transition-colors"><Check size={16}/></button>
                                                <button onClick={() => updateApptStatus(appt.id, 'İptal')} className="bg-red-50 text-red-500 p-2 rounded-lg border border-red-200 cursor-pointer hover:bg-red-100 transition-colors"><UserMinus size={16}/></button>
                                              </div>
                                            )}
                                          </td>
                                      </tr>
                                  ))}
                                  {appointments.length === 0 && <tr><td colSpan="2" className="text-center p-10 text-slate-400 font-bold uppercase tracking-widest text-xs">Henüz hiç işlem yok.</td></tr>}
                              </tbody>
                          </table>
                      </div>
                  </div>
                </div>

                {!isClub && (
                  <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden w-full">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-black uppercase tracking-tight flex items-center gap-2"><Users size={16} className="text-[#E8622A]"/> Personel Performansı</h3>
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

          {/* TAB 1.5: KASA & ADİSYON */}
          {userRole === 'owner' && activeTab === 'kasa' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-[#2D1B4E]">Kasa & Adisyon</h2>
                  <p className="text-slate-500 font-bold text-sm mt-1">Günlük finansal akışınızı ve personel hakedişlerini yönetin.</p>
                </div>
                <button onClick={() => setShowAdisyonModal(true)} className="bg-[#E8622A] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border-none cursor-pointer shadow-lg hover:scale-105 transition-transform">
                  <Plus size={16} /> Yeni Adisyon Kes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><Wallet size={24} /></div>
                    <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-100 px-3 py-1.5 rounded-lg"><TrendingUp size={14} className="mr-1"/> +12%</span>
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Günlük Toplam Ciro</p>
                  <h3 className="text-3xl font-black text-[#2D1B4E]">12.450 ₺</h3>
                </div>

                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-orange-50 text-[#E8622A] rounded-xl flex items-center justify-center"><CreditCard size={24} /></div>
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Kredi Kartı / POS</p>
                  <h3 className="text-3xl font-black text-[#2D1B4E]">8.250 ₺</h3>
                </div>

                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center"><Users size={24} /></div>
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Personel Primi</p>
                  <h3 className="text-3xl font-black text-[#2D1B4E]">3.150 ₺</h3>
                </div>
              </div>

              <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden w-full">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-black uppercase tracking-tight flex items-center gap-2 text-[#2D1B4E]">Son Kesilen Adisyonlar</h3>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Saat / Müşteri</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">İşlem & Uzman</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Ödeme Tipi</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Tutar</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm text-[#2D1B4E]">Ahmet Yılmaz</div>
                          <div className="text-[10px] font-bold text-slate-400 mt-1">Bugün, 14:30</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm text-slate-600">Saç Kesimi + Sakal</div>
                          <div className="text-[10px] font-black uppercase text-[#E8622A] mt-1">Caner Usta</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-orange-50 text-[#E8622A] text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">Kredi Kartı</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="font-black text-lg text-[#2D1B4E]">650 ₺</div>
                          <div className="text-[10px] font-black uppercase text-emerald-500 mt-1">Ödendi</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1.7: STOK & PAKET YÖNETİMİ */}
          {userRole === 'owner' && activeTab === 'inventory' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-[#2D1B4E]">Stok & Paket Yönetimi</h2>
                  <p className="text-slate-500 font-bold text-sm mt-1">Ürün stoklarını takip edin ve seans paketleri oluşturun.</p>
                </div>
                <button className="bg-[#2D1B4E] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border-none cursor-pointer shadow-lg hover:scale-105 transition-transform">
                  <Plus size={16} /> Yeni Ekle
                </button>
              </div>

              <div className="flex gap-4 mb-8 bg-slate-100 p-1.5 rounded-2xl w-fit">
                <button 
                  onClick={() => setInventoryTab('products')} 
                  className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all border-none cursor-pointer ${inventoryTab === 'products' ? 'bg-white text-[#2D1B4E] shadow-sm' : 'text-slate-500 hover:text-[#2D1B4E]'}`}
                >
                  Ürün Stokları
                </button>
                <button 
                  onClick={() => setInventoryTab('packages')} 
                  className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all border-none cursor-pointer ${inventoryTab === 'packages' ? 'bg-white text-[#2D1B4E] shadow-sm' : 'text-slate-500 hover:text-[#2D1B4E]'}`}
                >
                  Seans Paketleri
                </button>
              </div>

              {inventoryTab === 'products' ? (
                <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden w-full">
                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Ürün Adı</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Mevcut Stok</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Birim Fiyat</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-center">Durum</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">İşlem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p) => (
                          <tr key={p.id} className="border-t border-slate-50 hover:bg-slate-50 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-[#2D1B4E]"><Box size={20}/></div>
                                <span className="font-bold text-sm text-[#2D1B4E]">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-center font-black text-lg text-[#2D1B4E]">{p.stock} Adet</td>
                            <td className="px-8 py-5 text-center font-black text-[#E8622A]">{p.price} ₺</td>
                            <td className="px-8 py-5 text-center">
                              {p.stock <= p.alert ? (
                                <span className="bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 w-fit mx-auto border border-red-100"><AlertTriangle size={12}/> Kritik Stok</span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 w-fit mx-auto border border-emerald-100">Yeterli</span>
                              )}
                            </td>
                            <td className="px-8 py-5 text-right">
                              <button className="p-2 text-slate-300 hover:text-[#E8622A] bg-transparent border-none cursor-pointer transition-colors"><Plus size={18}/></button>
                              <button className="p-2 text-slate-300 hover:text-red-500 bg-transparent border-none cursor-pointer transition-colors ml-2"><Trash2 size={18}/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-12 -mt-12 group-hover:bg-[#E8622A]/10 transition-colors"></div>
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6"><Layers size={24}/></div>
                      <h3 className="font-black text-xl text-[#2D1B4E] mb-2 uppercase tracking-tight">{pkg.name}</h3>
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">{pkg.sessions} Seans Uygulama</p>
                      <div className="flex justify-between items-end border-t border-slate-50 pt-6">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Paket Fiyatı</p>
                          <p className="text-2xl font-black text-[#E8622A]">{pkg.price} ₺</p>
                        </div>
                        <button className="bg-[#2D1B4E] text-white p-3 rounded-xl border-none cursor-pointer hover:bg-black transition-colors shadow-lg"><ArrowRight size={18}/></button>
                      </div>
                    </div>
                  ))}
                  <div className="border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center p-8 hover:border-[#E8622A] hover:bg-orange-50/30 transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#E8622A] group-hover:text-white transition-all"><Plus size={24}/></div>
                    <span className="font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-[#E8622A]">Yeni Paket Oluştur</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TAKVİM YÖNETİMİ */}
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
                      <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="flex-1 md:flex-none bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-[#E8622A] cursor-pointer" />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 md:p-8">
                      {profileForm.closed_dates.includes(selectedDate) ? (
                        <div className="py-20 text-center flex flex-col items-center justify-center text-slate-400">
                          <CalendarOff size={64} className="text-red-300 mb-4"/>
                          <h3 className="text-2xl font-black text-[#2D1B4E] uppercase tracking-tight mb-2">İşletme Kapalı</h3>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {allTimeSlots.map((slot) => {
                                const slotAppts = appointments.filter(a => 
                                  a.appointment_date === selectedDate && a.status !== 'İptal' && 
                                  (calendarStaffFilter === 'Tümü' || a.staff_name === calendarStaffFilter) &&
                                  ((a.occupied_slots && a.occupied_slots.length > 0) ? a.occupied_slots.includes(slot) : a.appointment_time === slot)
                                );
                                const dayName = new Date(selectedDate).toLocaleDateString('tr-TR', { weekday: 'long' });
                                const todayHours = profileForm.working_hours.find(h => h.day === dayName);
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
                                                <span className="bg-white px-2 py-1 rounded shadow-sm border border-slate-100 flex items-center gap-1">{isClub ? <Music size={12}/> : <Scissors size={12}/>} {a.service_name}</span>
                                                {!isClub && <span className="bg-white px-2 py-1 rounded shadow-sm border border-slate-100 flex items-center gap-1"><Users size={12}/> {a.staff_name}</span>}
                                              </p>
                                            </div>
                                            <div className="flex items-center gap-3 w-full md:w-auto">
                                              {(!a.status || a.status === 'Bekliyor') ? (
                                                <>
                                                  <button onClick={() => updateApptStatus(a.id, 'İptal')} className="bg-red-50 hover:bg-red-100 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-200 cursor-pointer flex items-center gap-1 transition-colors"><XCircle size={14}/> İptal Et</button>
                                                  <button onClick={() => updateApptStatus(a.id, 'Tamamlandı')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-none cursor-pointer flex items-center gap-1 transition-colors"><Check size={14}/> Tamamla</button>
                                                </>
                                              ) : (
                                                <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-green-600 text-white flex items-center gap-1"><CheckCircle2 size={14}/> BİTTİ</div>
                                              )}
                                              <button onClick={() => deleteAppointmentCompletely(a.id)} className="bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-red-500 p-2 rounded-lg border-none cursor-pointer transition-colors" title="Sistemden Kalıcı Olarak Sil"><Trash2 size={16}/></button>
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

          {/* TAB 3: HİZMETLER VE FİYATLAR */}
          {userRole === 'owner' && activeTab === 'services' && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                {isClub ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
                            <h3 className="font-black text-xl text-[#2D1B4E] flex items-center gap-2 border-b border-slate-100 pb-4"><CalendarHeart size={24} className="text-[#E8622A]"/> Yaklaşan Etkinlikler</h3>
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-4 mt-4 shadow-inner">
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Yeni Etkinlik Ekle</h4>
                                <div className="space-y-4">
                                    <input type="text" placeholder="Etkinlik Adı (Örn: DJ Party)" value={newEvent.name} onChange={e=>setNewEvent({...newEvent, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A]"/>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="date" value={newEvent.date} onChange={e=>setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] cursor-pointer"/>
                                        <select value={newEvent.time} onChange={e=>setNewEvent({...newEvent, time: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] cursor-pointer">{eventTimeSlots.map(t => <option key={t} value={t}>{t}</option>)}</select>
                                    </div>
                                    <textarea placeholder="Etkinlik Açıklaması (Opsiyonel)" rows="2" value={newEvent.description} onChange={e=>setNewEvent({...newEvent, description: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-[#2D1B4E] outline-none focus:border-[#E8622A] resize-none"></textarea>
                                    <div className="flex items-center gap-4">
                                        <label className="flex-1 bg-[#2D1B4E] hover:bg-[#1a0f2e] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md border-none">
                                            {isEventUploading ? <Loader2 className="animate-spin" size={16}/> : <ImageIcon size={16}/>}
                                            <span>{newEvent.imageFile ? newEvent.imageFile.name : 'Afiş Yükle'}</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => setNewEvent({...newEvent, imageFile: e.target.files[0]})} disabled={isEventUploading}/>
                                        </label>
                                        <button onClick={addEvent} disabled={isEventUploading} className="flex-1 bg-[#E8622A] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border-none cursor-pointer hover:scale-[1.02] transition-transform shadow-md disabled:opacity-50"><Plus size={16}/> Etkinliği Yarat</button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] scrollbar-hide pr-2">
                                {eventsForm.map((ev) => (
                                    <div key={ev.id} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                                        <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">{ev.image_url ? <img src={ev.image_url} className="w-full h-full object-cover"/> : <Music size={24} className="text-slate-300"/>}</div>
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

                        <div className="bg-[#2D1B4E] rounded-[32px] shadow-sm border border-slate-200 p-8 flex flex-col gap-6 text-white h-fit relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#E8622A]/20 rounded-bl-full blur-2xl pointer-events-none"></div>
                            <h3 className="font-black text-xl text-white flex items-center gap-2 border-b border-white/10 pb-4"><Ticket size={24} className="text-[#E8622A]"/> Loca & Bistro Menüsü</h3>
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
                                    <button onClick={addService} className="bg-[#E8622A] text-white px-6 rounded-xl border-none cursor-pointer hover:bg-orange-500 transition-colors font-black text-xs uppercase tracking-widest">Ekle</button>
                                </div>
                                <div className="mt-2 text-right"><button onClick={saveProfile} className="bg-[#00c48c] text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest border-none cursor-pointer shadow-lg">Değişiklikleri Kaydet</button></div>
                            </div>
                            <div className="mt-4 flex flex-col gap-3 relative z-10 overflow-y-auto max-h-[300px] scrollbar-hide pr-2">
                                {servicesForm.map((srv, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
                                        <div><p className="font-black text-sm uppercase text-white tracking-widest">{srv.name}</p><p className="text-[10px] font-bold text-[#E8622A] uppercase tracking-widest mt-1">Kapasite: {srv.capacity || 10} Adet</p></div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-black text-lg text-[#F5C5A3]">{!srv.price || srv.price === '0' ? 'ÜCRETSİZ' : `${srv.price} TL`}</span>
                                            <button onClick={() => deleteService(idx)} className="text-white/30 hover:text-red-400 bg-transparent border-none cursor-pointer"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                ))}
                                {servicesForm.length === 0 && <div className="text-center py-10 text-white/30 font-bold uppercase text-xs tracking-widest">Loca menüsü boş.</div>}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-lg text-[#2D1B4E]">
                               {isVet ? 'Aşı ve Tedavi Menüsü' : (isCarWash ? 'Yıkama Paketleri' : 'Hizmetler Menüsü')}
                            </h3>
                            <button onClick={saveProfile} className="bg-[#00c48c] text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest border-none cursor-pointer shadow-lg hover:scale-105 transition-transform">Değişiklikleri Kaydet</button>
                        </div>
                        <div className="space-y-4">
                          {servicesForm.map((srv, idx) => (
                            <div key={idx} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                              <div>
                                <p className="font-black text-sm uppercase">{srv.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1"><Clock size={12}/> Süre: {srv.duration || '30'} Dakika</p>
                              </div>
                              <div className="flex items-center gap-6">
                                <span className="font-black text-lg text-[#E8622A]">{srv.price} TL</span>
                                <button onClick={() => deleteService(idx)} className="p-2 text-slate-300 hover:text-red-500 bg-white rounded-lg shadow-sm border-none cursor-pointer"><Trash2 size={16}/></button>
                              </div>
                            </div>
                          ))}
                          {servicesForm.length === 0 && <div className="text-center py-10 text-slate-400 font-bold uppercase tracking-widest">Henüz bir hizmet eklemediniz.</div>}
                        </div>
                      </div>

                      <div className="bg-[#2D1B4E] rounded-[32px] shadow-sm p-8 text-white h-fit">
                        <h3 className="font-black text-lg mb-6">
                          {isVet ? 'Yeni Aşı/Tedavi Ekle' : (isCarWash ? 'Yeni Paket Ekle' : 'Yeni Hizmet Ekle')}
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-2">
                               {isVet ? 'Aşı / Tedavi Adı' : (isCarWash ? 'Paket Adı' : 'Hizmet Adı')}
                            </label>
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
                            <Plus size={16} className="inline mr-2 mb-1"/> Listeye Ekle
                          </button>
                        </div>
                      </div>
                    </div>
                )}
              </div>
          )}

          {/* TAB 4: PERSONEL YÖNETİMİ */}
          {userRole === 'owner' && activeTab === 'staff' && !isClub && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tight">{isVet ? 'Hekim Yönetimi' : 'Personel Yönetimi'}</h2>
                    <button onClick={saveProfile} className="bg-[#00c48c] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 border-none cursor-pointer shadow-lg hover:scale-105 transition-transform"><Save size={16}/> Değişiklikleri Kaydet</button>
                </div>
                
                <div className={`p-4 rounded-2xl mb-6 text-sm font-bold border ${isPremium ? 'bg-yellow-50 border-yellow-100 text-yellow-600' : 'bg-orange-50 border-orange-100 text-[#E8622A]'}`}>
                  ℹ️ Sınırsız uzman ekleyebilirsiniz. Ancak "Panel İzni" vereceğiniz kişi sayısı {shop.package} paketinizde en fazla {maxStaffLogins}'dir. (Şu an kullanan: {currentStaffLogins}/{maxStaffLogins})
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
                    <h3 className="font-black text-lg mb-6 text-[#2D1B4E]">Ekibiniz</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {staffForm.map((stf, idx) => (
                        <div key={idx} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 flex-wrap gap-2">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#2D1B4E] text-white rounded-full flex items-center justify-center font-black text-lg">{stf.name[0]}</div>
                            <div>
                              <p className="font-black text-sm uppercase">{stf.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stf.role || 'Uzman'} • Şifre: {stf.password}</p>
                              <div className={`mt-2 inline-block px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${stf.has_login || (stf.password && stf.has_login !== false) ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                                {stf.has_login || (stf.password && stf.has_login !== false) ? '✅ Panel İzni Var' : '❌ Sadece Randevu'}
                              </div>
                            </div>
                          </div>
                          <button onClick={() => deleteStaff(idx)} className="p-2 text-slate-300 hover:text-red-500 bg-white rounded-lg shadow-sm border-none cursor-pointer"><Trash2 size={16}/></button>
                        </div>
                      ))}
                      {staffForm.length === 0 && <div className="col-span-full text-center py-10 text-slate-400 font-bold uppercase tracking-widest">Kayıtlı uzman yok.</div>}
                    </div>
                  </div>

                  <div className="bg-[#2D1B4E] rounded-[32px] shadow-sm p-8 text-white h-fit">
                    <h3 className="font-black text-lg mb-6 flex items-center gap-2"><Shield size={20} className="text-[#E8622A]"/> Yeni Ekle</h3>
                    <div className="space-y-4">
                      <div><label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-2">İsim Soyisim</label><input type="text" value={newStaff.name} onChange={e=>setNewStaff({...newStaff, name: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white outline-none focus:border-[#E8622A]"/></div>
                      <div><label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-2">Uzmanlık Alanı</label><input type="text" value={newStaff.role} onChange={e=>setNewStaff({...newStaff, role: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white outline-none focus:border-[#E8622A]"/></div>
                      <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                         <input type="checkbox" id="has_login" checked={newStaff.has_login} onChange={(e) => setNewStaff({...newStaff, has_login: e.target.checked})} className="w-4 h-4 cursor-pointer accent-[#E8622A]" />
                         <label htmlFor="has_login" className="text-xs font-bold cursor-pointer select-none">Panele Giriş İzni Ver</label>
                      </div>
                      {newStaff.has_login && (
                        <div><label className="text-[10px] font-bold uppercase tracking-widest text-white/50 block mb-2">Giriş Şifresi (Örn: 1234)</label><input type="text" value={newStaff.password} onChange={e=>setNewStaff({...newStaff, password: e.target.value})} className="w-full bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold text-white outline-none focus:border-[#E8622A]"/></div>
                      )}
                      <button onClick={addStaff} className="w-full bg-[#E8622A] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest border-none cursor-pointer hover:scale-[1.02] transition-transform shadow-lg"><UserPlus size={16} className="inline mr-2 mb-1"/> Ekibe Kat</button>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* TAB 5: MÜŞTERİLER VE GEÇMİŞ RANDEVULAR (MODÜL 3 CRM EKRANI EKLENDİ) */}
          {userRole === 'owner' && activeTab === 'clients' && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight">
                       {isVet ? 'Hasta & Sahip Portföyü' : (isCarWash ? 'Araçlar & Müşteriler' : 'Müşteri Rehberi & CRM')}
                    </h2>
                    <input type="text" placeholder="İsim veya Telefon Ara..." value={customerSearch} onChange={e=>setCustomerSearch(e.target.value)} className="w-full md:w-64 bg-white border border-slate-200 rounded-xl py-3 px-4 font-bold text-sm outline-none focus:border-[#E8622A] shadow-sm"/>
                  </div>
                  
                  <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden w-full">
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-50">
                            <tr className="text-[10px] font-black uppercase text-slate-400">
                              <th className="px-8 py-5 border-b border-slate-100">Müşteri Bilgisi</th>
                              <th className="px-8 py-5 border-b border-slate-100">İletişim</th>
                              <th className="px-8 py-5 border-b border-slate-100 text-center">Son Randevu</th>
                              <th className="px-8 py-5 border-b border-slate-100 text-right">Aksiyon</th>
                            </tr>
                          </thead>
                          <tbody>
                              {filteredCustomers.map((cust, idx) => (
                                  <tr key={idx} className="border-t border-slate-50 hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-5">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center font-black text-sm shrink-0">{cust.customer_name[0]}</div>
                                        <span className="font-bold text-sm uppercase text-[#2D1B4E]">{cust.customer_name} {cust.customer_surname}</span>
                                      </div>
                                    </td>
                                    <td className="px-8 py-5">
                                      <span className="text-xs text-slate-500 font-bold">{cust.customer_phone}</span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                      <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-md">{cust.appointment_date}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                      {/* PROFİLİ İNCELE BUTONU BURADA */}
                                      <button onClick={() => openClientModal(cust)} className="bg-white border border-slate-200 hover:border-[#E8622A] hover:text-[#E8622A] text-slate-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all shadow-sm">
                                        Profili İncele
                                      </button>
                                    </td>
                                  </tr>
                              ))}
                              {filteredCustomers.length === 0 && <tr><td colSpan="4" className="text-center p-10 text-slate-400 font-bold uppercase tracking-widest">Kayıt bulunamadı.</td></tr>}
                          </tbody>
                        </table>
                      </div>
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
                      <div className="flex items-center gap-1 mb-3">{[...Array(5)].map((_, i) => (<span key={i} className={i < rev.rating ? "text-yellow-400" : "text-slate-200"}>★</span>))}</div>
                      <p className="text-sm font-medium text-slate-600 mb-4">"{rev.comment}"</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{rev.customer_name} • {new Date(rev.created_at).toLocaleDateString('tr-TR')}</p>
                    </div>
                  ))}
                  {reviews.length === 0 && <div className="col-span-full text-center py-20 text-slate-400 font-bold uppercase tracking-widest">Henüz yorum yapılmamış.</div>}
                </div>
              </div>
          )}

          {/* TAB 7: GELİŞMİŞ RAPORLAR (KİLİTLİ ALAN) */}
          {userRole === 'owner' && activeTab === 'reports' && (
            <div className="animate-in fade-in">
              <h2 className="text-2xl font-black text-[#2D1B4E] uppercase mb-6 border-b border-slate-200 pb-4">Gelişmiş Raporlar</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Toplam İşlem</p>
                  <p className="text-4xl font-black text-[#2D1B4E]">{appointments.length}</p>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Tahmini Ciro (TL)</p>
                  <p className={`text-3xl font-black ${isPremium ? 'text-green-500' : 'text-[#E8622A]'}`}>{isPremium ? (appointments.length * 250).toLocaleString('tr-TR') : 'Kilitli'}</p>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Müşteri Sadakati</p>
                  <p className={`text-3xl font-black ${isPremium ? 'text-indigo-500' : 'text-[#E8622A]'}`}>{isPremium ? '%78' : 'Kilitli'}</p>
                </div>
              </div>

              {!isPremium ? (
                <div className="relative">
                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm min-h-[300px] opacity-30 filter blur-sm"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center p-6">
                    <div className="w-20 h-20 bg-[#2D1B4E] text-white rounded-full flex items-center justify-center mb-4 shadow-xl"><Lock size={32}/></div>
                    <h3 className="text-2xl font-black text-[#2D1B4E] uppercase tracking-tight mb-2">Detaylı Raporlar Kilitli</h3>
                    <p className="text-slate-600 font-bold text-sm max-w-md mb-6">Personel bazlı gelir analizi, müşteri sadakat oranları ve gelişmiş finansal tablolar sadece Premium Pakette mevcuttur.</p>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all hover:scale-105 border-none cursor-pointer">Paketimi Yükselt</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {!isClub && (
                    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                      <h3 className="font-black text-[#2D1B4E] uppercase mb-6 flex items-center gap-2"><Users className="text-[#E8622A]"/> Uzman Performansı</h3>
                      <div className="space-y-4">
                        {staffPerformance.map((staff, i) => (
                          <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                              <span className="font-bold text-sm uppercase">{staff.name}</span><span className="font-black text-[#E8622A]">{staff.monthly} İşlem (Bu Ay)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <h3 className="font-black text-[#2D1B4E] uppercase mb-6 flex items-center gap-2"><Scissors className="text-[#E8622A]"/> Popüler Tercihler</h3>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="font-bold text-sm uppercase">{servicesForm[0]?.name || 'Hizmet 1'}</span><span className="font-black text-[#E8622A]">%45 Tercih</span>
                       </div>
                       <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="font-bold text-sm uppercase">{servicesForm[1]?.name || 'Hizmet 2'}</span><span className="font-black text-[#E8622A]">%30 Tercih</span>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: YENİ MODÜLER CRM & PAZARLAMA */}
          {userRole === 'owner' && activeTab === 'marketing' && (
            <div className="animate-in fade-in flex flex-col min-h-[70vh]">
              <h2 className="text-2xl font-black text-[#2D1B4E] uppercase mb-6 tracking-tight">Akıllı CRM & Pazarlama</h2>
              
              {!isPremium ? (
                // PREMİUM DEĞİLSE KİLİTLİ GÖRÜNÜM
                <div className="flex-1 bg-white rounded-[32px] border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center p-12">
                    <div className="w-24 h-24 bg-[#2D1B4E] text-white rounded-full flex items-center justify-center mb-6 shadow-xl"><Lock size={40}/></div>
                    <h3 className="text-3xl font-black text-[#2D1B4E] uppercase tracking-tight mb-4">Müşteri İlişkileri (CRM) Kilitli</h3>
                    <p className="text-slate-500 font-bold text-base max-w-2xl mb-8 leading-relaxed">
                      Gerçek bir CRM deneyimi yaşayın. Kendi müşteri kitlelerinizi (segment) yaratın, onlara özel e-posta şablonları tasarlayın ve hedefli kampanyalarla gelirinizi katlayın. Sadece Premium pakette.
                    </p>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-105 border-none cursor-pointer">
                      Premium'a Yükselt
                    </button>
                </div>
              ) : (
                // PREMİUM KULLANICI İÇİN MODÜLER YAPI
                <div className="flex-1 flex flex-col bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                  
                  {/* Üst Sekmeler (Sub-Navigation) */}
                  <div className="flex items-center gap-2 p-4 bg-slate-50 border-b border-slate-100 overflow-x-auto shrink-0">
                    <button onClick={() => setCrmTab('dashboard')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest border-none cursor-pointer transition-all shrink-0 ${crmTab === 'dashboard' ? 'bg-[#2D1B4E] text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-200'}`}>
                      <PieChart size={16}/> Özet Analiz
                    </button>
                    <button onClick={() => setCrmTab('segments')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest border-none cursor-pointer transition-all shrink-0 ${crmTab === 'segments' ? 'bg-[#2D1B4E] text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-200'}`}>
                      <Filter size={16}/> Kitleler (Segmentler)
                    </button>
                    <button onClick={() => setCrmTab('templates')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest border-none cursor-pointer transition-all shrink-0 ${crmTab === 'templates' ? 'bg-[#2D1B4E] text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-200'}`}>
                      <FileCode2 size={16}/> E-Posta Şablonları
                    </button>
                    <button onClick={() => setCrmTab('campaigns')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest border-none cursor-pointer transition-all shrink-0 ${crmTab === 'campaigns' ? 'bg-[#2D1B4E] text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-200'}`}>
                      <Rocket size={16}/> Kampanyalar
                    </button>
                  </div>

                  {/* Alt İçerik Alanı */}
                  <div className="p-8 flex-1 overflow-y-auto">
                    
                    {/* 8.1 - ÖZET ANALİZ */}
                    {crmTab === 'dashboard' && (
                      <div className="animate-in fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Ulaşılabilir Müşteri</p>
                            <p className="text-4xl font-black text-[#2D1B4E]">1,248</p>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Son 30 Gün Gönderim</p>
                            <p className="text-4xl font-black text-blue-500">4,500</p>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Ortalama Açılma Oranı</p>
                            <p className="text-4xl font-black text-green-500">%68.4</p>
                          </div>
                        </div>

                        <h3 className="font-black text-lg text-[#2D1B4E] uppercase mb-4 border-b border-slate-100 pb-2">Son Kampanya Performansları</h3>
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400">Kampanya Adı</th>
                              <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 text-center">Gönderilen</th>
                              <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 text-center">Açılma</th>
                              <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-400 text-center">Dönüşüm (Tıklama)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-slate-50 hover:bg-slate-50">
                              <td className="px-4 py-4 font-bold text-sm text-[#2D1B4E]">Bayram Özel İndirimi</td>
                              <td className="px-4 py-4 text-center font-black text-slate-500">1,200</td>
                              <td className="px-4 py-4 text-center font-black text-blue-500">%72 (864)</td>
                              <td className="px-4 py-4 text-center font-black text-green-500">%14 (120 Kayıt)</td>
                            </tr>
                            <tr className="border-b border-slate-50 hover:bg-slate-50">
                              <td className="px-4 py-4 font-bold text-sm text-[#2D1B4E]">Kendini Özlettin (Gelmeyenler)</td>
                              <td className="px-4 py-4 text-center font-black text-slate-500">340</td>
                              <td className="px-4 py-4 text-center font-black text-blue-500">%55 (187)</td>
                              <td className="px-4 py-4 text-center font-black text-green-500">%5 (17 Kayıt)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* 8.2 - KİTLELER (SEGMENTS) */}
                    {crmTab === 'segments' && (
                      <div className="animate-in fade-in h-full flex flex-col">
                        {!showSegmentBuilder ? (
                          <>
                            <div className="flex justify-between items-center mb-8">
                              <div>
                                <h3 className="text-xl font-black text-[#2D1B4E]">Kayıtlı Kitleler</h3>
                                <p className="text-xs font-bold text-slate-400 mt-1">Kampanyalarınızda kullanmak üzere dinamik kitleler oluşturun.</p>
                              </div>
                              <button onClick={() => setShowSegmentBuilder(true)} className="bg-[#E8622A] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest border-none cursor-pointer flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
                                <Plus size={16}/> Yeni Kitle Yarat
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Örnek Kayıtlı Segmentler */}
                              <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                  <h4 className="font-black text-[#2D1B4E] uppercase text-sm">Son 1 Aydır Gelmeyenler</h4>
                                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">340 Kişi</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded font-bold">Son Ziyaret {'>'} 30 Gün</span>
                                  <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded font-bold">Toplam Ziyaret {'>'} 1</span>
                                </div>
                                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                                  <button className="bg-transparent border border-slate-200 text-slate-500 px-4 py-2 rounded-lg text-[10px] font-black uppercase cursor-pointer hover:bg-slate-50">Düzenle</button>
                                  <button className="bg-[#2D1B4E] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase cursor-pointer hover:bg-[#1a0f2e]">Kampanya Başlat</button>
                                </div>
                              </div>
                              <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                  <h4 className="font-black text-[#2D1B4E] uppercase text-sm">VIP Müşteriler (Çok Harcayanlar)</h4>
                                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">85 Kişi</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded font-bold">Toplam Ciro {'>'} 5000 TL</span>
                                </div>
                                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                                  <button className="bg-transparent border border-slate-200 text-slate-500 px-4 py-2 rounded-lg text-[10px] font-black uppercase cursor-pointer hover:bg-slate-50">Düzenle</button>
                                  <button className="bg-[#2D1B4E] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase cursor-pointer hover:bg-[#1a0f2e]">Kampanya Başlat</button>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          // SEGMENT BUILDER EKRANI (Mockup)
                          <div className="animate-in fade-in flex-1">
                            <button onClick={() => setShowSegmentBuilder(false)} className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2 bg-transparent border-none cursor-pointer hover:text-[#2D1B4E]">
                              ← Kitlelere Dön
                            </button>
                            <h3 className="text-xl font-black text-[#2D1B4E] mb-6">Yeni Kitle (Segment) Oluşturucu</h3>
                            
                            <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-8 mb-6">
                              <input type="text" placeholder="Kitle Adı (Örn: Sadece Saç Kesimi Yaptıranlar)" className="w-full bg-white border border-slate-200 rounded-xl py-4 px-4 font-black text-sm outline-none focus:border-[#E8622A] mb-6"/>
                              
                              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Filtreleme Kuralları</h4>
                              
                              {/* Kural 1 */}
                              <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 mb-3 shadow-sm">
                                <span className="bg-[#2D1B4E] text-white text-[10px] font-black px-2 py-1 rounded uppercase">Eğer</span>
                                <select className="bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 text-xs font-bold outline-none cursor-pointer">
                                  <option>Son Ziyaret Tarihi</option>
                                  <option>Toplam Ziyaret Sayısı</option>
                                  <option>Aldığı Hizmet</option>
                                  <option>Hizmet Aldığı Personel</option>
                                </select>
                                <select className="bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 text-xs font-bold outline-none cursor-pointer">
                                  <option>Şundan daha eski:</option>
                                  <option>Şundan daha yeni:</option>
                                  <option>Eşittir</option>
                                </select>
                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg py-2 px-3">
                                  <input type="number" placeholder="30" className="w-16 bg-transparent border-none text-xs font-bold outline-none text-center"/>
                                  <span className="text-xs font-bold text-slate-500">Gün</span>
                                </div>
                                <button className="ml-auto text-slate-300 hover:text-red-500 bg-transparent border-none cursor-pointer"><Trash2 size={16}/></button>
                              </div>

                              {/* Kural 2 */}
                              <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 mb-4 shadow-sm relative">
                                <div className="absolute -top-4 left-6 bg-slate-200 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded uppercase">VE (AND)</div>
                                <span className="bg-[#2D1B4E] text-white text-[10px] font-black px-2 py-1 rounded uppercase">Eğer</span>
                                <select className="bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 text-xs font-bold outline-none cursor-pointer">
                                  <option>Aldığı Hizmet</option>
                                  <option>Son Ziyaret Tarihi</option>
                                </select>
                                <select className="bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 text-xs font-bold outline-none cursor-pointer">
                                  <option>Şunu İçerir:</option>
                                  <option>Eşittir</option>
                                </select>
                                <select className="bg-slate-50 border border-slate-100 rounded-lg py-2 px-3 text-xs font-bold outline-none cursor-pointer">
                                  <option>Manikür</option>
                                  <option>Saç Kesimi</option>
                                  <option>Masaj</option>
                                </select>
                                <button className="ml-auto text-slate-300 hover:text-red-500 bg-transparent border-none cursor-pointer"><Trash2 size={16}/></button>
                              </div>

                              <button className="bg-white border-2 border-dashed border-slate-300 text-slate-500 hover:border-[#E8622A] hover:text-[#E8622A] w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest cursor-pointer transition-colors">
                                + Kural Ekle
                              </button>
                            </div>

                            <div className="flex items-center justify-between bg-purple-50 p-6 rounded-[24px] border border-purple-100">
                              <div>
                                <p className="text-[10px] font-black uppercase text-purple-400 tracking-widest mb-1">Eşleşen Müşteri Sayısı</p>
                                <p className="text-3xl font-black text-[#2D1B4E]">340</p>
                              </div>
                              <button onClick={() => setShowSegmentBuilder(false)} className="bg-[#00c48c] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest border-none cursor-pointer shadow-lg hover:scale-105 transition-transform">
                                Kitleyi Kaydet
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 8.3 - ŞABLONLAR (TEMPLATES) */}
                    {crmTab === 'templates' && (
                      <div className="animate-in fade-in h-full flex flex-col items-center justify-center text-slate-400">
                         <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-200"><FileCode2 size={40}/></div>
                         <h3 className="text-2xl font-black text-[#2D1B4E] uppercase tracking-tight mb-2">E-Posta Tasarım Stüdyosu</h3>
                         <p className="max-w-md text-center font-bold text-sm">Burada sürükle bırak mantığıyla kendi e-posta şablonlarınızı yaratacaksınız. Tasarım modülü arka planda geliştiriliyor.</p>
                      </div>
                    )}

                    {/* 8.4 - KAMPANYALAR (CAMPAIGNS) */}
                    {crmTab === 'campaigns' && (
                      <div className="animate-in fade-in h-full flex flex-col">
                         <div className="flex justify-between items-center mb-8">
                              <div>
                                <h3 className="text-xl font-black text-[#2D1B4E]">Aktif Kampanyalarınız</h3>
                                <p className="text-xs font-bold text-slate-400 mt-1">Önceden kaydettiğiniz bir "Kitleyi" ve "Şablonu" seçip gönderimi başlatın.</p>
                              </div>
                              <button className="bg-[#E8622A] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest border-none cursor-pointer flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
                                <Rocket size={16}/> Yeni Fırlat
                              </button>
                         </div>

                         {/* Kampanya Yaratma Formu (Örnek Açık) */}
                         <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-8 mb-8">
                            <h4 className="font-black uppercase text-[#2D1B4E] text-sm mb-6 flex items-center gap-2"><Rocket className="text-[#E8622A]"/> Kampanya Fırlatma Rampası</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Kime Gidecek? (Kitle Seç)</label>
                                <select className="w-full bg-white border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A] cursor-pointer">
                                  <option>Kitle Seçin...</option>
                                  <option>Son 1 Aydır Gelmeyenler (340 Kişi)</option>
                                  <option>VIP Müşteriler (85 Kişi)</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Ne Gidecek? (Şablon Seç)</label>
                                <select className="w-full bg-white border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A] cursor-pointer">
                                  <option>Şablon Seçin...</option>
                                  <option>Kendini Özlettin - %15 İndirim</option>
                                  <option>VIP'lere Özel Davet</option>
                                </select>
                              </div>
                            </div>
                            
                            <div className="flex justify-end border-t border-slate-200 pt-6">
                              <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest border-none cursor-pointer flex items-center gap-2 shadow-lg transition-transform">
                                Gönderimi Başlat <ArrowRight size={18}/>
                              </button>
                            </div>
                         </div>
                      </div>
                    )}

                  </div>

                </div>
              )}
            </div>
          )}

          {/* TAB 9: VİTRİN AYARLARI */}
          {userRole === 'owner' && activeTab === 'settings' && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Vitrin & Profil Ayarları</h2>
                  <button onClick={saveProfile} className="bg-[#00c48c] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border-none cursor-pointer shadow-lg hover:scale-105 transition-transform"><Save size={18}/> Değişiklikleri Kaydet</button>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
                      <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-[#2D1B4E]"><Store size={20} className="text-[#E8622A]"/> Temel Bilgiler</h3>
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Profil Fotoğrafı / Logo</label>
                          <div className="flex items-center gap-4">
                            {profileForm.logo_url ? <img src={profileForm.logo_url} className="w-20 h-20 rounded-xl object-cover shadow-sm border border-slate-200 shrink-0"/> : <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center shrink-0 text-slate-300"><ImageIcon size={24}/></div>}
                            <label className="bg-[#2D1B4E] hover:bg-[#1a0f2e] text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors shadow-md">
                              {isUploading ? <Loader2 className="animate-spin" size={16}/> : <UploadCloud size={16}/>} <span>Cihazdan Yükle</span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e, 'logo')} disabled={isUploading}/>
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">İşletme Açıklaması</label>
                          <textarea value={profileForm.description} onChange={e=>setProfileForm({...profileForm, description: e.target.value})} rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:border-[#E8622A] resize-none"></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 flex items-center gap-1"><Phone size={14}/> Telefon</label><input type="text" value={profileForm.contact_phone} onChange={e=>setProfileForm({...profileForm, contact_phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-[#E8622A]"/></div>
                          <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 flex items-center gap-1"><Mail size={14}/> E-Posta</label><input type="email" value={profileForm.contact_email} onChange={e=>setProfileForm({...profileForm, contact_email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-[#E8622A]"/></div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
                      <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-[#2D1B4E]">Sosyal Medya Bağlantıları</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4"><div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-xl flex items-center justify-center shrink-0"><InstagramIcon size={20}/></div><input type="text" value={profileForm.socials.instagram} onChange={e=>updateSocial('instagram', e.target.value)} placeholder="Instagram Linki" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:border-pink-400"/></div>
                        <div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0"><FacebookIcon size={20}/></div><input type="text" value={profileForm.socials.facebook} onChange={e=>updateSocial('facebook', e.target.value)} placeholder="Facebook Linki" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:border-blue-400"/></div>
                        <div className="p-4 bg-green-50 border border-green-100 rounded-2xl">
                          <label className="text-[10px] font-black uppercase tracking-widest text-green-600 block mb-2 flex items-center gap-1"><MessageCircle size={12}/> WhatsApp İletişim Linki</label>
                          <input type="url" value={profileForm.socials.whatsapp} onChange={e=>updateSocial('whatsapp', e.target.value)} placeholder="https://wa.me/905xxxxxxxxx" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 font-bold text-sm outline-none focus:border-green-500" />
                          <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Müşterilerinizin size tek tıkla ulaşması için tam link giriniz.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
                      <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-[#2D1B4E]"><Clock size={20} className="text-[#E8622A]"/> Çalışma Saatleri</h3>
                      <div className="space-y-3">
                        {profileForm.working_hours.map((dayObj, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className={`w-24 font-black text-xs uppercase ${dayObj.isClosed ? 'text-slate-300 line-through' : 'text-slate-700'}`}>{dayObj.day}</span>
                            {!dayObj.isClosed ? (
                              <div className="flex items-center gap-2"><input type="time" value={dayObj.open} onChange={e => updateWorkingHour(index, 'open', e.target.value)} className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold outline-none"/><span className="text-slate-300">-</span><input type="time" value={dayObj.close} onChange={e => updateWorkingHour(index, 'close', e.target.value)} className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold outline-none"/></div>
                            ) : ( <span className="text-xs font-black uppercase text-red-400 bg-red-50 px-3 py-1 rounded-md">Kapalı</span> )}
                            <button onClick={() => updateWorkingHour(index, 'isClosed', !dayObj.isClosed)} className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors ${dayObj.isClosed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{dayObj.isClosed ? 'Aç' : 'Kapat'}</button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 pt-8 border-t border-slate-100">
                        <h4 className="font-black text-sm mb-4 text-[#2D1B4E] flex items-center gap-2"><CalendarOff size={16} className="text-red-500"/> Özel Kapalı Günler (Tatiller)</h4>
                        <div className="flex gap-2 mb-4">
                          <input type="date" value={newClosedDate} onChange={e=>setNewClosedDate(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm font-bold outline-none focus:border-[#E8622A]" min={today}/>
                          <button onClick={addClosedDate} className="bg-red-500 text-white px-4 rounded-xl font-black text-[10px] uppercase border-none cursor-pointer hover:bg-red-600 transition-colors">Tarihi Kapat</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profileForm.closed_dates.map(date => (
                            <span key={date} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">{date} <button onClick={()=>removeClosedDate(date)} className="bg-transparent border-none cursor-pointer text-red-400 hover:text-red-600 p-0 m-0 leading-none"><XCircle size={14}/></button></span>
                          ))}
                          {profileForm.closed_dates.length === 0 && <span className="text-xs font-bold text-slate-400">Eklenmiş tatil günü yok.</span>}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8">
                      <h3 className="font-black text-lg mb-6 flex items-center justify-between text-[#2D1B4E]">
                        <span className="flex items-center gap-2"><Camera size={20} className="text-[#E8622A]"/> Fotoğraf Galerisi</span>
                        <label className="bg-[#2D1B4E] hover:bg-[#1a0f2e] text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors shadow-md">
                          {isUploading ? <Loader2 className="animate-spin" size={14}/> : <UploadCloud size={14}/>} <span>Fotoğraf Seç</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadImage(e, 'gallery')} disabled={isUploading}/>
                        </label>
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                        {profileForm.gallery.map((imgUrl, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 shadow-sm bg-slate-100">
                            <img src={imgUrl} className="w-full h-full object-cover" alt="Galeri" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button onClick={() => removeGalleryImage(idx)} className="bg-red-500 text-white p-2 rounded-full border-none cursor-pointer hover:scale-110 transition-transform"><Trash2 size={16}/></button>
                            </div>
                          </div>
                        ))}
                        {profileForm.gallery.length === 0 && <div className="col-span-full text-center py-10 text-slate-400 font-bold uppercase text-xs tracking-widest border-2 border-dashed border-slate-100 rounded-2xl">Galeri Boş</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}

        </div>
      </main>

      {/* --- MÜŞTERİ DETAY (MODÜL 3) MODALI --- */}
      {showClientModal && selectedClient && (
        <div className="fixed inset-0 bg-[#2D1B4E]/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-[#F8F9FA] w-full max-w-5xl h-[85vh] rounded-[32px] relative animate-in zoom-in-95 shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">
                  {selectedClient.name[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase text-[#2D1B4E] flex items-center gap-2">
                    {selectedClient.name} {selectedClient.surname} 
                    {selectedClient.points > 100 && <span className="bg-yellow-100 text-yellow-600 text-[10px] px-2 py-1 rounded-lg flex items-center gap-1"><Award size={12}/> VIP</span>}
                  </h2>
                  <p className="text-xs font-bold text-slate-500 mt-1">{selectedClient.phone} • {selectedClient.email}</p>
                </div>
              </div>
              <button onClick={() => setShowClientModal(false)} className="text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 p-2 rounded-xl transition-colors cursor-pointer border-none"><XCircle size={24}/></button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
              
              {/* Sol Sütun (Sabit CRM Bilgileri) */}
              <div className="w-full lg:w-80 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto shrink-0">
                {/* Bookcy Puan (Sadakat) */}
                <div className="bg-gradient-to-br from-[#2D1B4E] to-[#4c2d85] p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
                   <Award className="absolute -right-4 -bottom-4 opacity-10 text-white" size={100}/>
                   <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-1">Kullanılabilir Sadakat Puanı</p>
                   <p className="text-4xl font-black">{selectedClient.points}</p>
                   <p className="text-[9px] font-bold text-indigo-300 mt-2">Her işlemde puan kazanır.</p>
                </div>

                {/* Sağlık & Alerji Notları */}
                <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex flex-col gap-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1">
                     <AlertOctagon size={14}/> Kritik / Alerji Notları
                   </label>
                   <textarea 
                     placeholder="Örn: Hassas cilt, boya alerjisi var, vb." 
                     className="w-full bg-white border border-red-100 rounded-xl p-3 text-xs font-bold text-red-700 outline-none focus:border-red-300 resize-none h-24 placeholder:text-red-300"
                     defaultValue={selectedClient.alerji_notu}
                   ></textarea>
                   <button className="bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase py-2 rounded-lg transition-colors border-none cursor-pointer">Notu Güncelle</button>
                </div>
              </div>

              {/* Sağ Sütun (Dinamik Sekmeler) */}
              <div className="flex-1 flex flex-col bg-[#F8F9FA] overflow-hidden">
                {/* Sub-Nav */}
                <div className="flex items-center gap-2 p-6 pb-0 border-b border-slate-200 shrink-0">
                  <button onClick={() => setClientDetailTab('history')} className={`pb-4 px-4 font-black text-xs uppercase tracking-widest border-b-4 transition-colors bg-transparent cursor-pointer ${clientDetailTab === 'history' ? 'border-[#E8622A] text-[#2D1B4E]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>
                     Geçmiş Randevular
                  </button>
                  <button onClick={() => setClientDetailTab('clinic')} className={`pb-4 px-4 font-black text-xs uppercase tracking-widest border-b-4 transition-colors bg-transparent cursor-pointer ${clientDetailTab === 'clinic' ? 'border-[#E8622A] text-[#2D1B4E]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>
                     <Activity size={14} className="inline mr-1 mb-0.5"/> Klinik & Ölçüm Tablosu
                  </button>
                  <button onClick={() => setClientDetailTab('packages')} className={`pb-4 px-4 font-black text-xs uppercase tracking-widest border-b-4 transition-colors bg-transparent cursor-pointer ${clientDetailTab === 'packages' ? 'border-[#E8622A] text-[#2D1B4E]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>
                     Paketleri
                  </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  
                  {clientDetailTab === 'history' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Tarih</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">İşlem & Uzman</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Durum</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedClient.history.length > 0 ? selectedClient.history.map(app => (
                            <tr key={app.id} className="border-t border-slate-50">
                              <td className="px-6 py-4 font-bold text-sm text-[#2D1B4E]">{app.appointment_date} <br/><span className="text-xs text-slate-400">{app.appointment_time}</span></td>
                              <td className="px-6 py-4 font-bold text-sm text-slate-600">{app.service_name} <br/><span className="text-xs text-[#E8622A]">{app.staff_name}</span></td>
                              <td className="px-6 py-4 text-center">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${app.status === 'Tamamlandı' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>{app.status || 'Bekliyor'}</span>
                              </td>
                            </tr>
                          )) : <tr><td colSpan="3" className="p-8 text-center text-slate-400 font-bold text-xs uppercase">Geçmiş randevu yok.</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {clientDetailTab === 'clinic' && (
                    <div className="animate-in fade-in">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
                        <h4 className="font-black text-sm uppercase text-[#2D1B4E] mb-4 flex items-center gap-2"><Plus size={16} className="text-[#E8622A]"/> Yeni Seans / Ölçüm Ekle</h4>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                           <div><label className="text-[10px] font-bold text-slate-400 uppercase">Tarih</label><input type="date" defaultValue={today} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-bold mt-1 outline-none"/></div>
                           <div><label className="text-[10px] font-bold text-slate-400 uppercase">Kilo (Kg) / Bel Ölçüsü</label><input type="text" placeholder="Örn: 65 kg" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-bold mt-1 outline-none"/></div>
                           <div><label className="text-[10px] font-bold text-slate-400 uppercase">İşlem Detayı (Lazer Atışı vb.)</label><input type="text" placeholder="Örn: 18 Joule, hassasiyet yok" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-bold mt-1 outline-none"/></div>
                        </div>
                        <button className="bg-[#E8622A] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-none cursor-pointer">Tabloya Kaydet</button>
                      </div>

                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-50">
                            <tr>
                              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Seans Tarihi</th>
                              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Fiziksel Ölçüm</th>
                              <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Uzman Notu / Atış</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedClient.measurements.map((m, idx) => (
                              <tr key={idx} className="border-t border-slate-50">
                                <td className="px-6 py-4 font-black text-sm text-[#2D1B4E]">{m.date}</td>
                                <td className="px-6 py-4 font-bold text-sm text-slate-600">Kilo: {m.weight} | Bel: {m.waist}</td>
                                <td className="px-6 py-4 text-xs font-medium text-slate-500 italic">"{m.notes}"</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {clientDetailTab === 'packages' && (
                    <div className="animate-in fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedClient.packages.map((pkg, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                           <div className="flex justify-between items-start mb-4">
                             <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center"><Layers size={20}/></div>
                             <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Aktif Paket</span>
                           </div>
                           <h4 className="font-black text-base text-[#2D1B4E] uppercase tracking-tight mb-4">{pkg.name}</h4>
                           
                           <div className="mb-2 flex justify-between text-xs font-bold text-slate-500 uppercase">
                             <span>Kullanılan: {pkg.used}</span>
                             <span>Toplam: {pkg.total} Seans</span>
                           </div>
                           <div className="w-full bg-slate-100 rounded-full h-3 mb-6 overflow-hidden relative">
                             <div className="bg-[#E8622A] h-3 rounded-full transition-all" style={{ width: `${(pkg.used / pkg.total)*100}%` }}></div>
                           </div>

                           <button className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest border border-indigo-100 cursor-pointer transition-colors flex items-center justify-center gap-2">
                             <CheckCircle2 size={16}/> 1 Seans Düş
                           </button>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODALLAR (ADİSYON & HIZLI RANDEVU) */}
      {showQuickAdd && (
        <div className="fixed inset-0 bg-[#2D1B4E]/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[500px] rounded-[32px] p-8 relative animate-in zoom-in-95 shadow-2xl">
            <button onClick={() => setShowQuickAdd(false)} className="absolute top-6 right-6 text-slate-400 hover:text-black border-none bg-transparent cursor-pointer"><XCircle size={28}/></button>
            <h2 className="text-2xl font-black uppercase text-[#2D1B4E] mb-8">Yeni Kayıt</h2>
            <form onSubmit={handleQuickAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Adı" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A]" value={quickForm.customer_name} onChange={e => setQuickForm({...quickForm, customer_name: e.target.value})} />
                <input required placeholder="Soyadı" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A]" value={quickForm.customer_surname} onChange={e => setQuickForm({...quickForm, customer_surname: e.target.value})} />
              </div>
              <input required placeholder="Telefon" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A]" value={quickForm.customer_phone} onChange={e => setQuickForm({...quickForm, customer_phone: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select required className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A] cursor-pointer" value={quickForm.service_name} onChange={e => setQuickForm({...quickForm, service_name: e.target.value})}>
                  <option value="">{isClub ? 'Seçim Yap' : 'Hizmet Seç'}</option>
                  {servicesForm.map((s,i) => <option key={i} value={s.name}>{s.name} ({s.price}TL)</option>)}
                </select>
                {!isClub && (
                  <select required className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A] cursor-pointer" value={quickForm.staff_name} onChange={e => setQuickForm({...quickForm, staff_name: e.target.value})}>
                    <option value="">Uzman Seç</option>
                    {staffForm.map((s,i) => <option key={i} value={s.name}>{s.name}</option>)}
                  </select>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required type="date" className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A] cursor-pointer" value={quickForm.appointment_date} onChange={e => setQuickForm({...quickForm, appointment_date: e.target.value})} />
                <select required className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A] cursor-pointer" value={quickForm.appointment_time} onChange={e => setQuickForm({...quickForm, appointment_time: e.target.value})}>
                  {allTimeSlots.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-[#E8622A] text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl border-none cursor-pointer mt-2 hover:scale-[1.02] transition-transform">Kaydet</button>
            </form>
          </div>
        </div>
      )}

      {/* YENİ ADİSYON MODALI */}
      {showAdisyonModal && (
        <div className="fixed inset-0 bg-[#2D1B4E]/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[500px] rounded-[32px] p-8 relative animate-in zoom-in-95 shadow-2xl">
            <button onClick={() => setShowAdisyonModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 border-none bg-transparent cursor-pointer"><XCircle size={28}/></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 mx-auto"><Wallet size={32}/></div>
              <h2 className="text-2xl font-black uppercase text-[#2D1B4E]">Adisyon Kes</h2>
            </div>
            <form onSubmit={handleAdisyonSubmit} className="space-y-4">
              <input required placeholder="Müşteri Adı Soyadı" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-emerald-500" value={adisyonForm.musteri_adi} onChange={e => setAdisyonForm({...adisyonForm, musteri_adi: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Toplam Tutar" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-black text-sm outline-none focus:border-emerald-500" value={adisyonForm.tutar} onChange={e => setAdisyonForm({...adisyonForm, tutar: e.target.value})} />
                <select required className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-emerald-500 cursor-pointer" value={adisyonForm.odeme_tipi} onChange={e => setAdisyonForm({...adisyonForm, odeme_tipi: e.target.value})}>
                  <option value="Kredi Kartı">Kredi Kartı</option>
                  <option value="Nakit">Nakit</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl border-none cursor-pointer">Adisyonu Tamamla</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}