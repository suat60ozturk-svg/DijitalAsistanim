import { supabase } from './supabase';

export async function createDemoData(workspaceId: string) {
  try {
    const demoCustomers = [
      {
        workspace_id: workspaceId,
        name: 'Ahmet Yılmaz',
        phone: '+90 555 123 4567',
        email: 'ahmet@example.com',
        total_orders: 3,
        total_spent: 1250.00,
        notes: 'Demo müşteri - Sık alışveriş yapıyor',
      },
      {
        workspace_id: workspaceId,
        name: 'Ayşe Demir',
        phone: '+90 555 234 5678',
        email: 'ayse@example.com',
        total_orders: 1,
        total_spent: 450.00,
        notes: 'Demo müşteri',
      },
      {
        workspace_id: workspaceId,
        name: 'Mehmet Kaya',
        phone: '+90 555 345 6789',
        email: 'mehmet@example.com',
        total_orders: 5,
        total_spent: 2100.00,
        notes: 'Demo müşteri - VIP',
      },
    ];

    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .insert(demoCustomers)
      .select();

    if (customerError || !customers) {
      console.error('Demo customers creation failed:', customerError);
      return;
    }

    const demoOrders = [
      {
        workspace_id: workspaceId,
        customer_id: customers[0].id,
        order_number: 'ORD-2024-001',
        status: 'delivered',
        items: [
          { name: 'Beyaz Tişört', quantity: 2, price: 150 },
          { name: 'Mavi Jean', quantity: 1, price: 350 },
        ],
        total_amount: 650.00,
        shipping_address: 'Kadıköy, İstanbul',
        marketplace: 'whatsapp',
        notes: 'Demo sipariş',
      },
      {
        workspace_id: workspaceId,
        customer_id: customers[1].id,
        order_number: 'ORD-2024-002',
        status: 'shipped',
        items: [
          { name: 'Siyah Ayakkabı', quantity: 1, price: 450 },
        ],
        total_amount: 450.00,
        shipping_address: 'Beşiktaş, İstanbul',
        tracking_number: 'TRK123456789',
        marketplace: 'trendyol',
        notes: 'Demo sipariş - Kargoda',
      },
      {
        workspace_id: workspaceId,
        customer_id: customers[2].id,
        order_number: 'ORD-2024-003',
        status: 'pending',
        items: [
          { name: 'Kırmızı Elbise', quantity: 1, price: 550 },
          { name: 'Aksesuar Set', quantity: 1, price: 200 },
        ],
        total_amount: 750.00,
        shipping_address: 'Çankaya, Ankara',
        marketplace: 'whatsapp',
        notes: 'Demo sipariş - Onay bekliyor',
      },
    ];

    await supabase.from('orders').insert(demoOrders);

    const demoTemplates = [
      {
        workspace_id: workspaceId,
        name: 'Sipariş Onay Mesajı',
        type: 'order_confirmation',
        content: `Merhaba {{customer_name}},

Siparişiniz alındı! 🎉

Sipariş No: {{order_number}}
Tutar: {{total_amount}} TL

Kargoya verildiğinde bilgilendirileceksiniz.

Teşekkürler!`,
        is_active: true,
      },
      {
        workspace_id: workspaceId,
        name: 'Kargo Bildirimi',
        type: 'shipping_update',
        content: `Merhaba {{customer_name}},

Siparişiniz kargoya verildi! 📦

Takip No: {{tracking_number}}

Tahmini teslimat: 2-3 iş günü

İyi günler!`,
        is_active: true,
      },
    ];

    await supabase.from('message_templates').insert(demoTemplates);

    console.log('Demo data created successfully');
  } catch (error) {
    console.error('Error creating demo data:', error);
  }
}

export async function shouldCreateDemoData(workspaceId: string): Promise<boolean> {
  const { count } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId);

  return (count || 0) === 0;
}
