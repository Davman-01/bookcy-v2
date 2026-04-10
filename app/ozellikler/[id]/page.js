"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { Briefcase, Store, Users, Target, Smartphone, Calendar, User, TrendingUp, PieChart, Star } from 'lucide-react';
import { useAppContext } from '../../providers';

const featureIcons = { 
  profile: <Briefcase size={40} className="text-[#E8622A]"/>, market: <Store size={40} className="text-[#E8622A]"/>, 
  team: <Users size={40} className="text-[#E8622A]"/>, booking: <Target size={40} className="text-[#E8622A]"/>, 
  app: <Smartphone size={40} className="text-[#E8622A]"/>, marketing: <Target size={40} className="text-[#E8622A]"/>, 
  calendar: <Calendar size={40} className="text-[#E8622A]"/>, crm: <User size={40} className="text-[#E8622A]"/>, 
  boost: <TrendingUp size={40} className="text-[#E8622A]"/>, stats: <PieChart size={40} className="text-[#E8622A]"/> 
};

export default function FeatureDetail() {
  const params = useParams();
  const id = params.id;
  const { lang = 'TR', t } = useAppContext();
  
  const featNames = t?.[lang]?.featNames;
  const featDesc = t?.[lang]?.featDesc;

  if (!featNames || !featNames[id]) return null;

  return (
    <div className="w-full bg-[#FAF7F2] pb-24 pt-10 md:pt-16 min-h-screen">
      <div className="bg-[#2D1B4E] pt-20 md:pt-24 pb-32 md:pb-40 px-6 text-center border-b border-slate-800">
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">{featNames[id]}</h1>
      </div>
      <div className="max-w-[800px] mx-auto px-6 -mt-16 md:-mt-24">
        <div className="bg-white p-8 md:p-16 rounded-[40px] shadow-2xl border border-slate-200 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-orange-50 rounded-full flex items-center justify-center">
              {featureIcons[id] || <Star size={40} className="text-[#E8622A]"/>}
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#2D1B4E] mb-6 uppercase tracking-widest">{featNames[id]}</h2>
          <p className="text-base md:text-xl text-slate-500 leading-relaxed font-medium">{featDesc[id]}</p>
        </div>
      </div>
    </div>
  );
}