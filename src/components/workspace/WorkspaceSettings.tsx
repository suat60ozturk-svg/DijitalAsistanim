import { useState, useEffect } from 'react';
import { Building2, Save, Users, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function WorkspaceSettings() {
  const { workspace } = useAuth();
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    if (workspace) {
      loadWorkspaceData();
      loadTeamMembers();
    }
  }, [workspace]);

  const loadWorkspaceData = async () => {
    if (!workspace) return;

    const { data } = await supabase
      .from('workspaces')
      .select('business_name, phone')
      .eq('id', workspace.id)
      .maybeSingle();

    if (data) {
      setBusinessName(data.business_name || '');
      setPhone(data.phone || '');
    }
  };

  const loadTeamMembers = async () => {
    if (!workspace) return;

    const { data } = await supabase
      .from('team_members')
      .select('*, user_id(email)')
      .eq('workspace_id', workspace.id);

    if (data) {
      setTeamMembers(data);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    const { error: updateError } = await supabase
      .from('workspaces')
      .update({
        business_name: businessName,
        phone: phone,
      })
      .eq('id', workspace.id);

    if (updateError) {
      setError('Ayarlar kaydedilemedi');
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setLoading(false);
  };

  const handleInviteTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace || !inviteEmail) return;

    setError('');

    const { data: userData } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', inviteEmail)
      .maybeSingle();

    if (!userData) {
      setError('Bu e-posta adresine kayıtlı kullanıcı bulunamadı');
      return;
    }

    const { error: inviteError } = await supabase
      .from('team_members')
      .insert({
        workspace_id: workspace.id,
        user_id: userData.id,
        role: 'agent',
      });

    if (inviteError) {
      setError('Davet gönderilemedi');
    } else {
      setInviteEmail('');
      await loadTeamMembers();
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Building2 size={24} />
          İşletme Bilgileri
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İşletme Adı
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefon Numarası
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
              Ayarlar başarıyla kaydedildi
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={20} />
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Users size={24} />
          Ekip Üyeleri
        </h2>

        <form onSubmit={handleInviteTeamMember} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="E-posta adresi"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition flex items-center gap-2"
            >
              <Mail size={20} />
              Davet Gönder
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {teamMembers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Henüz ekip üyesi yok</p>
          ) : (
            teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
              >
                <div>
                  <p className="font-semibold text-gray-900">{member.user_id?.email}</p>
                  <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    member.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {member.is_active ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
