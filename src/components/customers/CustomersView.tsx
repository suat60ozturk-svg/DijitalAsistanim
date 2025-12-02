import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CustomerModal } from './CustomerModal';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

export function CustomersView() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, [user]);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm]);

  const loadCustomers = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setCustomers(data);
    }
    setLoading(false);
  };

  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCustomers(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Müşteriler</h2>
          <p className="text-gray-600 mt-1">Müşteri veritabanınızı yönetin</p>
        </div>
        <button
          onClick={() => {
            setSelectedCustomer(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          Yeni Müşteri
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Ad, telefon veya e-posta ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sipariş Sayısı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Toplam Harcama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kayıt Tarihi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      {searchTerm
                        ? 'Arama kriterlerine uygun müşteri bulunamadı'
                        : 'Henüz müşteri bulunmuyor. Yeni müşteri ekleyerek başlayın.'}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowModal(true);
                      }}
                      className="hover:bg-gray-50 cursor-pointer transition"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{customer.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{customer.phone}</div>
                        {customer.email && (
                          <div className="text-xs text-gray-500">{customer.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {customer.total_orders} sipariş
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₺{customer.total_spent.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(customer.created_at).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => {
            setShowModal(false);
            setSelectedCustomer(null);
          }}
          onSave={() => {
            loadCustomers();
            setShowModal(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
}
