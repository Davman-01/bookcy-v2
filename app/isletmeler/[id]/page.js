"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, ChevronLeft, Gem, CheckCircle2, Scissors, Users, CalendarOff } from 'lucide-react';
import { useAppContext } from '../../providers';
import { supabase } from '../../../lib/supabase';

// Sektör Bileşenleri
import TattooFlow from '../../../components/Sectors/TattooFlow';

// Yarım saatlik randevu saatleri
const timeSlots = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"];

export default function ShopDetail() {
  const params = useParams();
  const router = useRouter();
  const { lang = 'TR', shops } = useAppContext();
  
  const [selectedShop, setSelectedShop] = useState(null);
  const [bookingPhase, setBookingPhase] = useState(1);
  const [formData, setFormData] = useState({ name: '', surname: '', phone: '', email: '' }); 
  const [bookingData, setBookingData] = useState({ date: new Date().toISOString().split('T')[0], time: '', selectedShopService: null, selectedStaff: null });
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  useEffect(() => {
    if (shops?.length > 0 && params?.id) {
      const shop = shops.find(s => String(s.id) === String(params.id));
      if (shop) setSelectedShop(shop);
    }
  }, [shops, params?.id]);

  if (!selectedShop) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">Yükleniyor...</div>;

  const handleBooking = async (e) => {
    e.preventDefault();
    if(!isTermsAccepted) return alert("Sözleşmeyi kabul etmelisiniz.");
    if(!bookingData.time) return alert("Saat seçmelisiniz.");
    if(!bookingData.selectedStaff) return alert("Uzman seçmelisiniz.");

    const { error } = await supabase.from('appointments').insert([{ 
        shop_id: selectedShop.id, 
        customer_name: formData.name + " " + formData.surname, 
        customer_phone: formData.phone,
        customer_email: formData.email,
        appointment_date: bookingData.date,
        appointment_time: bookingData.time,
        staff_name: bookingData.selectedStaff?.name || 'Fark Etmez',
        service_name: bookingData.selectedShopService?.name || 'Randevu',
        status: 'Bekliyor'
    }]);
    if (!error) {
        setBookingPhase('success');
        window.scrollTo(0,0);
    }
    else alert("Hata: " + error.message);
  };

  if (bookingPhase === 'success') {
      return ( <div className="w-full min-h-screen flex items-center justify-center bg-[#FAF7F2] p-4"><div className="text-center bg-white p-12 md:p-20 rounded-[40px] shadow-2xl animate-in zoom-in"><CheckCircle2 size={80} className="text-green-500 mx-auto mb-6"/><h2 className="text-3xl md:text-4xl font-black uppercase">BAŞARILI!</h2><p className="text-slate-500 mt-2 font-bold">Randevu talebiniz iletildi. Sizinle iletişime geçeceğiz.</p><button onClick={() => router.push('/')} className="mt-10 bg-[#E8622A] text-white px-12 py-5 rounded-full font-black cursor-pointer uppercase shadow-lg hover:scale-105 transition-all">Ana Sayfa</button></div></div> );
  }

  const isShopClosedToday = false; // Basitlik için true varsayıyoruz, backend entegrasyonuna göre değişir.

  return (
    <div className="w-full bg-[#FAF7F2] pt-10 md:pt-24 px-4 md:px-8 pb-20 min-h-screen relative overflow-hidden">
      <button onClick={() => router.push('/isletmeler')} className="flex items-center text-slate-400 hover:text-[#E8622A] mb-6 text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none cursor-pointer transition-colors relative z-10"><ChevronLeft size={16} className="mr-2"/> GERİ DÖN</button>
      
      {/* ÜST KAPAK & LOGO */}
      <div className="w-full max-w-7xl mx-auto h-[200px] md:h-[300px] rounded-[32px] overflow-hidden relative mb-20 border border-slate-200 bg-slate-50 shadow-sm relative z-10">
          {selectedShop?.cover_url && <img src={selectedShop.cover_url} className="w-full h-full object-cover" alt="cover" />}
          {/* LOGO DÜZELTME: Kutu genişledi, object-contain eklendi */}
          <div className="absolute -bottom-10 left-6 md:left-12 w-28 h-28 md:w-36 md:h-36 rounded-[24px] bg-white border-4 border-white shadow-lg flex items-center justify-center z-10 overflow-hidden p-2">
              {selectedShop?.logo_url ? <img src={selectedShop.logo_url} className="w-full h-full object-contain" alt="logo" /> : <div className="text-[#E8622A] font-black">LOGO</div>}
          </div>
      </div>
      
      <div className="w-full max-w-7xl mx-auto mb-10 border-b border-slate-200 pb-8 px-2 md:px-6 relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-2xl md:text-4xl font-black uppercase text-[#2D1B4E] tracking-tight">{selectedShop?.name}</h1>
              {selectedShop?.package?.includes('Premium') && <Gem size={28} className="text-yellow-500 fill-yellow-500"/>}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span className="text-[#E8622A] px-3 py-1.5 bg-orange-50 rounded-lg">{selectedShop?.category}</span>
              <span className="flex items-center gap-1"><MapPin size={14}/> {selectedShop?.address || selectedShop?.location || 'Kıbrıs'}</span>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto relative z-10">
          <div className="lg:col-span-7">
              {/* TRAFİK POLİSİ MANTIĞI */}
              {['Dövme', 'Tattoo', 'Tattoo Studio', 'Dövme Stüdyosu'].includes(selectedShop.category) ? (
                  <TattooFlow 
                    shop={selectedShop} 
                    setBookingData={setBookingData}
                    setBookingPhase={setBookingPhase}
                  />
              ) : (
                  <div className="p-10 text-center bg-white rounded-[40px] border">Bu sektör için özel akış yakında eklenecek.</div>
              )}
          </div>

          {/* ESKİ RANDEVU SİSTEMİ (SAĞ PANEL) */}
          <div className="lg:col-span-5 relative mt-10 lg:mt-0">
              <div className="lg:sticky lg:top-28 bg-white border border-slate-200 rounded-[40px] p-6 md:p-10 flex flex-col shadow-xl min-h-[500px]">
                  <div className="flex justify-between items-center mb-8 border-b pb-6">
                      <h3 className="text-xl md:text-2xl font-black uppercase text-[#2D1B4E] tracking-tight">{bookingPhase === 1 ? 'Seçim Yapın' : 'Randevu Al'}</h3>
                      {bookingPhase > 1 && <button onClick={() => setBookingPhase(bookingPhase - 1)} className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-4 py-2 rounded-xl border-none cursor-pointer tracking-widest flex items-center"><ChevronLeft size={14} className="mr-1"/>Geri</button>}
                  </div>
                  
                  {bookingPhase === 1 && <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40"><Scissors size={48} className="mb-4 text-slate-300"/> <p className="font-bold uppercase text-xs tracking-widest text-slate-500">Piercing Seçerek Başlayın</p></div>}
                  
                  {/* ESKİ DÜZEN 1. ADIM: Tarih, Saat ve Uzman Seçimi */}
                  {bookingPhase === 2 && (
                      <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-300">
                          {/* 1. Tarih Seçimi */}
                          <div><label className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Tarih Seçin</label><input type="date" min={new Date().toISOString().split('T')[0]} value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} className="w-full p-4 rounded-xl border border-slate-200 font-bold bg-white text-[#2D1B4E] shadow-sm" /></div>
                          
                          {/* 2. Saat Seçimi (Yarım Saat Aralar) */}
                          <div><label className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Saat Seçin</label>{isShopClosedToday ? ( <div className="p-6 text-center text-red-500 font-bold bg-red-50 rounded-2xl border">Kapalı</div> ) : ( <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar"> {timeSlots.map(s => <button key={s} type="button" onClick={() => setBookingData({...bookingData, time: s})} className={`p-3 border rounded-xl text-xs font-bold transition-all ${bookingData.time === s ? 'bg-[#E8622A] text-white border-[#E8622A] shadow-md scale-105' : 'bg-white hover:border-[#E8622A] hover:bg-orange-50'}`}>{s}</button>)} </div> )}</div>

                          {/* 3. Uzman Seçimi */}
                          <div><label className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Uzman Seçin</label><div className="grid grid-cols-2 gap-3">
                              <div onClick={() => setBookingData({...bookingData, selectedStaff: { name: 'Fark Etmez' }})} className={`p-4 border rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${bookingData.selectedStaff?.name === 'Fark Etmez' ? 'border-[#E8622A] bg-orange-50' : 'border-slate-200 hover:border-[#E8622A]'}`}><Users size={16} className="text-slate-400"/><span className="font-bold text-sm">Fark Etmez</span></div>
                              {selectedShop?.staff?.map(p => <div key={p.id} onClick={() => setBookingData({...bookingData, selectedStaff: p})} className={`p-4 border rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${bookingData.selectedStaff?.id === p.id ? 'border-[#E8622A] bg-orange-50' : 'border-slate-200 hover:border-[#E8622A]'}`}><div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-[10px]">{p.name.charAt(0)}</div><span className="font-bold text-sm">{p.name}</span></div>)}
                          </div></div>

                          <button onClick={() => { if(bookingData.time && bookingData.selectedStaff) setBookingPhase(3); else alert("Lütfen saat ve uzman seçin."); }} className="bg-[#E8622A] text-white py-5 rounded-2xl font-black uppercase tracking-widest border-none cursor-pointer shadow-lg mt-auto transition-all hover:scale-105">Devam Et</button>
                      </div>
                  )}

                  {/* ESKİ DÜZEN 2. ADIM: Kişisel Bilgiler ve Sözleşme */}
                  {bookingPhase === 3 && (
                      <form onSubmit={handleBooking} className="flex flex-col gap-5 animate-in fade-in duration-300">
                          <div className="bg-orange-50 p-5 rounded-3xl mb-2 text-[#E8622A] font-bold text-sm border border-orange-100 flex flex-col gap-2">
                              <div>{bookingData.selectedShopService?.name}</div>
                              <div className="text-xs text-slate-500">{bookingData.date} | {bookingData.time} | Uzman: {bookingData.selectedStaff?.name}</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                              <input required placeholder="Adınız" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm" />
                              <input required placeholder="Soyadınız" value={formData.surname} onChange={(e) => setFormData({...formData, surname: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm" />
                          </div>
                          <input required type="email" placeholder="E-posta Adresiniz" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm" />
                          <input required type="tel" placeholder="Telefon Numaranız (WhatsApp)" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm" />
                          
                          {/* SÖZLEŞME ONAYI */}
                          <div className="flex items-start gap-3 mt-4 border-t pt-6 border-slate-100">
                              <input required type="checkbox" id="terms" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} className="mt-1 accent-[#E8622A] cursor-pointer" />
                              <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer">Rezervasyon ve kişisel verilerimin işlenmesine ilişkin <span className="text-[#E8622A] font-bold underline">kullanım şartlarını ve aydınlatma metnini</span> okudum, onaylıyorum.</label>
                          </div>
                          
                          <button type="submit" className="bg-[#E8622A] text-white py-5 rounded-2xl font-black uppercase tracking-widest border-none cursor-pointer shadow-lg mt-4 transition-all hover:scale-105">Randevuyu Tamamla</button>
                      </form>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}