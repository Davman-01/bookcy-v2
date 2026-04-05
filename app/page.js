import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import Salons from "@/components/Salons";
import BusinessCTA from "@/components/BusinessCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col min-h-screen bg-[#FAF7F2]">
      <Navbar />
      <Hero /> 
      
      <div className="relative z-10">
        <Categories />
      </div>

      <div className="py-20 bg-[#FAF7F2]">
         <Salons />
      </div>

      <BusinessCTA />
      <Footer />
    </main>
  );
}