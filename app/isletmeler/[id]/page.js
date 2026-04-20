"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Star, ChevronLeft, Calendar, Clock, Music, Scissors, UserCircle, Users, CalendarOff, CheckCircle2, Gem, Phone, Mail, Instagram, Globe } from 'lucide-react';
import { useAppContext } from '../../providers';
import { supabase } from '../../../lib/supabase';
import { getNewBookingShopTemplate, getBookingConfirmationTemplate } from '../../../lib/emailTemplates';
import TattooBriefForm from '../../../components/TattooBriefForm';

function parseDuration(d) { const m = (d||'').match(/\d+/); return m ? parseInt(m[0]) : 30; }
function getRequiredSlots(d) { return Math.ceil(parseDuration(d) / 30); }
const allTimeSlots = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30","00:00","00:30","01:00","01:30","02:00"];
const defaultWorkingHours = [{day:'Pazartesi',open:'09:00',close:'19:00',isClosed:false},{day:'Salı',open:'09:00',close:'19:00',isClosed:false},{day:'Çarşamba',open:'09:00',close:'19:00',isClosed:false},{day:'Perşembe',open:'09:00',close:'19:00',isClosed:false},{day:'Cuma',open:'09:00',close:'19:00',isClosed:false},{day:'Cumartesi',open:'09:00',close:'19:00',isClosed:false},{day:'Pazar',open:'09:00',close:'19:00',isClosed:true}];

export default function ShopDetail() {
  const params = useParams();
  const router = useRouter();
  const { lang = 'TR', t, shops } = useAppContext();
  
  const [selectedShop, setSelectedShop] = useState(null);
  const [profileTab, setProfileTab] = useState('');
  const [bookingPhase, setBookingPhase] = useState(1);
  const [appointments, setAppointments] = useState([]);
  const [closedSlots, setClosedSlots] = useState([]);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ q1: null, q2: null, q3: null, q4: null });
  const [formData, setFormData] = useState({ name: '', surname: '', phoneCode: '+90', phone: '', email: '' }); 
  const [bookingData, setBookingData] = useState({ date: new Date().toISOString().split('T')[0], time: '', selectedShopService: null, selectedStaff: null, selectedEvent: null });
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistTime, setWaitlistTime] = useState('');
  const [waitlistForm, setWaitlistForm] = useState({ name: '', phone: '', email: '' });
  const [waitlistStatus, setWaitlistStatus] = useState('idle'); 

  useEffect(() => {
    const fetchLoggedUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { user } = session;
        const { data: cust } = await supabase.from('customers').select('*').eq('id', user.id).single();
        const fullName = cust?.full_name || user.user_metadata?.full_name || '';
        const userEmail = cust?.email || user.email || '';
        const userPhone = cust?.phone || '';

        let firstName = ''; let lastName = '';
        if (fullName) {
          const parts = fullName.split(' ');
          if (parts.length > 1) { lastName = parts.pop(); firstName = parts.join(' '); } 
          else { firstName = fullName; }
        }
        setFormData(prev => ({...prev, name: firstName || prev.name, surname: lastName || prev.surname, email: userEmail || prev.email, phone: userPhone ? userPhone.replace('+90 ', '').replace('+90', '') : prev.phone }));
        setWaitlistForm(prev => ({...prev, name: fullName || prev.name, email: userEmail || prev.email, phone: userPhone ? userPhone.replace('+90 ', '').replace('+90', '') : prev.phone }));
      }
    };
    fetchLoggedUser();
  }, []);

  useEffect(() => {
    if (shops && shops.length > 0 && params?.id) {
      const shop = shops.find(s => String(s.id) === String(params.id));
      if (shop) {
        setSelectedShop(shop);
        // Kategoriye Göre Varsayılan Sekme Ayarlama
        if (['Dövme', 'Tattoo', 'Dövme Stüdyosu', 'Tattoo Studio'].includes(shop.category)) {
            setProfileTab('quote'); // Dövme ise formu aç
        } else if (shop.category === 'Bar & Club') {
            setProfileTab('events');
        } else {
            setProfileTab('services');
        }
      }
    }
  }, [shops, params?.id]);

  useEffect(() => { 
    if (selectedShop?.id && bookingData?.date) { 
      fetchAppointments(selectedShop.id, bookingData.date); 
      fetchClosedSlots(selectedShop.id, bookingData.date); 
    } 
  }, [selectedShop?.id, bookingData?.date]);

  async function fetchAppointments(shopId, date) { 
    const { data } = await supabase.from('appointments').select('*').eq('shop_id', shopId).eq('appointment_date', date); 
    if (data) setAppointments(data); 
  }
  async function fetchClosedSlots(shopId, date) { 
    const { data } = await supabase.from('closed_slots').select('*').eq('shop_id', shopId).eq('date', date); 
    if (data) setClosedSlots(data.map(item => item.slot)); 
  }

  if (!selectedShop || !t?.[lang] || !profileTab) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">Yükleniyor...</div>;

  const isClub = selectedShop?.category === 'Bar & Club';
  const isTattooShop = ['Dövme', 'Tattoo', 'Dövme Stüdyosu', 'Tattoo Studio'].includes(selectedShop?.category);
  const text = t[lang] || {};

  const handleBookingEmailChange = (e) => setFormData(prev => ({...prev, email: e.target.value}));
  const handleBookingPhoneChange = (e) => setFormData(prev => ({...prev, phone: e.target.value}));

  const getCurrentAvailableSlots = () => {
    if (!bookingData.date || isClub) return allTimeSlots;
    if (selectedShop?.closed_dates && String(selectedShop.closed_dates).includes(bookingData.date)) return [];
    const dayName = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][new Date(bookingData.date).getDay()];
    let workingHours = defaultWorkingHours;
    if (Array.isArray(selectedShop?.working_hours)) { workingHours = selectedShop.working_hours; } 
    else if (typeof selectedShop?.working_hours === 'string') { try { workingHours = JSON.parse(selectedShop.working_hours); } catch(e){} }
    const todayHours = workingHours.find(h => h?.day === dayName);
    if (todayHours && todayHours.isClosed) return []; 
    else if (todayHours?.open && todayHours?.close) return allTimeSlots.filter(slot => slot >= todayHours.open && slot < todayHours.close);
    return allTimeSlots;
  };

  const currentAvailableSlots = getCurrentAvailableSlots();
  const isShopClosedToday = currentAvailableSlots.length === 0;

  async function handleWaitlistSubmit(e) {
    e.preventDefault();
    setWaitlistStatus('loading');
    const { error } = await supabase.from('waitlist').insert([{ shop_id: selectedShop.id, service_name: bookingData?.selectedShopService?.name || 'Genel', wait_date: bookingData.date, wait_time: waitlistTime, customer_name: waitlistForm.name, customer_phone: waitlistForm.phone, customer_email: waitlistForm.email, status: 'waiting' }]);
    if (error) { setWaitlistStatus('idle'); alert("Hata oluştu."); } 
    else { setWaitlistStatus('success'); setTimeout(() => { setShowWaitlistModal(false); setWaitlistStatus('idle'); setWaitlistTime(''); }, 3000); }
  }

  async function handleBooking(e) {
    e.preventDefault();
    if(isClub) { if(!bookingData.selectedEvent) return alert("Etkinliği seçin."); if(!bookingData.selectedShopService) return alert("VIP türünü seçin."); } 
    else { if(!bookingData.selectedShopService) return alert("Hizmet seçin."); if(!bookingData.selectedStaff) return alert("Uzman seçin"); }

    const availableSlotsForBooking = getCurrentAvailableSlots();
    const startIndex = availableSlotsForBooking.indexOf(bookingData.time);
    const neededSlots = getRequiredSlots(bookingData.selectedShopService?.duration || '30');
    const occupied_slots = isClub ? [] : availableSlotsForBooking.slice(startIndex, startIndex + neededSlots);
    let assignedStaffName = isClub ? 'Rezervasyon' : (bookingData.selectedStaff?.name || 'Genel');
    
    if (!isClub && (assignedStaffName === "Fark Etmez" || assignedStaffName === 'Any Staff' || assignedStaffName === 'Любой')) {
        if (Array.isArray(selectedShop?.staff) && selectedShop.staff.length > 0) {
            const availableStaff = selectedShop.staff.find(staff => { return occupied_slots.every(checkSlot => { if (closedSlots.includes(checkSlot)) return false; return !appointments.some(a => a.staff_name === staff.name && (a.occupied_slots ? a.occupied_slots.includes(checkSlot) : a.appointment_time === checkSlot)); }); });
            assignedStaffName = availableStaff ? availableStaff.name : 'Genel';
        }
    }

    const fullPhone = formData.phoneCode + " " + formData.phone;
    const finalDate = isClub ? bookingData.selectedEvent?.date : bookingData.date;
    const finalTime = isClub ? bookingData.selectedEvent?.time : bookingData.time;

    const { error } = await supabase.from('appointments').insert([{ shop_id: selectedShop.id, customer_name: formData.name, customer_surname: formData.surname, customer_phone: fullPhone, customer_email: formData.email, appointment_date: finalDate, appointment_time: finalTime, service_name: bookingData.selectedShopService?.name || 'Genel', staff_name: assignedStaffName, occupied_slots: occupied_slots, status: 'Bekliyor' }]);
    
    if (!error) { setBookingPhase('success'); window.scrollTo(0,0); } else { alert("Rezervasyon alınırken bir hata oluştu!"); }
  }

  if (bookingPhase === 'success') {
      // (Burası onay ekranı kodların aynı)
      return ( <div className="w-full bg-[#FAF7F2] min-h-screen pt-10"><div className="text-center py-20"><div className="w-32 h-32 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10"><CheckCircle2 size={64}/></div><h2 className="text-4xl font-black text-[#2D1B4E] uppercase mb-4 tracking-tight">Başarılı!</h2><button onClick={() => router.push('/')} className="bg-[#E8622A] text-white px-12 py-5 rounded-full font-black uppercase text-sm border-none cursor-pointer">Ana Sayfa</button></div></div> );
  }

  // Çalışma saatlerini güvenle parse etme (Hakkında sekmesi için)
  let parsedWorkingHours = defaultWorkingHours;
  if (Array.isArray(selectedShop?.working_hours)) parsedWorkingHours = selectedShop.working_hours;
  else if (typeof selectedShop?.working_hours === 'string') { try { parsedWorkingHours = JSON.parse(selectedShop.working_hours); } catch(e){} }

  return (
    <div className="w-full bg-[#FAF7F2] max-w-7xl mx-auto pt-10 md:pt-24 px-4 md:px-8 pb-20 min-h-screen relative">
      <button onClick={() => router.push('/isletmeler')} className="flex items-center text-slate-400 hover:text-[#E8622A] mb-6 text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none cursor-pointer transition-colors"><ChevronLeft size={16} className="mr-2"/> {text?.shops?.back || 'Geri'}</button>
      
      {/* Kapak & Logo */}
      <div className="w-full h-[200px] md:h-[300px] rounded-[32px] overflow-hidden relative mb-20 border border-slate-200 bg-slate-50 shadow-sm">
          {selectedShop?.cover_url && <img loading="lazy" src={selectedShop.cover_url} className="w-full h-full object-cover" />}
          <div className="absolute -bottom-10 md:-bottom-12 left-6 md:left-12 w-24 h-24 md:w-32 md:h-32 rounded-[24px] bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-[#E8622A] font-black relative z-10">{(selectedShop?.package === 'Premium Paket' || selectedShop?.package === 'Premium') && <div className="absolute inset-0 border-4 border-yellow-400 rounded-[20px]"></div>}{selectedShop?.logo_url ? <img src={selectedShop.logo_url} className="w-full h-full object-cover" /> : "LOGO"}</div>
      </div>
      
      {/* İsim ve Başlık */}
      <div className="mb-10 border-b border-slate-200 pb-8 px-2 md:px-6"><div className="flex flex-wrap items-center gap-3 mb-3"><h1 className="text-2xl md:text-4xl font-black uppercase text-[#2D1B4E] tracking-tight">{selectedShop?.name}</h1>{(selectedShop?.package === 'Premium Paket' || selectedShop?.package === 'Premium') && <Gem size={28} className="text-yellow-500 fill-yellow-500"/>}</div><div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest"><span className="text-[#E8622A] px-3 py-1.5 bg-orange-50 rounded-lg">{selectedShop?.category || 'İşletme'}</span><span className="flex items-center gap-1"><MapPin size={14}/> {selectedShop?.address || (typeof selectedShop?.location === 'string' ? selectedShop.location : '')}</span></div></div>
      
      {/* Tab Menüsü (Dövme için özel menü) */}
      <div className="flex gap-6 md:gap-10 border-b border-slate-200 mb-10 overflow-x-auto custom-scrollbar px-2 md:px-6">
          {!isTattooShop && <button onClick={() => setProfileTab(selectedShop?.category === 'Bar & Club' ? 'events' : 'services')} className={`pb-4 text-sm md:text-base font-black uppercase whitespace-nowrap bg-transparent border-none cursor-pointer border-b-4 transition-colors ${(profileTab === 'services' || profileTab === 'events') ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>{selectedShop?.category === 'Bar & Club' ? (text?.profile?.events || 'Etkinlikler') : (text?.profile?.services || 'Hizmetler')}</button>}
          {isTattooShop && <button onClick={() => setProfileTab('quote')} className={`pb-4 text-sm md:text-base font-black uppercase whitespace-nowrap bg-transparent border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'quote' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>TEKLİF İSTE</button>}
          
          <button onClick={() => setProfileTab('gallery')} className={`pb-4 text-sm md:text-base font-black uppercase whitespace-nowrap bg-transparent border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'gallery' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>{text?.profile?.gallery || 'Galeri'}</button>
          <button onClick={() => setProfileTab('about')} className={`pb-4 text-sm md:text-base font-black uppercase whitespace-nowrap bg-transparent border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'about' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>{text?.profile?.about || 'Hakkında'}</button>
      </div>

      {/* Grid Yapısı (Dövme ise tek sütun (tam genişlik), değilse çift sütun) */}
      <div className={isTattooShop ? "w-full max-w-5xl mx-auto px-2 md:px-6" : "grid grid-cols-1 lg:grid-cols-12 gap-10"}>
          
          <div className={isTattooShop ? "w-full" : "lg:col-span-7 px-2 md:px-6"}>
              
              {/* KLASİK HİZMETLER (SADECE DÖVMECİ DEĞİLSE) */}
              {(profileTab === 'services' || profileTab === 'events') && !isTattooShop && (
                  <div className="flex flex-col gap-4">
                      {Array.isArray(selectedShop?.services) && selectedShop.services.map(srv => (<div key={srv?.id || Math.random()} onClick={() => { setBookingData({...bookingData, selectedShopService: srv, selectedStaff: null, time: ''}); setBookingPhase(2); }} className={`p-6 md:p-8 bg-white rounded-[32px] border cursor-pointer flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all shadow-sm hover:shadow-md ${bookingData?.selectedShopService?.id === srv?.id ? 'border-[#E8622A]' : 'border-slate-200 hover:border-[#E8622A]'}`}><div><h4 className="font-black text-lg md:text-xl text-[#2D1B4E] mb-2">{srv?.name}</h4><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 w-fit bg-slate-50 px-2 py-1 rounded"><Clock size={12}/> {srv?.duration || '30'} Dk</div></div><div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto"><span className="font-black text-xl md:text-2xl text-[#2D1B4E]">{srv?.price || '0'} TL</span><button className={`px-8 py-3 rounded-xl font-black text-xs border-none cursor-pointer transition-colors tracking-widest ${bookingData?.selectedShopService?.id === srv?.id ? 'bg-[#E8622A] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{text?.profile?.select || 'Seç'}</button></div></div>))}
                      {(!Array.isArray(selectedShop?.services) || selectedShop.services.length === 0) && <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest border border-slate-200 rounded-[32px]">{text?.profile?.emptySrv || 'Hizmet bulunamadı'}</div>}
                  </div>
              )}

              {/* DÖVME FORMU (MERKEZE YERLEŞİR) */}
              {profileTab === 'quote' && isTattooShop && (
                  <TattooBriefForm shopId={selectedShop?.id} />
              )}

              {/* GALERİ */}
              {profileTab === 'gallery' && (
                  <div className={isTattooShop ? "grid grid-cols-2 md:grid-cols-4 gap-4" : "grid grid-cols-2 md:grid-cols-3 gap-4"}>
                      {Array.isArray(selectedShop?.gallery) && selectedShop.gallery.map((img, idx) => (<div key={idx} className="h-64 rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm"><img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" /></div>))} 
                      {(!Array.isArray(selectedShop?.gallery) || selectedShop.gallery.length === 0) && <div className="col-span-full p-10 text-center text-slate-400 font-bold uppercase tracking-widest border border-slate-200 rounded-[32px]">{text?.profile?.emptyGal || 'Galeri boş'}</div>}
                  </div>
              )}

              {/* HAKKINDA (VİTRİN BİLGİLERİYLE ZENGİNLEŞTİRİLDİ) */}
              {profileTab === 'about' && (
                  <div className="flex flex-col gap-8">
                      {/* Açıklama */}
                      <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[32px] shadow-sm">
                          <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-4">Hakkımızda</h3>
                          <p className="text-slate-600 text-sm md:text-base font-medium whitespace-pre-wrap leading-relaxed">{selectedShop?.description || 'Henüz açıklama eklenmemiş.'}</p>
                      </div>

                      {/* İletişim Bilgileri Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm flex flex-col gap-5">
                              <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-2 border-b border-slate-100 pb-4">İletişim</h3>
                              {selectedShop?.phone && <div className="flex items-center gap-3 text-slate-600 font-bold"><Phone size={18} className="text-[#E8622A]"/> {selectedShop.phone}</div>}
                              {selectedShop?.email && <div className="flex items-center gap-3 text-slate-600 font-bold"><Mail size={18} className="text-[#E8622A]"/> {selectedShop.email}</div>}
                              {selectedShop?.instagram && <a href={selectedShop.instagram} target="_blank" className="flex items-center gap-3 text-slate-600 font-bold hover:text-[#E8622A]"><Instagram size={18} className="text-[#E8622A]"/> Instagram Hesabımız</a>}
                          </div>

                          <div className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm">
                              <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-6 border-b border-slate-100 pb-4">Çalışma Saatleri</h3>
                              <div className="flex flex-col gap-3">
                                  {parsedWorkingHours.map((h, i) => (
                                      <div key={i} className="flex justify-between items-center text-sm font-bold">
                                          <span className="text-slate-500">{h.day}</span>
                                          {h.isClosed ? <span className="text-red-500 bg-red-50 px-2 py-1 rounded">Kapalı</span> : <span className="text-[#2D1B4E]">{h.open} - {h.close}</span>}
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
              )}
          </div>

          {/* SAĞ SÜTUN - RANDEVU (DÖVMECİ İSE GİZLENİR) */}
          {!isTattooShop && (
              <div className="lg:col-span-5 relative mt-10 lg:mt-0">
                  <div className="lg:sticky lg:top-28 bg-white border border-slate-200 rounded-[40px] p-6 md:p-10 flex flex-col min-h-[450px] shadow-xl mb-10 lg:mb-0">
                      
                      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6"><h3 className="text-xl font-black uppercase text-[#2D1B4E] tracking-tight">{text?.booking?.title || 'Randevu Al'}</h3>{bookingPhase > 1 && (<button onClick={() => { if(selectedShop?.category === 'Bar & Club' && bookingPhase === 2){setBookingPhase(1); setBookingData({...bookingData, selectedEvent:null});} else {setBookingPhase(bookingPhase - 1);} }} className="text-[10px] font-black uppercase text-slate-500 hover:text-[#E8622A] bg-slate-100 hover:bg-orange-50 px-4 py-2 rounded-xl flex items-center border-none cursor-pointer transition-colors tracking-widest"><ChevronLeft size={14} className="mr-1"/> {text?.booking?.back || 'Geri'}</button>)}</div>

                      {bookingPhase === 1 && (<div className="flex-1 flex flex-col items-center justify-center text-center p-10"><div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6"><Scissors size={40} className="text-slate-300"/></div><p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Hizmet Seçin</p></div>)}
                      
                      {bookingPhase > 1 && (
                          <div className="mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col gap-4 shadow-inner">
                              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Seçim</span><span className="font-black text-[#2D1B4E] text-sm md:text-base">{bookingData?.selectedShopService?.name}</span></div>
                              {bookingPhase > 3 && bookingData?.time && (<div className="flex flex-col sm:flex-row justify-between sm:items-center border-t border-slate-200 pt-4 gap-2"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Zaman</span><span className="font-bold text-[#E8622A] text-xs bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">{bookingData?.date} | {bookingData?.time}</span></div>)}
                              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-t border-slate-200 pt-4 mt-2 gap-2"><span className="text-[10px] font-black text-[#2D1B4E] uppercase tracking-widest">Toplam</span><span className="font-black text-[#E8622A] text-2xl">{bookingData?.selectedShopService?.price || '0'} TL</span></div>
                          </div>
                      )}

                      {bookingPhase === 2 && (
                          <div className="flex-1 animate-in fade-in duration-300"><p className="text-[11px] font-black uppercase text-[#2D1B4E] mb-6 tracking-widest border-l-4 border-[#E8622A] pl-3">Uzman Seçin</p><div className="grid grid-cols-2 sm:grid-cols-3 gap-4"><div onClick={() => { setBookingData({...bookingData, selectedStaff: { name: 'Fark Etmez' }}); setBookingPhase(3); }} className="flex flex-col items-center gap-3 cursor-pointer p-4 md:p-6 rounded-3xl border border-slate-200 hover:border-[#E8622A] bg-white transition-all hover:shadow-md group"><div className="w-14 h-14 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#E8622A] transition-colors"><Users size={24}/></div><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Fark Etmez</span></div>{Array.isArray(selectedShop?.staff) && selectedShop.staff.map(person => (<div key={person?.id || Math.random()} onClick={() => { setBookingData({...bookingData, selectedStaff: person}); setBookingPhase(3); }} className="flex flex-col items-center gap-3 cursor-pointer p-4 md:p-6 rounded-3xl border border-slate-200 hover:border-[#E8622A] bg-white transition-all hover:shadow-md group"><div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center font-black text-lg group-hover:bg-[#E8622A] group-hover:text-white transition-colors">{(person?.name || 'U').charAt(0)}</div><span className="text-[10px] font-black text-[#2D1B4E] uppercase truncate w-full text-center px-1 tracking-widest">{person?.name}</span></div>))}</div></div>
                      )}

                      {bookingPhase === 3 && (
                          <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-300">
                            <input type="date" min={new Date().toISOString().split('T')[0]} value={bookingData?.date} className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] shadow-sm cursor-pointer" onChange={(e) => setBookingData({...bookingData, date: e.target.value, time: ''})} />
                            {bookingData?.date && ( isShopClosedToday ? (
                              <div className="py-12 text-center text-red-500 font-bold uppercase text-xs bg-red-50 rounded-3xl border border-red-100 flex flex-col items-center justify-center gap-3"><CalendarOff size={32}/> Kapalı</div>
                            ) : (
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {currentAvailableSlots.map((slot, idx) => { 
                                  const needed = getRequiredSlots(bookingData?.selectedShopService?.duration || '30'); 
                                  const check = currentAvailableSlots.slice(idx, idx + needed); 
                                  let isUnavail = check.length < needed || check.some(s => closedSlots.includes(s)); 
                                  return (
                                    <button key={slot} onClick={() => { if(isUnavail) { setWaitlistTime(slot); setShowWaitlistModal(true); } else { setBookingData({...bookingData, time: slot}); setBookingPhase(4); } }} className={`py-4 rounded-2xl flex flex-col items-center justify-center text-xs font-bold border cursor-pointer transition-all ${isUnavail ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60' : bookingData?.time === slot ? 'bg-[#E8622A] text-white border-[#E8622A] shadow-md scale-105' : 'bg-white border-slate-200 text-[#2D1B4E] hover:border-[#E8622A] shadow-sm'}`}>
                                      <span>{slot}</span>
                                    </button>
                                  ); 
                                })}
                              </div>
                            ) )}
                          </div>
                      )}

                      {bookingPhase === 4 && (
                          <form onSubmit={handleBooking} className="flex flex-col gap-4 flex-1 mt-auto animate-in fade-in duration-300">
                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                              <input required placeholder="Adınız" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:border-[#E8622A] shadow-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                              <input required placeholder="Soyadınız" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:border-[#E8622A] shadow-sm" value={formData.surname} onChange={(e) => setFormData({...formData, surname: e.target.value})} />
                            </div>
                            <input required type="tel" placeholder="Telefon Numaranız" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:border-[#E8622A] shadow-sm" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                            <button type="submit" className="w-full bg-[#E8622A] text-white py-5 rounded-2xl mt-4 font-black uppercase text-sm border-none cursor-pointer">Onayla ve Bitir</button>
                          </form>
                      )}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}