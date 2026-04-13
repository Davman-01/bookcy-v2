"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AlertTriangle, MailWarning, PowerOff, CheckCircle2 } from 'lucide-react';

export default function AdminTrialControl() {
  const [isLoadingWarning, setIsLoadingWarning] = useState(false);
  const [isLoadingSuspend, setIsLoadingSuspend] = useState(false);
  const [message, setMessage] = useState(null);

  // 1. İŞLEM: Uyarı Maillerini Gönderme (15 Mayıs)
  const handleSendWarnings = async () => {
    if (!window.confirm("Ücretsiz deneme paketindeki tüm aktif işletmelere 'Süreniz bitiyor' uyarısı gönderilecek. Onaylıyor musunuz?")) return;
    
    setIsLoadingWarning(true);
    setMessage(null);

    try {
      // Sadece 'Ücretsiz Deneme' paketinde olan ve hesabı 'approved' (onaylı) olanları bul
      const { data: shops, error } = await supabase
        .from('shops')
        .select('name, admin_email')
        .eq('package', 'Ücretsiz Deneme')
        .eq('status', 'approved');

      if (error) throw error;
      if (!shops || shops.length === 0) {
        setMessage({ type: 'info', text: 'Uyarı gönderilecek ücretsiz deneme işletmesi bulunamadı.' });
        setIsLoadingWarning(false);
        return;
      }

      // Bulunan her işletmeye API üzerinden mail at
      let successCount = 0;
      for (const shop of shops) {
        try {
          await fetch('/api/email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: shop.admin_email,
              subject: 'ÖNEMLİ: Bookcy Ücretsiz Deneme Süreniz Bitiyor!',
              html: `
                <div style="font-family: sans-serif; color: #2D1B4E; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                  <div style="background-color: #E8622A; padding: 20px; text-align: center;">
                    <h2 style="color: white; margin: 0;">Deneme Süreniz Sona Eriyor!</h2>
                  </div>
                  <div style="padding: 30px;">
                    <p>Merhaba <strong>${shop.name}</strong>,</p>
                    <p>Bookcy platformundaki <strong>Ücretsiz Deneme</strong> süreniz <strong>22 Mayıs</strong> tarihinde sona erecektir.</p>
                    <p>Müşterilerinizin randevu almaya devam edebilmesi ve profilinizin askıya alınmaması için lütfen en geç 22 Mayıs'a kadar paneliniz üzerinden paket ödemenizi gerçekleştirerek dekontunuzu bize iletiniz.</p>
                    <p>Sorularınız için bizimle her zaman iletişime geçebilirsiniz.</p>
                    <p style="margin-top: 30px; font-weight: bold;">Bookcy Yönetimi</p>
                  </div>
                </div>
              `
            })
          });
          successCount++;
        } catch (err) {
          console.error(`${shop.name} için mail gönderilemedi.`, err);
        }
      }

      setMessage({ type: 'success', text: `Başarılı! Toplam ${successCount} işletmeye uyarı maili gönderildi.` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Bir hata oluştu: ' + error.message });
    } finally {
      setIsLoadingWarning(false);
    }
  };

  // 2. İŞLEM: Hesapları Askıya Alma (23 Mayıs)
  const handleSuspendAccounts = async () => {
    if (!window.confirm("DİKKAT! Ücretsiz deneme paketindeki tüm işletmelerin statüsü 'askıya alındı' (suspended) olarak değiştirilecek ve sistemleri kapanacaktır. Emin misiniz?")) return;

    setIsLoadingSuspend(true);
    setMessage(null);

    try {
      const { data, error } = await supabase
        .from('shops')
        .update({ status: 'suspended' })
        .eq('package', 'Ücretsiz Deneme')
        .eq('status', 'approved')
        .select();

      if (error) throw error;

      setMessage({ type: 'success', text: `Operasyon Tamamlandı! Toplam ${data.length} adet ücretsiz deneme hesabının fişi çekildi ve askıya alındı.` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Bir hata oluştu: ' + error.message });
    } finally {
      setIsLoadingSuspend(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-[#2D1B4E] uppercase tracking-tight">Deneme Süresi Yönetimi</h2>
          <p className="text-sm font-bold text-slate-500">Ücretsiz deneme (22 Mayıs) kampanyası manuel kontrolleri.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
          <CheckCircle2 size={18} /> {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Adım 1: Uyarı Gönder */}
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-black text-[#E8622A] uppercase mb-2 flex items-center gap-2">
              <MailWarning size={18} /> 1. Adım: Uyarı (15 Mayıs)
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mb-6">
              "Ücretsiz Deneme" paketini kullanan tüm aktif işletmelere sürelerinin 22 Mayıs'ta biteceğine dair sistem üzerinden otomatik mail atar.
            </p>
          </div>
          <button 
            onClick={handleSendWarnings}
            disabled={isLoadingWarning}
            className="w-full bg-[#E8622A] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#d5521b] transition-colors border-none cursor-pointer shadow-md disabled:opacity-50"
          >
            {isLoadingWarning ? 'MAİLLER GÖNDERİLİYOR...' : 'UYARI MAİLLERİNİ FIRLAT'}
          </button>
        </div>

        {/* Adım 2: Fişi Çek */}
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-black text-red-600 uppercase mb-2 flex items-center gap-2">
              <PowerOff size={18} /> 2. Adım: Kapatma (23 Mayıs)
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mb-6">
              Ödeme yapmamış olan tüm "Ücretsiz Deneme" işletmelerinin durumunu saniyeler içinde "Askıya Alındı (suspended)" yapar. Sistemleri anında kapanır.
            </p>
          </div>
          <button 
            onClick={handleSuspendAccounts}
            disabled={isLoadingSuspend}
            className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-colors border-none cursor-pointer shadow-md disabled:opacity-50"
          >
            {isLoadingSuspend ? 'HESAPLAR KAPATILIYOR...' : 'SÜRESİ DOLANLARI ASKIYA AL'}
          </button>
        </div>
      </div>
    </div>
  );
}