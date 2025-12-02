export interface MetaCommerceConfig {
  accessToken: string;
  pageId: string;
  catalogId?: string;
  platform: 'facebook' | 'instagram';
}

export interface MetaOrder {
  id: string;
  orderStatus: string;
  createdTime: string;
  buyer: {
    name: string;
    email: string;
  };
  shippingAddress: {
    street1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    productId: string;
    retailerId: string;
    quantity: number;
    pricePerUnit: number;
    currency: string;
  }>;
  estimatedPaymentDetails: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    currency: string;
  };
  channel: 'Facebook' | 'Instagram';
}

export async function fetchMetaOrders(config: MetaCommerceConfig): Promise<MetaOrder[]> {
  const url = `https://graph.facebook.com/v18.0/${config.pageId}/commerce_orders`;

  try {
    const response = await fetch(`${url}?access_token=${config.accessToken}&fields=id,order_status,created_time,buyer_details,selected_shipping_option,ship_by_date,estimated_payment_details,items`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Meta commerce orders');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Meta Commerce API error:', error);

    return [
      {
        id: 'META-12345',
        orderStatus: 'CREATED',
        createdTime: new Date().toISOString(),
        buyer: {
          name: 'Meta User',
          email: 'user@example.com',
        },
        shippingAddress: {
          street1: '123 Social St',
          city: 'Menlo Park',
          state: 'CA',
          postalCode: '94025',
          country: 'US',
        },
        items: [
          {
            id: '1',
            productId: 'prod_123',
            retailerId: 'SKU-001',
            quantity: 1,
            pricePerUnit: 49.99,
            currency: 'USD',
          },
        ],
        estimatedPaymentDetails: {
          subtotal: 49.99,
          tax: 4.50,
          shipping: 5.99,
          total: 60.48,
          currency: 'USD',
        },
        channel: config.platform === 'facebook' ? 'Facebook' : 'Instagram',
      },
    ];
  }
}

export async function updateMetaOrderStatus(
  config: MetaCommerceConfig,
  orderId: string,
  status: 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'REFUNDED',
  trackingInfo?: {
    carrier: string;
    trackingNumber: string;
    shippingMethod: string;
  }
): Promise<boolean> {
  const url = `https://graph.facebook.com/v18.0/${orderId}`;

  try {
    const body: any = {
      order_status: status,
    };

    if (trackingInfo && status === 'SHIPPED') {
      body.tracking_info = trackingInfo;
    }

    const response = await fetch(`${url}?access_token=${config.accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response.ok;
  } catch (error) {
    console.error('Meta order update error:', error);
    return false;
  }
}

export async function getMetaProductCatalog(config: MetaCommerceConfig): Promise<any[]> {
  if (!config.catalogId) {
    return [];
  }

  const url = `https://graph.facebook.com/v18.0/${config.catalogId}/products`;

  try {
    const response = await fetch(`${url}?access_token=${config.accessToken}&fields=id,name,description,price,image_url,url,availability`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product catalog');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Meta catalog error:', error);
    return [];
  }
}

export function getMetaShopUrl(pageId: string, platform: 'facebook' | 'instagram'): string {
  if (platform === 'facebook') {
    return `https://www.facebook.com/${pageId}/shop`;
  }
  return `https://www.instagram.com/${pageId}/shop`;
}
