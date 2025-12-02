import { LayoutDashboard, Users, ShoppingBag, BarChart3, Settings, MessageSquare, LogOut, Bot, Workflow, Ticket, Radio, Download, UserPlus, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard },
    { id: 'orders', label: 'Siparişler', icon: ShoppingBag },
    { id: 'customers', label: 'Müşteriler', icon: Users },
    { id: 'channels', label: 'İletişim Kanalları', icon: Radio },
    { id: 'tickets', label: 'Destek Talepleri', icon: Ticket },
    { id: 'ai', label: 'AI Chatbot', icon: Bot },
    { id: 'workflows', label: 'Otomasyonlar', icon: Workflow },
    { id: 'messages', label: 'Mesaj Şablonları', icon: MessageSquare },
    { id: 'analytics', label: 'Raporlar', icon: BarChart3 },
    { id: 'team', label: 'Ekip Yönetimi', icon: UserPlus },
    { id: 'export', label: 'Dışa Aktarma', icon: Download },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className={`
        w-64 bg-white border-r border-gray-200 flex flex-col h-screen
        fixed md:relative z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">SiparişAsistanım</h1>
        <p className="text-sm text-gray-600 mt-1">Otomasyon Platformu</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut size={20} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
    </>
  );
}
