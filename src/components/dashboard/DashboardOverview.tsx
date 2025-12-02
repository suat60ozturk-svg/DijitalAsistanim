import { useEffect, useState } from 'react';
import { ShoppingBag, Users, TrendingUp, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Stats {
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  messagesSent: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    messagesSent: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    const [ordersData, customersData, analyticsData] = await Promise.all([
      supabase
        .from('orders')
        .select('total_amount, customers(name), order_number, status, created_at, id')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase
        .from('analytics')
        .select('total_revenue, messages_sent')
        .order('date', { ascending: false })
        .limit(30),
    ]);

    if (ordersData.data) {
      const totalOrders = ordersData.data.length;
      const totalRevenue = ordersData.data.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      setRecentOrders(
        ordersData.data.map((order: any) => ({
          id: order.id,
          order_number: order.order_number,
          customer_name: order.customers?.name || 'Bilinmeyen',
          total_amount: order.total_amount,
          status: order.status,
          created_at: order.created_at,
        }))
      );

      setStats((prev) => ({ ...prev, totalOrders, totalRevenue }));
    }

    if (customersData.count !== null) {
      setStats((prev) => ({ ...prev, totalCustomers: customersData.count || 0 }));
    }

    if (analyticsData.data) {
      const messagesSent = analyticsData.data.reduce(
        (sum, day) => sum + (day.messages_sent || 0),
        0
      );
      setStats((prev) => ({ ...prev, messagesSent }));
    }

    setLoading(false);
  };

  const statCards = [
    {
      label: 'Toplam Sipariş',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Müşteriler',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Toplam Ciro',
      value: `₺${stats.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Gönderilen Mesaj',
      value: stats.messagesSent,
      icon: MessageSquare,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Genel Bakış</h2>
        <p className="text-gray-600 mt-1">İşletmenizin genel durumu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Son Siparişler</h3>
        </div>
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
                  Tarih
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Henüz sipariş bulunmuyor
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
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
                      {new Date(order.created_at).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
