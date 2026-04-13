"use client";
import Link from 'next/link';
import { Info, MessageCircle } from 'lucide-react'; 
import { useState, useEffect } from 'react';
import { useAppContext } from '@/app/providers';
import { cyprusRegions } from '@/lib/constants';
import { usePathname } from 'next/navigation';

// Özel Instagram İkonu
const InstagramIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

// Özel Facebook İkonu
const FacebookIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

export default function Footer() {
  const { lang, t } = useAppContext();
  const [cookieConsent, setCookieConsent] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (!localStorage.getItem('bookcy_cookie_consent')) setCookieConsent(false);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('bookcy_cookie_consent', 'true');
    setCookieConsent(true);
  };

  // Panel ve Admin sayfalarında Footer'ı gizle
  if (pathname && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/panel'))) {
    return null;
  }

  const text = t?.[lang] || t?.['TR'];
  if (!text) return null;

  return (
    <>
      {!cookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:p-6 z-[9998] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-10">
          <div className="flex items-start gap-4 flex-1 max-w-4xl">
            <div className="bg-indigo-50 text-indigo-500 p-3 rounded-full shrink-0 hidden md:block"><Info size={24}/></div>
            <div>
              <h4 className="font-black text-[#2D1B4E] mb-1">{text.cookie?.title}</h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                {text.cookie?.desc1} 
                <Link href="/yasal/gizlilik" className="text-[#E8622A] font-bold mx-1 hover:underline">{text.cookie?.l1}</Link> {text.cookie?.desc2} 
                <Link href="/yasal/gizlilik" className="text-[#E8622A] font-bold mx-1 hover:underline">{text.cookie?.l2}</Link> {text.cookie?.desc3}
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto shrink-0">
            <button onClick={acceptCookies} className="flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-xs bg-[#E8622A] text-white border-none cursor-pointer shadow-md uppercase tracking-widest">{text.cookie?.btn2}</button>
          </div>
        </div>
      )}

      <footer className="w-full bg-[#2D1B4E] pt-12 md:pt-20 pb-8 md:pb-10 px-6 text-white/60 text-sm border-t border-[#3E296A] z-10 relative">
        {/* 5 Sütunlu Grid Yapısı (lg:grid-cols-5) */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-8 md:mb-12 border-b border-white/10 pb-8 md:pb-12">
          
          {/* SÜTUN 1: Logo & Sosyal Medya */}
          <div>
            <div className="mb-6 md:mb-8 h-16 w-fit bg-white p-3 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 shadow-lg">
              <img src="/logo.png" alt="Bookcy Logo" className="w-full h-full object-contain" />
            </div>
            <p className="mb-6 md:mb-8 leading-relaxed font-medium text-white/70">{text.footer?.desc}</p>
            <div className="flex gap-4">
              <a href="https://instagram.com/bookcy" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-[#E1306C] transition-all hover:-translate-y-1"><InstagramIcon size={20}/></a>
              <a href="https://facebook.com/bookcy" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-[#1877F2] transition-all hover:-translate-y-1"><FacebookIcon size={20}/></a>
              <a href="https://wa.me/905555555555" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-[#25D366] transition-all hover:-translate-y-1"><MessageCircle size={20}/></a>
            </div>
          </div>

          {/* SÜTUN 2: Platform Menüsü */}
          <div>
            <h4 className="text-white font-black mb-6 md:mb-8 tracking-[0.2em] uppercase text-xs border-l-2 border-[#E8622A] pl-3">{text.footer?.col1}</h4>
            <Link href="/" className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">Ana Sayfa</Link>
            <Link href="/isletmeler" className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">{text.nav?.places || "İşletmeler"}</Link>
            <Link href="/ozellikler" className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">{text.nav?.features || "Özellikler"}</Link>
            <Link href="/neden-bookcy" className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">{text.nav?.why || "Neden Bookcy"}</Link>
            <Link href="/hakkimizda" className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">{text.nav?.about || "Hakkımızda"}</Link>
            <Link href="/iletisim" className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">{text.nav?.contact || "İletişim"}</Link>
          </div>

          {/* SÜTUN 3: Bölgeler */}
          <div>
            <h4 className="text-white font-black mb-6 md:mb-8 tracking-[0.2em] uppercase text-xs border-l-2 border-[#E8622A] pl-3">{text.footer?.col2}</h4>
            {cyprusRegions.map(r => <Link href={`/isletmeler?r=${r}`} key={r} className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">{r}</Link>)}
          </div>

          {/* SÜTUN 4: Yasal */}
          <div>
            <h4 className="text-white font-black mb-6 md:mb-8 tracking-[0.2em] uppercase text-xs border-l-2 border-[#E8622A] pl-3">{text.footer?.col3}</h4>
            <Link href="/yasal/gizlilik" className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">Gizlilik Politikası</Link>
            <Link href="/yasal/kvkk" className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">KVKK Aydınlatma Metni</Link>
            <Link href="/yasal/sartlar" className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">Kullanım Şartları</Link>
            <Link href="/yasal/cerez" className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">Çerez Politikası</Link>
          </div>

          {/* SÜTUN 5: BLOG (YENİ) */}
          <div>
            <h4 className="text-white font-black mb-6 md:mb-8 tracking-[0.2em] uppercase text-xs border-l-2 border-[#E8622A] pl-3">BLOG</h4>
            <Link href="/kibris-rezervasyon-ve-yasam-rehberi" className="block mb-4 text-[#E8622A] hover:text-[#ff7a40] font-bold transition-colors text-decoration-none">Kıbrıs Yaşam Rehberi</Link>
            <Link href="/sss" className="block mb-4 text-white/60 hover:text-white font-medium transition-colors text-decoration-none">Sıkça Sorulan Sorular</Link>
          </div>

        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium">
          <p>© {new Date().getFullYear()} BOOKCY LTD. {text.footer?.right1}</p>
          <p className="font-black text-white/40 tracking-[0.3em] uppercase bg-white/5 px-4 py-2 rounded-lg">One Click Booking™</p>
        </div>
      </footer>
    </>
  );
}