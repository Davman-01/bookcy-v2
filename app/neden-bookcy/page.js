"use client";
import React from 'react';
import { Crown, Grid, Users, Smartphone, TrendingUp, MessageSquare } from 'lucide-react';
import { useAppContext } from '../providers';

export default function WhyBookcy() {
  const { lang = 'TR', t } = useAppContext();
  const text = t?.[lang]?.why;

  if (!text) return null;

  return (
    <div className="w-full bg-[#FAF7F2] pb-24 pt-10 md:pt-16">
      <div className="bg-[#2D1B4E] pt-20 md:pt-24 pb-20 md:pb-24 px-6 text-center border-b border-slate-800">
        <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">{text.tag}</span>
        <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6">
          {text.title1} <span className="text-[#E8622A]">{text.title2}</span> {text.title3}
        </h1>
        <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto px-4">{text.sub}</p>
      </div>
      <div className="max-w-6xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
            <div className="w-16 h-16 bg-orange-50 text-[#E8622A] rounded-2xl flex items-center justify-center mb-6"><Crown size={32}/></div>
            <h3 className="font-black text-xl text-[#2D1B4E] mb-3">{text.c1}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{text.d1}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6"><Grid size={32}/></div>
            <h3 className="font-black text-xl text-[#2D1B4E] mb-3">{text.c2}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{text.d2}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6"><Users size={32}/></div>
            <h3 className="font-black text-xl text-[#2D1B4E] mb-3">{text.c3}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{text.d3}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
            <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6"><Smartphone size={32}/></div>
            <h3 className="font-black text-xl text-[#2D1B4E] mb-3">{text.c4}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{text.d4}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
            <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mb-6"><TrendingUp size={32}/></div>
            <h3 className="font-black text-xl text-[#2D1B4E] mb-3">{text.c5}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{text.d5}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
            <div className="w-16 h-16 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center mb-6"><MessageSquare size={32}/></div>
            <h3 className="font-black text-xl text-[#2D1B4E] mb-3">{text.c6}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">{text.d6}</p>
          </div>
        </div>
      </div>
    </div>
  );
}