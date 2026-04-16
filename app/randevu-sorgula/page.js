"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LogIn, UserPlus, Phone, Mail, Lock, Calendar, Clock, MapPin, XCircle, ChevronRight, User, Scissors, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CustomerPortal() {
  const router = useRouter();
  
  // Sekme Yönetimi: 'search' (Sorgula), 'login' (Giriş), 'register' (Kayıt)
  const [activeTab, setActiveTab] = useState('search');
  
  // Form Stateleri
  const [searchPhone, setSearchPhone] = useState('+90');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('+90');
  
  // Sonuç ve Yükleme Stateleri
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. MİSAFİR RANDEVU SORGULAMA
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSearchResults(null);

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          shops ( name, address, category )
        `)
        .eq('customer_phone', searchPhone)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setSearchResults(data);
      } else {
        setErrorMsg('Bu telefon numarasına ait aktif randevu bulunamadı.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Sorgulama sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // 2. RANDEVU İPTAL ET (Bekleme Listesi Radarını Tetikler)
  const handleCancelAppointment = async (appointment) => {
    if (!window.confirm("Bu randevuyu iptal etmek istediğinize emin misiniz?")) return;
    
    setLoading(true);
    try {
      // 1. Randevu durumunu İptal yap
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: 'İptal' })
        .eq('id', appointment.id);

      if (updateError) throw updateError;

      // 2. Arka plandaki Akıllı Bekleme Listesi API'mizi tetikle (Dün yazdığımız kod)
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
      } catch (apiErr) {
        console.log("Bekleme listesi radarı tetiklenirken hata oldu ama iptal başarılı.");
      }

      // 3. Ekrandaki listeyi güncelle
      setSearchResults(searchResults.map(a => a.id === appointment.id ? { ...a, status: 'İptal' } : a));
      alert("Randevunuz başarıyla iptal edildi.");
      
    } catch (err) {
      console.error(err);
      alert("İptal işlemi başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  // 3. MÜŞTERİ GİRİŞİ (Hazırlık)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Not: Gerçek Auth altyapısı bir sonraki adımda kurulacak
    setTimeout(() => {
      setLoading(false);
      setErrorMsg('Müşteri üyelik sistemi şu an bakımda. Lütfen Misafir Sorgulama kısmını kullanın.');
    }, 1000);
  };

  // 4. MÜŞTERİ KAYIT (Hazırlık)
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Kaydınız başarıyla alındı! (Test Aşaması)');
      setActiveTab('login');
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
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'search' ? 'bg-[#2D1B4E] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-[#2D1B4E]'}`}
          >
            Misafir Sorgulama
          </button>
          <button 
            onClick={() => {setActiveTab('login'); setErrorMsg(''); setSuccessMsg('');}} 
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${(activeTab === 'login' || activeTab === 'register') ? 'bg-[#2D1B4E] text-white shadow-md' : 'bg-transparent text-slate-400 hover:text-[#2D1B4E]'}`}
          >
            Üye Girişi
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
                <form onSubmit={handleSearch} className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 pl-2">Telefon Numaranız</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={18}/></div>
                      <input 
                        type="tel" 
                        required 
                        value={searchPhone}
                        onChange={(e) => setSearchPhone(e.target.value)}
                        placeholder="+90 5XX XXX XX XX" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-[#E8622A] hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 disabled:opacity-70 flex items-center justify-center gap-2 border-none cursor-pointer">
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

                        {(!appt.status || appt.status === 'Bekliyor') && (
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

        {/* İÇERİK 2: ÜYE GİRİŞİ */}
        {activeTab === 'login' && (
          <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-200 animate-in slide-in-from-right-8 duration-300">
            <h3 className="font-black text-[#2D1B4E] text-lg mb-6 flex items-center gap-2">
              <LogIn className="text-[#E8622A]"/> Hesabınıza Giriş Yapın
            </h3>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 pl-2">E-Posta Adresi</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18}/></div>
                  <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="mail@ornek.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] focus:bg-white transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 pl-2 flex justify-between">
                  <span>Şifre</span>
                  <span className="text-[#E8622A] cursor-pointer hover:underline">Şifremi Unuttum</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18}/></div>
                  <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] focus:bg-white transition-colors" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#2D1B4E] hover:bg-[#1a0f2e] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 disabled:opacity-70 flex items-center justify-center gap-2 border-none cursor-pointer">
                {loading ? <Loader2 className="animate-spin" size={18}/> : 'Giriş Yap'}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm font-bold text-slate-500">
                Hesabınız yok mu? <button onClick={() => setActiveTab('register')} className="text-[#E8622A] border-none bg-transparent font-black cursor-pointer hover:underline">Ücretsiz Kayıt Ol</button>
              </p>
            </div>
          </div>
        )}

        {/* İÇERİK 3: YENİ KAYIT */}
        {activeTab === 'register' && (
          <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-200 animate-in slide-in-from-right-8 duration-300">
            <h3 className="font-black text-[#2D1B4E] text-lg mb-6 flex items-center gap-2">
              <UserPlus className="text-[#E8622A]"/> Yeni Hesap Oluştur
            </h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={18}/></div>
                  <input type="text" required value={registerName} onChange={(e) => setRegisterName(e.target.value)} placeholder="Adınız Soyadınız" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] focus:bg-white transition-colors" />
                </div>
              </div>
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={18}/></div>
                  <input type="tel" required value={registerPhone} onChange={(e) => setRegisterPhone(e.target.value)} placeholder="Telefon Numaranız" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] focus:bg-white transition-colors" />
                </div>
              </div>
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18}/></div>
                  <input type="email" required placeholder="E-Posta Adresiniz" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] focus:bg-white transition-colors" />
                </div>
              </div>
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18}/></div>
                  <input type="password" required placeholder="Bir Şifre Belirleyin" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] focus:bg-white transition-colors" />
                </div>
              </div>
              
              <button type="submit" disabled={loading} className="w-full bg-[#E8622A] hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 mt-2 disabled:opacity-70 flex items-center justify-center gap-2 border-none cursor-pointer">
                {loading ? <Loader2 className="animate-spin" size={18}/> : 'Aramıza Katıl'} <ChevronRight size={18}/>
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <button onClick={() => setActiveTab('login')} className="text-slate-400 hover:text-[#2D1B4E] text-xs font-black uppercase tracking-widest border-none bg-transparent cursor-pointer transition-colors">
                Zaten hesabım var, Giriş Yap
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}