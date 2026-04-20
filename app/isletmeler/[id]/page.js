"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, ChevronLeft, Gem, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../providers';
import { supabase } from '../../../lib/supabase';

// MODÜL YOLLARI DÜZELTİLDİ (Vercel Hatası Almazsın)
import TattooFlow from '../../../components/Sectors/TattooFlow';
import BarClubFlow from '../../../components/Sectors/BarClubFlow';
import StandardFlow from '../../../components/Sectors/StandardFlow';

export default function ShopDetail() {
  const params = useParams();
  const router = useRouter();
  const { lang = 'TR', shops } = useAppContext();
  
  const [selectedShop, setSelectedShop] = useState(null);
  const [bookingPhase, setBookingPhase] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '' }); 
  const [bookingData, setBookingData] = useState({ date: new Date().toISOString().split('T')[0], time: '', selectedShopService: null, selectedEvent: null });

  useEffect(() => {
    if (shops?.length > 0 && params?.id) {
      const shop = shops.find(s => String(s.id) === String(params.id));
      if (shop) setSelectedShop(shop);
    }
  }, [shops, params?.id]);

  if (!selectedShop) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest">Yükleniyor...</div>;

  const handleBooking = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('appointments').insert([{ 
        shop_id: selectedShop.id, 
        customer_name: formData.name, 
        customer_phone: formData.phone,
        appointment_date: bookingData.date,
        appointment_time: bookingData.time,
        service_name: bookingData.selectedShopService?.name || bookingData.selectedEvent?.name || 'Rezervasyon'
    }]);
    if (!error) setBookingPhase('success');
    else alert("Hata: " + error.message);
  };

  if (bookingPhase === 'success') {
      return ( <div className="w-full min-h-screen flex items-center justify-center bg-[#FAF7F2]"><div className="text-center bg-white p-20 rounded-[40px] shadow-2xl animate-in zoom-in"><CheckCircle2 size={80} className="text-green-500 mx-auto mb-6"/><h2 className="text-4xl font-black uppercase">Tamamlandı!</h2><p className="text-slate-500 mt-2 font-bold">Randevu talebiniz işletmeye iletildi.</p><button onClick={() => router.push('/')} className="mt-10 bg-[#E8622A] text-white px-12 py-5 rounded-full font-black cursor-pointer uppercase shadow-lg hover:scale-105 transition-all">Ana Sayfa</button></div></div> );
  }

  // Randevu Saatleri
  const timeSlots = ["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00","18:00"];

  const renderSectorFlow = () => {
    const helpers = { bookingPhase, setBookingPhase, bookingData, setBookingData, formData, setFormData, handleBooking };
    const cat = selectedShop.category;

    if (['Dövme', 'Tattoo', 'Tattoo Studio', 'Dövme Stüdyosu'].includes(cat)) {
        return <TattooFlow shop={selectedShop} bookingHelpers={helpers} currentAvailableSlots={timeSlots} />;
    } else if (cat === 'Bar & Club') {
        return <BarClubFlow shop={selectedShop} bookingHelpers={helpers} />;
    } else {
        return <StandardFlow shop={selectedShop} bookingHelpers={helpers} currentAvailableSlots={timeSlots} />;
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] max-w-7xl mx-auto pt-10 md:pt-24 px-4 md:px-8 pb-20 min-h-screen relative">
      <button onClick={() => router.push('/isletmeler')} className="flex items-center text-slate-400 hover:text-[#E8622A] mb-6 text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none cursor-pointer transition-colors"><ChevronLeft size={16} className="mr-2"/> GERİ DÖN</button>
      
      <div className="w-full h-[200px] md:h-[300px] rounded-[32px] overflow-hidden relative mb-20 border border-slate-200 bg-slate-50 shadow-sm">
          {selectedShop?.cover_url && <img src={selectedShop.cover_url} className="w-full h-full object-cover" alt="cover" />}
          <div className="absolute -bottom-10 left-6 md:left-12 w-24 h-24 md:w-32 md:h-32 rounded-[24px] bg-white border-4 border-white shadow-lg flex items-center justify-center text-[#E8622A] font-black z-10 overflow-hidden">
              {selectedShop?.logo_url ? <img src={selectedShop.logo_url} className="w-full h-full object-cover" alt="logo" /> : "LOGO"}
          </div>
      </div>
      
      <div className="mb-10 border-b border-slate-200 pb-8 px-2 md:px-6">
          <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-2xl md:text-4xl font-black uppercase text-[#2D1B4E] tracking-tight">{selectedShop?.name}</h1>
              {selectedShop?.package?.includes('Premium') && <Gem size={28} className="text-yellow-500 fill-yellow-500"/>}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span className="text-[#E8622A] px-3 py-1.5 bg-orange-50 rounded-lg">{selectedShop?.category}</span>
              <span className="flex items-center gap-1"><MapPin size={14}/> {selectedShop?.address || selectedShop?.location || 'Kıbrıs'}</span>
          </div>
      </div>

      {renderSectorFlow()}
    </div>
  );
}