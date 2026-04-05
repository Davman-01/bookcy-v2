"use client";
import React, { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Sayfa yüklendiğinde kullanıcının daha önce onay verip vermediğine bak
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2D1B4E] text-white p-4 z-[9999] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] border-t border-slate-700">
      <div className="text-xs font-medium text-slate-300 max-w-4xl text-center sm:text-left">
        Sizlere daha iyi hizmet sunabilmek, site trafiğimizi analiz etmek ve kullanım deneyiminizi geliştirmek amacıyla çerezler (cookies) kullanıyoruz. 
      </div>
      <button 
        onClick={() => {
          localStorage.setItem('cookie_consent', 'true');
          setShow(false);
        }} 
        className="bg-[#E8622A] hover:bg-[#d4561f] text-white px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-lg shrink-0 border-none cursor-pointer"
      >
        KABUL EDİYORUM
      </button>
    </div>
  );
}