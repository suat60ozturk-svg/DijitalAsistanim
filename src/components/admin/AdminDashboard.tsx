import { useState, useEffect } from 'react';
import { Users, Package, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface WorkspaceStats {
  id: string;
  business_name: string;
  owner_email: string;
  plan_tier: string;
  status: string;
  trial_ends_at: string;
  created_at: string;
  total_orders: number;
  total_customers: number;
  monthly_revenue: number;
}

export function AdminDashboard() {
  const [workspaces, setWorkspaces] = useState<WorkspaceStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorkspaces: 0,
    activeSubscriptions: 0,
    trialAccounts: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    const { data: workspacesData } = await supabase
      .from('workspaces')
      .select(`
        id,
        business_name,
        created_at,
        owner_id,
        subscriptions(plan_tier, status, trial_ends_at)
      `);

    if (workspacesData) {
      const enrichedData = await Promise.all(
        workspacesData.map(async (workspace: any) => {
          const { data: ordersCount } = await supabase
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('workspace_id', workspace.id);

          const { data: customersCount } = await supabase
            .from('customers')
            .select('id', { count: 'exact', head: true })
            .eq('workspace_id', workspace.id);

          const { data: userData } = await supabase.auth.admin.getUserById(workspace.owner_id);

          const sub = workspace.subscriptions?.[0];

          return {
            id: workspace.id,
            business_name: workspace.business_name,
            owner_email: userData?.user?.email || '',
            plan_tier: sub?.plan_tier || 'trial',
            status: sub?.status || 'trial',
            trial_ends_at: sub?.trial_ends_at || '',
            created_at: workspace.created_at,
            total_orders: ordersCount?.length || 0,
            total_customers: customersCount?.length || 0,
            monthly_revenue: 0,
          };
        })
      );

      setWorkspaces(enrichedData);

      setStats({
        totalWorkspaces: enrichedData.length,
        activeSubscriptions: enrichedData.filter((w) => w.status === 'active').length,
        trialAccounts: enrichedData.filter((w) => w.status === 'trial').length,
        totalRevenue: enrichedData.reduce((sum, w) => {
          const prices = { starter: 1499, professional: 2999, enterprise: 5999 };
          return sum + (w.status === 'active' ? prices[w.plan_tier as keyof typeof prices] || 0 : 0);
        }, 0),
      });
    }

    setLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-1">Tüm müşteri ve sistem istatistiklerini görüntüleyin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="text-blue-600" size={24} />
            <Activity className="text-green-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalWorkspaces}</p>
          <p className="text-sm text-gray-600">Toplam Müşteri</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="text-green-600" size={24} />
            <Activity className="text-green-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
          <p className="text-sm text-gray-600">Aktif Abonelik</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-yellow-600" size={24} />
            <Activity className="text-yellow-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.trialAccounts}</p>
          <p className="text-sm text-gray-600">Deneme Hesabı</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="text-green-600" size={24} />
            <Activity className="text-green-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">₺{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Aylık Gelir (MRR)</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Müşteri Listesi</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  İşletme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  E-posta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sipariş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kayıt Tarihi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {workspaces.map((workspace) => (
                <tr key={workspace.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{workspace.business_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {workspace.owner_email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                      {workspace.plan_tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        workspace.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : workspace.status === 'trial'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {workspace.status === 'active'
                        ? 'Aktif'
                        : workspace.status === 'trial'
                        ? 'Deneme'
                        : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {workspace.total_orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {workspace.total_customers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(workspace.created_at), 'dd.MM.yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
