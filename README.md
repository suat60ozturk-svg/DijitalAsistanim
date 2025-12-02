# 🤖 SiparişBot - E-Ticaret Otomasyon Platformu

WhatsApp, AI ve çok kanallı iletişim ile e-ticaret siparişlerini otomatikleştirin.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## ✨ Özellikler

### 🤖 AI Destekli Otomasyon
- **OpenAI GPT-4 Chatbot** - Müşterilere 7/24 otomatik yanıt
- **Sentiment analizi** - Müşteri duygularını anlama
- **Akıllı yönlendirme** - Karmaşık soruları insan temsilciye yönlendirme

### 📱 Çok Kanallı İletişim
- WhatsApp Business API
- E-posta
- SMS
- Instagram Direct
- Facebook Messenger
- Web Chat Widget

### 🛍️ E-Ticaret Entegrasyonları
- **Trendyol** - Otomatik sipariş senkronizasyonu
- **N11** - Sipariş çekme ve güncelleme
- **Hepsiburada** - Marketplace entegrasyonu
- **Shopify/WooCommerce** - E-ticaret platformları

### 🔄 Otomasyon Workflow'ları
- Sipariş onay mesajı (otomatik)
- Kargo takip bildirimi
- Terk edilmiş sepet hatırlatması
- Müşteri memnuniyeti anketi
- Hoş geldin mesajları

### 📊 Gelişmiş Analitik
- Gerçek zamanlı dashboard
- Satış raporları
- Müşteri segmentasyonu
- RFM analizi
- Churn prediction

### 👥 Ekip Yönetimi
- Çoklu kullanıcı desteği
- Rol bazlı yetkilendirme (Admin, Müdür, Temsilci, Görüntüleyici)
- Aktivite günlüğü (Audit logs)
- İki faktörlü doğrulama (2FA)

### 🎫 Destek Sistemi
- Ticket yönetimi
- Öncelik seviyeleri
- Otomatik atama
- SLA takibi

### 💳 Ödeme Sistemi
- **iyzico** entegrasyonu
- Tek seferlik ödeme
- Abonelik yönetimi
- Güvenli ödeme altyapısı

### 📤 Veri Dışa Aktarma
- CSV, Excel, PDF formatları
- Müşteri listeleri
- Sipariş raporları
- Analitik veriler

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Supabase hesabı (ücretsiz)

### Kurulum

```bash
# Projeyi klonla
git clone https://github.com/your-username/siparisbot.git
cd siparisbot

# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env

# Geliştirme sunucusunu başlat
npm run dev
```

**30 dakikada çalışır hale getir:** [Hızlı Başlangıç Rehberi](docs/QUICK_START.md)

---

## 📚 Dokümantasyon

### Kurulum Rehberleri
- [⚡ Hızlı Başlangıç](docs/QUICK_START.md) - 30 dakikada ilk mesajı gönder
- [🔌 API Entegrasyon Rehberi](docs/API_SETUP_GUIDE.md) - Tüm API'ler için detaylı talimatlar
- [🛠️ Kurulum](SETUP.md) - Detaylı kurulum ve yapılandırma

### API Dokümantasyonları
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [OpenAI API](https://platform.openai.com/docs)
- [Trendyol API](https://developers.trendyol.com)
- [iyzico API](https://dev.iyzipay.com)

---

## 🏗️ Teknoloji Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Authentication

### Integrations
- **WhatsApp Business API** - Messaging
- **OpenAI API** - AI Chatbot
- **Trendyol API** - E-commerce
- **iyzico API** - Payments

---

## 📦 Proje Yapısı

```
siparisbot/
├── src/
│   ├── components/          # React bileşenleri
│   │   ├── ai/             # AI chatbot
│   │   ├── analytics/      # Analitik raporlar
│   │   ├── auth/           # Kimlik doğrulama
│   │   ├── channels/       # İletişim kanalları
│   │   ├── customers/      # Müşteri yönetimi
│   │   ├── dashboard/      # Ana dashboard
│   │   ├── export/         # Dışa aktarma
│   │   ├── messages/       # Mesaj şablonları
│   │   ├── orders/         # Sipariş yönetimi
│   │   ├── settings/       # Ayarlar
│   │   ├── team/           # Ekip yönetimi
│   │   ├── tickets/        # Destek sistemi
│   │   └── workflows/      # Otomasyonlar
│   ├── contexts/           # React contexts
│   ├── lib/                # Utility kütüphaneleri
│   │   ├── supabase.ts    # Supabase client
│   │   ├── whatsapp.ts    # WhatsApp service
│   │   ├── openai.ts      # OpenAI service
│   │   ├── trendyol.ts    # Trendyol service
│   │   └── iyzico.ts      # iyzico service
│   └── ...
├── supabase/
│   └── migrations/         # Database migrations
├── docs/                   # Dokümantasyon
├── .env.example           # Örnek environment variables
└── README.md              # Bu dosya
```

---

## 💰 Fiyatlandırma

### Başlangıç - ₺499/ay
- 50 sipariş/gün
- WhatsApp entegrasyonu
- Temel raporlar
- E-posta destek

### Profesyonel - ₺999/ay ⭐ Popüler
- 200 sipariş/gün
- Tüm entegrasyonlar
- Gelişmiş raporlar
- AI chatbot
- Öncelikli destek

### Enterprise - ₺2,499/ay
- Sınırsız sipariş
- Özel entegrasyonlar
- API erişimi
- 7/24 destek
- Hesap yöneticisi

**14 gün ücretsiz deneme!**

---

## 🧪 Test

```bash
# Unit testler
npm run test

# Type check
npm run typecheck

# Linting
npm run lint
```

---

## 🚢 Production Deploy

### Vercel (Önerilen)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Manuel
```bash
npm run build
# dist/ klasörünü hosting'e yükle
```

---

## 🔒 Güvenlik

- ✅ Row Level Security (RLS) ile veri izolasyonu
- ✅ API anahtarları .env dosyasında
- ✅ HTTPS zorunlu (production)
- ✅ İki faktörlü doğrulama (2FA)
- ✅ Audit logs (aktivite takibi)
- ✅ GDPR/KVKK uyumlu

---

## 📊 Demo Veriler

Sistem şu demo verilerle gelir:
- 8 örnek müşteri
- 10 örnek sipariş
- 4 mesaj şablonu
- 5 otomasyon workflow'u
- 30 günlük analitik veriler

Demo verileri temizlemek için:
```sql
-- Supabase SQL Editor'da çalıştır
DELETE FROM customers;
DELETE FROM orders;
DELETE FROM message_templates;
DELETE FROM workflows;
DELETE FROM analytics;
```

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz!

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

---

## 📝 Changelog

### v1.0.0 (2024-12-01)
- 🎉 İlk sürüm yayınlandı
- ✨ WhatsApp Business API entegrasyonu
- 🤖 OpenAI GPT-4 chatbot
- 🛍️ Trendyol marketplace entegrasyonu
- 💳 iyzico ödeme sistemi
- 👥 Ekip yönetimi ve rol bazlı yetkilendirme
- 🎫 Destek ticket sistemi
- 📊 Gelişmiş analitik ve raporlar
- 🔒 2FA ve audit logs

---

## 📞 Destek

- **Email:** destek@siparisbot.com
- **Dokümantasyon:** [docs/](docs/)
- **GitHub Issues:** [Issues](https://github.com/your-username/siparisbot/issues)

---

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👨‍💻 Geliştirici

**SiparişBot Team**
- Website: https://siparisbot.com
- Twitter: [@siparisbot_tr](https://twitter.com/siparisbot_tr)
- LinkedIn: [SiparişBot](https://linkedin.com/company/siparisbot)

---

## 🙏 Teşekkürler

Bu proje şu harika teknolojiler ile yapıldı:
- [React](https://react.dev)
- [Supabase](https://supabase.com)
- [OpenAI](https://openai.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev)

---

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**
