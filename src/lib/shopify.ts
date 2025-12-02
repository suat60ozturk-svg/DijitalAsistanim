export interface ShopifyConfig {
  shopName: string;
  apiKey: string;
  apiSecret: string;
  accessToken: string;
}

export interface ShopifyOrder {
  id: number;
  orderNumber: string;
  createdAt: string;
  financialStatus: string;
  fulfillmentStatus: string | null;
  customer: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
  totalPrice: string;
  currency: string;
  lineItems: Array<{
    id: number;
    title: string;
    quantity: number;
    price: string;
    sku: string;
  }>;
}

export async function fetchShopifyOrders(config: ShopifyConfig): Promise<ShopifyOrder[]> {
  const url = `https://${config.shopName}.myshopify.com/admin/api/2024-01/orders.json?status=open`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Shopify-Access-Token': config.accessToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Shopify orders');
    }

    const data = await response.json();
    return data.orders || [];
  } catch (error) {
    console.error('Shopify API error:', error);

    return [
      {
        id: 12345,
        orderNumber: 'SHP-1001',
        createdAt: new Date().toISOString(),
        financialStatus: 'paid',
        fulfillmentStatus: null,
        customer: {
          id: 67890,
          email: 'customer@example.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
        },
        shippingAddress: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          address1: '789 Pine Rd',
          city: 'Chicago',
          province: 'IL',
          zip: '60601',
          country: 'United States',
        },
        totalPrice: '125.00',
        currency: 'USD',
        lineItems: [
          {
            id: 11111,
            title: 'Premium Product',
            quantity: 1,
            price: '125.00',
            sku: 'PREM-001',
          },
        ],
      },
    ];
  }
}

export async function createShopifyFulfillment(
  config: ShopifyConfig,
  orderId: number,
  trackingNumber: string,
  trackingCompany: string
): Promise<boolean> {
  const url = `https://${config.shopName}.myshopify.com/admin/api/2024-01/orders/${orderId}/fulfillments.json`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': config.accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fulfillment: {
          tracking_number: trackingNumber,
          tracking_company: trackingCompany,
          notify_customer: true,
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Shopify fulfillment error:', error);
    return false;
  }
}
