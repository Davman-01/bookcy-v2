"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CalendarX, Clock, Phone, AlertCircle, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppContext } from '@/app/providers';
import { getBookingCancellationTemplate } from '@/lib/emailTemplates';

function AppointmentCheckContent() {
  const { lang = 'TR', t } = useAppContext();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('phone') && searchParams.get('email')) { 
      handleSearch(null, searchParams.get('phone'), searchParams.get('email')); 
    }
  }, [searchParams]);

  const handleSearch = async (e, directPhone = null, directEmail = null) => {
    if (e) e.preventDefault();
    const searchNumber = directPhone || phone;
    const searchEmail = directEmail || email;
    if (!searchNumber || !searchEmail) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*, shops(name, admin_email)')
      .eq('customer_phone', searchNumber)
      .eq('customer_email', searchEmail)
      .order('appointment_date', { ascending: false });

    if (!error) setAppointments(data);
    setLoading(false);
  };

  const cancelAppointment = async (appt) => {
    const apptDateTime = new Date(`${appt.appointment_date}T${appt.appointment_time}`);
    const now = new Date();
    const diffInMs = apptDateTime - now;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
      alert("Randevuya 1 saatten az kaldığı için sistem üzerinden iptal edilemez. Lütfen işletme ile iletişime geçiniz.");
      return;
    }

    if (!window.confirm(`Geri alınamaz! ${appt.shops?.name} randevusunu iptal etmek istediğinize emin misiniz?`)) return;

    // Veritabanını Güncelle
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appt.id);

    if (!error) {
      alert("Randevunuz başarıyla iptal edildi.");
      handleSearch();

      // İŞLETMEYE BİLDİRİM MAİLİ AT (Opsiyonel ama çok profesyonel)
      if (appt.shops?.admin_email) {
        try {
          await fetch('/api/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: appt.shops.admin_email,
              subject: 'DİKKAT: Randevu İptal Edildi',
              html: getBookingCancellationTemplate({
                shopName: appt.shops.name,
                customerName: appt.customer_name,
                date: appt.appointment_date,
                time: appt.appointment_time,
                service: appt.service_name
              })
            })
          });
        } catch (mailErr) {
          console.error("İşletmeye iptal maili gönderilemedi:", mailErr);
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-[#2D1B4E] uppercase tracking-tight mb-4">Randevularım & İptal</h1>
        <p className="text-slate-500 font-medium">Telefon ve E-Posta adresiniz ile aktif randevularınızı yönetebilirsiniz.</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mb-12 max-w-2xl mx-auto bg-white p-4 rounded-[32px] shadow-lg border border-slate-200">
        <div className="relative flex-1">
          <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input required type="tel" placeholder="Telefon Numaranız" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:border-[#E8622A] transition-colors" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="relative flex-1">
          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input required type="email" placeholder="E-Posta Adresiniz" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:border-[#E8622A] transition-colors" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className="bg-[#E8622A] text-white px-8 py-4 md:py-0 rounded-2xl font-black text-xs uppercase cursor-pointer hover:bg-[#d5521b] transition-all border-none shadow-md">
          SORGULA
        </button>
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 font-bold text-slate-400 animate-pulse">RANDEVULAR YÜKLENİYOR...</div>
        ) : appointments.length > 0 ? (
          appointments.map(appt => (
            <div key={appt.id} className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-5 text-left w-full">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${appt.status === 'cancelled' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-indigo-50 text-[#2D1B4E] border border-indigo-100'}`}>
                  {appt.status === 'cancelled' ? <CalendarX size={28}/> : <Clock size={28}/>}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-[#2D1B4E] text-lg uppercase tracking-tight">{appt.shops?.name}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                    <span className="text-sm font-bold text-[#E8622A]">{appt.service_name}</span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className="text-sm font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md inline-block w-max">{appt.appointment_date} / {appt.appointment_time}</span>
                  </div>
                  {appt.status === 'cancelled' && <span className="text-[10px] font-black text-white bg-red-500 px-3 py-1 rounded-full uppercase tracking-widest mt-3 inline-block">İPTAL EDİLDİ</span>}
                </div>
              </div>
              {appt.status !== 'cancelled' && (
                <button 
                  onClick={() => cancelAppointment(appt)}
                  className="w-full md:w-auto bg-white text-red-500 px-8 py-4 rounded-xl font-black text-[10px] uppercase border-2 border-red-100 hover:bg-red-500 hover:text-white transition-all cursor-pointer shrink-0 shadow-sm"
                >
                  İPTAL ET
                </button>
              )}
            </div>
          ))
        ) : (phone && email) && (
          <div className="text-center py-16 bg-white rounded-[32px] border border-slate-200 shadow-sm">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
               <AlertCircle size={32} className="text-slate-400" />
             </div>
             <p className="text-slate-600 font-black text-lg">Bu bilgilere ait randevu bulunamadı.</p>
             <p className="text-slate-400 font-medium text-sm mt-2">Lütfen telefon ve e-posta adresinizi kontrol edin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppointmentCheckPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6 flex flex-col">
      <Suspense fallback={<div className="text-center mt-20 font-bold text-slate-400 animate-pulse">Sayfa Yükleniyor...</div>}>
        <AppointmentCheckContent />
      </Suspense>
    </div>
  );
}