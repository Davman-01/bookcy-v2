'use client';
import React, { useState } from 'react';
import { Clock, Scissors, Phone, Mail, Link, Instagram, Facebook } from 'lucide-react';
import TattooBriefForm from '../TattooBriefForm';

export default function TattooFlow({ shop, setBookingData, setBookingPhase }) {
    const [profileTab, setProfileTab] = useState('quote'); // Varsayılan Dövme Sekmesi

    // --- PANEL VERİLERİNİ GARANTİYE ALAN KISIM ---
    const shopDescription = shop?.description || shop?.about || shop?.about_text || shop?.bio || 'İşletme açıklaması yakında eklenecek.';
    const shopPhone = shop?.phone || shop?.mobile_phone || shop?.shop_phone;
    const shopEmail = shop?.email || shop?.contact_email || shop?.admin_email;
    const shopInsta = shop?.instagram || shop?.social_instagram;
    const shopFb = shop?.facebook || shop?.social_facebook;

    // Çalışma saatlerini güvenli bir şekilde objeye çeviriyoruz
    let workingHours = [];
    try {
        workingHours = typeof shop?.working_hours === 'string' ? JSON.parse(shop.working_hours) : (shop?.working_hours || []);
    } catch (e) { 
        workingHours = []; 
    }

    return (
        <div className="w-full">
            {/* Sekme Menüsü */}
            <div className="flex gap-6 md:gap-10 border-b border-slate-200 mb-10 overflow-x-auto custom-scrollbar px-2 md:px-6 relative z-10">
                <button onClick={() => setProfileTab('quote')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'quote' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>DÖVME</button>
                <button onClick={() => setProfileTab('piercing')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'piercing' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>PIERCING</button>
                <button onClick={() => setProfileTab('gallery')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'gallery' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>GALERİ</button>
                <button onClick={() => setProfileTab('about')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'about' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>HAKKINDA</button>
            </div>

            <div className="w-full relative z-10">
                {/* 1. DÖVME FORMU (Tam Genişlik) */}
                {profileTab === 'quote' && (
                    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto">
                        <TattooBriefForm shopId={shop?.id} />
                    </div>
                )}

                {/* 2. PIERCING LİSTESİ */}
                {profileTab === 'piercing' && (
                    <div className="flex flex-col gap-4 animate-in fade-in duration-300 max-w-5xl mx-auto">
                        {shop?.services?.length > 0 ? shop.services.map(srv => (
                            <div key={srv.id} onClick={() => { setBookingData(prev => ({...prev, selectedShopService: srv})); setBookingPhase(2); }} className="p-6 md:p-8 bg-white rounded-[32px] border border-slate-200 cursor-pointer flex justify-between items-center transition-all hover:border-[#E8622A] hover:shadow-lg">
                                <div>
                                    <h4 className="font-black text-lg text-[#2D1B4E]">{srv.name}</h4>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        <Clock size={12} className="inline mr-1"/> {srv.duration} Dk
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="font-black text-xl text-[#2D1B4E]">{srv.price} TL</span>
                                    <button className="bg-slate-100 px-6 py-2 rounded-xl font-black text-[10px] uppercase border-none">SEÇ</button>
                                </div>
                            </div>
                        )) : (
                            <div className="p-10 text-center font-bold text-slate-400 bg-white rounded-[32px] border border-dashed border-slate-300">Henüz piercing hizmeti eklenmemiş.</div>
                        )}
                    </div>
                )}

                {/* 3. GALERİ */}
                {profileTab === 'gallery' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in zoom-in duration-300">
                        {shop?.gallery?.length > 0 ? shop.gallery.map((img, idx) => (
                            <div key={idx} className="h-64 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative">
                                <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="tattoo-work" />
                            </div>
                        )) : (
                            <div className="col-span-full p-10 text-center font-bold text-slate-400">Görsel bulunamadı.</div>
                        )}
                    </div>
                )}

                {/* 4. HAKKINDA (Veriler Garantiye Alındı) */}
                {profileTab === 'about' && (
                    <div className="flex flex-col gap-8 animate-in slide-in-from-bottom duration-500 max-w-7xl mx-auto">
                        <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[40px] shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-4 border-l-4 border-[#E8622A] pl-3">Hakkımızda</h3>
                            <p className="text-slate-600 text-sm font-medium whitespace-pre-wrap leading-relaxed">{shopDescription}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* İletişim Kartı */}
                            <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm flex flex-col gap-5">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-2 border-b border-slate-100 pb-4">İletişim & Sosyal Medya</h3>
                                {shopPhone && <div className="flex items-center gap-3 text-slate-600 font-bold"><Phone size={18} className="text-[#E8622A]"/> {shopPhone}</div>}
                                {shopEmail && <div className="flex items-center gap-3 text-slate-600 font-bold"><Mail size={18} className="text-[#E8622A]"/> {shopEmail}</div>}
                                {shopInsta && (
                                    <a href={shopInsta.includes('http') ? shopInsta : `https://instagram.com/${shopInsta.replace('@','')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 font-bold hover:text-[#E1306C] transition-colors"><Link size={18} className="text-[#E8622A]"/> Instagram Hesabımız</a>
                                )}
                                {shopFb && (
                                    <a href={shopFb.includes('http') ? shopFb : `https://facebook.com/${shopFb}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 font-bold hover:text-[#1877F2] transition-colors"><Link size={18} className="text-[#E8622A]"/> Facebook Sayfamız</a>
                                )}
                            </div>

                            {/* Çalışma Saatleri Kartı */}
                            <div className="bg-white border border-slate-200 p-8 rounded-[40px] shadow-sm">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#2D1B4E] mb-6 border-b border-slate-100 pb-4">Çalışma Saatleri</h3>
                                <div className="flex flex-col gap-3">
                                    {workingHours.length > 0 ? workingHours.map((h, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm font-bold">
                                            <span className="text-slate-500">{h.day}</span>
                                            {h.isClosed ? (
                                                <span className="text-red-500 bg-red-50 px-3 py-1 rounded-lg text-[10px]">KAPALI</span>
                                            ) : (
                                                <span className="text-[#2D1B4E] bg-slate-50 px-3 py-1 rounded-lg text-[11px]">{h.open} - {h.close}</span>
                                            )}
                                        </div>
                                    )) : <p className="text-xs text-slate-400">Saat bilgisi girilmemiş.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}