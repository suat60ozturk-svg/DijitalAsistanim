import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface Subscription {
  id: string;
  plan_tier: string;
  status: string;
  trial_ends_at: string;
  current_period_end: string;
  monthly_price: number;
  cancel_at_period_end: boolean;
}

interface SubscriptionManagerProps {
  workspaceId: string;
}

const plans = {
  starter: {
    name: 'Starter',
    price: 1499,
    features: ['100 sipariş/ay', 'WhatsApp entegrasyonu', 'Temel raporlar', 'E-posta destek'],
  },
  professional: {
    name: 'Professional',
    price: 2999,
    features: [
      '500 sipariş/ay',
      'AI chatbot',
      'Tüm entegrasyonlar',
      'Gelişmiş raporlar',
      'Öncelikli destek',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 5999,
    features: [
      'Sınırsız sipariş',
      'Özel AI eğitimi',
      'API erişimi',
      'Özel entegrasyonlar',
      '7/24 destek',
    ],
  },
};

export function SubscriptionManager({ workspaceId }: SubscriptionManagerProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, [workspaceId]);

  const loadSubscription = async () => {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('workspace_id', workspaceId)
      .maybeSingle();

    if (data) {
      setSubscription(data);
    }
    setLoading(false);
  };

  const handleUpgrade = async (planTier: string) => {
    setUpgrading(true);

    const newPrice = plans[planTier as keyof typeof plans].price;

    const { error } = await supabase
      .from('subscriptions')
      .update({
        plan_tier: planTier,
        monthly_price: newPrice,
        status: 'active',
      })
      .eq('workspace_id', workspaceId);

    if (!error) {
      await loadSubscription();
    }

    setUpgrading(false);
  };

  const handleCancelSubscription = async () => {
    const confirmed = confirm(
      'Aboneliğinizi iptal etmek istediğinizden emin misiniz? Mevcut dönem sonuna kadar hizmetiniz devam edecektir.'
    );

    if (!confirmed) return;

    await supabase
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('workspace_id', workspaceId);

    await loadSubscription();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentPlan = subscription ? plans[subscription.plan_tier as keyof typeof plans] : null;
  const isTrial = subscription?.status === 'trial';

  return (
    <div className="space-y-6">
      {subscription && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mevcut Paket</h2>
              <div className="flex items-center gap-2">
                {isTrial ? (
                  <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                    <AlertCircle size={16} />
                    Deneme Sürümü
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    <CheckCircle size={16} />
                    Aktif
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">
                ₺{currentPlan?.price}
                <span className="text-lg text-gray-600">/ay</span>
              </p>
              <p className="text-sm font-semibold text-gray-700 mt-1">{currentPlan?.name}</p>
            </div>
          </div>

          <div className="border-t pt-6 space-y-3">
            {isTrial && subscription.trial_ends_at && (
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={20} />
                <span>
                  Deneme süresi:{' '}
                  <strong>{format(new Date(subscription.trial_ends_at), 'dd MMMM yyyy')}</strong>{' '}
                  tarihinde sona eriyor
                </span>
              </div>
            )}

            {!isTrial && subscription.current_period_end && (
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={20} />
                <span>
                  Sonraki ödeme:{' '}
                  <strong>{format(new Date(subscription.current_period_end), 'dd MMMM yyyy')}</strong>
                </span>
              </div>
            )}

            {subscription.cancel_at_period_end && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm">
                  Aboneliğiniz dönem sonunda iptal edilecektir.
                </p>
              </div>
            )}
          </div>

          {!subscription.cancel_at_period_end && !isTrial && (
            <button
              onClick={handleCancelSubscription}
              className="mt-6 text-red-600 hover:text-red-700 font-semibold text-sm"
            >
              Aboneliği İptal Et
            </button>
          )}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Diğer Paketler</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(plans).map(([tier, plan]) => {
            const isCurrentPlan = subscription?.plan_tier === tier;
            const canUpgrade = !isCurrentPlan;

            return (
              <div
                key={tier}
                className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition ${
                  isCurrentPlan ? 'border-blue-600' : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {isCurrentPlan && (
                  <div className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    MEV CUT PAKET
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">₺{plan.price}</span>
                  <span className="text-gray-600">/ay</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-gray-700 text-sm">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {canUpgrade ? (
                  <button
                    onClick={() => handleUpgrade(tier)}
                    disabled={upgrading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CreditCard size={20} />
                    {upgrading ? 'Güncelleniyor...' : 'Bu Pakete Geç'}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-400 font-semibold py-3 rounded-xl cursor-not-allowed"
                  >
                    Mevcut Paket
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
