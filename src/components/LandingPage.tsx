import { MessageSquare, Zap, TrendingUp, Shield, CheckCircle, Sparkles, TrendingUp as Fire } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-3 px-4 text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Sparkles className="animate-pulse" size={20} />
          <span className="font-bold">ÖZEL LANSMAN TEKLİFİ:</span>
          <span>İlk 50 müşteriye 3 ay boyunca %50 İNDİRİM!</span>
          <Fire className="animate-bounce" size={20} />
        </div>
      </div>

      <nav className="container mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-blue-600" size={28} />
            <span className="text-xl md:text-2xl font-bold text-gray-900">SiparişAsistanım</span>
          </div>
          <button
            onClick={onGetStarted}
            className="text-blue-600 hover:text-blue-700 font-semibold transition text-sm md:text-base"
          >
            Giriş Yap
          </button>
        </div>
      </nav>

      <section className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            Global E-ticaret + Sosyal Ticaret
            <br />
            <span className="text-blue-600">Otomasyon Platformu</span>
          </h1>
          <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed px-4">
            TikTok Shop, Instagram, Facebook, Amazon, Trendyol! Tüm satış kanallarınızı tek yerden yönetin,
            WhatsApp ile müşterilerinize anında yanıt verin. Günde 2 saat kazanın.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            Ücretsiz Başla
          </button>
          <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4">Kredi kartı gerektirmez</p>

          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <span>5 dakikada kurulum</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <span>Demo verilerle test</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <span>Anında destek</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Zap className="text-blue-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Otomatik Sipariş</h3>
            <p className="text-gray-600 leading-relaxed">
              WhatsApp'tan gelen siparişleri otomatik olarak sisteme kaydedin, stok kontrolü yapın
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <MessageSquare className="text-green-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Akıllı Mesajlar</h3>
            <p className="text-gray-600 leading-relaxed">
              Sipariş onayı, kargo takibi ve teslimat bildirimleri otomatik olarak gönderilir
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="text-purple-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Detaylı Raporlar</h3>
            <p className="text-gray-600 leading-relaxed">
              Satışlarınızı, müşterilerinizi ve performansınızı gerçek zamanlı takip edin
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-12 md:py-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl md:rounded-3xl my-12 md:my-20">
        <div className="max-w-5xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Global Pazaryeri Entegrasyonları</h2>
          <p className="text-base md:text-xl mb-8 md:mb-12 text-blue-100">
            Türkiye ve dünya genelindeki tüm satış kanallarınızı tek yerden yönetin
          </p>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-blue-200 uppercase mb-4">Türkiye</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Trendyol', 'N11', 'Hepsiburada', 'WhatsApp'].map((platform) => (
                <div key={platform} className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-4">
                  <p className="font-semibold">{platform}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-blue-200 uppercase mb-4">Global Platformlar</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Amazon', 'eBay', 'Alibaba', 'Etsy'].map((platform) => (
                <div key={platform} className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-4">
                  <p className="font-semibold">{platform}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-semibold text-blue-200 uppercase mb-4">E-Ticaret Platformları</h3>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 max-w-md mx-auto">
              {['Shopify', 'WooCommerce'].map((platform) => (
                <div key={platform} className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-4">
                  <p className="font-semibold">{platform}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-blue-200 uppercase mb-4">Sosyal Ticaret 🔥</h3>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              {['TikTok Shop', 'Instagram Shop', 'Facebook Shop'].map((platform) => (
                <div key={platform} className="bg-gradient-to-br from-pink-500 to-orange-500 bg-opacity-20 backdrop-blur rounded-xl p-4 border-2 border-white border-opacity-30">
                  <p className="font-bold">{platform}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-12">Fiyatlandırma</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Başlangıç</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₺499</span>
                <span className="text-gray-600">/ay</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['50 sipariş/gün', 'WhatsApp entegrasyonu', 'Temel raporlar', 'E-posta destek'].map(
                  (feature) => (
                    <li key={feature} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                      <span>{feature}</span>
                    </li>
                  )
                )}
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-xl transition"
              >
                Başla
              </button>
            </div>

            <div className="bg-blue-600 rounded-2xl p-8 shadow-2xl transform scale-105">
              <div className="bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                EN POPÜLER
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Profesyonel</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">₺999</span>
                <span className="text-blue-100">/ay</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  '200 sipariş/gün',
                  'Tüm entegrasyonlar',
                  'Gelişmiş raporlar',
                  'Öncelikli destek',
                  'Özel mesaj şablonları',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-white">
                    <CheckCircle className="text-blue-200 flex-shrink-0" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-xl transition"
              >
                Başla
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">₺2499</span>
                <span className="text-gray-600">/ay</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Sınırsız sipariş',
                  'Özel entegrasyonlar',
                  'API erişimi',
                  '7/24 destek',
                  'Özel eğitim',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onGetStarted}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-xl transition"
              >
                Başla
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl md:rounded-3xl p-8 md:p-12 text-white">
          <Shield className="mx-auto mb-6 text-blue-400" size={48} />
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Güvenli ve Kolay</h2>
          <p className="text-gray-300 text-base md:text-lg mb-6 md:mb-8">
            Verileriniz şifrelenir, WhatsApp Business API ile entegre çalışır. 5 dakikada kurulum,
            anında kullanıma hazır.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl transition"
          >
            14 Gün Ücretsiz Deneyin
          </button>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-gray-600 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} />
              <span className="font-semibold">SiparişAsistanım</span>
            </div>
            <span>© 2025 Tüm hakları saklıdır</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
