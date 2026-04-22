"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, Menu, X, UserCircle, CheckCircle2, Lock, Upload, MessageCircle, Gift } from 'lucide-react';
// --- DÜZELTİLMİŞ IMPORT YOLLARI ---
import { useAppContext } from '../app/providers';
import { supabase } from '../lib/supabase';
import { getRegistrationTemplate } from '../lib/emailTemplates';
import { cyprusRegions, categories, packages } from '../lib/constants';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { lang = 'TR', setLang, t, shops = [], loggedInShop, handleLogout } = useAppContext();
  
  if (pathname && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/panel'))) {
    return null;
  }

  const [showFeaturesMenu, setShowFeaturesMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const [loginType, setLoginType] = useState('owner'); 
  const [loginUsername, setLoginUsername] = useState(''); 
  const [loginPassword, setLoginPassword] = useState(''); 
  const [loginStaffName, setLoginStaffName] = useState(''); 
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  const [newShop, setNewShop] = useState({ name: '', category: 'Kişisel Bakım', location: 'Girne', address: '', maps_link: '', phoneCode: '+90', contactPhone: '', contactInsta: '', contactEmail: '', username: '', password: '', email: '', description: '', logoFile: null, package: 'Ücretsiz Deneme' });
  const [isUploading, setIsUploading] = useState(false); 
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [emailValid, setEmailValid] = useState(null); 
  const [phoneValid, setPhoneValid] = useState(null); 
  const [adminEmailValid, setAdminEmailValid] = useState(null);

  // --- MÜŞTERİ OTURUM (SESSION) RADARI EKLENDİ ---
  const [customerSession, setCustomerSession] = useState(null);

  useEffect(() => {
    // Sayfa yüklendiğinde Google/Supabase girişi var mı kontrol et
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCustomerSession(session);
    });

    // Giriş/Çıkış yapıldığı an sayfayı yenilemeden üst menüyü güncelle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCustomerSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCustomerLogout = async () => {
    await supabase.auth.signOut();
    setCustomerSession(null);
    router.push('/');
  };
  // ------------------------------------------------

  const text = t?.[lang] || t?.['TR'] || {};

  const handleEmailChange = (e) => { const val = e.target.value; setNewShop(prev => ({...prev, email: val})); setEmailValid(val === '' ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)); };
  const handleAdminEmailChange = (e) => { const val = e.target.value; setNewShop(prev => ({...prev, contactEmail: val})); setAdminEmailValid(val === '' ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)); };
  const handlePhoneChange = (e) => { const val = e.target.value; setNewShop(prev => ({...prev, contactPhone: val})); setPhoneValid(val === '' ? null : val.replace(/\s/g, '').length >= 7); };

  const performLogin = async (e) => {
    e.preventDefault(); setIsLoginLoading(true);
    const shop = shops.find(s => s.admin_username?.toLowerCase() === loginUsername.trim().toLowerCase());
    if (!shop) { alert(text.modal?.loginError || "Hatalı İşletme Kullanıcı Adı!"); setIsLoginLoading(false); return; }
    if (shop.status !== 'approved' && shop.status) { alert(text.modal?.pendingError || "Hesabınız henüz onaylanmamış!"); setIsLoginLoading(false); return; }
    if (loginType === 'owner') {
      if (shop.admin_password !== loginPassword.trim()) { alert(text.modal?.passError || "Hatalı Şifre!"); setIsLoginLoading(false); return; }
      localStorage.setItem('bookcy_biz_session', JSON.stringify({ role: 'owner', shopData: shop })); setShowLogin(false); setIsLoginLoading(false); window.location.href = '/dashboard';
    } else {
      const validStaff = (shop.staff || []).find(s => s.name.toLowerCase() === loginStaffName.trim().toLowerCase() && s.password === loginPassword.trim());
      if (!validStaff) { alert(text.modal?.staffError || "Hatalı Personel Bilgisi!"); setIsLoginLoading(false); return; }
      localStorage.setItem('bookcy_biz_session', JSON.stringify({ role: 'staff', staffName: validStaff.name, shopData: shop })); setShowLogin(false); setIsLoginLoading(false); window.location.href = '/dashboard';
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (emailValid === false || phoneValid === false || adminEmailValid === false) return alert(text.modal?.infoError || "Lütfen bilgileri doğru giriniz.");
    setIsUploading(true); 
    try {
      let uploadedLogoUrl = null;
      if (newShop.logoFile) {
        const fileName = `${Math.random()}.${newShop.logoFile.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, newShop.logoFile);
        if (!uploadError) uploadedLogoUrl = supabase.storage.from('logos').getPublicUrl(fileName).data.publicUrl; 
      }
      const fullPhone = newShop.phoneCode + " " + newShop.contactPhone;
      const { error } = await supabase.from('shops').insert([{ name: newShop.name, category: newShop.category, location: newShop.location, address: newShop.address, maps_link: newShop.maps_link, admin_email: newShop.email, admin_username: newShop.username, admin_password: newShop.password, description: newShop.description, logo_url: uploadedLogoUrl, package: newShop.package, status: 'pending', contact_phone: fullPhone, contact_insta: newShop.contactInsta, contact_email: newShop.contactEmail, services: [], staff: [], gallery: [], closed_dates: [], events: [] }]);
      if (!error) {
        try {
          const finalPrice = newShop.package === 'Ücretsiz Deneme' ? '0 STG' : (newShop.package === 'Premium Paket' ? '100 STG' : '60 STG');
          await fetch('/api/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: newShop.email, subject: 'Bookcy Kayıt Talebi', html: getRegistrationTemplate({ shopName: newShop.name, date: new Date().toLocaleDateString('tr-TR'), packageName: newShop.package.toUpperCase(), price: finalPrice }) })});
        } catch (mailErr) { console.error(mailErr); }
        setRegisterSuccess(true); 
      }
    } catch (err) { alert(err.message); } finally { setIsUploading(false); }
  };

  const goToFeature = (key) => {
      setShowFeaturesMenu(false);
      setIsMobileMenuOpen(false);
      router.push('/ozellikler/' + key);
  };

  return (
    <>
      {/* MOBİL MENÜ OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col animate-in slide-in-from-right-full duration-300">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-decoration-none group">
                  <div className="h-10 w-10 bg-white p-1 rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden">
                    <img src="/logo.png" alt="Bookcy Logo" className="w-full h-full object-contain" />
                  </div>
                  {/* MOBİL LOGO FONTU: DM SANS OLARAK SABİTLENDİ */}
                  <span className="text-xl font-black tracking-tighter text-[#2D1B4E] uppercase" style={{fontFamily: "'DM Sans', sans-serif"}}>BOOKCY<span className="text-[#E8622A]">.</span></span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 bg-slate-50 rounded-full border-none cursor-pointer"><X size={24}/></button>
            </div>
            
            <div className="flex flex-col gap-2 p-6 overflow-y-auto">
                <Link href="/isletmeler" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-[#2D1B4E] py-4 border-b border-slate-50 text-decoration-none block uppercase">{text.nav?.places}</Link>
                <Link href="/ozellikler" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-[#2D1B4E] py-4 border-b border-slate-50 text-decoration-none block uppercase">{text.nav?.features}</Link>
                <Link href="/neden-bookcy" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-[#2D1B4E] py-4 border-b border-slate-50 text-decoration-none block uppercase">{text.nav?.why}</Link>
                <Link href="/hakkimizda" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-[#2D1B4E] py-4 border-b border-slate-50 text-decoration-none block uppercase">{text.nav?.about}</Link>
                <Link href="/iletisim" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-[#2D1B4E] py-4 border-b border-slate-50 text-decoration-none block uppercase">{text.nav?.contact}</Link>
                
                {/* MÜŞTERİ GİRİŞ YAPTIYSA MOBİLDE PROFİLİM GÖZÜKSÜN */}
                <Link href={customerSession ? "/profilim" : "/randevu-sorgula"} onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-[#E8622A] py-4 border-b border-slate-50 text-decoration-none block uppercase">
                  {customerSession ? 'PROFİLİM' : text.nav?.myAppts}
                </Link>
            </div>
            
            <div className="mt-auto p-6 flex flex-col gap-4 bg-slate-50 border-t border-slate-100">
                 <div className="flex gap-3 justify-center mb-2">
                    {['TR', 'EN', 'RU'].map(l => (
                      <button key={l} onClick={()=>setLang(l)} className={`px-6 py-2 rounded-full font-black text-xs transition-colors cursor-pointer border ${lang===l ? 'bg-[#2D1B4E] text-white border-[#2D1B4E]' : 'bg-white text-slate-500 border-slate-200'}`}>{l}</button>
                    ))}
                 </div>
                 {loggedInShop ? (
                    <Link href="/dashboard" className="w-full flex items-center justify-center py-5 rounded-2xl bg-[#E8622A] text-white font-black uppercase tracking-widest text-sm text-decoration-none shadow-lg">{text.nav?.panel}</Link>
                 ) : customerSession ? (
                    <>
                      <button onClick={() => { handleCustomerLogout(); setIsMobileMenuOpen(false); }} className="w-full py-5 rounded-2xl border-2 border-slate-300 text-slate-500 font-black uppercase tracking-widest text-sm bg-transparent cursor-pointer hover:bg-slate-200">Çıkış Yap</button>
                      <Link href="/profilim" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center py-5 rounded-2xl bg-[#E8622A] text-white font-black uppercase tracking-widest text-sm border-none cursor-pointer text-decoration-none shadow-lg">Profilime Git</Link>
                    </>
                 ) : (
                    <>
                      <button onClick={() => {setShowRegister(true); setIsMobileMenuOpen(false);}} className="w-full py-5 rounded-2xl border-2 border-[#2D1B4E] text-[#2D1B4E] font-black uppercase tracking-widest text-sm bg-transparent cursor-pointer">{text.nav?.addShop}</button>
                      <button onClick={() => {setShowLogin(true); setIsMobileMenuOpen(false);}} className="w-full py-5 rounded-2xl bg-[#E8622A] text-white font-black uppercase tracking-widest text-sm border-none cursor-pointer">{text.nav?.login}</button>
                    </>
                 )}
            </div>
        </div>
      )}

      {/* MASAÜSTÜ NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-slate-100 h-[76px] px-6 md:px-10 flex items-center justify-between transition-all">
        <Link href="/" className="flex items-center gap-3 text-decoration-none group">
          <div className="h-12 w-12 md:h-14 md:w-14 bg-white p-1.5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
            <img src="/logo.png" alt="Bookcy Logo" className="w-full h-full object-contain" />
          </div>
          {/* MASAÜSTÜ LOGO FONTU: DM SANS OLARAK SABİTLENDİ */}
          <span className="text-2xl md:text-3xl font-black tracking-tighter text-[#2D1B4E] uppercase" style={{fontFamily: "'DM Sans', sans-serif"}}>
            BOOKCY<span className="text-[#E8622A]">.</span>
          </span>
        </Link>

        <ul className="nav-links hidden md:flex items-center gap-8 list-none m-0 p-0">
          <li><Link href="/isletmeler" className={`nav-main-btn text-decoration-none uppercase ${pathname === '/isletmeler' ? 'active text-[#E8622A]' : 'text-slate-600'}`}>{text.nav?.places}</Link></li>
          
          <li style={{height:'100%', display:'flex', alignItems:'center'}}>
              <div className="relative h-full flex items-center group" onMouseEnter={() => setShowFeaturesMenu(true)} onMouseLeave={() => setShowFeaturesMenu(false)}>
                  <Link href="/ozellikler" className={`nav-main-btn flex items-center gap-1 transition-colors h-full text-decoration-none uppercase ${pathname?.includes('/ozellikler') ? 'active text-[#E8622A]' : 'text-slate-600'}`}>
                      {text.nav?.features} <ChevronDown size={14} className={`transition-transform duration-200 ${showFeaturesMenu ? 'rotate-180' : ''}`} />
                  </Link>
                  {showFeaturesMenu && (
                      <div className="absolute top-[76px] left-1/2 -translate-x-1/2 w-screen bg-white text-[#2D1B4E] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-t border-slate-200 cursor-default animate-in slide-in-from-top-2 duration-200 z-50">
                          <div className="max-w-[1100px] mx-auto py-12 px-8">
                              <div className="grid grid-cols-4 gap-8 mb-10 text-left text-decoration-none">
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{text.mega?.setup || "Kurulum"}</h4>
                                    <ul className="space-y-4 font-bold text-slate-600 capitalize text-sm list-none p-0">
                                      {['profile', 'market', 'team'].map(key => <li key={key}><button onClick={() => goToFeature(key)} className="hover:text-[#E8622A] cursor-pointer transition-colors flex items-center gap-2 bg-transparent border-none text-slate-600 p-0 font-bold uppercase text-[12px]"><ChevronRight size={14} className="text-[#E8622A]"/> {text.featNames?.[key]}</button></li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{text.mega?.engage || "Etkileşim"}</h4>
                                    <ul className="space-y-4 font-bold text-slate-600 capitalize text-sm list-none p-0">
                                      {['booking', 'app'].map(key => <li key={key}><button onClick={() => goToFeature(key)} className="hover:text-[#E8622A] cursor-pointer transition-colors flex items-center gap-2 bg-transparent border-none text-slate-600 p-0 font-bold uppercase text-[12px]"><ChevronRight size={14} className="text-[#E8622A]"/> {text.featNames?.[key]}</button></li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{text.mega?.manage || "Yönetim"}</h4>
                                    <ul className="space-y-4 font-bold text-slate-600 capitalize text-sm list-none p-0">
                                      {['marketing', 'calendar', 'crm'].map(key => <li key={key}><button onClick={() => goToFeature(key)} className="hover:text-[#E8622A] cursor-pointer transition-colors flex items-center gap-2 bg-transparent border-none text-slate-600 p-0 font-bold uppercase text-[12px]"><ChevronRight size={14} className="text-[#E8622A]"/> {text.featNames?.[key]}</button></li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{text.mega?.grow || "Büyüme"}</h4>
                                    <ul className="space-y-4 font-bold text-slate-600 capitalize text-sm list-none p-0">
                                      {['boost', 'stats'].map(key => <li key={key}><button onClick={() => goToFeature(key)} className="hover:text-[#E8622A] cursor-pointer transition-colors flex items-center gap-2 bg-transparent border-none text-slate-600 p-0 font-bold uppercase text-[12px]"><ChevronRight size={14} className="text-[#E8622A]"/> {text.featNames?.[key]}</button></li>)}
                                    </ul>
                                  </div>
                              </div>
                              <div className="flex justify-center border-t border-slate-100 pt-8">
                                <button onClick={() => { setShowFeaturesMenu(false); router.push('/ozellikler'); }} className="bg-slate-50 border border-slate-200 text-[#2D1B4E] px-8 py-3 rounded-xl font-black hover:bg-slate-100 transition-colors cursor-pointer text-xs uppercase tracking-widest">{text.mega?.btn || "Tüm Özellikler"}</button>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </li>

          <li><Link href="/neden-bookcy" className={`nav-main-btn text-decoration-none uppercase ${pathname === '/neden-bookcy' ? 'active text-[#E8622A]' : 'text-slate-600'}`}>{text.nav?.why}</Link></li>
          <li><Link href="/hakkimizda" className={`nav-main-btn text-decoration-none uppercase ${pathname === '/hakkimizda' ? 'active text-[#E8622A]' : 'text-slate-600'}`}>{text.nav?.about}</Link></li>
          <li><Link href="/iletisim" className={`nav-main-btn text-decoration-none uppercase ${pathname === '/iletisim' ? 'active text-[#E8622A]' : 'text-slate-600'}`}>{text.nav?.contact}</Link></li>
          
          {/* MÜŞTERİ GİRİŞ YAPTIYSA MASAÜSTÜNDE PROFİLİM GÖZÜKSÜN */}
          <li>
            <Link href={customerSession ? "/profilim" : "/randevu-sorgula"} className={`nav-main-btn text-decoration-none uppercase text-[#E8622A] font-black ${pathname === '/randevu-sorgula' || pathname === '/profilim' ? 'active' : ''}`}>
              {customerSession ? 'PROFİLİM' : text.nav?.myAppts}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <div className="lang-pills hidden lg:flex gap-1">
             {['TR', 'EN', 'RU'].map(l => (
               <button key={l} onClick={()=>setLang(l)} className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all cursor-pointer ${lang===l ? 'bg-[#2D1B4E] text-white border-[#2D1B4E]' : 'bg-transparent text-slate-400 border-slate-200 hover:border-slate-400'}`}>{l}</button>
             ))}
          </div>

          {loggedInShop ? (
             <div className="flex gap-2">
                <button onClick={handleLogout} className="hidden md:block bg-slate-100 text-slate-600 px-5 py-2.5 rounded-full font-black text-xs uppercase border-none cursor-pointer hover:bg-slate-200">{text.nav?.logout}</button>
                <Link href="/dashboard" className="flex items-center gap-2 bg-[#E8622A] text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest text-decoration-none shadow-md hover:bg-[#d5521b] transition-all"><UserCircle size={18}/> {text.nav?.panel}</Link>
             </div>
          ) : customerSession ? (
             <div className="flex gap-2">
                <button onClick={handleCustomerLogout} className="hidden md:block bg-slate-100 text-slate-600 px-5 py-2.5 rounded-full font-black text-xs uppercase border-none cursor-pointer hover:bg-slate-200 hover:text-red-500 transition-colors">ÇIKIŞ</button>
                <Link href="/profilim" className="flex items-center gap-2 bg-[#E8622A] text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest text-decoration-none shadow-md hover:bg-[#d5521b] transition-all"><UserCircle size={18}/> PROFİLİM</Link>
             </div>
          ) : (
             <div className="flex gap-2">
                <button onClick={() => setShowRegister(true)} className="hidden md:block border-2 border-[#2D1B4E] text-[#2D1B4E] px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#2D1B4E] hover:text-white transition-all cursor-pointer">{text.nav?.addShop}</button>
                <button onClick={() => setShowLogin(true)} className="hidden md:flex items-center gap-2 bg-[#E8622A] text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest border-none cursor-pointer shadow-md hover:bg-[#d5521b] transition-all"><UserCircle size={18}/> {text.nav?.login}</button>
             </div>
          )}

          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-[#2D1B4E] bg-transparent border-none cursor-pointer"><Menu size={30}/></button>
        </div>
      </nav>

      {/* KAYIT MODALI */}
      {showRegister && (
          <div className="fixed inset-0 w-screen h-screen bg-[#2D1B4E]/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto py-20">
            <div className="bg-white border border-slate-200 w-full max-w-[800px] rounded-[32px] p-8 md:p-10 relative shadow-2xl my-auto animate-in zoom-in-95 duration-300 text-[#2D1B4E]">
              <button onClick={() => {setShowRegister(false); setRegisterSuccess(false); setIsTermsAccepted(false);}} className="absolute top-6 right-6 md:right-8 text-slate-400 hover:text-[#2D1B4E] p-2 font-bold bg-transparent border-none cursor-pointer"><X size={24}/></button>
              {registerSuccess ? (
                  <div className="text-center py-10">
                      <CheckCircle2 size={64} className="mx-auto text-[#00c48c] mb-6" />
                      <h2 className="text-2xl md:text-3xl font-black text-[#E8622A] uppercase italic mb-4">{text.modal?.success}</h2>
                      {newShop.package === 'Ücretsiz Deneme' ? (
                          <div className="bg-green-50 p-6 md:p-8 rounded-2xl border border-green-200 inline-block text-center mt-4 w-full max-w-md shadow-sm">
                              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Gift size={24}/></div>
                              <p className="font-black text-lg text-green-700 mb-2 uppercase">{text.modal?.welcome || "HOŞ GELDİNİZ!"}</p>
                              <p className="text-sm font-bold text-slate-600 leading-relaxed">{text.modal?.trialDesc || "Ücretsiz deneme başvurunuz alınmıştır. Onay sonrası sisteminiz aktif edilecektir."}</p>
                              <p className="text-xs font-black text-[#E8622A] mt-6 uppercase tracking-widest bg-white border border-orange-100 px-4 py-2 rounded-lg inline-block">{text.modal?.noPayment || "ŞİMDİLİK ÖDEME GEREKMİYOR"}</p>
                          </div>
                      ) : (
                          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 inline-block text-left mt-4 w-full max-w-sm">
                              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{text.modal?.bank}</p>
                              <p className="font-bold text-sm">Banka: <span className="font-normal">İş Bankası</span></p>
                              <p className="font-bold text-sm">Alıcı: <span className="font-normal">BOOKCY LTD.</span></p>
                              <p className="font-bold text-sm">IBAN: <span className="text-[#E8622A]">TR99 0006 4000 0012 3456 7890 12</span></p>
                              <p className="text-sm font-bold text-slate-500 mt-6 mb-4 text-center">{text.modal?.bankDesc}</p>
                              <a href="https://wa.me/905555555555" target="_blank" rel="noreferrer" className="w-full bg-[#25D366] text-white font-black py-4 rounded-xl uppercase tracking-widest hover:bg-green-600 transition-colors shadow-lg flex justify-center items-center gap-2 text-decoration-none text-xs border-none cursor-pointer mt-4"><MessageCircle size={18}/> {text.modal?.btnBank}</a>
                          </div>
                      )}
                  </div>
              ) : (
                  <>
                      <div className="flex flex-col mb-8 text-center mt-4">
                          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic text-[#2D1B4E]">{text.modal?.regTitle}</h2>
                          <p className="text-[10px] text-[#E8622A] font-bold uppercase tracking-[0.2em] mt-2 flex items-center justify-center gap-2"><Lock size={12}/> {text.modal?.regSub}</p>
                      </div>
                      <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input required placeholder={text.modal?.shopName} className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none" value={newShop.name} onChange={e => setNewShop({...newShop, name: e.target.value})} />
                              <select className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none" value={newShop.category} onChange={e => setNewShop({...newShop, category: e.target.value})}>{categories.map(c => <option key={c.dbName} value={c.dbName}>{c.dbName}</option>)}</select>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <select required className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none" value={newShop.location} onChange={e => setNewShop({...newShop, location: e.target.value})}>{cyprusRegions.map(region => <option key={region} value={region}>{region}</option>)}</select>
                              <input required placeholder={text.modal?.address} className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none uppercase" value={newShop.address} onChange={e => setNewShop({...newShop, address: e.target.value})} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                              <div className="flex gap-2 w-full relative">
                                <select className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-2 outline-none font-bold text-xs w-20" value={newShop.phoneCode} onChange={e => setNewShop({...newShop, phoneCode: e.target.value})}><option value="+90">TR</option></select>
                                <div className="relative flex-1">
                                  <input required type="tel" placeholder={text.modal?.phone} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 outline-none font-bold text-xs" value={newShop.contactPhone} onChange={handlePhoneChange} />
                                </div>
                              </div>
                              <input placeholder={text.modal?.insta} className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none" value={newShop.contactInsta} onChange={e => setNewShop({...newShop, contactInsta: e.target.value})} />
                              <input type="email" placeholder={text.modal?.mail} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none" value={newShop.contactEmail} onChange={handleAdminEmailChange} />
                          </div>
                          <input required type="email" placeholder={text.modal?.adminMail} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none mt-2" value={newShop.email} onChange={handleEmailChange} />
                          <textarea placeholder={text.modal?.desc} rows="2" className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none resize-none" value={newShop.description} onChange={e => setNewShop({...newShop, description: e.target.value})}></textarea>
                          
                          <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-4 relative group">
                              <input type="file" accept=".png, .jpg, .jpeg" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setNewShop({...newShop, logoFile: e.target.files[0]})} />
                              {newShop.logoFile ? <span className="text-[10px] font-bold text-[#00c48c] flex items-center justify-center gap-2"><CheckCircle2 size={16}/> {newShop.logoFile.name}</span> : <div className="flex flex-col items-center justify-center text-center text-[10px] font-bold text-slate-500 uppercase"><Upload size={20} className="mb-2"/> {text.modal?.logo}</div>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                              <div onClick={() => setNewShop({...newShop, package: 'Ücretsiz Deneme'})} className={`cursor-pointer p-4 rounded-xl border transition-all ${newShop.package === 'Ücretsiz Deneme' ? 'bg-[#2D1B4E] border-[#2D1B4E] shadow-lg text-white' : 'bg-white border-slate-200 hover:border-[#E8622A]'}`}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Gift size={16} className={newShop.package === 'Ücretsiz Deneme' ? 'text-white' : 'text-[#E8622A]'}/>
                                    <h4 className="text-[11px] font-black uppercase tracking-widest">{text.aboutPage?.free || "ÜCRETSİZ DENEME"}</h4>
                                  </div>
                                  <p className={`text-[10px] font-bold mt-2 px-2 py-1 inline-block rounded-md ${newShop.package === 'Ücretsiz Deneme' ? 'bg-white/20' : 'bg-orange-50 text-[#E8622A]'}`}>22 Mayıs'a Kadar</p>
                              </div>
                              {packages.map(p => (
                                  <div key={p.name} onClick={() => setNewShop({...newShop, package: p.name})} className={`cursor-pointer p-4 rounded-xl border transition-all ${newShop.package === p.name ? 'bg-orange-50 border-[#E8622A] shadow-md' : 'bg-white border-slate-200 hover:border-[#E8622A]'}`}>
                                      <h4 className={`text-[11px] font-black uppercase tracking-widest mb-1 ${newShop.package === p.name ? 'text-[#E8622A]' : 'text-[#2D1B4E]'}`}>{p.name.includes('Standart') ? text.aboutPage?.std : text.aboutPage?.pr}</h4>
                                      <p className="text-xs font-bold text-slate-500">{p.price.split('/')[0]} {text.aboutPage?.mo}</p>
                                  </div>
                              ))}
                          </div>

                          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                              <input required placeholder={text.modal?.user} className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none" value={newShop.username} onChange={e => setNewShop({...newShop, username: e.target.value})} />
                              <input required placeholder={text.modal?.pass} className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none" value={newShop.password} onChange={e => setNewShop({...newShop, password: e.target.value})} />
                          </div>

                          <div className="flex items-start gap-3 mt-4 mb-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <input type="checkbox" id="business-terms" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} className="mt-0.5 w-5 h-5 text-[#E8622A] border-slate-300 rounded focus:ring-[#E8622A] cursor-pointer shrink-0" />
                            <label htmlFor="business-terms" className="text-[11px] text-slate-500 leading-relaxed cursor-pointer text-left font-medium">
                              Bookcy <a href="/yasal/sartlar" target="_blank" className="text-[#E8622A] font-black hover:underline">{text.modal?.termsLink || "Sözleşme"}</a>'ni okudum. Bookcy'nin yalnızca bir "Yer Sağlayıcı" olduğunu kabul ederim.
                            </label>
                          </div>

                          <button type="submit" disabled={!isTermsAccepted || isUploading || emailValid === false || phoneValid === false || adminEmailValid === false} className={`w-full flex items-center justify-center py-5 rounded-xl mt-2 shadow-lg border-none tracking-widest text-xs uppercase font-black transition-all ${(!isTermsAccepted || isUploading || emailValid === false || phoneValid === false || adminEmailValid === false) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#E8622A] text-white hover:bg-[#d5521b] cursor-pointer'}`}>
                            {isUploading ? text.modal?.loading : text.modal?.btnReg}
                          </button>
                      </form>
                  </>
              )}
            </div>
          </div>
      )}

      {/* GİRİŞ MODALI */}
      {showLogin && (
        <div className="fixed inset-0 bg-[#2D1B4E]/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 text-[#2D1B4E]">
          <div className="bg-white w-full max-w-[400px] rounded-[32px] p-8 relative shadow-2xl border border-slate-200">
            <button onClick={() => setShowLogin(false)} className="absolute top-6 right-6 text-slate-400 hover:text-[#2D1B4E] bg-transparent border-none cursor-pointer"><X size={24}/></button>
            <div className="text-center mb-6 mt-2"><h1 className="text-2xl font-black uppercase mb-2">{text.modal?.logTitle}</h1><p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{text.modal?.logSub}</p></div>
            <div className="flex bg-slate-50 p-1 rounded-xl mb-6 border border-slate-100">
              <button onClick={() => setLoginType('owner')} className={`flex-1 py-3 text-xs font-black uppercase rounded-lg border-none cursor-pointer transition-all ${loginType === 'owner' ? 'bg-white text-[#E8622A] shadow-sm' : 'bg-transparent text-slate-400'}`}>{text.modal?.own}</button>
              <button onClick={() => setLoginType('staff')} className={`flex-1 py-3 text-xs font-black uppercase rounded-lg border-none cursor-pointer transition-all ${loginType === 'staff' ? 'bg-white text-[#E8622A] shadow-sm' : 'bg-transparent text-slate-400'}`}>{text.modal?.stf}</button>
            </div>
            <form onSubmit={performLogin} className="space-y-4">
              <input type="text" required placeholder={text.modal?.user} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A]" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
              {loginType === 'staff' && <input type="text" required placeholder={text.modal?.stfName || "Personel Adı"} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A]" value={loginStaffName} onChange={(e) => setLoginStaffName(e.target.value)} />}
              <input type="password" required placeholder={text.modal?.pass} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A]" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              <button type="submit" disabled={isLoginLoading} className="w-full bg-[#E8622A] text-white py-5 rounded-xl font-black uppercase tracking-widest text-xs mt-4 border-none cursor-pointer hover:bg-[#d5521b] transition-all shadow-md">
                {isLoginLoading ? text.modal?.wait : text.modal?.btnLog}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}