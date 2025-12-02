export interface AmazonConfig {
  sellerId: string;
  mwsAuthToken: string;
  marketplaceId: string;
  region: 'NA' | 'EU' | 'FE';
}

export interface AmazonOrder {
  amazonOrderId: string;
  purchaseDate: string;
  orderStatus: string;
  buyerEmail?: string;
  buyerName?: string;
  shippingAddress: {
    name: string;
    addressLine1: string;
    city: string;
    stateOrRegion: string;
    postalCode: string;
    countryCode: string;
  };
  orderTotal: {
    currencyCode: string;
    amount: string;
  };
  orderItems: Array<{
    asin: string;
    title: string;
    quantityOrdered: number;
    itemPrice: {
      currencyCode: string;
      amount: string;
    };
  }>;
}

export async function fetchAmazonOrders(config: AmazonConfig): Promise<AmazonOrder[]> {
  console.log('Amazon API integration - Development mode');

  return [
    {
      amazonOrderId: 'AMZ-111-2024-001',
      purchaseDate: new Date().toISOString(),
      orderStatus: 'Pending',
      buyerEmail: 'customer@example.com',
      buyerName: 'John Doe',
      shippingAddress: {
        name: 'John Doe',
        addressLine1: '123 Main St',
        city: 'New York',
        stateOrRegion: 'NY',
        postalCode: '10001',
        countryCode: 'US',
      },
      orderTotal: {
        currencyCode: 'USD',
        amount: '99.99',
      },
      orderItems: [
        {
          asin: 'B08N5WRWNW',
          title: 'Sample Product',
          quantityOrdered: 1,
          itemPrice: {
            currencyCode: 'USD',
            amount: '99.99',
          },
        },
      ],
    },
  ];
}

export async function updateAmazonOrderStatus(
  config: AmazonConfig,
  orderId: string,
  trackingNumber: string
): Promise<boolean> {
  console.log('Amazon order update - Development mode', { orderId, trackingNumber });
  return true;
}

export function getMarketplaceId(region: string): string {
  const marketplaceIds: Record<string, string> = {
    US: 'ATVPDKIKX0DER',
    CA: 'A2EUQ1WTGCTBG2',
    MX: 'A1AM78C64UM0Y8',
    UK: 'A1F83G8C2ARO7P',
    DE: 'A1PA6795UKMFR9',
    FR: 'A13V1IB3VIYZZH',
    IT: 'APJ6JRA9NG5V4',
    ES: 'A1RKKUPIHCS9HS',
    JP: 'A1VC38T7YXB528',
    AU: 'A39IBJ37TRP1C6',
    IN: 'A21TJRUUN4KGV',
  };
  return marketplaceIds[region] || marketplaceIds.US;
}
