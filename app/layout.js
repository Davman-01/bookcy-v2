import './globals.css';
import { AppProvider } from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Bookcy | Kıbrıs\'ın #1 Güzellik Platformu',
  description: 'Yakınındaki en iyi berber, kuaför, spa ve güzellik uzmanlarını bul.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          :root { --fig: #2D1B4E; --terra: #E8622A; --c-bg-main: #FAF7F2; --c-text-main: #2D1B4E; --c-nav-bg: rgba(255,255,255,0.98); }
          body { background: var(--c-bg-main); color: var(--c-text-main); font-family: 'DM Sans', sans-serif; overflow-x: hidden; margin: 0; padding: 0; }
          
          /* EKSİK OLAN NAVBAR ANA CSS KODLARI BURADA */
          nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 0 40px; height: 76px; display: flex; align-items: center; justify-content: space-between; background: var(--c-nav-bg); backdrop-filter: blur(20px); border-bottom: 1px solid #F1F5F9; transition: all 0.3s; }
          
          .nav-logo-box { width: 140px; height: 50px; display: flex; align-items: center; cursor: pointer; text-decoration: none; } 
          .nav-logo-box img { max-height: 100%; max-width: 100%; object-fit: contain; mix-blend-mode: multiply; transform: scale(1.3); transform-origin: left center;} 
          
          .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; height: 100%; margin:0; padding:0; }
          .nav-main-btn { text-decoration: none; font-size: 14px; font-weight: 700; color: #64748B; transition: all 0.2s; position: relative; background:none; border:none; outline:none; font-family:'DM Sans', sans-serif; cursor:pointer;}
          .nav-main-btn:hover, .nav-main-btn.active { color: var(--terra); }
          
          .lang-pills { display: flex; flex-direction: row; gap: 4px; } 
          .lang-pill { font-size: 11px; font-weight:600; padding: 4px 10px; border-radius: 20px; border: 1px solid transparent; transition: all 0.2s; color: #64748B; cursor:pointer; background:none;} 
          .lang-pill.active { background: var(--fig); color: white; border-color: var(--fig); } 
          .lang-pill:hover:not(.active) { border-color: #E2E8F0; color: var(--c-text-main); }
          
          .nav-right { display: flex; flex-direction: row; align-items: center; gap: 16px; flex-shrink: 0; }
          .btn-outline { font-family:'DM Sans',sans-serif; font-size: 13px; font-weight: 700; padding: 10px 20px; border-radius: 50px; border: 2px solid var(--c-text-main); background: transparent; color: var(--c-text-main); transition: all 0.25s; cursor:pointer; text-decoration:none; } 
          .btn-outline:hover { background:var(--c-text-main); color:white; }
          .btn-primary { font-family:'DM Sans',sans-serif; font-size: 13px; font-weight: 700; padding: 12px 24px; border-radius: 50px; border: none; background: var(--terra); color: white; transition: all 0.25s; display:flex; align-items:center; gap:8px; cursor:pointer; text-decoration:none; } 
          .btn-primary:hover { background: #d4561f; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(232,98,42,0.3); }

          /* MOBİL UYUM KODLARI */
          @media(max-width:900px){ 
            nav { padding:0 20px; } 
          }
        `}} />
      </head>
      <body>
        <AppProvider>
          <Navbar />
          <main className="flex-1 w-full relative z-10 min-h-[80vh] mt-[76px]">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}