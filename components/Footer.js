"use client";
import Link from 'next/link';
import { Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppContext } from '@/app/providers';
import { cyprusRegions } from '@/lib/constants';

const InstagramIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

export default function Footer() {
  const { lang, t } = useAppContext();
  const [cookieConsent, setCookieConsent] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('bookcy_cookie_consent')) setCookieConsent(false);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('bookcy_cookie_consent', 'true');
    setCookieConsent(true);
  };

  return (
    <>
      {!cookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:p-6 z-[9998] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-10">
          <div className="flex items-start gap-4 flex-1 max-w-4xl">
            <div className="bg-indigo-50 text-indigo-500 p-3 rounded-full shrink-0 hidden md:block"><Info size={24}/></div>
            <div>
              <h4 className="font-black text-[#2D1B4E] mb-1">{t[lang].cookie.title}</h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                {t[lang].cookie.desc1} 
                <Link href="/gizlilik" className="text-[#E8622A] font-bold mx-1 hover:underline">{t[lang].cookie.l1}</Link> {t[lang].cookie.desc2} 
                <Link href="/gizlilik" className="text-[#E8622A] font-bold mx-1 hover:underline">{t[lang].cookie.l2}</Link> {t[lang].cookie.desc3}
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto shrink-0">
            <button onClick={acceptCookies} className="flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-xs bg-[#E8622A] text-white border-none cursor-pointer shadow-md uppercase tracking-widest">{t[lang].cookie.btn2}</button>
          </div>
        </div>
      )}

      <footer className="w-full bg-[#2D1B4E] pt-12 md:pt-20 pb-8 md:pb-10 px-6 text-white/60 text-sm border-t border-[#3E296A] z-10 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12 border-b border-white/10 pb-8 md:pb-12">
          <div>
            <div className="mb-6 md:mb-8 h-16 w-fit bg-white p-3 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 shadow-lg"><img src="/logo.png" alt="Bookcy Logo" className="w-full h-full object-contain" /></div>
            <p className="mb-6 md:mb-8 leading-relaxed font-medium text-white/70">{t[lang].footer.desc}</p>
          </div>
          <div>
            <h4 className="text-white font-black mb-6 md:mb-8 tracking-[0.2em] uppercase text-xs border-l-2 border-[#E8622A] pl-3">{t[lang].footer.col1}</h4>
            <Link href="/" className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">Ana Sayfa</Link>
            <Link href="/hakkimizda" className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">{t[lang].nav.about}</Link>
          </div>
          <div>
            <h4 className="text-white font-black mb-6 md:mb-8 tracking-[0.2em] uppercase text-xs border-l-2 border-[#E8622A] pl-3">{t[lang].footer.col2}</h4>
            {cyprusRegions.map(r => <Link href="/isletmeler" key={r} className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">{r}</Link>)}
          </div>
          <div>
            <h4 className="text-white font-black mb-6 md:mb-8 tracking-[0.2em] uppercase text-xs border-l-2 border-[#E8622A] pl-3">{t[lang].footer.col3}</h4>
            <Link href="/gizlilik" className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">Gizlilik Politikası</Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium"><p>© {new Date().getFullYear()} BOOKCY LTD. {t[lang].footer.right1}</p><p className="font-black text-white/40 tracking-[0.3em] uppercase bg-white/5 px-4 py-2 rounded-lg">One Click Booking™</p></div>
      </footer>
    </>
  );
}