import { useEffect, useState } from 'react';
import { History, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface AuditLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  created_at: string;
  user: { email: string } | null;
}

export function AuditLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadLogs();
  }, [user]);

  const loadLogs = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('audit_logs')
      .select(`
        *,
        user:auth.users(email)
      `)
      .eq('business_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (data) {
      setLogs(data as any);
    }
    setLoading(false);
  };

  const actionLabels: Record<string, string> = {
    create: 'Oluşturuldu',
    update: 'Güncellendi',
    delete: 'Silindi',
    login: 'Giriş Yapıldı',
    logout: 'Çıkış Yapıldı',
    export: 'Dışa Aktarıldı',
  };

  const actionColors: Record<string, string> = {
    create: 'bg-green-100 text-green-800',
    update: 'bg-blue-100 text-blue-800',
    delete: 'bg-red-100 text-red-800',
    login: 'bg-purple-100 text-purple-800',
    logout: 'bg-gray-100 text-gray-800',
    export: 'bg-orange-100 text-orange-800',
  };

  const filteredLogs =
    filter === 'all' ? logs : logs.filter((log) => log.action === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <History size={20} />
            Aktivite Günlüğü
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Hesabınızdaki tüm değişiklikleri görüntüleyin
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Aktiviteler</option>
            <option value="create">Oluşturma</option>
            <option value="update">Güncelleme</option>
            <option value="delete">Silme</option>
            <option value="login">Giriş</option>
            <option value="logout">Çıkış</option>
            <option value="export">Dışa Aktarma</option>
          </select>
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
                    İşlem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kaynak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tarih & Saat
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      Henüz aktivite kaydı bulunmuyor
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            actionColors[log.action] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {actionLabels[log.action] || log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                        {log.resource_type}
                        {log.resource_id && (
                          <span className="text-gray-500 text-xs ml-1">
                            #{log.resource_id.slice(0, 8)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {(log.user as any)?.email || 'Sistem'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(log.created_at).toLocaleString('tr-TR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Bilgi:</strong> Aktivite günlükleri 90 gün boyunca saklanır ve sadece okunabilir.
          Güvenlik ve uyumluluk amaçlı kayıtlar değiştirilemez.
        </p>
      </div>
    </div>
  );
}
