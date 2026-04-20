'use client';
import React, { useState } from 'react';
import { Clock, Scissors, Users, CalendarOff, Phone, Mail, Link, MapPin } from 'lucide-react';

export default function StandardFlow({ shop, bookingHelpers, currentAvailableSlots }) {
    const [profileTab, setProfileTab] = useState('services');
    const { bookingPhase, setBookingPhase, bookingData, setBookingData, formData, setFormData, handleBooking } = bookingHelpers;

    const shopDescription = shop?.description || shop?.about || shop?.about_text || 'İşletme açıklaması yakında eklenecek.';

    return (
        <div className="w-full">
            <div className="flex gap-6 md:gap-10 border-b border-slate-200 mb-10 overflow-x-auto custom-scrollbar px-2 md:px-6">
                <button onClick={() => setProfileTab('services')} className={`pb-4 text-sm font-black uppercase border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'services' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400'}`}>HİZMETLER</button>
                <button onClick={() => setProfileTab('gallery')} className={`pb-4 text-sm font-black uppercase border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'gallery' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400'}`}>GALERİ</button>
                <button onClick={() => setProfileTab('about')} className={`pb-4 text-sm font-black uppercase border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'about' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400'}`}>HAKKINDA</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 px-2 md:px-6">
                    {profileTab === 'services' && (
                        <div className="flex flex-col gap-4">
                            {shop?.services?.map(srv => (
                                <div key={srv.id} onClick={() => { setBookingData({...bookingData, selectedShopService: srv}); setBookingPhase(2); }} className={`p-6 bg-white rounded-[32px] border cursor-pointer flex justify-between items-center transition-all ${bookingData?.selectedShopService?.id === srv.id ? 'border-[#E8622A] shadow-md' : 'border-slate-200'}`}>
                                    <div><h4 className="font-black text-lg text-[#2D1B4E]">{srv.name}</h4><div className="text-[10px] font-bold text-slate-400 uppercase mt-1">{srv.duration} Dk</div></div>
                                    <div className="flex items-center gap-6"><span className="font-black text-xl text-[#2D1B4E]">{srv.price} TL</span><button className="bg-[#E8622A] text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase border-none cursor-pointer">SEÇ</button></div>
                                </div>
                            ))}
                        </div>
                    )}
                    {profileTab === 'gallery' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {shop?.gallery?.map((img, idx) => <div key={idx} className="h-48 rounded-3xl overflow-hidden border"><img src={img} className="w-full h-full object-cover" /></div>)}
                        </div>
                    )}
                    {profileTab === 'about' && (
                        <div className="flex flex-col gap-6">
                            <div className="bg-white p-8 rounded-[32px] border"><p className="text-slate-600 leading-relaxed">{shopDescription}</p></div>
                            <div className="bg-white p-8 rounded-[32px] border flex flex-col gap-4">
                                <h3 className="text-sm font-black uppercase text-[#2D1B4E]">İletişim</h3>
                                <div className="flex items-center gap-3 text-slate-600 font-bold"><Phone size={18} className="text-[#E8622A]"/> {shop?.phone || shop?.mobile_phone}</div>
                                {shop?.instagram && <a href={`https://instagram.com/${shop.instagram.replace('@','')}`} target="_blank" className="flex items-center gap-3 text-slate-600 font-bold"><Link size={18} className="text-[#E8622A]"/> Instagram</a>}
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-5 relative">
                    <div className="lg:sticky lg:top-28 bg-white border rounded-[40px] p-8 flex flex-col shadow-xl min-h-[500px]">
                        <h3 className="text-xl font-black uppercase text-[#2D1B4E] mb-6 border-b pb-4">Randevu Al</h3>
                        {bookingPhase === 1 && <div className="flex-1 flex flex-col items-center justify-center opacity-40 text-center"><Scissors size={48} className="mb-4"/><p className="font-bold text-xs">Hizmet Seçiniz</p></div>}
                        {bookingPhase >= 2 && (
                            <form onSubmit={handleBooking} className="flex flex-col gap-4">
                                <input type="date" value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} className="p-4 rounded-xl border" />
                                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                                    {currentAvailableSlots.map(s => <button key={s} type="button" onClick={() => setBookingData({...bookingData, time: s})} className={`p-2 border rounded-lg text-xs font-bold ${bookingData.time === s ? 'bg-[#E8622A] text-white' : ''}`}>{s}</button>)}
                                </div>
                                <input required placeholder="Adınız Soyadınız" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-4 rounded-xl border bg-slate-50" />
                                <input required type="tel" placeholder="Telefon" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="p-4 rounded-xl border bg-slate-50" />
                                <button type="submit" className="bg-[#E8622A] text-white py-5 rounded-2xl font-black uppercase cursor-pointer shadow-lg mt-4">Onayla</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}