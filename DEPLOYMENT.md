# 🚀 Deployment Guide - SiparişBot

Bu proje tüm major platformlara deploy edilebilir. Her platform için detaylı talimatlar aşağıda.

---

## 📋 Genel Gereksinimler

Deployment öncesi:
1. `.env` dosyasını kontrol et
2. Supabase URL ve API key'lerini doğrula
3. Build test et: `npm run build`

---

## 1️⃣ Netlify (Önerilen)

### Otomatik Deploy (GitHub)

1. [Netlify'a giriş yap](https://app.netlify.com)
2. "Add new site" > "Import an existing project"
3. GitHub repoyu seç
4. Build ayarları:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Environment variables ekle:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. "Deploy site"

### Manuel Deploy

```bash
# Netlify CLI kur
npm install -g netlify-cli

# Login
netlify login

# Deploy
npm run build
netlify deploy --prod
```

**Demo URL:** `https://siparisbot.netlify.app`

---

## 2️⃣ Vercel

### Otomatik Deploy (GitHub)

1. [Vercel'e giriş yap](https://vercel.com)
2. "Add New Project"
3. GitHub repoyu import et
4. Framework Preset: `Vite`
5. Environment Variables ekle:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. "Deploy"

### Manuel Deploy

```bash
# Vercel CLI kur
npm install -g vercel

# Login
vercel login

# Deploy
npm run build
vercel --prod
```

**Demo URL:** `https://siparisbot.vercel.app`

---

## 3️⃣ Cloudflare Pages

### GitHub Entegrasyonu

1. [Cloudflare Pages](https://pages.cloudflare.com) giriş yap
2. "Create a project"
3. GitHub repoyu bağla
4. Build ayarları:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. "Save and Deploy"

### Wrangler CLI

```bash
# Wrangler kur
npm install -g wrangler

# Login
wrangler login

# Deploy
npm run build
wrangler pages deploy dist --project-name=siparisbot
```

**Demo URL:** `https://siparisbot.pages.dev`

---

## 4️⃣ GitHub Pages

### Otomatik Deploy

1. GitHub repo settings > Pages
2. Source: "GitHub Actions"
3. Workflow dosyası zaten hazır (`.github/workflows/github-pages.yml`)
4. Secrets ekle:
   - Settings > Secrets > Actions
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. `main` branch'e push yap

### Manuel Deploy

```bash
# gh-pages branch oluştur
npm install -g gh-pages

# Deploy
npm run build
gh-pages -d dist
```

**Demo URL:** `https://username.github.io/siparisbot`

---

## 5️⃣ Firebase Hosting

```bash
# Firebase CLI kur
npm install -g firebase-tools

# Login
firebase login

# Init
firebase init hosting
# Public directory: dist
# Single-page app: Yes

# Deploy
npm run build
firebase deploy --only hosting
```

**Demo URL:** `https://siparisbot.web.app`

---

## 6️⃣ AWS Amplify

1. [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. "New app" > "Host web app"
3. GitHub repoyu bağla
4. Build ayarları otomatik algılanır
5. Environment variables ekle
6. Deploy

**Demo URL:** `https://main.xxxxx.amplifyapp.com`

---

## 7️⃣ DigitalOcean App Platform

1. [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. "Create App"
3. GitHub repoyu seç
4. Environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

**Demo URL:** `https://siparisbot-xxxxx.ondigitalocean.app`

---

## 🔐 Environment Variables

Tüm platformlarda bu değişkenleri ekle:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🎯 GitHub Actions (Otomatik Deploy)

Repo'da 2 workflow dosyası var:

1. **`.github/workflows/deploy.yml`** - Netlify, Vercel, Cloudflare'e deploy
2. **`.github/workflows/github-pages.yml`** - GitHub Pages'e deploy

### Secrets Ekle

GitHub Repo > Settings > Secrets > Actions

**Netlify:**
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

**Vercel:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

**Cloudflare:**
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

---

## 📊 Deployment Kontrol Listesi

- [ ] `.env` dosyası yapılandırıldı
- [ ] `npm run build` başarılı
- [ ] Supabase bağlantısı test edildi
- [ ] Environment variables platform'a eklendi
- [ ] Custom domain (opsiyonel) ayarlandı
- [ ] SSL/HTTPS aktif
- [ ] Analytics eklendi (opsiyonel)

---

## 🌐 Custom Domain Ekleme

Her platformda:
1. Platform dashboard > Domains
2. Custom domain ekle
3. DNS kayıtlarını güncelle:
   - CNAME: `www` -> `platform-url`
   - A Record: `@` -> `platform-ip`
4. SSL otomatik aktif olacak

---

## 🔄 CI/CD Pipeline

GitHub'a push yaptığında otomatik deploy olur:

```bash
git add .
git commit -m "Update"
git push origin main
```

Her platform 1-5 dakikada deploy eder.

---

## 📈 Monitoring

### Netlify
- Analytics: Built-in
- Logs: Deploy logs

### Vercel
- Analytics: Dashboard
- Speed Insights: Otomatik

### Cloudflare
- Web Analytics: Free
- CDN: Global

---

## ❓ Troubleshooting

### Build Hatası
```bash
npm ci
npm run build
```

### Environment Variables Çalışmıyor
- `VITE_` prefix kontrolü
- Platform'da doğru eklendiğinden emin ol
- Redeploy yap

### 404 Hatası
- `_redirects` (Netlify) veya `vercel.json` kontrol et
- SPA routing için gerekli

---

## 🎉 Deploy Sonrası

1. Demo URL'yi test et
2. Tüm sayfaları kontrol et
3. Auth akışını test et
4. API bağlantılarını doğrula
5. Mobile responsive kontrol et

---

## 📞 Destek

Deployment sorunu için:
- Platform dokümantasyonlarını kontrol et
- GitHub Issues aç
- Community forumlarına sor

---

**Tüm platformlar hazır! Hangisini kullanmak istersen oraya deploy edebilirsin.**
