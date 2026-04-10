"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Store, Users, Target, Smartphone, Calendar, User, TrendingUp, PieChart } from 'lucide-react';
import { useAppContext } from '../providers';

const featureIconsSmall = { 
  profile: <Briefcase size={20}/>, market: <Store size={20}/>, team: <Users size={20}/>, 
  booking: <Target size={20}/>, app: <Smartphone size={20}/>, marketing: <Target size={20}/>, 
  calendar: <Calendar size={20}/>, crm: <User size={20}/>, boost: <TrendingUp size={20}/>, stats: <PieChart size={20}/> 
};

export default function Features() {
  const router = useRouter();
  const { lang = 'TR', t } = useAppContext();
  
  const featNames = t?.[lang]?.featNames;
  const featDesc = t?.[lang]?.featDesc;

  if (!featNames) return null;

  return (
    <div className="w-full bg-[#FAF7F2] pb-24 pt-10 md:pt-16 min-h-screen">
      <div className="bg-[#2D1B4E] pt-20 md:pt-24 pb-32 md:pb-40 px-6 text-center">
        <h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tight">Tüm Özellikler</h1>
      </div>
      <div className="max-w-[1200px] mx-auto px-6 -mt-16 md:-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Object.keys(featNames).map(key => (
            <div key={key} onClick={() => router.push(`/ozellikler/${key}`)} className="bg-white p-8 md:p-10 rounded-[32px] shadow-xl border border-slate-200 cursor-pointer hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 text-[#E8622A] rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-orange-50 transition-colors">
                {featureIconsSmall[key]}
              </div>
              <h3 className="font-black text-lg md:text-xl text-[#2D1B4E] mb-3 md:mb-4 uppercase tracking-widest">{featNames[key]}</h3>
              <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">{featDesc[key]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}