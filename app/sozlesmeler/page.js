"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Sozlesmeler() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] dark:bg-[#120b1e]">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-white/5 p-10 rounded-[40px] shadow-sm border border-slate-100 dark:border-white/5">
          <h1 className="text-3xl font-black text-[#2D1B4E] dark:text-white mb-8">Gizlilik Politikası ve Kullanım Şartları</h1>
          
          <div className="space-y-8 text-slate-600 dark:text-white/60 font-medium leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-[#E8622A] mb-4">1. Kullanım Şartları</h2>
              <p>Bookcy platformuna üye olan tüm işletme ve müşteriler, sunulan hizmetlerin Kuzey Kıbrıs yasalarına uygun olduğunu ve randevu sisteminin kötüye kullanılmayacağını taahhüt eder.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#E8622A] mb-4">2. Gizlilik Politikası</h2>
              <p>Kişisel verileriniz (Telefon, E-mail, Konum) sadece randevu onay süreçleri için kullanılır ve üçüncü taraflarla asla paylaşılmaz. Verileriniz yüksek güvenlikli sunucularda şifrelenmiş olarak saklanır.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[#E8622A] mb-4">3. İptal ve İade</h2>
              <p>Randevu iptalleri, seçilen işletmenin belirlediği süreler (Örn: son 24 saat) içerisinde yapılmalıdır. Premium paket iadeleri ilk 7 iş günü içinde değerlendirilir.</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}