import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Vercel panelindeki RESEND_API_KEY anahtarını kullanır
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { to, subject, html } = await request.json();

    // ÖNEMLİ: Kendi domainini (bookcy.co) Resend'de doğrulatana kadar 
    // 'from' kısmında sadece 'onboarding@resend.dev' kullanabilirsin.
    const { data, error } = await resend.emails.send({
      from: 'Bookcy <onboarding@resend.dev>', 
      to: to,
      subject: subject,
      html: html,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}