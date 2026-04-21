'use client';
import React, { useState } from 'react';
import { Music, GlassWater, Phone, Mail, Link, ChevronLeft, AlertTriangle, ShieldAlert, Calendar, CheckCircle2 } from 'lucide-react';

export default function BarClubFlow({ shop, bookingHelpers }) {
    const [profileTab, setProfileTab] = useState('events'); // Varsayılan sekme: Etkinlikler
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
            alert("Devam etmek için kulüp kurallarını onaylamalısınız.");
            return;
        }
        if (!bookingData.time) bookingData.time = "22:00"; // Gece kulübü için varsayılan saat
        handleBooking(e);
    };

    // İlerleme çubuğu (Stepper)
    const renderStepper = () => {
        return (
            <div className="flex items-center justify-between mb-8 relative px-2">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10 -translate-y-1/2"></div>
                {['Etkinlik', 'Loca/Masa', 'Onay'].map((label, index) => {
                    const step = index + 1;
                    const isActive = bookingPhase >= step;
                    return (
                        <div key={step} className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${isActive ? 'bg-[#E8622A] text-white shadow-[0_0_15px_rgba(232,98,42,0.4)]' : 'bg-[#2A2A2A] text-white/30 border border-white/10'}`}>
                                {isActive && step < bookingPhase ? <CheckCircle2 size={16} /> : step}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-white/30'}`}>{label}</span>
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
                    
                    {/* ADIM 1: ETKİNLİKLER */}
                    {profileTab === 'events' && (
                        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                            <div className="flex items-center gap-3 mb-2 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <Music size={16} className="text-[#E8622A]" /> Önce Bir Etkinlik Veya Tarih Seçin
                            </div>

                            {shop?.events?.length > 0 ? (
                                shop.events.map(ev => (
                                    <div key={ev.id} onClick={() => { setBookingData({...bookingData, selectedEvent: ev}); setProfileTab('tables'); setBookingPhase(2); }} className={`p-6 bg-white rounded-[32px] border cursor-pointer flex justify-between items-center transition-all ${bookingData?.selectedEvent?.id === ev.id ? 'border-[#E8622A] shadow-lg scale-[1.02]' : 'border-slate-200 hover:border-[#E8622A]'}`}>
                                        <div><h4 className="font-black text-xl text-[#2D1B4E] uppercase">{ev.name}</h4><div className="text-sm font-bold text-[#E8622A] mt-1">{ev.date}</div></div>
                                        <button className="px-6 py-3 rounded-xl font-black text-[10px] uppercase border-none bg-slate-100 text-slate-600">SEÇ</button>
                                    </div>
                                ))
                            ) : (
                                <div onClick={() => { setBookingData({...bookingData, selectedEvent: {name: 'Standart Gece (Etkinlik Yok)'}}); setProfileTab('tables'); setBookingPhase(2); }} className="p-8 bg-white rounded-[32px] border border-slate-200 cursor-pointer hover:border-[#E8622A] hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#E8622A] group-hover:scale-110 transition-transform"><Calendar size={20} /></div>
                                        <div><h4 className="font-black text-lg text-[#2D1B4E] uppercase">Standart Rezervasyon</h4><p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Özel Bir Etkinlik Olmayan Geceler İçin</p></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ADIM 2: LOCA & BİSTRO (HİZMETLER) */}
                    {profileTab === 'tables' && (
                        <div className="flex flex-col gap-4 animate-in slide-in-from-right duration-300">
                            <div className="flex items-center gap-3 mb-2 px-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <GlassWater size={16} className="text-[#E8622A]" /> Şimdi Kategoriyi Belirleyin
                            </div>

                            {shop?.services?.length > 0 ? shop.services.map(srv => (
                                <div key={srv.id} onClick={() => { setBookingData({...bookingData, selectedShopService: srv}); setBookingPhase(3); }} className={`p-6 md:p-8 bg-white rounded-[32px] border cursor-pointer flex justify-between items-center transition-all ${bookingData?.selectedShopService?.id === srv.id ? 'border-[#E8622A] shadow-lg scale-[1.02]' : 'border-slate-200 hover:border-[#E8622A] hover:shadow-md'}`}>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h4 className="font-black text-lg text-[#2D1B4E] uppercase">{srv.name}</h4>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{srv.duration ? `${srv.duration} DK.` : 'Hızlı Giriş'}</div>
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
                                    {shopInsta && <a href={shopInsta.includes('http') ? shopInsta : `https://instagram.com/${shopInsta.replace('@','')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 font-bold hover:text-[#E1306C]"><Link size={18} className="text-[#E8622A]"/> Instagram</a>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* SAĞ SÜTUN (Premium Karanlık VIP Paneli) */}
                <div className="lg:col-span-5 relative mt-10 lg:mt-0">
                    <div className="lg:sticky lg:top-28 bg-[#121212] text-white border border-white/5 rounded-[40px] p-6 md:p-10 flex flex-col shadow-2xl min-h-[500px]">
                        
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-6">
                            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight flex items-center gap-2">VIP Rezervasyon</h3>
                            {bookingPhase > 1 && <button onClick={() => { setBookingPhase(bookingPhase - 1); setProfileTab(bookingPhase === 2 ? 'events' : 'tables'); }} className="text-[10px] font-black uppercase text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border-none cursor-pointer tracking-widest flex items-center transition-colors"><ChevronLeft size={14} className="mr-1"/>Geri</button>}
                        </div>
                        
                        {renderStepper()}

                        {/* BEKLEME EKRANLARI */}
                        {bookingPhase === 1 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 mt-6">
                                <Music size={56} className="mb-6 text-white/20"/>
                                <p className="font-bold uppercase text-xs tracking-widest leading-relaxed">Lütfen sol taraftan<br/>bir etkinlik seçin.</p>
                            </div>
                        )}

                        {bookingPhase === 2 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 mt-6 animate-in fade-in">
                                <GlassWater size={56} className="mb-6 text-white/20"/>
                                <p className="font-bold uppercase text-xs tracking-widest leading-relaxed">Lütfen sol taraftan<br/>Loca veya Bistro seçin.</p>
                            </div>
                        )}

                        {/* FORM EKRANI */}
                        {bookingPhase === 3 && (
                            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 animate-in slide-in-from-right duration-300">
                                
                                {/* Seçim Özeti Kartı */}
                                <div className="bg-white/5 p-5 rounded-3xl mb-2 border border-white/10 flex flex-col gap-3">
                                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                        <span className="font-bold text-sm text-white/80 uppercase">{bookingData.selectedShopService?.name}</span>
                                        <span className="font-black text-[#E8622A]">{bookingData.selectedShopService?.price > 0 ? `${bookingData.selectedShopService.price} TL` : 'Ücretsiz'}</span>
                                    </div>
                                    <div className="text-[11px] text-white/50 font-bold tracking-widest uppercase flex flex-col gap-1">
                                        <span>Etkinlik: <span className="text-white">{bookingData.selectedEvent?.name}</span></span>
                                    </div>
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
                                <input required type="tel" placeholder="Telefon Numaranız" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="p-4 rounded-xl border border-white/10 bg-black/50 text-white font-bold text-sm outline-none focus:border-[#E8622A] placeholder:text-white/30" />
                                
                                {/* Kulüp Kuralları & Uyarılar */}
                                <div className="flex flex-col gap-2 mt-2">
                                    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                                        <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-red-200 leading-relaxed font-medium">Bu mekanda <strong className="text-white">18 Yaş Sınırı</strong> ve <strong className="text-white">Kılık Kıyafet (Dress Code)</strong> kuralı geçerlidir. Rezervasyonunuz olsa dahi mekan giriş inisiyatifini saklı tutar.</p>
                                    </div>
                                </div>

                                {/* Sözleşme */}
                                <div className="flex items-start gap-3 mt-2 border-t pt-5 border-white/10">
                                    <input required type="checkbox" id="termsClub" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} className="mt-1 accent-[#E8622A] cursor-pointer" />
                                    <label htmlFor="termsClub" className="text-[11px] text-white/50 leading-relaxed cursor-pointer font-bold">Mekan kurallarını ve <span className="text-[#E8622A] underline">kullanım şartlarını</span> okudum, onaylıyorum.</label>
                                </div>
                                
                                <button type="submit" className="bg-[#E8622A] hover:bg-[#d65520] text-white py-5 rounded-2xl font-black uppercase tracking-widest border-none cursor-pointer shadow-[0_0_20px_rgba(232,98,42,0.3)] mt-2 transition-all hover:-translate-y-1">Talebi Gönder</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}