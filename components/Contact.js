"use client";
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <section id="iletisim" className="py-24 px-6 bg-white dark:bg-[#120b1e] scroll-mt-20">
      <div className="max-w-7xl mx-auto bg-[#2D1B4E] rounded-[40px] p-12 md:p-20 text-white flex flex-col md:flex-row gap-16">
        <div className="md:w-1/3">
          <h2 className="text-4xl font-black mb-6">Bize Ulaşın</h2>
          <p className="opacity-70 mb-10 font-bold">Destek ekibimiz Kuzey Kıbrıs genelinde size yardımcı olmaya hazır.</p>
          <div className="space-y-6">
            <div className="flex items-center gap-4"><Phone className="text-[#E8622A]" /> <span>+90 5XX XXX XX XX</span></div>
            <div className="flex items-center gap-4"><Mail className="text-[#E8622A]" /> <span>info@bookcy.com</span></div>
          </div>
        </div>
        <div className="flex-1 bg-white/5 p-8 rounded-3xl border border-white/10">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Adınız" className="bg-white/10 border-none p-4 rounded-xl text-white outline-none focus:ring-2 ring-[#E8622A]" />
            <input type="email" placeholder="E-mail" className="bg-white/10 border-none p-4 rounded-xl text-white outline-none focus:ring-2 ring-[#E8622A]" />
            <textarea placeholder="Mesajınız" className="md:col-span-2 bg-white/10 border-none p-4 rounded-xl text-white h-32 outline-none focus:ring-2 ring-[#E8622A]"></textarea>
            <button className="md:col-span-2 bg-[#E8622A] py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-[#d4561f] transition-all">
              <Send size={18} /> Gönder
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}