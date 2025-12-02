import { useState, useEffect } from 'react';
import { Bot, Save, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface BotConfig {
  id: string;
  name: string;
  provider: string;
  model: string;
  system_prompt: string;
  temperature: number;
  max_tokens: number;
  is_active: boolean;
  fallback_to_human: boolean;
  auto_learn: boolean;
}

export function AIChatbot() {
  const { user } = useAuth();
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: 'SiparişBot AI',
    provider: 'openai',
    model: 'gpt-4',
    system_prompt: `Sen bir e-ticaret müşteri hizmetleri asistanısın. Görevin müşterilere yardımcı olmak, sipariş durumlarını kontrol etmek ve ürün bilgileri vermek.

Kuralllar:
- Daima kibar ve profesyonel ol
- Müşteri bilgilerini gizli tut
- Eğer bir soruyu cevaplayamıyorsanız, insan temsilciye yönlendir
- Sipariş numaralarını ve müşteri bilgilerini doğrula
- Kısa ve net yanıtlar ver`,
    temperature: 0.7,
    max_tokens: 500,
    is_active: false,
    fallback_to_human: true,
    auto_learn: false,
  });

  useEffect(() => {
    loadBotConfig();
  }, [user]);

  const loadBotConfig = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('ai_bot_configs')
      .select('*')
      .eq('business_id', user.id)
      .maybeSingle();

    if (data) {
      setConfig(data);
      setFormData({
        name: data.name,
        provider: data.provider,
        model: data.model,
        system_prompt: data.system_prompt,
        temperature: data.temperature,
        max_tokens: data.max_tokens,
        is_active: data.is_active,
        fallback_to_human: data.fallback_to_human,
        auto_learn: data.auto_learn,
      });
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    const configData = {
      ...formData,
      business_id: user.id,
    };

    let error;

    if (config) {
      const result = await supabase
        .from('ai_bot_configs')
        .update(configData)
        .eq('id', config.id);
      error = result.error;
    } else {
      const result = await supabase.from('ai_bot_configs').insert(configData);
      error = result.error;
    }

    if (!error) {
      await loadBotConfig();
    }

    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Chatbot</h2>
          <p className="text-gray-600 mt-1">Müşterilerinize 7/24 otomatik yanıt verin</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="font-medium text-gray-700">Aktif</span>
          </label>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Bot className="text-white" size={28} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">AI Destekli Müşteri Hizmetleri</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              OpenAI GPT-4 ile çalışan chatbot, müşterilerinizin sorularını anında yanıtlar, sipariş
              durumlarını kontrol eder ve ihtiyaç halinde insan temsilciye yönlendirir. Müşteri
              memnuniyetini artırın, iş yükünüzü azaltın.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temel Ayarlar</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bot Adı
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Sağlayıcı
              </label>
              <select
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic (Claude)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {formData.provider === 'openai' ? (
                  <>
                    <option value="gpt-4">GPT-4 (En İyi)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Hızlı)</option>
                  </>
                ) : (
                  <>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yaratıcılık (Temperature): {formData.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={formData.temperature}
                onChange={(e) =>
                  setFormData({ ...formData, temperature: parseFloat(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Kesin</span>
                <span>Dengeli</span>
                <span>Yaratıcı</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maksimum Token
              </label>
              <input
                type="number"
                value={formData.max_tokens}
                onChange={(e) =>
                  setFormData({ ...formData, max_tokens: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Davranış Ayarları</h3>
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.fallback_to_human}
                onChange={(e) =>
                  setFormData({ ...formData, fallback_to_human: e.target.checked })
                }
                className="mt-1 w-5 h-5 text-blue-600 rounded"
              />
              <div>
                <div className="font-medium text-gray-900">İnsan Temsilciye Yönlendir</div>
                <div className="text-sm text-gray-600">
                  Bot cevap veremediğinde otomatik olarak insan temsilciye yönlendir
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.auto_learn}
                onChange={(e) =>
                  setFormData({ ...formData, auto_learn: e.target.checked })
                }
                className="mt-1 w-5 h-5 text-blue-600 rounded"
              />
              <div>
                <div className="font-medium text-gray-900">Otomatik Öğrenme</div>
                <div className="text-sm text-gray-600">
                  Bot, müşteri etkileşimlerinden öğrenerek zamanla daha iyi yanıtlar verir
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Promptu</h3>
        <p className="text-sm text-gray-600 mb-4">
          Bu prompt, botun kişiliğini ve davranışını belirler. Botunuza nasıl davranmasını
          istediğinizi açıklayın.
        </p>
        <textarea
          value={formData.system_prompt}
          onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
          rows={12}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50 font-semibold"
        >
          <Save size={20} />
          {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </button>
      </div>
    </div>
  );
}
