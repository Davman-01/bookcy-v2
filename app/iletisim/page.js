"use client";
import React from 'react';
import { MessageCircle, Mail } from 'lucide-react';
import { useAppContext } from '../providers';

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TiktokIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a8 8 0 0 1-8-8v15a4 4 0 0 1-4-4Z"></path>
  </svg>
);

export default function Contact() {
  const { lang = 'TR', t } = useAppContext();
  const text = t?.[lang]?.contactPage;

  if (!text) return null;

  return (
    <div className="w-full bg-[#FAF7F2] pb-24 pt-10 md:pt-16 relative z-0">
      
      {/* ÜST BAŞLIK ALANI */}
      <div className="bg-[#2D1B4E] pt-20 md:pt-24 pb-32 md:pb-40 px-6 text-center relative border-b border-slate-800 z-0">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase text-white mb-6 tracking-tight">{text.title}</h1>
        <p className="text-sm md:text-lg lg:text-xl text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">{text.sub}</p>
      </div>
      
      {/* 5'Lİ İLETİŞİM KARTLARI */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 -mt-16 md:-mt-24 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          
          {/* WHATSAPP */}
          <div className="bg-white p-6 md:p-8 rounded-[40px] text-center shadow-2xl border border-slate-200 hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
            <div className="w-16 h-16 bg-green-50 text-[#25D366] rounded-full flex items-center justify-center mx-auto mb-6"><MessageCircle size={32}/></div>
            <h3 className="font-black text-lg text-[#2D1B4E] mb-3 uppercase tracking-widest">WhatsApp</h3>
            <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed flex-1">{text.wp1}</p>
            <a href="https://wa.me/905555555555" target="_blank" className="block mt-auto bg-[#25D366] hover:bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-colors no-underline shadow-[0_10px_25px_rgba(37,211,102,0.3)]">{text.wp2}</a>
          </div>

          {/* INSTAGRAM */}
          <div className="bg-white p-6 md:p-8 rounded-[40px] text-center shadow-2xl border border-slate-200 hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
            <div className="w-16 h-16 bg-pink-50 text-[#E1306C] rounded-full flex items-center justify-center mx-auto mb-6"><InstagramIcon size={32}/></div>
            <h3 className="font-black text-lg text-[#2D1B4E] mb-3 uppercase tracking-widest">Instagram</h3>
            <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed flex-1">{text.ig1}</p>
            <a href="https://www.instagram.com/getbookcy?igsh=d3phYWh2cmg2MHE4&utm_source=qr" target="_blank" className="block mt-auto bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-90 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-opacity no-underline shadow-[0_10px_25px_rgba(225,48,108,0.3)]">{text.ig2}</a>
          </div>

          {/* TIKTOK */}
          <div className="bg-white p-6 md:p-8 rounded-[40px] text-center shadow-2xl border border-slate-200 hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
            <div className="w-16 h-16 bg-slate-100 text-black rounded-full flex items-center justify-center mx-auto mb-6"><TiktokIcon size={32}/></div>
            <h3 className="font-black text-lg text-[#2D1B4E] mb-3 uppercase tracking-widest">TikTok</h3>
            <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed flex-1">{text.tt1 || "Eğlenceli ve bilgilendirici içeriklerimiz için TikTok'ta bize katılın!"}</p>
            <a href="https://www.tiktok.com/@bookcy0?_r=1&_t=ZN-95n1SNa8PGp" target="_blank" className="block mt-auto bg-black hover:bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-colors no-underline shadow-[0_10px_25px_rgba(0,0,0,0.3)]">{text.tt2 || "TikTok'ta İzle"}</a>
          </div>

          {/* FACEBOOK */}
          <div className="bg-white p-6 md:p-8 rounded-[40px] text-center shadow-2xl border border-slate-200 hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
            <div className="w-16 h-16 bg-blue-50 text-[#1877F2] rounded-full flex items-center justify-center mx-auto mb-6"><FacebookIcon size={32}/></div>
            <h3 className="font-black text-lg text-[#2D1B4E] mb-3 uppercase tracking-widest">Facebook</h3>
            <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed flex-1">{text.fb1 || "Gelişmelerden ve kampanyalardan haberdar olmak için sayfamızı beğenin."}</p>
            <a href="https://www.facebook.com/share/17xxmB1UDv/?mibextid=wwXIfr" target="_blank" className="block mt-auto bg-[#1877F2] hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-colors no-underline shadow-[0_10px_25px_rgba(24,119,242,0.3)]">{text.fb2 || "Sayfamızı Ziyaret Et"}</a>
          </div>

          {/* E-POSTA */}
          <div className="bg-white p-6 md:p-8 rounded-[40px] text-center shadow-2xl border border-slate-200 hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full">
            <div className="w-16 h-16 bg-indigo-50 text-[#2D1B4E] rounded-full flex items-center justify-center mx-auto mb-6"><Mail size={32}/></div>
            <h3 className="font-black text-lg text-[#2D1B4E] mb-3 uppercase tracking-widest">E-Posta</h3>
            <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed flex-1">{text.mail1}</p>
            <a href="mailto:info@bookcy.co" className="block mt-auto bg-[#2D1B4E] hover:bg-[#1a0f2e] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-colors no-underline shadow-[0_10px_25px_rgba(45,27,78,0.3)]">{text.mail2}</a>
          </div>

        </div>
      </div>
    </div>
  );
}