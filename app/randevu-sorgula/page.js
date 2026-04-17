"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LogIn, Phone, Mail, Lock, Calendar, Clock, MapPin, XCircle, User, Scissors, CheckCircle2, AlertCircle, Loader2, Music } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.13l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);

export default function CustomerPortal() {
  const router = useRouter();
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push('/profilim');
    };
    checkSession();
  }, [router]);

  const [activeTab, setActiveTab] = useState('search');
  const [searchType, setSearchType] = useState('phone');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      let query = supabase.from('appointments').select(`*, shops ( name, address, category, admin_email )`);
      const cleanVal = searchValue.trim().replace(/\s+/g, '');
      if (searchType === 'phone') query = query.ilike('customer_phone', `%${cleanVal}%`);
      else query = query.ilike('customer_email', `%${cleanVal}%`);

      const { data, error } = await query.order('appointment_date', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) setSearchResults(data);
      else setErrorMsg('Randevu bulunamadı.');
    } catch (err) { setErrorMsg('Hata oluştu.'); } finally { setLoading(false); }
  };

  const handleCancel = async (appt) => {
    if (!window.confirm("İptal etmek istediğinize emin misiniz?")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('appointments').update({ status: 'İptal' }).eq('id', appt.id);
      if (error) throw error;
      await fetch('/api/email/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shop_id: appt.shop_id, date: appt.appointment_date, time: appt.appointment_time })});
      setSearchResults(searchResults.map(a => a.id === appt.id ? { ...a, status: 'İptal' } : a));
      alert("İptal edildi.");
    } catch (err) { alert("Hata oluştu."); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-['DM Sans'] pt-10 pb-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-[550px] animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white p-1.5 rounded-2xl flex gap-1 shadow-sm border border-slate-200 mb-8">
          <button onClick={() => setActiveTab('search')} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'search' ? 'bg-[#2D1B4E] text-white' : 'text-slate-400'}`}>Sorgula</button>
          <button onClick={() => setActiveTab('login')} className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'login' ? 'bg-[#2D1B4E] text-white' : 'text-slate-400'}`}>Üye Girişi</button>
        </div>

        {activeTab === 'search' && (
          <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-200">
            {!searchResults ? (
              <>
                <div className="flex gap-2 mb-6 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  <button onClick={() => setSearchType('phone')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase ${searchType === 'phone' ? 'bg-white text-[#E8622A] shadow-sm' : 'text-slate-400'}`}>Telefon</button>
                  <button onClick={() => setSearchType('email')} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase ${searchType === 'email' ? 'bg-white text-[#E8622A] shadow-sm' : 'text-slate-400'}`}>E-Posta</button>
                </div>
                <form onSubmit={handleSearch} className="space-y-5">
                  <input type="text" required value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder={searchType === 'phone' ? "5XX XXX XX XX" : "mail@ornek.com"} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-bold outline-none focus:border-[#E8622A]" />
                  <button type="submit" disabled={loading} className="w-full bg-[#E8622A] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg">{loading ? 'Aranıyor...' : 'Randevumu Bul'}</button>
                </form>
                {errorMsg && <p className="text-red-500 text-xs font-bold mt-4 text-center">{errorMsg}</p>}
              </>
            ) : (
              <div className="space-y-6">
                <button onClick={() => setSearchResults(null)} className="text-[10px] font-black text-slate-400 uppercase mb-4">Yeni Sorgu</button>
                {searchResults.map((appt) => (
                  <div key={appt.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50 relative">
                    <h4 className="font-black text-[#2D1B4E] uppercase">{appt.shops?.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 mb-3">{appt.appointment_date} | {appt.appointment_time}</p>
                    <p className="text-xs font-black text-[#E8622A] mb-4">{appt.service_name}</p>
                    
                    {/* İptal Butonu Şartı: Eğer zaten iptal veya tamamlandı değilse göster */}
                    {appt.status !== 'İptal' && appt.status !== 'Tamamlandı' ? (
                      <button onClick={() => handleCancel(appt)} className="w-full py-3 bg-white border border-red-200 text-red-500 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
                        <XCircle size={14}/> İşlemi İptal Et
                      </button>
                    ) : (
                      <div className={`text-center py-2 rounded-xl text-[10px] font-black uppercase ${appt.status === 'İptal' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {appt.status}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'login' && (
          <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-200 text-center">
            <h3 className="font-black text-[#2D1B4E] mb-6 uppercase">Hızlı Giriş</h3>
            <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-4 rounded-2xl font-bold text-sm shadow-sm"><GoogleIcon/> Google ile Devam Et</button>
          </div>
        )}
      </div>
    </div>
  );
}