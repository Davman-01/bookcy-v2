// Ortak CSS stili (Tüm maillerde kullanılacak)
const baseStyle = `font-family:'DM Sans',Arial,sans-serif;background-color:#F0EBF4;padding:32px 16px;margin:0;`;

// 1. KAYIT ONAYI (İşletmeye Giden)
export const getRegistrationTemplate = (data) => {
  const { shopName, date, packageName, price } = data;
  const bankInfo = {
    bankName: "İş Bankası",
    accountOwner: "BOOKCY LTD.",
    iban: "TR99 0006 4000 0012 3456 7890 12",
    accountNo: "1234567"
  };

  return `
    <div style="${baseStyle}">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background-color:#4A1942;padding:36px 40px 28px;">
          <div style="font-size:28px;font-weight:700;color:#F2C4A8;">bookcy.</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Kayıt Alındı</div>
        </td></tr>
        <tr><td style="height:4px;background:linear-gradient(90deg,#C4622D,#F2C4A8,#C4622D);"></td></tr>
        <tr><td style="padding:40px 40px 0;">
          <h1 style="font-size:26px;font-weight:700;color:#4A1942;margin:0 0 12px;">Kayıt Talebiniz Başarıyla Alındı!</h1>
          <p style="font-size:15px;color:#5A3D52;line-height:1.7;">Sayın <strong>${shopName}</strong>, Bookcy platformuna üyelik talebiniz alınmıştır. Ödemenizin ardından hesabınız aktif edilecektir.</p>
        </td></tr>
        <tr><td style="padding:24px 40px 0;">
          <div style="font-size:11px;font-weight:600;color:#C4622D;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;">Kayıt Bilgileriniz</div>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F5FB;border-radius:12px;">
            <tr><td style="padding:14px 20px;border-bottom:1px solid #F0EBF4;">İşletme Adı: <strong>${shopName}</strong></td></tr>
            <tr><td style="padding:14px 20px;border-bottom:1px solid #F0EBF4;">Tarih: <strong>${date}</strong></td></tr>
            <tr><td style="padding:14px 20px;border-bottom:1px solid #F0EBF4;">Paket: <strong>${packageName}</strong></td></tr>
            <tr><td style="padding:14px 20px;">Aylık Ücret: <strong style="color:#C4622D;">${price}</strong></td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:28px 40px 0;">
          <div style="font-size:11px;font-weight:600;color:#C4622D;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;">Ödeme Bilgileri (IBAN)</div>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#4A1942;border-radius:12px;color:white;">
            <tr><td style="padding:20px;">Banka: <strong>${bankInfo.bankName}</strong></td></tr>
            <tr><td style="padding:20px;">Alıcı: <strong>${bankInfo.accountOwner}</strong></td></tr>
            <tr><td style="padding:20px;">IBAN: <strong style="color:#F2C4A8;">${bankInfo.iban}</strong></td></tr>
            <tr><td style="padding:20px;">Açıklama: <strong style="color:#F2C4A8;">${shopName} - Bookcy Üyelik</strong></td></tr>
          </table>
          <p style="font-size:12px;color:#7A3018;background:#FDF5EE;padding:12px;border-left:3px solid #C4622D;margin-top:12px;">⚠️ Dekontunuzu WhatsApp (0555 555 5555) üzerinden iletmeyi unutmayınız.</p>
        </td></tr>
        <tr><td style="padding:32px 40px;background-color:#4A1942;color:white;text-align:center;margin-top:20px;">
          © ${new Date().getFullYear()} Bookcy Kıbrıs. Tüm hakları saklıdır.
        </td></tr>
      </table>
    </div>
  `;
};

// 2. HESAP AKTİF (Admin Onayladığında İşletmeye Giden)
export const getActivationTemplate = (data) => {
  const { shopName, packageName, username, password } = data;
  return `
    <div style="${baseStyle}">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background-color:#4A1942;padding:36px 40px 28px;">
          <div style="font-size:28px;font-weight:700;color:#F2C4A8;">bookcy.</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Hesap Aktif Edildi</div>
        </td></tr>
        <tr><td style="height:4px;background:linear-gradient(90deg,#C4622D,#F2C4A8,#C4622D);"></td></tr>
        <tr><td style="padding:40px 40px 0;text-align:center;">
          <h1 style="font-size:28px;font-weight:700;color:#4A1942;margin:0 0 12px;">Tebrikler ${shopName}! 🎉</h1>
          <p style="font-size:15px;color:#5A3D52;line-height:1.7;">İşletme profiliniz yöneticilerimiz tarafından incelenmiş ve <strong>onaylanmıştır.</strong> Artık rezervasyon alabilirsiniz.</p>
          
          <div style="background:#F9F5FB;border-left:4px solid #00c48c;padding:20px;margin:24px 0;text-align:left;">
            <p style="margin: 0 0 10px 0; color: #4A1942;">👤 <strong>Kullanıcı Adı:</strong> ${username}</p>
            <p style="margin: 0 0 10px 0; color: #4A1942;">🔒 <strong>Şifre:</strong> ${password}</p>
            <p style="margin: 0; color: #4A1942;">📦 <strong>Paket:</strong> ${packageName}</p>
          </div>

          <a href="https://www.bookcy.co/isletme-giris" style="display:inline-block;background:#C4622D;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:50px;font-weight:700;">İşletme Paneline Giriş Yap</a>
        </td></tr>
        <tr><td style="padding:32px 40px;background-color:#4A1942;color:white;text-align:center;margin-top:40px;">
          © ${new Date().getFullYear()} Bookcy Kıbrıs. Tüm hakları saklıdır.
        </td></tr>
      </table>
    </div>
  `;
};

// 3. YENİ RANDEVU (Müşteri Aldığında İşletmeye Giden)
export const getNewBookingShopTemplate = (data) => {
  const { shopName, date, time, service, staff, customerName, customerPhone, customerEmail } = data;
  return `
    <div style="${baseStyle}">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background-color:#4A1942;padding:36px 40px 28px;">
          <div style="font-size:28px;font-weight:700;color:#F2C4A8;">bookcy.</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Yeni Randevu Bildirimi</div>
        </td></tr>
        <tr><td style="padding:40px 40px 0;">
          <h1 style="font-size:22px;font-weight:700;color:#4A1942;margin:0 0 8px;">Yeni Randevu Talebiniz Var!</h1>
          <p style="font-size:15px;color:#5A3D52;line-height:1.7;">Sayın <strong>${shopName}</strong>, sistem üzerinden yeni bir randevu oluşturuldu.</p>
        </td></tr>
        <tr><td style="padding:24px 40px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#4A1942;border-radius:14px;color:white;">
            <tr><td style="padding:20px;">📅 Tarih: <strong>${date}</strong></td></tr>
            <tr><td style="padding:20px;">🕐 Saat: <strong>${time}</strong></td></tr>
            <tr><td style="padding:20px;">✂️ Hizmet: <strong>${service}</strong></td></tr>
            <tr><td style="padding:20px;">👤 Personel: <strong>${staff}</strong></td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px 40px 0;">
          <div style="font-size:11px;font-weight:600;color:#C4622D;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:14px;">Müşteri Bilgileri</div>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F5FB;border-radius:12px;color:#4A1942;">
            <tr><td style="padding:14px 20px;">Ad Soyad: <strong>${customerName}</strong></td></tr>
            <tr><td style="padding:14px 20px;">Telefon: <strong>${customerPhone}</strong></td></tr>
            <tr><td style="padding:14px 20px;">E-Posta: <strong>${customerEmail}</strong></td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:28px 40px 32px;text-align:center;">
          <a href="https://www.bookcy.co/isletme-giris" style="display:inline-block;background:#4A1942;color:#F2C4A8;text-decoration:none;padding:14px 28px;border-radius:50px;font-weight:600;">Panelden Yönet</a>
        </td></tr>
      </table>
    </div>
  `;
};

// 4. RANDEVU ONAYI VE İPTAL LİNKİ (Müşteri Aldığında Müşteriye Giden)
export const getBookingConfirmationTemplate = (data) => {
  const { customerName, shopName, date, time, service, staff, address, customerPhone } = data;
  return `
    <div style="${baseStyle}">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="background-color:#4A1942;padding:36px 40px 28px;">
          <div style="font-size:28px;font-weight:700;color:#F2C4A8;">bookcy.</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Randevu Onaylandı</div>
        </td></tr>
        <tr><td style="padding:40px 40px 0;text-align:center;">
          <h1 style="font-size:26px;font-weight:700;color:#4A1942;margin:0 0 10px;">Randevunuz Onaylandı!</h1>
          <p style="font-size:15px;color:#5A3D52;line-height:1.7;">Merhaba <strong>${customerName}</strong>, rezervasyonunuz başarıyla oluşturuldu.</p>
        </td></tr>
        <tr><td style="padding:24px 40px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#4A1942 0%,#7B3D72 100%);border-radius:16px;color:white;">
            <tr><td style="padding:24px;">
              <div style="margin-bottom:10px;">🏪 İşletme: <strong style="float:right;">${shopName}</strong></div>
              <div style="margin-bottom:10px;">✂️ Hizmet: <strong style="float:right;">${service}</strong></div>
              <div style="margin-bottom:10px;">📅 Tarih: <strong style="float:right;color:#F2C4A8;">${date}</strong></div>
              <div style="margin-bottom:10px;">🕐 Saat: <strong style="float:right;color:#F2C4A8;">${time}</strong></div>
              <div style="margin-bottom:10px;">👤 Personel: <strong style="float:right;">${staff}</strong></div>
              <div style="margin-top:20px; font-size:12px; color:rgba(255,255,255,0.7);">📍 Adres: ${address}</div>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:32px 40px 0;text-align:center;">
          <p style="font-size:13px;color:#5A3D52;margin-bottom:16px;">Randevunuzu yönetmek veya iptal etmek isterseniz (son 1 saate kadar) aşağıdaki butonu kullanabilirsiniz:</p>
          <a href="https://www.bookcy.co/randevu-sorgula?phone=${customerPhone}" style="display:inline-block;background:#C4622D;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:50px;font-weight:700;font-size:14px;box-shadow: 0 4px 6px rgba(196, 98, 45, 0.3);">Randevumu Yönet / İptal Et</a>
        </td></tr>
        <tr><td style="padding:32px 40px;background-color:#4A1942;color:white;text-align:center;margin-top:30px;">
          Bizi tercih ettiğiniz için teşekkürler! © ${new Date().getFullYear()} Bookcy Kıbrıs.
        </td></tr>
      </table>
    </div>
  `;
};