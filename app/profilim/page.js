"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut, User, Calendar, Scissors, Music, MapPin, Loader2, Heart } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      // 1. Giriş yapmış kullanıcıyı bul
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        router.push('/randevu-sorgula');
        return;
      }
      
      setUser(session.user);
      
      // 2. Otomatik açtığımız 'customers' tablosundan müşterinin detaylarını çek
      const { data: cust } = await supabase
        .from('customers')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (cust) setCustomerData(cust);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/randevu-sorgula');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#E8622A] mb-4" size={48} />
        <p className="font-black text-[#2D1B4E] uppercase tracking-widest animate-pulse">Profiliniz Hazırlanıyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-['DM Sans'] pt-10 pb-20 px-4 md:px-10">
      <div className="max-w-[1000px] mx-auto animate-in fade-in duration-500">
        
        {/* Üst Bilgi Kartı */}
        <div className="bg-[#2D1B4E] rounded-[40px] p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 mb-10 relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-[#E8622A]/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-24 h-24 bg-white/10 p-1 rounded-3xl backdrop-blur-sm border border-white/20">
              {customerData?.avatar_url ? (
                <img src={customerData.avatar_url} className="w-full h-full object-cover rounded-[20px]" alt="Profil" />
              ) : (
                <div className="w-full h-full bg-[#E8622A] rounded-[20px] flex items-center justify-center font-black text-3xl">
                  {customerData?.full_name ? customerData.full_name.charAt(0) : 'B'}
                </div>
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#F5C5A3] uppercase tracking-widest mb-1">Bookcy Özel Üyesi</p>
              <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight">{customerData?.full_name || 'Değerli Müşterimiz'}</h1>
              <p className="text-sm font-medium text-white/70 mt-1">{customerData?.email || user?.email}</p>
            </div>
          </div>
          
          <button onClick={handleLogout} className="bg-white/10 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 border border-white/20 hover:border-red-500 cursor-pointer transition-all z-10 w-full md:w-auto justify-center">
            <LogOut size={16}/> Çıkış Yap
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sol Kolon: Menü ve İstatistikler */}
          <div className="space-y-8">
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
              <h3 className="font-black text-lg text-[#2D1B4E] mb-6 border-b border-slate-100 pb-4">Hesap Özeti</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <div className="w-12 h-12 bg-white text-[#E8622A] rounded-xl flex items-center justify-center shadow-sm">
                    <Calendar size={20}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aktif Randevular</p>
                    <p className="text-xl font-black text-[#2D1B4E]">0</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-2xl border border-pink-100">
                  <div className="w-12 h-12 bg-white text-pink-500 rounded-xl flex items-center justify-center shadow-sm">
                    <Heart size={20}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Favori Mekanlar</p>
                    <p className="text-xl font-black text-[#2D1B4E]">0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Randevular */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm min-h-[400px]">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h3 className="font-black text-xl text-[#2D1B4E] flex items-center gap-2">
                  <Calendar className="text-[#E8622A]"/> Yaklaşan Randevularım
                </h3>
              </div>
              
              {/* Buraya ileride müşterinin randevularını basacağız */}
              <div className="flex flex-col items-center justify-center text-center py-20 opacity-60">
                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                  <Scissors size={32}/>
                </div>
                <h4 className="font-black text-lg text-[#2D1B4E] uppercase">Randevunuz Yok</h4>
                <p className="text-xs font-bold text-slate-400 mt-2 max-w-xs">Şu an için planlanmış bir işleminiz bulunmuyor. Hemen keşfetmeye başlayın!</p>
                <button onClick={() => router.push('/')} className="mt-6 bg-[#E8622A] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest border-none cursor-pointer hover:scale-105 transition-transform shadow-md">
                  Keşfet
                </button>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}