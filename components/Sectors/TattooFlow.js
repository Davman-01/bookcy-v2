'use client';
import React, { useState } from 'react';
import { MapPin, Clock, Scissors, Users, CalendarOff, CheckCircle2, Phone, Mail, Link } from 'lucide-react';
import TattooBriefForm from '../TattooBriefForm';

export default function TattooFlow({ shop, bookingHelpers, currentAvailableSlots }) {
    const [profileTab, setProfileTab] = useState('quote'); // Varsayılan Dövme
    const { bookingPhase, setBookingPhase, bookingData, setBookingData, formData, setFormData, handleBooking } = bookingHelpers;

    // --- VERİ GARANTİ KATMANI ---
    const shopDescription = shop?.description || shop?.about || shop?.bio || shop?.about_text || 'İşletme açıklaması yakında eklenecek.';
    const shopPhone = shop?.phone || shop?.mobile_phone || shop?.shop_phone || 'Bilinmiyor';
    const shopEmail = shop?.email || shop?.contact_email || shop?.admin_email || 'Bilinmiyor';
    const shopInsta = shop?.instagram || shop?.instagram_url;
    const shopFb = shop?.facebook || shop?.facebook_url;

    // Çalışma saatlerini parse etme
    let workingHours = [];
    try {
        workingHours = typeof shop?.working_hours === 'string' ? JSON.parse(shop.working_hours) : (shop?.working_hours || []);
    } catch (e) { workingHours = []; }

    return (
        <div className="w-full">
            {/* Sekme Menüsü */}
            <div className="flex gap-6 md:gap-10 border-b border-slate-200 mb-10 overflow-x-auto custom-scrollbar px-2 md:px-6">
                <button onClick={() => setProfileTab('quote')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'quote' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>DÖVME</button>
                <button onClick={() => setProfileTab('piercing')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'piercing' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>PIERCING</button>
                <button onClick={() => setProfileTab('gallery')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'gallery' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>GALERİ</button>
                <button onClick={() => setProfileTab('about')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'about' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>HAKKINDA</button>
            </div>

            <div className={(profileTab === 'quote' || profileTab === 'piercing') ? "w-full max-w-5xl mx-auto px-2 md:px-6" : "grid grid-cols-1 lg:grid-cols-12 gap-10"}>
                <div className={(profileTab === 'quote' || profileTab === 'piercing') ? "w-full" : "lg:col-span-7"}>
                    
                    {/* DÖVME FORMU */}
                    {profileTab === 'quote' && <TattooBriefForm shopId={shop?.id} />}

                    {/* PIERCING LİSTESİ */}
                    {profileTab === 'piercing' && (
                        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                            {shop?.services?.length > 0 ? shop.services.map(srv => (
                                <div key={srv.id} onClick={() => { setBookingData({...bookingData, selectedShopService: srv}); setBookingPhase(2); }} className={`p-6 md:p-8 bg-white rounded-[32px] border cursor-pointer flex justify-between items-center transition-all ${bookingData?.selectedShopService?.id === srv.id ? 'border-[#E8622A] shadow-md' : 'border-slate-200 hover:border-[#E8622A]'}`}>
                                    <div><h4 className="font-black text-lg text-[#2D1B4E]">{srv.name}</h4><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1"><Clock size={12} className="inline mr-1"/> {srv.duration} Dk</div></div>
                                    <div className="flex items-center gap-6"><span className="font-black text-xl text-[#2D1B4E]">{srv.price} TL</span><button className="bg-slate-100 px-6 py-2 rounded-xl font-black text-[10px] uppercase border-none cursor-pointer">SEÇ</button></div>
                                </div>
                            )) : <div className="p-10 text-center font-bold text-slate-400 bg-white rounded-[32px] border border-dashed">Henüz piercing hizmeti eklenmemiş.</div>}
                        </div>
                    )}

                    {/* GALERİ */}
                    {profileTab === 'gallery' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in zoom-in duration-300">
                            {shop?.gallery?.map((img, idx) => (
                                <div key={idx} className="h-64 rounded-3xl overflow-hidden border border-slate-200 shadow-sm"><img src={img} className="w-full h-full object-cover" alt="tattoo" /></div>
                            ))}
                        </div>
                    )}

                    {/* HAKKINDA */}
                    {profileTab === 'about' && (
                        <div className="flex flex-col gap-8 animate-in slide-in-from-bottom duration-500">
                            <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[40px] shadow-sm">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-4 border-l-4 border-[#E8622A] pl-3">Hakkımızda</h3>
                                <p className="text-slate-600 text-sm font-medium whitespace-pre-wrap leading-relaxed">{shopDescription}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm flex flex-col gap-5">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-2 border-b pb-4">İletişim & Sosyal Medya</h3>
                                    <div className="flex items-center gap-3 text-slate-600 font-bold"><Phone size={18} className="text-[#E8622A]"/> {shopPhone}</div>
                                    <div className="flex items-center gap-3 text-slate-600 font-bold"><Mail size={18} className="text-[#E8622A]"/> {shopEmail}</div>
                                    {shopInsta && <a href={shopInsta.includes('http') ? shopInsta : `https://instagram.com/${shopInsta.replace('@','')}`} target="_blank" className="flex items-center gap-3 text-[#E1306C] font-bold"><Link size={18} /> Instagram Hesabımız</a>}
                                    {shopFb && <a href={shopFb.includes('http') ? shopFb : `https://facebook.com/${shopFb}`} target="_blank" className="flex items-center gap-3 text-[#1877F2] font-bold"><Link size={18} /> Facebook Sayfamız</a>}
                                </div>
                                <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-6 border-b pb-4">Çalışma Saatleri</h3>
                                    <div className="flex flex-col gap-3">
                                        {workingHours.length > 0 ? workingHours.map((h, i) => (
                                            <div key={i} className="flex justify-between items-center text-sm font-bold">
                                                <span className="text-slate-500">{h.day}</span>
                                                {h.isClosed ? <span className="text-red-500">Kapalı</span> : <span className="text-[#2D1B4E]">{h.open} - {h.close}</span>}
                                            </div>
                                        )) : <p className="text-xs text-slate-400 font-bold uppercase">Vitrin ayarlarından kontrol ediniz.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* PIERCING RANDEVU SAĞ PANEL */}
                {profileTab === 'piercing' && (
                    <div className="lg:col-span-5 relative mt-10 lg:mt-0">
                        <div className="lg:sticky lg:top-28 bg-white border border-slate-200 rounded-[40px] p-8 flex flex-col shadow-xl min-h-[500px]">
                            <h3 className="text-xl font-black uppercase text-[#2D1B4E] mb-6 border-b pb-4">Piercing Randevusu</h3>
                            {bookingPhase === 1 && <div className="flex-1 flex flex-col items-center justify-center opacity-40 text-center"><Scissors size={48} className="mb-4"/><p className="font-bold text-xs">Piercing Seçerek Başlayın</p></div>}
                            {bookingPhase >= 2 && (
                                <form onSubmit={handleBooking} className="flex flex-col gap-4 animate-in fade-in">
                                    <div className="bg-orange-50 p-4 rounded-2xl mb-2 text-[#E8622A] font-bold text-sm">Seçilen: {bookingData.selectedShopService?.name}</div>
                                    <input type="date" value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} className="p-4 rounded-xl border font-bold" />
                                    <div className="grid grid-cols-3 gap-2">
                                        {currentAvailableSlots.map(s => <button key={s} type="button" onClick={() => setBookingData({...bookingData, time: s})} className={`p-2 border rounded-lg text-xs font-bold transition-all ${bookingData.time === s ? 'bg-[#E8622A] text-white border-[#E8622A]' : 'hover:border-[#E8622A]'}`}>{s}</button>)}
                                    </div>
                                    <input required placeholder="Adınız Soyadınız" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-4 rounded-xl border bg-slate-50 font-bold" />
                                    <input required type="tel" placeholder="Telefon" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="p-4 rounded-xl border bg-slate-50 font-bold" />
                                    <button type="submit" className="bg-[#E8622A] text-white py-5 rounded-2xl font-black uppercase cursor-pointer shadow-lg mt-4 transition-transform hover:-translate-y-1">Randevuyu Tamamla</button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}