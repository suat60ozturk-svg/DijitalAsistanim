import { useState } from 'react';
import { MessageSquare } from 'lucide-react';

export function MessagesView() {
  const templates = [
    {
      name: 'Sipariş Onayı',
      type: 'order_confirmation',
      content:
        'Merhaba {musteri_adi}, siparişiniz alındı! Sipariş No: {siparis_no}. Toplam tutar: {tutar} TL. En kısa sürede kargoya verilecektir.',
    },
    {
      name: 'Kargo Bilgisi',
      type: 'shipping_update',
      content:
        'Merhaba {musteri_adi}, {siparis_no} numaralı siparişiniz kargoya verildi. Takip no: {takip_no}. İyi günler dileriz!',
    },
    {
      name: 'Teslimat Bildirimi',
      type: 'delivery_notification',
      content:
        'Siparişiniz teslim edildi! Bizi tercih ettiğiniz için teşekkür ederiz. Sorularınız için her zaman yanınızdayız.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mesaj Şablonları</h2>
        <p className="text-gray-600 mt-1">Otomatik WhatsApp mesajlarınızı özelleştirin</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <MessageSquare className="text-blue-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Değişkenler</h3>
            <p className="text-sm text-blue-800">
              Mesajlarınızda şu değişkenleri kullanabilirsiniz: <code className="bg-blue-100 px-2 py-1 rounded">{'{musteri_adi}'}</code>,{' '}
              <code className="bg-blue-100 px-2 py-1 rounded">{'{siparis_no}'}</code>,{' '}
              <code className="bg-blue-100 px-2 py-1 rounded">{'{tutar}'}</code>,{' '}
              <code className="bg-blue-100 px-2 py-1 rounded">{'{takip_no}'}</code>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {templates.map((template, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{template.name}</h3>
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Aktif
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{template.content}</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium">
                Düzenle
              </button>
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm font-medium">
                Test Mesajı Gönder
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition font-medium">
        + Yeni Şablon Ekle
      </button>
    </div>
  );
}
