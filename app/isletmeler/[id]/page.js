"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, ChevronLeft, Gem, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../providers';
import { supabase } from '../../../lib/supabase';

// Sektör Bileşenleri
import TattooFlow from '../../../components/Sectors/TattooFlow';
import StandardFlow from '../../../components/Sectors/StandardFlow';
import BarClubFlow from '../../../components/Sectors/BarClubFlow'; // BAR CLUB EKLENDİ

// Yarım saatlik randevu saatleri (Ortak)
const timeSlots = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00"];

export default function ShopDetail() {
  const params = useParams();
  const router = useRouter();
  const { lang = 'TR', shops } = useAppContext();
  
  const [selectedShop, setSelectedShop] = useState(null);
  const [bookingPhase, setBookingPhase] = useState(1);
  // Not alanı buraya eklendi
  const [formData, setFormData] = useState({ name: '', surname: '', phone: '', email: '', note: '' }); 
  const [bookingData, setBookingData] = useState({ date: new Date().toISOString().split('T')[0], time: '', selectedShopService: null, selectedStaff: null, selectedEvent: null });

  useEffect(() => {
    if (shops?.length > 0 && params?.id) {
      const shop = shops.find(s => String(s.id) === String(params.id));
      if (shop) setSelectedShop(shop);
    }
  }, [shops, params?.id]);

  if (!selectedShop) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">Yükleniyor...</div>;

  const isBarClub = ['Bar & Club', 'Gece Kulübü', 'Bar', 'Club'].includes(selectedShop.category);

  const handleBooking = async (e) => {
    e.preventDefault();
    if(!bookingData.time) return alert("Saat seçmelisiniz.");
    // Eğer mekan Bar/Club değilse uzman seçimi zorunludur
    if(!bookingData.selectedStaff && !isBarClub) return alert("Uzman seçmelisiniz.");

    const { error } = await supabase.from('appointments').insert([{ 
        shop_id: selectedShop.id, 
        customer_name: formData.name + " " + formData.surname, 
        customer_phone: formData.phone,
        customer_email: formData.email,
        customer_note: formData.note || '', // NOT (AÇIKLAMA) VERİTABANINA GÖNDERİLİYOR
        appointment_date: bookingData.date,
        appointment_time: bookingData.time,
        staff_name: bookingData.selectedStaff?.name || 'Fark Etmez',
        service_name: bookingData.selectedShopService?.name || bookingData.selectedEvent?.name || 'Rezervasyon',
        status: 'Bekliyor'
    }]);
    
    if (!error) {
        setBookingPhase('success');
        window.scrollTo(0,0);
    }
    else alert("Hata: " + error.message);
  };

  if (bookingPhase === 'success') {
      return ( <div className="w-full min-h-screen flex items-center justify-center bg-[#FAF7F2] p-4"><div className="text-center bg-white p-12 md:p-20 rounded-[40px] shadow-2xl animate-in zoom-in"><CheckCircle2 size={80} className="text-green-500 mx-auto mb-6"/><h2 className="text-3xl md:text-4xl font-black uppercase">BAŞARILI!</h2><p className="text-slate-500 mt-2 font-bold">Talebiniz başarıyla iletildi. İşletme sizinle iletişime geçecektir.</p><button onClick={() => router.push('/')} className="mt-10 bg-[#E8622A] text-white px-12 py-5 rounded-full font-black cursor-pointer uppercase shadow-lg hover:scale-105 transition-all">Ana Sayfa</button></div></div> );
  }

  const bookingHelpers = { bookingPhase, setBookingPhase, bookingData, setBookingData, formData, setFormData, handleBooking };

  return (
    <div className="w-full bg-[#FAF7F2] pt-10 md:pt-24 px-4 md:px-8 pb-20 min-h-screen relative overflow-hidden">
      <button onClick={() => router.push('/isletmeler')} className="flex items-center text-slate-400 hover:text-[#E8622A] mb-6 text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none cursor-pointer transition-colors relative z-10"><ChevronLeft size={16} className="mr-2"/> GERİ DÖN</button>
      
      {/* ÜST KAPAK & LOGO */}
      <div className="w-full max-w-7xl mx-auto h-[200px] md:h-[300px] rounded-[32px] overflow-hidden relative mb-20 border border-slate-200 bg-slate-50 shadow-sm relative z-10">
          {selectedShop?.cover_url && <img src={selectedShop.cover_url} className="w-full h-full object-cover" alt="cover" />}
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

      {/* Sektör Yönlendirmesi (Trafik Polisi) */}
      <div className="max-w-7xl mx-auto relative z-10">
          {['Dövme', 'Tattoo', 'Tattoo Studio', 'Dövme Stüdyosu'].includes(selectedShop.category) ? (
              <TattooFlow shop={selectedShop} bookingHelpers={bookingHelpers} currentAvailableSlots={timeSlots} />
          ) : isBarClub ? (
              // BAR & CLUB YÖNLENDİRMESİ
              <BarClubFlow shop={selectedShop} bookingHelpers={bookingHelpers} />
          ) : (
              // Berberler, Kuaförler, Güzellik Merkezleri
              <StandardFlow shop={selectedShop} bookingHelpers={bookingHelpers} currentAvailableSlots={timeSlots} />
          )}
      </div>
    </div>
  );
}