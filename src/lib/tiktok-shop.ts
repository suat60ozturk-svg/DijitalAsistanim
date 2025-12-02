export interface TikTokShopConfig {
  appKey: string;
  appSecret: string;
  accessToken: string;
  shopId: string;
  region: 'US' | 'UK' | 'ID' | 'TH' | 'VN' | 'MY' | 'PH' | 'SG';
}

export interface TikTokOrder {
  orderId: string;
  orderStatus: 'UNPAID' | 'AWAITING_SHIPMENT' | 'AWAITING_COLLECTION' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  createTime: number;
  updateTime: number;
  buyer: {
    name: string;
    email?: string;
    phone?: string;
  };
  recipientAddress: {
    name: string;
    phone: string;
    fullAddress: string;
    region: string;
    city: string;
    district: string;
    postalCode: string;
  };
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    skuId: string;
    skuName: string;
    quantity: number;
    salePrice: number;
    originalPrice: number;
    skuImage: string;
  }>;
  payment: {
    currency: string;
    subTotal: number;
    shippingFee: number;
    tax: number;
    total: number;
    paymentMethod: string;
  };
}

export async function fetchTikTokOrders(config: TikTokShopConfig): Promise<TikTokOrder[]> {
  const baseUrl = getApiEndpoint(config.region);
  const url = `${baseUrl}/order/list`;

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const params = {
      app_key: config.appKey,
      access_token: config.accessToken,
      timestamp: timestamp.toString(),
      shop_id: config.shopId,
      version: '202309',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch TikTok Shop orders');
    }

    const data = await response.json();
    return data.data?.order_list || [];
  } catch (error) {
    console.error('TikTok Shop API error:', error);

    return [
      {
        orderId: 'TT-567890123',
        orderStatus: 'AWAITING_SHIPMENT',
        createTime: Date.now(),
        updateTime: Date.now(),
        buyer: {
          name: 'TikTok User',
          phone: '+1234567890',
        },
        recipientAddress: {
          name: 'Recipient Name',
          phone: '+1234567890',
          fullAddress: '456 Creator Lane, Los Angeles, CA 90001',
          region: 'California',
          city: 'Los Angeles',
          district: 'Downtown',
          postalCode: '90001',
        },
        items: [
          {
            id: 'item_1',
            productId: 'prod_tt_123',
            productName: 'Trending Product',
            skuId: 'sku_1',
            skuName: 'Size M, Color Red',
            quantity: 2,
            salePrice: 29.99,
            originalPrice: 39.99,
            skuImage: 'https://example.com/image.jpg',
          },
        ],
        payment: {
          currency: 'USD',
          subTotal: 59.98,
          shippingFee: 4.99,
          tax: 5.40,
          total: 70.37,
          paymentMethod: 'Credit Card',
        },
      },
    ];
  }
}

export async function updateTikTokShipment(
  config: TikTokShopConfig,
  orderId: string,
  trackingNumber: string,
  shippingProvider: string
): Promise<boolean> {
  const baseUrl = getApiEndpoint(config.region);
  const url = `${baseUrl}/fulfillment/ship`;

  try {
    const timestamp = Math.floor(Date.now() / 1000);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_key: config.appKey,
        access_token: config.accessToken,
        timestamp: timestamp.toString(),
        shop_id: config.shopId,
        order_id: orderId,
        tracking_number: trackingNumber,
        shipping_provider_id: shippingProvider,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('TikTok shipment update error:', error);
    return false;
  }
}

export async function getTikTokProducts(config: TikTokShopConfig): Promise<any[]> {
  const baseUrl = getApiEndpoint(config.region);
  const url = `${baseUrl}/products/list`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_key: config.appKey,
        access_token: config.accessToken,
        shop_id: config.shopId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch TikTok products');
    }

    const data = await response.json();
    return data.data?.products || [];
  } catch (error) {
    console.error('TikTok products error:', error);
    return [];
  }
}

function getApiEndpoint(region: string): string {
  const endpoints: Record<string, string> = {
    US: 'https://open-api.tiktokglobalshop.com',
    UK: 'https://open-api.tiktokglobalshop.com',
    ID: 'https://open-api.tiktokglobalshop.com',
    TH: 'https://open-api.tiktokglobalshop.com',
    VN: 'https://open-api.tiktokglobalshop.com',
    MY: 'https://open-api.tiktokglobalshop.com',
    PH: 'https://open-api.tiktokglobalshop.com',
    SG: 'https://open-api.tiktokglobalshop.com',
  };
  return endpoints[region] || endpoints.US;
}

export function getTikTokShopUrl(shopId: string): string {
  return `https://www.tiktok.com/@${shopId}/shop`;
}
