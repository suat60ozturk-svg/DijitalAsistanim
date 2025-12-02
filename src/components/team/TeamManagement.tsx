import { useEffect, useState } from 'react';
import { Users, Plus, Mail, Shield, UserX } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  is_active: boolean;
  joined_at: string;
  user: {
    email: string;
  };
}

export function TeamManagement() {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('agent');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    loadTeam();
  }, [user]);

  const loadTeam = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('team_members')
      .select(`
        *,
        user:auth.users(email)
      `)
      .eq('business_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setMembers(data as any);
    }
    setLoading(false);
  };

  const roleLabels: Record<string, string> = {
    admin: 'Yönetici',
    manager: 'Müdür',
    agent: 'Temsilci',
    viewer: 'Görüntüleyici',
  };

  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-blue-100 text-blue-800',
    agent: 'bg-green-100 text-green-800',
    viewer: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Ekip Yönetimi</h2>
        <p className="text-gray-600 mt-1">Ekip üyelerini yönetin ve yetkilendirin</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Mail size={20} />
          Yeni Üye Davet Et
        </h3>
        <div className="flex gap-3">
          <input
            type="email"
            placeholder="email@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="admin">Yönetici</option>
            <option value="manager">Müdür</option>
            <option value="agent">Temsilci</option>
            <option value="viewer">Görüntüleyici</option>
          </select>
          <button
            disabled={inviting || !inviteEmail}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
          >
            <Plus size={20} />
            Davet Gönder
          </button>
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
                    Üye
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Katılma Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Henüz ekip üyesi yok. İlk üyeyi davet ederek başlayın.
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {(member.user as any)?.email || 'Bilinmeyen'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            roleColors[member.role]
                          }`}
                        >
                          {roleLabels[member.role]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {member.is_active ? (
                          <span className="text-green-600 font-medium">Aktif</span>
                        ) : (
                          <span className="text-gray-500">Pasif</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(member.joined_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-red-600 hover:text-red-700 transition">
                          <UserX size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Shield size={20} />
          Rol İzinleri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Yönetici</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Tüm yetkilere sahip</li>
              <li>• Ekip üyelerini yönetebilir</li>
              <li>• Faturalandırma erişimi</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Müdür</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Siparişleri yönetebilir</li>
              <li>• Raporları görüntüleyebilir</li>
              <li>• Müşteri yönetimi</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Temsilci</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Müşterilerle iletişim</li>
              <li>• Sipariş görüntüleme</li>
              <li>• Temel işlemler</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Görüntüleyici</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Sadece okuma yetkisi</li>
              <li>• Raporları görüntüleme</li>
              <li>• Değişiklik yapamaz</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
