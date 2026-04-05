import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Salons from "@/components/Salons";
import BusinessCTA from "@/components/BusinessCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col min-h-screen bg-[#FAF7F2]">
      
      {/* VERCEL RENK KİLİDİ: SİTENİN KARARMASINI KESİN OLARAK ENGELLER */}
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          /* Kurumsal Renklerimiz */
          --c-bg-main: #FAF7F2 !important; /* Krem Arka Plan */
          --c-bg-card: #FFFFFF !important;
          --c-text-main: #2D1B4E !important; /* Koyu Mor Yazılar */
          --terra: #E8622A !important; /* Turuncu Vurgu */
        }
        
        /* Koyu mod açılsa bile sitenin karanlık olmasını yasaklıyoruz */
        .dark, [data-theme='dark'], html.dark {
          --c-bg-main: #FAF7F2 !important;
          --c-bg-card: #FFFFFF !important;
          --c-text-main: #2D1B4E !important;
        }

        /* Tüm gövdeyi Krem rengine ve yazıları Mora zorluyoruz */
        body {
          background-color: #FAF7F2 !important;
          color: #2D1B4E !important;
        }

        /* Hero ve diğer karanlık arka planlı alanları aydınlatıyoruz */
        .bg-\\[\\#0B0710\\] {
          background-color: #FAF7F2 !important;
        }
      `}} />

      <Navbar />
      
      {/* O meşhur mor Hero alanı buraya gelecek */}
      <Hero /> 
      
      <div className="relative z-10 -mt-10">
        <Categories />
      </div>

      <div className="py-20 bg-[#FAF7F2]">
         <Salons /> {/* Vitrin kısmı - Premiumlar en üstte */}
      </div>

      <BusinessCTA />
      
      <Footer />
    </main>
  );
}