"use client";
import React, { useState, useEffect } from 'react';
import { X, Rocket, Store, Instagram } from 'lucide-react';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Pop-up'ı kullanıcıyı bunaltmamak için oturum (session) başına bir kez gösteriyoruz.
    // İstersen 'sessionStorage' yerine 'localStorage' yapıp hayatında sadece 1 kez görmesini sağlayabilirsin.
    const hasSeenPopup = sessionStorage.getItem('bookcy_beta_popup');
    if (!hasSeenPopup) {
      // Sayfa yüklendikten 1 saniye sonra şık bir şekilde ekrana gelsin
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem('bookcy_beta_popup', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-[#2D1B4E]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Üst İnce Şerit (Turuncu Marka Rengi) */}
        <div className="h-2 w-full bg-gradient-to-r from-[#E8622A] to-orange-500"></div>
        
        {/* Kapat Butonu */}
        <button 
          onClick={closePopup} 
          className="absolute top-5 right-5 text-slate-400 hover:text-[#2D1B4E] transition-colors z-10 bg-slate-50 hover:bg-slate-100 rounded-full p-1.5 border-none cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-10">
          
          {/* İkon */}
          <div className="w-16 h-16 bg-orange-50 text-[#E8622A] rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-orange-100">
            <Rocket size={32} />
          </div>

          {/* Ana Başlık */}
          <h2 className="text-2xl md:text-3xl font-black text-[#2D1B4E] tracking-tight mb-4 leading-tight">
            Sizin için durmaksızın gelişiyoruz.
          </h2>
          
          {/* Metin İçeriği */}
          <div className="space-y-4 text-sm text-slate-600 font-medium leading-relaxed mb-8">
            <p>
              Kıbrıs’ın ilk kapsamlı çevrim içi randevu platformu <strong className="text-[#2D1B4E] font-black">Bookcy</strong>, şu anda <span className="bg-orange-100 text-[#E8622A] px-2 py-0.5 rounded-md font-bold uppercase text-[10px] tracking-widest inline-block border border-orange-200">Beta Test</span> sürecindedir. 
              Kullanıcılarımıza en yüksek güvenlik standartlarında, hızlı ve kusursuz bir deneyim sunabilmek adına altyapı çalışmalarımız titizlikle devam etmektedir.
            </p>
            <p>
              Bu süreçte nadiren yaşanabilecek gecikme veya aksaklıklar için anlayışınıza teşekkür ederiz. Çok yakında, çok daha güçlü bir deneyimle karşınızda olacağız.
            </p>
            
            {/* İşletmeler İçin Özel Kutu */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-6">
              <div className="flex items-center gap-3 mb-2">
                <Store size={18} className="text-[#E8622A]" />
                <h3 className="font-black text-[#2D1B4E] text-xs uppercase tracking-widest">İşletmeler İçin Ön Kayıtlar Başladı</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hemen başvurunuzu yaparak bekleme listesine katılabilir, Bookcy’nin sunduğu ayrıcalıklardan ilk faydalananlar arasında yer alabilirsiniz.
              </p>
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex flex-col gap-3">
            <button 
              onClick={closePopup} 
              className="w-full bg-[#E8622A] text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-[#d5521b] transition-all shadow-lg shadow-orange-500/30 border-none cursor-pointer"
            >
              ANLADIM, SİTEYE GİRİŞ YAP
            </button>
            
            <a 
              href="https://instagram.com/bookcy" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full bg-white text-[#2D1B4E] border border-slate-200 font-black py-4 rounded-xl uppercase tracking-widest text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-decoration-none cursor-pointer"
            >
              <Instagram size={18} /> Gelişmeler İçin Takip Et
            </a>
          </div>

          {/* Footer İmza */}
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Bookcy <span className="text-[#E8622A] mx-1">—</span> Randevu deneyiminde yeni standart.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}