"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { LogOut, Calendar, Scissors, MapPin, Loader2, XCircle } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/randevu-sorgula');
      setUser(session.user);
      
      const { data: appts } = await supabase
        .from('appointments')
        .select('*, shops(name, address)')
        .eq('customer_email', session.user.email)
        .order('appointment_date', { ascending: false });
        
      if (appts) setMyAppointments(appts);
      setLoading(false);
    };
    fetchProfile();
  }, [router]);

  const handleCancel = async (appt) => {
    if (!window.confirm("Bu randevuyu iptal etmek istediğinize emin misiniz?")) return;
    try {
      const { error } = await supabase.from('appointments').update({ status: 'İptal' }).eq('id', appt.id);
      if (error) throw error;
      await fetch('/api/email/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shop_id: appt.shop_id, date: appt.appointment_date, time: appt.appointment_time })});
      setMyAppointments(myAppointments.map(a => a.id === appt.id ? { ...a, status: 'İptal' } : a));
      alert("Randevu iptal edildi.");
    } catch (err) { alert("Hata oluştu."); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black">YÜKLENİYOR...</div>;

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 md:p-12 font-['DM Sans']">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#2D1B4E] rounded-[32px] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 mb-10 shadow-xl">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#E8622A] rounded-2xl flex items-center justify-center font-black text-2xl uppercase">{(user?.user_metadata?.full_name || 'B').charAt(0)}</div>
              <div>
                <h2 className="font-black uppercase">{user?.user_metadata?.full_name || 'Müşteri'}</h2>
                <p className="text-xs opacity-60 font-bold">{user?.email}</p>
              </div>
           </div>
           <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="bg-white/10 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-white/20">Çıkış Yap</button>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
          <h3 className="font-black text-xl text-[#2D1B4E] mb-8 uppercase tracking-tight flex items-center gap-2"><Calendar className="text-[#E8622A]"/> Randevularım</h3>
          
          <div className="space-y-4">
            {myAppointments.map(appt => (
              <div key={appt.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-black text-lg text-[#2D1B4E] uppercase">{appt.shops?.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{appt.appointment_date} | {appt.appointment_time}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase ${appt.status === 'İptal' ? 'bg-red-100 text-red-600' : appt.status === 'Tamamlandı' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-[#E8622A]'}`}>
                    {appt.status || 'Bekliyor'}
                  </span>
                </div>
                
                <p className="text-sm font-bold text-[#2D1B4E] mb-4"><Scissors size={14} className="inline mr-1"/> {appt.service_name}</p>

                {/* İptal Butonu: Sadece İptal ve Tamamlandı değilse göster */}
                {appt.status !== 'İptal' && appt.status !== 'Tamamlandı' && (
                  <button onClick={() => handleCancel(appt)} className="w-full py-3 bg-white border border-red-200 text-red-500 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
                    <XCircle size={14}/> Randevuyu İptal Et
                  </button>
                )}
              </div>
            ))}
            {myAppointments.length === 0 && <p className="text-center py-10 font-bold text-slate-400 uppercase tracking-widest">Henüz randevunuz yok.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}