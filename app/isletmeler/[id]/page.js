"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Star, ChevronLeft, Calendar, Clock, Music, Scissors, UserCircle, Users, CalendarOff, CheckCircle2, Gem } from 'lucide-react';
import { useAppContext } from '../../providers';
import { supabase } from '../../../lib/supabase';
import { getNewBookingShopTemplate, getBookingConfirmationTemplate } from '../../../lib/emailTemplates';

function parseDuration(d) { const m = (d||'').match(/\d+/); return m ? parseInt(m[0]) : 30; }
function getRequiredSlots(d) { return Math.ceil(parseDuration(d) / 30); }
const allTimeSlots = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30","00:00","00:30","01:00","01:30","02:00"];
const defaultWorkingHours = [{day:'Pazartesi',open:'09:00',close:'19:00',isClosed:false},{day:'Salı',open:'09:00',close:'19:00',isClosed:false},{day:'Çarşamba',open:'09:00',close:'19:00',isClosed:false},{day:'Perşembe',open:'09:00',close:'19:00',isClosed:false},{day:'Cuma',open:'09:00',close:'19:00',isClosed:false},{day:'Cumartesi',open:'09:00',close:'19:00',isClosed:false},{day:'Pazar',open:'09:00',close:'19:00',isClosed:true}];

export default function ShopDetail() {
  const params = useParams();
  const router = useRouter();
  const { lang = 'TR', t, shops } = useAppContext();
  
  const [selectedShop, setSelectedShop] = useState(null);
  const [profileTab, setProfileTab] = useState('services');
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

  // --- 🌟 YENİ: OTOMATİK KULLANICI BİLGİSİ ÇEKME RADARI ---
  useEffect(() => {
    const fetchLoggedUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { user } = session;
        const { data: cust } = await supabase.from('customers').select('*').eq('id', user.id).single();
        
        const fullName = cust?.full_name || user.user_metadata?.full_name || '';
        const userEmail = cust?.email || user.email || '';
        const userPhone = cust?.phone || '';

        // Ad ve Soyadı boşluktan ayır
        let firstName = '';
        let lastName = '';
        if (fullName) {
          const parts = fullName.split(' ');
          if (parts.length > 1) {
            lastName = parts.pop();
            firstName = parts.join(' ');
          } else {
            firstName = fullName;
          }
        }

        // Formu otomatik doldur
        setFormData(prev => ({
          ...prev,
          name: firstName || prev.name,
          surname: lastName || prev.surname,
          email: userEmail || prev.email,
          phone: userPhone ? userPhone.replace('+90 ', '').replace('+90', '') : prev.phone
        }));

        setWaitlistForm(prev => ({
          ...prev,
          name: fullName || prev.name,
          email: userEmail || prev.email,
          phone: userPhone ? userPhone.replace('+90 ', '').replace('+90', '') : prev.phone
        }));
      }
    };
    fetchLoggedUser();
  }, []);
  // ---------------------------------------------------------

  useEffect(() => {
    if (shops && shops.length > 0 && params?.id) {
      const shop = shops.find(s => String(s.id) === String(params.id));
      if (shop) {
        setSelectedShop(shop);
        setProfileTab(shop.category === 'Bar & Club' ? 'events' : 'services');
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

  if (!selectedShop || !t?.[lang]) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">Yükleniyor...</div>;

  const isClub = selectedShop?.category === 'Bar & Club';
  const text = t[lang] || {};

  const handleBookingEmailChange = (e) => setFormData(prev => ({...prev, email: e.target.value}));
  const handleBookingPhoneChange = (e) => setFormData(prev => ({...prev, phone: e.target.value}));

  const getCurrentAvailableSlots = () => {
    if (!bookingData.date || isClub) return allTimeSlots;
    if (selectedShop?.closed_dates && String(selectedShop.closed_dates).includes(bookingData.date)) return [];
    
    const dayName = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][new Date(bookingData.date).getDay()];
    
    let workingHours = defaultWorkingHours;
    if (Array.isArray(selectedShop?.working_hours)) {
        workingHours = selectedShop.working_hours;
    } else if (typeof selectedShop?.working_hours === 'string') {
        try { workingHours = JSON.parse(selectedShop.working_hours); } catch(e){}
    }

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
    
    const { error } = await supabase.from('waitlist').insert([{
      shop_id: selectedShop.id,
      service_name: bookingData?.selectedShopService?.name || 'Genel',
      wait_date: bookingData.date,
      wait_time: waitlistTime,
      customer_name: waitlistForm.name,
      customer_phone: waitlistForm.phone,
      customer_email: waitlistForm.email,
      status: 'waiting'
    }]);

    if (error) {
      console.error(error);
      alert("Sıraya girerken bir hata oluştu.");
      setWaitlistStatus('idle');
    } else {
      setWaitlistStatus('success');
      setTimeout(() => {
        setShowWaitlistModal(false);
        setWaitlistStatus('idle');
        setWaitlistTime('');
      }, 3000); 
    }
  }

  async function handleBooking(e) {
    e.preventDefault();
    if(isClub) { 
      if(!bookingData.selectedEvent) return alert("Etkinliği seçin."); 
      if(!bookingData.selectedShopService) return alert("VIP türünü seçin."); 
    } else { 
      if(!bookingData.selectedShopService) return alert("Hizmet seçin."); 
      if(!bookingData.selectedStaff) return alert("Uzman seçin"); 
    }

    const availableSlotsForBooking = getCurrentAvailableSlots();
    const startIndex = availableSlotsForBooking.indexOf(bookingData.time);
    const neededSlots = getRequiredSlots(bookingData.selectedShopService?.duration || '30');
    const occupied_slots = isClub ? [] : availableSlotsForBooking.slice(startIndex, startIndex + neededSlots);
    let assignedStaffName = isClub ? 'Rezervasyon' : (bookingData.selectedStaff?.name || 'Genel');
    
    if (!isClub && (assignedStaffName === "Fark Etmez" || assignedStaffName === 'Any Staff' || assignedStaffName === 'Любой')) {
        if (Array.isArray(selectedShop?.staff) && selectedShop.staff.length > 0) {
            const availableStaff = selectedShop.staff.find(staff => {
                return occupied_slots.every(checkSlot => {
                    if (closedSlots.includes(checkSlot)) return false;
                    return !appointments.some(a => a.staff_name === staff.name && (a.occupied_slots ? a.occupied_slots.includes(checkSlot) : a.appointment_time === checkSlot));
                });
            });
            assignedStaffName = availableStaff ? availableStaff.name : 'Genel';
        }
    }

    const fullPhone = formData.phoneCode + " " + formData.phone;
    const finalDate = isClub ? bookingData.selectedEvent?.date : bookingData.date;
    const finalTime = isClub ? bookingData.selectedEvent?.time : bookingData.time;

    const { error } = await supabase.from('appointments').insert([{ shop_id: selectedShop.id, customer_name: formData.name, customer_surname: formData.surname, customer_phone: fullPhone, customer_email: formData.email, appointment_date: finalDate, appointment_time: finalTime, service_name: bookingData.selectedShopService?.name || 'Genel', staff_name: assignedStaffName, occupied_slots: occupied_slots, status: 'Bekliyor' }]);
    
    if (!error) {
       try {
          await fetch('/api/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: selectedShop.admin_email, subject: 'Yeni Randevu Bildirimi - Bookcy', html: getNewBookingShopTemplate({ shopName: selectedShop.name, date: finalDate, time: finalTime, service: bookingData.selectedShopService?.name || 'Genel', staff: assignedStaffName, customerName: formData.name + " " + formData.surname, customerPhone: fullPhone, customerEmail: formData.email })})});
          await fetch('/api/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: formData.email, subject: 'Randevunuz Alındı - Bookcy', html: getBookingConfirmationTemplate({ customerName: formData.name, shopName: selectedShop.name, date: finalDate, time: finalTime, service: bookingData.selectedShopService?.name || 'Genel', staff: assignedStaffName, address: selectedShop.address || (typeof selectedShop.location === 'string' ? selectedShop.location : '') })})});
       } catch (mErr) { console.error(mErr); }
       setBookingPhase('success'); window.scrollTo(0,0); 
    } else { alert("Rezervasyon alınırken bir hata oluştu!"); }
  }

  async function submitFeedback(e) {
    e.preventDefault();
    if(feedbackData.q1===null || feedbackData.q2===null || feedbackData.q3===null || feedbackData.q4===null) return alert("Lütfen tüm soruları puanlayınız.");
    setFeedbackSubmitted(true);
    const avg = Number(((feedbackData.q1 + feedbackData.q2 + feedbackData.q3 + feedbackData.q4) / 4).toFixed(1));
    await supabase.from('platform_feedback').insert([{ q1: feedbackData.q1, q2: feedbackData.q2, q3: feedbackData.q3, q4: feedbackData.q4, average_score: avg }]);
  }

  const renderFeedbackScale = (qKey) => (
    <div className="flex gap-1 justify-center mt-3 mb-6 w-full max-w-full overflow-x-auto custom-scrollbar pb-2">
      {[0,1,2,3,4,5,6,7,8,9,10].map(num => (<button key={num} type="button" onClick={() => setFeedbackData({...feedbackData, [qKey]: num})} className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-black transition-all border shrink-0 ${feedbackData[qKey] === num ? 'bg-[#E8622A] text-white border-[#E8622A] scale-110 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-[#E8622A] cursor-pointer'}`}>{num}</button>))}
    </div>
  );

  if (bookingPhase === 'success') {
    return (
      <div className="w-full bg-[#FAF7F2] min-h-screen pt-10">
        <div className="text-center py-20 px-6 flex flex-col items-center justify-center max-w-[600px] mx-auto animate-in zoom-in-95 duration-500">
          {!feedbackSubmitted ? (
            <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-2xl border border-slate-200 w-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#E8622A] to-[#F5C5A3]"></div>
              <div className="w-24 h-24 bg-[#00c48c] text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(0,196,140,0.3)]"><CheckCircle2 size={48} /></div>
              <h2 className="text-3xl md:text-4xl font-black text-[#2D1B4E] uppercase mb-4 tracking-tight">{text?.success?.title || 'Başarılı'}</h2>
              <p className="text-slate-500 font-bold text-sm md:text-base mb-10 leading-relaxed">{text?.success?.desc || 'İşleminiz tamamlandı.'}</p>
              <div className="border-t border-slate-100 pt-10 mt-6 bg-slate-50 -mx-8 md:-mx-14 -mb-8 md:-mb-14 px-8 md:px-14 pb-8 md:pb-14">
                <h3 className="font-black text-xl text-[#2D1B4E] mb-8 flex items-center justify-center gap-2"><Star className="text-yellow-500 fill-yellow-500"/> {text?.success?.rateTitle || 'Bizi Değerlendirin'}</h3>
                <form onSubmit={submitFeedback} className="text-left space-y-8">
                  <div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block text-center">{text?.success?.q1 || 'Soru 1'}</label>{renderFeedbackScale('q1')}</div>
                  <div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block text-center">{text?.success?.q2 || 'Soru 2'}</label>{renderFeedbackScale('q2')}</div>
                  <div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block text-center">{text?.success?.q3 || 'Soru 3'}</label>{renderFeedbackScale('q3')}</div>
                  <div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block text-center">{text?.success?.q4 || 'Soru 4'}</label>{renderFeedbackScale('q4')}</div>
                  <button type="submit" className="w-full bg-[#2D1B4E] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs border-none cursor-pointer shadow-xl hover:bg-[#1a0f2e] transition-all hover:-translate-y-1 mt-4">{text?.success?.btn || 'Gönder'}</button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[40px] p-10 md:p-20 shadow-2xl border border-slate-200 w-full text-center"><div className="w-32 h-32 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-10 border-4 border-yellow-100"><Star fill="currentColor" size={64}/></div><h2 className="text-4xl font-black text-[#2D1B4E] uppercase mb-4 tracking-tight">{text?.success?.thanks || 'Teşekkürler'}</h2><p className="text-slate-500 mb-12 font-medium text-lg">{text?.success?.saved || 'Kaydedildi.'}</p><button onClick={() => router.push('/')} className="bg-[#E8622A] text-white mx-auto px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-sm border-none cursor-pointer shadow-xl hover:bg-[#d4561f] transition-all hover:scale-105 w-full md:w-auto">{text?.success?.home || 'Ana Sayfa'}</button></div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAF7F2] max-w-6xl mx-auto pt-10 md:pt-24 px-6 pb-20 min-h-screen relative">
      <button onClick={() => router.push('/isletmeler')} className="flex items-center text-slate-400 hover:text-[#E8622A] mb-6 text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none cursor-pointer transition-colors"><ChevronLeft size={16} className="mr-2"/> {text?.shops?.back || 'Geri'}</button>
      <div className="w-full h-[200px] md:h-[300px] rounded-[32px] overflow-hidden relative mb-20 border border-slate-200 bg-slate-50 shadow-sm">
          {selectedShop?.cover_url && <img loading="lazy" src={selectedShop.cover_url} className="w-full h-full object-cover" />}
          <div className="absolute -bottom-10 md:-bottom-12 left-6 md:left-12 w-24 h-24 md:w-32 md:h-32 rounded-[24px] bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-[#E8622A] font-black relative z-10">{(selectedShop?.package === 'Premium Paket' || selectedShop?.package === 'Premium') && <div className="absolute inset-0 border-4 border-yellow-400 rounded-[20px]"></div>}{selectedShop?.logo_url ? <img src={selectedShop.logo_url} className="w-full h-full object-cover" /> : "LOGO"}</div>
      </div>
      <div className="mb-10 border-b border-slate-200 pb-8 px-2 md:px-6"><div className="flex flex-wrap items-center gap-3 mb-3"><h1 className="text-2xl md:text-4xl font-black uppercase text-[#2D1B4E] tracking-tight">{selectedShop?.name}</h1>{(selectedShop?.package === 'Premium Paket' || selectedShop?.package === 'Premium') && <Gem size={28} className="text-yellow-500 fill-yellow-500"/>}</div><div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest"><span className="text-[#E8622A] px-3 py-1.5 bg-orange-50 rounded-lg">{selectedShop?.category || 'İşletme'}</span><span className="flex items-center gap-1"><MapPin size={14}/> {selectedShop?.address || (typeof selectedShop?.location === 'string' ? selectedShop.location : '')}</span></div></div>
      <div className="flex gap-6 md:gap-10 border-b border-slate-200 mb-10 overflow-x-auto custom-scrollbar px-2 md:px-6">
          <button onClick={() => setProfileTab(selectedShop?.category === 'Bar & Club' ? 'events' : 'services')} className={`pb-4 text-sm md:text-base font-black uppercase whitespace-nowrap bg-transparent border-none cursor-pointer border-b-4 transition-colors ${(profileTab === 'services' || profileTab === 'events') ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>{selectedShop?.category === 'Bar & Club' ? (text?.profile?.events || 'Etkinlikler') : (text?.profile?.services || 'Hizmetler')}</button>
          <button onClick={() => setProfileTab('gallery')} className={`pb-4 text-sm md:text-base font-black uppercase whitespace-nowrap bg-transparent border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'gallery' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>{text?.profile?.gallery || 'Galeri'}</button>
          <button onClick={() => setProfileTab('about')} className={`pb-4 text-sm md:text-base font-black uppercase whitespace-nowrap bg-transparent border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'about' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>{text?.profile?.about || 'Hakkında'}</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 px-2 md:px-6">
              {(profileTab === 'events' || profileTab === 'services') && selectedShop?.category === 'Bar & Club' && (
                  <div className="flex flex-col gap-4">
                      {bookingPhase === 1 ? (
                          Array.isArray(selectedShop?.events) && selectedShop.events.map(ev => (<div key={ev?.id || Math.random()} onClick={() => { setBookingData({...bookingData, selectedEvent: ev, date: ev?.date, time: ev?.time}); setBookingPhase(2); }} className="flex flex-col sm:flex-row gap-4 p-4 md:p-6 bg-white rounded-[32px] border border-slate-200 hover:border-[#E8622A] cursor-pointer shadow-sm transition-all hover:shadow-md"><div className="w-full sm:w-32 h-40 sm:h-32 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">{ev?.image_url ? <img src={ev.image_url} className="w-full h-full object-cover"/> : <Music size={32} className="text-slate-400"/>}</div><div className="flex-1 flex flex-col justify-center"><h4 className="font-black text-xl md:text-2xl text-[#2D1B4E] uppercase mb-2">{ev?.name}</h4><div className="text-[#E8622A] font-bold text-sm flex items-center gap-2 bg-orange-50 w-fit px-3 py-1.5 rounded-lg"><Calendar size={14}/> {ev?.date} • {ev?.time}</div></div></div>))
                      ) : (
                          <><button onClick={() => {setBookingData({...bookingData, selectedEvent: null, selectedShopService: null}); setBookingPhase(1);}} className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-transparent border-none cursor-pointer mb-4 flex items-center gap-1 hover:text-[#E8622A] transition-colors w-fit"><ChevronLeft size={14}/> {text?.booking?.back || 'Geri'}</button>{Array.isArray(selectedShop?.services) && selectedShop.services.map(srv => { const isSoldOut = appointments.filter(a => a.appointment_date === bookingData?.selectedEvent?.date && a.service_name === srv?.name && a.status !== 'İptal').length >= parseInt(srv?.capacity || '10'); return (<div key={srv?.id || Math.random()} onClick={() => { if(!isSoldOut) { setBookingData({...bookingData, selectedShopService: srv}); setBookingPhase(3); } }} className={`p-6 md:p-8 bg-white rounded-[32px] border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 transition-all ${isSoldOut ? 'opacity-60 cursor-not-allowed border-slate-200' : bookingData?.selectedShopService?.id === srv?.id ? 'border-[#E8622A] shadow-md' : 'border-slate-200 hover:border-[#E8622A] cursor-pointer shadow-sm hover:shadow-md'}`}><div><h4 className="font-black text-lg md:text-xl text-[#2D1B4E]">{srv?.name}</h4></div><div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto"><span className="font-black text-xl md:text-2xl text-[#2D1B4E]">{srv?.price || '0'} TL</span><button disabled={isSoldOut} className={`px-8 py-4 rounded-xl font-black text-xs border-none cursor-pointer tracking-widest ${isSoldOut ? 'bg-slate-100 text-slate-400' : 'bg-[#E8622A] text-white hover:bg-orange-600 transition-colors'}`}>{isSoldOut ? (text?.profile?.soldOut || 'Tükendi') : (text?.profile?.select || 'Seç')}</button></div></div>) })}</>
                      )}
                  </div>
              )}

              {(profileTab === 'services' || profileTab === 'events') && selectedShop?.category !== 'Bar & Club' && (
                  <div className="flex flex-col gap-4">
                      {Array.isArray(selectedShop?.services) && selectedShop.services.map(srv => (<div key={srv?.id || Math.random()} onClick={() => { setBookingData({...bookingData, selectedShopService: srv, selectedStaff: null, time: ''}); setBookingPhase(2); }} className={`p-6 md:p-8 bg-white rounded-[32px] border cursor-pointer flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all shadow-sm hover:shadow-md ${bookingData?.selectedShopService?.id === srv?.id ? 'border-[#E8622A]' : 'border-slate-200 hover:border-[#E8622A]'}`}><div><h4 className="font-black text-lg md:text-xl text-[#2D1B4E] mb-2">{srv?.name}</h4><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 w-fit bg-slate-50 px-2 py-1 rounded"><Clock size={12}/> {srv?.duration || '30'} Dk</div></div><div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto"><span className="font-black text-xl md:text-2xl text-[#2D1B4E]">{srv?.price || '0'} TL</span><button className={`px-8 py-3 rounded-xl font-black text-xs border-none cursor-pointer transition-colors tracking-widest ${bookingData?.selectedShopService?.id === srv?.id ? 'bg-[#E8622A] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{text?.profile?.select || 'Seç'}</button></div></div>))}
                      {(!Array.isArray(selectedShop?.services) || selectedShop.services.length === 0) && <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest border border-slate-200 rounded-[32px]">{text?.profile?.emptySrv || 'Hizmet bulunamadı'}</div>}
                  </div>
              )}

              {profileTab === 'gallery' && (<div className="grid grid-cols-2 md:grid-cols-3 gap-4">{Array.isArray(selectedShop?.gallery) && selectedShop.gallery.map((img, idx) => (<div key={idx} className="h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm"><img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" /></div>))} {(!Array.isArray(selectedShop?.gallery) || selectedShop.gallery.length === 0) && <div className="col-span-full p-10 text-center text-slate-400 font-bold uppercase tracking-widest border border-slate-200 rounded-[32px]">{text?.profile?.emptyGal || 'Galeri boş'}</div>}</div>)}
              {profileTab === 'about' && (<div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[32px] shadow-sm"><h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">{text?.profile?.about || 'Hakkında'}</h3><p className="text-slate-600 text-sm md:text-base font-medium whitespace-pre-wrap leading-relaxed">{selectedShop?.description || text?.profile?.emptyDesc || 'Henüz açıklama eklenmemiş.'}</p></div>)}
          </div>

          <div className="lg:col-span-5 relative mt-10 lg:mt-0">
              <div className="lg:sticky lg:top-28 bg-white border border-slate-200 rounded-[40px] p-6 md:p-10 flex flex-col min-h-[450px] shadow-xl mb-10 lg:mb-0">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6"><h3 className="text-xl font-black uppercase text-[#2D1B4E] tracking-tight">{text?.booking?.title || 'Randevu Al'}</h3>{bookingPhase > 1 && (<button onClick={() => { if(selectedShop?.category === 'Bar & Club' && bookingPhase === 2){setBookingPhase(1); setBookingData({...bookingData, selectedEvent:null});} else {setBookingPhase(bookingPhase - 1);} }} className="text-[10px] font-black uppercase text-slate-500 hover:text-[#E8622A] bg-slate-100 hover:bg-orange-50 px-4 py-2 rounded-xl flex items-center border-none cursor-pointer transition-colors tracking-widest"><ChevronLeft size={14} className="mr-1"/> {text?.booking?.back || 'Geri'}</button>)}</div>

                  {bookingPhase === 1 && (<div className="flex-1 flex flex-col items-center justify-center text-center p-10">{selectedShop?.category === 'Bar & Club' ? <><div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6"><Music size={40} className="text-slate-300"/></div><p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{text?.booking?.startEvent || 'Etkinlik Seçin'}</p></> : <><div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6"><Scissors size={40} className="text-slate-300"/></div><p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{text?.booking?.startSrv || 'Hizmet Seçin'}</p></>}</div>)}
                  
                  {bookingPhase > 1 && (
                      <div className="mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col gap-4 shadow-inner">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{text?.booking?.srv || 'Seçim'}</span><span className="font-black text-[#2D1B4E] text-sm md:text-base">{bookingData?.selectedShopService?.name}</span></div>
                          {bookingPhase > 2 && bookingData?.selectedStaff && selectedShop?.category !== 'Bar & Club' && (<div className="flex flex-col sm:flex-row justify-between sm:items-center border-t border-slate-200 pt-4 gap-2"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{text?.booking?.staff || 'Uzman'}</span><span className="font-bold text-[#2D1B4E] text-xs uppercase bg-white px-3 py-1.5 rounded-lg border border-slate-100">{bookingData?.selectedStaff?.name}</span></div>)}
                          {bookingPhase > 3 && bookingData?.time && selectedShop?.category !== 'Bar & Club' && (<div className="flex flex-col sm:flex-row justify-between sm:items-center border-t border-slate-200 pt-4 gap-2"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{text?.booking?.time || 'Zaman'}</span><span className="font-bold text-[#E8622A] text-xs bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">{bookingData?.date} | {bookingData?.time}</span></div>)}
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-t border-slate-200 pt-4 mt-2 gap-2"><span className="text-[10px] font-black text-[#2D1B4E] uppercase tracking-widest">{text?.booking?.total || 'Toplam'}</span><span className="font-black text-[#E8622A] text-2xl">{bookingData?.selectedShopService?.price || '0'} TL</span></div>
                      </div>
                  )}

                  {bookingPhase === 2 && selectedShop?.category !== 'Bar & Club' && (
                      <div className="flex-1 animate-in fade-in duration-300"><p className="text-[11px] font-black uppercase text-[#2D1B4E] mb-6 tracking-widest border-l-4 border-[#E8622A] pl-3">{text?.booking?.selectStaff || 'Uzman Seçin'}</p><div className="grid grid-cols-2 sm:grid-cols-3 gap-4"><div onClick={() => { setBookingData({...bookingData, selectedStaff: { name: text?.booking?.any || 'Fark Etmez' }}); setBookingPhase(3); }} className="flex flex-col items-center gap-3 cursor-pointer p-4 md:p-6 rounded-3xl border border-slate-200 hover:border-[#E8622A] bg-white transition-all hover:shadow-md group"><div className="w-14 h-14 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#E8622A] transition-colors"><Users size={24}/></div><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{text?.booking?.any || 'Fark Etmez'}</span></div>{Array.isArray(selectedShop?.staff) && selectedShop.staff.map(person => (<div key={person?.id || Math.random()} onClick={() => { setBookingData({...bookingData, selectedStaff: person}); setBookingPhase(3); }} className="flex flex-col items-center gap-3 cursor-pointer p-4 md:p-6 rounded-3xl border border-slate-200 hover:border-[#E8622A] bg-white transition-all hover:shadow-md group"><div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center font-black text-lg group-hover:bg-[#E8622A] group-hover:text-white transition-colors">{(person?.name || 'U').charAt(0)}</div><span className="text-[10px] font-black text-[#2D1B4E] uppercase truncate w-full text-center px-1 tracking-widest">{person?.name || 'Uzman'}</span></div>))}</div></div>
                  )}

                  {bookingPhase === 3 && selectedShop?.category !== 'Bar & Club' && (
                      <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-300">
                        <input type="date" min={new Date().toISOString().split('T')[0]} value={bookingData?.date} className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] shadow-sm cursor-pointer" onChange={(e) => setBookingData({...bookingData, date: e.target.value, time: ''})} />
                        {bookingData?.date && ( isShopClosedToday ? (
                          <div className="py-12 text-center text-red-500 font-bold uppercase text-xs bg-red-50 rounded-3xl border border-red-100 flex flex-col items-center justify-center gap-3"><CalendarOff size={32}/> {text?.booking?.closed || 'Kapalı'}</div>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                            {currentAvailableSlots.map((slot, idx) => { 
                              const needed = getRequiredSlots(bookingData?.selectedShopService?.duration || '30'); 
                              const check = currentAvailableSlots.slice(idx, idx + needed); 
                              
                              let isUnavail = check.length < needed || check.some(s => closedSlots.includes(s)); 
                              
                              if (!isUnavail && !isClub) {
                                  const staffName = bookingData?.selectedStaff?.name;
                                  const staffList = Array.isArray(selectedShop?.staff) ? selectedShop.staff : [];
                                  
                                  const isSlotBusy = check.some(checkSlot => {
                                      if (staffName && staffName !== 'Fark Etmez' && staffName !== 'Any Staff') {
                                          return appointments.some(a => a.status !== 'İptal' && a.staff_name === staffName && (a.occupied_slots?.includes(checkSlot) || a.appointment_time === checkSlot));
                                      } else {
                                          if (staffList.length === 0) {
                                              return appointments.some(a => a.status !== 'İptal' && (a.occupied_slots?.includes(checkSlot) || a.appointment_time === checkSlot));
                                          }
                                          const busyStaffs = appointments.filter(a => a.status !== 'İptal' && (a.occupied_slots?.includes(checkSlot) || a.appointment_time === checkSlot)).map(a => a.staff_name);
                                          const uniqueBusyStaffs = [...new Set(busyStaffs)];
                                          return uniqueBusyStaffs.length >= staffList.length;
                                      }
                                  });
                                  isUnavail = isUnavail || isSlotBusy;
                              }

                              return (
                                <button key={slot} onClick={() => { if(isUnavail) { setWaitlistTime(slot); setShowWaitlistModal(true); } else { setBookingData({...bookingData, time: slot}); setBookingPhase(4); } }} className={`py-4 rounded-2xl flex flex-col items-center justify-center text-xs font-bold border cursor-pointer transition-all ${isUnavail ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 hover:border-[#E8622A] hover:text-[#E8622A]' : bookingData?.time === slot ? 'bg-[#E8622A] text-white border-[#E8622A] shadow-md scale-105' : 'bg-white border-slate-200 text-[#2D1B4E] hover:border-[#E8622A] hover:text-[#E8622A] shadow-sm'}`}>
                                  <span>{slot}</span> {isUnavail && <span className="text-[8px] font-black uppercase mt-1 tracking-widest text-[#E8622A]">Dolu</span>}
                                </button>
                              ); 
                            })}
                          </div>
                        ) )}
                      </div>
                  )}

                  {(bookingPhase === 4 || (selectedShop?.category === 'Bar & Club' && bookingPhase === 3)) && (
                      <form onSubmit={handleBooking} className="flex flex-col gap-4 flex-1 mt-auto animate-in fade-in duration-300">
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                          <input required placeholder={text?.booking?.name || 'Adınız'} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:border-[#E8622A] focus:bg-white shadow-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                          <input required placeholder={text?.booking?.surname || 'Soyadınız'} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:border-[#E8622A] focus:bg-white shadow-sm" value={formData.surname} onChange={(e) => setFormData({...formData, surname: e.target.value})} />
                        </div>
                        <div className="flex gap-3 w-full">
                          <select className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A] focus:bg-white shadow-sm w-24 cursor-pointer" value={formData.phoneCode} onChange={e => setFormData({...formData, phoneCode: e.target.value})}><option value="+90">TR</option></select>
                          <input required type="tel" placeholder={text?.booking?.phone || 'Telefon'} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:border-[#E8622A] focus:bg-white shadow-sm" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        </div>
                        <input required type="email" placeholder={text?.booking?.email || 'E-posta'} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:border-[#E8622A] focus:bg-white shadow-sm" value={formData.email} onChange={handleBookingEmailChange} />

                        <div className="flex items-start gap-3 mt-4 mb-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <input
                            type="checkbox"
                            id="customer-terms"
                            checked={isTermsAccepted}
                            onChange={(e) => setIsTermsAccepted(e.target.checked)}
                            className="mt-0.5 w-5 h-5 text-[#E8622A] border-slate-300 rounded focus:ring-[#E8622A] cursor-pointer shrink-0"
                          />
                          <label htmlFor="customer-terms" className="text-[11px] text-slate-500 leading-relaxed cursor-pointer text-left">
                            Bookcy <a href="/yasal/sartlar" target="_blank" className="text-[#E8622A] font-bold hover:underline">Kullanıcı Hizmet Sözleşmesi</a>'ni okudum. Bookcy'nin yalnızca bir aracı platform olduğunu; hizmet kalitesi, ücretlendirme, iptal işlemleri veya işletmede yaşanacak her türlü uyuşmazlıkta tek muhatabımın randevu aldığım işletme olduğunu kabul ediyorum.
                          </label>
                        </div>

                        <button 
                          type="submit" 
                          disabled={!isTermsAccepted} 
                          className={`w-full py-5 rounded-2xl mt-2 uppercase font-black text-sm tracking-[0.2em] border-none transition-all shadow-lg hover:shadow-xl ${!isTermsAccepted ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#E8622A] text-white hover:bg-orange-600 hover:-translate-y-1 cursor-pointer'}`}
                        >
                          {text?.booking?.confirm || 'Onayla ve Bitir'}
                        </button>
                      </form>
                  )}
              </div>
          </div>
      </div>

      {/* --- BEKLEME LİSTESİ POP-UP (MODAL) EKRANI --- */}
      {showWaitlistModal && (
        <div className="fixed inset-0 bg-[#2D1B4E]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-8 md:p-10 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-300 border border-slate-200">
            <button onClick={() => setShowWaitlistModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 bg-transparent border-none cursor-pointer text-xl font-bold">✕</button>
            
            {waitlistStatus === 'success' ? (
                <div className="text-center py-6">
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><CheckCircle2 size={40}/></div>
                    <h3 className="text-2xl font-black text-[#2D1B4E] mb-3 uppercase tracking-tight">Listeye Eklendiniz!</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">Bu saat için sıraya girdiniz. Randevuda yer açıldığı an size hemen bir e-posta göndereceğiz.</p>
                </div>
            ) : (
                <>
                    <div className="text-center mb-8">
                      <div className="inline-block bg-orange-50 text-[#E8622A] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest mb-4">Akıllı Bekleme Listesi</div>
                      <h3 className="text-2xl font-black text-[#2D1B4E] mb-2 uppercase tracking-tight">Bu Saat Dolu 😔</h3>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed"><strong>{bookingData?.date} | {waitlistTime}</strong> saati için sıraya girin. İptal olursa ilk siz kapın!</p>
                    </div>
                    
                    <form onSubmit={handleWaitlistSubmit} className="flex flex-col gap-4">
                        <input required placeholder="Adınız Soyadınız" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:border-[#E8622A] shadow-sm" value={waitlistForm.name} onChange={(e) => setWaitlistForm({...waitlistForm, name: e.target.value})} />
                        <input required type="tel" placeholder="Telefon Numaranız" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:border-[#E8622A] shadow-sm" value={waitlistForm.phone} onChange={(e) => setWaitlistForm({...waitlistForm, phone: e.target.value})} />
                        <input required type="email" placeholder="E-posta Adresiniz" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:border-[#E8622A] shadow-sm" value={waitlistForm.email} onChange={(e) => setWaitlistForm({...waitlistForm, email: e.target.value})} />
                        
                        <button type="submit" disabled={waitlistStatus === 'loading'} className="w-full bg-[#E8622A] text-white py-5 rounded-2xl mt-4 font-black uppercase text-sm tracking-[0.2em] border-none cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {waitlistStatus === 'loading' ? 'İşleniyor...' : 'Bana Haber Ver 🔔'}
                        </button>
                    </form>
                </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}