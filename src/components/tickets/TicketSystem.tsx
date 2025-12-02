import { useEffect, useState } from 'react';
import { Ticket, Plus, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface TicketItem {
  id: string;
  ticket_number: string;
  subject: string;
  status: string;
  priority: string;
  customer: { name: string } | null;
  created_at: string;
}

export function TicketSystem() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadTickets();
  }, [user]);

  const loadTickets = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('tickets')
      .select('*, customer:customers(name)')
      .eq('business_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setTickets(data as any);
    }
    setLoading(false);
  };

  const statusLabels: Record<string, string> = {
    open: 'Açık',
    in_progress: 'İşlemde',
    waiting: 'Bekliyor',
    resolved: 'Çözüldü',
    closed: 'Kapalı',
  };

  const statusColors: Record<string, string> = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    waiting: 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Destek Talepleri</h2>
          <p className="text-gray-600 mt-1">Müşteri sorunlarını takip edin ve çözün</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
          <Plus size={20} />
          Yeni Talep
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Talep no veya konu ile ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="open">Açık</option>
            <option value="in_progress">İşlemde</option>
            <option value="waiting">Bekliyor</option>
            <option value="resolved">Çözüldü</option>
            <option value="closed">Kapalı</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['open', 'in_progress', 'waiting', 'resolved'].map((status) => {
          const count = tickets.filter((t) => t.status === status).length;
          return (
            <div key={status} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-3xl font-bold text-gray-900 mb-1">{count}</div>
              <div className="text-sm text-gray-600">{statusLabels[status]}</div>
            </div>
          );
        })}
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
                    Talep No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Konu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Öncelik
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
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Arama kriterlerine uygun talep bulunamadı'
                        : 'Henüz destek talebi yok'}
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">
                        {ticket.ticket_number}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {ticket.customer?.name || 'Bilinmeyen'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            priorityColors[ticket.priority]
                          }`}
                        >
                          {ticket.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            statusColors[ticket.status]
                          }`}
                        >
                          {statusLabels[ticket.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(ticket.created_at).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
