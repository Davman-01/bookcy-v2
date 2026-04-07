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
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

function parseDuration(durationStr) {
  if (!durationStr || durationStr === '0') return 30;
  const match = durationStr.match(/\d+/);
  return match ? parseInt(match[0]) : 30;
}
function getRequiredSlots(durationStr) { return Math.ceil(parseDuration(durationStr) / 30); }

const allTimeSlots = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30","00:00","00:30","01:00","01:30","02:00"];

const defaultWorkingHours = [
  { day: 'Pazartesi', open: '09:00', close: '19:00', isClosed: false }, { day: 'Salı', open: '09:00', close: '19:00', isClosed: false },
  { day: 'Çarşamba', open: '09:00', close: '19:00', isClosed: false }, { day: 'Perşembe', open: '09:00', close: '19:00', isClosed: false },
  { day: 'Cuma', open: '09:00', close: '19:00', isClosed: false }, { day: 'Cumartesi', open: '09:00', close: '19:00', isClosed: false },
  { day: 'Pazar', open: '09:00', close: '19:00', isClosed: true },
];

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

  const cyprusRegions = ["Girne", "Lefkoşa", "Mağusa", "İskele", "Güzelyurt", "Lefke"];

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => { entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); } }); }, { threshold: 0.12 });
    reveals.forEach(r => observer.observe(r));
    return () => observer.disconnect();
  }, [step]);

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
    // BÖLÜM 2 BURADAN BAŞLAYACAK (AŞAĞIDAKİ MESAJDA)
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root { 
          --fig: #2D1B4E; 
          --terra: #E8622A; 
          --blush: #F5C5A3; 
          --c-bg-main: #FAF7F2;
          --c-bg-card: #FFFFFF;
          --c-border: #E2E8F0;
          --c-text-main: #101010;
          --c-text-muted: #64748B;
        }
        body { background: var(--c-bg-main) !important; color: var(--c-text-main) !important; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

        /* --- NAVBAR (HER ZAMAN BEYAZ VE KESİN OKUNUR) --- */
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 0 48px; height: 72px; display: flex; align-items: center; justify-content: space-between; background: #FFFFFF !important; border-bottom: 1px solid var(--c-border) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; cursor: pointer; }
        .nav-logo-icon { width: 36px; height: 36px; }
        .nav-logo-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 22px; font-weight: 800; color: var(--fig); letter-spacing: -1px; display:flex; align-items:baseline; }
        .nav-logo-text span { color: var(--terra); }
        .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; margin:0; padding:0; }
        .nav-links button { font-size: 14px; font-weight: 700; color: var(--fig) !important; background:none; border:none; cursor:pointer; transition: color 0.2s;}
        .nav-links button:hover, .nav-links button.active { color: var(--terra) !important; }
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .btn-outline { font-size: 13px; font-weight: 700; padding: 9px 20px; border-radius: 50px; border: 1.5px solid var(--fig); color: var(--fig); background:transparent; cursor:pointer;}
        .btn-outline:hover { background: var(--fig); color: white; }
        .btn-primary { font-size: 13px; font-weight: 800; padding: 12px 28px; border-radius: 50px; background: var(--terra); color: white; border:none; cursor:pointer; text-transform:uppercase; transition: all 0.25s;}
        .btn-primary:hover { background: #d4561f; transform: translateY(-2px); box-shadow: 0 12px 25px rgba(232,98,42,0.3); }
        
        /* --- HERO (MOR ARKA PLAN) --- */
        .hero { position: relative; min-height: 85vh; background: var(--fig); display: flex; flex-direction:column; align-items: center; justify-content: center; padding: 140px 24px 100px; }
        .hero-title { font-family:'Plus Jakarta Sans',sans-serif; font-size: clamp(48px, 6vw, 80px); font-weight:900; color: white; letter-spacing: -2px; line-height: 1.1; margin-bottom:24px; text-align:center; }
        .hero-title .accent { color: var(--terra); }
        .hero-sub { font-size:16px; font-weight:600; color: rgba(255,255,255,0.65); max-width:600px; margin:0 auto 48px; text-align:center; }
        .search-wrap { display:flex; align-items:center; background: white; border-radius: 32px; padding: 12px; gap: 12px; max-width: 800px; width:100%; margin: 0 auto; box-shadow: 0 24px 60px rgba(0,0,0,0.3); border: none; }
        .search-field { flex:1.5; display:flex; align-items:center; gap:12px; padding: 0 16px; border-right: 1px solid var(--c-border); }
        .search-field input { border:none; outline:none; width:100%; font-size:15px; font-weight:700; color:var(--c-text-main); }
        .search-location { display:flex; align-items:center; gap:12px; flex:1; padding: 0 16px; }
        .search-location select { border:none; outline:none; width:100%; font-size:15px; font-weight:700; cursor:pointer; }
        .search-btn { border:none; background: var(--terra); color:white; font-size:15px; font-weight:800; padding: 16px 40px; border-radius:24px; cursor:pointer; }
        .search-btn:hover { background:#d4561f; }
        
        .cat-card { display:flex; flex-direction:column; align-items:center; gap:12px; cursor:pointer; transition:transform 0.25s;}
        .cat-card:hover { transform:translateY(-6px); }
        .cat-img-wrap { width:100%; aspect-ratio:1; border-radius:24px; background:white; border: 1px solid var(--c-border); }
        .cat-emoji-bg { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:40px; border-radius:24px; }
        .cat-name { font-size:11px; font-weight:800; letter-spacing:1px; text-transform:uppercase; color:var(--c-text-main); }

        .venue-card { border-radius:24px; background: white; border: 1px solid var(--c-border); cursor:pointer; transition:transform 0.3s;}
        .venue-card:hover { transform:translateY(-8px); border-color: var(--terra); box-shadow:0 24px 50px rgba(45,27,78,0.08);}
      `}} />

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

      {/* İŞLETME KAYIT MODALI */}
      {showRegister && (
          <div className="fixed inset-0 w-screen h-screen bg-[#2D1B4E]/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto pt-20">
            <div className="bg-white border border-slate-200 w-full max-w-[800px] rounded-[32px] p-8 md:p-10 relative shadow-2xl my-auto animate-in zoom-in-95 duration-300">
              <button onClick={() => {setShowRegister(false); setRegisterSuccess(false);}} className="absolute top-6 right-6 md:right-8 text-slate-400 hover:text-[#2D1B4E] p-2 font-bold bg-transparent border-none cursor-pointer"><X size={24}/></button>
              
              {registerSuccess ? (
                  <div className="text-center py-20">
                      <CheckCircle2 size={64} className="mx-auto text-[#00c48c] mb-6" />
                      <h2 className="text-2xl md:text-3xl font-black text-[#E8622A] uppercase italic mb-4">{t[lang].reg.success}</h2>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 inline-block text-left mt-4 text-[#2D1B4E] w-full max-w-sm">
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Banka Bilgileri / Bank Details:</p>
                          <p className="font-bold text-sm">Banka: <span className="font-normal">İş Bankası</span></p>
                          <p className="font-bold text-sm">Alıcı: <span className="font-normal">BOOKCY LTD.</span></p>
                          <p className="font-bold text-sm">IBAN: <span className="text-[#E8622A]">TR99 0006 4000 0012 3456 7890 12</span></p>
                          <a href="https://wa.me/905555555555?text=Merhaba,%20Bookcy%20işletme%20kaydımı%20yaptım.%20Dekontumu%20iletiyorum." target="_blank" rel="noreferrer" className="w-full bg-[#25D366] text-white font-black py-4 rounded-xl uppercase tracking-widest hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30 flex justify-center items-center gap-2 text-decoration-none text-xs border-none cursor-pointer">
                              <MessageCircle size={18}/> DEKONTU WHATSAPP'TAN İLET
                          </a>
                      </div>
                  </div>
              ) : (
                  <>
                      <div className="flex flex-col mb-8 text-center">
                          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic text-[#2D1B4E]">{t[lang].reg.title}</h2>
                          <p className="text-[10px] text-[#E8622A] font-bold uppercase tracking-[0.2em] mt-2 flex items-center justify-center gap-2"><Lock size={12}/> {t[lang].reg.subtitle}</p>
                      </div>
                      <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input required placeholder={t[lang].reg.shopName} className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-xs font-bold focus:border-[#E8622A] outline-none text-[#2D1B4E]" value={newShop.name} onChange={e => setNewShop({...newShop, name: e.target.value})} />
                              <select className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-xs font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] cursor-pointer" value={newShop.category} onChange={e => setNewShop({...newShop, category: e.target.value})}>
                                  {categories.map(c => <option key={c.dbName} value={c.dbName}>{t[lang].cats[c.key]}</option>)}
                              </select>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <select required className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-xs font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] cursor-pointer uppercase" value={newShop.location} onChange={e => setNewShop({...newShop, location: e.target.value})}>
                                  {cyprusRegions.map(region => <option key={region} value={region}>{region}</option>)}
                              </select>
                              <input required placeholder={t[lang].reg.address} className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-xs font-bold focus:border-[#E8622A] outline-none uppercase text-[#2D1B4E]" value={newShop.address} onChange={e => setNewShop({...newShop, address: e.target.value})} />
                          </div>
                          
                          <div className="border-t border-slate-100 pt-5">
                              <input type="url" placeholder={t[lang].reg.maps} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-xs font-bold focus:border-[#E8622A] outline-none text-[#2D1B4E]" value={newShop.maps_link} onChange={e => setNewShop({...newShop, maps_link: e.target.value})} />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-5">
                              <div className="flex gap-2 w-full relative">
                                <select className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-3 outline-none focus:border-[#E8622A] font-bold text-xs text-[#2D1B4E] cursor-pointer w-20 shrink-0" value={newShop.phoneCode} onChange={e => setNewShop({...newShop, phoneCode: e.target.value})}>
                                    <option value="+90">TR</option>
                                    <option value="+357">CY</option>
                                    <option value="+44">UK</option>
                                </select>
                                <div className="relative flex-1">
                                  <input required type="tel" placeholder={t[lang].reg.contactPhone} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 pr-10 outline-none focus:border-[#E8622A] font-bold text-xs text-[#2D1B4E]" value={newShop.contactPhone} onChange={handlePhoneChange} />
                                  {phoneValid === true && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={16}/>}
                                  {phoneValid === false && <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={16}/>}
                                </div>
                              </div>
                              <input placeholder={t[lang].reg.contactInsta} className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-xs font-bold focus:border-[#E8622A] outline-none text-[#2D1B4E]" value={newShop.contactInsta} onChange={e => setNewShop({...newShop, contactInsta: e.target.value})} />
                              <div className="relative">
                                <input type="email" placeholder={t[lang].reg.contactEmail} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 pr-10 text-xs font-bold focus:border-[#E8622A] outline-none text-[#2D1B4E]" value={newShop.contactEmail} onChange={handleAdminEmailChange} />
                                {adminEmailValid === true && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={16}/>}
                                {adminEmailValid === false && <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={16}/>}
                              </div>
                          </div>
                          
                          <div className="border-t border-slate-100 pt-5 relative">
                              <input required type="email" placeholder={t[lang].reg.email} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 pr-10 text-xs font-bold focus:border-[#E8622A] outline-none text-[#2D1B4E]" value={newShop.email} onChange={handleEmailChange} />
                              {emailValid === true && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={16}/>}
                              {emailValid === false && <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={16}/>}
                          </div>
                          
                          <textarea placeholder={t[lang].reg.desc} rows="2" className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-xs font-bold focus:border-[#E8622A] outline-none resize-none text-[#2D1B4E]" value={newShop.description} onChange={e => setNewShop({...newShop, description: e.target.value})}></textarea>
                          
                          <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-4 relative group hover:border-[#E8622A] transition-all">
                              {newShop.logoFile ? (
                                  <span className="text-[10px] font-bold text-[#00c48c] flex items-center justify-center gap-2"><CheckCircle2 size={16}/> {newShop.logoFile.name}</span>
                              ) : (
                                  <div className="flex flex-col items-center justify-center text-center cursor-pointer">
                                      <Upload size={20} className="text-slate-400 mb-2 group-hover:text-[#E8622A]" />
                                      <span className="text-[10px] font-bold text-slate-500 uppercase">{t[lang].reg.upload}</span>
                                  </div>
                              )}
                              <input type="file" accept=".png, .jpg, .jpeg" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setNewShop({...newShop, logoFile: e.target.files[0]})} />
                          </div>
                          
                          <div className="border-t border-slate-100 pt-4">
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">{t[lang].reg.pack}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {packages.map(p => (
                                      <div key={p.name} onClick={() => setNewShop({...newShop, package: p.name})} className={`cursor-pointer p-5 rounded-2xl border transition-all ${newShop.package === p.name ? 'bg-orange-50 border-[#E8622A]' : 'bg-white border-slate-200 hover:border-[#E8622A]'}`}>
                                          <div className="flex justify-between items-center mb-2">
                                            <h4 className={`text-sm font-black uppercase ${newShop.package === p.name ? 'text-[#E8622A]' : 'text-[#2D1B4E]'}`}>{p.name}</h4>
                                            {newShop.package === p.name && <CheckCircle2 size={16} className="text-[#E8622A]"/>}
                                          </div>
                                          <p className="text-xs font-bold text-slate-500">{p.price}</p>
                                      </div>
                                  ))}
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mt-2 border-t border-slate-100 pt-4">
                              <input required placeholder={t[lang].reg.user} className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-xs font-bold focus:border-[#E8622A] outline-none text-[#2D1B4E]" value={newShop.username} onChange={e => setNewShop({...newShop, username: e.target.value})} />
                              <input required placeholder={t[lang].reg.pass} className="bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-xs font-bold focus:border-[#E8622A] outline-none text-[#2D1B4E]" value={newShop.password} onChange={e => setNewShop({...newShop, password: e.target.value})} />
                          </div>
                          
                          <button type="submit" disabled={isUploading || emailValid === false || phoneValid === false || adminEmailValid === false} className="w-full btn-primary justify-center py-5 rounded-2xl mt-2 uppercase text-xs tracking-[0.2em] shadow-lg border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                            {isUploading ? t[lang].reg.uploading : t[lang].reg.submit}
                          </button>
                      </form>
                  </>
              )}
            </div>
          </div>
      )}

      {/* GİRİŞ MODALI */}
      {showLogin && (
        <div className="fixed inset-0 bg-[#2D1B4E]/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[480px] rounded-[32px] p-8 md:p-12 relative animate-in zoom-in-95 duration-300 shadow-2xl border border-slate-200">
            <button onClick={() => setShowLogin(false)} className="absolute top-6 right-6 text-slate-400 hover:text-[#E8622A] bg-transparent border-none cursor-pointer">
              <X size={28}/>
            </button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#E8622A]/10 text-[#E8622A] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner"><Store size={32} /></div>
              <h1 className="text-2xl md:text-3xl font-black text-[#2D1B4E] uppercase tracking-tight mb-2">GİRİŞ YAP</h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">BOOKCY İŞ ORTAĞI PANELİ</p>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-xl mb-8 border border-slate-100">
              <button onClick={() => setLoginType('owner')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all border-none cursor-pointer flex justify-center items-center gap-2 ${loginType === 'owner' ? 'bg-white text-[#E8622A] shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}><User size={14}/> YÖNETİCİ</button>
              <button onClick={() => setLoginType('staff')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-lg transition-all border-none cursor-pointer flex justify-center items-center gap-2 ${loginType === 'staff' ? 'bg-white text-[#E8622A] shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}><Users size={14}/> PERSONEL</button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative"><Store className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20}/><input type="text" required placeholder="İşletme Kullanıcı Adı" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm outline-none focus:border-[#E8622A] text-[#2D1B4E] placeholder:text-slate-400" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} /></div>
              {loginType === 'staff' && (<div className="relative animate-in fade-in zoom-in-95 duration-300"><User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20}/><input type="text" required placeholder="Personel İsim Soyisim" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm outline-none focus:border-[#E8622A] text-[#2D1B4E] placeholder:text-slate-400" value={loginStaffName} onChange={(e) => setLoginStaffName(e.target.value)} /></div>)}
              <div className="relative"><Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20}/><input type="password" required placeholder="Şifre" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 font-bold text-sm outline-none focus:border-[#E8622A] text-[#2D1B4E] placeholder:text-slate-400" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} /></div>
              <button type="submit" disabled={isLoginLoading} className="w-full btn-primary py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex justify-center items-center gap-2 transition-all mt-6 disabled:opacity-70 border-none cursor-pointer">{isLoginLoading ? 'Giriş Yapılıyor...' : 'PANELE GİT'} <ArrowRight size={18}/></button>
            </form>
          </div>
        </div>
      )}

      <main className="flex-1 w-full relative z-10 min-h-[80vh] mt-[72px]">
        
        {/* === ANA SAYFA === */}
        {step === 'services' && (
            <div className="w-full animate-in fade-in">
                <section className="hero">
                  <div className="hero-content">
                    <div className="hero-eyebrow">
                      <div className="hero-eyebrow-dot"></div>
                      {t[lang].home.eyebrow}
                    </div>
                    <h1 className="hero-title">
                      {t[lang].home.title1} <span className="accent">{t[lang].home.title2}</span><br/>
                      {t[lang].home.title3} <span className="accent">{t[lang].home.title4}</span>
                    </h1>
                    <p className="hero-sub">{t[lang].home.subtitle}</p>
                    
                    <form className="search-wrap" onSubmit={handleHeroSearch}>
                      <div className="search-field">
                        <span className="search-icon"><Search size={22}/></span>
                        <input type="text" placeholder={t[lang].home.searchPlace} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                      </div>
                      <div className="search-location">
                        <MapPin size={20} className="text-slate-400 shrink-0"/>
                        <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
                          <option value="All">{t[lang].home.searchLoc}</option>
                          {cyprusRegions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
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

                  {(() => {
                      const liveShopsCount = approvedShops.length;
                      const liveCustomersCount = new Set(globalAppointments.filter(a => a.customer_phone).map(a => a.customer_phone)).size;
                      const liveApptsCount = globalAppointments.length;
                      return (
                          <div className="hero-stats">
                              <div className="stat">
                                <div className="stat-num">{liveShopsCount.toLocaleString('tr-TR')}</div>
                                <div className="stat-label">{t[lang].home.stats.s1}</div>
                              </div>
                              <div className="stat">
                                <div className="stat-num">{liveCustomersCount.toLocaleString('tr-TR')}</div>
                                <div className="stat-label">{t[lang].home.stats.s2}</div>
                              </div>
                              <div className="stat">
                                <div className="stat-num">{liveApptsCount.toLocaleString('tr-TR')}</div>
                                <div className="stat-label">{t[lang].home.stats.s3}</div>
                              </div>
                              <div className="stat">
                                <div className="stat-num">%98</div>
                                <div className="stat-label">{t[lang].home.stats.s4}</div>
                              </div>
                          </div>
                      );
                  })()}
                </section>

                <section className="section-categories">
                  <div className="section-header reveal">
                    <div>
                      <div className="section-label-sm">{t[lang].cats.catTitle}</div>
                      <div className="section-title">{t[lang].cats.catSub}</div>
                    </div>
                    <button className="see-all" onClick={()=>{setFilterService('All'); setStep('all_shops'); window.scrollTo(0,0);}}>{t[lang].cats.seeAll}</button>
                  </div>
                  <div className="categories-grid">
                    {categories.map((c, i) => (
                        <div key={c.key} onClick={() => { setFilterService(c.dbName); setStep('all_shops'); window.scrollTo(0,0); }} className={`cat-card reveal reveal-delay-${(i%4)+1}`}>
                          <div className="cat-img-wrap"><div className="cat-emoji-bg" style={{background: c.bg}}>{c.emoji}</div></div>
                          <div className="cat-name">{t[lang].cats[c.key]}</div>
                        </div>
                    ))}
                  </div>
                </section>

               {recommendedShops.length > 0 && (
                  <section className="section-featured">
                    <div className="section-header">
                      <div>
                        <div className="section-label-sm">{t[lang].homeInfo.recLabel}</div>
                        <div className="section-title">{t[lang].homeInfo.recTitle}</div>
                      </div>
                      <button className="see-all" onClick={()=>{setFilterSort('High'); setStep('all_shops'); window.scrollTo(0,0);}}>{t[lang].cats.seeAll}</button>
                    </div>
                    <div className="featured-grid">
                      {recommendedShops.map((shop, idx) => (
                          <div key={shop.id} onClick={() => { setSelectedShop(shop); setStep('shop_profile'); setProfileTab(shop.category === 'Bar & Club' ? 'events' : 'services'); setBookingPhase(1); window.scrollTo(0,0); }} className={`venue-card ${idx === 0 ? 'featured' : ''}`}>
                            <div className="venue-img" style={{background: '#f8fafc'}}>
                              {shop.cover_url || shop.logo_url ? <img loading="lazy" decoding="async" src={shop.cover_url || shop.logo_url} /> : categories.find(c=>c.dbName===shop.category)?.emoji}
                              {idx === 0 && <div className="venue-badge hot">🔥 Çok Popüler</div>}
                              {idx === 1 && <div className="venue-badge new">✨ Yeni</div>}
                              <div className="venue-fav"><HeartHandshake size={14}/></div>
                            </div>
                            <div className="venue-info">
                              <div className="venue-cat">{t[lang].cats[categories.find(c => c.dbName === shop.category)?.key || 'barber']}</div>
                              <div className="venue-name">{shop.name}</div>
                              <div className="venue-meta"><span>📍 {shop.location}</span></div>
                              <button className="venue-book-btn">{t[lang].book.btnBook}</button>
                            </div>
                          </div>
                      ))}
                    </div>
                  </section>
               )}

              <section className="section-how">
                <div className="how-inner">
                  <div className="how-header">
                    <div className="section-label-sm" style={{color:'var(--terra)', marginBottom:'8px', fontWeight:'800', letterSpacing:'4px'}}>{t[lang].homeInfo.howLabel}</div>
                    <div className="section-title text-4xl md:text-5xl font-black">{t[lang].homeInfo.howTitle}</div>
                  </div>
                  <div className="steps-grid">
                    <div className="step">
                      <div className="step-icon">🔍<div className="step-num">1</div></div>
                      <div className="step-title">{t[lang].homeInfo.how1Title}</div>
                      <div className="step-desc">{t[lang].homeInfo.how1Desc}</div>
                    </div>
                    <div className="step">
                      <div className="step-icon">📅<div className="step-num">2</div></div>
                      <div className="step-title">{t[lang].homeInfo.how2Title}</div>
                      <div className="step-desc">{t[lang].homeInfo.how2Desc}</div>
                    </div>
                    <div className="step">
                      <div className="step-icon">✅<div className="step-num">3</div></div>
                      <div className="step-title">{t[lang].homeInfo.how3Title}</div>
                      <div className="step-desc">{t[lang].homeInfo.how3Desc}</div>
                    </div>
                    <div className="step">
                      <div className="step-icon">✨<div className="step-num">4</div></div>
                      <div className="step-title">{t[lang].homeInfo.how4Title}</div>
                      <div className="step-desc">{t[lang].homeInfo.how4Desc}</div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="section-cta">
                <div className="cta-inner">
                  <div className="cta-text">
                    <div className="section-label-sm text-[#E8622A] font-black tracking-widest uppercase mb-4">{t[lang].homeInfo.ctaLabel}</div>
                    <div className="cta-title">{t[lang].homeInfo.ctaTitle1}<br/><span>{t[lang].homeInfo.ctaTitle2}</span></div>
                    <div className="cta-sub">{t[lang].homeInfo.ctaSub}</div>
                  </div>
                  <div className="cta-actions">
                    <button className="app-badge" onClick={()=>{setShowRegister(true); window.scrollTo(0,0);}}>
                      <div className="app-badge-icon">💼</div>
                      <div className="app-badge-text"><div className="small">Hemen Katıl</div><div className="big">İşletme Ekle</div></div>
                    </button>
                    <button className="app-badge" onClick={()=>{setStep('about'); window.scrollTo(0,0);}}>
                      <div className="app-badge-icon">🚀</div>
                      <div className="app-badge-text"><div className="small">İncele</div><div className="big">Özellikler & Paketler</div></div>
                    </button>
                  </div>
                </div>
              </section>
            </div>
        )}

        {/* === NEDEN BOOKCY (YENİ SAYFA) === */}
        {step === 'why_bookcy' && (
            <div className="w-full bg-[#FAF7F2] animate-in fade-in overflow-hidden pb-24">
                <div className="bg-[#2D1B4E] pt-32 pb-24 px-4 md:px-8 text-center relative overflow-hidden border-b border-slate-800">
                    <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-[#E8622A]/20 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-[#F5C5A3]/20 rounded-full blur-[100px] pointer-events-none"></div>
                    
                    <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block border border-white/20 relative z-10">Farkı Keşfedin</span>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 relative z-10">Neden <span className="text-[#E8622A]">Binlerce Kişi</span><br/>Bookcy Kullanıyor?</h1>
                    <p className="text-lg md:text-xl font-medium text-slate-300 max-w-2xl mx-auto leading-relaxed relative z-10">Sadece bir randevu sistemi değil, kişisel bakım yolculuğunuzun en güvenilir ortağıyız.</p>
                </div>
                
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 -mt-10 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-200 hover:-translate-y-2 transition-transform">
                            <div className="w-16 h-16 bg-orange-50 text-[#E8622A] rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-orange-100"><Crown size={32}/></div>
                            <h3 className="font-black text-xl text-[#2D1B4E] mb-3">Öncü Platform</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">Kıbrıs’ta ilk ve öncü randevu platformlarından biri olarak, sektöre yön veriyoruz.</p>
                        </div>
                        <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-200 hover:-translate-y-2 transition-transform">
                            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100"><Grid size={32}/></div>
                            <h3 className="font-black text-xl text-[#2D1B4E] mb-3">Entegre Sistem</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">Farklı sektörleri tek çatı altında toplayarak kapsamlı bir arama ve randevu deneyimi sunuyoruz.</p>
                        </div>
                        <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-200 hover:-translate-y-2 transition-transform">
                            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-green-100"><Users size={32}/></div>
                            <h3 className="font-black text-xl text-[#2D1B4E] mb-3">Gerçek Müşteri</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">İşletmelere gerçek müşteri kazandıran, dönüşüm odaklı aktif ve büyük bir trafik sağlıyoruz.</p>
                        </div>
                        <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-200 hover:-translate-y-2 transition-transform">
                            <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-purple-100"><Smartphone size={32}/></div>
                            <h3 className="font-black text-xl text-[#2D1B4E] mb-3">Üst Düzey Arayüz</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">Karmaşadan uzak; sade, son derece hızlı ve kullanıcı dostu modern bir arayüz sunuyoruz.</p>
                        </div>
                        <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-200 hover:-translate-y-2 transition-transform">
                            <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-pink-100"><TrendingUp size={32}/></div>
                            <h3 className="font-black text-xl text-[#2D1B4E] mb-3">Maksimum Kazanç</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">İşletmeler için adil, şeffaf ve komisyonsuz modelimiz ile gelirinizi katlamanızı sağlıyoruz.</p>
                        </div>
                        <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-200 hover:-translate-y-2 transition-transform">
                            <div className="w-16 h-16 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-teal-100"><MessageSquare size={32}/></div>
                            <h3 className="font-black text-xl text-[#2D1B4E] mb-3">Gelişmiş Otomasyon</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">Yüksek performanslı altyapımızla yakında eklenecek SMS ve gelişmiş bildirim sistemleri.</p>
                        </div>
                    </div>
                    
                    <div className="mt-16 text-center">
                        <button onClick={() => {setShowRegister(true); window.scrollTo(0,0);}} className="bg-[#E8622A] hover:bg-[#d4561f] text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(232,98,42,0.4)] border-none cursor-pointer transition-transform hover:scale-105 inline-flex items-center gap-2">Hemen Aramıza Katıl <ArrowRight size={18}/></button>
                    </div>
                </div>
            </div>
        )}

        {/* === TÜM MEKANLAR / FİLTRELEME === */}
        {step === 'all_shops' && (
            <div className="w-full max-w-[1400px] mx-auto pt-24 px-4 md:px-8 animate-in fade-in duration-500 pb-20">
                <button onClick={() => {setStep('services'); window.scrollTo(0,0);}} className="flex items-center text-slate-400 hover:text-[#E8622A] mb-8 text-[10px] font-black uppercase tracking-[0.2em] transition-colors bg-transparent border-none outline-none cursor-pointer">
                  <ChevronLeft size={16} className="mr-2"/> {t[lang].shops.back}
                </button>
                <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-[#2D1B4E]">{t[lang].filters.title}</h2>
                    <span className="text-sm font-bold text-slate-500">{sortedShops.length} {t[lang].filters.count}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <aside className="w-full lg:w-[320px] bg-white border border-slate-200 rounded-[24px] p-6 lg:sticky top-28 shrink-0 shadow-sm flex flex-col gap-8">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                            <h3 className="font-black text-[#2D1B4E] uppercase tracking-widest text-xs flex items-center gap-2"><Settings size={16}/> Filtreler</h3>
                            <button onClick={() => {setFilterRegion('All'); setFilterService('All'); setSearchQuery(''); setFilterSort('High');}} className="text-[10px] font-bold text-slate-400 hover:text-[#E8622A] transition-colors uppercase bg-transparent border-none outline-none cursor-pointer">{t[lang].filters.clear}</button>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-3">{t[lang].filters.search}</p>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input type="text" placeholder={t[lang].filters.search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 font-bold text-xs text-[#2D1B4E] outline-none focus:border-[#E8622A] transition-colors" />
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-3">{t[lang].filters.region}</p>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${filterRegion === 'All' ? 'bg-[#E8622A] border-[#E8622A]' : 'bg-white border-slate-200 hover:border-[#E8622A]'}`}>
                                        {filterRegion === 'All' && <Check size={14} className="text-white"/>}
                                    </div>
                                    <span className={`text-sm font-bold transition-colors ${filterRegion === 'All' ? 'text-[#2D1B4E]' : 'text-slate-500 group-hover:text-[#E8622A]'}`}>Tüm Bölgeler</span>
                                    <input type="radio" className="hidden" checked={filterRegion === 'All'} onChange={() => setFilterRegion('All')} />
                                </label>
                                {cyprusRegions.map(r => (
                                    <label key={r} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${filterRegion === r ? 'bg-[#E8622A] border-[#E8622A]' : 'bg-white border-slate-200 hover:border-[#E8622A]'}`}>
                                            {filterRegion === r && <Check size={14} className="text-white"/>}
                                        </div>
                                        <span className={`text-sm font-bold transition-colors ${filterRegion === r ? 'text-[#2D1B4E]' : 'text-slate-500 group-hover:text-[#E8622A]'}`}>{r}</span>
                                        <input type="radio" className="hidden" checked={filterRegion === r} onChange={() => setFilterRegion(r)} />
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-3">{t[lang].filters.service}</p>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => setFilterService('All')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border outline-none cursor-pointer ${filterService === 'All' ? 'bg-[#2D1B4E] text-white border-[#2D1B4E]' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-[#E8622A] hover:text-[#E8622A]'}`}>Tümü</button>
                                {categories.map(c => (
                                    <button key={c.dbName} onClick={() => setFilterService(c.dbName)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border outline-none cursor-pointer ${filterService === c.dbName ? 'bg-[#2D1B4E] text-white border-[#2D1B4E]' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-[#E8622A] hover:text-[#E8622A]'}`}>
                                        {t[lang].cats[c.key]}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-3">Sıralama</p>
                            <div className="relative bg-slate-50 rounded-xl border border-slate-200">
                                <select value={filterSort} onChange={(e) => setFilterSort(e.target.value)} className="w-full bg-transparent border-none py-3 pl-4 pr-10 font-bold text-xs text-[#2D1B4E] outline-none appearance-none cursor-pointer">
                                    <option value="High">{t[lang].filters.sortHigh}</option>
                                    <option value="Low">{t[lang].filters.sortLow}</option>
                                </select>
                                <Sliders size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1 w-full flex flex-col gap-5">
                        {sortedShops.map((shop) => (
                            <div key={shop.id} onClick={() => { 
                                setSelectedShop(shop); 
                                setStep('shop_profile'); 
                                setProfileTab(shop.category === 'Bar & Club' ? 'events' : 'services'); 
                                setBookingPhase(1); 
                                window.scrollTo(0,0); 
                              }} className="venue-card flex flex-col md:flex-row items-center justify-between p-5 md:p-6 bg-white border border-slate-200 hover:border-[#E8622A] transition-colors rounded-[24px] cursor-pointer">
                                <div className="flex items-center gap-6 w-full">
                                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-slate-50 flex items-center justify-center font-black text-[#E8622A] text-xs shadow-inner overflow-hidden border border-slate-200 shrink-0 relative">
                                        {(shop.package === 'Premium' || shop.package === 'Premium Paket') && (
                                            <div className="absolute inset-0 border-4 border-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
                                        )}
                                        {shop.logo_url ? <img loading="lazy" decoding="async" src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" /> : "LOGO"}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl md:text-2xl font-black uppercase text-[#2D1B4E] transition-colors">{shop.name}</h3>
                                            {(shop.package === 'Premium' || shop.package === 'Premium Paket') && <Gem size={16} className="text-yellow-500 fill-yellow-500 drop-shadow-sm"/>}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                                            <span className="flex items-center text-[#2D1B4E] bg-slate-100 px-2 py-1 rounded-md"><Briefcase size={12} className="mr-1"/> {t[lang].cats[categories.find(c => c.dbName === shop.category)?.key || 'barber']}</span>
                                            <span className="flex items-center"><MapPin size={12} className="mr-1"/> {shop.address || shop.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="hidden md:flex btn-primary mt-4 md:mt-0 shrink-0 border-none outline-none">{t[lang].book.btnBook}</button>
                            </div>
                        ))}
                        {sortedShops.length === 0 && (
                            <div className="text-center py-32 bg-white rounded-[32px] border border-slate-200">
                                <Search size={48} className="mx-auto text-slate-400 mb-4"/>
                                <p className="text-slate-500 font-bold uppercase tracking-widest">{t[lang].shops.empty}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* İŞLETME PROFİL SAYFASI */}
        {step === 'shop_profile' && selectedShop && (
            <div className="w-full max-w-6xl mx-auto pt-24 px-4 animate-in fade-in duration-500 pb-20">
                <button onClick={() => {setStep('all_shops'); window.scrollTo(0,0);}} className="flex items-center text-slate-400 hover:text-[#E8622A] mb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-colors bg-transparent border-none outline-none cursor-pointer">
                  <ChevronLeft size={16} className="mr-2"/> {t[lang].shops.back}
                </button>
                
                <div className="w-full h-[250px] md:h-[350px] rounded-[32px] overflow-hidden relative mb-16 border border-slate-200 bg-slate-50 shadow-sm">
                    {selectedShop.cover_url ? <img loading="lazy" decoding="async" src={selectedShop.cover_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-r from-slate-200 to-slate-100"></div>}
                    <div className="absolute -bottom-10 left-8 flex items-end gap-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border-4 border-white flex items-center justify-center shadow-lg overflow-hidden shrink-0 relative">
                            {(selectedShop.package === 'Premium' || selectedShop.package === 'Premium Paket') && <div className="absolute inset-0 border-4 border-yellow-400 rounded-full z-10 pointer-events-none shadow-[0_0_20px_rgba(250,204,21,0.6)]"></div>}
                            {selectedShop.logo_url ? <img loading="lazy" decoding="async" src={selectedShop.logo_url} className="w-full h-full object-cover" /> : <span className="text-[#E8622A] font-black">LOGO</span>}
                        </div>
                    </div>
                </div>

                <div className="px-2 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-slate-200 pb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-5xl font-black uppercase text-[#2D1B4E] tracking-tight">{selectedShop.name}</h1>
                                {(selectedShop.package === 'Premium' || selectedShop.package === 'Premium Paket') && <Gem size={24} className="text-yellow-500 fill-yellow-500 drop-shadow-md"/>}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <span className="flex items-center text-[#E8622A]"><Briefcase size={14} className="mr-1"/> {t[lang].cats[categories.find(c => c.dbName === selectedShop.category)?.key || 'barber']}</span>
                                <span className="flex items-center">
                                  <MapPin size={14} className="mr-1"/> 
                                  {selectedShop.maps_link ? (
                                    <a href={selectedShop.maps_link.startsWith('http') ? selectedShop.maps_link : `https://${selectedShop.maps_link}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#E8622A] underline decoration-slate-400 underline-offset-4">{selectedShop.address || selectedShop.location}</a>
                                  ) : (
                                    selectedShop.address || selectedShop.location
                                  )}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-8 border-b border-slate-200 mb-8 overflow-x-auto custom-scrollbar">
                        <button onClick={() => setProfileTab(selectedShop.category === 'Bar & Club' ? 'events' : 'services')} className={`pb-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-colors border-b-4 bg-transparent outline-none cursor-pointer ${(profileTab === 'services' || profileTab === 'events') ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>
                          {selectedShop.category === 'Bar & Club' ? t[lang].profile.tabEvents : t[lang].profile.tabServices}
                        </button>
                        <button onClick={() => setProfileTab('gallery')} className={`pb-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-colors border-b-4 bg-transparent outline-none cursor-pointer ${profileTab === 'gallery' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>{t[lang].profile.tabGallery}</button>
                        <button onClick={() => setProfileTab('about')} className={`pb-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-colors border-b-4 bg-transparent outline-none cursor-pointer ${profileTab === 'about' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>{t[lang].profile.about}</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-7">
                            
                            {/* BUKALEMUN SOL TARAF: CLUB İSE ETKİNLİKLER VE LOCALAR */}
                            {(profileTab === 'events' || profileTab === 'services') && selectedShop.category === 'Bar & Club' && (
                                <div className="animate-in fade-in flex flex-col gap-4">
                                    {bookingPhase === 1 ? (
                                        selectedShop.events && selectedShop.events.length > 0 ? (
                                            selectedShop.events.map(ev => (
                                                <div key={ev.id} onClick={() => { setBookingData({...bookingData, selectedEvent: ev, date: ev.date, time: ev.time}); setBookingPhase(2); }} 
                                                     className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-[24px] border-2 border-slate-100 hover:border-[#E8622A] cursor-pointer transition-all hover:shadow-md items-center">
                                                    <div className="w-full sm:w-32 h-40 sm:h-32 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                                                        {ev.image_url ? <img loading="lazy" decoding="async" src={ev.image_url} className="w-full h-full object-cover"/> : <Music size={32} className="text-slate-400"/>}
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-center text-center sm:text-left w-full">
                                                        <h4 className="font-black text-xl text-[#2D1B4E] uppercase mb-2 leading-tight">{ev.name}</h4>
                                                        <div className="flex items-center justify-center sm:justify-start gap-2 text-[#E8622A] font-bold text-sm mb-2">
                                                            <Calendar size={16}/> {ev.date} • {ev.time}
                                                        </div>
                                                        {ev.description && <p className="text-xs text-slate-500 font-medium line-clamp-2">{ev.description}</p>}
                                                    </div>
                                                    <div className="w-full sm:w-auto mt-2 sm:mt-0">
                                                        <button className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border-none outline-none bg-slate-100 text-slate-500 hover:bg-[#E8622A] hover:text-white cursor-pointer pointer-events-none">SEÇ</button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="bg-slate-50 border border-slate-200 p-10 rounded-[24px] text-center">
                                                <Music size={40} className="mx-auto text-slate-400 mb-4"/>
                                                <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Yaklaşan etkinlik bulunmuyor.</p>
                                            </div>
                                        )
                                    ) : (
                                        <>
                                            <button onClick={() => {setBookingData({...bookingData, selectedEvent: null, selectedShopService: null}); setBookingPhase(1);}} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#E8622A] bg-transparent border-none outline-none cursor-pointer flex items-center gap-1 w-fit mb-2">
                                                <ChevronLeft size={14}/> Etkinliklere Dön
                                            </button>
                                            
                                            {selectedShop.services && selectedShop.services.length > 0 ? (
                                                selectedShop.services.map(srv => {
                                                    const currentCount = appointments.filter(a => a.appointment_date === bookingData.selectedEvent?.date && a.service_name === srv.name && a.status !== 'İptal').length;
                                                    const maxCap = parseInt(srv.capacity || '10');
                                                    const isSoldOut = currentCount >= maxCap;
                                                    const priceDisplay = (!srv.price || srv.price === '0') ? 'ÜCRETSİZ' : `${srv.price} TL`;

                                                    return (
                                                        <div key={srv.id} onClick={() => { if(!isSoldOut) { setBookingData({...bookingData, selectedShopService: srv}); setBookingPhase(3); } }} 
                                                             className={`p-6 bg-white rounded-[24px] border-2 flex justify-between items-center transition-all ${isSoldOut ? 'border-slate-200 opacity-60 cursor-not-allowed' : bookingData.selectedShopService?.id === srv.id ? 'border-[#E8622A] shadow-md scale-[1.02] cursor-pointer' : 'border-slate-100 hover:border-[#E8622A] cursor-pointer'}`}>
                                                            <div>
                                                                <h4 className="font-black text-lg text-[#2D1B4E] mb-1">{srv.name}</h4>
                                                                <div className="flex items-center gap-1 text-slate-400">
                                                                    <Music size={12}/>
                                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Gece Boyu</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-6">
                                                                <span className="font-black text-xl text-[#2D1B4E]">{priceDisplay}</span>
                                                                <button disabled={isSoldOut} className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all border-none outline-none ${isSoldOut ? 'bg-red-50 text-red-500' : bookingData.selectedShopService?.id === srv.id ? 'bg-[#E8622A] text-white cursor-pointer' : 'bg-slate-50 text-slate-500 hover:bg-slate-200 cursor-pointer'}`}>
                                                                    {isSoldOut ? 'TÜKENDİ' : 'SEÇ'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                                <div className="bg-slate-50 border border-slate-200 p-10 rounded-[24px] text-center">
                                                    <Ticket size={40} className="mx-auto text-slate-400 mb-4"/>
                                                    <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loca listesi bulunamadı.</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* BUKALEMUN SOL TARAF: NORMAL İŞLETME İSE HİZMETLER */}
                            {(profileTab === 'services' || profileTab === 'events') && selectedShop.category !== 'Bar & Club' && (
                                <div className="animate-in fade-in flex flex-col gap-4">
                                    {selectedShop.services && selectedShop.services.length > 0 ? (
                                        selectedShop.services.map(srv => (
                                            <div key={srv.id} onClick={() => { setBookingData({...bookingData, selectedShopService: srv, selectedStaff: null, time: ''}); setBookingPhase(2); }} 
                                                 className={`p-6 bg-white rounded-[24px] border-2 flex justify-between items-center cursor-pointer transition-all ${bookingData.selectedShopService?.id === srv.id ? 'border-[#E8622A] shadow-md scale-[1.02]' : 'border-slate-100 hover:border-[#E8622A]'}`}>
                                                <div>
                                                    <h4 className="font-black text-lg text-[#2D1B4E] mb-1">{srv.name}</h4>
                                                    <div className="flex items-center gap-1 text-slate-400">
                                                        <Clock size={12}/>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{srv.duration} Dakika</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <span className="font-black text-xl text-[#2D1B4E]">{!srv.price || srv.price === '0' ? 'ÜCRETSİZ' : `${srv.price} TL`}</span>
                                                    <button className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all border-none outline-none cursor-pointer ${bookingData.selectedShopService?.id === srv.id ? 'bg-[#E8622A] text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-200'}`}>
                                                        {t[lang].profile.bookBtn}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-slate-50 border border-slate-200 p-10 rounded-[24px] text-center">
                                            <Scissors size={40} className="mx-auto text-slate-400 mb-4"/>
                                            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">{t[lang].profile.noServices}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {profileTab === 'gallery' && (
                                <div className="animate-in fade-in">
                                    {selectedShop.gallery && selectedShop.gallery.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {selectedShop.gallery.map((imgUrl, idx) => (
                                                <div key={idx} onClick={() => setLightboxImg(imgUrl)} className="w-full h-40 md:h-48 rounded-2xl overflow-hidden cursor-pointer group relative border border-slate-200">
                                                    <img loading="lazy" decoding="async" src={imgUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Search className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24}/>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 border border-slate-200 p-10 rounded-[24px] text-center">
                                            <Grid size={40} className="mx-auto text-slate-400 mb-4"/>
                                            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">{t[lang].profile.noGallery}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {profileTab === 'about' && (
                                <div className="animate-in fade-in">
                                    {(selectedShop.contact_phone || selectedShop.contact_insta || selectedShop.contact_email) && (
                                        <div className="mb-10 bg-slate-50 border border-slate-200 p-6 rounded-[24px]">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">{t[lang].profile.contactTitle}</h3>
                                            <div className="flex flex-col gap-3">
                                                {selectedShop.contact_phone && (<a href={`tel:${selectedShop.contact_phone}`} className="flex items-center gap-3 text-[#2D1B4E] font-bold hover:text-[#E8622A]"><Phone size={16} className="text-[#E8622A]"/> {selectedShop.contact_phone}</a>)}
                                                {selectedShop.contact_insta && (<a href={selectedShop.contact_insta.startsWith('http') ? selectedShop.contact_insta : `https://instagram.com/${selectedShop.contact_insta.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#2D1B4E] font-bold hover:text-pink-500"><InstagramIcon size={16} className="text-pink-500"/> {selectedShop.contact_insta}</a>)}
                                                {selectedShop.contact_email && (<a href={`mailto:${selectedShop.contact_email}`} className="flex items-center gap-3 text-[#2D1B4E] font-bold hover:text-[#E8622A]"><Mail size={16} className="text-[#E8622A]"/> {selectedShop.contact_email}</a>)}
                                            </div>
                                        </div>
                                    )}
                                    <div className="bg-white border border-slate-200 p-8 rounded-[24px] shadow-sm">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">{t[lang].profile.about}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed font-medium whitespace-pre-wrap">{selectedShop.description || <span className="italic opacity-50">{t[lang].profile.noDesc}</span>}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-5 relative">
                            <div className="sticky top-28 bg-white border-2 border-slate-200 rounded-[32px] p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)] flex flex-col min-h-[450px]">
                                
                                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                    <h3 className="text-xl font-black uppercase tracking-tight text-[#2D1B4E]">{t[lang].book.details}</h3>
                                    {bookingPhase > 1 && (
                                        <button onClick={() => {
                                            if (selectedShop.category === 'Bar & Club' && bookingPhase === 2) {
                                                setBookingPhase(1); setBookingData({...bookingData, selectedEvent: null});
                                            } else {
                                                setBookingPhase(bookingPhase - 1);
                                            }
                                        }} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#E8622A] bg-slate-50 px-3 py-1.5 rounded-lg flex items-center transition-colors border-none outline-none cursor-pointer">
                                            <ChevronLeft size={14} className="mr-1"/> {t[lang].book.change}
                                        </button>
                                    )}
                                </div>

                                {bookingPhase === 1 && (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                                        {selectedShop.category === 'Bar & Club' ? (
                                            <>
                                                <Music size={40} className="text-slate-400 mb-4" />
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed max-w-[200px]">{t[lang].book.selectEvent}</p>
                                            </>
                                        ) : (
                                            <>
                                                <Scissors size={40} className="text-slate-400 mb-4" />
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed max-w-[200px]">{t[lang].book.selectService}</p>
                                            </>
                                        )}
                                    </div>
                                )}
                                
                                {bookingPhase === 2 && selectedShop.category === 'Bar & Club' && (
                                    <div className="flex-1 flex flex-col animate-in fade-in duration-300">
                                        <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t[lang].book.event}</span>
                                                <span className="font-black text-[#2D1B4E] text-sm text-right">{bookingData.selectedEvent?.name}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t[lang].book.dateTime}</span>
                                                <span className="font-bold text-[#E8622A] text-xs text-right">{bookingData.selectedEvent?.date} | {bookingData.selectedEvent?.time}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                                            <Ticket size={40} className="text-slate-400 mb-4" />
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed max-w-[200px]">{t[lang].book.selectLoca}</p>
                                        </div>
                                    </div>
                                )}

                                {bookingPhase > 1 && (selectedShop.category !== 'Bar & Club' || bookingPhase > 2) && (
                                    <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2 animate-in fade-in">
                                        {selectedShop.category === 'Bar & Club' && (
                                            <>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t[lang].book.event}</span>
                                                    <span className="font-black text-[#2D1B4E] text-sm text-right">{bookingData.selectedEvent?.name}</span>
                                                </div>
                                                <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t[lang].book.dateTime}</span>
                                                    <span className="font-bold text-[#E8622A] text-xs text-right">{bookingData.selectedEvent?.date} | {bookingData.selectedEvent?.time}</span>
                                                </div>
                                            </>
                                        )}

                                        <div className={`flex justify-between items-center ${selectedShop.category === 'Bar & Club' ? 'border-t border-slate-100 pt-2' : ''}`}>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t[lang].book.service}</span>
                                            <span className="font-black text-[#2D1B4E] text-sm text-right">{bookingData.selectedShopService?.name}</span>
                                        </div>
                                        
                                        {bookingPhase > 2 && bookingData.selectedStaff && selectedShop.category !== 'Bar & Club' && (
                                            <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t[lang].book.staff}</span>
                                                <span className="font-bold text-[#2D1B4E] text-xs uppercase text-right">{bookingData.selectedStaff.name}</span>
                                            </div>
                                        )}
                                        {bookingPhase > 3 && bookingData.time && selectedShop.category !== 'Bar & Club' && (
                                            <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t[lang].book.dateTime}</span>
                                                <span className="font-bold text-[#E8622A] text-xs text-right">{bookingData.date} | {bookingData.time}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center border-t border-slate-100 pt-2 mt-1">
                                            <span className="text-[10px] font-black text-[#2D1B4E] uppercase tracking-widest">{t[lang].book.total}</span>
                                            <span className="font-black text-[#E8622A] text-lg text-right">{(!bookingData.selectedShopService?.price || bookingData.selectedShopService?.price === '0') ? 'ÜCRETSİZ' : `${bookingData.selectedShopService?.price} TL`}</span>
                                        </div>
                                    </div>
                                )}

                                {bookingPhase === 2 && selectedShop.category !== 'Bar & Club' && (
                                    <div className="animate-in slide-in-from-right-4 fade-in duration-300 flex-1">
                                        <p className="text-[11px] font-black uppercase tracking-widest text-[#2D1B4E] mb-4 flex items-center gap-2"><Users size={14} className="text-[#E8622A]"/> {t[lang].book.selectStaff}</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div onClick={() => { setBookingData({...bookingData, selectedStaff: { name: t[lang].book.anyStaff }}); setBookingPhase(3); }} 
                                                 className="flex flex-col items-center gap-2 cursor-pointer p-3 rounded-2xl border-2 border-transparent hover:border-[#E8622A] bg-white shadow-sm hover:shadow-md transition-all">
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-50 text-slate-400"><Users size={20}/></div>
                                                <span className="text-[9px] font-black text-center text-slate-500 uppercase">{t[lang].book.anyStaff}</span>
                                            </div>
                                            {selectedShop.staff?.map(person => (
                                                <div key={person.id} onClick={() => { setBookingData({...bookingData, selectedStaff: person}); setBookingPhase(3); }} 
                                                     className="flex flex-col items-center gap-2 cursor-pointer p-3 rounded-2xl border-2 border-transparent hover:border-[#E8622A] bg-white shadow-sm hover:shadow-md transition-all">
                                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-50 text-slate-400"><UserCircle size={24}/></div>
                                                    <span className="text-[9px] font-black text-center text-slate-500 uppercase truncate w-full px-1">{person.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {bookingPhase === 3 && selectedShop.category !== 'Bar & Club' && (() => {
                                    const currentAvailableSlots = getCurrentAvailableSlots();
                                    const isShopClosedToday = currentAvailableSlots.length === 0;

                                    return (
                                        <div className="animate-in slide-in-from-right-4 fade-in duration-300 flex-1 flex flex-col gap-4">
                                            <div className="flex items-center gap-2 text-[#2D1B4E] font-black text-[11px] uppercase tracking-widest">
                                                <Calendar size={14} className="text-[#E8622A]"/> {t[lang].book.date} / {t[lang].book.time}
                                            </div>
                                            <input type="date" min={new Date().toISOString().split('T')[0]} value={bookingData.date} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] text-sm cursor-pointer transition-colors shadow-inner" onChange={(e) => setBookingData({...bookingData, date: e.target.value, time: ''})} />
                                            
                                            {bookingData.date && (
                                                isShopClosedToday ? (
                                                    <div className="py-10 text-center text-red-500 font-bold uppercase tracking-widest text-xs bg-red-50 rounded-2xl border border-red-100 mt-2">
                                                        <CalendarOff size={32} className="mx-auto mb-2 opacity-50"/>
                                                        {t[lang].book.shopClosed}
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-3 gap-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar mt-2">
                                                        {currentAvailableSlots.map((slot, idx) => {
                                                            const neededSlots = getRequiredSlots(bookingData.selectedShopService.duration);
                                                            const slotsToCheck = currentAvailableSlots.slice(idx, idx + neededSlots);
                                                            let isUnavailable = false;
                                                            
                                                            if (slotsToCheck.length < neededSlots) {
                                                                isUnavailable = true; 
                                                            } else {
                                                                if (bookingData.selectedStaff?.name === t[lang].book.anyStaff || bookingData.selectedStaff?.name === 'Fark Etmez') {
                                                                    if (selectedShop.staff && selectedShop.staff.length > 0) {
                                                                        const anyStaffFree = selectedShop.staff.some(staff => {
                                                                            return slotsToCheck.every(checkSlot => {
                                                                                if (closedSlots.includes(checkSlot)) return false;
                                                                                const isBooked = appointments.some(a => a.staff_name === staff.name && (a.occupied_slots ? a.occupied_slots.includes(checkSlot) : a.appointment_time === checkSlot));
                                                                                return !isBooked;
                                                                            });
                                                                        });
                                                                        isUnavailable = !anyStaffFree;
                                                                    } else {
                                                                        isUnavailable = slotsToCheck.some(checkSlot => closedSlots.includes(checkSlot) || appointments.some(a => a.occupied_slots ? a.occupied_slots.includes(checkSlot) : a.appointment_time === checkSlot));
                                                                    }
                                                                } else {
                                                                    isUnavailable = slotsToCheck.some(checkSlot => {
                                                                        if (closedSlots.includes(checkSlot)) return true;
                                                                        return appointments.some(a => a.staff_name === bookingData.selectedStaff.name && (a.occupied_slots ? a.occupied_slots.includes(checkSlot) : a.appointment_time === checkSlot));
                                                                    });
                                                                }
                                                            }

                                                            return (
                                                                <button key={slot} disabled={isUnavailable} onClick={() => { setBookingData({...bookingData, time: slot}); setBookingPhase(4); }} 
                                                                        className={`p-3 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${isUnavailable ? 'bg-slate-50 border-transparent text-slate-300 cursor-not-allowed' : bookingData.time === slot ? 'bg-[#E8622A] text-white border-[#E8622A] shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-[#E8622A] hover:text-[#E8622A]'}`}>
                                                                    {slot}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    );
                                })()}

                                {(bookingPhase === 4 || (selectedShop.category === 'Bar & Club' && bookingPhase === 3)) && (
                                    <form onSubmit={handleBooking} className="animate-in slide-in-from-right-4 fade-in duration-300 flex flex-col gap-3 flex-1 mt-auto">
                                        <div className="flex items-center gap-2 text-[#2D1B4E] font-black text-[11px] uppercase tracking-widest mb-1 border-t border-slate-100 pt-4">
                                            <User size={14} className="text-[#E8622A]"/> {t[lang].book.contactInfo}
                                        </div>
                                        <div className="flex gap-2 w-full">
                                          <input required placeholder={t[lang].book.name} className="w-full bg-slate-50 border border-slate-200 rounded-[14px] py-4 px-4 outline-none focus:border-[#E8622A] font-bold text-xs text-[#2D1B4E] transition-colors" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                          <input required placeholder={t[lang].book.surname} className="w-full bg-slate-50 border border-slate-200 rounded-[14px] py-4 px-4 outline-none focus:border-[#E8622A] font-bold text-xs text-[#2D1B4E] transition-colors" onChange={(e) => setFormData({...formData, surname: e.target.value})} />
                                        </div>
                                        
                                        <div className="flex gap-2 w-full relative">
                                          <select className="bg-slate-50 border border-slate-200 rounded-[14px] py-4 px-3 outline-none focus:border-[#E8622A] font-bold text-xs text-[#2D1B4E] cursor-pointer w-28 shrink-0" value={formData.phoneCode} onChange={e => setFormData({...formData, phoneCode: e.target.value})}>
                                              <option value="+90">TR (+90)</option>
                                              <option value="+357">CY (+357)</option>
                                              <option value="+44">UK (+44)</option>
                                          </select>
                                          <div className="relative flex-1">
                                              <input required type="tel" placeholder={t[lang].book.phone} className="w-full bg-slate-50 border border-slate-200 rounded-[14px] py-4 px-4 pr-10 outline-none focus:border-[#E8622A] font-bold text-xs text-[#2D1B4E] transition-colors" onChange={handleBookingPhoneChange} />
                                              {bookingPhoneValid === true && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={16}/>}
                                              {bookingPhoneValid === false && <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={16}/>}
                                          </div>
                                        </div>

                                        <div className="relative w-full">
                                            <input required type="email" placeholder={t[lang].book.email} className="w-full bg-slate-50 border border-slate-200 rounded-[14px] py-4 px-4 pr-10 outline-none focus:border-[#E8622A] font-bold text-xs text-[#2D1B4E] transition-colors" onChange={handleBookingEmailChange} />
                                            {bookingEmailValid === true && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={16}/>}
                                            {bookingEmailValid === false && <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={16}/>}
                                        </div>
                                        
                                        <button type="submit" disabled={bookingEmailValid === false || bookingPhoneValid === false} className="w-full bg-[#E8622A] text-white py-5 rounded-[14px] mt-2 uppercase font-black text-xs tracking-widest shadow-xl shadow-[#E8622A]/20 border-none cursor-pointer hover:bg-orange-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                            {t[lang].book.btnBook}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* BENZER MEKANLAR */}
                    {similarShops && similarShops.length > 0 && (
                        <div className="mt-20 pt-16 border-t border-slate-200">
                            <h3 className="text-2xl font-black uppercase tracking-tight text-[#2D1B4E] mb-8">{t[lang].profile.similarTitle}</h3>
                            <div className="featured-grid">
                                {similarShops.map((shop) => (
                                    <div key={shop.id} onClick={() => { setSelectedShop(shop); setStep('shop_profile'); setProfileTab(shop.category === 'Bar & Club' ? 'events' : 'services'); setBookingData({date: new Date().toISOString().split('T')[0], time:'', selectedShopService: null, selectedStaff: null, selectedEvent: null}); setBookingPhase(1); window.scrollTo(0,0); }} className="venue-card flex flex-col cursor-pointer bg-white border border-slate-200 hover:border-[#E8622A] transition-colors">
                                        <div className="venue-img" style={{background: '#f8fafc'}}>
                                            {shop.cover_url || shop.logo_url ? <img loading="lazy" decoding="async" src={shop.cover_url || shop.logo_url} /> : categories.find(c=>c.dbName===shop.category)?.emoji}
                                            {(shop.package === 'Premium' || shop.package === 'Premium Paket') && <div className="venue-badge hot">🔥 VIP</div>}
                                            <div className="venue-fav"><HeartHandshake size={14}/></div>
                                        </div>
                                        <div className="venue-info p-5">
                                            <div className="venue-cat">{t[lang].cats[categories.find(c => c.dbName === shop.category)?.key || 'barber']}</div>
                                            <div className="venue-name">{shop.name}</div>
                                            <div className="venue-meta">
                                                <span>📍 {shop.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* BAŞARILI RANDEVU & YENİ DEĞERLENDİRME (POP-UP) EKRANI */}
        {step === 'success' && (
          <div className="text-center py-20 px-4 animate-in zoom-in-95 min-h-[60vh] flex flex-col items-center justify-center max-w-[600px] mx-auto">
            
            {!feedbackSubmitted ? (
              <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-slate-200 w-full animate-in slide-in-from-bottom-4">
                <div className="w-20 h-20 bg-[#00c48c] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#2D1B4E] uppercase mb-2 tracking-tight">{t[lang].book.success}</h2>
                <p className="text-slate-400 uppercase text-[10px] font-bold tracking-[0.2em] mb-10">{t[lang].book.successSub}</p>
                
                {/* POP-UP DEĞERLENDİRME FORMU */}
                <div className="border-t border-slate-100 pt-8 mt-4">
                  <h3 className="font-black text-xl text-[#2D1B4E] mb-2 uppercase flex items-center justify-center gap-2">
                    <Star className="text-yellow-400 fill-yellow-400" size={24}/> Bizi Değerlendirin
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Puanınız bizim için çok değerli</p>
                  
                  <form onSubmit={submitFeedback} className="text-left space-y-6">
                    <div>
                      <label className="text-xs font-black uppercase text-[#2D1B4E]">Platformumuzu nasıl buldunuz?</label>
                      {renderFeedbackScale('q1')}
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-[#2D1B4E]">Kullanımı kolay mı?</label>
                      {renderFeedbackScale('q2')}
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-[#2D1B4E]">İşleminizden memnun musunuz?</label>
                      {renderFeedbackScale('q3')}
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-[#2D1B4E]">Hızlı işlem yapabildiniz mi?</label>
                      {renderFeedbackScale('q4')}
                    </div>
                    <button type="submit" className="w-full bg-[#2D1B4E] hover:bg-[#1a0f2e] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg mt-4 border-none cursor-pointer transition-all">
                      Gönder ve Tamamla
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[32px] p-8 md:p-16 shadow-2xl border border-slate-200 w-full animate-in zoom-in-95">
                <div className="w-24 h-24 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Star fill="currentColor" size={48}/>
                </div>
                <h2 className="text-3xl font-black text-[#2D1B4E] uppercase mb-4 tracking-tight">Teşekkür Ederiz!</h2>
                <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">Değerlendirmeniz başarıyla bize ulaştı. Platformumuzu sizin için geliştirmeye devam ediyoruz.</p>
                <button onClick={() => {setStep('services'); setBookingData({date:'', time:'', selectedShopService: null, selectedStaff: null, selectedEvent: null}); setBookingPhase(1); setFeedbackSubmitted(false); setFeedbackData({q1:null,q2:null,q3:null,q4:null}); window.scrollTo(0,0);}} className="btn-primary mx-auto px-10 py-4 text-xs tracking-widest shadow-xl border-none cursor-pointer">
                  {t[lang].book.backHome}
                </button>
              </div>
            )}
          </div>
        )}

        {/* HAKKIMIZDA & PAKETLER SAYFASI (YENİ MODERN SAAS TASARIMI) */}
        {step === 'about' && (
            <div className="w-full bg-[#FAF7F2] animate-in fade-in overflow-hidden">
                {/* 1. HERO ALANI */}
                <div className="bg-[#2D1B4E] pt-32 pb-24 px-4 md:px-8 text-center relative overflow-hidden border-b border-slate-800">
                    <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-[#E8622A]/20 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-[#F5C5A3]/20 rounded-full blur-[100px] pointer-events-none"></div>
                    
                    <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block border border-white/20 relative z-10">Kıbrıs'ın #1 Randevu Platformu</span>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 relative z-10">İşletmeni Dijitale Taşı,<br/><span className="text-[#E8622A]">Müşterilerini Katla</span></h1>
                    <p className="text-lg md:text-xl font-medium text-slate-300 max-w-2xl mx-auto leading-relaxed relative z-10 mb-10">Kıbrıs’taki en iyi işletmeler artık Bookcy’de. Sen de yerini al, müşterilerine 7/24 ulaş, randevularını otomatik yönet.</p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <button onClick={() => {setShowRegister(true); window.scrollTo(0,0);}} className="bg-[#E8622A] hover:bg-[#d4561f] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_30px_rgba(232,98,42,0.4)] border-none cursor-pointer w-full sm:w-auto">Hemen Başla</button>
                        <button onClick={() => {setShowRegister(true); window.scrollTo(0,0);}} className="bg-transparent border-2 border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm transition-all cursor-pointer w-full sm:w-auto">İşletmeni Ekle</button>
                    </div>
                </div>

                {/* 2. BİZ KİMİZ */}
                <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-20 text-center">
                    <h2 className="text-sm font-black text-[#E8622A] uppercase tracking-[0.3em] mb-4">Biz Kimiz?</h2>
                    <p className="text-xl md:text-3xl text-[#2D1B4E] font-black leading-tight mb-8">Bookcy, Kıbrıs’ta kurulan ilk ve tek kapsamlı online randevu platformlarından biri olarak, işletmelerin dijital dönüşümünü hızlandırmak için geliştirilmiştir.</p>
                    <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto mb-8">Güzellikten bakıma, spadan yaşam tarzı hizmetlerine kadar birçok sektörü tek çatı altında buluşturarak, hem işletmelere hem müşterilere yeni nesil bir deneyim sunuyoruz.</p>
                    <div className="bg-[#2D1B4E] text-white p-6 md:p-8 rounded-[24px] inline-block font-bold text-lg md:text-xl shadow-xl">
                        Biz sadece bir randevu sistemi değiliz — <br/><span className="text-[#E8622A]">işletmelerin büyümesini sağlayan dijital altyapıyız.</span>
                    </div>
                </div>

                {/* 3. NEDEN BİZ? */}
                <div className="bg-white py-20 border-y border-slate-200">
                    <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#2D1B4E] mb-4">Neden Biz?</h2>
                            <p className="text-slate-500 font-medium">Sadece bir randevu sistemi değil, kişisel bakım yolculuğunuzun en güvenilir ortağıyız.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-slate-50 p-8 rounded-[24px] border border-slate-200">
                                <div className="w-12 h-12 bg-white text-[#E8622A] rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100"><Crown size={24}/></div>
                                <h3 className="font-black text-lg text-[#2D1B4E] mb-3">Öncü Platform</h3>
                                <p className="text-sm text-slate-500 font-medium">Kıbrıs’ta ilk ve öncü randevu platformlarından biri.</p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-[24px] border border-slate-200">
                                <div className="w-12 h-12 bg-white text-[#E8622A] rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100"><Grid size={24}/></div>
                                <h3 className="font-black text-lg text-[#2D1B4E] mb-3">Entegre Sistem</h3>
                                <p className="text-sm text-slate-500 font-medium">Farklı sektörleri kapsayan tek entegre sistem.</p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-[24px] border border-slate-200">
                                <div className="w-12 h-12 bg-white text-[#E8622A] rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100"><Users size={24}/></div>
                                <h3 className="font-black text-lg text-[#2D1B4E] mb-3">Gerçek Müşteri</h3>
                                <p className="text-sm text-slate-500 font-medium">İşletmelere gerçek müşteri kazandıran aktif trafik.</p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-[24px] border border-slate-200">
                                <div className="w-12 h-12 bg-white text-[#E8622A] rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100"><Smartphone size={24}/></div>
                                <h3 className="font-black text-lg text-[#2D1B4E] mb-3">Üst Düzey Arayüz</h3>
                                <p className="text-sm text-slate-500 font-medium">Sade, hızlı ve kullanıcı dostu modern tasarım.</p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-[24px] border border-slate-200">
                                <div className="w-12 h-12 bg-white text-[#E8622A] rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100"><TrendingUp size={24}/></div>
                                <h3 className="font-black text-lg text-[#2D1B4E] mb-3">Maksimum Kazanç</h3>
                                <p className="text-sm text-slate-500 font-medium">Komisyonsuz model ile gelirinizi katlayın.</p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-[24px] border border-slate-200">
                                <div className="w-12 h-12 bg-white text-[#E8622A] rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100"><MessageSquare size={24}/></div>
                                <h3 className="font-black text-lg text-[#2D1B4E] mb-3">Gelişmiş Otomasyon</h3>
                                <p className="text-sm text-slate-500 font-medium">Yakında eklenecek SMS ve gelişmiş bildirim sistemleri.</p>
                            </div>
                        </div>
                        <div className="text-center mt-12 font-black text-[#2D1B4E] text-lg bg-orange-50 py-4 rounded-xl border border-orange-100">
                            👉 Bookcy, sadece bir platform değil, işletmenizin büyüme motorudur.
                        </div>
                    </div>
                </div>

                {/* 4. İŞLETMELER VE MÜŞTERİLER İÇİN BÖLÜMLERİ */}
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* İŞLETMELER İÇİN */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-[#2D1B4E] text-white rounded-xl flex items-center justify-center"><Store size={24}/></div>
                                <h2 className="text-3xl font-black uppercase text-[#2D1B4E] tracking-tight">İşletmeler İçin</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="mt-1"><CheckCircle2 className="text-[#E8622A]" size={24}/></div>
                                    <div>
                                        <h4 className="font-black text-lg text-[#2D1B4E] mb-1">Daha Fazla Müşteri, Daha Fazla Kazanç</h4>
                                        <p className="text-sm text-slate-500 font-medium">Platformumuz sayesinde binlerce potansiyel müşteriye anında ulaşın.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1"><CheckCircle2 className="text-[#E8622A]" size={24}/></div>
                                    <div>
                                        <h4 className="font-black text-lg text-[#2D1B4E] mb-1">Tüm Yönetim Tek Panelde</h4>
                                        <p className="text-sm text-slate-500 font-medium">Randevularınızı, personelinizi ve hizmetlerinizi kolayca yönetin.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1"><CheckCircle2 className="text-[#E8622A]" size={24}/></div>
                                    <div>
                                        <h4 className="font-black text-lg text-[#2D1B4E] mb-1">Akıllı Hatırlatmalar</h4>
                                        <p className="text-sm text-slate-500 font-medium">E-posta bildirimleri ile randevu kaçırma oranını minimuma indirin. <span className="italic opacity-70">(SMS altyapısı çok yakında aktif olacaktır.)</span></p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1"><CheckCircle2 className="text-[#E8622A]" size={24}/></div>
                                    <div>
                                        <h4 className="font-black text-lg text-[#2D1B4E] mb-1">Güçlü Dijital Kimlik</h4>
                                        <p className="text-sm text-slate-500 font-medium">Modern profil sayfanız ile profesyonel ve güvenilir bir imaj oluşturun.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MÜŞTERİLER İÇİN */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-slate-100 text-[#E8622A] rounded-xl flex items-center justify-center border border-slate-200"><User size={24}/></div>
                                <h2 className="text-3xl font-black uppercase text-[#2D1B4E] tracking-tight">Müşteriler İçin</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="mt-1"><Star className="text-yellow-500 fill-yellow-500" size={24}/></div>
                                    <div>
                                        <h4 className="font-black text-lg text-[#2D1B4E] mb-1">En İyileri Keşfet</h4>
                                        <p className="text-sm text-slate-500 font-medium">Konumuna en yakın ve en yüksek puanlı işletmeleri saniyeler içinde bul.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1"><Clock className="text-[#E8622A]" size={24}/></div>
                                    <div>
                                        <h4 className="font-black text-lg text-[#2D1B4E] mb-1">7/24 Randevu Özgürlüğü</h4>
                                        <p className="text-sm text-slate-500 font-medium">İstediğin zaman, istediğin yerden randevunu oluştur.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1"><MessageCircle className="text-[#E8622A]" size={24}/></div>
                                    <div>
                                        <h4 className="font-black text-lg text-[#2D1B4E] mb-1">Gerçek Yorumlar</h4>
                                        <p className="text-sm text-slate-500 font-medium">Sadece hizmet almış kullanıcıların yorumlarını incele, güvenle seçim yap.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. FİYATLANDIRMA BÖLÜMÜ */}
                <div className="bg-slate-50 py-24 border-y border-slate-200">
                    <div className="max-w-[1000px] mx-auto px-4 md:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#2D1B4E] mb-4">Paketlerimiz</h2>
                            <p className="text-slate-500 font-medium">Sürpriz kesintiler yok, gizli ücretler yok.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* STANDART PAKET */}
                            <div className="bg-white border border-slate-200 rounded-[32px] p-8 md:p-10 shadow-lg flex flex-col hover:border-[#E8622A] transition-colors">
                                <h3 className="text-2xl font-black text-[#2D1B4E] mb-2">Standart Paket</h3>
                                <div className="flex items-baseline gap-2 mb-8 border-b border-slate-100 pb-8">
                                    <span className="text-4xl font-black text-[#2D1B4E]">60 STG</span>
                                    <span className="text-slate-500 font-bold">/ Aylık</span>
                                </div>
                                <ul className="flex flex-col gap-5 mb-10 flex-1">
                                    <li className="flex items-center gap-3 font-bold text-slate-600 text-sm"><Check className="text-[#E8622A]" size={20}/> Online randevu sistemi</li>
                                    <li className="flex items-center gap-3 font-bold text-slate-600 text-sm"><Check className="text-[#E8622A]" size={20}/> Sınırsız randevu</li>
                                    <li className="flex items-center gap-3 font-bold text-slate-600 text-sm"><Check className="text-[#E8622A]" size={20}/> İşletme profil sayfası</li>
                                    <li className="flex items-center gap-3 font-bold text-slate-600 text-sm"><Check className="text-[#E8622A]" size={20}/> E-posta hatırlatma sistemi</li>
                                    <li className="flex items-center gap-3 font-bold text-slate-600 text-sm"><Check className="text-[#E8622A]" size={20}/> Müşteri yönetimi</li>
                                    <li className="flex items-center gap-3 font-bold text-slate-600 text-sm"><Check className="text-[#E8622A]" size={20}/> Temel raporlama</li>
                                </ul>
                                <button onClick={() => {setShowRegister(true); window.scrollTo(0,0);}} className="w-full bg-slate-100 text-[#2D1B4E] hover:bg-slate-200 hover:text-[#E8622A] py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-colors cursor-pointer border-none">Hemen Başla</button>
                            </div>

                            {/* PREMIUM PAKET (ÖNE ÇIKAN) */}
                            <div className="bg-[#2D1B4E] border-2 border-[#E8622A] rounded-[32px] p-8 md:p-10 shadow-[0_20px_50px_rgba(232,98,42,0.2)] flex flex-col relative transform md:scale-105 z-10">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#E8622A] text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                                    <Star className="fill-white" size={14}/> En Popüler
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2 mt-4">Premium Paket</h3>
                                <div className="flex items-baseline gap-2 mb-8 border-b border-white/10 pb-8">
                                    <span className="text-5xl font-black text-[#E8622A]">100 STG</span>
                                    <span className="text-slate-400 font-bold">/ Aylık</span>
                                </div>
                                <ul className="flex flex-col gap-5 mb-10 flex-1">
                                    <li className="flex items-center gap-3 font-bold text-white text-sm"><CheckCircle2 className="text-[#E8622A]" size={20}/> Tüm Standart özellikler</li>
                                    <li className="flex items-center gap-3 font-bold text-white text-sm"><CheckCircle2 className="text-[#E8622A]" size={20}/> Öncelikli listeleme (Görünürlük)</li>
                                    <li className="flex items-center gap-3 font-bold text-white text-sm"><CheckCircle2 className="text-[#E8622A]" size={20}/> Gelişmiş raporlama ve analiz</li>
                                    <li className="flex items-center gap-3 font-bold text-white text-sm"><CheckCircle2 className="text-[#E8622A]" size={20}/> Öne çıkan işletme rozeti</li>
                                    <li className="flex items-center gap-3 font-bold text-white text-sm"><CheckCircle2 className="text-[#E8622A]" size={20}/> Öncelikli destek</li>
                                    <li className="flex items-center gap-3 font-bold text-white text-sm"><CheckCircle2 className="text-[#E8622A]" size={20}/> Yeni özelliklere erken erişim</li>
                                </ul>
                                <button onClick={() => {setShowRegister(true); window.scrollTo(0,0);}} className="w-full bg-[#E8622A] hover:bg-[#d4561f] text-white py-5 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg cursor-pointer border-none flex items-center justify-center gap-2">Premium'a Geç <ArrowRight size={16}/></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. KAPANIŞ (CTA) */}
                <div className="bg-[#2D1B4E] py-24 px-4 text-center border-t border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full bg-[#E8622A]/10 blur-[100px] pointer-events-none"></div>
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white mb-6 tracking-tight">İşletmeni Bugün Dijitale Taşı</h2>
                        <p className="text-lg md:text-xl text-slate-300 font-medium mb-10 leading-relaxed">Rakiplerin hâlâ manuel sistemlerle uğraşırken, sen müşterilerini otomatik olarak yönetmeye başla.<br/><br/>👉 Şimdi katıl, farkı ilk günden hisset.</p>
                        <button onClick={() => {setShowRegister(true); window.scrollTo(0,0);}} className="bg-[#E8622A] hover:bg-[#d4561f] text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(232,98,42,0.4)] border-none cursor-pointer transition-transform hover:scale-105 inline-flex items-center gap-2">Ücretsiz Başla <ArrowRight size={18}/></button>
                    </div>
                </div>
            </div>
        )}

        {/* --- YASAL SAYFALAR (GİZLİLİK, KVKK, ŞARTLAR, ÇEREZLER) --- */}
        {['privacy', 'kvkk', 'terms', 'cookies'].includes(step) && (
            <div className="w-full bg-[#FAF7F2] animate-in fade-in pb-24">
                <div className="bg-white pt-32 pb-20 px-4 text-center border-b border-slate-200">
                    <div className="max-w-3xl mx-auto">
                        <span className="bg-slate-100 text-[#E8622A] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">Yasal Bildirim</span>
                        <h1 className="text-3xl md:text-5xl font-black text-[#2D1B4E] uppercase tracking-tighter mb-4">{t[lang].legal[`${step}Title`]}</h1>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{t[lang].legal.lastUpdated}</p>
                    </div>
                </div>
                
                <div className="max-w-3xl mx-auto px-4 md:px-8 mt-12 bg-white p-8 md:p-12 rounded-[32px] border border-slate-200 shadow-sm font-medium text-slate-600 leading-relaxed text-[15px]">
                    
                    {step === 'privacy' && (
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Giriş</h3>
                                <p>Bu Gizlilik Politikası, bookcy.co platformunu kullanan kullanıcıların kişisel verilerinin nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır. Platformu kullanarak bu politikayı kabul etmiş sayılırsınız.</p>
                            </section>
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Toplanan Veriler</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Ad, soyad</li>
                                    <li>E-posta adresi ve Telefon numarası</li>
                                    <li>Randevu bilgileri (tarih, saat, hizmet türü)</li>
                                    <li>Konum bilgisi (isteğe bağlı)</li>
                                    <li>IP adresi ve cihaz bilgileri</li>
                                    <li>Ödeme bilgileri (platformda saklanmaz, üçüncü taraf sağlayıcılar kullanılır)</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Verilerin Kullanım Amaçları</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Randevu oluşturma ve yönetme</li>
                                    <li>Kullanıcı hesabı yönetimi ve müşteri desteği sağlama</li>
                                    <li>Hizmet sağlayıcılarla eşleşme ve hizmet kalitesini artırma</li>
                                    <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Hukuki Dayanak ve Veri Paylaşımı</h3>
                                <p className="mb-2">Veriler açık rıza, sözleşmenin ifası, yasal yükümlülük ve meşru menfaat sebepleriyle işlenir. Aşağıdaki taraflarla paylaşılabilir:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Hizmet alınan işletmeler ve Ödeme sağlayıcıları</li>
                                    <li>Hosting ve teknik altyapı sağlayıcıları</li>
                                    <li>Yetkili resmi kurumlar (gerekli durumlarda)</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Kullanıcı Hakları & İletişim</h3>
                                <p className="mb-2">Verilere erişim, düzeltme, silme, işlemeye itiraz ve veri taşınabilirliği haklarına sahipsiniz. Veriler, SSL ve güvenli sunucularla korunmaktadır.</p>
                                <p className="mt-4 font-bold text-[#2D1B4E]">İletişim: info@bookcy.co</p>
                            </section>
                        </div>
                    )}

                    {step === 'kvkk' && (
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Veri Sorumlusu</h3>
                                <p>Bu metin kapsamında veri sorumlusu bookcy.co platformudur.</p>
                            </section>
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">İşlenen Kişisel Veriler ve Amaçları</h3>
                                <p className="mb-2">Kimlik, iletişim, işlem güvenliği ve randevu bilgileri aşağıdaki amaçlarla işlenmektedir:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Hizmet sunumu ve Randevu yönetimi</li>
                                    <li>Kullanıcı deneyimi geliştirme</li>
                                    <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Aktarım</h3>
                                <p className="mb-2">Kişisel verileriniz;</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Hizmet sağlayıcı işletmelere,</li>
                                    <li>Teknik altyapı firmalarına,</li>
                                    <li>Yasal zorunluluk halinde resmi kurumlara aktarılabilir.</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Haklar (KVKK Madde 11)</h3>
                                <p className="mb-2">Kullanıcılar;</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Veri işlenip işlenmediğini öğrenme,</li>
                                    <li>Bilgi talep etme, Düzeltme isteme, Silinmesini talep etme haklarına sahiptir.</li>
                                </ul>
                                <p className="mt-4 font-bold text-[#2D1B4E]">Başvurular info@bookcy.co üzerinden yapılabilir.</p>
                            </section>
                        </div>
                    )}

                    {step === 'terms' && (
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Hizmet Tanımı</h3>
                                <p>bookcy.co, kullanıcıların çeşitli hizmet sağlayıcılardan online randevu almasını sağlayan bir platformdur.</p>
                            </section>
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Kullanıcı Yükümlülükleri</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Doğru bilgi sağlamak</li>
                                    <li>Hesap güvenliğini korumak</li>
                                    <li>Platformu kötüye kullanmamak</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Hizmet Sağlayıcı Sorumluluğu & Sorumluluk Reddi</h3>
                                <p>Platform, yalnızca aracıdır. Sunulan hizmetlerin kalitesi doğrudan işletmelere aittir. bookcy.co, hizmet sağlayıcıların sunduğu hizmetlerden doğrudan sorumlu değildir.</p>
                            </section>
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Ödeme ve İptal</h3>
                                <p>Ödeme şartları hizmet sağlayıcıya bağlıdır. İptal politikaları işletmeye göre değişebilir.</p>
                            </section>
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Hesap Askıya Alma ve Değişiklikler</h3>
                                <p>Kurallara aykırı kullanım durumunda hesap askıya alınabilir. Şartlar önceden haber verilmeksizin güncellenebilir.</p>
                            </section>
                        </div>
                    )}

                    {step === 'cookies' && (
                        <div className="space-y-8">
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Çerez Nedir?</h3>
                                <p>Çerezler, kullanıcı deneyimini geliştirmek için kullanılan küçük veri dosyalarıdır.</p>
                            </section>
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Kullanılan Çerez Türleri</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Zorunlu çerezler</li>
                                    <li>Performans çerezleri</li>
                                    <li>Analitik çerezler</li>
                                    <li>Pazarlama çerezleri</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Kullanım Amacı</h3>
                                <p>Çerezler, site performansını artırmak, kullanıcı deneyimini iyileştirmek ve analiz yapmak amacıyla kullanılmaktadır.</p>
                            </section>
                            <section>
                                <h3 className="text-xl font-black text-[#2D1B4E] mb-3 uppercase">Çerez Yönetimi</h3>
                                <p>Kullanıcılar tarayıcı ayarlarından çerezleri kontrol edebilir veya silebilir.</p>
                            </section>
                        </div>
                    )}

                </div>
            </div>
        )}

      </main>

      <footer className="w-full bg-[#2D1B4E] pt-16 pb-8 px-6 text-white/60 text-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-white/10 pb-8">
          <div>
            <div className="text-2xl font-black text-white mb-4 flex items-baseline" style={{fontFamily:"'Plus Jakarta Sans',sans-serif"}}>bookcy<span className="text-[#E8622A]">.</span></div>
            <p className="mb-4">{t[lang].footer.desc}</p>
            <div className="flex gap-3">
              <a href="https://instagram.com/bookcy" target="_blank" className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white hover:bg-[#E8622A]"><InstagramIcon size={16}/></a>
              <a href="https://wa.me/905555555555" target="_blank" className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white hover:bg-[#E8622A]"><MessageCircle size={16}/></a>
              <a href="mailto:info@bookcy.co" className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white hover:bg-[#E8622A]"><Mail size={16}/></a>
            </div>
          </div>
          <div><h4 className="text-white font-black mb-4 tracking-widest">{t[lang].footer.links}</h4><button onClick={()=>setStep('services')} className="block mb-2 bg-transparent border-none text-white/60 cursor-pointer hover:text-white">Ana Sayfa</button><button onClick={()=>setStep('about')} className="block mb-2 bg-transparent border-none text-white/60 cursor-pointer hover:text-white">Hakkımızda</button><button onClick={()=>setShowRegister(true)} className="block mb-2 bg-transparent border-none text-white/60 cursor-pointer hover:text-[#E8622A]">İşletme Ekle</button></div>
          <div><h4 className="text-white font-black mb-4 tracking-widest">{t[lang].footer.cities}</h4>{cyprusRegions.map(r => <button key={r} onClick={()=>{setFilterRegion(r); setStep('all_shops'); window.scrollTo(0,0);}} className="block mb-2 bg-transparent border-none text-white/60 cursor-pointer hover:text-white">{r}</button>)}</div>
          <div><h4 className="text-white font-black mb-4 tracking-widest">{t[lang].footer.legal}</h4><button onClick={()=>{setStep('privacy'); window.scrollTo(0,0);}} className="block mb-2 bg-transparent border-none text-white/60 cursor-pointer hover:text-white">Gizlilik Politikası</button><button onClick={()=>{setStep('kvkk'); window.scrollTo(0,0);}} className="block mb-2 bg-transparent border-none text-white/60 cursor-pointer hover:text-white">KVKK</button><button onClick={()=>{setStep('terms'); window.scrollTo(0,0);}} className="block mb-2 bg-transparent border-none text-white/60 cursor-pointer hover:text-white">Kullanım Şartları</button><button onClick={()=>{setStep('cookies'); window.scrollTo(0,0);}} className="block mb-2 bg-transparent border-none text-white/60 cursor-pointer hover:text-white">Çerez Politikası</button></div>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4"><p>© {new Date().getFullYear()} BOOKCY KIBRIS. {t[lang].footer.copy}</p><p className="font-black text-[#E8622A]">One Click Booking™</p></div>
      </footer>
    </>
  );
}