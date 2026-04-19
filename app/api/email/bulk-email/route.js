import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Resend kullanıyorsan .env.local dosyasından anahtarını çeker
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !to.length) {
      return NextResponse.json({ error: 'Alıcı listesi boş olamaz.' }, { status: 400 });
    }

    // Gelen e-posta dizisini (array) Resend'in istediği formata (Batch) çeviriyoruz
    const emails = to.map(email => ({
      from: 'Bookcy <info@bookcy.co>', // BURAYI KENDİ ONAYLI MAİL ADRESİNLE DEĞİŞTİRMEYİ UNUTMA
      to: [email],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-w-[600px] margin: 0 auto;">
          ${html}
          <hr style="border: none; border-top: 1px solid #eaeaea; margin-top: 40px; margin-bottom: 20px;" />
          <p style="font-size: 12px; color: #888; text-align: center;">
            Bu e-postayı Bookcy platformu üzerinden aldınız. 
            <br/> Artık bu e-postaları almak istemiyorsanız <a href="#" style="color: #E8622A;">abonelikten çıkabilirsiniz</a>.
          </p>
        </div>
      `,
    }));

    // Resend ile tek seferde toplu gönderim
    const { data, error } = await resend.batch.send(emails);

    if (error) {
      console.error("Toplu mail hatası:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API hatası:", error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}