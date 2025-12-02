import { useState, useEffect } from 'react';
import { MessageSquare, Mail, Smartphone, Instagram, Facebook, Monitor } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Channel {
  id: string;
  type: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export function MultiChannelHub() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChannels();
  }, [user]);

  const loadChannels = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('channels')
      .select('*')
      .eq('business_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setChannels(data);
    }
    setLoading(false);
  };

  const channelConfig = {
    whatsapp: {
      icon: MessageSquare,
      name: 'WhatsApp Business',
      color: 'bg-green-50 text-green-600 border-green-200',
      description: 'WhatsApp Business API ile müşterilerinizle iletişime geçin',
    },
    email: {
      icon: Mail,
      name: 'E-posta',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      description: 'E-posta ile destek ve bilgilendirme mesajları gönderin',
    },
    sms: {
      icon: Smartphone,
      name: 'SMS',
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      description: 'SMS ile anında bildirimler ve hatırlatmalar',
    },
    instagram: {
      icon: Instagram,
      name: 'Instagram Direct',
      color: 'bg-pink-50 text-pink-600 border-pink-200',
      description: 'Instagram mesajlarınızı tek yerden yönetin',
    },
    facebook: {
      icon: Facebook,
      name: 'Facebook Messenger',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      description: 'Facebook Messenger ile müşteri desteği',
    },
    webchat: {
      icon: Monitor,
      name: 'Web Chat',
      color: 'bg-gray-50 text-gray-600 border-gray-200',
      description: 'Web sitenize canlı chat widget ekleyin',
    },
  };

  const getChannelStatus = (type: string) => {
    return channels.find((c) => c.type === type);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Çok Kanallı İletişim</h2>
        <p className="text-gray-600 mt-1">
          Tüm iletişim kanallarınızı tek platformdan yönetin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(channelConfig).map(([type, config]) => {
          const Icon = config.icon;
          const channelStatus = getChannelStatus(type);
          const isActive = channelStatus?.is_active || false;

          return (
            <div
              key={type}
              className={`rounded-xl border-2 p-6 transition ${
                isActive ? config.color : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive ? 'bg-white bg-opacity-50' : 'bg-gray-100'
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{config.name}</h3>
                    <p className="text-sm text-gray-600">{config.description}</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                {isActive ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">✓ Aktif</span>
                    <button className="text-sm text-gray-600 hover:text-gray-900 transition">
                      Ayarlar
                    </button>
                  </div>
                ) : (
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium">
                    Bağla
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-3">Neden Çok Kanallı?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <div className="text-3xl font-bold mb-2">%85</div>
            <p className="text-blue-100">
              Müşteriler tercih ettikleri kanaldan iletişim kurmayı tercih ediyor
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">3x</div>
            <p className="text-blue-100">Daha hızlı müşteri yanıt süreleri</p>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">%40</div>
            <p className="text-blue-100">Müşteri memnuniyetinde artış</p>
          </div>
        </div>
      </div>
    </div>
  );
}
