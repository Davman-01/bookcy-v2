'use client';
import React, { useState } from 'react';
import { Clock, Scissors, Users, Phone, Mail, Link, ChevronLeft, Star, ShieldCheck, Calendar } from 'lucide-react';

export default function StandardFlow({ shop, bookingHelpers, currentAvailableSlots }) {
    const [profileTab, setProfileTab] = useState('services');
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    
    const { bookingPhase, setBookingPhase, bookingData, setBookingData, formData, setFormData, handleBooking } = bookingHelpers;

    const shopDescription = shop?.description || shop?.about || shop?.bio || shop?.about_text || 'İşletme açıklaması yakında eklenecek.';
    const shopPhone = shop?.phone || shop?.mobile_phone || shop?.shop_phone;
    const shopEmail = shop?.email || shop?.contact_email || shop?.admin_email;
    const shopInsta = shop?.instagram || shop?.social_instagram || shop?.instagram_url;
    const shopFb = shop?.facebook || shop?.social_facebook || shop?.facebook_url;

    const isShopClosedToday = false; 

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

    // İlerleme çubuğu (Stepper) için yardımcı fonksiyon
    const renderStepper = () => {
        return (
            <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
                {[1, 2, 3, 4].map((step) => (
                    <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${bookingPhase >= step ? 'bg-[#E8622A] text-white shadow-md' : 'bg-white text-slate-300 border-2 border-slate-100'}`}>
                        {step}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto relative z-10">
            {/* Sekmeler */}
            <div className="flex gap-6 md:gap-10 border-b border-slate-200 mb-10 overflow-x-auto custom-scrollbar px-2 md:px-6">
                <button onClick={() => setProfileTab('services')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'services' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>HİZMETLER</button>
                <button onClick={() => setProfileTab('gallery')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'gallery' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>GALERİ</button>
                <button onClick={() => setProfileTab('about')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'about' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>HAKKINDA</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* SOL SÜTUN */}
                <div className="lg:col-span-7">
                    
                    {profileTab === 'services' && (
                        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                            {/* Puanlama ve Güven Sinyali */}
                            <div className="flex items-center gap-2 mb-2 px-2">
                                <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-bold text-slate-700">4.9</span>
                                <span className="text-xs text-slate-400">(Mükemmel Hizmet)</span>
                            </div>

                            {shop?.services?.length > 0 ? shop.services.map(srv => (
                                <div key={srv.id} onClick={() => { setBookingData({...bookingData, selectedShopService: srv, selectedStaff: null, time: ''}); setBookingPhase(2); }} className={`p-6 md:p-8 bg-white rounded-[32px] border cursor-pointer flex justify-between items-center transition-all ${bookingData?.selectedShopService?.id === srv.id ? 'border-[#E8622A] shadow-lg scale-[1.02]' : 'border-slate-200 hover:border-[#E8622A] hover:shadow-md'}`}>
                                    <div>
                                        <h4 className="font-black text-lg text-[#2D1B4E]">{srv.name}</h4>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-1">
                                            <Clock size={12} className="text-[#E8622A]"/> {srv.duration} Dk.
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="font-black text-xl text-[#2D1B4E]">{srv.price} TL</span>
                                        <button className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase border-none cursor-pointer transition-colors ${bookingData?.selectedShopService?.id === srv.id ? 'bg-[#E8622A] text-white' : 'bg-slate-100 text-slate-500'}`}>SEÇ</button>
                                    </div>
                                </div>
                            )) : <div className="p-10 text-center font-bold text-slate-400 bg-white rounded-[32px] border border-dashed border-slate-300">Henüz hizmet eklenmemiş.</div>}
                        </div>
                    )}

                    {profileTab === 'gallery' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in zoom-in duration-300">
                            {shop?.gallery?.length > 0 ? shop.gallery.map((img, idx) => (
                                <div key={idx} className="h-48 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative group">
                                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="gallery-item" />
                                </div>
                            )) : <div className="col-span-full p-10 text-center font-bold text-slate-400">Görsel bulunamadı.</div>}
                        </div>
                    )}

                    {profileTab === 'about' && (
                        <div className="flex flex-col gap-8 animate-in slide-in-from-bottom duration-500">
                            <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[40px] shadow-sm">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-4 border-l-4 border-[#E8622A] pl-3">Hakkımızda</h3>
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
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-6 border-b pb-4">Çalışma Saatleri</h3>
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

                {/* SAĞ SÜTUN (Kusursuz Rezervasyon Paneli) */}
                <div className="lg:col-span-5 relative mt-10 lg:mt-0">
                    <div className="lg:sticky lg:top-28 bg-white border border-slate-200 rounded-[40px] p-6 md:p-10 flex flex-col shadow-2xl min-h-[500px]">
                        
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-6">
                            <h3 className="text-xl font-black uppercase text-[#2D1B4E] flex items-center gap-2">
                                {bookingPhase === 1 ? 'Randevu Al' : 'İşlemi Tamamla'}
                            </h3>
                            {bookingPhase > 1 && <button onClick={() => setBookingPhase(bookingPhase - 1)} className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 hover:bg-orange-50 px-4 py-2 rounded-xl border-none cursor-pointer tracking-widest flex items-center transition-colors"><ChevronLeft size={14} className="mr-1"/>Geri</button>}
                        </div>

                        {/* Adım Göstergesi (Stepper) */}
                        {bookingPhase > 1 && renderStepper()}
                        
                        {/* ADIM 1: Başlangıç */}
                        {bookingPhase === 1 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 mt-10">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <Scissors size={40} className="text-slate-300"/>
                                </div>
                                <p className="font-bold uppercase text-xs tracking-widest text-slate-500">Listeden bir hizmet seçerek<br/>randevu oluşturmaya başlayın.</p>
                            </div>
                        )}
                        
                        {/* ADIM 2: Uzman Seçimi */}
                        {bookingPhase === 2 && (
                            <div className="flex-1 flex flex-col gap-4 animate-in slide-in-from-right duration-300">
                                <div className="bg-orange-50 p-4 rounded-2xl mb-4 text-[#E8622A] font-bold text-sm border border-orange-100 flex justify-between items-center">
                                    <span>{bookingData.selectedShopService?.name}</span>
                                    <span className="text-lg">{bookingData.selectedShopService?.price} TL</span>
                                </div>

                                <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1 block">Uzman Seçiniz</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div onClick={() => setBookingData({...bookingData, selectedStaff: { name: 'Fark Etmez' }})} className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 h-28 ${bookingData.selectedStaff?.name === 'Fark Etmez' ? 'border-[#E8622A] bg-orange-50 shadow-md scale-105' : 'border-slate-200 hover:border-[#E8622A] bg-white'}`}>
                                        <Users size={24} className={bookingData.selectedStaff?.name === 'Fark Etmez' ? 'text-[#E8622A]' : 'text-slate-300'}/>
                                        <span className="font-bold text-xs uppercase tracking-widest">Fark Etmez</span>
                                    </div>
                                    {shop?.staff?.map(p => (
                                        <div key={p.id} onClick={() => setBookingData({...bookingData, selectedStaff: p})} className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 h-28 ${bookingData.selectedStaff?.id === p.id ? 'border-[#E8622A] bg-orange-50 shadow-md scale-105' : 'border-slate-200 hover:border-[#E8622A] bg-white'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${bookingData.selectedStaff?.id === p.id ? 'bg-[#E8622A] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                {p.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-xs uppercase tracking-widest">{p.name}</span>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => { if(bookingData.selectedStaff) setBookingPhase(3); else alert("Lütfen bir uzman seçin."); }} className="bg-[#E8622A] text-white py-5 rounded-2xl font-black uppercase tracking-widest border-none cursor-pointer shadow-lg mt-auto transition-transform hover:-translate-y-1">Tarih Seçimine Geç</button>
                            </div>
                        )}

                        {/* ADIM 3: Tarih ve Saat */}
                        {bookingPhase === 3 && (
                            <div className="flex-1 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
                                <div>
                                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2"><Calendar size={14}/> Randevu Tarihi</label>
                                    <input type="date" min={new Date().toISOString().split('T')[0]} value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value, time: ''})} className="w-full p-4 rounded-xl border border-slate-200 font-bold bg-white text-[#2D1B4E] shadow-sm outline-none focus:border-[#E8622A]" />
                                </div>
                                
                                <div>
                                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2"><Clock size={14}/> Uygun Saatler</label>
                                    {isShopClosedToday ? ( 
                                        <div className="p-6 text-center text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100">Bu tarihte kapalıyız.</div> 
                                    ) : ( 
                                        <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar"> 
                                            {currentAvailableSlots.map(s => (
                                                <button key={s} type="button" onClick={() => setBookingData({...bookingData, time: s})} className={`p-3 border rounded-xl text-xs font-bold transition-all ${bookingData.time === s ? 'bg-[#E8622A] text-white border-[#E8622A] shadow-md scale-105' : 'bg-white hover:border-[#E8622A] hover:bg-orange-50 text-[#2D1B4E]'}`}>{s}</button>
                                            ))} 
                                        </div> 
                                    )}
                                </div>

                                <button onClick={() => { if(bookingData.time) setBookingPhase(4); else alert("Lütfen bir saat seçin."); }} className="bg-[#E8622A] text-white py-5 rounded-2xl font-black uppercase tracking-widest border-none cursor-pointer shadow-lg mt-auto transition-transform hover:-translate-y-1">Bilgileri Onayla</button>
                            </div>
                        )}

                        {/* ADIM 4: Kişisel Bilgiler ve Onay */}
                        {bookingPhase === 4 && (
                            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 animate-in slide-in-from-right duration-300">
                                {/* Sepet Özeti */}
                                <div className="bg-slate-50 p-5 rounded-3xl mb-2 border border-slate-200 flex flex-col gap-3">
                                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                        <span className="font-bold text-sm text-[#2D1B4E]">{bookingData.selectedShopService?.name}</span>
                                        <span className="font-black text-[#E8622A]">{bookingData.selectedShopService?.price} TL</span>
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium flex flex-col gap-1">
                                        <span><strong className="text-slate-700">Tarih:</strong> {bookingData.date} | {bookingData.time}</span>
                                        <span><strong className="text-slate-700">Uzman:</strong> {bookingData.selectedStaff?.name}</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <input required placeholder="Adınız" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-white font-bold text-sm outline-none focus:border-[#E8622A]" />
                                    <input required placeholder="Soyadınız" value={formData.surname} onChange={(e) => setFormData({...formData, surname: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-white font-bold text-sm outline-none focus:border-[#E8622A]" />
                                </div>
                                <input required type="email" placeholder="E-posta Adresiniz" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-white font-bold text-sm outline-none focus:border-[#E8622A]" />
                                <input required type="tel" placeholder="Telefon Numaranız" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="p-4 rounded-xl border border-slate-200 bg-white font-bold text-sm outline-none focus:border-[#E8622A]" />
                                
                                {/* Güven Sinyalleri & Sözleşme */}
                                <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 p-3 rounded-xl mt-2 border border-green-100">
                                    <ShieldCheck size={14} /> Güvenli ve ücretsiz rezervasyon. Ödeme salonda yapılır.
                                </div>

                                <div className="flex items-start gap-3 mt-2 border-t pt-4 border-slate-100">
                                    <input required type="checkbox" id="terms" checked={isTermsAccepted} onChange={(e) => setIsTermsAccepted(e.target.checked)} className="mt-1 accent-[#E8622A] cursor-pointer" />
                                    <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer">Rezervasyon ve veri işleme <span className="text-[#E8622A] font-bold underline">kullanım şartlarını</span> okudum, onaylıyorum.</label>
                                </div>
                                
                                <button type="submit" className="bg-[#E8622A] text-white py-5 rounded-2xl font-black uppercase tracking-widest border-none cursor-pointer shadow-lg mt-2 transition-transform hover:-translate-y-1">Randevuyu Tamamla</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}