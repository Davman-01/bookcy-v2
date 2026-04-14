"use client";
import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquareWarning } from 'lucide-react';
import { useAppContext } from '@/app/providers';

export default function ComplaintsPage() {
  const { lang = 'TR', t } = useAppContext();
  const [formData, setFormData] = useState({ name: '', email: '', type: 'İstek', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const text = t?.[lang] || t?.['TR'] || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // API üzerinden info@bookcy.co adresine mail gönderiyoruz
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'info@bookcy.co', // GÜNCELLENEN KURUMSAL MAİL ADRESİ
          subject: `[BİLDİRİM] Yeni ${formData.type} - ${formData.name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
              <div style="background-color: #2D1B4E; padding: 20px; text-align: center;">
                <h2 style="color: white; margin: 0; text-transform: uppercase;">YENİ BİR GERİ BİLDİRİM ALDINIZ</h2>
              </div>
              <div style="padding: 30px; background-color: #f8fafc;">
                <p><strong>Gönderen:</strong> ${formData.name}</p>
                <p><strong>E-Posta:</strong> ${formData.email}</p>
                <p><strong>Bildirim Türü:</strong> <span style="background-color: #E8622A; color: white; padding: 4px 12px; border-radius: 6px; font-weight: bold; font-size: 12px;">${formData.type.toUpperCase()}</span></p>
                <div style="background-color: white; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 20px; color: #334155; line-height: 1.6;">
                  <p style="margin: 0; white-space: pre-wrap;">${formData.message}</p>
                </div>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                  <p style="color: #94a3b8; font-size: 12px;">Bu mesaj Bookcy İstek & Şikayet Formu üzerinden gönderilmiştir.</p>
                </div>
              </div>
            </div>
          `
        })
      });
      setIsSuccess(true);
    } catch (error) {
      alert("Bir hata oluştu, lütfen info@bookcy.co üzerinden bizimle iletişime geçin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-[#E8622A] mx-auto mb-6 shadow-sm">
            <MessageSquareWarning size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#2D1B4E] uppercase tracking-tight mb-4">
            {text.footer?.complaints || "İstek & Şikayet Formu"}
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed max-w-lg mx-auto">
            Bookcy platformunu daha iyi hale getirmek için geri bildirimleriniz bizim için çok değerlidir. 
            Görüşlerinizi doğrudan ekibimize iletebilirsiniz.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-white p-12 rounded-[32px] shadow-lg border border-slate-200 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 text-[#00c48c] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-black text-[#2D1B4E] mb-3 uppercase">Mesajınız İletildi!</h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              Değerli vaktinizi ayırdığınız için teşekkür ederiz. <br/>
              Ekibimiz bildirimini en kısa sürede <strong>info@bookcy.co</strong> üzerinden inceleyecektir.
            </p>
            <button 
              onClick={() => {setIsSuccess(false); setFormData({ name: '', email: '', type: 'İstek', message: '' })}}
              className="bg-[#2D1B4E] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#E8622A] transition-all border-none cursor-pointer shadow-md"
            >
              YENİ BİR MESAJ GÖNDER
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[32px] shadow-xl border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Adınız Soyadınız</label>
                <input 
                  required 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 font-bold text-sm outline-none text-[#2D1B4E] focus:border-[#E8622A] focus:bg-white transition-all"
                  placeholder="Örn: Ahmet Yılmaz"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">E-Posta Adresiniz</label>
                <input 
                  required 
                  type="email" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 font-bold text-sm outline-none text-[#2D1B4E] focus:border-[#E8622A] focus:bg-white transition-all"
                  placeholder="ahmet@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Bildirim Türü</label>
              <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'İstek'})} 
                  className={`flex-1 py-3 text-xs font-black uppercase rounded-xl border-none cursor-pointer transition-all ${formData.type === 'İstek' ? 'bg-white text-[#E8622A] shadow-md' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  İstek / Öneri
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Şikayet'})} 
                  className={`flex-1 py-3 text-xs font-black uppercase rounded-xl border-none cursor-pointer transition-all ${formData.type === 'Şikayet' ? 'bg-white text-red-600 shadow-md' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  Şikayet
                </button>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Mesajınız</label>
              <textarea 
                required 
                rows="6"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 font-bold text-sm outline-none text-[#2D1B4E] focus:border-[#E8622A] focus:bg-white transition-all resize-none"
                placeholder="Lütfen mesajınızı detaylı bir şekilde buraya yazın..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black uppercase tracking-widest text-xs border-none shadow-lg transition-all ${isSubmitting ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#E8622A] text-white hover:bg-[#d5521b] hover:scale-[1.01] active:scale-95 cursor-pointer'}`}
            >
              {isSubmitting ? 'GÖNDERİLİYOR...' : <>MESAJI GÖNDER <Send size={18} /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}