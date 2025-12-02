import { useState, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function ExportCenter() {
  const { user } = useAuth();
  const [exports, setExports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExports();
  }, [user]);

  const loadExports = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('export_jobs')
      .select('*')
      .eq('business_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setExports(data);
    }
    setLoading(false);
  };

  const createExport = async (type: string, format: string) => {
    if (!user) return;

    await supabase.from('export_jobs').insert({
      business_id: user.id,
      export_type: type,
      format: format,
      status: 'pending',
      created_by: user.id,
    });

    loadExports();
  };

  const exportOptions = [
    {
      type: 'customers',
      name: 'Müşteriler',
      description: 'Müşteri listesi ve iletişim bilgileri',
      icon: FileSpreadsheet,
      color: 'bg-green-50 text-green-600',
    },
    {
      type: 'orders',
      name: 'Siparişler',
      description: 'Tüm sipariş kayıtları ve detayları',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      type: 'analytics',
      name: 'Analitik Rapor',
      description: 'Satış ve performans raporları',
      icon: File,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      type: 'conversations',
      name: 'Konuşmalar',
      description: 'Müşteri iletişim geçmişi',
      icon: FileText,
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  const statusLabels: Record<string, string> = {
    pending: 'Bekliyor',
    processing: 'İşleniyor',
    completed: 'Tamamlandı',
    failed: 'Başarısız',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Veri Dışa Aktarma</h2>
        <p className="text-gray-600 mt-1">
          Verilerinizi CSV, Excel veya PDF formatında indirin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.type}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className={`p-3 rounded-lg ${option.color} inline-block mb-4`}>
                <Icon size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{option.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{option.description}</p>
              <div className="space-y-2">
                <button
                  onClick={() => createExport(option.type, 'csv')}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center justify-between"
                >
                  <span>CSV</span>
                  <Download size={16} />
                </button>
                <button
                  onClick={() => createExport(option.type, 'excel')}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center justify-between"
                >
                  <span>Excel</span>
                  <Download size={16} />
                </button>
                <button
                  onClick={() => createExport(option.type, 'pdf')}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition flex items-center justify-between"
                >
                  <span>PDF</span>
                  <Download size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Son Dışa Aktarmalar</h3>
        </div>
        {loading ? (
          <div className="p-12 text-center text-gray-500">Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tür
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Henüz dışa aktarma yapılmadı
                    </td>
                  </tr>
                ) : (
                  exports.map((exp) => (
                    <tr key={exp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 capitalize">
                        {exp.export_type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 uppercase">
                        {exp.format}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            statusColors[exp.status]
                          }`}
                        >
                          {statusLabels[exp.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(exp.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4">
                        {exp.status === 'completed' && exp.file_url ? (
                          <a
                            href={exp.file_url}
                            download
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            İndir
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
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
