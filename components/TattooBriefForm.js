'use client';

import React from 'react';

export default function TattooBriefForm() {
    return (
        <div style={{ backgroundColor: '#2D1B4E', padding: '30px', borderRadius: '15px', color: 'white', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#E8622A' }}>Projeni Anlat</h2>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#E9D5FF' }}>Sanatçıya fikrini gönder, sana özel fiyat ve tarih teklifi gelsin.</p>
            </div>

            <form>
                {/* 1. Dövme Fikri */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Dövme Fikriniz Nedir?</label>
                    <textarea 
                        placeholder="Aklınızdaki tasarımı detaylıca anlatın..." 
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #4B5563', backgroundColor: '#1F1235', color: 'white', minHeight: '100px', boxSizing: 'border-box' }}
                    ></textarea>
                </div>

                {/* 2. Vücut Bölgesi */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Vücut Bölgesi</label>
                    <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #4B5563', backgroundColor: '#1F1235', color: 'white', boxSizing: 'border-box', cursor: 'pointer' }}>
                        <option value="">Bölge Seçin...</option>
                        <option value="kol">Kol / Ön Kol</option>
                        <option value="bacak">Bacak / Baldır</option>
                        <option value="sirt">Sırt (Komple/Bölgesel)</option>
                        <option value="gogus">Göğüs</option>
                        <option value="diger">Diğer</option>
                    </select>
                </div>

                {/* 3. Boyut */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Tahmini Boyut</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <label style={{ flex: 1, backgroundColor: '#1F1235', border: '1px solid #4B5563', padding: '10px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
                            <input type="radio" name="size" value="kucuk" style={{ marginRight: '5px' }} /> Küçük
                        </label>
                        <label style={{ flex: 1, backgroundColor: '#1F1235', border: '1px solid #4B5563', padding: '10px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
                            <input type="radio" name="size" value="orta" style={{ marginRight: '5px' }} /> Orta
                        </label>
                        <label style={{ flex: 1, backgroundColor: '#1F1235', border: '1px solid #4B5563', padding: '10px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
                            <input type="radio" name="size" value="buyuk" style={{ marginRight: '5px' }} /> Büyük
                        </label>
                    </div>
                </div>

                {/* Gönder Butonu */}
                <button 
                    type="button" 
                    style={{ width: '100%', backgroundColor: '#E8622A', color: 'white', fontWeight: 'bold', fontSize: '16px', padding: '15px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                    Fiyat ve Tarih Teklifi İste
                </button>
            </form>
        </div>
    );
}