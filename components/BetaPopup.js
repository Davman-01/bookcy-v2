"use client";
import React, { useState, useEffect } from 'react';
import { X, Rocket, Sparkles } from 'lucide-react';

export default function BetaPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Kullanıcı bu pop-up'ı daha önce kapattıysa tekrar gösterme
    const isDismissed = sessionStorage.getItem('bookcy_beta_popup_dismissed');
    
    if (!isDismissed) {
      // Sayfa yüklendikten 1 saniye sonra estetik bir şekilde açılsın
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Kapatıldığını session storage'a kaydet (Tarayıcı kapanana kadar bir daha çıkmaz)
    sessionStorage.setItem('bookcy_beta_popup_dismissed', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0B0710]/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] w-full max-w-lg relative shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Kapat Butonu */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Üst Kısım - İllüstrasyon/İkon Alanı */}
        <div className="bg-[#2D1B4E] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          <div className="w-16 h-16 bg-[#E8622A] rounded-2xl mx-auto flex items-center justify-center shadow-lg relative z-10 mb-4 transform -rotate-3 hover:rotate-0 transition-transform">
            <Rocket className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white relative z-10 tracking-tight font-['Plus_Jakarta_Sans']">
            Bookcy'ye Hoş Geldiniz!
          </h2>
        </div>

        {/* İçerik Kısmı */}
        <div className="p-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-orange-100">
            <Sparkles size={14} /> Beta Sürümü
          </div>
          
          <h3 className="text-xl font-bold text-[#2D1B4E] mb-3">
            Sizler İçin Mükemmelleşiyoruz
          </h3>
          
          <p className="text-slate-500 leading-relaxed text-sm mb-8">
            Kıbrıs'ın ilk ve tek kapsamlı online randevu platformu olan Bookcy, şu anda <strong>aktif test (Beta)</strong> aşamasındadır. Sizlere en kusursuz ve güvenli deneyimi sunabilmek için altyapı çalışmalarımıza devam ediyoruz. Bu kısa süreçte karşılaşabileceğiniz olası sistemsel gecikmeler veya aksaklıklar için anlayışınızı rica ederiz.
          </p>
          
          <button 
            onClick={handleClose}
            className="w-full bg-[#E8622A] hover:bg-[#d5521b] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-colors shadow-md hover:shadow-lg"
          >
            Anladım, Keşfetmeye Başla
          </button>
        </div>

      </div>
    </div>
  );
}