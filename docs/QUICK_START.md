# ⚡ Hızlı Başlangıç - 30 Dakikada Çalışır Hale Getir

## 🎯 Hedef
30 dakika içinde WhatsApp üzerinden ilk otomatik mesajını gönder!

---

## ✅ Adım 1: Projeyi Çalıştır (2 dakika)

```bash
# Terminal'i aç
cd project-folder

# Paketleri yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda **http://localhost:5173** otomatik açılacak.

**Giriş yap:**
- Email ve şifre ile kayıt ol
- Dashboard'u gör ✅

---

## ✅ Adım 2: WhatsApp API'yi Bağla (15 dakika)

### A) Meta Business Hesabı
1. **https://business.facebook.com** → "Create Account"
2. İşletme bilgilerini doldur
3. Email onay

### B) WhatsApp Test Numarası
1. Sol menü → "WhatsApp"
2. "Get started with the WhatsApp Business Platform"
3. **"Test with a sample phone number"** → Ücretsiz numara al! 📱
4. Numarayı kaydet: `+1 555-025-3483`

### C) API Anahtarları
**Phone Number ID:**
- "API Setup" → Phone number ID altındaki sayıyı kopyala
- Örnek: `123456789012345`

**Access Token:**
- "Temporary access token" → Copy butonu
- Örnek: `EAAGZBpX4xZCZCg...` (çok uzun)

**Business Account ID:**
- Sağ üst → Settings → Business info
- "Business ID" sayısını kopyala

### D) .env Dosyasını Düzenle
Proje klasöründe `.env` dosyasını aç (yoksa oluştur):

```env
VITE_WHATSAPP_PHONE_NUMBER_ID=123456789012345
VITE_WHATSAPP_ACCESS_TOKEN=EAAGZBpX4xZCZCgBAHg...
VITE_WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765
```

Kaydet ve **tarayıcıyı yenile** (F5)

---

## ✅ Adım 3: İlk Mesajı Gönder (5 dakika)

1. Dashboard → **Ayarlar** (⚙️ ikon)
2. **API Entegrasyonları** sekmesine tıkla
3. WhatsApp kartında **✓ Yapılandırılmış** göreceksin!
4. **"Bağlantıyı Test Et"** butonuna bas

### Test Mesajı Gönder:
1. Dashboard → **Müşteriler**
2. Bir müşteri seç (örn: Ayşe Yılmaz)
3. Sağ üstte **"WhatsApp Gönder"** butonu
4. Mesaj yaz → **Gönder**

🎉 **İlk WhatsApp mesajın gönderildi!**

---

## 🤖 Bonus: AI Chatbot'u Ekle (10 dakika)

### OpenAI API Key Al:
1. **https://platform.openai.com** → Sign Up
2. "API Keys" → "Create new secret key"
3. $5-10 kredi yükle (100 konuşma için yeterli)
4. Key'i kopyala: `sk-proj-abc123...`

### .env'ye Ekle:
```env
VITE_OPENAI_API_KEY=sk-proj-abc123def456...
```

### Test Et:
1. Dashboard → **AI Chatbot**
2. "Aktif" checkbox'ını işaretle
3. **"Ayarları Kaydet"**
4. Test konuşması yap!

Bot artık müşterilere otomatik yanıt verecek! 🤖

---

## 📊 Demo Verilerini Keşfet

Sistem demo verilerle geliyor:

**Müşteriler (8 adet):**
- Dashboard → Müşteriler
- Ayşe, Mehmet, Zeynep ve diğerleri

**Siparişler (10 adet):**
- Dashboard → Siparişler
- Çeşitli durumlar: Pending, Shipped, Delivered

**Mesaj Şablonları (4 adet):**
- Dashboard → Mesaj Şablonları
- Sipariş onayı, kargo bildirimi vb.

**Otomasyonlar (5 adet):**
- Dashboard → Otomasyonlar
- Otomatik sipariş onayı, kargo bildirimi vb.

---

## 🎯 Sonraki Adımlar

### Bugün:
- [ ] WhatsApp API bağlandı ✅
- [ ] İlk test mesajı gönderildi ✅
- [ ] AI chatbot aktif (opsiyonel) ✅

### Bu Hafta:
- [ ] Trendyol API'yi bağla → Siparişleri otomatik çek
- [ ] İlk müşterini ekle → Gerçek sipariş al
- [ ] Landing page'i paylaş → İlk kayıtları al

### Bu Ay:
- [ ] 5 müşteri bul
- [ ] Ödeme sistemini aktive et
- [ ] Geri bildirimleri topla
- [ ] Product-market fit bul

---

## 🆘 Sorun mu Yaşıyorsun?

### WhatsApp mesajı gönderilmiyor
**Çözüm:**
- Access Token 24 saat geçerli
- Meta Business Manager → WhatsApp → API Setup
- Yeni token al ve `.env`'ye yapıştır

### "API Key not found" hatası
**Çözüm:**
- `.env` dosyası proje kök dizininde mi?
- Değişken adı doğru mu? (`VITE_` ile başlamalı)
- Tarayıcıyı yeniledin mi? (F5)

### Sayfalar yüklenmiyor
**Çözüm:**
```bash
# Terminalde Ctrl+C bas (durdur)
# Tekrar başlat
npm run dev
```

---

## 💡 Pro İpuçları

1. **Kopyala-yapıştır hatalarına dikkat:**
   - API anahtarlarında boşluk olmamalı
   - Başına/sonuna enter girmeyin

2. **Test numarası sınırlı:**
   - WhatsApp test numarası sadece 5 kişiye mesaj atabiliyor
   - Production için gerçek numara gerekli

3. **Demo verileri silme:**
   - Gerçek müşterileri eklemeden önce demo verileri temizle
   - Supabase Dashboard → SQL Editor → `DELETE FROM customers;`

4. **API maliyetleri:**
   - WhatsApp: İlk 1000 mesaj/ay ücretsiz
   - OpenAI: $5 ile 2500 mesaj (~100 müşteri)
   - Trendyol: Ücretsiz
   - iyzico: Sadece başarılı işlemlerden %2

---

## 📹 Video Rehber (Yakında)

Tüm bu adımları ekran kaydıyla çekiyorum:
- [ ] WhatsApp API bağlama (5 dakika)
- [ ] İlk mesaj gönderme (2 dakika)
- [ ] AI chatbot kurulumu (3 dakika)
- [ ] Trendyol entegrasyonu (5 dakika)

---

## 🎉 Tebrikler!

WhatsApp otomasyonun çalışıyor!

**Şimdi ne yapmalısın?**
1. Demo verilerle oyna, özellikleri keşfet
2. Gerçek bir müşterini ekle
3. İlk gerçek otomatik mesajını gönder
4. Arkadaşlarına göster 😎

**Sorular?** Bana sor, yardımcı olayım! 🚀
