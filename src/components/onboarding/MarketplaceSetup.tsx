import { useState } from 'react';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MarketplaceSetupProps {
  workspaceId: string;
  onComplete: () => void;
}

type Marketplace = 'trendyol' | 'n11' | 'hepsiburada' | 'amazon' | 'alibaba' | 'ebay' | 'etsy' | 'shopify' | 'woocommerce' | 'facebook' | 'instagram' | 'tiktok';

export function MarketplaceSetup({ workspaceId, onComplete }: MarketplaceSetupProps) {
  const [selectedMarketplace, setSelectedMarketplace] = useState<Marketplace>('trendyol');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [region, setRegion] = useState('tr');

  const marketplaces = [
    { id: 'trendyol', name: 'Trendyol', color: 'orange', region: 'tr', category: 'local' },
    { id: 'n11', name: 'N11', color: 'purple', region: 'tr', category: 'local' },
    { id: 'hepsiburada', name: 'Hepsiburada', color: 'orange', region: 'tr', category: 'local' },
    { id: 'amazon', name: 'Amazon', color: 'yellow', region: 'global', category: 'global' },
    { id: 'alibaba', name: 'Alibaba', color: 'orange', region: 'global', category: 'global' },
    { id: 'ebay', name: 'eBay', color: 'blue', region: 'global', category: 'global' },
    { id: 'etsy', name: 'Etsy', color: 'orange', region: 'global', category: 'global' },
    { id: 'shopify', name: 'Shopify', color: 'green', region: 'global', category: 'ecommerce' },
    { id: 'woocommerce', name: 'WooCommerce', color: 'purple', region: 'global', category: 'ecommerce' },
    { id: 'facebook', name: 'Facebook Shop', color: 'blue', region: 'global', category: 'social' },
    { id: 'instagram', name: 'Instagram Shop', color: 'pink', region: 'global', category: 'social' },
    { id: 'tiktok', name: 'TikTok Shop', color: 'black', region: 'global', category: 'social' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!apiKey.trim() || !apiSecret.trim()) {
      setError('API bilgileri gereklidir');
      setLoading(false);
      return;
    }

    const { error: upsertError } = await supabase
      .from('integrations')
      .upsert({
        workspace_id: workspaceId,
        platform: selectedMarketplace,
        api_key: apiKey,
        api_secret: apiSecret,
        is_active: true,
      }, {
        onConflict: 'workspace_id,platform'
      });

    if (upsertError) {
      setError('Pazaryeri bağlantısı kurulamadı');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const localMarketplaces = marketplaces.filter(m => m.category === 'local');
  const globalMarketplaces = marketplaces.filter(m => m.category === 'global');
  const ecommerceMarketplaces = marketplaces.filter(m => m.category === 'ecommerce');
  const socialMarketplaces = marketplaces.filter(m => m.category === 'social');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Pazaryeri Seçin
        </label>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Türkiye Pazaryerleri</h3>
          <div className="grid grid-cols-3 gap-3">
            {localMarketplaces.map((marketplace) => (
              <button
                key={marketplace.id}
                type="button"
                onClick={() => setSelectedMarketplace(marketplace.id as Marketplace)}
                className={`p-4 border-2 rounded-xl transition ${
                  selectedMarketplace === marketplace.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ShoppingBag className="mx-auto mb-2" size={24} />
                <p className="font-semibold text-sm">{marketplace.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Global Pazaryerleri</h3>
          <div className="grid grid-cols-3 gap-3">
            {globalMarketplaces.map((marketplace) => (
              <button
                key={marketplace.id}
                type="button"
                onClick={() => setSelectedMarketplace(marketplace.id as Marketplace)}
                className={`p-4 border-2 rounded-xl transition ${
                  selectedMarketplace === marketplace.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ShoppingBag className="mx-auto mb-2" size={24} />
                <p className="font-semibold text-sm">{marketplace.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">E-Ticaret Platformları</h3>
          <div className="grid grid-cols-3 gap-3">
            {ecommerceMarketplaces.map((marketplace) => (
              <button
                key={marketplace.id}
                type="button"
                onClick={() => setSelectedMarketplace(marketplace.id as Marketplace)}
                className={`p-4 border-2 rounded-xl transition ${
                  selectedMarketplace === marketplace.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ShoppingBag className="mx-auto mb-2" size={24} />
                <p className="font-semibold text-sm">{marketplace.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Sosyal Ticaret 🔥</h3>
          <div className="grid grid-cols-3 gap-3">
            {socialMarketplaces.map((marketplace) => (
              <button
                key={marketplace.id}
                type="button"
                onClick={() => setSelectedMarketplace(marketplace.id as Marketplace)}
                className={`p-4 border-2 rounded-xl transition ${
                  selectedMarketplace === marketplace.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ShoppingBag className="mx-auto mb-2" size={24} />
                <p className="font-semibold text-sm">{marketplace.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {success ? (
        <div className="text-center py-8">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Entegrasyon Başarılı!</h3>
          <p className="text-gray-600">
            {marketplaces.find(m => m.id === selectedMarketplace)?.name} başarıyla bağlandı
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800">
              <strong>Not:</strong> API bilgilerinizi {marketplaces.find(m => m.id === selectedMarketplace)?.name}{' '}
              satıcı panelinden alabilirsiniz.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key / Satıcı ID
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API anahtarınızı girin"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Secret / Şifre
            </label>
            <input
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="API secret girin"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? 'Bağlanıyor...' : 'Bağlan ve Tamamla'}
          </button>
        </form>
      )}
    </div>
  );
}
