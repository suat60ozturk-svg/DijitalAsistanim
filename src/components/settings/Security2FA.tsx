import { useState } from 'react';
import { Shield, Smartphone, Key, CheckCircle } from 'lucide-react';

export function Security2FA() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const enable2FA = () => {
    setShowQR(true);
  };

  const verify2FA = () => {
    setIs2FAEnabled(true);
    setShowQR(false);
    setVerificationCode('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield size={20} />
            İki Faktörlü Doğrulama (2FA)
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Hesabınıza ekstra güvenlik katmanı ekleyin
          </p>
        </div>
        <div className="flex items-center gap-2">
          {is2FAEnabled && (
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <CheckCircle size={16} />
              Aktif
            </span>
          )}
        </div>
      </div>

      {!is2FAEnabled && !showQR && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Smartphone className="text-blue-600" size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">
                2FA ile hesabınızı koruyun
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                İki faktörlü doğrulama, hesabınıza giriş yaparken şifrenize ek olarak telefonunuzdan
                bir doğrulama kodu isteyerek güvenliğinizi artırır.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Yetkisiz erişimlere karşı ekstra koruma</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Google Authenticator veya Authy uygulamaları ile çalışır</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>30 saniyede kolay kurulum</span>
                </li>
              </ul>
              <button
                onClick={enable2FA}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-medium"
              >
                2FA'yı Etkinleştir
              </button>
            </div>
          </div>
        </div>
      )}

      {showQR && !is2FAEnabled && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4">2FA Kurulumu</h4>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                1. Telefonunuza Google Authenticator veya Authy uygulamasını indirin
              </p>
              <p className="text-sm text-gray-600 mb-4">
                2. Uygulamada QR kodu tarayın veya aşağıdaki kodu manuel olarak girin
              </p>
            </div>

            <div className="flex justify-center p-6 bg-gray-50 rounded-lg">
              <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                <Key className="text-gray-400" size={48} />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">Manuel Giriş Kodu:</p>
              <code className="text-sm text-blue-800 font-mono">
                JBSWY3DPEHPK3PXP
              </code>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doğrulama Kodu
              </label>
              <input
                type="text"
                placeholder="6 haneli kod"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowQR(false)}
                className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                İptal
              </button>
              <button
                onClick={verify2FA}
                disabled={verificationCode.length !== 6}
                className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
              >
                Doğrula ve Etkinleştir
              </button>
            </div>
          </div>
        </div>
      )}

      {is2FAEnabled && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 mb-2">
                2FA Başarıyla Etkinleştirildi
              </h4>
              <p className="text-green-800 text-sm mb-4">
                Hesabınız artık iki faktörlü doğrulama ile korunuyor. Giriş yaparken telefonunuzdan
                doğrulama kodu girmeniz istenecek.
              </p>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                2FA'yı Devre Dışı Bırak
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-sm text-yellow-800">
          <strong>Önemli:</strong> 2FA'yı etkinleştirdikten sonra yedek kodlarınızı güvenli bir
          yere kaydedin. Telefonunuza erişiminizi kaybederseniz bu kodlar hesabınıza giriş yapmanızı
          sağlar.
        </p>
      </div>
    </div>
  );
}
