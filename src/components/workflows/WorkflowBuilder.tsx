import { useState, useEffect } from 'react';
import { Workflow, Plus, Play, Pause } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface WorkflowItem {
  id: string;
  name: string;
  trigger_type: string;
  is_active: boolean;
  execution_count: number;
  last_executed_at: string | null;
}

export function WorkflowBuilder() {
  const { user } = useAuth();
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflows();
  }, [user]);

  const loadWorkflows = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('workflows')
      .select('*')
      .eq('business_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setWorkflows(data);
    }
    setLoading(false);
  };

  const toggleWorkflow = async (workflowId: string, currentState: boolean) => {
    await supabase
      .from('workflows')
      .update({ is_active: !currentState })
      .eq('id', workflowId);

    loadWorkflows();
  };

  const triggerLabels: Record<string, string> = {
    order_created: 'Sipariş Oluşturuldu',
    message_received: 'Mesaj Alındı',
    customer_created: 'Müşteri Eklendi',
    time_based: 'Zamanlı',
    manual: 'Manuel',
  };

  const predefinedWorkflows = [
    {
      name: 'Sipariş Onay Mesajı',
      description: 'Yeni sipariş geldiğinde otomatik onay mesajı gönder',
      trigger: 'order_created',
      actions: ['send_whatsapp', 'update_crm'],
    },
    {
      name: 'Kargo Bildirimi',
      description: 'Sipariş kargoya verildiğinde müşteriye bildir',
      trigger: 'order_created',
      actions: ['send_whatsapp', 'send_email'],
    },
    {
      name: 'Terk Edilmiş Sepet',
      description: 'Sepeti terk eden müşterilere 24 saat sonra hatırlatma',
      trigger: 'time_based',
      actions: ['send_whatsapp', 'offer_discount'],
    },
    {
      name: 'Müşteri Memnuniyeti',
      description: 'Teslimat sonrası 3 gün içinde geri bildirim iste',
      trigger: 'order_created',
      actions: ['send_whatsapp', 'create_survey'],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Otomasyon İş Akışları</h2>
        <p className="text-gray-600 mt-1">
          Tekrarlayan görevleri otomatikleştirin, zamandan tasarruf edin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {predefinedWorkflows.map((workflow, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Workflow className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-xs font-medium text-gray-500 uppercase">
                {triggerLabels[workflow.trigger]}
              </span>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium">
                <Plus size={16} />
                Kullan
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Aktif İş Akışları</h3>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
            <Plus size={20} />
            Yeni İş Akışı
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    İş Akışı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tetikleyici
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Çalıştırma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Son Çalışma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {workflows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Henüz iş akışı yok. Yukarıdaki şablonlardan birini kullanarak başlayın.
                    </td>
                  </tr>
                ) : (
                  workflows.map((workflow) => (
                    <tr key={workflow.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{workflow.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {triggerLabels[workflow.trigger_type]}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {workflow.execution_count} kez
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {workflow.last_executed_at
                          ? new Date(workflow.last_executed_at).toLocaleDateString('tr-TR')
                          : 'Hiç'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleWorkflow(workflow.id, workflow.is_active)}
                          className={`flex items-center gap-2 px-3 py-1 rounded-lg transition ${
                            workflow.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {workflow.is_active ? (
                            <>
                              <Play size={14} />
                              <span className="text-sm font-medium">Aktif</span>
                            </>
                          ) : (
                            <>
                              <Pause size={14} />
                              <span className="text-sm font-medium">Pasif</span>
                            </>
                          )}
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
    </div>
  );
}
