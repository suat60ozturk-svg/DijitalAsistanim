# 📱 API Entegrasyon Rehberi - Adım Adım

## 1️⃣ WhatsApp Business API (20 dakika)

### Adım 1: Meta Business Hesabı Oluştur
1. **https://business.facebook.com** adresine git
2. Sağ üstteki **"Create Account"** butonuna tıkla
3. İşletme bilgilerini doldur:
   - Business Name: "SiparişBot Test" (veya kendi işletme adın)
   - Your Name: Tam adın
   - Business Email: Email adresin

### Adım 2: WhatsApp Business App Ekle
1. Sol menüden **"All Tools"** > **"WhatsApp"** seçeneğine tıkla
2. Eğer görünmüyorsa, **"Add Apps"** butonuna bas
3. WhatsApp kartında **"Get Started"** butonuna tıkla

### Adım 3: Test Numarası Al (ÜCRETSIZ)
1. **"Get started with the WhatsApp Business Platform"** sayfası açılacak
2. **"Test with a sample phone number"** seçeneğini seç
3. Meta otomatik bir test numarası verecek (örn: +1 555-025-3483)
4. Bu numarayı kaydet! ✍️

### Adım 4: API Anahtarlarını Kopyala
WhatsApp Manager sayfasında:

**A) Phone Number ID:**
- Sol menüden **"API Setup"** tıkla
- **"Phone number ID"** altında uzun bir sayı göreceksin
- Örnek: `123456789012345`
- KOPYALA! ✍️

**B) Access Token:**
- Aynı sayfada **"Temporary access token"** başlığını bul
- Altındaki **"Copy"** butonuna tıkla
- Örnek: `EAAGZBpX4xZCZCgBAHg...` (çok uzun)
- KOPYALA! ✍️

**C) Business Account ID:**
- Sol üst köşede işletme adının yanındaki **"Settings"** ikonu
- **"Business settings"** > **"Business info"**
- **"Business ID"** altındaki sayıyı kopyala
- Örnek: `987654321098765`
- KOPYALA! ✍️

### Adım 5: .env Dosyasını Düzenle
Proje klasöründe `.env` dosyasını aç ve şunları ekle:

```env
VITE_WHATSAPP_PHONE_NUMBER_ID=123456789012345
VITE_WHATSAPP_ACCESS_TOKEN=EAAGZBpX4xZCZCgBAHg...
VITE_WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765
```

### Adım 6: Test Et!
1. Terminalde `npm run dev` çalıştır
2. Dashboard > Ayarlar > İletişim Kanalları
3. WhatsApp kartında **"Aktif ✓"** görmelisin
4. Müşteriler sayfasından test mesajı gönder!

---

## 2️⃣ OpenAI API (10 dakika)

### Adım 1: OpenAI Hesabı Oluştur
1. **https://platform.openai.com** adresine git
2. Sağ üstteki **"Sign Up"** butonuna tıkla
3. Email ile kayıt ol (Google hesabınla da yapabilirsin)

### Adım 2: Ödeme Yöntemi Ekle
1. Sol menüden **"Settings"** > **"Billing"**
2. **"Add payment method"** butonuna tıkla
3. Kredi kartı bilgilerini gir
4. **$5-20 arası yükleme yap** (başlangıç için yeterli)

💡 **Maliyet bilgisi:**
- GPT-4: ~$0.002/mesaj (kaliteli)
- GPT-3.5: ~$0.0004/mesaj (hızlı)
- 100 müşteri konuşması = ~$1-2

### Adım 3: API Key Oluştur
1. Sol menüden **"API Keys"** seçeneğine tıkla
2. **"+ Create new secret key"** butonuna bas
3. İsim ver: "SiparişBot Production"
4. **Yeşil "Create secret key"** butonuna tıkla
5. Açılan modal'da **HEMEN KOPYALA!** (tekrar göremezsin)
   - Örnek: `sk-proj-abc123...` (çok uzun)
   - KOPYALA! ✍️

### Adım 4: .env Dosyasını Güncelle
```env
VITE_OPENAI_API_KEY=sk-proj-abc123def456ghi789...
```

### Adım 5: Test Et!
1. Dashboard > AI Chatbot
2. Ayarları kaydet
3. **"Aktif"** checkbox'ını işaretle
4. Test mesajı yaz ve bot yanıtını gör!

---

## 3️⃣ Trendyol API (15 dakika)

### Ön Koşul: Trendyol Satıcı Hesabı
- **https://partner.trendyol.com** adresinden satıcı hesabı olmalı
- Eğer yoksa, başvuru yap (1-2 gün sürer)

### Adım 1: Trendyol Seller Portal'a Giriş
1. **https://partner.trendyol.com** adresine git
2. Email ve şifre ile giriş yap

### Adım 2: API Anahtarlarını Al
1. Sol menüden **"Entegrasyonlar"** seçeneğine tıkla
2. **"API Bilgileri"** veya **"API Credentials"** başlığını bul
3. Üç değer göreceksin:

**A) Supplier ID (Tedarikçi ID):**
- Örnek: `123456`
- KOPYALA! ✍️

**B) API Key:**
- Örnek: `abc123def456`
- KOPYALA! ✍️

**C) API Secret:**
- Örnek: `xyz789uvw123`
- KOPYALA! ✍️

💡 **Eğer API anahtarları görünmüyorsa:**
- Trendyol müşteri hizmetlerini ara: 0850 455 0 455
- "API entegrasyonu için anahtarları istiyorum" de
- 1-2 saat içinde aktif olur

### Adım 3: .env Dosyasını Güncelle
```env
VITE_TRENDYOL_SUPPLIER_ID=123456
VITE_TRENDYOL_API_KEY=abc123def456
VITE_TRENDYOL_API_SECRET=xyz789uvw123
```

### Adım 4: Test Et!
1. Dashboard > Ayarlar > Entegrasyonlar
2. Trendyol kartında **"Senkronize Et"** butonuna tıkla
3. Son 30 günün siparişleri çekilecek!

---

## 4️⃣ iyzico Ödeme API (10 dakika)

### Adım 1: iyzico Hesabı Oluştur
1. **https://www.iyzico.com** adresine git
2. **"Üye Ol"** veya **"Sign Up"** butonuna tıkla
3. İşletme bilgilerini doldur

### Adım 2: Sandbox (Test) Hesabına Geç
1. Giriş yaptıktan sonra sağ üstteki profil resmine tıkla
2. **"Ayarlar"** > **"Geliştirici"**
3. **"Sandbox Ortamı"** başlığını bul
4. **"Sandbox Anahtarları"** seçeneğine tıkla

### Adım 3: API Anahtarlarını Kopyala
İki değer göreceksin:

**A) API Key:**
- Örnek: `sandbox-A1B2C3D4E5F6G7H8`
- KOPYALA! ✍️

**B) Secret Key:**
- Örnek: `sandbox-Z9Y8X7W6V5U4T3S2`
- KOPYALA! ✍️

### Adım 4: .env Dosyasını Güncelle
```env
VITE_IYZICO_API_KEY=sandbox-A1B2C3D4E5F6G7H8
VITE_IYZICO_SECRET_KEY=sandbox-Z9Y8X7W6V5U4T3S2
VITE_IYZICO_PRODUCTION=false
```

### Adım 5: Test Kartları
iyzico sandbox'da bu kartları kullan:

| Kart Numarası | Son Kullanma | CVC | Sonuç |
|---------------|--------------|-----|-------|
| 5528 7900 0000 0001 | 12/30 | 123 | ✅ Başarılı |
| 5406 6700 0000 0009 | 12/30 | 123 | ❌ Reddedildi |

### Adım 6: Production'a Geçiş (Gerçek Ödeme İçin)
1. iyzico'dan onay al (KYC süreci, 1-3 gün)
2. Production API anahtarlarını al
3. `.env` dosyasında değiştir:
```env
VITE_IYZICO_PRODUCTION=true
```

---

## ✅ DOĞRULAMA CHECKLIST

Hepsini tamamladıktan sonra `.env` dosyan şöyle görünmeli:

```env
# Supabase (Zaten hazır)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# WhatsApp ✅
VITE_WHATSAPP_PHONE_NUMBER_ID=123456789012345
VITE_WHATSAPP_ACCESS_TOKEN=EAAGZBpX4xZCZCgBAHg...
VITE_WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765

# OpenAI ✅
VITE_OPENAI_API_KEY=sk-proj-abc123...

# Trendyol ✅
VITE_TRENDYOL_SUPPLIER_ID=123456
VITE_TRENDYOL_API_KEY=abc123def456
VITE_TRENDYOL_API_SECRET=xyz789uvw123

# iyzico ✅
VITE_IYZICO_API_KEY=sandbox-A1B2C3D4E5F6G7H8
VITE_IYZICO_SECRET_KEY=sandbox-Z9Y8X7W6V5U4T3S2
VITE_IYZICO_PRODUCTION=false
```

---

## 🧪 ENTEGRASYON TESTİ

Terminalde çalıştır:
```bash
npm run dev
```

Dashboard'da kontrol et:
1. **Ayarlar > İletişim Kanalları**
   - [ ] WhatsApp: Aktif ✓

2. **AI Chatbot**
   - [ ] OpenAI: Yapılandırılmış ✓

3. **Ayarlar > Entegrasyonlar**
   - [ ] Trendyol: Bağlandı ✓

4. **Abonelik sayfası**
   - [ ] iyzico: Test modu ✓

---

## 🆘 SORUN ÇÖZME

### WhatsApp mesajı gönderilmiyor
- Access Token'ın süresi dolmuş olabilir (24 saat geçerli)
- Meta Business Manager > WhatsApp > API Setup'dan yeni token al
- Telefon numarası doğru formatta mı? (+905321234567)

### OpenAI "Invalid API Key" hatası
- API key'i baştan sona kopyaladığından emin ol
- Boşluk veya enter olmamalı
- platform.openai.com'da kredi yüklü mü kontrol et

### Trendyol siparişleri çekilmiyor
- API anahtarları aktif mi? Trendyol'u ara
- Supplier ID doğru mu?
- Son 30 günde sipariş var mı?

### iyzico ödeme alınmıyor
- Sandbox modunda mısın? Test kartlarını kullan
- Production'da KYC onayını aldın mı?

---

## 💡 İPUÇLARI

1. **Önce Sandbox/Test ile başla** - Para harcamadan test et
2. **API limitlerini bil** - WhatsApp: 1000 mesaj/gün (ücretsiz), OpenAI: Kredi bazlı
3. **Güvenlik** - API anahtarlarını ASLA GitHub'a push etme
4. **Yedek tut** - API anahtarlarını güvenli bir yere kaydet (1Password, LastPass)

---

## 📞 DESTEK

Takıldığın yer olursa:
- **WhatsApp:** Meta Business Help Center
- **OpenAI:** help.openai.com
- **Trendyol:** 0850 455 0 455
- **iyzico:** destek@iyzico.com

**Bana sor!** Hangi adımda takıldın, yardım edeyim.
