'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; // Supabase yolunu kendi projene göre kontrol et

export default function TattooBriefForm({ shopId }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        idea: '',
        bodyPart: '',
        size: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basit doğrulama
        if (!formData.customerName || !formData.customerPhone || !formData.idea) {
            alert("Lütfen adınızı, telefonunuzu ve dövme fikrinizi girin.");
            return;
        }

        setIsSubmitting(true);

        // Supabase'e veriyi gönder
        const { error } = await supabase
            .from('tattoo_requests')
            .insert([
                {
                    shop_id: shopId,
                    customer_name: formData.customerName,
                    customer_phone: formData.customerPhone,
                    idea: formData.idea,
                    body_part: formData.bodyPart,
                    size: formData.size,
                    status: 'Bekliyor'
                }
            ]);

        setIsSubmitting(false);

        if (error) {
            console.error("Kayıt hatası:", error);
            alert("Gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
        } else {
            setIsSuccess(true);
        }
    };

    if (isSuccess) {
        return (
            <div style={{ backgroundColor: '#2D1B4E', padding: '40px 30px', borderRadius: '15px', color: 'white', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ fontSize: '50px', marginBottom: '15px' }}>✅</div>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', color: '#E8622A' }}>Talebiniz İletildi!</h2>
                <p style={{ fontSize: '14px', color: '#E9D5FF', lineHeight: '1.5' }}>
                    Dövme fikriniz sanatçıya başarıyla gönderildi. <br/><br/>
                    Sanatçı tasarımınızı inceledikten sonra fiyat ve uygun tarih bilgisiyle size <b>telefon numaranızdan</b> dönüş yapacaktır.
                </p>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#2D1B4E', padding: '30px', borderRadius: '15px', color: 'white', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#E8622A' }}>Projeni Anlat</h2>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#E9D5FF' }}>Sanatçıya fikrini gönder, sana özel fiyat teklifi gelsin.</p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Ad Soyad & Telefon (Yan yana) */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px' }}>Adınız Soyadınız</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Örn: Ahmet Yılmaz" 
                            value={formData.customerName}
                            onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #4B5563', backgroundColor: '#1F1235', color: 'white', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px' }}>Telefon (WhatsApp)</label>
                        <input 
                            type="tel" 
                            required
                            placeholder="05XX XXX XX XX" 
                            value={formData.customerPhone}
                            onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #4B5563', backgroundColor: '#1F1235', color: 'white', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>

                {/* 1. Dövme Fikri */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px' }}>Dövme Fikriniz Nedir?</label>
                    <textarea 
                        required
                        placeholder="Aklınızdaki tasarımı, stili ve detayları anlatın..." 
                        value={formData.idea}
                        onChange={(e) => setFormData({...formData, idea: e.target.value})}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #4B5563', backgroundColor: '#1F1235', color: 'white', minHeight: '80px', boxSizing: 'border-box' }}
                    ></textarea>
                </div>

                {/* 2. Vücut Bölgesi */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px' }}>Vücut Bölgesi</label>
                    <select 
                        value={formData.bodyPart}
                        onChange={(e) => setFormData({...formData, bodyPart: e.target.value})}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #4B5563', backgroundColor: '#1F1235', color: 'white', boxSizing: 'border-box', cursor: 'pointer' }}
                    >
                        <option value="">Bölge Seçin...</option>
                        <option value="Kol / Ön Kol">Kol / Ön Kol</option>
                        <option value="Bacak / Baldır">Bacak / Baldır</option>
                        <option value="Sırt">Sırt (Komple/Bölgesel)</option>
                        <option value="Göğüs">Göğüs</option>
                        <option value="Diğer">Diğer</option>
                    </select>
                </div>

                {/* 3. Boyut */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '12px' }}>Tahmini Boyut</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <label style={{ flex: 1, backgroundColor: '#1F1235', border: '1px solid #4B5563', padding: '10px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', fontSize: '13px' }}>
                            <input type="radio" name="size" value="Küçük" onChange={(e) => setFormData({...formData, size: e.target.value})} style={{ marginRight: '5px' }} /> Küçük
                        </label>
                        <label style={{ flex: 1, backgroundColor: '#1F1235', border: '1px solid #4B5563', padding: '10px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', fontSize: '13px' }}>
                            <input type="radio" name="size" value="Orta" onChange={(e) => setFormData({...formData, size: e.target.value})} style={{ marginRight: '5px' }} /> Orta
                        </label>
                        <label style={{ flex: 1, backgroundColor: '#1F1235', border: '1px solid #4B5563', padding: '10px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', fontSize: '13px' }}>
                            <input type="radio" name="size" value="Büyük" onChange={(e) => setFormData({...formData, size: e.target.value})} style={{ marginRight: '5px' }} /> Büyük
                        </label>
                    </div>
                </div>

                {/* Gönder Butonu */}
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ width: '100%', backgroundColor: '#E8622A', color: 'white', fontWeight: 'bold', fontSize: '16px', padding: '15px', border: 'none', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                >
                    {isSubmitting ? 'Gönderiliyor...' : 'Fiyat ve Tarih Teklifi İste'}
                </button>
            </form>
        </div>
    );
}