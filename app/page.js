"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Star, ArrowRight, CheckCircle2, XCircle, ChevronLeft, ChevronRight, ChevronDown, 
  Phone, Calendar, Clock, Lock, Upload, Briefcase, MessageSquare, Mail, Target, TrendingUp, 
  Users, Crown, Search, Sliders, MessageCircle, Scissors, User, UserCircle, Smartphone, 
  Grid, X, Gem, Check, PieChart, Store, CalendarOff, Music, Ticket, ShieldCheck, HeartHandshake
} from 'lucide-react';

const supabase = {
  from: () => ({
    select: () => ({ eq: async () => ({ data: [] }), then: (cb) => cb({ data: [] }) }),
    insert: async () => ({ error: null })
  }),
  storage: { from: () => ({ upload: async () => ({ error: null }), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) }
};

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

function parseDuration(durationStr) { const match = (durationStr||'').match(/\d+/); return match ? parseInt(match[0]) : 30; }
function getRequiredSlots(durationStr) { return Math.ceil(parseDuration(durationStr) / 30); }

const allTimeSlots = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30","00:00","00:30","01:00","01:30","02:00"];
const defaultWorkingHours = [{ day: 'Pazartesi', open: '09:00', close: '19:00', isClosed: false }, { day: 'Salı', open: '09:00', close: '19:00', isClosed: false }, { day: 'Çarşamba', open: '09:00', close: '19:00', isClosed: false }, { day: 'Perşembe', open: '09:00', close: '19:00', isClosed: false }, { day: 'Cuma', open: '09:00', close: '19:00', isClosed: false }, { day: 'Cumartesi', open: '09:00', close: '19:00', isClosed: false }, { day: 'Pazar', open: '09:00', close: '19:00', isClosed: true }];
const cyprusRegions = ["Girne", "Lefkoşa", "Mağusa", "İskele", "Güzelyurt", "Lefke"];

export default function Home() {
  const router = useRouter(); 
  const [step, setStep] = useState('services'); 
  const [shops, setShops] = useState([]);
  const [lang, setLang] = useState('TR');
  const [showFeaturesMenu, setShowFeaturesMenu] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);
  const approvedShops = shops.filter(shop => shop.status === 'approved');
  const [selectedShop, setSelectedShop] = useState(null);
  const [bookingData, setBookingData] = useState({ date: new Date().toISOString().split('T')[0], time: '', selectedShopService: null, selectedStaff: null, selectedEvent: null });
  const [formData, setFormData] = useState({ name: '', surname: '', phoneCode: '+90', phone: '', email: '' });
  const [bookingPhase, setBookingPhase] = useState(1);
  const [bookingEmailValid, setBookingEmailValid] = useState(null);
  const [bookingPhoneValid, setBookingPhoneValid] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ q1: null, q2: null, q3: null, q4: null });
  const [showRegister, setShowRegister] = useState(false);
  const [loggedInShop, setLoggedInShop] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginType, setLoginType] = useState('owner');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginStaffName, setLoginStaffName] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [filterRegion, setFilterRegion] = useState('All');
  const [filterService, setFilterService] = useState('All');
  const [filterSort, setFilterSort] = useState('High'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [newShop, setNewShop] = useState({ name: '', category: 'Berber', location: 'Girne', address: '', maps_link: '', phoneCode: '+90', contactPhone: '', contactInsta: '', contactEmail: '', username: '', password: '', email: '', description: '', logoFile: null, package: 'Standart Paket' });
  const [isUploading, setIsUploading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [phoneValid, setPhoneValid] = useState(null);
  const [adminEmailValid, setAdminEmailValid] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [globalAppointments, setGlobalAppointments] = useState([]); 
  const [closedSlots, setClosedSlots] = useState([]);
  const [profileTab, setProfileTab] = useState('services'); 
  const [lightboxImg, setLightboxImg] = useState(null);

  const t = {
    TR: {
      nav: { places: "Mekanlar", features: "Özellikler", why: "Neden Bookcy", contact: "İletişim", about: "Hakkımızda", addShop: "İşletme Ekle", login: "Giriş", logout: "Çıkış", dashboard: "Panel" },
      megaMenu: { col1Title: "Kurulum", col2Title: "Müşterileri Etkile", col3Title: "Yönet", col4Title: "Büyü", btn: "Tüm Özellikler" },
      featNames: { profile: "Profil", market: "Pazaryeri", team: "Ekip", booking: "Randevu", app: "Uygulama", marketing: "Pazarlama", calendar: "Takvim", crm: "Müşteri Yönetimi", boost: "Öne Çık", stats: "Raporlar" },
      featDesc: { profile: "Dijital vitrin", market: "Müşteriye ulaşın", team: "Saatleri yönetin", booking: "7/24 randevu", app: "Mobil uygulama", marketing: "Mesaj gönderin", calendar: "Çakışmaları önleyin", crm: "Geçmişi saklayın", boost: "Üst sıralara çıkın", stats: "Kazancınızı görün" },
      featDetails: {
        profile: { purpose: "Dijital vitrininiz.", adv1: { title: "İmaj", desc: "İlk intibayı güçlendirir." }, adv2: { title: "Güven", desc: "Yorumlarla güven kazanın." }, adv3: { title: "Keşfedilebilirlik", desc: "Aramalarda bulunun." } },
        market: { purpose: "Müşteriyi buluşturur.", adv1: { title: "Yeni Müşteriler", desc: "Aktif kullanıcılara ulaşın." }, adv2: { title: "Boşlukları Doldurun", desc: "İptalleri sergileyin." }, adv3: { title: "Rekabet", desc: "Önde yer alın." } },
        team: { purpose: "Personeli koordine edin.", adv1: { title: "Planlama", desc: "Vardiyaları düzenleyin." }, adv2: { title: "Performans", desc: "Gelirleri görün." }, adv3: { title: "Takvimler", desc: "Çakışmaları kaldırın." } },
        booking: { purpose: "7/24 randevu.", adv1: { title: "Zaman Tasarrufu", desc: "İşinize odaklanın." }, adv2: { title: "Sıfır Hata", desc: "Hataları indirin." }, adv3: { title: "Kesintisiz Hizmet", desc: "Sürekli rezervasyon alın." } },
        app: { purpose: "Müşteri ile bağ.", adv1: { title: "Deneyim", desc: "Kullanıcı dostu arayüz." }, adv2: { title: "Takip", desc: "Yaklaşan randevular." }, adv3: { title: "İptal", desc: "İptaller yansısın." } },
        marketing: { purpose: "İletişim asistanı.", adv1: { title: "Kampanyalar", desc: "Özel fırsatlar." }, adv2: { title: "Mesajlar", desc: "Otomatik mesajlar." }, adv3: { title: "Ciro Artışı", desc: "Sıklığı artırın." } },
        calendar: { purpose: "Randevu organizasyonu.", adv1: { title: "Koruması", desc: "İki randevuyu engeller." }, adv2: { title: "Optimizasyon", desc: "Boşlukları analiz eder." }, adv3: { title: "Sürükle", desc: "Anında değiştirin." } },
        crm: { purpose: "Müşteri arşivi.", adv1: { title: "Profil", desc: "Geçmişi görün." }, adv2: { title: "Özel Notlar", desc: "Sisteme kaydedin." }, adv3: { title: "Sadakat", desc: "Bağ oluşturun." } },
        boost: { purpose: "Görünürlük paketi.", adv1: { title: "Zirve", desc: "En üstte yer alın." }, adv2: { title: "Vitrin", desc: "Önerilenlerde gösterilin." }, adv3: { title: "İmaj", desc: "Kalitenizi vurgulayın." } },
        stats: { purpose: "Veri sistemi.", adv1: { title: "Ciro", desc: "Anlık takip." }, adv2: { title: "Analiz", desc: "Strateji belirleyin." }, adv3: { title: "Raporlar", desc: "Performansı görün." } }
      },
      featUI: { purposeTitle: "Ne İşe Yarar?", benefitsTitle: "Avantajları", allFeaturesTitle: "Özellikler", allFeaturesSub: "Her şey burada." },
      home: { eyebrow: "Kıbrıs'ın #1 Platformu", title1: "Kendine", title2: "iyi bak,", title3: "hemen", title4: "randevu al.", subtitle: "Kuaför, berber, spa, masaj ve daha fazlasını saniyeler içinde keşfet.", searchPlace: "Hizmet veya mekan ara...", searchLoc: "Nerede?", searchBtn: "Ara", popTitle: "Popüler:", stats: {s1:"İşletme", s2:"Müşteri", s3:"İşlem", s4:"Memnuniyet"} },
      cats: { catTitle: "Kategoriler", catSub: "Ne yaptırmak istersiniz?", seeAll: "Tümünü Gör →", tattoo: "Dövme", barber: "Berber", hair: "Kuaför", nail: "Tırnak & Güzellik", club: "Bar & Club", spa: "Spa & Masaj", makeup: "Makyaj", skincare: "Cilt Bakımı" },
      homeInfo: { recLabel: "Öne Çıkanlar", recTitle: "Bu Hafta 🔥", howLabel: "Nasıl Çalışır?", howTitle: "4 Adımda Hazır", how1Title: "Keşfet", how1Desc: "Mekanları incele.", how2Title: "Tarih Seç", how2Desc: "Zamanı seç.", how3Title: "Onayla", how3Desc: "Saniyeler içinde onay.", how4Title: "Keyif Çıkar", how4Desc: "Hizmetini al.", ctaLabel: "İşletme Misiniz?", ctaTitle1: "Bookcy ile", ctaTitle2: "Dijitalleş.", ctaSub: "Yeni müşteri kazan." },
      filters: { title: "Sonuçlar", search: "Mekan Ara...", region: "Bölge", service: "Kategori", sortHigh: "En Yüksek", sortLow: "En Düşük", clear: "Temizle", count: "Mekan" },
      reg: { title: "KAYIT", subtitle: "Sadece Sahipler İçin", shopName: "Adı", location: "Bölge", address: "Adres", maps: "Maps Linki", desc: "Hakkımızda", email: "E-Posta", contactPhone: "Telefon", contactInsta: "Instagram", contactEmail: "İletişim Maili", user: "Kullanıcı Adı", pass: "Şifre", pack: "Paket", upload: "Logo", submit: "BAŞVUR", success: "ALINDI!", uploading: "YÜKLENİYOR..." },
      shops: { back: "GERİ DÖN", empty: "Bulunamadı." },
      profile: { tabServices: "Hizmetler", tabEvents: "Etkinlikler", tabGallery: "Galeri", about: "Hakkında", contactTitle: "İLETİŞİM", bookBtn: "SEÇ", noDesc: "Açıklama yok.", noServices: "Liste yok.", noGallery: "Fotoğraf yok.", similarTitle: "BENZER MEKANLAR" },
      book: { change: "Geri", selectService: "Hizmet seçin.", selectEvent: "Etkinlik seçin.", selectLoca: "VIP seçin.", selectStaff: "UZMAN SEÇİN", anyStaff: "Fark Etmez", date: "Tarih", time: "Saat", name: "Adınız", surname: "Soyadınız", phone: "Telefon", email: "E-Posta", submit: "ONAYLA", success: "ONAYLANDI", successSub: "İletildi.", backHome: "ANA SAYFA", total: "Toplam", details: "Detaylar", service: "Hizmet", event: "Etkinlik", staff: "Uzman", dateTime: "Zaman", contactInfo: "İletişim", btnBook: "Randevu Al →", shopClosed: "KAPALIDIR." },
      about: { title: "Dijital Devrim", subtitle: "Büyütün.", missionDesc: "Telefon trafiğinden kurtulun.", bizTitle: "Çözümler", biz1: "7/24 Rezervasyon", biz1Desc: "Sistem randevu alır.", biz2: "Boş Koltuklara Son", biz2Desc: "İptalleri indirin.", biz3: "Sıfır Komisyon", biz3Desc: "Komisyon kesilmez.", biz4: "Lider Olun", biz4Desc: "Öne geçin.", usrTitle: "Neden Biz?", usr1: "Sırada Beklemeye Son", usr1Desc: "Beklemeyin.", usr2: "Şeffaf", usr2Desc: "Ne ödeyeceğinizi bilin.", usr3: "Yorumlar", usr3Desc: "Deneyimleri okuyun.", packTitle: "Paketler", packSub: "Sürpriz yok.", pkg1Name: "Standart Paket", pkg1Price: "60 STG", pkg1Period: "/ Ay", pkg1Feat1: "Sınırsız Randevu", pkg1Feat2: "Sosyal Medya", pkg1Feat3: "Panel", pkg1Feat4: "Personel Yönetimi", pkg1Feat5: "7/24 Destek", pkg2Name: "Premium Paket", pkg2Price: "100 STG", pkg2Period: "/ Ay", pkg2Feat1: "Standart Özellikler", pkg2Feat2: "Vitrini", pkg2Feat3: "Üst Sıra", pkg2Feat4: "VIP Çerçeve", pkg2Feat5: "Sponsorlu Reklam", ctaTitle: "Katlayın", ctaBtn: "EKLEYİN" },
      contact: { title: "BİZE ULAŞIN", sub: "7/24 ulaşabilirsiniz.", whatsapp: "WhatsApp", wpDesc: "Anında yanıt.", insta: "Instagram", instaDesc: "Keşfedin.", email: "E-Posta", emailDesc: "Görüşmeler.", btnWp: "MESAJ AT", btnInsta: "TAKİP ET", btnEmail: "MAİL GÖNDER" },
      footer: { desc: "Tek rezervasyon platformu.", links: "Platform", cities: "Bölgeler", legal: "Sözleşmeler", terms: "Kullanım Şartları", privacy: "Gizlilik", kvkk: "KVKK", cookies: "Çerez Politikası", copy: "Tüm hakları saklıdır. Kıbrıs 🇹🇷" },
      legal: { privacyTitle: "Gizlilik Politikası", kvkkTitle: "KVKK", termsTitle: "Kullanım Şartları", cookiesTitle: "Çerez Politikası", lastUpdated: "Son güncellenme: 10 Nisan 2024" }
    },
    EN: { nav: { places: "Places", features: "Features", why: "Why Bookcy", contact: "Contact", about: "About", addShop: "Add Business", login: "Login", logout: "Logout", dashboard: "Dashboard" }, megaMenu: { col1Title: "Setup", col2Title: "Clients", col3Title: "Manage", col4Title: "Grow", btn: "All Features" }, featNames: {}, featDesc: {}, featDetails: {}, featUI: {}, home: { eyebrow: "Cyprus's #1", title1: "Take care", title2: "of yourself", title3: "book", title4: "now.", subtitle: "Find salons easily.", searchPlace: "Search...", searchLoc: "Where?", searchBtn: "Search", popTitle: "Popular:", stats: {s1:"Places", s2:"Clients", s3:"Bookings", s4:"Satisfaction"} }, cats: {}, homeInfo: {}, filters: {title:"Results", count:"Found"}, reg: {}, shops: {}, profile: {}, book: {}, contact: {}, about: {}, footer: {}, legal: {} },
    RU: { nav: { places: "Места", features: "Функции", why: "Почему Bookcy", contact: "Контакты", about: "О нас", addShop: "Добавить", login: "Вход", logout: "Выйти", dashboard: "Панель" }, megaMenu: { col1Title: "Настройка", col2Title: "Клиенты", col3Title: "Бизнес", col4Title: "Развитие", btn: "Узнать все функции" }, featNames: {}, featDesc: {}, featDetails: {}, featUI: {}, home: { eyebrow: "Платформа #1", title1: "Позаботьтесь", title2: "о себе,", title3: "забронируйте", title4: "сейчас.", subtitle: "Бронируйте в один клик.", searchPlace: "Поиск...", searchLoc: "Где?", searchBtn: "ПОИСК", popTitle: "Популярные:", stats: {s1:"Места", s2:"Клиенты", s3:"Записи", s4:"Оценка"} }, cats: {}, homeInfo: {}, filters: {title:"Результаты", count:"Найдено"}, reg: {}, shops: {}, profile: {}, book: {}, contact: {}, about: {}, footer: {}, legal: {} }
  };

  const handleBookingEmailChange = (e) => { const val = e.target.value; setFormData(prev => ({...prev, email: val})); setBookingEmailValid(val === '' ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)); };
  const handleBookingPhoneChange = (e) => { const val = e.target.value; setFormData(prev => ({...prev, phone: val})); setBookingPhoneValid(val === '' ? null : val.replace(/\s/g, '').length >= 7); };
  const handleEmailChange = (e) => { const val = e.target.value; setNewShop(prev => ({...prev, email: val})); setEmailValid(val === '' ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)); };
  const handleAdminEmailChange = (e) => { const val = e.target.value; setNewShop(prev => ({...prev, contactEmail: val})); setAdminEmailValid(val === '' ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)); };
  const handlePhoneChange = (e) => { const val = e.target.value; setNewShop(prev => ({...prev, contactPhone: val})); setPhoneValid(val === '' ? null : val.replace(/\s/g, '').length >= 7); };

  const featureIcons = { profile: <Briefcase size={40}/>, market: <Store size={40}/>, team: <Users size={40}/>, booking: <Target size={40}/>, app: <Smartphone size={40}/>, marketing: <Target size={40}/>, calendar: <Calendar size={40}/>, crm: <User size={40}/>, boost: <TrendingUp size={40}/>, stats: <PieChart size={40}/> };
  const featureIconsSmall = { profile: <Briefcase size={20}/>, market: <Store size={20}/>, team: <Users size={20}/>, booking: <Target size={20}/>, app: <Smartphone size={20}/>, marketing: <Target size={20}/>, calendar: <Calendar size={20}/>, crm: <User size={20}/>, boost: <TrendingUp size={20}/>, stats: <PieChart size={20}/> };
  const packages = [ { name: "Standart Paket", price: `60 STG / Aylık` }, { name: "Premium Paket", price: `100 STG / Aylık` } ];
  
  const categories = [ 
    { key: "barber", dbName: "Berber", bg: "linear-gradient(135deg,#f8fafc,#e2e8f0)", emoji: "💈" }, { key: "hair", dbName: "Kuaför", bg: "linear-gradient(135deg,#fdf4ff,#fce7f3)", emoji: "✂️" }, 
    { key: "nail", dbName: "Tırnak & Güzellik", bg: "linear-gradient(135deg,#fff1f2,#fbcfe8)", emoji: "💅" }, { key: "tattoo", dbName: "Dövme", bg: "linear-gradient(135deg,#f1f5f9,#cbd5e1)", emoji: "🖋️" }, 
    { key: "spa", dbName: "Spa & Masaj", bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)", emoji: "💆" }, { key: "skincare", dbName: "Cilt Bakımı", bg: "linear-gradient(135deg,#eff6ff,#dbeafe)", emoji: "🧴" }, 
    { key: "makeup", dbName: "Makyaj", bg: "linear-gradient(135deg,#fff7ed,#ffedd5)", emoji: "💄" }, { key: "club", dbName: "Bar & Club", bg: "linear-gradient(135deg,#f3f4f6,#e5e7eb)", emoji: "🍸" } 
  ];

  async function fetchGlobalAppointments() { const { data } = await supabase.from('appointments').select('customer_phone'); if (data) setGlobalAppointments(data); }
  async function fetchShops() { const { data } = await supabase.from('shops').select('*'); if (data) setShops(data); }
  async function fetchAppointments(shopId, date = null) { let query = supabase.from('appointments').select('*').eq('shop_id', shopId); if (date) query = query.eq('appointment_date', date); const { data } = await query; if (data) setAppointments(data); }
  async function fetchClosedSlots(shopId, date = null) { let query = supabase.from('closed_slots').select('*').eq('shop_id', shopId); if (date) query = query.eq('date', date); const { data } = await query; if (data) setClosedSlots(data.map(item => item.slot)); }

  useEffect(() => { 
    fetchShops(); fetchGlobalAppointments(); 
    const session = localStorage.getItem('bookcy_biz_session'); if(session) setLoggedInShop(JSON.parse(session));
  }, []);
  
  useEffect(() => { 
    if (selectedShop && bookingData.date) { fetchAppointments(selectedShop.id, bookingData.date); fetchClosedSlots(selectedShop.id, bookingData.date); } 
  }, [selectedShop, bookingData.date]);

  const isClub = selectedShop?.category === 'Bar & Club';

  const handleLogin = async (e) => {
    e.preventDefault(); setIsLoginLoading(true);
    const inputUser = loginUsername.trim().toLowerCase(); const inputPass = loginPassword.trim();
    const shop = shops.find(s => s.admin_username?.toLowerCase() === inputUser);
    if (!shop) { alert("Hatalı İşletme Kullanıcı Adı!"); setIsLoginLoading(false); return; }
    if (shop.status !== 'approved' && shop.status) { alert("Hesabınız henüz onaylanmamış! Lütfen dekontunuzu iletip onay bekleyiniz."); setIsLoginLoading(false); return; }
    
    if (loginType === 'owner') {
      if (shop.admin_password !== inputPass) { alert("Hatalı Şifre!"); setIsLoginLoading(false); return; }
      localStorage.setItem('bookcy_biz_session', JSON.stringify({ role: 'owner', shopData: shop })); setShowLogin(false); setIsLoginLoading(false); router.push('/dashboard');
    } else {
      const staffList = shop.staff || [];
      const validStaff = staffList.find(s => s.name.toLowerCase() === loginStaffName.trim().toLowerCase() && s.password === inputPass);
      if (!validStaff) { alert("Hatalı Personel Adı veya Şifre!"); setIsLoginLoading(false); return; }
      localStorage.setItem('bookcy_biz_session', JSON.stringify({ role: 'staff', staffName: validStaff.name, shopData: shop })); setShowLogin(false); setIsLoginLoading(false); router.push('/dashboard');
    }
  };

  const handleLogout = () => { localStorage.removeItem('bookcy_biz_session'); setLoggedInShop(null); };
  const handleHeroSearch = (e) => { e.preventDefault(); setStep('all_shops'); window.scrollTo(0,0); };
  const goToFeature = (featureKey) => { setActiveFeature(featureKey); setStep('feature_detail'); setShowFeaturesMenu(false); window.scrollTo(0,0); };

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    if (emailValid === false || phoneValid === false || adminEmailValid === false) return alert("İletişim bilgilerini kontrol edin.");
    setIsUploading(true); let uploadedLogoUrl = null;
    const fullPhone = newShop.phoneCode + " " + newShop.contactPhone;
    const { error } = await supabase.from('shops').insert([{ name: newShop.name, category: newShop.category, location: newShop.location, address: newShop.address, maps_link: newShop.maps_link, admin_email: newShop.email, admin_username: newShop.username, admin_password: newShop.password, description: newShop.description, logo_url: uploadedLogoUrl, package: newShop.package, status: 'pending', contact_phone: fullPhone, contact_insta: newShop.contactInsta, contact_email: newShop.contactEmail, services: [], staff: [], gallery: [], closed_dates: [], events: [] }]);
    setIsUploading(false);
    if (!error) { setRegisterSuccess(true); } else { alert("Hata oluştu."); }
  }

  async function handleBooking(e) {
    e.preventDefault();
    if (bookingEmailValid === false || bookingPhoneValid === false) return alert("Bilgileri kontrol edin.");
    if(isClub) { if(!bookingData.selectedEvent || !bookingData.selectedShopService) return; } 
    else { if(!bookingData.selectedShopService || !bookingData.selectedStaff) return; }

    const availableSlotsForBooking = getCurrentAvailableSlots();
    const startIndex = availableSlotsForBooking.indexOf(bookingData.time);
    const neededSlots = getRequiredSlots(bookingData.selectedShopService.duration);
    const occupied_slots = isClub ? [] : availableSlotsForBooking.slice(startIndex, startIndex + neededSlots);
    let assignedStaffName = isClub ? 'Rezervasyon' : bookingData.selectedStaff.name;
    const fullPhone = formData.phoneCode + " " + formData.phone;
    const finalDate = isClub ? bookingData.selectedEvent.date : bookingData.date;
    const finalTime = isClub ? bookingData.selectedEvent.time : bookingData.time;

    const { error } = await supabase.from('appointments').insert([{ shop_id: selectedShop.id, customer_name: formData.name, customer_surname: formData.surname, customer_phone: fullPhone, customer_email: formData.email, appointment_date: finalDate, appointment_time: finalTime, service_name: bookingData.selectedShopService.name, staff_name: assignedStaffName, occupied_slots: occupied_slots, status: 'Bekliyor' }]);
    if (!error) { setStep('success'); window.scrollTo(0,0); } else { alert("Hata oluştu!"); }
  }

  async function submitFeedback(e) {
    e.preventDefault();
    if(feedbackData.q1===null || feedbackData.q2===null || feedbackData.q3===null || feedbackData.q4===null) return alert("Lütfen puanlayın.");
    setFeedbackSubmitted(true);
    const avg = Number(((feedbackData.q1 + feedbackData.q2 + feedbackData.q3 + feedbackData.q4) / 4).toFixed(1));
    await supabase.from('platform_feedback').insert([{ q1: feedbackData.q1, q2: feedbackData.q2, q3: feedbackData.q3, q4: feedbackData.q4, average_score: avg }]);
  }

  const isSearching = searchQuery.trim().length > 0 || filterRegion !== 'All';
  const displayShops = approvedShops.filter(shop => {
      const matchRegion = filterRegion === 'All' || (shop.location && shop.location.toLowerCase().includes(filterRegion.toLowerCase()));
      const matchService = filterService === 'All' || shop.category === filterService;
      const matchSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRegion && matchService && matchSearch;
  });

  const sortedShops = [...displayShops].sort((a, b) => {
      if (filterSort === 'High') {
        if ((a.package === 'Premium' || a.package === 'Premium Paket') && (b.package !== 'Premium' && b.package !== 'Premium Paket')) return -1;
        if ((a.package !== 'Premium' && a.package !== 'Premium Paket') && (b.package === 'Premium' || b.package === 'Premium Paket')) return 1;
        return 0;
      }
      return 0;
  });
  
  const recommendedShops = approvedShops.filter(s => s.package === 'Premium Paket' || s.package === 'Premium').slice(0, 4);

  const getDayNameFromDate = (dateString) => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return days[new Date(dateString).getDay()];
  };

  const getCurrentAvailableSlots = () => {
    if (!selectedShop || !bookingData.date || isClub) return allTimeSlots;
    if (selectedShop.closed_dates?.includes(bookingData.date)) return [];
    const dayName = getDayNameFromDate(bookingData.date);
    const workingHours = Array.isArray(selectedShop.working_hours) ? selectedShop.working_hours : defaultWorkingHours;
    const todayHours = workingHours.find(h => h.day === dayName);
    if (todayHours?.isClosed) return [];
    if (todayHours) return allTimeSlots.filter(slot => slot >= todayHours.open && slot < todayHours.close);
    return allTimeSlots;
  };

  const currentAvailableSlots = getCurrentAvailableSlots();
  const isShopClosedToday = currentAvailableSlots.length === 0;
  const similarShops = selectedShop ? approvedShops.filter(s => s.id !== selectedShop.id && s.category === selectedShop.category).slice(0, 3) : [];

  const renderFeedbackScale = (qKey) => (
    <div className="flex gap-1 justify-center mt-3 mb-6 w-full custom-scrollbar pb-2">
      {[0,1,2,3,4,5,6,7,8,9,10].map(num => (
        <button key={num} type="button" onClick={() => setFeedbackData({...feedbackData, [qKey]: num})} className={`w-8 h-8 rounded-lg text-xs font-black transition-all border shrink-0 ${feedbackData[qKey] === num ? 'bg-[#E8622A] text-white border-transparent scale-110 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-[#E8622A]'}`}>{num}</button>
      ))}
    </div>
  );

  return (
    <>
      <nav>
        <div className="nav-logo" onClick={() => {setStep('services'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}}>
          <svg className="nav-logo-icon" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="#2D1B4E"/>
            <circle cx="18" cy="10" r="4.5" fill="#F5C5A3"/>
            <rect x="10" y="15.5" width="4" height="15" rx="2" fill="#F5C5A3"/>
            <path d="M14 15.5 Q23 15.5 23 20 Q23 24.5 14 24.5" stroke="#F5C5A3" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <path d="M14 24.5 Q25 24.5 25 29 Q25 33.5 14 33.5" stroke="#E8622A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <circle cx="28" cy="8" r="4.5" fill="#E8622A"/>
          </svg>
          <span className="nav-logo-text">bookcy<span>.</span></span>
        </div>

        <ul className="nav-links">
          <li><button onClick={() => {setStep('all_shops'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={['all_shops', 'shops', 'shop_profile', 'booking'].includes(step) ? 'active' : ''}>{t[lang].nav.places}</button></li>
          <li><button onClick={() => {setStep('all_features'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={step === 'all_features' ? 'active' : ''}>{t[lang].nav.features}</button></li>
          <li><button onClick={() => {setStep('why_bookcy'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={step === 'why_bookcy' ? 'active' : ''}>{t[lang].nav.why}</button></li>
          <li><button onClick={() => {setStep('about'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={step === 'about' ? 'active' : ''}>{t[lang].nav.about}</button></li>
          <li><button onClick={() => {setStep('contact'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={step === 'contact' ? 'active' : ''}>{t[lang].nav.contact}</button></li>
        </ul>

        <div className="nav-right">
          <div className="lang-pills hidden md:flex">
            <div onClick={()=>setLang('TR')} className={`lang-pill ${lang==='TR' ? 'active' : ''}`}>TR</div>
            <div onClick={()=>setLang('EN')} className={`lang-pill ${lang==='EN' ? 'active' : ''}`}>EN</div>
            <div onClick={()=>setLang('RU')} className={`lang-pill ${lang==='RU' ? 'active' : ''}`}>RU</div>
          </div>
          {loggedInShop ? (
               <div className="flex gap-2 items-center">
                   <button onClick={handleLogout} className="btn-outline">{t[lang].nav.logout}</button>
                   <button onClick={() => router.push('/dashboard')} className="btn-primary"><UserCircle size={18}/> <span>{t[lang].nav.dashboard}</span></button>
               </div>
          ) : (
              <>
                  <button onClick={() => setShowRegister(true)} className="btn-outline">{t[lang].nav.addShop}</button>
                  <button onClick={() => setShowLogin(true)} className="btn-primary"><UserCircle size={18}/><span>{t[lang].nav.login}</span></button>
              </>
          )}
        </div>
      </nav>

      {showRegister && (
          <div className="fixed inset-0 w-screen h-screen bg-[#2D1B4E]/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto pt-20">
            <div className="bg-white border border-slate-200 w-full max-w-[800px] rounded-[32px] p-8 relative shadow-2xl my-auto">
              <button onClick={() => {setShowRegister(false); setRegisterSuccess(false);}} className="absolute top-6 right-6 text-slate-400 hover:text-[#2D1B4E] bg-transparent border-none cursor-pointer"><X size={24}/></button>
              {registerSuccess ? (
                  <div className="text-center py-10">
                      <CheckCircle2 size={64} className="mx-auto text-[#00c48c] mb-6" />
                      <h2 className="text-2xl font-black text-[#E8622A] uppercase italic mb-4">{t[lang].reg.success}</h2>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 inline-block text-left mt-4 text-[#2D1B4E] w-full max-w-sm">
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Banka Bilgileri / Bank Details:</p>
                          <p className="font-bold text-sm">Banka: <span className="font-normal">İş Bankası</span></p>
                          <p className="font-bold text-sm">Alıcı: <span className="font-normal">BOOKCY LTD.</span></p>
                          <p className="font-bold text-sm">IBAN: <span className="text-[#E8622A]">TR99 0006 4000 0012 3456 7890 12</span></p>
                          <a href="https://wa.me/905555555555" target="_blank" rel="noreferrer" className="w-full bg-[#25D366] text-white font-black py-4 rounded-xl uppercase tracking-widest hover:bg-green-600 transition-colors mt-6 flex justify-center items-center gap-2 text-decoration-none text-xs border-none cursor-pointer"><MessageCircle size={18}/> DEKONTU İLET</a>
                      </div>
                  </div>
              ) : (
                  <>
                      <div className="flex flex-col mb-8 text-center">
                          <h2 className="text-2xl font-black uppercase tracking-tight italic text-[#2D1B4E]">{t[lang].reg.title}</h2>
                          <p className="text-[10px] text-[#E8622A] font-bold uppercase tracking-[0.2em] mt-2 flex items-center justify-center gap-2"><Lock size={12}/> {t[lang].reg.subtitle}</p>
                      </div>
                      <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input required placeholder={t[lang].reg.shopName} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.name} onChange={e => setNewShop({...newShop, name: e.target.value})} />
                              <select className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-[#2D1B4E] outline-none" value={newShop.category} onChange={e => setNewShop({...newShop, category: e.target.value})}>
                                  {categories.map(c => <option key={c.dbName} value={c.dbName}>{t[lang].cats[c.key]}</option>)}
                              </select>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <select required className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-[#2D1B4E] outline-none" value={newShop.location} onChange={e => setNewShop({...newShop, location: e.target.value})}>
                                  {cyprusRegions.map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                              <input required placeholder={t[lang].reg.address} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.address} onChange={e => setNewShop({...newShop, address: e.target.value})} />
                          </div>
                          <input type="url" placeholder={t[lang].reg.maps} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.maps_link} onChange={e => setNewShop({...newShop, maps_link: e.target.value})} />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                              <div className="flex gap-2 w-full relative">
                                <select className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-2 outline-none font-bold text-xs text-[#2D1B4E] w-20" value={newShop.phoneCode} onChange={e => setNewShop({...newShop, phoneCode: e.target.value})}><option value="+90">TR</option></select>
                                <input required type="tel" placeholder={t[lang].reg.contactPhone} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none font-bold text-xs text-[#2D1B4E]" value={newShop.contactPhone} onChange={handlePhoneChange} />
                              </div>
                              <input placeholder={t[lang].reg.contactInsta} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.contactInsta} onChange={e => setNewShop({...newShop, contactInsta: e.target.value})} />
                              <input type="email" placeholder={t[lang].reg.contactEmail} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.contactEmail} onChange={handleAdminEmailChange} />
                          </div>
                          <input required type="email" placeholder={t[lang].reg.email} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E] mt-2" value={newShop.email} onChange={handleEmailChange} />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {packages.map(p => (
                                  <div key={p.name} onClick={() => setNewShop({...newShop, package: p.name})} className={`cursor-pointer p-4 rounded-xl border ${newShop.package === p.name ? 'bg-orange-50 border-[#E8622A]' : 'bg-white border-slate-200'}`}>
                                      <h4 className={`text-sm font-black uppercase ${newShop.package === p.name ? 'text-[#E8622A]' : 'text-[#2D1B4E]'}`}>{p.name}</h4>
                                      <p className="text-xs font-bold text-slate-500">{p.price}</p>
                                  </div>
                              ))}
                          </div>
                          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                              <input required placeholder={t[lang].reg.user} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.username} onChange={e => setNewShop({...newShop, username: e.target.value})} />
                              <input required placeholder={t[lang].reg.pass} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.password} onChange={e => setNewShop({...newShop, password: e.target.value})} />
                          </div>
                          <button type="submit" disabled={isUploading || emailValid === false || phoneValid === false || adminEmailValid === false} className="w-full btn-primary justify-center py-4 rounded-xl mt-2 shadow-lg border-none cursor-pointer">
                            {isUploading ? t[lang].reg.uploading : t[lang].reg.submit}
                          </button>
                      </form>
                  </>
              )}
            </div>
          </div>
      )}

      {showLogin && (
        <div className="fixed inset-0 bg-[#2D1B4E]/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[400px] rounded-[32px] p-8 relative shadow-2xl border border-slate-200">
            <button onClick={() => setShowLogin(false)} className="absolute top-6 right-6 text-slate-400 bg-transparent border-none cursor-pointer"><X size={24}/></button>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-black text-[#2D1B4E] uppercase mb-2">GİRİŞ YAP</h1>
              <p className="text-slate-400 font-bold text-xs uppercase">İŞ ORTAĞI PANELİ</p>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-xl mb-6">
              <button onClick={() => setLoginType('owner')} className={`flex-1 py-3 text-xs font-black rounded-lg border-none cursor-pointer ${loginType === 'owner' ? 'bg-white text-[#E8622A] shadow-sm' : 'bg-transparent text-slate-400'}`}>YÖNETİCİ</button>
              <button onClick={() => setLoginType('staff')} className={`flex-1 py-3 text-xs font-black rounded-lg border-none cursor-pointer ${loginType === 'staff' ? 'bg-white text-[#E8622A] shadow-sm' : 'bg-transparent text-slate-400'}`}>PERSONEL</button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" required placeholder="Kullanıcı Adı" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none text-[#2D1B4E]" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
              {loginType === 'staff' && <input type="text" required placeholder="Personel Adı" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none text-[#2D1B4E]" value={loginStaffName} onChange={(e) => setLoginStaffName(e.target.value)} />}
              <input type="password" required placeholder="Şifre" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none text-[#2D1B4E]" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              <button type="submit" disabled={isLoginLoading} className="w-full btn-primary py-4 rounded-xl font-black uppercase tracking-widest text-xs flex justify-center items-center gap-2 mt-4 border-none cursor-pointer">{isLoginLoading ? 'Bekleyin...' : 'PANELE GİT'}</button>
            </form>
          </div>
        </div>
      )}

      <main className="flex-1 w-full relative z-10 min-h-[80vh] mt-[72px]">
        
        {/* ANA SAYFA */}
        {step === 'services' && (
            <div className="w-full">
                <section className="hero">
                  <div className="hero-content">
                    <div className="hero-eyebrow"><div className="hero-eyebrow-dot"></div>{t[lang].home.eyebrow}</div>
                    <h1 className="hero-title">{t[lang].home.title1} <span className="accent">{t[lang].home.title2}</span><br/>{t[lang].home.title3} <span className="accent">{t[lang].home.title4}</span></h1>
                    <p className="hero-sub">{t[lang].home.subtitle}</p>
                    <form className="search-wrap" onSubmit={handleHeroSearch}>
                      <div className="search-field"><Search className="search-icon" size={20}/><input type="text" placeholder={t[lang].home.searchPlace} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/></div>
                      <div className="search-location"><MapPin size={20} className="text-slate-400"/><select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}><option value="All">{t[lang].home.searchLoc}</option>{cyprusRegions.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                      <button type="submit" className="search-btn">{t[lang].home.searchBtn}</button>
                    </form>
                    <div className="hero-popular">
                      <span>{t[lang].home.popTitle}</span>
                      <div className="pop-tag" onClick={()=>{setFilterService('Berber'); setStep('all_shops');}}>💈 {t[lang].cats.barber}</div>
                      <div className="pop-tag" onClick={()=>{setFilterService('Tırnak & Güzellik'); setStep('all_shops');}}>💅 {t[lang].cats.nail}</div>
                      <div className="pop-tag" onClick={()=>{setFilterService('Spa & Masaj'); setStep('all_shops');}}>💆 {t[lang].cats.spa}</div>
                      <div className="pop-tag" onClick={()=>{setFilterService('Bar & Club'); setStep('all_shops');}}>🍸 {t[lang].cats.club}</div>
                    </div>
                  </div>
                  <div className="hero-stats">
                      <div className="stat"><div className="stat-num">{approvedShops.length}</div><div className="stat-label">{t[lang].home.stats.s1}</div></div>
                      <div className="stat"><div className="stat-num">{new Set(globalAppointments.map(a => a.customer_phone)).size}</div><div className="stat-label">{t[lang].home.stats.s2}</div></div>
                      <div className="stat"><div className="stat-num">{globalAppointments.length}</div><div className="stat-label">{t[lang].home.stats.s3}</div></div>
                      <div className="stat"><div className="stat-num">%98</div><div className="stat-label">{t[lang].home.stats.s4}</div></div>
                  </div>
                </section>

                <section className="section-categories">
                  <div className="section-header">
                    <div><div className="section-label-sm">{t[lang].cats.catTitle}</div><div className="section-title">{t[lang].cats.catSub}</div></div>
                    <button className="see-all" onClick={()=>{setFilterService('All'); setStep('all_shops'); window.scrollTo(0,0);}}>{t[lang].cats.seeAll}</button>
                  </div>
                  <div className="categories-grid">
                    {categories.map((c, i) => (
                        <div key={c.key} onClick={() => { setFilterService(c.dbName); setStep('all_shops'); window.scrollTo(0,0); }} className="cat-card">
                          <div className="cat-img-wrap"><div className="cat-emoji-bg" style={{background: c.bg}}>{c.emoji}</div></div>
                          <div className="cat-name">{t[lang].cats[c.key]}</div>
                        </div>
                    ))}
                  </div>
                </section>

               {recommendedShops.length > 0 && (
                  <section className="section-featured bg-[#FAF7F2] py-20 px-12 border-t border-slate-200">
                    <div className="section-header">
                      <div><div className="section-label-sm">{t[lang].homeInfo.recLabel}</div><div className="section-title text-4xl font-black text-[#2D1B4E]">{t[lang].homeInfo.recTitle}</div></div>
                      <button className="see-all text-[#E8622A] font-bold bg-transparent border-none cursor-pointer" onClick={()=>{setFilterSort('High'); setStep('all_shops'); window.scrollTo(0,0);}}>{t[lang].cats.seeAll}</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                      {recommendedShops.map((shop, idx) => (
                          <div key={shop.id} onClick={() => { setSelectedShop(shop); setStep('shop_profile'); setProfileTab(shop.category === 'Bar & Club' ? 'events' : 'services'); setBookingPhase(1); window.scrollTo(0,0); }} className={`venue-card flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer ${idx === 0 ? 'md:row-span-2' : ''}`}>
                            <div className={`w-full bg-slate-100 flex items-center justify-center text-6xl relative ${idx === 0 ? 'h-[300px]' : 'h-[200px]'}`}>
                              {shop.cover_url || shop.logo_url ? <img loading="lazy" decoding="async" src={shop.cover_url || shop.logo_url} className="w-full h-full object-cover"/> : categories.find(c=>c.dbName===shop.category)?.emoji}
                              {idx === 0 && <div className="absolute top-4 left-4 bg-gradient-to-r from-[#E8622A] to-orange-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full">🔥 VIP</div>}
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                              <div className="text-[10px] font-black text-[#E8622A] tracking-widest uppercase mb-2">{t[lang].cats[categories.find(c => c.dbName === shop.category)?.key || 'barber']}</div>
                              <div className="text-xl font-black text-[#2D1B4E] mb-3">{shop.name}</div>
                              <div className="text-sm font-bold text-slate-500 mb-6">📍 {shop.location}</div>
                              <button className="mt-auto w-full bg-[#2D1B4E] text-white font-black py-3 rounded-xl uppercase text-xs hover:bg-[#E8622A] transition-colors border-none cursor-pointer">{t[lang].book.btnBook}</button>
                            </div>
                          </div>
                      ))}
                    </div>
                  </section>
               )}

              <section className="bg-white py-24 px-12 border-t border-slate-200">
                <div className="max-w-6xl mx-auto text-center">
                  <div className="text-[#E8622A] font-black text-sm tracking-widest uppercase mb-4">{t[lang].homeInfo.howLabel}</div>
                  <div className="text-4xl md:text-5xl font-black text-[#2D1B4E] mb-16">{t[lang].homeInfo.howTitle}</div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-slate-100 z-0"></div>
                    <div className="relative z-10 flex flex-col items-center"><div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm relative">🔍<div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white">1</div></div><div className="text-lg font-black text-[#2D1B4E] mb-2">{t[lang].homeInfo.how1Title}</div><div className="text-sm text-slate-500 font-medium">{t[lang].homeInfo.how1Desc}</div></div>
                    <div className="relative z-10 flex flex-col items-center"><div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm relative">📅<div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white">2</div></div><div className="text-lg font-black text-[#2D1B4E] mb-2">{t[lang].homeInfo.how2Title}</div><div className="text-sm text-slate-500 font-medium">{t[lang].homeInfo.how2Desc}</div></div>
                    <div className="relative z-10 flex flex-col items-center"><div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm relative">✅<div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white">3</div></div><div className="text-lg font-black text-[#2D1B4E] mb-2">{t[lang].homeInfo.how3Title}</div><div className="text-sm text-slate-500 font-medium">{t[lang].homeInfo.how3Desc}</div></div>
                    <div className="relative z-10 flex flex-col items-center"><div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm relative">✨<div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white">4</div></div><div className="text-lg font-black text-[#2D1B4E] mb-2">{t[lang].homeInfo.how4Title}</div><div className="text-sm text-slate-500 font-medium">{t[lang].homeInfo.how4Desc}</div></div>
                  </div>
                </div>
              </section>
            </div>
        )}

        {/* NEDEN BOOKCY SAYFASI */}
        {step === 'why_bookcy' && (
            <div className="w-full bg-[#FAF7F2] pb-24">
                <div className="bg-[#2D1B4E] pt-24 pb-24 px-4 text-center border-b border-slate-800">
                    <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">Farkı Keşfedin</span>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6">Neden <span className="text-[#E8622A]">Bookcy</span> Kullanıyorlar?</h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">Kişisel bakım yolculuğunuzun en güvenilir ortağıyız.</p>
                </div>
                <div className="max-w-6xl mx-auto px-4 -mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200"><div className="w-16 h-16 bg-orange-50 text-[#E8622A] rounded-2xl flex items-center justify-center mb-6"><Crown size={32}/></div><h3 className="font-black text-xl text-[#2D1B4E] mb-3">Öncü Platform</h3><p className="text-slate-500 font-medium">Kıbrıs’ta ilk ve öncü randevu platformlarından biri olarak, sektöre yön veriyoruz.</p></div>
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200"><div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6"><Grid size={32}/></div><h3 className="font-black text-xl text-[#2D1B4E] mb-3">Entegre Sistem</h3><p className="text-slate-500 font-medium">Farklı sektörleri tek çatı altında toplayarak kapsamlı deneyim sunuyoruz.</p></div>
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200"><div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6"><Users size={32}/></div><h3 className="font-black text-xl text-[#2D1B4E] mb-3">Gerçek Müşteri</h3><p className="text-slate-500 font-medium">İşletmelere gerçek müşteri kazandıran aktif bir trafik sağlıyoruz.</p></div>
                    </div>
                </div>
            </div>
        )}

        {/* TÜM MEKANLAR */}
        {step === 'all_shops' && (
            <div className="w-full max-w-[1400px] mx-auto pt-10 px-4 md:px-8 pb-20">
                <button onClick={() => {setStep('services'); window.scrollTo(0,0);}} className="flex items-center text-slate-400 hover:text-[#E8622A] mb-8 text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none cursor-pointer"><ChevronLeft size={16} className="mr-2"/> {t[lang].shops.back}</button>
                <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                    <h2 className="text-3xl font-black uppercase text-[#2D1B4E]">{t[lang].filters.title}</h2>
                    <span className="text-sm font-bold text-slate-500">{sortedShops.length} {t[lang].filters.count}</span>
                </div>
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <aside className="w-full lg:w-[320px] bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
                        <input type="text" placeholder={t[lang].filters.search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold text-xs outline-none" />
                        <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold text-xs outline-none"><option value="All">Tüm Bölgeler</option>{cyprusRegions.map(r => <option key={r} value={r}>{r}</option>)}</select>
                        <select value={filterService} onChange={(e) => setFilterService(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold text-xs outline-none"><option value="All">Tüm Kategoriler</option>{categories.map(c => <option key={c.dbName} value={c.dbName}>{c.dbName}</option>)}</select>
                    </aside>
                    <div className="flex-1 w-full flex flex-col gap-5">
                        {sortedShops.map((shop) => (
                            <div key={shop.id} onClick={() => { setSelectedShop(shop); setStep('shop_profile'); setProfileTab(shop.category === 'Bar & Club' ? 'events' : 'services'); setBookingPhase(1); window.scrollTo(0,0); }} className="flex flex-col md:flex-row items-center p-5 bg-white border border-slate-200 hover:border-[#E8622A] rounded-[24px] cursor-pointer transition-colors">
                                <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-xs font-black text-[#E8622A]">{shop.logo_url ? <img loading="lazy" decoding="async" src={shop.logo_url} className="w-full h-full object-cover" /> : "LOGO"}</div>
                                <div className="flex-1 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                                    <h3 className="text-xl font-black uppercase text-[#2D1B4E]">{shop.name}</h3>
                                    <div className="flex justify-center md:justify-start gap-3 mt-2 text-slate-500 text-[10px] font-bold uppercase"><span className="bg-slate-100 px-2 py-1 rounded-md">{shop.category}</span><span>📍 {shop.location}</span></div>
                                </div>
                                <button className="mt-4 md:mt-0 btn-primary border-none cursor-pointer">SEÇ</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* PROFİL SAYFASI */}
        {step === 'shop_profile' && selectedShop && (
            <div className="w-full max-w-6xl mx-auto pt-10 px-4 pb-20">
                <button onClick={() => {setStep('all_shops'); window.scrollTo(0,0);}} className="flex items-center text-slate-400 hover:text-[#E8622A] mb-6 text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none cursor-pointer"><ChevronLeft size={16} className="mr-2"/> {t[lang].shops.back}</button>
                <div className="w-full h-[250px] rounded-[32px] overflow-hidden relative mb-16 border border-slate-200 bg-slate-50">
                    {selectedShop.cover_url && <img loading="lazy" decoding="async" src={selectedShop.cover_url} className="w-full h-full object-cover" />}
                    <div className="absolute -bottom-10 left-8 w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-[#E8622A] font-black">{selectedShop.logo_url ? <img src={selectedShop.logo_url} className="w-full h-full object-cover" /> : "LOGO"}</div>
                </div>
                <div className="mb-8 border-b border-slate-200 pb-8">
                    <h1 className="text-3xl font-black uppercase text-[#2D1B4E]">{selectedShop.name}</h1>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mt-2"><span className="text-[#E8622A]">{selectedShop.category}</span><span>📍 {selectedShop.address || selectedShop.location}</span></div>
                </div>
                <div className="flex gap-8 border-b border-slate-200 mb-8 overflow-x-auto custom-scrollbar">
                    <button onClick={() => setProfileTab(selectedShop.category === 'Bar & Club' ? 'events' : 'services')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap bg-transparent border-none cursor-pointer border-b-4 ${(profileTab === 'services' || profileTab === 'events') ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>{selectedShop.category === 'Bar & Club' ? t[lang].profile.tabEvents : t[lang].profile.tabServices}</button>
                    <button onClick={() => setProfileTab('gallery')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap bg-transparent border-none cursor-pointer border-b-4 ${profileTab === 'gallery' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>{t[lang].profile.tabGallery}</button>
                    <button onClick={() => setProfileTab('about')} className={`pb-4 text-sm font-black uppercase whitespace-nowrap bg-transparent border-none cursor-pointer border-b-4 ${profileTab === 'about' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>{t[lang].profile.about}</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7">
                        {(profileTab === 'events' || profileTab === 'services') && selectedShop.category === 'Bar & Club' && (
                            <div className="flex flex-col gap-4">
                                {bookingPhase === 1 ? (
                                    selectedShop.events?.map(ev => (
                                        <div key={ev.id} onClick={() => { setBookingData({...bookingData, selectedEvent: ev, date: ev.date, time: ev.time}); setBookingPhase(2); }} className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-[24px] border-2 border-slate-100 hover:border-[#E8622A] cursor-pointer">
                                            <div className="w-32 h-32 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">{ev.image_url ? <img src={ev.image_url} className="w-full h-full object-cover"/> : <Music size={32} className="text-slate-400"/>}</div>
                                            <div className="flex-1 flex flex-col justify-center"><h4 className="font-black text-xl text-[#2D1B4E] uppercase">{ev.name}</h4><div className="text-[#E8622A] font-bold text-sm">{ev.date} • {ev.time}</div></div>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <button onClick={() => {setBookingData({...bookingData, selectedEvent: null, selectedShopService: null}); setBookingPhase(1);}} className="text-[10px] font-black uppercase text-slate-400 bg-transparent border-none cursor-pointer mb-2 flex items-center gap-1"><ChevronLeft size={14}/> Geri</button>
                                        {selectedShop.services?.map(srv => (
                                            <div key={srv.id} onClick={() => { setBookingData({...bookingData, selectedShopService: srv}); setBookingPhase(3); }} className="p-6 bg-white rounded-[24px] border-2 border-slate-100 hover:border-[#E8622A] cursor-pointer flex justify-between items-center">
                                                <div><h4 className="font-black text-lg text-[#2D1B4E]">{srv.name}</h4></div>
                                                <div className="flex items-center gap-6"><span className="font-black text-xl text-[#2D1B4E]">{srv.price || '0'} TL</span><button className="bg-[#E8622A] text-white px-6 py-2 rounded-full font-black text-xs border-none cursor-pointer">SEÇ</button></div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}

                        {(profileTab === 'services' || profileTab === 'events') && selectedShop.category !== 'Bar & Club' && (
                            <div className="flex flex-col gap-4">
                                {selectedShop.services?.map(srv => (
                                    <div key={srv.id} onClick={() => { setBookingData({...bookingData, selectedShopService: srv, selectedStaff: null, time: ''}); setBookingPhase(2); }} className={`p-6 bg-white rounded-[24px] border-2 cursor-pointer flex justify-between items-center ${bookingData.selectedShopService?.id === srv.id ? 'border-[#E8622A]' : 'border-slate-100 hover:border-[#E8622A]'}`}>
                                        <div><h4 className="font-black text-lg text-[#2D1B4E] mb-1">{srv.name}</h4><div className="text-[10px] font-bold text-slate-400">{srv.duration} Dk</div></div>
                                        <div className="flex items-center gap-6"><span className="font-black text-xl text-[#2D1B4E]">{srv.price || '0'} TL</span><button className="bg-slate-50 text-slate-500 px-6 py-2 rounded-full font-black text-xs border-none cursor-pointer">SEÇ</button></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {profileTab === 'gallery' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {selectedShop.gallery?.map((img, idx) => (<div key={idx} className="h-40 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50"><img src={img} className="w-full h-full object-cover" /></div>))}
                            </div>
                        )}

                        {profileTab === 'about' && (
                            <div className="bg-white border border-slate-200 p-8 rounded-[24px]">
                                <h3 className="text-xs font-black uppercase text-slate-400 mb-4">{t[lang].profile.about}</h3>
                                <p className="text-slate-600 text-sm font-medium whitespace-pre-wrap">{selectedShop.description || "Açıklama yok."}</p>
                            </div>
                        )}
                    </div>

                    {/* SAĞ REZERVASYON PANELİ */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-28 bg-white border-2 border-slate-200 rounded-[32px] p-6 md:p-8 flex flex-col min-h-[450px]">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                <h3 className="text-xl font-black uppercase text-[#2D1B4E]">{t[lang].book.details}</h3>
                                {bookingPhase > 1 && (<button onClick={() => setBookingPhase(bookingPhase - 1)} className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border-none cursor-pointer"><ChevronLeft size={14}/> {t[lang].book.change}</button>)}
                            </div>

                            {bookingPhase === 1 && (<div className="flex-1 flex flex-col items-center justify-center text-center"><Scissors size={40} className="text-slate-400 mb-4"/><p className="text-xs font-bold text-slate-500 uppercase">{t[lang].book.selectService}</p></div>)}
                            
                            {bookingPhase > 1 && (
                                <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2">
                                    <div className="flex justify-between items-center"><span className="text-[9px] font-black text-slate-400 uppercase">Hizmet</span><span className="font-black text-[#2D1B4E] text-sm">{bookingData.selectedShopService?.name}</span></div>
                                    {bookingPhase > 2 && bookingData.selectedStaff && selectedShop.category !== 'Bar & Club' && (<div className="flex justify-between items-center border-t border-slate-100 pt-2"><span className="text-[9px] font-black text-slate-400 uppercase">Uzman</span><span className="font-bold text-[#2D1B4E] text-xs uppercase">{bookingData.selectedStaff.name}</span></div>)}
                                    {bookingPhase > 3 && bookingData.time && selectedShop.category !== 'Bar & Club' && (<div className="flex justify-between items-center border-t border-slate-100 pt-2"><span className="text-[9px] font-black text-slate-400 uppercase">Zaman</span><span className="font-bold text-[#E8622A] text-xs">{bookingData.date} | {bookingData.time}</span></div>)}
                                    <div className="flex justify-between items-center border-t border-slate-100 pt-2 mt-1"><span className="text-[10px] font-black text-[#2D1B4E] uppercase">Toplam</span><span className="font-black text-[#E8622A] text-lg">{bookingData.selectedShopService?.price || '0'} TL</span></div>
                                </div>
                            )}

                            {bookingPhase === 2 && selectedShop.category !== 'Bar & Club' && (
                                <div className="flex-1">
                                    <p className="text-[11px] font-black uppercase text-[#2D1B4E] mb-4">Uzman Seçin</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div onClick={() => { setBookingData({...bookingData, selectedStaff: { name: 'Fark Etmez' }}); setBookingPhase(3); }} className="flex flex-col items-center gap-2 cursor-pointer p-3 rounded-2xl border-2 border-transparent hover:border-[#E8622A] bg-white">
                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center"><Users size={20}/></div><span className="text-[9px] font-black text-slate-500 uppercase">Fark Etmez</span>
                                        </div>
                                        {selectedShop.staff?.map(person => (
                                            <div key={person.id} onClick={() => { setBookingData({...bookingData, selectedStaff: person}); setBookingPhase(3); }} className="flex flex-col items-center gap-2 cursor-pointer p-3 rounded-2xl border-2 border-transparent hover:border-[#E8622A] bg-white">
                                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center"><UserCircle size={24}/></div><span className="text-[9px] font-black text-slate-500 uppercase truncate w-full text-center px-1">{person.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {bookingPhase === 3 && selectedShop.category !== 'Bar & Club' && (
                                <div className="flex-1 flex flex-col gap-4">
                                    <input type="date" min={new Date().toISOString().split('T')[0]} value={bookingData.date} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-[#2D1B4E] outline-none" onChange={(e) => setBookingData({...bookingData, date: e.target.value, time: ''})} />
                                    {bookingData.date && (
                                        isShopClosedToday ? (
                                            <div className="py-10 text-center text-red-500 font-bold uppercase text-xs bg-red-50 rounded-2xl border border-red-100">KAPALIDIR</div>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                                                {currentAvailableSlots.map((slot, idx) => {
                                                    const needed = getRequiredSlots(bookingData.selectedShopService.duration);
                                                    const check = currentAvailableSlots.slice(idx, idx + needed);
                                                    let isUnavail = check.length < needed || check.some(s => closedSlots.includes(s));
                                                    return (
                                                        <button key={slot} disabled={isUnavail} onClick={() => { setBookingData({...bookingData, time: slot}); setBookingPhase(4); }} className={`p-3 rounded-xl text-xs font-bold border-2 cursor-pointer ${isUnavail ? 'bg-slate-50 border-transparent text-slate-300' : bookingData.time === slot ? 'bg-[#E8622A] text-white border-[#E8622A]' : 'bg-white border-slate-200 text-slate-500 hover:border-[#E8622A]'}`}>{slot}</button>
                                                    );
                                                })}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {(bookingPhase === 4 || (selectedShop.category === 'Bar & Club' && bookingPhase === 3)) && (
                                <form onSubmit={handleBooking} className="flex flex-col gap-3 flex-1 mt-auto">
                                    <div className="flex gap-2 w-full"><input required placeholder="Adınız" className="w-full bg-slate-50 border border-slate-200 rounded-[14px] py-4 px-4 font-bold text-xs outline-none" onChange={(e) => setFormData({...formData, name: e.target.value})} /><input required placeholder="Soyadınız" className="w-full bg-slate-50 border border-slate-200 rounded-[14px] py-4 px-4 font-bold text-xs outline-none" onChange={(e) => setFormData({...formData, surname: e.target.value})} /></div>
                                    <div className="flex gap-2 w-full"><select className="bg-slate-50 border border-slate-200 rounded-[14px] py-4 px-3 font-bold text-xs outline-none w-20" value={formData.phoneCode} onChange={e => setFormData({...formData, phoneCode: e.target.value})}><option value="+90">TR</option></select><input required type="tel" placeholder="Telefon" className="w-full bg-slate-50 border border-slate-200 rounded-[14px] py-4 px-4 font-bold text-xs outline-none" onChange={handleBookingPhoneChange} /></div>
                                    <input required type="email" placeholder="E-Posta" className="w-full bg-slate-50 border border-slate-200 rounded-[14px] py-4 px-4 font-bold text-xs outline-none" onChange={handleBookingEmailChange} />
                                    <button type="submit" disabled={bookingEmailValid === false || bookingPhoneValid === false} className="w-full bg-[#E8622A] text-white py-5 rounded-[14px] mt-2 uppercase font-black text-xs border-none cursor-pointer">ONAYLA</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* BAŞARILI */}
        {step === 'success' && (
          <div className="text-center py-20 px-4 min-h-[60vh] flex flex-col items-center justify-center max-w-[600px] mx-auto">
            {!feedbackSubmitted ? (
              <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-slate-200 w-full">
                <div className="w-20 h-20 bg-[#00c48c] text-white rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
                <h2 className="text-3xl md:text-4xl font-black text-[#2D1B4E] uppercase mb-2">ONAYLANDI</h2>
                <div className="border-t border-slate-100 pt-8 mt-4">
                  <h3 className="font-black text-xl text-[#2D1B4E] mb-2">Bizi Değerlendirin</h3>
                  <form onSubmit={submitFeedback} className="text-left space-y-6">
                    <div><label className="text-xs font-black uppercase text-[#2D1B4E]">Nasıl buldunuz?</label>{renderFeedbackScale('q1')}</div>
                    <div><label className="text-xs font-black uppercase text-[#2D1B4E]">Kolay mı?</label>{renderFeedbackScale('q2')}</div>
                    <div><label className="text-xs font-black uppercase text-[#2D1B4E]">Memnun musunuz?</label>{renderFeedbackScale('q3')}</div>
                    <div><label className="text-xs font-black uppercase text-[#2D1B4E]">Hızlı mıydı?</label>{renderFeedbackScale('q4')}</div>
                    <button type="submit" className="w-full bg-[#2D1B4E] text-white py-5 rounded-2xl font-black uppercase text-xs border-none cursor-pointer">Gönder ve Tamamla</button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[32px] p-8 md:p-16 shadow-2xl border border-slate-200 w-full">
                <div className="w-24 h-24 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8"><Star fill="currentColor" size={48}/></div>
                <h2 className="text-3xl font-black text-[#2D1B4E] uppercase mb-4">Teşekkür Ederiz!</h2>
                <button onClick={() => {setStep('services'); setBookingPhase(1); setFeedbackSubmitted(false); window.scrollTo(0,0);}} className="btn-primary mx-auto px-10 py-4 text-xs border-none cursor-pointer">ANA SAYFA</button>
              </div>
            )}
          </div>
        )}

        {/* DİNAMİK ÖZELLİK, TÜM ÖZELLİKLER, İLETİŞİM, HAKKIMIZDA, YASAL */}
        {step === 'feature_detail' && activeFeature && (
            <div className="w-full bg-[#FAF7F2] pb-24"><div className="bg-[#2D1B4E] pt-32 pb-40 text-center"><h1 className="text-4xl font-black text-white">{t[lang].featNames[activeFeature]}</h1></div></div>
        )}
        {step === 'all_features' && (
            <div className="w-full bg-[#FAF7F2] pb-24">
                <div className="bg-white pt-24 pb-20 text-center border-b border-slate-200"><h1 className="text-4xl font-black text-[#2D1B4E]">Tüm Özellikler</h1></div>
            </div>
        )}
        {step === 'contact' && (
            <div className="w-full bg-[#FAF7F2] pb-24">
                <div className="bg-[#2D1B4E] pt-24 pb-24 text-center"><h1 className="text-4xl font-black text-white">İLETİŞİM</h1></div>
            </div>
        )}
        {step === 'about' && (
            <div className="w-full bg-[#FAF7F2] pb-24">
                <div className="bg-[#2D1B4E] pt-24 pb-24 text-center"><h1 className="text-4xl font-black text-white">HAKKIMIZDA</h1></div>
            </div>
        )}
        {['privacy', 'kvkk', 'terms', 'cookies'].includes(step) && (
            <div className="w-full bg-[#FAF7F2] pb-24">
                <div className="bg-white pt-24 pb-20 text-center border-b border-slate-200"><h1 className="text-3xl font-black text-[#2D1B4E] uppercase">{t[lang].legal[`${step}Title`]}</h1></div>
                <div className="max-w-3xl mx-auto mt-12 bg-white p-8 rounded-[32px] border border-slate-200">Sayfa İçeriği Burada...</div>
            </div>
        )}

      </main>

      <footer className="w-full bg-[#2D1B4E] pt-16 pb-8 px-6 text-white/60 text-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-white/10 pb-8">
          <div><div className="text-2xl font-black text-white mb-4">bookcy<span className="text-[#E8622A]">.</span></div><p>Kuzey Kıbrıs'ın tek rezervasyon platformu.</p></div>
          <div><h4 className="text-white font-black mb-4">PLATFORM</h4><button onClick={()=>setStep('services')} className="block mb-2 bg-transparent border-none text-white/60 cursor-pointer">Ana Sayfa</button><button onClick={()=>setStep('about')} className="block mb-2 bg-transparent border-none text-white/60 cursor-pointer">Hakkımızda</button></div>
          <div><h4 className="text-white font-black mb-4">BÖLGELER</h4>{cyprusRegions.map(r => <button key={r} onClick={()=>{setFilterRegion(r); setStep('all_shops');}} className="block mb-2 bg-transparent border-none text-white/60 cursor-pointer">{r}</button>)}</div>
          <div><h4 className="text-white font-black mb-4">YASAL</h4><button onClick={()=>setStep('privacy')} className="block mb-2 bg-transparent border-none text-white/60 cursor-pointer">Gizlilik Politikası</button><button onClick={()=>setStep('kvkk')} className="block mb-2 bg-transparent border-none text-white/60 cursor-pointer">KVKK</button></div>
        </div>
        <div className="max-w-6xl mx-auto flex justify-between items-center"><p>© {new Date().getFullYear()} BOOKCY KIBRIS.</p><p>One Click Booking™</p></div>
      </footer>

    </>
  );
}