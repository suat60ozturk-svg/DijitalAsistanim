# SiparişBot Kurulum Rehberi

## 🚀 Hızlı Başlangıç

### 1. Proje Kurulumu
```bash
npm install
cp .env.example .env
```

### 2. Gerekli API Anahtarları

#### Supabase (Veritabanı) ✅ Hazır
- Zaten yapılandırılmış
- Tüm tablolar oluşturuldu
- Demo veriler yüklendi

#### WhatsApp Business API 📱
1. [Meta Business Suite](https://business.facebook.com)'a git
2. WhatsApp > API Setup bölümüne gir
3. Test numarası oluştur
4. `.env` dosyasına ekle:
```env
VITE_WHATSAPP_PHONE_NUMBER_ID=123456789
VITE_WHATSAPP_ACCESS_TOKEN=EAAxxxxxx
VITE_WHATSAPP_BUSINESS_ACCOUNT_ID=987654321
```

**Webhook URL:** `https://yourdomain.com/api/whatsapp/webhook`

#### OpenAI API 🤖
1. [OpenAI Platform](https://platform.openai.com)'a git
2. API Keys > Create new secret key
3. $20 kredi yükle (ilk 100 müşteri için yeterli)
4. `.env` dosyasına ekle:
```env
VITE_OPENAI_API_KEY=sk-xxxxxx
```

**Maliyet:** ~$0.002/mesaj (GPT-4), ~$0.0004/mesaj (GPT-3.5)

#### Trendyol API 🛍️
1. [Trendyol Seller Portal](https://partner.trendyol.com)'a giriş yap
2. Entegrasyonlar > API Bilgileri
3. Supplier ID, API Key ve Secret'i kopyala
4. `.env` dosyasına ekle:
```env
VITE_TRENDYOL_SUPPLIER_ID=123456
VITE_TRENDYOL_API_KEY=xxxxxx
VITE_TRENDYOL_API_SECRET=xxxxxx
```

#### iyzico Ödeme 💳
1. [iyzico](https://www.iyzico.com)'ya üye ol
2. Sandbox hesap oluştur (test için ücretsiz)
3. Ayarlar > API Anahtarları
4. `.env` dosyasına ekle:
```env
VITE_IYZICO_API_KEY=sandbox-xxxxxx
VITE_IYZICO_SECRET_KEY=sandbox-xxxxxx
VITE_IYZICO_PRODUCTION=false
```

**Production'a geçiş:** VITE_IYZICO_PRODUCTION=true

---

## 📊 Demo Verileri

Sistem şu demo verilerle gelir:
- ✅ 8 örnek müşteri
- ✅ 10 örnek sipariş
- ✅ 4 mesaj şablonu
- ✅ 5 otomasyon workflow'u
- ✅ 30 günlük analitik veriler
- ✅ 4 iletişim kanalı
- ✅ 3 örnek destek talebi

---

## 🎯 Özellik Durumu

### ✅ Tamamen Hazır
- Veritabanı yapısı
- UI/UX tasarımları
- Tüm sayfalar ve bileşenler
- RLS güvenlik politikaları
- Demo veriler

### 🔄 API Bağlantısı Gerekli
1. WhatsApp Business API - Mesajlaşma
2. OpenAI API - AI Chatbot
3. Trendyol API - Sipariş senkronizasyonu
4. iyzico API - Ödeme işlemleri

### 📋 Opsiyonel Entegrasyonlar
- N11 API
- Hepsiburada API
- Instagram/Facebook Graph API
- SendGrid/Mailgun (Email)
- Twilio (SMS)

---

## 🛠️ Geliştirme Ortamı

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck

# Linting
npm run lint
```

---

## 🔐 Güvenlik Notları

1. **API Anahtarlarını Asla Commit Etmeyin**
   - `.env` dosyası `.gitignore`'da
   - `.env.example` şablon olarak kullanılır

2. **Production Checklist**
   - [ ] Supabase RLS politikaları aktif
   - [ ] WhatsApp webhook güvenli endpoint
   - [ ] iyzico production mode
   - [ ] HTTPS zorunlu
   - [ ] CORS ayarları doğru

3. **Yedekleme**
   - Supabase otomatik yedekleme aktif
   - Database migration'ları versiyonlu

---

## 📱 Mobil Uygulama (İsteğe Bağlı)

React Native ile mobil app için:
```bash
# React Native proje oluştur
npx react-native init SiparisBot

# Supabase ve diğer kütüphaneleri ekle
npm install @supabase/supabase-js
```

---

## 🚀 Production Deployment

### Vercel (Önerilen)
```bash
# Vercel CLI kur
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Netlify CLI kur
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## 📞 Destek

Sorun yaşarsanız:
1. GitHub Issues'da soru açın
2. [Dokümantasyonu](./docs) okuyun
3. Community forum'unda sorun

---

## 🎉 İlk Müşteri Onboarding

1. Demo hesabı ile giriş yap
2. WhatsApp API'yi bağla
3. İlk mesaj şablonunu test et
4. Trendyol siparişlerini senkronize et
5. Ödeme planını aktive et

**Hedef:** İlk 5 müşteri 14 gün içinde!
