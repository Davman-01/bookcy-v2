"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CalendarX, Clock, Phone, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/app/providers';

// Tüm asıl mantığı bu alt bileşene aldık
function AppointmentCheckContent() {
  const { lang = 'TR', t } = useAppContext();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sayfa açıldığında URL'de telefon varsa otomatik sorgula
  useEffect(() => {
    if (searchParams.get('phone')) { handleSearch(null, searchParams.get('phone')); }
  }, [searchParams]);

  const handleSearch = async (e, directPhone = null) => {
    if (e) e.preventDefault();
    const searchNumber = directPhone || phone;
    if (!searchNumber) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*, shops(name)')
      .eq('customer_phone', searchNumber)
      .order('appointment_date', { ascending: false });

    if (!error) setAppointments(data);
    setLoading(false);
  };

  const cancelAppointment = async (appt) => {
    // 1 SAAT KONTROLÜ
    const apptDateTime = new Date(`${appt.appointment_date}T${appt.appointment_time}`);
    const now = new Date();
    const diffInMs = apptDateTime - now;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
      alert("Randevuya 1 saatten az kaldığı için sistem üzerinden iptal edilemez. Lütfen işletme ile iletişime geçiniz.");
      return;
    }

    if (!window.confirm("Bu randevuyu iptal etmek istediğinize emin misiniz?")) return;

    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appt.id);

    if (!error) {
      alert("Randevunuz başarıyla iptal edildi.");
      handleSearch();
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-[#2D1B4E] uppercase tracking-tight mb-4">Randevu Sorgula & İptal Et</h1>
        <p className="text-slate-500 font-medium">Telefon numaranız ile aktif randevularınızı yönetebilirsiniz.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-12 max-w-md mx-auto">
        <div className="relative flex-1">
          <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            required type="tel" placeholder="Telefon Numaranız" 
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:border-[#E8622A] shadow-sm"
            value={phone} onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button className="bg-[#2D1B4E] text-white px-8 rounded-2xl font-black text-xs uppercase cursor-pointer hover:bg-[#E8622A] transition-all border-none">
          SORGULA
        </button>
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 font-bold text-slate-400 animate-pulse">RANDEVULAR GETİRİLİYOR...</div>
        ) : appointments.length > 0 ? (
          appointments.map(appt => (
            <div key={appt.id} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left w-full">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${appt.status === 'cancelled' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                  {appt.status === 'cancelled' ? <CalendarX size={24}/> : <Clock size={24}/>}
                </div>
                <div>
                  <h3 className="font-black text-[#2D1B4E] uppercase text-sm">{appt.shops?.name}</h3>
                  <p className="text-xs font-bold text-slate-500">{appt.service_name} • {appt.appointment_date} - {appt.appointment_time}</p>
                  {appt.status === 'cancelled' && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 block">İPTAL EDİLDİ</span>}
                </div>
              </div>
              {appt.status !== 'cancelled' && (
                <button 
                  onClick={() => cancelAppointment(appt)}
                  className="w-full md:w-auto bg-red-50 text-red-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase border border-red-100 hover:bg-red-600 hover:text-white transition-all cursor-pointer shrink-0"
                >
                  İPTAL ET
                </button>
              )}
            </div>
          ))
        ) : phone && (
          <div className="text-center py-10 bg-slate-100 rounded-[32px] border-2 border-dashed border-slate-200">
             <AlertCircle size={40} className="mx-auto text-slate-400 mb-4" />
             <p className="text-slate-500 font-bold">Bu numaraya ait randevu bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Ana bileşen kalkan görevi görüyor (Suspense)
export default function AppointmentCheckPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6 flex flex-col">
      <Suspense fallback={<div className="text-center mt-20 font-bold text-slate-400 animate-pulse">Sayfa Yükleniyor...</div>}>
        <AppointmentCheckContent />
      </Suspense>
    </div>
  );
}