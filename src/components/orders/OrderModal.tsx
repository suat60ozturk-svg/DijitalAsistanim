import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface OrderModalProps {
  order: any | null;
  onClose: () => void;
  onSave: () => void;
}

export function OrderModal({ order, onClose, onSave }: OrderModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customer_id: order?.customer_id || '',
    order_number: order?.order_number || `SIP-${Date.now()}`,
    total_amount: order?.total_amount || '',
    status: order?.status || 'pending',
    marketplace: order?.marketplace || 'whatsapp',
    shipping_address: order?.shipping_address || '',
    tracking_number: order?.tracking_number || '',
    notes: order?.notes || '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const { data } = await supabase
      .from('customers')
      .select('id, name, phone')
      .order('name');

    if (data) {
      setCustomers(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const orderData = {
      ...formData,
      business_id: user.id,
      total_amount: parseFloat(formData.total_amount as any),
      items: [],
    };

    let error;

    if (order) {
      const result = await supabase
        .from('orders')
        .update(orderData)
        .eq('id', order.id);
      error = result.error;
    } else {
      const result = await supabase.from('orders').insert(orderData);
      error = result.error;
    }

    setLoading(false);

    if (!error) {
      onSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            {order ? 'Sipariş Düzenle' : 'Yeni Sipariş'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sipariş No
              </label>
              <input
                type="text"
                value={formData.order_number}
                onChange={(e) =>
                  setFormData({ ...formData, order_number: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Müşteri
              </label>
              <select
                value={formData.customer_id}
                onChange={(e) =>
                  setFormData({ ...formData, customer_id: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Müşteri Seçin</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tutar (₺)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.total_amount}
                onChange={(e) =>
                  setFormData({ ...formData, total_amount: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durum
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Bekliyor</option>
                <option value="confirmed">Onaylandı</option>
                <option value="shipped">Kargoda</option>
                <option value="delivered">Teslim Edildi</option>
                <option value="cancelled">İptal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={formData.marketplace}
                onChange={(e) =>
                  setFormData({ ...formData, marketplace: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="trendyol">Trendyol</option>
                <option value="n11">N11</option>
                <option value="hepsiburada">Hepsiburada</option>
                <option value="other">Diğer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kargo Takip No
              </label>
              <input
                type="text"
                value={formData.tracking_number}
                onChange={(e) =>
                  setFormData({ ...formData, tracking_number: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teslimat Adresi
            </label>
            <textarea
              value={formData.shipping_address}
              onChange={(e) =>
                setFormData({ ...formData, shipping_address: e.target.value })
              }
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notlar
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
