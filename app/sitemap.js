export default function sitemap() {
  const baseUrl = 'https://www.bookcy.co'; // Domainin buysa aynen kalsın

  return [
    { url: `${baseUrl}`, lastModified: new Date() },
    { url: `${baseUrl}/isletmeler`, lastModified: new Date() },
    { url: `${baseUrl}/ozellikler`, lastModified: new Date() },
    { url: `${baseUrl}/neden-bookcy`, lastModified: new Date() },
    { url: `${baseUrl}/hakkimizda`, lastModified: new Date() },
    { url: `${baseUrl}/iletisim`, lastModified: new Date() },
    // Yasal Sayfalar
    { url: `${baseUrl}/yasal/gizlilik`, lastModified: new Date() },
    { url: `${baseUrl}/yasal/kvkk`, lastModified: new Date() },
    { url: `${baseUrl}/yasal/sartlar`, lastModified: new Date() },
    { url: `${baseUrl}/yasal/cerez`, lastModified: new Date() },
  ];
}