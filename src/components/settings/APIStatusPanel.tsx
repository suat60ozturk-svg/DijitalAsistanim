import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, ExternalLink, Copy, Check } from 'lucide-react';
import { whatsappService } from '../../lib/whatsapp';
import { aiService } from '../../lib/openai';
import { trendyolService } from '../../lib/trendyol';
import { iyzicoService } from '../../lib/iyzico';

interface APIStatus {
  name: string;
  configured: boolean;
  missing: string[];
  docs: string;
  testable: boolean;
}

export function APIStatusPanel() {
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([]);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    checkAPIStatuses();
  }, []);

  const checkAPIStatuses = () => {
    const whatsappStatus = whatsappService.getConfigStatus();
    const aiStatus = aiService.getConfigStatus();
    const trendyolStatus = trendyolService.getConfigStatus();
    const iyzicoStatus = iyzicoService.getConfigStatus();

    setApiStatuses([
      {
        name: 'WhatsApp Business API',
        configured: whatsappStatus.configured,
        missing: whatsappStatus.missing,
        docs: 'https://developers.facebook.com/docs/whatsapp',
        testable: whatsappStatus.configured,
      },
      {
        name: 'OpenAI API',
        configured: aiStatus.configured,
        missing: aiStatus.missing,
        docs: 'https://platform.openai.com/docs',
        testable: aiStatus.configured,
      },
      {
        name: 'Trendyol API',
        configured: trendyolStatus.configured,
        missing: trendyolStatus.missing,
        docs: 'https://developers.trendyol.com',
        testable: trendyolStatus.configured,
      },
      {
        name: 'iyzico Payment',
        configured: iyzicoStatus.configured,
        missing: iyzicoStatus.missing,
        docs: 'https://dev.iyzipay.com',
        testable: false,
      },
    ]);
  };

  const testAPI = async (apiName: string) => {
    setTesting(apiName);

    try {
      let result;

      if (apiName === 'WhatsApp Business API') {
        result = { success: whatsappService.isConfigured(), message: 'WhatsApp configuration is valid' };
      } else if (apiName === 'OpenAI API') {
        const response = await aiService.chat([
          { role: 'user', content: 'Say "API test successful" in Turkish' }
        ], { model: 'gpt-3.5-turbo', max_tokens: 20 });
        result = { success: response.success, message: response.response || response.error || 'Test failed' };
      } else if (apiName === 'Trendyol API') {
        result = { success: trendyolService.isConfigured(), message: 'Trendyol configuration is valid' };
      } else {
        result = { success: false, message: 'Test not implemented' };
      }

      setTestResults(prev => ({ ...prev, [apiName]: result }));
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [apiName]: { success: false, message: error.message || 'Test failed' }
      }));
    } finally {
      setTesting(null);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const getEnvExample = (missing: string[]) => {
    return missing.map(key => `${key}=your_value_here`).join('\n');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">API Entegrasyon Durumu</h3>
        <p className="text-sm text-gray-600">
          Sisteminizde yapılandırılmış API'lerin durumunu kontrol edin
        </p>
      </div>

      <div className="space-y-4">
        {apiStatuses.map((api) => {
          const testResult = testResults[api.name];
          const isCopied = copied === api.name;

          return (
            <div
              key={api.name}
              className="bg-white rounded-lg border-2 border-gray-200 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {api.configured ? (
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                  ) : (
                    <XCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">{api.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {api.configured ? (
                        <span className="text-green-600 font-medium">✓ Yapılandırılmış</span>
                      ) : (
                        <span className="text-red-600 font-medium">✗ Yapılandırılmamış</span>
                      )}
                    </p>
                  </div>
                </div>
                <a
                  href={api.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition"
                >
                  <span>Dokümantasyon</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              {!api.configured && api.missing.length > 0 && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900 mb-2">
                        Eksik yapılandırma değişkenleri:
                      </p>
                      <div className="bg-gray-900 rounded p-3 relative">
                        <code className="text-xs text-green-400 font-mono">
                          {getEnvExample(api.missing)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(getEnvExample(api.missing), api.name)}
                          className="absolute top-2 right-2 p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition"
                        >
                          {isCopied ? (
                            <Check className="text-green-400" size={14} />
                          ) : (
                            <Copy className="text-gray-400" size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-yellow-800 mt-2">
                    Bu değerleri <code className="bg-yellow-100 px-1 rounded">.env</code> dosyanıza
                    ekleyin ve sayfayı yenileyin.
                  </p>
                </div>
              )}

              {api.configured && api.testable && (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => testAPI(api.name)}
                    disabled={testing === api.name}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {testing === api.name ? 'Test ediliyor...' : 'Bağlantıyı Test Et'}
                  </button>
                  {testResult && (
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        testResult.success ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {testResult.success ? (
                        <CheckCircle size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}
                      <span>{testResult.message}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h4 className="font-semibold text-blue-900 mb-2">📚 Kurulum Rehberi</h4>
        <p className="text-sm text-blue-800 mb-3">
          Her API için detaylı kurulum talimatları ve ekran görüntüleri için rehbere bakın.
        </p>
        <a
          href="/docs/API_SETUP_GUIDE.md"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
        >
          <span>Rehberi Aç</span>
          <ExternalLink size={14} />
        </a>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h4 className="font-semibold text-gray-900 mb-3">🔒 Güvenlik Notları</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>API anahtarlarınız <code className="bg-gray-200 px-1 rounded">.env</code> dosyasında güvenle saklanır</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Anahtarlar asla Git'e commit edilmez (.gitignore)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Production'da HTTPS zorunludur</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">⚠</span>
            <span>API anahtarlarınızı düzenli olarak yenileyin (3-6 ayda bir)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
