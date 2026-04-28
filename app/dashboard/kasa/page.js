"use client";
import React, { useState } from 'react';
import { Wallet, CreditCard, Banknotes, Plus, Search, TrendingUp, Users, FileText } from 'lucide-react';

export default function KasaPage() {
  const [activeTab, setActiveTab] = useState('bugun');

  // Örnek (Mock) Veriler - Arka plan bağlanınca bunlar veritabanından gelecek
  const stats = {
    toplamCiro: "12.450 ₺",
    nakit: "4.200 ₺",
    krediKarti: "8.250 ₺",
    personelPrimi: "3.150 ₺"
  };

  const adisyonlar = [
    { id: "AD-001", musteri: "Ahmet Yılmaz", islem: "Saç Kesimi + Sakal", personel: "Caner Usta", tutar: "650 ₺", tip: "Kredi Kartı", durum: "Ödendi", saat: "10:30" },
    { id: "AD-002", musteri: "Ayşe Demir", islem: "Röfle + Manikür", personel: "Merve Hanım", tutar: "2.400 ₺", tip: "Kredi Kartı", durum: "Ödendi", saat: "11:15" },
    { id: "AD-003", musteri: "Mehmet Kaya", islem: "Lazer Epilasyon (1. Seans)", personel: "Esra Uzman", tutar: "1.200 ₺", tip: "Nakit", durum: "Ödendi", saat: "12:00" },
    { id: "AD-004", musteri: "Selin Yücel", islem: "Cilt Bakımı", personel: "Esra Uzman", tutar: "800 ₺", tip: "Bekliyor", durum: "Ödenmedi", saat: "14:30" },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6 lg:p-10 font-['Plus_Jakarta_Sans']">
      
      {/* Üst Başlık ve Aksiyon Alanı */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2D1B4E] tracking-tight">Kasa & Adisyon</h1>
          <p className="text-slate-500 font-medium mt-1">Günlük finansal akışınızı ve personel hakedişlerini yönetin.</p>
        </div>
        <button className="bg-[#E8622A] hover:bg-[#d65a26] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-500/30">
          <Plus size={20} />
          Yeni Adisyon Kes
        </button>
      </div>

      {/* Finansal Özet Kartları (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 text-[#2D1B4E] rounded-xl"><Wallet size={24} /></div>
            <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg"><TrendingUp size={14} className="mr-1"/> +12%</span>
          </div>
          <p className="text-slate-500 font-medium text-sm mb-1">Günlük Toplam Ciro</p>
          <h3 className="text-2xl font-black text-[#2D1B4E]">{stats.toplamCiro}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-[#E8622A] rounded-xl"><CreditCard size={24} /></div>
          </div>
          <p className="text-slate-500 font-medium text-sm mb-1">Kredi Kartı Tahsilat</p>
          <h3 className="text-2xl font-black text-[#2D1B4E]">{stats.krediKarti}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-emerald-600 rounded-xl"><FileText size={24} /></div>
          </div>
          <p className="text-slate-500 font-medium text-sm mb-1">Nakit Tahsilat</p>
          <h3 className="text-2xl font-black text-[#2D1B4E]">{stats.nakit}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users size={24} /></div>
          </div>
          <p className="text-slate-500 font-medium text-sm mb-1">Hesaplanan Personel Primi</p>
          <h3 className="text-2xl font-black text-[#2D1B4E]">{stats.personelPrimi}</h3>
        </div>
      </div>

      {/* Adisyonlar Tablosu */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-black text-[#2D1B4E]">Son İşlemler</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Adisyon veya Müşteri Ara..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] w-full md:w-64 transition-all" />
            </div>
            <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none cursor-pointer">
              <option>Bugün</option>
              <option>Bu Hafta</option>
              <option>Bu Ay</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold pl-8">Saat / No</th>
                <th className="p-4 font-bold">Müşteri</th>
                <th className="p-4 font-bold">İşlem</th>
                <th className="p-4 font-bold">Personel</th>
                <th className="p-4 font-bold">Ödeme Tipi</th>
                <th className="p-4 font-bold text-right pr-8">Tutar / Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adisyonlar.map((ad, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 pl-8">
                    <div className="font-bold text-[#2D1B4E]">{ad.saat}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{ad.id}</div>
                  </td>
                  <td className="p-4 font-medium text-[#2D1B4E]">{ad.musteri}</td>
                  <td className="p-4 text-slate-600 text-sm font-medium">{ad.islem}</td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">{ad.personel}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${ad.tip === 'Kredi Kartı' ? 'bg-orange-50 text-[#E8622A]' : ad.tip === 'Nakit' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {ad.tip}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-8">
                    <div className="font-black text-[#2D1B4E] text-base">{ad.tutar}</div>
                    <div className={`text-xs font-bold mt-1 ${ad.durum === 'Ödendi' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {ad.durum}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}