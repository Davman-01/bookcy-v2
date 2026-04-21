'use client';
import React, { useState } from 'react';
import { Music, GlassWater, Phone, Mail, Link, ChevronLeft, AlertTriangle, ShieldAlert, Calendar } from 'lucide-react';

export default function BarClubFlow({ shop, bookingHelpers }) {
    const [profileTab, setProfileTab] = useState('events'); // Varsayılan: Etkinlikler / VIP
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    
    const { bookingPhase, setBookingPhase, bookingData, setBookingData, formData, setFormData, handleBooking } = bookingHelpers;

    // --- VERİ GARANTİSİ (Sosyal Medya, Telefon, Hakkında) ---
    const shopDescription = shop?.description || shop?.about || shop?.bio || shop?.about_text || 'İşletme açıklaması yakında eklenecek.';
    const shopPhone = shop?.phone || shop?.mobile_phone || shop?.shop_phone;
    const shopEmail = shop?.email || shop?.contact_email || shop?.admin_email;
    const shopInsta = shop?.instagram || shop?.social_instagram || shop?.instagram_url;
    const shopFb = shop?.facebook || shop?.social_facebook || shop?.facebook_url;

    let workingHours = [];
    try { workingHours = typeof shop?.working_hours === 'string' ? JSON.parse(shop.working_hours) : (shop?.working_hours || []); } 
    catch (e) { workingHours = []; }

    const handleFormSubmit = (e) => {
        if (!isTermsAccepted) {
            e.preventDefault();
            alert("Devam etmek için kulüp kurallarını ve aydınlatma metnini onaylamalısınız.");
            return;
        }
        // Gece kulüpleri için varsayılan saat ataması (eğer seçilmemişse)
        if (!bookingData.time) {
            bookingData.time = "22:00"; 
        }
        handleBooking(e);
    };

    return (
        <div className="w-full max-w-7xl mx-auto relative z-10">
            {/* Sekmeler */}
            <div className="flex gap-6 md:gap-10 border-b border-slate-200 mb-10 overflow-x-auto custom-scrollbar px-2 md:px-6">
                <button onClick={() => setProfileTab('events')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'events' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>VIP & REZERVASYON</button>
                <button onClick={() => setProfileTab('gallery')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'gallery' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>GALERİ</button>
                <button onClick={() => setProfileTab('about')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'about' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>HAKKINDA</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* SOL SÜTUN */}
                <div className="lg:col-span-7">
                    
                    {/* 1. ETKİNLİKLER / VIP MASALAR */}
                    {profileTab === 'events' && (
                        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                            {/* Kurumsal Bilgi Kartı */}
                            <div className="flex items-center gap-3 mb-2 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <ShieldAlert size={16} className="text-[#E8622A]" />
                                Sadece Onaylı Rezervasyonlar İçeri Alınmaktadır.
                            </div>

                            {shop?.services?.length > 0 ? shop.services.map(srv => (
                                <div key={srv.id} onClick={() => { setBookingData({...bookingData, selectedShopService: srv}); setBookingPhase(2); }} className={`p-6 md:p-8 bg-white rounded-[32px] border cursor-pointer flex justify-between items-center transition-all ${bookingData?.selectedShopService?.id === srv.id ? 'border-[#E8622A] shadow-lg scale-[1.02]' : 'border-slate-200 hover:border-[#E8622A] hover:shadow-md'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                            <GlassWater size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg text-[#2D1B4E] uppercase">{srv.name}</h4>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hızlı Giriş & Özel Servis</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        {srv.price > 0 && <span className="font-black text-xl text-[#2D1B4E]">{srv.price} TL</span>}
                                        <button className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase border-none cursor-pointer transition-colors ${bookingData?.selectedShopService?.id === srv.id ? 'bg-[#E8622A] text-white' : 'bg-[#2D1B4E] text-white hover:bg-opacity-80'}`}>REZERVASYON</button>
                                    </div>
                                </div>
                            )) : <div className="p-10 text-center font-bold text-slate-400 bg-white rounded-[32px] border border-dashed border-slate-300">Henüz rezervasyon seçeneği eklenmemiş.</div>}
                        </div>
                    )}

                    {/* 2. GALERİ */}
                    {profileTab === 'gallery' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in zoom-in duration-300">
                            {shop?.gallery?.length > 0 ? shop.gallery.map((img, idx) => (
                                <div key={idx} className="h-48 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative group">
                                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="nightclub" />
                                </div>
                            )) : <div className="col-span-full p-10 text-center font-bold text-slate-400">Görsel bulunamadı.</div>}
                        </div>
                    )}

                    {/* 3. HAKKINDA */}
                    {profileTab === 'about' && (
                        <div className="flex flex-col gap-8 animate-in slide-in-from-bottom duration-500">
                            <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[40px] shadow-sm">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-4 border-l-4 border-[#E8622A] pl-3">Mekan Hakkında</h3>
                                <p className="text-slate-600 text-sm font-medium whitespace-pre-wrap leading-relaxed">{shopDescription}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm flex flex-col gap-5">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-2 border-b pb-4">İletişim</h3>
                                    {shopPhone && <div className="flex items-center gap-3 text-slate-600 font-bold"><Phone size={18} className="text-[#E8622A]"/> {shopPhone}</div>}
                                    {shopEmail && <div className="flex items-center gap-3 text-slate-600 font-bold"><Mail size={18} className="text-[#E8622A]"/> {shopEmail}</div>}
                                    {shopInsta && <a href={shopInsta.includes('http') ? shopInsta : `https://instagram.com/${shopInsta.replace('@','')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 font-bold hover:text-[#E1306C]"><Link size={18} className="text-[#E8622A]"/> Instagram</a>}
                                    {shopFb && <a href={shopFb.includes('http') ? shopFb : `https://facebook.com/${shopFb}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 font-bold hover:text-[#1877F2]"><Link size={18} className="text-[#E8622A]"/> Facebook</a>}
                                </div>
                                <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-6 border-b pb-4">Açılış Saatleri</h3>
                                    <div className="flex flex-col gap-3">
                                        {workingHours.length > 0 ? workingHours.map((h, i) => (
                                            <div key={i} className="flex justify-between items-center text-sm font-bold">
                                                <span className="text-slate-500">{h.day}</span>
                                                {h.isClosed ? <span className="text-red-500 bg-red-50 px-3 py-1 rounded-lg text-[10px]">KAPALI</span> : <span className="text-[#2D1B4E]">{h.open} - {h.close}</span>}
                                            </div>
                                        )) : <p className="text-xs text-slate-400">Saat ayarı yapılmamış.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* SAĞ SÜTUN (Premium Karanlık Rezervasyon Paneli) */}
                <div className="lg:col-span-5 relative mt-10 lg:mt-0">
                    <div className="lg:sticky lg:top-28 bg-[#1A1A1A] text-white border border-white/10 rounded-[40px] p-6 md:p-10 flex flex-col shadow-2xl min-h-[500px]">
                        
                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                                {bookingPhase === 1 ? 'VIP Rezervasyon' : 'Talebi Tamamla'}
                            </h3>
                            {bookingPhase > 1 && <button onClick={() => setBookingPhase(bookingPhase - 1)} className="text-[10px] font-black uppercase text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border-none cursor-pointer tracking-widest flex items-center transition-colors"><ChevronLeft size={14} className="mr-1"/>Geri</button>}
                        </div>
                        
                        {/* ADIM 1: Başlangıç */}
                        {bookingPhase === 1 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 mt-6">
                                <Music size={56} className="mb-6 text-white/30"/>
                                <p className="font-bold uppercase text-xs tracking-widest leading-relaxed">Bir Loca, Stand veya<br/>Etkinlik Seçerek Başlayın.</p>
                            </div>
                        )}

                        {/* ADIM 2: Rezervasyon Bilgileri */}
                        {bookingPhase === 2 && (
                            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 animate-in slide-in-from-right duration-300">
                                {/* Seçilen Opsiyon */}
                                <div className="bg-white/5 p-5 rounded-3xl mb-2 border border-white/10 flex flex-col gap-2">
                                    <div className="text-[10px] text-[#E8622A] font-black uppercase tracking-widest">Seçilen Kategori</div>
                                    <div className="font-bold text-lg">{bookingData.selectedShopService?.name}</div>
                                </div>
                                
                                {/* Tarih */}
                                <div>
                                    <label className="text-[10px] font-black uppercase text-white/50 tracking-widest mb-2 flex items-center gap-2"><Calendar size={14}/> Rezervasyon Tarihi</label>
                                    <input required type="date" min={new Date().toISOString().split('T')[0]} value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} className="w-full p-4 rounded-xl border border-white/10 bg-black/50 text-white font-bold shadow-sm outline-none focus:border-[#E8622A]" />
                                </div>

                                {/* Kişisel Bilgiler */}
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <input required placeholder="Adınız" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-4 rounded-xl border border-white/10 bg-black/50 text-white font-bold text-sm outline-none focus:border-[#E8622A] placeholder:text-white/30" />
                                    <input required placeholder="Soyadınız" value={formData.surname} onChange={(e) => setFormData({...formData, surname: e.target.value})} className="p-4 rounded-xl border border-white/10 bg-black/50 text-white font-bold text-sm outline-none focus:border-[#E8622A] placeholder:text-white/30" />
                                </div>
                                <input required type="email" placeholder="E-posta Adresiniz" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="p-4 rounded-xl border border-white/10 bg-black/50 text-white font-bold text-sm outline-none focus:border-[#E8622A] placeholder:text-white/30" />
                                <input required type="tel" placeholder="Telefon Numaranız" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="p-4 rounded-xl border border-white/10 bg-black/50 text-white font-bold text-sm outline-none focus:border-[#E8622A] placeholder:text-white/30" />
                                
                                {/* Kulüp Kuralları & Uyarılar */}
                                <div className="flex flex-col gap-2 mt-2">
                                    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                                        <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-red-200 leading-relaxed font-medium">Bu mekanda <strong className="text-white">18 Yaş Sınırı</strong> ve <strong className="text-white">Dress Code (Kılık Kıyafet)</strong> uygulaması bulunmaktadır. Mekan, uygun görmediği kişileri rezervasyonu olsa dahi içeri almama hakkını saklı tutar.</p>
                                    </div>
                                </div>

                                {/* Sözleşme */}
                                <div className="flex items-start gap-3 mt-2 border-t pt-5 border-white/10">
                                    <input required type="checkbox" id="termsClub" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} className="mt-1 accent-[#E8622A] cursor-pointer" />
                                    <label htmlFor="termsClub" className="text-xs text-white/50 leading-relaxed cursor-pointer">Kulüp giriş kurallarını ve rezervasyon <span className="text-[#E8622A] font-bold underline">kullanım şartlarını</span> okudum, onaylıyorum.</label>
                                </div>
                                
                                <button type="submit" className="bg-[#E8622A] hover:bg-[#d65520] text-white py-5 rounded-2xl font-black uppercase tracking-widest border-none cursor-pointer shadow-[0_0_20px_rgba(232,98,42,0.3)] mt-2 transition-all hover:-translate-y-1">Rezervasyon Talebi Gönder</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}