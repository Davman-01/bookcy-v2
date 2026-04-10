"use client";
import React from 'react';
import { MessageCircle, Mail } from 'lucide-react';
import { useAppContext } from '../providers';

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Contact() {
  const { lang = 'TR', t } = useAppContext();
  const text = t?.[lang]?.contactPage;

  if (!text) return null;

  return (
    <div className="w-full bg-[#FAF7F2] pb-24 pt-10 md:pt-16 relative z-0">
      <div className="bg-[#2D1B4E] pt-20 md:pt-24 pb-32 md:pb-40 px-6 text-center relative border-b border-slate-800 z-0">
        <h1 className="text-3xl md:text-6xl font-black uppercase text-white mb-6 tracking-tight">{text.title}</h1>
        <p className="text-base md:text-xl text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">{text.sub}</p>
      </div>
      <div className="max-w-[1100px] mx-auto px-6 -mt-16 md:-mt-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white p-8 md:p-12 rounded-[40px] text-center shadow-2xl border border-slate-200 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 text-[#25D366] rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8"><MessageCircle size={40}/></div>
            <h3 className="font-black text-xl md:text-2xl text-[#2D1B4E] mb-4 uppercase tracking-widest">WhatsApp</h3>
            <p className="text-sm md:text-base text-slate-500 mb-8 md:mb-10 font-medium leading-relaxed">{text.wp1}</p>
            <a href="https://wa.me/905555555555" target="_blank" className="block bg-[#25D366] hover:bg-green-600 text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-colors no-underline shadow-[0_10px_25px_rgba(37,211,102,0.3)]">{text.wp2}</a>
          </div>
          <div className="bg-white p-8 md:p-12 rounded-[40px] text-center shadow-2xl border border-slate-200 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-pink-50 text-[#E1306C] rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8"><InstagramIcon size={40}/></div>
            <h3 className="font-black text-xl md:text-2xl text-[#2D1B4E] mb-4 uppercase tracking-widest">Instagram</h3>
            <p className="text-sm md:text-base text-slate-500 mb-8 md:mb-10 font-medium leading-relaxed">{text.ig1}</p>
            <a href="https://instagram.com/bookcy" target="_blank" className="block bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-90 text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-opacity no-underline shadow-[0_10px_25px_rgba(225,48,108,0.3)]">{text.ig2}</a>
          </div>
          <div className="bg-white p-8 md:p-12 rounded-[40px] text-center shadow-2xl border border-slate-200 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8"><Mail size={40}/></div>
            <h3 className="font-black text-xl md:text-2xl text-[#2D1B4E] mb-4 uppercase tracking-widest">E-Posta</h3>
            <p className="text-sm md:text-base text-slate-500 mb-8 md:mb-10 font-medium leading-relaxed">{text.mail1}</p>
            <a href="mailto:info@bookcy.co" className="block bg-[#2D1B4E] hover:bg-[#1a0f2e] text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-colors no-underline shadow-[0_10px_25px_rgba(45,27,78,0.3)]">{text.mail2}</a>
          </div>
        </div>
      </div>
    </div>
  );
}