'use client';
import React, { useState } from 'react';
import { Music, Calendar, MapPin, CheckCircle2, Phone, Mail, Link } from 'lucide-react';

export default function BarClubFlow({ shop, bookingHelpers }) {
    const [profileTab, setProfileTab] = useState('events');
    const { bookingPhase, setBookingPhase, bookingData, setBookingData, formData, setFormData, handleBooking } = bookingHelpers;

    return (
        <div className="w-full">
            <div className="flex gap-6 border-b mb-10 px-6">
                <button onClick={() => setProfileTab('events')} className={`pb-4 text-sm font-black border-none cursor-pointer border-b-4 ${profileTab === 'events' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400'}`}>ETKİNLİKLER</button>
                <button onClick={() => setProfileTab('gallery')} className={`pb-4 text-sm font-black border-none cursor-pointer border-b-4 ${profileTab === 'gallery' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400'}`}>GALERİ</button>
                <button onClick={() => setProfileTab('about')} className={`pb-4 text-sm font-black border-none cursor-pointer border-b-4 ${profileTab === 'about' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400'}`}>HAKKINDA</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 px-6">
                    {profileTab === 'events' && (
                        <div className="flex flex-col gap-4">
                            {shop?.events?.map(ev => (
                                <div key={ev.id} onClick={() => { setBookingData({...bookingData, selectedEvent: ev}); setBookingPhase(2); }} className="flex gap-4 p-4 bg-white rounded-[32px] border border-slate-200 hover:border-[#E8622A] cursor-pointer transition-all">
                                    <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                                        {ev.image_url ? <img src={ev.image_url} className="w-full h-full object-cover"/> : <Music size={24}/>}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-xl text-[#2D1B4E] uppercase">{ev.name}</h4>
                                        <div className="text-[#E8622A] font-bold text-sm mt-1">{ev.date} • {ev.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Galeri ve Hakkında kısımları StandardFlow ile aynı mantıkta buraya da eklenebilir */}
                </div>

                <div className="lg:col-span-5 relative">
                    <div className="lg:sticky lg:top-28 bg-[#2D1B4E] text-white rounded-[40px] p-8 flex flex-col shadow-2xl min-h-[400px]">
                        <h3 className="text-xl font-black uppercase mb-6 border-b border-white/10 pb-4">VIP Rezervasyon</h3>
                        {bookingPhase === 1 ? (
                            <div className="flex-1 flex flex-col items-center justify-center opacity-40"><Calendar size={48} className="mb-4"/><p className="font-bold text-xs uppercase">Bir Etkinlik Seçin</p></div>
                        ) : (
                            <form onSubmit={handleBooking} className="flex flex-col gap-4">
                                <div className="bg-white/10 p-4 rounded-2xl mb-2">
                                    <div className="text-[10px] font-black uppercase text-orange-400">Seçili Etkinlik</div>
                                    <div className="font-bold">{bookingData.selectedEvent?.name}</div>
                                </div>
                                <input required placeholder="Adınız Soyadınız" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-4 rounded-xl border-none bg-white text-black font-bold" />
                                <input required type="tel" placeholder="Telefon" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="p-4 rounded-xl border-none bg-white text-black font-bold" />
                                <button type="submit" className="bg-[#E8622A] text-white py-5 rounded-2xl font-black uppercase border-none cursor-pointer mt-4">Rezervasyonu Tamamla</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}