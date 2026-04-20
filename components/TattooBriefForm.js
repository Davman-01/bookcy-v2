'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TattooBriefForm({ shopId }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        idea: '',
        bodyPart: '',
        size: ''
    });
    
    // Görsel yükleme için state (Şimdilik UI olarak tutuyoruz, Supabase Storage'a bağlanacak)
    const [selectedImage, setSelectedImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.customerName || !formData.customerPhone || !formData.idea) {
            alert("Lütfen adınızı, telefonunuzu ve dövme fikrinizi girin.");
            return;
        }

        setIsSubmitting(true);

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
                    // İleride buraya image_url eklenecek
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
            <div className="animate-in zoom-in duration-300" style={{ backgroundColor: '#2D1B4E', padding: '60px 30px', borderRadius: '32px', color: 'white', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(45,27,78,0.15)' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
                <h2 style={{ margin: '0 0 15px 0', fontSize: '32px', color: '#E8622A', fontWeight: '900' }}>Tasarım Fikriniz İletildi!</h2>
                <p style={{ fontSize: '16px', color: '#E9D5FF', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto' }}>
                    Talebiniz sanatçıya başarıyla gönderildi. <br/><br/>
                    Sanatçı tarzınızı ve ölçüleri inceledikten sonra, fiyat ve uygun tarih teklifiyle birlikte size en kısa sürede dönüş yapacaktır.
                </p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-300" style={{ backgroundColor: '#2D1B4E', padding: '40px md:padding-50px', borderRadius: '32px', color: 'white', width: '100%', fontFamily: 'sans-serif', boxShadow: '0 20px 40px rgba(45,27,78,0.1)' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '35px', padding: '0 20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🖋️</div>
                <h2 style={{ margin: 0, fontSize: '28px', color: '#E8622A', fontWeight: '900', textTransform: 'uppercase' }}>Hayalindeki Dövmeyi Anlat</h2>
                <p style={{ margin: '10px 0 0 0', fontSize: '15px', color: '#E9D5FF' }}>Tasarım detaylarını paylaş, sanatçıdan sana özel fiyat ve süre teklifi gelsin.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '0 20px' }}>
                {/* 3'lü İletişim Bilgileri */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ flex: '1 1 30%', minWidth: '150px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#E9D5FF' }}>Adınız Soyadınız</label>
                        <input type="text" required placeholder="Örn: Ahmet Yılmaz" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #4B5563', backgroundColor: '#1F1235', color: 'white', boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                    <div style={{ flex: '1 1 30%', minWidth: '150px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#E9D5FF' }}>Telefon (WhatsApp)</label>
                        <input type="tel" required placeholder="05XX XXX XX XX" value={formData.customerPhone} onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #4B5563', backgroundColor: '#1F1235', color: 'white', boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                    <div style={{ flex: '1 1 30%', minWidth: '150px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#E9D5FF' }}>E-posta Adresiniz</label>
                        <input type="email" required placeholder="ornek@mail.com" value={formData.customerEmail} onChange={(e) => setFormData({...formData, customerEmail: e.target.value})} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #4B5563', backgroundColor: '#1F1235', color: 'white', boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '25px' }}>
                    {/* Dövme Fikri */}
                    <div style={{ flex: '1 1 60%', minWidth: '250px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#E9D5FF' }}>Tarzınız ve Detaylar Neler?</label>
                        <textarea required placeholder="Örn: Gerçekçi tarzda, gölgeli bir aslan dövmesi istiyorum. İçinde geometrik desenler de olabilir..." value={formData.idea} onChange={(e) => setFormData({...formData, idea: e.target.value})} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #4B5563', backgroundColor: '#1F1235', color: 'white', minHeight: '135px', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }}></textarea>
                    </div>

                    {/* Sağ Taraf - Seçimler */}
                    <div style={{ flex: '1 1 30%', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#E9D5FF' }}>Vücut Bölgesi</label>
                            <select value={formData.bodyPart} onChange={(e) => setFormData({...formData, bodyPart: e.target.value})} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #4B5563', backgroundColor: '#1F1235', color: 'white', boxSizing: 'border-box', cursor: 'pointer', outline: 'none' }}>
                                <option value="">Seçiniz...</option>
                                <option value="Kol / Ön Kol">Kol / Ön Kol</option>
                                <option value="Bacak / Baldır">Bacak / Baldır</option>
                                <option value="Sırt">Sırt (Komple/Bölgesel)</option>
                                <option value="Göğüs">Göğüs</option>
                                <option value="Diğer">Diğer</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#E9D5FF' }}>Boyut</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <label style={{ flex: 1, backgroundColor: formData.size === 'Küçük' ? '#E8622A' : '#1F1235', border: '1px solid', borderColor: formData.size === 'Küçük' ? '#E8622A' : '#4B5563', padding: '12px 5px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', fontSize: '13px', transition: '0.2s', fontWeight: 'bold' }}>
                                    <input type="radio" name="size" value="Küçük" onChange={(e) => setFormData({...formData, size: e.target.value})} style={{ display: 'none' }} /> Küçük
                                </label>
                                <label style={{ flex: 1, backgroundColor: formData.size === 'Orta' ? '#E8622A' : '#1F1235', border: '1px solid', borderColor: formData.size === 'Orta' ? '#E8622A' : '#4B5563', padding: '12px 5px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', fontSize: '13px', transition: '0.2s', fontWeight: 'bold' }}>
                                    <input type="radio" name="size" value="Orta" onChange={(e) => setFormData({...formData, size: e.target.value})} style={{ display: 'none' }} /> Orta
                                </label>
                                <label style={{ flex: 1, backgroundColor: formData.size === 'Büyük' ? '#E8622A' : '#1F1235', border: '1px solid', borderColor: formData.size === 'Büyük' ? '#E8622A' : '#4B5563', padding: '12px 5px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', fontSize: '13px', transition: '0.2s', fontWeight: 'bold' }}>
                                    <input type="radio" name="size" value="Büyük" onChange={(e) => setFormData({...formData, size: e.target.value})} style={{ display: 'none' }} /> Büyük
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Referans Görsel (Fotoğraf Yükleme) */}
                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#E9D5FF' }}>Referans Görsel Yükle (Tarzını Göster)</label>
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '20px', borderRadius: '12px', border: '2px dashed #E8622A', backgroundColor: '#1F1235', cursor: 'pointer', transition: '0.3s' }}>
                        <span style={{ fontSize: '24px', marginBottom: '10px' }}>📸</span>
                        <span style={{ fontSize: '14px', color: selectedImage ? '#4ade80' : 'white', fontWeight: 'bold' }}>
                            {selectedImage ? 'Görsel Seçildi: ' + selectedImage.name : 'Dosya seçmek için tıklayın'}
                        </span>
                        <input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files[0])} style={{ display: 'none' }} />
                    </label>
                </div>

                <button type="submit" disabled={isSubmitting} style={{ width: '100%', backgroundColor: '#E8622A', color: 'white', fontWeight: '900', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', padding: '20px', border: 'none', borderRadius: '12px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, boxShadow: '0 10px 20px rgba(232, 98, 42, 0.3)' }}>
                    {isSubmitting ? 'Gönderiliyor...' : 'Teklif İste'}
                </button>
            </form>
        </div>
    );
}