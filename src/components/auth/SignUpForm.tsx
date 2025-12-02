import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function SignUpForm({ onToggle }: { onToggle: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, businessName);

    if (error) {
      if (error.message.includes('already registered')) {
        setError('Bu e-posta adresi zaten kullanılıyor');
      } else {
        setError('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">14 Gün Ücretsiz Deneyin</h2>
      <p className="text-gray-600 mb-8">Kredi kartı gerektirmez, hemen başlayın</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
            İşletme Adı
          </label>
          <input
            id="businessName"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Örnek E-ticaret"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="ornek@sirket.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="En az 6 karakter"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Hesap oluşturuluyor...' : 'Ücretsiz Başla'}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Zaten hesabınız var mı?{' '}
        <button
          onClick={onToggle}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Giriş Yap
        </button>
      </p>
    </div>
  );
}
