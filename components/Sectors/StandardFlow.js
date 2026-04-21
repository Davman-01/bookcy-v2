'use client';
import React, { useState } from 'react';
import { Clock, Scissors, Users, Phone, Mail, Link, ChevronLeft } from 'lucide-react';

export default function StandardFlow({ shop, bookingHelpers, currentAvailableSlots }) {
    const [profileTab, setProfileTab] = useState('services'); // Varsayılan: Hizmetler
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    
    const { bookingPhase, setBookingPhase, bookingData, setBookingData, formData, setFormData, handleBooking } = bookingHelpers;

    // --- VERİ GARANTİSİ (Sosyal Medya, Telefon, Hakkında) ---
    const shopDescription = shop?.description || shop?.about || shop?.bio || shop?.about_text || 'İşletme açıklaması yakında eklenecek.';
    const shopPhone = shop?.phone || shop?.mobile_phone || shop?.shop_phone;
    const shopEmail = shop?.email || shop?.contact_email || shop?.admin_email;
    const shopInsta = shop?.instagram || shop?.social_instagram || shop?.instagram_url;
    const shopFb = shop?.facebook || shop?.social_facebook || shop?.facebook_url;

    const isShopClosedToday = false; // İleride backend'e bağlanabilir

    let workingHours = [];
    try { workingHours = typeof shop?.working_hours === 'string' ? JSON.parse(shop.working_hours) : (shop?.working_hours || []); } 
    catch (e) { workingHours = []; }

    const handleFormSubmit = (e) => {
        if (!isTermsAccepted) {
            e.preventDefault();
            alert("Devam etmek için aydınlatma metnini onaylamalısınız.");
            return;
        }
        handleBooking(e);
    };

    return (
        <div className="w-full max-w-7xl mx-auto relative z-10">
            {/* Sekme Menüsü */}
            <div className="flex gap-6 md:gap-10 border-b border-slate-200 mb-10 overflow-x-auto custom-scrollbar px-2 md:px-6">
                <button onClick={() => setProfileTab('services')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'services' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>HİZMETLER</button>
                <button onClick={() => setProfileTab('gallery')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'gallery' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>GALERİ</button>
                <button onClick={() => setProfileTab('about')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'about' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>HAKKINDA</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* SOL SÜTUN (Hizmetler, Galeri, Hakkında) */}
                <div className="lg:col-span-7">
                    
                    {/* 1. HİZMETLER */}
                    {profileTab === 'services' && (
                        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                            {shop?.services?.length > 0 ? shop.services.map(srv => (
                                <div key={srv.id} onClick={() => { setBookingData({...bookingData, selectedShopService: srv}); setBookingPhase(2); }} className={`p-6 md:p-8 bg-white rounded-[32px] border cursor-pointer flex justify-between items-center transition-all ${bookingData?.selectedShopService?.id === srv.id ? 'border-[#E8622A] shadow-md' : 'border-slate-200 hover:border-[#E8622A]'}`}>
                                    <div>
                                        <h4 className="font-black text-lg text-[#2D1B4E]">{srv.name}</h4>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1"><Clock size={12} className="inline mr-1"/> {srv.duration} Dk</div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="font-black text-xl text-[#2D1B4E]">{srv.price} TL</span>
                                        <button className="bg-slate-100 px-6 py-2 rounded-xl font-black text-[10px] uppercase border-none cursor-pointer">SEÇ</button>
                                    </div>
                                </div>
                            )) : <div className="p-10 text-center font-bold text-slate-400 bg-white rounded-[32px] border border-dashed border-slate-300">Henüz hizmet eklenmemiş.</div>}
                        </div>
                    )}

                    {/* 2. GALERİ */}
                    {profileTab === 'gallery' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in zoom-in duration-300">
                            {shop?.gallery?.length > 0 ? shop.gallery.map((img, idx) => (
                                <div key={idx} className="h-64 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative group">
                                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="gallery-item" />
                                </div>
                            )) : <div className="col-span-full p-10 text-center font-bold text-slate-400">Görsel bulunamadı.</div>}
                        </div>
                    )}

                    {/* 3. HAKKINDA */}
                    {profileTab === 'about' && (
                        <div className="flex flex-col gap-8 animate-in slide-in-from-bottom duration-500">
                            <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[40px] shadow-sm">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-4 border-l-4 border-[#E8622A] pl-3">Hakkımızda</h3>
                                <p className="text-slate-600 text-sm font-medium whitespace-pre-wrap leading-relaxed">{shopDescription}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm flex flex-col gap-5">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-2 border-b pb-4">İletişim & Sosyal Medya</h3>
                                    {shopPhone && <div className="flex items-center gap-3 text-slate-600 font-bold"><Phone size={18} className="text-[#E8622A]"/> {shopPhone}</div>}
                                    {shopEmail && <div className="flex items-center gap-3 text-slate-600 font-bold"><Mail size={18} className="text-[#E8622A]"/> {shopEmail}</div>}
                                    {shopInsta && <a href={shopInsta.includes('http') ? shopInsta : `https://instagram.com/${shopInsta.replace('@','')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 font-bold hover:text-[#E1306C]"><Link size={18} className="text-[#E8622A]"/> Instagram Hesabımız</a>}
                                    {shopFb && <a href={shopFb.includes('http') ? shopFb : `https://facebook.com/${shopFb}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 font-bold hover:text-[#1877F2]"><Link size={18} className="text-[#E8622A]"/> Facebook Sayfamız</a>}
                                    {!shopPhone && !shopEmail && !shopInsta && !shopFb && <p className="text-xs text-slate-400 font-bold uppercase">İletişim bilgisi girilmemiş.</p>}
                                </div>
                                <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-6 border-b pb-4">Çalışma Saatleri</h3>
                                    <div className="flex flex-col gap-3">
                                        {workingHours.length > 0 ? workingHours.map((h, i) => (
                                            <div key={i} className="flex justify-between items-center text-sm font-bold">
                                                <span className="text-slate-500">{h.day}</span>
                                                {h.isClosed ? <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded text-[10px]">Kapalı</span> : <span className="text-[#2D1B4E]">{h.open} - {h.close}</span>}
                                            </div>
                                        )) : <p className="text-xs text-slate-400 font-bold uppercase">Saat ayarı yapılmamış.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* SAĞ SÜTUN (Randevu Paneli) */}
                <div className="lg:col-span-5 relative mt-10 lg:mt-0">
                    <div className="lg:sticky lg:top-28 bg-white border border-slate-200 rounded-[40px] p-6 md:p-10 flex flex-col shadow-xl min-h-[500px]">
                        <div className="flex justify-between items-center mb-8 border-b pb-6">
                            <h3 className="text-xl md:text-2xl font-black uppercase text-[#2D1B4E] tracking-tight">{bookingPhase === 1 ? 'Seçim Yapın' : 'Randevu Al'}</h3>
                            {bookingPhase > 1 && <button onClick={() => setBookingPhase(bookingPhase - 1)} className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-4 py-2 rounded-xl border-none cursor-pointer tracking-widest flex items-center"><ChevronLeft size={14} className="mr-1"/>Geri</button>}
                        </div>
                        
                        {bookingPhase === 1 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                                <Scissors size={48} className="mb-4 text-slate-300"/> 
                                <p className="font-bold uppercase text-xs tracking-widest text-slate-500">Hizmet Seçerek Başlayın</p>
                            </div>
                        )}
                        
                        {bookingPhase === 2 && (
                            <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-300">
                                {/* 1. Tarih */}
                                <div><label className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Tarih Seçin</label><input type="date" min={new Date().toISOString().split('T')[0]} value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} className="w-full p-4 rounded-xl border border-slate-200 font-bold bg-white text-[#2D1B4E] shadow-sm" /></div>
                                
                                {/* 2. Saat */}
                                <div><label className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Saat Seçin</label>{isShopClosedToday ? ( <div className="p-6 text-center text-red-500 font-bold bg-red-50 rounded-2xl border">Kapalı</div> ) : ( <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar"> {currentAvailableSlots.map(s => <button key={s} type="button" onClick={() => setBookingData({...bookingData, time: s})} className={`p-3 border rounded-xl text-xs font-bold transition-all ${bookingData.time === s ? 'bg-[#E8622A] text-white border-[#E8622A] shadow-md scale-105' : 'bg-white hover:border-[#E8622A] hover:bg-orange-50'}`}>{s}</button>)} </div> )}</div>

                                {/* 3. Uzman */}
                                <div><label className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Uzman Seçin</label><div className="grid grid-cols-2 gap-3">
                                    <div onClick={() => setBookingData({...bookingData, selectedStaff: { name: 'Fark Etmez' }})} className={`p-4 border rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${bookingData.selectedStaff?.name === 'Fark Etmez' ? 'border-[#E8622A] bg-orange-50' : 'border-slate-200 hover:border-[#E8622A]'}`}><Users size={16} className="text-slate-400"/><span className="font-bold text-sm">Fark Etmez</span></div>
                                    {shop?.staff?.map(p => <div key={p.id} onClick={() => setBookingData({...bookingData, selectedStaff: p})} className={`p-4 border rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${bookingData.selectedStaff?.id === p.id ? 'border-[#E8622A] bg-orange-50' : 'border-slate-200 hover:border-[#E8622A]'}`}><div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-[10px]">{p.name.charAt(0)}</div><span className="font-bold text-sm">{p.name}</span></div>)}
                                </div></div>

                                <button onClick={() => { if(bookingData.time && bookingData.selectedStaff) setBookingPhase(3); else alert("Lütfen saat ve uzman seçin."); }} className="bg-[#E8622A] text-white py-5 rounded-2xl font-black uppercase tracking-widest border-none cursor-pointer shadow-lg mt-auto transition-all hover:scale-105">Devam Et</button>
                            </div>
                        )}

                        {bookingPhase === 3 && (
                            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 animate-in fade-in duration-300">
                                <div className="bg-orange-50 p-5 rounded-3xl mb-2 text-[#E8622A] font-bold text-sm border border-orange-100 flex flex-col gap-2">
                                    <div>{bookingData.selectedShopService?.name}</div>
                                    <div className="text-xs text-slate-500">{bookingData.date} | {bookingData.time} | Uzman: {bookingData.selectedStaff?.name}</div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <input required placeholder="Adınız" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm" />
                                    <input required placeholder="Soyadınız" value={formData.surname} onChange={(e) => setFormData({...formData, surname: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm" />
                                </div>
                                <input required type="email" placeholder="E-posta Adresiniz" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm" />
                                <input required type="tel" placeholder="Telefon Numaranız (WhatsApp)" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-slate-50 font-bold text-sm" />
                                
                                {/* Sözleşme */}
                                <div className="flex items-start gap-3 mt-4 border-t pt-6 border-slate-100">
                                    <input required type="checkbox" id="terms" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} className="mt-1 accent-[#E8622A] cursor-pointer" />
                                    <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer">Rezervasyon ve kişisel verilerimin işlenmesine ilişkin <span className="text-[#E8622A] font-bold underline">kullanım şartlarını</span> okudum, onaylıyorum.</label>
                                </div>
                                
                                <button type="submit" className="bg-[#E8622A] text-white py-5 rounded-2xl font-black uppercase tracking-widest border-none cursor-pointer shadow-lg mt-4 transition-all hover:scale-105">Randevuyu Tamamla</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}