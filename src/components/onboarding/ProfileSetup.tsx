import { useState, useEffect } from 'react';
import { Building2, Phone, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProfileSetupProps {
  workspaceId: string;
  onComplete: () => void;
}

export function ProfileSetup({ workspaceId, onComplete }: ProfileSetupProps) {
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, [workspaceId]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from('workspaces')
      .select('business_name, phone')
      .eq('id', workspaceId)
      .maybeSingle();

    if (data) {
      setBusinessName(data.business_name || '');
      setPhone(data.phone || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!businessName.trim()) {
      setError('İşletme adı gereklidir');
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('workspaces')
      .update({
        business_name: businessName,
        phone: phone,
      })
      .eq('id', workspaceId);

    if (updateError) {
      setError('Profil güncellenirken hata oluştu');
      setLoading(false);
      return;
    }

    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Building2 className="inline mr-2" size={16} />
          İşletme Adı *
        </label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Örn: ABC E-ticaret"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="inline mr-2" size={16} />
          Telefon Numarası
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+90 555 123 4567"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          WhatsApp Business için kullanacağınız numara
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
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Save size={20} />
        {loading ? 'Kaydediliyor...' : 'Kaydet ve Devam Et'}
      </button>
    </form>
  );
}
