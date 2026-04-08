import { NextResponse } from 'next/server';
// Not: Gerçek mail gönderimi için projene "resend" paketini kurmalısın (npm install resend)
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { to, subject, html, text } = await request.json();

    // Geliştirme aşamasında terminale log basıyoruz (Vercel'de çökmeyi önler)
    console.log(`[EMAIL SİSTEMİ] Alıcı: ${to} | Konu: ${subject}`);
    
    // GERÇEK PRODÜKSİYONDA AŞAĞIDAKİ KODU AÇACAKSIN:
    /*
    const data = await resend.emails.send({
      from: 'Bookcy <noreply@bookcy.co>',
      to: to,
      subject: subject,
      html: html,
    });
    */

    return NextResponse.json({ success: true, message: "E-posta başarıyla gönderildi (Simülasyon)" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}