import { useState } from 'react';
import { Sidebar } from './dashboard/Sidebar';
import { DashboardOverview } from './dashboard/DashboardOverview';
import { OrdersView } from './orders/OrdersView';
import { CustomersView } from './customers/CustomersView';
import { MessagesView } from './messages/MessagesView';
import { AnalyticsView } from './analytics/AnalyticsView';
import { SettingsView } from './settings/SettingsView';
import { AIChatbot } from './ai/AIChatbot';
import { TeamManagement } from './team/TeamManagement';
import { WorkflowBuilder } from './workflows/WorkflowBuilder';
import { TicketSystem } from './tickets/TicketSystem';
import { MultiChannelHub } from './channels/MultiChannelHub';
import { ExportCenter } from './export/ExportCenter';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'orders':
        return <OrdersView />;
      case 'customers':
        return <CustomersView />;
      case 'channels':
        return <MultiChannelHub />;
      case 'tickets':
        return <TicketSystem />;
      case 'ai':
        return <AIChatbot />;
      case 'workflows':
        return <WorkflowBuilder />;
      case 'messages':
        return <MessagesView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'team':
        return <TeamManagement />;
      case 'export':
        return <ExportCenter />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-8">{renderContent()}</div>
      </main>
    </div>
  );
}
