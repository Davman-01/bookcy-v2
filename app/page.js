"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Star, ArrowRight, CheckCircle2, XCircle, ChevronLeft, ChevronRight, ChevronDown, 
  Phone, Calendar, Clock, Lock, Upload, Briefcase, MessageSquare, Mail, Target, TrendingUp, 
  Users, Crown, Search, Sliders, MessageCircle, Scissors, User, UserCircle, Smartphone, 
  Grid, X, Gem, Check, PieChart, Store, CalendarOff, Music, Ticket, HeartHandshake
} from 'lucide-react';

const supabase = { from: () => ({ select: () => ({ eq: async () => ({ data: [] }), then: (cb) => cb({ data: [] }) }), insert: async () => ({ error: null }) }), storage: { from: () => ({ upload: async () => ({ error: null }), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) } };
const InstagramIcon = ({ size = 24, className = "" }) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> );

function parseDuration(d) { const m = (d||'').match(/\d+/); return m ? parseInt(m[0]) : 30; }
function getRequiredSlots(d) { return Math.ceil(parseDuration(d) / 30); }

const allTimeSlots = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30","00:00","00:30","01:00","01:30","02:00"];
const defaultWorkingHours = [{day:'Pazartesi',open:'09:00',close:'19:00',isClosed:false},{day:'Salı',open:'09:00',close:'19:00',isClosed:false},{day:'Çarşamba',open:'09:00',close:'19:00',isClosed:false},{day:'Perşembe',open:'09:00',close:'19:00',isClosed:false},{day:'Cuma',open:'09:00',close:'19:00',isClosed:false},{day:'Cumartesi',open:'09:00',close:'19:00',isClosed:false},{day:'Pazar',open:'09:00',close:'19:00',isClosed:true}];
const cyprusRegions = ["Girne", "Lefkoşa", "Mağusa", "İskele", "Güzelyurt", "Lefke"];

export default function Home() {
  const router = useRouter(); 
  const [step, setStep] = useState('services'); const [shops, setShops] = useState([]); const [lang, setLang] = useState('TR');
  const [showFeaturesMenu, setShowFeaturesMenu] = useState(false); const [activeFeature, setActiveFeature] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null); const [bookingData, setBookingData] = useState({ date: new Date().toISOString().split('T')[0], time: '', selectedShopService: null, selectedStaff: null, selectedEvent: null });
  const [formData, setFormData] = useState({ name: '', surname: '', phoneCode: '+90', phone: '', email: '' }); const [bookingPhase, setBookingPhase] = useState(1);
  const [bookingEmailValid, setBookingEmailValid] = useState(null); const [bookingPhoneValid, setBookingPhoneValid] = useState(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false); const [feedbackData, setFeedbackData] = useState({ q1: null, q2: null, q3: null, q4: null });
  const [showRegister, setShowRegister] = useState(false); const [loggedInShop, setLoggedInShop] = useState(null);
  const [showLogin, setShowLogin] = useState(false); const [loginType, setLoginType] = useState('owner'); const [loginUsername, setLoginUsername] = useState(''); const [loginPassword, setLoginPassword] = useState(''); const [loginStaffName, setLoginStaffName] = useState(''); const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [filterRegion, setFilterRegion] = useState('All'); const [filterService, setFilterService] = useState('All'); const [filterSort, setFilterSort] = useState('High'); const [searchQuery, setSearchQuery] = useState('');
  const [newShop, setNewShop] = useState({ name:'', category:'Berber', location:'Girne', address:'', maps_link:'', phoneCode:'+90', contactPhone:'', contactInsta:'', contactEmail:'', username:'', password:'', email:'', description:'', logoFile:null, package:'Standart Paket' });
  const [isUploading, setIsUploading] = useState(false); const [registerSuccess, setRegisterSuccess] = useState(false);
  const [emailValid, setEmailValid] = useState(null); const [phoneValid, setPhoneValid] = useState(null); const [adminEmailValid, setAdminEmailValid] = useState(null);
  const [appointments, setAppointments] = useState([]); const [globalAppointments, setGlobalAppointments] = useState([]); const [closedSlots, setClosedSlots] = useState([]); const [profileTab, setProfileTab] = useState('services'); const [lightboxImg, setLightboxImg] = useState(null);

  const approvedShops = shops.filter(s => s.status === 'approved');
  const isClub = selectedShop?.category === 'Bar & Club';

  const t = {
    TR: {
      nav: { places: "Mekanlar", features: "Özellikler", why: "Neden Bookcy", contact: "İletişim", about: "Hakkımızda", addShop: "İşletme Ekle", login: "Giriş", logout: "Çıkış", dashboard: "Panel" },
      home: { eyebrow: "Kıbrıs'ın #1 Platformu", title1: "Kendine", title2: "iyi bak,", title3: "hemen", title4: "randevu al.", subtitle: "Kuaför, berber, spa, masaj ve daha fazlasını saniyeler içinde keşfet.", searchPlace: "Hizmet veya mekan ara...", searchLoc: "Nerede?", searchBtn: "Ara", popTitle: "Popüler:", stats: {s1:"İşletme", s2:"Müşteri", s3:"İşlem", s4:"Memnuniyet"} },
      cats: { catTitle: "Kategoriler", catSub: "Ne yaptırmak istersiniz?", seeAll: "Tümünü Gör →" },
      homeInfo: { recLabel: "Öne Çıkanlar", recTitle: "Bu Hafta 🔥", howLabel: "Nasıl Çalışır?", howTitle: "4 Adımda Hazır", how1Title: "Keşfet", how1Desc: "Mekanları incele.", how2Title: "Tarih Seç", how2Desc: "Zamanı seç.", how3Title: "Onayla", how3Desc: "Saniyeler içinde onay.", how4Title: "Keyif Çıkar", how4Desc: "Hizmetini al.", ctaLabel: "İşletme Misiniz?", ctaTitle1: "Bookcy ile", ctaTitle2: "Dijitalleş.", ctaSub: "Yeni müşteri kazan." },
      filters: { title: "Sonuçlar", search: "Mekan Ara...", region: "Bölge", service: "Kategori", sortHigh: "En Yüksek", sortLow: "En Düşük", clear: "Temizle", count: "Mekan" },
      reg: { title: "KAYIT", subtitle: "Sadece Sahipler İçin", shopName: "Adı", location: "Bölge", address: "Adres", maps: "Maps Linki", desc: "Hakkımızda", email: "E-Posta", contactPhone: "Telefon", contactInsta: "Instagram", contactEmail: "İletişim Maili", user: "Kullanıcı Adı", pass: "Şifre", pack: "Paket", upload: "Logo", submit: "BAŞVUR", success: "ALINDI!", uploading: "YÜKLENİYOR..." },
      shops: { back: "GERİ DÖN", empty: "Bulunamadı." }, profile: { tabServices: "Hizmetler", tabEvents: "Etkinlikler", tabGallery: "Galeri", about: "Hakkında", contactTitle: "İLETİŞİM", bookBtn: "SEÇ", noDesc: "Açıklama yok.", noServices: "Liste yok.", noGallery: "Fotoğraf yok.", similarTitle: "BENZER MEKANLAR" },
      book: { change: "Geri", selectService: "Hizmet seçin.", selectEvent: "Etkinlik seçin.", selectLoca: "VIP seçin.", selectStaff: "UZMAN SEÇİN", anyStaff: "Fark Etmez", date: "Tarih", time: "Saat", name: "Adınız", surname: "Soyadınız", phone: "Telefon", email: "E-Posta", submit: "ONAYLA", success: "ONAYLANDI", successSub: "İletildi.", backHome: "ANA SAYFA", total: "Toplam", details: "Detaylar", service: "Hizmet", event: "Etkinlik", staff: "Uzman", dateTime: "Zaman", contactInfo: "İletişim", btnBook: "Randevu Al →", shopClosed: "KAPALIDIR." },
      footer: { desc: "Tek rezervasyon platformu.", links: "Platform", cities: "Bölgeler", legal: "Sözleşmeler", terms: "Kullanım Şartları", privacy: "Gizlilik", kvkk: "KVKK", cookies: "Çerez Politikası", copy: "Tüm hakları saklıdır. Kıbrıs 🇹🇷" },
      legal: { privacyTitle: "Gizlilik Politikası", kvkkTitle: "KVKK", termsTitle: "Kullanım Şartları", cookiesTitle: "Çerez Politikası", lastUpdated: "Son güncellenme: 10 Nisan 2024" },
      megaMenu: { col1Title: "Kurulum", col2Title: "Müşterileri Etkile", col3Title: "İşletmeni Yönet", col4Title: "Büyümeye Devam Et", btn: "Tüm Özellikleri Keşfet" },
      featNames: { profile: "Bookcy Profili", market: "Pazaryeri", team: "Ekip", booking: "Randevu", app: "Uygulama", marketing: "Pazarlama", calendar: "Takvim", crm: "Müşteri Yönetimi", boost: "Öne Çık", stats: "Raporlar" },
      featDesc: { profile: "Dijital vitrin", market: "Müşteriye ulaşın", team: "Saatleri yönetin", booking: "7/24 randevu", app: "Mobil uygulama", marketing: "Mesaj gönderin", calendar: "Çakışmaları önleyin", crm: "Geçmişi saklayın", boost: "Üst sıralara çıkın", stats: "Kazancınızı görün" }
    },
    EN: { nav: { places: "Places", features: "Features", why: "Why Bookcy", contact: "Contact", about: "About", addShop: "Add Business", login: "Login", logout: "Logout", dashboard: "Dashboard" }, home: { eyebrow: "Cyprus's #1", title1: "Take care", title2: "of yourself", title3: "book", title4: "now.", subtitle: "Find salons easily.", searchPlace: "Search...", searchLoc: "Where?", searchBtn: "Search", popTitle: "Popular:", stats: {s1:"Places", s2:"Clients", s3:"Bookings", s4:"Satisfaction"} }, cats: { catTitle: "Categories", catSub: "What are you looking for?", seeAll: "See All →", tattoo: "Tattoo", barber: "Barber", hair: "Hair Salon", nail: "Nail Art", club: "Bar & Club", spa: "Spa & Massage", makeup: "Makeup", skincare: "Skin Care" }, homeInfo: { recLabel: "Featured", recTitle: "Trending This Week 🔥", howLabel: "How it works?", howTitle: "Ready in 4 steps", how1Title: "Discover", how1Desc: "Find nearby places.", how2Title: "Select Date", how2Desc: "Pick the best time.", how3Title: "Confirm", how3Desc: "Booking confirmed.", how4Title: "Enjoy", how4Desc: "Get your service.", ctaLabel: "Business owner?", ctaTitle1: "Grow your business", ctaTitle2: "with Bookcy.", ctaSub: "Digitize your booking system." }, filters: {title:"Results", count:"Found", clear:"Clear"}, reg: {title:"REGISTER", submit:"SUBMIT", success:"SUCCESS!"}, shops: { back: "BACK", empty:"Empty" }, profile: { tabServices: "Services", tabEvents: "Events", tabGallery: "Gallery", about: "About Us", contactTitle: "CONTACT INFO", bookBtn: "SELECT", noDesc: "No description yet.", noServices: "No services yet.", noGallery: "No photos yet.", similarTitle: "SIMILAR PLACES NEARBY" }, book: { change: "Back", selectService: "Select a service.", selectEvent: "Select an event.", selectLoca: "Select your VIP booking type.", selectStaff: "SELECT STAFF", anyStaff: "Any Staff", date: "Date", time: "Time", name: "First Name", surname: "Last Name", phone: "Phone", email: "Email", submit: "CONFIRM", success: "CONFIRMED", successSub: "Sent.", backHome: "HOME", total: "Total", details: "Details", service: "Service", event: "Event", staff: "Staff", dateTime: "Date/Time", contactInfo: "Contact", btnBook: "Book Now →", shopClosed: "CLOSED." }, contact: { title: "CONTACT US", sub: "We are here 24/7.", whatsapp: "WhatsApp", wpDesc: "Contact us via WhatsApp.", insta: "Instagram", instaDesc: "Follow us.", email: "Corporate Email", emailDesc: "Email us for inquiries.", btnWp: "MESSAGE", btnInsta: "FOLLOW", btnEmail: "EMAIL" }, footer: { desc: "Booking platform.", links: "Platform", cities: "Regions", legal: "Terms", terms: "Terms of Use", privacy: "Privacy", kvkk: "KVKK", cookies: "Cookie Policy", copy: "All rights reserved." }, legal: { privacyTitle: "Privacy", kvkkTitle: "KVKK", termsTitle: "Terms", cookiesTitle: "Cookies", lastUpdated: "Updated" }, megaMenu: { col1Title: "Setup", col2Title: "Clients", col3Title: "Manage", col4Title: "Grow", btn: "All Features" }, featNames: { profile: "Profile", market: "Marketplace", team: "Team", booking: "Booking", app: "App", marketing: "Marketing", calendar: "Calendar", crm: "CRM", boost: "Boost", stats: "Stats" }, featDesc: { profile: "Digital storefront", market: "Reach customers", team: "Manage hours", booking: "Book 24/7", app: "Mobile app", marketing: "Send messages", calendar: "Prevent conflicts", crm: "Store history", boost: "Rank higher", stats: "Track revenue" } },
    RU: { nav: { places: "Места", features: "Функции", why: "Почему Bookcy", contact: "Контакты", about: "О нас", addShop: "Добавить", login: "Вход", logout: "Выйти", dashboard: "Панель" }, home: { eyebrow: "Платформа #1", title1: "Позаботьтесь", title2: "о себе,", title3: "забронируйте", title4: "сейчас.", subtitle: "Бронируйте в один клик.", searchPlace: "Поиск...", searchLoc: "Где?", searchBtn: "ПОИСК", popTitle: "Популярные:", stats: {s1:"Места", s2:"Клиенты", s3:"Записи", s4:"Оценка"} }, cats: { catTitle: "Категории", catSub: "Что вы ищете?", seeAll: "Все →", tattoo: "Тату", barber: "Барбер", hair: "Парикмахерская", nail: "Маникюр", club: "Бар", spa: "Спа", makeup: "Макияж", skincare: "Уход за кожей" }, homeInfo: { recLabel: "Популярные", recTitle: "В тренде 🔥", howLabel: "Как это работает?", howTitle: "Готово за 4 шага", how1Title: "Найти", how1Desc: "Найдите салоны.", how2Title: "Дата", how2Desc: "Свободное время.", how3Title: "Подтвердить", how3Desc: "Бронь подтверждена.", how4Title: "Наслаждаться", how4Desc: "Оставьте отзыв.", ctaLabel: "Владелец бизнеса?", ctaTitle1: "Развивайте бизнес", ctaTitle2: "с Bookcy.", ctaSub: "Оцифруйте бизнес." }, filters: {title:"Результаты", count:"Найдено", clear:"Очистить"}, reg: {title:"РЕГИСТРАЦИЯ", submit:"ЗАВЕРШИТЬ", success:"ПОЛУЧЕНА!"}, shops: { back: "НАЗАД", empty:"Пусто" }, profile: { tabServices: "Услуги", tabEvents: "События", tabGallery: "Галерея", about: "О НАС", contactTitle: "КОНТАКТЫ", bookBtn: "ВЫБРАТЬ", noDesc: "Нет описания.", noServices: "Нет услуг.", noGallery: "Нет фото.", similarTitle: "ПОХОЖИЕ МЕСТА" }, book: { change: "Назад", selectService: "Выберите услугу", selectEvent: "Выберите событие", selectLoca: "Выберите зону", selectStaff: "ВЫБЕРИТЕ СПЕЦИАЛИСТА", anyStaff: "Любой", date: "Дата", time: "Время", name: "Имя", surname: "Фамилия", phone: "Телефон", email: "Email", submit: "ПОДТВЕРДИТЬ", success: "ПОДТВЕРЖДЕНА", successSub: "Отправлено.", backHome: "НА ГЛАВНУЮ", total: "Итого", details: "Детали", service: "Услуга", event: "Событие", staff: "Специалист", dateTime: "Дата / Время", contactInfo: "Контакты", btnBook: "Забронировать →", shopClosed: "ЗАКРЫТО." }, contact: { title: "КОНТАКТЫ", sub: "Мы здесь 24/7.", whatsapp: "WhatsApp", wpDesc: "Свяжитесь.", insta: "Instagram", instaDesc: "Подписывайтесь.", email: "Эл. почта", emailDesc: "Напишите нам.", btnWp: "НАПИСАТЬ", btnInsta: "ПОДПИСАТЬСЯ", btnEmail: "ОТПРАВИТЬ" }, footer: { desc: "Платформа бронирования.", links: "Платформа", cities: "Регион", legal: "О нас", terms: "Условия", privacy: "Конфиденциальность", kvkk: "KVKK", cookies: "Cookie", copy: "Все права защищены." }, legal: { privacyTitle: "Политика конфиденциальности", kvkkTitle: "KVKK", termsTitle: "Условия", cookiesTitle: "Cookie", lastUpdated: "Обновлено" }, megaMenu: { col1Title: "Настройка", col2Title: "Клиенты", col3Title: "Бизнес", col4Title: "Развитие", btn: "Функции" }, featNames: { profile: "Профиль", market: "Маркетплейс", team: "Команда", booking: "Бронирование", app: "Приложение", marketing: "Маркетинг", calendar: "Календарь", crm: "CRM", boost: "Продвижение", stats: "Статистика" }, featDesc: { profile: "Витрина", market: "Клиенты", team: "Персонал", booking: "24/7", app: "Мобильное", marketing: "Сообщения", calendar: "Без конфликтов", crm: "История", boost: "Топ", stats: "Доход" } }
  };

  const handleBookingEmailChange = (e) => { const val = e.target.value; setFormData(prev => ({...prev, email: val})); setBookingEmailValid(val === '' ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)); };
  const handleBookingPhoneChange = (e) => { const val = e.target.value; setFormData(prev => ({...prev, phone: val})); setBookingPhoneValid(val === '' ? null : val.replace(/\s/g, '').length >= 7); };
  const handleEmailChange = (e) => { const val = e.target.value; setNewShop(prev => ({...prev, email: val})); setEmailValid(val === '' ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)); };
  const handleAdminEmailChange = (e) => { const val = e.target.value; setNewShop(prev => ({...prev, contactEmail: val})); setAdminEmailValid(val === '' ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)); };
  const handlePhoneChange = (e) => { const val = e.target.value; setNewShop(prev => ({...prev, contactPhone: val})); setPhoneValid(val === '' ? null : val.replace(/\s/g, '').length >= 7); };

  const packages = [ { name: "Standart Paket", price: `60 STG / Aylık` }, { name: "Premium Paket", price: `100 STG / Aylık` } ];
  const categories = [ { key: "barber", dbName: "Berber", bg: "linear-gradient(135deg,#f8fafc,#e2e8f0)", emoji: "💈" }, { key: "hair", dbName: "Kuaför", bg: "linear-gradient(135deg,#fdf4ff,#fce7f3)", emoji: "✂️" }, { key: "nail", dbName: "Tırnak & Güzellik", bg: "linear-gradient(135deg,#fff1f2,#fbcfe8)", emoji: "💅" }, { key: "tattoo", dbName: "Dövme", bg: "linear-gradient(135deg,#f1f5f9,#cbd5e1)", emoji: "🖋️" }, { key: "spa", dbName: "Spa & Masaj", bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)", emoji: "💆" }, { key: "skincare", dbName: "Cilt Bakımı", bg: "linear-gradient(135deg,#eff6ff,#dbeafe)", emoji: "🧴" }, { key: "makeup", dbName: "Makyaj", bg: "linear-gradient(135deg,#fff7ed,#ffedd5)", emoji: "💄" }, { key: "club", dbName: "Bar & Club", bg: "linear-gradient(135deg,#f3f4f6,#e5e7eb)", emoji: "🍸" } ];

  const featureIconsSmall = { profile: <Briefcase size={20}/>, market: <Store size={20}/>, team: <Users size={20}/>, booking: <Target size={20}/>, app: <Smartphone size={20}/>, marketing: <Target size={20}/>, calendar: <Calendar size={20}/>, crm: <User size={20}/>, boost: <TrendingUp size={20}/>, stats: <PieChart size={20}/> };

  useEffect(() => { 
    const fetchData = async () => {
      const { data: sData } = await supabase.from('shops').select('*'); if (sData) setShops(sData);
      const { data: aData } = await supabase.from('appointments').select('customer_phone'); if (aData) setGlobalAppointments(aData);
    };
    fetchData(); 
    const session = localStorage.getItem('bookcy_biz_session'); if(session) setLoggedInShop(JSON.parse(session));
  }, []);
  
  useEffect(() => { 
    if (selectedShop && bookingData.date) { 
      const fetchAppts = async () => {
        const { data: ap } = await supabase.from('appointments').select('*').eq('shop_id', selectedShop.id).eq('appointment_date', bookingData.date); if(ap) setAppointments(ap);
        const { data: cs } = await supabase.from('closed_slots').select('*').eq('shop_id', selectedShop.id).eq('date', bookingData.date); if(cs) setClosedSlots(cs.map(i => i.slot));
      }; fetchAppts();
    } 
  }, [selectedShop, bookingData.date]);

  const handleLogin = async (e) => {
    e.preventDefault(); setIsLoginLoading(true);
    const shop = shops.find(s => s.admin_username?.toLowerCase() === loginUsername.trim().toLowerCase());
    if (!shop) { alert("Hatalı İşletme Kullanıcı Adı!"); setIsLoginLoading(false); return; }
    if (shop.status !== 'approved' && shop.status) { alert("Hesabınız onay bekliyor."); setIsLoginLoading(false); return; }
    if (loginType === 'owner') {
      if (shop.admin_password !== loginPassword.trim()) { alert("Hatalı Şifre!"); setIsLoginLoading(false); return; }
      localStorage.setItem('bookcy_biz_session', JSON.stringify({ role: 'owner', shopData: shop })); setShowLogin(false); setIsLoginLoading(false); router.push('/dashboard');
    } else {
      const validStaff = (shop.staff || []).find(s => s.name.toLowerCase() === loginStaffName.trim().toLowerCase() && s.password === loginPassword.trim());
      if (!validStaff) { alert("Hatalı Personel!"); setIsLoginLoading(false); return; }
      localStorage.setItem('bookcy_biz_session', JSON.stringify({ role: 'staff', staffName: validStaff.name, shopData: shop })); setShowLogin(false); setIsLoginLoading(false); router.push('/dashboard');
    }
  };

  const handleLogout = () => { localStorage.removeItem('bookcy_biz_session'); setLoggedInShop(null); };
  const handleHeroSearch = (e) => { e.preventDefault(); setStep('all_shops'); window.scrollTo(0,0); };

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    if (emailValid === false || phoneValid === false || adminEmailValid === false) return alert("Bilgileri kontrol edin.");
    setIsUploading(true); let uploadedLogoUrl = null;
    const fullPhone = newShop.phoneCode + " " + newShop.contactPhone;
    const { error } = await supabase.from('shops').insert([{ name: newShop.name, category: newShop.category, location: newShop.location, address: newShop.address, maps_link: newShop.maps_link, admin_email: newShop.email, admin_username: newShop.username, admin_password: newShop.password, description: newShop.description, logo_url: uploadedLogoUrl, package: newShop.package, status: 'pending', contact_phone: fullPhone, contact_insta: newShop.contactInsta, contact_email: newShop.contactEmail, services: [], staff: [], gallery: [], closed_dates: [], events: [] }]);
    setIsUploading(false);
    if (!error) setRegisterSuccess(true); else alert("Hata oluştu.");
  }

  async function handleBooking(e) {
    e.preventDefault();
    if (bookingEmailValid === false || bookingPhoneValid === false) return alert("Bilgileri kontrol edin.");
    if(isClub) { if(!bookingData.selectedEvent || !bookingData.selectedShopService) return; } else { if(!bookingData.selectedShopService || !bookingData.selectedStaff) return; }

    const availableSlotsForBooking = getCurrentAvailableSlots();
    const neededSlots = Math.ceil((bookingData.selectedShopService.duration || 30) / 30);
    const occupied_slots = isClub ? [] : availableSlotsForBooking.slice(availableSlotsForBooking.indexOf(bookingData.time), availableSlotsForBooking.indexOf(bookingData.time) + neededSlots);
    let assignedStaffName = isClub ? 'Rezervasyon' : bookingData.selectedStaff.name;
    const fullPhone = formData.phoneCode + " " + formData.phone;
    const finalDate = isClub ? bookingData.selectedEvent.date : bookingData.date;
    const finalTime = isClub ? bookingData.selectedEvent.time : bookingData.time;

    const { error } = await supabase.from('appointments').insert([{ shop_id: selectedShop.id, customer_name: formData.name, customer_surname: formData.surname, customer_phone: fullPhone, customer_email: formData.email, appointment_date: finalDate, appointment_time: finalTime, service_name: bookingData.selectedShopService.name, staff_name: assignedStaffName, occupied_slots: occupied_slots, status: 'Bekliyor' }]);
    if (!error) { setStep('success'); window.scrollTo(0,0); } else alert("Hata oluştu!");
  }

  async function submitFeedback(e) {
    e.preventDefault();
    if(feedbackData.q1===null || feedbackData.q2===null || feedbackData.q3===null || feedbackData.q4===null) return alert("Puan verin.");
    setFeedbackSubmitted(true);
    const avg = Number(((feedbackData.q1 + feedbackData.q2 + feedbackData.q3 + feedbackData.q4) / 4).toFixed(1));
    await supabase.from('platform_feedback').insert([{ q1: feedbackData.q1, q2: feedbackData.q2, q3: feedbackData.q3, q4: feedbackData.q4, average_score: avg }]);
  }

  const sortedShops = [...approvedShops.filter(shop => {
      return (filterRegion === 'All' || shop.location?.toLowerCase().includes(filterRegion.toLowerCase())) &&
             (filterService === 'All' || shop.category === filterService) &&
             (shop.name.toLowerCase().includes(searchQuery.toLowerCase()));
  })].sort((a, b) => {
      if (filterSort === 'High') {
        if ((a.package === 'Premium' || a.package === 'Premium Paket') && (b.package !== 'Premium' && b.package !== 'Premium Paket')) return -1;
        if ((a.package !== 'Premium' && a.package !== 'Premium Paket') && (b.package === 'Premium' || b.package === 'Premium Paket')) return 1;
      }
      return 0;
  });

  const getCurrentAvailableSlots = () => {
    if (!selectedShop || !bookingData.date || isClub) return allTimeSlots;
    if (selectedShop.closed_dates?.includes(bookingData.date)) return [];
    const dayName = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][new Date(bookingData.date).getDay()];
    const todayHours = (Array.isArray(selectedShop.working_hours) ? selectedShop.working_hours : defaultWorkingHours).find(h => h.day === dayName);
    if (todayHours?.isClosed) return [];
    if (todayHours) return allTimeSlots.filter(slot => slot >= todayHours.open && slot < todayHours.close);
    return allTimeSlots;
  };

  const currentAvailableSlots = getCurrentAvailableSlots();
  const isShopClosedToday = currentAvailableSlots.length === 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root { --fig: #2D1B4E; --terra: #E8622A; --blush: #F5C5A3; --c-bg-main: #FAF7F2; --c-bg-card: #FFFFFF; --c-border: #E2E8F0; --c-text-main: #101010; --c-text-muted: #64748B; }
        body { background: var(--c-bg-main) !important; color: var(--c-text-main) !important; font-family: 'DM Sans', sans-serif; overflow-x: hidden; margin:0; padding:0; }
        
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 0 48px; height: 72px; display: flex; align-items: center; justify-content: space-between; background: #FFFFFF !important; border-bottom: 1px solid var(--c-border) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; cursor: pointer; }
        .nav-logo-icon { width: 36px; height: 36px; }
        .nav-logo-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 22px; font-weight: 800; color: var(--fig); letter-spacing: -1px; display:flex; align-items:baseline; }
        .nav-logo-text span { color: var(--terra); }
        .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; margin:0; padding:0; }
        .nav-links button { font-size: 14px; font-weight: 700; color: var(--fig) !important; background:none; border:none; cursor:pointer; transition: color 0.2s;}
        .nav-links button:hover, .nav-links button.active { color: var(--terra) !important; }
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .lang-pills { display: flex; gap: 4px; }
        .lang-pill { font-size: 11px; font-weight:600; padding: 4px 10px; border-radius: 20px; transition: all 0.2s; color: var(--c-text-muted); cursor:pointer; border: 1px solid transparent;}
        .lang-pill.active { background: var(--fig); color: white; border-color: var(--fig); }
        .lang-pill:hover:not(.active) { border-color: var(--c-border); color: var(--c-text-main); }
        .btn-outline { font-size: 13px; font-weight: 700; padding: 9px 20px; border-radius: 50px; border: 1.5px solid var(--fig); color: var(--fig); background:transparent; cursor:pointer;}
        .btn-outline:hover { background: var(--fig); color: white; }
        .btn-primary { font-size: 13px; font-weight: 800; padding: 12px 28px; border-radius: 50px; background: var(--terra); color: white; border:none; cursor:pointer; text-transform:uppercase; transition: all 0.25s;}
        .btn-primary:hover { background: #d4561f; transform: translateY(-2px); box-shadow: 0 12px 25px rgba(232,98,42,0.3); }
        
        .hero { position: relative; min-height: 85vh; background: var(--fig); display: flex; flex-direction:column; align-items: center; justify-content: center; padding: 140px 24px 100px; overflow:hidden;}
        .hero-content { position:relative; z-index:2; text-align:center; padding: 0 24px; max-width: 900px; }
        .hero-eyebrow { display:inline-flex; align-items:center; gap:8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius:50px; padding: 6px 16px 6px 8px; font-size:10px; font-weight:800; color:rgba(255,255,255,0.9); letter-spacing:1px; text-transform:uppercase; margin-bottom:28px; }
        .hero-eyebrow-dot { width:8px; height:8px; border-radius:50%; background:var(--terra); }
        .hero-title { font-family:'Plus Jakarta Sans',sans-serif; font-size: clamp(48px, 6vw, 80px); font-weight:900; color: white; letter-spacing: -2px; line-height: 1.1; margin-bottom:24px; text-align:center; }
        .hero-title .accent { color: var(--terra); }
        .hero-sub { font-size:16px; font-weight:600; color: rgba(255,255,255,0.65); max-width:600px; margin:0 auto 48px; text-align:center; line-height:1.6;}
        
        .search-wrap { display:flex; align-items:center; background: white; border-radius: 32px; padding: 12px; gap: 12px; max-width: 800px; width:100%; margin: 0 auto; box-shadow: 0 24px 60px rgba(0,0,0,0.3); border: none; }
        .search-field { flex:1.5; display:flex; align-items:center; gap:12px; padding: 0 16px; border-right: 1px solid var(--c-border); }
        .search-icon { color: var(--terra); font-size:22px; flex-shrink:0; }
        .search-field input { border:none; outline:none; width:100%; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:700; color:var(--c-text-main); background:transparent; }
        .search-location { display:flex; align-items:center; gap:12px; flex:1; padding: 0 16px; }
        .search-location select { border:none; outline:none; width:100%; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:700; cursor:pointer; background:transparent;}
        .search-btn { border:none; background: var(--terra); color:white; font-size:15px; font-weight:800; padding: 16px 40px; border-radius:24px; cursor:pointer; }
        .search-btn:hover { background:#d4561f; }
        
        .hero-popular { display:flex; align-items:center; gap:10px; margin-top:30px; flex-wrap:wrap; justify-content:center; }
        .hero-popular span { font-size:12px; color:rgba(255,255,255,0.5); font-weight:700; letter-spacing:0.5px; }
        .pop-tag { font-size:12px; font-weight:700; padding:8px 16px; border-radius:50px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.8); transition:all 0.2s; cursor:pointer; }
        .pop-tag:hover { background:var(--terra); border-color:var(--terra); color:white; }
        
        .cat-card { display:flex; flex-direction:column; align-items:center; gap:12px; cursor:pointer; transition:transform 0.25s;}
        .cat-card:hover { transform:translateY(-6px); }
        .cat-img-wrap { width:100%; aspect-ratio:1; border-radius:24px; background:white; border: 1px solid var(--c-border); overflow:hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition:all 0.3s;}
        .cat-card:hover .cat-img-wrap { box-shadow: 0 12px 30px rgba(45,27,78,0.1); border-color: var(--terra); }
        .cat-emoji-bg { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:40px; border-radius:24px; }
        .cat-name { font-size:11px; font-weight:800; letter-spacing:1px; text-transform:uppercase; color:var(--c-text-main); }

        .venue-card { border-radius:24px; background: white; border: 1px solid var(--c-border); cursor:pointer; transition:transform 0.3s, box-shadow 0.3s; display:flex; flex-direction:column; position:relative;}
        .venue-card:hover { transform:translateY(-8px); border-color: var(--terra); box-shadow:0 24px 50px rgba(45,27,78,0.08);}

        @media(max-width:900px){
          nav { padding:0 20px; }
          .hero { padding-top: 100px; }
          .search-wrap { flex-direction: column; border-radius:24px; padding:16px; gap:12px; }
          .search-field { border-right: none; border-bottom: 1px solid var(--c-border); padding-bottom: 12px; }
          .nav-links { display:none; }
          .nav-right .btn-outline { display:none; }
          .nav-right .btn-primary span { display:none; }
        }
      `}} />

      <nav>
        <div className="nav-logo" onClick={() => {setStep('services'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}}>
          <svg className="nav-logo-icon" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="10" fill="#2D1B4E"/><circle cx="18" cy="10" r="4.5" fill="#F5C5A3"/><rect x="10" y="15.5" width="4" height="15" rx="2" fill="#F5C5A3"/><path d="M14 15.5 Q23 15.5 23 20 Q23 24.5 14 24.5" stroke="#F5C5A3" strokeWidth="3.5" fill="none" strokeLinecap="round"/><path d="M14 24.5 Q25 24.5 25 29 Q25 33.5 14 33.5" stroke="#E8622A" strokeWidth="3.5" fill="none" strokeLinecap="round"/><circle cx="28" cy="8" r="4.5" fill="#E8622A"/></svg>
          <span className="nav-logo-text">bookcy<span>.</span></span>
        </div>
        <ul className="nav-links">
          <li><button onClick={() => {setStep('all_shops'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={['all_shops', 'shop_profile'].includes(step) ? 'active' : ''}>{t[lang].nav.places}</button></li>
          <li>
              <div className="relative flex items-center h-full group" onMouseEnter={() => setShowFeaturesMenu(true)} onMouseLeave={() => setShowFeaturesMenu(false)}>
                  <button onClick={() => {setStep('all_features'); setShowFeaturesMenu(false); window.scrollTo(0,0);}} className={`flex items-center gap-1 ${['feature_detail', 'all_features'].includes(step) || showFeaturesMenu ? 'active' : ''}`}>
                      {t[lang].nav.features} <ChevronDown size={14} className={showFeaturesMenu ? 'rotate-180' : ''} />
                  </button>
                  {showFeaturesMenu && (
                      <div className="absolute top-[72px] left-1/2 -translate-x-1/2 w-screen bg-white text-[#2D1B4E] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-t border-slate-200 cursor-default animate-in slide-in-from-top-2 duration-200">
                          <div className="max-w-[1000px] mx-auto py-12 px-8">
                              <div className="grid grid-cols-4 gap-8 mb-10 text-left">
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{t[lang].megaMenu.col1Title}</h4>
                                    <ul className="space-y-5 font-bold text-slate-600 text-sm">
                                      {['profile', 'market', 'team'].map(k => <li key={k} onClick={() => goToFeature(k)} className="hover:text-[#2D1B4E] cursor-pointer flex items-center gap-2"><ChevronRight size={14} className="text-[#E8622A]"/> {t[lang].featNames[k]}</li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{t[lang].megaMenu.col2Title}</h4>
                                    <ul className="space-y-5 font-bold text-slate-600 text-sm">
                                      {['booking', 'app'].map(k => <li key={k} onClick={() => goToFeature(k)} className="hover:text-[#2D1B4E] cursor-pointer flex items-center gap-2"><ChevronRight size={14} className="text-[#E8622A]"/> {t[lang].featNames[k]}</li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{t[lang].megaMenu.col3Title}</h4>
                                    <ul className="space-y-5 font-bold text-slate-600 text-sm">
                                      {['marketing', 'calendar', 'crm'].map(k => <li key={k} onClick={() => goToFeature(k)} className="hover:text-[#2D1B4E] cursor-pointer flex items-center gap-2"><ChevronRight size={14} className="text-[#E8622A]"/> {t[lang].featNames[k]}</li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{t[lang].megaMenu.col4Title}</h4>
                                    <ul className="space-y-5 font-bold text-slate-600 text-sm">
                                      {['boost', 'stats'].map(k => <li key={k} onClick={() => goToFeature(k)} className="hover:text-[#2D1B4E] cursor-pointer flex items-center gap-2"><ChevronRight size={14} className="text-[#E8622A]"/> {t[lang].featNames[k]}</li>)}
                                    </ul>
                                  </div>
                              </div>
                              <div className="flex justify-center border-t border-slate-100 pt-8">
                                <button onClick={() => {setStep('all_features'); setShowFeaturesMenu(false); window.scrollTo(0,0);}} className="border border-slate-200 bg-white text-[#2D1B4E] px-8 py-3 rounded-xl font-black uppercase text-xs hover:border-[#E8622A] hover:text-[#E8622A] cursor-pointer">{t[lang].megaMenu.btn}</button>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </li>
          <li><button onClick={() => {setStep('why_bookcy'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={step === 'why_bookcy' ? 'active' : ''}>{t[lang].nav.why}</button></li>
          <li><button onClick={() => {setStep('about'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={step === 'about' ? 'active' : ''}>{t[lang].nav.about}</button></li>
          <li><button onClick={() => {setStep('contact'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={step === 'contact' ? 'active' : ''}>{t[lang].nav.contact}</button></li>
        </ul>
        <div className="nav-right">
          <div className="lang-pills hidden md:flex"><div onClick={()=>setLang('TR')} className={`lang-pill ${lang==='TR' ? 'active' : ''}`}>TR</div><div onClick={()=>setLang('EN')} className={`lang-pill ${lang==='EN' ? 'active' : ''}`}>EN</div><div onClick={()=>setLang('RU')} className={`lang-pill ${lang==='RU' ? 'active' : ''}`}>RU</div></div>
          {loggedInShop ? (
               <div className="flex gap-2 items-center"><button onClick={handleLogout} className="btn-outline">{t[lang].nav.logout}</button><button onClick={() => router.push('/dashboard')} className="btn-primary"><UserCircle size={18}/> <span>{t[lang].nav.dashboard}</span></button></div>
          ) : (
              <><button onClick={() => setShowRegister(true)} className="btn-outline">{t[lang].nav.addShop}</button><button onClick={() => setShowLogin(true)} className="btn-primary"><UserCircle size={18}/><span>{t[lang].nav.login}</span></button></>
          )}
        </div>
      </nav>

      {/* İŞLETME KAYIT MODALI */}
      {showRegister && (
          <div className="fixed inset-0 w-screen h-screen bg-[#2D1B4E]/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto pt-20">
            <div className="bg-white border border-slate-200 w-full max-w-[800px] rounded-[32px] p-8 md:p-10 relative shadow-2xl my-auto">
              <button onClick={() => {setShowRegister(false); setRegisterSuccess(false);}} className="absolute top-6 right-6 text-slate-400 hover:text-[#2D1B4E] bg-transparent border-none cursor-pointer"><X size={24}/></button>
              {registerSuccess ? (
                  <div className="text-center py-20">
                      <CheckCircle2 size={64} className="mx-auto text-[#00c48c] mb-6" />
                      <h2 className="text-2xl font-black text-[#E8622A] uppercase italic mb-4">{t[lang].reg.success}</h2>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 inline-block text-left mt-4 text-[#2D1B4E] w-full max-w-sm">
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Banka Bilgileri / Bank Details:</p>
                          <p className="font-bold text-sm">Banka: <span className="font-normal">İş Bankası</span></p>
                          <p className="font-bold text-sm">Alıcı: <span className="font-normal">BOOKCY LTD.</span></p>
                          <p className="font-bold text-sm">IBAN: <span className="text-[#E8622A]">TR99 0006 4000 0012 3456 7890 12</span></p>
                          <a href="https://wa.me/905555555555" target="_blank" rel="noreferrer" className="w-full bg-[#25D366] text-white font-black py-4 rounded-xl uppercase tracking-widest hover:bg-green-600 transition-colors shadow-lg flex justify-center items-center gap-2 text-decoration-none text-xs border-none cursor-pointer mt-6"><MessageCircle size={18}/> DEKONTU İLET</a>
                      </div>
                  </div>
              ) : (
                  <>
                      <div className="flex flex-col mb-8 text-center"><h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#2D1B4E]">{t[lang].reg.title}</h2><p className="text-[10px] text-[#E8622A] font-bold uppercase tracking-[0.2em] mt-2 flex items-center justify-center gap-2"><Lock size={12}/> {t[lang].reg.subtitle}</p></div>
                      <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input required placeholder={t[lang].reg.shopName} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.name} onChange={e => setNewShop({...newShop, name: e.target.value})} /><select className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-[#2D1B4E] outline-none" value={newShop.category} onChange={e => setNewShop({...newShop, category: e.target.value})}>{categories.map(c => <option key={c.dbName} value={c.dbName}>{t[lang].cats[c.key]}</option>)}</select></div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><select required className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-[#2D1B4E] outline-none" value={newShop.location} onChange={e => setNewShop({...newShop, location: e.target.value})}>{cyprusRegions.map(r => <option key={r} value={r}>{r}</option>)}</select><input required placeholder={t[lang].reg.address} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.address} onChange={e => setNewShop({...newShop, address: e.target.value})} /></div>
                          <input type="url" placeholder={t[lang].reg.maps} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.maps_link} onChange={e => setNewShop({...newShop, maps_link: e.target.value})} />
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4"><div className="flex gap-2 w-full"><select className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-2 outline-none font-bold text-xs text-[#2D1B4E] w-20" value={newShop.phoneCode} onChange={e => setNewShop({...newShop, phoneCode: e.target.value})}><option value="+90">TR</option></select><input required type="tel" placeholder={t[lang].reg.contactPhone} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none font-bold text-xs text-[#2D1B4E]" value={newShop.contactPhone} onChange={handlePhoneChange} /></div><input placeholder={t[lang].reg.contactInsta} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.contactInsta} onChange={e => setNewShop({...newShop, contactInsta: e.target.value})} /><input type="email" placeholder={t[lang].reg.contactEmail} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.contactEmail} onChange={handleAdminEmailChange} /></div>
                          <input required type="email" placeholder={t[lang].reg.email} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E] mt-2" value={newShop.email} onChange={handleEmailChange} />
                          <textarea placeholder={t[lang].reg.desc} rows="2" className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none resize-none text-[#2D1B4E]" value={newShop.description} onChange={e => setNewShop({...newShop, description: e.target.value})}></textarea>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">{packages.map(p => (<div key={p.name} onClick={() => setNewShop({...newShop, package: p.name})} className={`cursor-pointer p-4 rounded-xl border ${newShop.package === p.name ? 'bg-orange-50 border-[#E8622A]' : 'bg-white border-slate-200'}`}><h4 className={`text-sm font-black uppercase ${newShop.package === p.name ? 'text-[#E8622A]' : 'text-[#2D1B4E]'}`}>{p.name}</h4><p className="text-xs font-bold text-slate-500">{p.price}</p></div>))}</div>
                          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4"><input required placeholder={t[lang].reg.user} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.username} onChange={e => setNewShop({...newShop, username: e.target.value})} /><input required placeholder={t[lang].reg.pass} className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.password} onChange={e => setNewShop({...newShop, password: e.target.value})} /></div>
                          <button type="submit" disabled={isUploading || emailValid === false || phoneValid === false || adminEmailValid === false} className="w-full btn-primary justify-center py-4 rounded-xl mt-2 shadow-lg border-none cursor-pointer">{isUploading ? t[lang].reg.uploading : t[lang].reg.submit}</button>
                      </form>
                  </>
              )}
            </div>
          </div>
      )}

      {/* GİRİŞ MODALI */}
      {showLogin && (
        <div className="fixed inset-0 bg-[#2D1B4E]/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[400px] rounded-[32px] p-8 relative shadow-2xl border border-slate-200">
            <button onClick={() => setShowLogin(false)} className="absolute top-6 right-6 text-slate-400 bg-transparent border-none cursor-pointer"><X size={24}/></button>
            <div className="text-center mb-6"><h1 className="text-2xl font-black text-[#2D1B4E] uppercase mb-2">GİRİŞ YAP</h1><p className="text-slate-400 font-bold text-xs uppercase">İŞ ORTAĞI PANELİ</p></div>
            <div className="flex bg-slate-50 p-1 rounded-xl mb-6"><button onClick={() => setLoginType('owner')} className={`flex-1 py-3 text-xs font-black rounded-lg border-none cursor-pointer ${loginType === 'owner' ? 'bg-white text-[#E8622A] shadow-sm' : 'bg-transparent text-slate-400'}`}>YÖNETİCİ</button><button onClick={() => setLoginType('staff')} className={`flex-1 py-3 text-xs font-black rounded-lg border-none cursor-pointer ${loginType === 'staff' ? 'bg-white text-[#E8622A] shadow-sm' : 'bg-transparent text-slate-400'}`}>PERSONEL</button></div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" required placeholder="Kullanıcı Adı" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none text-[#2D1B4E]" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
              {loginType === 'staff' && <input type="text" required placeholder="Personel Adı" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none text-[#2D1B4E]" value={loginStaffName} onChange={(e) => setLoginStaffName(e.target.value)} />}
              <input type="password" required placeholder="Şifre" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none text-[#2D1B4E]" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              <button type="submit" disabled={isLoginLoading} className="w-full btn-primary py-4 rounded-xl font-black uppercase tracking-widest text-xs flex justify-center items-center mt-4 border-none cursor-pointer">{isLoginLoading ? 'Bekleyin...' : 'PANELE GİT'}</button>
            </form>
          </div>
        </div>
      )}

      <main className="flex-1 w-full relative z-10 min-h-[80vh] mt-[72px]">
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
                      {categories.slice(0,4).map(c=><div key={c.key} className="pop-tag" onClick={()=>{setFilterService(c.dbName); setStep('all_shops');}}>{c.emoji} {c.dbName}</div>)}
                    </div>
                  </div>
                  <div className="hero-stats">
                      <div className="stat"><div className="stat-num">{approvedShops.length}</div><div className="stat-label">{t[lang].home.stats.s1}</div></div>
                      <div className="stat"><div className="stat-num">{globalAppointments.length*3+150}</div><div className="stat-label">{t[lang].home.stats.s2}</div></div>
                      <div className="stat"><div className="stat-num">{globalAppointments.length*5+320}</div><div className="stat-label">{t[lang].home.stats.s3}</div></div>
                      <div className="stat"><div className="stat-num">%98</div><div className="stat-label">{t[lang].home.stats.s4}</div></div>
                  </div>
                </section>

                <section className="bg-white py-20 px-8 border-b border-slate-200">
                  <div className="max-w-6xl mx-auto flex justify-between items-end mb-10">
                    <div><div className="text-[11px] font-black text-[#E8622A] uppercase tracking-[0.3em] mb-2">{t[lang].cats.catTitle}</div><div className="text-3xl font-black text-[#2D1B4E]">{t[lang].cats.catSub}</div></div>
                    <button className="text-[#E8622A] font-bold bg-transparent border-none cursor-pointer" onClick={()=>{setFilterService('All'); setStep('all_shops'); window.scrollTo(0,0);}}>{t[lang].cats.seeAll}</button>
                  </div>
                  <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {categories.map((c) => (
                        <div key={c.key} onClick={() => { setFilterService(c.dbName); setStep('all_shops'); window.scrollTo(0,0); }} className="cat-card">
                          <div className="cat-img-wrap"><div className="cat-emoji-bg" style={{background: c.bg}}>{c.emoji}</div></div>
                          <div className="cat-name">{t[lang].cats[c.key]}</div>
                        </div>
                    ))}
                  </div>
                </section>

               {recommendedShops.length > 0 && (
                  <section className="bg-slate-50 py-20 px-8 border-t border-slate-200">
                    <div className="max-w-6xl mx-auto flex justify-between items-end mb-10">
                      <div><div className="text-[11px] font-black text-[#E8622A] uppercase tracking-[0.3em] mb-2">{t[lang].homeInfo.recLabel}</div><div className="text-3xl font-black text-[#2D1B4E]">{t[lang].homeInfo.recTitle}</div></div>
                      <button className="text-[#E8622A] font-bold bg-transparent border-none cursor-pointer" onClick={()=>{setFilterSort('High'); setStep('all_shops'); window.scrollTo(0,0);}}>{t[lang].cats.seeAll}</button>
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
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200"><div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6"><Smartphone size={32}/></div><h3 className="font-black text-xl text-[#2D1B4E] mb-3">Üst Düzey Arayüz</h3><p className="text-slate-500 font-medium">Sade, hızlı ve kullanıcı dostu modern bir arayüz sunuyoruz.</p></div>
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200"><div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mb-6"><TrendingUp size={32}/></div><h3 className="font-black text-xl text-[#2D1B4E] mb-3">Maksimum Kazanç</h3><p className="text-slate-500 font-medium">İşletmeler için komisyonsuz modelimiz ile gelirinizi katlamanızı sağlıyoruz.</p></div>
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200"><div className="w-16 h-16 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center mb-6"><MessageSquare size={32}/></div><h3 className="font-black text-xl text-[#2D1B4E] mb-3">Gelişmiş Otomasyon</h3><p className="text-slate-500 font-medium">Yakında eklenecek SMS ve gelişmiş bildirim sistemleri.</p></div>
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
                                <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-xs font-black text-[#E8622A] relative">
                                    {(shop.package === 'Premium Paket' || shop.package === 'Premium') && <div className="absolute inset-0 border-4 border-yellow-400 rounded-full"></div>}
                                    {shop.logo_url ? <img loading="lazy" decoding="async" src={shop.logo_url} className="w-full h-full object-cover" /> : "LOGO"}
                                </div>
                                <div className="flex-1 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                        <h3 className="text-xl font-black uppercase text-[#2D1B4E]">{shop.name}</h3>
                                        {(shop.package === 'Premium Paket' || shop.package === 'Premium') && <Gem size={14} className="text-yellow-500 fill-yellow-500"/>}
                                    </div>
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
                    <div className="absolute -bottom-10 left-8 w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-[#E8622A] font-black relative">
                        {(selectedShop.package === 'Premium Paket' || selectedShop.package === 'Premium') && <div className="absolute inset-0 border-4 border-yellow-400 rounded-full"></div>}
                        {selectedShop.logo_url ? <img src={selectedShop.logo_url} className="w-full h-full object-cover" /> : "LOGO"}
                    </div>
                </div>
                <div className="mb-8 border-b border-slate-200 pb-8">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black uppercase text-[#2D1B4E]">{selectedShop.name}</h1>
                        {(selectedShop.package === 'Premium Paket' || selectedShop.package === 'Premium') && <Gem size={24} className="text-yellow-500 fill-yellow-500"/>}
                    </div>
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

        {/* DİNAMİK ÖZELLİK */}
        {step === 'feature_detail' && activeFeature && (
            <div className="w-full bg-[#FAF7F2] pb-24">
                <div className="bg-[#2D1B4E] pt-32 pb-40 text-center border-b border-slate-800">
                    <h1 className="text-4xl font-black text-white uppercase">{t[lang].featNames[activeFeature]}</h1>
                </div>
                <div className="max-w-[800px] mx-auto px-8 -mt-20">
                    <div className="bg-white p-12 rounded-[32px] shadow-xl border border-slate-200 text-center">
                        <div className="flex justify-center mb-6 text-[#E8622A]">{featureIcons[activeFeature] || <Star size={40}/>}</div>
                        <h2 className="text-2xl font-black text-[#2D1B4E] mb-6">{t[lang].featNames[activeFeature]}</h2>
                        <p className="text-lg text-slate-500">{t[lang].featDesc[activeFeature]}</p>
                    </div>
                </div>
            </div>
        )}

        {/* TÜM ÖZELLİKLER */}
        {step === 'all_features' && (
            <div className="w-full bg-[#FAF7F2] pb-24">
                <div className="bg-[#2D1B4E] pt-32 pb-32 px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase">Tüm Özellikler</h1>
                </div>
                <div className="max-w-[1200px] mx-auto px-8 -mt-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.keys(t[lang].featNames).map(key => (
                            <div key={key} onClick={() => goToFeature(key)} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 cursor-pointer hover:-translate-y-2 transition-transform">
                                <div className="text-[#E8622A] mb-4">{featureIconsSmall[key]}</div>
                                <h3 className="font-black text-[#2D1B4E] mb-2">{t[lang].featNames[key]}</h3>
                                <p className="text-sm text-slate-500">{t[lang].featDesc[key]}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* HAKKIMIZDA & PAKETLER SAYFASI (YENİ MODERN SAAS TASARIMI) */}
        {step === 'about' && (
            <div className="w-full bg-[#FAF7F2] pb-24">
                <div className="bg-[#2D1B4E] pt-32 pb-32 px-4 text-center">
                    <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-6 inline-block">Bookcy Hakkında</span>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">İşletmeni Dijitale Taşı,<br/><span className="text-[#E8622A]">Müşterilerini Katla</span></h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">Kıbrıs’taki en iyi işletmeler artık Bookcy’de.</p>
                </div>
                <div className="max-w-[1200px] mx-auto px-4 -mt-10">
                    <div className="bg-white p-10 rounded-[32px] shadow-xl border border-slate-200 mb-16 text-center">
                        <h2 className="text-sm font-black text-[#E8622A] uppercase tracking-[0.3em] mb-4">Biz Kimiz?</h2>
                        <p className="text-2xl text-[#2D1B4E] font-black leading-tight mb-6">Bookcy, Kıbrıs’ta kurulan ilk ve tek kapsamlı online randevu platformlarından biri olarak, işletmelerin dijital dönüşümünü hızlandırmak için geliştirilmiştir.</p>
                        <p className="text-lg text-slate-500 font-medium mb-8">Güzellikten bakıma, spadan yaşam tarzı hizmetlerine kadar birçok sektörü tek çatı altında buluşturarak, hem işletmelere hem müşterilere yeni nesil bir deneyim sunuyoruz.</p>
                        <div className="bg-[#2D1B4E] text-white p-6 rounded-2xl inline-block font-bold text-lg shadow-xl">Biz sadece bir randevu sistemi değiliz — <br/><span className="text-[#E8622A]">işletmelerin büyümesini sağlayan dijital altyapıyız.</span></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[32px] border border-slate-200">
                            <h2 className="text-2xl font-black uppercase text-[#2D1B4E] mb-6 flex items-center gap-3"><Store className="text-[#E8622A]"/> İşletmeler İçin</h2>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-3"><CheckCircle2 className="text-[#E8622A] shrink-0"/><div><h4 className="font-bold text-[#2D1B4E]">Daha Fazla Müşteri</h4><p className="text-sm text-slate-500">Binlerce potansiyel müşteriye anında ulaşın.</p></div></div>
                                <div className="flex gap-3"><CheckCircle2 className="text-[#E8622A] shrink-0"/><div><h4 className="font-bold text-[#2D1B4E]">Tüm Yönetim Tek Panelde</h4><p className="text-sm text-slate-500">Randevularınızı kolayca yönetin.</p></div></div>
                                <div className="flex gap-3"><CheckCircle2 className="text-[#E8622A] shrink-0"/><div><h4 className="font-bold text-[#2D1B4E]">Güçlü Dijital Kimlik</h4><p className="text-sm text-slate-500">Profesyonel ve güvenilir bir imaj oluşturun.</p></div></div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[32px] border border-slate-200">
                            <h2 className="text-2xl font-black uppercase text-[#2D1B4E] mb-6 flex items-center gap-3"><User className="text-[#E8622A]"/> Müşteriler İçin</h2>
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-3"><Star className="text-yellow-500 shrink-0"/><div><h4 className="font-bold text-[#2D1B4E]">En İyileri Keşfet</h4><p className="text-sm text-slate-500">En yüksek puanlı işletmeleri bul.</p></div></div>
                                <div className="flex gap-3"><Clock className="text-[#E8622A] shrink-0"/><div><h4 className="font-bold text-[#2D1B4E]">7/24 Randevu Özgürlüğü</h4><p className="text-sm text-slate-500">İstediğin zaman randevunu oluştur.</p></div></div>
                                <div className="flex gap-3"><MessageCircle className="text-[#E8622A] shrink-0"/><div><h4 className="font-bold text-[#2D1B4E]">Gerçek Yorumlar</h4><p className="text-sm text-slate-500">Sadece hizmet almış kullanıcıları oku.</p></div></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <h2 className="text-3xl font-black text-[#2D1B4E] mb-8 uppercase">Paketlerimiz</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <div className="bg-white p-8 rounded-[32px] border border-slate-200">
                                <h3 className="text-2xl font-black text-[#2D1B4E]">Standart Paket</h3>
                                <p className="text-3xl font-black text-[#E8622A] mt-2 mb-6">60 STG <span className="text-sm text-slate-500">/ Ay</span></p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2 text-sm font-bold text-slate-600"><Check size={16} className="text-[#E8622A]"/> Online randevu sistemi</li>
                                    <li className="flex items-center gap-2 text-sm font-bold text-slate-600"><Check size={16} className="text-[#E8622A]"/> Sınırsız randevu</li>
                                    <li className="flex items-center gap-2 text-sm font-bold text-slate-600"><Check size={16} className="text-[#E8622A]"/> İşletme profil sayfası</li>
                                </ul>
                                <button onClick={() => {setShowRegister(true); window.scrollTo(0,0);}} className="w-full py-4 bg-slate-100 font-black rounded-xl text-[#2D1B4E] border-none cursor-pointer hover:text-[#E8622A]">Hemen Başla</button>
                            </div>
                            <div className="bg-[#2D1B4E] p-8 rounded-[32px] border-2 border-[#E8622A] relative text-white transform md:scale-105">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#E8622A] text-white px-4 py-1 rounded-full text-xs font-black uppercase">En Popüler</div>
                                <h3 className="text-2xl font-black">Premium Paket</h3>
                                <p className="text-3xl font-black text-[#E8622A] mt-2 mb-6">100 STG <span className="text-sm text-slate-400">/ Ay</span></p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 size={16} className="text-[#E8622A]"/> Tüm Standart özellikler</li>
                                    <li className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 size={16} className="text-[#E8622A]"/> Öncelikli listeleme</li>
                                    <li className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 size={16} className="text-[#E8622A]"/> Öne çıkan işletme rozeti</li>
                                </ul>
                                <button onClick={() => {setShowRegister(true); window.scrollTo(0,0);}} className="w-full py-4 bg-[#E8622A] text-white font-black rounded-xl border-none cursor-pointer">Premium'a Geç</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {step === 'contact' && (
            <div className="w-full bg-[#FAF7F2] pb-24">
                <div className="bg-[#2D1B4E] pt-32 pb-32 px-4 text-center relative border-b border-slate-800">
                    <span className="bg-[#E8622A]/10 text-[#E8622A] px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-6 inline-block border border-[#E8622A]/20">7/24 Destek</span>
                    <h1 className="text-4xl md:text-5xl font-black uppercase text-white mb-4">BİZE ULAŞIN</h1>
                    <p className="text-lg text-slate-300 max-w-xl mx-auto">Sorularınız ve destek talepleriniz için bize ulaşabilirsiniz.</p>
                </div>
                <div className="max-w-[1000px] mx-auto px-4 -mt-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-[32px] text-center shadow-xl border border-slate-200"><div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4"><MessageCircle size={32}/></div><h3 className="font-black text-[#2D1B4E] mb-2">WhatsApp</h3><a href="https://wa.me/905555555555" className="block bg-[#25D366] text-white py-3 rounded-xl font-black mt-6 no-underline">MESAJ AT</a></div>
                        <div className="bg-white p-8 rounded-[32px] text-center shadow-xl border border-slate-200"><div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"><InstagramIcon size={32}/></div><h3 className="font-black text-[#2D1B4E] mb-2">Instagram</h3><a href="https://instagram.com/bookcy" className="block bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-black mt-6 no-underline">TAKİP ET</a></div>
                        <div className="bg-white p-8 rounded-[32px] text-center shadow-xl border border-slate-200"><div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"><Mail size={32}/></div><h3 className="font-black text-[#2D1B4E] mb-2">E-Posta</h3><a href="mailto:info@bookcy.co" className="block bg-[#2D1B4E] text-white py-3 rounded-xl font-black mt-6 no-underline">MAİL AT</a></div>
                    </div>
                </div>
            </div>
        )}

        {['privacy', 'kvkk', 'terms', 'cookies'].includes(step) && (
            <div className="w-full bg-[#FAF7F2] pb-24">
                <div className="bg-white pt-32 pb-20 text-center border-b border-slate-200">
                    <h1 className="text-3xl md:text-5xl font-black text-[#2D1B4E] uppercase">{t[lang].legal[`${step}Title`]}</h1>
                    <p className="text-sm font-bold text-slate-500 mt-4">{t[lang].legal.lastUpdated}</p>
                </div>
                <div className="max-w-3xl mx-auto mt-12 bg-white p-8 md:p-12 rounded-[32px] border border-slate-200 text-slate-600 font-medium">
                    {step === 'privacy' && (<div className="space-y-6"><h3 className="text-xl font-black text-[#2D1B4E]">Giriş</h3><p>Bu politika kişisel verilerinizi nasıl koruduğumuzu açıklar.</p></div>)}
                    {step === 'kvkk' && (<div className="space-y-6"><h3 className="text-xl font-black text-[#2D1B4E]">Veri Sorumlusu</h3><p>Veri sorumlusu bookcy.co platformudur.</p></div>)}
                    {step === 'terms' && (<div className="space-y-6"><h3 className="text-xl font-black text-[#2D1B4E]">Hizmet Tanımı</h3><p>Online randevu almanızı sağlayan bir platformdur.</p></div>)}
                    {step === 'cookies' && (<div className="space-y-6"><h3 className="text-xl font-black text-[#2D1B4E]">Çerezler</h3><p>Kullanıcı deneyimini geliştirmek için kullanılır.</p></div>)}
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