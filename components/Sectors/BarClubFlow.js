'use client';
import React, { useState } from 'react';
import { Music, GlassWater, Phone, Mail, Link, ChevronLeft, ShieldCheck, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function BarClubFlow({ shop, bookingHelpers }) {
    const [profileTab, setProfileTab] = useState('events'); // Varsayılan: Etkinlikler
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    
    const { bookingPhase, setBookingPhase, bookingData, setBookingData, formData, setFormData, handleBooking } = bookingHelpers;

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
        
        // Gece kulübü için saat seçimi yoksa varsayılan saat ataması
        if (!bookingData.time) bookingData.time = "22:00"; 
        
        handleBooking(e);
    };

    // İlerleme Çubuğu (Stepper)
    const renderStepper = () => {
        return (
            <div className="flex items-center justify-between mb-8 relative px-2">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
                {['Etkinlik', 'Loca/Masa', 'Onay'].map((label, index) => {
                    const step = index + 1;
                    const isActive = bookingPhase >= step;
                    return (
                        <div key={step} className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${isActive ? 'bg-[#E8622A] text-white shadow-md' : 'bg-white text-slate-300 border-2 border-slate-100'}`}>
                                {isActive && step < bookingPhase ? <CheckCircle2 size={16} /> : step}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-[#E8622A]' : 'text-slate-400'}`}>{label}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto relative z-10">
            {/* Sekmeler */}
            <div className="flex gap-6 md:gap-10 border-b border-slate-200 mb-10 overflow-x-auto custom-scrollbar px-2 md:px-6">
                <button onClick={() => setProfileTab('events')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'events' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>1. ETKİNLİKLER</button>
                <button onClick={() => setProfileTab('tables')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'tables' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>2. LOCA & BİSTRO</button>
                <button onClick={() => setProfileTab('gallery')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'gallery' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>GALERİ</button>
                <button onClick={() => setProfileTab('about')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'about' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>HAKKINDA</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* SOL SÜTUN */}
                <div className="lg:col-span-7">
                    
                    {/* ADIM 1: ETKİNLİKLER VEYA STANDART TARİH */}
                    {profileTab === 'events' && (
                        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                            <div className="flex items-center gap-2 mb-2 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <Calendar size={16} className="text-[#E8622A]" /> Önce Etkinlik veya Tarih Seçin
                            </div>

                            {/* Etkinlik Varsa Listele, Yoksa Standart Rezervasyon Göster */}
                            {shop?.events?.length > 0 ? shop.events.map(ev => (
                                <div key={ev.id} onClick={() => { setBookingData({...bookingData, selectedEvent: ev, date: ev.date}); setProfileTab('tables'); setBookingPhase(2); }} className={`p-6 bg-white rounded-[32px] border cursor-pointer flex justify-between items-center transition-all ${bookingData?.selectedEvent?.id === ev.id ? 'border-[#E8622A] shadow-lg scale-[1.02]' : 'border-slate-200 hover:border-[#E8622A]'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#E8622A]"><Music size={20} /></div>
                                        <div>
                                            <h4 className="font-black text-xl text-[#2D1B4E] uppercase">{ev.name}</h4>
                                            <div className="text-sm font-bold text-slate-500 mt-1">{ev.date}</div>
                                        </div>
                                    </div>
                                    <button className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase border-none transition-colors ${bookingData?.selectedEvent?.id === ev.id ? 'bg-[#E8622A] text-white' : 'bg-slate-100 text-slate-600'}`}>SEÇ</button>
                                </div>
                            )) : (
                                <div onClick={() => { setBookingData({...bookingData, selectedEvent: {name: 'Standart Gece (Özel Etkinlik Yok)'}}); setProfileTab('tables'); setBookingPhase(2); }} className={`p-8 bg-white rounded-[32px] border cursor-pointer transition-all ${bookingData?.selectedEvent?.name === 'Standart Gece (Özel Etkinlik Yok)' ? 'border-[#E8622A] shadow-lg scale-[1.02]' : 'border-slate-200 hover:border-[#E8622A] hover:shadow-md'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-[#E8622A]"><Calendar size={24} /></div>
                                        <div>
                                            <h4 className="font-black text-xl text-[#2D1B4E] uppercase">Standart Rezervasyon</h4>
                                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Kendi Tarihinizi Belirleyin</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ADIM 2: LOCA & BİSTRO (MASA SEÇİMİ) */}
                    {profileTab === 'tables' && (
                        <div className="flex flex-col gap-4 animate-in slide-in-from-right duration-300">
                            <div className="flex items-center gap-2 mb-2 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <GlassWater size={16} className="text-[#E8622A]" /> Şimdi Kategoriyi Belirleyin
                            </div>

                            {shop?.services?.length > 0 ? shop.services.map(srv => (
                                <div key={srv.id} onClick={() => { setBookingData({...bookingData, selectedShopService: srv}); setBookingPhase(3); }} className={`p-6 md:p-8 bg-white rounded-[32px] border cursor-pointer flex justify-between items-center transition-all ${bookingData?.selectedShopService?.id === srv.id ? 'border-[#E8622A] shadow-lg scale-[1.02]' : 'border-slate-200 hover:border-[#E8622A] hover:shadow-md'}`}>
                                    <div>
                                        <h4 className="font-black text-lg text-[#2D1B4E] uppercase">{srv.name}</h4>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            {srv.duration ? `${srv.duration} Kişilik` : 'Özel Servis'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="font-black text-xl text-[#2D1B4E]">{srv.price > 0 ? `${srv.price} TL` : 'ÜCRETSİZ'}</span>
                                        <button className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase border-none cursor-pointer transition-colors ${bookingData?.selectedShopService?.id === srv.id ? 'bg-[#E8622A] text-white' : 'bg-slate-100 text-slate-600'}`}>SEÇ</button>
                                    </div>
                                </div>
                            )) : <div className="p-10 text-center font-bold text-slate-400 bg-white rounded-[32px] border border-dashed border-slate-300">Henüz masa düzeni eklenmemiş.</div>}
                        </div>
                    )}

                    {/* GALERİ VE HAKKINDA */}
                    {profileTab === 'gallery' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in zoom-in duration-300">
                            {shop?.gallery?.length > 0 ? shop.gallery.map((img, idx) => (
                                <div key={idx} className="h-48 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative group"><img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="nightclub" /></div>
                            )) : <div className="col-span-full p-10 text-center font-bold text-slate-400">Görsel bulunamadı.</div>}
                        </div>
                    )}

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
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* SAĞ SÜTUN (Rezervasyon Paneli - Beyaz Temalı VIP) */}
                <div className="lg:col-span-5 relative mt-10 lg:mt-0">
                    <div className="lg:sticky lg:top-28 bg-white border border-slate-200 rounded-[40px] p-6 md:p-10 flex flex-col shadow-2xl min-h-[500px]">
                        
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-6">
                            <h3 className="text-xl md:text-2xl font-black uppercase text-[#2D1B4E] tracking-tight flex items-center gap-2">
                                {bookingPhase === 3 ? 'İşlemi Tamamla' : 'Rezervasyon Al'}
                            </h3>
                            {bookingPhase > 1 && <button onClick={() => { setBookingPhase(bookingPhase - 1); setProfileTab(bookingPhase === 2 ? 'events' : 'tables'); }} className="text-[10px] font-black uppercase text-slate-500 hover:text-[#2D1B4E] bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl border-none cursor-pointer tracking-widest flex items-center transition-colors"><ChevronLeft size={14} className="mr-1"/>Geri</button>}
                        </div>
                        
                        {renderStepper()}

                        {/* BEKLEME EKRANLARI */}
                        {bookingPhase === 1 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 mt-6">
                                <Music size={56} className="mb-6 text-slate-300"/>
                                <p className="font-bold uppercase text-xs tracking-widest leading-relaxed">Lütfen sol taraftan<br/>bir etkinlik seçin.</p>
                            </div>
                        )}

                        {bookingPhase === 2 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 mt-6 animate-in fade-in">
                                <GlassWater size={56} className="mb-6 text-slate-300"/>
                                <p className="font-bold uppercase text-xs tracking-widest leading-relaxed">Lütfen sol taraftan<br/>Loca veya Bistro seçin.</p>
                            </div>
                        )}

                        {/* FORM EKRANI */}
                        {bookingPhase === 3 && (
                            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 animate-in slide-in-from-right duration-300">
                                
                                {/* Seçim Özeti Kartı */}
                                <div className="bg-orange-50 p-5 rounded-3xl mb-2 border border-orange-100 flex flex-col gap-3">
                                    <div className="flex justify-between items-center border-b border-orange-200/50 pb-3">
                                        <span className="font-bold text-sm text-[#2D1B4E] uppercase">{bookingData.selectedShopService?.name}</span>
                                        <span className="font-black text-[#E8622A]">{bookingData.selectedShopService?.price > 0 ? `${bookingData.selectedShopService.price} TL` : 'Ücretsiz'}</span>
                                    </div>
                                    <div className="text-xs text-[#E8622A] font-bold tracking-widest uppercase flex flex-col gap-1">
                                        <span>Kategori: {bookingData.selectedEvent?.name}</span>
                                    </div>
                                </div>
                                
                                {/* Tarih */}
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2"><Calendar size={14}/> Rezervasyon Tarihi</label>
                                    <input required type="date" min={new Date().toISOString().split('T')[0]} value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} className="w-full p-4 rounded-xl border border-slate-200 bg-white text-[#2D1B4E] font-bold shadow-sm outline-none focus:border-[#E8622A]" />
                                </div>

                                {/* Kişisel Bilgiler */}
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <input required placeholder="Adınız" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-[#2D1B4E] font-bold text-sm outline-none focus:border-[#E8622A]" />
                                    <input required placeholder="Soyadınız" value={formData.surname} onChange={(e) => setFormData({...formData, surname: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-[#2D1B4E] font-bold text-sm outline-none focus:border-[#E8622A]" />
                                </div>
                                <input required type="email" placeholder="E-posta Adresiniz" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-[#2D1B4E] font-bold text-sm outline-none focus:border-[#E8622A]" />
                                <input required type="tel" placeholder="Telefon Numaranız" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-[#2D1B4E] font-bold text-sm outline-none focus:border-[#E8622A]" />
                                
                                {/* AÇIKLAMA (NOT) ALANI - YENİ EKLENDİ */}
                                <textarea placeholder="Mekana İletmek İstediğiniz Not (Opsiyonel)" value={formData.note || ''} onChange={(e) => setFormData({...formData, note: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-[#2D1B4E] font-bold text-sm outline-none focus:border-[#E8622A] min-h-[80px] resize-none" />

                                {/* Uyarılar */}
                                <div className="flex items-center gap-2 text-[10px] font-bold text-red-600 bg-red-50 p-3 rounded-xl mt-2 border border-red-100">
                                    <AlertTriangle size={14} className="shrink-0" /> Yaş sınırı ve kılık kıyafet kuralları geçerlidir.
                                </div>

                                {/* Sözleşme */}
                                <div className="flex items-start gap-3 mt-2 border-t pt-4 border-slate-100">
                                    <input required type="checkbox" id="termsClub" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} className="mt-1 accent-[#E8622A] cursor-pointer" />
                                    <label htmlFor="termsClub" className="text-[11px] text-slate-500 leading-relaxed cursor-pointer font-bold">Mekan kurallarını ve <span className="text-[#E8622A] underline">kullanım şartlarını</span> okudum, onaylıyorum.</label>
                                </div>
                                
                                <button type="submit" className="bg-[#E8622A] hover:bg-[#d65520] text-white py-5 rounded-2xl font-black uppercase tracking-widest border-none cursor-pointer shadow-lg mt-2 transition-all hover:-translate-y-1">Talebi Gönder</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}