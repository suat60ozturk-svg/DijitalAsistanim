import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface DailyStats {
  date: string;
  total_orders: number;
  total_revenue: number;
  new_customers: number;
}

export function AnalyticsView() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    revenueChange: 0,
    ordersChange: 0,
  });
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [ordersData, customersData] = await Promise.all([
      supabase
        .from('orders')
        .select('total_amount, created_at')
        .gte('created_at', sixtyDaysAgo.toISOString()),
      supabase.from('customers').select('id', { count: 'exact', head: true }),
    ]);

    if (ordersData.data) {
      const last30Days = ordersData.data.filter(
        (order: any) => new Date(order.created_at) >= thirtyDaysAgo
      );
      const previous30Days = ordersData.data.filter(
        (order: any) =>
          new Date(order.created_at) < thirtyDaysAgo &&
          new Date(order.created_at) >= sixtyDaysAgo
      );

      const totalRevenue = last30Days.reduce((sum, order: any) => sum + order.total_amount, 0);
      const previousRevenue = previous30Days.reduce(
        (sum, order: any) => sum + order.total_amount,
        0
      );
      const totalOrders = last30Days.length;
      const previousOrders = previous30Days.length;

      const revenueChange =
        previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
      const ordersChange =
        previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders) * 100 : 0;

      const dailyMap = new Map<string, DailyStats>();

      last30Days.forEach((order: any) => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        const existing = dailyMap.get(date) || {
          date,
          total_orders: 0,
          total_revenue: 0,
          new_customers: 0,
        };

        dailyMap.set(date, {
          ...existing,
          total_orders: existing.total_orders + 1,
          total_revenue: existing.total_revenue + order.total_amount,
        });
      });

      const sortedDaily = Array.from(dailyMap.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers: customersData.count || 0,
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        revenueChange,
        ordersChange,
      });

      setDailyStats(sortedDaily);
    }

    setLoading(false);
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    change,
    color,
  }: {
    icon: any;
    label: string;
    value: string;
    change?: number;
    color: string;
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} />
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );

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
        <h2 className="text-2xl font-bold text-gray-900">Raporlar ve Analizler</h2>
        <p className="text-gray-600 mt-1">Son 30 günlük performans özeti</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          label="Toplam Ciro"
          value={`₺${stats.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
          change={stats.revenueChange}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={ShoppingBag}
          label="Toplam Sipariş"
          value={stats.totalOrders.toString()}
          change={stats.ordersChange}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={Users}
          label="Toplam Müşteri"
          value={stats.totalCustomers.toString()}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          icon={MessageSquare}
          label="Ortalama Sipariş"
          value={`₺${stats.avgOrderValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
          color="bg-orange-50 text-orange-600"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Günlük Satış Trendi</h3>
          <p className="text-sm text-gray-600 mt-1">Son 30 günlük sipariş ve ciro grafiği</p>
        </div>
        <div className="p-6">
          {dailyStats.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Henüz veri bulunmuyor. Sipariş eklendikçe grafikler burada görünecek.
            </div>
          ) : (
            <div className="space-y-4">
              {dailyStats.slice(-10).map((day, index) => {
                const maxRevenue = Math.max(...dailyStats.map((d) => d.total_revenue));
                const barWidth = maxRevenue > 0 ? (day.total_revenue / maxRevenue) * 100 : 0;

                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(day.date).toLocaleDateString('tr-TR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          {day.total_orders} sipariş
                        </span>
                        <span className="font-semibold text-gray-900">
                          ₺{day.total_revenue.toLocaleString('tr-TR', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performans Özeti</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">En yüksek günlük ciro</span>
              <span className="font-semibold text-gray-900">
                ₺
                {Math.max(...dailyStats.map((d) => d.total_revenue), 0).toLocaleString('tr-TR', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">En yüksek günlük sipariş</span>
              <span className="font-semibold text-gray-900">
                {Math.max(...dailyStats.map((d) => d.total_orders), 0)} adet
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ortalama günlük ciro</span>
              <span className="font-semibold text-gray-900">
                ₺
                {dailyStats.length > 0
                  ? (
                      dailyStats.reduce((sum, d) => sum + d.total_revenue, 0) / dailyStats.length
                    ).toLocaleString('tr-TR', { minimumFractionDigits: 2 })
                  : '0,00'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Büyüme Analizi</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Ciro Değişimi</span>
                <span
                  className={`font-semibold ${
                    stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stats.revenueChange >= 0 ? '+' : ''}
                  {stats.revenueChange.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-full rounded-full ${
                    stats.revenueChange >= 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(Math.abs(stats.revenueChange), 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Sipariş Değişimi</span>
                <span
                  className={`font-semibold ${
                    stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stats.ordersChange >= 0 ? '+' : ''}
                  {stats.ordersChange.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-full rounded-full ${
                    stats.ordersChange >= 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(Math.abs(stats.ordersChange), 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
