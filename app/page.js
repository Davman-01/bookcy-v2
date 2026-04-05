import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Salons from "@/components/Salons";
import BusinessCTA from "@/components/BusinessCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col min-h-screen">
      <Navbar />
      {/* O meşhur mor Hero alanı buraya gelecek */}
      <Hero /> 
      
      <div className="relative z-10 -mt-10">
        <Categories />
      </div>

      <div className="py-20 bg-[#FAF7F2] dark:bg-[#0B0710]">
         <Salons /> {/* Vitrin kısmı - Premiumlar en üstte */}
      </div>

      <BusinessCTA />
      <Footer />
    </main>
  );
}