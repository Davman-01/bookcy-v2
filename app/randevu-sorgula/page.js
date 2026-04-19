"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, LogIn, Phone, Mail, Lock, Calendar, Clock, 
  MapPin, XCircle, ChevronRight, User, Scissors, 
  CheckCircle2, AlertCircle, Loader2, Music 
} from 'lucide-react'; // Dün gece buradaki yazım hatasını düzelttik! 🎯

// --- SUPABASE BAĞLANTI YOLU ---
import { supabase } from '../../lib/supabase'; 

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.13l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05 1.78-3.14 1.76-1.09-.02-1.49-.68-2.74-.68-1.25 0-1.71.66-2.72.7-1.03.04-2.18-.87-3.18-1.83-2.06-1.95-3.63-5.52-3.63-8.86 0-5.32 3.39-8.12 6.59-8.12 1.01 0 1.95.36 2.76.36.79 0 1.93-.41 3.1-.41 1.25 0 4.7.45 5.76 4.93-3.66 1.48-3.08 6.4.55 7.82-.72 1.83-1.64 3.48-3.35 5.03zM12.03 3.86c-.14-2.18 1.63-4.04 3.51-4.14.28 2.27-1.93 4.14-3.51 4.14z"/></svg>
);

export default function CustomerPortal() {
  const router = useRouter();
  
  useEffect(() => {
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.push('/profilim');
    };
    checkExistingSession();
  }, [router]);
  
  const [activeTab, setActiveTab] = useState('search');
  const [searchType, setSearchType] = useState('phone'); 
  const [searchValue, setSearchValue] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue) return;
    setLoading(true);
    setErrorMsg('');
    setSearchResults(null);

    try {
      let query = supabase.from('appointments').select(`*, shops ( name, address, category )`);

      if (searchType === 'phone') {
        const cleanPhone = searchValue.trim().replace(/\s+/g, '');
        query = query.ilike('customer_phone', `%${cleanPhone}%`);
      } else {
        query = query.ilike('customer_email', `%${searchValue.trim()}%`);
      }

      const { data, error } = await query.order('appointment_date', { ascending: false });
      if (error) throw error;
      
      if (data && data.length > 0) {
        setSearchResults(data);
      } else {
        setErrorMsg(`Kayıt bulunamadı. Lütfen bilgilerinizi kontrol edin.`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Sorgulama sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointment) => {
    if (!window.confirm("Bu randevuyu iptal etmek istediğinize emin misiniz?")) return;
    setLoading(true);
    try {
      const { error: updateError } = await supabase.from('appointments').update({ status: 'İptal' }).eq('id', appointment.id);
      if (updateError) throw updateError;

      try {
        await fetch('/api/email/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shop_id: appointment.shop_id, date: appointment.appointment_date, time: appointment.appointment_time })
        });
      } catch (e) { console.log("Bildirim gönderilemedi."); }

      setSearchResults(searchResults.map(a => a.id === appointment.id ? { ...a, status: 'İptal' } : a));
      alert("Randevunuz başarıyla iptal edildi.");
    } catch (err) {
      alert("İptal işlemi başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider: provider, 
        options: { redirectTo: `${window.location.origin}/profilim` } 
      });
      if (error) throw error;
    } catch (err) {
      setErrorMsg(`Giriş başarısız.`);
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setErrorMsg('Bu giriş yöntemi şu an kapalıdır. Lütfen Google veya Apple kullanın.');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-['DM Sans'] pt-10 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
      
      {/* Süslemeler */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#E8622A]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2D1B4E]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-[550px] relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-200 mb-6 text-[#E8622A]">
            <Search size={36} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#2D1B4E] uppercase tracking-tight">Müşteri Portalı</h1>
          <p className="text-slate-500 font-bold text-sm mt-2">Randevularınızı yönetin ve işletmeleri keşfedin.</p>
        </div>

        <div className="bg-white p-1.5 rounded-2xl flex gap-1 shadow-sm border border-slate-200 mb-8">
          <button 
            onClick={() => {setActiveTab('search'); setErrorMsg('');}} 
            className={`flex-1 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border-none ${activeTab === 'search' ? 'bg-[#2D1B4E] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-[#2D1B4E]'}`}
          >
            Misafir Sorgula
          </button>
          <button 
            onClick={() => {setActiveTab('login'); setErrorMsg('');}} 
            className={`flex-1 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border-none ${activeTab === 'login' ? 'bg-[#2D1B4E] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-[#2D1B4E]'}`}
          >
            Üye Girişi / Kayıt
          </button>
        </div>

        {errorMsg && <div className="bg-red-50 border border-red-100 text-red-500 p-4 rounded-2xl mb-6 text-sm font-bold flex gap-3 animate-in slide-in-from-top-2"><AlertCircle size={18} className="shrink-0"/> {errorMsg}</div>}

        {activeTab === 'search' && (
          <div className="animate-in fade-in duration-300">
            {!searchResults ? (
              <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-200">
                <div className="flex gap-2 mb-8 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  <button onClick={() => {setSearchType('phone'); setSearchValue('');}} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none ${searchType === 'phone' ? 'bg-white text-[#E8622A] shadow-sm' : 'bg-transparent text-slate-400'}`}>Telefon</button>
                  <button onClick={() => {setSearchType('email'); setSearchValue('');}} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none ${searchType === 'email' ? 'bg-white text-[#E8622A] shadow-sm' : 'bg-transparent text-slate-400'}`}>E-Posta</button>
                </div>

                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                      {searchType === 'phone' ? <Phone size={20}/> : <Mail size={20}/>}
                    </div>
                    <input 
                      type={searchType === 'phone' ? 'tel' : 'email'} 
                      required 
                      value={searchValue} 
                      onChange={(e) => setSearchValue(e.target.value)} 
                      placeholder={searchType === 'phone' ? "5XX XXX XX XX" : "e-posta@adresiniz.com"} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-[20px] py-5 pl-14 pr-6 font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] focus:bg-white transition-all shadow-inner" 
                    />
                  </div>
                  <button type="submit" disabled={loading || !searchValue} className="w-full bg-[#E8622A] hover:bg-orange-600 text-white py-5 rounded-[20px] font-black text-sm uppercase tracking-[0.2em] shadow-lg hover:shadow-orange-500/20 transition-all hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-2 border-none cursor-pointer">
                    {loading ? <Loader2 className="animate-spin" size={20}/> : 'Randevularımı Getir'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="font-black text-[#2D1B4E] text-lg uppercase tracking-tight">Bulunan Randevular</h3>
                  <button onClick={() => setSearchResults(null)} className="text-[10px] font-black text-[#E8622A] uppercase tracking-widest bg-white border border-slate-200 px-4 py-2 rounded-full cursor-pointer hover:bg-slate-50">YENİ SORGU</button>
                </div>
                
                {searchResults.map((appt) => (
                  <div key={appt.id} className={`bg-white p-6 rounded-[32px] shadow-sm border relative overflow-hidden transition-all ${appt.status === 'İptal' ? 'border-red-50 opacity-60' : 'border-slate-200 hover:border-[#E8622A]'}`}>
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 bg-orange-50 text-[#E8622A] rounded-2xl flex items-center justify-center shrink-0 border border-orange-100">
                        {appt.shops?.category === 'Bar & Club' ? <Music size={24}/> : <Scissors size={24}/>}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="font-black text-xl text-[#2D1B4E] uppercase leading-tight">{appt.shops?.name}</h4>
                           <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${appt.status === 'İptal' ? 'bg-red-50 text-red-500' : appt.status === 'Tamamlandı' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{appt.status}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-5 uppercase tracking-tighter"><MapPin size={12}/> {appt.shops?.address || 'Konum Bilgisi Yok'}</p>
                        
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4 mb-5 shadow-inner">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tarih</span>
                            <span className="font-bold text-sm text-[#2D1B4E]">{appt.appointment_date}</span>
                          </div>
                          <div className="flex flex-col gap-1 text-right">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Saat</span>
                            <span className="font-black text-sm text-[#E8622A]">{appt.appointment_time}</span>
                          </div>
                          <div className="col-span-2 pt-3 border-t border-slate-200">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Hizmet Detayı</span>
                            <span className="font-bold text-sm text-[#2D1B4E]">{appt.service_name} {appt.staff_name && appt.staff_name !== 'Genel' ? `• ${appt.staff_name}` : ''}</span>
                          </div>
                        </div>

                        {appt.status !== 'İptal' && appt.status !== 'Tamamlandı' && (
                          <button onClick={() => handleCancelAppointment(appt)} className="w-full bg-white border border-red-100 text-red-500 hover:bg-red-50 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center justify-center gap-2">
                            <XCircle size={16}/> Randevuyu İptal Et
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* İÇERİK 2: GİRİŞ */}
        {activeTab === 'login' && (
          <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-200 animate-in slide-in-from-right-8 duration-500 text-center">
            <h3 className="font-black text-[#2D1B4E] text-2xl uppercase tracking-tight mb-4">Hoş Geldiniz</h3>
            <p className="text-slate-400 text-sm font-medium mb-10 text-balance">Randevularınızı tek bir hesaptan yönetmek için giriş yapın.</p>
            
            <div className="space-y-4 mb-8">
              <button onClick={() => handleSocialLogin('google')} className="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-[#E8622A] hover:bg-slate-50 transition-all cursor-pointer shadow-sm text-[#2D1B4E]">
                <GoogleIcon /> GOOGLE İLE DEVAM ET
              </button>
              <button onClick={() => handleSocialLogin('apple')} className="w-full flex items-center justify-center gap-4 bg-[#111] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all cursor-pointer shadow-lg">
                <AppleIcon /> APPLE İLE DEVAM ET
              </button>
            </div>

            <div className="relative mb-8">
              <hr className="border-slate-100" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">veya e-posta</span>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4 text-left">
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input type="email" required placeholder="E-posta Adresiniz" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 font-bold text-sm outline-none focus:border-[#E8622A] transition-colors shadow-inner" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#2D1B4E] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-[#1a0f2e] transition-all border-none cursor-pointer">
                DEVAM ET
              </button>
            </form>

            <p className="mt-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] leading-relaxed">
              Hesabınız yoksa giriş yaptığınızda <br/><span className="text-[#E8622A]">otomatik olarak</span> profiliniz oluşturulur.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}