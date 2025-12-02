import { useState } from 'react';
import { Building2, CreditCard, Shield, History, Plug } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Security2FA } from './Security2FA';
import { AuditLogs } from './AuditLogs';
import { APIStatusPanel } from './APIStatusPanel';
import { SubscriptionManager } from '../billing/SubscriptionManager';
import { WorkspaceSettings } from '../workspace/WorkspaceSettings';

export function SettingsView() {
  const { workspace } = useAuth();
  const [activeSection, setActiveSection] = useState('general');

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Workspace yükleniyor...</div>
      </div>
    );
  }

  const sections = [
    { id: 'general', name: 'Genel', icon: Building2 },
    { id: 'api', name: 'API Entegrasyonları', icon: Plug },
    { id: 'subscription', name: 'Abonelik', icon: CreditCard },
    { id: 'security', name: 'Güvenlik', icon: Shield },
    { id: 'audit', name: 'Aktivite Günlüğü', icon: History },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Ayarlar</h2>
        <p className="text-gray-600 mt-1">Hesap ve abonelik ayarlarınızı yönetin</p>
      </div>

      <div className="flex gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{section.name}</span>
            </button>
          );
        })}
      </div>

      {activeSection === 'general' && <WorkspaceSettings />}

      {activeSection === 'subscription' && <SubscriptionManager workspaceId={workspace.id} />}

      {activeSection === 'api' && <APIStatusPanel />}

      {activeSection === 'security' && <Security2FA />}

      {activeSection === 'audit' && <AuditLogs />}
    </div>
  );
}
