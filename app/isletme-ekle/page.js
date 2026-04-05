"use client";
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Globe, Upload, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function IsletmeEkle() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mekanAdi: '',
    bolge: '',
    acikAdres: '',
    mapsLink: '',
    telefon: '',
    email: '',
    paket: 'standard'
  });

  return (
    <main className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Form Başlığı */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-[#2D1B4E] mb-4">İşletmenizi Kaydedin</h1>
            <p className="text-slate-500 font-bold">Kuzey Kıbrıs'ın en büyük randevu ağına katılın.</p>
          </div>

          <div className="bg-white rounded-[40px] shadow-2xl shadow-[#2D1B4E]/5 border border-slate-100 overflow-hidden flex flex-col md:flex-row">
            
            {/* Sol Panel: Bilgilendirme */}
            <div className="md:w-1/3 bg-[#2D1B4E] p-10 text-white">
              <h3 className="text-xl font-bold mb-8">Neden Bookcy?</h3>
              <ul className="space-y-6">
                <li className="flex gap-3 text-sm opacity-80"><ShieldCheck className="text-[#E8622A] shrink-0" /> Güvenli Randevu Sistemi</li>
                <li className="flex gap-3 text-sm opacity-80"><CheckCircle2 className="text-[#E8622A] shrink-0" /> 7/24 Müşteri Desteği</li>
                <li className="flex gap-3 text-sm opacity-80"><Globe className="text-[#E8622A] shrink-0" /> Kuzey Kıbrıs Genelinde Görünürlük</li>
              </ul>
            </div>

            {/* Sağ Panel: Dinamik Form Alanları (Ajanda Madde 08-09) */}
            <div className="flex-1 p-10">
              <form className="space-y-6">
                
                {/* 1. KISIM: TEMEL BİLGİLER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Mekan Adı *</label>
                    <input type="text" placeholder="Örn: Glamour Hair Salon" className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#E8622A] font-bold text-sm" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Bölge Seçimi *</label>
                    <select className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#E8622A] font-bold text-sm cursor-pointer">
                      <option>Lefkoşa</option>
                      <option>Girne</option>
                      <option>Gazimağusa</option>
                      <option>İskele</option>
                      <option>Güzelyurt</option>
                    </select>
                  </div>
                </div>

                {/* 2. KISIM: ADRES VE KONUM */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Açık Adres *</label>
                  <textarea placeholder="Sokak, Bina No, Kapı No..." className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#E8622A] font-bold text-sm h-24 resize-none"></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Google Maps Linki (Zorunlu) *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-slate-300" size={18} />
                    <input type="url" placeholder="https://goo.gl/maps/..." className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#E8622A] font-bold text-sm" />
                  </div>
                </div>

                {/* 3. KISIM: İLETİŞİM VE LOGO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Telefon Numarası *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-4 text-slate-300" size={18} />
                      <input type="tel" placeholder="+90 5XX XXX XX XX" className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#E8622A] font-bold text-sm" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">E-Mail Adresi *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 text-slate-300" size={18} />
                      <input type="email" placeholder="isletme@mail.com" className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-[#E8622A] font-bold text-sm" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Logo Yükleme (Kare Format) *</label>
                  <div className="w-full border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="text-slate-400" size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-400">Dosya seçin veya buraya sürükleyin</span>
                  </div>
                </div>

                {/* 4. KISIM: PAKET SEÇİMİ (Ajanda Madde 09) */}
                <div className="space-y-4 pt-4">
                   <label className="text-xs font-black uppercase tracking-widest text-slate-400">Paket Seçimi *</label>
                   <div className="grid grid-cols-2 gap-4">
                      <button type="button" onClick={() => setFormData({...formData, paket: 'standard'})} className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all ${formData.paket === 'standard' ? 'border-[#2D1B4E] bg-[#2D1B4E] text-white' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}>Standard (₺100)</button>
                      <button type="button" onClick={() => setFormData({...formData, paket: 'premium'})} className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all ${formData.paket === 'premium' ? 'border-[#FFD700] bg-[#FFD700] text-[#2D1B4E]' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}>Premium (₺250)</button>
                   </div>
                </div>

                <button type="submit" className="w-full py-5 bg-[#E8622A] text-white rounded-2xl font-black shadow-xl shadow-[#E8622A]/30 hover:bg-[#d4561f] transition-all hover:-translate-y-1 mt-8">
                  Kayıt Talebi Oluştur
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}