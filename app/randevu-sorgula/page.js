"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LogIn, Phone, Mail, Lock, Calendar, Clock, MapPin, XCircle, ChevronRight, User, Scissors, CheckCircle2, AlertCircle, Loader2, Music } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Google ve Apple ikonları için basit SVG'ler
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.13l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05 1.78-3.14 1.76-1.09-.02-1.49-.68-2.74-.68-1.25 0-1.71.66-2.72.7-1.03.04-2.18-.87-3.18-1.83-2.06-1.95-3.63-5.52-3.63-8.86 0-5.32 3.39-8.12 6.59-8.12 1.01 0 1.95.36 2.76.36.79 0 1.93-.41 3.1-.41 1.25 0 4.7.45 5.76 4.93-3.66 1.48-3.08 6.4.55 7.82-.72 1.83-1.64 3.48-3.35 5.03zM12.03 3.86c-.14-2.18 1.63-4.04 3.51-4.14.28 2.27-1.93 4.14-3.51 4.14z"/></svg>
);

export default function CustomerPortal() {
  const router = useRouter();
  
  // Zaten giriş yapmışsa direkt profile yolla
  useEffect(() => {
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/profilim');
      }
    };
    checkExistingSession();
  }, [router]);
  
  const [activeTab, setActiveTab] = useState('search');
  
  // Arama Stateleri
  const [searchType, setSearchType] = useState('phone'); // 'phone' veya 'email'
  const [searchValue, setSearchValue] = useState('');
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. ESNEK ARAMA (FUZZY SEARCH)
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
        setErrorMsg(`Bu ${searchType === 'phone' ? 'telefon numarasına' : 'e-posta adresine'} ait aktif randevu bulunamadı.`);
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
      } catch (apiErr) { console.log("Bekleme listesi radarı tetiklenirken hata oldu."); }

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
      const { error } = await supabase.auth.signInWithOAuth({ provider: provider, options: { redirectTo: `${window.location.origin}/profilim` } });
      if (error) throw error;
    } catch (err) {
      setErrorMsg(`${provider === 'google' ? 'Google' : 'Apple'} ile giriş başarısız oldu.`);
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setErrorMsg('Klasik üyelik sistemi şu an bakımda. Lütfen Google veya Apple ile giriş yapın.');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-['DM Sans'] pt-10 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
      
      {/* Arka Plan Süslemeleri */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#E8622A]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2D1B4E]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-[550px] relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Başlık Bölümü */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 mb-4 text-[#E8622A]">
            <User size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#2D1B4E] uppercase tracking-tight">Müşteri Portalı</h1>
          <p className="text-slate-500 font-bold text-sm mt-2">Randevularını yönet, favori mekanlarını kaydet.</p>
        </div>

        {/* Tab Menüsü */}
        <div className="bg-white p-1.5 rounded-2xl flex gap-1 shadow-sm border border-slate-200 mb-8">
          <button 
            onClick={() => {setActiveTab('search'); setErrorMsg(''); setSuccessMsg('');}} 
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border-none ${activeTab === 'search' ? 'bg-[#2D1B4E] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-[#2D1B4E]'}`}
          >
            Misafir Sorgulama
          </button>
          <button 
            onClick={() => {setActiveTab('login'); setErrorMsg(''); setSuccessMsg('');}} 
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border-none ${activeTab === 'login' ? 'bg-[#2D1B4E] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-[#2D1B4E]'}`}
          >
            Üye Girişi / Kayıt
          </button>
        </div>

        {/* Uyarı Mesajları */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-500 p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm font-bold shadow-sm animate-in slide-in-from-top-2">
            <AlertCircle size={18} className="shrink-0 mt-0.5"/>
            <p>{errorMsg}</p>
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 border border-green-100 text-green-600 p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm font-bold shadow-sm animate-in slide-in-from-top-2">
            <CheckCircle2 size={18} className="shrink-0 mt-0.5"/>
            <p>{successMsg}</p>
          </div>
        )}

        {/* İÇERİK 1: MİSAFİR SORGULAMA */}
        {activeTab === 'search' && (
          <div className="animate-in fade-in duration-300">
            {!searchResults ? (
              <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-200">
                <h3 className="font-black text-[#2D1B4E] text-lg mb-6 flex items-center gap-2">
                  <Search className="text-[#E8622A]"/> Randevunu Bul
                </h3>
                
                {/* Arama Tipi Seçici */}
                <div className="flex gap-2 mb-6 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  <button type="button" onClick={() => {setSearchType('phone'); setSearchValue('');}} className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none ${searchType === 'phone' ? 'bg-white text-[#E8622A] shadow-sm' : 'bg-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>Telefon</button>
                  <button type="button" onClick={() => {setSearchType('email'); setSearchValue('');}} className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none ${searchType === 'email' ? 'bg-white text-[#E8622A] shadow-sm' : 'bg-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>E-Posta</button>
                </div>

                <form onSubmit={handleSearch} className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 pl-2">
                      {searchType === 'phone' ? 'Telefon Numaranız' : 'E-Posta Adresiniz'}
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        {searchType === 'phone' ? <Phone size={18}/> : <Mail size={18}/>}
                      </div>
                      <input 
                        type={searchType === 'phone' ? 'tel' : 'email'} 
                        required 
                        value={searchValue} 
                        onChange={(e) => setSearchValue(e.target.value)} 
                        placeholder={searchType === 'phone' ? "5XX XXX XX XX" : "mail@ornek.com"} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] focus:bg-white transition-colors" 
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={loading || !searchValue} className="w-full bg-[#E8622A] hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 disabled:opacity-50 flex items-center justify-center gap-2 border-none cursor-pointer">
                    {loading ? <Loader2 className="animate-spin" size={18}/> : 'Randevularımı Getir'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-2 px-2">
                  <h3 className="font-black text-[#2D1B4E] text-lg">Bulunan İşlemler</h3>
                  <button onClick={() => setSearchResults(null)} className="text-[10px] font-black text-slate-400 hover:text-[#E8622A] uppercase tracking-widest border-none bg-transparent cursor-pointer">Yeni Sorgu</button>
                </div>
                
                {searchResults.map((appt) => (
                  <div key={appt.id} className={`bg-white p-6 rounded-[32px] shadow-sm border relative overflow-hidden transition-all ${appt.status === 'İptal' ? 'border-red-100 opacity-70' : 'border-slate-200 hover:border-[#E8622A]'}`}>
                    {appt.status === 'İptal' && <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">İptal Edildi</div>}
                    {appt.status === 'Tamamlandı' && <div className="absolute top-0 right-0 bg-green-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">Tamamlandı</div>}
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-50 text-[#E8622A] rounded-xl flex items-center justify-center shrink-0 border border-orange-100">
                        {appt.shops?.category === 'Bar & Club' ? <Music size={20}/> : <Scissors size={20}/>}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-lg text-[#2D1B4E] uppercase leading-none mb-1">{appt.shops?.name || 'İşletme'}</h4>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-1 mb-3"><MapPin size={12}/> {appt.shops?.address || 'Konum belirtilmemiş'}</p>
                        
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 mb-4">
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Tarih</span>
                            <span className="font-bold text-sm text-[#2D1B4E]">{appt.appointment_date}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Saat</span>
                            <span className="font-black text-sm text-[#E8622A]">{appt.appointment_time}</span>
                          </div>
                          <div className="col-span-2 pt-2 border-t border-slate-200 mt-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Hizmet / Uzman</span>
                            <span className="font-bold text-sm text-[#2D1B4E]">{appt.service_name} {appt.staff_name && appt.staff_name !== 'Genel' ? `• ${appt.staff_name}` : ''}</span>
                          </div>
                        </div>

                        {/* Her Zaman Çalışan İptal Butonu Mantığı */}
                        {appt.status !== 'İptal' && appt.status !== 'Tamamlandı' && (
                          <button onClick={() => handleCancelAppointment(appt)} className="w-full bg-white border border-red-200 text-red-500 hover:bg-red-50 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-2">
                            <XCircle size={16}/> İşlemi İptal Et
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

        {/* İÇERİK 2: ÜYE GİRİŞİ (SOSYAL + KLASİK) */}
        {activeTab === 'login' && (
          <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-200 animate-in slide-in-from-right-8 duration-300">
            <h3 className="font-black text-[#2D1B4E] text-lg mb-6 flex items-center gap-2">
              <LogIn className="text-[#E8622A]"/> Sisteme Giriş Yapın
            </h3>
            
            <div className="space-y-3 mb-6">
              <button 
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-4 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all hover:border-[#E8622A] cursor-pointer shadow-sm text-[#2D1B4E]"
              >
                <GoogleIcon /> Google ile Devam Et
              </button>
              <button 
                onClick={() => handleSocialLogin('apple')}
                className="w-full flex items-center justify-center gap-3 bg-[#2D1B4E] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#1a0f2e] transition-all cursor-pointer shadow-md"
              >
                <AppleIcon /> Apple ile Devam Et
              </button>
            </div>

            <div className="relative mb-6 text-center">
              <hr className="border-slate-100" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Veya E-Posta İle</span>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18}/></div>
                <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="E-posta Adresiniz" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-sm outline-none focus:border-[#E8622A] transition-colors" />
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18}/></div>
                <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Şifreniz" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-sm outline-none focus:border-[#E8622A] transition-colors" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#E8622A] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-orange-600 transition-all border-none cursor-pointer">
                {loading ? <Loader2 className="animate-spin mx-auto" size={18}/> : 'Giriş Yap'}
              </button>
            </form>

            <p className="text-center mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              Hesabınız yoksa Google veya Apple ile giriş yaptığınızda <span className="text-[#E8622A]">otomatik olarak</span> hesabınız oluşturulur.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}