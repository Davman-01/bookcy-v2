"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut, User, Calendar, Scissors, Music, MapPin, Loader2, Heart, XCircle } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        router.push('/randevu-sorgula');
        return;
      }
      
      setUser(session.user);
      
      // 1. Müşteri profilini çek
      const { data: cust } = await supabase
        .from('customers')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (cust) setCustomerData(cust);
      
      // 2. Müşterinin E-postasına Göre Randevularını Çek
      const userEmail = cust?.email || session.user.email;
      const { data: appts } = await supabase
        .from('appointments')
        .select('*, shops(name, address, category)')
        .eq('customer_email', userEmail)
        .order('appointment_date', { ascending: false });
        
      if (appts) setMyAppointments(appts);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/randevu-sorgula');
  }

  async function handleCancelAppointment(appointment) {
    if (!window.confirm("Bu randevuyu iptal etmek istediğinize emin misiniz?")) return;
    
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'İptal' })
        .eq('id', appointment.id);

      if (error) throw error;

      // Bekleme Listesi Radarını Tetikle
      try {
        await fetch('/api/email/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shop_id: appointment.shop_id,
            date: appointment.appointment_date,
            time: appointment.appointment_time
          })
        });
      } catch (err) {}

      setMyAppointments(myAppointments.map(a => a.id === appointment.id ? { ...a, status: 'İptal' } : a));
      alert("Randevunuz başarıyla iptal edildi.");
      
    } catch (err) {
      alert("İptal başarısız oldu.");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#E8622A] mb-4" size={48} />
        <p className="font-black text-[#2D1B4E] uppercase tracking-widest animate-pulse">Profiliniz Hazırlanıyor...</p>
      </div>
    );
  }

  const displayName = customerData?.full_name || user?.user_metadata?.full_name || 'Değerli Müşterimiz';
  const displayAvatar = customerData?.avatar_url || user?.user_metadata?.avatar_url;
  const activeCount = myAppointments.filter(a => (!a.status || a.status === 'Bekliyor')).length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-['DM Sans'] pt-10 pb-20 px-4 md:px-10">
      <div className="max-w-[1000px] mx-auto animate-in fade-in duration-500">
        
        {/* Üst Bilgi Kartı */}
        <div className="bg-[#2D1B4E] rounded-[40px] p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 mb-10 relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-[#E8622A]/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-24 h-24 bg-white/10 p-1 rounded-3xl backdrop-blur-sm border border-white/20">
              {displayAvatar ? (
                <img src={displayAvatar} className="w-full h-full object-cover rounded-[20px]" alt="Profil" />
              ) : (
                <div className="w-full h-full bg-[#E8622A] rounded-[20px] flex items-center justify-center font-black text-3xl">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#F5C5A3] uppercase tracking-widest mb-1">Bookcy Özel Üyesi</p>
              <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight">{displayName}</h1>
              <p className="text-sm font-medium text-white/70 mt-1">{customerData?.email || user?.email}</p>
            </div>
          </div>
          
          <button onClick={handleLogout} className="bg-white/10 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border border-white/20 hover:border-red-500 cursor-pointer transition-all z-10 w-full md:w-auto justify-center">
            <LogOut size={16}/> Çıkış Yap
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sol Kolon: Menü ve İstatistikler */}
          <div className="space-y-8">
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
              <h3 className="font-black text-lg text-[#2D1B4E] mb-6 border-b border-slate-100 pb-4">Hesap Özeti</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <div className="w-12 h-12 bg-white text-[#E8622A] rounded-xl flex items-center justify-center shadow-sm">
                    <Calendar size={20}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aktif Randevular</p>
                    <p className="text-xl font-black text-[#2D1B4E]">{activeCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-2xl border border-pink-100">
                  <div className="w-12 h-12 bg-white text-pink-500 rounded-xl flex items-center justify-center shadow-sm">
                    <Heart size={20}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Favori Mekanlar</p>
                    <p className="text-xl font-black text-[#2D1B4E]">0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Randevular */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm min-h-[400px]">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h3 className="font-black text-xl text-[#2D1B4E] flex items-center gap-2">
                  <Calendar className="text-[#E8622A]"/> Randevularım
                </h3>
              </div>
              
              {myAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 opacity-60">
                  <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                    <Scissors size={32}/>
                  </div>
                  <h4 className="font-black text-lg text-[#2D1B4E] uppercase">Randevunuz Yok</h4>
                  <p className="text-xs font-bold text-slate-400 mt-2 max-w-xs">Şu an için planlanmış bir işleminiz bulunmuyor. Hemen keşfetmeye başlayın!</p>
                  <button onClick={() => router.push('/')} className="mt-6 bg-[#E8622A] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest border-none cursor-pointer hover:scale-105 transition-transform shadow-md">
                    Keşfet
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myAppointments.map((appt) => (
                    <div key={appt.id} className={`bg-slate-50 p-6 rounded-[24px] border relative overflow-hidden transition-all ${appt.status === 'İptal' ? 'border-red-100 opacity-70' : 'border-slate-200 hover:border-[#E8622A]'}`}>
                      
                      {appt.status === 'İptal' && <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">İptal Edildi</div>}
                      {appt.status === 'Tamamlandı' && <div className="absolute top-0 right-0 bg-green-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Tamamlandı</div>}
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white text-[#E8622A] rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                          {appt.shops?.category === 'Bar & Club' ? <Music size={20}/> : <Scissors size={20}/>}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-lg text-[#2D1B4E] uppercase leading-none mb-1">{appt.shops?.name || 'İşletme'}</h4>
                          <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-3"><MapPin size={12}/> {appt.shops?.address || 'Konum belirtilmemiş'}</p>
                          
                          <div className="bg-white p-4 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 mb-4">
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Tarih & Saat</span>
                              <span className="font-bold text-sm text-[#2D1B4E]">{appt.appointment_date} | <span className="text-[#E8622A] font-black">{appt.appointment_time}</span></span>
                            </div>
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Hizmet</span>
                              <span className="font-bold text-sm text-[#2D1B4E]">{appt.service_name}</span>
                            </div>
                          </div>

                          {(!appt.status || appt.status === 'Bekliyor') && (
                            <button onClick={() => handleCancelAppointment(appt)} disabled={actionLoading} className="w-full bg-white border border-red-200 text-red-500 hover:bg-red-50 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
                              <XCircle size={16}/> {actionLoading ? 'İptal Ediliyor...' : 'İşlemi İptal Et'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}