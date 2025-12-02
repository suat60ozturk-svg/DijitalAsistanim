import { useEffect, useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { OrderModal } from './OrderModal';

interface Order {
  id: string;
  order_number: string;
  customer: { name: string; phone: string } | null;
  total_amount: number;
  status: string;
  marketplace: string;
  created_at: string;
  tracking_number: string | null;
}

export function OrdersView() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, [user]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('orders')
      .select('*, customer:customers(name, phone)')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setOrders(data as any);
    }
    setLoading(false);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const statusLabels: Record<string, string> = {
    pending: 'Bekliyor',
    confirmed: 'Onaylandı',
    shipped: 'Kargoda',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const marketplaceLabels: Record<string, string> = {
    whatsapp: 'WhatsApp',
    trendyol: 'Trendyol',
    n11: 'N11',
    hepsiburada: 'Hepsiburada',
    other: 'Diğer',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Siparişler</h2>
          <p className="text-gray-600 mt-1">Tüm siparişlerinizi yönetin</p>
        </div>
        <button
          onClick={() => {
            setSelectedOrder(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          Yeni Sipariş
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Sipariş no veya müşteri adı ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="pending">Bekliyor</option>
              <option value="confirmed">Onaylandı</option>
              <option value="shipped">Kargoda</option>
              <option value="delivered">Teslim Edildi</option>
              <option value="cancelled">İptal</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sipariş No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tutar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Arama kriterlerine uygun sipariş bulunamadı'
                        : 'Henüz sipariş bulunmuyor. Yeni sipariş ekleyerek başlayın.'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                      className="hover:bg-gray-50 cursor-pointer transition"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.customer?.name || 'Bilinmeyen'}</div>
                        <div className="text-xs text-gray-500">{order.customer?.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₺{order.total_amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            statusColors[order.status]
                          }`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {marketplaceLabels[order.marketplace]}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(order.created_at).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <OrderModal
          order={selectedOrder}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
          onSave={() => {
            loadOrders();
            setShowModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
