"use client";
import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-[#2D1B4E] py-2 px-4 relative border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <Sparkles className="text-[#E8622A] animate-pulse" size={14} />
        <p className="text-white text-[12px] md:text-sm font-medium tracking-wide">
          Kıbrıs'ta İlk Randevuna Özel <span className="text-[#E8622A] font-black underline underline-offset-4">%20 İndirim!</span> 
          <span className="hidden md:inline ml-2 text-white/60">Kod:</span> 
          <span className="bg-white/10 px-2 py-0.5 rounded font-mono text-white ml-1 text-xs uppercase">Bookcy20</span>
        </p>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}