import { useState } from 'react';
import { MessageSquare, CheckCircle, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface WhatsAppSetupProps {
  workspaceId: string;
  onComplete: () => void;
}

export function WhatsAppSetup({ workspaceId, onComplete }: WhatsAppSetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!apiKey.trim()) {
      setError('API anahtarı gereklidir');
      setLoading(false);
      return;
    }

    const { error: upsertError } = await supabase
      .from('integrations')
      .upsert({
        workspace_id: workspaceId,
        platform: 'whatsapp',
        api_key: apiKey,
        is_active: true,
      }, {
        onConflict: 'workspace_id,platform'
      });

    if (upsertError) {
      setError('WhatsApp bağlantısı kurulamadı');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <MessageSquare size={20} />
          WhatsApp Business API Nasıl Alınır?
        </h3>
        <ol className="space-y-2 text-sm text-blue-800">
          <li>1. WhatsApp Business hesabı oluşturun</li>
          <li>2. Meta Business Suite'e giriş yapın</li>
          <li>3. WhatsApp API erişimi için başvurun</li>
          <li>4. API anahtarınızı kopyalayın</li>
        </ol>
        <a
          href="https://business.whatsapp.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mt-4"
        >
          WhatsApp Business <ExternalLink size={16} />
        </a>
      </div>

      {success ? (
        <div className="text-center py-8">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Bağlantı Başarılı!</h3>
          <p className="text-gray-600">WhatsApp hesabınız başarıyla bağlandı</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Business API Anahtarı
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Örn: EAAxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-sm text-gray-500 mt-1">
              Meta Business Suite'den aldığınız API anahtarını girin
            </p>
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
            {loading ? 'Bağlanıyor...' : 'Bağlan ve Devam Et'}
          </button>
        </form>
      )}
    </div>
  );
}
