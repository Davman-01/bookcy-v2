import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// 1. Supabase ve Resend bağlantılarını başlatıyoruz
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const resend = new Resend(process.env.RESEND_API_KEY);

// 2. İptal isteği geldiğinde çalışacak ana POST fonksiyonu
export async function POST(request) {
  try {
    // Ön taraftan (müşterinin iptal ettiği) gelen randevu bilgilerini alıyoruz
    const appointment = await request.json();

    // --- BEKLEME LİSTESİ RADARI BAŞLANGICI ---
    // Bu dükkan, tarih ve saat için sırada bekleyen biri var mı diye bak
    const { data: waitlistUsers, error: waitlistError } = await supabase
      .from('waitlist')
      .select('*')
      .eq('shop_id', appointment.shop_id) 
      .eq('wait_date', appointment.date)  
      .eq('wait_time', appointment.time)  
      .eq('status', 'waiting')            
      .order('created_at', { ascending: true }) 
      .limit(1); 

    if (waitlistUsers && waitlistUsers.length > 0) {
      const luckyUser = waitlistUsers[0];
      
      // Müşteriye gönderilecek gerçek rezervasyon linki
      const bookingLink = `https://www.bookcy.co/shop/${appointment.shop_id}`;

      // E-posta Gönderme İşlemi
      await resend.emails.send({
        from: 'Bookcy <info@bookcy.co>',
        to: luckyUser.customer_email,
        subject: '🔥 Beklediğiniz Randevuda Yer Açıldı!',
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #2D1B4E; padding: 20px; max-width: 600px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #E8622A;">Merhaba ${luckyUser.customer_name},</h2>
            <p>Harika bir haberimiz var! <strong>${luckyUser.wait_date}</strong> tarihinde, saat <strong>${luckyUser.wait_time}</strong> için sıraya girdiğiniz randevuda az önce bir yer açıldı.</p>
            <p>Bu saat dilimi şu an herkese açık durumda. Yeri başkası kapmadan randevunuzu hemen oluşturmak için aşağıdaki butona tıklayın:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${bookingLink}" style="display: inline-block; background-color: #E8622A; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; letter-spacing: 1px;">HEMEN RANDEVU AL</a>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #888; text-align: center;">Bu otomatik bir bilgilendirme mesajıdır. Bizi tercih ettiğiniz için teşekkür ederiz.<br><strong>Bookcy Ekibi</strong></p>
          </div>
        `
      });

      // Müşterinin durumunu 'notified' (bildirildi) olarak güncelle
      await supabase
        .from('waitlist')
        .update({ status: 'notified' })
        .eq('id', luckyUser.id);
        
      console.log("Bekleme listesindeki müşteriye haber verildi:", luckyUser.customer_email);
    }
    // --- BEKLEME LİSTESİ RADARI BİTİŞİ ---

    // İşlem sorunsuz bittiyse ön tarafa başarılı mesajı gönder
    return NextResponse.json({ success: true, message: "İşlem başarılı" });

  } catch (error) {
    console.error("Bekleme listesi radarında hata:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}