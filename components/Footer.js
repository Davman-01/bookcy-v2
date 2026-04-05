"use client";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#FAF7F2] dark:bg-[#0B0710] pt-20 pb-10 px-6 md:px-12 border-t border-slate-200 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Logo Bölümü */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2 no-underline group">
            <span className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#2D1B4E] dark:text-white">
              bookcy<span className="text-[#E8622A]">.</span>
            </span>
          </Link>
          <p className="text-sm text-slate-500 dark:text-white/40 font-bold leading-relaxed">
            Kuzey Kıbrıs'ın en modern randevu platformu.
          </p>
        </div>

        {/* Hızlı Menü */}
        <div className="space-y-6">
          <h4 className="font-black text-[#2D1B4E] dark:text-white uppercase text-xs tracking-widest">Platform</h4>
          <ul className="space-y-3 p-0 list-none text-sm font-bold text-slate-500 dark:text-white/40">
            <li><Link href="/mekanlar" className="hover:text-[#E8622A] transition-colors no-underline">Mekanlar</Link></li>
            <li><Link href="/paketler" className="hover:text-[#E8622A] transition-colors no-underline">Paketler</Link></li>
            <li><Link href="/iletisim" className="hover:text-[#E8622A] transition-colors no-underline">İletişim</Link></li>
          </ul>
        </div>

        {/* Kurumsal/Sözleşmeler */}
        <div className="space-y-6">
          <h4 className="font-black text-[#2D1B4E] dark:text-white uppercase text-xs tracking-widest">Sözleşmeler</h4>
          <ul className="space-y-3 p-0 list-none text-sm font-bold text-slate-500 dark:text-white/40">
            <li><Link href="/sozlesmeler" className="hover:text-[#E8622A] transition-colors no-underline">Kullanım Şartları</Link></li>
            <li><Link href="/sozlesmeler" className="hover:text-[#E8622A] transition-colors no-underline">Gizlilik Politikası</Link></li>
          </ul>
        </div>

        {/* Destek/Sosyal Medya (İkon Hatası Vermeyen Güvenli Alan) */}
        <div className="space-y-6">
          <h4 className="font-black text-[#2D1B4E] dark:text-white uppercase text-xs tracking-widest">Bizi Takip Edin</h4>
          <div className="flex flex-wrap gap-2">
            {['Instagram', 'WhatsApp', 'Twitter'].map((platform) => (
              <button 
                key={platform} 
                className="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase text-[#2D1B4E] dark:text-white hover:bg-[#E8622A] hover:text-white transition-all cursor-pointer"
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 dark:border-white/5 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          © {new Date().getFullYear()} Bookcy Kıbrıs. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}