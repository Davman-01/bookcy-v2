"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Star, ArrowRight, CheckCircle2, XCircle, ChevronLeft, ChevronRight, ChevronDown, 
  Phone, Calendar, Clock, Lock, Upload, Briefcase, MessageSquare, Mail, Settings, Target, 
  TrendingUp, Users, Crown, Search, SlidersHorizontal, MessageCircle, Scissors, User, UserCircle, 
  Smartphone, Grid, X, Gem, Check, PieChart, Store, CalendarOff, Music, Ticket, HeartHandshake,
  ShieldCheck, Info, Menu
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { 
  getRegistrationTemplate, 
  getNewBookingShopTemplate, 
  getBookingConfirmationTemplate 
} from '@/lib/emailTemplates';

// Yardımcı Fonksiyonlar
const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

function parseDuration(d) { 
  const m = (d||'').match(/\d+/); 
  return m ? parseInt(m[0]) : 30; 
}

function getRequiredSlots(d) { 
  return Math.ceil(parseDuration(d) / 30); 
}

const allTimeSlots = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30",
  "14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30",
  "20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30","00:00","00:30","01:00","01:30","02:00"
];

const defaultWorkingHours = [
  {day:'Pazartesi',open:'09:00',close:'19:00',isClosed:false},
  {day:'Salı',open:'09:00',close:'19:00',isClosed:false},
  {day:'Çarşamba',open:'09:00',close:'19:00',isClosed:false},
  {day:'Perşembe',open:'09:00',close:'19:00',isClosed:false},
  {day:'Cuma',open:'09:00',close:'19:00',isClosed:false},
  {day:'Cumartesi',open:'09:00',close:'19:00',isClosed:false},
  {day:'Pazar',open:'09:00',close:'19:00',isClosed:true}
];

const cyprusRegions = ["Girne", "Lefkoşa", "Mağusa", "İskele", "Güzelyurt", "Lefke"];

export default function Home() {
  const router = useRouter(); 
  
  const [step, setStep] = useState('services'); 
  const [shops, setShops] = useState([]);
  const [showFeaturesMenu, setShowFeaturesMenu] = useState(false); 
  const [activeFeature, setActiveFeature] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null); 
  
  const [bookingData, setBookingData] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    time: '', 
    selectedShopService: null, 
    selectedStaff: null, 
    selectedEvent: null 
  });
  
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
  
  const [newShop, setNewShop] = useState({ 
    name: '', category: 'Berber', location: 'Girne', address: '', maps_link: '', 
    phoneCode: '+90', contactPhone: '', contactInsta: '', contactEmail: '', 
    username: '', password: '', email: '', description: '', logoFile: null, package: 'Standart Paket' 
  });
  
  const [isUploading, setIsUploading] = useState(false); 
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [emailValid, setEmailValid] = useState(null); 
  const [phoneValid, setPhoneValid] = useState(null); 
  const [adminEmailValid, setAdminEmailValid] = useState(null);
  
  const [appointments, setAppointments] = useState([]); 
  const [globalAppointments, setGlobalAppointments] = useState([]); 
  const [closedSlots, setClosedSlots] = useState([]); 
  const [profileTab, setProfileTab] = useState('services');
  
  const [cookieConsent, setCookieConsent] = useState(true);
  const [lang, setLang] = useState('TR');

  // VERCEL'İ PATLATAN EKSİK SATIRLAR BURAYA EKLENDİ
  const approvedShops = shops.filter(s => s.status === 'approved');
  const isClub = selectedShop?.category === 'Bar & Club';

  // ================= DİL SÖZLÜĞÜ (TRANSLATIONS) =================
  const t = {
    TR: {
      nav: { places: "İşletmeler", features: "Özellikler", why: "Neden Bookcy", about: "Hakkımızda & Paketler", contact: "İletişim", addShop: "İşletme Ekle", login: "Giriş", logout: "Çıkış", panel: "Panel" },
      mega: { setup: "Kurulum", engage: "Müşterileri Etkile", manage: "İşletmeni Yönet", grow: "Büyümeye Devam Et", btn: "Tüm Özellikleri Keşfet" },
      hero: { eyebrow: "Kıbrıs'ın #1 Güzellik Platformu", title1: "Kendine", title2: "iyi bak,", title3: "hemen", title4: "randevu al.", sub: "Yakınındaki en iyi berber, kuaför, spa ve güzellik uzmanlarını bul. Tek tıkla randevu al, zamanın senin olsun.", searchPlace: "Hizmet veya mekan ara...", searchLoc: "Nerede?", btn: "ARA", pop: "Popüler:", stat1: "Aktif İşletme", stat2: "Mutlu Müşteri", stat3: "Tamamlanan İşlem", stat4: "Memnuniyet" },
      cats: { title: "Kategoriler", sub: "Bugün ne yaptırmak istersiniz?", seeAll: "Tümünü Gör →" },
      featured: { title: "Öne Çıkanlar", sub: "Kıbrıs'ta Bu Hafta 🔥" },
      how: { title: "Nasıl Çalışır?", sub: "4 Basit Adımda Randevun Hazır", s1: "Keşfet", d1: "Yakındaki mekanları incele ve filtrele.", s2: "Tarih Seç", d2: "Sana en uygun zamanı tek tıkla seç.", s3: "Onayla", d3: "Saniyeler içinde rezervasyonun onaylanır.", s4: "Keyif Çıkar", d4: "Git, hizmetini al ve puan ver." },
      why: { tag: "Farkı Keşfedin", title1: "Neden", title2: "Bookcy", title3: "Kullanıyorlar?", sub: "Kişisel bakım yolculuğunuzun en güvenilir ortağıyız.", c1: "Öncü Platform", d1: "Kıbrıs’ta ilk ve öncü randevu platformlarından biri olarak, sektöre yön veriyoruz.", c2: "Entegre Sistem", d2: "Farklı sektörleri tek çatı altında toplayarak kapsamlı deneyim sunuyoruz.", c3: "Gerçek Müşteri", d3: "İşletmelere gerçek müşteri kazandıran aktif bir trafik sağlıyoruz.", c4: "Üst Düzey Arayüz", d4: "Sade, hızlı ve kullanıcı dostu modern bir arayüz sunuyoruz.", c5: "Maksimum Kazanç", d5: "İşletmeler için adil, şeffaf ve komisyonsuz modelimiz ile gelirinizi katlamanızı sağlıyoruz.", c6: "Gelişmiş Otomasyon", d6: "Yüksek performanslı altyapımızla yakında eklenecek SMS ve gelişmiş bildirim sistemleri.", btn: "Hemen Aramıza Katıl" },
      shops: { back: "GERİ DÖN", title: "Arama Sonuçları", found: "Mekan Bulundu", search: "Mekan Ara...", allReg: "Tüm Bölgeler", allCat: "Tüm Kategoriler", select: "SEÇ", empty: "Aradığınız kriterlere uygun mekan bulunamadı." },
      profile: { events: "Etkinlikler", services: "Hizmetler", gallery: "Galeri", about: "Hakkında", soldOut: "TÜKENDİ", select: "SEÇ", emptySrv: "Henüz hizmet eklenmemiş.", emptyGal: "Galeri boş.", emptyDesc: "İşletme henüz bir açıklama eklememiş." },
      booking: { title: "Randevu Detayları", back: "Geri", startEvent: "Başlamak için sol taraftan bir etkinlik seçin.", startSrv: "Devam etmek için sol taraftan bir hizmet seçin.", srv: "Hizmet", staff: "Uzman", time: "Zaman", total: "Toplam", selectStaff: "Uzman Seçin", any: "Fark Etmez", closed: "İŞLETME BU TARİHTE KAPALI", name: "Adınız", surname: "Soyadınız", phone: "Telefon", email: "E-Posta", confirm: "RANDEVUYU ONAYLA" },
      success: { title: "RANDEVU ONAYLANDI", desc: "Bilgileriniz işletmeye başarıyla iletildi. Lütfen randevu saatinizde mekanda bulunmayı unutmayınız.", rateTitle: "Bizi Değerlendirin", q1: "Nasıl buldunuz?", q2: "Kullanımı kolay mı?", q3: "Memnun musunuz?", q4: "İşlem Hızlı mıydı?", btn: "Gönder ve Tamamla", thanks: "Teşekkür Ederiz!", saved: "Değerlendirmeniz başarıyla kaydedildi.", home: "ANA SAYFAYA DÖN" },
      aboutPage: { tag: "Sektörün Dijital Devrimi", title1: "İşletmeni Dijitale Taşı,", title2: "Kazancını Katla", sub: "Kıbrıs’taki en iyi işletmeler randevularını Bookcy ile yönetiyor.", wTag: "Biz Kimiz?", w1: "Bookcy, Kıbrıs’ta kurulan ilk ve tek kapsamlı online randevu platformu olarak, işletmelerin dijital dönüşümünü hızlandırmak için geliştirilmiştir.", w2: "Güzellikten bakıma, spadan yaşam tarzı hizmetlerine kadar birçok sektörü tek çatı altında buluşturarak, hem işletmelere hem müşterilere yeni nesil bir deneyim sunuyoruz.", w3: "Biz sadece bir randevu sistemi değiliz", w4: "işletmelerin büyümesini sağlayan dijital altyapıyız.", pTag: "Size Uygun Planı Seçin", pTitle: "İşletme Paketleri", std: "Standart Paket", mo: "/ Aylık", pr: "Premium Paket", pop: "En Çok Tercih Edilen", btn1: "Hemen Başla", btn2: "Premium'a Geç" },
      contactPage: { title: "BİZE ULAŞIN", sub: "Sorularınız, destek talepleriniz veya sponsorluk görüşmeleri için bize her zaman ulaşabilirsiniz.", wp1: "Anında destek ve işletme başvuruları için bize yazın.", wp2: "MESAJ GÖNDER", ig1: "En yeni mekanları keşfedin ve bizi takip edin.", ig2: "TAKİP ET", mail1: "Kurumsal görüşmeler ve reklam teklifleri için.", mail2: "MAİL AT" },
      footer: { desc: "Bookcy, Kıbrıs'ın pazar lideri ve en kapsamlı yeni nesil randevu platformudur.", col1: "Platform", col2: "Bölgeler", col3: "Yasal & Sözleşmeler", right1: "Tüm hakları saklıdır." },
      legal: { upd: "Son Güncelleme: 10 Nisan 2024" },
      modal: { regTitle: "İŞLETME KAYIT", regSub: "Sadece İşletme Sahipleri İçindir", shopName: "İşletme Adı", address: "Tam Adres", map: "Google Maps Linki", phone: "İşletme Telefonu", insta: "Instagram Linki", mail: "İletişim E-Posta", adminMail: "Admin E-Posta (Giriş için)", desc: "Hakkımızda", logo: "Logo Yükle", user: "Kullanıcı Adı", pass: "Şifre", btnReg: "BAŞVURUYU TAMAMLA", loading: "YÜKLENİYOR...", success: "BAŞVURUNUZ ALINDI!", bank: "Banka Bilgileri / Bank Details:", bankDesc: "Bizi tercih ettiğiniz için teşekkür ederiz. İşletme profilinizin onaylanıp yayına alınabilmesi için lütfen ödeme dekontunuzu WhatsApp destek hattımız üzerinden bize iletiniz.", btnBank: "DEKONTU İLET", logTitle: "GİRİŞ YAP", logSub: "İŞ ORTAĞI PANELİ", own: "YÖNETİCİ", stf: "PERSONEL", wait: "BEKLEYİN...", btnLog: "PANELE GİT" },
      cookie: { title: "Çerez Politikası ve Gizlilik Sözleşmesi", desc1: "Size daha iyi bir deneyim sunabilmek için çerezleri kullanıyoruz. Sitemizi kullanmaya devam ederek", l1: "Çerez Politikamızı", desc2: "ve", l2: "Gizlilik Sözleşmemizi", desc3: "kabul etmiş olursunuz.", btn1: "İncele", btn2: "Kabul Ediyorum" },
      featNames: { profile: "Bookcy Profili", market: "Pazaryeri Listeleme", team: "Ekip Yönetimi", booking: "Online Randevu", app: "Müşteri Uygulaması", marketing: "Pazarlama Araçları", calendar: "Takvim & Planlama", crm: "Müşteri Yönetimi", boost: "Öne Çık", stats: "İstatistik & Raporlar" },
      featDesc: { profile: "İşletmenizin dijital vitrinini saniyeler içinde oluşturun.", market: "Bookcy kullanan binlerce aktif müşteriye doğrudan ulaşın.", team: "Personelinizin çalışma saatlerini kolayca yönetin.", booking: "Müşterilerinizin 7/24 randevu almasını sağlayın.", app: "Müşterilerinize özel mobil uygulama konforu sunun.", marketing: "Doğru zamanda doğru mesajı gönderin.", calendar: "Akıllı dijital takvim ile çakışmaları önleyin.", crm: "Müşteri geçmişini güvenle saklayın.", boost: "Aramalarda üst sıralara çıkın.", stats: "Anlık ve net raporlarla kazancınızı görün." }
    },
    EN: {
      nav: { places: "Businesses", features: "Features", why: "Why Bookcy", about: "About & Packages", contact: "Contact", addShop: "Add Business", login: "Login", logout: "Logout", panel: "Dashboard" },
      mega: { setup: "Setup", engage: "Engage Clients", manage: "Manage Business", grow: "Keep Growing", btn: "Explore All Features" },
      hero: { eyebrow: "Cyprus's #1 Beauty Platform", title1: "Take care", title2: "of yourself,", title3: "book", title4: "instantly.", sub: "Find the best barbers, salons, spas and beauty experts nearby. Book with one click, your time is yours.", searchPlace: "Search services or places...", searchLoc: "Where?", btn: "SEARCH", pop: "Popular:", stat1: "Active Businesses", stat2: "Happy Clients", stat3: "Completed Bookings", stat4: "Satisfaction" },
      cats: { title: "Categories", sub: "What are you looking for today?", seeAll: "See All →" },
      featured: { title: "Featured", sub: "Trending This Week 🔥" },
      how: { title: "How it works?", sub: "Ready in 4 Simple Steps", s1: "Discover", d1: "Find and filter nearby places.", s2: "Select Date", d2: "Pick the best time with one click.", s3: "Confirm", d3: "Booking confirmed in seconds.", s4: "Enjoy", d4: "Get your service and leave a rating." },
      why: { tag: "Discover the Difference", title1: "Why", title2: "Bookcy?", title3: "", sub: "Your most trusted partner in personal care.", c1: "Pioneer Platform", d1: "As the first and leading booking platform in Cyprus, we guide the industry.", c2: "Integrated System", d2: "We offer a comprehensive experience by bringing different sectors under one roof.", c3: "Real Customers", d3: "We provide active traffic that brings real customers to businesses.", c4: "High-End Interface", d4: "We offer a simple, fast, and user-friendly modern interface.", c5: "Maximum Profit", d5: "We help you multiply your income with our fair, transparent, zero-commission model.", c6: "Advanced Automation", d6: "Upcoming SMS and advanced notification systems with our high-performance infrastructure.", btn: "Join Us Now" },
      shops: { back: "GO BACK", title: "Search Results", found: "Places Found", search: "Search Place...", allReg: "All Regions", allCat: "All Categories", select: "SELECT", empty: "No places found matching your criteria." },
      profile: { events: "Events", services: "Services", gallery: "Gallery", about: "About", soldOut: "SOLD OUT", select: "SELECT", emptySrv: "No services added yet.", emptyGal: "Gallery is empty.", emptyDesc: "No description added yet." },
      booking: { title: "Booking Details", back: "Back", startEvent: "Select an event from the left to start.", startSrv: "Select a service from the left to continue.", srv: "Service", staff: "Staff", time: "Time", total: "Total", selectStaff: "Select Staff", any: "Any Staff", closed: "SHOP IS CLOSED ON THIS DATE", name: "First Name", surname: "Last Name", phone: "Phone", email: "Email", confirm: "CONFIRM BOOKING" },
      success: { title: "BOOKING CONFIRMED", desc: "Your details have been sent to the business. Please remember to be at the venue at your appointment time.", rateTitle: "Rate Us", q1: "How was it?", q2: "Was it easy to use?", q3: "Are you satisfied?", q4: "Was it fast?", btn: "Submit & Complete", thanks: "Thank You!", saved: "Your rating has been successfully saved.", home: "BACK TO HOME" },
      aboutPage: { tag: "The Industry's Digital Revolution", title1: "Digitize Your Business,", title2: "Multiply Your Income", sub: "The best businesses in Cyprus manage their bookings with Bookcy.", wTag: "Who Are We?", w1: "Bookcy, as the first and only comprehensive online booking platform founded in Cyprus, was developed to accelerate the digital transformation of businesses.", w2: "By bringing many sectors under one roof, from beauty to care, spa to lifestyle services, we offer a next-generation experience to both businesses and customers.", w3: "We are not just a booking system", w4: "we are the digital infrastructure that enables businesses to grow.", pTag: "Choose Your Plan", pTitle: "Business Packages", std: "Standard Package", mo: "/ Month", pr: "Premium Package", pop: "Most Popular", btn1: "Get Started", btn2: "Upgrade to Premium" },
      contactPage: { title: "CONTACT US", sub: "You can always reach out to us for questions, support requests, or sponsorship inquiries.", wp1: "Write to us for instant support and business applications.", wp2: "SEND MESSAGE", ig1: "Discover the newest places and follow us.", ig2: "FOLLOW", mail1: "For corporate inquiries and advertising offers.", mail2: "SEND EMAIL" },
      footer: { desc: "Bookcy is Cyprus's market-leading and most comprehensive next-generation booking platform.", col1: "Platform", col2: "Regions", col3: "Legal & Terms", right1: "All rights reserved." },
      legal: { upd: "Last Update: April 10, 2024" },
      modal: { regTitle: "BUSINESS REGISTRATION", regSub: "For Business Owners Only", shopName: "Business Name", address: "Full Address", map: "Google Maps Link", phone: "Business Phone", insta: "Instagram Link", mail: "Contact Email", adminMail: "Admin Email (For Login)", desc: "About Us", logo: "Upload Logo", user: "Username", pass: "Password", btnReg: "COMPLETE APPLICATION", loading: "UPLOADING...", success: "APPLICATION RECEIVED!", bank: "Bank Details:", bankDesc: "Thank you for choosing us. Please send your payment receipt via our WhatsApp support line so your business profile can be approved and published.", btnBank: "SEND RECEIPT", logTitle: "LOGIN", logSub: "PARTNER DASHBOARD", own: "OWNER", stf: "STAFF", wait: "PLEASE WAIT...", btnLog: "GO TO DASHBOARD" },
      cookie: { title: "Cookie Policy & Privacy Agreement", desc1: "We use cookies to provide you with a better experience. By continuing to use our site, you agree to our", l1: "Cookie Policy", desc2: "and", l2: "Privacy Policy", desc3: ".", btn1: "Review", btn2: "I Accept" },
      featNames: { profile: "Bookcy Profile", market: "Marketplace Listing", team: "Team Management", booking: "Online Booking", app: "Customer App", marketing: "Marketing Tools", calendar: "Calendar & Planning", crm: "Client Management", boost: "Boost", stats: "Stats & Reports" },
      featDesc: { profile: "Create your digital storefront in seconds.", market: "Reach thousands of active customers directly.", team: "Easily manage your staff's working hours.", booking: "Allow your clients to book 24/7.", app: "Offer exclusive mobile app comfort to your clients.", marketing: "Send the right message at the right time.", calendar: "Prevent conflicts with a smart digital calendar.", crm: "Safely store your client history.", boost: "Rank higher in search results.", stats: "See your earnings with instant and clear reports." }
    },
    RU: {
      nav: { places: "Заведения", features: "Функции", why: "Почему Bookcy", about: "О нас и пакеты", contact: "Контакты", addShop: "Добавить бизнес", login: "Вход", logout: "Выйти", panel: "Панель" },
      mega: { setup: "Настройка", engage: "Привлечение клиентов", manage: "Управление", grow: "Развитие", btn: "Все функции" },
      hero: { eyebrow: "Платформа красоты #1 на Кипре", title1: "Позаботьтесь", title2: "о себе,", title3: "забронируйте", title4: "сейчас.", sub: "Найдите лучших мастеров поблизости. Бронируйте в один клик, ваше время принадлежит вам.", searchPlace: "Поиск услуг или мест...", searchLoc: "Где?", btn: "ПОИСК", pop: "Популярные:", stat1: "Активные заведения", stat2: "Счастливые клиенты", stat3: "Завершенные брони", stat4: "Удовлетворенность" },
      cats: { title: "Категории", sub: "Что вы ищете сегодня?", seeAll: "Показать все →" },
      featured: { title: "Рекомендуемые", sub: "В тренде на этой неделе 🔥" },
      how: { title: "Как это работает?", sub: "Готово за 4 простых шага", s1: "Найти", d1: "Ищите заведения поблизости.", s2: "Выбрать", d2: "Выберите лучшее время.", s3: "Подтвердить", d3: "Мгновенное подтверждение.", s4: "Наслаждаться", d4: "Получите услугу и оцените." },
      why: { tag: "Почувствуйте разницу", title1: "Почему", title2: "выбирают", title3: "Bookcy?", sub: "Ваш надежный партнер в сфере ухода за собой.", c1: "Платформа-лидер", d1: "Первая и ведущая платформа бронирования на Кипре.", c2: "Интегрированная система", d2: "Различные сектора под одной крышей.", c3: "Реальные клиенты", d3: "Активный трафик реальных клиентов.", c4: "Современный интерфейс", d4: "Простой и удобный дизайн.", c5: "Максимум дохода", d5: "Справедливая модель без комиссий.", c6: "Продвинутая автоматизация", d6: "Скоро: SMS и смарт-уведомления.", btn: "Присоединяйтесь сейчас" },
      shops: { back: "НАЗАД", title: "Результаты поиска", found: "Мест найдено", search: "Поиск...", allReg: "Все регионы", allCat: "Все категории", select: "ВЫБРАТЬ", empty: "По вашим критериям ничего не найдено." },
      profile: { events: "События", services: "Услуги", gallery: "Галерея", about: "О нас", soldOut: "РАСПРОДАНО", select: "ВЫБРАТЬ", emptySrv: "Услуги еще не добавлены.", emptyGal: "Галерея пуста.", emptyDesc: "Описание еще не добавлено." },
      booking: { title: "Детали бронирования", back: "Назад", startEvent: "Выберите событие для начала.", startSrv: "Выберите услугу для продолжения.", srv: "Услуга", staff: "Специалист", time: "Время", total: "Итого", selectStaff: "Выберите специалиста", any: "Любой", closed: "ЗАКРЫТО В ЭТУ ДАТУ", name: "Имя", surname: "Фамилия", phone: "Телефон", email: "Email", confirm: "ПОДТВЕРДИТЬ БРОНЬ" },
      success: { title: "БРОНЬ ПОДТВЕРЖДЕНА", desc: "Ваши данные отправлены. Пожалуйста, будьте на месте вовремя.", rateTitle: "Оцените нас", q1: "Как вам?", q2: "Легко ли использовать?", q3: "Вы довольны?", q4: "Было ли быстро?", btn: "Отправить и завершить", thanks: "Спасибо!", saved: "Ваша оценка успешно сохранена.", home: "НА ГЛАВНУЮ" },
      aboutPage: { tag: "Цифровая революция отрасли", title1: "Оцифруйте бизнес,", title2: "Умножьте доход", sub: "Лучшие заведения Кипра управляют бронированиями с Bookcy.", wTag: "Кто мы?", w1: "Bookcy — первая комплексная платформа онлайн-бронирования на Кипре, созданная для цифровой трансформации бизнеса.", w2: "Объединяя множество секторов, мы предлагаем новый опыт как для бизнеса, так и для клиентов.", w3: "Мы не просто система бронирования", w4: "мы — цифровая инфраструктура для роста вашего бизнеса.", pTag: "Выберите свой план", pTitle: "Пакеты для бизнеса", std: "Стандартный Пакет", mo: "/ в месяц", pr: "Премиум Пакет", pop: "Самый популярный", btn1: "Начать", btn2: "Перейти на Премиум" },
      contactPage: { title: "СВЯЖИТЕСЬ С НАМИ", sub: "Вы всегда можете связаться с нами для вопросов, поддержки или сотрудничества.", wp1: "Напишите нам для мгновенной поддержки.", wp2: "ОТПРАВИТЬ СООБЩЕНИЕ", ig1: "Открывайте новые места и подписывайтесь на нас.", ig2: "ПОДПИСАТЬСЯ", mail1: "Для корпоративных запросов и рекламы.", mail2: "ОТПРАВИТЬ EMAIL" },
      footer: { desc: "Bookcy — ведущая платформа бронирования нового поколения на Кипре.", col1: "Платформа", col2: "Регионы", col3: "Документы", right1: "Все права защищены." },
      legal: { upd: "Последнее обновление: 10 апреля 2024 г." },
      modal: { regTitle: "РЕГИСТРАЦИЯ БИЗНЕСА", regSub: "Только для владельцев", shopName: "Название бизнеса", address: "Полный адрес", map: "Ссылка на Google Maps", phone: "Телефон", insta: "Ссылка на Instagram", mail: "Email для связи", adminMail: "Email администратора", desc: "О нас", logo: "Загрузить логотип", user: "Имя пользователя", pass: "Пароль", btnReg: "ЗАВЕРШИТЬ РЕГИСТРАЦИЮ", loading: "ЗАГРУЗКА...", success: "ЗАЯВКА ПОЛУЧЕНА!", bank: "Банковские реквизиты:", bankDesc: "Спасибо, что выбрали нас. Пожалуйста, отправьте квитанцию об оплате в WhatsApp, чтобы мы могли подтвердить ваш профиль.", btnBank: "ОТПРАВИТЬ КВИТАНЦИЮ", logTitle: "ВХОД", logSub: "ПАНЕЛЬ ПАРТНЕРА", own: "МЕНЕДЖЕР", stf: "ПЕРСОНАЛ", wait: "ПОДОЖДИТЕ...", btnLog: "ВОЙТИ" },
      cookie: { title: "Политика использования файлов cookie", desc1: "Мы используем файлы cookie. Продолжая использовать сайт, вы соглашаетесь с", l1: "Политикой cookie", desc2: "и", l2: "Политикой конфиденциальности", desc3: ".", btn1: "Обзор", btn2: "Я согласен" },
      featNames: { profile: "Профиль Bookcy", market: "Маркетплейс", team: "Управление командой", booking: "Онлайн-бронирование", app: "Приложение клиента", marketing: "Инструменты маркетинга", calendar: "Календарь и планирование", crm: "Управление клиентами", boost: "Продвижение", stats: "Статистика и отчеты" },
      featDesc: { profile: "Создайте витрину за секунды.", market: "Охватите тысячи активных клиентов.", team: "Управляйте графиком персонала.", booking: "Позвольте клиентам бронировать 24/7.", app: "Предложите клиентам удобное мобильное приложение.", marketing: "Отправляйте сообщения в нужное время.", calendar: "Избегайте накладок с помощью смарт-календаря.", crm: "Надежно храните историю клиентов.", boost: "Поднимитесь в результатах поиска.", stats: "Следите за доходами с помощью отчетов." }
    }
  };
  // =============================================================

  useEffect(() => {
    const consent = localStorage.getItem('bookcy_cookie_consent');
    if (!consent) {
      setCookieConsent(false);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('bookcy_cookie_consent', 'true');
    setCookieConsent(true);
  };

  const handleHeroSearch = (e) => { 
    e.preventDefault(); 
    setStep('all_shops'); 
    window.scrollTo(0,0); 
  };
  
  const handleBookingEmailChange = (e) => { 
    const val = e.target.value; 
    setFormData(prev => ({...prev, email: val})); 
    setBookingEmailValid(val === '' ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)); 
  };
  
  const handleBookingPhoneChange = (e) => { 
    const val = e.target.value; 
    setFormData(prev => ({...prev, phone: val})); 
    setBookingPhoneValid(val === '' ? null : val.replace(/\s/g, '').length >= 7); 
  };
  
  const handleEmailChange = (e) => { 
    const val = e.target.value; 
    setNewShop(prev => ({...prev, email: val})); 
    setEmailValid(val === '' ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)); 
  };
  
  const handleAdminEmailChange = (e) => { 
    const val = e.target.value; 
    setNewShop(prev => ({...prev, contactEmail: val})); 
    setAdminEmailValid(val === '' ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)); 
  };
  
  const handlePhoneChange = (e) => { 
    const val = e.target.value; 
    setNewShop(prev => ({...prev, contactPhone: val})); 
    setPhoneValid(val === '' ? null : val.replace(/\s/g, '').length >= 7); 
  };

  const packages = [ 
    { name: "Standart Paket", price: `60 STG / Aylık` }, 
    { name: "Premium Paket", price: `100 STG / Aylık` } 
  ];
  
  const categories = [ 
      { key: "barber", dbName: "Berber", bg: "linear-gradient(135deg,#1a1a2e,#2d1b4e)", emoji: "💈" }, 
      { key: "hair", dbName: "Kuaför", bg: "linear-gradient(135deg,#f5c5a3,#e8622a)", emoji: "✂️" }, 
      { key: "nail", dbName: "Tırnak & Güzellik", bg: "linear-gradient(135deg,#ffd6e7,#ff88b2)", emoji: "💅" }, 
      { key: "tattoo", dbName: "Dövme", bg: "linear-gradient(135deg,#1a1a1a,#444)", emoji: "🖋️" }, 
      { key: "spa", dbName: "Spa & Masaj", bg: "linear-gradient(135deg,#d4f5e9,#00c48c)", emoji: "💆" }, 
      { key: "skincare", dbName: "Cilt Bakımı", bg: "linear-gradient(135deg,#e8f4fd,#3498db)", emoji: "🧴" }, 
      { key: "makeup", dbName: "Makyaj", bg: "linear-gradient(135deg,#fff0e6,#e8622a)", emoji: "💄" }, 
      { key: "club", dbName: "Bar & Club", bg: "linear-gradient(135deg,#1a0a0a,#3d1515)", emoji: "🍸" } 
  ];

  const featureIcons = { 
    profile: <Briefcase size={40} className="text-[#E8622A] mb-4"/>, 
    market: <Store size={40} className="text-[#E8622A] mb-4"/>, 
    team: <Users size={40} className="text-[#E8622A] mb-4"/>, 
    booking: <Target size={40} className="text-[#E8622A] mb-4"/>, 
    app: <Smartphone size={40} className="text-[#E8622A] mb-4"/>, 
    marketing: <Target size={40} className="text-[#E8622A] mb-4"/>, 
    calendar: <Calendar size={40} className="text-[#E8622A] mb-4"/>, 
    crm: <User size={40} className="text-[#E8622A] mb-4"/>, 
    boost: <TrendingUp size={40} className="text-[#E8622A] mb-4"/>, 
    stats: <PieChart size={40} className="text-[#E8622A] mb-4"/> 
  };

  const featureIconsSmall = { 
    profile: <Briefcase size={20}/>, market: <Store size={20}/>, team: <Users size={20}/>, 
    booking: <Target size={20}/>, app: <Smartphone size={20}/>, marketing: <Target size={20}/>, 
    calendar: <Calendar size={20}/>, crm: <User size={20}/>, boost: <TrendingUp size={20}/>, stats: <PieChart size={20}/> 
  };

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
      }
      return 0;
  });

  const recommendedShops = approvedShops.filter(s => s.package === 'Premium' || s.package === 'Premium Paket').slice(0, 4);

  async function fetchGlobalAppointments() { 
    const { data } = await supabase.from('appointments').select('customer_phone'); 
    if (data) setGlobalAppointments(data); 
  }
  
  async function fetchShops() { 
    const { data } = await supabase.from('shops').select('*'); 
    if (data) setShops(data); 
  }
  
  async function fetchAppointments(shopId, date = null) { 
    let query = supabase.from('appointments').select('*').eq('shop_id', shopId); 
    if (date) query = query.eq('appointment_date', date); 
    const { data } = await query; 
    if (data) setAppointments(data); 
  }
  
  async function fetchClosedSlots(shopId, date = null) { 
    let query = supabase.from('closed_slots').select('*').eq('shop_id', shopId); 
    if (date) query = query.eq('date', date); 
    const { data } = await query; 
    if (data) setClosedSlots(data.map(item => item.slot)); 
  }

  useEffect(() => { 
    fetchShops(); 
    fetchGlobalAppointments(); 
    const session = localStorage.getItem('bookcy_biz_session'); 
    if(session) setLoggedInShop(JSON.parse(session)); 
  }, []);

  useEffect(() => { 
    if (selectedShop && bookingData.date) { 
      fetchAppointments(selectedShop.id, bookingData.date); 
      fetchClosedSlots(selectedShop.id, bookingData.date); 
    } 
  }, [selectedShop, bookingData.date]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => { 
      entries.forEach(e => { 
        if(e.isIntersecting) { e.target.classList.add('visible'); } 
      }); 
    }, { threshold: 0.12 });
    
    reveals.forEach(r => observer.observe(r));

    const handleScroll = () => {
        const nav = document.querySelector('nav');
        if(nav) {
            if (window.scrollY > 20) {
                nav.style.background = 'rgba(255, 255, 255, 0.98)';
                nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.05)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.98)';
                nav.style.boxShadow = 'none';
            }
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => { 
      window.removeEventListener('scroll', handleScroll); 
      observer.disconnect(); 
    };
  }, [step]);

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsLoginLoading(true);
    
    const shop = shops.find(s => s.admin_username?.toLowerCase() === loginUsername.trim().toLowerCase());
    
    if (!shop) { 
      alert("Hatalı İşletme Kullanıcı Adı!"); 
      setIsLoginLoading(false); 
      return; 
    }
    
    if (shop.status !== 'approved' && shop.status) { 
      alert("Hesabınız henüz onaylanmamış! Lütfen dekontunuzu iletip onay bekleyiniz."); 
      setIsLoginLoading(false); 
      return; 
    }
    
    if (loginType === 'owner') {
      if (shop.admin_password !== loginPassword.trim()) { 
        alert("Hatalı Şifre!"); 
        setIsLoginLoading(false); 
        return; 
      }
      localStorage.setItem('bookcy_biz_session', JSON.stringify({ role: 'owner', shopData: shop })); 
      setShowLogin(false); 
      setIsLoginLoading(false); 
      router.push('/dashboard');
    } else {
      const validStaff = (shop.staff || []).find(s => s.name.toLowerCase() === loginStaffName.trim().toLowerCase() && s.password === loginPassword.trim());
      if (!validStaff) { 
        alert("Hatalı Personel Adı veya Şifre!"); 
        setIsLoginLoading(false); 
        return; 
      }
      localStorage.setItem('bookcy_biz_session', JSON.stringify({ role: 'staff', staffName: validStaff.name, shopData: shop })); 
      setShowLogin(false); 
      setIsLoginLoading(false); 
      router.push('/dashboard');
    }
  };

  const handleLogout = () => { 
    localStorage.removeItem('bookcy_biz_session'); 
    setLoggedInShop(null); 
  };
  
  const goToFeature = (featureKey) => { 
    if(t[lang].featNames[featureKey]) {
      setActiveFeature(featureKey); 
      setStep('feature_detail'); 
      setShowFeaturesMenu(false); 
      setIsMobileMenuOpen(false);
      window.scrollTo(0,0); 
    }
  };

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    if (emailValid === false || phoneValid === false || adminEmailValid === false) { 
      return alert("Lütfen iletişim bilgilerinizi doğru formatta giriniz."); 
    }
    
    setIsUploading(true); 
    
    try {
      let uploadedLogoUrl = null;
      if (newShop.logoFile) {
        const fileName = `${Math.random()}.${newShop.logoFile.name.split('.').pop()}`;
        const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, newShop.logoFile);
        if (!uploadError) { 
          uploadedLogoUrl = supabase.storage.from('logos').getPublicUrl(fileName).data.publicUrl; 
        }
      }
      const fullPhone = newShop.phoneCode + " " + newShop.contactPhone;
      
      const { error } = await supabase.from('shops').insert([{ 
        name: newShop.name, 
        category: newShop.category, 
        location: newShop.location, 
        address: newShop.address, 
        maps_link: newShop.maps_link, 
        admin_email: newShop.email, 
        admin_username: newShop.username, 
        admin_password: newShop.password, 
        description: newShop.description, 
        logo_url: uploadedLogoUrl, 
        package: newShop.package, 
        status: 'pending', 
        contact_phone: fullPhone, 
        contact_insta: newShop.contactInsta, 
        contact_email: newShop.contactEmail, 
        services: [], 
        staff: [], 
        gallery: [], 
        closed_dates: [], 
        events: [] 
      }]);
      
      if (!error) {
        try {
          await fetch('/api/email', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: newShop.email, 
              subject: 'Bookcy Kayıt Talebiniz Alındı',
              html: getRegistrationTemplate({ 
                shopName: newShop.name, 
                date: new Date().toLocaleDateString('tr-TR'), 
                packageName: newShop.package.toUpperCase(), 
                price: newShop.package === 'Premium Paket' ? '100 STG' : '60 STG' 
              })
            }),
          });
        } catch (mailErr) { 
          console.error(mailErr); 
        }
        setRegisterSuccess(true); 
      } else { 
        alert("Veritabanı Hatası: " + error.message); 
      }
    } catch (err) { 
      alert("Bir hata oluştu: " + err.message); 
    } finally { 
      setIsUploading(false); 
    }
  }

  async function handleBooking(e) {
    e.preventDefault();
    if (bookingEmailValid === false || bookingPhoneValid === false) { 
      return alert("Lütfen iletişim bilgilerinizi doğru formatta giriniz."); 
    }
    if(isClub) { 
      if(!bookingData.selectedEvent) { alert("Etkinliği seçin."); return; } 
      if(!bookingData.selectedShopService) { alert("VIP türünü seçin."); return; }
    } else { 
      if(!bookingData.selectedShopService) { alert("Devam etmek için hizmet seçin."); return; } 
      if(!bookingData.selectedStaff) { alert("UZMAN SEÇİN"); return; } 
    }

    const availableSlotsForBooking = getCurrentAvailableSlots();
    const startIndex = availableSlotsForBooking.indexOf(bookingData.time);
    const neededSlots = getRequiredSlots(bookingData.selectedShopService.duration);
    const occupied_slots = isClub ? [] : availableSlotsForBooking.slice(startIndex, startIndex + neededSlots);
    let assignedStaffName = isClub ? 'Rezervasyon' : bookingData.selectedStaff.name;
    
    if (!isClub && (assignedStaffName === "Fark Etmez" || assignedStaffName === 'Fark Etmez' || assignedStaffName === 'Any Staff' || assignedStaffName === 'Любой')) {
        if (selectedShop.staff && selectedShop.staff.length > 0) {
            const availableStaff = selectedShop.staff.find(staff => {
                return occupied_slots.every(checkSlot => {
                    if (closedSlots.includes(checkSlot)) return false;
                    const isBooked = appointments.some(a => a.staff_name === staff.name && (a.occupied_slots ? a.occupied_slots.includes(checkSlot) : a.appointment_time === checkSlot));
                    return !isBooked;
                });
            });
            assignedStaffName = availableStaff ? availableStaff.name : 'Genel';
        }
    }

    const fullPhone = formData.phoneCode + " " + formData.phone;
    const finalDate = isClub ? bookingData.selectedEvent.date : bookingData.date;
    const finalTime = isClub ? bookingData.selectedEvent.time : bookingData.time;

    const { error } = await supabase.from('appointments').insert([{ 
      shop_id: selectedShop.id, 
      customer_name: formData.name, 
      customer_surname: formData.surname, 
      customer_phone: fullPhone, 
      customer_email: formData.email, 
      appointment_date: finalDate, 
      appointment_time: finalTime, 
      service_name: bookingData.selectedShopService.name, 
      staff_name: assignedStaffName, 
      occupied_slots: occupied_slots, 
      status: 'Bekliyor' 
    }]);
    
    if (!error) {
       try {
          await fetch('/api/email', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: selectedShop.admin_email, 
              subject: 'Yeni Randevu Bildirimi - Bookcy',
              html: getNewBookingShopTemplate({ 
                shopName: selectedShop.name, 
                date: finalDate, 
                time: finalTime, 
                service: bookingData.selectedShopService.name, 
                staff: assignedStaffName, 
                customerName: formData.name + " " + formData.surname, 
                customerPhone: fullPhone, 
                customerEmail: formData.email 
              })
            }),
          });
          
          await fetch('/api/email', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: formData.email, 
              subject: 'Randevunuz Alındı - Bookcy',
              html: getBookingConfirmationTemplate({ 
                customerName: formData.name, 
                shopName: selectedShop.name, 
                date: finalDate, 
                time: finalTime, 
                service: bookingData.selectedShopService.name, 
                staff: assignedStaffName, 
                address: selectedShop.address || selectedShop.location 
              })
            }),
          });
       } catch (mErr) { 
         console.error(mErr); 
       }
       
       setStep('success'); 
       window.scrollTo(0,0); 
    } else { 
      alert("Rezervasyon alınırken bir hata oluştu!"); 
    }
  }

  async function submitFeedback(e) {
    e.preventDefault();
    if(feedbackData.q1===null || feedbackData.q2===null || feedbackData.q3===null || feedbackData.q4===null) { 
      return alert("Lütfen tüm soruları puanlayınız."); 
    }
    setFeedbackSubmitted(true);
    const avg = Number(((feedbackData.q1 + feedbackData.q2 + feedbackData.q3 + feedbackData.q4) / 4).toFixed(1));
    await supabase.from('platform_feedback').insert([{ 
      q1: feedbackData.q1, 
      q2: feedbackData.q2, 
      q3: feedbackData.q3, 
      q4: feedbackData.q4, 
      average_score: avg 
    }]);
  }

  const getCurrentAvailableSlots = () => {
    if (!selectedShop || !bookingData.date || isClub) return allTimeSlots;
    if (selectedShop.closed_dates && selectedShop.closed_dates.includes(bookingData.date)) return [];
    
    const dayName = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][new Date(bookingData.date).getDay()];
    const workingHours = Array.isArray(selectedShop.working_hours) ? selectedShop.working_hours : defaultWorkingHours;
    const todayHours = workingHours.find(h => h.day === dayName);
    
    if (todayHours && todayHours.isClosed) { 
      return []; 
    } else if (todayHours) { 
      return allTimeSlots.filter(slot => slot >= todayHours.open && slot < todayHours.close); 
    }
    return allTimeSlots;
  };

  const currentAvailableSlots = getCurrentAvailableSlots();
  const isShopClosedToday = currentAvailableSlots.length === 0;

  const renderFeedbackScale = (qKey) => (
    <div className="flex gap-1 justify-center mt-3 mb-6 w-full max-w-full overflow-x-auto custom-scrollbar pb-2">
      {[0,1,2,3,4,5,6,7,8,9,10].map(num => (
        <button 
          key={num} 
          type="button" 
          onClick={() => setFeedbackData({...feedbackData, [qKey]: num})} 
          className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-black transition-all border shrink-0 ${feedbackData[qKey] === num ? 'bg-[#E8622A] text-white border-[#E8622A] scale-110 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-[#E8622A] cursor-pointer'}`}
        >
          {num}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        :root { 
          --fig: #2D1B4E; --terra: #E8622A; --c-bg-main: #FAF7F2; 
          --c-text-main: #2D1B4E; --c-nav-bg: rgba(255,255,255,0.98); 
        }
        body { 
          background: var(--c-bg-main); color: var(--c-text-main); 
          font-family: 'DM Sans', sans-serif; overflow-x: hidden; margin: 0; padding: 0; 
        }
        
        nav { 
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 0 40px; 
          height: 76px; display: flex; align-items: center; justify-content: space-between; 
          background: var(--c-nav-bg); backdrop-filter: blur(20px); 
          border-bottom: 1px solid #F1F5F9; transition: all 0.3s; 
        }
        
        .nav-logo-box { width: 180px; height: 50px; display: flex; align-items: center; cursor: pointer; } 
        .nav-logo-box img { max-height: 100%; max-width: 100%; object-fit: contain; mix-blend-mode: multiply; transform: scale(1.4); transform-origin: left center;} 
        
        .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; height: 100%; margin:0; padding:0; }
        .nav-main-btn { text-decoration: none; font-size: 14px; font-weight: 700; color: #64748B; transition: all 0.2s; position: relative; background:none; border:none; outline:none; font-family:'DM Sans', sans-serif; cursor:pointer;}
        .nav-main-btn:hover, .nav-main-btn.active { color: var(--terra); }
        
        .lang-pills { display: flex; flex-direction: row; gap: 4px; } 
        .lang-pill { font-size: 11px; font-weight:600; padding: 4px 10px; border-radius: 20px; border: 1px solid transparent; transition: all 0.2s; color: #64748B; cursor:pointer; background:none;} 
        .lang-pill.active { background: var(--fig); color: white; border-color: var(--fig); } 
        .lang-pill:hover:not(.active) { border-color: #E2E8F0; color: var(--c-text-main); }
        
        .nav-right { display: flex; flex-direction: row; align-items: center; gap: 16px; flex-shrink: 0; }
        .btn-outline { font-family:'DM Sans',sans-serif; font-size: 13px; font-weight: 700; padding: 10px 20px; border-radius: 50px; border: 2px solid var(--c-text-main); background: transparent; color: var(--c-text-main); transition: all 0.25s; cursor:pointer; } 
        .btn-outline:hover { background:var(--c-text-main); color:white; }
        .btn-primary { font-family:'DM Sans',sans-serif; font-size: 13px; font-weight: 700; padding: 12px 24px; border-radius: 50px; border: none; background: var(--terra); color: white; transition: all 0.25s; display:flex; align-items:center; gap:8px; cursor:pointer; } 
        .btn-primary:hover { background: #d4561f; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(232,98,42,0.3); }
        
        .hero { position: relative; min-height: 100vh; background: var(--fig); overflow: hidden; display: flex; flex-direction:column; align-items: center; justify-content: center; padding-top: 140px; padding-bottom: 100px; }
        .hero::before { content:''; position:absolute; inset:0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events: none; z-index:1; opacity:0.4; }
        
        .hero-title { font-family:'Plus Jakarta Sans',sans-serif; font-size: clamp(40px, 8vw, 86px); font-weight:800; color: white; letter-spacing: -3px; line-height: 1.0; margin-bottom:24px; position:relative; z-index:2; text-align:center;}
        .hero-title .accent { color: var(--terra); } 
        
        .cat-card { display:flex; flex-direction:column; align-items:center; gap:12px; transition:transform 0.25s; cursor:pointer; background:none; border:none;} 
        .cat-card:hover { transform:translateY(-6px); }
        .cat-img-wrap { width:100%; aspect-ratio:1; border-radius:24px; overflow:hidden; position:relative; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid #E2E8F0; }
        .cat-emoji-bg { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:40px; border-radius:24px; }
        
        @media(max-width:900px){ 
          nav { padding:0 20px; } 
          .nav-links, .nav-right .btn-outline { display:none; } 
          .hero { padding-top: 120px; min-height: auto; padding-bottom:60px;} 
          .hero-title { font-size: 48px; letter-spacing: -2px;}
          .hero-content { width: 100%; padding: 0 16px; }
        }
      `}} />

      {/* MOBİL MENÜ OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col animate-in slide-in-from-right-full duration-300">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <div className="nav-logo-box"><img src="/logo.png" alt="Bookcy Logo" /></div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 bg-slate-50 rounded-full border-none cursor-pointer"><X size={24}/></button>
            </div>
            
            <div className="flex flex-col gap-2 p-6 overflow-y-auto">
                <button onClick={() => {setStep('all_shops'); setIsMobileMenuOpen(false); window.scrollTo(0,0);}} className="text-2xl font-black text-[#2D1B4E] text-left border-b border-slate-50 py-4 bg-transparent border-none cursor-pointer">{t[lang].nav.places}</button>
                <button onClick={() => {setStep('all_features'); setIsMobileMenuOpen(false); window.scrollTo(0,0);}} className="text-2xl font-black text-[#2D1B4E] text-left border-b border-slate-50 py-4 bg-transparent border-none cursor-pointer">{t[lang].nav.features}</button>
                <button onClick={() => {setStep('why_bookcy'); setIsMobileMenuOpen(false); window.scrollTo(0,0);}} className="text-2xl font-black text-[#2D1B4E] text-left border-b border-slate-50 py-4 bg-transparent border-none cursor-pointer">{t[lang].nav.why}</button>
                <button onClick={() => {setStep('about'); setIsMobileMenuOpen(false); window.scrollTo(0,0);}} className="text-2xl font-black text-[#2D1B4E] text-left border-b border-slate-50 py-4 bg-transparent border-none cursor-pointer">{t[lang].nav.about}</button>
                <button onClick={() => {setStep('contact'); setIsMobileMenuOpen(false); window.scrollTo(0,0);}} className="text-2xl font-black text-[#2D1B4E] text-left border-b border-slate-50 py-4 bg-transparent border-none cursor-pointer">{t[lang].nav.contact}</button>
            </div>
            
            <div className="mt-auto p-6 flex flex-col gap-4 bg-slate-50 border-t border-slate-100">
                 <div className="flex gap-2 justify-center mb-4">
                    <button onClick={()=>setLang('TR')} className={`lang-pill ${lang==='TR' ? 'active' : ''}`}>TR</button>
                    <button onClick={()=>setLang('EN')} className={`lang-pill ${lang==='EN' ? 'active' : ''}`}>EN</button>
                    <button onClick={()=>setLang('RU')} className={`lang-pill ${lang==='RU' ? 'active' : ''}`}>RU</button>
                 </div>
                 <button onClick={() => {setShowRegister(true); setIsMobileMenuOpen(false); window.scrollTo(0,0);}} className="w-full py-5 rounded-2xl border-2 border-[#2D1B4E] text-[#2D1B4E] font-black uppercase tracking-widest text-sm bg-transparent cursor-pointer">{t[lang].nav.addShop}</button>
                 <button onClick={() => {setShowLogin(true); setIsMobileMenuOpen(false); window.scrollTo(0,0);}} className="w-full py-5 rounded-2xl bg-[#E8622A] text-white font-black uppercase tracking-widest text-sm border-none cursor-pointer shadow-lg shadow-orange-500/30">{t[lang].nav.login}</button>
            </div>
        </div>
      )}

      <nav>
        <div className="nav-logo-box" onClick={() => {setStep('services'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}}>
          <img src="/logo.png" alt="Bookcy Logo" />
        </div>

        <ul className="nav-links">
          <li>
            <button onClick={() => {setStep('all_shops'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={`nav-main-btn ${['all_shops', 'shops', 'shop_profile', 'booking'].includes(step) ? 'active' : ''}`}>
              {t[lang].nav.places}
            </button>
          </li>
          <li style={{height:'100%', display:'flex', alignItems:'center'}}>
              <div className="relative h-full flex items-center group" onMouseEnter={() => setShowFeaturesMenu(true)} onMouseLeave={() => setShowFeaturesMenu(false)}>
                  <button onClick={() => {setStep('all_features'); setShowFeaturesMenu(false); window.scrollTo(0,0);}} className={`nav-main-btn flex items-center gap-1 transition-colors h-full ${['features', 'feature_detail', 'all_features'].includes(step) || showFeaturesMenu ? 'active' : ''}`}>
                      {t[lang].nav.features} <ChevronDown size={14} className={`transition-transform duration-200 ${showFeaturesMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showFeaturesMenu && (
                      <div className="absolute top-[76px] left-1/2 -translate-x-1/2 w-screen bg-white text-[#2D1B4E] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-t border-slate-200 cursor-default animate-in slide-in-from-top-2 duration-200 z-50">
                          <div className="max-w-[1100px] mx-auto py-12 px-8">
                              <div className="grid grid-cols-4 gap-8 mb-10 text-left">
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{t[lang].mega.setup}</h4>
                                    <ul className="space-y-4 font-bold text-slate-600 capitalize text-sm">
                                      {['profile', 'market', 'team'].map(key => (
                                        <li key={key}>
                                          <button onClick={() => goToFeature(key)} className="hover:text-[#E8622A] cursor-pointer transition-colors flex items-center gap-2 bg-transparent border-none text-slate-600 p-0">
                                            <ChevronRight size={14} className="text-[#E8622A]"/> {t[lang].featNames[key]}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{t[lang].mega.engage}</h4>
                                    <ul className="space-y-4 font-bold text-slate-600 capitalize text-sm">
                                      {['booking', 'app'].map(key => (
                                        <li key={key}>
                                          <button onClick={() => goToFeature(key)} className="hover:text-[#E8622A] cursor-pointer transition-colors flex items-center gap-2 bg-transparent border-none text-slate-600 p-0">
                                            <ChevronRight size={14} className="text-[#E8622A]"/> {t[lang].featNames[key]}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{t[lang].mega.manage}</h4>
                                    <ul className="space-y-4 font-bold text-slate-600 capitalize text-sm">
                                      {['marketing', 'calendar', 'crm'].map(key => (
                                        <li key={key}>
                                          <button onClick={() => goToFeature(key)} className="hover:text-[#E8622A] cursor-pointer transition-colors flex items-center gap-2 bg-transparent border-none text-slate-600 p-0">
                                            <ChevronRight size={14} className="text-[#E8622A]"/> {t[lang].featNames[key]}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{t[lang].mega.grow}</h4>
                                    <ul className="space-y-4 font-bold text-slate-600 capitalize text-sm">
                                      {['boost', 'stats'].map(key => (
                                        <li key={key}>
                                          <button onClick={() => goToFeature(key)} className="hover:text-[#E8622A] cursor-pointer transition-colors flex items-center gap-2 bg-transparent border-none text-slate-600 p-0">
                                            <ChevronRight size={14} className="text-[#E8622A]"/> {t[lang].featNames[key]}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                              </div>
                              <div className="flex justify-center border-t border-slate-100 pt-8">
                                <button onClick={() => {setStep('all_features'); setShowFeaturesMenu(false); window.scrollTo(0,0);}} className="bg-slate-50 border border-slate-200 text-[#2D1B4E] px-8 py-3 rounded-xl font-black hover:bg-slate-100 transition-colors cursor-pointer text-sm">{t[lang].mega.btn}</button>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </li>
          <li>
            <button onClick={() => {setStep('why_bookcy'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={`nav-main-btn ${step === 'why_bookcy' ? 'active' : ''}`}>{t[lang].nav.why}</button>
          </li>
          <li>
            <button onClick={() => {setStep('about'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={`nav-main-btn ${step === 'about' ? 'active' : ''}`}>{t[lang].nav.about}</button>
          </li>
          <li>
            <button onClick={() => {setStep('contact'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={`nav-main-btn ${step === 'contact' ? 'active' : ''}`}>{t[lang].nav.contact}</button>
          </li>
        </ul>

        <div className="nav-right">
          <div className="lang-pills hidden lg:flex mr-4">
             <button onClick={()=>setLang('TR')} className={`lang-pill ${lang==='TR' ? 'active' : ''}`}>TR</button>
             <button onClick={()=>setLang('EN')} className={`lang-pill ${lang==='EN' ? 'active' : ''}`}>EN</button>
             <button onClick={()=>setLang('RU')} className={`lang-pill ${lang==='RU' ? 'active' : ''}`}>RU</button>
          </div>

          {loggedInShop ? (
               <div className="flex gap-2 items-center">
                   <button onClick={handleLogout} className="btn-outline hidden md:block">{t[lang].nav.logout}</button>
                   <button onClick={() => router.push('/dashboard')} className="btn-primary"><UserCircle size={18}/> <span className="hidden md:inline">{t[lang].nav.panel}</span></button>
                   <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-[#2D1B4E] bg-transparent border-none cursor-pointer"><Menu size={28}/></button>
               </div>
          ) : (
              <div className="flex items-center gap-3">
                  <button onClick={() => {setShowRegister(true); window.scrollTo(0,0);}} className="btn-outline hidden md:block">{t[lang].nav.addShop}</button>
                  <button onClick={() => {setShowLogin(true); window.scrollTo(0,0);}} className="btn-primary"><UserCircle size={18}/> <span className="hidden md:inline">{t[lang].nav.login}</span></button>
                  <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-[#2D1B4E] bg-transparent border-none cursor-pointer ml-1"><Menu size={28}/></button>
              </div>
          )}
        </div>
      </nav>

      {/* İŞLETME KAYIT MODALI */}
      {showRegister && (
          <div className="fixed inset-0 w-screen h-screen bg-[#2D1B4E]/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto py-20">
            <div className="bg-white border border-slate-200 w-full max-w-[800px] rounded-[32px] p-8 md:p-10 relative shadow-2xl my-auto animate-in zoom-in-95 duration-300">
              <button onClick={() => {setShowRegister(false); setRegisterSuccess(false);}} className="absolute top-6 right-6 md:right-8 text-slate-400 hover:text-[#2D1B4E] p-2 font-bold bg-transparent border-none cursor-pointer"><X size={24}/></button>
              
              {registerSuccess ? (
                  <div className="text-center py-10">
                      <CheckCircle2 size={64} className="mx-auto text-[#00c48c] mb-6" />
                      <h2 className="text-2xl md:text-3xl font-black text-[#E8622A] uppercase italic mb-4">{t[lang].modal.success}</h2>
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 inline-block text-left mt-4 text-[#2D1B4E] w-full max-w-sm">
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">{t[lang].modal.bank}</p>
                          <p className="font-bold text-sm">Banka: <span className="font-normal">İş Bankası</span></p>
                          <p className="font-bold text-sm">Alıcı: <span className="font-normal">BOOKCY LTD.</span></p>
                          <p className="font-bold text-sm">IBAN: <span className="text-[#E8622A]">TR99 0006 4000 0012 3456 7890 12</span></p>
                          
                          <p className="text-sm font-bold text-slate-500 mt-6 mb-4 text-center">{t[lang].modal.bankDesc}</p>
                          <a href="https://wa.me/905555555555?text=Merhaba,%20Bookcy%20işletme%20kaydımı%20yaptım.%20Dekontumu%20iletiyorum." target="_blank" rel="noreferrer" className="w-full bg-[#25D366] text-white font-black py-4 rounded-xl uppercase tracking-widest hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30 flex justify-center items-center gap-2 text-decoration-none text-xs border-none cursor-pointer mt-4">
                              <MessageCircle size={18}/> {t[lang].modal.btnBank}
                          </a>
                      </div>
                  </div>
              ) : (
                  <>
                      <div className="flex flex-col mb-8 text-center mt-4">
                          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic text-[#2D1B4E]">{t[lang].modal.regTitle}</h2>
                          <p className="text-[10px] text-[#E8622A] font-bold uppercase tracking-[0.2em] mt-2 flex items-center justify-center gap-2"><Lock size={12}/> {t[lang].modal.regSub}</p>
                      </div>
                      <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input required placeholder={t[lang].modal.shopName} className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.name} onChange={e => setNewShop({...newShop, name: e.target.value})} />
                              <select className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold text-[#2D1B4E] outline-none" value={newShop.category} onChange={e => setNewShop({...newShop, category: e.target.value})}>
                                  {categories.map(c => <option key={c.dbName} value={c.dbName}>{c.dbName}</option>)}
                              </select>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <select required className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold text-[#2D1B4E] outline-none" value={newShop.location} onChange={e => setNewShop({...newShop, location: e.target.value})}>
                                  {cyprusRegions.map(region => <option key={region} value={region}>{region}</option>)}
                              </select>
                              <input required placeholder={t[lang].modal.address} className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none uppercase text-[#2D1B4E]" value={newShop.address} onChange={e => setNewShop({...newShop, address: e.target.value})} />
                          </div>
                          <input type="url" placeholder={t[lang].modal.map} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.maps_link} onChange={e => setNewShop({...newShop, maps_link: e.target.value})} />
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                              <div className="flex gap-2 w-full relative">
                                <select className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-2 outline-none font-bold text-xs text-[#2D1B4E] w-20" value={newShop.phoneCode} onChange={e => setNewShop({...newShop, phoneCode: e.target.value})}>
                                    <option value="+90">TR</option>
                                </select>
                                <div className="relative flex-1">
                                  <input required type="tel" placeholder={t[lang].modal.phone} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 outline-none font-bold text-xs text-[#2D1B4E]" value={newShop.contactPhone} onChange={handlePhoneChange} />
                                  {phoneValid === true && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={16}/>}
                                  {phoneValid === false && <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={16}/>}
                                </div>
                              </div>
                              <input placeholder={t[lang].modal.insta} className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.contactInsta} onChange={e => setNewShop({...newShop, contactInsta: e.target.value})} />
                              <div className="relative">
                                <input type="email" placeholder={t[lang].modal.mail} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.contactEmail} onChange={handleAdminEmailChange} />
                                {adminEmailValid === true && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={16}/>}
                                {adminEmailValid === false && <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={16}/>}
                              </div>
                          </div>
                          
                          <input required type="email" placeholder={t[lang].modal.adminMail} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none text-[#2D1B4E] mt-2" value={newShop.email} onChange={handleEmailChange} />
                          {emailValid === true && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={16}/>}
                          {emailValid === false && <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={16}/>}
                          
                          <textarea placeholder={t[lang].modal.desc} rows="2" className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none resize-none text-[#2D1B4E]" value={newShop.description} onChange={e => setNewShop({...newShop, description: e.target.value})}></textarea>
                          
                          <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-4 relative group">
                              <input type="file" accept=".png, .jpg, .jpeg" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setNewShop({...newShop, logoFile: e.target.files[0]})} />
                              {newShop.logoFile ? <span className="text-[10px] font-bold text-[#00c48c] flex items-center justify-center gap-2"><CheckCircle2 size={16}/> {newShop.logoFile.name}</span> : <div className="flex flex-col items-center justify-center text-center text-[10px] font-bold text-slate-500 uppercase"><Upload size={20} className="mb-2"/> {t[lang].modal.logo}</div>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                              {packages.map(p => (
                                  <div key={p.name} onClick={() => setNewShop({...newShop, package: p.name})} className={`cursor-pointer p-4 rounded-xl border transition-all ${newShop.package === p.name ? 'bg-orange-50 border-[#E8622A]' : 'bg-white border-slate-200'}`}>
                                      <h4 className={`text-sm font-black uppercase ${newShop.package === p.name ? 'text-[#E8622A]' : 'text-[#2D1B4E]'}`}>{p.name === 'Standart Paket' ? t[lang].aboutPage.std : t[lang].aboutPage.pr}</h4>
                                      <p className="text-xs font-bold text-slate-500">{p.price.split('/')[0]} {t[lang].aboutPage.mo}</p>
                                  </div>
                              ))}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                              <input required placeholder={t[lang].modal.user} className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.username} onChange={e => setNewShop({...newShop, username: e.target.value})} />
                              <input required placeholder={t[lang].modal.pass} className="bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-xs font-bold outline-none text-[#2D1B4E]" value={newShop.password} onChange={e => setNewShop({...newShop, password: e.target.value})} />
                          </div>
                          <button type="submit" disabled={isUploading || emailValid === false || phoneValid === false || adminEmailValid === false} className="w-full btn-primary justify-center py-5 rounded-xl mt-2 shadow-lg border-none cursor-pointer tracking-widest text-xs uppercase">{isUploading ? t[lang].modal.loading : t[lang].modal.btnReg}</button>
                      </form>
                  </>
              )}
            </div>
          </div>
      )}

      {/* GİRİŞ MODALI */}
      {showLogin && (
        <div className="fixed inset-0 bg-[#2D1B4E]/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[400px] rounded-[32px] p-8 relative shadow-2xl border border-slate-200">
            <button onClick={() => setShowLogin(false)} className="absolute top-6 right-6 text-slate-400 hover:text-[#2D1B4E] bg-transparent border-none cursor-pointer"><X size={24}/></button>
            <div className="text-center mb-6 mt-2"><h1 className="text-2xl font-black text-[#2D1B4E] uppercase mb-2">{t[lang].modal.logTitle}</h1><p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{t[lang].modal.logSub}</p></div>
            <div className="flex bg-slate-50 p-1 rounded-xl mb-6 border border-slate-100">
              <button onClick={() => setLoginType('owner')} className={`flex-1 py-3 text-xs font-black uppercase rounded-lg border-none cursor-pointer flex justify-center items-center gap-2 transition-all ${loginType === 'owner' ? 'bg-white text-[#E8622A] shadow-sm' : 'bg-transparent text-slate-400'}`}>{t[lang].modal.own}</button>
              <button onClick={() => setLoginType('staff')} className={`flex-1 py-3 text-xs font-black uppercase rounded-lg border-none cursor-pointer flex justify-center items-center gap-2 transition-all ${loginType === 'staff' ? 'bg-white text-[#E8622A] shadow-sm' : 'bg-transparent text-slate-400'}`}>{t[lang].modal.stf}</button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input type="text" required placeholder={t[lang].modal.user} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none text-[#2D1B4E] focus:border-[#E8622A]" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} />
              {loginType === 'staff' && <input type="text" required placeholder={t[lang].modal.stf + " Adı"} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none text-[#2D1B4E] focus:border-[#E8622A]" value={loginStaffName} onChange={(e) => setLoginStaffName(e.target.value)} />}
              <input type="password" required placeholder={t[lang].modal.pass} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none text-[#2D1B4E] focus:border-[#E8622A]" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              <button type="submit" disabled={isLoginLoading} className="w-full btn-primary justify-center py-5 rounded-xl font-black uppercase tracking-widest text-xs mt-4 border-none cursor-pointer">{isLoginLoading ? t[lang].modal.wait : t[lang].modal.btnLog}</button>
            </form>
          </div>
        </div>
      )}

      {/* SÖZLEŞME & ÇEREZ BİLDİRİMİ */}
      {!cookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:p-6 z-[9998] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-10">
          <div className="flex items-start gap-4 flex-1 max-w-4xl">
            <div className="bg-indigo-50 text-indigo-500 p-3 rounded-full shrink-0 hidden md:block"><Info size={24}/></div>
            <div>
              <h4 className="font-black text-[#2D1B4E] mb-1">{t[lang].cookie.title}</h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                {t[lang].cookie.desc1} 
                <button onClick={() => {setStep('cookies'); window.scrollTo(0,0);}} className="text-[#E8622A] bg-transparent border-none cursor-pointer font-bold mx-1 hover:underline">{t[lang].cookie.l1}</button> {t[lang].cookie.desc2} 
                <button onClick={() => {setStep('privacy'); window.scrollTo(0,0);}} className="text-[#E8622A] bg-transparent border-none cursor-pointer font-bold mx-1 hover:underline">{t[lang].cookie.l2}</button> 
                {t[lang].cookie.desc3}
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto shrink-0">
            <button onClick={() => {setStep('privacy'); window.scrollTo(0,0);}} className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-xs bg-slate-100 text-slate-500 border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">{t[lang].cookie.btn1}</button>
            <button onClick={acceptCookies} className="flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-xs bg-[#E8622A] text-white border-none cursor-pointer hover:bg-[#d4561f] shadow-md transition-all uppercase tracking-widest">{t[lang].cookie.btn2}</button>
          </div>
        </div>
      )}

      <main className="flex-1 w-full relative z-10 min-h-[80vh] mt-[72px]">
        {/* === ANA SAYFA === */}
        {step === 'services' && (
            <div className="w-full">
                <section className="hero">
                  <div className="hero-content">
                    <div className="hero-eyebrow"><div className="hero-eyebrow-dot"></div>{t[lang].hero.eyebrow}</div>
                    <h1 className="hero-title">{t[lang].hero.title1} <span className="accent">{t[lang].hero.title2}</span><br/>{t[lang].hero.title3} <span className="accent">{t[lang].hero.title4}</span></h1>
                    <p className="hero-sub">{t[lang].hero.sub}</p>
                    
                    <form className="w-full bg-white rounded-[24px] md:rounded-[50px] p-2 md:p-3 shadow-2xl flex flex-col md:flex-row gap-2 mx-auto max-w-[800px] mb-6" onSubmit={handleHeroSearch}>
                        <div className="flex-1 flex items-center bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none px-4 py-3 md:py-2 md:border-r border-slate-200">
                            <Search size={20} className="text-slate-400 mr-3 shrink-0" />
                            <input type="text" className="w-full bg-transparent font-bold text-sm outline-none text-[#2D1B4E]" placeholder={t[lang].hero.searchPlace} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <div className="flex-1 flex items-center bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none px-4 py-3 md:py-2">
                            <MapPin size={20} className="text-slate-400 mr-3 shrink-0" />
                            <select className="w-full bg-transparent font-bold text-sm outline-none text-[#2D1B4E] cursor-pointer" value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
                                <option value="All">{t[lang].hero.searchLoc}</option>
                                {cyprusRegions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="bg-[#E8622A] text-white rounded-[16px] md:rounded-[40px] px-8 py-3 md:py-4 font-black text-sm hover:bg-[#d4561f] transition-colors w-full md:w-auto border-none cursor-pointer">{t[lang].hero.btn}</button>
                    </form>
                    
                    <div className="hero-popular"><span>{t[lang].hero.pop}</span>{categories.slice(0,4).map(c=><button key={c.key} className="pop-tag" onClick={()=>{setFilterService(c.dbName); setStep('all_shops');}}>{c.emoji} {c.dbName}</button>)}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12 md:mt-20 border-t border-white/10 pt-8 w-full max-w-[800px] mx-auto relative z-10 px-4">
                      <div className="text-center md:border-r border-white/10 last:border-0 pb-4 md:pb-0"><div className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-black text-white mb-1">{approvedShops.length}</div><div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{t[lang].hero.stat1}</div></div>
                      <div className="text-center md:border-r border-white/10 last:border-0 pb-4 md:pb-0"><div className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-black text-white mb-1">{new Set(globalAppointments.map(a => a.customer_phone)).size}</div><div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{t[lang].hero.stat2}</div></div>
                      <div className="text-center md:border-r border-white/10 last:border-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10"><div className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-black text-white mb-1">{globalAppointments.length}</div><div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{t[lang].hero.stat3}</div></div>
                      <div className="text-center last:border-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10"><div className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-black text-white mb-1">%98</div><div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{t[lang].hero.stat4}</div></div>
                  </div>
                </section>
                <section className="bg-white py-16 md:py-24 px-6 md:px-8 border-b border-slate-200">
                  <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                    <div><div className="text-[11px] font-black text-[#E8622A] uppercase tracking-[0.3em] mb-2">{t[lang].cats.title}</div><div className="text-3xl md:text-4xl font-black text-[#2D1B4E] tracking-tight">{t[lang].cats.sub}</div></div>
                    <button className="text-[#E8622A] font-bold bg-transparent border-none cursor-pointer" onClick={()=>{setFilterService('All'); setStep('all_shops'); window.scrollTo(0,0);}}>{t[lang].cats.seeAll}</button>
                  </div>
                  <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {categories.map((c) => (<button key={c.key} onClick={() => { setFilterService(c.dbName); setStep('all_shops'); window.scrollTo(0,0); }} className="cat-card"><div className="cat-img-wrap"><div className="cat-emoji-bg" style={{background: c.bg}}>{c.emoji}</div></div><div className="cat-name">{c.dbName}</div></button>))}
                  </div>
                </section>
               {recommendedShops.length > 0 && (
                  <section className="bg-slate-50 py-16 md:py-24 px-6 md:px-8 border-t border-slate-200">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                      <div><div className="text-[11px] font-black text-[#E8622A] uppercase tracking-[0.3em] mb-2">{t[lang].featured.title}</div><div className="text-3xl md:text-4xl font-black text-[#2D1B4E] tracking-tight">{t[lang].featured.sub}</div></div>
                      <button className="text-[#E8622A] font-bold bg-transparent border-none cursor-pointer" onClick={()=>{setFilterSort('High'); setStep('all_shops'); window.scrollTo(0,0);}}>{t[lang].cats.seeAll}</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                      {recommendedShops.map((shop, idx) => (<div key={shop.id} onClick={() => { setSelectedShop(shop); setStep('shop_profile'); setProfileTab(shop.category === 'Bar & Club' ? 'events' : 'services'); setBookingPhase(1); window.scrollTo(0,0); }} className={`venue-card flex flex-col bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer ${idx === 0 ? 'md:row-span-2' : ''}`}><div className={`w-full bg-slate-100 flex items-center justify-center text-6xl relative ${idx === 0 ? 'h-[300px]' : 'h-[200px]'}`}>{shop.cover_url || shop.logo_url ? <img loading="lazy" decoding="async" src={shop.cover_url || shop.logo_url} className="w-full h-full object-cover"/> : categories.find(c=>c.dbName===shop.category)?.emoji}{idx === 0 && <div className="absolute top-4 left-4 bg-gradient-to-r from-[#E8622A] to-orange-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full">🔥 VIP</div>}</div><div className="p-6 flex flex-col flex-1"><div className="text-[10px] font-black text-[#E8622A] tracking-widest uppercase mb-2">{categories.find(c => c.dbName === shop.category)?.key || 'barber'}</div><div className="text-xl font-black text-[#2D1B4E] mb-3">{shop.name}</div><div className="text-sm font-bold text-slate-500 mb-6 flex items-center gap-1"><MapPin size={14}/> {shop.location}</div><button className="mt-auto w-full bg-[#2D1B4E] text-white font-black py-4 rounded-xl uppercase text-xs hover:bg-[#E8622A] transition-colors border-none cursor-pointer">{t[lang].shops.select} →</button></div></div>))}
                    </div>
                  </section>
               )}
              <section className="bg-white py-16 md:py-24 px-6 md:px-8 border-t border-slate-200">
                <div className="max-w-6xl mx-auto text-center">
                  <div className="text-[#E8622A] font-black text-sm tracking-widest uppercase mb-4">{t[lang].how.title}</div>
                  <div className="text-3xl md:text-5xl font-black text-[#2D1B4E] mb-12 md:mb-16 tracking-tight">{t[lang].how.sub}</div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative"><div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-slate-100 z-0"></div><div className="relative z-10 flex flex-col items-center"><div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm relative">🔍<div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white">1</div></div><div className="text-lg font-black text-[#2D1B4E] mb-2">{t[lang].how.s1}</div><div className="text-sm text-slate-500 font-medium">{t[lang].how.d1}</div></div><div className="relative z-10 flex flex-col items-center"><div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm relative">📅<div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white">2</div></div><div className="text-lg font-black text-[#2D1B4E] mb-2">{t[lang].how.s2}</div><div className="text-sm text-slate-500 font-medium">{t[lang].how.d2}</div></div><div className="relative z-10 flex flex-col items-center"><div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm relative">✅<div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white">3</div></div><div className="text-lg font-black text-[#2D1B4E] mb-2">{t[lang].how.s3}</div><div className="text-sm text-slate-500 font-medium">{t[lang].how.d3}</div></div><div className="relative z-10 flex flex-col items-center"><div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm relative">✨<div className="absolute -top-2 -right-2 w-7 h-7 bg-[#E8622A] text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-white">4</div></div><div className="text-lg font-black text-[#2D1B4E] mb-2">{t[lang].how.s4}</div><div className="text-sm text-slate-500 font-medium">{t[lang].how.d4}</div></div></div>
                </div>
              </section>
            </div>
        )}

        {/* === NEDEN BOOKCY === */}
        {step === 'why_bookcy' && (
            <div className="w-full bg-[#FAF7F2] pb-24 pt-16">
                <div className="bg-[#2D1B4E] pt-24 pb-24 px-6 text-center border-b border-slate-800"><span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">{t[lang].why.tag}</span><h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6">{t[lang].why.title1} <span className="text-[#E8622A]">{t[lang].why.title2}</span> {t[lang].why.title3}</h1><p className="text-lg text-slate-300 max-w-2xl mx-auto px-4">{t[lang].why.sub}</p></div>
                <div className="max-w-6xl mx-auto px-6 -mt-10"><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200"><div className="w-16 h-16 bg-orange-50 text-[#E8622A] rounded-2xl flex items-center justify-center mb-6"><Crown size={32}/></div><h3 className="font-black text-xl text-[#2D1B4E] mb-3">{t[lang].why.c1}</h3><p className="text-slate-500 font-medium leading-relaxed">{t[lang].why.d1}</p></div><div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200"><div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6"><Grid size={32}/></div><h3 className="font-black text-xl text-[#2D1B4E] mb-3">{t[lang].why.c2}</h3><p className="text-slate-500 font-medium leading-relaxed">{t[lang].why.d2}</p></div><div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200"><div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6"><Users size={32}/></div><h3 className="font-black text-xl text-[#2D1B4E] mb-3">{t[lang].why.c3}</h3><p className="text-slate-500 font-medium leading-relaxed">{t[lang].why.d3}</p></div><div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200"><div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6"><Smartphone size={32}/></div><h3 className="font-black text-xl text-[#2D1B4E] mb-3">{t[lang].why.c4}</h3><p className="text-slate-500 font-medium leading-relaxed">{t[lang].why.d4}</p></div><div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200"><div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mb-6"><TrendingUp size={32}/></div><h3 className="font-black text-xl text-[#2D1B4E] mb-3">{t[lang].why.c5}</h3><p className="text-slate-500 font-medium leading-relaxed">{t[lang].why.d5}</p></div><div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200"><div className="w-16 h-16 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center mb-6"><MessageSquare size={32}/></div><h3 className="font-black text-xl text-[#2D1B4E] mb-3">{t[lang].why.c6}</h3><p className="text-slate-500 font-medium leading-relaxed">{t[lang].why.d6}</p></div></div><div className="mt-16 text-center"><button onClick={() => {setShowRegister(true); window.scrollTo(0,0);}} className="bg-[#E8622A] hover:bg-[#d4561f] text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-sm border-none cursor-pointer inline-flex items-center gap-2 shadow-lg">{t[lang].why.btn} <ArrowRight size={18}/></button></div></div>
            </div>
        )}

        {/* TÜM İŞLETMELER */}
        {step === 'all_shops' && (
            <div className="w-full max-w-[1400px] mx-auto pt-24 px-6 md:px-8 pb-20">
                <button onClick={() => {setStep('services'); window.scrollTo(0,0);}} className="flex items-center text-slate-400 hover:text-[#E8622A] mb-8 text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none cursor-pointer transition-colors"><ChevronLeft size={16} className="mr-2"/> {t[lang].shops.back}</button>
                <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 border-b border-slate-200 pb-4 gap-4"><h2 className="text-3xl font-black uppercase text-[#2D1B4E] tracking-tight">{t[lang].shops.title}</h2><span className="text-sm font-bold text-[#E8622A] bg-orange-50 px-4 py-2 rounded-xl w-fit">{sortedShops.length} {t[lang].shops.found}</span></div>
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <aside className="w-full lg:w-[320px] bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col gap-6">
                        <input type="text" placeholder={t[lang].shops.search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A] transition-colors" />
                        <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A] transition-colors cursor-pointer"><option value="All">{t[lang].shops.allReg}</option>{cyprusRegions.map(r => <option key={r} value={r}>{r}</option>)}</select>
                        <select value={filterService} onChange={(e) => setFilterService(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A] transition-colors cursor-pointer"><option value="All">{t[lang].shops.allCat}</option>{categories.map(c => <option key={c.dbName} value={c.dbName}>{c.dbName}</option>)}</select>
                    </aside>
                    <div className="flex-1 w-full flex flex-col gap-5">
                        {sortedShops.map((shop) => (
                            <div key={shop.id} onClick={() => { setSelectedShop(shop); setStep('shop_profile'); setProfileTab(shop.category === 'Bar & Club' ? 'events' : 'services'); setBookingPhase(1); window.scrollTo(0,0); }} className="flex flex-col sm:flex-row items-center p-6 bg-white border border-slate-200 hover:border-[#E8622A] rounded-[32px] cursor-pointer transition-all shadow-sm hover:shadow-md">
                                <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center text-xs font-black text-[#E8622A] relative">{(shop.package === 'Premium Paket' || shop.package === 'Premium') && <div className="absolute inset-0 border-4 border-yellow-400 rounded-2xl"></div>}{shop.logo_url ? <img loading="lazy" decoding="async" src={shop.logo_url} className="w-full h-full object-cover" /> : "LOGO"}</div>
                                <div className="flex-1 sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left"><div className="flex items-center justify-center sm:justify-start gap-2 mb-2"><h3 className="text-xl font-black uppercase text-[#2D1B4E]">{shop.name}</h3>{(shop.package === 'Premium Paket' || shop.package === 'Premium') && <Gem size={16} className="text-yellow-500 fill-yellow-500"/>}</div><div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest"><span className="bg-slate-100 px-3 py-1.5 rounded-lg">{shop.category}</span><span className="flex items-center gap-1"><MapPin size={12}/> {shop.location}</span></div></div>
                                <button className="mt-6 sm:mt-0 w-full sm:w-auto btn-primary border-none cursor-pointer px-8 py-4 sm:py-3 text-center justify-center">{t[lang].shops.select}</button>
                            </div>
                        ))}
                        {sortedShops.length === 0 && <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest bg-white rounded-[32px] border border-slate-200">{t[lang].shops.empty}</div>}
                    </div>
                </div>
            </div>
        )}

        {/* PROFİL SAYFASI */}
        {step === 'shop_profile' && selectedShop && (
            <div className="w-full max-w-6xl mx-auto pt-24 px-6 pb-20">
                <button onClick={() => {setStep('all_shops'); window.scrollTo(0,0);}} className="flex items-center text-slate-400 hover:text-[#E8622A] mb-6 text-[10px] font-black uppercase tracking-[0.2em] bg-transparent border-none cursor-pointer transition-colors"><ChevronLeft size={16} className="mr-2"/> {t[lang].shops.back}</button>
                <div className="w-full h-[200px] md:h-[300px] rounded-[32px] overflow-hidden relative mb-20 border border-slate-200 bg-slate-50 shadow-sm">
                    {selectedShop.cover_url && <img loading="lazy" decoding="async" src={selectedShop.cover_url} className="w-full h-full object-cover" />}
                    <div className="absolute -bottom-10 md:-bottom-12 left-6 md:left-12 w-24 h-24 md:w-32 md:h-32 rounded-[24px] bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-[#E8622A] font-black relative z-10">{(selectedShop.package === 'Premium Paket' || selectedShop.package === 'Premium') && <div className="absolute inset-0 border-4 border-yellow-400 rounded-[20px]"></div>}{selectedShop.logo_url ? <img src={selectedShop.logo_url} className="w-full h-full object-cover" /> : "LOGO"}</div>
                </div>
                <div className="mb-10 border-b border-slate-200 pb-8 px-2 md:px-6"><div className="flex flex-wrap items-center gap-3 mb-3"><h1 className="text-3xl md:text-4xl font-black uppercase text-[#2D1B4E] tracking-tight">{selectedShop.name}</h1>{(selectedShop.package === 'Premium Paket' || selectedShop.package === 'Premium') && <Gem size={28} className="text-yellow-500 fill-yellow-500"/>}</div><div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest"><span className="text-[#E8622A] px-3 py-1.5 bg-orange-50 rounded-lg">{selectedShop.category}</span><span className="flex items-center gap-1"><MapPin size={14}/> {selectedShop.address || selectedShop.location}</span></div></div>
                <div className="flex gap-6 md:gap-10 border-b border-slate-200 mb-10 overflow-x-auto custom-scrollbar px-2 md:px-6">
                    <button onClick={() => setProfileTab(selectedShop.category === 'Bar & Club' ? 'events' : 'services')} className={`pb-4 text-sm md:text-base font-black uppercase whitespace-nowrap bg-transparent border-none cursor-pointer border-b-4 transition-colors ${(profileTab === 'services' || profileTab === 'events') ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>{selectedShop.category === 'Bar & Club' ? t[lang].profile.events : t[lang].profile.services}</button>
                    <button onClick={() => setProfileTab('gallery')} className={`pb-4 text-sm md:text-base font-black uppercase whitespace-nowrap bg-transparent border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'gallery' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>{t[lang].profile.gallery}</button>
                    <button onClick={() => setProfileTab('about')} className={`pb-4 text-sm md:text-base font-black uppercase whitespace-nowrap bg-transparent border-none cursor-pointer border-b-4 transition-colors ${profileTab === 'about' ? 'border-[#E8622A] text-[#E8622A]' : 'border-transparent text-slate-400 hover:text-[#2D1B4E]'}`}>{t[lang].profile.about}</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7 px-2 md:px-6">
                        {(profileTab === 'events' || profileTab === 'services') && selectedShop.category === 'Bar & Club' && (
                            <div className="flex flex-col gap-4">
                                {bookingPhase === 1 ? (
                                    selectedShop.events?.map(ev => (<div key={ev.id} onClick={() => { setBookingData({...bookingData, selectedEvent: ev, date: ev.date, time: ev.time}); setBookingPhase(2); }} className="flex flex-col sm:flex-row gap-4 p-4 md:p-6 bg-white rounded-[32px] border border-slate-200 hover:border-[#E8622A] cursor-pointer shadow-sm transition-all hover:shadow-md"><div className="w-full sm:w-32 h-40 sm:h-32 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">{ev.image_url ? <img src={ev.image_url} className="w-full h-full object-cover"/> : <Music size={32} className="text-slate-400"/>}</div><div className="flex-1 flex flex-col justify-center"><h4 className="font-black text-xl md:text-2xl text-[#2D1B4E] uppercase mb-2">{ev.name}</h4><div className="text-[#E8622A] font-bold text-sm flex items-center gap-2 bg-orange-50 w-fit px-3 py-1.5 rounded-lg"><Calendar size={14}/> {ev.date} • {ev.time}</div></div></div>))
                                ) : (
                                    <><button onClick={() => {setBookingData({...bookingData, selectedEvent: null, selectedShopService: null}); setBookingPhase(1);}} className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-transparent border-none cursor-pointer mb-4 flex items-center gap-1 hover:text-[#E8622A] transition-colors w-fit"><ChevronLeft size={14}/> {t[lang].booking.back}</button>{selectedShop.services?.map(srv => { const isSoldOut = appointments.filter(a => a.appointment_date === bookingData.selectedEvent?.date && a.service_name === srv.name && a.status !== 'İptal').length >= parseInt(srv.capacity || '10'); return (<div key={srv.id} onClick={() => { if(!isSoldOut) { setBookingData({...bookingData, selectedShopService: srv}); setBookingPhase(3); } }} className={`p-6 md:p-8 bg-white rounded-[32px] border flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 transition-all ${isSoldOut ? 'opacity-60 cursor-not-allowed border-slate-200' : bookingData.selectedShopService?.id === srv.id ? 'border-[#E8622A] shadow-md' : 'border-slate-200 hover:border-[#E8622A] cursor-pointer shadow-sm hover:shadow-md'}`}><div><h4 className="font-black text-lg md:text-xl text-[#2D1B4E]">{srv.name}</h4></div><div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto"><span className="font-black text-xl md:text-2xl text-[#2D1B4E]">{srv.price || '0'} TL</span><button disabled={isSoldOut} className={`px-8 py-4 rounded-xl font-black text-xs border-none cursor-pointer tracking-widest ${isSoldOut ? 'bg-slate-100 text-slate-400' : 'bg-[#E8622A] text-white hover:bg-orange-600 transition-colors'}`}>{isSoldOut ? t[lang].profile.soldOut : t[lang].profile.select}</button></div></div>) })}</>
                                )}
                            </div>
                        )}

                        {(profileTab === 'services' || profileTab === 'events') && selectedShop.category !== 'Bar & Club' && (
                            <div className="flex flex-col gap-4">
                                {selectedShop.services?.map(srv => (<div key={srv.id} onClick={() => { setBookingData({...bookingData, selectedShopService: srv, selectedStaff: null, time: ''}); setBookingPhase(2); }} className={`p-6 md:p-8 bg-white rounded-[32px] border cursor-pointer flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all shadow-sm hover:shadow-md ${bookingData.selectedShopService?.id === srv.id ? 'border-[#E8622A]' : 'border-slate-200 hover:border-[#E8622A]'}`}><div><h4 className="font-black text-lg md:text-xl text-[#2D1B4E] mb-2">{srv.name}</h4><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 w-fit bg-slate-50 px-2 py-1 rounded"><Clock size={12}/> {srv.duration} Dk</div></div><div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto"><span className="font-black text-xl md:text-2xl text-[#2D1B4E]">{srv.price || '0'} TL</span><button className={`px-8 py-3 rounded-xl font-black text-xs border-none cursor-pointer transition-colors tracking-widest ${bookingData.selectedShopService?.id === srv.id ? 'bg-[#E8622A] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{t[lang].profile.select}</button></div></div>))}
                                {(!selectedShop.services || selectedShop.services.length === 0) && <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest border border-slate-200 rounded-[32px]">{t[lang].profile.emptySrv}</div>}
                            </div>
                        )}

                        {profileTab === 'gallery' && (<div className="grid grid-cols-2 md:grid-cols-3 gap-4">{selectedShop.gallery?.map((img, idx) => (<div key={idx} className="h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm"><img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" /></div>))} {(!selectedShop.gallery || selectedShop.gallery.length === 0) && <div className="col-span-full p-10 text-center text-slate-400 font-bold uppercase tracking-widest border border-slate-200 rounded-[32px]">{t[lang].profile.emptyGal}</div>}</div>)}

                        {profileTab === 'about' && (<div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[32px] shadow-sm"><h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">{t[lang].profile.about}</h3><p className="text-slate-600 text-sm md:text-base font-medium whitespace-pre-wrap leading-relaxed">{selectedShop.description || t[lang].profile.emptyDesc}</p></div>)}
                    </div>

                    {/* SAĞ REZERVASYON PANELİ */}
                    <div className="lg:col-span-5 relative mt-10 lg:mt-0">
                        <div className="lg:sticky lg:top-28 bg-white border border-slate-200 rounded-[40px] p-6 md:p-10 flex flex-col min-h-[450px] shadow-xl mb-10 lg:mb-0">
                            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6"><h3 className="text-xl font-black uppercase text-[#2D1B4E] tracking-tight">{t[lang].booking.title}</h3>{bookingPhase > 1 && (<button onClick={() => { if(selectedShop.category === 'Bar & Club' && bookingPhase === 2){setBookingPhase(1); setBookingData({...bookingData, selectedEvent:null});} else {setBookingPhase(bookingPhase - 1);} }} className="text-[10px] font-black uppercase text-slate-500 hover:text-[#E8622A] bg-slate-100 hover:bg-orange-50 px-4 py-2 rounded-xl flex items-center border-none cursor-pointer transition-colors tracking-widest"><ChevronLeft size={14} className="mr-1"/> {t[lang].booking.back}</button>)}</div>

                            {bookingPhase === 1 && (<div className="flex-1 flex flex-col items-center justify-center text-center p-10">{selectedShop.category === 'Bar & Club' ? <><div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6"><Music size={40} className="text-slate-300"/></div><p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{t[lang].booking.startEvent}</p></> : <><div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6"><Scissors size={40} className="text-slate-300"/></div><p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">{t[lang].booking.startSrv}</p></>}</div>)}
                            
                            {bookingPhase > 1 && (
                                <div className="mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col gap-4 shadow-inner">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t[lang].booking.srv}</span><span className="font-black text-[#2D1B4E] text-sm md:text-base">{bookingData.selectedShopService?.name}</span></div>
                                    {bookingPhase > 2 && bookingData.selectedStaff && selectedShop.category !== 'Bar & Club' && (<div className="flex flex-col sm:flex-row justify-between sm:items-center border-t border-slate-200 pt-4 gap-2"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t[lang].booking.staff}</span><span className="font-bold text-[#2D1B4E] text-xs uppercase bg-white px-3 py-1.5 rounded-lg border border-slate-100">{bookingData.selectedStaff.name}</span></div>)}
                                    {bookingPhase > 3 && bookingData.time && selectedShop.category !== 'Bar & Club' && (<div className="flex flex-col sm:flex-row justify-between sm:items-center border-t border-slate-200 pt-4 gap-2"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t[lang].booking.time}</span><span className="font-bold text-[#E8622A] text-xs bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">{bookingData.date} | {bookingData.time}</span></div>)}
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-t border-slate-200 pt-4 mt-2 gap-2"><span className="text-[10px] font-black text-[#2D1B4E] uppercase tracking-widest">{t[lang].booking.total}</span><span className="font-black text-[#E8622A] text-2xl">{bookingData.selectedShopService?.price || '0'} TL</span></div>
                                </div>
                            )}

                            {bookingPhase === 2 && selectedShop.category !== 'Bar & Club' && (
                                <div className="flex-1 animate-in fade-in duration-300"><p className="text-[11px] font-black uppercase text-[#2D1B4E] mb-6 tracking-widest border-l-4 border-[#E8622A] pl-3">{t[lang].booking.selectStaff}</p><div className="grid grid-cols-2 sm:grid-cols-3 gap-4"><div onClick={() => { setBookingData({...bookingData, selectedStaff: { name: t[lang].booking.any }}); setBookingPhase(3); }} className="flex flex-col items-center gap-3 cursor-pointer p-4 md:p-6 rounded-3xl border border-slate-200 hover:border-[#E8622A] bg-white transition-all hover:shadow-md group"><div className="w-14 h-14 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#E8622A] transition-colors"><Users size={24}/></div><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{t[lang].booking.any}</span></div>{selectedShop.staff?.map(person => (<div key={person.id} onClick={() => { setBookingData({...bookingData, selectedStaff: person}); setBookingPhase(3); }} className="flex flex-col items-center gap-3 cursor-pointer p-4 md:p-6 rounded-3xl border border-slate-200 hover:border-[#E8622A] bg-white transition-all hover:shadow-md group"><div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center font-black text-lg group-hover:bg-[#E8622A] group-hover:text-white transition-colors">{person.name.charAt(0)}</div><span className="text-[10px] font-black text-[#2D1B4E] uppercase truncate w-full text-center px-1 tracking-widest">{person.name}</span></div>))}</div></div>
                            )}

                            {bookingPhase === 3 && selectedShop.category !== 'Bar & Club' && (
                                <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-300"><input type="date" min={new Date().toISOString().split('T')[0]} value={bookingData.date} className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 font-bold text-[#2D1B4E] outline-none focus:border-[#E8622A] shadow-sm cursor-pointer" onChange={(e) => setBookingData({...bookingData, date: e.target.value, time: ''})} />{bookingData.date && ( isShopClosedToday ? (<div className="py-12 text-center text-red-500 font-bold uppercase text-xs bg-red-50 rounded-3xl border border-red-100 flex flex-col items-center justify-center gap-3"><CalendarOff size={32}/> {t[lang].booking.closed}</div>) : (<div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">{currentAvailableSlots.map((slot, idx) => { const needed = getRequiredSlots(bookingData.selectedShopService.duration); const check = currentAvailableSlots.slice(idx, idx + needed); let isUnavail = check.length < needed || check.some(s => closedSlots.includes(s)); return (<button key={slot} disabled={isUnavail} onClick={() => { setBookingData({...bookingData, time: slot}); setBookingPhase(4); }} className={`py-4 rounded-2xl text-xs font-bold border cursor-pointer transition-all ${isUnavail ? 'bg-slate-50 border-transparent text-slate-300 line-through' : bookingData.time === slot ? 'bg-[#E8622A] text-white border-[#E8622A] shadow-md scale-105' : 'bg-white border-slate-200 text-[#2D1B4E] hover:border-[#E8622A] hover:text-[#E8622A] shadow-sm'}`}>{slot}</button>); })}</div>) )}</div>
                            )}

                            {(bookingPhase === 4 || (selectedShop.category === 'Bar & Club' && bookingPhase === 3)) && (
                                <form onSubmit={handleBooking} className="flex flex-col gap-4 flex-1 mt-auto animate-in fade-in duration-300"><div className="flex flex-col sm:flex-row gap-4 w-full"><input required placeholder={t[lang].booking.name} className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:border-[#E8622A] shadow-sm" onChange={(e) => setFormData({...formData, name: e.target.value})} /><input required placeholder={t[lang].booking.surname} className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:border-[#E8622A] shadow-sm" onChange={(e) => setFormData({...formData, surname: e.target.value})} /></div><div className="flex gap-3 w-full"><select className="bg-white border border-slate-200 rounded-2xl py-4 px-4 font-bold text-sm outline-none focus:border-[#E8622A] shadow-sm w-24 cursor-pointer" value={formData.phoneCode} onChange={e => setFormData({...formData, phoneCode: e.target.value})}><option value="+90">TR</option></select><input required type="tel" placeholder={t[lang].booking.phone} className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:border-[#E8622A] shadow-sm" onChange={handleBookingPhoneChange} /></div><input required type="email" placeholder={t[lang].booking.email} className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:border-[#E8622A] shadow-sm" onChange={handleBookingEmailChange} /><button type="submit" disabled={bookingEmailValid === false || bookingPhoneValid === false} className="w-full bg-[#E8622A] text-white py-5 rounded-2xl mt-4 uppercase font-black text-sm tracking-[0.2em] border-none cursor-pointer hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">{t[lang].booking.confirm}</button></form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* BAŞARILI */}
        {step === 'success' && (
          <div className="text-center py-20 px-6 min-h-[60vh] flex flex-col items-center justify-center max-w-[600px] mx-auto animate-in zoom-in-95 duration-500 mt-10">
            {!feedbackSubmitted ? (
              <div className="bg-white rounded-[40px] p-8 md:p-14 shadow-2xl border border-slate-200 w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#E8622A] to-[#F5C5A3]"></div>
                <div className="w-24 h-24 bg-[#00c48c] text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(0,196,140,0.3)]"><CheckCircle2 size={48} /></div><h2 className="text-3xl md:text-4xl font-black text-[#2D1B4E] uppercase mb-4 tracking-tight">{t[lang].success.title}</h2>
                <p className="text-slate-500 font-bold text-sm md:text-base mb-10 leading-relaxed">{t[lang].success.desc}</p>
                <div className="border-t border-slate-100 pt-10 mt-6 bg-slate-50 -mx-8 md:-mx-14 -mb-8 md:-mb-14 px-8 md:px-14 pb-8 md:pb-14"><h3 className="font-black text-xl text-[#2D1B4E] mb-8 flex items-center justify-center gap-2"><Star className="text-yellow-500 fill-yellow-500"/> {t[lang].success.rateTitle}</h3><form onSubmit={submitFeedback} className="text-left space-y-8"><div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block text-center">{t[lang].success.q1}</label>{renderFeedbackScale('q1')}</div><div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block text-center">{t[lang].success.q2}</label>{renderFeedbackScale('q2')}</div><div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block text-center">{t[lang].success.q3}</label>{renderFeedbackScale('q3')}</div><div><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block text-center">{t[lang].success.q4}</label>{renderFeedbackScale('q4')}</div><button type="submit" className="w-full bg-[#2D1B4E] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs border-none cursor-pointer shadow-xl hover:bg-[#1a0f2e] transition-all hover:-translate-y-1 mt-4">{t[lang].success.btn}</button></form></div></div>
            ) : (
              <div className="bg-white rounded-[40px] p-10 md:p-20 shadow-2xl border border-slate-200 w-full text-center"><div className="w-32 h-32 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-10 border-4 border-yellow-100"><Star fill="currentColor" size={64}/></div><h2 className="text-4xl font-black text-[#2D1B4E] uppercase mb-4 tracking-tight">{t[lang].success.thanks}</h2><p className="text-slate-500 mb-12 font-medium text-lg">{t[lang].success.saved}</p><button onClick={() => {setStep('services'); setBookingPhase(1); setFeedbackSubmitted(false); window.scrollTo(0,0);}} className="bg-[#E8622A] text-white mx-auto px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-sm border-none cursor-pointer shadow-xl hover:bg-[#d4561f] transition-all hover:scale-105 w-full md:w-auto">{t[lang].success.home}</button></div>
            )}
          </div>
        )}

        {/* HAKKIMIZDA & PAKETLER SAYFASI (YENİLENDİ) */}
        {step === 'about' && (
            <div className="w-full bg-[#FAF7F2] pb-24 pt-10 md:pt-16"><div className="bg-[#2D1B4E] pt-20 md:pt-24 pb-24 md:pb-32 px-6 text-center"><span className="bg-white/10 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 mb-8 inline-block">{t[lang].aboutPage.tag}</span><h1 className="text-3xl md:text-6xl font-black text-white mb-8 tracking-tight">{t[lang].aboutPage.title1}<br/><span className="text-[#E8622A]">{t[lang].aboutPage.title2}</span></h1><p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed px-4">{t[lang].aboutPage.sub}</p></div><div className="max-w-[1200px] mx-auto px-6 -mt-10 md:-mt-16"><div className="bg-white p-8 md:p-16 rounded-[40px] shadow-2xl border border-slate-200 mb-16 md:mb-20 text-center relative overflow-hidden"><div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-bl-full -z-10"></div><h2 className="text-sm font-black text-[#E8622A] uppercase tracking-[0.3em] mb-6 relative z-10">{t[lang].aboutPage.wTag}</h2><p className="text-xl md:text-3xl text-[#2D1B4E] font-black leading-tight mb-8 relative z-10">{t[lang].aboutPage.w1}</p><p className="text-base md:text-lg text-slate-500 font-medium mb-12 max-w-4xl mx-auto relative z-10 leading-relaxed">{t[lang].aboutPage.w2}</p><div className="bg-[#2D1B4E] text-white p-6 md:p-10 rounded-[32px] inline-block font-bold text-lg md:text-2xl shadow-2xl relative z-10 border border-slate-700 leading-relaxed">{t[lang].aboutPage.w3} <br/><span className="text-[#E8622A]">{t[lang].aboutPage.w4}</span></div></div>
            
            <div className="mt-16 md:mt-24 text-center mb-12 md:mb-16">
              <h2 className="text-sm font-black text-[#E8622A] uppercase tracking-[0.3em] mb-4">{t[lang].aboutPage.pTag}</h2>
              <h3 className="text-3xl md:text-5xl font-black text-[#2D1B4E] uppercase tracking-tight">{t[lang].aboutPage.pTitle}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 text-left max-w-5xl mx-auto"><div className="bg-white p-8 md:p-12 rounded-[40px] border border-slate-200 shadow-xl relative overflow-hidden group hover:border-[#E8622A] transition-colors"><div className="absolute -right-10 -top-10 w-40 h-40 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div><div className="relative z-10"><h3 className="text-2xl font-black text-[#2D1B4E] uppercase tracking-widest mb-2">{t[lang].aboutPage.std}</h3><p className="text-4xl md:text-5xl font-black text-[#E8622A] mb-10">60 STG <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">{t[lang].aboutPage.mo}</span></p><ul className="space-y-5 mb-14"><li className="flex items-start gap-4 text-sm md:text-base font-bold text-slate-600"><CheckCircle2 size={24} className="text-[#E8622A] shrink-0"/> Sınırsız 7/24 Randevu</li><li className="flex items-start gap-4 text-sm md:text-base font-bold text-slate-600"><CheckCircle2 size={24} className="text-[#E8622A] shrink-0"/> Sosyal Medya Desteği</li><li className="flex items-start gap-4 text-sm md:text-base font-bold text-slate-600"><CheckCircle2 size={24} className="text-[#E8622A] shrink-0"/> İşletme Takip Paneli</li><li className="flex items-start gap-4 text-sm md:text-base font-bold text-slate-600"><CheckCircle2 size={24} className="text-[#E8622A] shrink-0"/> Personel Performans Rapor ve Takibi</li><li className="flex items-start gap-4 text-sm md:text-base font-bold text-slate-600"><CheckCircle2 size={24} className="text-[#E8622A] shrink-0"/> İşletme Rotası</li></ul><button onClick={() => {setShowRegister(true); window.scrollTo(0,0);}} className="w-full py-5 bg-slate-100 font-black rounded-2xl text-[#2D1B4E] border-none cursor-pointer hover:bg-slate-200 transition-colors uppercase tracking-widest text-sm shadow-sm">{t[lang].aboutPage.btn1}</button></div></div><div className="bg-[#2D1B4E] p-8 md:p-12 rounded-[40px] border border-[#3E296A] relative text-white shadow-2xl overflow-hidden md:scale-105 z-10"><div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E8622A] to-purple-600 rounded-bl-full opacity-20 blur-3xl"></div><div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#E8622A] to-orange-500 text-white px-8 py-2 rounded-b-xl text-[10px] font-black uppercase tracking-widest shadow-lg w-max">{t[lang].aboutPage.pop}</div><div className="relative z-10 mt-6"><h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2 flex items-center gap-3"><Crown size={28} className="text-yellow-500"/> {t[lang].aboutPage.pr}</h3><p className="text-4xl md:text-5xl font-black text-[#E8622A] mb-10">100 STG <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">{t[lang].aboutPage.mo}</span></p><div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-14"><li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Önerilenler Vitrini</li><li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Arama Üst Sıra</li><li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Premium Çerçeve</li><li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Sponsorlu Reklam</li><li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Sosyal Medya</li><li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Sınırsız Randevu</li><li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Story Box</li><li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Personel Optimizasyonu</li><li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Raporlama</li><li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> Detaylı İşletme Paneli</li><li className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-200"><CheckCircle2 size={20} className="text-[#E8622A] shrink-0"/> 7/24 Destek</li></div><button onClick={() => {setShowRegister(true); window.scrollTo(0,0);}} className="w-full py-5 bg-gradient-to-r from-[#E8622A] to-orange-500 text-white font-black rounded-2xl border-none cursor-pointer shadow-[0_10px_30px_rgba(232,98,42,0.4)] hover:shadow-xl hover:-translate-y-1 transition-all uppercase tracking-widest text-sm">{t[lang].aboutPage.btn2}</button></div></div></div></div></div>
        )}

        {/* İLETİŞİM SAYFASI (YENİLENDİ) */}
        {step === 'contact' && (
            <div className="w-full bg-[#FAF7F2] pb-24 pt-10 md:pt-16 relative z-0">
                <div className="bg-[#2D1B4E] pt-20 md:pt-24 pb-32 md:pb-40 px-6 text-center relative border-b border-slate-800 z-0">
                    <h1 className="text-3xl md:text-6xl font-black uppercase text-white mb-6 tracking-tight">{t[lang].contactPage.title}</h1>
                    <p className="text-base md:text-xl text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">{t[lang].contactPage.sub}</p>
                </div>
                <div className="max-w-[1100px] mx-auto px-6 -mt-16 md:-mt-24 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <div className="bg-white p-8 md:p-12 rounded-[40px] text-center shadow-2xl border border-slate-200 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 text-[#25D366] rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8"><MessageCircle size={40}/></div>
                            <h3 className="font-black text-xl md:text-2xl text-[#2D1B4E] mb-4 uppercase tracking-widest">WhatsApp</h3>
                            <p className="text-sm md:text-base text-slate-500 mb-8 md:mb-10 font-medium leading-relaxed">{t[lang].contactPage.wp1}</p>
                            <a href="https://wa.me/905555555555" target="_blank" className="block bg-[#25D366] hover:bg-green-600 text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-colors no-underline shadow-[0_10px_25px_rgba(37,211,102,0.3)]">{t[lang].contactPage.wp2}</a>
                        </div>
                        <div className="bg-white p-8 md:p-12 rounded-[40px] text-center shadow-2xl border border-slate-200 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-pink-50 text-[#E1306C] rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8"><InstagramIcon size={40}/></div>
                            <h3 className="font-black text-xl md:text-2xl text-[#2D1B4E] mb-4 uppercase tracking-widest">Instagram</h3>
                            <p className="text-sm md:text-base text-slate-500 mb-8 md:mb-10 font-medium leading-relaxed">{t[lang].contactPage.ig1}</p>
                            <a href="https://instagram.com/bookcy" target="_blank" className="block bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-90 text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-opacity no-underline shadow-[0_10px_25px_rgba(225,48,108,0.3)]">{t[lang].contactPage.ig2}</a>
                        </div>
                        <div className="bg-white p-8 md:p-12 rounded-[40px] text-center shadow-2xl border border-slate-200 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8"><Mail size={40}/></div>
                            <h3 className="font-black text-xl md:text-2xl text-[#2D1B4E] mb-4 uppercase tracking-widest">E-Posta</h3>
                            <p className="text-sm md:text-base text-slate-500 mb-8 md:mb-10 font-medium leading-relaxed">{t[lang].contactPage.mail1}</p>
                            <a href="mailto:info@bookcy.co" className="block bg-[#2D1B4E] hover:bg-[#1a0f2e] text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-colors no-underline shadow-[0_10px_25px_rgba(45,27,78,0.3)]">{t[lang].contactPage.mail2}</a>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* DİNAMİK ÖZELLİK, TÜM ÖZELLİKLER */}
        {step === 'feature_detail' && activeFeature && (<div className="w-full bg-[#FAF7F2] pb-24 pt-10 md:pt-16"><div className="bg-[#2D1B4E] pt-20 md:pt-24 pb-32 md:pb-40 px-6 text-center border-b border-slate-800"><h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">{t[lang].featNames[activeFeature]}</h1></div><div className="max-w-[800px] mx-auto px-6 -mt-16 md:-mt-24"><div className="bg-white p-8 md:p-16 rounded-[40px] shadow-2xl border border-slate-200 text-center"><div className="flex justify-center mb-8"><div className="w-20 h-20 md:w-24 md:h-24 bg-orange-50 rounded-full flex items-center justify-center">{featureIcons[activeFeature] || <Star size={40} className="text-[#E8622A]"/>}</div></div><h2 className="text-2xl md:text-3xl font-black text-[#2D1B4E] mb-6 uppercase tracking-widest">{t[lang].featNames[activeFeature]}</h2><p className="text-base md:text-xl text-slate-500 leading-relaxed font-medium">{t[lang].featDesc[activeFeature]}</p></div></div></div>)}
        {step === 'all_features' && (<div className="w-full bg-[#FAF7F2] pb-24 pt-10 md:pt-16"><div className="bg-[#2D1B4E] pt-20 md:pt-24 pb-32 md:pb-40 px-6 text-center"><h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tight">Tüm Özellikler</h1></div><div className="max-w-[1200px] mx-auto px-6 -mt-16 md:-mt-24"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">{Object.keys(t[lang].featNames).map(key => (<div key={key} onClick={() => goToFeature(key)} className="bg-white p-8 md:p-10 rounded-[32px] shadow-xl border border-slate-200 cursor-pointer hover:-translate-y-2 transition-all group"><div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 text-[#E8622A] rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-orange-50 transition-colors">{featureIconsSmall[key]}</div><h3 className="font-black text-lg md:text-xl text-[#2D1B4E] mb-3 md:mb-4 uppercase tracking-widest">{t[lang].featNames[key]}</h3><p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">{t[lang].featDesc[key]}</p></div>))}</div></div></div>)}

        {/* YASAL SAYFALAR */}
        {['privacy', 'kvkk', 'terms', 'cookies'].includes(step) && (
            <div className="w-full bg-[#FAF7F2] pb-24 pt-10 md:pt-16"><div className="bg-white pt-16 md:pt-24 pb-16 md:pb-24 px-6 text-center border-b border-slate-200"><h1 className="text-2xl md:text-5xl font-black text-[#2D1B4E] uppercase tracking-tight">{step === 'privacy' ? 'Gizlilik Politikası' : step === 'kvkk' ? 'KVKK Aydınlatma Metni' : step === 'terms' ? 'Kullanım Şartları' : 'Çerez Politikası'}</h1><p className="text-xs md:text-sm font-bold text-slate-500 mt-6 uppercase tracking-widest bg-slate-50 inline-block px-4 py-2 rounded-lg">{t[lang].legal.upd}</p></div><div className="max-w-4xl mx-auto mt-10 md:mt-16 bg-white p-8 md:p-20 rounded-[32px] md:rounded-[40px] border border-slate-200 text-slate-600 font-medium leading-relaxed shadow-xl"><div className="prose prose-slate max-w-none">
              {step === 'privacy' && (<div className="space-y-8 md:space-y-10"><h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">Giriş</h3><p className="text-base md:text-lg">Bu politika, Bookcy platformunu kullanırken kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar. Bilgilerinizin güvenliği bizim için en yüksek önceliktir.</p><h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">Toplanan Veriler</h3><p className="text-base md:text-lg">Randevu oluştururken girdiğiniz ad, soyad, telefon numarası ve e-posta adresi gibi bilgiler, hizmeti sağlamak amacıyla sistemlerimizde güvenle saklanır. İşletmeler sadece kendilerinden randevu alan müşterilerin iletişim bilgilerini görebilir.</p><h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">Verilerin Kullanımı</h3><p className="text-base md:text-lg">Toplanan veriler, randevu onayları, hatırlatmalar ve platform içindeki iletişimi sağlamak için kullanılır. Verileriniz üçüncü şahıslara satılmaz veya pazarlama amacıyla paylaşılmaz.</p></div>)}
              {step === 'kvkk' && (<div className="space-y-8 md:space-y-10"><h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">Veri Sorumlusu</h3><p className="text-base md:text-lg">Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca veri sorumlusu, Bookcy Ltd.'dir.</p><h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">İşlenme Amacı</h3><p className="text-base md:text-lg">Kişisel verileriniz; randevu süreçlerinin yürütülmesi, işletme-müşteri iletişiminin sağlanması ve hizmet kalitemizin artırılması amaçlarıyla sınırlı olarak işlenmektedir.</p><h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">Haklarınız</h3><p className="text-base md:text-lg">KVKK'nın 11. maddesi gereğince; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, eksik veya yanlış işlenmişse düzeltilmesini isteme ve silinmesini talep etme haklarına sahipsiniz.</p></div>)}
              {step === 'terms' && (<div className="space-y-8 md:space-y-10"><h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">Hizmet Tanımı</h3><p className="text-base md:text-lg">Bookcy, kullanıcıların anlaşmalı işletmelerden online randevu almasını sağlayan aracı bir platformdur. Platform üzerinden sunulan hizmetin kalitesi ve içeriğinden ilgili işletme sorumludur.</p><h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">Kullanıcı Sorumlulukları</h3><p className="text-base md:text-lg">Kullanıcılar, randevu oluştururken doğru bilgi vermekle yükümlüdür. Geçerli bir mazeret olmaksızın sık sık randevularına gitmeyen veya iptal etmeyen kullanıcıların hesapları askıya alınabilir.</p><h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">İptal ve Değişiklik</h3><p className="text-base md:text-lg">Randevu iptal veya değişiklik işlemleri, ilgili işletmenin belirlediği süreler dahilinde sistem üzerinden yapılmalıdır.</p></div>)}
              {step === 'cookies' && (<div className="space-y-8 md:space-y-10"><h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">Çerez Nedir?</h3><p className="text-base md:text-lg">Çerezler (Cookies), sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük veri dosyalarıdır. Sitemizin doğru çalışması ve kullanıcı deneyiminizin iyileştirilmesi için kullanılırlar.</p><h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">Hangi Çerezleri Kullanıyoruz?</h3><p className="text-base md:text-lg">Zorunlu Çerezler: Sisteme giriş yapmanız ve sayfa güvenliğinin sağlanması için mecburidir. Performans Çerezleri: Site trafiğini analiz ederek platformu hızlandırmamıza yardımcı olur.</p><h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] uppercase tracking-widest border-b border-slate-100 pb-4">Çerez Yönetimi</h3><p className="text-base md:text-lg">Tarayıcı ayarlarınızı değiştirerek çerezleri reddedebilir veya silebilirsiniz. Ancak bu durumda sitemizin bazı özellikleri (örneğin oturum açık kalma) düzgün çalışmayabilir.</p></div>)}
            </div></div></div>
        )}
      </main>

      <footer className="w-full bg-[#2D1B4E] pt-12 md:pt-20 pb-8 md:pb-10 px-6 text-white/60 text-sm border-t border-[#3E296A] z-10 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12 border-b border-white/10 pb-8 md:pb-12">
          <div>
            <div className="mb-6 md:mb-8 h-16 w-fit bg-white p-3 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10 shadow-lg"><img src="/logo.png" alt="Bookcy Logo" className="w-full h-full object-contain" /></div>
            <p className="mb-6 md:mb-8 leading-relaxed font-medium text-white/70">{t[lang].footer.desc}</p>
            <div className="flex gap-4">
              <a href="https://instagram.com/bookcy" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-[#E1306C] transition-all hover:-translate-y-1"><InstagramIcon size={20}/></a>
              <a href="https://wa.me/905555555555" target="_blank" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-[#25D366] transition-all hover:-translate-y-1"><MessageCircle size={20}/></a>
              <a href="mailto:info@bookcy.co" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-blue-500 transition-all hover:-translate-y-1"><Mail size={20}/></a>
            </div>
          </div>
          <div><h4 className="text-white font-black mb-6 md:mb-8 tracking-[0.2em] uppercase text-xs border-l-2 border-[#E8622A] pl-3">{t[lang].footer.col1}</h4><button onClick={()=>setStep('services')} className="block mb-4 bg-transparent border-none text-white/60 cursor-pointer hover:text-white font-medium transition-colors text-base p-0">Ana Sayfa</button><button onClick={()=>setStep('about')} className="block mb-4 bg-transparent border-none text-white/60 cursor-pointer hover:text-white font-medium transition-colors text-base p-0">{t[lang].nav.about}</button><button onClick={()=>{setShowRegister(true); window.scrollTo(0,0);}} className="block mb-4 bg-transparent border-none text-white/60 cursor-pointer hover:text-[#E8622A] font-medium transition-colors text-base p-0">{t[lang].nav.addShop}</button></div>
          <div><h4 className="text-white font-black mb-6 md:mb-8 tracking-[0.2em] uppercase text-xs border-l-2 border-[#E8622A] pl-3">{t[lang].footer.col2}</h4>{cyprusRegions.map(r => <button key={r} onClick={()=>{setFilterRegion(r); setStep('all_shops'); window.scrollTo(0,0);}} className="block mb-4 bg-transparent border-none text-white/60 cursor-pointer hover:text-white font-medium transition-colors text-base p-0">{r}</button>)}</div>
          <div><h4 className="text-white font-black mb-6 md:mb-8 tracking-[0.2em] uppercase text-xs border-l-2 border-[#E8622A] pl-3">{t[lang].footer.col3}</h4><button onClick={()=>{setStep('privacy'); window.scrollTo(0,0);}} className="block mb-4 bg-transparent border-none text-white/60 cursor-pointer hover:text-white font-medium transition-colors text-base p-0">Gizlilik Politikası</button><button onClick={()=>{setStep('kvkk'); window.scrollTo(0,0);}} className="block mb-4 bg-transparent border-none text-white/60 cursor-pointer hover:text-white font-medium transition-colors text-base p-0">KVKK Aydınlatma Metni</button><button onClick={()=>{setStep('terms'); window.scrollTo(0,0);}} className="block mb-4 bg-transparent border-none text-white/60 cursor-pointer hover:text-white font-medium transition-colors text-base p-0">Kullanım Şartları</button><button onClick={()=>{setStep('cookies'); window.scrollTo(0,0);}} className="block mb-4 bg-transparent border-none text-white/60 cursor-pointer hover:text-white font-medium transition-colors text-base p-0">Çerez Politikası</button></div>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium"><p>© {new Date().getFullYear()} BOOKCY LTD. {t[lang].footer.right1}</p><p className="font-black text-white/40 tracking-[0.3em] uppercase bg-white/5 px-4 py-2 rounded-lg">One Click Booking™</p></div>
      </footer>
    </>
  );
}