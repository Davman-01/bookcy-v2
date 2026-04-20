"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Star, ChevronLeft, Calendar, Clock, Music, Scissors, UserCircle, Users, CalendarOff, CheckCircle2, Gem, Phone, Mail, Link } from 'lucide-react';
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
  const [formData, setFormData] = useState({ name: '', surname: '', phoneCode: '+90', phone: '', email: '' }); 
  const [bookingData, setBookingData] = useState({ date: new Date().toISOString().split('T')[0], time: '', selectedShopService: null, selectedStaff: null, selectedEvent: null });
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  useEffect(() => {
    if (shops && shops.length > 0 && params?.id) {
      const shop = shops.find(s => String(s.id) === String(params.id));
      if (shop) {
        setSelectedShop(shop);
        // Dövme dükkanı kontrolü ve varsayılan sekme
        if (['Dövme', 'Tattoo', 'Dövme Stüdyosu', 'Tattoo Studio'].includes(shop.category)) {
            setProfileTab('quote'); 
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

  if (!selectedShop || !profileTab) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">Yükleniyor...</div>;

  const isTattooShop = ['Dövme', 'Tattoo', 'Dövme Stüdyosu', 'Tattoo Studio'].includes(selectedShop?.category);

  const getCurrentAvailableSlots = () => {
    if (!bookingData.date) return allTimeSlots;
    const dayName = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][new Date(bookingData.date).getDay()];
    let workingHours = defaultWorkingHours;
    if (Array.isArray(selectedShop?.working_hours)) workingHours = selectedShop.working_hours;
    else if (typeof selectedShop?.working_hours === 'string') { try { workingHours = JSON.parse(selectedShop.working_hours); } catch(e){} }
    const todayHours = workingHours.find(h => h?.day === dayName);
    if (todayHours && todayHours.isClosed) return []; 
    else if (todayHours?.open && todayHours?.close) return allTimeSlots.filter(slot => slot >= todayHours.open && slot < todayHours.close);
    return allTimeSlots;
  };

  const currentAvailableSlots = getCurrentAvailableSlots();
  const isShopClosedToday = currentAvailableSlots.length === 0;

  async function handleBooking(e) {
    e.preventDefault();
    const fullPhone = formData.phoneCode + " " + formData.phone;
    const { error } = await supabase.from('appointments').insert([{ shop_id: selectedShop.id, customer_name: formData.name, customer_surname: formData.surname, customer_phone: fullPhone, customer_email: formData.email, appointment_date: bookingData.date, appointment_time: bookingData.time, service_name: bookingData.selectedShopService?.name || 'Randevu', status: 'Bekliyor' }]);
    if (!error) { setBookingPhase('success'); window.scrollTo(0,0); } else { alert("Hata oluştu!"); }
  }

  if (bookingPhase === 'success') {
      return ( <div className="w-full bg-[#FAF7F2] min-h-screen pt-10"><div className="text-center py-20"><div className="w-32 h-32 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10"><CheckCircle2 size={64}/></div><h2 className="text-4xl font-black text-[#2D1B4E] uppercase mb-4 tracking-tight">Başarılı!</h2><button onClick={() => router.push('/')} className="bg-[#E8622A] text-white px-12 py-5 rounded-full font-black uppercase text-sm border-none cursor-pointer">Ana Sayfa</button></div></div> );
  }

  let parsedWorkingHours = defaultWorkingHours;
  if (Array.isArray(selectedShop?.working_hours)) parsedWorkingHours = selectedShop.working_hours;
  else if (typeof selectedShop?.working_hours === 'string') { try { parsedWorkingHours = JSON.parse(selectedShop.working_hours); } catch(e){} }

  return (
    <div className="w-full bg-[#FAF7F2] max-w-7xl mx-auto pt-10 md:pt-24 px-4 md:px-8 pb-20 min-h-screen relative">
      <button onClick={() => router.push('/isletmeler')} className="flex items-center text-slate-400 hover:text-[#E8622A] mb-6 text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none cursor-pointer transition-colors"><ChevronLeft size={16} className="mr-2"/> GERİ DÖN</button>
      
      <div className="w-full h-[200px] md:h-[300px] rounded-[32px] overflow-hidden relative mb-20 border border-slate-200 bg-slate-50 shadow-sm">
          {selectedShop?.cover_url && <img src={selectedShop.cover_url} className="w-full h-full object-cover" alt="kapak" />}
          <div className="absolute -bottom-10 md:-bottom-12 left-6 md:left-12 w-24 h-24 md:w-32 md:h-32 rounded-[24px] bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-[#E8622A] font-black z-10">
              {selectedShop?.logo_url ? <img src={selectedShop.logo_url} className="w-full h-full object-cover" alt="logo" /> : "LOGO"}
          </div>
      </div>
      
      <div className="mb-10 border-b border-slate-200 pb-8 px-2 md:px-6">
          <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-2xl md:text-4xl font-black uppercase text-[#2D1B4E] tracking-tight">{selectedShop?.name}</h1>
              {(selectedShop?.package?.includes('Premium')) && <Gem size={28} className="text-yellow-500 fill-yellow-500"/>}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span className="text-[#E8622A] px-3 py-1.5 bg-orange-50 rounded-lg">{selectedShop?.category}</span>
              <span className="flex items-center gap-1"><MapPin size={14}/> {selectedShop?.address || selectedShop?.location || 'Adres Girilmemiş'}</span>
          </div>
      </div>
      
      <div className="flex gap-6 md:gap-10 border-b border-slate-200 mb-10 overflow-x-auto custom-scrollbar px-2 md:px-6">
          {isTattooShop ? (
              <>
                  <button onClick={() => setProfileTab('quote')} className={`pb-4 text-sm md:text-base font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'quote' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>DÖVME</button>
                  <button onClick={() => setProfileTab('piercing')} className={`pb-4 text-sm md:text-base font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'piercing' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>PIERCING</button>
              </>
          ) : (
              <button onClick={() => setProfileTab('services')} className={`pb-4 text-sm md:text-base font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'services' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>HİZMETLER</button>
          )}
          <button onClick={() => setProfileTab('gallery')} className={`pb-4 text-sm md:text-base font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'gallery' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>GALERİ</button>
          <button onClick={() => setProfileTab('about')} className={`pb-4 text-sm md:text-base font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'about' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>HAKKINDA</button>
      </div>

      <div className={(profileTab === 'quote' || profileTab === 'piercing' || !isTattooShop) ? "w-full max-w-5xl mx-auto px-2 md:px-6" : "grid grid-cols-1 lg:grid-cols-12 gap-10"}>
          
          <div className={(profileTab === 'quote' || profileTab === 'piercing' || !isTattooShop) ? "w-full" : "lg:col-span-7"}>
              
              {profileTab === 'quote' && isTattooShop && <TattooBriefForm shopId={selectedShop?.id} />}

              {profileTab === 'piercing' && isTattooShop && (
                   <div className="flex flex-col gap-4">
                       {selectedShop?.services?.map(srv => (
                           <div key={srv.id} onClick={() => { setBookingData({...bookingData, selectedShopService: srv}); setBookingPhase(2); }} className="p-6 md:p-8 bg-white rounded-[32px] border border-slate-200 cursor-pointer flex justify-between items-center hover:border-[#E8622A] transition-all shadow-sm">
                               <div><h4 className="font-black text-lg text-[#2D1B4E]">{srv.name}</h4><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1"><Clock size={12} className="inline mr-1"/> {srv.duration} Dk</div></div>
                               <div className="flex items-center gap-6"><span className="font-black text-xl text-[#2D1B4E]">{srv.price} TL</span><button className="bg-slate-100 px-6 py-2 rounded-xl font-black text-[10px] uppercase border-none cursor-pointer">SEÇ</button></div>
                           </div>
                       ))}
                       {(!selectedShop?.services || selectedShop.services.length === 0) && <p className="p-10 text-center font-bold text-slate-400">Piercing hizmeti bulunamadı.</p>}
                   </div>
              )}

              {profileTab === 'services' && !isTattooShop && (
                  <div className="flex flex-col gap-4">
                      {selectedShop?.services?.map(srv => (
                           <div key={srv.id} onClick={() => { setBookingData({...bookingData, selectedShopService: srv}); setBookingPhase(2); }} className="p-6 md:p-8 bg-white rounded-[32px] border border-slate-200 cursor-pointer flex justify-between items-center hover:border-[#E8622A] shadow-sm">
                               <div><h4 className="font-black text-lg text-[#2D1B4E]">{srv.name}</h4></div>
                               <div className="flex items-center gap-6"><span className="font-black text-xl text-[#2D1B4E]">{srv.price} TL</span><button className="bg-[#E8622A] text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase border-none cursor-pointer">SEÇ</button></div>
                           </div>
                      ))}
                  </div>
              )}

              {profileTab === 'gallery' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedShop?.gallery?.map((img, idx) => (
                          <div key={idx} className="h-64 rounded-3xl overflow-hidden border border-slate-200 bg-slate-50"><img src={img} className="w-full h-full object-cover" alt="galeri" /></div>
                      ))}
                  </div>
              )}

              {profileTab === 'about' && (
                  <div className="flex flex-col gap-8">
                      <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[32px] shadow-sm">
                          <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-4">Hakkımızda</h3>
                          <p className="text-slate-600 text-sm font-medium whitespace-pre-wrap leading-relaxed">
                              {/* TÜM İHTİMALLERİ DENİYORUZ: description, about, bio, info, about_text */}
                              {selectedShop?.description || selectedShop?.about || selectedShop?.bio || selectedShop?.info || selectedShop?.about_text || 'İşletme açıklaması yakında eklenecek.'}
                          </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm flex flex-col gap-5">
                              <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-2 border-b pb-4">İletişim</h3>
                              <div className="flex items-center gap-3 text-slate-600 font-bold"><Phone size={18} className="text-[#E8622A]"/> {selectedShop?.phone || selectedShop?.mobile_phone || 'Bilinmiyor'}</div>
                              <div className="flex items-center gap-3 text-slate-600 font-bold"><Mail size={18} className="text-[#E8622A]"/> {selectedShop?.email || selectedShop?.admin_email || 'Bilinmiyor'}</div>
                              {selectedShop?.instagram && (
                                <a href={selectedShop.instagram.includes('instagram.com') ? selectedShop.instagram : `https://instagram.com/${selectedShop.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 font-bold hover:text-[#E8622A]"><Link size={18} className="text-[#E8622A]"/> Instagram Hesabımız</a>
                              )}
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

          {(profileTab === 'piercing' || !isTattooShop) && (
              <div className="lg:col-span-5 relative">
                  <div className="lg:sticky lg:top-28 bg-white border border-slate-200 rounded-[40px] p-6 md:p-10 flex flex-col shadow-xl min-h-[500px]">
                      <div className="flex justify-between items-center mb-8 border-b pb-6">
                          <h3 className="text-xl font-black uppercase text-[#2D1B4E]">{bookingPhase === 1 ? 'Seçim Yapın' : 'Randevu Al'}</h3>
                          {bookingPhase > 1 && <button onClick={() => setBookingPhase(bookingPhase - 1)} className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-4 py-2 rounded-xl border-none cursor-pointer">Geri</button>}
                      </div>
                      
                      {bookingPhase === 1 && <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40"><Scissors size={48} className="mb-4"/> <p className="font-bold uppercase text-xs tracking-widest">Hizmet Seçerek Başlayın</p></div>}
                      
                      {bookingPhase === 2 && (
                          <div className="flex-1 flex flex-col gap-4">
                              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Uzman Seçin</p>
                              <div onClick={() => { setBookingData({...bookingData, selectedStaff: { name: 'Fark Etmez' }}); setBookingPhase(3); }} className="p-4 border rounded-2xl cursor-pointer hover:border-[#E8622A] font-bold text-sm">Fark Etmez</div>
                              {selectedShop?.staff?.map(p => <div key={p.id} onClick={() => { setBookingData({...bookingData, selectedStaff: p}); setBookingPhase(3); }} className="p-4 border rounded-2xl cursor-pointer hover:border-[#E8622A] font-bold text-sm">{p.name}</div>)}
                          </div>
                      )}

                      {bookingPhase === 3 && (
                          <div className="flex-1 flex flex-col gap-4">
                              <input type="date" value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} className="w-full p-4 rounded-xl border border-slate-200 font-bold" />
                              <div className="grid grid-cols-3 gap-2">
                                  {currentAvailableSlots.map(s => <button key={s} onClick={() => { setBookingData({...bookingData, time: s}); setBookingPhase(4); }} className="p-2 border rounded-lg text-xs font-bold hover:bg-[#E8622A] hover:text-white transition-all cursor-pointer">{s}</button>)}
                              </div>
                          </div>
                      )}

                      {bookingPhase === 4 && (
                          <form onSubmit={handleBooking} className="flex flex-col gap-4">
                              <input required placeholder="Adınız" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-4 rounded-xl border bg-slate-50 font-bold" />
                              <input required placeholder="Soyadınız" value={formData.surname} onChange={(e) => setFormData({...formData, surname: e.target.value})} className="p-4 rounded-xl border bg-slate-50 font-bold" />
                              <input required type="tel" placeholder="Telefon" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="p-4 rounded-xl border bg-slate-50 font-bold" />
                              <button type="submit" className="bg-[#E8622A] text-white py-5 rounded-2xl font-black uppercase tracking-widest border-none cursor-pointer shadow-lg mt-4">Randevuyu Tamamla</button>
                          </form>
                      )}
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}