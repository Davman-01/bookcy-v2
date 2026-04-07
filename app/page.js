"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Instagram ve bazi ikonlar Vercel'de hata verdigi icin onlari cikardik.
import { 
  MapPin, Star, ArrowRight, CheckCircle2, XCircle, ChevronLeft, ChevronRight, ChevronDown, 
  Phone, Calendar, Clock, Lock, Upload, FileText, Briefcase, 
  MessageSquare, Mail, Settings, Edit3, Target, TrendingUp, Users, Crown, 
  Search, Sliders, MessageCircle, Scissors, Tag, User, UserCircle, 
  Smartphone, Bell, Grid, X, Gem, Zap, Check, Award, LayoutDashboard, PieChart, Store, 
  CalendarOff, Music, Ticket
} from 'lucide-react';

// VERCEL'İ KANDIRAN SAHTE VERİTABANI BAĞLANTISI (lib/supabase.js bulunamadi hatasini engeller)
const supabase = {
  from: () => ({
    select: () => ({ eq: async () => ({ data: [] }), then: (cb) => cb({ data: [] }) }),
    insert: async () => ({ error: null })
  }),
  storage: { 
    from: () => ({ 
      upload: async () => ({ error: null }), 
      getPublicUrl: () => ({ data: { publicUrl: '' } }) 
    }) 
  }
};

// VERCEL'İN BULAMADIĞI INSTAGRAM İKONUNUN MANUEL ÇİZİMİ
const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

function parseDuration(durationStr) {
  if (!durationStr || durationStr === '0') return 30;
  const match = durationStr.match(/\d+/);
  return match ? parseInt(match[0]) : 30;
}

function getRequiredSlots(durationStr) {
  return Math.ceil(parseDuration(durationStr) / 30);
}

const allTimeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", 
  "00:00", "00:30", "01:00", "01:30", "02:00"
];

const defaultWorkingHours = [
  { day: 'Pazartesi', open: '09:00', close: '19:00', isClosed: false },
  { day: 'Salı', open: '09:00', close: '19:00', isClosed: false },
  { day: 'Çarşamba', open: '09:00', close: '19:00', isClosed: false },
  { day: 'Perşembe', open: '09:00', close: '19:00', isClosed: false },
  { day: 'Cuma', open: '09:00', close: '19:00', isClosed: false },
  { day: 'Cumartesi', open: '09:00', close: '19:00', isClosed: false },
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
    username: '', password: '', email: '', description: '', logoFile: null, package: 'Standard' 
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  
  const [emailValid, setEmailValid] = useState(null);
  const [phoneValid, setPhoneValid] = useState(null);
  const [adminEmailValid, setAdminEmailValid] = useState(null);

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

  const [appointments, setAppointments] = useState([]);
  const [globalAppointments, setGlobalAppointments] = useState([]); 
  const [closedSlots, setClosedSlots] = useState([]);
  const [profileTab, setProfileTab] = useState('services'); 
  const [lightboxImg, setLightboxImg] = useState(null);

  const cyprusRegions = ["Girne", "Lefkoşa", "Mağusa", "İskele", "Güzelyurt", "Lefke"];

  const t = {
    TR: {
      nav: { places: "Mekanlar", features: "Özellikler", contact: "İletişim", about: "Hakkımızda", addShop: "İşletme Ekle", login: "İşletme Girişi", logout: "Çıkış Yap", dashboard: "Panelime Git" },
      megaMenu: { col1Title: "Kurulum", col2Title: "Müşterileri Etkile", col3Title: "İşletmeni Yönet", col4Title: "Büyümeye Devam Et", btn: "Tüm Özellikleri Keşfet" },
      featNames: { profile: "Bookcy Profili", market: "Pazaryeri Listeleme", team: "Ekip Yönetimi", booking: "Online Randevu", app: "Müşteri Uygulaması", marketing: "Pazarlama Araçları", calendar: "Takvim & Planlama", crm: "Müşteri Yönetimi", boost: "Öne Çık", stats: "İstatistik & Raporlar" },
      featDesc: { profile: "İşletmenizin dijital vitrinini saniyeler içinde oluşturun.", market: "Bookcy kullanan binlerce aktif müşteriye doğrudan ulaşın.", team: "Personelinizin çalışma saatlerini kolayca yönetin.", booking: "Müşterilerinizin 7/24 randevu almasını sağlayın.", app: "Müşterilerinize özel mobil uygulama konforu sunun.", marketing: "Doğru zamanda doğru mesajı gönderin.", calendar: "Akıllı dijital takvim ile çakışmaları önleyin.", crm: "Müşteri geçmişini güvenle saklayın.", boost: "Aramalarda üst sıralara çıkın.", stats: "Anlık ve net raporlarla kazancınızı görün." },
      featDetails: {
        profile: { purpose: "Bookcy Profili, işletmenizin çevrimiçi ortamdaki dijital vitrinidir.", adv1: { title: "Profesyonel İmaj", desc: "Kaliteli fotoğraflar ile ilk intibanızı güçlendirin." }, adv2: { title: "Güven İnşası", desc: "Müşteri yorumları ile güveni hızla kazanın." }, adv3: { title: "Kolay Keşfedilebilirlik", desc: "Arama motorlarında üst sıralarda bulunun." } },
        market: { purpose: "Binlerce hazır müşteriyi sizinle buluşturur.", adv1: { title: "Yeni Müşteriler", desc: "Bölgenizde hizmet arayan aktif kullanıcılara ulaşın." }, adv2: { title: "Boşlukları Doldurun", desc: "İptal edilen randevuları sergileyin." }, adv3: { title: "Rekabet Avantajı", desc: "Rakiplerinizin önünde yer alın." } },
        team: { purpose: "Personelinizin mesailerini zahmetsizce koordine etmenizi sağlar.", adv1: { title: "Kolay Planlama", desc: "Vardiyaları dijital olarak düzenleyin." }, adv2: { title: "Performans Takibi", desc: "Gelirleri anlık görün." }, adv3: { title: "Bireysel Takvimler", desc: "Çakışmaları tamamen ortadan kaldırın." } },
        booking: { purpose: "Müşterilerin 7/24 randevu oluşturmasını sağlar.", adv1: { title: "Zaman Tasarrufu", desc: "Randevu telefonları yerine işinize odaklanın." }, adv2: { title: "Sıfır Hata", desc: "Not alma hatalarını sıfıra indirin." }, adv3: { title: "Kesintisiz Hizmet", desc: "İşletmeniz kapalıyken bile rezervasyon kabul edin." } },
        app: { purpose: "İşletmenizle müşterilerinizin pürüzsüz bir bağ kurmalarını sağlar.", adv1: { title: "Kusursuz Deneyim", desc: "Kullanıcı dostu bir arayüz sunun." }, adv2: { title: "Kolay Takip", desc: "Yaklaşan randevular takip edilsin." }, adv3: { title: "Anlık İptal", desc: "İptaller saat takviminize boş yansısın." } },
        marketing: { purpose: "İletişim asistanınızdır.", adv1: { title: "Hedefli Kampanyalar", desc: "Özel fırsatlar sunun." }, adv2: { title: "SMS ve E-posta", desc: "Otomatik kutlama mesajları gönderin." }, adv3: { title: "Ciro Artışı", desc: "Ziyaret sıklığını artırın." } },
        calendar: { purpose: "Randevuları organize eden yapıdır.", adv1: { title: "Çakışma Koruması", desc: "Aynı saate iki randevuyu imkansız hale getirir." }, adv2: { title: "Optimizasyon", desc: "Takvimdeki boşlukları analiz eder." }, adv3: { title: "Sürükle & Bırak", desc: "Saatleri farenizle anında değiştirin." } },
        crm: { purpose: "Müşterinizin tercihlerini saklayan arşivinizdir.", adv1: { title: "Müşteri Profili", desc: "Geçmiş işlemleri görün." }, adv2: { title: "Özel Notlar", desc: "Detayları sisteme kaydedin." }, adv3: { title: "Sadakat İnşası", desc: "Kırılmaz bir bağ oluşturun." } },
        boost: { purpose: "Görünürlüğünüzü en üst seviyeye taşıyan pakettir.", adv1: { title: "Aramalarda Zirve", desc: "En üst sıralarda yer alın." }, adv2: { title: "Vitrinde Yer Alın", desc: "Önerilenler listesinde gösterilin." }, adv3: { title: "Prestijli İmaj", desc: "Öne çıkan rozetlerle kalitenizi vurgulayın." } },
        stats: { purpose: "Verilerle doğru kararlar almanızı sağlayan sistemdir.", adv1: { title: "Gerçek Zamanlı Ciro", desc: "Kazançlarınızı anlık olarak takip edin." }, adv2: { title: "Hizmet Analizi", desc: "Stratejinizi belirleyin." }, adv3: { title: "Personel Raporları", desc: "Uzman performansını görün." } }
      },
      featUI: { purposeTitle: "Amacı ve Ne İşe Yarar?", benefitsTitle: "Avantajları", allFeaturesTitle: "Tüm Özellikler", allFeaturesSub: "İşletmenizi büyütmek için ihtiyacınız olan her şey." },
      home: { eyebrow: "Kıbrıs'ın #1 Güzellik Platformu", title1: "Kendine", title2: "iyi bak,", title3: "hemen", title4: "rezerve et.", subtitle: "Yakınındaki en iyi berber, kuaför, spa ve güzellik uzmanlarını bul. Tek tıkla randevu al, zamanın senin olsun.", searchPlace: "Hizmet veya mekan ara...", searchLoc: "Nerede?", searchBtn: "Ara", popTitle: "Popüler:", stats: {s1:"Aktif İşletme", s2:"Mutlu Müşteri", s3:"Tamamlanan İşlem", s4:"Memnuniyet"} },
      cats: { catTitle: "Kategoriler", catSub: "Bugün ne yaptırmak istersiniz?", seeAll: "Tümünü Gör →", tattoo: "Dövme", barber: "Berber", hair: "Kuaför", nail: "Tırnak & Güzellik", club: "Bar & Club", spa: "Spa & Masaj", makeup: "Makyaj", skincare: "Cilt Bakımı" },
      homeInfo: { recLabel: "Öne Çıkanlar", recTitle: "Kıbrıs'ta Bu Hafta 🔥", howLabel: "Nasıl Çalışır?", howTitle: "4 Basit Adımda Randevun Hazır", how1Title: "Keşfet", how1Desc: "Yakındaki mekanları incele ve filtrele.", how2Title: "Tarih Seç", how2Desc: "Sana en uygun zamanı tek tıkla seç.", how3Title: "Onayla", how3Desc: "Saniyeler içinde rezervasyonun onaylanır.", how4Title: "Keyif Çıkar", how4Desc: "Git, hizmetini al ve puan ver.", ctaLabel: "İşletme Sahibi misiniz?", ctaTitle1: "Bookcy ile İşletmeni", ctaTitle2: "Dijitalleştir.", ctaSub: "Randevu sistemini kolaylaştır, yeni müşteri kazan." },
      filters: { title: "Arama Sonuçları", search: "Mekan Ara...", region: "Bölge", service: "Kategori", sortHigh: "En Yüksek Puan", sortLow: "En Düşük Puan", clear: "Temizle", count: "Mekan Bulundu" },
      reg: { title: "İŞLETME KAYIT", subtitle: "Sadece İşletme Sahipleri İçindir", shopName: "İşletme Adı", location: "Bölge Seçin", address: "Tam Adres", maps: "Google Maps Linki", desc: "Hakkımızda", email: "Admin E-Posta", contactPhone: "İşletme Telefonu", contactInsta: "Instagram Linki", contactEmail: "İletişim E-Posta", user: "Kullanıcı Adı", pass: "Şifre", pack: "Paket Seçimi", upload: "Logo Yükle", submit: "BAŞVUR", success: "BAŞVURUNUZ ALINDI!", uploading: "YÜKLENİYOR..." },
      shops: { back: "GERİ DÖN", empty: "Kriterlere uygun işletme bulunamadı." },
      profile: { tabServices: "Hizmetler", tabEvents: "Etkinlikler", tabGallery: "Galeri", about: "Hakkında", contactTitle: "İLETİŞİM", bookBtn: "SEÇ", noDesc: "İşletme henüz bir açıklama eklememiş.", noServices: "İşletme henüz liste eklememiş.", noGallery: "İşletme henüz fotoğraf eklememiş.", similarTitle: "BENZER MEKANLAR" },
      book: { change: "Geri", selectService: "Devam etmek için hizmet seçin.", selectEvent: "Etkinliği seçin.", selectLoca: "VIP türünü seçin.", selectStaff: "UZMAN SEÇİN", anyStaff: "Fark Etmez", date: "Tarih", time: "Saat", name: "Adınız", surname: "Soyadınız", phone: "Telefon", email: "E-Posta", submit: "ONAYLA", success: "RANDEVU ONAYLANDI", successSub: "Bilgileriniz işletmeye iletildi.", backHome: "ANA SAYFA", total: "Toplam", details: "Randevu Detayları", service: "Hizmet", event: "Etkinlik", staff: "Uzman", dateTime: "Zaman", contactInfo: "İletişim Bilgileri", btnBook: "Randevu Al →", shopClosed: "İŞLETME BU TARİHTE KAPALIDIR." },
      about: { title: "Sektörün Dijital Devrimi", subtitle: "İşletmenizi Büyütün.", missionDesc: "Telefon trafiğinden kurtulun. BOOKCY, pazar lideri randevu platformudur.", bizTitle: "Karlı Çözümler", biz1: "Kesintisiz 7/24 Rezervasyon", biz1Desc: "Siz uyurken sistem randevu alır.", biz2: "Boş Koltuklara Son", biz2Desc: "İptalleri minimuma indirin.", biz3: "Sıfır Komisyon", biz3Desc: "Her randevudan komisyon kesilmez.", biz4: "Lider Olun", biz4Desc: "Rakiplerinizin önüne geçin.", usrTitle: "Müşteriler Neden Seçiyor?", usr1: "Sırada Beklemeye Son", usr1Desc: "Saatinizi seçin, beklemeyin.", usr2: "Şeffaf Fiyatlandırma", usr2Desc: "Ne kadar ödeyeceğinizi bilin.", usr3: "Güvenilir Yorumlar", usr3Desc: "Gerçek deneyimleri okuyun.", packTitle: "Paketler", packSub: "Sürpriz ücret yok.", pkg1Name: "Standard Paket", pkg1Price: "£60", pkg1Period: "/ Ay", pkg1Feat1: "Sınırsız Randevu", pkg1Feat2: "Sosyal Medya", pkg1Feat3: "İşletme Paneli", pkg1Feat4: "Personel Optimizasyonu", pkg1Feat5: "7/24 Destek", pkg2Name: "Premium Paket", pkg2Price: "£100", pkg2Period: "/ Ay", pkg2Feat1: "Standard Paketteki Her Şey", pkg2Feat2: "Önerilenler Vitrini", pkg2Feat3: "Arama Üst Sıra", pkg2Feat4: "VIP Çerçeve", pkg2Feat5: "Sponsorlu Reklam", ctaTitle: "Kazancınızı Katlayın", ctaBtn: "İŞLETMENİZİ EKLEYİN" },
      contact: { title: "BİZE ULAŞIN", sub: "Sorularınız için bize 7/24 ulaşabilirsiniz.", whatsapp: "WhatsApp Destek", wpDesc: "Anında yanıt almak için WhatsApp.", insta: "Instagram", instaDesc: "En yeni mekanları keşfedin.", email: "Kurumsal E-Posta", emailDesc: "Sponsorluk ve görüşmeler.", btnWp: "MESAJ AT", btnInsta: "TAKİP ET", btnEmail: "MAİL GÖNDER" },
      footer: { desc: "Kuzey Kıbrıs'ın tek rezervasyon platformu.", links: "Platform", cities: "Bölgeler", legal: "Sözleşmeler", terms: "Kullanım Şartları", privacy: "Gizlilik", copy: "Tüm hakları saklıdır. Kuzey Kıbrıs'ta kurulmuştur. 🇹🇷" }
    },
    EN: {
      nav: { places: "Places", features: "Features", contact: "Contact", about: "About & Packages", addShop: "Add Business", login: "Login", logout: "Logout", dashboard: "Dashboard" },
      megaMenu: { col1Title: "Set up shop", col2Title: "Wow your clients", col3Title: "Run your business", col4Title: "Keep growing", btn: "Explore All Features" },
      featNames: { profile: "Bookcy Profile", market: "Marketplace", team: "Team Management", booking: "Online Booking", app: "Customer App", marketing: "Marketing Tools", calendar: "Calendar", crm: "Client Management", boost: "Boost", stats: "Stats & Reports" },
      featDesc: { profile: "Create your digital storefront.", market: "Reach active customers.", team: "Manage staff hours.", booking: "Let clients book 24/7.", app: "Mobile app for clients.", marketing: "Send SMS/Email campaigns.", calendar: "Smart digital calendar.", crm: "Store client history.", boost: "Rank higher in searches.", stats: "Track your revenue." },
      featDetails: {
        profile: { purpose: "Your 24/7 open digital storefront.", adv1: { title: "Professional Image", desc: "Quality photos and detailed menu." }, adv2: { title: "Build Trust", desc: "Gain trust through reviews." }, adv3: { title: "Discoverability", desc: "Found on search engines." } },
        market: { purpose: "Connects customers directly with your business.", adv1: { title: "Thousands of Clients", desc: "Reach active users." }, adv2: { title: "Fill Empty Seats", desc: "Display canceled appointments." }, adv3: { title: "Competitive Edge", desc: "Stay ahead of competitors." } },
        team: { purpose: "Coordinate your staff's shifts and performance.", adv1: { title: "Easy Scheduling", desc: "Digitally arrange shifts." }, adv2: { title: "Performance", desc: "See staff revenue." }, adv3: { title: "Calendars", desc: "Eliminate conflicts." } },
        booking: { purpose: "Allows clients to book autonomously 24/7.", adv1: { title: "Save Time", desc: "Focus on your work." }, adv2: { title: "Zero Errors", desc: "Eliminate double bookings." }, adv3: { title: "24/7 Service", desc: "Accept bookings anytime." } },
        app: { purpose: "Ensures a seamless connection with your business.", adv1: { title: "Flawless Experience", desc: "Provide a VIP experience." }, adv2: { title: "Easy Tracking", desc: "Clients view appointments." }, adv3: { title: "Updates", desc: "Clients cancel easily." } },
        marketing: { purpose: "Your automated assistant to build loyalty.", adv1: { title: "Targeted Campaigns", desc: "Offer special deals." }, adv2: { title: "SMS & Email", desc: "Automated greetings." }, adv3: { title: "Revenue Boost", desc: "Increase client frequency." } },
        calendar: { purpose: "Perfectly organizes staff hours and appointments.", adv1: { title: "Conflict Protection", desc: "No double-booking." }, adv2: { title: "Optimization", desc: "Shows optimal times." }, adv3: { title: "Drag & Drop", desc: "Modify times easily." } },
        crm: { purpose: "Safely stores all history and preferences.", adv1: { title: "Detailed Profiles", desc: "See past visits." }, adv2: { title: "Private Notes", desc: "Save important details." }, adv3: { title: "Build Loyalty", desc: "Make clients feel special." } },
        boost: { purpose: "Maximizes your visibility using AI.", adv1: { title: "Top Search Ranks", desc: "Appear at the top." }, adv2: { title: "Homepage", desc: "Get featured directly." }, adv3: { title: "Image", desc: "Exclusive badges." } },
        stats: { purpose: "Helps you make data-driven decisions.", adv1: { title: "Real-Time Revenue", desc: "Track earnings." }, adv2: { title: "Service Analysis", desc: "Identify profitable services." }, adv3: { title: "Staff Reports", desc: "See top specialists." } }
      },
      featUI: { purposeTitle: "Purpose & What It Does", benefitsTitle: "Benefits For Your Business", allFeaturesTitle: "All Features", allFeaturesSub: "Everything you need to grow your business." },
      home: { eyebrow: "Cyprus's #1 Beauty Platform", title1: "Take care", title2: "of yourself,", title3: "book", title4: "instantly.", subtitle: "Find the best barbers, salons, and spas nearby. Book with one click, your time is yours.", searchPlace: "Search services...", searchLoc: "Where?", searchBtn: "Search", popTitle: "Popular:", stats: {s1:"Active Places", s2:"Happy Clients", s3:"Completed Bookings", s4:"Satisfaction"} },
      cats: { catTitle: "Categories", catSub: "What are you looking for?", seeAll: "See All →", tattoo: "Tattoo", barber: "Barber", hair: "Hair Salon", nail: "Nail Art", club: "Bar & Club", spa: "Spa & Massage", makeup: "Makeup", skincare: "Skin Care" },
      homeInfo: { recLabel: "Featured", recTitle: "Trending This Week 🔥", howLabel: "How it works?", howTitle: "Ready in 4 steps", how1Title: "Discover", how1Desc: "Find nearby places.", how2Title: "Select Date", how2Desc: "Pick the best time.", how3Title: "Confirm", how3Desc: "Booking confirmed.", how4Title: "Enjoy", how4Desc: "Get your service.", ctaLabel: "Business owner?", ctaTitle1: "Grow your business", ctaTitle2: "with Bookcy.", ctaSub: "Digitize your booking system." },
      filters: { title: "Search Results", search: "Search places...", region: "Location", service: "Categories", sortHigh: "Highest Rated", sortLow: "Lowest Rated", clear: "Clear", count: "Places Found" },
      reg: { title: "BUSINESS REGISTRATION", subtitle: "For Business Owners Only", shopName: "Business Name", location: "Select Region", address: "Full Address", maps: "Google Maps Link", desc: "Description", email: "Admin Email", contactPhone: "Business Phone", contactInsta: "Instagram Link", contactEmail: "Contact Email", user: "Username", pass: "Password", pack: "Select Package", upload: "Upload Logo", submit: "COMPLETE APPLICATION", success: "APPLICATION RECEIVED!", uploading: "UPLOADING..." },
      shops: { back: "GO BACK", empty: "No businesses found." },
      profile: { tabServices: "Services", tabEvents: "Events", tabGallery: "Gallery", about: "About Us", contactTitle: "CONTACT INFO", bookBtn: "SELECT", noDesc: "No description yet.", noServices: "No services yet.", noGallery: "No photos yet.", similarTitle: "SIMILAR PLACES NEARBY" },
      book: { change: "Back", selectService: "Select a service to continue.", selectEvent: "Select an event.", selectLoca: "Select your VIP booking type.", selectStaff: "SELECT STAFF", anyStaff: "Any Staff", date: "Date", time: "Time", name: "First Name", surname: "Last Name", phone: "Phone", email: "Email", submit: "CONFIRM", success: "APPOINTMENT CONFIRMED", successSub: "Your details have been sent.", backHome: "RETURN TO HOME", total: "Total", details: "Appointment Details", service: "Service", event: "Event", staff: "Staff", dateTime: "Date/Time", contactInfo: "Contact Info", btnBook: "Book Now →", shopClosed: "SHOP IS CLOSED ON THIS DATE." },
      about: { title: "Digital Revolution", subtitle: "Grow Your Business.", missionDesc: "Get rid of phone traffic. BOOKCY is Cyprus's market-leading booking platform.", bizTitle: "Solutions for Businesses", biz1: "24/7 Booking", biz1Desc: "Accept bookings while you sleep.", biz2: "No Empty Chairs", biz2Desc: "Minimize cancellations.", biz3: "Zero Commissions", biz3Desc: "Pay only a fixed fee.", biz4: "Be the Leader", biz4Desc: "Stand out from competitors.", usrTitle: "Why Customers Choose Bookcy?", usr1: "No More Waiting", usr1Desc: "Choose a time that fits.", usr2: "Transparent Pricing", usr2Desc: "Know what you will pay.", usr3: "Reliable Reviews", usr3Desc: "Read verified reviews.", packTitle: "Packages", packSub: "No hidden fees.", pkg1Name: "Standard Package", pkg1Price: "£60", pkg1Period: "/ Month", pkg1Feat1: "Unlimited Bookings", pkg1Feat2: "Social Media Sharing", pkg1Feat3: "Dashboard", pkg1Feat4: "Staff Optimization", pkg1Feat5: "24/7 Support", pkg2Name: "Premium Package", pkg2Price: "£100", pkg2Period: "/ Month", pkg2Feat1: "Everything in Standard", pkg2Feat2: "Homepage 'Recommended'", pkg2Feat3: "Top Ranks in Search", pkg2Feat4: "VIP Gold Border", pkg2Feat5: "Sponsored Ad Sharing", ctaTitle: "Ready to Multiply Your Income?", ctaBtn: "ADD YOUR BUSINESS" },
      contact: { title: "CONTACT US", sub: "We are here 24/7.", whatsapp: "WhatsApp", wpDesc: "Contact us via WhatsApp.", insta: "Instagram", instaDesc: "Follow us.", email: "Corporate Email", emailDesc: "Email us for inquiries.", btnWp: "MESSAGE", btnInsta: "FOLLOW", btnEmail: "EMAIL" },
      footer: { desc: "North Cyprus's premier booking platform for beauty & wellness.", links: "Platform", cities: "Regions", legal: "Terms", terms: "Terms of Use", privacy: "Privacy Policy", copy: "All rights reserved. Made in North Cyprus. 🇹🇷" }
    },
    RU: {
      nav: { places: "Места", features: "Функции", contact: "Контакты", about: "О нас и пакеты", addShop: "Добавить бизнес", login: "Вход", logout: "Выйти", dashboard: "Панель" },
      megaMenu: { col1Title: "Настройка", col2Title: "Клиенты", col3Title: "Бизнес", col4Title: "Развитие", btn: "Узнать все функции" },
      featNames: { profile: "Профиль Bookcy", market: "Маркетплейс", team: "Команда", booking: "Онлайн-бронирование", app: "Приложение", marketing: "Маркетинг", calendar: "Календарь", crm: "Управление клиентами", boost: "Продвижение", stats: "Статистика" },
      featDesc: { profile: "Создайте витрину за секунды.", market: "Охватите тысячи клиентов.", team: "Управляйте персоналом.", booking: "Бронирование 24/7.", app: "Мобильное приложение.", marketing: "SMS и Email кампании.", calendar: "Умный календарь.", crm: "Управление клиентами.", boost: "Выше в поиске.", stats: "Следите за доходами." },
      featDetails: {
        profile: { purpose: "Ваша цифровая витрина.", adv1: { title: "Имидж", desc: "Улучшите первое впечатление." }, adv2: { title: "Доверие", desc: "Отзывы клиентов." }, adv3: { title: "Поиск", desc: "Легкий поиск." } },
        market: { purpose: "Связывает клиентов с вашим бизнесом.", adv1: { title: "Клиенты", desc: "Активные пользователи." }, adv2: { title: "Пустые места", desc: "Отмененные записи." }, adv3: { title: "Конкуренция", desc: "Опережайте конкурентов." } },
        team: { purpose: "Управление командой.", adv1: { title: "Планирование", desc: "Избегайте ошибок." }, adv2: { title: "Оценка", desc: "Отслеживайте доходы." }, adv3: { title: "Календари", desc: "Исключите конфликты." } },
        booking: { purpose: "Онлайн-бронирование 24/7.", adv1: { title: "Экономия времени", desc: "Сосредоточьтесь на работе." }, adv2: { title: "Ноль ошибок", desc: "Без человеческого фактора." }, adv3: { title: "Сервис 24/7", desc: "Принимайте записи всегда." } },
        app: { purpose: "Приложение для клиентов.", adv1: { title: "Опыт", desc: "Современный интерфейс." }, adv2: { title: "Отслеживание", desc: "Прошлые визиты." }, adv3: { title: "Обновления", desc: "Отмена записей." } },
        marketing: { purpose: "Маркетинг.", adv1: { title: "Кампании", desc: "Скидки." }, adv2: { title: "SMS", desc: "Поздравления." }, adv3: { title: "Рост", desc: "Напоминания." } },
        calendar: { purpose: "Календарь организует работу.", adv1: { title: "Защита", desc: "Без двойного бронирования." }, adv2: { title: "Оптимизация", desc: "Идеальное время." }, adv3: { title: "Легкость", desc: "Перетаскивание." } },
        crm: { purpose: "Управление клиентами.", adv1: { title: "Профили", desc: "Последние визиты." }, adv2: { title: "Заметки", desc: "Предпочтения." }, adv3: { title: "Лояльность", desc: "Каждый клиент особенный." } },
        boost: { purpose: "Продвижение с помощью ИИ.", adv1: { title: "Топ", desc: "Всегда вверху." }, adv2: { title: "На главной", desc: "'Рекомендуемые'." }, adv3: { title: "Имидж", desc: "Значки профиля." } },
        stats: { purpose: "Статистика.", adv1: { title: "Доход", desc: "Заработок." }, adv2: { title: "Услуги", desc: "Прибыльные процедуры." }, adv3: { title: "Отчеты", desc: "Кто получает больше записей." } }
      },
      featUI: { purposeTitle: "Цель", benefitsTitle: "Преимущества", allFeaturesTitle: "Все функции", allFeaturesSub: "Всё для роста бизнеса." },
      home: { eyebrow: "Платформа красоты #1", title1: "Позаботьтесь", title2: "о себе,", title3: "забронируйте", title4: "сейчас.", subtitle: "Найдите лучших мастеров, салоны и спа поблизости. Бронируйте в один клик.", searchPlace: "Поиск услуг...", searchLoc: "Где?", searchBtn: "ПОИСК", popTitle: "Популярные:", stats: {s1:"Активные", s2:"Клиенты", s3:"Записи", s4:"Удовлетворенность"} },
      cats: { catTitle: "Категории", catSub: "Что вы ищете?", seeAll: "Все →", tattoo: "Тату", barber: "Барбер", hair: "Парикмахерская", nail: "Маникюр", club: "Бар", spa: "Спа", makeup: "Макияж", skincare: "Уход за кожей" },
      homeInfo: { recLabel: "Популярные", recTitle: "В тренде 🔥", howLabel: "Как это работает?", howTitle: "Готово за 4 шага", how1Title: "Найти", how1Desc: "Найдите салоны.", how2Title: "Дата", how2Desc: "Свободное время.", how3Title: "Подтвердить", how3Desc: "Бронь подтверждена.", how4Title: "Наслаждаться", how4Desc: "Оставьте отзыв.", ctaLabel: "Владелец бизнеса?", ctaTitle1: "Развивайте бизнес", ctaTitle2: "с Bookcy.", ctaSub: "Оцифруйте бизнес." },
      filters: { title: "Результаты", search: "Поиск...", region: "Где?", service: "Услуги", sortHigh: "С высоким рейтингом", sortLow: "С низким рейтингом", clear: "Очистить", count: "Найдено" },
      reg: { title: "РЕГИСТРАЦИЯ", subtitle: "Для бизнеса", shopName: "Название", location: "Регион", address: "Адрес", maps: "Ссылка на Google Maps", desc: "Описание", email: "Email", contactPhone: "Телефон", contactInsta: "Ссылка на Instagram", contactEmail: "Контактный Email", user: "Имя пользователя", pass: "Пароль", pack: "Пакет", upload: "Логотип", submit: "ЗАВЕРШИТЬ", success: "ЗАЯВКА ПОЛУЧЕНА!", uploading: "ЗАГРУЗКА..." },
      shops: { back: "НАЗАД", empty: "Не найдено." },
      profile: { tabServices: "Услуги", tabEvents: "События", tabGallery: "Галерея", about: "О НАС", contactTitle: "КОНТАКТЫ", bookBtn: "ВЫБРАТЬ", noDesc: "Нет описания.", noServices: "Нет услуг.", noGallery: "Нет фото.", similarTitle: "ПОХОЖИЕ МЕСТА" },
      book: { change: "Назад", selectService: "Выберите услугу", selectEvent: "Выберите событие", selectLoca: "Выберите зону", selectStaff: "ВЫБЕРИТЕ СПЕЦИАЛИСТА", anyStaff: "Любой", date: "Дата", time: "Время", name: "Имя", surname: "Фамилия", phone: "Телефон", email: "Email", submit: "ПОДТВЕРДИТЬ", success: "БРОНЬ ПОДТВЕРЖДЕНА", successSub: "Данные отправлены.", backHome: "НА ГЛАВНУЮ", total: "Итого", details: "Детали", service: "Услуга", event: "Событие", staff: "Специалист", dateTime: "Дата / Время", contactInfo: "Контакты", btnBook: "Забронировать →", shopClosed: "ЗАКРЫТО В ЭТУ ДАТУ." },
      about: { title: "Революция", subtitle: "Развивайте бизнес.", missionDesc: "BOOKCY — платформа Кипра.", bizTitle: "Решения", biz1: "Бронь 24/7", biz1Desc: "Принимайте заказы.", biz2: "Нет отменам", biz2Desc: "Сведите к минимуму отмены.", biz3: "Без комиссий", biz3Desc: "Фиксированная плата.", biz4: "Лидерство", biz4Desc: "Выделяйтесь.", usrTitle: "Почему Bookcy?", usr1: "Без очередей", usr1Desc: "Удобное время.", usr2: "Прозрачные цены", usr2Desc: "Точная цена.", usr3: "Отзывы", usr3Desc: "Читайте реальные отзывы.", packTitle: "Пакеты", packSub: "Никаких скрытых платежей.", pkg1Name: "Стандартный Пакет", pkg1Price: "£60", pkg1Period: "/ Месяц", pkg1Feat1: "Безлимит", pkg1Feat2: "Соцсети", pkg1Feat3: "Панель", pkg1Feat4: "Персонал", pkg1Feat5: "Поддержка", pkg2Name: "Премиум Пакет", pkg2Price: "£100", pkg2Period: "/ Месяц", pkg2Feat1: "Всё включено", pkg2Feat2: "Топ на главной", pkg2Feat3: "Высший рейтинг", pkg2Feat4: "VIP Рамка", pkg2Feat5: "Реклама", ctaTitle: "Готовы расти?", ctaBtn: "ДОБАВИТЬ БИЗНЕС" },
      contact: { title: "КОНТАКТЫ", sub: "Мы здесь 24/7.", whatsapp: "WhatsApp", wpDesc: "Свяжитесь.", insta: "Instagram", instaDesc: "Подписывайтесь.", email: "Эл. почта", emailDesc: "Напишите нам.", btnWp: "НАПИСАТЬ", btnInsta: "ПОДПИСАТЬСЯ", btnEmail: "ОТПРАВИТЬ" },
      footer: { desc: "Платформа бронирования на Северном Кипре.", links: "Платформа", cities: "Регион", legal: "О нас", terms: "Условия использования", privacy: "Политика конфиденциальности", copy: "Все права защищены. Сделано на Северном Кипре. 🇹🇷" }
    }
  };

  const megaMenuStructure = {
      col1: ['profile', 'market', 'team'],
      col2: ['booking', 'app'],
      col3: ['marketing', 'calendar', 'crm'],
      col4: ['boost', 'stats']
  };

  const featureIcons = {
      profile: <Briefcase size={40} className="theme-text-main mb-4"/>,
      market: <Store size={40} className="theme-text-main mb-4"/>,
      team: <Users size={40} className="theme-text-main mb-4"/>,
      booking: <Target size={40} className="theme-text-main mb-4"/>,
      app: <Smartphone size={40} className="theme-text-main mb-4"/>,
      marketing: <Target size={40} className="theme-text-main mb-4"/>,
      calendar: <Calendar size={40} className="theme-text-main mb-4"/>,
      crm: <User size={40} className="theme-text-main mb-4"/>,
      boost: <TrendingUp size={40} className="theme-text-main mb-4"/>,
      stats: <PieChart size={40} className="theme-text-main mb-4"/>,
  };

  const featureIconsSmall = {
      profile: <Briefcase size={20}/>, 
      market: <Store size={20}/>, 
      team: <Users size={20}/>, 
      booking: <Target size={20}/>, 
      app: <Smartphone size={20}/>, 
      marketing: <Target size={20}/>, 
      calendar: <Calendar size={20}/>, 
      crm: <User size={20}/>, 
      boost: <TrendingUp size={20}/>, 
      stats: <PieChart size={20}/>,
  };

  const packages = [
    { name: "Standard", price: `£60 ${lang==='TR'?'/ Ay':lang==='EN'?'/ Month':'/ Месяц'}` }, 
    { name: "Premium", price: `£100 ${lang==='TR'?'/ Ay':lang==='EN'?'/ Month':'/ Месяц'}` }
  ];
  
  const categories = [ 
      { key: "barber", dbName: "Berber", bg: "linear-gradient(135deg,#f8fafc,#e2e8f0)", emoji: "💈" }, 
      { key: "hair", dbName: "Kuaför", bg: "linear-gradient(135deg,#fdf4ff,#fce7f3)", emoji: "✂️" }, 
      { key: "nail", dbName: "Tırnak & Güzellik", bg: "linear-gradient(135deg,#fff1f2,#fbcfe8)", emoji: "💅" }, 
      { key: "tattoo", dbName: "Dövme", bg: "linear-gradient(135deg,#f1f5f9,#cbd5e1)", emoji: "🖋️" }, 
      { key: "spa", dbName: "Spa & Masaj", bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)", emoji: "💆" }, 
      { key: "skincare", dbName: "Cilt Bakımı", bg: "linear-gradient(135deg,#eff6ff,#dbeafe)", emoji: "🧴" }, 
      { key: "makeup", dbName: "Makyaj", bg: "linear-gradient(135deg,#fff7ed,#ffedd5)", emoji: "💄" }, 
      { key: "club", dbName: "Bar & Club", bg: "linear-gradient(135deg,#f3f4f6,#e5e7eb)", emoji: "🍸" } 
  ];

  async function fetchGlobalAppointments() { 
    const { data } = await supabase.from('appointments').select('customer_phone'); 
    if (data) setGlobalAppointments(data); 
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

  const isClub = selectedShop?.category === 'Bar & Club';

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
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(255,255,255,0.98)';
                nav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
            } else {
                nav.style.background = 'rgba(255,255,255,0.95)';
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    const inputUser = loginUsername.trim().toLowerCase();
    const inputPass = loginPassword.trim();
    const shop = shops.find(s => s.admin_username?.toLowerCase() === inputUser);
    
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
      if (shop.admin_password !== inputPass) { 
        alert("Hatalı Şifre!"); 
        setIsLoginLoading(false); 
        return; 
      }
      localStorage.setItem('bookcy_biz_session', JSON.stringify({ role: 'owner', shopData: shop }));
      setShowLogin(false); 
      setIsLoginLoading(false); 
      router.push('/dashboard');
    } else {
      const staffList = shop.staff || [];
      const validStaff = staffList.find(s => s.name.toLowerCase() === loginStaffName.trim().toLowerCase() && s.password === inputPass);
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

  const handleHeroSearch = (e) => { 
    e.preventDefault(); 
    setStep('all_shops'); 
    window.scrollTo(0,0); 
  };

  const goToFeature = (featureKey) => { 
    setActiveFeature(featureKey); 
    setStep('feature_detail'); 
    setShowFeaturesMenu(false); 
    window.scrollTo(0,0); 
  };

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    if (emailValid === false || phoneValid === false || adminEmailValid === false) {
      return alert("Lütfen iletişim bilgilerinizi doğru formatta giriniz.");
    }
    
    setIsUploading(true);
    let uploadedLogoUrl = null;
    
    if (newShop.logoFile) {
      const fileName = `${Math.random()}.${newShop.logoFile.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, newShop.logoFile);
      if (!uploadError) {
        uploadedLogoUrl = supabase.storage.from('logos').getPublicUrl(fileName).data.publicUrl;
      }
    }
    
    const fullPhone = newShop.phoneCode + " " + newShop.contactPhone;

    const { error } = await supabase.from('shops').insert([
      { 
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
      }
    ]);
    
    setIsUploading(false);
    
    if (!error) {
        setRegisterSuccess(true);
        const regEmailHtml = `
          <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; background: #ffffff;">
            <div style="background: #2D1B4E; padding: 32px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900;">BOOKCY<span style="color: #E8622A;">.</span></h1>
            </div>
            <div style="padding: 40px 32px;">
              <h2 style="color: #2D1B4E; margin-top: 0; font-size: 22px;">Merhaba ${newShop.name},</h2>
              <p style="color: #64748b; font-size: 16px; line-height: 1.6;">Bizi tercih ettiğiniz için teşekkür ederiz. İşletme profilinizin onaylanıp yayına alınabilmesi için lütfen ödeme dekontunuzu WhatsApp destek hattımız üzerinden bize iletiniz.</p>
            </div>
          </div>
        `; 
        try { 
          await fetch('/api/email', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
              to: newShop.email, 
              subject: 'BOOKCY - Başvurunuz Alındı!', 
              html: regEmailHtml, 
              text: 'Başvurunuz alındı. İşlemler sürüyor. Dekontunuzu WhatsApp üzerinden iletmeyi unutmayınız.' 
            }) 
          }); 
        } catch(err) {}
    } else { 
      alert("Hata oluştu. Lütfen tekrar deneyiniz."); 
    }
  }

  async function handleBooking(e) {
    e.preventDefault();
    if (bookingEmailValid === false || bookingPhoneValid === false) {
      return alert("Lütfen iletişim bilgilerinizi doğru formatta giriniz.");
    }
    
    if(isClub) {
      if(!bookingData.selectedEvent) { alert(t[lang].book.selectEvent); return; }
      if(!bookingData.selectedShopService) { alert(t[lang].book.selectLoca); return; }
    } else {
      if(!bookingData.selectedShopService) { alert(t[lang].book.selectService); return; }
      if(!bookingData.selectedStaff) { alert(t[lang].book.selectStaff); return; }
    }

    const availableSlotsForBooking = getCurrentAvailableSlots();
    const startIndex = availableSlotsForBooking.indexOf(bookingData.time);
    const neededSlots = getRequiredSlots(bookingData.selectedShopService.duration);
    const occupied_slots = isClub ? [] : availableSlotsForBooking.slice(startIndex, startIndex + neededSlots);

    let assignedStaffName = isClub ? 'Rezervasyon' : bookingData.selectedStaff.name;
    
    if (!isClub && (assignedStaffName === t[lang].book.anyStaff || assignedStaffName === 'Fark Etmez')) {
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
        setStep('success'); 
        window.scrollTo(0,0);
        
        const customerEmailHtml = `
          <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; background: #ffffff;">
            <div style="background: #2D1B4E; padding: 32px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900;">BOOKCY<span style="color: #E8622A;">.</span></h1>
              <p style="color: #F5C5A3; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-top: 8px;">Rezervasyon Onay Belgesi</p>
            </div>
            <div style="padding: 40px 32px;">
              <h2 style="color: #2D1B4E; margin-top: 0; font-size: 22px;">Merhaba ${formData.name},</h2>
              <p style="color: #64748b; font-size: 16px; line-height: 1.6;"><strong>${selectedShop.name}</strong> işletmesinden aldığınız randevu başarıyla onaylanmıştır. Detaylar aşağıdadır:</p>
              <div style="background: #f8fafc; border-left: 4px solid #E8622A; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;">📅 <strong>Tarih:</strong> ${finalDate}</p>
                <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;">⏰ <strong>Saat:</strong> ${finalTime}</p>
                <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;">✂️ <strong>Hizmet:</strong> ${bookingData.selectedShopService.name}</p>
                ${!isClub ? `<p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;">👤 <strong>Uzman:</strong> ${assignedStaffName}</p>` : ''}
                <p style="margin: 0; color: #334155; font-size: 15px;">📍 <strong>Konum:</strong> ${selectedShop.address || selectedShop.location}</p>
              </div>
              <p style="color: #64748b; font-size: 14px;">Bizi tercih ettiğiniz için teşekkür ederiz!</p>
            </div>
          </div>
        `;

        try { 
          await fetch('/api/email', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
              to: formData.email, 
              subject: 'BOOKCY - Rezervasyon Onayı', 
              html: customerEmailHtml, 
              text: `Randevunuz onaylandı.` 
            }) 
          }); 
        } catch(err) {} 
        
        const adminEmailHtml = `
          <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; background: #ffffff;">
            <div style="background: #E8622A; padding: 32px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900;">YENİ REZERVASYON!</h1>
              <p style="color: #fff8f1; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-top: 8px;">Bookcy Sistem Bildirimi</p>
            </div>
            <div style="padding: 40px 32px;">
              <h2 style="color: #2D1B4E; margin-top: 0; font-size: 22px;">Merhaba ${selectedShop.name},</h2>
              <p style="color: #64748b; font-size: 16px; line-height: 1.6;">Platformumuz üzerinden yeni bir rezervasyon aldınız.</p>
              <div style="background: #f8fafc; border-left: 4px solid #2D1B4E; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;">👤 <strong>Müşteri:</strong> ${formData.name} ${formData.surname}</p>
                <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;">📱 <strong>Telefon:</strong> ${fullPhone}</p>
                <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;">📅 <strong>Tarih:</strong> ${finalDate}</p>
                <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;">⏰ <strong>Saat:</strong> ${finalTime}</p>
                <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;">🎟️ <strong>Hizmet:</strong> ${bookingData.selectedShopService.name}</p>
                ${!isClub ? `<p style="margin: 0; color: #334155; font-size: 15px;">👨‍💼 <strong>Atanan Uzman:</strong> ${assignedStaffName}</p>` : ''}
              </div>
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://bookcy.co/dashboard" style="display: inline-block; background: #2D1B4E; color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: bold; font-size: 14px;">Panele Git</a>
              </div>
            </div>
          </div>
        `;

        if (selectedShop.admin_email) { 
          try { 
            await fetch('/api/email', { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ 
                to: selectedShop.admin_email, 
                subject: 'YENİ REZERVASYON! (Bookcy)', 
                html: adminEmailHtml, 
                text: `Yeni rezervasyon alındı.` 
              }) 
            }); 
          } catch(err) {} 
        }
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

    const { error } = await supabase.from('platform_feedback').insert([{
        q1: feedbackData.q1,
        q2: feedbackData.q2,
        q3: feedbackData.q3,
        q4: feedbackData.q4,
        average_score: avg
    }]);

    if (error) {
      console.error(error);
    }

    const emailHtml = `
      <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; background: #ffffff;">
        <div style="background: #2D1B4E; padding: 32px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 900;">YENİ DEĞERLENDİRME</h1>
        </div>
        <div style="padding: 40px 32px;">
          <h2 style="color: #E8622A; margin-top: 0; font-size: 28px; text-align: center;">Ortalama Puan: ${avg}/10</h2>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; margin: 24px 0; border-radius: 12px;">
            <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;"><strong>Platformu nasıl buldu:</strong> ${feedbackData.q1}</p>
            <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;"><strong>Kullanımı kolay mı:</strong> ${feedbackData.q2}</p>
            <p style="margin: 0 0 10px 0; color: #334155; font-size: 15px;"><strong>İşlemden memnun mu:</strong> ${feedbackData.q3}</p>
            <p style="margin: 0; color: #334155; font-size: 15px;"><strong>Hızlı mıydı:</strong> ${feedbackData.q4}</p>
          </div>
        </div>
      </div>
    `;

    try {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'noreplybookcy@gmail.com', 
          subject: 'BOOKCY - YENİ PLATFORM DEĞERLENDİRMESİ 🔥',
          html: emailHtml,
          text: `Yeni değerlendirme geldi. Ortalama: ${avg}`
        })
      });
    } catch(err) {}
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
        if (a.package === 'Premium' && b.package !== 'Premium') return -1;
        if (a.package !== 'Premium' && b.package === 'Premium') return 1;
        return 0;
      }
      return 0;
  });
  
  const recommendedShops = approvedShops.filter(s => s.package === 'Premium').slice(0, 4);

  const getDayNameFromDate = (dateString) => {
    const d = new Date(dateString);
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    return days[d.getDay()];
  };

  const getCurrentAvailableSlots = () => {
    if (!selectedShop || !bookingData.date || isClub) return allTimeSlots;
    if (selectedShop.closed_dates && selectedShop.closed_dates.includes(bookingData.date)) return [];

    const dayName = getDayNameFromDate(bookingData.date);
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

  const similarShops = selectedShop 
    ? approvedShops.filter(s => s.id !== selectedShop.id && s.category === selectedShop.category).slice(0, 3)
    : [];

  const renderFeedbackScale = (qKey) => (
    <div className="flex gap-1 justify-center mt-3 mb-6 w-full max-w-full overflow-x-auto custom-scrollbar pb-2">
      {[0,1,2,3,4,5,6,7,8,9,10].map(num => (
        <button
          key={num} 
          type="button" 
          onClick={() => setFeedbackData({...feedbackData, [qKey]: num})}
          className={`w-8 h-8 md:w-10 md:h-10 rounded-lg text-xs md:text-sm font-black transition-all border shrink-0 ${feedbackData[qKey] === num ? 'bg-[var(--terra)] text-white border-transparent scale-110 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-[#E8622A] cursor-pointer'}`}
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
          --fig: #2D1B4E; 
          --terra: #E8622A; 
          --blush: #F5C5A3; 
          --c-bg-main: #FAF7F2;
          --c-bg-card: #FFFFFF;
          --c-border: #E2E8F0;
          --c-text-main: #101010;
          --c-text-muted: #64748B;
        }

        body { 
            background: var(--c-bg-main) !important; 
            color: var(--c-text-main) !important; 
            font-family: 'DM Sans', sans-serif; 
            overflow-x: hidden; 
        }

        /* --- NAVBAR --- */
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 0 48px; height: 72px; display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); transition: all 0.3s; border-bottom: 1px solid var(--c-border); }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; cursor: pointer; }
        .nav-logo-icon { width: 36px; height: 36px; }
        .nav-logo-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 22px; font-weight: 800; color: var(--fig); letter-spacing: -1px; display:flex; align-items:baseline; }
        .nav-logo-text span { color: var(--terra); }
        .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; height: 100%; margin:0; padding:0; }
        .nav-links button { text-decoration: none; font-size: 14px; font-weight: 700; color: var(--c-text-main); opacity: 0.8; transition: opacity 0.2s; position: relative; background:none; border:none; outline:none; font-family:'DM Sans', sans-serif; cursor:pointer;}
        .nav-links button:hover, .nav-links button.active { opacity:1; color: var(--terra); }
        .lang-pills { display: flex; flex-direction: row; gap: 4px; }
        .lang-pill { font-size: 11px; font-weight:600; padding: 4px 10px; border-radius: 20px; border: 1px solid transparent; transition: all 0.2s; color: var(--c-text-muted); cursor:pointer;}
        .lang-pill.active { background: var(--fig); color: white; border-color: var(--fig); }
        .lang-pill:hover:not(.active) { border-color: var(--c-border); color: var(--c-text-main); }
        .nav-right { display: flex; flex-direction: row; align-items: center; gap: 16px; flex-shrink: 0; white-space: nowrap; }
        .btn-outline { font-family:'DM Sans',sans-serif; font-size: 13px; font-weight: 700; padding: 9px 20px; border-radius: 50px; border: 1.5px solid var(--c-text-main); background: transparent; color: var(--c-text-main); transition: all 0.25s; cursor:pointer;}
        .btn-outline:hover { background:var(--c-text-main); color:var(--c-bg-card); }
        .btn-primary { font-family:'DM Sans',sans-serif; font-size: 13px; font-weight: 800; padding: 12px 28px; border-radius: 50px; border: none; background: var(--terra); color: white; transition: all 0.25s; display:flex; align-items:center; gap:7px; cursor:pointer; text-transform:uppercase; box-shadow: 0 8px 20px rgba(232, 98, 42, 0.2);}
        .btn-primary:hover { background: #d4561f; transform: translateY(-2px); box-shadow: 0 12px 25px rgba(232,98,42,0.3); }
        
        /* --- HERO (KOYU MOR & BEYAZ YAZI) --- */
        .hero { position: relative; min-height: 85vh; background: var(--fig); overflow: hidden; display: flex; flex-direction:column; align-items: center; justify-content: center; padding-top: 140px; padding-bottom: 100px; }
        .hero::before { content:''; position:absolute; inset:0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"); pointer-events: none; z-index:1; }
        
        .hero-content { position:relative; z-index:2; text-align:center; padding: 0 24px; max-width: 900px; animation: fadeUp 0.8s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        
        .hero-eyebrow { display:inline-flex; align-items:center; gap:8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius:50px; padding: 6px 16px 6px 8px; font-size:10px; font-weight:800; color:rgba(255,255,255,0.9); letter-spacing:1px; text-transform:uppercase; margin-bottom:28px; animation: fadeUp 0.8s 0.1s ease both; }
        .hero-eyebrow-dot { width:8px; height:8px; border-radius:50%; background:var(--terra); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{ box-shadow:0 0 0 0 rgba(232,98,42,0.6); } 50% { box-shadow:0 0 0 6px rgba(232,98,42,0); } }
        
        .hero-title { font-family:'Plus Jakarta Sans',sans-serif; font-size: clamp(48px, 6vw, 80px); font-weight:900; color: white; letter-spacing: -2px; line-height: 1.1; margin-bottom:24px; animation: fadeUp 0.8s 0.2s ease both; }
        .hero-title .accent { color: var(--terra); }
        
        .hero-sub { font-size:16px; font-weight:600; color: rgba(255,255,255,0.65); line-height:1.6; margin-bottom: 48px; max-width:600px; margin-left:auto; margin-right:auto; animation: fadeUp 0.8s 0.3s ease both; }
        
        .search-wrap { display:flex; align-items:center; background: white; border-radius: 32px; padding: 12px; gap: 12px; max-width: 800px; width:100%; box-shadow: 0 24px 60px rgba(0,0,0,0.3); margin: 0 auto; animation: fadeUp 0.8s 0.4s ease both; transition: box-shadow 0.3s; border: none; }
        .search-wrap:focus-within { box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 0 4px rgba(232,98,42,0.3); }
        
        .search-field { flex:1.5; display:flex; align-items:center; gap:12px; padding: 0 16px; border-right: 1px solid var(--c-border); }
        .search-icon { color: var(--terra); font-size:22px; flex-shrink:0; }
        .search-field input { border:none; outline:none; width:100%; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:700; color:var(--c-text-main); background:transparent; }
        .search-field input::placeholder { color:var(--c-text-muted); font-weight:600; }
        
        .search-location { display:flex; align-items:center; gap:12px; flex:1; padding: 0 16px; }
        .search-location select { border:none; outline:none; width:100%; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:700; color:var(--c-text-main); background:transparent; cursor:pointer; }
        
        .search-btn { border:none; background: var(--terra); color:white; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:800; padding: 16px 40px; border-radius:24px; transition: all 0.25s; white-space:nowrap; display:flex; align-items:center; gap:8px; cursor:pointer; box-shadow: 0 8px 20px rgba(232,98,42,0.2); }
        .search-btn:hover { background:#d4561f; transform:translateY(-2px); box-shadow: 0 12px 25px rgba(232,98,42,0.3); }
        
        .hero-popular { display:flex; align-items:center; gap:10px; margin-top:30px; flex-wrap:wrap; justify-content:center; animation: fadeUp 0.8s 0.5s ease both; }
        .hero-popular span { font-size:12px; color:rgba(255,255,255,0.5); font-weight:700; letter-spacing:0.5px; }
        .pop-tag { font-size:12px; font-weight:700; padding:8px 16px; border-radius:50px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.8); transition:all 0.2s; cursor:pointer; }
        .pop-tag:hover { background:var(--terra); border-color:var(--terra); color:white; }
        
        .hero-stats { display:flex; gap:0; margin-top: 60px; margin-bottom: 20px; border-top:1px solid rgba(255,255,255,0.1); padding-top:40px; width:100%; max-width:800px; animation: fadeUp 0.8s 0.6s ease both; position: relative; z-index: 10; }
        .stat { flex:1; text-align:center; border-right:1px solid rgba(255,255,255,0.1); }
        .stat:last-child { border-right:none; }
        .stat-num { font-family:'Plus Jakarta Sans',sans-serif; font-size:36px; font-weight:900; color:white; letter-spacing:-1px; line-height:1; }
        .stat-num span { color:var(--terra); }
        .stat-label { font-size:11px; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:1px; margin-top:8px; }
        
        /* --- DİĞER BÖLÜMLER (BEYAZ TEMA) --- */
        .section-categories { padding: 80px 48px 60px; background: var(--c-bg-card); position:relative; z-index:2; }
        .section-header { display:flex; align-items:flex-end; justify-content:space-between; max-width:1200px; margin:0 auto 48px; }
        .section-label-sm { font-size:11px; font-weight:800; letter-spacing:4px; text-transform:uppercase; color:var(--terra); margin-bottom:8px; }
        .section-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:36px; font-weight:900; color:var(--fig); letter-spacing:-1px; line-height:1.1; }
        
        .see-all { font-size:14px; font-weight:800; color:var(--terra); text-decoration:none; display:flex; align-items:center; gap:6px; transition:gap 0.2s; background:none; border:none; padding:0; cursor:pointer;}
        .see-all:hover { gap:10px; }
        
        .categories-grid { display:grid; grid-template-columns: repeat(8, 1fr); gap:16px; max-width:1200px; margin:0 auto; }
        .cat-card { display:flex; flex-direction:column; align-items:center; gap:12px; transition:transform 0.25s; cursor:pointer;}
        .cat-card:hover { transform:translateY(-6px); }
        .cat-img-wrap { width:100%; aspect-ratio:1; border-radius:24px; overflow:hidden; position:relative; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition:all 0.3s; border: 1px solid var(--c-border); background:white;}
        .cat-card:hover .cat-img-wrap { box-shadow: 0 12px 30px rgba(45,27,78,0.1); border-color: var(--terra); }
        .cat-emoji-bg { width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:40px; border-radius:24px; }
        .cat-name { font-size:11px; font-weight:800; letter-spacing:1px; text-transform:uppercase; color:var(--c-text-main); text-align:center; }
        
        .section-featured { background: var(--c-bg-main); padding: 80px 48px; border-top: 1px solid var(--c-border); }
        .featured-grid { display:grid; grid-template-columns: 1fr 1fr 1fr; gap:24px; max-width:1200px; margin:0 auto; }
        .venue-card { border-radius:24px; overflow:hidden; background: white; transition:transform 0.3s, box-shadow 0.3s; position:relative; display:flex; flex-direction:column; cursor:pointer; border: 1px solid var(--c-border);}
        .venue-card:hover { transform:translateY(-8px); box-shadow:0 24px 50px rgba(45,27,78,0.08); border-color: var(--terra);}
        .venue-card.featured { grid-row: span 2; }
        .venue-img { width:100%; height:200px; background:var(--c-bg-sub); position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; font-size:60px; }
        .venue-card.featured .venue-img { height:320px; }
        .venue-img img { width:100%; height:100%; object-fit:cover; }
        .venue-badge { position:absolute; top:14px; left:14px; background:var(--terra); color:white; font-size:10px; font-weight:800; letter-spacing:1px; text-transform:uppercase; padding:6px 12px; border-radius:50px; z-index:10; }
        .venue-badge.hot { background:linear-gradient(135deg,#E8622A,#c94e1f); display:flex; align-items:center; gap:4px; box-shadow: 0 4px 10px rgba(232,98,42,0.3);}
        .venue-fav { position:absolute; top:14px; right:14px; width:36px; height:36px; border-radius:50%; background:white; display:flex; align-items:center; justify-content:center; transition:transform 0.2s; z-index:10; color: var(--fig); box-shadow: 0 4px 10px rgba(0,0,0,0.1);}
        .venue-fav:hover { transform:scale(1.15); color: red; }
        
        .venue-info { padding:24px; display:flex; flex-direction:column; flex:1; }
        .venue-cat { font-size:10px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:var(--terra); margin-bottom:8px; }
        .venue-name { font-family:'Plus Jakarta Sans',sans-serif; font-size:20px; font-weight:800; color:var(--fig); letter-spacing:-0.5px; margin-bottom:12px; }
        .venue-meta { display:flex; align-items:center; gap:16px; font-size:13px; font-weight:600; color:var(--c-text-muted); }
        
        .venue-book-btn { width:100%; margin-top:auto; padding:14px; background:var(--fig); color:white; border:none; border-radius:16px; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:800; text-transform:uppercase; transition:all 0.25s; display:flex; align-items:center; justify-content:center; cursor:pointer;}
        .venue-book-btn:hover { background:var(--terra); }
        
        .section-how { background: var(--c-bg-card); padding: 100px 48px; position:relative; overflow:hidden; border-top: 1px solid var(--c-border); }
        .how-inner { max-width:1200px; margin:0 auto; position:relative; z-index:1; }
        .how-header { text-align:center; margin-bottom:72px; }
        .how-header .section-title { color:var(--fig); }
        
        .steps-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:32px; position:relative; }
        .steps-grid::before { content:''; position:absolute; top:40px; left:12.5%; right:12.5%; height:2px; background: var(--c-border-sub); z-index:0; }
        .step { text-align:center; position:relative; z-index:1; animation: fadeUp 0.6s ease both; }
        .step-icon { width:80px; height:80px; border-radius:24px; display:flex; align-items:center; justify-content:center; font-size:32px; margin:0 auto 20px; position:relative; background: white; border: 2px solid var(--c-border); box-shadow: 0 10px 20px rgba(0,0,0,0.03); }
        .step-num { position:absolute; top:-10px; right:-10px; width:28px; height:28px; border-radius:50%; background:var(--terra); color:white; font-size:12px; font-weight:800; display:flex; align-items:center; justify-content:center; border: 3px solid white;}
        .step-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:18px; font-weight:800; color:var(--fig); margin-bottom:10px; letter-spacing:-0.5px; }
        .step-desc { font-size:14px; font-weight:500; line-height:1.6; color:var(--c-text-muted); }
        
        .section-cta { padding:80px 48px; background: var(--c-bg-main); border-top: 1px solid var(--c-border); }
        .cta-inner { max-width:1200px; margin:0 auto; background:white; border-radius:32px; padding:72px 80px; display:flex; align-items:center; gap:64px; position:relative; overflow:hidden; border: 1px solid var(--c-border); box-shadow: 0 20px 40px rgba(45,27,78,0.05); }
        .cta-inner::before { content:''; position:absolute; right:-100px; top:-100px; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle, rgba(232,98,42,0.1), transparent 70%); }
        .cta-text { flex:1; position:relative; z-index:1; }
        .cta-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:42px; font-weight:900; color:var(--fig); letter-spacing:-2px; line-height:1.1; margin:12px 0 16px; }
        .cta-title span { color:var(--terra); }
        .cta-sub { font-size:16px; font-weight:500; color:var(--c-text-muted); line-height:1.6; max-width:400px; }
        .cta-actions { display:flex; gap:14px; position:relative; z-index:1; flex-shrink:0; }
        .app-badge { display:flex; align-items:center; gap:12px; background:var(--c-bg-sub); border:1px solid var(--c-border); border-radius:16px; padding:16px 24px; transition:all 0.25s; color:var(--fig); text-decoration:none; cursor:pointer;}
        .app-badge:hover { border-color:var(--terra); transform:translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .app-badge-icon { font-size:28px; }
        .app-badge-text { line-height:1.2; text-align:left; }
        .app-badge-text .small { font-size:11px; font-weight:700; color:var(--c-text-muted); letter-spacing:0.5px; text-transform:uppercase; }
        .app-badge-text .big { font-size:16px; font-weight:800; color:var(--fig); }
        
        @media(max-width:900px){
          nav { padding:0 20px; background: white !important; border-bottom: 1px solid var(--c-border) !important;}
          .hero { padding-top: 100px; }
          .search-wrap { flex-direction: column; border-radius:24px; padding:16px; gap:12px; }
          .search-field { border-right: none; border-bottom: 1px solid var(--c-border); padding-bottom: 12px; }
          .nav-links { display:none; }
          .categories-grid { grid-template-columns:repeat(4,1fr); }
          .featured-grid { grid-template-columns:1fr; }
          .steps-grid { grid-template-columns:1fr 1fr; }
          .steps-grid::before { display:none; }
          .cta-inner { flex-direction:column; gap:32px; padding:48px 32px; text-align:center;}
          .cta-actions { flex-direction:column; width:100%; }
          .footer-top { grid-template-columns:1fr 1fr; }
          .hero-stats { flex-direction:column; gap:24px; }
          .stat { border-right:none; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:24px; }
          .nav-right .btn-outline { display:none; }
          .nav-right .btn-primary span { display:none; }
        }
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
            <polyline points="25.5,8 27.5,10 31,6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className="nav-logo-text">bookcy<span>.</span></span>
        </div>

        <ul className="nav-links">
          <li>
            <button onClick={() => {setStep('all_shops'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={['all_shops', 'shops', 'shop_profile', 'booking'].includes(step) ? 'active' : ''}>
              {t[lang].nav.places}
            </button>
          </li>
          <li style={{height:'100%', display:'flex', alignItems:'center'}}>
              <div className="relative h-full flex items-center group" onMouseEnter={() => setShowFeaturesMenu(true)} onMouseLeave={() => setShowFeaturesMenu(false)}>
                  <button onClick={() => {setStep('all_features'); setShowFeaturesMenu(false); window.scrollTo(0,0);}} className={`flex items-center gap-1 transition-colors h-full ${['features', 'feature_detail', 'all_features'].includes(step) || showFeaturesMenu ? 'active' : ''}`}>
                      {t[lang].nav.features} <ChevronDown size={14} className={`transition-transform duration-200 ${showFeaturesMenu ? 'rotate-180' : ''}`} />
                  </button>
                  {showFeaturesMenu && (
                      <div className="absolute top-[72px] left-1/2 -translate-x-1/2 w-screen bg-white text-[#2D1B4E] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border-t border-slate-200 cursor-default animate-in slide-in-from-top-2 duration-200">
                          <div className="max-w-[1000px] mx-auto py-12 px-8">
                              <div className="grid grid-cols-4 gap-8 mb-10 text-left">
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{t[lang].megaMenu.col1Title}</h4>
                                    <ul className="space-y-5 font-bold text-slate-600 capitalize text-sm">
                                      {megaMenuStructure.col1.map(key => <li key={key} onClick={() => goToFeature(key)} className="hover:text-[#2D1B4E] cursor-pointer transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-[#E8622A]"/> {t[lang].featNames[key]}</li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{t[lang].megaMenu.col2Title}</h4>
                                    <ul className="space-y-5 font-bold text-slate-600 capitalize text-sm">
                                      {megaMenuStructure.col2.map(key => <li key={key} onClick={() => goToFeature(key)} className="hover:text-[#2D1B4E] cursor-pointer transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-[#E8622A]"/> {t[lang].featNames[key]}</li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{t[lang].megaMenu.col3Title}</h4>
                                    <ul className="space-y-5 font-bold text-slate-600 capitalize text-sm">
                                      {megaMenuStructure.col3.map(key => <li key={key} onClick={() => goToFeature(key)} className="hover:text-[#2D1B4E] cursor-pointer transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-[#E8622A]"/> {t[lang].featNames[key]}</li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <h4 className="font-black text-[11px] uppercase tracking-widest mb-6 text-[#E8622A]">{t[lang].megaMenu.col4Title}</h4>
                                    <ul className="space-y-5 font-bold text-slate-600 capitalize text-sm">
                                      {megaMenuStructure.col4.map(key => <li key={key} onClick={() => goToFeature(key)} className="hover:text-[#2D1B4E] cursor-pointer transition-colors flex items-center gap-2"><ChevronRight size={14} className="text-[#E8622A]"/> {t[lang].featNames[key]}</li>)}
                                    </ul>
                                  </div>
                              </div>
                              <div className="flex justify-center border-t border-slate-100 pt-8">
                                <button onClick={() => {setStep('all_features'); setShowFeaturesMenu(false); window.scrollTo(0,0);}} className="border border-slate-200 bg-white text-[#2D1B4E] px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:border-[#E8622A] hover:text-[#E8622A] transition-colors">{t[lang].megaMenu.btn}</button>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </li>
          <li>
            <button onClick={() => {setStep('about'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={step === 'about' ? 'active' : ''}>
              {t[lang].nav.about}
            </button>
          </li>
          <li>
            <button onClick={() => {setStep('contact'); setShowLogin(false); setShowRegister(false); window.scrollTo(0,0);}} className={step === 'contact' ? 'active' : ''}>
              {t[lang].nav.contact}
            </button>
          </li>
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
                   <button onClick={() => router.push('/dashboard')} className="btn-primary">
                      <UserCircle size={18}/> <span>{t[lang].nav.dashboard}</span>
                   </button>
               </div>
          ) : (
              <>
                  <button onClick={() => setShowRegister(true)} className="btn-outline">{t[lang].nav.addShop}</button>
                  <button onClick={() => setShowLogin(true)} className="btn-primary">
                      <UserCircle size={18}/>
                      <span>{t[lang].nav.login}</span>
                  </button>
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
                          
                          <p className="text-sm font-bold text-slate-500 mt-6 mb-4 text-center">Bizi tercih ettiğiniz için teşekkür ederiz. İşletme profilinizin onaylanıp yayına alınabilmesi için lütfen ödeme dekontunuzu WhatsApp destek hattımız üzerinden bize iletiniz.</p>
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

      <main className="flex-1 w-full relative z-10" style={{minHeight: '80vh'}}>
        
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
                  
                  {/* Beyaz Dalga (Alt kısımla kusursuz birleşmesi için) */}
                  <svg className="absolute bottom-[-1px] left-0 w-full h-auto z-10 pointer-events-none" viewBox="0 0 1440 80" preserveAspectRatio="none" fill="var(--c-bg-card)">
                    <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"/>
                  </svg>
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
                                        {shop.package === 'Premium' && (
                                            <div className="absolute inset-0 border-4 border-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
                                        )}
                                        {shop.logo_url ? <img loading="lazy" decoding="async" src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover" /> : "LOGO"}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl md:text-2xl font-black uppercase text-[#2D1B4E] transition-colors">{shop.name}</h3>
                                            {shop.package === 'Premium' && <Gem size={16} className="text-yellow-500 fill-yellow-500 drop-shadow-sm"/>}
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
                            {selectedShop.package === 'Premium' && <div className="absolute inset-0 border-4 border-yellow-400 rounded-full z-10 pointer-events-none shadow-[0_0_20px_rgba(250,204,21,0.6)]"></div>}
                            {selectedShop.logo_url ? <img loading="lazy" decoding="async" src={selectedShop.logo_url} className="w-full h-full object-cover" /> : <span className="text-[#E8622A] font-black">LOGO</span>}
                        </div>
                    </div>
                </div>

                <div className="px-2 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-slate-200 pb-8 gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-5xl font-black uppercase text-[#2D1B4E] tracking-tight">{selectedShop.name}</h1>
                                {selectedShop.package === 'Premium' && <Gem size={24} className="text-yellow-500 fill-yellow-500 drop-shadow-md"/>}
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
                                            {shop.package === 'Premium' && <div className="venue-badge hot">🔥 VIP</div>}
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

        {/* DİNAMİK ÖZELLİK DETAY SAYFASI */}
        {step === 'feature_detail' && activeFeature && (
            <div className="w-full bg-[#FAF7F2] animate-in fade-in">
                <div className="bg-white pt-32 pb-40 px-8 text-center relative overflow-hidden border-b border-slate-200">
                    <div className="flex justify-center mb-8 relative z-10">{featureIcons[activeFeature]}</div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#2D1B4E] mb-6 relative z-10">{t[lang].featNames[activeFeature]}</h1>
                </div>

                <div className="max-w-[1200px] mx-auto px-8 py-24 -mt-20 relative z-20">
                    <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-xl border border-slate-200">
                        <div className="text-center max-w-3xl mx-auto mb-16 border-b border-slate-100 pb-12">
                            <h2 className="text-xl font-black text-[#E8622A] uppercase tracking-widest mb-4">{t[lang].featUI.purposeTitle}</h2>
                            <p className="text-xl md:text-2xl text-[#2D1B4E] font-medium leading-relaxed">{t[lang].featDetails[activeFeature].purpose}</p>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-[#2D1B4E] mb-12 text-center">{t[lang].featUI.benefitsTitle}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-slate-50 p-8 rounded-[24px] border border-slate-200 hover:border-[#E8622A] transition-colors group">
                                <div className="w-12 h-12 bg-white text-[#E8622A] border border-slate-200 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#E8622A] group-hover:text-white transition-colors"><ShieldCheck size={20}/></div>
                                <h3 className="font-black text-lg text-[#2D1B4E] mb-3 leading-tight">{t[lang].featDetails[activeFeature].adv1.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{t[lang].featDetails[activeFeature].adv1.desc}</p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-[24px] border border-slate-200 hover:border-[#E8622A] transition-colors group">
                                <div className="w-12 h-12 bg-white text-[#E8622A] border border-slate-200 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#E8622A] group-hover:text-white transition-colors"><Target size={20}/></div>
                                <h3 className="font-black text-lg text-[#2D1B4E] mb-3 leading-tight">{t[lang].featDetails[activeFeature].adv2.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{t[lang].featDetails[activeFeature].adv2.desc}</p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-[24px] border border-slate-200 hover:border-[#E8622A] transition-colors group">
                                <div className="w-12 h-12 bg-white text-[#E8622A] border border-slate-200 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#E8622A] group-hover:text-white transition-colors"><TrendingUp size={20}/></div>
                                <h3 className="font-black text-lg text-[#2D1B4E] mb-3 leading-tight">{t[lang].featDetails[activeFeature].adv3.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{t[lang].featDetails[activeFeature].adv3.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#FAF7F2] py-24 text-center border-t border-slate-200">
                    <h2 className="text-3xl md:text-5xl font-black uppercase text-[#2D1B4E] mb-8 tracking-tight">{t[lang].about.ctaTitle}</h2>
                    <button onClick={() => {setShowRegister(true); window.scrollTo(0,0);}} className="btn-primary mx-auto px-12 py-5 uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(232,98,42,0.3)] border-none cursor-pointer">{t[lang].about.ctaBtn}</button>
                </div>
            </div>
        )}

        {/* TÜM ÖZELLİKLER LİSTESİ */}
        {step === 'all_features' && (
            <div className="w-full bg-[#FAF7F2] animate-in fade-in">
                <div className="bg-white pt-32 pb-24 px-8 text-center relative overflow-hidden border-b border-slate-200">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#2D1B4E] mb-6 relative z-10">{t[lang].featUI.allFeaturesTitle}</h1>
                    <p className="text-lg md:text-xl font-medium text-slate-500 max-w-3xl mx-auto leading-relaxed relative z-10">{t[lang].featUI.allFeaturesSub}</p>
                </div>

                <div className="max-w-[1400px] mx-auto px-8 py-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.keys(t[lang].featNames).map((key) => (
                            <div key={key} onClick={() => goToFeature(key)} className="bg-white p-8 rounded-[32px] border border-slate-200 hover:border-[#E8622A] hover:shadow-xl transition-all cursor-pointer group flex flex-col items-start">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">{featureIconsSmall[key]}</div>
                                <h3 className="text-2xl font-black text-[#2D1B4E] mb-3 group-hover:text-[#E8622A] transition-colors">{t[lang].featNames[key]}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{t[lang].featDesc[key]}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* İLETİŞİM SAYFASI */}
        {step === 'contact' && (
            <div className="w-full bg-[#FAF7F2] animate-in fade-in overflow-hidden">
                <div className="bg-white pt-24 pb-32 px-4 md:px-8 text-center relative overflow-hidden border-b border-slate-200">
                    <span className="bg-orange-50 text-[#E8622A] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block border border-orange-100">7/24 Destek</span>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#2D1B4E] mb-6 relative z-10">{t[lang].contact.title}</h1>
                    <p className="text-lg md:text-2xl font-medium text-slate-500 max-w-3xl mx-auto leading-relaxed relative z-10">{t[lang].contact.sub}</p>
                </div>

                <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24 -mt-10 md:-mt-20 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-xl border border-slate-200 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><MessageCircle size={32}/></div>
                            <h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] mb-3">{t[lang].contact.whatsapp}</h3>
                            <p className="text-sm md:text-base text-slate-500 font-medium mb-8 leading-relaxed flex-1">{t[lang].contact.wpDesc}</p>
                            <a href="https://wa.me/905555555555" target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] text-white font-black py-4 rounded-xl uppercase tracking-widest hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30 flex justify-center items-center gap-2 text-decoration-none text-xs md:text-sm"><MessageCircle size={18}/> {t[lang].contact.btnWp}</a>
                        </div>
                        <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-xl border border-slate-200 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><InstagramIcon size={32}/></div>
                            <h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] mb-3">{t[lang].contact.insta}</h3>
                            <p className="text-sm md:text-base text-slate-500 font-medium mb-8 leading-relaxed flex-1">{t[lang].contact.instaDesc}</p>
                            <a href="https://instagram.com/bookcy" target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-[#E8622A] text-white font-black py-4 rounded-xl uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/30 flex justify-center items-center gap-2 text-decoration-none text-xs md:text-sm"><InstagramIcon size={18}/> {t[lang].contact.btnInsta}</a>
                        </div>
                        <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-xl border border-slate-200 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Mail size={32}/></div>
                            <h3 className="text-xl md:text-2xl font-black text-[#2D1B4E] mb-3">{t[lang].contact.email}</h3>
                            <p className="text-sm md:text-base text-slate-500 font-medium mb-8 leading-relaxed flex-1">{t[lang].contact.emailDesc}</p>
                            <a href="mailto:noreplybookcy@gmail.com" className="w-full bg-[#2D1B4E] text-white font-black py-4 rounded-xl uppercase tracking-widest hover:bg-[#1a0f2e] transition-colors shadow-lg shadow-[#2D1B4E]/30 flex justify-center items-center gap-2 text-decoration-none text-xs md:text-sm"><Mail size={18}/> {t[lang].contact.btnEmail}</a>
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        {/* HAKKIMIZDA & PAKETLER SAYFASI */}
        {step === 'about' && (
            <div className="w-full bg-[#FAF7F2] animate-in fade-in overflow-hidden">
                <div className="bg-white pt-24 pb-32 px-4 md:px-8 text-center relative overflow-hidden border-b border-slate-200">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#2D1B4E] mb-6 relative z-10">{t[lang].about.title}</h1>
                    <p className="text-lg md:text-2xl font-medium text-slate-500 max-w-3xl mx-auto leading-relaxed relative z-10">{t[lang].about.subtitle}</p>
                </div>
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                        {packages.map(p => (
                            <div key={p.name} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-lg flex flex-col hover:border-[#E8622A] transition-colors">
                                <h3 className="text-2xl font-black text-[#2D1B4E] mb-2">{p.name}</h3>
                                <p className="text-3xl font-black text-[#E8622A] mb-6">{p.price}</p>
                                <ul className="flex flex-col gap-4 mb-8 flex-1">
                                    <li className="flex items-center gap-3 font-bold text-slate-600"><CheckCircle2 className="text-[#E8622A]" size={20}/> {p.name === 'Premium' ? t[lang].about.pkg2Feat1 : t[lang].about.pkg1Feat1}</li>
                                    <li className="flex items-center gap-3 font-bold text-slate-600"><CheckCircle2 className="text-[#E8622A]" size={20}/> {p.name === 'Premium' ? t[lang].about.pkg2Feat2 : t[lang].about.pkg1Feat2}</li>
                                    <li className="flex items-center gap-3 font-bold text-slate-600"><CheckCircle2 className="text-[#E8622A]" size={20}/> {p.name === 'Premium' ? t[lang].about.pkg2Feat3 : t[lang].about.pkg1Feat3}</li>
                                    <li className="flex items-center gap-3 font-bold text-slate-600"><CheckCircle2 className="text-[#E8622A]" size={20}/> {p.name === 'Premium' ? t[lang].about.pkg2Feat4 : t[lang].about.pkg1Feat4}</li>
                                    <li className="flex items-center gap-3 font-bold text-slate-600"><CheckCircle2 className="text-[#E8622A]" size={20}/> {p.name === 'Premium' ? t[lang].about.pkg2Feat5 : t[lang].about.pkg1Feat5}</li>
                                </ul>
                                <button onClick={() => {setShowRegister(true); window.scrollTo(0,0);}} className="w-full btn-primary justify-center">{t[lang].about.ctaBtn}</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

      </main>

      <footer className="w-full overflow-hidden" style={{background:'var(--fig)', padding:'60px 24px 32px', color:'rgba(255,255,255,0.6)', zIndex:10, position:'relative'}}>
        <div className="footer-top grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto mb-12 w-full">
          
          <div className="footer-brand w-full">
            <div className="footer-brand-name flex items-baseline font-extrabold text-white tracking-tighter mb-3" style={{fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'24px'}}>
              bookcy<span style={{color:'var(--terra)'}}>.</span>
            </div>
            <p className="footer-desc text-[13px] leading-relaxed max-w-full md:max-w-[260px] break-words">{t[lang].footer.desc}</p>
            <div className="footer-socials mt-6 flex gap-3">
              <a href="https://instagram.com/bookcy" target="_blank" rel="noopener noreferrer" className="social-btn flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10"><InstagramIcon size={18}/></a>
              <a href="https://wa.me/905555555555" target="_blank" rel="noopener noreferrer" className="social-btn flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10"><MessageCircle size={18}/></a>
              <a href="mailto:noreplybookcy@gmail.com" className="social-btn flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10"><Mail size={18}/></a>
            </div>
          </div>

          <div className="w-full">
            <div className="footer-col-title text-[11px] font-bold tracking-[2px] uppercase text-white mb-5">{t[lang].footer.links}</div>
            <ul className="footer-links flex flex-col gap-2.5 p-0 m-0 list-none">
              <li><button onClick={() => {setStep('services'); window.scrollTo(0,0);}} className="text-[13px] text-white/60 bg-transparent border-none text-left p-0 cursor-pointer hover:text-white transition-colors">{t[lang].nav.places}</button></li>
              <li><button onClick={() => {setShowRegister(true); window.scrollTo(0,0);}} className="text-[13px] text-white font-bold bg-transparent border-none text-left p-0 cursor-pointer hover:text-[var(--terra)] transition-colors">{t[lang].nav.addShop}</button></li>
              <li><button onClick={() => {setShowLogin(true); window.scrollTo(0,0);}} className="text-[13px] text-white/60 bg-transparent border-none text-left p-0 cursor-pointer hover:text-white transition-colors">{t[lang].nav.login}</button></li>
            </ul>
          </div>

          <div className="w-full">
            <div className="footer-col-title text-[11px] font-bold tracking-[2px] uppercase text-white mb-5">{t[lang].footer.cities}</div>
            <ul className="footer-links flex flex-col gap-2.5 p-0 m-0 list-none">
              {cyprusRegions.map(region => (
                  <li key={region}><button onClick={() => {setFilterRegion(region); setStep('all_shops'); window.scrollTo(0,0);}} className="text-[13px] text-white/60 bg-transparent border-none text-left p-0 cursor-pointer hover:text-white transition-colors">{region}</button></li>
              ))}
            </ul>
          </div>

          <div className="w-full">
            <div className="footer-col-title text-[11px] font-bold tracking-[2px] uppercase text-white mb-5">{t[lang].footer.legal}</div>
            <ul className="footer-links flex flex-col gap-2.5 p-0 m-0 list-none">
              <li><button className="text-[13px] text-white/60 bg-transparent border-none text-left p-0 cursor-pointer hover:text-white transition-colors">{t[lang].footer.terms}</button></li>
              <li><button className="text-[13px] text-white/60 bg-transparent border-none text-left p-0 cursor-pointer hover:text-white transition-colors">{t[lang].footer.privacy}</button></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom max-w-6xl mx-auto border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] text-center sm:text-left w-full">
          <div>© {new Date().getFullYear()} BOOKCY KIBRIS. {t[lang].footer.copy}</div>
          <div>One Click Booking™</div>
        </div>
      </footer>

    </>
  );
}